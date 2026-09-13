import apiClient from "./apiClient";

export function getCourses() {
  return apiClient("/courses");
}

export function getCourse(courseId) {
  return apiClient(`/courses/${courseId}`);
}

export function createCourse(data) {
  return apiClient("/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMyCourses() {
  return apiClient("/courses/mine");
}
