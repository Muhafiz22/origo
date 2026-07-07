package user

import (
	"net/http"

	"github.com/pocketbase/pocketbase/apis"
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

func (h *Handler) registerHandler(e *core.RequestEvent) error {
	var req RegisterRequest

	if err := e.BindBody(&req); err != nil {
		return err
	}

	if req.Username == "" {
		return apis.NewBadRequestError("username is required", nil)
	}

	if req.Email == "" {
		return apis.NewBadRequestError("email is required", nil)
	}

	if req.Password == "" {
		return apis.NewBadRequestError("password is required", nil)
	}

	if len(req.Password) < 8 {
		return apis.NewBadRequestError("password must be of atleast 8 characters", nil)
	}

	result, err := h.service.registerUser(req)

	if err != nil {
		return err
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
		return err
	}

	if req.Email == "" {
		return apis.NewBadRequestError("email is required", nil)
	}

	if err := h.service.resendVerification(req); err != nil {
		return err
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "if the email is registered, a verification link has been sent",
	})
}

func (h *Handler) verifyHandler(e *core.RequestEvent) error {
	var req VerifyRequest

	if err := e.BindBody(&req); err != nil {
		return err
	}

	if req.Token == "" {
		return apis.NewBadRequestError("token is required", nil)
	}

	if err := h.service.verifyUser(req); err != nil {
		return err
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "user verification successful",
	})
}

func (h *Handler) loginHandler(e *core.RequestEvent) error {
	var req LoginRequest
	if err := e.BindBody(&req); err != nil {
		return err
	}

	if req.Identity == "" || req.Password == "" {
		return apis.NewBadRequestError("identity and password are required", nil)
	}

	record, err := h.service.authenticate(req)
	if err != nil {
		return err
	}

	return apis.RecordAuthResponse(e, record, "password", nil)
}

func (h *Handler) forgotPasswordHandler(e *core.RequestEvent) error {
	var req ForgotPasswordRequest
	if err := e.BindBody(&req); err != nil {
		return err
	}

	if req.Email == "" {
		return apis.NewBadRequestError("email is required", nil)
	}

	if err := h.service.sendPasswordResetEmail(req); err != nil {
		return err
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "if the email is registered, a password reset link has been sent",
	})
}

func (h *Handler) resetPasswordHandler(e *core.RequestEvent) error {
	var req ResetPasswordRequest
	if err := e.BindBody(&req); err != nil {
		return err
	}

	if req.Token == "" || req.NewPassword == "" {
		return apis.NewBadRequestError("invalid input", nil)
	}

	if len(req.NewPassword) < 8 {
		return apis.NewBadRequestError("password must be of atleast 8 characters", nil)
	}

	if err := h.service.resetPassword(req); err != nil {
		return err
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "password reset successful",
	})
}
