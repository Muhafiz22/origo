package collections

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateVideoCollection() *core.Collection {
	collection := core.NewBaseCollection("videos")

	collection.ListRule = types.Pointer("@request.auth.id != ''")                      //authorised user - access all video
	collection.ViewRule = types.Pointer("@request.auth.id != ''")                      //authorised user - access a video
	collection.CreateRule = types.Pointer("chapter.course.creator = @request.auth.id") //course creator - creates video
	collection.UpdateRule = types.Pointer("chapter.course.creator = @request.auth.id") //course creator = updates video
	collection.DeleteRule = types.Pointer("chapter.course.creator = @request.auth.id") //course creator - deletes video

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
			CollectionId: "chapters",
			MaxSelect:    1,
		},
	)
	return collection
}
