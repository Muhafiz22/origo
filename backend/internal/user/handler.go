package user

import (
	"backend/internal/apis"
	"backend/internal/apperr"
	"errors"
	"net/http"
	"strings"

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

func (h *Handler) getUserProfileHandler(e *core.RequestEvent) error {
	record := e.Auth
	response := h.service.getUserProfile(record)

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) updateUserProfileHandler(e *core.RequestEvent) error {
	record := e.Auth

	var req UpdateUserProfileRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	validationErrors := make(map[string]error)

	if req.Name != nil && strings.TrimSpace(*req.Name) == "" {
		validationErrors["name"] = errors.New("name cannot be empty")
	}
	if req.Bio != nil && strings.TrimSpace(*req.Bio) == "" {
		validationErrors["name"] = errors.New("bio cannot be empty")
	}

	if len(validationErrors) > 0 {
		return apis.MapError(
			apperr.FromValidationErrors(validationErrors),
		)
	}

	if err := h.service.updateUserProfile(record, req); err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "user profile updated successfully",
	})
}
