package video

import (
	"backend/internal/apperr"

	"errors"

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

/*

HACK:
	1. improve function parameters passing for createVideo()

*/

func (s *Service) createVideo(chapterId string, userId string, req CreateVideoRequest, videoFile, thumbnailFile *filesystem.File) (VideoMetadataResponse, error) {
	chapterRecord, err := s.isValidChapter(chapterId)
	if err != nil {
		return VideoMetadataResponse{}, err
	}

	courseId := chapterRecord.GetString("courseId")
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return VideoMetadataResponse{}, err
	}

	if !isCourseCreator(courseRecord, userId) {
		return VideoMetadataResponse{}, apperr.ErrForbidden
	}

	videos, err := s.app.FindCollectionByNameOrId("videos")
	if err != nil {
		s.app.Logger().Error(
			"failed to find videos collection",
			"error", err,
		)
		return VideoMetadataResponse{}, err
	}

	record := core.NewRecord(videos)

	record.Set("title", req.Title)
	record.Set("description", req.Description)
	record.Set("duration", req.Duration)
	record.Set("chapterId", chapterId)
	record.Set("video", videoFile)
	record.Set("thumbnail", thumbnailFile)

	if err := s.app.Save(record); err != nil {
		s.app.Logger().Error("failed to save video record", "error", err)
		return VideoMetadataResponse{}, err
	}

	return toVideoMetadataResponse(record), nil
}

func (s *Service) getVideoMetadata(videoId string) (VideoMetadataResponse, error) {
	videoRecord, err := s.isValidVideo(videoId)
	if err != nil {
		return VideoMetadataResponse{}, err
	}
	return toVideoMetadataResponse(videoRecord), nil
}

func (s *Service) getVideoForContent(videoId string) (*core.Record, error) {
	videoRecord, err := s.isValidVideo(videoId)
	if err != nil {
		return nil, err
	}

	if err := s.canAccessVideo(videoRecord); err != nil {
		return nil, err
	}

	return videoRecord, nil
}

func (s *Service) updateVideo(userId string, videoId string, req UpdateVideoRequest) (VideoMetadataResponse, error) {
	videoRecord, err := s.isValidVideo(videoId)
	if err != nil {
		return VideoMetadataResponse{}, err
	}

	chapterId := videoRecord.GetString("chapterId")
	chapterRecord, err := s.isValidChapter(chapterId)
	if err != nil {
		return VideoMetadataResponse{}, err
	}

	courseId := chapterRecord.GetString("courseId")
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return VideoMetadataResponse{}, err
	}

	if !isCourseCreator(courseRecord, userId) {
		return VideoMetadataResponse{}, apperr.ErrForbidden
	}

	if req.Title != nil {
		videoRecord.Set("title", *req.Title)
	}
	if req.Description != nil {
		videoRecord.Set("description", *req.Description)
	}
	if req.Duration != nil {
		videoRecord.Set("duration", *req.Duration)
	}

	if err := s.app.Save(videoRecord); err != nil {
		s.app.Logger().Error(
			"failed to save video",
			"error", err,
		)
		return VideoMetadataResponse{}, err
	}

	return toVideoMetadataResponse(videoRecord), nil
}

func (s *Service) deleteVideo(userId string, videoId string) error {
	videoRecord, err := s.isValidVideo(videoId)
	if err != nil {
		return err
	}

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

	if !isCourseCreator(courseRecord, userId) {
		return apperr.ErrForbidden
	}

	if err := s.app.Delete(videoRecord); err != nil {
		s.app.Logger().Error(
			"failed to delete video",
			"error", err,
		)
		return err
	}

	return nil
}

func (s *Service) getChapterVideos(chapterId string) ([]VideoMetadataResponse, error) {
	allRecords, err := s.app.FindRecordsByFilter(
		"videos",
		"chapterId = {:chapterId}",
		"created",
		0,
		0,
		dbx.Params{
			"chapterId": chapterId,
		},
	)

	if err != nil {
		s.app.Logger().Error(
			"failed to get videos record",
			"chapterId", chapterId,
			"error", err,
		)
		return nil, err
	}

	response := make([]VideoMetadataResponse, 0, len(allRecords))

	for _, record := range allRecords {
		response = append(response, toVideoMetadataResponse(record))
	}

	return response, nil
}

func (s *Service) markVideoDone(userId, videoId string) error {
	videoRecord, err := s.isValidVideo(videoId)
	if err != nil {
		return err
	}

	if err := s.canAccessVideo(videoRecord); err != nil {
		return err
	}

	chapterRecord, err := s.isValidChapter(
		videoRecord.GetString("chapterId"),
	)
	if err != nil {
		return err
	}

	courseId := chapterRecord.GetString("courseId")

	_, err = s.findVideoProgress(userId, videoId)
	switch {
	case err == nil:
		// Already completed; marking is idempotent.
		return nil
	case errors.Is(err, apperr.ErrNotFound):
		// No completion record; create one below.
	default:
		s.app.Logger().Error(
			"failed to find video progress",
			"videoId", videoId,
			"userId", userId,
			"error", err,
		)
		return err
	}

	collection, err := s.app.FindCollectionByNameOrId("video_progress")
	if err != nil {
		s.app.Logger().Error(
			"failed to find video_progress collection",
			"error", err,
		)
		return err
	}

	record := core.NewRecord(collection)
	record.Set("user", userId)
	record.Set("video", videoId)
	record.Set("course", courseId)

	if err := s.app.Save(record); err != nil {
		// Another request may have created the record concurrently.
		_, lookupErr := s.findVideoProgress(userId, videoId)
		if lookupErr == nil {
			return nil
		}

		s.app.Logger().Error(
			"failed to mark video as done",
			"videoId", videoId,
			"userId", userId,
			"saveError", err,
			"lookupError", lookupErr,
		)
		return err
	}

	return nil
}

func (s *Service) unmarkVideoDone(userId, videoId string) error {
	videoRecord, err := s.isValidVideo(videoId)
	if err != nil {
		return err
	}

	if err := s.canAccessVideo(videoRecord); err != nil {
		return err
	}

	record, err := s.findVideoProgress(userId, videoId)
	if err != nil {
		if errors.Is(err, apperr.ErrNotFound) {
			// Already unmarked; the desired state exists.
			return nil
		}

		s.app.Logger().Error(
			"failed to find video progress",
			"videoId", videoId,
			"userId", userId,
			"error", err,
		)
		return err
	}

	if err := s.app.Delete(record); err != nil {
		s.app.Logger().Error(
			"failed to unmark video as done",
			"videoId", videoId,
			"userId", userId,
			"error", err,
		)
		return err
	}

	return nil
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
