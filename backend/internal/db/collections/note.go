package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateNoteCollection(app core.App) *core.Collection {
	collection := core.NewBaseCollection("notes")

	collection.ListRule = types.Pointer("")                                                //all user - access all note
	collection.ViewRule = types.Pointer("")                                                //all user - access a note
	collection.CreateRule = types.Pointer("chapter.courseId.creatorId = @request.auth.id") //course creator - creates note
	collection.UpdateRule = types.Pointer("chapter.courseId.creatorId = @request.auth.id") //course creator = updates note
	collection.DeleteRule = types.Pointer("chapter.courseId.creatorId = @request.auth.id") //course creator - deletes note

	chapters, err := app.FindCollectionByNameOrId("chapters")
	if err != nil {
		log.Fatal("failed to find collection chapters", err)
	}

	collection.Fields.Add(
		&core.TextField{
			Name:     "title",
			Required: true,
			Max:      30,
		},

		&core.URLField{
			Name:     "file_url",
			Required: true,
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
