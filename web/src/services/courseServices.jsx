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
    body: data,
  });
}

export async function updateCourse(courseId, data) {
  const result = await apiClient(`/courses/${courseId}`, {
    method: "PATCH",
    body: data,
  });

  return result;
}

export function deleteCourse(courseId) {
  return apiClient(`/courses/${courseId}`, {
    method: "DELETE",
  });
}

export function getMyLearning(){
  return apiClient(`/courses/mylearning`)
}
