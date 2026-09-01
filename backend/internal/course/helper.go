package course

import (
	"backend/internal/apperr"
	"database/sql"
	"errors"

	"github.com/pocketbase/pocketbase/core"
)

func toCourseResponse(record *core.Record) CourseResponse {
	response := CourseResponse{
		CourseId:    record.Id,
		Name:        record.GetString("name"),
		Description: record.GetString("description"),
		Price:       record.GetFloat("price"),
		CreatorId:   record.GetString("creatorId"),
		CreatedAt:   record.Collection().Created,
		UpdatedAt:   record.Collection().Updated,
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
