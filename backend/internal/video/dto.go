package video

type CreateVideoRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Duration    int    `json:"duration"`
}

type UpdateVideoRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Duration    *int    `json:"duration"`
}

type VideoMetadataResponse struct {
	ID           string `json:"id"`
	ChapterID    string `json:"chapterId"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	ThumbnailURL string `json:"thumbnailUrl"`
	Duration     int    `json:"duration"`
	Created      string `json:"created"`
}

type VideoContentResponse struct {
	VideoURL string `json:"videoUrl"`
}
