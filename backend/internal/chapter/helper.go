package chapter

import (
	"backend/internal/apperr"
	"database/sql"
	"errors"

	"github.com/pocketbase/pocketbase/core"
)

func toChapterResponse(record *core.Record) ChapterResponse {
	response := ChapterResponse{
		Id:          record.Id,
		CourseId:    record.GetString("courseId"),
		Title:       record.GetString("title"),
		Description: record.GetString("description"),
		OrderIndex:  record.GetInt("order_index"),
		Created:     record.GetDateTime("created"),
		Updated:     record.GetDateTime("updated"),
	}
	return response
}

func (s *Service) isValidCourse(courseId string) (*core.Record, error) {
	courseRecord, err := s.app.FindRecordById("courses", courseId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		s.app.Logger().Error("failed to fetch courses collection",
			"error", err,
		)
		return nil, err
	}

	return courseRecord, nil
}

func (s *Service) isValidChapter(chapterId string) (*core.Record, error) {
	chapterRecord, err := s.app.FindRecordById("chapters", chapterId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		s.app.Logger().Error("failed to fetch chapters record",
			"chapterId", chapterId,
			"error", err,
		)
		return nil, err
	}

	return chapterRecord, nil
}

func isCourseCreator(courseRecord *core.Record, userId string) bool {
	return courseRecord.GetString("creatorId") == userId
}
