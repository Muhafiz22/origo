package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateSubscriptionCollection(app core.App) *core.Collection {
	collection := core.NewBaseCollection("subscriptions")

	collection.ListRule = types.Pointer("user = @request.auth.id")
	collection.ViewRule = types.Pointer("user = @request.auth.id")
	collection.CreateRule = types.Pointer("@request.auth.id != ''")
	collection.UpdateRule = nil
	collection.DeleteRule = types.Pointer("user = @request.auth.id")

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
