package middleware

import (
	"context"

	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

type contextKey string

const UserIdKey contextKey = "userId"

func GetUserId(context.Context) (string, bool) {
	return "", false
}

func requireAuth(r *pocketRouter.Router[*core.RequestEvent]) (*core.Record, error) {
	return nil, nil
}
