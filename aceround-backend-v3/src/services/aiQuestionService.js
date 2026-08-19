const { getFallbackQuestions, ROLES: FALLBACK_ROLES } = require("./fallbackQuestions");

const GEMINI_ENDPOINT = (model, apiKey) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

// Groq: free, no credit card, very fast (LPU hardware). Uses an OpenAI-compatible API.
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const DIFFICULTY_GUIDANCE = {
  easy: "Keep questions beginner-friendly — fundamental concepts, definitions, and simple practical scenarios. Avoid trick questions.",
  medium: "Mix of solid conceptual questions and moderately tricky practical scenarios, suitable for someone with 1-3 years of experience.",
  hard: "Challenging, in-depth questions covering edge cases, system design trade-offs, and advanced practical scenarios, suitable for a senior candidate.",
};

const JSON_SHAPE_RULES = `Rules:
- Each question must have exactly 4 options.
- Exactly one option is correct.
- Include a short (1-3 sentence) explanation of why the correct answer is right.
- Do not repeat questions or trivially rephrase the same question twice.
- Output ONLY valid JSON, no markdown fences, no commentary, matching exactly this shape:

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ]
}

"correctAnswer" is the zero-based index into "options" of the correct choice.`;

/**
 * Builds the generation prompt for one of three independent modes:
 *  - "role"    : classic role + difficulty based questions.
 *  - "company" : questions styled after a specific company's commonly
 *                reported interview questions — no role needed.
 *  - "resume"  : questions based strictly on the skills found in an
 *                uploaded resume — no role needed.
 */
function buildPrompt({ mode = "role", role, count, difficulty = "medium", targetCompany, resumeText }) {
  const difficultyLine = DIFFICULTY_GUIDANCE[difficulty] || DIFFICULTY_GUIDANCE.medium;

  if (mode === "company") {
    return `You are an expert technical interviewer with deep knowledge of "${targetCompany}"'s hiring process.

Generate exactly ${count} unique multiple-choice interview questions in the style and spirit of questions commonly reported by candidates who interviewed at "${targetCompany}" (topics, depth, phrasing patterns, and typical focus areas for that company). Draw on publicly known patterns rather than claiming these are verbatim leaked questions.

Difficulty level: ${difficulty}. ${difficultyLine}

At the very end of EACH question's "question" text, append the company name in parentheses, e.g. "...? (${targetCompany})".

${JSON_SHAPE_RULES}`;
  }

  if (mode === "resume") {
    return `You are an expert technical interviewer. Below is a candidate's resume text.

Step 1: Identify the candidate's technical skills — from an explicit "Skills" section if present, and also from technologies mentioned in their experience/projects.
Step 2: Generate exactly ${count} unique multiple-choice interview questions testing ONLY those specific skills/technologies you identified — not generic questions unrelated to their actual background.

Difficulty level: ${difficulty}. ${difficultyLine}

Resume:
"""
${(resumeText || "").slice(0, 4000)}
"""

${JSON_SHAPE_RULES}`;
  }

  // Default: "role" mode
  return `You are an expert technical interviewer. Generate exactly ${count} unique, high-quality multiple-choice interview questions for a candidate interviewing for the role: "${role}".

Difficulty level: ${difficulty}. ${difficultyLine}

${JSON_SHAPE_RULES}`;
}

/**
 * Extracts a JSON object from a raw model text response, tolerating
 * accidental markdown code fences around the JSON.
 */
function extractJson(text) {
  if (!text) throw new Error("Empty AI response");
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in AI response");
  }
  cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  return JSON.parse(cleaned);
}

/** Validates and normalizes the parsed AI payload into our internal question shape. */
function normalizeQuestions(parsed, count) {
  const list = Array.isArray(parsed?.questions) ? parsed.questions : null;
  if (!list || list.length === 0) throw new Error("AI response missing 'questions' array");

  const normalized = [];
  for (const q of list) {
    if (
      typeof q.question !== "string" ||
      !Array.isArray(q.options) ||
      q.options.length < 2 ||
      typeof q.correctAnswer !== "number" ||
      q.correctAnswer < 0 ||
      q.correctAnswer >= q.options.length
    ) {
      continue; // skip malformed entries rather than failing the whole batch
    }
    normalized.push({
      question: q.question.trim(),
      options: q.options.map((o) => String(o).trim()),
      correctAnswer: q.correctAnswer,
      explanation: typeof q.explanation === "string" ? q.explanation.trim() : "",
    });
  }

  if (normalized.length === 0) throw new Error("AI response had no valid questions after validation");
  return normalized.slice(0, count);
}

async function generateWithGemini(params) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const maxAttempts = 2;
  let lastErr;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(GEMINI_ENDPOINT(model, apiKey), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: buildPrompt(params) }] }],
          generationConfig: {
            temperature: 0.9,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        // 503 = model temporarily overloaded on Google's side. Worth a short retry.
        // 429 = rate limited. Also worth a brief backoff-retry.
        if ((res.status === 503 || res.status === 429) && attempt < maxAttempts) {
          const backoffMs = attempt * 1000;
          console.warn(`[aiQuestionService] Gemini ${res.status}, retrying in ${backoffMs}ms (attempt ${attempt}/${maxAttempts})`);
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        throw new Error(`Gemini API error ${res.status}: ${errBody.slice(0, 300)}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
      const parsed = extractJson(text);
      return normalizeQuestions(parsed, params.count);
    } catch (err) {
      lastErr = err;
      if (attempt >= maxAttempts) throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastErr;
}

async function generateWithOpenAI(params) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  const model = process.env.OPENAI_MODEL || "gpt-5-mini";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You output only strict JSON. No prose, no markdown." },
          { role: "user", content: buildPrompt(params) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`OpenAI API error ${res.status}: ${errBody.slice(0, 300)}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const parsed = extractJson(text);
    return normalizeQuestions(parsed, params.count);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Groq — free tier, no credit card, extremely fast (custom LPU hardware).
 * Uses an OpenAI-compatible chat-completions API, so the request shape
 * mirrors generateWithOpenAI() almost exactly, just pointed at Groq's host.
 */
async function generateWithGroq(params) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You output only strict JSON. No prose, no markdown." },
          { role: "user", content: buildPrompt(params) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Groq API error ${res.status}: ${errBody.slice(0, 300)}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const parsed = extractJson(text);
    return normalizeQuestions(parsed, params.count);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Generates MCQ questions for one of three modes — see buildPrompt() above.
 * Tries the configured AI provider first; on any failure (missing key,
 * network error, malformed output) it transparently falls back to the
 * static local question bank so an interview can always start.
 *
 * `params`: { mode: 'role'|'company'|'resume', role?, count, difficulty?, targetCompany?, resumeText? }
 * The static fallback bank only has content for "role" mode (fixed content,
 * keyed by role name) — company/resume mode always requires AI to work
 * meaningfully, so if AI is unavailable in those modes we fall back to a
 * generic role bank as a last resort rather than leaving the user stuck.
 *
 * Returns: { questions, source: 'ai' | 'static', provider: string|null }
 */
async function generateQuestions(params) {
  const { mode = "role", role, count = Number(process.env.DEFAULT_QUESTION_COUNT) || 20 } = params;
  const provider = (process.env.AI_PROVIDER || "none").toLowerCase();
  const supportedProviders = { gemini: generateWithGemini, openai: generateWithOpenAI, groq: generateWithGroq };

  if (supportedProviders[provider]) {
    try {
      const questions = await supportedProviders[provider]({ ...params, mode, count });
      return { questions, source: "ai", provider };
    } catch (err) {
      console.warn(`[aiQuestionService] ${provider} generation failed, falling back to static bank: ${err.message}`);
    }
  }

  // Static fallback only makes sense for "role" mode — company/resume mode
  // has no equivalent static content, so fall back to a generic role bank.
  const fallback = mode === "role" ? getFallbackQuestions(role) : null;
  if (fallback) {
    return { questions: fallback.slice(0, count), source: "static", provider: null };
  }

  const generic = getFallbackQuestions("Node.js Developer");
  return { questions: (generic || []).slice(0, count), source: "static", provider: null };
}

function getAvailableRoles() {
  return FALLBACK_ROLES;
}

module.exports = { generateQuestions, getAvailableRoles };
