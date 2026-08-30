// Drives the live back-and-forth AI Interview round. Reuses the same
// AI_PROVIDER / API key env vars as aiQuestionService.js, but this is a
// plain conversational chat — not MCQ generation — so it has its own
// prompt-building and request logic.

const GEMINI_ENDPOINT = (model, apiKey) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const MAX_EXCHANGES = 8; // roughly how many AI questions before wrapping up

function buildSystemPrompt({ source, role, resumeText, weakTopics }) {
  const contextLine =
    source === "resume"
      ? `The candidate's resume (use their actual skills/projects to ask relevant questions):\n"""${(resumeText || "").slice(0, 3000)}"""`
      : `The candidate is interviewing for the role: "${role}".`;

  const weakLine =
    weakTopics && weakTopics.length
      ? `\nThe candidate struggled with these topics in an earlier MCQ round — probe these a bit more if relevant: ${weakTopics
          .slice(0, 5)
          .join("; ")}`
      : "";

  return `You are a friendly but rigorous technical interviewer conducting a live mock interview.

${contextLine}${weakLine}

Rules:
- Ask ONE question at a time, in plain natural language (no numbering, no markdown).
- Mix technical/role-specific questions with a couple of behavioral ones (e.g. "tell me about a challenge you faced").
- Ask natural follow-up questions when an answer is vague or incomplete, like a real interviewer would.
- Keep each message short (2-4 sentences max).
- After roughly ${MAX_EXCHANGES} exchanges, wrap up warmly and set "done" to true.
- Always respond with ONLY valid JSON, no markdown fences, matching exactly:
{"message": "string", "done": boolean}`;
}

function buildFeedbackPrompt({ source, role, transcript }) {
  const convo = transcript.map((t) => `${t.role === "ai" ? "Interviewer" : "Candidate"}: ${t.text}`).join("\n");
  const contextLine = source === "resume" ? "based on their resume" : `for the role "${role}"`;

  return `You are an expert interview coach. Below is a full transcript of a mock interview ${contextLine}.

Transcript:
"""
${convo.slice(0, 6000)}
"""

Evaluate the candidate's communication clarity and technical/behavioral answer quality. Respond with ONLY valid JSON, no markdown fences, matching exactly:
{"score": <integer 0-100>, "feedback": "string, 3-5 sentences, specific and constructive"}`;
}

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

async function callGemini(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(GEMINI_ENDPOINT(model, apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
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

async function callOpenAiCompatible(endpoint, model, apiKey, systemPrompt, userPrompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
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

async function callProvider(systemPrompt, userPrompt) {
  const provider = (process.env.AI_PROVIDER || "none").toLowerCase();

  if (provider === "gemini") return callGemini(systemPrompt, userPrompt);
  if (provider === "openai") {
    return callOpenAiCompatible(
      OPENAI_ENDPOINT,
      process.env.OPENAI_MODEL || "gpt-5-mini",
      process.env.OPENAI_API_KEY,
      systemPrompt,
      userPrompt
    );
  }
  if (provider === "groq") {
    return callOpenAiCompatible(
      GROQ_ENDPOINT,
      process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      process.env.GROQ_API_KEY,
      systemPrompt,
      userPrompt
    );
  }
  throw new Error("No AI provider configured");
}

/**
 * Gets the interviewer's opening question (no user answer yet).
 */
async function startInterviewConversation({ source, role, resumeText, weakTopics }) {
  const systemPrompt = buildSystemPrompt({ source, role, resumeText, weakTopics });
  try {
    const parsed = await callProvider(systemPrompt, "Begin the interview with a warm greeting and your first question.");
    return { message: String(parsed.message || "").trim(), done: !!parsed.done };
  } catch (err) {
    console.warn(`[interviewChatService] start failed: ${err.message}`);
    return {
      message: "Hi! Thanks for joining. Let's get started — tell me a little about yourself and your background.",
      done: false,
    };
  }
}

/**
 * Gets the interviewer's next message, given the full conversation so far
 * (including the candidate's latest answer as the last entry).
 */
async function continueInterviewConversation({ source, role, resumeText, weakTopics, transcript }) {
  const systemPrompt = buildSystemPrompt({ source, role, resumeText, weakTopics });
  const convo = transcript.map((t) => `${t.role === "ai" ? "Interviewer" : "Candidate"}: ${t.text}`).join("\n");
  const userPrompt = `Conversation so far:\n"""\n${convo}\n"""\n\nRespond with the interviewer's next message.`;

  try {
    const parsed = await callProvider(systemPrompt, userPrompt);
    return { message: String(parsed.message || "").trim(), done: !!parsed.done };
  } catch (err) {
    console.warn(`[interviewChatService] continue failed: ${err.message}`);
    return {
      message: "That's helpful, thank you. Let's wrap up here — thanks for your time today!",
      done: true,
    };
  }
}

/** Generates final score + feedback from the full transcript. */
async function generateInterviewFeedback({ source, role, transcript }) {
  if (!transcript || transcript.length === 0) {
    return { score: 0, feedback: "No conversation took place, so no feedback could be generated." };
  }
  const systemPrompt =
    "You are an expert, fair, and constructive interview coach. Always respond with only valid JSON, no markdown.";
  const userPrompt = buildFeedbackPrompt({ source, role, transcript });

  try {
    const parsed = await callProvider(systemPrompt, userPrompt);
    const score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
    return { score, feedback: String(parsed.feedback || "").trim() || "No detailed feedback available." };
  } catch (err) {
    console.warn(`[interviewChatService] feedback failed: ${err.message}`);
    return { score: 50, feedback: "Feedback generation is temporarily unavailable — your transcript has been saved." };
  }
}

module.exports = { startInterviewConversation, continueInterviewConversation, generateInterviewFeedback, MAX_EXCHANGES };
