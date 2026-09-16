package chapter

import (
	"backend/internal/apis"
	"backend/internal/apperr"
	"errors"
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

func (h *Handler) listChaptersHandler(e *core.RequestEvent) error {
	courseId := e.Request.PathValue("courseId")

	response, err := h.service.listChapters(courseId)
	if err != nil {
		return apis.MapError(err)
	}
	return e.JSON(http.StatusOK, response)
}

func (h *Handler) getChapterHandler(e *core.RequestEvent) error {
	chapterId := e.Request.PathValue("chapterId")

	response, err := h.service.getChapter(chapterId)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) createChapterHandler(e *core.RequestEvent) error {
	var req CreateChapterRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	courseId := e.Request.PathValue("courseId")
	userId := e.Auth.Id

	validationErrors := make(map[string]error)
	if req.Title == "" {
		validationErrors["title"] = errors.New("title is required")
	}

	if len(validationErrors) > 0 {
		return apis.MapError(
			apperr.FromValidationErrors(validationErrors),
		)
	}

	response, err := h.service.createChapter(courseId, userId, req)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusCreated, response)
}

func (h *Handler) updateChapterHandler(e *core.RequestEvent) error {
	var req UpdateChapterRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	userId := e.Auth.Id
	chapterId := e.Request.PathValue("chapterId")

	response, err := h.service.updateChapter(chapterId, userId, req)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) deleteChapterHandler(e *core.RequestEvent) error {
	userId := e.Auth.Id
	chapterId := e.Request.PathValue("chapterId")

	if err := h.service.deleteChapter(chapterId, userId); err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "chapter deleted successfully",
	})
}
