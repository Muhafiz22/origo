package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
)

func CreateNoteCollection(app core.App) *core.Collection {
	collection := core.NewBaseCollection("notes")

	collection.ListRule = nil
	collection.ViewRule = nil
	collection.CreateRule = nil
	collection.UpdateRule = nil
	collection.DeleteRule = nil

	chapters, err := app.FindCollectionByNameOrId("chapters")
	if err != nil {
		log.Fatal("failed to find collection chapters", err)
	}

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
			Name:     "note",
			Required: true,
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
			Name:         "chapter",
			Required:     true,
			CollectionId: chapters.Id,
			MaxSelect:    1,
		},
	)
	return collection
}
