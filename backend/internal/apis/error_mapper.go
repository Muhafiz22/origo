package apis

import (
	"backend/internal/apperr"
	"errors"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/tools/router"
)

func MapError(err error) error {
	if err == nil {
		return nil
	}

	var apiErr *router.ApiError
	if errors.As(err, &apiErr) {
		return apiErr
	}

	var ve *apperr.ValidationError
	switch {
	case errors.As(err, &ve):
		fields := make(validation.Errors, len(ve.Fields))
		for name, msg := range ve.Fields {
			fields[name] = validation.NewError("validation_invalid_value", msg)
		}
		return apis.NewBadRequestError("validation failed", fields)

	case errors.Is(err, apperr.ErrNotFound):
		return apis.NewNotFoundError(apperr.ErrNotFound.Error(), nil)

	case errors.Is(err, apperr.ErrForbidden):
		return apis.NewForbiddenError(apperr.ErrForbidden.Error(), nil)

	case errors.Is(err, apperr.ErrValidation):
		return apis.NewBadRequestError(apperr.ErrValidation.Error(), nil)

	case errors.Is(err, apperr.ErrInvalidToken):
		return apis.NewBadRequestError(apperr.ErrInvalidToken.Error(), nil)

	default:
		return apis.NewApiError(500, "internal server error", nil)
	}
}
