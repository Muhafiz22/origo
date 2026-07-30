package course

import "github.com/pocketbase/pocketbase/tools/types"

type CreateCourseRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type CourseResponse struct {
	CourseId    string         `json:"courseId"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	CreatorId   string         `json:"creatorId"`
	CreatedAt   types.DateTime `json:"createdAt"`
	UpdatedAt   types.DateTime `json:"updatedAt"`
}

type UpdateCourseRequest struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
}
