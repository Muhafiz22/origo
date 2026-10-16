package course

import "github.com/pocketbase/pocketbase/tools/types"

type CreateCourseRequest struct {
	Name        string  `json:"name" form:"name"`
	Description string  `json:"description" form:"description"`
	Price       float64 `json:"price" form:"price"`
}

type CourseResponse struct {
	CourseId     string         `json:"courseId"`
	Name         string         `json:"name"`
	Description  string         `json:"description"`
	Price        float64        `json:"price"`
	CreatorId    string         `json:"creatorId"`
	CreatorName  string         `json:"creatorName"`
	ThumbnailUrl string         `json:"thumbnailUrl"`
	CreatedAt    types.DateTime `json:"createdAt"`
	UpdatedAt    types.DateTime `json:"updatedAt"`
}

type UpdateCourseRequest struct {
	Name        *string  `json:"name" form:"name"`
	Description *string  `json:"description" form:"description"`
	Price       *float64 `json:"price" form:"price"`
}

type CourseProgressResponse struct {
	CompletedVideoIds []string `json:"completedVideoIds"`
	CompletedCount    int      `json:"completedCount"`
	TotalVideos       int      `json:"totalVideos"`
	Percent           int      `json:"percent"`
}

type LearningCourseResponse struct {
	CourseResponse
	CompletedCount int    `json:"completedCount"`
	TotalVideos    int    `json:"totalVideos"`
	Percent        int    `json:"percent"`
	LastActivity   string `json:"lastActivity"`
}
