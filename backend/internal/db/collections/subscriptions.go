package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
)

func CreateSubscriptionCollection(app core.App) *core.Collection {
	collection := core.NewBaseCollection("subscriptions")

	collection.ListRule = nil
	collection.ViewRule = nil
	collection.CreateRule = nil
	collection.UpdateRule = nil
	collection.DeleteRule = nil

	users, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		log.Fatal("failed to find collection users", err)
	}

	courses, err := app.FindCollectionByNameOrId("courses")
	if err != nil {
		log.Fatal("failed to find collection courses", err)
	}

	collection.Fields.Add(
		&core.RelationField{
			Name:         "user",
			Required:     true,
			CollectionId: users.Id,
			MaxSelect:    1,
		},
		&core.RelationField{
			Name:         "course",
			Required:     true,
			CollectionId: courses.Id,
			MaxSelect:    1,
		},
		&core.DateField{
			Name:     "enrolled_at",
			Required: true,
		},
	)

	return collection
}
