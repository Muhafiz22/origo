import apiClient from "./apiClient";

export function getChapters(courseId){
    return apiClient(`/courses/${courseId}/chapters`)
}
