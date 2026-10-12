package auth

import (
	"backend/internal/apperr"
	"database/sql"
	"errors"
	"fmt"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/mails"
	"github.com/pocketbase/pocketbase/tools/routine"
	"github.com/pocketbase/pocketbase/tools/security"
)

type Service struct {
	app core.App
	cfg Config
}

func NewService(app core.App, cfg Config) *Service {
	return &Service{
		app: app,
		cfg: cfg,
	}
}

func (s *Service) isEmailAuthEnabled() bool {
	return s.cfg.EmailAuthEnabled()
}

func (s *Service) authenticateMe(record *core.Record) UserProfileResponse {
	response := UserProfileResponse{
		UserId:   record.Id,
		Username: record.GetString("name"),
		Email:    record.GetString("email"),
		Verified: record.GetBool("verified"),
		Avatar:   record.GetString("avatar"),
	}
	return response
}

func (s *Service) registerUser(req RegisterRequest) (RegisterResponse, error) {
	record, err := s.app.FindAuthRecordByEmail("users", req.Email)

	if err == nil { //user exists
		if !s.cfg.EmailAuthEnabled() { //return error
			return RegisterResponse{}, apperr.FromValidationErrors(map[string]error{
				"email": errors.New("email is already registered"),
			})
		}

		// mode == "email"
		if record.Verified() { //already verified - return error
			return RegisterResponse{}, apperr.FromValidationErrors(map[string]error{
				"email": errors.New("email is already registered"),
			})
		}

		// Unverified account: the latest signup wins.
		record.Set("name", req.Username)
		record.SetPassword(req.Password)
		record.RefreshTokenKey() //invalidate any prev link issued

		if err := s.app.Save(record); err != nil {
			return RegisterResponse{}, mapSaveError(err)
		}

		return s.sendVerification(record), nil
	}

	//new user registration

	if !errors.Is(err, sql.ErrNoRows) {
		s.app.Logger().Error(
			"failed to look up user record",
			"email", req.Email,
			"error", err,
		)
		return RegisterResponse{}, err
	}

	collection, err := s.app.FindCollectionByNameOrId("users")
	if err != nil {
		return RegisterResponse{}, err
	}

	record = core.NewRecord(collection)
	record.Set("name", req.Username)
	record.Set("email", req.Email)
	record.SetPassword(req.Password)

	if !s.cfg.EmailAuthEnabled() {
		record.SetVerified(true)
	}

	if err := s.app.Save(record); err != nil {
		return RegisterResponse{}, mapSaveError(err)
	}

	if !s.cfg.EmailAuthEnabled() {
		return RegisterResponse{
			UserId:           record.Id,
			VerificationSent: false,
		}, nil
	}

	return s.sendVerification(record), nil
}

func (s *Service) resendVerification(email string) {
	record, err := s.app.FindAuthRecordByEmail("users", email)
	if err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			s.app.Logger().Error(
				"failed to look up user for verification resend",
				"error", err,
			)
		}
		return
	}

	if record.Verified() {
		return
	}

	// Background send keeps response time the same whether or not the email exists.
	routine.FireAndForget(func() {
		s.sendVerification(record)
	})
}

func (s *Service) verifyUser(req VerifyRequest) error {
	record, err := s.app.FindAuthRecordByToken(req.Token, core.TokenTypeVerification)
	if err != nil {
		s.app.Logger().Error(
			"invalid or expired verification token",
			"error", err,
		)
		return fmt.Errorf("%w: %w", apperr.ErrInvalidToken, err)
	}

	if record.Verified() {
		return nil
	}

	record.SetVerified(true)
	if err := s.app.Save(record); err != nil {
		s.app.Logger().Error(
			"failed to set verification status",
			"userId", record.Id,
			"email", record.Email,
			"error", err,
		)
		return err
	}

	return nil
}

func (s *Service) authenticate(req LoginRequest) (*core.Record, error) {
	record, err := s.app.FindAuthRecordByEmail("users", req.Identity)
	if err != nil {
		record, err = s.app.FindFirstRecordByData("users", "name", req.Identity)
		if err != nil {
			return nil, apis.NewBadRequestError("invalid login credentials", err)
		}
	}

	if !record.ValidatePassword(req.Password) {
		return nil, apis.NewBadRequestError("invalid login credentials", nil)
	}

	if !record.Verified() {
		return nil, apis.NewForbiddenError("please verify your email before logging", nil)
	}

	return record, nil
}

func (s *Service) sendPasswordResetEmail(req ForgotPasswordRequest) {
	record, err := s.app.FindAuthRecordByEmail("users", req.Email)
	if err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			s.app.Logger().Error("failed to look up user for password reset", "error", err)
		}
		return
	}

	if err := mails.SendRecordPasswordReset(s.app, record); err != nil {
		s.app.Logger().Error(
			"failed to send password reset link over email",
			"userId", record.Id,
			"email", record.Email,
			"error", err,
		)
		return
	}
}

func (s *Service) resetPassword(req ResetPasswordRequest) error {
	record, err := s.app.FindAuthRecordByToken(req.Token, core.TokenTypePasswordReset)
	if err != nil {
		return apperr.ErrInvalidToken
	}

	claims, err := security.ParseUnverifiedJWT(req.Token)
	if err != nil {
		return apperr.ErrInvalidToken
	}

	if tokenEmail, _ := claims["email"].(string); tokenEmail != record.Email() {
		return apperr.ErrInvalidToken
	}

	record.SetPassword(req.NewPassword)
	record.SetVerified(true)
	record.RefreshTokenKey()

	if err := s.app.Save(record); err != nil {
		s.app.Logger().Error(
			"failed to save new password",
			"userId", record.Id,
			"error", err,
		)
		return err
	}
	return nil
}
