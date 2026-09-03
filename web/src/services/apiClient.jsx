const API_URL = import.meta.env.VITE_API_URL;

async function apiClient(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status}`);
    error.status = response.status;

    throw error;
  }

  return response.json();
}

export default apiClient;
