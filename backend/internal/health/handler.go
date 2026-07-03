package health

import (
	"net/http"

	"github.com/pocketbase/pocketbase/core"
)

func HealthHandler(e *core.RequestEvent) error {
	return e.JSON(http.StatusOK, map[string]string{
		"status": "Ok",
	})
}
