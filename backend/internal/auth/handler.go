package auth

import (
	"backend/internal/apis"
	"backend/internal/apperr"
	"errors"
	"net/http"

	pbApis "github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) authenticateMeHandler(e *core.RequestEvent) error {
	user := e.Auth
	response := h.service.authenticateMe(user)
	return e.JSON(http.StatusOK, response)
}

func (h *Handler) registerHandler(e *core.RequestEvent) error {
	var req RegisterRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	validationErrors := make(map[string]error)
	if req.Username == "" {
		validationErrors["username"] = errors.New("username cannot be empty")
	}
	if req.Email == "" {
		validationErrors["email"] = errors.New("email cannot be empty")
	}
	if req.Password == "" {
		validationErrors["password"] = errors.New("password cannot be empty")
	} else if len(req.Password) < 8 {
		validationErrors["password"] = errors.New("password must be at least 8 characters")
	}
	if len(validationErrors) > 0 {
		return apis.MapError(apperr.FromValidationErrors(validationErrors))
	}

	result, err := h.service.registerUser(req)
	if err != nil {
		return apis.MapError(err)
	}

	resp := RegisterResponse{
		UserId:           result.UserId,
		VerificationSent: result.VerificationSent,
	}
	return e.JSON(http.StatusCreated, resp)
}

func (h *Handler) resendVerificationHandler(e *core.RequestEvent) error {
	var req ResendVerificationRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	validationErrors := make(map[string]error)
	if req.Email == "" {
		validationErrors["email"] = errors.New("email cannot be empty")
	}
	if len(validationErrors) > 0 {
		return apis.MapError(apperr.FromValidationErrors(validationErrors))
	}

	if err := h.service.resendVerification(req); err != nil {
		return apis.MapError(err)
	}
	return e.JSON(http.StatusOK, map[string]string{
		"message": "if the email is registered, a verification link has been sent",
	})
}

func (h *Handler) verifyHandler(e *core.RequestEvent) error {
	var req VerifyRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	validationErrors := make(map[string]error)
	if req.Token == "" {
		validationErrors["token"] = errors.New("invalid token")
	}
	if len(validationErrors) > 0 {
		return apis.MapError(apperr.FromValidationErrors(validationErrors))
	}

	if err := h.service.verifyUser(req); err != nil {
		return apis.MapError(err)
	}
	return e.JSON(http.StatusOK, map[string]string{
		"message": "user verification successful",
	})
}

func (h *Handler) loginHandler(e *core.RequestEvent) error {
	var req LoginRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	validationErrors := make(map[string]error)
	if req.Identity == "" {
		validationErrors["identity"] = errors.New("identity cannot be empty")
	}
	if req.Password == "" {
		validationErrors["password"] = errors.New("password cannot be empty")
	}
	if len(validationErrors) > 0 {
		return apis.MapError(apperr.FromValidationErrors(validationErrors))
	}

	record, err := h.service.authenticate(req)
	if err != nil {
		return apis.MapError(err)
	}

	return pbApis.RecordAuthResponse(e, record, "password", nil)
}

func (h *Handler) forgotPasswordHandler(e *core.RequestEvent) error {
	var req ForgotPasswordRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	validationErrors := make(map[string]error)
	if req.Email == "" {
		validationErrors["email"] = errors.New("email cannot be empty")
	}
	if len(validationErrors) > 0 {
		return apis.MapError(apperr.FromValidationErrors(validationErrors))
	}

	if err := h.service.sendPasswordResetEmail(req); err != nil {
		return apis.MapError(err)
	}
	return e.JSON(http.StatusOK, map[string]string{
		"message": "if the email is registered, a password reset link has been sent",
	})
}

func (h *Handler) resetPasswordHandler(e *core.RequestEvent) error {
	var req ResetPasswordRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	validationErrors := make(map[string]error)
	if req.Token == "" {
		validationErrors["token"] = errors.New("token cannot be empty")
	}
	if req.NewPassword == "" {
		validationErrors["password"] = errors.New("password cannot be empty")
	} else if len(req.NewPassword) < 8 {
		validationErrors["password"] = errors.New("password must be at least 8 characters")
	}
	if len(validationErrors) > 0 {
		return apis.MapError(apperr.FromValidationErrors(validationErrors))
	}

	if err := h.service.resetPassword(req); err != nil {
		return apis.MapError(err)
	}
	return e.JSON(http.StatusOK, map[string]string{
		"message": "password reset successful",
	})
}
