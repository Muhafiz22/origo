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
	Auth    *auth.Handler
	User    *user.Handler
	Course  *course.Handler
	Chapter *chapter.Handler
	Video   *video.Handler
	Note    *note.Handler
}

func Register(r *pocketRouter.Router[*core.RequestEvent], d Dependencies) {
	health.RegisterRoutes(r)

	auth.RegisterRoutes(r, d.Auth)

	user.RegisterRoutes(r, d.User)
	course.RegisterRoutes(r, d.Course)
	chapter.RegisterRoutes(r, d.Chapter)
	video.RegisterRoutes(r, d.Video)
	note.RegisterRoutes(r, d.Note)
}
