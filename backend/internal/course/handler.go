package course

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

func (h *Handler) createCourseHandler(e *core.RequestEvent) error {
	userId := e.Auth.Id

	var req CreateCourseRequest
	if err := e.BindBody(&req); err != nil {
		h.service.app.Logger().Info("BindBody Failed", "error", err)
		return apis.MapError(err)
	}

	validationErrors := make(map[string]error)

	if strings.TrimSpace(req.Name) == "" {
		validationErrors["name"] = errors.New("name is required")
	}

	if strings.TrimSpace(req.Description) == "" {
		validationErrors["description"] = errors.New("description is required")
	}

	if len(validationErrors) > 0 {
		return apis.MapError(apperr.FromValidationErrors(validationErrors))
	}

	response, err := h.service.createCourse(userId, req)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusCreated, response)
}

func (h *Handler) listCoursesHandler(e *core.RequestEvent) error {
	responses, err := h.service.listCourses()
	if err != nil {
		return apis.MapError(err)
	}
	return e.JSON(http.StatusOK, responses)
}

func (h *Handler) getCourseHandler(e *core.RequestEvent) error {
	courseId := e.Request.PathValue("courseId")

	response, err := h.service.getCourse(courseId)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) updateCourseHandler(e *core.RequestEvent) error {
	var req UpdateCourseRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	userId := e.Auth.Id
	courseId := e.Request.PathValue("courseId")

	response, err := h.service.updateCourse(courseId, userId, req)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) deleteCourseHandler(e *core.RequestEvent) error {
	userId := e.Auth.Id
	courseId := e.Request.PathValue("courseId")

	if err := h.service.deleteCourse(courseId, userId); err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "course deleted successfully",
	})
}

func (h *Handler) listMyCoursesHandler(e *core.RequestEvent) error {
	userId := e.Auth.Id

	responses, err := h.service.listMyCourses(userId)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, responses)
}
