// aceround-frontend-v2/src/services/mockDriveApi.js
import { apiFetch } from "./api";

export const mockDriveApi = {
  start: ({ source, role, resumeText }) =>
    apiFetch("/mock-drive/start", { method: "POST", body: { source, role, resumeText } }),

  get: (id) => apiFetch(`/mock-drive/${id}`),

  list: () => apiFetch("/mock-drive"),
};