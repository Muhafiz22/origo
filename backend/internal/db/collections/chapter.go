package collections

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateChapterCollection() *core.Collection {

	collection := core.NewBaseCollection("chapters")

	collection.ListRule = types.Pointer("@request.auth.id != ''")              //authenticated user - list all chapters of all courses
	collection.ViewRule = types.Pointer("@request.auth.id != ''")              //authenticated user - view a chapter
	collection.CreateRule = types.Pointer("course.creator = @request.auth.id") //course creator - creates the chapter
	collection.UpdateRule = types.Pointer("course.creator = @request.auth.id") //course creator - updates the chapter
	collection.DeleteRule = types.Pointer("course.creator = @request.auth.id") //course creator - delete a chapter

	collection.Fields.Add(
		&core.TextField{
			Name:     "title",
			Required: true,
			Max:      30,
		},

		&core.NumberField{
			Name:     "order_index",
			Required: true,
		},

		&core.RelationField{
			Name:         "course",
			Required:     true,
			CollectionId: "courses",
			MaxSelect:    1,
		},
	)
	return collection
}
