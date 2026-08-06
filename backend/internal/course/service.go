package course

import (
	"backend/internal/apperr"
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

func (s *Service) createCourse(userId string, req CreateCourseRequest) (CourseResponse, error) {
	course, err := s.app.FindCollectionByNameOrId("courses")
	if err != nil {
		s.app.Logger().Error(
			"failed to look up course collection",
			"error", err,
		)
		return CourseResponse{}, err
	}

	record := core.NewRecord(course)
	record.Set("name", req.Name)
	record.Set("description", req.Description)
	record.Set("price", req.Price)
	record.Set("creatorId", userId)

	if err := s.app.Save(record); err != nil {
		s.app.Logger().Error(
			"failed to save course",
			"error", err,
		)
		return CourseResponse{}, err
	}

	return toCourseResponse(record), nil
}

func (s *Service) listCourses() ([]CourseResponse, error) {
	records, err := s.app.FindAllRecords("courses")
	if err != nil {
		s.app.Logger().Error(
			"failed to look up course collection",
			"error", err,
		)
		return nil, err
	}

	responses := make([]CourseResponse, 0, len(records))

	for _, record := range records {
		responses = append(responses, toCourseResponse(record))
	}

	return responses, nil
}

func (s *Service) getCourse(courseId string) (CourseResponse, error) {
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return CourseResponse{}, err
	}

	return toCourseResponse(courseRecord), nil
}

func (s *Service) updateCourse(courseId string, userId string, req UpdateCourseRequest) error {
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return err
	}

	if !s.isCourseCreator(courseRecord, userId) {
		return apperr.ErrForbidden
	}

	if req.Name != nil {
		courseRecord.Set("name", *req.Name)
	}
	if req.Description != nil {
		courseRecord.Set("description", *req.Description)
	}

	if req.Price != nil {
		courseRecord.Set("price", *req.Price)
	}

	if err := s.app.Save(courseRecord); err != nil {
		s.app.Logger().Error(
			"failed to save course updating",
			"error", err,
		)
		return err
	}

	return nil
}

func (s *Service) deleteCourse(courseId string, userId string) error {
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return err
	}

	if !s.isCourseCreator(courseRecord, userId) {
		return apperr.ErrForbidden
	}

	if err := s.app.Delete(courseRecord); err != nil {
		s.app.Logger().Error("failed to delete course",
			"error", err,
		)
		return err
	}

	return nil
}
