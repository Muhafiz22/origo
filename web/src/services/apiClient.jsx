export const API_BASE = "/api/v1";

export class ApiError extends Error {
  constructor(message, status = 0, fields = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields; // { fieldName: "message" }
  }
  get isNetwork() {
    return this.status === 0;
  }
  get isServer() {
    return this.status >= 500;
  }
  get hasFields() {
    return Object.keys(this.fields).length > 0;
  }
}

function extractFields(data) {
  const fields = {};
  for (const [name, detail] of Object.entries(data?.data ?? {})) {
    if (detail?.message) fields[name] = detail.message;
  }
  return fields;
}

async function apiClient(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      credentials: "include",
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Unable to reach the server", 0);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed (${response.status})`,
      response.status,
      extractFields(data),
    );
  }

  return data;
}

export default apiClient;
