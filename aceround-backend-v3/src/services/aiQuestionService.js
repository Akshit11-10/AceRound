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

function buildPrompt(role, count, { difficulty = "medium", targetCompany, resumeText } = {}) {
  const difficultyLine = DIFFICULTY_GUIDANCE[difficulty] || DIFFICULTY_GUIDANCE.medium;

  const companyBlock = targetCompany
    ? `
Company focus: "${targetCompany}"
- Write these questions in the style and spirit of interviews commonly reported for "${targetCompany}" (topics, depth, and phrasing patterns candidates have publicly described from that company's interviews). Do not claim these are verbatim official questions — style-match only.
- At the very end of EACH question's "question" text, append the company name in parentheses, e.g. "...? (${targetCompany})".`
    : "";

  const resumeBlock = resumeText
    ? `
Candidate background (resume/skills summary, use this to tailor question topics toward their actual experience where relevant, while still covering core "${role}" fundamentals):
"""
${resumeText.slice(0, 4000)}
"""`
    : "";

  return `You are an expert technical interviewer. Generate exactly ${count} unique, high-quality multiple-choice interview questions for a candidate interviewing for the role: "${role}".

Difficulty level: ${difficulty}. ${difficultyLine}
${companyBlock}${resumeBlock}

Rules:
- Mix of conceptual and practical questions appropriate for the role and difficulty level above.
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

async function generateWithGemini(role, count, options) {
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
          contents: [{ role: "user", parts: [{ text: buildPrompt(role, count, options) }] }],
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
      return normalizeQuestions(parsed, count);
    } catch (err) {
      lastErr = err;
      if (attempt >= maxAttempts) throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastErr;
}

async function generateWithOpenAI(role, count, options) {
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
          { role: "user", content: buildPrompt(role, count, options) },
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
    return normalizeQuestions(parsed, count);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Groq — free tier, no credit card, extremely fast (custom LPU hardware).
 * Uses an OpenAI-compatible chat-completions API, so the request shape
 * mirrors generateWithOpenAI() almost exactly, just pointed at Groq's host
 * and using an open-weight model (Llama 3.3 70B by default).
 */
async function generateWithGroq(role, count, options) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

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
          { role: "user", content: buildPrompt(role, count, options) },
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
    return normalizeQuestions(parsed, count);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Generates `count` MCQ questions for `role`.
 * Tries the configured AI provider first; on any failure (missing key,
 * network error, malformed output) it transparently falls back to the
 * static local question bank so an interview can always start.
 *
 * `options`: { difficulty?: 'easy'|'medium'|'hard', targetCompany?: string, resumeText?: string }
 * These only affect AI-generated questions — the static fallback bank is
 * fixed content and ignores them.
 *
 * Returns: { questions, source: 'ai' | 'static', provider: string|null }
 */
async function generateQuestions(role, count = Number(process.env.DEFAULT_QUESTION_COUNT) || 20, options = {}) {
  const provider = (process.env.AI_PROVIDER || "none").toLowerCase();
  const supportedProviders = { gemini: generateWithGemini, openai: generateWithOpenAI, groq: generateWithGroq };

  if (supportedProviders[provider]) {
    try {
      const questions = await supportedProviders[provider](role, count, options);
      return { questions, source: "ai", provider };
    } catch (err) {
      console.warn(`[aiQuestionService] ${provider} generation failed, falling back to static bank: ${err.message}`);
    }
  }

  const fallback = getFallbackQuestions(role);
  if (fallback) {
    return { questions: fallback.slice(0, count), source: "static", provider: null };
  }

  // Unknown role and AI unavailable/failed: use the generic bank as a last resort.
  const generic = getFallbackQuestions("Node.js Developer");
  return { questions: (generic || []).slice(0, count), source: "static", provider: null };
}

function getAvailableRoles() {
  return FALLBACK_ROLES;
}

module.exports = { generateQuestions, getAvailableRoles };
