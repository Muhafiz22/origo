package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateChapterCollection(app core.App) *core.Collection {

	collection := core.NewBaseCollection("chapters")

	collection.ListRule = types.Pointer("")                                        //all user - list all chapters of all courses
	collection.ViewRule = types.Pointer("")                                        //all user - view a chapter
	collection.CreateRule = types.Pointer("courseId.creatorId = @request.auth.id") //course creator - creates the chapter
	collection.UpdateRule = types.Pointer("courseId.creatorId = @request.auth.id") //course creator - updates the chapter
	collection.DeleteRule = types.Pointer("courseId.creatorId = @request.auth.id") //course creator - delete a chapter

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

		&core.RelationField{
			Name:         "courseId",
			Required:     true,
			CollectionId: courses.Id,
			MaxSelect:    1,
		},
	)
	return collection
}
