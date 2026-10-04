package video

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.Router[*core.RequestEvent], h *Handler) {
	chapters := r.Group("/chapters")
	videos := r.Group("/videos")

	chapters.POST("/{chapterId}/videos", h.createVideoHandler).Bind(apis.RequireAuth("users"))
	chapters.GET("/{chapterId}/videos", h.getChapterVideosHandler)

	videos.GET("/{videoId}", h.getVideoMetadataHandler)
	videos.PATCH("/{videoId}", h.updateVideoHandler).Bind(apis.RequireAuth("users"))
	videos.DELETE("/{videoId}", h.deleteVideoHandler).Bind(apis.RequireAuth("users"))
	videos.GET("/{videoId}/content", h.getVideoContentHandler).Bind(apis.RequireAuth("users"))
}
