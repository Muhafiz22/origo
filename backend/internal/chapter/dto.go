package chapter

type CreateChapterRequest struct {
	Title       string `json:"title"`
	Description string `json:"desription"`
	OrderIndex  int    `json:"order_index"`
}

type UpdateChapterRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	OrderIndex  *int    `json:"order_index"`
}

type ChapterResponse struct {
	Id          string `json:"id"`
	CourseId    string `json:"course_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	OrderIndex  int    `json:"order_index"`
	Created     string `json:"created"`
	Updated     string `json:"updated"`
}
