package user

import (
	"net/http"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func createUserHandler(e *core.RequestEvent) error {
	var req CreateUserRequest

	if err := e.BindBody(&req); err != nil {
		return err
	}

	if req.Username == "" {
		return apis.NewBadRequestError("username is required", nil)
	}

	if req.Email == "" {
		return apis.NewBadRequestError("email is required", nil)
	}

	id, err := createUser(req)

	if err != nil {
		return err
	}

	resp := CreateUserResponse{
		UserId: id,
	}

	return e.JSON(http.StatusCreated, resp)
}
