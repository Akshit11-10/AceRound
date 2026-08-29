// Executes submitted code via Judge0 (https://judge0.com), an open source
// code-execution sandbox. Supports two setups via env vars:
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
  javascript: 63, // Node.js (12.14.0)
  python: 71, // Python (3.8.1)
  java: 62, // Java (OpenJDK 13.0.1)
  c: 50, // C (GCC 9.2.0)
  cpp: 54, // C++ (GCC 9.2.0)
};

function getJudge0Config() {
  const baseUrl = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
  const apiKey = process.env.JUDGE0_API_KEY || null;
  const apiHost = process.env.JUDGE0_API_HOST || null;
  return { baseUrl, apiKey, apiHost };
}

/**
 * Runs `sourceCode` (in `language`) once (no stdin needed — all our
 * programs embed their own test data) and returns the trimmed stdout.
 */
async function runCode({ sourceCode, language }) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const { baseUrl, apiKey, apiHost } = getJudge0Config();
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["X-RapidAPI-Key"] = apiKey;
  if (apiHost) headers["X-RapidAPI-Host"] = apiHost;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(`${baseUrl}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Judge0 error ${res.status}: ${errBody.slice(0, 300)}`);
    }

    const data = await res.json();

    // status.id: 3 = Accepted (ran successfully, may still have wrong output).
    if (data.status && data.status.id !== 3) {
      const detail = data.compile_output || data.stderr || data.status.description || "Execution failed";
      return { ok: false, output: "", error: detail.toString().slice(0, 800) };
    }

    return { ok: true, output: (data.stdout || "").trim(), error: null };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * For JavaScript/Python only: builds the full source by appending a driver
 * (built from the given test cases) after the user's function-only code.
 * The driver calls the function once per test case and prints each result
 * on its own line — so a single Judge0 call grades every test case.
 */
function buildJsPythonDriver({ userCode, language, functionName, testCases }) {
  const argsList = testCases.map((tc) => tc.args[0]);

  if (language === "javascript") {
    const casesLiteral = JSON.stringify(argsList);
    return `${userCode}

const __cases = ${casesLiteral};
for (const __c of __cases) {
  const __r = ${functionName}(__c);
  console.log(typeof __r === "boolean" ? (__r ? "true" : "false") : String(__r));
}
`;
  }

  if (language === "python") {
    const casesLiteral = JSON.stringify(argsList); // valid Python literal too
    return `${userCode}

__cases = ${casesLiteral}
for __c in __cases:
    __r = ${functionName}(__c)
    print("true" if __r is True else "false" if __r is False else __r)
`;
  }

  throw new Error(`buildJsPythonDriver does not support language: ${language}`);
}

/** Builds the expected multi-line output string from a problem's test cases. */
function buildExpectedOutput(testCases) {
  return testCases
    .map((tc) => {
      if (typeof tc.expected === "boolean") return tc.expected ? "true" : "false";
      return String(tc.expected);
    })
    .join("\n");
}

/**
 * Runs a full grading pass for one problem submission.
 * - For javascript/python: `userCode` should be just the function definition
 *   (matching `functionName`); a driver is appended automatically.
 * - For java/c/cpp: `userCode` is already a full, runnable program (the
 *   provided boilerplate with the user's edits) and is sent as-is.
 * `testCases` controls how many cases are checked (pass a 1-item array for
 * a quick "Run" preview using just the visible example, or the full set for
 * a real "Submit").
 */
async function gradeSubmission({ userCode, language, functionName, testCases }) {
  const isFunctionOnly = language === "javascript" || language === "python";

  const sourceCode = isFunctionOnly
    ? buildJsPythonDriver({ userCode, language, functionName, testCases })
    : userCode;

  const { ok, output, error } = await runCode({ sourceCode, language });

  if (!ok) {
    return { passed: false, allPassed: false, output: "", error, lineResults: [] };
  }

  const expectedLines = buildExpectedOutput(testCases).split("\n");
  const actualLines = output.split("\n").map((l) => l.trim());

  const lineResults = expectedLines.map((expectedLine, i) => ({
    expected: expectedLine,
    actual: actualLines[i] ?? "",
    passed: (actualLines[i] ?? "") === expectedLine,
  }));

  const allPassed = lineResults.every((r) => r.passed);

  return { passed: allPassed, allPassed, output, error: null, lineResults };
}

module.exports = { runCode, gradeSubmission, LANGUAGE_IDS };
