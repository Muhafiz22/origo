package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
)

func CreateVideoProgressCollection(app core.App) *core.Collection {
	collection := core.NewBaseCollection("video_progress")

	collection.ListRule = nil
	collection.ViewRule = nil
	collection.CreateRule = nil
	collection.UpdateRule = nil
	collection.DeleteRule = nil

	users, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		log.Fatal("failed to find users collection: ", err)
	}

	videos, err := app.FindCollectionByNameOrId("videos")
	if err != nil {
		log.Fatal("failed to find videos collection: ", err)
	}

	courses, err := app.FindCollectionByNameOrId("courses")
	if err != nil {
		log.Fatal("failed to find courses collection: ", err)
	}

	collection.Fields.Add(
		&core.RelationField{
			Name:          "user",
			CollectionId:  users.Id,
			Required:      true,
			MaxSelect:     1,
			CascadeDelete: true,
		},
		&core.RelationField{
			Name:          "video",
			CollectionId:  videos.Id,
			Required:      true,
			MaxSelect:     1,
			CascadeDelete: true,
		},
		&core.RelationField{
			Name:          "course",
			CollectionId:  courses.Id,
			Required:      true,
			MaxSelect:     1,
			CascadeDelete: true,
		},
		&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		},
	)

	collection.Indexes = []string{
		`CREATE UNIQUE INDEX idx_video_progress_user_video
		ON video_progress (user, video)`,
	}

	return collection
}
