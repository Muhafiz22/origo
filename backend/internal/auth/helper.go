package auth

import (
	"backend/internal/apperr"
	"errors"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/mails"
	"strings"
)

func (s *Service) sendVerification(record *core.Record) RegisterResponse {
	result := RegisterResponse{UserId: record.Id}

	if err := mails.SendRecordVerification(s.app, record); err != nil {
		s.app.Logger().Error(
			"failed to send verification email",
			"userId", record.Id,
			"email", record.Email(),
			"error", err,
		)
		return result
	}

	result.VerificationSent = true
	return result
}

// mapSaveError converts PocketBase save errors into field-level validation errors.
func mapSaveError(err error) error {
	if joined, ok := err.(interface{ Unwrap() []error }); ok {
		fieldErrors := make(map[string]error)
		for _, e := range joined.Unwrap() {
			field, msg, found := strings.Cut(e.Error(), ": ")
			if found {
				fieldErrors[field] = errors.New(msg)
			} else {
				fieldErrors["_"] = e
			}
		}
		return apperr.FromValidationErrors(fieldErrors)
	}
	return err
}
