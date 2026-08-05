package collections

import (
	"github.com/pocketbase/pocketbase/core"
)

func CreateUserCollection(app core.App) *core.Collection {
	collection := core.NewAuthCollection("users")

	collection.ListRule = nil
	collection.ViewRule = nil
	collection.CreateRule = nil
	collection.UpdateRule = nil
	collection.DeleteRule = nil

	collection.Fields.Add(
		&core.TextField{
			Name:     "username",
			Required: true,
			Max:      100,
		},
	)

	return collection
}
