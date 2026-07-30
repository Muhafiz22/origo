package course

import "github.com/pocketbase/pocketbase/core"

func toCourseResponse(record *core.Record) CourseResponse {
	response := CourseResponse{
		CourseId:    record.Id,
		Name:        record.GetString("name"),
		Description: record.GetString("description"),
		CreatedAt:   record.GetDateTime("created"),
		UpdatedAt:   record.GetDateTime("updated"),
	}
	return response
}
