import apiClient from "./apiClient";
const API_URL = import.meta.env.VITE_API_URL;

export async function createVideo(chapterId, formData) {
  return apiClient(`/chapters/${chapterId}/videos`, {
    method: "POST",
    body: formData,
  });
}

export async function getVideoMetaData(videoId) {
  return apiClient(`/videos/${videoId}`);
}

export async function updateVideo(videoId, data) {
  return apiClient(`/videos/${videoId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
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
  const response = await fetch(`${API_URL}/videos/${videoId}/content`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error(`video request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.blob();
}
