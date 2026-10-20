import apiClient from "./apiClient";
import { API_BASE } from "./apiClient";

export async function createVideo(chapterId, data) {
  return apiClient(`/chapters/${chapterId}/videos`, {
    method: "POST",
    body: data,
  });
}

export async function getVideoMetaData(videoId) {
  return apiClient(`/videos/${videoId}`);
}

export async function updateVideo(videoId, data) {
  const result = await apiClient(`/videos/${videoId}`, {
    method: "PATCH",
    body: data,
  });

  return result;
}

export async function deleteVideo(videoId) {
  return apiClient(`/videos/${videoId}`, {
    method: "DELETE",
  });
}

export async function getVideos(chapterId) {
  return apiClient(`/chapters/${chapterId}/videos`);
}

export async function getVideoContent(videoId) {
  const response = await fetch(`${API_BASE}/videos/${videoId}/content`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = new Error(`video request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.blob();
}

export async function markVideoDone(videoId) {
  return apiClient(`/videos/${videoId}/progress`, {
    method: "PUT",
  });
}

export async function unmarkVideoDone(videoId) {
  return apiClient(`/videos/${videoId}/progress`, {
    method: "DELETE",
  });
}

export async function getCourseProgress(courseId) {
  return apiClient(`/courses/${courseId}/progress`);
}
