import { apiFetch } from "./api";

export const atsApi = {
  analyze: ({ resumeText, jobDescription }) =>
    apiFetch("/ats/analyze", { method: "POST", body: { resumeText, jobDescription } }),
};
