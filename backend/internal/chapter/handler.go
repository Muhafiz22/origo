package chapter

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

func (h *Handler) listChaptersHandler(e *core.RequestEvent) error {
	courseId := e.Request.PathValue("courseId")

	response, err := h.service.listChapters(courseId)
	if err != nil {
		return err
	}
	return e.JSON(http.StatusOK, response)
}

func (h *Handler) getChapterHandler(e *core.RequestEvent) error {
	chapterId := e.Request.PathValue("chapterId")

	response, err := h.service.getChapter(chapterId)
	if err != nil {
		return err
	}

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) createChapterHandler(e *core.RequestEvent) error {
	var req CreateChapterRequest
	if err := e.BindBody(&req); err != nil {
		return apis.NewBadRequestError("bad request", nil)
	}

	courseId := e.Request.PathValue("courseId")
	userId := e.Auth.Id

	if req.Title == "" || req.OrderIndex < 1 {
		return apis.NewBadRequestError("invalid title or index", nil)
	}

	response, err := h.service.createChapter(courseId, userId, req)
	if err != nil {
		return err
	}

	return e.JSON(http.StatusCreated, response)
}

func (h *Handler) updateChapterHandler(e *core.RequestEvent) error {
	var req UpdateChapterRequest
	if err := e.BindBody(&req); err != nil {
		return apis.NewBadRequestError("bad request", nil)
	}

	userId := e.Auth.Id
	chapterId := e.Request.PathValue("chapterId")

	err := h.service.updateChapter(chapterId, userId, req)
	if err != nil {
		return err
	}

	return nil
}

func (h *Handler) deleteChapterHandler(e *core.RequestEvent) error {
	return nil
}
