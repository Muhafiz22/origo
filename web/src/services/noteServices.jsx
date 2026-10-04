import apiClient from "./apiClient";
const API_URL = import.meta.env.VITE_API_URL;

export async function createNote(chapterId, formData) {
  return apiClient(`/chapters/${chapterId}/notes`, {
    method: "POST",
    body: formData,
  });
}

export async function getNoteMetadata(noteId) {
  return apiClient(`/notes/${noteId}`);
}

export async function getNotes(chapterId) {
  return apiClient(`/chapters/${chapterId}/notes`);
}

export async function updateNote(noteId, data) {
  return apiClient(`/notes/${noteId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteNote(noteId) {
  return apiClient(`/notes/${noteId}`, {
    method: "DELETE",
  });
}
