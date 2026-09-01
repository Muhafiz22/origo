import apiClient from "./apiClient";

export function getVideos(chapterId){
  return apiClient(`/chapters/${chapterId}/videos`)
}
