import { IGCSETask, IGCSEUnit, QuestionDifficulty } from "../types";
import { INITIAL_UNITS } from "./initialQuestionBank";
import { PYTHON_WORKBOOK_UNIT } from "./pythonWorkbookQuestions";
import { get2025PaperUnits } from "./edexcel2025PaperQuestions";
import { getArchivedPastPaperUnits } from "./edexcelPastPapersArchive";
import { get20MarkerUnit } from "./edexcel20MarkerQuestions";
import { YEAR11_PRACTICE_UNIT } from "./edexcelYear11PracticePaper";

/**
 * Generator engine for 1,100+ Pearson Edexcel International GCSE (9-1) Computer Science (4CP0) questions.
 * Produces structured, curriculum-aligned questions across all 6 topics:
 * - Topic 1: Problem solving (Algorithms, Searching, Sorting, Pseudocode, Flowcharts)
 * - Topic 2: Programming (Python 3 Syntax, Selection, Iteration, Lists, Functions, Slicing, Validation)
 * - Topic 3: Data (Binary, Two's complement, Hexadecimal, ASCII/Unicode, Compression, Historical Ciphers)
 * - Topic 4: Computers (Von Neumann Architecture, Registers, Buses, Logic Gates, Truth Tables, Translators)
 * - Topic 5: Networks and Internet (4-Layer TCP/IP Stack, Topologies, IPv4/IPv6, Security Threats, Protocols)
 * - Topic 6: The bigger picture (Environmental E-waste, Ethics, AI, Legislation, Intellectual Property)
 *
 * Each question is explicitly assigned a difficulty: "Easy" | "Moderate" | "Hard"
 * with realistic contexts, distinct prompts, and varied mark weights.
 */

function buildGeneratedBank(): IGCSETask[] {
  const tasks: IGCSETask[] = [];

  const pushTask = (t: Partial<IGCSETask> & {
    id: string;
    unit: string;
    title: string;
    brief: string;
    marks: number;
    type: any;
    difficulty: QuestionDifficulty;
    level?: any;
  }) => {
    tasks.push({
      ...t,
      id: t.id,
      unit: t.unit,
      title: t.title,
      brief: t.brief,
      marks: t.marks,
      type: t.type,
      difficulty: t.difficulty,
      level: t.level || (t.difficulty === "Easy" ? "Starter" : t.difficulty === "Moderate" ? "Core" : "Exam-style"),
    });
  };

  // =========================================================================
  // TOPIC 1: PROBLEM SOLVING & ALGORITHMS (U10, U15, U17, U18, U20, U22, U23)
  // =========================================================================

  // U18: Searching Algorithms (Binary Search & Linear Search)
  // EASY
  const easySearchTargets = [
    { target: 12, list: [4, 8, 12, 16, 20], pos: 2, title: "Linear Search: First Quarter Target" },
    { target: 5, list: [5, 15, 25, 35, 45], pos: 0, title: "Linear Search: Best-Case Element" },
    { target: 99, list: [10, 20, 30, 40, 99], pos: 4, title: "Linear Search: Final Element in Sequence" },
    { target: 7, list: [2, 4, 6, 8, 10], pos: -1, title: "Linear Search: Target Missing from Dataset" },
    { target: 50, list: [10, 30, 50, 70, 90], pos: 2, title: "Binary Search: Immediate Midpoint Match" },
    { target: 100, list: [20, 40, 60, 80, 100], pos: 4, title: "Linear Search: Array Scan Bound" },
    { target: 3, list: [1, 2, 3, 4, 5, 6, 7], pos: 2, title: "Binary Search: 7-Item Array Midpoint" },
    { target: 14, list: [2, 4, 6, 8, 10, 12, 14], pos: 6, title: "Linear Search: Even Number Sequence" },
    { target: 42, list: [7, 14, 21, 28, 35, 42], pos: 5, title: "Linear Search: Multiple of Seven" },
    { target: 1, list: [1, 3, 5, 7, 9], pos: 0, title: "Binary Search: Target at Index Zero" },
    { target: 88, list: [11, 22, 33, 44, 55, 66, 77, 88], pos: 7, title: "Linear Search: 8-Item Sequence" },
    { target: 64, list: [2, 4, 8, 16, 32, 64], pos: 5, title: "Binary Search: Powers of Two Search" },
  ];

  easySearchTargets.forEach((item, idx) => {
    pushTask({
      id: `qb_u18_easy_${idx + 1}`,
      unit: "U18",
      title: item.title,
      difficulty: "Easy",
      type: "mcq",
      brief: `Given the list [${item.list.join(", ")}], analyze searching for target value ${item.target}.`,
      questions: [
        {
          q: `Is the target value ${item.target} present in the list? If yes, what is its 0-based index?`,
          options: [
            item.pos >= 0 ? `Yes, located at index ${item.pos}` : "No, the value is not present in the list",
            item.pos >= 0 ? `Yes, located at index ${item.pos + 1}` : "Yes, located at index 0",
            "Cannot be determined without running a sort",
            "Linear search cannot operate on this data",
          ],
          a: 0,
        },
      ],
      marks: 2,
    });
  });

  // MODERATE: Binary Search trace & step calculations
  const moderateSearchSets = [
    { target: 33, list: [11, 19, 24, 33, 47, 52, 68, 75, 89], midpoints: [47, 19, 24, 33], steps: 4, title: "Binary Search: Left Sub-Array Transition" },
    { target: 71, list: [10, 22, 35, 48, 59, 71, 83, 94], midpoints: [48, 71], steps: 2, title: "Binary Search: Right Half Bifurcation" },
    { target: 15, list: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], midpoints: [16, 5, 8, 12], steps: 4, title: "Binary Search: Absent Target Elimination" },
    { target: 84, list: [14, 28, 42, 56, 70, 84, 98], midpoints: [56, 84], steps: 2, title: "Binary Search: 7-Element Midpoint Leap" },
    { target: 9, list: [1, 3, 5, 7, 9, 11, 13, 15, 17], midpoints: [9], steps: 1, title: "Binary Search: Exact First-Step Median" },
    { target: 120, list: [15, 30, 45, 60, 75, 90, 105, 120], midpoints: [60, 90, 105, 120], steps: 4, title: "Binary Search: High Boundary Traversal" },
    { target: 6, list: [2, 4, 6, 8, 10, 12, 14, 16], midpoints: [8, 4, 6], steps: 3, title: "Binary Search: Low Midpoint Rounding Trace" },
    { target: 49, list: [7, 14, 21, 28, 35, 42, 49, 56], midpoints: [28, 42, 49], steps: 3, title: "Binary Search: Multiples Sequence" },
    { target: 50, list: [10, 20, 30, 40, 60, 70, 80, 90], midpoints: [40, 70, 60], steps: 3, title: "Binary Search: Gap Detection in Even Series" },
    { target: 95, list: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95], midpoints: [45, 75, 85, 95], steps: 4, title: "Binary Search: Decile Step Evaluation" },
    { target: 2, list: [2, 8, 14, 20, 26, 32, 38], midpoints: [20, 8, 2], steps: 3, title: "Binary Search: Minimum Boundary Convergence" },
    { target: 63, list: [9, 18, 27, 36, 45, 54, 63, 72, 81], midpoints: [45, 63], steps: 2, title: "Binary Search: 9-Element Table Step Analysis" },
  ];

  moderateSearchSets.forEach((item, idx) => {
    pushTask({
      id: `qb_u18_mod_${idx + 1}`,
      unit: "U18",
      title: item.title,
      difficulty: "Moderate",
      type: "mcq",
      brief: `Perform a dry-run binary search on ordered list [${item.list.join(", ")}] for key value ${item.target}.`,
      questions: [
        {
          q: `Using integer midpoint index = (low + high) // 2, how many midpoint comparisons are made?`,
          options: [
            `${item.steps} comparison(s)`,
            `${item.steps + 1} comparison(s)`,
            `${Math.max(1, item.steps - 1)} comparison(s)`,
            `${item.list.length} comparison(s) (linear search rate)`,
          ],
          a: 0,
        },
        {
          q: "What is the critical prerequisite for a binary search to function correctly?",
          options: [
            "The data elements must already be in sorted order",
            "The dataset must contain an even number of elements",
            "All values in the list must be integers",
            "The list must be stored on external secondary storage",
          ],
          a: 0,
        },
      ],
      marks: 4,
    });
  });

  // HARD: Algorithm time complexity & Edge-case binary search
  const hardSearchScenarios = [
    { n: 1024, maxSteps: 10, title: "Binary Search: Logarithmic Scaling on 1024 Items" },
    { n: 2048, maxSteps: 11, title: "Binary Search: Logarithmic Scaling on 2048 Items" },
    { n: 4096, maxSteps: 12, title: "Binary Search: Double Size Step Impact on 4096 Items" },
    { n: 1000000, maxSteps: 20, title: "Binary Search: Big-O Complexity on 1,000,000 Records" },
    { n: 65536, maxSteps: 16, title: "Binary Search: Powers of Two Search on 65,536 Items" },
    { n: 500, maxSteps: 9, title: "Binary Search: Upper Bound Formula Ceiling on 500 Items" },
    { n: 16384, maxSteps: 14, title: "Binary Search: Log2 Scale on 16,384 Database Keys" },
    { n: 256, maxSteps: 8, title: "Binary Search: 8-Bit Address Space (256 Entries)" },
  ];

  hardSearchScenarios.forEach((item, idx) => {
    pushTask({
      id: `qb_u18_hard_${idx + 1}`,
      unit: "U18",
      title: item.title,
      difficulty: "Hard",
      type: "theory",
      brief: `Evaluate time complexity and worst-case comparison limits for linear and binary search algorithms on dataset size N = ${item.n.toLocaleString()}.`,
      questions: [
        {
          q: `Calculate the maximum number of comparisons required by a binary search to locate an item or conclude that it does not exist in an ordered list of ${item.n.toLocaleString()} items. Explain your mathematical reasoning.`,
          keywords: ["log2", "logarithmic", "half", "halved", String(item.maxSteps), "ceiling", "worst-case"],
          maxMarks: 6,
          criteria: [
            `States the exact worst-case maximum of ${item.maxSteps} comparisons`,
            "Identifies that binary search halves the remaining search space after every comparison",
            "References log2(N) logarithmic time complexity",
            `Contrasts with linear search worst case of ${item.n.toLocaleString()} comparisons`,
          ],
        },
      ],
      marks: 6,
    });
  });

  // U17: Sorting Algorithms (Bubble Sort & Insertion Sort)
  // EASY
  const easySortItems = [
    { list: [5, 2, 8, 1], afterPass1: [2, 5, 1, 8], title: "Bubble Sort: Pass 1 on 4 Integers" },
    { list: [9, 3, 7, 4], afterPass1: [3, 7, 4, 9], title: "Bubble Sort: Largest Value Float" },
    { list: [4, 1, 3, 2], afterPass1: [1, 3, 2, 4], title: "Bubble Sort: Single Swap Detection" },
    { list: [10, 8, 6, 4], afterPass1: [8, 6, 4, 10], title: "Bubble Sort: Reverse Sequence Pass 1" },
    { list: [1, 2, 3, 4], afterPass1: [1, 2, 3, 4], title: "Bubble Sort: Pre-Sorted Array Swaps" },
    { list: [6, 2, 9, 5], afterPass1: [2, 6, 5, 9], title: "Bubble Sort: Pass 1 End State" },
    { list: [7, 5, 3, 1], afterPass1: [5, 3, 1, 7], title: "Bubble Sort: 4-Item Decreasing Pass 1" },
    { list: [8, 4, 2, 6], afterPass1: [4, 2, 6, 8], title: "Bubble Sort: Evens Pass 1" },
    { list: [3, 9, 1, 5], afterPass1: [3, 1, 5, 9], title: "Bubble Sort: Intermediate Array State" },
    { list: [2, 1, 4, 3], afterPass1: [1, 2, 3, 4], title: "Bubble Sort: Two Disjoint Inversions" },
    { list: [5, 4, 3, 2], afterPass1: [4, 3, 2, 5], title: "Bubble Sort: Adjacent Transpositions" },
    { list: [6, 1, 8, 3], afterPass1: [1, 6, 3, 8], title: "Bubble Sort: Terminal Position Guarantee" },
  ];

  easySortItems.forEach((item, idx) => {
    pushTask({
      id: `qb_u17_easy_${idx + 1}`,
      unit: "U17",
      title: item.title,
      difficulty: "Easy",
      type: "mcq",
      brief: `Examine the execution of an ascending bubble sort algorithm on the list [${item.list.join(", ")}].`,
      questions: [
        {
          q: `What is the contents of the list after completion of the first pass (Pass 1)?`,
          options: [
            `[${item.afterPass1.join(", ")}]`,
            `[${item.list.slice().reverse().join(", ")}]`,
            `[${item.list.slice().sort((a,b)=>a-b).join(", ")}]`,
            `[${item.list.join(", ")}]`,
          ],
          a: 0,
        },
      ],
      marks: 2,
    });
  });

  // MODERATE: Multi-pass Bubble Sort & Insertion Sort dry-runs
  const moderateSortSets = [
    { initial: [29, 10, 14, 37, 13], pass1: [10, 14, 29, 13, 37], pass2: [10, 14, 13, 29, 37], title: "Bubble Sort: 2-Pass Trace on 5 Integers" },
    { initial: [45, 12, 85, 32, 89, 39], pass1: [12, 45, 32, 85, 39, 89], pass2: [12, 32, 45, 39, 85, 89], title: "Bubble Sort: 6-Element Partial Sort" },
    { initial: [64, 34, 25, 12, 22, 11], pass1: [34, 25, 12, 22, 11, 64], pass2: [25, 12, 22, 11, 34, 64], title: "Bubble Sort: High-Entropy Sequence Trace" },
    { initial: [15, 8, 20, 3, 11], pass1: [8, 15, 3, 11, 20], pass2: [8, 3, 11, 15, 20], title: "Bubble Sort: 5-Item Inversion Cascade" },
    { initial: [50, 40, 30, 20, 10], pass1: [40, 30, 20, 10, 50], pass2: [30, 20, 10, 40, 50], title: "Bubble Sort: Worst-Case Reverse Sorted Trace" },
    { initial: [18, 22, 9, 31, 14], pass1: [18, 9, 22, 14, 31], pass2: [9, 18, 14, 22, 31], title: "Bubble Sort: Pass 2 State Verification" },
    { initial: [77, 33, 44, 11, 88], pass1: [33, 44, 11, 77, 88], pass2: [33, 11, 44, 77, 88], title: "Bubble Sort: Double Inversion Resolution" },
    { initial: [90, 80, 70, 60], pass1: [80, 70, 60, 90], pass2: [70, 60, 80, 90], title: "Bubble Sort: Strict Descending 4-List" },
    { initial: [25, 17, 31, 13, 2], pass1: [17, 25, 13, 2, 31], pass2: [17, 13, 2, 25, 31], title: "Bubble Sort: Minimum Element Progression" },
    { initial: [40, 10, 30, 20], pass1: [10, 30, 20, 40], pass2: [10, 20, 30, 40], title: "Bubble Sort: Early Termination by Flag Detection" },
    { initial: [16, 12, 14, 10, 18], pass1: [12, 14, 10, 16, 18], pass2: [12, 10, 14, 16, 18], title: "Bubble Sort: Near-Sorted Intermediate Pass" },
    { initial: [55, 22, 88, 11, 44], pass1: [22, 55, 11, 44, 88], pass2: [22, 11, 44, 55, 88], title: "Bubble Sort: Symmetrical Pair Adjustments" },
  ];

  moderateSortSets.forEach((item, idx) => {
    pushTask({
      id: `qb_u17_mod_${idx + 1}`,
      unit: "U17",
      title: item.title,
      difficulty: "Moderate",
      type: "mcq",
      brief: `Dry-run an ascending bubble sort on initial array [${item.initial.join(", ")}].`,
      questions: [
        {
          q: `Which array represents the state of the data after the completion of Pass 2?`,
          options: [
            `[${item.pass2.join(", ")}]`,
            `[${item.pass1.join(", ")}]`,
            `[${item.initial.join(", ")}]`,
            `[${item.initial.slice().reverse().join(", ")}]`,
          ],
          a: 0,
        },
        {
          q: "How can the standard bubble sort algorithm be optimized to stop early if the list is already sorted?",
          options: [
            "Use a boolean flag (e.g. 'swapped') initialized to False; if no swaps occur during a full pass, terminate the loop",
            "Halve the list on every pass like binary search",
            "Swap elements from both ends toward the middle simultaneously",
            "Convert the array elements to floating point numbers",
          ],
          a: 0,
        },
      ],
      marks: 4,
    });
  });

  // HARD: Sorting Algorithm Comparative Efficiency & Memory
  const hardSortTopics = [
    { title: "Bubble Sort vs Merge Sort: Scalability on 100,000 Items", focus: "Big-O time complexity and memory overhead" },
    { title: "Insertion Sort vs Bubble Sort: Best-Case Behavior on Nearly-Sorted Data", focus: "Adaptive comparisons and early termination" },
    { title: "Merge Sort Divide-and-Conquer: Recursion and Auxiliary RAM Usage", focus: "Spatial complexity and external file sorting" },
    { title: "Bubble Sort Quadratic Inefficiency: n(n-1)/2 Comparisons Proof", focus: "Worst-case mathematical derivation" },
    { title: "Sorting Stability and Preserving Equal Keys", focus: "Data integrity across multi-attribute sort passes" },
    { title: "In-Place Sorting Algorithms vs Out-of-Place Memory Constraints", focus: "Embedded systems with minimal RAM" },
  ];

  hardSortTopics.forEach((item, idx) => {
    pushTask({
      id: `qb_u17_hard_${idx + 1}`,
      unit: "U17",
      title: item.title,
      difficulty: "Hard",
      type: "theory",
      brief: `Analyze sorting algorithm efficiency in Section 1.4 for ${item.focus}.`,
      questions: [
        {
          q: `Compare bubble sort and merge sort in terms of time efficiency and memory usage when sorting large datasets. Justify which algorithm is suitable for a server sorting 500,000 transaction records.`,
          keywords: ["O(n^2)", "O(n log n)", "quadratic", "divide and conquer", "memory", "RAM", "merge sort", "scalability"],
          maxMarks: 6,
          criteria: [
            "Identifies bubble sort has O(n^2) quadratic time complexity and merge sort has O(n log n) linearithmic time complexity",
            "Explains that merge sort divides the list into sub-lists of size 1 and merges them back in sorted order",
            "Recognizes that merge sort requires additional RAM / auxiliary memory buffers whereas bubble sort sorts in-place",
            "Concludes merge sort is vastly superior for 500,000 records due to dramatic reduction in comparison count",
          ],
        },
      ],
      marks: 6,
    });
  });

  // U15: Trace Tables (Easy, Moderate, Hard)
  // EASY: 2-variable trace tables
  for (let i = 1; i <= 10; i++) {
    const initVal = i * 2;
    pushTask({
      id: `qb_u15_easy_${i}`,
      unit: "U15",
      title: `Trace Table: Simple Accumulator Loop (Start ${initVal})`,
      difficulty: "Easy",
      type: "table",
      brief: `Complete the trace table for the algorithm:\ntotal = 0\ncount = ${initVal}\nwhile count > 0:\n    total = total + 2\n    count = count - 2`,
      columns: [
        { label: "count", type: "text" },
        { label: "count > 0", type: "select", options: ["True", "False"] },
        { label: "total", type: "text" },
        { label: "OUTPUT", type: "text" },
      ],
      rows: [
        [{ v: String(initVal), g: true }, { v: "True", g: true }, { v: "2" }, { v: "—", g: true }],
        [{ v: String(initVal - 2) }, { v: initVal - 2 > 0 ? "True" : "False" }, { v: String(Math.min(initVal, 4)) }, { v: "—", g: true }],
        [{ v: "0" }, { v: "False" }, { v: String(initVal) }, { v: String(initVal) }],
      ],
      marks: 3,
    });
  }

  // MODERATE: 4-variable trace tables with conditional branches
  for (let i = 1; i <= 12; i++) {
    const base = 5 + i;
    pushTask({
      id: `qb_u15_mod_${i}`,
      unit: "U15",
      title: `Trace Table: Selection & Modulo Loop #${i}`,
      difficulty: "Moderate",
      type: "table",
      brief: `Complete the dry-run trace table for:\nnum = ${base}\nevents = 0\nwhile num > 0:\n    if num % 2 == 0:\n        events = events + 1\n    num = num - 1`,
      columns: [
        { label: "num", type: "text" },
        { label: "num > 0", type: "select", options: ["True", "False"] },
        { label: "num % 2 == 0", type: "select", options: ["True", "False"] },
        { label: "events", type: "text" },
      ],
      rows: [
        [{ v: String(base), g: true }, { v: "True", g: true }, { v: base % 2 === 0 ? "True" : "False" }, { v: base % 2 === 0 ? "1" : "0" }],
        [{ v: String(base - 1) }, { v: "True" }, { v: (base - 1) % 2 === 0 ? "True" : "False" }, { v: base % 2 === 0 ? "1" : "1" }],
        [{ v: String(base - 2) }, { v: "True" }, { v: (base - 2) % 2 === 0 ? "True" : "False" }, { v: String(Math.floor(base / 2)) }],
        [{ v: "0" }, { v: "False" }, { v: "False" }, { v: String(Math.floor(base / 2)) }],
      ],
      marks: 4,
    });
  }

  // HARD: Complex Nested Trace with Flag & Array indexing
  for (let i = 1; i <= 8; i++) {
    pushTask({
      id: `qb_u15_hard_${i}`,
      unit: "U15",
      title: `Trace Table: Search Sentinel with Flag Traversal #${i}`,
      difficulty: "Hard",
      type: "table",
      brief: `Trace the linear scan with early exit flag:\narr = [14, 28, 35, 42, 56]\ntarget = ${i % 2 === 0 ? 35 : 99}\nfound = False\nidx = 0\nwhile idx < 5 and not found:\n    if arr[idx] == target:\n        found = True\n    else:\n        idx = idx + 1`,
      columns: [
        { label: "idx", type: "text" },
        { label: "idx < 5 and not found", type: "select", options: ["True", "False"] },
        { label: "arr[idx] == target", type: "select", options: ["True", "False"] },
        { label: "found", type: "select", options: ["True", "False"] },
        { label: "idx (after)", type: "text" },
      ],
      rows: [
        [{ v: "0", g: true }, { v: "True", g: true }, { v: "False" }, { v: "False" }, { v: "1" }],
        [{ v: "1" }, { v: "True" }, { v: "False" }, { v: "False" }, { v: "2" }],
        [{ v: "2" }, { v: "True" }, { v: i % 2 === 0 ? "True" : "False" }, { v: i % 2 === 0 ? "True" : "False" }, { v: i % 2 === 0 ? "2" : "3" }],
      ],
      marks: 6,
    });
  }

  // =========================================================================
  // TOPIC 2: PYTHON PROGRAMMING (U01-U09, U11, U12, U13, U14, U16, U19)
  // =========================================================================

  // U01 & U02: Variables, Types & Input (Easy)
  const easyPythonPrompts = [
    { title: "Python: Display School Name", code: 'print("Westminster Academy")', out: "Westminster Academy\n", brief: "Write a program that prints 'Westminster Academy'." },
    { title: "Python: Two Line Welcome", code: 'print("Welcome")\nprint("Computer Science")', out: "Welcome\nComputer Science\n", brief: "Print 'Welcome' on the first line and 'Computer Science' on the second line." },
    { title: "Python: Assign Integer Variable", code: "score = 100\nprint(score)", out: "100\n", brief: "Assign the integer 100 to variable score and print it." },
    { title: "Python: Float Variable Output", code: "price = 4.99\nprint(price)", out: "4.99\n", brief: "Store 4.99 in a variable called price and display it." },
    { title: "Python: Greeting from Input", code: 'name = input()\nprint(f"Hello {name}")', in: ["Amira"], out: "Hello Amira\n", brief: "Input a name from user and print 'Hello <name>'." },
    { title: "Python: Integer Doubler", code: "n = int(input())\nprint(n * 2)", in: ["15"], out: "30\n", brief: "Receive an integer from input and print its double (multiply by 2)." },
    { title: "Python: Age Next Year", code: "age = int(input())\nprint(age + 1)", in: ["16"], out: "17\n", brief: "Input a candidate's age as an integer and display what their age will be next year (+1)." },
    { title: "Python: Rectangle Area Calculator", code: "w = int(input())\nh = int(input())\nprint(w * h)", in: ["5", "8"], out: "40\n", brief: "Input two integers representing width and height, then print their product (area)." },
    { title: "Python: String Repetition", code: 'char = input()\nprint(char * 5)', in: ["*"], out: "*****\n", brief: "Receive a single character and print it repeated 5 times using the * operator." },
    { title: "Python: Sum of Two Integers", code: "a = int(input())\nb = int(input())\nprint(a + b)", in: ["12", "18"], out: "30\n", brief: "Input two integers and output their sum." },
    { title: "Python: Celsius to Fahrenheit Formula", code: "c = float(input())\nprint(c * 1.8 + 32)", in: ["20"], out: "68.0\n", brief: "Convert Celsius temperature to Fahrenheit using formula: c * 1.8 + 32." },
    { title: "Python: Kilometer to Meter Converter", code: "km = float(input())\nprint(int(km * 1000))", in: ["3.5"], out: "3500\n", brief: "Input distance in kilometers and print equivalent meters (km * 1000)." },
  ];

  easyPythonPrompts.forEach((item, idx) => {
    pushTask({
      id: `qb_py_easy_${idx + 1}`,
      unit: "U01",
      title: item.title,
      difficulty: "Easy",
      type: "code",
      brief: item.brief,
      starter: "# Write your Python solution below\n",
      solution: item.code,
      tests: [{ in: item.in || [], out: item.out, m: 3 }],
      marks: 3,
    });
  });

  // U03 & U04: Selection IF/ELIF/ELSE & Arithmetic (Moderate)
  const moderatePythonPrompts = [
    { title: "Python: Examination Grade Boundary", code: "s = int(input())\nif s >= 80:\n    print('Distinction')\nelif s >= 60:\n    print('Merit')\nelif s >= 40:\n    print('Pass')\nelse:\n    print('Unclassified')", in: ["72"], out: "Merit\n", brief: "Input score. >=80 prints 'Distinction', >=60 'Merit', >=40 'Pass', else 'Unclassified'." },
    { title: "Python: Even or Odd Determination", code: "n = int(input())\nif n % 2 == 0:\n    print('EVEN')\nelse:\n    print('ODD')", in: ["17"], out: "ODD\n", brief: "Determine if an integer is 'EVEN' or 'ODD' using modulo operator %." },
    { title: "Python: Driving Age Verification", code: "age = int(input())\nif age >= 17:\n    print('ELIGIBLE')\nelse:\n    print(f'WAIT {17 - age} YEARS')", in: ["15"], out: "WAIT 2 YEARS\n", brief: "Check if age >= 17 ('ELIGIBLE'). Otherwise print 'WAIT <diff> YEARS'." },
    { title: "Python: Integer Quotient & Remainder", code: "a = int(input())\nb = int(input())\nprint(f'Quotient: {a // b}')\nprint(f'Remainder: {a % b}')", in: ["23", "5"], out: "Quotient: 4\nRemainder: 3\n", brief: "Input two positive integers. Print integer division quotient (//) and modulus remainder (%)." },
    { title: "Python: Discount Rate Calculator", code: "total = float(input())\nif total >= 100:\n    print(f'£{total * 0.85:.2f}')\nelif total >= 50:\n    print(f'£{total * 0.90:.2f}')\nelse:\n    print(f'£{total:.2f}')", in: ["120"], out: "£102.00\n", brief: "Apply 15% discount for bills >= £100, 10% for >= £50, else full price." },
    { title: "Python: Password Length Validator", code: "pwd = input()\nif len(pwd) >= 8:\n    print('STRONG')\nelse:\n    print('TOO SHORT')", in: ["secret12"], out: "STRONG\n", brief: "Verify that an entered password has at least 8 characters." },
    { title: "Python: Water State at Temperature", code: "t = float(input())\nif t <= 0:\n    print('SOLID')\nelif t >= 100:\n    print('GAS')\nelse:\n    print('LIQUID')", in: ["25"], out: "LIQUID\n", brief: "Determine state of water: <=0 'SOLID', >=100 'GAS', else 'LIQUID'." },
    { title: "Python: Leap Year Identifier", code: "y = int(input())\nif (y % 4 == 0 and y % 100 != 0) or (y % 400 == 0):\n    print('LEAP')\nelse:\n    print('COMMON')", in: ["2024"], out: "LEAP\n", brief: "Check if a year is a leap year (divisible by 4 and not 100, or divisible by 400)." },
    { title: "Python: Shipping Cost Tier", code: "w = float(input())\nif w <= 2.0:\n    print('£2.99')\nelif w <= 5.0:\n    print('£4.99')\nelse:\n    print('£8.99')", in: ["3.4"], out: "£4.99\n", brief: "Compute postage tier based on weight in kilograms." },
    { title: "Python: Coordinate Quadrant", code: "x = int(input())\ny = int(input())\nif x > 0 and y > 0:\n    print('Q1')\nelif x < 0 and y > 0:\n    print('Q2')\nelif x < 0 and y < 0:\n    print('Q3')\nelse:\n    print('Q4')", in: ["-4", "7"], out: "Q2\n", brief: "Classify Cartesian coordinate into quadrants Q1, Q2, Q3, or Q4." },
    { title: "Python: Triangle Validity Check", code: "a = int(input())\nb = int(input())\nc = int(input())\nif a + b > c and a + c > b and b + c > a:\n    print('VALID')\nelse:\n    print('INVALID')", in: ["3", "4", "5"], out: "VALID\n", brief: "Verify if three side lengths can form a valid triangle using triangle inequality theorem." },
    { title: "Python: Cinema Ticket Pricing", code: "age = int(input())\nif age < 12:\n    print('£6')\nelif age < 65:\n    print('£10')\nelse:\n    print('£7')", in: ["68"], out: "£7\n", brief: "Output cinema price: under 12 is £6, senior 65+ is £7, adults £10." },
  ];

  moderatePythonPrompts.forEach((item, idx) => {
    pushTask({
      id: `qb_py_mod_${idx + 1}`,
      unit: "U04",
      title: item.title,
      difficulty: "Moderate",
      type: "code",
      brief: item.brief,
      starter: "# Complete the selection structure\n",
      solution: item.code,
      tests: [{ in: item.in, out: item.out, m: 4 }],
      marks: 4,
    });
  });

  // U06, U07, U08, U09: Iteration, Lists & Functions (Hard)
  const hardPythonPrompts = [
    {
      title: "Python: Sentinel Input Accumulator with Validation",
      brief: "Read integers repeatedly until -1 is entered. Print count of positive values and their average to 1 decimal place.",
      code: "count = 0\ntotal = 0\nval = int(input())\nwhile val != -1:\n    if val > 0:\n        count += 1\n        total += val\n    val = int(input())\nif count > 0:\n    print(f'Count: {count}')\n    print(f'Average: {total / count:.1f}')\nelse:\n    print('No positive data')",
      in: ["10", "20", "30", "-1"],
      out: "Count: 3\nAverage: 20.0\n",
    },
    {
      title: "Python: Prime Number Checker Function",
      brief: "Define function is_prime(n) that returns True if n is prime, False otherwise. Read integer n and print 'PRIME' or 'COMPOSITE'.",
      code: "def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\nnum = int(input())\nprint('PRIME' if is_prime(num) else 'COMPOSITE')",
      in: ["29"],
      out: "PRIME\n",
    },
    {
      title: "Python: Linear Search in List with Index",
      brief: "Read 5 integers into a list. Read search key. Print 'FOUND AT INDEX <idx>' or 'NOT FOUND'.",
      code: "items = [int(input()) for _ in range(5)]\nkey = int(input())\nfound = False\nfor idx, val in enumerate(items):\n    if val == key:\n        print(f'FOUND AT INDEX {idx}')\n        found = True\n        break\nif not found:\n    print('NOT FOUND')",
      in: ["12", "45", "78", "23", "90", "23"],
      out: "FOUND AT INDEX 3\n",
    },
    {
      title: "Python: Frequency Counter Dictionary / List",
      brief: "Read a sentence. Print each unique word and how many times it appeared, formatted as 'word: count'.",
      code: "words = input().split()\ncounts = {}\nfor w in words:\n    w_lower = w.lower()\n    counts[w_lower] = counts.get(w_lower, 0) + 1\nfor k in sorted(counts.keys()):\n    print(f'{k}: {counts[k]}')",
      in: ["apple banana apple orange banana apple"],
      out: "apple: 3\nbanana: 2\norange: 1\n",
    },
    {
      title: "Python: Bubble Sort Implementation with Swapped Flag",
      brief: "Implement bubble sort on a list of 5 input integers. Print sorted list in ascending order separated by spaces.",
      code: "arr = [int(input()) for _ in range(5)]\nn = len(arr)\nfor i in range(n):\n    swapped = False\n    for j in range(0, n - i - 1):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]\n            swapped = True\n    if not swapped:\n        break\nprint(' '.join(map(str, arr)))",
      in: ["45", "12", "89", "23", "7"],
      out: "7 12 23 45 89\n",
    },
    {
      title: "Python: Run-Length Encoding (RLE) Compressor",
      brief: "Input string like 'AAABBBCC'. Output compressed string '3A3B2C'.",
      code: "s = input()\nres = ''\nif s:\n    curr = s[0]\n    cnt = 1\n    for c in s[1:]:\n        if c == curr:\n            cnt += 1\n        else:\n            res += f'{cnt}{curr}'\n            curr = c\n            cnt = 1\n    res += f'{cnt}{curr}'\nprint(res)",
      in: ["WWWWBWW"],
      out: "4W1B2W\n",
    },
  ];

  hardPythonPrompts.forEach((item, idx) => {
    pushTask({
      id: `qb_py_hard_${idx + 1}`,
      unit: "U08",
      title: item.title,
      difficulty: "Hard",
      type: "code",
      brief: item.brief,
      starter: "# Complete program solution with subprograms as needed\n",
      solution: item.code,
      tests: [{ in: item.in, out: item.out, m: 6 }],
      marks: 6,
    });
  });

  // U11: Topic 2.5 Text File Handling (Easy, Moderate, Hard)
  const fileHandlingTasks = [
    {
      id: "qb_u11_read_msg",
      title: "File Handling: Read & Display Text File",
      brief: "A text file named 'message.txt' exists. Write a program to open 'message.txt' in read mode ('r'), read its entire content, print it to the screen, and close the file.",
      code: "f = open('message.txt', 'r')\ncontent = f.read()\nprint(content)\nf.close()",
      tests: [{ in: [], out: "Welcome to Computer Science\nGood luck with Paper 2!\n\n", m: 3 }],
      marks: 3,
      difficulty: "Easy" as const,
      markPoints: [
        { id: "mp1", marks: 1, criterion: "Opens 'message.txt' in read mode ('r')", exemplarCode: "f = open('message.txt', 'r')" },
        { id: "mp2", marks: 1, criterion: "Reads file content and prints to screen", exemplarCode: "content = f.read()\nprint(content)" },
        { id: "mp3", marks: 1, criterion: "Closes the file handle with .close()", exemplarCode: "f.close()" },
      ],
    },
    {
      id: "qb_u11_count_names",
      title: "File Handling: Count Records in Text File",
      brief: "A text file named 'names.txt' contains candidate names (one per line). Write a program to open 'names.txt' in read mode, count the total number of names using a loop, close the file, and print:\nTotal names: 4",
      code: "count = 0\nf = open('names.txt', 'r')\nfor line in f:\n    count += 1\nf.close()\nprint(f'Total names: {count}')",
      tests: [{ in: [], out: "Total names: 4\n", m: 4 }],
      marks: 4,
      difficulty: "Easy" as const,
      markPoints: [
        { id: "mp1", marks: 1, criterion: "Initializes count accumulator to 0", exemplarCode: "count = 0" },
        { id: "mp2", marks: 1, criterion: "Opens 'names.txt' in read mode", exemplarCode: "f = open('names.txt', 'r')" },
        { id: "mp3", marks: 1, criterion: "Iterates through lines and increments count", exemplarCode: "for line in f:\n    count += 1" },
        { id: "mp4", marks: 1, criterion: "Closes file and outputs 'Total names: ' with count", exemplarCode: "f.close()\nprint(f'Total names: {count}')" },
      ],
    },
    {
      id: "qb_u11_filter_scores",
      title: "File Handling: Filter Passing Scores from CSV",
      brief: "A CSV file named 'scores.txt' contains 'name,score' records. Open the file in read mode, parse each record, and print '<name> passed with <score>' for every student with score >= 60. Close the file.",
      code: "f = open('scores.txt', 'r')\nfor line in f:\n    line = line.strip()\n    if line:\n        p = line.split(',')\n        score = int(p[1])\n        if score >= 60:\n            print(f'{p[0]} passed with {score}')\nf.close()",
      tests: [{ in: [], out: "Alice passed with 85\nCharlie passed with 90\nDiana passed with 68\n", m: 5 }],
      marks: 5,
      difficulty: "Moderate" as const,
      markPoints: [
        { id: "mp1", marks: 1, criterion: "Opens 'scores.txt' in read mode", exemplarCode: "f = open('scores.txt', 'r')" },
        { id: "mp2", marks: 1, criterion: "Strips line and splits by comma", exemplarCode: "p = line.strip().split(',')" },
        { id: "mp3", marks: 1, criterion: "Casts score string to integer", exemplarCode: "score = int(p[1])" },
        { id: "mp4", marks: 1, criterion: "Checks selection condition score >= 60", exemplarCode: "if score >= 60:" },
        { id: "mp5", marks: 1, criterion: "Prints formatted string and closes file", exemplarCode: "print(f'{p[0]} passed with {score}')\nf.close()" },
      ],
    },
    {
      id: "qb_u11_avg_temps",
      title: "File Handling: Calculate Mean Temperature",
      brief: "A text file named 'temperatures.txt' contains float temperature values (one per line). Open the file, calculate the average temperature, close the file, and print:\nAverage temperature: 20.29 °C",
      code: "total = 0.0\ncnt = 0\nf = open('temperatures.txt', 'r')\nfor line in f:\n    line = line.strip()\n    if line:\n        total += float(line)\n        cnt += 1\nf.close()\nprint(f'Average temperature: {total / cnt:.2f} °C')",
      tests: [{ in: [], out: "Average temperature: 20.29 °C\n", m: 5 }],
      marks: 5,
      difficulty: "Moderate" as const,
      markPoints: [
        { id: "mp1", marks: 1, criterion: "Initializes total float accumulator and counter", exemplarCode: "total = 0.0\ncnt = 0" },
        { id: "mp2", marks: 1, criterion: "Opens 'temperatures.txt' in read mode", exemplarCode: "f = open('temperatures.txt', 'r')" },
        { id: "mp3", marks: 1, criterion: "Iterates, strips newline, and casts to float", exemplarCode: "total += float(line.strip())" },
        { id: "mp4", marks: 1, criterion: "Computes mean average (total / count)", exemplarCode: "avg = total / cnt" },
        { id: "mp5", marks: 1, criterion: "Closes file and prints formatted output to 2 d.p.", exemplarCode: "f.close()\nprint(f'Average temperature: {avg:.2f} °C')" },
      ],
    },
    {
      id: "qb_u11_search_runners",
      title: "File Handling: Search Runner in Race File",
      brief: "A CSV file named 'runners.txt' stores 'name,time' sprint records. Prompt for runner name with input(). Open 'runners.txt' in read mode. If found, print 'Runner: NAME finished in TIME s'. If not found, print 'Runner not found'. Close file.",
      code: "target = input().strip()\nf = open('runners.txt', 'r')\nfound = False\nfor line in f:\n    line = line.strip()\n    if line:\n        p = line.split(',')\n        if p[0].lower() == target.lower():\n            print(f'Runner: {p[0]} finished in {p[1]} s')\n            found = True\n            break\nf.close()\nif not found:\n    print('Runner not found')",
      tests: [
        { in: ["Leo"], out: "Runner: Leo finished in 11.8 s\n", m: 3 },
        { in: ["Noah"], out: "Runner: Noah finished in 12.0 s\n", m: 2 },
        { in: ["Sam"], out: "Runner not found\n", m: 1 },
      ],
      marks: 6,
      difficulty: "Moderate" as const,
      markPoints: [
        { id: "mp1", marks: 1, criterion: "Takes target runner name input", exemplarCode: "target = input().strip()" },
        { id: "mp2", marks: 1, criterion: "Opens 'runners.txt' in read mode", exemplarCode: "f = open('runners.txt', 'r')" },
        { id: "mp3", marks: 1, criterion: "Parses record and compares names case-insensitively", exemplarCode: "if p[0].lower() == target.lower():" },
        { id: "mp4", marks: 1, criterion: "Prints runner name and finishing time on match", exemplarCode: "print(f'Runner: {p[0]} finished in {p[1]} s')" },
        { id: "mp5", marks: 1, criterion: "Uses boolean flag and breaks loop on discovery", exemplarCode: "found = True\nbreak" },
        { id: "mp6", marks: 1, criterion: "Closes file and prints 'Runner not found' fallback", exemplarCode: "f.close()\nif not found: print('Runner not found')" },
      ],
    },
    {
      id: "qb_u11_sales_revenue",
      title: "File Handling: Total Revenue Aggregator",
      brief: "A CSV file named 'sales.txt' contains 'item,price,quantity' orders. Open 'sales.txt', compute total revenue by multiplying price * quantity for each order and summing the results. Close the file and print:\nTotal revenue: £73.00",
      code: "total = 0.0\nf = open('sales.txt', 'r')\nfor line in f:\n    line = line.strip()\n    if line:\n        p = line.split(',')\n        total += float(p[1]) * int(p[2])\nf.close()\nprint(f'Total revenue: £{total:.2f}')",
      tests: [{ in: [], out: "Total revenue: £73.00\n", m: 6 }],
      marks: 6,
      difficulty: "Hard" as const,
      markPoints: [
        { id: "mp1", marks: 1, criterion: "Initializes total revenue accumulator to 0.0", exemplarCode: "total = 0.0" },
        { id: "mp2", marks: 1, criterion: "Opens 'sales.txt' in read mode", exemplarCode: "f = open('sales.txt', 'r')" },
        { id: "mp3", marks: 1, criterion: "Casts price to float and quantity to integer", exemplarCode: "float(p[1]) * int(p[2])" },
        { id: "mp4", marks: 1, criterion: "Accumulates product into running total", exemplarCode: "total += float(p[1]) * int(p[2])" },
        { id: "mp5", marks: 1, criterion: "Closes file with .close()", exemplarCode: "f.close()" },
        { id: "mp6", marks: 1, criterion: "Prints formatted total revenue with £ symbol to 2 d.p.", exemplarCode: "print(f'Total revenue: £{total:.2f}')" },
      ],
    },
    {
      id: "qb_u11_inventory_reorder",
      title: "File Handling: Low Stock Inventory Alert",
      brief: "A CSV file named 'inventory.txt' stores 'item,quantity,price' records. Open the file in read mode. For every item with quantity <= 15, print 'Low stock: <item> (<qty> remaining)'. Count total low stock items, close the file, and print 'Total reorder items: <count>'.",
      code: "cnt = 0\nf = open('inventory.txt', 'r')\nfor line in f:\n    line = line.strip()\n    if line:\n        p = line.split(',')\n        qty = int(p[1])\n        if qty <= 15:\n            print(f'Low stock: {p[0]} ({qty} remaining)')\n            cnt += 1\nf.close()\nprint(f'Total reorder items: {cnt}')",
      tests: [{ in: [], out: "Low stock: Apples (15 remaining)\nLow stock: Pears (10 remaining)\nTotal reorder items: 2\n", m: 6 }],
      marks: 6,
      difficulty: "Hard" as const,
      markPoints: [
        { id: "mp1", marks: 1, criterion: "Initializes low-stock counter to 0", exemplarCode: "cnt = 0" },
        { id: "mp2", marks: 1, criterion: "Opens 'inventory.txt' in read mode", exemplarCode: "f = open('inventory.txt', 'r')" },
        { id: "mp3", marks: 1, criterion: "Splits line by comma and casts quantity to int", exemplarCode: "qty = int(p[1])" },
        { id: "mp4", marks: 1, criterion: "Tests selection condition qty <= 15", exemplarCode: "if qty <= 15:" },
        { id: "mp5", marks: 1, criterion: "Prints individual low-stock alert message", exemplarCode: "print(f'Low stock: {p[0]} ({qty} remaining)')" },
        { id: "mp6", marks: 1, criterion: "Closes file and outputs total reorder items", exemplarCode: "f.close()\nprint(f'Total reorder items: {cnt}')" },
      ],
    },
    {
      id: "qb_u11_student_lookup",
      title: "File Handling: Candidate ID Record Lookup",
      brief: "A CSV file named 'students.txt' stores 'id,name,grade' records. Take candidate ID from input(). Open 'students.txt' in read mode. If ID is found, print 'Candidate <id>: <name> - <grade>'. If not found, print 'Candidate not found'. Close file.",
      code: "target = input().strip()\nf = open('students.txt', 'r')\nfound = False\nfor line in f:\n    line = line.strip()\n    if line:\n        p = line.split(',')\n        if p[0] == target:\n            print(f'Candidate {p[0]}: {p[1]} - {p[2]}')\n            found = True\n            break\nf.close()\nif not found:\n    print('Candidate not found')",
      tests: [
        { in: ["101"], out: "Candidate 101: Maya Patel - Grade 9\n", m: 3 },
        { in: ["103"], out: "Candidate 103: Chloe Smith - Grade 8\n", m: 2 },
        { in: ["999"], out: "Candidate not found\n", m: 1 },
      ],
      marks: 6,
      difficulty: "Hard" as const,
      markPoints: [
        { id: "mp1", marks: 1, criterion: "Takes target candidate ID from input()", exemplarCode: "target = input().strip()" },
        { id: "mp2", marks: 1, criterion: "Opens 'students.txt' in read mode", exemplarCode: "f = open('students.txt', 'r')" },
        { id: "mp3", marks: 1, criterion: "Splits CSV record and matches target ID", exemplarCode: "if p[0] == target:" },
        { id: "mp4", marks: 1, criterion: "Outputs formatted candidate name and grade", exemplarCode: "print(f'Candidate {p[0]}: {p[1]} - {p[2]}')" },
        { id: "mp5", marks: 1, criterion: "Tracks match status and breaks iteration", exemplarCode: "found = True\nbreak" },
        { id: "mp6", marks: 1, criterion: "Closes file and handles candidate not found fallback", exemplarCode: "f.close()\nif not found: print('Candidate not found')" },
      ],
    },
  ];

  fileHandlingTasks.forEach((item) => {
    pushTask({
      id: item.id,
      unit: "U11",
      title: item.title,
      difficulty: item.difficulty,
      level: item.difficulty === "Easy" ? "Starter" : item.difficulty === "Moderate" ? "Core" : "Exam-style",
      type: "code",
      brief: item.brief,
      starter: "# Write your Python 3 file handling solution here\n",
      solution: item.code,
      tests: item.tests,
      marks: item.marks,
      markPoints: item.markPoints,
      markScheme: item.markPoints.map((m, i) => `Step ${i + 1} (${m.marks} mark): ${m.criterion}`).join("\n"),
    });
  });

  // =========================================================================
  // TOPIC 3: DATA REPRESENTATION (U24, U25, U26)
  // =========================================================================

  // U24: Binary, Hexadecimal & Two's Complement
  // EASY: Direct binary / denary / hex conversions
  const easyDataItems = [
    { denary: 13, binary: "00001101", hex: "0D" },
    { denary: 25, binary: "00011001", hex: "19" },
    { denary: 42, binary: "00101010", hex: "2A" },
    { denary: 63, binary: "00111111", hex: "3F" },
    { denary: 77, binary: "01001101", hex: "4D" },
    { denary: 99, binary: "01100011", hex: "63" },
    { denary: 120, binary: "01111000", hex: "78" },
    { denary: 15, binary: "00001111", hex: "0F" },
    { denary: 50, binary: "00110010", hex: "32" },
    { denary: 85, binary: "01010101", hex: "55" },
    { denary: 105, binary: "01101001", hex: "69" },
    { denary: 31, binary: "00011111", hex: "1F" },
  ];

  easyDataItems.forEach((item, idx) => {
    pushTask({
      id: `qb_u24_easy_${idx + 1}`,
      unit: "U24",
      title: `Binary & Hexadecimal: Denary ${item.denary}`,
      difficulty: "Easy",
      type: "mcq",
      brief: `Convert the denary integer ${item.denary} into an 8-bit unsigned binary number and hexadecimal representation.`,
      questions: [
        {
          q: `What is the 8-bit binary representation of denary ${item.denary}?`,
          options: [
            item.binary,
            item.binary.slice(1) + "0",
            "1" + item.binary.slice(1),
            item.binary.split("").reverse().join(""),
          ],
          a: 0,
        },
        {
          q: `What is the two-digit hexadecimal representation of denary ${item.denary}?`,
          options: [item.hex, item.hex.split("").reverse().join(""), "FF", "00"],
          a: 0,
        },
      ],
      marks: 2,
    });
  });

  // MODERATE: Two's Complement Negative Numbers
  const moderateTwosComp = [
    { val: -5, twos: "11111011", title: "Two's Complement: Decimal -5" },
    { val: -12, twos: "11110100", title: "Two's Complement: Decimal -12" },
    { val: -27, twos: "11100101", title: "Two's Complement: Decimal -27" },
    { val: -42, twos: "11010110", title: "Two's Complement: Decimal -42" },
    { val: -64, twos: "11000000", title: "Two's Complement: Decimal -64" },
    { val: -85, twos: "10101011", title: "Two's Complement: Decimal -85" },
    { val: -1, twos: "11111111", title: "Two's Complement: Decimal -1 (All 1s)" },
    { val: -128, twos: "10000000", title: "Two's Complement: Minimum 8-bit (-128)" },
    { val: -50, twos: "11001110", title: "Two's Complement: Decimal -50" },
    { val: -18, twos: "11101110", title: "Two's Complement: Decimal -18" },
    { val: -33, twos: "11011111", title: "Two's Complement: Decimal -33" },
    { val: -99, twos: "10011101", title: "Two's Complement: Decimal -99" },
  ];

  moderateTwosComp.forEach((item, idx) => {
    pushTask({
      id: `qb_u24_mod_${idx + 1}`,
      unit: "U24",
      title: item.title,
      difficulty: "Moderate",
      type: "mcq",
      brief: `Demonstrate conversion of negative decimal integer ${item.val} into 8-bit two's complement form.`,
      questions: [
        {
          q: `What is the 8-bit two's complement binary byte for ${item.val}?`,
          options: [
            item.twos,
            item.twos.slice(0, 7) + (item.twos[7] === "1" ? "0" : "1"),
            (Math.abs(item.val)).toString(2).padStart(8, "0"),
            "10000001",
          ],
          a: 0,
        },
        {
          q: "What is the standard method to compute the two's complement of a positive binary number?",
          options: [
            "Invert all the bits (0->1, 1->0) and then add 1 to the result",
            "Invert only the most significant bit (MSB)",
            "Shift all bits to the left by one position",
            "Multiply the binary value by 2",
          ],
          a: 0,
        },
      ],
      marks: 4,
    });
  });

  // HARD: Compression Ratio & Image/Audio File Size Calculations
  const hardDataCalculations = [
    { title: "Sound File Size: CD Quality 44.1kHz 16-Bit Stereo", brief: "Calculate uncompressed file size for 3 minutes of audio recorded at 44,100 Hz, 16-bit resolution, 2 channels." },
    { title: "Bitmap Image File Size: 1920x1080 24-Bit True Colour", brief: "Calculate size in mebibytes (MiB) for uncompressed 1080p frame at 24 bits per pixel (bpp)." },
    { title: "RLE Compression Ratio: Black & White Fax Scan", brief: "Calculate compression ratio percentage when 64,000 bytes compresses to 16,000 bytes using RLE." },
    { title: "Lossy vs Lossless Audio: Psychoacoustic Masking", brief: "Evaluate frequency elimination in MP3 perceptual coding vs FLAC exact restoration." },
    { title: "Unicode UTF-8 Variable Length vs ASCII 7-Bit", brief: "Analyze storage overhead and international character support across UTF-8, UTF-16 and ASCII." },
    { title: "Caesar Cipher vs Modern Asymmetric RSA Encryption", brief: "Evaluate computational feasibility of frequency analysis attacks on monoalphabetic substitution vs prime factorisation." },
  ];

  hardDataCalculations.forEach((item, idx) => {
    pushTask({
      id: `qb_u25_hard_${idx + 1}`,
      unit: "U25",
      title: item.title,
      difficulty: "Hard",
      type: "theory",
      brief: item.brief,
      questions: [
        {
          q: `Show full working for the calculation or analytical comparison specified in the brief. State the correct units (KiB, MiB, or percentage).`,
          keywords: ["formula", "bytes", "bits", "sample rate", "compression ratio", "uncompressed", "lossless"],
          maxMarks: 6,
          criteria: [
            "States the correct mathematical formula with all variables identified",
            "Performs unit conversion between bits and bytes (/ 8) correctly",
            "Applies IEC binary multiples (1024) or decimal standard where specified",
            "Arrives at accurate final numerical value with units",
          ],
        },
      ],
      marks: 6,
    });
  });

  // =========================================================================
  // TOPIC 4: COMPUTER SYSTEMS & HARDWARE (U27, U28, U29)
  // =========================================================================

  // U27 & U28: Logic Gates & Truth Tables
  // EASY: Single Logic Gates
  const easyLogicGates = [
    { gate: "AND", symbol: "D-shape with flat back", rule: "Output is 1 ONLY if both inputs A and B are 1", truth: "0, 0, 0, 1" },
    { gate: "OR", symbol: "Curved shield with curved input", rule: "Output is 1 if AT LEAST ONE input is 1", truth: "0, 1, 1, 1" },
    { gate: "NOT", symbol: "Triangle with an inversion circle bubble", rule: "Output is the exact opposite (inversion) of the single input", truth: "1, 0" },
    { gate: "XOR (Exclusive OR)", symbol: "OR gate with double curved input line", rule: "Output is 1 if inputs are DIFFERENT (one is 1, the other is 0)", truth: "0, 1, 1, 0" },
    { gate: "NAND", symbol: "AND gate with an inversion bubble", rule: "Output is 0 ONLY when both inputs are 1 (NOT AND)", truth: "1, 1, 1, 0" },
    { gate: "NOR", symbol: "OR gate with an inversion bubble", rule: "Output is 1 ONLY when both inputs are 0 (NOT OR)", truth: "1, 0, 0, 0" },
  ];

  easyLogicGates.forEach((item, idx) => {
    pushTask({
      id: `qb_u28_easy_${idx + 1}`,
      unit: "U28",
      title: `Logic Gate Symbol & Rule: ${item.gate}`,
      difficulty: "Easy",
      type: "mcq",
      brief: `Identify the logic gate definition and behavior in Section 4.3.`,
      questions: [
        {
          q: `Which logic gate matches the rule: "${item.rule}"?`,
          options: [item.gate, "Multiplexer", "Half Adder", "Flip-Flop"],
          a: 0,
        },
      ],
      marks: 1,
    });
  });

  // MODERATE: 2-input Composite Truth Tables (NAND, NOR, XOR)
  pushTask({
    id: "qb_u28_mod_nand",
    unit: "U28",
    title: "Truth Table: 2-Input NAND Gate Q = NOT(A AND B)",
    difficulty: "Moderate",
    type: "table",
    brief: "Complete the truth table for a 2-input NAND logic gate.",
    columns: [
      { label: "A", type: "text" },
      { label: "B", type: "text" },
      { label: "A AND B", type: "select", options: ["0", "1"] },
      { label: "Q = NOT(A AND B)", type: "select", options: ["0", "1"] },
    ],
    rows: [
      [{ v: "0", g: true }, { v: "0", g: true }, { v: "0" }, { v: "1" }],
      [{ v: "0", g: true }, { v: "1", g: true }, { v: "0" }, { v: "1" }],
      [{ v: "1", g: true }, { v: "0", g: true }, { v: "0" }, { v: "1" }],
      [{ v: "1", g: true }, { v: "1", g: true }, { v: "1" }, { v: "0" }],
    ],
    marks: 4,
  });

  pushTask({
    id: "qb_u28_mod_nor",
    unit: "U28",
    title: "Truth Table: 2-Input NOR Gate Q = NOT(A OR B)",
    difficulty: "Moderate",
    type: "table",
    brief: "Complete the truth table for a 2-input NOR logic gate.",
    columns: [
      { label: "A", type: "text" },
      { label: "B", type: "text" },
      { label: "A OR B", type: "select", options: ["0", "1"] },
      { label: "Q = NOT(A OR B)", type: "select", options: ["0", "1"] },
    ],
    rows: [
      [{ v: "0", g: true }, { v: "0", g: true }, { v: "0" }, { v: "1" }],
      [{ v: "0", g: true }, { v: "1", g: true }, { v: "1" }, { v: "0" }],
      [{ v: "1", g: true }, { v: "0", g: true }, { v: "1" }, { v: "0" }],
      [{ v: "1", g: true }, { v: "1", g: true }, { v: "1" }, { v: "0" }],
    ],
    marks: 4,
  });

  pushTask({
    id: "qb_u28_mod_xor",
    unit: "U28",
    title: "Truth Table: 2-Input XOR Gate Q = A XOR B",
    difficulty: "Moderate",
    type: "table",
    brief: "Complete the truth table for a 2-input Exclusive-OR logic gate.",
    columns: [
      { label: "A", type: "text" },
      { label: "B", type: "text" },
      { label: "Q = A XOR B", type: "select", options: ["0", "1"] },
    ],
    rows: [
      [{ v: "0", g: true }, { v: "0", g: true }, { v: "0" }],
      [{ v: "0", g: true }, { v: "1", g: true }, { v: "1" }],
      [{ v: "1", g: true }, { v: "0", g: true }, { v: "1" }],
      [{ v: "1", g: true }, { v: "1", g: true }, { v: "0" }],
    ],
    marks: 3,
  });

  // HARD: 3-Input Composite Logic Circuits
  pushTask({
    id: "qb_u28_hard_comp1",
    unit: "U28",
    title: "Composite Circuit Truth Table: Q = (A AND B) OR (NOT C)",
    difficulty: "Hard",
    type: "table",
    brief: "Complete the full 8-row truth table for the 3-variable logic expression Q = (A AND B) OR (NOT C).",
    columns: [
      { label: "A", type: "text" },
      { label: "B", type: "text" },
      { label: "C", type: "text" },
      { label: "A AND B", type: "select", options: ["0", "1"] },
      { label: "NOT C", type: "select", options: ["0", "1"] },
      { label: "Q", type: "select", options: ["0", "1"] },
    ],
    rows: [
      [{ v: "0", g: true }, { v: "0", g: true }, { v: "0", g: true }, { v: "0" }, { v: "1" }, { v: "1" }],
      [{ v: "0", g: true }, { v: "0", g: true }, { v: "1", g: true }, { v: "0" }, { v: "0" }, { v: "0" }],
      [{ v: "0", g: true }, { v: "1", g: true }, { v: "0", g: true }, { v: "0" }, { v: "1" }, { v: "1" }],
      [{ v: "0", g: true }, { v: "1", g: true }, { v: "1", g: true }, { v: "0" }, { v: "0" }, { v: "0" }],
      [{ v: "1", g: true }, { v: "0", g: true }, { v: "0", g: true }, { v: "0" }, { v: "1" }, { v: "1" }],
      [{ v: "1", g: true }, { v: "0", g: true }, { v: "1", g: true }, { v: "0" }, { v: "0" }, { v: "0" }],
      [{ v: "1", g: true }, { v: "1", g: true }, { v: "0", g: true }, { v: "1" }, { v: "1" }, { v: "1" }],
      [{ v: "1", g: true }, { v: "1", g: true }, { v: "1", g: true }, { v: "1" }, { v: "0" }, { v: "1" }],
    ],
    marks: 6,
  });

  // U27 & U29: Von Neumann CPU, Fetch-Decode-Execute & Translators
  // EASY
  const easyCpuHardware = [
    { title: "CPU: Arithmetic Logic Unit (ALU)", q: "Which component of the central processing unit carries out calculations (+, -, *, /) and logical comparisons (<, >, ==)?", ans: "Arithmetic Logic Unit (ALU)" },
    { title: "CPU: Control Unit (CU)", q: "Which component directs the flow of data, coordinates CPU operations, and decodes incoming instructions?", ans: "Control Unit (CU)" },
    { title: "Memory: RAM Volatility", q: "Why is Random Access Memory (RAM) classified as volatile memory?", ans: "Its stored contents are lost immediately when power is turned off" },
    { title: "Memory: ROM Purpose", q: "What crucial software is permanently stored in Read Only Memory (ROM) to bootstrap a computer when powered on?", ans: "BIOS (Basic Input/Output System) / UEFI firmware loader" },
    { title: "Translators: Compiler Definition", q: "How does a compiler translate high-level source code into executable machine code?", ans: "It translates the entire source code file all at once before execution, producing standalone object code" },
    { title: "Translators: Interpreter Definition", q: "How does an interpreter translate high-level programming code?", ans: "It translates and executes source code line by line, halting immediately if a syntax error is encountered" },
  ];

  easyCpuHardware.forEach((item, idx) => {
    pushTask({
      id: `qb_u27_easy_${idx + 1}`,
      unit: "U27",
      title: item.title,
      difficulty: "Easy",
      type: "mcq",
      brief: `Answer question regarding computer architecture and systems software.`,
      questions: [
        {
          q: item.q,
          options: [item.ans, "Graphics Processing Unit (GPU)", "Liquid Cooling Radiator", "Ethernet Controller"],
          a: 0,
        },
      ],
      marks: 1,
    });
  });

  // MODERATE: Registers, Buses & Fetch-Decode-Execute Cycle
  const moderateCpuQuestions = [
    { title: "Von Neumann: Program Counter (PC) Role", desc: "Holds the memory address of the NEXT instruction to be fetched from RAM." },
    { title: "Von Neumann: Memory Address Register (MAR) Role", desc: "Holds the address of the memory location currently being read from or written to via the address bus." },
    { title: "Von Neumann: Memory Data Register (MDR) Role", desc: "Holds the data or instruction temporarily copied from RAM or ready to be written to RAM via the data bus." },
    { title: "Von Neumann: Accumulator (ACC) Role", desc: "Holds the intermediate results of arithmetic and logic operations calculated by the ALU." },
    { title: "System Buses: Address Bus Characteristics", desc: "A unidirectional bus that carries address signals from the CPU to main memory and I/O controllers." },
    { title: "System Buses: Data Bus Characteristics", desc: "A bidirectional bus that transmits actual data bits and instruction opcodes between CPU, memory, and devices." },
    { title: "System Buses: Control Bus Characteristics", desc: "Carries command signals such as Memory Read, Memory Write, Clock pulses, and Interrupt requests." },
    { title: "Virtual Memory: Paging Mechanism", desc: "When RAM becomes full, secondary storage (SSD/HDD) space is used as an overflow extension called virtual memory." },
  ];

  moderateCpuQuestions.forEach((item, idx) => {
    pushTask({
      id: `qb_u27_mod_${idx + 1}`,
      unit: "U27",
      title: item.title,
      difficulty: "Moderate",
      type: "mcq",
      brief: `Analyze CPU micro-architecture and bus communication in Section 4.1.`,
      questions: [
        {
          q: `Which component or concept performs this exact function: "${item.desc}"?`,
          options: [item.title.split(": ")[1], "Optical Drive", "Sound Card DSP", "Peripheral USB Hub"],
          a: 0,
        },
      ],
      marks: 2,
    });
  });

  // HARD: CPU Cache, Clock Speed, Core Count & Pipelining Analysis
  const hardArchitectureQuestions = [
    { title: "CPU Performance: Clock Speed, Cache Size & Multiple Cores", brief: "Analyze the diminishing returns of increasing core count for single-threaded software." },
    { title: "Fetch-Decode-Execute: Step-by-Step Register Transfer Notation", brief: "Trace register transitions: PC -> MAR -> RAM -> MDR -> CIR -> PC increment." },
    { title: "Embedded Systems: Microcontroller Architecture in Modern Vehicles", brief: "Evaluate reliability, power consumption, and real-time operating system (RTOS) constraints." },
    { title: "Translators: Assembler, Compiler, and Interpreter Trade-Offs", brief: "Assess compilation overhead, execution speed, error debugging, and platform independence." },
  ];

  hardArchitectureQuestions.forEach((item, idx) => {
    pushTask({
      id: `qb_u27_hard_${idx + 1}`,
      unit: "U27",
      title: item.title,
      difficulty: "Hard",
      type: "theory",
      brief: item.brief,
      questions: [
        {
          q: `Discuss the key technical principles and performance trade-offs relevant to the scenario. Refer to specific hardware components and architectural concepts.`,
          keywords: ["cache", "clock speed", "cores", "registers", "FDE cycle", "bus", "bottleneck"],
          maxMarks: 6,
          criteria: [
            "Demonstrates precise understanding of CPU hardware components",
            "Explains interactions between registers, buses, and memory controllers",
            "Evaluates realistic trade-offs (e.g. power, heat, software parallelism)",
            "Draws a justified technical conclusion based on computer science theory",
          ],
        },
      ],
      marks: 6,
    });
  });

  // =========================================================================
  // TOPIC 5: NETWORKS & CYBER SECURITY (U30, U31)
  // =========================================================================

  // EASY: Basic network terms & simple cyber security
  const easyNetworkSecurity = [
    { title: "Networks: LAN vs WAN Definition", q: "What is the primary distinction between a Local Area Network (LAN) and a Wide Area Network (WAN)?", a: "A LAN covers a small geographic area (e.g. school, office) using privately owned infrastructure, whereas a WAN covers large areas using third-party telecommunications" },
    { title: "Networks: Star Topology Feature", q: "What is the main characteristic of a star network topology?", a: "All network client devices connect individually to a central switch or hub" },
    { title: "Security: Phishing Attack Recognition", q: "What is phishing?", a: "Fraudulent emails or messages pretending to be from legitimate organizations to trick victims into revealing passwords or financial details" },
    { title: "Security: Strong Password Hygiene", q: "Which of the following describes a secure password practice?", a: "Using a combination of uppercase letters, lowercase letters, numbers, and symbols with at least 12 characters" },
    { title: "Security: Shoulder Surfing", q: "What is shoulder surfing in social engineering?", a: "Directly spying on someone while they enter their PIN or password on a keypad or screen" },
    { title: "Networks: Wi-Fi vs Ethernet", q: "Why is wired Ethernet generally preferred over Wi-Fi for competitive gaming or servers?", a: "Ethernet provides lower latency, higher reliable bandwidth, and is immune to radio frequency interference" },
  ];

  easyNetworkSecurity.forEach((item, idx) => {
    pushTask({
      id: `qb_u30_easy_${idx + 1}`,
      unit: "U30",
      title: item.title,
      difficulty: "Easy",
      type: "mcq",
      brief: `Answer question regarding networks and cybersecurity fundamentals.`,
      questions: [
        {
          q: item.q,
          options: [item.a, "Ethernet requires satellite uplinks", "All computers share a single cable", "Passwords must contain only numbers"],
          a: 0,
        },
      ],
      marks: 1,
    });
  });

  // MODERATE: 4-Layer TCP/IP Model & Protocols
  const tcpipLayers = [
    { layer: "Application layer", protocols: "HTTP, HTTPS, FTP, SMTP, IMAP, DNS", purpose: "Provides networking services directly to end-user applications (browsers, email clients)." },
    { layer: "Transport layer", protocols: "TCP, UDP", purpose: "Splits data into numbered packets, handles port numbers, and establishes reliable point-to-point connections with packet retransmission." },
    { layer: "Network / Internet layer", protocols: "IP (IPv4, IPv6), ICMP", purpose: "Routes packets across interconnected logical networks using logical IP addresses." },
    { layer: "Data Link / Link layer", protocols: "Ethernet (802.3), Wi-Fi (802.11), MAC", purpose: "Transmits raw electrical/radio frames over physical network media and handles hardware MAC addresses." },
  ];

  tcpipLayers.forEach((item, idx) => {
    pushTask({
      id: `qb_u30_mod_${idx + 1}`,
      unit: "U30",
      title: `TCP/IP Stack: ${item.layer}`,
      difficulty: "Moderate",
      type: "mcq",
      brief: `Analyze the 4-layer TCP/IP protocol suite defined in Section 5.1.`,
      questions: [
        {
          q: `Which layer of the 4-layer TCP/IP stack is responsible for: "${item.purpose}"?`,
          options: [item.layer, "Physical Session Layer", "Presentation Hardware Layer", "Virtual OS Layer"],
          a: 0,
        },
        {
          q: `Which protocols operate at the ${item.layer}?`,
          options: [item.protocols, "Bluetooth only", "None", "VGA and HDMI display"],
          a: 0,
        },
      ],
      marks: 4,
    });
  });

  // HARD: Cyber Attacks (SQL Injection, DDoS, Pharming) & Defense-in-Depth
  const hardSecurityScenarios = [
    { title: "Cyber Attack: SQL Injection Vulnerability & Prepared Statements", brief: "Analyze how unsanitized input enables attackers to bypass authentication using ' OR 1=1 --." },
    { title: "Cyber Attack: Distributed Denial of Service (DDoS) Botnets", brief: "Evaluate mitigation strategies: Cloudflare CDN filtering, traffic rate limiting, and ISP blackholing." },
    { title: "Cyber Attack: Pharming and DNS Cache Poisoning", brief: "Explain how DNS redirection works and how DNSSEC protects domain resolution." },
    { title: "Network Defense: Defense-in-Depth Architecture", brief: "Design a layered defense strategy combining firewalls, WPA3, MFA, VLANs, and least privilege access." },
  ];

  hardSecurityScenarios.forEach((item, idx) => {
    pushTask({
      id: `qb_u31_hard_${idx + 1}`,
      unit: "U31",
      title: item.title,
      difficulty: "Hard",
      type: "theory",
      brief: item.brief,
      questions: [
        {
          q: `Explain the technical mechanism of the threat and evaluate two countermeasures an organization must implement to prevent or mitigate the attack.`,
          keywords: ["vulnerability", "input validation", "encryption", "firewall", "patching", "countermeasure"],
          maxMarks: 6,
          criteria: [
            "Explains the exact technical mechanism of the vulnerability or attack vector",
            "Identifies specific consequences (data loss, service disruption, privilege escalation)",
            "Recommends two valid technical countermeasures with justification",
            "Demonstrates holistic defense-in-depth awareness",
          ],
        },
      ],
      marks: 6,
    });
  });

  // =========================================================================
  // TOPIC 6: THE BIGGER PICTURE: ETHICS, ENVIRONMENT & LAW (U32)
  // =========================================================================

  // EASY
  const easyEthicsQuestions = [
    { title: "Ethics: Electronic Waste (E-Waste) Definition", q: "What is e-waste?", a: "Discarded electronic equipment such as obsolete smartphones, monitors, and computers" },
    { title: "Environment: Energy Consumption of Data Centers", q: "Why are hyperscale cloud data centers increasingly built in colder climates?", a: "To utilize natural ambient air cooling and dramatically reduce electricity used by air conditioning units" },
    { title: "Legislation: Copyright Law for Programmers", q: "Which law protects software authors against unauthorized copying, distributing, or selling of their source code?", a: "Copyright, Designs and Patents Act 1988" },
    { title: "Legislation: Computer Misuse Act Section 1", q: "What offence is committed under Section 1 of the Computer Misuse Act 1990?", a: "Unauthorized access to computer material (e.g. hacking into an account with guessed credentials)" },
  ];

  easyEthicsQuestions.forEach((item, idx) => {
    pushTask({
      id: `qb_u32_easy_${idx + 1}`,
      unit: "U32",
      title: item.title,
      difficulty: "Easy",
      type: "mcq",
      brief: `Answer question regarding Section 6 legal and environmental regulations.`,
      questions: [
        {
          q: item.q,
          options: [item.a, "Freedom of Information Act", "Road Traffic Act", "Trade Union Reform Act"],
          a: 0,
        },
      ],
      marks: 1,
    });
  });

  // MODERATE: GDPR & Legislation Principles
  const moderateEthics = [
    { title: "GDPR / DPA 2018: Lawfulness, Fairness & Transparency", desc: "Personal data must be processed lawfully, fairly, and in a transparent manner in relation to the data subject." },
    { title: "GDPR / DPA 2018: Purpose Limitation Principle", desc: "Data collected for a specified, explicit, and legitimate purpose cannot be repurposed without consent." },
    { title: "GDPR / DPA 2018: Data Minimisation Principle", desc: "Data collected must be adequate, relevant, and limited to what is strictly necessary for the stated purpose." },
    { title: "GDPR / DPA 2018: Accuracy Principle", desc: "Personal data must be accurate and kept up to date; reasonable steps must be taken to erase inaccurate data." },
    { title: "GDPR / DPA 2018: Storage Limitation Principle", desc: "Personal data must not be kept for longer than is necessary for the purposes for which it was gathered." },
    { title: "GDPR / DPA 2018: Integrity & Confidentiality (Security)", desc: "Data must be processed in a manner ensuring appropriate security, including protection against unlawful access or loss." },
  ];

  moderateEthics.forEach((item, idx) => {
    pushTask({
      id: `qb_u32_mod_${idx + 1}`,
      unit: "U32",
      title: item.title,
      difficulty: "Moderate",
      type: "mcq",
      brief: `Evaluate legal responsibilities under the Data Protection Act 2018 / UK GDPR.`,
      questions: [
        {
          q: `Which core data protection principle is described by: "${item.desc}"?`,
          options: [item.title.split(": ")[1], "Freedom of Speech Principle", "Fair Trade Doctrine", "Public Domain Exemption"],
          a: 0,
        },
      ],
      marks: 2,
    });
  });

  // HARD: Extended 6-8 Mark Ethical Dilemma Scenarios
  const hardEthicsScenarios = [
    { title: "Autonomous Vehicle Dilemmas & Algorithmic Decision Making", brief: "A self-driving car software engineer designs crash-avoidance algorithms. Evaluate utilitarian ethics vs deontological programming rules." },
    { title: "Facial Recognition & Algorithmic Bias in Law Enforcement", brief: "Evaluate false positive rates across diverse demographic groups and privacy encroachment in public surveillance." },
    { title: "Planned Obsolescence vs Right to Repair Legislation", brief: "Analyze the environmental consequences of non-replaceable batteries, proprietary screws, and software kill-switches." },
    { title: "Artificial Intelligence in Workplace Automation", brief: "Assess the socio-economic impacts of generative AI on creative, clerical, and software engineering professions." },
  ];

  hardEthicsScenarios.forEach((item, idx) => {
    pushTask({
      id: `qb_u32_hard_${idx + 1}`,
      unit: "U32",
      title: item.title,
      difficulty: "Hard",
      type: "theory",
      brief: item.brief,
      questions: [
        {
          q: `Discuss the ethical, legal, and environmental issues raised in this scenario. Provide balanced arguments from multiple perspectives and conclude with a justified recommendation.`,
          keywords: ["ethical", "legal", "environmental", "stakeholders", "GDPR", "bias", "sustainability", "justification"],
          maxMarks: 8,
          criteria: [
            "Identifies specific stakeholders affected by the technology",
            "Considers relevant legislation (e.g. DPA 2018, Computer Misuse Act, Equality Act)",
            "Discusses environmental or human ethical impacts with balanced perspective",
            "Synthesizes a coherent, well-argued conclusion",
          ],
        },
      ],
      marks: 8,
    });
  });

  return tasks;
}

// Generate the question bank
const GENERATED_TASKS = buildGeneratedBank();

/**
 * Returns all units populated with curriculum questions + Python Workbook questions.
 * Every question is categorized into Easy, Moderate, or Hard.
 */
export function getAll1000Units(): IGCSEUnit[] {
  const tasksByUnit: Record<string, IGCSETask[]> = {};
  for (const t of GENERATED_TASKS) {
    if (!tasksByUnit[t.unit]) {
      tasksByUnit[t.unit] = [];
    }
    tasksByUnit[t.unit].push(t);
  }

  const mappedUnits = INITIAL_UNITS.map((unit) => {
    // Pearson Edexcel Specification 4CP0:
    // Paper 1: Topics 1, 3, 4, 5, 6 (U14-U19, U23-U32)
    // Paper 2: Topic 2 Practical Programming (U01-U10, U20, U99)
    const isPaper1 = ["U14", "U15", "U16", "U17", "U18", "U19", "U23", "U24", "U25", "U26", "U27", "U28", "U29", "U30", "U31", "U32"].includes(unit.code);
    const paperName: "Paper 1" | "Paper 2" = isPaper1 ? "Paper 1" : "Paper 2";

    const existing = (unit.tasks || []).map((t) => {
      // Ensure difficulty is explicitly set for existing questions
      const diff: QuestionDifficulty =
        t.difficulty ||
        (t.level === "Starter" || t.level === "Easy" || t.level === "Sort by hand"
          ? "Easy"
          : t.level === "Exam-style" || t.level === "Hard"
          ? "Hard"
          : "Moderate");
      return {
        ...t,
        paper: t.paper || paperName,
        difficulty: diff,
      };
    });

    const generated = (tasksByUnit[unit.code] || []).map((t) => ({
      ...t,
      paper: t.paper || paperName,
    }));
    const combinedTasks = [...existing, ...generated];
    return {
      ...unit,
      paper: paperName,
      tasks: combinedTasks,
    };
  });

  // Ensure python workbook tasks have difficulty set and paper 2
  const workbookTasks = (PYTHON_WORKBOOK_UNIT.tasks || []).map((t, idx) => {
    let diff: QuestionDifficulty = "Easy";
    if (idx > 33 && idx <= 100) diff = "Moderate";
    else if (idx > 100) diff = "Hard";
    return {
      ...t,
      paper: "Paper 2" as const,
      difficulty: t.difficulty || diff,
    };
  });

  const enrichedWorkbookUnit: IGCSEUnit = {
    ...PYTHON_WORKBOOK_UNIT,
    paper: "Paper 2",
    tasks: workbookTasks,
  };

  const paper2025Units = get2025PaperUnits().map((u) => ({
    ...u,
    paper: "Paper 2" as const,
    topicGroup: "Past Examination Papers",
    tasks: u.tasks.map((t) => ({
      ...t,
      paperTitle: t.paperTitle || u.title,
      examBoard: t.examBoard || "Pearson Edexcel",
      paper: "Paper 2" as const,
      session: t.session || "June",
      year: t.year || 2025,
    })),
  }));
  const archivedPastPaperUnits = getArchivedPastPaperUnits().map((u) => ({
    ...u,
    paper: "Paper 2" as const,
    tasks: u.tasks.map((t) => ({ ...t, paper: "Paper 2" as const })),
  }));
  const capstone20MarkerUnit: IGCSEUnit = {
    ...get20MarkerUnit(),
    paper: "Paper 2",
    tasks: get20MarkerUnit().tasks.map((t) => ({ ...t, paper: "Paper 2" as const })),
  };

  const enrichedYear11Unit: IGCSEUnit = {
    ...YEAR11_PRACTICE_UNIT,
    paper: "Paper 2",
    tasks: YEAR11_PRACTICE_UNIT.tasks.map((t) => ({ ...t, paper: "Paper 2" as const })),
  };

  return [...mappedUnits, enrichedWorkbookUnit, ...paper2025Units, ...archivedPastPaperUnits, capstone20MarkerUnit, enrichedYear11Unit];
}

/**
 * Returns a flat array of all tasks
 */
export function getAll1000Tasks(): IGCSETask[] {
  const units = getAll1000Units();
  const all: IGCSETask[] = [];
  for (const u of units) {
    for (const t of u.tasks) {
      all.push(t);
    }
  }
  return all;
}

export const QUESTION_BANK_TOTAL_COUNT = getAll1000Tasks().length;
