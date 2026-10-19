package router

import (
	"backend/internal/auth"
	"backend/internal/chapter"
	"backend/internal/course"
	"backend/internal/health"
	"backend/internal/note"
	"backend/internal/user"
	"backend/internal/video"

	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

type Dependencies struct {
	AuthConfig auth.Config
	Auth       *auth.Handler
	User       *user.Handler
	Course     *course.Handler
	Chapter    *chapter.Handler
	Video      *video.Handler
	Note       *note.Handler
}

func Register(r *pocketRouter.Router[*core.RequestEvent], d Dependencies) {

	api := r.Group("/api/v1")

	health.RegisterRoutes(r)

	auth.RegisterRoutes(api, d.Auth, d.AuthConfig)

	user.RegisterRoutes(api, d.User)
	course.RegisterRoutes(api, d.Course)
	chapter.RegisterRoutes(api, d.Chapter)
	video.RegisterRoutes(api, d.Video)
	note.RegisterRoutes(api, d.Note)
}
