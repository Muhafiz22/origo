package main

import (
	"backend/internal/router"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main(){

	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		router.Register(se.Router, app)
		return se.Next()
	})

	if err := app.Start(); err != nil{
		log.Fatal(err)
	}
}
