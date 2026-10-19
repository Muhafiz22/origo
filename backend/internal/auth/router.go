package auth

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	pocketRouter "github.com/pocketbase/pocketbase/tools/router"
)

func RegisterRoutes(r *pocketRouter.RouterGroup[*core.RequestEvent], h *Handler, cfg Config) {

	r.GET("/auth/config", h.authConfigHandler)

	r.GET("/auth/me", h.authenticateMeHandler).Bind(apis.RequireAuth("users"))

	r.POST("/auth/register", h.registerHandler)

	r.POST("/auth/login", h.loginHandler)

	r.POST("/auth/logout", h.logoutHandler)

	if cfg.EmailAuthEnabled() {

		r.POST("/auth/verify", h.verifyHandler)
		r.POST("/auth/resend-verification", h.resendVerificationHandler)
		r.POST("/auth/forgot-password", h.forgotPasswordHandler)
		r.POST("/auth/reset-password", h.resetPasswordHandler)
	}
}
