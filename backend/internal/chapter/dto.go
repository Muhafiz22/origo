package chapter

import "github.com/pocketbase/pocketbase/tools/types"

type CreateChapterRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type UpdateChapterRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
}

type ChapterResponse struct {
	Id          string         `json:"id"`
	CourseId    string         `json:"course_id"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Created     types.DateTime `json:"created"`
	Updated     types.DateTime `json:"updated"`
}
