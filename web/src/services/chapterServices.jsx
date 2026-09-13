import apiClient from "./apiClient";

export function getChapters(courseId) {
  return apiClient(`/courses/${courseId}/chapters`);
}

export function createChapter(courseId, data) {
  return apiClient(`/courses/${courseId}/chapters`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
