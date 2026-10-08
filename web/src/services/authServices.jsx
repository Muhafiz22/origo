import apiClient from "./apiClient";

export function signup(credentials) {
  return apiClient("/auth/register", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export function verifyEmail(token) {
  return apiClient("/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export function resendVerificationEmail(email) {
  return apiClient("/auth/resend-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export function login(credentials) {
  return apiClient("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export function logout() {
  return apiClient("/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return apiClient("/auth/me");
}

export function forgotPassowrd(email) {
  return apiClient("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(data) {
  return apiClient("/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
