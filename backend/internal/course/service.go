package course

import (
	"database/sql"
	"errors"

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

func (s *Service) createCourse(user *core.Record, req CreateCourseRequest) (CourseResponse, error) {
	course, err := s.app.FindCollectionByNameOrId("courses")
	if err != nil {
		s.app.Logger().Error(
			"failed to look up course collection",
			"error", err,
		)
		return CourseResponse{}, apis.NewInternalServerError("internal server error", nil)
	}

	record := core.NewRecord(course)
	record.Set("name", req.Name)
	record.Set("description", req.Description)
	record.Set("creatorId", user.Id)

	err = s.app.Save(record)
	if err != nil {
		s.app.Logger().Error(
			"failed to save course record in course creation",
			"error", err,
		)
		return CourseResponse{}, err
	}

	response := toCourseResponse(record)
	return response, nil
}

func (s *Service) listCourses() ([]CourseResponse, error) {
	records, err := s.app.FindAllRecords("courses")
	if err != nil {
		s.app.Logger().Error(
			"failed to look up course collection",
			"error", err,
		)
		return nil, apis.NewInternalServerError("internal server error", err)
	}

	responses := make([]CourseResponse, 0, len(records))

	for _, record := range records {
		responses = append(responses, toCourseResponse(record))
	}

	return responses, nil
}

func (s *Service) getCourse(id string) (CourseResponse, error) {
	record, err := s.app.FindRecordById("courses", id)
	if err != nil {

		if errors.Is(err, sql.ErrNoRows) { //course do not exist(expected error)
			return CourseResponse{}, apis.NewNotFoundError("course not found", err)
		}

		s.app.Logger().Error( //unexpected system error
			"Failed to retrieve course record",
			"error", err,
		)
		return CourseResponse{}, apis.NewInternalServerError("something went wrong", nil)
	}

	response := toCourseResponse(record)

	return response, nil
}

func (s *Service) getCourseRecord(courseId string) (*core.Record, error) {
	courseRecord, err := s.app.FindRecordById("courses", courseId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apis.NewNotFoundError("course not found", nil)
		}

		s.app.Logger().Error(
			"failed to fetch course record",
			"error", err,
		)

		return nil, apis.NewInternalServerError("something went wrong", nil)
	}

	return courseRecord, nil
}

func (s *Service) updateCourse(record *core.Record, req UpdateCourseRequest) error {
	if req.Name != nil {
		record.Set("name", *req.Name)
	}
	if req.Description != nil {
		record.Set("description", *req.Description)
	}

	if err := s.app.Save(record); err != nil {
		s.app.Logger().Error(
			"failed to save course record while updating",
			"error", err,
		)

		return apis.NewInternalServerError("something went wrong, try again.", nil)
	}

	return nil
}

func (s *Service) deleteCourse(courseRecord *core.Record) error {
	if err := s.app.Delete(courseRecord); err != nil {
		s.app.Logger().Error("failed to delete course record",
			"error", err,
		)

		return apis.NewInternalServerError("something went wrong", nil)
	}
	return nil
}
