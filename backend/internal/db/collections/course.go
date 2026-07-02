package collections

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateCourseCollection() *core.Collection {

	collection := core.NewBaseCollection("courses")

	collection.ListRule = types.Pointer("")                             //all courses - open for all user()public
	collection.ViewRule = types.Pointer("")                             //a course - open for all user(public)
	collection.CreateRule = types.Pointer("@request.auth.id != ''")     //create course - authenticated user only
	collection.UpdateRule = types.Pointer("creator = @request.auth.id") //update course - creator of the course
	collection.DeleteRule = types.Pointer("creator = @request.auth.id") //delete course - creator of the course

	collection.Fields.Add(
		&core.TextField{
			Name:     "name",
			Required: true,
			Max:      30,
		},

		&core.TextField{
			Name:     "description",
			Required: true,
		},

		&core.RelationField{
			Name:         "creator",
			Required:     true,
			CollectionId: "users",
			MaxSelect:    1,
		},
	)
	return collection
}
