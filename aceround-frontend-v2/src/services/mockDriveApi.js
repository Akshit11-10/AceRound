import { apiFetch } from "./api";

export const mockDriveApi = {
  start: ({ source, role, resumeText }) =>
    apiFetch("/mock-drive/start", { method: "POST", body: { source, role, resumeText } }),

  get: (id) => apiFetch(`/mock-drive/${id}`),

  list: () => apiFetch("/mock-drive"),

  startMcq: (id) => apiFetch(`/mock-drive/${id}/mcq/start`, { method: "POST" }),

  submitMcq: (id, answers) =>
    apiFetch(`/mock-drive/${id}/mcq/submit`, { method: "POST", body: { answers } }),
};
