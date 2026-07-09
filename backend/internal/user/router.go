package user

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.Router[*core.RequestEvent], h *Handler) {
	g := r.Group("/users")
	g.Bind(apis.RequireAuth("users"))

	g.GET("/profile", h.getUserProfileHandler)
	g.PATCH("/profile", h.updateUserProfileHandler)
}
