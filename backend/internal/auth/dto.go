package auth

// POST /auth/register
type RegisterRequest struct { //client -> server
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterResult struct { //internal only
	UserId           string
	VerificationSent bool
}

type RegisterResponse struct { // server -> client
	UserId           string `json:"userId"`
	VerificationSent bool   `json:"verificationSent"`
}

// POST /auth/resend-verification
type ResendVerificationRequest struct { //client -> server
	Email string `json:"email"`
}

// POST /auth/verify
type VerifyRequest struct {
	Token string `json:"token"`
}

// POST /auth/login
type LoginRequest struct { //client -> server
	Identity string `json:"identity"`
	Password string `json:"password"`
}

// POST /auth/forgot-password
type ForgotPasswordRequest struct { //client -> server
	Email string `json:"email"`
}

// POST /auth/reset-password
type ResetPasswordRequest struct { //client -> server
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}
