package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
)

func CreateChapterCollection(app core.App) *core.Collection {

	collection := core.NewBaseCollection("chapters")

	collection.ListRule = nil
	collection.ViewRule = nil
	collection.CreateRule = nil
	collection.UpdateRule = nil
	collection.DeleteRule = nil

	courses, err := app.FindCollectionByNameOrId("courses")
	if err != nil {
		log.Fatal("failed to find courses collection", err)
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

		&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		},

		&core.AutodateField{
			Name:     "updated",
			OnUpdate: true,
		},

		&core.RelationField{
			Name:         "courseId",
			Required:     true,
			CollectionId: courses.Id,
			MaxSelect:    1,
		},
	)
	return collection
}
