package collections

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateVideoCollection(app core.App) *core.Collection {
	collection := core.NewBaseCollection("videos")

	collection.ListRule = types.Pointer("")                                                //all user - access all video
	collection.ViewRule = types.Pointer("")                                                //all user - access a video
	collection.CreateRule = types.Pointer("chapter.courseId.creatorId = @request.auth.id") //course creator - creates video
	collection.UpdateRule = types.Pointer("chapter.courseId.creatorId = @request.auth.id") //course creator = updates video
	collection.DeleteRule = types.Pointer("chapter.courseId.creatorId = @request.auth.id") //course creator - deletes video

	chapters, err := app.FindCollectionByNameOrId("chapters")
	if err != nil {
		log.Fatal("failed to find chapters collection ", err)
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

		&core.NumberField{
			Name:     "duration",
			Required: true,
		},

		&core.NumberField{
			Name:     "order_index",
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
