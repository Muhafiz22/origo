package note

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

func (h *Handler) createNoteHandler(e *core.RequestEvent) error {
	var req CreateNoteRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	userId := e.Auth.Id
	chapterId := e.Request.PathValue("chapterId")

	validationErrors := make(map[string]error)

	_, noteHeader, err := e.Request.FormFile("note")
	if err != nil {
		validationErrors["note"] = errors.New("note is required")
	}

	if len(validationErrors) > 0 {
		return apis.MapError(
			apperr.FromValidationErrors(validationErrors),
		)
	}

	if err := isValidNoteFile(noteHeader); err != nil {
		return apis.MapError(err)
	}

	noteFile, err := filesystem.NewFileFromMultipart(noteHeader)
	if err != nil {
		return apis.MapError(err)
	}

	response, err := h.service.createNote(userId, chapterId, req, noteFile)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusCreated, response)
}

func (h *Handler) getNoteMetadataHandler(e *core.RequestEvent) error {
	noteId := e.Request.PathValue("noteId")

	response, err := h.service.getNoteMetadata(noteId)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, response)
}

func (h *Handler) getNoteContentHandler(e *core.RequestEvent) error {
	noteId := e.Request.PathValue("noteId")

	noteRecord, err := h.service.getNoteForContent(noteId)
	if err != nil {
		return apis.MapError(err)
	}

	fsys, err := h.service.Filesystem()
	if err != nil {
		return apis.MapError(err)
	}
	defer fsys.Close()

	filename := noteRecord.GetString("note")
	filePath := noteRecord.BaseFilesPath() + "/" + filename

	return fsys.Serve(
		e.Response,
		e.Request,
		filePath,
		filename,
	)
}

func (h *Handler) updateNoteHandler(e *core.RequestEvent) error {
	var req UpdateNoteRequest
	if err := e.BindBody(&req); err != nil {
		return apis.MapError(err)
	}

	userId := e.Auth.Id
	noteId := e.Request.PathValue("noteId")

	if err := h.service.updateNote(userId, noteId, req); err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "note updated successfully",
	})
}

func (h *Handler) deleteNoteHandler(e *core.RequestEvent) error {
	userId := e.Auth.Id
	noteId := e.Request.PathValue("noteId")

	if err := h.service.deleteNote(userId, noteId); err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "note deleted successfully",
	})
}

func (h *Handler) getChapterNotesHandler(e *core.RequestEvent) error {
	chapterId := e.Request.PathValue("chapterId")

	response, err := h.service.getChapterNotes(chapterId)
	if err != nil {
		return apis.MapError(err)
	}

	return e.JSON(http.StatusOK, response)
}
