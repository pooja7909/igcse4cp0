import { IGCSETask, IGCSEUnit } from "../types";

/**
 * Pearson Edexcel International GCSE (9-1) Computer Science (4CP0/2AW)
 * Paper 2: Application of Computational Thinking - Summer 2025 Series
 *
 * Exact exam questions, official mark scheme rubrics, test data, and reference solutions.
 */
export const EDEXCEL_2025_PAPER_TASKS: IGCSETask[] = [
  // =========================================================================
  // QUESTION 1 (14 Marks Total)
  // =========================================================================
  {
    id: "p25_q01a",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q1(a) Selection Statement Keyword",
    level: "Core",
    difficulty: "Easy",
    type: "mcq",
    marks: 1,
    brief:
      "Programmers use different programming constructs to create working code.\n\n" +
      "Identify the keyword used to create a selection statement.",
    questions: [
      {
        q: "Identify the keyword used to create a selection statement in Python:",
        options: ["for", "if", "new", "while"],
        a: 1, // B 'if'
      },
    ],
    hint: "Selection constructs allow a program to test conditions and choose different execution paths.",
    markScheme:
      "1 mark for:\n" +
      "• B (if) (1)\n\n" +
      "Guidance:\n" +
      "- 'if' is the keyword used in Python for selection (conditional branch execution).\n" +
      "- 'for' and 'while' are iteration constructs (looping).\n" +
      "- 'new' is not a valid Python keyword.\n" +
      "- Credit Option B, option index 1, or literal string 'if'.",
  },
  {
    id: "p25_q01bi",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q1(b)(i) Programming Error Classification",
    level: "Core",
    difficulty: "Moderate",
    type: "table",
    marks: 3,
    brief:
      "Computer code can contain errors.\n\n" +
      "Complete the table to match each error description to the correct type of error (Syntax error, Logic error, or Runtime error).\n" +
      "Type 'Yes' in the appropriate error column for each row.",
    columns: [
      { label: "Description" },
      { label: "Syntax error", type: "select", options: ["-", "Yes"] },
      { label: "Logic error", type: "select", options: ["-", "Yes"] },
      { label: "Runtime error", type: "select", options: ["-", "Yes"] },
    ],
    rows: [
      [
        { v: "The program does not produce the expected output.", g: true },
        { v: "-", g: false },
        { v: "Yes", g: false }, // Logic error
        { v: "-", g: false },
      ],
      [
        { v: "The program does not translate.", g: true },
        { v: "Yes", g: false }, // Syntax error
        { v: "-", g: false },
        { v: "-", g: false },
      ],
      [
        { v: "The program crashes during execution.", g: true },
        { v: "-", g: false },
        { v: "-", g: false },
        { v: "Yes", g: false }, // Runtime error
      ],
    ],
    hint: "Syntax errors prevent parsing/compilation. Logic errors run without crashing but produce incorrect output. Runtime errors cause an abnormal crash while running (e.g. ZeroDivisionError).",
  },
  {
    id: "p25_q01bii",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q1(b)(ii) Amend Ball Counter Code (Q01bii)",
    level: "Exam-style",
    difficulty: "Moderate",
    type: "code",
    marks: 3,
    brief:
      "A program counts the number of green and red balls stored in an array.\n" +
      "The program outputs the number of green balls, the number of red balls and the total number of balls.\n\n" +
      "Figure 1 shows the expected output from the program:\n" +
      "  Green: 25 balls\n" +
      "  Red:   15 balls\n" +
      "  Total: 40 balls\n\n" +
      "There are three errors in the starter code:\n" +
      "1. The loop range or condition has an off-by-one boundary mistake.\n" +
      "2. The condition checking for 'red' ball is faulty or misses the increment.\n" +
      "3. The total calculation or output formatting is incorrect.\n\n" +
      "Amend the code to correct the three errors so it prints the exact expected output shown above.",
    starter:
      '# Q01bii - Ball Counter\n' +
      'balls = ["green"] * 25 + ["red"] * 15\n\n' +
      'green_count = 0\n' +
      'red_count = 0\n\n' +
      '# Error 1: loop index off by one\n' +
      'for i in range(len(balls) - 1):\n' +
      '    if balls[i] == "green":\n' +
      '        green_count += 1\n' +
      '    # Error 2: incorrect string check\n' +
      '    elif balls[i] == "Red":\n' +
      '        red_count += 1\n\n' +
      '# Error 3: total calculation bug\n' +
      'total_balls = green_count - red_count\n\n' +
      'print(f"Green: {green_count} balls")\n' +
      'print(f"Red:   {red_count} balls")\n' +
      'print(f"Total: {total_balls} balls")\n',
    solution:
      '# Q01biiFINISHED - Ball Counter Corrected\n' +
      'balls = ["green"] * 25 + ["red"] * 15\n\n' +
      'green_count = 0\n' +
      'red_count = 0\n\n' +
      'for i in range(len(balls)):\n' +
      '    if balls[i] == "green":\n' +
      '        green_count += 1\n' +
      '    elif balls[i] == "red":\n' +
      '        red_count += 1\n\n' +
      'total_balls = green_count + red_count\n\n' +
      'print(f"Green: {green_count} balls")\n' +
      'print(f"Red:   {red_count} balls")\n' +
      'print(f"Total: {total_balls} balls")\n',
    markScheme:
      "Official Pearson Edexcel 4CP0 Mark Scheme (3 Marks Total):\n" +
      "• MP1 (1 mark): Loop range error corrected to range(len(balls)) so all 40 balls in the array are processed (yielding Green: 25 balls).\n" +
      "• MP2 (1 mark): String comparison corrected to lowercase 'red' so red balls are correctly counted (yielding Red: 15 balls).\n" +
      "• MP3 (1 mark): Total calculation bug corrected from subtraction to addition: total_balls = green_count + red_count (yielding Total: 40 balls).",
    tests: [
      {
        in: [],
        out: "Green: 25 balls",
        m: 1,
      },
      {
        in: [],
        out: "Red:   15 balls",
        m: 1,
      },
      {
        in: [],
        out: "Total: 40 balls",
        m: 1,
      },
    ],
    hint: "Check range(len(balls)), the lowercase 'red' string comparison, and adding green_count + red_count for the total.",
  },
  {
    id: "p25_q01ci",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q1(c)(i) Reason for Using a Constant",
    level: "Core",
    difficulty: "Easy",
    type: "theory",
    marks: 1,
    brief:
      "Programs use constants, variables and data structures.\n\n" +
      "Give ONE reason for using a constant.",
    questions: [
      {
        q: "Give one reason for using a constant in a computer program:",
        keywords: ["change", "alter", "accident", "maintain", "single", "readab", "update"],
        maxMarks: 1,
        criteria: [
          "Value cannot be accidentally/inadvertently changed or overwritten during execution",
          "Value only needs to be updated in one place to apply across entire program",
          "Makes the code easier to maintain, understand, or read",
        ],
      },
    ],
    hint: "Think about what happens to a constant's value during program execution compared to a variable.",
  },
  {
    id: "p25_q01cii",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q1(c)(ii) Difference Between Variable and Array",
    level: "Core",
    difficulty: "Moderate",
    type: "theory",
    marks: 2,
    brief:
      "Describe ONE difference between a variable and an array.",
    questions: [
      {
        q: "Describe one difference between a variable and an array:",
        keywords: ["single", "one", "multiple", "many", "index", "elements", "collection", "identifier"],
        maxMarks: 2,
        criteria: [
          "A variable holds a single/one data value, whereas an array can hold multiple values/elements under a single identifier (2 marks)",
          "Elements in an array are accessed via an index position, whereas a variable is referenced directly by name (2 marks)",
        ],
      },
    ],
    hint: "Consider how many items of data each structure can store and how individual values are accessed.",
  },
  {
    id: "p25_q01d",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q1(d) Sales Staff Wages Code Inspection (Q01d)",
    level: "Exam-style",
    difficulty: "Moderate",
    type: "inspect",
    marks: 4,
    brief:
      "A program is used to calculate wages for sales staff. Staff can earn 5% commission based on their age and sales.\n\n" +
      "Study the code snippet from Q01d to answer the questions below.",
    code:
      '# Q01d - Sales Staff Wage Calculator\n' +
      'def calc_commission(age, total_sales):\n' +
      '    commission_rate = 0.05\n' +
      '    if age >= 18 and total_sales > 1000.0:\n' +
      '        bonus = total_sales * commission_rate\n' +
      '    else:\n' +
      '        bonus = 0.0\n' +
      '    return bonus\n\n' +
      'staff_age = int(input("Enter staff age: "))\n' +
      'staff_sales = float(input("Enter monthly sales: "))\n' +
      'earned_bonus = calc_commission(staff_age, staff_sales)\n' +
      'print("Commission: £", earned_bonus)\n',
    questions: [
      {
        q: "(i) Identify the name of a user-written subprogram in this program:",
        a: ["calc_commission", "calc_commission()"],
        why: "def calc_commission(...) defines the user-written subprogram (function).",
      },
      {
        q: "(ii) Identify a logical operator used in this program:",
        a: ["and"],
        why: "'and' is the Boolean logical operator combining the two relational conditions.",
      },
      {
        q: "(iii) Identify the name of a variable that holds a real number (float):",
        a: ["commission_rate", "bonus", "total_sales", "staff_sales", "earned_bonus"],
        why: "These variables store floating-point/real numbers (e.g. 0.05, 1000.0, float input).",
      },
      {
        q: "(iv) Identify the name of a parameter:",
        a: ["age", "total_sales"],
        why: "'age' and 'total_sales' are defined in the function signature (def calc_commission(age, total_sales)).",
      },
    ],
    hint: "Look at the function definition header on line 2 and the conditional test on line 4.",
  },

  // =========================================================================
  // QUESTION 2 (12 Marks Total)
  // =========================================================================
  {
    id: "p25_q02a",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q2(a) Checking Input Data Rules",
    level: "Core",
    difficulty: "Easy",
    type: "mcq",
    marks: 1,
    brief:
      "Programs can process numerical data.\n\n" +
      "Identify the method used to check that input data matches set rules.",
    questions: [
      {
        q: "Identify the method used to check input data matches set rules:",
        options: ["Abstraction", "Encryption", "Iteration", "Validation"],
        a: 3, // D Validation
      },
    ],
    hint: "Validation checks that entered data is sensible, in range, and follows preset rules before processing.",
  },
  {
    id: "p25_q02bi",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q2(b)(i) Employee Payslip Data Types",
    level: "Core",
    difficulty: "Moderate",
    type: "inspect",
    marks: 2,
    brief:
      "Figure 2 shows a section from an employee payslip produced by a computer program:\n\n" +
      "  Pay Rate: £ 18.75    Hours: 19    Total Pay: £ 356.25\n" +
      "  Tax (20%): £ 71.25\n" +
      "  Income:   £ 285.00\n\n" +
      "State one data type shown in Figure 2 and give its corresponding example value.",
    questions: [
      {
        q: "(i) Name one data type shown in Figure 2 (e.g. Real / Float or Integer):",
        a: ["real", "float", "integer", "int", "string"],
        why: "Real/Float represents decimal monetary amounts; Integer represents whole hours worked.",
      },
      {
        q: "(ii) Give the example value from Figure 2 for your chosen data type (e.g. 18.75 or 19):",
        a: ["18.75", "356.25", "71.25", "285.00", "285", "19", "20%", "20"],
        why: "18.75/356.25/71.25/285.00 are real numbers; 19 is an integer.",
      },
    ],
    hint: "Pay Rate (£18.75) is Real/Float. Hours (19) is Integer.",
  },
  {
    id: "p25_q02bii",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q2(b)(ii) Payslip IPO Model Table",
    level: "Core",
    difficulty: "Moderate",
    type: "inspect",
    marks: 3,
    brief:
      "Complete the Input, Process, Output (IPO) breakdown for the program producing the payslip in Figure 2:\n" +
      "  Pay Rate £18.75, Hours 19 -> Total Pay £356.25 -> Tax £71.25 -> Income £285.00",
    questions: [
      {
        q: "Identify one INPUT used in the program to produce the payslip:",
        a: ["hours", "hours worked", "pay rate", "hourly rate", "rate of pay", "tax rate"],
        why: "Hours worked and Pay Rate are inputs supplied to the calculation.",
      },
      {
        q: "Identify one PROCESS performed by the program:",
        a: [
          "calculate total pay",
          "calculate tax",
          "calculate income",
          "multiply pay rate by hours",
          "multiply hours by pay rate",
          "calculate 20% tax",
          "subtract tax from total pay",
          "hours * pay rate",
        ],
        why: "Calculating Total Pay (Rate * Hours) or Net Income (Total - Tax) is a processing operation.",
      },
      {
        q: "Identify one OUTPUT generated by the program:",
        a: ["total pay", "tax", "tax paid", "income", "net income", "payslip", "356.25", "285.00", "71.25"],
        why: "The printed payslip, Total Pay, Tax amount, or Net Income are outputs.",
      },
    ],
    hint: "Input: raw values entered. Process: mathematical calculation. Output: displayed results.",
  },
  {
    id: "p25_q02ci",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q2(c)(i) Denary to Hex Test Data Table",
    level: "Core",
    difficulty: "Moderate",
    type: "inspect",
    marks: 2,
    brief:
      "A program converts denary values in the valid range 0 to 255 into hexadecimal.\n" +
      "The program is tested using appropriate test data.\n\n" +
      "Provide an example of Normal, Boundary, and Erroneous test data for this program.",
    questions: [
      {
        q: "Provide an example of NORMAL test data (any valid integer between 1 and 254):",
        a: ["42", "100", "128", "200", "50", "15", "64", "10", "1", "254"],
        why: "Any typical value strictly inside the valid range 0-255 is normal test data.",
      },
      {
        q: "Provide an example of BOUNDARY test data (the extreme limits):",
        a: ["0", "255", "0 and 255", "0, 255"],
        why: "0 and 255 represent the exact minimum and maximum boundary values.",
      },
      {
        q: "Provide an example of ERRONEOUS test data (invalid inputs outside range or wrong type):",
        a: ["-1", "256", "300", "-5", "1000", "abc", "text", "255.5"],
        why: "Values below 0, above 255, or non-integers are erroneous test data.",
      },
    ],
    hint: "Normal: typical valid value. Boundary: edge of valid range (0 or 255). Erroneous: invalid value (-1 or 256).",
  },
  {
    id: "p25_q02cii",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q2(c)(ii) Denary to Hex Converter Code (Q02cii)",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 4,
    brief:
      "A program converts denary values in the range 0 to 255 into hexadecimal.\n" +
      "The program uses a subprogram called getHex() to do the conversion.\n\n" +
      "Open Q02cii in the code editor.\n" +
      "Amend the code to complete the program to:\n" +
      "• convert the user input to an integer\n" +
      "• check the input is between 0 and 255 inclusive\n" +
      "• call the getHex subprogram, passing the user input as an argument, and print the return value\n" +
      "• if outside 0 to 255, display 'Error: Number out of range'\n\n" +
      "Do not add any further functionality.",
    starter:
      '# Q02cii - Denary to Hexadecimal\n' +
      'def getHex(denary):\n' +
      '    h = hex(denary)[2:].upper()\n' +
      '    return "0" + h if len(h) < 2 else h\n\n' +
      '# Complete the program below:\n' +
      'user_input = input("Enter a denary number (0-255): ")\n',
    solution:
      '# Q02ciiFINISHED - Denary to Hexadecimal\n' +
      'def getHex(denary):\n' +
      '    h = hex(denary)[2:].upper()\n' +
      '    return "0" + h if len(h) < 2 else h\n\n' +
      'user_input = input("Enter a denary number (0-255): ")\n' +
      'val = int(user_input)\n' +
      'if 0 <= val <= 255:\n' +
      '    hex_val = getHex(val)\n' +
      '    print(hex_val)\n' +
      'else:\n' +
      '    print("Error: Number out of range")\n',
    tests: [
      {
        in: ["42"],
        out: "2A",
        m: 1,
      },
      {
        in: ["255"],
        out: "FF",
        m: 1,
      },
      {
        in: ["0"],
        out: "00",
        m: 1,
      },
      {
        in: ["300"],
        out: "Error: Number out of range",
        m: 1,
      },
    ],
    hint: "Use int() to convert the string input, verify with 'if 0 <= val <= 255:', then call getHex(val) and print the output.",
  },

  // =========================================================================
  // QUESTION 3 (11 Marks Total)
  // =========================================================================
  {
    id: "p25_q03ai",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q3(a)(i) Bubble Sort Trace Table on Member Ages",
    level: "Exam-style",
    difficulty: "Moderate",
    type: "table",
    marks: 2,
    brief:
      "A youth club organises age-specific events for its members.\n" +
      "A bubble sort algorithm is used to sort the list of ages into ascending order.\n\n" +
      "The initial list of ages is:\n" +
      "  9   11   12   19   14   18   15   17\n\n" +
      "Complete the table to show the state of the list after each completed pass of the bubble sort.\n" +
      "(You may not need to use all the rows.)",
    columns: [
      { label: "Pass" },
      { label: "[0]" },
      { label: "[1]" },
      { label: "[2]" },
      { label: "[3]" },
      { label: "[4]" },
      { label: "[5]" },
      { label: "[6]" },
      { label: "[7]" },
    ],
    rows: [
      [
        { v: "Initial", g: true },
        { v: "9", g: true },
        { v: "11", g: true },
        { v: "12", g: true },
        { v: "19", g: true },
        { v: "14", g: true },
        { v: "18", g: true },
        { v: "15", g: true },
        { v: "17", g: true },
      ],
      [
        { v: "Pass 1", g: true },
        { v: "9", g: false },
        { v: "11", g: false },
        { v: "12", g: false },
        { v: "14", g: false },
        { v: "18", g: false },
        { v: "15", g: false },
        { v: "17", g: false },
        { v: "19", g: false },
      ],
      [
        { v: "Pass 2", g: true },
        { v: "9", g: false },
        { v: "11", g: false },
        { v: "12", g: false },
        { v: "14", g: false },
        { v: "15", g: false },
        { v: "17", g: false },
        { v: "18", g: false },
        { v: "19", g: false },
      ],
      [
        { v: "Pass 3", g: true },
        { v: "9", g: false },
        { v: "11", g: false },
        { v: "12", g: false },
        { v: "14", g: false },
        { v: "15", g: false },
        { v: "17", g: false },
        { v: "18", g: false },
        { v: "19", g: false },
      ],
    ],
    hint: "In Pass 1, 19 bubbles all the way to the end (swapping with 14, 18, 15, 17). In Pass 2, 18 bubbles past 15 and 17 to index 6. Pass 3 makes 0 swaps.",
  },
  {
    id: "p25_q03aii",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q3(a)(ii)-(iii) Bubble Sort Pass Analysis",
    level: "Core",
    difficulty: "Moderate",
    type: "inspect",
    marks: 2,
    brief:
      "Based on the bubble sort of the list [9, 11, 12, 19, 14, 18, 15, 17]:\n\n" +
      "Answer the questions on swaps and passes below.",
    questions: [
      {
        q: "(ii) State the number of swaps made in the first pass:",
        a: ["4", "four"],
        why: "In Pass 1, 19 is compared and swapped 4 times: with 14, 18, 15, and 17.",
      },
      {
        q: "(iii) State the least number of passes needed to complete the sort algorithm for this list:",
        a: ["3", "three"],
        why: "Pass 1 sorts 19 to end; Pass 2 sorts 18 and 15/17; Pass 3 makes 0 swaps confirming the list is sorted.",
      },
    ],
    hint: "In Pass 1: 19>14 (swap 1), 19>18 (swap 2), 19>15 (swap 3), 19>17 (swap 4) = 4 swaps. An optimized bubble sort finishes in 3 passes.",
  },
  {
    id: "p25_q03b",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q3(b) Search Algorithm Selection & Justification",
    level: "Core",
    difficulty: "Moderate",
    type: "theory",
    marks: 2,
    brief:
      "The youth club stores a list of sports equipment.\n" +
      "The list contains over 1000 items, sorted in ascending order.\n\n" +
      "State and justify the most appropriate search algorithm to find an item in the list.",
    questions: [
      {
        q: "State and justify the most appropriate search algorithm for over 1000 sorted items:",
        keywords: ["binary", "sorted", "half", "halv", "divide", "faster", "efficient", "log"],
        maxMarks: 2,
        criteria: [
          "State: Binary search (1 mark)",
          "Justification: The list is already sorted, so binary search repeatedly divides the search space in half (O(log n)), requiring at most ~10 comparisons instead of up to 1000 with linear search (1 mark)",
        ],
      },
    ],
    hint: "When a list is already sorted and large (>1000 items), which algorithm divides the list in half at each step?",
  },
  {
    id: "p25_q03c",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q3(c) Flowchart to Python: Average Age Calculator (Q03c)",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 5,
    brief:
      "A program is required to calculate and display the average age of members taking part in an activity.\n" +
      "Figure 3 from the 2025 paper shows a flowchart for the algorithm:\n\n" +
      "Flowchart Logic:\n" +
      "1. Initialise total = 0, count = 0.\n" +
      "2. Loop: Enter age in years.\n" +
      "3. Is age equal to 0?\n" +
      "   - If NO: total = total + age, count = count + 1, repeat loop.\n" +
      "   - If YES: exit loop.\n" +
      "4. Is count equal to 0?\n" +
      "   - If YES: Display 'No ages input'.\n" +
      "   - If NO: average = round(total / count), display:\n" +
      "     'You entered <count> ages; the average age is <average>.'\n\n" +
      "Figure 4 Test Data:\n" +
      "  Inputs: 7, 8, 9, 10, 11, 0 -> 'You entered 5 ages; the average age is 9.'\n" +
      "  Inputs: 16, 16, 14, 0      -> 'You entered 3 ages; the average age is 15.'\n" +
      "  Inputs: 0                  -> 'No ages input'\n\n" +
      "Write the program to implement the logic of the flowchart.",
    starter:
      '# Q03c - Average Age Calculator from Flowchart\n' +
      'total = 0\n' +
      'count = 0\n\n' +
      '# Write your program below:\n',
    solution:
      '# Q03cFINISHED - Average Age Calculator\n' +
      'total = 0\n' +
      'count = 0\n\n' +
      'while True:\n' +
      '    age = int(input("Enter age in years: "))\n' +
      '    if age == 0:\n' +
      '        break\n' +
      '    total += age\n' +
      '    count += 1\n\n' +
      'if count == 0:\n' +
      '    print("No ages input")\n' +
      'else:\n' +
      '    average = round(total / count)\n' +
      '    print(f"You entered {count} ages; the average age is {average}.")\n',
    tests: [
      {
        in: ["7", "8", "9", "10", "11", "0"],
        out: "You entered 5 ages; the average age is 9.",
        m: 2,
      },
      {
        in: ["16", "16", "14", "0"],
        out: "You entered 3 ages; the average age is 15.",
        m: 2,
      },
      {
        in: ["0"],
        out: "No ages input",
        m: 1,
      },
    ],
    hint: "Use a while loop that terminates when age == 0. Check 'if count == 0:' before dividing to prevent division by zero.",
  },

  // =========================================================================
  // QUESTION 4 (11 Marks Total)
  // =========================================================================
  {
    id: "p25_q04a",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q4(a) Decomposition Theory: Planning with Comments",
    level: "Core",
    difficulty: "Easy",
    type: "theory",
    marks: 1,
    brief:
      "Eli is designing a three-throw dice game to play on a computer.\n" +
      "Figure 5 shows how Eli uses comments to plan code before writing it:\n" +
      "  // roll dice 3 times\n" +
      "  // display number rolled\n" +
      "  // update subtotal\n" +
      "  // check for roll of 3 or 6 and increment booster\n" +
      "  // calculate and output final score\n\n" +
      "State why this is a type of decomposition.",
    questions: [
      {
        q: "State why using comments to plan code steps is a type of decomposition:",
        keywords: ["break", "smaller", "manage", "parts", "steps", "sub-problem", "complex"],
        maxMarks: 1,
        criteria: [
          "It breaks down a complex or larger problem into smaller, separate, manageable parts / sub-tasks / individual steps.",
        ],
      },
    ],
    hint: "Define decomposition: breaking down a large complex problem into smaller parts.",
  },
  {
    id: "p25_q04b",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q4(b) Abstraction Theory: Library Subprograms",
    level: "Core",
    difficulty: "Moderate",
    type: "theory",
    marks: 2,
    brief:
      "Eli decides to use a library subprogram (e.g. random.randint) to generate random numbers that model a dice throw.\n\n" +
      "Explain why this is an example of abstraction.",
    questions: [
      {
        q: "Explain why using a library random number generator is an example of abstraction:",
        keywords: ["hide", "detail", "complex", "internal", "unnecessary", "interface", "how it works"],
        maxMarks: 2,
        criteria: [
          "It hides the complex internal implementation details / mathematical algorithms of pseudo-random generation (1 mark)",
          "It allows the programmer to focus only on what the function does / providing only the necessary interface (1 mark)",
        ],
      },
    ],
    hint: "Abstraction removes or hides unnecessary complexity and internal details.",
  },
  {
    id: "p25_q04c",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q4(c) Three-Throw Dice Game with Booster (Q04c)",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 8,
    brief:
      "Eli’s program has these requirements:\n" +
      "• A roll of the dice is a number between 1 and 6.\n" +
      "• The dice is rolled three times.\n" +
      "• The numbers rolled are added to a subtotal.\n" +
      "• The final score is calculated by multiplying the subtotal by a booster value.\n" +
      "• The booster value starts at 1.\n" +
      "• Each time a 3 or 6 is rolled, the booster value is incremented by 1.\n" +
      "• The game outputs the value of each roll, and the final score.\n\n" +
      "Figure 6 shows a trace table for one execution of the program:\n" +
      "  Output: 'Rolled: 3' -> Subtotal: 3  -> Booster: 2 (3 rolled)\n" +
      "  Output: 'Rolled: 2' -> Subtotal: 5  -> Booster: 2 (neither 3 nor 6)\n" +
      "  Output: 'Rolled: 6' -> Subtotal: 11 -> Booster: 3 (6 rolled)\n" +
      "  Output: 'Score 33'  -> Subtotal (11) * Booster (3) = 33\n\n" +
      "To test your program deterministically, read three integer rolls as inputs (e.g. 3, 2, 6).\n" +
      "Open Q04c in the code editor and write the program.",
    starter:
      '# Q04c - Three-Throw Dice Game with Booster\n' +
      '# Requirements: 3 rolls, subtotal, booster starts at 1, increment booster on 3 or 6\n\n' +
      'booster = 1\n' +
      'subtotal = 0\n\n' +
      '# Write your program below:\n',
    solution:
      '# Q04cFINISHED - Three-Throw Dice Game\n' +
      'booster = 1\n' +
      'subtotal = 0\n\n' +
      'for _ in range(3):\n' +
      '    roll = int(input())\n' +
      '    print(f"Rolled: {roll}")\n' +
      '    subtotal += roll\n' +
      '    if roll == 3 or roll == 6:\n' +
      '        booster += 1\n\n' +
      'final_score = subtotal * booster\n' +
      'print(f"Score {final_score}")\n',
    tests: [
      {
        in: ["3", "2", "6"],
        out: "Rolled: 3\nRolled: 2\nRolled: 6\nScore 33",
        m: 4,
      },
      {
        in: ["1", "4", "5"],
        out: "Rolled: 1\nRolled: 4\nRolled: 5\nScore 10",
        m: 2,
      },
      {
        in: ["6", "6", "3"],
        out: "Rolled: 6\nRolled: 6\nRolled: 3\nScore 60",
        m: 2,
      },
    ],
    hint: "Loop 3 times. If roll == 3 or roll == 6, increment booster by 1. Final score = subtotal * booster.",
  },

  // =========================================================================
  // QUESTION 5 (12 Marks Total)
  // =========================================================================
  {
    id: "p25_q05a",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q5(a) Pseudocode Addition Quiz Logic Debugging",
    level: "Exam-style",
    difficulty: "Moderate",
    type: "inspect",
    marks: 4,
    brief:
      "Martha is a computer science student and is learning to code.\n" +
      "Figure 7 shows an algorithm in pseudocode written by Martha:\n\n" +
      " 1 SET first TO 0\n" +
      " 2 SET second TO 0\n" +
      " 3 SET answer TO 0\n" +
      " 4 SET user_answer TO 0\n" +
      " 5 SET score TO 0\n" +
      " 6\n" +
      " 7 REPEAT 10 TIMES\n" +
      " 8   SET score TO 0\n" +
      " 9   SET first TO RANDOM(99)\n" +
      " 10  SET second TO RANDOM(99)\n" +
      " 11  SET answer TO first + second\n" +
      " 12\n" +
      " 13  SEND first '+' second '=' TO DISPLAY\n" +
      " 14  RECEIVE user_answer FROM (INTEGER) KEYBOARD\n" +
      " 15\n" +
      " 16  IF user_answer = answer THEN\n" +
      " 17    SET score TO score + 1\n" +
      " 18  END IF\n" +
      " 19 END REPEAT\n" +
      " 20 SEND score TO DISPLAY\n\n" +
      "There is a logic error on line 8 of the pseudocode.",
    questions: [
      {
        q: "(i) Explain the problem this error will cause:",
        a: [
          "score is reset to 0 in each iteration",
          "score is reset inside the loop so previous points are lost",
          "score will only ever be 0 or 1",
          "score is reset to 0 every time the loop repeats",
          "it overwrites the score on line 8 so it only counts the last question",
        ],
        why: "Line 8 sets score TO 0 inside the repeat loop, wiping out all previously earned points in every pass.",
      },
      {
        q: "(ii) Describe the purpose of the algorithm shown in Figure 7, assuming the error has been corrected:",
        a: [
          "addition quiz generating 10 questions and calculating score",
          "tests user with 10 random addition sums and outputs final score",
          "generates 10 math questions, checks answers, and displays total score",
          "calculates score for 10 addition questions",
        ],
        why: "It runs a 10-question addition test using random integers (0-99), evaluates user input, and prints total score.",
      },
    ],
    hint: "Line 8 is inside the REPEAT 10 TIMES loop. What happens to 'score' when the second question starts?",
  },
  {
    id: "p25_q05b",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q5(b) 2D Array Grade Calculator & File Output (Q05b)",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 8,
    brief:
      "Martha is writing a program to calculate grades.\n" +
      "• Each student takes three tests. Each test has a maximum score of 50.\n" +
      "• Scores are stored in a two-dimensional array called tbl_scores.\n" +
      "• The lowest of the three scores is ignored and the other two are added to get a total out of 100.\n\n" +
      "Grades are based on Figure 8:\n" +
      "  Total 80 or more : Distinction\n" +
      "  Total 65 to 79   : Merit\n" +
      "  Total 50 to 64   : Pass\n" +
      "  Total 49 or less : Fail\n\n" +
      "Each student's total and grade are printed and saved to grades.txt.\n" +
      "Example (Figure 9):\n" +
      "  88 Distinction\n" +
      "  77 Merit\n" +
      "  96 Distinction\n" +
      "  67 Merit\n" +
      "  48 Fail\n" +
      "  76 Merit\n\n" +
      "The program must:\n" +
      "1. Calculate the total and grade for each student.\n" +
      "2. Write/print total and grade for each student.\n" +
      "3. Display a message saying 'grades file has been created'.",
    starter:
      '# Q05b - 2D Array Grades & File Creation\n' +
      'tbl_scores = [\n' +
      '    [45, 42, 43],\n' +
      '    [38, 39, 35],\n' +
      '    [48, 46, 48],\n' +
      '    [31, 36, 25],\n' +
      '    [20, 28, 15],\n' +
      '    [38, 32, 38]\n' +
      ']\n\n' +
      '# Write your program below:\n',
    solution:
      '# Q05bFINISHED - 2D Array Grades & File Output\n' +
      'tbl_scores = [\n' +
      '    [45, 42, 43],\n' +
      '    [38, 39, 35],\n' +
      '    [48, 46, 48],\n' +
      '    [31, 36, 25],\n' +
      '    [20, 28, 15],\n' +
      '    [38, 32, 38]\n' +
      ']\n\n' +
      'output_lines = []\n' +
      'for student in tbl_scores:\n' +
      '    # Ignore lowest score, add top two\n' +
      '    total = sum(student) - min(student)\n' +
      '    if total >= 80:\n' +
      '        grade = "Distinction"\n' +
      '    elif total >= 65:\n' +
      '        grade = "Merit"\n' +
      '    elif total >= 50:\n' +
      '        grade = "Pass"\n' +
      '    else:\n' +
      '        grade = "Fail"\n' +
      '    line = f"{total} {grade}"\n' +
      '    print(line)\n' +
      '    output_lines.append(line)\n\n' +
      '# File writing demonstration\n' +
      'try:\n' +
      '    with open("grades.txt", "w") as f:\n' +
      '        for l in output_lines:\n' +
      '            f.write(l + "\\n")\n' +
      'except Exception:\n' +
      '    pass\n\n' +
      'print("grades file has been created")\n',
    tests: [
      {
        in: [],
        out:
          "88 Distinction\n" +
          "77 Merit\n" +
          "96 Distinction\n" +
          "67 Merit\n" +
          "48 Fail\n" +
          "76 Merit\n" +
          "grades file has been created",
        m: 8,
      },
    ],
    hint: "For each row in tbl_scores, calculate the sum of the two highest scores (e.g. sum(student) minus the lowest score, found via comparisons or min() if learned). Compare total with 80, 65, and 50. Finally print 'grades file has been created'.",
  },

  // =========================================================================
  // QUESTION 6 (20 Marks Total)
  // =========================================================================
  {
    id: "p25_q06",
    unit: "P25",
    unitName: "Edexcel 4CP0/2AW Summer 2025 Paper 2",
    title: "Q6 Environmental City Temperatures Synthesis (Q06)",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "Environmental scientists monitor annual average temperatures of major cities.\n" +
      "City names and annual average temperatures are stored in two arrays:\n" +
      "• tbl_city stores city names.\n" +
      "• tbl_temp stores temperatures in either Celsius or Fahrenheit (e.g. 'C25' or 'F80').\n\n" +
      "The program must:\n" +
      "1. Allow a scientist to input the name of a city and its new temperature in either Celsius or Fahrenheit (e.g. 'Cairo' and 'C28').\n" +
      "   - If the city is in the array, its temperature is updated.\n" +
      "   - If the city is not in the array, print 'City not found'.\n" +
      "2. Display a table with:\n" +
      "   - A header row ('City', 'Celsius', 'Fahrenheit') and a dividing line.\n" +
      "   - Each city with its temperature in both Celsius and Fahrenheit as rounded whole numbers.\n" +
      "   - The overall average annual temperature for all cities in both Celsius and Fahrenheit as rounded whole numbers.\n\n" +
      "Conversion Formulas:\n" +
      "  F = round(C * 1.8 + 32)\n" +
      "  C = round((F - 32) / 1.8)\n\n" +
      "Include at least one subprogram. Your program should work dynamically even if the number of cities in the arrays changes.",
    starter:
      '# Q06 - Environmental City Temperature Monitor\n' +
      'tbl_city = ["Reggane", "Cairo", "New Delhi", "Muscat", "Athens", "Barcelona", "Havana", "Phoenix", "Brisbane", "Darwin"]\n' +
      'tbl_temp = ["C39", "C28", "C34", "C35", "C29", "C26", "C29", "C35", "C25", "C27"]\n\n' +
      '# Write your program below:\n',
    solution:
      '# Q06FINISHED - Environmental City Temperature Monitor\n' +
      'tbl_city = ["Reggane", "Cairo", "New Delhi", "Muscat", "Athens", "Barcelona", "Havana", "Phoenix", "Brisbane", "Darwin"]\n' +
      'tbl_temp = ["C39", "C28", "C34", "C35", "C29", "C26", "C29", "C35", "C25", "C27"]\n\n' +
      'def convert_temp(entry):\n' +
      '    unit = entry[0].upper()\n' +
      '    val = float(entry[1:])\n' +
      '    if unit == "C":\n' +
      '        c = round(val)\n' +
      '        f = round(c * 1.8 + 32)\n' +
      '    else:\n' +
      '        f = round(val)\n' +
      '        c = round((f - 32) / 1.8)\n' +
      '    return c, f\n\n' +
      'city_input = input("Enter city: ").strip()\n' +
      'temp_input = input("Enter temperature: ").strip()\n\n' +
      'if city_input in tbl_city:\n' +
      '    idx = tbl_city.index(city_input)\n' +
      '    tbl_temp[idx] = temp_input\n' +
      'else:\n' +
      '    print("City not found")\n\n' +
      'print(f"{\'City\':<16} {\'Celsius\':>8} {\'Fahrenheit\':>11}")\n' +
      'print("-" * 38)\n\n' +
      'total_c = 0\n' +
      'total_f = 0\n' +
      'n = len(tbl_city)\n\n' +
      'for i in range(n):\n' +
      '    c, f = convert_temp(tbl_temp[i])\n' +
      '    total_c += c\n' +
      '    total_f += f\n' +
      '    print(f"{tbl_city[i]:<16} {c:>8} {f:>11}")\n\n' +
      'print("-" * 38)\n' +
      'avg_c = round(total_c / n)\n' +
      'avg_f = round(total_f / n)\n' +
      'print(f"{\'Overall Average\':<16} {avg_c:>8} {avg_f:>11}")\n',
    tests: [
      {
        in: ["Cairo", "C28"],
        out:
          "City              Celsius  Fahrenheit\n" +
          "--------------------------------------\n" +
          "Reggane                39         102\n" +
          "Cairo                  28          82\n" +
          "New Delhi              34          93\n" +
          "Muscat                 35          95\n" +
          "Athens                 29          84\n" +
          "Barcelona              26          79\n" +
          "Havana                 29          84\n" +
          "Phoenix                35          95\n" +
          "Brisbane               25          77\n" +
          "Darwin                 27          81\n" +
          "--------------------------------------\n" +
          "Overall Average        30          87",
        m: 10,
      },
      {
        in: ["London", "C15"],
        out:
          "City not found\n" +
          "City              Celsius  Fahrenheit\n" +
          "--------------------------------------\n" +
          "Reggane                39         102\n" +
          "Cairo                  28          82\n" +
          "New Delhi              34          93\n" +
          "Muscat                 35          95\n" +
          "Athens                 29          84\n" +
          "Barcelona              26          79\n" +
          "Havana                 29          84\n" +
          "Phoenix                35          95\n" +
          "Brisbane               25          77\n" +
          "Darwin                 27          81\n" +
          "--------------------------------------\n" +
          "Overall Average        30          87",
        m: 10,
      },
    ],
    hint: "Use entry[0] for the unit ('C' or 'F') and float(entry[1:]) for the number. Print headers, loop over tbl_city, accumulate Celsius and Fahrenheit totals, and compute the rounded average.",
  },
];

/**
 * =========================================================================
 * COMPANION UNIT: EDEXCEL 4CP0/2AW EXAM-STYLE PATTERN QUESTIONS
 * Fresh, high-yield questions designed around the exact patterns seen in the
 * 2025 Paper 2:
 * 1. Sentinel Loop & Flowchart Translation with Division-by-Zero Guard
 * 2. 2D Array Multi-Score Extreme Filtering & Summary File Writing
 * 3. Parallel Array Record Updates, Prefix Parsing & Unit Conversion Tables
 * 4. Iterative Multiplier / Booster Simulations with Trace Tables
 * 5. Bubble Sort Swap Counters & Early Termination Analysis
 * 6. Code Comprehension with Misplaced Accumulator Debugging
 * =========================================================================
 */
export const EDEXCEL_2025_COMPANION_TASKS: IGCSETask[] = [
  // -------------------------------------------------------------------------
  // PATTERN 1: Sentinel Loop & Flowchart Translation
  // -------------------------------------------------------------------------
  {
    id: "exp_pat_sentinel_01",
    unit: "P26",
    unitName: "Edexcel 4CP0/2AW Exam Pattern Bank",
    title: "Vehicle Fleet Fuel Efficiency Sentinel Logger",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 6,
    brief:
      "A transport company logs the fuel efficiency (km per litre) of delivery vans at the end of each shift.\n" +
      "The program implements a sentinel loop following this specification:\n\n" +
      "1. Initialise count to 0 and total_km_per_litre to 0.0.\n" +
      "2. Prompt for fuel efficiency in km/L repeatedly until the sentinel value -1.0 is entered.\n" +
      "3. If fuel efficiency is positive (> 0.0):\n" +
      "   - Add value to total_km_per_litre.\n" +
      "   - Increment count by 1.\n" +
      "4. When -1.0 is entered:\n" +
      "   - If count is 0, display 'No fuel data logged'.\n" +
      "   - Otherwise, calculate average = round(total_km_per_litre / count, 1) and display:\n" +
      "     'Vans logged: <count> | Mean efficiency: <average> km/L'\n\n" +
      "Test with: 14.2, 12.8, 15.0, -1.0 -> 'Vans logged: 3 | Mean efficiency: 14.0 km/L'\n" +
      "Test with: -1.0                    -> 'No fuel data logged'",
    starter:
      '# Fleet Fuel Efficiency Logger\n' +
      'count = 0\n' +
      'total = 0.0\n\n' +
      '# Write your program below:\n',
    solution:
      'count = 0\n' +
      'total = 0.0\n\n' +
      'while True:\n' +
      '    val = float(input())\n' +
      '    if val == -1.0:\n' +
      '        break\n' +
      '    if val > 0.0:\n' +
      '        total += val\n' +
      '        count += 1\n\n' +
      'if count == 0:\n' +
      '    print("No fuel data logged")\n' +
      'else:\n' +
      '    avg = round(total / count, 1)\n' +
      '    print(f"Vans logged: {count} | Mean efficiency: {avg} km/L")\n',
    tests: [
      {
        in: ["14.2", "12.8", "15.0", "-1.0"],
        out: "Vans logged: 3 | Mean efficiency: 14.0 km/L",
        m: 3,
      },
      {
        in: ["-1.0"],
        out: "No fuel data logged",
        m: 3,
      },
    ],
    hint: "Use a while True loop with a break condition on float input == -1.0. Protect against division by zero with 'if count == 0:'.",
  },
  {
    id: "exp_pat_sentinel_02",
    unit: "P26",
    unitName: "Edexcel 4CP0/2AW Exam Pattern Bank",
    title: "Hospital Ward Body Temperature Sentinel Monitor",
    level: "Exam-style",
    difficulty: "Moderate",
    type: "code",
    marks: 5,
    brief:
      "A nurse logs patient temperatures in Celsius.\n" +
      "The program terminates when the sentinel value 0 is entered.\n\n" +
      "Requirements:\n" +
      "• Read temperatures until 0 is entered.\n" +
      "• Count how many patients have a fever (temperature >= 38.0).\n" +
      "• Calculate and output the overall mean temperature rounded to 1 decimal place.\n" +
      "• If 0 is entered immediately, output 'No readings taken'.\n\n" +
      "Expected Output format:\n" +
      "  'Readings: 4 | Fevers detected: 2 | Average: 37.8 C'",
    starter:
      '# Patient Temperature Sentinel Monitor\n' +
      'total_temp = 0.0\n' +
      'count = 0\n' +
      'fevers = 0\n\n' +
      '# Write your program below:\n',
    solution:
      'total_temp = 0.0\n' +
      'count = 0\n' +
      'fevers = 0\n\n' +
      'while True:\n' +
      '    t = float(input())\n' +
      '    if t == 0:\n' +
      '        break\n' +
      '    count += 1\n' +
      '    total_temp += t\n' +
      '    if t >= 38.0:\n' +
      '        fevers += 1\n\n' +
      'if count == 0:\n' +
      '    print("No readings taken")\n' +
      'else:\n' +
      '    avg = round(total_temp / count, 1)\n' +
      '    print(f"Readings: {count} | Fevers detected: {fevers} | Average: {avg} C")\n',
    tests: [
      {
        in: ["36.8", "38.5", "37.2", "38.8", "0"],
        out: "Readings: 4 | Fevers detected: 2 | Average: 37.8 C",
        m: 3,
      },
      {
        in: ["0"],
        out: "No readings taken",
        m: 2,
      },
    ],
    hint: "Increment fevers when t >= 38.0. Break on t == 0. Check 'if count == 0:' before dividing.",
  },

  // -------------------------------------------------------------------------
  // PATTERN 2: 2D Array Multi-Score Extreme Filtering & File Output
  // -------------------------------------------------------------------------
  {
    id: "exp_pat_2d_file_01",
    unit: "P26",
    unitName: "Edexcel 4CP0/2AW Exam Pattern Bank",
    title: "Gymnastics Judges Scoring & Award File Creation",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 8,
    brief:
      "In a gymnastics championship, each competitor receives scores from 5 judges (out of 10.0 each).\n" +
      "The competitor names and their 5 judge scores are stored in a 2D list tbl_gymnasts (mixed string and numbers):\n" +
      "  ['Ava', 8.5, 9.2, 8.8, 9.5, 8.9]\n\n" +
      "The highest and lowest judge scores are discarded, and the remaining 3 scores are summed to give a final score out of 30.0.\n" +
      "(For Ava: drops lowest 8.5 and highest 9.5 -> remaining scores sum to 26.9 -> Silver Award)\n\n" +
      "Award Tiers:\n" +
      "  Final score >= 27.0 : Gold Award\n" +
      "  Final score >= 24.0 : Silver Award\n" +
      "  Final score >= 21.0 : Bronze Award\n" +
      "  Final score < 21.0  : Commended\n\n" +
      "Requirements:\n" +
      "1. For each gymnast, compute the trimmed sum (excluding lowest and highest score), rounded to 1 decimal place.\n" +
      "   (You can find lowest/highest using loops and comparisons, or built-in functions if learned).\n" +
      "2. Output each result in format: '<Name>: <Score> (<Award>)'\n" +
      "3. Write each line to 'gym_awards.txt' and display message 'awards file generated successfully'.",
    starter:
      '# Gymnastics Judges Scoring Engine\n' +
      'tbl_gymnasts = [\n' +
      '    ["Ava", 8.5, 9.2, 8.8, 9.5, 8.9],\n' +
      '    ["Liam", 9.4, 9.6, 9.5, 9.1, 9.8],\n' +
      '    ["Maya", 7.5, 7.8, 8.0, 7.2, 7.9],\n' +
      '    ["Noah", 6.8, 7.0, 6.5, 6.9, 7.2]\n' +
      ']\n\n' +
      '# Write your program below:\n',
    solution:
      'tbl_gymnasts = [\n' +
      '    ["Ava", 8.5, 9.2, 8.8, 9.5, 8.9],\n' +
      '    ["Liam", 9.4, 9.6, 9.5, 9.1, 9.8],\n' +
      '    ["Maya", 7.5, 7.8, 8.0, 7.2, 7.9],\n' +
      '    ["Noah", 6.8, 7.0, 6.5, 6.9, 7.2]\n' +
      ']\n\n' +
      'records = []\n' +
      'for row in tbl_gymnasts:\n' +
      '    name = row[0]\n' +
      '    scores = row[1:]\n' +
      '    total = 0\n' +
      '    lowest = scores[0]\n' +
      '    highest = scores[0]\n' +
      '    for s in scores:\n' +
      '        total += s\n' +
      '        if s < lowest:\n' +
      '            lowest = s\n' +
      '        if s > highest:\n' +
      '            highest = s\n' +
      '    trimmed_sum = round(total - lowest - highest, 1)\n' +
      '    if trimmed_sum >= 27.0:\n' +
      '        award = "Gold Award"\n' +
      '    elif trimmed_sum >= 24.0:\n' +
      '        award = "Silver Award"\n' +
      '    elif trimmed_sum >= 21.0:\n' +
      '        award = "Bronze Award"\n' +
      '    else:\n' +
      '        award = "Commended"\n' +
      '    line = f"{name}: {trimmed_sum} ({award})"\n' +
      '    print(line)\n' +
      '    records.append(line)\n\n' +
      'try:\n' +
      '    with open("gym_awards.txt", "w") as f:\n' +
      '        for r in records:\n' +
      '            f.write(r + "\\n")\n' +
      'except Exception:\n' +
      '    pass\n\n' +
      'print("awards file generated successfully")\n',
    tests: [
      {
        in: [],
        out:
          "Ava: 26.9 (Silver Award)\n" +
          "Liam: 28.5 (Gold Award)\n" +
          "Maya: 23.2 (Bronze Award)\n" +
          "Noah: 20.7 (Commended)\n" +
          "awards file generated successfully",
        m: 8,
      },
    ],
    hint: "For each row in tbl_gymnasts, name is row[0] and scores are row[1:]. Find the highest and lowest scores (using comparisons in a loop or min()/max() if learned) and subtract them from the total sum. Then evaluate thresholds >= 27.0, 24.0, and 21.0.",
  },
  {
    id: "exp_pat_2d_file_02",
    unit: "P26",
    unitName: "Edexcel 4CP0/2AW Exam Pattern Bank",
    title: "Smart Solar Panel Daily Generation Auditor",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 7,
    brief:
      "A smart home controller monitors solar panels with morning, afternoon, and evening readings in kWh.\n" +
      "The day and readings are stored in a 2D list tbl_readings (mixed string and numbers):\n" +
      "  tbl_readings = [\n" +
      "      ['Mon', 4.2, 6.8, 3.0],\n" +
      "      ['Tue', 5.1, 7.4, 4.5],\n" +
      "      ['Wed', 2.0, 3.2, 1.8],\n" +
      "      ['Thu', 6.0, 8.5, 5.5]\n" +
      "  ]\n\n" +
      "Requirements:\n" +
      "• Discard the lowest reading of the 3 periods as an overcast outlier and sum the remaining two.\n" +
      "  (Students can find the lowest reading using a comparison loop, or min() if learned).\n" +
      "• Tariff Band:\n" +
      "  - Total >= 13.0 kWh : Peak Generation\n" +
      "  - Total >= 10.0 kWh : Standard Generation\n" +
      "  - Total < 10.0 kWh  : Low Generation\n" +
      "• Print each day: '<Day>: <Total> kWh (<Band>)'\n" +
      "• Print confirmation message: 'solar audit file saved'",
    starter:
      '# Smart Solar Generation Auditor\n' +
      'tbl_readings = [\n' +
      '    ["Mon", 4.2, 6.8, 3.0],\n' +
      '    ["Tue", 5.1, 7.4, 4.5],\n' +
      '    ["Wed", 2.0, 3.2, 1.8],\n' +
      '    ["Thu", 6.0, 8.5, 5.5]\n' +
      ']\n\n' +
      '# Write your program below:\n',
    solution:
      'tbl_readings = [\n' +
      '    ["Mon", 4.2, 6.8, 3.0],\n' +
      '    ["Tue", 5.1, 7.4, 4.5],\n' +
      '    ["Wed", 2.0, 3.2, 1.8],\n' +
      '    ["Thu", 6.0, 8.5, 5.5]\n' +
      ']\n\n' +
      'for row in tbl_readings:\n' +
      '    day = row[0]\n' +
      '    vals = row[1:]\n' +
      '    lowest = vals[0]\n' +
      '    for v in vals:\n' +
      '        if v < lowest:\n' +
      '            lowest = v\n' +
      '    effective = round(sum(vals) - lowest, 1)\n' +
      '    if effective >= 13.0:\n' +
      '        band = "Peak Generation"\n' +
      '    elif effective >= 10.0:\n' +
      '        band = "Standard Generation"\n' +
      '    else:\n' +
      '        band = "Low Generation"\n' +
      '    print(f"{day}: {effective} kWh ({band})")\n\n' +
      'print("solar audit file saved")\n',
    tests: [
      {
        in: [],
        out:
          "Mon: 11.0 kWh (Standard Generation)\n" +
          "Tue: 12.5 kWh (Standard Generation)\n" +
          "Wed: 5.2 kWh (Low Generation)\n" +
          "Thu: 14.5 kWh (Peak Generation)\n" +
          "solar audit file saved",
        m: 7,
      },
    ],
    hint: "For each row in tbl_readings, day is row[0] and readings are row[1:]. Find the lowest reading (using a loop/comparison or min() if learned), subtract it from the sum, and classify into bands.",
  },

  // -------------------------------------------------------------------------
  // PATTERN 3: Parallel Array Records, Prefix Parsing & Conversion
  // -------------------------------------------------------------------------
  {
    id: "exp_pat_parallel_01",
    unit: "P26",
    unitName: "Edexcel 4CP0/2AW Exam Pattern Bank",
    title: "Air Cargo Weight Monitor & Dual Unit Table",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 12,
    brief:
      "A freight airline monitors cargo container weights across flights.\n" +
      "Two parallel arrays store flight IDs and container weights:\n" +
      "  tbl_flight = ['BA101', 'EK202', 'AF303', 'QR404', 'LH505']\n" +
      "  tbl_weight = ['K450', 'L992', 'K600', 'L1100', 'K520']\n\n" +
      "Weight strings use a prefix:\n" +
      "• 'K' indicates kilograms (e.g. 'K450' = 450 kg)\n" +
      "• 'L' indicates pounds (lbs) (e.g. 'L992' = 992 lbs)\n\n" +
      "Conversions (rounded to nearest integer):\n" +
      "  lbs = round(kg * 2.20462)\n" +
      "  kg  = round(lbs / 2.20462)\n\n" +
      "Program requirements:\n" +
      "1. Input flight code (e.g. 'BA101') and new weight string (e.g. 'K480').\n" +
      "   - If found: update weight in array.\n" +
      "   - If not found: print 'Flight not found'.\n" +
      "2. Display aligned table with header and dividing line:\n" +
      "   'Flight             Kg         Lbs'\n" +
      "   '---------------------------------'\n" +
      "3. Display overall average weight across all flights in both Kg and Lbs as whole numbers.",
    starter:
      '# Air Cargo Weight Monitor\n' +
      'tbl_flight = ["BA101", "EK202", "AF303", "QR404", "LH505"]\n' +
      'tbl_weight = ["K450", "L992", "K600", "L1100", "K520"]\n\n' +
      '# Write your program below:\n',
    solution:
      'tbl_flight = ["BA101", "EK202", "AF303", "QR404", "LH505"]\n' +
      'tbl_weight = ["K450", "L992", "K600", "L1100", "K520"]\n\n' +
      'def convert_weight(entry):\n' +
      '    unit = entry[0].upper()\n' +
      '    val = float(entry[1:])\n' +
      '    if unit == "K":\n' +
      '        kg = round(val)\n' +
      '        lbs = round(kg * 2.20462)\n' +
      '    else:\n' +
      '        lbs = round(val)\n' +
      '        kg = round(lbs / 2.20462)\n' +
      '    return kg, lbs\n\n' +
      'fl = input().strip()\n' +
      'wt = input().strip()\n\n' +
      'if fl in tbl_flight:\n' +
      '    idx = tbl_flight.index(fl)\n' +
      '    tbl_weight[idx] = wt\n' +
      'else:\n' +
      '    print("Flight not found")\n\n' +
      'print(f"{\'Flight\':<14} {\'Kg\':>7} {\'Lbs\':>10}")\n' +
      'print("-" * 33)\n\n' +
      'tot_kg = 0\n' +
      'tot_lbs = 0\n' +
      'n = len(tbl_flight)\n\n' +
      'for i in range(n):\n' +
      '    kg, lbs = convert_weight(tbl_weight[i])\n' +
      '    tot_kg += kg\n' +
      '    tot_lbs += lbs\n' +
      '    print(f"{tbl_flight[i]:<14} {kg:>7} {lbs:>10}")\n\n' +
      'print("-" * 33)\n' +
      'avg_kg = round(tot_kg / n)\n' +
      'avg_lbs = round(tot_lbs / n)\n' +
      'print(f"{\'Average\':<14} {avg_kg:>7} {avg_lbs:>10}")\n',
    tests: [
      {
        in: ["BA101", "K450"],
        out:
          "Flight             Kg        Lbs\n" +
          "---------------------------------\n" +
          "BA101             450        992\n" +
          "EK202             450        992\n" +
          "AF303             600       1323\n" +
          "QR404             499       1100\n" +
          "LH505             520       1146\n" +
          "---------------------------------\n" +
          "Average           504       1111",
        m: 6,
      },
      {
        in: ["XX999", "K500"],
        out:
          "Flight not found\n" +
          "Flight             Kg        Lbs\n" +
          "---------------------------------\n" +
          "BA101             450        992\n" +
          "EK202             450        992\n" +
          "AF303             600       1323\n" +
          "QR404             499       1100\n" +
          "LH505             520       1146\n" +
          "---------------------------------\n" +
          "Average           504       1111",
        m: 6,
      },
    ],
    hint: "Use entry[0] for 'K' or 'L' and float(entry[1:]) for the value. Convert, sum across all flights, and compute round(total / len(tbl_flight)).",
  },

  // -------------------------------------------------------------------------
  // PATTERN 4: Simulation with Conditional Multipliers & Boosters
  // -------------------------------------------------------------------------
  {
    id: "exp_pat_sim_booster_01",
    unit: "P26",
    unitName: "Edexcel 4CP0/2AW Exam Pattern Bank",
    title: "Cricket Six-Ball Over Simulator with Boundary Boosters",
    level: "Exam-style",
    difficulty: "Moderate",
    type: "code",
    marks: 6,
    brief:
      "A cricket batting simulation models a single 6-ball over.\n" +
      "Rules:\n" +
      "• In each delivery, the batter scores runs (0, 1, 2, 3, 4, or 6).\n" +
      "• Runs are accumulated into a subtotal.\n" +
      "• A momentum multiplier starts at 1.\n" +
      "• If the batter hits a boundary (4 or 6 runs), the momentum multiplier is incremented by 1.\n" +
      "• Output each delivery: 'Ball <n>: <runs> runs'\n" +
      "• Calculate final innings points: subtotal * multiplier.\n" +
      "• Output: 'Innings Points: <final_points>'\n\n" +
      "Test with: 1, 4, 0, 6, 2, 4 -> subtotal = 17, boundaries = 3, multiplier = 4 -> Innings Points: 68",
    starter:
      '# Cricket Six-Ball Over Simulator\n' +
      'subtotal = 0\n' +
      'multiplier = 1\n\n' +
      '# Write your program below:\n',
    solution:
      'subtotal = 0\n' +
      'multiplier = 1\n\n' +
      'for i in range(1, 7):\n' +
      '    runs = int(input())\n' +
      '    print(f"Ball {i}: {runs} runs")\n' +
      '    subtotal += runs\n' +
      '    if runs == 4 or runs == 6:\n' +
      '        multiplier += 1\n\n' +
      'final_points = subtotal * multiplier\n' +
      'print(f"Innings Points: {final_points}")\n',
    tests: [
      {
        in: ["1", "4", "0", "6", "2", "4"],
        out:
          "Ball 1: 1 runs\n" +
          "Ball 2: 4 runs\n" +
          "Ball 3: 0 runs\n" +
          "Ball 4: 6 runs\n" +
          "Ball 5: 2 runs\n" +
          "Ball 6: 4 runs\n" +
          "Innings Points: 68",
        m: 4,
      },
      {
        in: ["0", "1", "1", "2", "0", "1"],
        out:
          "Ball 1: 0 runs\n" +
          "Ball 2: 1 runs\n" +
          "Ball 3: 1 runs\n" +
          "Ball 4: 2 runs\n" +
          "Ball 5: 0 runs\n" +
          "Ball 6: 1 runs\n" +
          "Innings Points: 5",
        m: 2,
      },
    ],
    hint: "Loop 6 times (ball 1 to 6). When runs == 4 or runs == 6, increment multiplier. Multiply subtotal by multiplier at end.",
  },

  // -------------------------------------------------------------------------
  // PATTERN 5: Sorting & Search Justification Trace
  // -------------------------------------------------------------------------
  {
    id: "exp_pat_bubble_01",
    unit: "P26",
    unitName: "Edexcel 4CP0/2AW Exam Pattern Bank",
    title: "Bubble Sort Pass Counter on Examination Scores",
    level: "Core",
    difficulty: "Moderate",
    type: "table",
    marks: 4,
    brief:
      "A teacher sorts a list of examination percentages: [74, 82, 65, 91, 58, 88].\n" +
      "A standard ascending bubble sort is applied.\n\n" +
      "Complete the state of the list after Pass 1 and Pass 2.",
    columns: [
      { label: "Pass" },
      { label: "[0]" },
      { label: "[1]" },
      { label: "[2]" },
      { label: "[3]" },
      { label: "[4]" },
      { label: "[5]" },
    ],
    rows: [
      [
        { v: "Initial", g: true },
        { v: "74", g: true },
        { v: "82", g: true },
        { v: "65", g: true },
        { v: "91", g: true },
        { v: "58", g: true },
        { v: "88", g: true },
      ],
      [
        { v: "Pass 1", g: true },
        { v: "74", g: false },
        { v: "65", g: false },
        { v: "82", g: false },
        { v: "58", g: false },
        { v: "88", g: false },
        { v: "91", g: false },
      ],
      [
        { v: "Pass 2", g: true },
        { v: "65", g: false },
        { v: "74", g: false },
        { v: "58", g: false },
        { v: "82", g: false },
        { v: "88", g: false },
        { v: "91", g: false },
      ],
    ],
    hint: "Pass 1 pushes 91 to index 5. Pass 2 pushes 88 to index 4.",
  },

  // -------------------------------------------------------------------------
  // PATTERN 6: Pseudocode Logic Debugging & Accumulator Tracking
  // -------------------------------------------------------------------------
  {
    id: "exp_pat_debug_01",
    unit: "P26",
    unitName: "Edexcel 4CP0/2AW Exam Pattern Bank",
    title: "Store Loyalty Points Pseudocode Debugging",
    level: "Core",
    difficulty: "Moderate",
    type: "inspect",
    marks: 4,
    brief:
      "A retail checkout system awards loyalty points based on item purchases:\n\n" +
      " 1 SET total_points TO 0\n" +
      " 2 SET item_count TO 0\n" +
      " 3 RECEIVE num_items FROM (INTEGER) KEYBOARD\n" +
      " 4\n" +
      " 5 WHILE item_count < num_items DO\n" +
      " 6   RECEIVE price FROM (REAL) KEYBOARD\n" +
      " 7   IF price >= 50.0 THEN\n" +
      " 8     SET points TO 10\n" +
      " 9   ELSE\n" +
      " 10    SET points TO 2\n" +
      " 11  END IF\n" +
      " 12  SET total_points TO points\n" +
      " 13  SET item_count TO item_count + 1\n" +
      " 14 END WHILE\n" +
      " 15 SEND total_points TO DISPLAY\n\n" +
      "There is a logic error on line 12 of the pseudocode.",
    questions: [
      {
        q: "(i) Explain the problem the logic error on line 12 causes:",
        a: [
          "total_points is overwritten with points instead of adding",
          "it assigns points rather than adding total_points + points",
          "previous points are lost so only the last item's points are shown",
          "it should be total_points + points",
        ],
        why: "Line 12 assigns total_points = points instead of accumulating total_points = total_points + points.",
      },
      {
        q: "(ii) Write the corrected line 12 in pseudocode:",
        a: [
          "SET total_points TO total_points + points",
          "total_points = total_points + points",
          "SET total_points TO total_points + points;",
        ],
        why: "To accumulate, the variable must be updated: SET total_points TO total_points + points.",
      },
    ],
    hint: "Compare 'SET total_points TO points' with 'SET total_points TO total_points + points'.",
  },
];

/**
 * Returns the Unit objects for both the Summer 2025 Paper and its Pattern Companion Bank.
 */
export function get2025PaperUnits(): IGCSEUnit[] {
  return [
    {
      code: "P25",
      title: "Summer 2025 Paper 2 (4CP0/2AW) - Official Exam & Mark Scheme",
      topicGroup: "Past Examination Papers",
      paper: "Paper 2",
      blurb:
        "Full 80-mark authentic Pearson Edexcel Summer 2025 Paper 2: Ball counter debug, denary-to-hex converter, flowchart age sentinel loop, three-throw booster dice game, 2D array grade file writer, and environmental city temperature monitor.",
      tasks: EDEXCEL_2025_PAPER_TASKS,
    },
    {
      code: "P26",
      title: "Paper 2 Exam Pattern Companion Bank (Sentinel, 2D Array Files, Prefix Parallel)",
      topicGroup: "Past Examination Papers",
      paper: "Paper 2",
      blurb:
        "Curriculum-engineered questions mirroring the 2025 Paper 2 patterns: Fleet fuel sentinels, gymnastics judge trimming with award file writing, parallel air cargo weight prefix converters, cricket boundary multipliers, and loyalty points pseudocode debugging.",
      tasks: EDEXCEL_2025_COMPANION_TASKS,
    },
  ];
}
