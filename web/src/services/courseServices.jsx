import apiClient from "./apiClient";

export function getCourses() {
  return apiClient("/courses");
}

export function getCourse(id) {
  return apiClient(`/courses/${id}`);
}
