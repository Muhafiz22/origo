package user

import (
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

func (s *Service) getUserProfile(record *core.Record) UserProfileResponse {
	response := UserProfileResponse{
		UserId:    record.Id,
		Name:      record.GetString("name"),
		Email:     record.GetString("email"),
		Verified:  record.GetBool("verified"),
		Avatar:    record.GetString("avatar"),
		CreatedAt: record.GetDateTime("created"),
		UpdatedAt: record.GetDateTime("updated"),
	}
	return response
}

func (s *Service) updateUserProfile(record *core.Record, req UpdateUserProfileRequest) error {

	if req.Name != nil {
		record.Set("name", *req.Name)
	}
	if req.Avatar != nil {
		record.Set("avatar", *req.Avatar)
	}
	if req.Bio != nil {
		record.Set("bio", *req.Bio)
	}

	if err := s.app.Save(record); err != nil {
		return err
	}

	return nil
}
