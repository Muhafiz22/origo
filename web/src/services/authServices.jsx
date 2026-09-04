import apiClient from "./apiClient";

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

export function signup(credentials) {
  return apiClient("/auth/register", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(credentials),
  });
}
