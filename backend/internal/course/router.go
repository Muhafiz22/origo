package course

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.Router[*core.RequestEvent], h *Handler) {
	g := r.Group("/courses")

	g.GET("", h.listCoursesHandler)
	g.GET("/{courseId}", h.getCourseHandler)

	g.POST("", h.createCourseHandler).Bind(apis.RequireAuth("users"))
	g.PATCH("/{courseId}", h.updateCourseHandler).Bind(apis.RequireAuth("users"))

	g.DELETE("/{courseId}", h.deleteCourseHandler).Bind(apis.RequireAuth("users"))
}
