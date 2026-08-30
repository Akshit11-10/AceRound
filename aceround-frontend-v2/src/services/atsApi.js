import { apiFetch } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://aceround.onrender.com/api";

export const atsApi = {
  analyze: ({ resumeText, jobDescription }) =>
    apiFetch("/ats/analyze", { method: "POST", body: { resumeText, jobDescription } }),

  improve: ({ resumeText, jobDescription, missingKeywords, formattingIssues, suggestions }) =>
    apiFetch("/ats/improve", {
      method: "POST",
      body: { resumeText, jobDescription, missingKeywords, formattingIssues, suggestions },
    }),

  // Returns a real .docx Blob — bypasses apiFetch since that always parses
  // JSON, but this endpoint returns binary file bytes.
  downloadDocx: async (improvedResumeText) => {
    const res = await fetch(`${API_BASE_URL}/ats/improve/docx`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ improvedResumeText }),
    });
    if (!res.ok) {
      let message = `Request failed with status ${res.status}`;
      try {
        const data = await res.json();
        message = data?.message || message;
      } catch {
        // ignore — not JSON
      }
      throw new Error(message);
    }
    return res.blob();
  },
};
