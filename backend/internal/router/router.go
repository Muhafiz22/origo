package router

import (
	"backend/internal/health"

	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func Register(r *pocketRouter.Router[*core.RequestEvent], app core.App) {
	health.RegisterRoutes(r)
}
