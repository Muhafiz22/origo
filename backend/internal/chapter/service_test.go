package chapter_test

import (
	"testing"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
)

const testDataDir = "../../testdata/pb_data"

func TestInspectSaveInvalidRelationError(t *testing.T) {
	app, err := tests.NewTestApp(testDataDir)
	if err != nil {
		t.Fatal(err)
	}
	defer app.Cleanup()

	collection, err := app.FindCollectionByNameOrId("chapters")
	if err != nil {
		t.Fatalf("chapters collection not found: %v", err)
	}

	record := core.NewRecord(collection)
	record.Set("title", "Valid Title")
	record.Set("order_index", 1)
	record.Set("courseId", "nonexistent_course_id_123") // valid-looking but doesn't exist

	err = app.Save(record)

	t.Logf("error type: %T", err)
	t.Logf("error value: %v", err)

	if ve, ok := err.(validation.Errors); ok {
		for field, fieldErr := range ve {
			if eo, ok := fieldErr.(validation.ErrorObject); ok {
				t.Logf("field=%q code=%q msg=%q", field, eo.Code(), eo.Message())
			}
		}
	} else {
		t.Logf("NOT validation.Errors — different error shape entirely")
	}
}
