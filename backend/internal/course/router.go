package course

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.Router[*core.RequestEvent], h *Handler) {
	g := r.Group("/courses")

	g.GET("", h.listCoursesHandler)
	g.GET("/{id}", h.getCourseHandler)

	g.POST("", h.createCourseHandler).Bind(apis.RequireAuth("users"))
	g.PATCH("/{id}", h.updateCourseHandler).Bind(apis.RequireAuth("users"))
	g.DELETE("/{id}", h.deleteCourseHandler).Bind(apis.RequireAuth("users"))
}
