package migrations

import (
	"backend/internal/db/collections"
	"fmt"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(
		func(app core.App) error {
			fmt.Println("Starting db migrations")

			creators := []func(app core.App) *core.Collection{
				//collections.CreateUserCollection,
				collections.CreateCourseCollection,
				collections.CreateSubscriptionCollection,
				collections.CreateChapterCollection,
				collections.CreateVideoCollection,
				collections.CreateNoteCollection,
			}

			for _, create := range creators {
				collection := create(app)

				if err := app.Save(collection); err != nil {
					return fmt.Errorf("failed to create collection %q: %w", collection.Name, err)
				}
			}

			return nil
		},

		func(app core.App) error {
			names := []string{
				"notes",
				"videos",
				"chapters",
				"subscriptions",
				"courses",
				"users",
			}

			for _, name := range names {
				collection, err := app.FindCollectionByNameOrId(name)
				if err != nil {
					return fmt.Errorf("failed to find collection %q: %w", name, err)
				}

				if err := app.Delete(collection); err != nil {
					return fmt.Errorf("failed to delete collection %q during rollback: %w", name, err)
				}
			}
			return nil
		})
}
