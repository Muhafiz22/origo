package collections

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateUserCollection() *core.Collection {
	collection := core.NewAuthCollection("users")

	collection.ListRule = types.Pointer("id = @request.auth.id")
	collection.ViewRule = types.Pointer("id = @request.auth.id")
	collection.CreateRule = types.Pointer("")
	collection.UpdateRule = types.Pointer("id = @request.auth.id")
	collection.DeleteRule = nil

	collection.Fields.Add(
		&core.TextField{
			Name:     "name",
			Required: true,
			Max:      100,
		},
		&core.TextField{
			Name: "phone",
			Max:  20,
		},
	)

	return collection
}
