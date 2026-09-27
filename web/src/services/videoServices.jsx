import apiClient from "./apiClient";

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
