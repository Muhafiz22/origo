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
	Id          string `json:"id"`
	ChapterId   string `json:"chapterId"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Duration    int    `json:"duration"`
	Created     string `json:"created"`
}

type VideoContentResponse struct {
	VideoURL string `json:"videoUrl"`
}
