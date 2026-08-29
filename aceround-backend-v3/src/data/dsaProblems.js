// A small, fixed bank of basic DSA problems (Arrays/Strings) used for the
// Coding Round of every Mock Drive, regardless of role or resume. Each
// problem reads input from stdin and must print the answer to stdout —
// this keeps execution simple and works the same across any language
// Judge0 supports.
//
// testCases: each has raw stdin text and the exact expected stdout text
// (trimmed before comparing, so trailing newline differences don't matter).

const DSA_PROBLEMS = [
  {
    id: "dsa-1",
    title: "Sum of Array",
    description:
      "Read an integer n, then n space-separated integers on the next line. Print their sum.",
    starterCode: {
      javascript:
        "// Read input from stdin, print the sum to stdout\nconst lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconsole.log(arr.reduce((a, b) => a + b, 0));\n",
      python:
        "# Read input from stdin, print the sum to stdout\nn = int(input())\narr = list(map(int, input().split()))\nprint(sum(arr))\n",
    },
    testCases: [
      { stdin: "5\n1 2 3 4 5\n", expectedOutput: "15" },
      { stdin: "3\n10 -2 7\n", expectedOutput: "15" },
      { stdin: "1\n42\n", expectedOutput: "42" },
    ],
  },
  {
    id: "dsa-2",
    title: "Reverse a String",
    description: "Read a single line string. Print it reversed.",
    starterCode: {
      javascript:
        "const line = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n')[0];\nconsole.log(line.split('').reverse().join(''));\n",
      python: "s = input()\nprint(s[::-1])\n",
    },
    testCases: [
      { stdin: "hello\n", expectedOutput: "olleh" },
      { stdin: "AceRound\n", expectedOutput: "dnuoRecA" },
      { stdin: "a\n", expectedOutput: "a" },
    ],
  },
  {
    id: "dsa-3",
    title: "Find the Maximum",
    description:
      "Read an integer n, then n space-separated integers on the next line. Print the maximum value.",
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].trim().split(' ').map(Number);\nconsole.log(Math.max(...arr));\n",
      python: "n = int(input())\narr = list(map(int, input().split()))\nprint(max(arr))\n",
    },
    testCases: [
      { stdin: "4\n3 7 2 9\n", expectedOutput: "9" },
      { stdin: "3\n-5 -1 -8\n", expectedOutput: "-1" },
      { stdin: "1\n100\n", expectedOutput: "100" },
    ],
  },
  {
    id: "dsa-4",
    title: "Check Palindrome",
    description:
      "Read a single line string. Print 'true' if it reads the same forwards and backwards, else print 'false'.",
    starterCode: {
      javascript:
        "const line = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n')[0].trim();\nconsole.log(line === line.split('').reverse().join('') ? 'true' : 'false');\n",
      python: "s = input().strip()\nprint('true' if s == s[::-1] else 'false')\n",
    },
    testCases: [
      { stdin: "madam\n", expectedOutput: "true" },
      { stdin: "hello\n", expectedOutput: "false" },
      { stdin: "a\n", expectedOutput: "true" },
    ],
  },
];

const CODING_PASS_COUNT = 2; // out of DSA_PROBLEMS.length, must solve at least this many

function getDsaProblems() {
  return DSA_PROBLEMS;
}

function getDsaProblemById(id) {
  return DSA_PROBLEMS.find((p) => p.id === id) || null;
}

module.exports = { getDsaProblems, getDsaProblemById, CODING_PASS_COUNT };
