import apiClient from "./apiClient";

export function getCourses() {
  return apiClient("/courses");
}

export function getCourse(courseId) {
  return apiClient(`/courses/${courseId}`);
}
