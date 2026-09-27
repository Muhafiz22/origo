import apiClient from "./apiClient";

export function getCourses() {
  return apiClient(`/courses`);
}

export function getCourse(courseId) {
  return apiClient(`/courses/${courseId}`);
}

export function getMyCourses() {
  return apiClient(`/courses/mine`);
}

export function createCourse(data) {
  return apiClient(`/courses`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCourse(courseId, data) {
  return apiClient(`/courses/${courseId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCourse(courseId) {
  return apiClient(`/courses/${courseId}`, {
    method: "DELETE",
  });
}
