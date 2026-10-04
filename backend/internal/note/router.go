package note

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.Router[*core.RequestEvent], h *Handler) {
	chapters := r.Group("/chapters")
	notes := r.Group("/notes")

	chapters.POST("/{chapterId}/notes", h.createNoteHandler).Bind(apis.RequireAuth("users"))

	chapters.GET("/{chapterId}/notes", h.getChapterNotesHandler)

	notes.PATCH("/{noteId}", h.updateNoteHandler).Bind(apis.RequireAuth("users"))

	notes.DELETE("/{noteId}", h.deleteNoteHandler).Bind(apis.RequireAuth("users"))

	notes.GET("/{noteId}", h.getNoteMetadataHandler)
	notes.GET("/{noteId}/content", h.getNoteContentHandler).Bind(apis.RequireAuth("users"))
}
