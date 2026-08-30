// Standalone Resume ATS Checker — analyzes resume text (optionally against
// a job description) and returns an ATS-style match score, missing
// keywords, formatting issues, and improvement suggestions. Independent of
// the Mock Drive pipeline. Reuses the same AI_PROVIDER env vars as the
// other AI services, but has its own prompt/response shape.

const GEMINI_ENDPOINT = (model, apiKey) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

function extractJson(text) {
  if (!text) throw new Error("Empty AI response");
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) throw new Error("No JSON object found in AI response");
  cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  return JSON.parse(cleaned);
}

function buildPrompt({ resumeText, jobDescription }) {
  const jdBlock = jobDescription
    ? `Job description to match against:\n"""${jobDescription.slice(0, 3000)}"""`
    : "No specific job description was provided — evaluate general ATS-friendliness and resume quality instead.";

  return `You are an expert ATS (Applicant Tracking System) analyzer and resume coach.

Resume text:
"""${resumeText.slice(0, 6000)}"""

${jdBlock}

Analyze the resume and respond with ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "score": <integer 0-100, how well this resume would perform in an ATS scan${
    jobDescription ? " and match this specific job" : ""
  }>,
  "missingKeywords": ["up to 8 important keywords/skills the resume is missing or under-emphasizes"],
  "formattingIssues": ["up to 5 concrete formatting/structure problems that hurt ATS parsing, e.g. tables, missing sections, inconsistent dates"],
  "suggestions": ["up to 6 specific, actionable improvements, e.g. add quantifiable achievements, add a skills section"]
}`;
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(GEMINI_ENDPOINT(model, apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
      }),
    });
    if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    return extractJson(text);
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenAiCompatible(endpoint, model, apiKey, prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert ATS analyzer. Always respond with only valid JSON, no markdown.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    return extractJson(text);
  } finally {
    clearTimeout(timeout);
  }
}

async function callProvider(prompt) {
  const provider = (process.env.AI_PROVIDER || "none").toLowerCase();

  if (provider === "gemini") return callGemini(prompt);
  if (provider === "openai") {
    return callOpenAiCompatible(OPENAI_ENDPOINT, process.env.OPENAI_MODEL || "gpt-5-mini", process.env.OPENAI_API_KEY, prompt);
  }
  if (provider === "groq") {
    return callOpenAiCompatible(GROQ_ENDPOINT, process.env.GROQ_MODEL || "openai/gpt-oss-120b", process.env.GROQ_API_KEY, prompt);
  }
  throw new Error("No AI provider configured");
}

async function analyzeResumeAts({ resumeText, jobDescription }) {
  const prompt = buildPrompt({ resumeText, jobDescription });

  try {
    const parsed = await callProvider(prompt);
    return {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords.slice(0, 8) : [],
      formattingIssues: Array.isArray(parsed.formattingIssues) ? parsed.formattingIssues.slice(0, 5) : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 6) : [],
    };
  } catch (err) {
    console.warn(`[atsAnalysisService] analysis failed: ${err.message}`);
    throw new Error("Could not analyze the resume right now. Please try again.");
  }
}

function buildImprovePrompt({ resumeText, jobDescription, missingKeywords, formattingIssues, suggestions }) {
  const jdBlock = jobDescription ? `Target job description:\n"""${jobDescription.slice(0, 3000)}"""\n` : "";

  return `You are an expert resume writer. Rewrite the resume below to fix the identified issues and improve its ATS score — WITHOUT inventing any facts, employers, dates, numbers, or achievements that are not already present or clearly implied in the original.

Original resume:
"""${resumeText.slice(0, 6000)}"""

${jdBlock}
Issues to address:
- Missing keywords to naturally incorporate (only where genuinely relevant to the candidate's real skills/experience): ${missingKeywords.join(", ") || "none"}
- Formatting issues to fix: ${formattingIssues.join("; ") || "none"}
- Suggestions to apply: ${suggestions.join("; ") || "none"}

Rules:
- Do NOT fabricate employers, job titles, dates, degrees, or metrics that aren't in the original.
- You MAY improve phrasing, structure, section organization, and word choice.
- You MAY naturally weave in missing keywords only where they genuinely fit the candidate's real background.
- Use clear plain-text section headers (e.g. "EXPERIENCE", "EDUCATION", "SKILLS") in ALL CAPS, one per line.
- Use "- " for bullet points. No markdown symbols like ** or #.
- Output ONLY the improved resume text, nothing else (no preamble, no explanation).`;
}

async function improveResume({ resumeText, jobDescription, missingKeywords, formattingIssues, suggestions }) {
  const prompt = buildImprovePrompt({ resumeText, jobDescription, missingKeywords, formattingIssues, suggestions });
  const provider = (process.env.AI_PROVIDER || "none").toLowerCase();

  try {
    let text;
    if (provider === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
      const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      try {
        const res = await fetch(GEMINI_ENDPOINT(model, apiKey), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.5 },
          }),
        });
        if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
        const data = await res.json();
        text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
      } finally {
        clearTimeout(timeout);
      }
    } else {
      const endpoint = provider === "openai" ? OPENAI_ENDPOINT : GROQ_ENDPOINT;
      const model =
        provider === "openai"
          ? process.env.OPENAI_MODEL || "gpt-5-mini"
          : process.env.GROQ_MODEL || "openai/gpt-oss-120b";
      const apiKey = provider === "openai" ? process.env.OPENAI_API_KEY : process.env.GROQ_API_KEY;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "You are an expert, honest resume writer. Never invent facts." },
              { role: "user", content: prompt },
            ],
            temperature: 0.5,
          }),
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        text = data?.choices?.[0]?.message?.content || "";
      } finally {
        clearTimeout(timeout);
      }
    }

    const improved = (text || "").trim();
    if (!improved) throw new Error("Empty response");
    return improved;
  } catch (err) {
    console.warn(`[atsAnalysisService] improveResume failed: ${err.message}`);
    throw new Error("Could not generate an improved resume right now. Please try again.");
  }
}

module.exports = { analyzeResumeAts, improveResume };
