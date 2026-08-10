package note

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.Router[*core.RequestEvent], h *Handler) {
	r.POST("chapters/{chapterId}/notes", h.createNoteHandler).Bind(apis.RequireAuth("users"))

	r.PATCH("notes/{noteId}", h.updateNoteHandler).Bind(apis.RequireAuth("users"))

	r.DELETE("notes/{noteId}", h.deleteNoteHandler).Bind(apis.RequireAuth("users"))

	r.GET("notes/{noteId}", h.getNoteMetadataHandler)
	r.GET("notes/{noteId}/content", h.getNoteContentHandler).Bind(apis.RequireAuth("users"))
}
