package main

import (
	"backend/internal/auth"
	"backend/internal/chapter"
	"backend/internal/course"
	_ "backend/internal/db/migrations"
	"backend/internal/router"
	"backend/internal/user"
	"backend/internal/video"
	"fmt"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"
)

/* TODO:
1. Password validation logic - uppercase, lowercase, numbers, special char check.
2. setup SMTP service.
*/

func main() {
	fmt.Println("main started")
	app := pocketbase.New()
	fmt.Println("app created")

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: osutils.IsProbablyGoRun(),
	})

	authService := auth.NewService(app)
	authHandler := auth.NewHandler(authService)

	userService := user.NewService(app)
	userHandler := user.NewHandler(userService)

	courseService := course.NewService(app)
	courseHandler := course.NewHandler(courseService)

	chapterService := chapter.NewService(app)
	chapterHandler := chapter.NewHandler(chapterService)

	videoService := video.NewService(app)
	videoHandler := video.NewHandler(videoService)

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		fmt.Println("on serve hook executed")

		se.Router.Bind(apis.CORS(apis.CORSConfig{
			AllowOrigins:     []string{"http://localhost:5173"},
			AllowCredentials: true,
			AllowHeaders:     []string{"Content-Type"},
		}))
		fmt.Println("CORS Config hook executed")

		se.Router.Bind(auth.LoadAuthCookieMiddleware())
		router.Register(
			se.Router,
			router.Dependencies{
				Auth:    authHandler,
				User:    userHandler,
				Course:  courseHandler,
				Chapter: chapterHandler,
				Video:   videoHandler,
			},
		)

		app.Logger().Info(
			"server started",
			"addr", se.Server.Addr,
			"url", "http://localhost"+se.Server.Addr,
		)
		return se.Next()
	})

	fmt.Println("calling app.start()")
	if err := app.Start(); err != nil {
		app.Logger().Error(
			"server failed to start:",
			"error", err,
		)
		os.Exit(1)
	}
}
