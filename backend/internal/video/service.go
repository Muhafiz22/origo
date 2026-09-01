package video

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

func (s *Service) updateVideo(userId string, videoId string, req UpdateVideoRequest) error {
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
		return err
	}

	return nil
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

func (s *Service) listVideos(chapterId string) ([]VideoMetadataResponse, error) {
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
			"failed to fetch videos record",
			"chapterId", chapterId,
			"error", err,
		)
		return nil, err
	}

	responses := make([]VideoMetadataResponse, 0, len(allRecords))

	for _, record := range allRecords {
		responses = append(responses, toVideoMetadataResponse(record))
	}

	return responses, nil
}
