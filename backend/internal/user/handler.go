package user

import (
	"net/http"

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
		return err
	}

	if err := h.service.updateUserProfile(record, req); err != nil {
		return err
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "user profile updated successfully",
	})
}
