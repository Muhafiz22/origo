package main

import (
	_ "backend/internal/db/migrations"
	"backend/internal/router"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"
)

func main() {

	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: osutils.IsProbablyGoRun(),
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		router.Register(se.Router, app)

		app.Logger().Info(
			"server started",
			"addr", se.Server.Addr,
			"url", "http://localhost"+se.Server.Addr,
		)
		return se.Next()
	})

	if err := app.Start(); err != nil {
		app.Logger().Error(
			"server failed to start:",
			"error", err,
		)
		os.Exit(1)
	}
}
