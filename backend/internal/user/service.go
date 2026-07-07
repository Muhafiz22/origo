package user

import (
	"database/sql"
	"errors"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/mails"
)

type Service struct {
	app core.App
}

func NewService(app core.App) *Service {
	return &Service{
		app: app,
	}
}

func (s *Service) registerUser(req RegisterRequest) (RegisterResponse, error) {
	collection, err := s.app.FindCollectionByNameOrId("users")
	if err != nil {
		return RegisterResponse{}, err
	}

	record := core.NewRecord(collection)

	record.Set("name", req.Username)
	record.Set("email", req.Email)
	record.SetPassword(req.Password)

	err = s.app.Save(record)
	if err != nil {
		return RegisterResponse{}, err
	}

	result := RegisterResponse{UserId: record.Id}

	if err := mails.SendRecordVerification(s.app, record); err != nil {
		s.app.Logger().Error(
			"failed to send verification email",
			"userId", record.Id,
			"email", req.Email,
			"error", err,
		)
		return result, nil
	}

	result.VerificationSent = true

	return result, nil
}

func (s *Service) resendVerification(req ResendVerificationRequest) error {
	record, err := s.app.FindAuthRecordByEmail("users", req.Email)
	if err != nil {
		s.app.Logger().Error(
			"verification requested for unknown email",
			"email", req.Email,
		)
		return nil
	}

	if err := mails.SendRecordVerification(s.app, record); err != nil {
		s.app.Logger().Error(
			"failed to send verification email",
			"userId", record.Id,
			"email", req.Email,
			"error", err,
		)
		return err
	}

	return nil
}

func (s *Service) verifyUser(req VerifyRequest) error {
	record, err := s.app.FindAuthRecordByToken(req.Token, core.TokenTypeVerification)
	if err != nil {
		s.app.Logger().Error(
			"invalid or expired token",
			"error", err,
		)
		return err
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

func (s *Service) sendPasswordResetEmail(req ForgotPasswordRequest) error {
	record, err := s.app.FindAuthRecordByEmail("users", req.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil
		}

		s.app.Logger().Error(
			"failed to look up user for password reset",
			"email", req.Email,
			"error", err,
		)
		return err
	}

	if err := mails.SendRecordPasswordReset(s.app, record); err != nil {
		s.app.Logger().Error(
			"failed to send password reset link over email",
			"userId", record.Id,
			"email", record.Email,
			"error", err,
		)
		return err
	}

	return nil
}

func (s *Service) resetPassword(req ResetPasswordRequest) error {
	record, err := s.app.FindAuthRecordByToken(req.Token, core.TokenTypePasswordReset)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return apis.NewBadRequestError("invalid or expired token ", nil)
		}
		s.app.Logger().Error(
			"failed to validate password reset token",
			"error", err,
		)
		return err
	}

	record.SetPassword(req.NewPassword)
	record.RefreshTokenKey()

	err = s.app.Save(record)
	if err != nil {
		s.app.Logger().Error(
			"failed to save new password",
			"userId", record.Id,
			"error", err,
		)
		return apis.NewInternalServerError("password reset failed", nil)
	}
	return nil
}
