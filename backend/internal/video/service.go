package video

import (
	"backend/internal/apperr"

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

func (s *Service) getVideoMetadata() error {
	return nil
}

func (s *Service) getVideoContent() error {
	return nil
}
