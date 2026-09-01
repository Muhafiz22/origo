package chapter

import (
	"backend/internal/apperr"
	"database/sql"
	"errors"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

type Service struct {
	app core.App
}

func NewService(app core.App) *Service {
	return &Service{
		app: app,
	}
}

func (s *Service) createChapter(courseId string, userId string, req CreateChapterRequest) (ChapterResponse, error) {

	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return ChapterResponse{}, err
	}

	if !isCourseCreator(courseRecord, userId) {
		return ChapterResponse{}, apperr.ErrForbidden
	}

	chapter, err := s.app.FindCollectionByNameOrId("chapters")
	if err != nil {
		s.app.Logger().Error(
			"failed to find chapters collection",
			"error", err,
		)
		return ChapterResponse{}, err
	}

	/*
	   TODO:
	 1. order index to be implemented for custom re-arranging after MVP.
	*/

	record := core.NewRecord(chapter)
	record.Set("title", req.Title)
	record.Set("description", req.Description)
	record.Set("courseId", courseId)

	if err := s.app.Save(record); err != nil {
		s.app.Logger().Error(
			"failed to save chapter",
			"error", err,
		)
		return ChapterResponse{}, err
	}

	return toChapterResponse(record), nil
}

func (s *Service) getChapter(chapterId string) (ChapterResponse, error) {
	chapterRecord, err := s.app.FindRecordById("chapters", chapterId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ChapterResponse{}, apperr.ErrNotFound
		}

		s.app.Logger().Error("failed to find chapter record",
			"error", err,
		)
		return ChapterResponse{}, err
	}

	return toChapterResponse(chapterRecord), nil
}

func (s *Service) listChapters(courseId string) ([]ChapterResponse, error) {
	_, err := s.isValidCourse(courseId)
	if err != nil {
		return nil, err
	}
	allRecords, err := s.app.FindRecordsByFilter(
		"chapters",
		"courseId = {:courseId}",
		"created",
		0,
		0,
		dbx.Params{
			"courseId": courseId,
		},
	)

	if err != nil {
		s.app.Logger().Error("failed to fetch chapters records",
			"courseId", courseId,
			"error", err,
		)
		return nil, err
	}

	responses := make([]ChapterResponse, 0, len(allRecords))

	for _, record := range allRecords {
		responses = append(responses, toChapterResponse(record))
	}

	return responses, nil
}

func (s *Service) updateChapter(chapterId string, userId string, req UpdateChapterRequest) error {
	chapterRecord, err := s.isValidChapter(chapterId)
	if err != nil {
		return err
	}

	courseId := chapterRecord.GetString("courseId")
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return err
	}

	if !isCourseCreator(courseRecord, userId) {
		return apperr.ErrForbidden
	}

	if req.Title != nil {
		chapterRecord.Set("title", *req.Title)
	}

	if req.Description != nil {
		chapterRecord.Set("description", *req.Description)
	}

	if err := s.app.Save(chapterRecord); err != nil {
		s.app.Logger().Error(
			"failed to save chapter",
			"error", err,
		)
		return err
	}

	return nil
}

func (s *Service) deleteChapter(chapterId string, userId string) error {
	chapterRecord, err := s.isValidChapter(chapterId)
	if err != nil {
		return err
	}

	courseId := chapterRecord.GetString("courseId")
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return err
	}

	if !isCourseCreator(courseRecord, userId) {
		return apperr.ErrForbidden
	}

	if err := s.app.Delete(chapterRecord); err != nil {
		s.app.Logger().Error(
			"failed to delete chapter",
			"error", err,
		)
		return err
	}

	return nil
}
