package main

import (
	"backend/internal/auth"
	_ "backend/internal/db/migrations"
	"backend/internal/router"
	"fmt"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"
)

/*
TODO:
	1. Custom Password validation logic for users.
	2. setup SMTP service.
*/

func main() {
	fmt.Println("main started")
	app := pocketbase.New()
	fmt.Println("app created")

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: osutils.IsProbablyGoRun(),
	})

	userService := auth.NewService(app)
	userHandler := auth.NewHandler(userService)

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		fmt.Println("on serve hook executed")
		router.Register(
			se.Router,
			userHandler,
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
