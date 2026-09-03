package auth

import (
	"net/http"
	"os"
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/hook"
)

const (
	sessionCookieName = "origo_session"
	sessionCookiePath = "/"
	sessionDuration   = 7 * 24 * time.Hour
)

func isProduction() bool {
	return os.Getenv("APP_ENV") == "production"
}

func setSessionCookie(e *core.RequestEvent, token string) {
	http.SetCookie(e.Response, &http.Cookie{
		Name:     sessionCookieName,
		Value:    token,
		Path:     sessionCookiePath,
		MaxAge:   int(sessionDuration.Seconds()),
		HttpOnly: true,
		Secure:   isProduction(),
		SameSite: http.SameSiteLaxMode,
	})
}

func clearSessionCookie(e *core.RequestEvent) {
	http.SetCookie(e.Response, &http.Cookie{
		Name:     sessionCookieName,
		Value:    "",
		Path:     sessionCookiePath,
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   isProduction(),
		SameSite: http.SameSiteLaxMode,
	})
}

func LoadAuthCookieMiddleware() *hook.Handler[*core.RequestEvent] {
	return &hook.Handler[*core.RequestEvent]{
		Id:       "loadAuthCookie",
		Priority: apis.DefaultLoadAuthTokenMiddlewarePriority + 1,
		Func: func(e *core.RequestEvent) error {
			if e.Auth != nil {
				return e.Next()
			}

			cookie, err := e.Request.Cookie(sessionCookieName)
			if err != nil || cookie.Value == "" {
				return e.Next()
			}

			record, err := e.App.FindAuthRecordByToken(cookie.Value, core.TokenTypeAuth)
			if err == nil && record != nil {
				e.Auth = record
			}

			return e.Next()
		},
	}
}
