package course

import (
	"net/http"
	"strings"

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

func (h *Handler) createCourseHandler(e *core.RequestEvent) error {
	user := e.Auth

	var req CreateCourseRequest
	if err := e.BindBody(&req); err != nil {
		return apis.NewBadRequestError("invalid request body", err)
	}

	if strings.TrimSpace(req.Name) == "" || strings.TrimSpace(req.Description) == "" {
		return apis.NewBadRequestError("name or description cannot be empty", nil)
	}

	response, err := h.service.createCourse(user, req)
	if err != nil {
		return err
	}

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) listCoursesHandler(e *core.RequestEvent) error {
	responses, err := h.service.listCourses()
	if err != nil {
		return err
	}
	return e.JSON(http.StatusOK, responses)
}

func (h *Handler) getCourseHandler(e *core.RequestEvent) error {
	id := e.Request.PathValue("id")

	if id == "" {
		return e.JSON(http.StatusBadRequest, "bad request")
	}

	response, err := h.service.getCourse(id)
	if err != nil {
		return err
	}

	return e.JSON(http.StatusOK, response)
}
