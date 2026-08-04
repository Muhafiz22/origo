package chapter

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
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
		return ChapterResponse{}, apis.NewForbiddenError("unauthorised operation", nil)
	}

	chapter, err := s.app.FindCollectionByNameOrId("chapters")

	if err != nil {
		s.app.Logger().Error(
			"failed to save record in chapters collection",
			"error", err,
			"error_type", fmt.Sprintf("%T", err),
			"error_detail", fmt.Sprintf("%+v", err),
		)
		return ChapterResponse{}, err
	}

	/*
	   TODO:
	 1. order index to be auto incremented
	*/

	record := core.NewRecord(chapter)
	record.Set("title", req.Title)
	record.Set("description", req.Description)
	record.Set("order_index", req.OrderIndex)
	record.Set("courseId", courseId)

	// TODO: map PocketBase validation errors to 4xx responses.
	if err := s.app.Save(record); err != nil {
		s.app.Logger().Error(
			"failed to save record in chapters collection",
			"error", err,
		)
		return ChapterResponse{}, apis.NewInternalServerError("internal server error", nil)
	}

	response := toChapterResponse(record)
	return response, nil
}

func (s *Service) getChapter(chapterId string) (ChapterResponse, error) {
	chapterRecord, err := s.app.FindRecordById("chapters", chapterId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ChapterResponse{}, apis.NewNotFoundError("chapter not found", nil)
		}

		s.app.Logger().Error("failed to find chapter record",
			"error", err,
		)
		return ChapterResponse{}, apis.NewInternalServerError("some error occured", nil)
	}

	response := toChapterResponse(chapterRecord)
	return response, nil
}

func (s *Service) listChapters(courseId string) ([]ChapterResponse, error) {
	_, err := s.isValidCourse(courseId)
	if err != nil {
		return nil, err
	}
	allRecords, err := s.app.FindAllRecords(
		"chapters",
		dbx.HashExp{
			"courseId": courseId,
		},
	)

	if err != nil {
		s.app.Logger().Error("failed to fetch chapters records",
			"courseId", courseId,
			"error", err,
		)
		return nil, apis.NewInternalServerError("internal server error", nil)
	}

	responses := make([]ChapterResponse, 0, len(allRecords))

	for _, record := range allRecords {
		responses = append(responses, toChapterResponse(record))
	}

	return responses, nil
}

func (s *Service) updateChapter(chapterId string, userId string, req UpdateChapterRequest) error {
	return nil
}
