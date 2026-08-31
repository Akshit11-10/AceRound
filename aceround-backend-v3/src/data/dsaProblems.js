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

  {
    id: "dsa-5",
    title: "Count Vowels",
    functionName: { javascript: "countVowels", python: "count_vowels" },
    description: "Implement a function that returns how many vowels (a, e, i, o, u) are in the given string.",
    testCases: [
      { args: ["hello"], expected: 2 },
      { args: ["AceRound"], expected: 4 },
      { args: ["xyz"], expected: 0 },
    ],
    example: { input: '"hello"', output: "2" },
    starterCode: {
      javascript: "function countVowels(s) {\n  // your code here\n}",
      python: "def count_vowels(s):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static int countVowels(String s) {
        return 0;
    }
    // -----------------------------------

    public static void main(String[] args) {
        System.out.println(countVowels("hello"));
        System.out.println(countVowels("AceRound"));
        System.out.println(countVowels("xyz"));
    }
}`,
      c: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

// ---- Write your solution here ----
int countVowels(char* s) {
    return 0;
}
// -----------------------------------

int main() {
    char a1[] = "hello";
    char a2[] = "AceRound";
    char a3[] = "xyz";
    printf("%d\\n", countVowels(a1));
    printf("%d\\n", countVowels(a2));
    printf("%d\\n", countVowels(a3));
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
int countVowels(string s) {
    return 0;
}
// -----------------------------------

int main() {
    cout << countVowels("hello") << "\\n";
    cout << countVowels("AceRound") << "\\n";
    cout << countVowels("xyz") << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-6",
    title: "Second Largest",
    functionName: { javascript: "secondLargest", python: "second_largest" },
    description: "Implement a function that returns the second largest distinct value in an array.",
    testCases: [
      { args: [[3, 7, 2, 9]], expected: 7 },
      { args: [[10, 20, 30]], expected: 20 },
      { args: [[5, 1, 5, 3]], expected: 3 },
    ],
    example: { input: "[3, 7, 2, 9]", output: "7" },
    starterCode: {
      javascript: "function secondLargest(arr) {\n  // your code here\n}",
      python: "def second_largest(arr):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static int secondLargest(int[] arr) {
        return 0;
    }
    // -----------------------------------

    public static void main(String[] args) {
        int[] a1 = {3, 7, 2, 9};
        int[] a2 = {10, 20, 30};
        int[] a3 = {5, 1, 5, 3};
        System.out.println(secondLargest(a1));
        System.out.println(secondLargest(a2));
        System.out.println(secondLargest(a3));
    }
}`,
      c: `#include <stdio.h>

// ---- Write your solution here ----
int secondLargest(int arr[], int n) {
    return 0;
}
// -----------------------------------

int main() {
    int a1[] = {3, 7, 2, 9};
    int a2[] = {10, 20, 30};
    int a3[] = {5, 1, 5, 3};
    printf("%d\\n", secondLargest(a1, 4));
    printf("%d\\n", secondLargest(a2, 3));
    printf("%d\\n", secondLargest(a3, 4));
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
int secondLargest(vector<int> arr) {
    return 0;
}
// -----------------------------------

int main() {
    cout << secondLargest({3, 7, 2, 9}) << "\\n";
    cout << secondLargest({10, 20, 30}) << "\\n";
    cout << secondLargest({5, 1, 5, 3}) << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-7",
    title: "Is Sorted (Ascending)",
    functionName: { javascript: "isSorted", python: "is_sorted" },
    description: "Implement a function that returns true if the array is sorted in ascending order.",
    testCases: [
      { args: [[1, 2, 3, 4]], expected: true },
      { args: [[3, 1, 2]], expected: false },
      { args: [[5]], expected: true },
    ],
    example: { input: "[1, 2, 3, 4]", output: "true" },
    starterCode: {
      javascript: "function isSorted(arr) {\n  // your code here\n}",
      python: "def is_sorted(arr):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static boolean isSorted(int[] arr) {
        return false;
    }
    // -----------------------------------

    public static void main(String[] args) {
        int[] a1 = {1, 2, 3, 4};
        int[] a2 = {3, 1, 2};
        int[] a3 = {5};
        System.out.println(isSorted(a1));
        System.out.println(isSorted(a2));
        System.out.println(isSorted(a3));
    }
}`,
      c: `#include <stdio.h>

// ---- Write your solution here ----
// Return 1 if sorted ascending, 0 otherwise.
int isSorted(int arr[], int n) {
    return 0;
}
// -----------------------------------

int main() {
    int a1[] = {1, 2, 3, 4};
    int a2[] = {3, 1, 2};
    int a3[] = {5};
    printf("%s\\n", isSorted(a1, 4) ? "true" : "false");
    printf("%s\\n", isSorted(a2, 3) ? "true" : "false");
    printf("%s\\n", isSorted(a3, 1) ? "true" : "false");
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
bool isSorted(vector<int> arr) {
    return false;
}
// -----------------------------------

int main() {
    cout << (isSorted({1, 2, 3, 4}) ? "true" : "false") << "\\n";
    cout << (isSorted({3, 1, 2}) ? "true" : "false") << "\\n";
    cout << (isSorted({5}) ? "true" : "false") << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-8",
    title: "Count Positive Numbers",
    functionName: { javascript: "countPositives", python: "count_positives" },
    description: "Implement a function that returns how many numbers in the array are greater than zero.",
    testCases: [
      { args: [[1, -2, 3, -4, 5]], expected: 3 },
      { args: [[-1, -2, -3]], expected: 0 },
      { args: [[10]], expected: 1 },
    ],
    example: { input: "[1, -2, 3, -4, 5]", output: "3" },
    starterCode: {
      javascript: "function countPositives(arr) {\n  // your code here\n}",
      python: "def count_positives(arr):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static int countPositives(int[] arr) {
        return 0;
    }
    // -----------------------------------

    public static void main(String[] args) {
        int[] a1 = {1, -2, 3, -4, 5};
        int[] a2 = {-1, -2, -3};
        int[] a3 = {10};
        System.out.println(countPositives(a1));
        System.out.println(countPositives(a2));
        System.out.println(countPositives(a3));
    }
}`,
      c: `#include <stdio.h>

// ---- Write your solution here ----
int countPositives(int arr[], int n) {
    return 0;
}
// -----------------------------------

int main() {
    int a1[] = {1, -2, 3, -4, 5};
    int a2[] = {-1, -2, -3};
    int a3[] = {10};
    printf("%d\\n", countPositives(a1, 5));
    printf("%d\\n", countPositives(a2, 3));
    printf("%d\\n", countPositives(a3, 1));
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
int countPositives(vector<int> arr) {
    return 0;
}
// -----------------------------------

int main() {
    cout << countPositives({1, -2, 3, -4, 5}) << "\\n";
    cout << countPositives({-1, -2, -3}) << "\\n";
    cout << countPositives({10}) << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-9",
    title: "Find the Minimum",
    description: "Implement a function that returns the minimum value in an array.",
    functionName: { javascript: "findMin", python: "find_min" },
    testCases: [
      { args: [[5, 3, 8, 1]], expected: 1 },
      { args: [[-2, -5, 0]], expected: -5 },
      { args: [[7]], expected: 7 },
    ],
    example: { input: "[5, 3, 8, 1]", output: "1" },
    starterCode: {
      javascript: "function findMin(arr) {\n  // your code here\n}",
      python: "def find_min(arr):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static int findMin(int[] arr) {
        return 0;
    }
    // -----------------------------------

    public static void main(String[] args) {
        int[] a1 = {5, 3, 8, 1};
        int[] a2 = {-2, -5, 0};
        int[] a3 = {7};
        System.out.println(findMin(a1));
        System.out.println(findMin(a2));
        System.out.println(findMin(a3));
    }
}`,
      c: `#include <stdio.h>

// ---- Write your solution here ----
int findMin(int arr[], int n) {
    return 0;
}
// -----------------------------------

int main() {
    int a1[] = {5, 3, 8, 1};
    int a2[] = {-2, -5, 0};
    int a3[] = {7};
    printf("%d\\n", findMin(a1, 4));
    printf("%d\\n", findMin(a2, 3));
    printf("%d\\n", findMin(a3, 1));
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
int findMin(vector<int> arr) {
    return 0;
}
// -----------------------------------

int main() {
    cout << findMin({5, 3, 8, 1}) << "\\n";
    cout << findMin({-2, -5, 0}) << "\\n";
    cout << findMin({7}) << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-10",
    title: "Count Even Numbers",
    description: "Implement a function that returns how many even numbers are in an array.",
    functionName: { javascript: "countEven", python: "count_even" },
    testCases: [
      { args: [[1, 2, 3, 4, 5, 6]], expected: 3 },
      { args: [[1, 3, 5]], expected: 0 },
      { args: [[2, 4, 6, 8]], expected: 4 },
    ],
    example: { input: "[1, 2, 3, 4, 5, 6]", output: "3" },
    starterCode: {
      javascript: "function countEven(arr) {\n  // your code here\n}",
      python: "def count_even(arr):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static int countEven(int[] arr) {
        return 0;
    }
    // -----------------------------------

    public static void main(String[] args) {
        int[] a1 = {1, 2, 3, 4, 5, 6};
        int[] a2 = {1, 3, 5};
        int[] a3 = {2, 4, 6, 8};
        System.out.println(countEven(a1));
        System.out.println(countEven(a2));
        System.out.println(countEven(a3));
    }
}`,
      c: `#include <stdio.h>

// ---- Write your solution here ----
int countEven(int arr[], int n) {
    return 0;
}
// -----------------------------------

int main() {
    int a1[] = {1, 2, 3, 4, 5, 6};
    int a2[] = {1, 3, 5};
    int a3[] = {2, 4, 6, 8};
    printf("%d\\n", countEven(a1, 6));
    printf("%d\\n", countEven(a2, 3));
    printf("%d\\n", countEven(a3, 4));
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
int countEven(vector<int> arr) {
    return 0;
}
// -----------------------------------

int main() {
    cout << countEven({1, 2, 3, 4, 5, 6}) << "\\n";
    cout << countEven({1, 3, 5}) << "\\n";
    cout << countEven({2, 4, 6, 8}) << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-11",
    title: "Capitalize First Letter",
    description: "Implement a function that returns the string with its first letter capitalized (rest unchanged).",
    functionName: { javascript: "capitalizeFirst", python: "capitalize_first" },
    testCases: [
      { args: ["hello"], expected: "Hello" },
      { args: ["world"], expected: "World" },
      { args: ["a"], expected: "A" },
    ],
    example: { input: '"hello"', output: '"Hello"' },
    starterCode: {
      javascript: "function capitalizeFirst(s) {\n  // your code here\n}",
      python: "def capitalize_first(s):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static String capitalizeFirst(String s) {
        return null;
    }
    // -----------------------------------

    public static void main(String[] args) {
        System.out.println(capitalizeFirst("hello"));
        System.out.println(capitalizeFirst("world"));
        System.out.println(capitalizeFirst("a"));
    }
}`,
      c: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

// ---- Write your solution here ----
// Modify s in place so its first letter is uppercase.
void capitalizeFirst(char* s) {
}
// -----------------------------------

int main() {
    char a1[] = "hello";
    char a2[] = "world";
    char a3[] = "a";
    capitalizeFirst(a1); printf("%s\\n", a1);
    capitalizeFirst(a2); printf("%s\\n", a2);
    capitalizeFirst(a3); printf("%s\\n", a3);
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
string capitalizeFirst(string s) {
    return "";
}
// -----------------------------------

int main() {
    cout << capitalizeFirst("hello") << "\\n";
    cout << capitalizeFirst("world") << "\\n";
    cout << capitalizeFirst("a") << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-12",
    title: "Count Unique Elements",
    description: "Implement a function that returns how many distinct values are in an array.",
    functionName: { javascript: "countUnique", python: "count_unique" },
    testCases: [
      { args: [[1, 2, 2, 3, 3, 3]], expected: 3 },
      { args: [[5, 5, 5]], expected: 1 },
      { args: [[1, 2, 3]], expected: 3 },
    ],
    example: { input: "[1, 2, 2, 3, 3, 3]", output: "3" },
    starterCode: {
      javascript: "function countUnique(arr) {\n  // your code here\n}",
      python: "def count_unique(arr):\n    # your code here\n    pass",
      java: `import java.util.*;

public class Main {

    // ---- Write your solution here ----
    static int countUnique(int[] arr) {
        return 0;
    }
    // -----------------------------------

    public static void main(String[] args) {
        int[] a1 = {1, 2, 2, 3, 3, 3};
        int[] a2 = {5, 5, 5};
        int[] a3 = {1, 2, 3};
        System.out.println(countUnique(a1));
        System.out.println(countUnique(a2));
        System.out.println(countUnique(a3));
    }
}`,
      c: `#include <stdio.h>

// ---- Write your solution here ----
int countUnique(int arr[], int n) {
    return 0;
}
// -----------------------------------

int main() {
    int a1[] = {1, 2, 2, 3, 3, 3};
    int a2[] = {5, 5, 5};
    int a3[] = {1, 2, 3};
    printf("%d\\n", countUnique(a1, 6));
    printf("%d\\n", countUnique(a2, 3));
    printf("%d\\n", countUnique(a3, 3));
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
int countUnique(vector<int> arr) {
    return 0;
}
// -----------------------------------

int main() {
    cout << countUnique({1, 2, 2, 3, 3, 3}) << "\\n";
    cout << countUnique({5, 5, 5}) << "\\n";
    cout << countUnique({1, 2, 3}) << "\\n";
    return 0;
}`,
    },
  },

  {
    id: "dsa-13",
    title: "Sum of Digits",
    description: "Implement a function that returns the sum of the digits of a non-negative integer.",
    functionName: { javascript: "sumOfDigits", python: "sum_of_digits" },
    testCases: [
      { args: [123], expected: 6 },
      { args: [900], expected: 9 },
      { args: [5], expected: 5 },
    ],
    example: { input: "123", output: "6" },
    starterCode: {
      javascript: "function sumOfDigits(n) {\n  // your code here\n}",
      python: "def sum_of_digits(n):\n    # your code here\n    pass",
      java: `public class Main {

    // ---- Write your solution here ----
    static int sumOfDigits(int n) {
        return 0;
    }
    // -----------------------------------

    public static void main(String[] args) {
        System.out.println(sumOfDigits(123));
        System.out.println(sumOfDigits(900));
        System.out.println(sumOfDigits(5));
    }
}`,
      c: `#include <stdio.h>

// ---- Write your solution here ----
int sumOfDigits(int n) {
    return 0;
}
// -----------------------------------

int main() {
    printf("%d\\n", sumOfDigits(123));
    printf("%d\\n", sumOfDigits(900));
    printf("%d\\n", sumOfDigits(5));
    return 0;
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// ---- Write your solution here ----
int sumOfDigits(int n) {
    return 0;
}
// -----------------------------------

int main() {
    cout << sumOfDigits(123) << "\\n";
    cout << sumOfDigits(900) << "\\n";
    cout << sumOfDigits(5) << "\\n";
    return 0;
}`,
    },
  },
];

const CODING_PASS_COUNT = 2; // out of PROBLEMS_PER_DRIVE, must solve at least this many
const PROBLEMS_PER_DRIVE = 4; // how many problems are picked per drive
const SECONDS_PER_PROBLEM = 5 * 60; // 5 min per question -> 20 min total for 4

function getDsaProblems() {
  return DSA_PROBLEMS;
}

function getDsaProblemById(id) {
  return DSA_PROBLEMS.find((p) => p.id === id) || null;
}

/** Randomly picks PROBLEMS_PER_DRIVE distinct problems from the full pool. */
function pickRandomProblemIds() {
  const shuffled = [...DSA_PROBLEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, PROBLEMS_PER_DRIVE).map((p) => p.id);
}

module.exports = {
  getDsaProblems,
  getDsaProblemById,
  pickRandomProblemIds,
  CODING_PASS_COUNT,
  PROBLEMS_PER_DRIVE,
  SECONDS_PER_PROBLEM,
};
