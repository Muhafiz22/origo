package health

import (
	"github.com/pocketbase/pocketbase/core"

	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.Router[*core.RequestEvent]) {

	r.GET("/health", HealthHandler)
}
