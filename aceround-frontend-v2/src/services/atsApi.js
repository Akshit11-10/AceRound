import { apiFetch } from "./api";

export const atsApi = {
  analyze: ({ resumeText, jobDescription }) =>
    apiFetch("/ats/analyze", { method: "POST", body: { resumeText, jobDescription } }),

  improve: ({ resumeText, jobDescription, missingKeywords, formattingIssues, suggestions }) =>
    apiFetch("/ats/improve", {
      method: "POST",
      body: { resumeText, jobDescription, missingKeywords, formattingIssues, suggestions },
    }),
};
