package chapter

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.Router[*core.RequestEvent], h *Handler) {
	courses := r.Group("/courses")
	chapters := r.Group("/chapters")

	courses.GET("/{courseId}/chapters", h.listChaptersHandler)
	chapters.GET("/{chapterId}", h.getChapterHandler)

	courses.POST("/{courseId}/chapters", h.createChapterHandler).Bind(apis.RequireAuth("users"))
	chapters.PATCH("/{chapterId}", h.updateChapterHandler).Bind(apis.RequireAuth("users"))
	chapters.DELETE("/{chapterId}", h.deleteChapterHandler).Bind(apis.RequireAuth("users"))
}
