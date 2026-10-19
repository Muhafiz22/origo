package main

import (
	"backend/internal/auth"
	"backend/internal/chapter"
	"backend/internal/course"
	_ "backend/internal/db/migrations"
	"backend/internal/note"
	"backend/internal/router"
	"backend/internal/user"
	"backend/internal/video"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"
)

/* TODO:
1. Password validation logic - uppercase, lowercase, numbers, special char check.
*/

func dataDir() string {
	return strings.TrimSpace(os.Getenv("DATA_DIR"))
}

func frontendDir() string {
	dir := strings.TrimSpace(os.Getenv("FRONTEND_DIR"))
	return dir
}

func corsOrigins() []string {
	var origins []string
	for _, o := range strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ",") {
		if o = strings.TrimSpace(o); o != "" {
			origins = append(origins, o)
		}
	}
	if len(origins) == 0 {
		return []string{"http://localhost:5173"}
	}
	return origins
}

func main() {
	fmt.Println("main started")

	cfg, err := auth.LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	origins := corsOrigins()

	app := pocketbase.NewWithConfig(pocketbase.Config{
		DefaultDataDir: dataDir(),
		DefaultDev:     osutils.IsProbablyGoRun(),
	})
	fmt.Println("app created")

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: osutils.IsProbablyGoRun(),
	})

	authService := auth.NewService(app, cfg)
	authHandler := auth.NewHandler(authService)

	userService := user.NewService(app)
	userHandler := user.NewHandler(userService)

	courseService := course.NewService(app)
	courseHandler := course.NewHandler(courseService)

	chapterService := chapter.NewService(app)
	chapterHandler := chapter.NewHandler(chapterService)

	videoService := video.NewService(app)
	videoHandler := video.NewHandler(videoService)

	noteService := note.NewService(app)
	noteHandler := note.NewHandler(noteService)

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		fmt.Println("on serve hook executed")

		if err := cfg.ApplySMTP(se.App); err != nil {
			return err
		}

		se.Router.Bind(apis.CORS(apis.CORSConfig{
			AllowOrigins:     origins,
			AllowCredentials: true,
			AllowHeaders:     []string{"Content-Type"},
		}))
		fmt.Println("CORS Config hook executed")

		se.Router.Bind(auth.LoadAuthCookieMiddleware())
		router.Register(
			se.Router,
			router.Dependencies{
				AuthConfig: cfg,
				Auth:       authHandler,
				User:       userHandler,
				Course:     courseHandler,
				Chapter:    chapterHandler,
				Video:      videoHandler,
				Note:       noteHandler,
			},
		)

		if dir := frontendDir(); dir != "" {
			// Unknown API GETs should return JSON, not the SPA's index.html.
			se.Router.GET("/api/{path...}", func(e *core.RequestEvent) error {
				return e.JSON(404, map[string]any{
					"message": "Not found",
					"status":  404,
				})
			})

			// Serve the built frontend, with index.html fallback for SPA routes.
			se.Router.GET("/{path...}", apis.Static(os.DirFS(dir), true))
		}

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
