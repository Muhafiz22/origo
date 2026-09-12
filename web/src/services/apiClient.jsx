const API_URL = import.meta.env.VITE_API_URL;

async function apiClient(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status}`);
    error.status = response.status;

    throw error;
  }

  return response.json();
}

export default apiClient;
