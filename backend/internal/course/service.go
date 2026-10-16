package course

import (
	"backend/internal/apperr"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

type Service struct {
	app core.App
}

func NewService(app core.App) *Service {
	return &Service{
		app: app,
	}
}

func (s *Service) Filesystem() (*filesystem.System, error) {
	fsys, err := s.app.NewFilesystem()
	if err != nil {
		return nil, err
	}
	return fsys, nil
}

func (s *Service) createCourse(userId string, req CreateCourseRequest, thumbnailFile *filesystem.File) (CourseResponse, error) {
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
	record.Set("thumbnail", thumbnailFile)

	if err := s.app.Save(record); err != nil {
		s.app.Logger().Error(
			"failed to save course",
			"error", err,
		)
		return CourseResponse{}, err
	}

	return s.toCourseResponse(record), nil
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
		responses = append(responses, s.toCourseResponse(record))
	}

	return responses, nil
}

func (s *Service) getCourse(courseId string) (CourseResponse, error) {
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return CourseResponse{}, err
	}

	return s.toCourseResponse(courseRecord), nil
}

func (s *Service) updateCourse(courseId string, userId string, req UpdateCourseRequest, thumbnail *filesystem.File) (CourseResponse, error) {
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return CourseResponse{}, err
	}

	if !s.isCourseCreator(courseRecord, userId) {
		return CourseResponse{}, apperr.ErrForbidden
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

	if thumbnail != nil {
		courseRecord.Set("thumbnail", thumbnail)
	}

	if err := s.app.Save(courseRecord); err != nil {
		s.app.Logger().Error(
			"failed to save course updating",
			"error", err,
		)
		return CourseResponse{}, err
	}

	return s.toCourseResponse(courseRecord), nil
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

func (s *Service) listMyCourses(userId string) ([]CourseResponse, error) {
	allRecords, err := s.app.FindRecordsByFilter(
		"courses",
		"creatorId = {:userId}",
		"-created",
		0,
		0,
		dbx.Params{
			"userId": userId,
		},
	)

	if err != nil {
		s.app.Logger().Error("failed to fetch courses records",
			"userId", userId,
			"error", err,
		)
		return nil, err
	}

	responses := make([]CourseResponse, 0, len(allRecords))

	for _, record := range allRecords {
		responses = append(responses, s.toCourseResponse(record))
	}

	return responses, nil
}

func (s *Service) getCourseProgress(userId, courseId string) (*CourseProgressResponse, error) {
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return nil, err
	}

	if err := s.canAccessCourse(courseRecord); err != nil {
		return nil, err
	}

	// Videos this user has completed in this course.
	rows, err := s.app.FindRecordsByFilter(
		"video_progress",
		"user = {:userId} && course = {:courseId}",
		"", 0, 0,
		dbx.Params{"userId": userId, "courseId": courseId},
	)
	if err != nil {
		s.app.Logger().Error("failed to load progress", "courseId", courseId, "userId", userId, "error", err)
		return nil, err
	}

	completedIds := make([]string, 0, len(rows)) // never nil, so JSON is [] not null
	for _, r := range rows {
		completedIds = append(completedIds, r.GetString("video"))
	}

	// Total videos in the course, via its chapters.
	total, err := s.app.CountRecords(
		"videos",
		dbx.NewExp(
			"chapterId IN (SELECT id FROM chapters WHERE courseId = {:courseId})",
			dbx.Params{"courseId": courseId},
		),
	)
	if err != nil {
		s.app.Logger().Error("failed to count course videos", "courseId", courseId, "error", err)
		return nil, err
	}

	percent := 0
	if total > 0 {
		percent = len(completedIds) * 100 / int(total)
	}

	return &CourseProgressResponse{
		CompletedVideoIds: completedIds,
		CompletedCount:    len(completedIds),
		TotalVideos:       int(total),
		Percent:           percent,
	}, nil
}

func (s *Service) getMyLearning(userId string) ([]LearningCourseResponse, error) {
	// Query 1: completed count and latest activity per course
	var progressRows []struct {
		Course       string `db:"course"`
		Completed    int    `db:"completed"`
		LastActivity string `db:"lastActivity"`
	}
	err := s.app.DB().
		Select("course", "COUNT(*) AS completed", "MAX(created) AS lastActivity").
		From("video_progress").
		Where(dbx.HashExp{"user": userId}).
		GroupBy("course").
		OrderBy("lastActivity DESC").
		All(&progressRows)
	if err != nil {
		s.app.Logger().Error("failed to load learning progress", "userId", userId, "error", err)
		return nil, err
	}

	result := make([]LearningCourseResponse, 0, len(progressRows)) // [] not null
	if len(progressRows) == 0 {
		return result, nil
	}

	ids := make([]any, 0, len(progressRows))
	idStrings := make([]string, 0, len(progressRows))
	for _, r := range progressRows {
		ids = append(ids, r.Course)
		idStrings = append(idStrings, r.Course)
	}

	// Query 2: total videos per course
	var totalRows []struct {
		CourseId string `db:"courseId"`
		Total    int    `db:"total"`
	}
	err = s.app.DB().
		Select("chapters.courseId AS courseId", "COUNT(videos.id) AS total").
		From("videos").
		InnerJoin("chapters", dbx.NewExp("videos.chapterId = chapters.id")).
		Where(dbx.In("chapters.courseId", ids...)).
		GroupBy("chapters.courseId").
		All(&totalRows)
	if err != nil {
		s.app.Logger().Error("failed to count learning videos", "userId", userId, "error", err)
		return nil, err
	}
	totals := make(map[string]int, len(totalRows))
	for _, t := range totalRows {
		totals[t.CourseId] = t.Total
	}

	// Query 3: course records
	courseRecords, err := s.app.FindRecordsByIds("courses", idStrings)
	if err != nil {
		s.app.Logger().Error("failed to load learning courses", "userId", userId, "error", err)
		return nil, err
	}
	courses := make(map[string]*core.Record, len(courseRecords))
	for _, c := range courseRecords {
		courses[c.Id] = c
	}

	// Keep the order from query 1 (latest activity first)
	for _, r := range progressRows {
		record, ok := courses[r.Course]
		if !ok {
			continue
		}

		total := totals[r.Course]
		percent := 0
		if total > 0 {
			percent = min(100, r.Completed*100/total)
		}

		result = append(result, LearningCourseResponse{
			CourseResponse: s.toCourseResponse(record),
			CompletedCount: r.Completed,
			TotalVideos:    total,
			Percent:        percent,
			LastActivity:   r.LastActivity,
		})
	}

	return result, nil
}
