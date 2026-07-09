package router

import (
	"backend/internal/auth"
	"backend/internal/health"
	"backend/internal/user"

	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

type Dependencies struct {
	Auth *auth.Handler
	User *user.Handler
}

func Register(r *pocketRouter.Router[*core.RequestEvent], d Dependencies) {
	health.RegisterRoutes(r)

	auth.RegisterRoutes(r, d.Auth)
	user.RegisterRoutes(r, d.User)
}
