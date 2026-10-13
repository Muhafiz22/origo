package migrations

import (
	"backend/internal/db/collections"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(
		func(app core.App) error {
			collection := collections.CreateVideoProgressCollection(app)

			if err := app.Save(collection); err != nil {
				return apis.NewInternalServerError(
					"failed to create video_progress collection: %w",
					err,
				)
			}

			return nil
		},
		func(app core.App) error {
			collection, err := app.FindCollectionByNameOrId("video_progress")
			if err != nil {
				return apis.NewInternalServerError(
					"failed to find video_progress collection for rollback: %w",
					err,
				)
			}

			if err := app.Delete(collection); err != nil {
				return apis.NewInternalServerError(
					"failed to delete video_progress collection: %w",
					err,
				)
			}

			return nil
		},
	)
}
