package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
)

func CreateCourseCollection(app core.App) *core.Collection {

	collection := core.NewBaseCollection("courses")

	collection.ListRule = nil
	collection.ViewRule = nil
	collection.CreateRule = nil
	collection.UpdateRule = nil
	collection.DeleteRule = nil

	users, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		log.Fatal("failed to find users collection: %w", err)
	}

	collection.Fields.Add(
		&core.TextField{
			Name:     "name",
			Required: true,
			Max:      100,
		},

		&core.TextField{
			Name:     "description",
			Required: true,
		},

		&core.RelationField{
			Name:         "creatorId",
			Required:     true,
			CollectionId: users.Id,
			MaxSelect:    1,
		},
	)
	return collection
}
