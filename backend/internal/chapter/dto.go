package chapter

import "github.com/pocketbase/pocketbase/tools/types"

type CreateChapterRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	OrderIndex  int    `json:"order_index"`
}

type UpdateChapterRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	OrderIndex  *int    `json:"order_index"`
}

type ChapterResponse struct {
	Id          string         `json:"id"`
	CourseId    string         `json:"course_id"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	OrderIndex  int            `json:"order_index"`
	Created     types.DateTime `json:"created"`
	Updated     types.DateTime `json:"updated"`
}
