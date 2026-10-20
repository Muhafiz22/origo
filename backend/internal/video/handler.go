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

	if len(validationErrors) > 0 {
		return apis.MapError(
			apperr.FromValidationErrors(validationErrors),
		)
	}

	if err := isValidVideoFile(videoHeader); err != nil {
		return apis.MapError(err)
	}

	videoFile, err := filesystem.NewFileFromMultipart(videoHeader)
	if err != nil {
		return apis.MapError(err)
	}

	var thumbnailFile *filesystem.File
	if thumbnailHeader != nil {
		if err := isValidThumbnailFile(thumbnailHeader); err != nil {
			return apis.MapError(err)
		}

		thumbnailFile, err = filesystem.NewFileFromMultipart(thumbnailHeader)
		if err != nil {
			return apis.MapError(err)
		}
	}

	response, err := h.service.createVideo(chapterId, userId, req, videoFile, thumbnailFile)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusCreated, response)
}

func (h *Handler) getVideoMetadataHandler(e *core.RequestEvent) error {
	videoId := e.Request.PathValue("videoId")
	response, err := h.service.getVideoMetadata(videoId)
	if err != nil {
		return apis.MapError(err)
	}
	return e.JSON(http.StatusOK, response)
}

func (h *Handler) getVideoContentHandler(e *core.RequestEvent) error {
	videoId := e.Request.PathValue("videoId")

	videoRecord, err := h.service.getVideoForContent(videoId)
	if err != nil {
		return apis.MapError(err)
	}

	fsys, err := h.service.Filesystem()
	if err != nil {
		return apis.MapError(err)
	}
	defer fsys.Close()

	filename := videoRecord.GetString("video")
	filePath := videoRecord.BaseFilesPath() + "/" + filename

	e.Response.Header().Set("Cache-Control", "private, no-store")
	return fsys.Serve(
		e.Response,
		e.Request,
		filePath,
		filename,
	)
}

func (h *Handler) updateVideoHandler(e *core.RequestEvent) error {
	var req UpdateVideoRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	userId := e.Auth.Id
	videoId := e.Request.PathValue("videoId")

	var videoFile *filesystem.File
	var thumbnailFile *filesystem.File

	_, videoHeader, err := e.Request.FormFile("video")
	if err == nil {
		if err := isValidVideoFile(videoHeader); err != nil {
			return apis.MapError(err)
		}

		videoFile, err = filesystem.NewFileFromMultipart(videoHeader)
		if err != nil {
			return apis.MapError(err)
		}
	}

	_, thumbnailHeader, err := e.Request.FormFile("thumbnail")
	if err == nil {
		if err := isValidThumbnailFile(thumbnailHeader); err != nil {
			return apis.MapError(err)
		}

		thumbnailFile, err = filesystem.NewFileFromMultipart(thumbnailHeader)
		if err != nil {
			return apis.MapError(err)
		}
	}

	response, err := h.service.updateVideo(userId, videoId, req, videoFile, thumbnailFile)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) deleteVideoHandler(e *core.RequestEvent) error {
	userId := e.Auth.Id
	videoId := e.Request.PathValue("videoId")

	if err := h.service.deleteVideo(userId, videoId); err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "video deleted successfully",
	})
}

func (h *Handler) getChapterVideosHandler(e *core.RequestEvent) error {
	chapterId := e.Request.PathValue("chapterId")

	response, err := h.service.getChapterVideos(chapterId)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) markVideoDoneHandler(e *core.RequestEvent) error {
	userId := e.Auth.Id
	videoId := e.Request.PathValue("videoId")

	if err := h.service.markVideoDone(userId, videoId); err != nil {
		return apis.MapError(err)
	}

	return e.NoContent(http.StatusNoContent)

}

func (h *Handler) unmarkVideoDoneHandler(e *core.RequestEvent) error {
	userId := e.Auth.Id
	videoId := e.Request.PathValue("videoId")

	if err := h.service.unmarkVideoDone(userId, videoId); err != nil {
		return apis.MapError(err)
	}

	return e.NoContent(http.StatusNoContent)
}
