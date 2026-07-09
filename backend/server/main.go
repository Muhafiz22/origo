package main

import (
	"backend/internal/auth"
	_ "backend/internal/db/migrations"
	"backend/internal/router"
	"backend/internal/user"
	"fmt"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"
)

/* TODO:
1. Custom Password validation logic for users.
2. setup SMTP service.
3. Add Bio field to users collection
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

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		fmt.Println("on serve hook executed")

		router.Register(
			se.Router,
			router.Dependencies{
				Auth: authHandler,
				User: userHandler,
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
