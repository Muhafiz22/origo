package video

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.Router[*core.RequestEvent], h *Handler) {

	r.POST("chapters/{chapterId}/videos", h.createVideoHandler).Bind(apis.RequireAuth("users"))
	r.PATCH("videos/{videoId}", h.updateVideoHandler).Bind(apis.RequireAuth("users"))

	r.GET("videos/{videoId}", h.getVideoMetadataHandler)
	r.GET("videos/{videoId}/content", h.getVideoContentHandler).Bind(apis.RequireAuth("users"))

	r.DELETE("videos/{videoId}", h.deleteVideoHandler).Bind(apis.RequireAuth("users"))
}
