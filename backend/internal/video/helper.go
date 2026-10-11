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
		Id:          record.Id,
		ChapterId:   record.GetString("chapterId"),
		Title:       record.GetString("title"),
		Description: record.GetString("description"),
		Duration:    record.GetInt("duration"),
		Created:     record.GetString("created"),
	}
	return response
}

func isValidVideoFile(header *multipart.FileHeader) error {
	ext := strings.ToLower(filepath.Ext(header.Filename))

	switch ext {
	case ".mp4", ".webm", ".ogg":

	default:
		return apperr.FromValidationErrors(map[string]error{
			"video": errors.New("video must be a mp4, webm, or ogg type"),
		})
	}

	contentType := header.Header.Get("Content-Type")

	switch contentType {
	case "video/mp4", "video/webm", "video/ogg":

	default:
		return apperr.FromValidationErrors(map[string]error{
			"video": errors.New("video must be a mp4, webm, or ogg type"),
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

func (s *Service) isValidVideo(videoId string) (*core.Record, error) {
	videoRecord, err := s.app.FindRecordById("videos", videoId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		s.app.Logger().Error(
			"failed to fetch video from videos collection",
			"error", err,
		)
		return nil, err
	}

	return videoRecord, nil
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

func (s *Service) canAccessVideo(videoRecord *core.Record) error {
	chapterId := videoRecord.GetString("chapterId")
	chapterRecord, err := s.isValidChapter(chapterId)
	if err != nil {
		return err
	}

	courseId := chapterRecord.GetString("courseId")
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return err
	}

	price := courseRecord.GetFloat("price")
	if price > 0 {
		return apperr.ErrForbidden
	}

	return nil
}
