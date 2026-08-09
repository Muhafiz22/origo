package video

import (
	"backend/internal/apperr"
	"database/sql"
	"errors"
	"mime/multipart"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func toVideoMetadataResponse(record *core.Record) VideoMetadataResponse {
	response := VideoMetadataResponse{
		ID:           record.Id,
		ChapterID:    record.GetString("chapterId"),
		Title:        record.GetString("title"),
		Description:  record.GetString("description"),
		ThumbnailURL: record.GetString("thumbnailUrl"),
		Duration:     record.GetInt("duration"),
		Created:      record.GetString("created"),
	}
	return response
}

func isValidVideoFile(header *multipart.FileHeader) error {
	if strings.ToLower(filepath.Ext(header.Filename)) != ".mp4" {
		return apperr.FromValidationErrors(map[string]error{
			"video": errors.New("video must be an MP4 file"),
		})
	}

	if header.Header.Get("Content-Type") != "video/mp4" {
		return apperr.FromValidationErrors(map[string]error{
			"video": errors.New("video must be an MP4 file"),
		})
	}

	return nil
}

func isValidThumbnailFile(header *multipart.FileHeader) error {
	ext := strings.ToLower(filepath.Ext(header.Filename))

	switch ext {
	case ".jpg", ".jpeg", ".png", ".webp":

	default:
		return apperr.FromValidationErrors(map[string]error{
			"thumbnail": errors.New("thumbnail must be a JPG, PNG, or WebP image"),
		})
	}

	contentType := header.Header.Get("Content-Type")

	switch contentType {
	case "image/jpeg", "image/png", "image/webp":

	default:
		return apperr.FromValidationErrors(map[string]error{
			"thumbnail": errors.New("thumbnail must be a JPG, PNG, or WebP image"),
		})
	}

	return nil
}

func (s *Service) isValidChapter(chapterId string) (*core.Record, error) {
	chapterRecord, err := s.app.FindRecordById("chapters", chapterId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		s.app.Logger().Error(
			"failed to fetch chapters collection",
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
			"failed to fetch courses collection",
			"error", err,
		)
		return nil, err
	}

	return courseRecord, nil
}

func isCourseCreator(courseRecord *core.Record, userId string) bool {
	return courseRecord.GetString("creatorId") == userId
}
