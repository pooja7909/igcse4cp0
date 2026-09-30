// Pre-bundled Edexcel Assessment Bank
// Guarantees all past papers and mock examinations load instantly on Vercel, static hosts, and offline.
import { Assessment } from "../types";

export const SEED_ASSESSMENTS_MAP: Record<string, Assessment> = {
  "demo_paper2_mock": {
    "id": "demo_paper2_mock",
    "title": "IGCSE Paper 2 Mock Examination",
    "code": "IGCSE1",
    "durationMinutes": 45,
    "showScoreImmediately": false,
    "questionIds": [
      "u05c",
      "u10a",
      "u15a",
      "u20a"
    ],
    "maxMarks": 37,
    "createdAt": 1789913496664,
    "status": "active",
    "releaseSettings": {
      "resultsReleased": true,
      "shareTotalScore": true,
      "shareQuestionMarks": true,
      "shareMarkScheme": true,
      "shareSubmissionsAndAnswers": true,
      "shareTeacherFeedback": true,
      "shareReflectionSheet": true
    },
    "students": {
      "s_amira": {
        "studentId": "s_amira",
        "name": "Amira K.",
        "candidateNumber": "0014",
        "className": "11B",
        "status": "submitted",
        "currentQuestionIndex": 5,
        "answeredQuestions": [
          "u01a",
          "u04a",
          "u05c",
          "u10a",
          "u15a"
        ],
        "answers": {
          "u01a": "print(\"Welcome to Paper 2\")\nprint(\"Good luck!\")\n",
          "u04a": "mark = int(input(\"Mark: \"))\nif mark >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")",
          "u05c": "name = input(\"Full name: \")\nyear = input(\"Year: \")\nparts = name.split(\" \")\nprint(parts[1][:3].lower() + year[-2:])",
          "u10a": "names = [\"Zara\", \"Ben\", \"Chloe\", \"Dev\", \"Esme\"]\ntarget = input(\"Name: \")\nfound = -1\nfor i in range(len(names)):\n    if names[i] == target:\n        found = i\nif found == -1:\n    print(\"Not found\")\nelse:\n    print(\"Found at position\", found)",
          "u15a": [
            [
              "4",
              "5",
              "5"
            ],
            [
              "3",
              "9",
              "9"
            ],
            [
              "2",
              "12",
              "12"
            ]
          ]
        },
        "marks": {
          "u01a": 2,
          "u04a": 2,
          "u05c": 6,
          "u10a": 2,
          "u15a": 9
        },
        "totalMarks": 21,
        "maxMarks": 37,
        "percentage": 57,
        "joinedAt": 1789914576664,
        "lastActiveAt": 1789916796664,
        "submittedAt": 1789916796664,
        "feedback": "Excellent trace table and variable naming accuracy!"
      },
      "s_tariq": {
        "studentId": "s_tariq",
        "name": "Tariq M.",
        "candidateNumber": "0022",
        "className": "11B",
        "status": "in_progress",
        "currentQuestionIndex": 3,
        "answeredQuestions": [
          "u01a",
          "u04a",
          "u05c"
        ],
        "answers": {
          "u01a": "print(\"Welcome to Paper 2\")\nprint(\"Good luck!\")",
          "u04a": "mark = int(input())\nif mark >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")",
          "u05c": "name = input()\nyear = input()\nprint(name.split()[1][:3].lower() + year[-2:])"
        },
        "marks": {
          "u01a": 2,
          "u04a": 2,
          "u05c": 6
        },
        "totalMarks": 10,
        "maxMarks": 37,
        "percentage": 27,
        "joinedAt": 1789915416664,
        "lastActiveAt": 1789917036664
      },
      "s_chloe": {
        "studentId": "s_chloe",
        "name": "Chloe L.",
        "candidateNumber": "0031",
        "className": "11A",
        "status": "submitted",
        "currentQuestionIndex": 5,
        "answeredQuestions": [
          "u01a",
          "u04a",
          "u05c",
          "u10a",
          "u15a"
        ],
        "answers": {
          "u01a": "print(\"Welcome to Paper 2\")\nprint(\"Good luck!\")",
          "u04a": "mark = int(input())\nif mark > 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")",
          "u05c": "name = input()\nyear = input()\nprint(\"pat10\")",
          "u10a": "names = [\"Zara\", \"Ben\", \"Chloe\", \"Dev\", \"Esme\"]\ntarget = input()\nprint(\"Found at position 3\")",
          "u15a": [
            [
              "4",
              "5",
              "5"
            ],
            [
              "3",
              "9",
              "9"
            ],
            [
              "2",
              "12",
              "12"
            ]
          ]
        },
        "marks": {
          "u01a": 2,
          "u04a": 1,
          "u05c": 2,
          "u10a": 1,
          "u15a": 9
        },
        "totalMarks": 15,
        "maxMarks": 37,
        "percentage": 41,
        "joinedAt": 1789914696664,
        "lastActiveAt": 1789916376664,
        "submittedAt": 1789916376664
      }
    },
    "type": "assessment",
    "questions": [
      {
        "id": "u05c",
        "unit": "U05",
        "type": "code",
        "title": "Username generator",
        "level": "Exam-style",
        "brief": "Read a full name (first and surname separated by a space) and a year, e.g. \"Sam Patel\" and \"2010\". Print a username made of the first 3 letters of the surname in lower case followed by the last 2 digits of the year:\n\npat10",
        "starter": "name = input(\"Full name: \")\nyear = input(\"Year: \")\n",
        "hint": "Use name.split(\" \") to get the parts, then slice: surname[:3] and year[-2:].",
        "tests": [
          {
            "in": [
              "Sam Patel",
              "2010"
            ],
            "out": "pat10\n",
            "m": 2
          },
          {
            "in": [
              "Lin Zhou",
              "2009"
            ],
            "out": "zho09\n",
            "m": 2
          },
          {
            "in": [
              "Ola Okonkwo",
              "2011"
            ],
            "out": "oko11\n",
            "m": 2
          }
        ],
        "marks": 6,
        "difficulty": "Hard"
      },
      {
        "id": "u10a",
        "unit": "U10",
        "type": "code",
        "title": "Linear search",
        "level": "Starter",
        "brief": "Given the list below, read a name to search for. Print \"Found at position P\" (0-based) if it is there, otherwise \"Not found\". Do not use the in keyword or index().",
        "starter": "names = [\"Zara\", \"Ben\", \"Chloe\", \"Dev\", \"Esme\"]\ntarget = input(\"Name: \")\n",
        "hint": "Loop with an index i, compare names[i] to target, remember the position with a flag.",
        "tests": [
          {
            "in": [
              "Dev"
            ],
            "out": "Found at position 3\n",
            "m": 1
          },
          {
            "in": [
              "Zara"
            ],
            "out": "Found at position 0\n",
            "m": 1
          },
          {
            "in": [
              "Sam"
            ],
            "out": "Not found\n",
            "m": 0
          }
        ],
        "marks": 2,
        "difficulty": "Easy"
      },
      {
        "id": "u15a",
        "unit": "U15",
        "type": "table",
        "title": "While loop countdown trace",
        "level": "Trace table",
        "brief": "Complete the trace table for this program. Write one row each time the loop body finishes (after both statements). In the Output column write what was printed during that pass.",
        "code": "n = 5\ntotal = 0\nwhile n > 2:\n    total = total + n\n    n = n - 1\n    print(total)",
        "columns": [
          {
            "label": "n",
            "type": "text"
          },
          {
            "label": "total",
            "type": "text"
          },
          {
            "label": "Output",
            "type": "text"
          }
        ],
        "rows": [
          [
            {
              "v": "4",
              "g": false
            },
            {
              "v": "5",
              "g": false
            },
            {
              "v": "5",
              "g": false
            }
          ],
          [
            {
              "v": "3",
              "g": false
            },
            {
              "v": "9",
              "g": false
            },
            {
              "v": "9",
              "g": false
            }
          ],
          [
            {
              "v": "2",
              "g": false
            },
            {
              "v": "12",
              "g": false
            },
            {
              "v": "12",
              "g": false
            }
          ]
        ],
        "hint": "Check condition n > 2 before every pass. The loop stops as soon as it is false.",
        "marks": 9,
        "difficulty": "Moderate"
      },
      {
        "id": "u20a",
        "unit": "U20",
        "type": "code",
        "title": "Class results report",
        "level": "Exam-style",
        "brief": "Write a program for a teacher.\n1. Read 4 student names and marks (a name, then a mark, 4 times) and store them in a 2D list where each row is [name, mark].\n2. Write a function grade(mark) that returns \"A\" for 80 or more, \"B\" for 60 to 79, \"C\" for 40 to 59 and \"U\" otherwise.\n3. Print one line per student in the form \"NAME: MARK (GRADE)\" in the order entered.\n4. Print the average mark to 1 decimal place as \"Average: 62.5\".\n5. Print the name of the student with the highest mark as \"Top: NAME\".",
        "starter": "def grade(mark):\n    pass\n\nstudents = []\nfor i in range(4):\n    name = input(\"Name: \")\n    mark = int(input(\"Mark: \"))\n    # add to 2D list\n",
        "hint": "students.append([name, mark]) then loop through students.",
        "tests": [
          {
            "in": [
              "Ana",
              "85",
              "Ben",
              "60",
              "Cal",
              "45",
              "Dee",
              "30"
            ],
            "out": "Ana: 85 (A)\nBen: 60 (B)\nCal: 45 (C)\nDee: 30 (U)\nAverage: 55.0\nTop: Ana\n",
            "m": 10
          },
          {
            "in": [
              "Zed",
              "79",
              "Yas",
              "80",
              "Xin",
              "80",
              "Wes",
              "40"
            ],
            "out": "Zed: 79 (B)\nYas: 80 (A)\nXin: 80 (A)\nWes: 40 (C)\nAverage: 69.8\nTop: Yas\n",
            "m": 10
          }
        ],
        "marks": 20,
        "difficulty": "Hard"
      }
    ]
  },
  "a_wjereo": {
    "id": "a_wjereo",
    "title": "Assessment: Python: Shipping Cost Tier",
    "code": "GVK8QC",
    "type": "assessment",
    "durationMinutes": 15,
    "showScoreImmediately": true,
    "questionIds": [
      "qb_py_mod_9"
    ],
    "maxMarks": 4,
    "createdAt": 1789917912027,
    "status": "active",
    "students": {}
  },
  "exam_2025_summer_p2": {
    "id": "exam_2025_summer_p2",
    "title": "Pearson Edexcel 4CP0/2AW Summer 2025 Paper 2",
    "code": "4CP025",
    "type": "assessment",
    "durationMinutes": 180,
    "showScoreImmediately": true,
    "questionIds": [
      "p25_q01a",
      "p25_q01bi",
      "p25_q01bii",
      "p25_q01ci",
      "p25_q01cii",
      "p25_q01d",
      "p25_q02a",
      "p25_q02bi",
      "p25_q02bii",
      "p25_q02ci",
      "p25_q02cii",
      "p25_q03ai",
      "p25_q03aii",
      "p25_q03b",
      "p25_q03c",
      "p25_q04a",
      "p25_q04b",
      "p25_q04c",
      "p25_q05a",
      "p25_q05b",
      "p25_q06"
    ],
    "questions": [
      {
        "id": "p25_q01a",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q1(a) Selection Statement Keyword",
        "level": "Core",
        "difficulty": "Easy",
        "type": "mcq",
        "marks": 1,
        "brief": "Programmers use different programming constructs to create working code.\n\nIdentify the keyword used to create a selection statement.",
        "questions": [
          {
            "q": "Identify the keyword used to create a selection statement in Python:",
            "options": [
              "for",
              "if",
              "new",
              "while"
            ],
            "a": 1
          }
        ],
        "hint": "Selection constructs allow a program to test conditions and choose different execution paths."
      },
      {
        "id": "p25_q01bi",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q1(b)(i) Programming Error Classification",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "table",
        "marks": 3,
        "brief": "Computer code can contain errors.\n\nComplete the table to match each error description to the correct type of error (Syntax error, Logic error, or Runtime error).\nType 'Yes' in the appropriate error column for each row.",
        "columns": [
          {
            "label": "Description"
          },
          {
            "label": "Syntax error",
            "type": "select",
            "options": [
              "-",
              "Yes"
            ]
          },
          {
            "label": "Logic error",
            "type": "select",
            "options": [
              "-",
              "Yes"
            ]
          },
          {
            "label": "Runtime error",
            "type": "select",
            "options": [
              "-",
              "Yes"
            ]
          }
        ],
        "rows": [
          [
            {
              "v": "The program does not produce the expected output.",
              "g": true
            },
            {
              "v": "-",
              "g": false
            },
            {
              "v": "Yes",
              "g": false
            },
            {
              "v": "-",
              "g": false
            }
          ],
          [
            {
              "v": "The program does not translate.",
              "g": true
            },
            {
              "v": "Yes",
              "g": false
            },
            {
              "v": "-",
              "g": false
            },
            {
              "v": "-",
              "g": false
            }
          ],
          [
            {
              "v": "The program crashes during execution.",
              "g": true
            },
            {
              "v": "-",
              "g": false
            },
            {
              "v": "-",
              "g": false
            },
            {
              "v": "Yes",
              "g": false
            }
          ]
        ],
        "hint": "Syntax errors prevent parsing/compilation. Logic errors run without crashing but produce incorrect output. Runtime errors cause an abnormal crash while running (e.g. ZeroDivisionError)."
      },
      {
        "id": "p25_q01bii",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q1(b)(ii) Amend Ball Counter Code (Q01bii)",
        "level": "Exam-style",
        "difficulty": "Moderate",
        "type": "code",
        "marks": 3,
        "brief": "A program counts the number of green and red balls stored in an array.\nThe program outputs the number of green balls, the number of red balls and the total number of balls.\n\nFigure 1 shows the expected output from the program:\n  Green: 25 balls\n  Red:   15 balls\n  Total: 40 balls\n\nThere are three errors in the starter code:\n1. The loop range or condition has an off-by-one boundary mistake.\n2. The condition checking for 'red' ball is faulty or misses the increment.\n3. The total calculation or output formatting is incorrect.\n\nAmend the code to correct the three errors so it prints the exact expected output shown above.",
        "starter": "# Q01bii - Ball Counter\nballs = [\"green\"] * 25 + [\"red\"] * 15\n\ngreen_count = 0\nred_count = 0\n\n# Error 1: loop index off by one\nfor i in range(len(balls) - 1):\n    if balls[i] == \"green\":\n        green_count += 1\n    # Error 2: incorrect string check\n    elif balls[i] == \"Red\":\n        red_count += 1\n\n# Error 3: total calculation bug\ntotal_balls = green_count - red_count\n\nprint(f\"Green: {green_count} balls\")\nprint(f\"Red:   {red_count} balls\")\nprint(f\"Total: {total_balls} balls\")\n",
        "solution": "# Q01biiFINISHED - Ball Counter Corrected\nballs = [\"green\"] * 25 + [\"red\"] * 15\n\ngreen_count = 0\nred_count = 0\n\nfor i in range(len(balls)):\n    if balls[i] == \"green\":\n        green_count += 1\n    elif balls[i] == \"red\":\n        red_count += 1\n\ntotal_balls = green_count + red_count\n\nprint(f\"Green: {green_count} balls\")\nprint(f\"Red:   {red_count} balls\")\nprint(f\"Total: {total_balls} balls\")\n",
        "tests": [
          {
            "in": [],
            "out": "Green: 25 balls\nRed:   15 balls\nTotal: 40 balls",
            "m": 3
          }
        ],
        "hint": "Check range(len(balls)), the lowercase 'red' string comparison, and adding green_count + red_count for the total."
      },
      {
        "id": "p25_q01ci",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q1(c)(i) Reason for Using a Constant",
        "level": "Core",
        "difficulty": "Easy",
        "type": "theory",
        "marks": 1,
        "brief": "Programs use constants, variables and data structures.\n\nGive ONE reason for using a constant.",
        "questions": [
          {
            "q": "Give one reason for using a constant in a computer program:",
            "keywords": [
              "change",
              "alter",
              "accident",
              "maintain",
              "single",
              "readab",
              "update"
            ],
            "maxMarks": 1,
            "criteria": [
              "Value cannot be accidentally/inadvertently changed or overwritten during execution",
              "Value only needs to be updated in one place to apply across entire program",
              "Makes the code easier to maintain, understand, or read"
            ]
          }
        ],
        "hint": "Think about what happens to a constant's value during program execution compared to a variable."
      },
      {
        "id": "p25_q01cii",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q1(c)(ii) Difference Between Variable and Array",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "theory",
        "marks": 2,
        "brief": "Describe ONE difference between a variable and an array.",
        "questions": [
          {
            "q": "Describe one difference between a variable and an array:",
            "keywords": [
              "single",
              "one",
              "multiple",
              "many",
              "index",
              "elements",
              "collection",
              "identifier"
            ],
            "maxMarks": 2,
            "criteria": [
              "A variable holds a single/one data value, whereas an array can hold multiple values/elements under a single identifier (2 marks)",
              "Elements in an array are accessed via an index position, whereas a variable is referenced directly by name (2 marks)"
            ]
          }
        ],
        "hint": "Consider how many items of data each structure can store and how individual values are accessed."
      },
      {
        "id": "p25_q01d",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q1(d) Sales Staff Wages Code Inspection (Q01d)",
        "level": "Exam-style",
        "difficulty": "Moderate",
        "type": "inspect",
        "marks": 4,
        "brief": "A program is used to calculate wages for sales staff. Staff can earn 5% commission based on their age and sales.\n\nStudy the code snippet from Q01d to answer the questions below.",
        "code": "# Q01d - Sales Staff Wage Calculator\ndef calc_commission(age, total_sales):\n    commission_rate = 0.05\n    if age >= 18 and total_sales > 1000.0:\n        bonus = total_sales * commission_rate\n    else:\n        bonus = 0.0\n    return bonus\n\nstaff_age = int(input(\"Enter staff age: \"))\nstaff_sales = float(input(\"Enter monthly sales: \"))\nearned_bonus = calc_commission(staff_age, staff_sales)\nprint(\"Commission: £\", earned_bonus)\n",
        "questions": [
          {
            "q": "(i) Identify the name of a user-written subprogram in this program:",
            "a": [
              "calc_commission",
              "calc_commission()"
            ],
            "why": "def calc_commission(...) defines the user-written subprogram (function)."
          },
          {
            "q": "(ii) Identify a logical operator used in this program:",
            "a": [
              "and"
            ],
            "why": "'and' is the Boolean logical operator combining the two relational conditions."
          },
          {
            "q": "(iii) Identify the name of a variable that holds a real number (float):",
            "a": [
              "commission_rate",
              "bonus",
              "total_sales",
              "staff_sales",
              "earned_bonus"
            ],
            "why": "These variables store floating-point/real numbers (e.g. 0.05, 1000.0, float input)."
          },
          {
            "q": "(iv) Identify the name of a parameter:",
            "a": [
              "age",
              "total_sales"
            ],
            "why": "'age' and 'total_sales' are defined in the function signature (def calc_commission(age, total_sales))."
          }
        ],
        "hint": "Look at the function definition header on line 2 and the conditional test on line 4."
      },
      {
        "id": "p25_q02a",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q2(a) Checking Input Data Rules",
        "level": "Core",
        "difficulty": "Easy",
        "type": "mcq",
        "marks": 1,
        "brief": "Programs can process numerical data.\n\nIdentify the method used to check that input data matches set rules.",
        "questions": [
          {
            "q": "Identify the method used to check input data matches set rules:",
            "options": [
              "Abstraction",
              "Encryption",
              "Iteration",
              "Validation"
            ],
            "a": 3
          }
        ],
        "hint": "Validation checks that entered data is sensible, in range, and follows preset rules before processing."
      },
      {
        "id": "p25_q02bi",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q2(b)(i) Employee Payslip Data Types",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "inspect",
        "marks": 2,
        "brief": "Figure 2 shows a section from an employee payslip produced by a computer program:\n\n  Pay Rate: £ 18.75    Hours: 19    Total Pay: £ 356.25\n  Tax (20%): £ 71.25\n  Income:   £ 285.00\n\nState one data type shown in Figure 2 and give its corresponding example value.",
        "questions": [
          {
            "q": "(i) Name one data type shown in Figure 2 (e.g. Real / Float or Integer):",
            "a": [
              "real",
              "float",
              "integer",
              "int",
              "string"
            ],
            "why": "Real/Float represents decimal monetary amounts; Integer represents whole hours worked."
          },
          {
            "q": "(ii) Give the example value from Figure 2 for your chosen data type (e.g. 18.75 or 19):",
            "a": [
              "18.75",
              "356.25",
              "71.25",
              "285.00",
              "285",
              "19",
              "20%",
              "20"
            ],
            "why": "18.75/356.25/71.25/285.00 are real numbers; 19 is an integer."
          }
        ],
        "hint": "Pay Rate (£18.75) is Real/Float. Hours (19) is Integer."
      },
      {
        "id": "p25_q02bii",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q2(b)(ii) Payslip IPO Model Table",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "inspect",
        "marks": 3,
        "brief": "Complete the Input, Process, Output (IPO) breakdown for the program producing the payslip in Figure 2:\n  Pay Rate £18.75, Hours 19 -> Total Pay £356.25 -> Tax £71.25 -> Income £285.00",
        "questions": [
          {
            "q": "Identify one INPUT used in the program to produce the payslip:",
            "a": [
              "hours",
              "hours worked",
              "pay rate",
              "hourly rate",
              "rate of pay",
              "tax rate"
            ],
            "why": "Hours worked and Pay Rate are inputs supplied to the calculation."
          },
          {
            "q": "Identify one PROCESS performed by the program:",
            "a": [
              "calculate total pay",
              "calculate tax",
              "calculate income",
              "multiply pay rate by hours",
              "multiply hours by pay rate",
              "calculate 20% tax",
              "subtract tax from total pay",
              "hours * pay rate"
            ],
            "why": "Calculating Total Pay (Rate * Hours) or Net Income (Total - Tax) is a processing operation."
          },
          {
            "q": "Identify one OUTPUT generated by the program:",
            "a": [
              "total pay",
              "tax",
              "tax paid",
              "income",
              "net income",
              "payslip",
              "356.25",
              "285.00",
              "71.25"
            ],
            "why": "The printed payslip, Total Pay, Tax amount, or Net Income are outputs."
          }
        ],
        "hint": "Input: raw values entered. Process: mathematical calculation. Output: displayed results."
      },
      {
        "id": "p25_q02ci",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q2(c)(i) Denary to Hex Test Data Table",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "inspect",
        "marks": 2,
        "brief": "A program converts denary values in the valid range 0 to 255 into hexadecimal.\nThe program is tested using appropriate test data.\n\nProvide an example of Normal, Boundary, and Erroneous test data for this program.",
        "questions": [
          {
            "q": "Provide an example of NORMAL test data (any valid integer between 1 and 254):",
            "a": [
              "42",
              "100",
              "128",
              "200",
              "50",
              "15",
              "64",
              "10",
              "1",
              "254"
            ],
            "why": "Any typical value strictly inside the valid range 0-255 is normal test data."
          },
          {
            "q": "Provide an example of BOUNDARY test data (the extreme limits):",
            "a": [
              "0",
              "255",
              "0 and 255",
              "0, 255"
            ],
            "why": "0 and 255 represent the exact minimum and maximum boundary values."
          },
          {
            "q": "Provide an example of ERRONEOUS test data (invalid inputs outside range or wrong type):",
            "a": [
              "-1",
              "256",
              "300",
              "-5",
              "1000",
              "abc",
              "text",
              "255.5"
            ],
            "why": "Values below 0, above 255, or non-integers are erroneous test data."
          }
        ],
        "hint": "Normal: typical valid value. Boundary: edge of valid range (0 or 255). Erroneous: invalid value (-1 or 256)."
      },
      {
        "id": "p25_q02cii",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q2(c)(ii) Denary to Hex Converter Code (Q02cii)",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 4,
        "brief": "A program converts denary values in the range 0 to 255 into hexadecimal.\nThe program uses a subprogram called getHex() to do the conversion.\n\nOpen Q02cii in the code editor.\nAmend the code to complete the program to:\n• convert the user input to an integer\n• check the input is between 0 and 255 inclusive\n• call the getHex subprogram, passing the user input as an argument, and print the return value\n• if outside 0 to 255, display 'Error: Number out of range'\n\nDo not add any further functionality.",
        "starter": "# Q02cii - Denary to Hexadecimal\ndef getHex(denary):\n    return hex(denary)[2:].upper().zfill(2)\n\n# Complete the program below:\nuser_input = input(\"Enter a denary number (0-255): \")\n",
        "solution": "# Q02ciiFINISHED - Denary to Hexadecimal\ndef getHex(denary):\n    return hex(denary)[2:].upper().zfill(2)\n\nuser_input = input(\"Enter a denary number (0-255): \")\nval = int(user_input)\nif 0 <= val <= 255:\n    hex_val = getHex(val)\n    print(hex_val)\nelse:\n    print(\"Error: Number out of range\")\n",
        "tests": [
          {
            "in": [
              "42"
            ],
            "out": "2A",
            "m": 1
          },
          {
            "in": [
              "255"
            ],
            "out": "FF",
            "m": 1
          },
          {
            "in": [
              "0"
            ],
            "out": "00",
            "m": 1
          },
          {
            "in": [
              "300"
            ],
            "out": "Error: Number out of range",
            "m": 1
          }
        ],
        "hint": "Use int() to convert the string input, verify with 'if 0 <= val <= 255:', then call getHex(val) and print the output."
      },
      {
        "id": "p25_q03ai",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q3(a)(i) Bubble Sort Trace Table on Member Ages",
        "level": "Exam-style",
        "difficulty": "Moderate",
        "type": "table",
        "marks": 2,
        "brief": "A youth club organises age-specific events for its members.\nA bubble sort algorithm is used to sort the list of ages into ascending order.\n\nThe initial list of ages is:\n  9   11   12   19   14   18   15   17\n\nComplete the table to show the state of the list after each completed pass of the bubble sort.\n(You may not need to use all the rows.)",
        "columns": [
          {
            "label": "Pass"
          },
          {
            "label": "[0]"
          },
          {
            "label": "[1]"
          },
          {
            "label": "[2]"
          },
          {
            "label": "[3]"
          },
          {
            "label": "[4]"
          },
          {
            "label": "[5]"
          },
          {
            "label": "[6]"
          },
          {
            "label": "[7]"
          }
        ],
        "rows": [
          [
            {
              "v": "Initial",
              "g": true
            },
            {
              "v": "9",
              "g": true
            },
            {
              "v": "11",
              "g": true
            },
            {
              "v": "12",
              "g": true
            },
            {
              "v": "19",
              "g": true
            },
            {
              "v": "14",
              "g": true
            },
            {
              "v": "18",
              "g": true
            },
            {
              "v": "15",
              "g": true
            },
            {
              "v": "17",
              "g": true
            }
          ],
          [
            {
              "v": "Pass 1",
              "g": true
            },
            {
              "v": "9",
              "g": false
            },
            {
              "v": "11",
              "g": false
            },
            {
              "v": "12",
              "g": false
            },
            {
              "v": "14",
              "g": false
            },
            {
              "v": "18",
              "g": false
            },
            {
              "v": "15",
              "g": false
            },
            {
              "v": "17",
              "g": false
            },
            {
              "v": "19",
              "g": false
            }
          ],
          [
            {
              "v": "Pass 2",
              "g": true
            },
            {
              "v": "9",
              "g": false
            },
            {
              "v": "11",
              "g": false
            },
            {
              "v": "12",
              "g": false
            },
            {
              "v": "14",
              "g": false
            },
            {
              "v": "15",
              "g": false
            },
            {
              "v": "17",
              "g": false
            },
            {
              "v": "18",
              "g": false
            },
            {
              "v": "19",
              "g": false
            }
          ],
          [
            {
              "v": "Pass 3",
              "g": true
            },
            {
              "v": "9",
              "g": false
            },
            {
              "v": "11",
              "g": false
            },
            {
              "v": "12",
              "g": false
            },
            {
              "v": "14",
              "g": false
            },
            {
              "v": "15",
              "g": false
            },
            {
              "v": "17",
              "g": false
            },
            {
              "v": "18",
              "g": false
            },
            {
              "v": "19",
              "g": false
            }
          ]
        ],
        "hint": "In Pass 1, 19 bubbles all the way to the end (swapping with 14, 18, 15, 17). In Pass 2, 18 bubbles past 15 and 17 to index 6. Pass 3 makes 0 swaps."
      },
      {
        "id": "p25_q03aii",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q3(a)(ii)-(iii) Bubble Sort Pass Analysis",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "inspect",
        "marks": 2,
        "brief": "Based on the bubble sort of the list [9, 11, 12, 19, 14, 18, 15, 17]:\n\nAnswer the questions on swaps and passes below.",
        "questions": [
          {
            "q": "(ii) State the number of swaps made in the first pass:",
            "a": [
              "4",
              "four"
            ],
            "why": "In Pass 1, 19 is compared and swapped 4 times: with 14, 18, 15, and 17."
          },
          {
            "q": "(iii) State the least number of passes needed to complete the sort algorithm for this list:",
            "a": [
              "3",
              "three"
            ],
            "why": "Pass 1 sorts 19 to end; Pass 2 sorts 18 and 15/17; Pass 3 makes 0 swaps confirming the list is sorted."
          }
        ],
        "hint": "In Pass 1: 19>14 (swap 1), 19>18 (swap 2), 19>15 (swap 3), 19>17 (swap 4) = 4 swaps. An optimized bubble sort finishes in 3 passes."
      },
      {
        "id": "p25_q03b",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q3(b) Search Algorithm Selection & Justification",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "theory",
        "marks": 2,
        "brief": "The youth club stores a list of sports equipment.\nThe list contains over 1000 items, sorted in ascending order.\n\nState and justify the most appropriate search algorithm to find an item in the list.",
        "questions": [
          {
            "q": "State and justify the most appropriate search algorithm for over 1000 sorted items:",
            "keywords": [
              "binary",
              "sorted",
              "half",
              "halv",
              "divide",
              "faster",
              "efficient",
              "log"
            ],
            "maxMarks": 2,
            "criteria": [
              "State: Binary search (1 mark)",
              "Justification: The list is already sorted, so binary search repeatedly divides the search space in half (O(log n)), requiring at most ~10 comparisons instead of up to 1000 with linear search (1 mark)"
            ]
          }
        ],
        "hint": "When a list is already sorted and large (>1000 items), which algorithm divides the list in half at each step?"
      },
      {
        "id": "p25_q03c",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q3(c) Flowchart to Python: Average Age Calculator (Q03c)",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 5,
        "brief": "A program is required to calculate and display the average age of members taking part in an activity.\nFigure 3 from the 2025 paper shows a flowchart for the algorithm:\n\nFlowchart Logic:\n1. Initialise total = 0, count = 0.\n2. Loop: Enter age in years.\n3. Is age equal to 0?\n   - If NO: total = total + age, count = count + 1, repeat loop.\n   - If YES: exit loop.\n4. Is count equal to 0?\n   - If YES: Display 'No ages input'.\n   - If NO: average = round(total / count), display:\n     'You entered <count> ages; the average age is <average>.'\n\nFigure 4 Test Data:\n  Inputs: 7, 8, 9, 10, 11, 0 -> 'You entered 5 ages; the average age is 9.'\n  Inputs: 16, 16, 14, 0      -> 'You entered 3 ages; the average age is 15.'\n  Inputs: 0                  -> 'No ages input'\n\nWrite the program to implement the logic of the flowchart.",
        "starter": "# Q03c - Average Age Calculator from Flowchart\ntotal = 0\ncount = 0\n\n# Write your program below:\n",
        "solution": "# Q03cFINISHED - Average Age Calculator\ntotal = 0\ncount = 0\n\nwhile True:\n    age = int(input(\"Enter age in years: \"))\n    if age == 0:\n        break\n    total += age\n    count += 1\n\nif count == 0:\n    print(\"No ages input\")\nelse:\n    average = round(total / count)\n    print(f\"You entered {count} ages; the average age is {average}.\")\n",
        "tests": [
          {
            "in": [
              "7",
              "8",
              "9",
              "10",
              "11",
              "0"
            ],
            "out": "You entered 5 ages; the average age is 9.",
            "m": 2
          },
          {
            "in": [
              "16",
              "16",
              "14",
              "0"
            ],
            "out": "You entered 3 ages; the average age is 15.",
            "m": 2
          },
          {
            "in": [
              "0"
            ],
            "out": "No ages input",
            "m": 1
          }
        ],
        "hint": "Use a while loop that terminates when age == 0. Check 'if count == 0:' before dividing to prevent division by zero."
      },
      {
        "id": "p25_q04a",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q4(a) Decomposition Theory: Planning with Comments",
        "level": "Core",
        "difficulty": "Easy",
        "type": "theory",
        "marks": 1,
        "brief": "Eli is designing a three-throw dice game to play on a computer.\nFigure 5 shows how Eli uses comments to plan code before writing it:\n  // roll dice 3 times\n  // display number rolled\n  // update subtotal\n  // check for roll of 3 or 6 and increment booster\n  // calculate and output final score\n\nState why this is a type of decomposition.",
        "questions": [
          {
            "q": "State why using comments to plan code steps is a type of decomposition:",
            "keywords": [
              "break",
              "smaller",
              "manage",
              "parts",
              "steps",
              "sub-problem",
              "complex"
            ],
            "maxMarks": 1,
            "criteria": [
              "It breaks down a complex or larger problem into smaller, separate, manageable parts / sub-tasks / individual steps."
            ]
          }
        ],
        "hint": "Define decomposition: breaking down a large complex problem into smaller parts."
      },
      {
        "id": "p25_q04b",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q4(b) Abstraction Theory: Library Subprograms",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "theory",
        "marks": 2,
        "brief": "Eli decides to use a library subprogram (e.g. random.randint) to generate random numbers that model a dice throw.\n\nExplain why this is an example of abstraction.",
        "questions": [
          {
            "q": "Explain why using a library random number generator is an example of abstraction:",
            "keywords": [
              "hide",
              "detail",
              "complex",
              "internal",
              "unnecessary",
              "interface",
              "how it works"
            ],
            "maxMarks": 2,
            "criteria": [
              "It hides the complex internal implementation details / mathematical algorithms of pseudo-random generation (1 mark)",
              "It allows the programmer to focus only on what the function does / providing only the necessary interface (1 mark)"
            ]
          }
        ],
        "hint": "Abstraction removes or hides unnecessary complexity and internal details."
      },
      {
        "id": "p25_q04c",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q4(c) Three-Throw Dice Game with Booster (Q04c)",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 8,
        "brief": "Eli’s program has these requirements:\n• A roll of the dice is a number between 1 and 6.\n• The dice is rolled three times.\n• The numbers rolled are added to a subtotal.\n• The final score is calculated by multiplying the subtotal by a booster value.\n• The booster value starts at 1.\n• Each time a 3 or 6 is rolled, the booster value is incremented by 1.\n• The game outputs the value of each roll, and the final score.\n\nFigure 6 shows a trace table for one execution of the program:\n  Output: 'Rolled: 3' -> Subtotal: 3  -> Booster: 2 (3 rolled)\n  Output: 'Rolled: 2' -> Subtotal: 5  -> Booster: 2 (neither 3 nor 6)\n  Output: 'Rolled: 6' -> Subtotal: 11 -> Booster: 3 (6 rolled)\n  Output: 'Score 33'  -> Subtotal (11) * Booster (3) = 33\n\nTo test your program deterministically, read three integer rolls as inputs (e.g. 3, 2, 6).\nOpen Q04c in the code editor and write the program.",
        "starter": "# Q04c - Three-Throw Dice Game with Booster\n# Requirements: 3 rolls, subtotal, booster starts at 1, increment booster on 3 or 6\n\nbooster = 1\nsubtotal = 0\n\n# Write your program below:\n",
        "solution": "# Q04cFINISHED - Three-Throw Dice Game\nbooster = 1\nsubtotal = 0\n\nfor _ in range(3):\n    roll = int(input())\n    print(f\"Rolled: {roll}\")\n    subtotal += roll\n    if roll == 3 or roll == 6:\n        booster += 1\n\nfinal_score = subtotal * booster\nprint(f\"Score {final_score}\")\n",
        "tests": [
          {
            "in": [
              "3",
              "2",
              "6"
            ],
            "out": "Rolled: 3\nRolled: 2\nRolled: 6\nScore 33",
            "m": 4
          },
          {
            "in": [
              "1",
              "4",
              "5"
            ],
            "out": "Rolled: 1\nRolled: 4\nRolled: 5\nScore 10",
            "m": 2
          },
          {
            "in": [
              "6",
              "6",
              "3"
            ],
            "out": "Rolled: 6\nRolled: 6\nRolled: 3\nScore 60",
            "m": 2
          }
        ],
        "hint": "Loop 3 times. If roll == 3 or roll == 6, increment booster by 1. Final score = subtotal * booster."
      },
      {
        "id": "p25_q05a",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q5(a) Pseudocode Addition Quiz Logic Debugging",
        "level": "Exam-style",
        "difficulty": "Moderate",
        "type": "inspect",
        "marks": 4,
        "brief": "Martha is a computer science student and is learning to code.\nFigure 7 shows an algorithm in pseudocode written by Martha:\n\n 1 SET first TO 0\n 2 SET second TO 0\n 3 SET answer TO 0\n 4 SET user_answer TO 0\n 5 SET score TO 0\n 6\n 7 REPEAT 10 TIMES\n 8   SET score TO 0\n 9   SET first TO RANDOM(99)\n 10  SET second TO RANDOM(99)\n 11  SET answer TO first + second\n 12\n 13  SEND first '+' second '=' TO DISPLAY\n 14  RECEIVE user_answer FROM (INTEGER) KEYBOARD\n 15\n 16  IF user_answer = answer THEN\n 17    SET score TO score + 1\n 18  END IF\n 19 END REPEAT\n 20 SEND score TO DISPLAY\n\nThere is a logic error on line 8 of the pseudocode.",
        "questions": [
          {
            "q": "(i) Explain the problem this error will cause:",
            "a": [
              "score is reset to 0 in each iteration",
              "score is reset inside the loop so previous points are lost",
              "score will only ever be 0 or 1",
              "score is reset to 0 every time the loop repeats",
              "it overwrites the score on line 8 so it only counts the last question"
            ],
            "why": "Line 8 sets score TO 0 inside the repeat loop, wiping out all previously earned points in every pass."
          },
          {
            "q": "(ii) Describe the purpose of the algorithm shown in Figure 7, assuming the error has been corrected:",
            "a": [
              "addition quiz generating 10 questions and calculating score",
              "tests user with 10 random addition sums and outputs final score",
              "generates 10 math questions, checks answers, and displays total score",
              "calculates score for 10 addition questions"
            ],
            "why": "It runs a 10-question addition test using random integers (0-99), evaluates user input, and prints total score."
          }
        ],
        "hint": "Line 8 is inside the REPEAT 10 TIMES loop. What happens to 'score' when the second question starts?"
      },
      {
        "id": "p25_q05b",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q5(b) 2D Array Grade Calculator & File Output (Q05b)",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 8,
        "brief": "Martha is writing a program to calculate grades.\n• Each student takes three tests. Each test has a maximum score of 50.\n• Scores are stored in a two-dimensional array called tbl_scores.\n• The lowest of the three scores is ignored and the other two are added to get a total out of 100.\n\nGrades are based on Figure 8:\n  Total 80 or more : Distinction\n  Total 65 to 79   : Merit\n  Total 50 to 64   : Pass\n  Total 49 or less : Fail\n\nEach student's total and grade are printed and saved to grades.txt.\nExample (Figure 9):\n  88 Distinction\n  77 Merit\n  96 Distinction\n  67 Merit\n  48 Fail\n  76 Merit\n\nThe program must:\n1. Calculate the total and grade for each student.\n2. Write/print total and grade for each student.\n3. Display a message saying 'grades file has been created'.",
        "starter": "# Q05b - 2D Array Grades & File Creation\ntbl_scores = [\n    [45, 42, 43],\n    [38, 39, 35],\n    [48, 46, 48],\n    [31, 36, 25],\n    [20, 28, 15],\n    [38, 32, 38]\n]\n\n# Write your program below:\n",
        "solution": "# Q05bFINISHED - 2D Array Grades & File Output\ntbl_scores = [\n    [45, 42, 43],\n    [38, 39, 35],\n    [48, 46, 48],\n    [31, 36, 25],\n    [20, 28, 15],\n    [38, 32, 38]\n]\n\noutput_lines = []\nfor student in tbl_scores:\n    # Ignore lowest score, add top two\n    total = sum(student) - min(student)\n    if total >= 80:\n        grade = \"Distinction\"\n    elif total >= 65:\n        grade = \"Merit\"\n    elif total >= 50:\n        grade = \"Pass\"\n    else:\n        grade = \"Fail\"\n    line = f\"{total} {grade}\"\n    print(line)\n    output_lines.append(line)\n\n# File writing demonstration\ntry:\n    with open(\"grades.txt\", \"w\") as f:\n        for l in output_lines:\n            f.write(l + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"grades file has been created\")\n",
        "tests": [
          {
            "in": [],
            "out": "88 Distinction\n77 Merit\n96 Distinction\n67 Merit\n48 Fail\n76 Merit\ngrades file has been created",
            "m": 8
          }
        ],
        "hint": "For each row in tbl_scores, total = sum(student) - min(student). Compare total with 80, 65, and 50. Finally print 'grades file has been created'."
      },
      {
        "id": "p25_q06",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q6 Environmental City Temperatures Synthesis (Q06)",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "Environmental scientists monitor annual average temperatures of major cities.\nCity names and annual average temperatures are stored in two arrays:\n• tbl_city stores city names.\n• tbl_temp stores temperatures in either Celsius or Fahrenheit (e.g. 'C25' or 'F80').\n\nThe program must:\n1. Allow a scientist to input the name of a city and its new temperature in either Celsius or Fahrenheit (e.g. 'Cairo' and 'C28').\n   - If the city is in the array, its temperature is updated.\n   - If the city is not in the array, print 'City not found'.\n2. Display a table with:\n   - A header row ('City', 'Celsius', 'Fahrenheit') and a dividing line.\n   - Each city with its temperature in both Celsius and Fahrenheit as rounded whole numbers.\n   - The overall average annual temperature for all cities in both Celsius and Fahrenheit as rounded whole numbers.\n\nConversion Formulas:\n  F = round(C * 1.8 + 32)\n  C = round((F - 32) / 1.8)\n\nInclude at least one subprogram. Your program should work dynamically even if the number of cities in the arrays changes.",
        "starter": "# Q06 - Environmental City Temperature Monitor\ntbl_city = [\"Reggane\", \"Cairo\", \"New Delhi\", \"Muscat\", \"Athens\", \"Barcelona\", \"Havana\", \"Phoenix\", \"Brisbane\", \"Darwin\"]\ntbl_temp = [\"C39\", \"C28\", \"C34\", \"C35\", \"C29\", \"C26\", \"C29\", \"C35\", \"C25\", \"C27\"]\n\n# Write your program below:\n",
        "solution": "# Q06FINISHED - Environmental City Temperature Monitor\ntbl_city = [\"Reggane\", \"Cairo\", \"New Delhi\", \"Muscat\", \"Athens\", \"Barcelona\", \"Havana\", \"Phoenix\", \"Brisbane\", \"Darwin\"]\ntbl_temp = [\"C39\", \"C28\", \"C34\", \"C35\", \"C29\", \"C26\", \"C29\", \"C35\", \"C25\", \"C27\"]\n\ndef convert_temp(entry):\n    unit = entry[0].upper()\n    val = float(entry[1:])\n    if unit == \"C\":\n        c = round(val)\n        f = round(c * 1.8 + 32)\n    else:\n        f = round(val)\n        c = round((f - 32) / 1.8)\n    return c, f\n\ncity_input = input(\"Enter city: \").strip()\ntemp_input = input(\"Enter temperature: \").strip()\n\nif city_input in tbl_city:\n    idx = tbl_city.index(city_input)\n    tbl_temp[idx] = temp_input\nelse:\n    print(\"City not found\")\n\nprint(f\"{'City':<16} {'Celsius':>8} {'Fahrenheit':>11}\")\nprint(\"-\" * 38)\n\ntotal_c = 0\ntotal_f = 0\nn = len(tbl_city)\n\nfor i in range(n):\n    c, f = convert_temp(tbl_temp[i])\n    total_c += c\n    total_f += f\n    print(f\"{tbl_city[i]:<16} {c:>8} {f:>11}\")\n\nprint(\"-\" * 38)\navg_c = round(total_c / n)\navg_f = round(total_f / n)\nprint(f\"{'Overall Average':<16} {avg_c:>8} {avg_f:>11}\")\n",
        "tests": [
          {
            "in": [
              "Cairo",
              "C28"
            ],
            "out": "City              Celsius  Fahrenheit\n--------------------------------------\nReggane                39         102\nCairo                  28          82\nNew Delhi              34          93\nMuscat                 35          95\nAthens                 29          84\nBarcelona              26          79\nHavana                 29          84\nPhoenix                35          95\nBrisbane               25          77\nDarwin                 27          81\n--------------------------------------\nOverall Average        30          87",
            "m": 10
          },
          {
            "in": [
              "London",
              "C15"
            ],
            "out": "City not found\nCity              Celsius  Fahrenheit\n--------------------------------------\nReggane                39         102\nCairo                  28          82\nNew Delhi              34          93\nMuscat                 35          95\nAthens                 29          84\nBarcelona              26          79\nHavana                 29          84\nPhoenix                35          95\nBrisbane               25          77\nDarwin                 27          81\n--------------------------------------\nOverall Average        30          87",
            "m": 10
          }
        ],
        "hint": "Use entry[0] for the unit ('C' or 'F') and float(entry[1:]) for the number. Print headers, loop over tbl_city, accumulate Celsius and Fahrenheit totals, and compute the rounded average."
      }
    ],
    "maxMarks": 80,
    "createdAt": 1789911793160,
    "status": "active",
    "students": {}
  },
  "exam_2025_pattern_companion": {
    "id": "exam_2025_pattern_companion",
    "title": "Paper 2 Exam Pattern Companion Assessment",
    "code": "PAT2025",
    "type": "assessment",
    "durationMinutes": 90,
    "showScoreImmediately": true,
    "questionIds": [
      "exp_pat_sentinel_01",
      "exp_pat_sentinel_02",
      "exp_pat_2d_file_01",
      "exp_pat_2d_file_02",
      "exp_pat_parallel_01",
      "exp_pat_sim_booster_01",
      "exp_pat_bubble_01",
      "exp_pat_debug_01"
    ],
    "questions": [
      {
        "id": "exp_pat_sentinel_01",
        "unit": "P26",
        "unitName": "Edexcel 4CP0/2AW Exam Pattern Bank",
        "title": "Vehicle Fleet Fuel Efficiency Sentinel Logger",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 6,
        "brief": "A transport company logs the fuel efficiency (km per litre) of delivery vans at the end of each shift.\nThe program implements a sentinel loop following this specification:\n\n1. Initialise count to 0 and total_km_per_litre to 0.0.\n2. Prompt for fuel efficiency in km/L repeatedly until the sentinel value -1.0 is entered.\n3. If fuel efficiency is positive (> 0.0):\n   - Add value to total_km_per_litre.\n   - Increment count by 1.\n4. When -1.0 is entered:\n   - If count is 0, display 'No fuel data logged'.\n   - Otherwise, calculate average = round(total_km_per_litre / count, 1) and display:\n     'Vans logged: <count> | Mean efficiency: <average> km/L'\n\nTest with: 14.2, 12.8, 15.0, -1.0 -> 'Vans logged: 3 | Mean efficiency: 14.0 km/L'\nTest with: -1.0                    -> 'No fuel data logged'",
        "starter": "# Fleet Fuel Efficiency Logger\ncount = 0\ntotal = 0.0\n\n# Write your program below:\n",
        "solution": "count = 0\ntotal = 0.0\n\nwhile True:\n    val = float(input())\n    if val == -1.0:\n        break\n    if val > 0.0:\n        total += val\n        count += 1\n\nif count == 0:\n    print(\"No fuel data logged\")\nelse:\n    avg = round(total / count, 1)\n    print(f\"Vans logged: {count} | Mean efficiency: {avg} km/L\")\n",
        "tests": [
          {
            "in": [
              "14.2",
              "12.8",
              "15.0",
              "-1.0"
            ],
            "out": "Vans logged: 3 | Mean efficiency: 14.0 km/L",
            "m": 3
          },
          {
            "in": [
              "-1.0"
            ],
            "out": "No fuel data logged",
            "m": 3
          }
        ],
        "hint": "Use a while True loop with a break condition on float input == -1.0. Protect against division by zero with 'if count == 0:'."
      },
      {
        "id": "exp_pat_sentinel_02",
        "unit": "P26",
        "unitName": "Edexcel 4CP0/2AW Exam Pattern Bank",
        "title": "Hospital Ward Body Temperature Sentinel Monitor",
        "level": "Exam-style",
        "difficulty": "Moderate",
        "type": "code",
        "marks": 5,
        "brief": "A nurse logs patient temperatures in Celsius.\nThe program terminates when the sentinel value 0 is entered.\n\nRequirements:\n• Read temperatures until 0 is entered.\n• Count how many patients have a fever (temperature >= 38.0).\n• Calculate and output the overall mean temperature rounded to 1 decimal place.\n• If 0 is entered immediately, output 'No readings taken'.\n\nExpected Output format:\n  'Readings: 4 | Fevers detected: 2 | Average: 37.8 C'",
        "starter": "# Patient Temperature Sentinel Monitor\ntotal_temp = 0.0\ncount = 0\nfevers = 0\n\n# Write your program below:\n",
        "solution": "total_temp = 0.0\ncount = 0\nfevers = 0\n\nwhile True:\n    t = float(input())\n    if t == 0:\n        break\n    count += 1\n    total_temp += t\n    if t >= 38.0:\n        fevers += 1\n\nif count == 0:\n    print(\"No readings taken\")\nelse:\n    avg = round(total_temp / count, 1)\n    print(f\"Readings: {count} | Fevers detected: {fevers} | Average: {avg} C\")\n",
        "tests": [
          {
            "in": [
              "36.8",
              "38.5",
              "37.2",
              "38.8",
              "0"
            ],
            "out": "Readings: 4 | Fevers detected: 2 | Average: 37.8 C",
            "m": 3
          },
          {
            "in": [
              "0"
            ],
            "out": "No readings taken",
            "m": 2
          }
        ],
        "hint": "Increment fevers when t >= 38.0. Break on t == 0. Check 'if count == 0:' before dividing."
      },
      {
        "id": "exp_pat_2d_file_01",
        "unit": "P26",
        "unitName": "Edexcel 4CP0/2AW Exam Pattern Bank",
        "title": "Gymnastics Judges Scoring & Award File Creation",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 8,
        "brief": "In a gymnastics championship, each competitor receives scores from 5 judges (out of 10.0 each).\nThe highest and lowest scores are discarded, and the remaining 3 scores are summed to give a final score out of 30.0.\n\nAward Tiers:\n  Final score >= 27.0 : Gold Award\n  Final score >= 24.0 : Silver Award\n  Final score >= 21.0 : Bronze Award\n  Final score < 21.0  : Commended\n\nCompetitor names and scores are in tbl_gymnasts:\n  ['Ava', [8.5, 9.2, 8.8, 9.5, 8.9]] -> drops 8.5 & 9.5 -> 9.2 + 8.8 + 8.9 = 26.9 -> Silver Award\n\nRequirements:\n1. For each gymnast, compute the trimmed sum (sum - min - max), rounded to 1 decimal place.\n2. Output each result in format: '<Name>: <Score> (<Award>)'\n3. Write each line to 'gym_awards.txt' and display message 'awards file generated successfully'.",
        "starter": "# Gymnastics Judges Scoring Engine\ntbl_gymnasts = [\n    [\"Ava\", [8.5, 9.2, 8.8, 9.5, 8.9]],\n    [\"Liam\", [9.4, 9.6, 9.5, 9.1, 9.8]],\n    [\"Maya\", [7.5, 7.8, 8.0, 7.2, 7.9]],\n    [\"Noah\", [6.8, 7.0, 6.5, 6.9, 7.2]]\n]\n\n# Write your program below:\n",
        "solution": "tbl_gymnasts = [\n    [\"Ava\", [8.5, 9.2, 8.8, 9.5, 8.9]],\n    [\"Liam\", [9.4, 9.6, 9.5, 9.1, 9.8]],\n    [\"Maya\", [7.5, 7.8, 8.0, 7.2, 7.9]],\n    [\"Noah\", [6.8, 7.0, 6.5, 6.9, 7.2]]\n]\n\nrecords = []\nfor name, scores in tbl_gymnasts:\n    trimmed_sum = round(sum(scores) - min(scores) - max(scores), 1)\n    if trimmed_sum >= 27.0:\n        award = \"Gold Award\"\n    elif trimmed_sum >= 24.0:\n        award = \"Silver Award\"\n    elif trimmed_sum >= 21.0:\n        award = \"Bronze Award\"\n    else:\n        award = \"Commended\"\n    line = f\"{name}: {trimmed_sum} ({award})\"\n    print(line)\n    records.append(line)\n\ntry:\n    with open(\"gym_awards.txt\", \"w\") as f:\n        for r in records:\n            f.write(r + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"awards file generated successfully\")\n",
        "tests": [
          {
            "in": [],
            "out": "Ava: 26.9 (Silver Award)\nLiam: 28.5 (Gold Award)\nMaya: 23.2 (Bronze Award)\nNoah: 20.7 (Commended)\nawards file generated successfully",
            "m": 8
          }
        ],
        "hint": "Use trimmed_sum = round(sum(scores) - min(scores) - max(scores), 1). Then evaluate thresholds >= 27.0, 24.0, and 21.0."
      },
      {
        "id": "exp_pat_2d_file_02",
        "unit": "P26",
        "unitName": "Edexcel 4CP0/2AW Exam Pattern Bank",
        "title": "Smart Solar Panel Daily Generation Auditor",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 7,
        "brief": "A smart home controller monitors solar panels with morning, afternoon, and evening readings in kWh:\n  tbl_readings = [\n      ['Mon', [4.2, 6.8, 3.0]],\n      ['Tue', [5.1, 7.4, 4.5]],\n      ['Wed', [2.0, 3.2, 1.8]],\n      ['Thu', [6.0, 8.5, 5.5]]\n  ]\n\nRequirements:\n• Discard the lowest reading of the 3 periods as an overcast outlier and sum the remaining two.\n• Tariff Band:\n  - Total >= 13.0 kWh : Peak Generation\n  - Total >= 10.0 kWh : Standard Generation\n  - Total < 10.0 kWh  : Low Generation\n• Print each day: '<Day>: <Total> kWh (<Band>)'\n• Print confirmation message: 'solar audit file saved'",
        "starter": "# Smart Solar Generation Auditor\ntbl_readings = [\n    [\"Mon\", [4.2, 6.8, 3.0]],\n    [\"Tue\", [5.1, 7.4, 4.5]],\n    [\"Wed\", [2.0, 3.2, 1.8]],\n    [\"Thu\", [6.0, 8.5, 5.5]]\n]\n\n# Write your program below:\n",
        "solution": "tbl_readings = [\n    [\"Mon\", [4.2, 6.8, 3.0]],\n    [\"Tue\", [5.1, 7.4, 4.5]],\n    [\"Wed\", [2.0, 3.2, 1.8]],\n    [\"Thu\", [6.0, 8.5, 5.5]]\n]\n\nfor day, vals in tbl_readings:\n    effective = round(sum(vals) - min(vals), 1)\n    if effective >= 13.0:\n        band = \"Peak Generation\"\n    elif effective >= 10.0:\n        band = \"Standard Generation\"\n    else:\n        band = \"Low Generation\"\n    print(f\"{day}: {effective} kWh ({band})\")\n\nprint(\"solar audit file saved\")\n",
        "tests": [
          {
            "in": [],
            "out": "Mon: 11.0 kWh (Standard Generation)\nTue: 12.5 kWh (Standard Generation)\nWed: 5.2 kWh (Low Generation)\nThu: 14.5 kWh (Peak Generation)\nsolar audit file saved",
            "m": 7
          }
        ],
        "hint": "effective = round(sum(vals) - min(vals), 1). Then classify into bands and print 'solar audit file saved'."
      },
      {
        "id": "exp_pat_parallel_01",
        "unit": "P26",
        "unitName": "Edexcel 4CP0/2AW Exam Pattern Bank",
        "title": "Air Cargo Weight Monitor & Dual Unit Table",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 12,
        "brief": "A freight airline monitors cargo container weights across flights.\nTwo parallel arrays store flight IDs and container weights:\n  tbl_flight = ['BA101', 'EK202', 'AF303', 'QR404', 'LH505']\n  tbl_weight = ['K450', 'L992', 'K600', 'L1100', 'K520']\n\nWeight strings use a prefix:\n• 'K' indicates kilograms (e.g. 'K450' = 450 kg)\n• 'L' indicates pounds (lbs) (e.g. 'L992' = 992 lbs)\n\nConversions (rounded to nearest integer):\n  lbs = round(kg * 2.20462)\n  kg  = round(lbs / 2.20462)\n\nProgram requirements:\n1. Input flight code (e.g. 'BA101') and new weight string (e.g. 'K480').\n   - If found: update weight in array.\n   - If not found: print 'Flight not found'.\n2. Display aligned table with header and dividing line:\n   'Flight             Kg         Lbs'\n   '---------------------------------'\n3. Display overall average weight across all flights in both Kg and Lbs as whole numbers.",
        "starter": "# Air Cargo Weight Monitor\ntbl_flight = [\"BA101\", \"EK202\", \"AF303\", \"QR404\", \"LH505\"]\ntbl_weight = [\"K450\", \"L992\", \"K600\", \"L1100\", \"K520\"]\n\n# Write your program below:\n",
        "solution": "tbl_flight = [\"BA101\", \"EK202\", \"AF303\", \"QR404\", \"LH505\"]\ntbl_weight = [\"K450\", \"L992\", \"K600\", \"L1100\", \"K520\"]\n\ndef convert_weight(entry):\n    unit = entry[0].upper()\n    val = float(entry[1:])\n    if unit == \"K\":\n        kg = round(val)\n        lbs = round(kg * 2.20462)\n    else:\n        lbs = round(val)\n        kg = round(lbs / 2.20462)\n    return kg, lbs\n\nfl = input().strip()\nwt = input().strip()\n\nif fl in tbl_flight:\n    idx = tbl_flight.index(fl)\n    tbl_weight[idx] = wt\nelse:\n    print(\"Flight not found\")\n\nprint(f\"{'Flight':<14} {'Kg':>7} {'Lbs':>10}\")\nprint(\"-\" * 33)\n\ntot_kg = 0\ntot_lbs = 0\nn = len(tbl_flight)\n\nfor i in range(n):\n    kg, lbs = convert_weight(tbl_weight[i])\n    tot_kg += kg\n    tot_lbs += lbs\n    print(f\"{tbl_flight[i]:<14} {kg:>7} {lbs:>10}\")\n\nprint(\"-\" * 33)\navg_kg = round(tot_kg / n)\navg_lbs = round(tot_lbs / n)\nprint(f\"{'Average':<14} {avg_kg:>7} {avg_lbs:>10}\")\n",
        "tests": [
          {
            "in": [
              "BA101",
              "K450"
            ],
            "out": "Flight             Kg        Lbs\n---------------------------------\nBA101             450        992\nEK202             450        992\nAF303             600       1323\nQR404             499       1100\nLH505             520       1146\n---------------------------------\nAverage           504       1111",
            "m": 6
          },
          {
            "in": [
              "XX999",
              "K500"
            ],
            "out": "Flight not found\nFlight             Kg        Lbs\n---------------------------------\nBA101             450        992\nEK202             450        992\nAF303             600       1323\nQR404             499       1100\nLH505             520       1146\n---------------------------------\nAverage           504       1111",
            "m": 6
          }
        ],
        "hint": "Use entry[0] for 'K' or 'L' and float(entry[1:]) for the value. Convert, sum across all flights, and compute round(total / len(tbl_flight))."
      },
      {
        "id": "exp_pat_sim_booster_01",
        "unit": "P26",
        "unitName": "Edexcel 4CP0/2AW Exam Pattern Bank",
        "title": "Cricket Six-Ball Over Simulator with Boundary Boosters",
        "level": "Exam-style",
        "difficulty": "Moderate",
        "type": "code",
        "marks": 6,
        "brief": "A cricket batting simulation models a single 6-ball over.\nRules:\n• In each delivery, the batter scores runs (0, 1, 2, 3, 4, or 6).\n• Runs are accumulated into a subtotal.\n• A momentum multiplier starts at 1.\n• If the batter hits a boundary (4 or 6 runs), the momentum multiplier is incremented by 1.\n• Output each delivery: 'Ball <n>: <runs> runs'\n• Calculate final innings points: subtotal * multiplier.\n• Output: 'Innings Points: <final_points>'\n\nTest with: 1, 4, 0, 6, 2, 4 -> subtotal = 17, boundaries = 3, multiplier = 4 -> Innings Points: 68",
        "starter": "# Cricket Six-Ball Over Simulator\nsubtotal = 0\nmultiplier = 1\n\n# Write your program below:\n",
        "solution": "subtotal = 0\nmultiplier = 1\n\nfor i in range(1, 7):\n    runs = int(input())\n    print(f\"Ball {i}: {runs} runs\")\n    subtotal += runs\n    if runs == 4 or runs == 6:\n        multiplier += 1\n\nfinal_points = subtotal * multiplier\nprint(f\"Innings Points: {final_points}\")\n",
        "tests": [
          {
            "in": [
              "1",
              "4",
              "0",
              "6",
              "2",
              "4"
            ],
            "out": "Ball 1: 1 runs\nBall 2: 4 runs\nBall 3: 0 runs\nBall 4: 6 runs\nBall 5: 2 runs\nBall 6: 4 runs\nInnings Points: 68",
            "m": 4
          },
          {
            "in": [
              "0",
              "1",
              "1",
              "2",
              "0",
              "1"
            ],
            "out": "Ball 1: 0 runs\nBall 2: 1 runs\nBall 3: 1 runs\nBall 4: 2 runs\nBall 5: 0 runs\nBall 6: 1 runs\nInnings Points: 5",
            "m": 2
          }
        ],
        "hint": "Loop 6 times (ball 1 to 6). When runs == 4 or runs == 6, increment multiplier. Multiply subtotal by multiplier at end."
      },
      {
        "id": "exp_pat_bubble_01",
        "unit": "P26",
        "unitName": "Edexcel 4CP0/2AW Exam Pattern Bank",
        "title": "Bubble Sort Pass Counter on Examination Scores",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "table",
        "marks": 4,
        "brief": "A teacher sorts a list of examination percentages: [74, 82, 65, 91, 58, 88].\nA standard ascending bubble sort is applied.\n\nComplete the state of the list after Pass 1 and Pass 2.",
        "columns": [
          {
            "label": "Pass"
          },
          {
            "label": "[0]"
          },
          {
            "label": "[1]"
          },
          {
            "label": "[2]"
          },
          {
            "label": "[3]"
          },
          {
            "label": "[4]"
          },
          {
            "label": "[5]"
          }
        ],
        "rows": [
          [
            {
              "v": "Initial",
              "g": true
            },
            {
              "v": "74",
              "g": true
            },
            {
              "v": "82",
              "g": true
            },
            {
              "v": "65",
              "g": true
            },
            {
              "v": "91",
              "g": true
            },
            {
              "v": "58",
              "g": true
            },
            {
              "v": "88",
              "g": true
            }
          ],
          [
            {
              "v": "Pass 1",
              "g": true
            },
            {
              "v": "74",
              "g": false
            },
            {
              "v": "65",
              "g": false
            },
            {
              "v": "82",
              "g": false
            },
            {
              "v": "58",
              "g": false
            },
            {
              "v": "88",
              "g": false
            },
            {
              "v": "91",
              "g": false
            }
          ],
          [
            {
              "v": "Pass 2",
              "g": true
            },
            {
              "v": "65",
              "g": false
            },
            {
              "v": "74",
              "g": false
            },
            {
              "v": "58",
              "g": false
            },
            {
              "v": "82",
              "g": false
            },
            {
              "v": "88",
              "g": false
            },
            {
              "v": "91",
              "g": false
            }
          ]
        ],
        "hint": "Pass 1 pushes 91 to index 5. Pass 2 pushes 88 to index 4."
      },
      {
        "id": "exp_pat_debug_01",
        "unit": "P26",
        "unitName": "Edexcel 4CP0/2AW Exam Pattern Bank",
        "title": "Store Loyalty Points Pseudocode Debugging",
        "level": "Core",
        "difficulty": "Moderate",
        "type": "inspect",
        "marks": 4,
        "brief": "A retail checkout system awards loyalty points based on item purchases:\n\n 1 SET total_points TO 0\n 2 SET item_count TO 0\n 3 RECEIVE num_items FROM (INTEGER) KEYBOARD\n 4\n 5 WHILE item_count < num_items DO\n 6   RECEIVE price FROM (REAL) KEYBOARD\n 7   IF price >= 50.0 THEN\n 8     SET points TO 10\n 9   ELSE\n 10    SET points TO 2\n 11  END IF\n 12  SET total_points TO points\n 13  SET item_count TO item_count + 1\n 14 END WHILE\n 15 SEND total_points TO DISPLAY\n\nThere is a logic error on line 12 of the pseudocode.",
        "questions": [
          {
            "q": "(i) Explain the problem the logic error on line 12 causes:",
            "a": [
              "total_points is overwritten with points instead of adding",
              "it assigns points rather than adding total_points + points",
              "previous points are lost so only the last item's points are shown",
              "it should be total_points + points"
            ],
            "why": "Line 12 assigns total_points = points instead of accumulating total_points = total_points + points."
          },
          {
            "q": "(ii) Write the corrected line 12 in pseudocode:",
            "a": [
              "SET total_points TO total_points + points",
              "total_points = total_points + points",
              "SET total_points TO total_points + points;"
            ],
            "why": "To accumulate, the variable must be updated: SET total_points TO total_points + points."
          }
        ],
        "hint": "Compare 'SET total_points TO points' with 'SET total_points TO total_points + points'."
      }
    ],
    "maxMarks": 52,
    "createdAt": 1789915393160,
    "status": "active",
    "students": {}
  },
  "exam_20_marker_mastery": {
    "id": "exam_20_marker_mastery",
    "title": "Paper 2 Capstone: 20-Marker Synthesis Mastery Exam",
    "code": "20MARK",
    "type": "assessment",
    "durationMinutes": 120,
    "showScoreImmediately": true,
    "questionIds": [
      "cap20_01_cargo_manifest",
      "cap20_02_hospital_triage",
      "cap20_03_wind_farm_log",
      "cap20_04_olympiad_decathlon",
      "cap20_05_hotel_billing",
      "cap20_06_ev_fleet_dispatch",
      "cap20_07_sports_league",
      "cap20_08_warehouse_inventory",
      "cap20_09_meteorological_rainfall",
      "cap20_10_university_coursework"
    ],
    "questions": [
      {
        "id": "cap20_01_cargo_manifest",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 Air Cargo Weight Conversion & Manifest Exporter",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "An air freight company manages scheduled cargo flights.\nFlight numbers, destinations, and cargo weights are stored in three parallel arrays:\n• tbl_flight stores flight numbers (e.g. 'AF101', 'BA204').\n• tbl_dest stores destination cities (e.g. 'Dubai', 'Tokyo').\n• tbl_weight stores weights with a unit prefix 'K' for kilograms or 'L' for pounds (e.g. 'K450' or 'L990').\n\nConversion Formulas:\n• Pounds from Kilograms: L = round(K * 2.2)\n• Kilograms from Pounds: K = round(L / 2.2)\n\nThe program must:\n1. Allow an operator to input a flight number and an updated weight code (e.g. 'BA204' and 'K600').\n   - If the flight is in tbl_flight, update its weight code in tbl_weight.\n   - If the flight is not in tbl_flight, output 'Flight not found'.\n2. Define at least one subprogram convert_weight(weight_code) that returns both the rounded kilogram and pound integers.\n3. Display a table with:\n   - Header row ('Flight', 'Destination', 'Kilograms', 'Pounds') and dividing line.\n   - Each flight's details with weights in both units.\n   - Dividing line.\n   - An overall average weight across all flights in both kilograms and pounds as rounded whole numbers.\n4. Write the manifest rows to 'manifest.txt' and display 'manifest file has been created'.",
        "starter": "# Q06 - Air Cargo Manifest & Unit Conversion (20 Marks)\ntbl_flight = [\"AF101\", \"BA204\", \"EK305\", \"LH402\", \"SQ510\", \"QR612\"]\ntbl_dest = [\"Paris\", \"London\", \"Dubai\", \"Frankfurt\", \"Singapore\", \"Doha\"]\ntbl_weight = [\"K450\", \"L990\", \"K820\", \"L1540\", \"K610\", \"L880\"]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - Air Cargo Manifest & Unit Conversion\ntbl_flight = [\"AF101\", \"BA204\", \"EK305\", \"LH402\", \"SQ510\", \"QR612\"]\ntbl_dest = [\"Paris\", \"London\", \"Dubai\", \"Frankfurt\", \"Singapore\", \"Doha\"]\ntbl_weight = [\"K450\", \"L990\", \"K820\", \"L1540\", \"K610\", \"L880\"]\n\ndef convert_weight(weight_code):\n    unit = weight_code[0].upper()\n    val = float(weight_code[1:])\n    if unit == \"K\":\n        kg = round(val)\n        lb = round(kg * 2.2)\n    else:\n        lb = round(val)\n        kg = round(lb / 2.2)\n    return kg, lb\n\nflight_in = input(\"Enter flight number: \").strip()\nweight_in = input(\"Enter new weight code: \").strip()\n\nif flight_in in tbl_flight:\n    idx = tbl_flight.index(flight_in)\n    tbl_weight[idx] = weight_in\nelse:\n    print(\"Flight not found\")\n\nprint(f\"{'Flight':<10} {'Destination':<14} {'Kilograms':>10} {'Pounds':>8}\")\nprint(\"-\" * 46)\n\ntotal_kg = 0\ntotal_lb = 0\nn = len(tbl_flight)\nlines_to_save = []\n\nfor i in range(n):\n    kg, lb = convert_weight(tbl_weight[i])\n    total_kg += kg\n    total_lb += lb\n    row = f\"{tbl_flight[i]:<10} {tbl_dest[i]:<14} {kg:>10} {lb:>8}\"\n    print(row)\n    lines_to_save.append(row)\n\nprint(\"-\" * 46)\navg_kg = round(total_kg / n)\navg_lb = round(total_lb / n)\nprint(f\"{'Average':<25} {avg_kg:>10} {avg_lb:>8}\")\n\ntry:\n    with open(\"manifest.txt\", \"w\") as f:\n        for line in lines_to_save:\n            f.write(line + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"manifest file has been created\")\n",
        "tests": [
          {
            "in": [
              "BA204",
              "K600"
            ],
            "out": "Flight     Destination     Kilograms   Pounds\n----------------------------------------------\nAF101      Paris                  450      990\nBA204      London                 600     1320\nEK305      Dubai                  820     1804\nLH402      Frankfurt              700     1540\nSQ510      Singapore              610     1342\nQR612      Doha                   400      880\n----------------------------------------------\nAverage                           597     1313\nmanifest file has been created",
            "m": 10
          },
          {
            "in": [
              "UA999",
              "K300"
            ],
            "out": "Flight not found\nFlight     Destination     Kilograms   Pounds\n----------------------------------------------\nAF101      Paris                  450      990\nBA204      London                 450      990\nEK305      Dubai                  820     1804\nLH402      Frankfurt              700     1540\nSQ510      Singapore              610     1342\nQR612      Doha                   400      880\n----------------------------------------------\nAverage                           572     1258\nmanifest file has been created",
            "m": 10
          }
        ],
        "hint": "Use entry[0] for 'K' or 'L', and float(entry[1:]) for the value. Accumulate totals in your loop, and handle file creation with try/except."
      },
      {
        "id": "cap20_02_hospital_triage",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 Hospital Patient NEWS Vital Signs & Triage Audit",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "A hospital ward monitors patients using the National Early Warning Score (NEWS).\n• Patient names are stored in tbl_patients.\n• Hourly vital readings are stored in a two-dimensional array tbl_vitals, where each row contains [heart_rate, systolic_bp, temp_c].\n\nScoring Rules (subprogram calculate_score):\n• Heart Rate: add 3 if HR > 110 or HR < 45; add 1 if HR is between 91 and 110; otherwise 0.\n• Systolic BP: add 3 if BP < 90; add 2 if BP is between 90 and 100; otherwise 0.\n• Temperature: add 3 if Temp >= 39.0 or Temp < 35.0; add 1 if Temp >= 38.0; otherwise 0.\n\nPriority Classification:\n• Total Score >= 5: 'High Priority'\n• Total Score 3 to 4: 'Medium Priority'\n• Total Score <= 2: 'Normal'\n\nThe program must:\n1. Prompt for a patient's name and an updated temperature reading (e.g. 'Amira Khan' and '39.2').\n   - If found, update the temperature (3rd element, index 2) for that patient.\n   - If not found, output 'Patient not registered'.\n2. Display a formatted table showing Patient name, Score, and Priority.\n3. Count and display the number of High Priority patients.\n4. Write high priority patient names and scores to 'triage_audit.txt' and output 'triage audit file has been created'.",
        "starter": "# Q06 - Hospital Triage & Vital Signs (20 Marks)\ntbl_patients = [\"Amira Khan\", \"David Ross\", \"Elena Gomez\", \"Liam Chen\", \"Grace O'Connor\"]\ntbl_vitals = [\n    [95, 115, 37.2],\n    [118, 88, 38.5],\n    [74, 128, 36.6],\n    [105, 96, 37.8],\n    [62, 122, 36.4]\n]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - Hospital Triage & Vital Signs\ntbl_patients = [\"Amira Khan\", \"David Ross\", \"Elena Gomez\", \"Liam Chen\", \"Grace O'Connor\"]\ntbl_vitals = [\n    [95, 115, 37.2],\n    [118, 88, 38.5],\n    [74, 128, 36.6],\n    [105, 96, 37.8],\n    [62, 122, 36.4]\n]\n\ndef calculate_score(vitals):\n    hr = vitals[0]\n    bp = vitals[1]\n    temp = vitals[2]\n    score = 0\n    if hr > 110 or hr < 45:\n        score += 3\n    elif 91 <= hr <= 110:\n        score += 1\n    if bp < 90:\n        score += 3\n    elif 90 <= bp <= 100:\n        score += 2\n    if temp >= 39.0 or temp < 35.0:\n        score += 3\n    elif temp >= 38.0:\n        score += 1\n    return score\n\ndef get_priority(score):\n    if score >= 5:\n        return \"High Priority\"\n    elif score >= 3:\n        return \"Medium Priority\"\n    else:\n        return \"Normal\"\n\npatient_in = input(\"Enter patient name: \").strip()\ntemp_in = float(input(\"Enter updated temperature: \").strip())\n\nif patient_in in tbl_patients:\n    idx = tbl_patients.index(patient_in)\n    tbl_vitals[idx][2] = temp_in\nelse:\n    print(\"Patient not registered\")\n\nprint(f\"{'Patient':<18} {'Score':>6}  {'Priority':<16}\")\nprint(\"-\" * 44)\n\nhigh_priority_count = 0\naudit_lines = []\n\nfor i in range(len(tbl_patients)):\n    score = calculate_score(tbl_vitals[i])\n    priority = get_priority(score)\n    if priority == \"High Priority\":\n        high_priority_count += 1\n        audit_lines.append(f\"{tbl_patients[i]} - Score {score}\")\n    print(f\"{tbl_patients[i]:<18} {score:>6}  {priority:<16}\")\n\nprint(\"-\" * 44)\nprint(f\"Total High Priority: {high_priority_count}\")\n\ntry:\n    with open(\"triage_audit.txt\", \"w\") as f:\n        for al in audit_lines:\n            f.write(al + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"triage audit file has been created\")\n",
        "tests": [
          {
            "in": [
              "Amira Khan",
              "39.2"
            ],
            "out": "Patient             Score  Priority        \n--------------------------------------------\nAmira Khan              4  Medium Priority \nDavid Ross              7  High Priority   \nElena Gomez             0  Normal          \nLiam Chen               3  Medium Priority \nGrace O'Connor          0  Normal          \n--------------------------------------------\nTotal High Priority: 1\ntriage audit file has been created",
            "m": 10
          },
          {
            "in": [
              "John Smith",
              "38.0"
            ],
            "out": "Patient not registered\nPatient             Score  Priority        \n--------------------------------------------\nAmira Khan              1  Normal          \nDavid Ross              7  High Priority   \nElena Gomez             0  Normal          \nLiam Chen               3  Medium Priority \nGrace O'Connor          0  Normal          \n--------------------------------------------\nTotal High Priority: 1\ntriage audit file has been created",
            "m": 10
          }
        ],
        "hint": "Write calculate_score to sum up the 3 component rules. Update tbl_vitals[idx][2] when found, and write audit lines to triage_audit.txt."
      },
      {
        "id": "cap20_03_wind_farm_log",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 Offshore Wind Turbine Power Output & Fault Logger",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "An offshore wind farm tracks daily energy production for its turbines.\n• Turbine identifiers, offshore sectors, and daily outputs in megawatt-hours (MWh) are stored in parallel arrays:\n  - tbl_turbines (e.g. 'T-01', 'T-02')\n  - tbl_sectors (e.g. 'North', 'South')\n  - tbl_output (e.g. 24.5, 8.0)\n\nOperational Rules:\n• A turbine is classified as 'Fault' if its output is strictly less than 15.0 MWh.\n• Otherwise, it is classified as 'Operational'.\n\nThe program must:\n1. Allow an engineer to input a turbine ID and a new output in MWh (e.g. 'T-02' and '22.5').\n   - If found, update its value in tbl_output.\n   - If not found, display 'Turbine not found'.\n2. Define a subprogram get_status(mwh) returning 'Operational' or 'Fault'.\n3. Display a table with:\n   - Header: 'Turbine', 'Sector', 'Output(MWh)', 'Status'\n   - Each turbine's output formatted to 1 decimal place.\n   - Total farm output and the number of operational turbines.\n4. Write all turbines with 'Fault' status to 'fault_log.txt' and display 'turbine fault log has been created'.",
        "starter": "# Q06 - Offshore Wind Turbine Logger (20 Marks)\ntbl_turbines = [\"T-01\", \"T-02\", \"T-03\", \"T-04\", \"T-05\", \"T-06\"]\ntbl_sectors = [\"North\", \"North\", \"East\", \"East\", \"South\", \"South\"]\ntbl_output = [28.4, 9.2, 31.0, 12.5, 25.8, 14.1]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - Offshore Wind Turbine Logger\ntbl_turbines = [\"T-01\", \"T-02\", \"T-03\", \"T-04\", \"T-05\", \"T-06\"]\ntbl_sectors = [\"North\", \"North\", \"East\", \"East\", \"South\", \"South\"]\ntbl_output = [28.4, 9.2, 31.0, 12.5, 25.8, 14.1]\n\ndef get_status(mwh):\n    if mwh < 15.0:\n        return \"Fault\"\n    else:\n        return \"Operational\"\n\nturb_in = input(\"Enter turbine ID: \").strip()\nmwh_in = float(input(\"Enter new output: \").strip())\n\nif turb_in in tbl_turbines:\n    idx = tbl_turbines.index(turb_in)\n    tbl_output[idx] = mwh_in\nelse:\n    print(\"Turbine not found\")\n\nprint(f\"{'Turbine':<10} {'Sector':<10} {'Output(MWh)':>12}  {'Status':<12}\")\nprint(\"-\" * 48)\n\ntotal_mwh = 0.0\nop_count = 0\nfault_lines = []\n\nfor i in range(len(tbl_turbines)):\n    mwh = tbl_output[i]\n    total_mwh += mwh\n    status = get_status(mwh)\n    if status == \"Operational\":\n        op_count += 1\n    else:\n        fault_lines.append(f\"{tbl_turbines[i]} ({tbl_sectors[i]}): {mwh:.1f} MWh\")\n    print(f\"{tbl_turbines[i]:<10} {tbl_sectors[i]:<10} {mwh:>12.1f}  {status:<12}\")\n\nprint(\"-\" * 48)\nprint(f\"Total Output: {total_mwh:.1f} MWh | Operational: {op_count}\")\n\ntry:\n    with open(\"fault_log.txt\", \"w\") as f:\n        for fl in fault_lines:\n            f.write(fl + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"turbine fault log has been created\")\n",
        "tests": [
          {
            "in": [
              "T-02",
              "25.0"
            ],
            "out": "Turbine    Sector     Output(MWh)  Status      \n------------------------------------------------\nT-01       North             28.4  Operational \nT-02       North             25.0  Operational \nT-03       East              31.0  Operational \nT-04       East              12.5  Fault       \nT-05       South             25.8  Operational \nT-06       South             14.1  Fault       \n------------------------------------------------\nTotal Output: 136.8 MWh | Operational: 4\nturbine fault log has been created",
            "m": 10
          },
          {
            "in": [
              "T-99",
              "10.0"
            ],
            "out": "Turbine not found\nTurbine    Sector     Output(MWh)  Status      \n------------------------------------------------\nT-01       North             28.4  Operational \nT-02       North              9.2  Fault       \nT-03       East              31.0  Operational \nT-04       East              12.5  Fault       \nT-05       South             25.8  Operational \nT-06       South             14.1  Fault       \n------------------------------------------------\nTotal Output: 121.0 MWh | Operational: 3\nturbine fault log has been created",
            "m": 10
          }
        ],
        "hint": "Use get_status(mwh) returning 'Operational' if mwh >= 15.0 else 'Fault'. Format outputs with :.1f."
      },
      {
        "id": "cap20_04_olympiad_decathlon",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 Science Olympiad 2D Multi-Round Awards & Merit Exporter",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "Students participate in a 4-round Science Olympiad competition.\n• Candidate IDs are stored in tbl_candidates.\n• Round scores (each out of 30) are stored in a two-dimensional array tbl_scores.\n\nScoring Rules (subprogram calculate_olympiad_result):\n• The lowest score among the 4 rounds is dropped.\n• The remaining 3 scores are summed to give an overall score out of 90.\n• Awards:\n  - Score >= 75: 'Gold Honor'\n  - Score 60 to 74: 'Silver Honor'\n  - Score 45 to 59: 'Bronze Honor'\n  - Score < 45: 'Participation'\n\nThe program must:\n1. Prompt for candidate ID and a revised score for Round 1 (index 0) (e.g. 'C-102' and '28').\n   - If found, update Round 1 for that candidate.\n   - If not found, output 'Candidate not found'.\n2. Display a table of Candidate, Total Score (out of 90), and Award.\n3. Compute and display the highest total score in the competition.\n4. Write all 'Gold Honor' recipients to 'merit_certificates.txt' and output 'certificates file has been created'.",
        "starter": "# Q06 - Science Olympiad 2D Scores (20 Marks)\ntbl_candidates = [\"C-101\", \"C-102\", \"C-103\", \"C-104\", \"C-105\"]\ntbl_scores = [\n    [24, 26, 28, 22],\n    [18, 20, 19, 15],\n    [29, 30, 27, 28],\n    [14, 16, 12, 18],\n    [25, 22, 26, 24]\n]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - Science Olympiad 2D Scores\ntbl_candidates = [\"C-101\", \"C-102\", \"C-103\", \"C-104\", \"C-105\"]\ntbl_scores = [\n    [24, 26, 28, 22],\n    [18, 20, 19, 15],\n    [29, 30, 27, 28],\n    [14, 16, 12, 18],\n    [25, 22, 26, 24]\n]\n\ndef calculate_olympiad_result(rounds):\n    # Drop lowest, sum remaining 3\n    total = sum(rounds) - min(rounds)\n    if total >= 75:\n        award = \"Gold Honor\"\n    elif total >= 60:\n        award = \"Silver Honor\"\n    elif total >= 45:\n        award = \"Bronze Honor\"\n    else:\n        award = \"Participation\"\n    return total, award\n\ncand_in = input(\"Enter candidate ID: \").strip()\nr1_in = int(input(\"Enter new Round 1 score: \").strip())\n\nif cand_in in tbl_candidates:\n    idx = tbl_candidates.index(cand_in)\n    tbl_scores[idx][0] = r1_in\nelse:\n    print(\"Candidate not found\")\n\nprint(f\"{'Candidate':<12} {'Total':>6}  {'Award':<16}\")\nprint(\"-\" * 38)\n\nmax_score = -1\ngold_lines = []\n\nfor i in range(len(tbl_candidates)):\n    total, award = calculate_olympiad_result(tbl_scores[i])\n    if total > max_score:\n        max_score = total\n    if award == \"Gold Honor\":\n        gold_lines.append(f\"{tbl_candidates[i]} - {total}\")\n    print(f\"{tbl_candidates[i]:<12} {total:>6}  {award:<16}\")\n\nprint(\"-\" * 38)\nprint(f\"Highest Score: {max_score}\")\n\ntry:\n    with open(\"merit_certificates.txt\", \"w\") as f:\n        for g in gold_lines:\n            f.write(g + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"certificates file has been created\")\n",
        "tests": [
          {
            "in": [
              "C-102",
              "28"
            ],
            "out": "Candidate     Total  Award           \n--------------------------------------\nC-101            78  Gold Honor      \nC-102            67  Silver Honor    \nC-103            87  Gold Honor      \nC-104            48  Bronze Honor    \nC-105            75  Gold Honor      \n--------------------------------------\nHighest Score: 87\ncertificates file has been created",
            "m": 10
          },
          {
            "in": [
              "C-999",
              "30"
            ],
            "out": "Candidate not found\nCandidate     Total  Award           \n--------------------------------------\nC-101            78  Gold Honor      \nC-102            57  Bronze Honor    \nC-103            87  Gold Honor      \nC-104            48  Bronze Honor    \nC-105            75  Gold Honor      \n--------------------------------------\nHighest Score: 87\ncertificates file has been created",
            "m": 10
          }
        ],
        "hint": "Total is sum(rounds) - min(rounds). Use an if/elif ladder to determine award, and export Gold Honor candidates to merit_certificates.txt."
      },
      {
        "id": "cap20_05_hotel_billing",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 Grand Hotel Room Billing & Surcharge Auditor",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "A luxury hotel manages checkout billing for its guests.\n• Room numbers, guest names, and account balances are stored in three parallel arrays:\n  - tbl_room (e.g. 101, 204)\n  - tbl_guest (e.g. 'Dr. Thorne', 'Ms. Lin')\n  - tbl_account (e.g. 'V450', 'S280' where 'V' denotes VIP guest, 'S' denotes Standard guest, followed by base bill in pounds).\n\nBilling Rules (subprogram calculate_invoice):\n• VIP guest ('V'): Base bill receives a 10% discount, plus a 5% service surcharge on the discounted bill.\n  - discounted = base * 0.90\n  - final_bill = round(discounted * 1.05 + extra_charges)\n• Standard guest ('S'): Base bill has no discount, plus a 10% service surcharge.\n  - final_bill = round(base * 1.10 + extra_charges)\n\nThe program must:\n1. Prompt for room number and an additional minibar charge (e.g. 204 and 35.0).\n   - If room found, add the extra charge into its invoice.\n   - If not found, output 'Room not found'.\n2. Display a table with columns: 'Room', 'Guest', 'Type', 'Final(£)'.\n3. Output total revenue across all rooms.\n4. Write all guest billing lines to 'billing_export.txt' and output 'billing export file has been created'.",
        "starter": "# Q06 - Hotel Room Billing (20 Marks)\ntbl_room = [101, 102, 201, 202, 301]\ntbl_guest = [\"Lord Sterling\", \"Ms. Alvarez\", \"Sir Higgins\", \"Mr. Dupont\", \"Prof. Moriarty\"]\ntbl_account = [\"V600\", \"S250\", \"V480\", \"S310\", \"S190\"]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - Hotel Room Billing\ntbl_room = [101, 102, 201, 202, 301]\ntbl_guest = [\"Lord Sterling\", \"Ms. Alvarez\", \"Sir Higgins\", \"Mr. Dupont\", \"Prof. Moriarty\"]\ntbl_account = [\"V600\", \"S250\", \"V480\", \"S310\", \"S190\"]\n\ndef calculate_invoice(account_str, extra):\n    cat = account_str[0].upper()\n    base = float(account_str[1:])\n    if cat == \"V\":\n        discounted = base * 0.90\n        final = round(discounted * 1.05 + extra)\n        label = \"VIP\"\n    else:\n        final = round(base * 1.10 + extra)\n        label = \"Standard\"\n    return label, final\n\nroom_in = int(input(\"Enter room number: \").strip())\nextra_in = float(input(\"Enter extra charges: \").strip())\n\nfound = False\ntarget_idx = -1\nif room_in in tbl_room:\n    found = True\n    target_idx = tbl_room.index(room_in)\nelse:\n    print(\"Room not found\")\n\nprint(f\"{'Room':<6} {'Guest':<18} {'Type':<10} {'Final(£)':>8}\")\nprint(\"-\" * 46)\n\ntotal_rev = 0\nbilling_lines = []\n\nfor i in range(len(tbl_room)):\n    extra = extra_in if (found and i == target_idx) else 0.0\n    label, final = calculate_invoice(tbl_account[i], extra)\n    total_rev += final\n    row = f\"{tbl_room[i]:<6} {tbl_guest[i]:<18} {label:<10} {final:>8}\"\n    print(row)\n    billing_lines.append(row)\n\nprint(\"-\" * 46)\nprint(f\"Total Revenue: £{total_rev}\")\n\ntry:\n    with open(\"billing_export.txt\", \"w\") as f:\n        for bl in billing_lines:\n            f.write(bl + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"billing export file has been created\")\n",
        "tests": [
          {
            "in": [
              "102",
              "50.0"
            ],
            "out": "Room   Guest              Type       Final(£)\n----------------------------------------------\n101    Lord Sterling      VIP             567\n102    Ms. Alvarez        Standard        325\n201    Sir Higgins        VIP             454\n202    Mr. Dupont         Standard        341\n301    Prof. Moriarty     Standard        209\n----------------------------------------------\nTotal Revenue: £1896\nbilling export file has been created",
            "m": 10
          },
          {
            "in": [
              "404",
              "25.0"
            ],
            "out": "Room not found\nRoom   Guest              Type       Final(£)\n----------------------------------------------\n101    Lord Sterling      VIP             567\n102    Ms. Alvarez        Standard        275\n201    Sir Higgins        VIP             454\n202    Mr. Dupont         Standard        341\n301    Prof. Moriarty     Standard        209\n----------------------------------------------\nTotal Revenue: £1846\nbilling export file has been created",
            "m": 10
          }
        ],
        "hint": "Extract account_str[0] for category and account_str[1:] for base. Apply extra charge to the target room if found, then export lines to billing_export.txt."
      },
      {
        "id": "cap20_06_ev_fleet_dispatch",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 EV Delivery Fleet Battery Range & Charge Dispatcher",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "A logistics depot monitors its fleet of electric delivery vans.\n• Van identifiers are stored in tbl_van_ids.\n• Fleet battery specs are stored in a two-dimensional array tbl_fleet, where each row has [battery_pct, wh_per_km].\n• Each van has a 60,000 Wh (60 kWh) battery pack.\n\nRange Formula (subprogram calculate_range):\n• usable_wh = (battery_pct / 100.0) * 60000\n• range_km = round(usable_wh / wh_per_km)\n\nDispatch Action:\n• If range_km < 75: 'Recharge Required'\n• Otherwise: 'Ready for Route'\n\nThe program must:\n1. Prompt for van ID and an updated battery percentage (e.g. 'EV-03' and '95').\n   - If found, update battery_pct for that van.\n   - If not found, output 'Van ID not recognised'.\n2. Display a table of Van ID, Battery %, Range (km), and Action.\n3. Output the total operational fleet range (sum of all ranges) and number of vans requiring recharge.\n4. Write vans requiring recharge to 'recharge_dispatch.txt' and output 'dispatch file has been created'.",
        "starter": "# Q06 - EV Fleet Battery Dispatcher (20 Marks)\ntbl_van_ids = [\"EV-01\", \"EV-02\", \"EV-03\", \"EV-04\", \"EV-05\"]\ntbl_fleet = [\n    [80, 240],\n    [25, 250],\n    [40, 220],\n    [90, 260],\n    [20, 230]\n]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - EV Fleet Battery Dispatcher\ntbl_van_ids = [\"EV-01\", \"EV-02\", \"EV-03\", \"EV-04\", \"EV-05\"]\ntbl_fleet = [\n    [80, 240],\n    [25, 250],\n    [40, 220],\n    [90, 260],\n    [20, 230]\n]\n\ndef calculate_range(pct, wh_per_km):\n    usable = (pct / 100.0) * 60000\n    return round(usable / wh_per_km)\n\ndef get_action(range_km):\n    if range_km < 75:\n        return \"Recharge Required\"\n    else:\n        return \"Ready for Route\"\n\nvan_in = input(\"Enter van ID: \").strip()\npct_in = int(input(\"Enter new battery %: \").strip())\n\nif van_in in tbl_van_ids:\n    idx = tbl_van_ids.index(van_in)\n    tbl_fleet[idx][0] = pct_in\nelse:\n    print(\"Van ID not recognised\")\n\nprint(f\"{'Van ID':<8} {'Battery%':>8} {'Range(km)':>10}  {'Action':<18}\")\nprint(\"-\" * 48)\n\ntotal_range = 0\nrecharge_count = 0\nrecharge_lines = []\n\nfor i in range(len(tbl_van_ids)):\n    pct = tbl_fleet[i][0]\n    wh = tbl_fleet[i][1]\n    rng = calculate_range(pct, wh)\n    action = get_action(rng)\n    total_range += rng\n    if action == \"Recharge Required\":\n        recharge_count += 1\n        recharge_lines.append(f\"{tbl_van_ids[i]}: {rng} km remaining\")\n    print(f\"{tbl_van_ids[i]:<8} {pct:>8} {rng:>10}  {action:<18}\")\n\nprint(\"-\" * 48)\nprint(f\"Total Fleet Range: {total_range} km | Recharge Queue: {recharge_count}\")\n\ntry:\n    with open(\"recharge_dispatch.txt\", \"w\") as f:\n        for rl in recharge_lines:\n            f.write(rl + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"dispatch file has been created\")\n",
        "tests": [
          {
            "in": [
              "EV-02",
              "90"
            ],
            "out": "Van ID   Battery%  Range(km)  Action            \n------------------------------------------------\nEV-01          80        200  Ready for Route   \nEV-02          90        216  Ready for Route   \nEV-03          40        109  Ready for Route   \nEV-04          90        208  Ready for Route   \nEV-05          20         52  Recharge Required \n------------------------------------------------\nTotal Fleet Range: 785 km | Recharge Queue: 1\ndispatch file has been created",
            "m": 10
          },
          {
            "in": [
              "EV-99",
              "100"
            ],
            "out": "Van ID not recognised\nVan ID   Battery%  Range(km)  Action            \n------------------------------------------------\nEV-01          80        200  Ready for Route   \nEV-02          25         60  Recharge Required \nEV-03          40        109  Ready for Route   \nEV-04          90        208  Ready for Route   \nEV-05          20         52  Recharge Required \n------------------------------------------------\nTotal Fleet Range: 629 km | Recharge Queue: 2\ndispatch file has been created",
            "m": 10
          }
        ],
        "hint": "usable_wh = (pct / 100.0) * 60000; range_km = round(usable_wh / wh_per_km). Check range < 75 for recharge."
      },
      {
        "id": "cap20_07_sports_league",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 Sports League Standings & Relegation Monitor",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "A football league maintains seasonal statistics for its clubs.\n• Club names are stored in tbl_clubs.\n• Match records are stored in a two-dimensional array tbl_stats, where each row represents [won, drawn, lost, goals_for, goals_against].\n\nPoints & Goal Difference (subprogram calculate_league_points):\n• Points = (won * 3) + (drawn * 1)\n• Goal Difference (GD) = goals_for - goals_against\n\nThe program must:\n1. Allow recording a new match result for a club:\n   - Prompt for club name, match outcome ('W', 'D', or 'L'), goals scored, and goals conceded.\n   - If found, update the corresponding won/drawn/lost counter and add to goals_for and goals_against.\n   - If not found, output 'Club not found'.\n2. Display a formatted league table with columns: 'Club', 'Won', 'Drawn', 'Lost', 'GD', 'Points'.\n3. Identify and print the club currently in first place (highest points).\n4. Write current standings to 'league_standings.txt' and output 'standings file has been saved'.",
        "starter": "# Q06 - Sports League Standings (20 Marks)\ntbl_clubs = [\"Arsenal\", \"Chelsea\", \"Liverpool\", \"Man City\", \"Tottenham\"]\ntbl_stats = [\n    [14, 4, 2, 42, 18],\n    [10, 5, 5, 34, 25],\n    [13, 5, 2, 45, 20],\n    [15, 3, 2, 48, 16],\n    [9, 4, 7, 30, 28]\n]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - Sports League Standings\ntbl_clubs = [\"Arsenal\", \"Chelsea\", \"Liverpool\", \"Man City\", \"Tottenham\"]\ntbl_stats = [\n    [14, 4, 2, 42, 18],\n    [10, 5, 5, 34, 25],\n    [13, 5, 2, 45, 20],\n    [15, 3, 2, 48, 16],\n    [9, 4, 7, 30, 28]\n]\n\ndef calculate_league_points(stats_row):\n    w, d, l, gf, ga = stats_row\n    pts = (w * 3) + (d * 1)\n    gd = gf - ga\n    return gd, pts\n\nclub_in = input(\"Enter club: \").strip()\nres_in = input(\"Enter result (W/D/L): \").strip().upper()\ngf_in = int(input(\"Enter goals scored: \").strip())\nga_in = int(input(\"Enter goals conceded: \").strip())\n\nif club_in in tbl_clubs:\n    idx = tbl_clubs.index(club_in)\n    if res_in == \"W\":\n        tbl_stats[idx][0] += 1\n    elif res_in == \"D\":\n        tbl_stats[idx][1] += 1\n    else:\n        tbl_stats[idx][2] += 1\n    tbl_stats[idx][3] += gf_in\n    tbl_stats[idx][4] += ga_in\nelse:\n    print(\"Club not found\")\n\nprint(f\"{'Club':<12} {'Won':>4} {'Drawn':>6} {'Lost':>5} {'GD':>5} {'Points':>7}\")\nprint(\"-\" * 43)\n\nbest_club = None\nmax_pts = -1\nstandings_lines = []\n\nfor i in range(len(tbl_clubs)):\n    gd, pts = calculate_league_points(tbl_stats[i])\n    if pts > max_pts:\n        max_pts = pts\n        best_club = tbl_clubs[i]\n    w, d, l, gf, ga = tbl_stats[i]\n    row = f\"{tbl_clubs[i]:<12} {w:>4} {d:>6} {l:>5} {gd:>5} {pts:>7}\"\n    print(row)\n    standings_lines.append(row)\n\nprint(\"-\" * 43)\nprint(f\"League Leader: {best_club} ({max_pts} pts)\")\n\ntry:\n    with open(\"league_standings.txt\", \"w\") as f:\n        for sl in standings_lines:\n            f.write(sl + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"standings file has been saved\")\n",
        "tests": [
          {
            "in": [
              "Arsenal",
              "W",
              "3",
              "0"
            ],
            "out": "Club          Won  Drawn  Lost    GD  Points\n-------------------------------------------\nArsenal        15      4     2    27       49\nChelsea        10      5     5     9       35\nLiverpool      13      5     2    25       44\nMan City       15      3     2    32       48\nTottenham       9      4     7     2       31\n-------------------------------------------\nLeague Leader: Arsenal (49 pts)\nstandings file has been saved",
            "m": 10
          },
          {
            "in": [
              "Everton",
              "W",
              "1",
              "0"
            ],
            "out": "Club not found\nClub          Won  Drawn  Lost    GD  Points\n-------------------------------------------\nArsenal        14      4     2    24       46\nChelsea        10      5     5     9       35\nLiverpool      13      5     2    25       44\nMan City       15      3     2    32       48\nTottenham       9      4     7     2       31\n-------------------------------------------\nLeague Leader: Man City (48 pts)\nstandings file has been saved",
            "m": 10
          }
        ],
        "hint": "Points = won * 3 + drawn. GD = goals_for - goals_against. If result is 'W', increment stats[0], if 'D', stats[1], else stats[2]."
      },
      {
        "id": "cap20_08_warehouse_inventory",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 Warehouse Inventory Stock Auditor & Automated Purchase Order",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "An automated warehouse manages item inventories.\n• SKUs, item descriptions, current stock, and reorder levels are stored in parallel arrays:\n  - tbl_sku (e.g. 'SKU-10', 'SKU-20')\n  - tbl_desc (e.g. 'Wireless Mouse', 'Mechanical Keyboard')\n  - tbl_stock (e.g. 45, 12)\n  - tbl_reorder (e.g. 20, 15)\n\nReorder Rule (subprogram evaluate_reorder):\n• If current stock <= reorder level, the item triggers an order of 50 units, with status 'REORDER'.\n• Otherwise, status is 'OK'.\n\nThe program must:\n1. Allow dispatching an order:\n   - Prompt for SKU and quantity sold.\n   - If SKU not found, display 'SKU not found'.\n   - If quantity sold > current stock, display 'Insufficient stock'.\n   - Otherwise, subtract the quantity from stock.\n2. Display a table of SKU, Description, Stock, Reorder Level, and Status.\n3. Display total units in warehouse and how many items require reordering.\n4. Write reorder items to 'purchase_orders.txt' and display 'purchase orders file has been written'.",
        "starter": "# Q06 - Warehouse Inventory Auditor (20 Marks)\ntbl_sku = [\"SKU-101\", \"SKU-102\", \"SKU-103\", \"SKU-104\", \"SKU-105\"]\ntbl_desc = [\"Wireless Mouse\", \"USB-C Hub\", \"HDMI Cable\", \"Laptop Stand\", \"Webcam 1080p\"]\ntbl_stock = [42, 14, 85, 9, 28]\ntbl_reorder = [20, 15, 30, 10, 25]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - Warehouse Inventory Auditor\ntbl_sku = [\"SKU-101\", \"SKU-102\", \"SKU-103\", \"SKU-104\", \"SKU-105\"]\ntbl_desc = [\"Wireless Mouse\", \"USB-C Hub\", \"HDMI Cable\", \"Laptop Stand\", \"Webcam 1080p\"]\ntbl_stock = [42, 14, 85, 9, 28]\ntbl_reorder = [20, 15, 30, 10, 25]\n\ndef evaluate_reorder(stock, reorder_lvl):\n    if stock <= reorder_lvl:\n        return \"REORDER\", 50\n    else:\n        return \"OK\", 0\n\nsku_in = input(\"Enter SKU: \").strip()\nqty_in = int(input(\"Enter units dispatched: \").strip())\n\nif sku_in in tbl_sku:\n    idx = tbl_sku.index(sku_in)\n    if qty_in > tbl_stock[idx]:\n        print(\"Insufficient stock\")\n    else:\n        tbl_stock[idx] -= qty_in\nelse:\n    print(\"SKU not found\")\n\nprint(f\"{'SKU':<9} {'Description':<20} {'Stock':>6} {'ReorderLvl':>11}  {'Status':<8}\")\nprint(\"-\" * 58)\n\ntotal_units = 0\nreorder_count = 0\norder_lines = []\n\nfor i in range(len(tbl_sku)):\n    stk = tbl_stock[i]\n    r_lvl = tbl_reorder[i]\n    status, order_qty = evaluate_reorder(stk, r_lvl)\n    total_units += stk\n    if status == \"REORDER\":\n        reorder_count += 1\n        order_lines.append(f\"{tbl_sku[i]} - {tbl_desc[i]}: Order {order_qty} units\")\n    print(f\"{tbl_sku[i]:<9} {tbl_desc[i]:<20} {stk:>6} {r_lvl:>11}  {status:<8}\")\n\nprint(\"-\" * 58)\nprint(f\"Total Warehouse Stock: {total_units} | Items to Reorder: {reorder_count}\")\n\ntry:\n    with open(\"purchase_orders.txt\", \"w\") as f:\n        for ol in order_lines:\n            f.write(ol + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"purchase orders file has been written\")\n",
        "tests": [
          {
            "in": [
              "SKU-101",
              "25"
            ],
            "out": "SKU       Description           Stock  ReorderLvl  Status  \n----------------------------------------------------------\nSKU-101   Wireless Mouse           17          20  REORDER \nSKU-102   USB-C Hub                14          15  REORDER \nSKU-103   HDMI Cable               85          30  OK      \nSKU-104   Laptop Stand              9          10  REORDER \nSKU-105   Webcam 1080p             28          25  OK      \n----------------------------------------------------------\nTotal Warehouse Stock: 153 | Items to Reorder: 3\npurchase orders file has been written",
            "m": 10
          },
          {
            "in": [
              "SKU-102",
              "50"
            ],
            "out": "Insufficient stock\nSKU       Description           Stock  ReorderLvl  Status  \n----------------------------------------------------------\nSKU-101   Wireless Mouse           42          20  OK      \nSKU-102   USB-C Hub                14          15  REORDER \nSKU-103   HDMI Cable               85          30  OK      \nSKU-104   Laptop Stand              9          10  REORDER \nSKU-105   Webcam 1080p             28          25  OK      \n----------------------------------------------------------\nTotal Warehouse Stock: 178 | Items to Reorder: 2\npurchase orders file has been written",
            "m": 10
          }
        ],
        "hint": "Validate quantity sold <= stock before deducting. Check stock <= reorder level, and write reorder items to purchase_orders.txt."
      },
      {
        "id": "cap20_09_meteorological_rainfall",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 Weather Station Rainfall Synthesis & Drought Advisory",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "A meteorological agency tracks quarterly rainfall totals (in millimetres) across several weather stations.\n• Station names are stored in tbl_stations.\n• Quarterly rainfall readings [Q1, Q2, Q3, Q4] are stored in a two-dimensional array tbl_rainfall.\n\nClassification Rules (subprogram assess_drought):\n• Calculate annual total = sum(readings).\n• Drought Advisory Status:\n  - Annual total < 250: 'Severe Drought'\n  - Annual total 250 to 500: 'Moderate Drought'\n  - Annual total > 500: 'Normal Rainfall'\n\nThe program must:\n1. Prompt for a station name and an updated reading for Q4 (index 3) (e.g. 'Mojave Post' and '45').\n   - If found, update Q4 for that station.\n   - If not found, output 'Station not found'.\n2. Display a table of Station, Annual Total (mm), and Advisory.\n3. Compute and display the overall average annual rainfall across all stations rounded to 1 decimal place.\n4. Write all stations under 'Severe Drought' to 'drought_advisory.txt' and output 'drought advisory file has been exported'.",
        "starter": "# Q06 - Weather Station Rainfall Synthesis (20 Marks)\ntbl_stations = [\"Sahara Base\", \"Mojave Post\", \"Atacama Lab\", \"Highland Hill\", \"Valley Grove\"]\ntbl_rainfall = [\n    [12, 5, 8, 15],\n    [65, 42, 38, 70],\n    [4, 2, 6, 8],\n    [180, 210, 195, 230],\n    [95, 110, 85, 120]\n]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - Weather Station Rainfall Synthesis\ntbl_stations = [\"Sahara Base\", \"Mojave Post\", \"Atacama Lab\", \"Highland Hill\", \"Valley Grove\"]\ntbl_rainfall = [\n    [12, 5, 8, 15],\n    [65, 42, 38, 70],\n    [4, 2, 6, 8],\n    [180, 210, 195, 230],\n    [95, 110, 85, 120]\n]\n\ndef assess_drought(readings):\n    total = sum(readings)\n    if total < 250:\n        status = \"Severe Drought\"\n    elif total <= 500:\n        status = \"Moderate Drought\"\n    else:\n        status = \"Normal Rainfall\"\n    return total, status\n\nstation_in = input(\"Enter station name: \").strip()\nq4_in = int(input(\"Enter updated Q4 rainfall: \").strip())\n\nif station_in in tbl_stations:\n    idx = tbl_stations.index(station_in)\n    tbl_rainfall[idx][3] = q4_in\nelse:\n    print(\"Station not found\")\n\nprint(f\"{'Station':<16} {'Annual(mm)':>10}  {'Advisory':<18}\")\nprint(\"-\" * 48)\n\noverall_total = 0\ndrought_lines = []\n\nfor i in range(len(tbl_stations)):\n    total, status = assess_drought(tbl_rainfall[i])\n    overall_total += total\n    if status == \"Severe Drought\":\n        drought_lines.append(f\"{tbl_stations[i]}: {total} mm\")\n    print(f\"{tbl_stations[i]:<16} {total:>10}  {status:<18}\")\n\nprint(\"-\" * 48)\navg_rain = overall_total / len(tbl_stations)\nprint(f\"Average Annual Rainfall: {avg_rain:.1f} mm\")\n\ntry:\n    with open(\"drought_advisory.txt\", \"w\") as f:\n        for dl in drought_lines:\n            f.write(dl + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"drought advisory file has been exported\")\n",
        "tests": [
          {
            "in": [
              "Mojave Post",
              "45"
            ],
            "out": "Station          Annual(mm)  Advisory          \n------------------------------------------------\nSahara Base              40  Severe Drought    \nMojave Post             190  Severe Drought    \nAtacama Lab              20  Severe Drought    \nHighland Hill           815  Normal Rainfall   \nValley Grove            410  Moderate Drought  \n------------------------------------------------\nAverage Annual Rainfall: 295.0 mm\ndrought advisory file has been exported",
            "m": 10
          },
          {
            "in": [
              "Greenland Peak",
              "50"
            ],
            "out": "Station not found\nStation          Annual(mm)  Advisory          \n------------------------------------------------\nSahara Base              40  Severe Drought    \nMojave Post             215  Severe Drought    \nAtacama Lab              20  Severe Drought    \nHighland Hill           815  Normal Rainfall   \nValley Grove            410  Moderate Drought  \n------------------------------------------------\nAverage Annual Rainfall: 300.0 mm\ndrought advisory file has been exported",
            "m": 10
          }
        ],
        "hint": "Total = sum(readings). Check total < 250 for Severe Drought and total <= 500 for Moderate Drought. Write Severe Drought stations to drought_advisory.txt."
      },
      {
        "id": "cap20_10_university_coursework",
        "unit": "U20M",
        "unitName": "Paper 2 20-Marker Capstone Mastery",
        "title": "Q6 University Weighted Mark Normaliser & Transcript Exporter",
        "level": "Exam-style",
        "difficulty": "Hard",
        "type": "code",
        "marks": 20,
        "brief": "A university department calculates final degree module scores.\n• Student IDs and names are stored in parallel arrays: tbl_student_id, tbl_names.\n• Raw assessment component scores are stored in a two-dimensional array tbl_components, where each row has [exam_mark, coursework_mark].\n  - Exam is out of 100 and weighted at 60%.\n  - Coursework is out of 50 and weighted at 40% (scale to percentage by multiplying by 2, then weight by 0.4).\n\nWeighting Formula (subprogram compute_weighted_score):\n• cw_pct = (coursework_mark / 50.0) * 100\n• weighted_total = round((exam_mark * 0.60) + (cw_pct * 0.40))\n\nDegree Classification:\n• >= 70: 'First Class'\n• 60 to 69: 'Upper Second'\n• 50 to 59: 'Lower Second'\n• 40 to 49: 'Third Class'\n• < 40: 'Fail'\n\nThe program must:\n1. Prompt for student ID and an updated coursework mark (e.g. 'ST-201' and '44').\n   - If found, update the coursework mark (index 1) for that student.\n   - If not found, output 'Student not found'.\n2. Display a transcript table with: Student ID, Name, Overall %, and Degree Class.\n3. Display the cohort average overall percentage as a rounded whole number.\n4. Write students earning 'First Class' or 'Upper Second' to 'honors_transcripts.txt' and output 'transcripts file has been generated'.",
        "starter": "# Q06 - University Module Normaliser (20 Marks)\ntbl_student_id = [\"ST-201\", \"ST-202\", \"ST-203\", \"ST-204\", \"ST-205\"]\ntbl_names = [\"Bethany Taylor\", \"Callum Scott\", \"Diana Prince\", \"Ethan Hunt\", \"Fiona Gallagher\"]\ntbl_components = [\n    [68, 38],\n    [84, 46],\n    [52, 28],\n    [76, 42],\n    [35, 20]\n]\n\n# Write your subprogram(s) and program below:\n",
        "solution": "# Q06FINISHED - University Module Normaliser\ntbl_student_id = [\"ST-201\", \"ST-202\", \"ST-203\", \"ST-204\", \"ST-205\"]\ntbl_names = [\"Bethany Taylor\", \"Callum Scott\", \"Diana Prince\", \"Ethan Hunt\", \"Fiona Gallagher\"]\ntbl_components = [\n    [68, 38],\n    [84, 46],\n    [52, 28],\n    [76, 42],\n    [35, 20]\n]\n\ndef compute_weighted_score(exam, cw):\n    cw_pct = (cw / 50.0) * 100\n    final_mark = round((exam * 0.60) + (cw_pct * 0.40))\n    if final_mark >= 70:\n        d_class = \"First Class\"\n    elif final_mark >= 60:\n        d_class = \"Upper Second\"\n    elif final_mark >= 50:\n        d_class = \"Lower Second\"\n    elif final_mark >= 40:\n        d_class = \"Third Class\"\n    else:\n        d_class = \"Fail\"\n    return final_mark, d_class\n\nsid_in = input(\"Enter student ID: \").strip()\ncw_in = int(input(\"Enter updated coursework: \").strip())\n\nif sid_in in tbl_student_id:\n    idx = tbl_student_id.index(sid_in)\n    tbl_components[idx][1] = cw_in\nelse:\n    print(\"Student not found\")\n\nprint(f\"{'ID':<8} {'Name':<18} {'Overall%':>8}  {'Degree Class':<14}\")\nprint(\"-\" * 52)\n\ntotal_pct = 0\nhonors_lines = []\n\nfor i in range(len(tbl_student_id)):\n    exam = tbl_components[i][0]\n    cw = tbl_components[i][1]\n    final_mark, d_class = compute_weighted_score(exam, cw)\n    total_pct += final_mark\n    if d_class in [\"First Class\", \"Upper Second\"]:\n        honors_lines.append(f\"{tbl_student_id[i]} {tbl_names[i]} - {final_mark}% ({d_class})\")\n    print(f\"{tbl_student_id[i]:<8} {tbl_names[i]:<18} {final_mark:>8}  {d_class:<14}\")\n\nprint(\"-\" * 52)\ncohort_avg = round(total_pct / len(tbl_student_id))\nprint(f\"Cohort Average: {cohort_avg}%\")\n\ntry:\n    with open(\"honors_transcripts.txt\", \"w\") as f:\n        for hl in honors_lines:\n            f.write(hl + \"\\n\")\nexcept Exception:\n    pass\n\nprint(\"transcripts file has been generated\")\n",
        "tests": [
          {
            "in": [
              "ST-201",
              "44"
            ],
            "out": "ID       Name               Overall%  Degree Class  \n----------------------------------------------------\nST-201   Bethany Taylor           76  First Class   \nST-202   Callum Scott             87  First Class   \nST-203   Diana Prince             54  Lower Second  \nST-204   Ethan Hunt               79  First Class   \nST-205   Fiona Gallagher          37  Fail          \n----------------------------------------------------\nCohort Average: 67%\ntranscripts file has been generated",
            "m": 10
          },
          {
            "in": [
              "ST-999",
              "50"
            ],
            "out": "Student not found\nID       Name               Overall%  Degree Class  \n----------------------------------------------------\nST-201   Bethany Taylor           71  First Class   \nST-202   Callum Scott             87  First Class   \nST-203   Diana Prince             54  Lower Second  \nST-204   Ethan Hunt               79  First Class   \nST-205   Fiona Gallagher          37  Fail          \n----------------------------------------------------\nCohort Average: 66%\ntranscripts file has been generated",
            "m": 10
          }
        ],
        "hint": "cw_pct = (cw / 50.0) * 100. final_mark = round((exam * 0.60) + (cw_pct * 0.40)). Check final_mark for degree classifications and export honors lines."
      }
    ],
    "maxMarks": 200,
    "createdAt": 1789917193160,
    "status": "active",
    "students": {
      "s_alexstudent_ttff": {
        "studentId": "s_alexstudent_ttff",
        "name": "Alex Student",
        "candidateNumber": "C9769",
        "className": "Class 1",
        "status": "in_progress",
        "currentQuestionIndex": 0,
        "answeredQuestions": [],
        "answers": {},
        "marks": {},
        "totalMarks": 0,
        "maxMarks": 200,
        "percentage": 0,
        "joinedAt": 1789918998284,
        "lastActiveAt": 1789918998284
      },
      "s_alexstudent_ydsa": {
        "studentId": "s_alexstudent_ydsa",
        "name": "Alex Student",
        "candidateNumber": "C6516",
        "className": "Class 1",
        "status": "in_progress",
        "currentQuestionIndex": 0,
        "answeredQuestions": [],
        "answers": {},
        "marks": {},
        "totalMarks": 0,
        "maxMarks": 200,
        "percentage": 0,
        "joinedAt": 1789919016079,
        "lastActiveAt": 1789919016079
      }
    }
  },
  "a_l1f6pr": {
    "id": "a_l1f6pr",
    "title": "Test",
    "code": "ZKKZNK",
    "type": "assessment",
    "durationMinutes": 45,
    "showScoreImmediately": true,
    "questionIds": [
      "u04a",
      "u05c",
      "u15a",
      "p25_q01bii",
      "p25_q01a"
    ],
    "questions": [
      {
        "id": "u04a",
        "unit": "U04",
        "type": "code",
        "title": "Pass or fail",
        "level": "Starter",
        "brief": "Read a mark out of 100. Print \"Pass\" if it is 50 or more, otherwise \"Fail\".",
        "starter": "mark = int(input(\"Mark: \"))\n",
        "hint": "Use mark >= 50 in your condition.",
        "tests": [
          {
            "in": [
              "50"
            ],
            "out": "Pass\n",
            "m": 1
          },
          {
            "in": [
              "49"
            ],
            "out": "Fail\n",
            "m": 1
          },
          {
            "in": [
              "100"
            ],
            "out": "Pass\n",
            "m": 0
          }
        ],
        "marks": 2,
        "difficulty": "Easy"
      },
      {
        "id": "u05c",
        "unit": "U05",
        "type": "code",
        "title": "Username generator",
        "level": "Exam-style",
        "brief": "Read a full name (first and surname separated by a space) and a year, e.g. \"Sam Patel\" and \"2010\". Print a username made of the first 3 letters of the surname in lower case followed by the last 2 digits of the year:\n\npat10",
        "starter": "name = input(\"Full name: \")\nyear = input(\"Year: \")\n",
        "tests": [
          {
            "in": [
              "Sam Patel",
              "2010"
            ],
            "out": "pat10",
            "m": 2
          },
          {
            "in": [
              "Lin Zhou",
              "2009"
            ],
            "out": "zho09",
            "m": 2
          },
          {
            "in": [
              "Ola Okonkwo",
              "2011"
            ],
            "out": "oko11",
            "m": 2
          }
        ],
        "marks": 6,
        "difficulty": "Hard"
      },
      {
        "id": "u15a",
        "unit": "U15",
        "type": "table",
        "title": "While loop countdown trace",
        "level": "Trace table",
        "brief": "Complete the trace table for this program. Write one row each time the loop body finishes (after both statements). In the Output column write what was printed during that pass.",
        "code": "n = 5\ntotal = 0\nwhile n > 2:\n    total = total + n\n    n = n - 1\n    print(total)",
        "columns": [
          {
            "label": "n",
            "type": "text"
          },
          {
            "label": "total",
            "type": "text"
          },
          {
            "label": "Output",
            "type": "text"
          }
        ],
        "rows": [
          [
            {
              "v": "4",
              "g": false
            },
            {
              "v": "5",
              "g": false
            },
            {
              "v": "5",
              "g": false
            }
          ],
          [
            {
              "v": "3",
              "g": false
            },
            {
              "v": "9",
              "g": false
            },
            {
              "v": "9",
              "g": false
            }
          ],
          [
            {
              "v": "2",
              "g": false
            },
            {
              "v": "12",
              "g": false
            },
            {
              "v": "12",
              "g": false
            }
          ]
        ],
        "marks": 9,
        "difficulty": "Moderate"
      },
      {
        "id": "p25_q01bii",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q1(b)(ii) Amend Ball Counter Code (Q01bii)",
        "level": "Exam-style",
        "difficulty": "Moderate",
        "type": "code",
        "marks": 3,
        "brief": "A program counts the number of green and red balls stored in an array.\nThe program outputs the number of green balls, the number of red balls and the total number of balls.\n\nFigure 1 shows the expected output from the program:\n  Green: 25 balls\n  Red:   15 balls\n  Total: 40 balls\n\nThere are three errors in the starter code:\n1. The loop range or condition has an off-by-one boundary mistake.\n2. The condition checking for 'red' ball is faulty or misses the increment.\n3. The total calculation or output formatting is incorrect.\n\nAmend the code to correct the three errors so it prints the exact expected output shown above.",
        "starter": "# Q01bii - Ball Counter\nballs = [\"green\"] * 25 + [\"red\"] * 15\n\ngreen_count = 0\nred_count = 0\n\n# Error 1: loop index off by one\nfor i in range(len(balls) - 1):\n    if balls[i] == \"green\":\n        green_count += 1\n    # Error 2: incorrect string check\n    elif balls[i] == \"Red\":\n        red_count += 1\n\n# Error 3: total calculation bug\ntotal_balls = green_count - red_count\n\nprint(f\"Green: {green_count} balls\")\nprint(f\"Red:   {red_count} balls\")\nprint(f\"Total: {total_balls} balls\")\n",
        "solution": "# Q01biiFINISHED - Ball Counter Corrected\nballs = [\"green\"] * 25 + [\"red\"] * 15\n\ngreen_count = 0\nred_count = 0\n\nfor i in range(len(balls)):\n    if balls[i] == \"green\":\n        green_count += 1\n    elif balls[i] == \"red\":\n        red_count += 1\n\ntotal_balls = green_count + red_count\n\nprint(f\"Green: {green_count} balls\")\nprint(f\"Red:   {red_count} balls\")\nprint(f\"Total: {total_balls} balls\")\n",
        "markScheme": "Official Pearson Edexcel 4CP0 Mark Scheme (3 Marks Total):\n• MP1 (1 mark): Loop range error corrected to range(len(balls)) so all 40 balls in the array are processed (yielding Green: 25 balls).\n• MP2 (1 mark): String comparison corrected to lowercase 'red' so red balls are correctly counted (yielding Red: 15 balls).\n• MP3 (1 mark): Total calculation bug corrected from subtraction to addition: total_balls = green_count + red_count (yielding Total: 40 balls).",
        "tests": [
          {
            "in": [],
            "out": "Green: 25 balls",
            "m": 1
          },
          {
            "in": [],
            "out": "Red:   15 balls",
            "m": 1
          },
          {
            "in": [],
            "out": "Total: 40 balls",
            "m": 1
          }
        ],
        "hint": "Check range(len(balls)), the lowercase 'red' string comparison, and adding green_count + red_count for the total."
      },
      {
        "id": "p25_q01a",
        "unit": "P25",
        "unitName": "Edexcel 4CP0/2AW Summer 2025 Paper 2",
        "title": "Q1(a) Selection Statement Keyword",
        "level": "Core",
        "difficulty": "Easy",
        "type": "mcq",
        "marks": 1,
        "brief": "Programmers use different programming constructs to create working code.\n\nIdentify the keyword used to create a selection statement.",
        "questions": [
          {
            "q": "Identify the keyword used to create a selection statement in Python:",
            "options": [
              "for",
              "if",
              "new",
              "while"
            ],
            "a": 1
          }
        ],
        "hint": "Selection constructs allow a program to test conditions and choose different execution paths.",
        "markScheme": "1 mark for:\n• B (if) (1)\n\nGuidance:\n- 'if' is the keyword used in Python for selection (conditional branch execution).\n- 'for' and 'while' are iteration constructs (looping).\n- 'new' is not a valid Python keyword.\n- Credit Option B, option index 1, or literal string 'if'."
      }
    ],
    "maxMarks": 21,
    "createdAt": 1790156201214,
    "status": "active",
    "students": {
      "s_a_utnb": {
        "studentId": "s_a_utnb",
        "name": "a",
        "candidateNumber": "C8964",
        "className": "11B",
        "status": "submitted",
        "currentQuestionIndex": 4,
        "answeredQuestions": [
          "p25_q01bii",
          "p25_q01a"
        ],
        "answers": {
          "p25_q01bii": "# Q01bii - Ball Counter\nballs = [\"green\"] * 25 + [\"red\"] * 15\n\ngreen_count = 0\nred_count = 0\n\n# Error 1: loop index off by one\nfor i in range(len(balls)):\n    if balls[i] == \"green\":\n        green_count += 1\n    # Error 2: incorrect string check\n    elif balls[i] == \"red\":\n        red_count += 1\n\n# Error 3: total calculation bug\n    total_balls = green_count - red_count\n\nprint(f\"Green: {green_count} balls\")\nprint(f\"Red:   {red_count} balls\")\nprint(f\"Total: {total_balls} balls\")\n",
          "p25_q01a": [
            1
          ]
        },
        "marks": {
          "u04a": 0,
          "u05c": 0,
          "u15a": 0,
          "p25_q01bii": 2,
          "p25_q01a": 1
        },
        "totalMarks": 3,
        "maxMarks": 21,
        "percentage": 14,
        "joinedAt": 1790156244992,
        "lastActiveAt": 1790156363042,
        "submittedAt": 1790156363042,
        "feedback": "Feedback & Focus Action: Q1(a) Selection keyword 'if' correctly identified (+1 mark). Q1(b)(ii) Ball Counter: Loop index and string case correctly amended (+2 marks). Focus on accumulation operators (+ vs -) and complete trace tables sequentially before submitting."
      }
    }
  }
};

export const SEED_ASSESSMENTS: Assessment[] = Object.values(SEED_ASSESSMENTS_MAP);
