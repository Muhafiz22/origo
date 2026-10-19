import apiClient from "./apiClient";
import { API_BASE } from "./apiClient";

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

export async function getNoteContent(noteId) {
  const response = await fetch(`${API_BASE}/notes/${noteId}/content`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = new Error(`note request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.blob();
}
