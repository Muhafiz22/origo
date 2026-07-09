package user

import (
	"github.com/pocketbase/pocketbase/tools/types"
)

type GetUserProfileRequest struct {
	Token string `json:"token"`
}

type UserProfileResponse struct {
	UserId    string         `json:"userId"`
	Name      string         `json:"name"`
	Email     string         `json:"email"`
	Verified  bool           `json:"verified"`
	Bio       string         `json:"bio"`
	Avatar    string         `json:"avatar"`
	CreatedAt types.DateTime `json:"createdAt"`
	UpdatedAt types.DateTime `json:"updatedAt"`
}

type UpdateUserProfileRequest struct {
	Name   *string
	Bio    *string
	Avatar *string
}
