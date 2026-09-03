import apiClient from "./apiClient";

export function login(credentials){
  return apiClient("/auth/me", {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(credentials)
  })
}

export function logout(){
  return apiClient("/auth/login", {
    method: "POST",
  })
}

export function getCurrentUser(){
  return apiClient("/auth/me");
}
