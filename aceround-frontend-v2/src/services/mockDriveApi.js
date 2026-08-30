import { apiFetch } from "./api";

export const mockDriveApi = {
  start: ({ source, role, resumeText }) =>
    apiFetch("/mock-drive/start", { method: "POST", body: { source, role, resumeText } }),

  get: (id) => apiFetch(`/mock-drive/${id}`),

  list: () => apiFetch("/mock-drive"),

  startMcq: (id) => apiFetch(`/mock-drive/${id}/mcq/start`, { method: "POST" }),

  submitMcq: (id, answers) =>
    apiFetch(`/mock-drive/${id}/mcq/submit`, { method: "POST", body: { answers } }),

  getCoding: (id) => apiFetch(`/mock-drive/${id}/coding`),

  runCoding: (id, { problemId, language, sourceCode }) =>
    apiFetch(`/mock-drive/${id}/coding/run`, {
      method: "POST",
      body: { problemId, language, sourceCode },
    }),

  submitCoding: (id, { problemId, language, sourceCode }) =>
    apiFetch(`/mock-drive/${id}/coding/submit`, {
      method: "POST",
      body: { problemId, language, sourceCode },
    }),

  getInterview: (id) => apiFetch(`/mock-drive/${id}/interview`),

  startInterview: (id) => apiFetch(`/mock-drive/${id}/interview/start`, { method: "POST" }),

  respondInterview: (id, message) =>
    apiFetch(`/mock-drive/${id}/interview/respond`, { method: "POST", body: { message } }),

  finishInterview: (id) => apiFetch(`/mock-drive/${id}/interview/finish`, { method: "POST" }),
};
