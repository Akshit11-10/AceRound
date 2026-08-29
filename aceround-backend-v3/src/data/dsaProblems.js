// LeetCode-style DSA problems (Arrays/Strings), same 4 problems for every
// drive. For JavaScript/Python, the user only writes the function body —
// the backend appends a hidden "driver" (built from testCases) before
// sending to Judge0, so no stdin/stdout code is ever shown to the user.
// For Java/C/C++, a full runnable program is provided with a clearly
// marked section for the user's solution; the test data is baked into the
// boilerplate itself (still real logic, just not blind-hidden for those languages).

const DSA_PROBLEMS = [
  {
    id: "dsa-1",
    title: "Sum of Array",
    functionName: { javascript: "sumArray", python: "sum_array" },
    description: "Implement a function that returns the sum of all numbers in an array.",
    testCases: [
      { args: [[1, 2, 3, 4, 5]], expected: 15 },
      { args: [[10, -2, 7]], expected: 15 },
      { args: [[42]], expected: 42 },
    ],
    example: { input: "[1, 2, 3, 4, 5]", output: "15" },
    starterCode: {
      javascript: "function sumArray(arr) {\n  // your code here\n}",
      python: "def sum_array(arr):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static int sumArray(int[] arr) {
        return 0;
    }
    // -----------------------------------

    public static void main(String[] args) {
        int[] a1 = {1, 2, 3, 4, 5};
        int[] a2 = {10, -2, 7};
        int[] a3 = {42};
        System.out.println(sumArray(a1));
        System.out.println(sumArray(a2));
        System.out.println(sumArray(a3));
    }
}`,
      c: `#include <stdio.h>

// ---- Write your solution here ----
int sumArray(int arr[], int n) {
    return 0;
}
// -----------------------------------

int main() {
    int a1[] = {1, 2, 3, 4, 5};
    int a2[] = {10, -2, 7};
    int a3[] = {42};
    printf("%d\\n", sumArray(a1, 5));
    printf("%d\\n", sumArray(a2, 3));
    printf("%d\\n", sumArray(a3, 1));
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
int sumArray(vector<int> arr) {
    return 0;
}
// -----------------------------------

int main() {
    cout << sumArray({1, 2, 3, 4, 5}) << "\\n";
    cout << sumArray({10, -2, 7}) << "\\n";
    cout << sumArray({42}) << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-2",
    title: "Reverse a String",
    functionName: { javascript: "reverseString", python: "reverse_string" },
    description: "Implement a function that returns the reverse of the given string.",
    testCases: [
      { args: ["hello"], expected: "olleh" },
      { args: ["AceRound"], expected: "dnuoRecA" },
      { args: ["a"], expected: "a" },
    ],
    example: { input: '"hello"', output: '"olleh"' },
    starterCode: {
      javascript: "function reverseString(s) {\n  // your code here\n}",
      python: "def reverse_string(s):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static String reverseString(String s) {
        return null;
    }
    // -----------------------------------

    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
        System.out.println(reverseString("AceRound"));
        System.out.println(reverseString("a"));
    }
}`,
      c: `#include <stdio.h>
#include <string.h>

// ---- Write your solution here ----
// Reverse the string in place.
void reverseString(char* s) {
}
// -----------------------------------

int main() {
    char a1[] = "hello";
    char a2[] = "AceRound";
    char a3[] = "a";
    reverseString(a1); printf("%s\\n", a1);
    reverseString(a2); printf("%s\\n", a2);
    reverseString(a3); printf("%s\\n", a3);
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
string reverseString(string s) {
    return "";
}
// -----------------------------------

int main() {
    cout << reverseString("hello") << "\\n";
    cout << reverseString("AceRound") << "\\n";
    cout << reverseString("a") << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-3",
    title: "Find the Maximum",
    functionName: { javascript: "findMax", python: "find_max" },
    description: "Implement a function that returns the maximum value in an array.",
    testCases: [
      { args: [[3, 7, 2, 9]], expected: 9 },
      { args: [[-5, -1, -8]], expected: -1 },
      { args: [[100]], expected: 100 },
    ],
    example: { input: "[3, 7, 2, 9]", output: "9" },
    starterCode: {
      javascript: "function findMax(arr) {\n  // your code here\n}",
      python: "def find_max(arr):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static int findMax(int[] arr) {
        return 0;
    }
    // -----------------------------------

    public static void main(String[] args) {
        int[] a1 = {3, 7, 2, 9};
        int[] a2 = {-5, -1, -8};
        int[] a3 = {100};
        System.out.println(findMax(a1));
        System.out.println(findMax(a2));
        System.out.println(findMax(a3));
    }
}`,
      c: `#include <stdio.h>

// ---- Write your solution here ----
int findMax(int arr[], int n) {
    return 0;
}
// -----------------------------------

int main() {
    int a1[] = {3, 7, 2, 9};
    int a2[] = {-5, -1, -8};
    int a3[] = {100};
    printf("%d\\n", findMax(a1, 4));
    printf("%d\\n", findMax(a2, 3));
    printf("%d\\n", findMax(a3, 1));
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
int findMax(vector<int> arr) {
    return 0;
}
// -----------------------------------

int main() {
    cout << findMax({3, 7, 2, 9}) << "\\n";
    cout << findMax({-5, -1, -8}) << "\\n";
    cout << findMax({100}) << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-4",
    title: "Check Palindrome",
    functionName: { javascript: "isPalindrome", python: "is_palindrome" },
    description: "Implement a function that returns true if the string reads the same forwards and backwards.",
    testCases: [
      { args: ["madam"], expected: true },
      { args: ["hello"], expected: false },
      { args: ["a"], expected: true },
    ],
    example: { input: '"madam"', output: "true" },
    starterCode: {
      javascript: "function isPalindrome(s) {\n  // your code here\n}",
      python: "def is_palindrome(s):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static boolean isPalindrome(String s) {
        return false;
    }
    // -----------------------------------

    public static void main(String[] args) {
        System.out.println(isPalindrome("madam"));
        System.out.println(isPalindrome("hello"));
        System.out.println(isPalindrome("a"));
    }
}`,
      c: `#include <stdio.h>
#include <string.h>

// ---- Write your solution here ----
// Return 1 if s is a palindrome, 0 otherwise.
int isPalindrome(char* s) {
    return 0;
}
// -----------------------------------

int main() {
    char a1[] = "madam";
    char a2[] = "hello";
    char a3[] = "a";
    printf("%s\\n", isPalindrome(a1) ? "true" : "false");
    printf("%s\\n", isPalindrome(a2) ? "true" : "false");
    printf("%s\\n", isPalindrome(a3) ? "true" : "false");
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
bool isPalindrome(string s) {
    return false;
}
// -----------------------------------

int main() {
    cout << (isPalindrome("madam") ? "true" : "false") << "\\n";
    cout << (isPalindrome("hello") ? "true" : "false") << "\\n";
    cout << (isPalindrome("a") ? "true" : "false") << "\\n";
    return 0;
}`,
    },
  },
];

const CODING_PASS_COUNT = 2; // out of DSA_PROBLEMS.length, must solve at least this many
const SECONDS_PER_PROBLEM = 5 * 60; // 5 min per question -> 20 min total for 4

function getDsaProblems() {
  return DSA_PROBLEMS;
}

function getDsaProblemById(id) {
  return DSA_PROBLEMS.find((p) => p.id === id) || null;
}

module.exports = {
  getDsaProblems,
  getDsaProblemById,
  CODING_PASS_COUNT,
  SECONDS_PER_PROBLEM,
};
