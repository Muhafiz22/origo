package router

import (
	"backend/internal/auth"
	"backend/internal/health"

	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func Register(r *pocketRouter.Router[*core.RequestEvent], authHandler *auth.Handler) {
	health.RegisterRoutes(r)

	auth.RegisterRoutes(r, authHandler)
}
