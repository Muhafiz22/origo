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

export function updateChapter(chapterId, data) {
  return apiClient(`/chapters/${chapterId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteChapter(chapterId) {
  return apiClient(`/chapters/${chapterId}`, {
    method: "DELETE",
  });
}
