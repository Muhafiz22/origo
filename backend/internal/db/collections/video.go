package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
)

func CreateVideoCollection(app core.App) *core.Collection {
	collection := core.NewBaseCollection("videos")

	collection.ListRule = nil
	collection.ViewRule = nil
	collection.CreateRule = nil
	collection.UpdateRule = nil
	collection.DeleteRule = nil

	chapters, err := app.FindCollectionByNameOrId("chapters")
	if err != nil {
		log.Fatal("failed to find chapters collection ", err)
	}

	min := 0.0

	collection.Fields.Add(
		&core.TextField{
			Name:     "title",
			Required: true,
			Max:      100,
		},

		&core.TextField{
			Name: "description",
			Max:  500,
		},

		&core.FileField{
			Name:      "video",
			Required:  true,
			MaxSelect: 1,
			MaxSize:   100 * 1024 * 1024,
			MimeTypes: []string{
				"video/mp4",
			},
		},

		&core.FileField{
			Name:      "thumbnail",
			Required:  true,
			MaxSelect: 1,
			MimeTypes: []string{
				"image/jpeg",
				"image/png",
				"image/webp",
			},
		},

		&core.NumberField{
			Name:     "duration",
			Required: true,
			OnlyInt:  true,
			Min:      &min,
		},

		&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		},

		&core.AutodateField{
			Name:     "updated",
			OnUpdate: true,
		},

		&core.RelationField{
			Name:         "chapterId",
			Required:     true,
			CollectionId: chapters.Id,
			MaxSelect:    1,
		},
	)
	return collection
}
