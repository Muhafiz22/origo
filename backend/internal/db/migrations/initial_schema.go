package migrations

import (
	"backend/internal/db/collections"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(
		func(app core.App) error {

			creators := []func() *core.Collection{
				collections.CreateUserCollection,
				collections.CreateCourseCollection,
				collections.CreateChapterCollection,
				collections.CreateVideoCollection,
				collections.CreateNoteCollection,
			}

			for _, create := range creators {
				if err := app.Save(create()); err != nil {
					return err
				}
			}

			return nil
		},

		func(app core.App) error {
			names := []string{
				"subscriptions",
				"notes",
				"videos",
				"chapters",
				"courses",
				"users",
			}

			for _, name := range names {
				collection, err := app.FindCollectionByNameOrId(name)
				if err != nil {
					return err
				}

				if err := app.Delete(collection); err != nil {
					return err
				}
			}
			return nil
		})
}
