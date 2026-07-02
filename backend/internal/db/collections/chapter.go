package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateChapterCollection(app core.App) *core.Collection {

	collection := core.NewBaseCollection("chapters")

	collection.ListRule = types.Pointer("@request.auth.id != ''")              //authenticated user - list all chapters of all courses
	collection.ViewRule = types.Pointer("@request.auth.id != ''")              //authenticated user - view a chapter
	collection.CreateRule = types.Pointer("course.creator = @request.auth.id") //course creator - creates the chapter
	collection.UpdateRule = types.Pointer("course.creator = @request.auth.id") //course creator - updates the chapter
	collection.DeleteRule = types.Pointer("course.creator = @request.auth.id") //course creator - delete a chapter

	courses, err := app.FindCollectionByNameOrId("courses")
	if err != nil {
		log.Fatal("failed to find collection courses", err)
	}

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
			CollectionId: courses.Id,
			MaxSelect:    1,
		},
	)
	return collection
}
