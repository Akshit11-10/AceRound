// Base URL of the backend API. Configure via a .env file:
//   VITE_API_URL=https://aceround.onrender.com/api
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://aceround.onrender.com/api";

class ApiRequestError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/**
 * Thin fetch wrapper for the AceRound backend.
 * - Always sends credentials so the httpOnly auth cookie is included
 *   (this is why the frontend no longer needs to store a token itself).
 * - Parses JSON responses and throws a readable ApiRequestError on failure.
 */
async function apiFetch(path, { method = "GET", body, signal } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiRequestError(
      "Could not reach the server. Please check your connection and that the API is running.",
      0
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response (e.g. empty body) — leave data as null.
  }

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new ApiRequestError(message, res.status, data?.details);
  }

  return data;
}

export { apiFetch, ApiRequestError };
