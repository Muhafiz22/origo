package note

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

func (s *Service) Filesystem() (*filesystem.System, error) {
	fsys, err := s.app.NewFilesystem()
	if err != nil {
		return nil, err
	}

	return fsys, nil
}

func (s *Service) createNote(userId string, chapterId string, req CreateNoteRequest, noteFile *filesystem.File) (NoteMetadataResponse, error) {
	chapterRecord, err := s.isValidChapter(chapterId)
	if err != nil {
		return NoteMetadataResponse{}, err
	}

	courseId := chapterRecord.GetString("courseId")
	courseRecord, err := s.isValidCourse(courseId)
	if err != nil {
		return NoteMetadataResponse{}, err
	}

	if !isCourseCreator(courseRecord, userId) {
		return NoteMetadataResponse{}, apperr.ErrForbidden
	}

	notes, err := s.app.FindCollectionByNameOrId("notes")
	if err != nil {
		s.app.Logger().Error(
			"failed to find notes collection",
			"error", err,
		)
		return NoteMetadataResponse{}, err
	}

	record := core.NewRecord(notes)

	record.Set("title", req.Title)
	record.Set("description", req.Description)
	record.Set("chapterId", chapterId)
	record.Set("note", noteFile)

	if err := s.app.Save(record); err != nil {
		s.app.Logger().Error(
			"failed to save note record",
			"error", err,
		)
		return NoteMetadataResponse{}, err
	}

	return toNoteMetadataResponse(record), nil
}

func (s *Service) getNoteMetadata(noteId string) (NoteMetadataResponse, error) {
	noteRecord, err := s.isValidNote(noteId)
	if err != nil {
		return NoteMetadataResponse{}, err
	}

	return toNoteMetadataResponse(noteRecord), nil
}

func (s *Service) getNoteForContent(noteId string) (*core.Record, error) {
	noteRecord, err := s.isValidNote(noteId)
	if err != nil {
		return nil, err
	}

	if err := s.canAccessNote(noteRecord); err != nil {
		return nil, err
	}

	return noteRecord, nil
}

func (s *Service) updateNote(userId string, noteId string, req UpdateNoteRequest) error {
	noteRecord, err := s.isValidNote(noteId)
	if err != nil {
		return err
	}

	chapterId := noteRecord.GetString("chapterId")
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
		noteRecord.Set("title", *req.Title)
	}

	if req.Description != nil {
		noteRecord.Set("description", *req.Description)
	}

	if err := s.app.Save(noteRecord); err != nil {
		s.app.Logger().Error(
			"failed to save note",
			"error", err,
		)
		return err
	}

	return nil
}

func (s *Service) deleteNote(userId string, noteId string) error {
	noteRecord, err := s.isValidNote(noteId)
	if err != nil {
		return err
	}

	chapterId := noteRecord.GetString("chapterId")
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

	if err := s.app.Delete(noteRecord); err != nil {
		s.app.Logger().Error(
			"failed to delete note",
			"error", err,
		)
		return err
	}

	return nil
}
