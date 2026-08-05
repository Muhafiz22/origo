package apis

import (
	"backend/internal/apperr"
	"errors"
	"github.com/pocketbase/pocketbase/apis"
)

func MapError(err error) error {
	if err == nil {
		return nil
	}

	var ve *apperr.ValidationError
	switch {
	case errors.As(err, &ve):
		return apis.NewBadRequestError("validation failed", ve.Fields)

	case errors.Is(err, apperr.ErrNotFound):
		return apis.NewNotFoundError(err.Error(), nil)

	case errors.Is(err, apperr.ErrForbidden):
		return apis.NewForbiddenError(err.Error(), nil)

	case errors.Is(err, apperr.ErrValidation):
		return apis.NewBadRequestError(err.Error(), nil)

	default:
		return apis.NewApiError(500, "internal server error", nil)
	}
}
