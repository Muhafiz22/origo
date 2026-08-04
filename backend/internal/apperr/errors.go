package apperr

import (
	"errors"
)

var (
	ErrNotFound   = errors.New("not found")
	ErrForbidden  = errors.New("forbidden")
	ErrValidation = errors.New("validation failed")
)

type ValidationError struct {
	Fields map[string]string
}

func (e *ValidationError) Error() string {
	return ErrValidation.Error()
}

func (e *ValidationError) Unwrap() error {
	return ErrValidation
}

func FromValidationErrors(errs map[string]error) *ValidationError {
	fields := make(map[string]string, len(errs))

	for field, fieldErr := range errs {
		fields[field] = fieldErr.Error()
	}

	return &ValidationError{Fields: fields}
}
