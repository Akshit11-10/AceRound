// Executes submitted code against Judge0 (https://judge0.com), an open
// source code-execution sandbox. Supports two setups via env vars:
//
//  1. RapidAPI-hosted Judge0 (recommended, has a free tier):
//     JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
//     JUDGE0_API_KEY=<your RapidAPI key>
//     JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
//
//  2. A public/self-hosted instance that needs no key:
//     JUDGE0_API_URL=https://ce.judge0.com
//     (leave JUDGE0_API_KEY unset)
//
// If nothing is configured, JUDGE0_API_URL defaults to the public instance
// above so the coding round works out of the box (may be slower/rate limited).

const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71, // Python 3
};

function getJudge0Config() {
  const baseUrl = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
  const apiKey = process.env.JUDGE0_API_KEY || null;
  const apiHost = process.env.JUDGE0_API_HOST || null;
  return { baseUrl, apiKey, apiHost };
}

/**
 * Runs `sourceCode` (in `language`) once against `stdin` and returns the
 * trimmed stdout (or throws with a readable message on compile/runtime error).
 */
async function runCode({ sourceCode, language, stdin }) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const { baseUrl, apiKey, apiHost } = getJudge0Config();
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["X-RapidAPI-Key"] = apiKey;
  if (apiHost) headers["X-RapidAPI-Host"] = apiHost;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${baseUrl}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin || "",
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Judge0 error ${res.status}: ${errBody.slice(0, 300)}`);
    }

    const data = await res.json();

    // status.id: 3 = Accepted (ran successfully, may still have wrong output).
    // Anything else (compile error, runtime error, timeout) is reported back.
    if (data.status && data.status.id !== 3) {
      const detail = data.compile_output || data.stderr || data.status.description || "Execution failed";
      return { ok: false, output: "", error: detail.toString().slice(0, 500) };
    }

    return { ok: true, output: (data.stdout || "").trim(), error: null };
  } finally {
    clearTimeout(timeout);
  }
}

/** Runs one solution against every test case for a problem, returns pass/fail per case. */
async function runAgainstTestCases({ sourceCode, language, testCases }) {
  const results = [];
  for (const tc of testCases) {
    try {
      const { ok, output, error } = await runCode({ sourceCode, language, stdin: tc.stdin });
      const passed = ok && output === tc.expectedOutput.trim();
      results.push({ passed, output, error });
    } catch (err) {
      results.push({ passed: false, output: "", error: err.message });
    }
  }
  return results;
}

module.exports = { runCode, runAgainstTestCases, LANGUAGE_IDS };
