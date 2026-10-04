package note

type CreateNoteRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type UpdateNoteRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
}

type NoteMetadataResponse struct {
	Id          string `json:"id"`
	ChapterId   string `json:"chapterId"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Created     string `json:"created"`
}
