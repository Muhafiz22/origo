package note

import (
	"backend/internal/apperr"
	"database/sql"
	"errors"
	"mime/multipart"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func toNoteMetadataResponse(record *core.Record) NoteMetadataResponse {
	return NoteMetadataResponse{
		Id:          record.Id,
		ChapterId:   record.GetString("chapterId"),
		Title:       record.GetString("title"),
		Description: record.GetString("description"),
		Created:     record.GetString("created"),
	}
}

func isValidNoteFile(header *multipart.FileHeader) error {
	ext := strings.ToLower(filepath.Ext(header.Filename))
	contentType := header.Header.Get("Content-Type")

	allowedTypes := map[string]string{
		".pdf":  "application/pdf",
		".ppt":  "application/vnd.ms-powerpoint",
		".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		".doc":  "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".txt":  "text/plain",
		".md":   "text/markdown",
		".png":  "image/png",
		".jpg":  "image/jpeg",
		".jpeg": "image/jpeg",
		".webp": "image/webp",
	}

	expectedContentType, ok := allowedTypes[ext]
	if !ok || contentType != expectedContentType {
		return apperr.FromValidationErrors(map[string]error{
			"note": errors.New("unsupported file format"),
		})
	}

	return nil
}

func (s *Service) isValidNote(noteId string) (*core.Record, error) {
	noteRecord, err := s.app.FindRecordById("notes", noteId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}

		s.app.Logger().Error(
			"failed to fetch note from notes collection",
			"error", err,
		)

		return nil, err
	}

	return noteRecord, nil
}

func (s *Service) isValidChapter(chapterId string) (*core.Record, error) {
	chapterRecord, err := s.app.FindRecordById("chapters", chapterId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}

		s.app.Logger().Error(
			"failed to fetch chapter from chapters collection",
			"error", err,
		)

		return nil, err
	}

	return chapterRecord, nil
}

func (s *Service) isValidCourse(courseId string) (*core.Record, error) {
	courseRecord, err := s.app.FindRecordById("courses", courseId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}

		s.app.Logger().Error(
			"failed to fetch course from courses collection",
			"error", err,
		)

		return nil, err
	}

	return courseRecord, nil
}

func isCourseCreator(courseRecord *core.Record, userId string) bool {
	return courseRecord.GetString("creatorId") == userId
}

func (s *Service) canAccessNote(noteRecord *core.Record) error {
	chapterId := noteRecord.GetString("chapterId")

	chapterRecord, err := s.isValidChapter(chapterId)
	if err != nil {
		return err
	}

	courseId := chapterRecord.GetString("courseId")

	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return err
	}

	if courseRecord.GetFloat("price") > 0 {
		return apperr.ErrForbidden
	}

	return nil
}
