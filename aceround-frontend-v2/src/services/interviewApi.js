import { apiFetch } from "./api";

export const questionApi = {
  roles: () => apiFetch("/questions/roles"),
};

export const resumeApi = {
  // Uploads a PDF/.txt resume, returns { text } extracted server-side.
  extract: async (file) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const formData = new FormData();
    formData.append("resume", file);
    const res = await fetch(`${API_BASE_URL}/resume/extract`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Failed to process resume.");
    return data;
  },
};

export const adminApi = {
  stats: () => apiFetch("/admin/stats"),
  users: (page = 1, limit = 25) => apiFetch(`/admin/users?page=${page}&limit=${limit}`),
};

export const interviewApi = {
  // Starts a new interview: backend generates questions (AI or static fallback),
  // stores the answer key server-side, and returns only question text + options.
  start: (role, options = {}) => apiFetch("/interviews/start", { method: "POST", body: { role, ...options } }),

  // Submits answers for scoring. Correct answers/explanations only come back now.
  submit: (interviewId, answers, timeSpent) =>
    apiFetch(`/interviews/${interviewId}/submit`, {
      method: "POST",
      body: { answers, timeSpent },
    }),

  // Summary list for the Dashboard / "previous reviews" list.
  list: () => apiFetch("/interviews"),

  // Full detail (questions + correct answers) for a single completed interview.
  get: (interviewId) => apiFetch(`/interviews/${interviewId}`),
};
