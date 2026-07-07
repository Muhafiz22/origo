package router

import (
	"backend/internal/health"
	"backend/internal/user"

	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func Register(r *pocketRouter.Router[*core.RequestEvent], userHandler *user.Handler) {
	health.RegisterRoutes(r)

	user.RegisterRoutes(r, userHandler)
}
