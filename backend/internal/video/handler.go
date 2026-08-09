package video

import (
	"backend/internal/apis"
	"backend/internal/apperr"
	"errors"
	"net/http"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) createVideoHandler(e *core.RequestEvent) error {
	userId := e.Auth.Id
	chapterId := e.Request.PathValue("chapterId")

	var req CreateVideoRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	validationErrors := make(map[string]error)

	_, videoHeader, err := e.Request.FormFile("video")
	if err != nil {
		validationErrors["video"] = errors.New("video is required")
	}

	_, thumbnailHeader, err := e.Request.FormFile("thumbnail")
	if err != nil {
		validationErrors["thumbnail"] = errors.New("thumbnail is required")
	}

	if len(validationErrors) > 0 {
		return apis.MapError(
			apperr.FromValidationErrors(validationErrors),
		)
	}

	if err := isValidVideoFile(videoHeader); err != nil {
		return apis.MapError(err)
	}

	if err := isValidThumbnailFile(thumbnailHeader); err != nil {
		return apis.MapError(err)
	}

	videoFile, err := filesystem.NewFileFromMultipart(videoHeader)
	if err != nil {
		return apis.MapError(err)
	}

	thumbnailFile, err := filesystem.NewFileFromMultipart(thumbnailHeader)
	if err != nil {
		return apis.MapError(err)
	}

	response, err := h.service.createVideo(chapterId, userId, req, videoFile, thumbnailFile)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusCreated, response)
}

func (h *Handler) updateVideoHandler(e *core.RequestEvent) error {
	return nil
}

func (h *Handler) getVideoMetadataHandler(e *core.RequestEvent) error {
	return nil
}

func (h *Handler) getVideoContentHandler(e *core.RequestEvent) error {
	return nil
}

func (h *Handler) deleteVideoHandler(e *core.RequestEvent) error {
	return nil
}
