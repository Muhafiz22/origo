package course

import (
	"backend/internal/apperr"
	"database/sql"
	"errors"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func (s *Service) toCourseResponse(record *core.Record) CourseResponse {
	var creatorName string
	creatorId := record.GetString("creatorId")
	creatorRecord, err := s.app.FindRecordById("users", creatorId)
	if err != nil {
		s.app.Logger().Error(
			"failed to fetch course creator",
			"courseId", record.Id,
			"creatorId", creatorId,
			"error", err,
		)
	} else {
		creatorName = creatorRecord.GetString("name")
	}

	thumbnail := record.GetString("thumbnail")

	thumbnailURL := ""
	if thumbnail != "" {
		thumbnailURL = fmt.Sprintf(
			"/api/files/%s/%s/%s?thumb=640x360",
			record.Collection().Id,
			record.Id,
			thumbnail,
		)
	}

	response := CourseResponse{
		CourseId:     record.Id,
		Name:         record.GetString("name"),
		Description:  record.GetString("description"),
		Price:        record.GetFloat("price"),
		CreatorId:    creatorId,
		CreatorName:  creatorName,
		ThumbnailUrl: thumbnailURL,
		CreatedAt:    record.GetDateTime("created"),
		UpdatedAt:    record.GetDateTime("updated"),
	}
	return response
}

func (s *Service) isValidCourse(courseId string) (*core.Record, error) {
	courseRecord, err := s.app.FindRecordById("courses", courseId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}

		s.app.Logger().Error(
			"failed to fetch course record",
			"error", err,
		)
		return nil, err
	}

	return courseRecord, nil
}

func (s *Service) isCourseCreator(courseRecord *core.Record, userId string) bool {
	return courseRecord.GetString("creatorId") == userId
}

func isValidThumbnailFile(header *multipart.FileHeader) error {
	ext := strings.ToLower(filepath.Ext(header.Filename))

	switch ext {
	case ".jpg", ".png", ".webp":

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

func (s *Service) canAccessCourse(courseRecord *core.Record) error {
	if courseRecord.GetFloat("price") > 0 {
		return apperr.ErrForbidden
	}
	return nil
}
