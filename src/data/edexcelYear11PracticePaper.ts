import { IGCSETask, IGCSEUnit } from "../types";

/**
 * Pearson Edexcel International GCSE (9–1) Computer Science (4CP0)
 * Paper 2: Application of Computational Thinking
 * "Python practice Assessment – Year 11"
 *
 * Exact exam questions extracted from the official practice paper:
 * - Q03c: Number Input Validation (6 marks)
 * - Q04c: Key Construction Subprogram & String Slicing (6 marks)
 * - Q06: 2D Word Pairs Analysis, Indentation & Sorting (15 marks)
 */

export const YEAR11_PRACTICE_TASKS: IGCSETask[] = [
  // =========================================================================
  // QUESTION 03c (6 Marks)
  // =========================================================================
  {
    id: "y11_q03c",
    unit: "Y11",
    unitName: "Python Practice Assessment – Year 11",
    title: "Q03c: Number Input Validation",
    level: "Core",
    difficulty: "Moderate",
    type: "code",
    marks: 6,
    year: 2024,
    session: "Practice",
    paperTitle: "Year 11: Official Python Practice Assessment",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    brief: `A program validates a number input by the user.

Figure 3 shows the output messages based on the inputted number:

| Input | Output |
| :--- | :--- |
| <empty> | You must provide a number |
| Any negative number | The number must be greater than zero |
| 0 | The number must be greater than zero |
| 1 to 20 | Acceptable |
| 60 or more | Acceptable |
| 31 to 39 | Centre |
| 30 | Perfect |
| Any other number | No message |

**Instructions:**
1. Open **Q03c** in the code editor.
2. Amend the code to ensure the messages are generated correctly according to Figure 3.
3. Do not add any further functionality.
4. Save your code as **Q03cFINISHED**.`,
    hint: "Use input() to read the user's entry. Check if the string is empty first. Then convert to integer and use if / elif / else branches with relational operators (<= 0, >= 1 and <= 20, == 30, >= 31 and <= 39, >= 60).",
    starter: `# Q03c - Number Input Validation
# Amend the code to ensure the messages are generated correctly according to Figure 3.
# Do not add any further functionality.

user_input = input()

# Write your validation logic below
`,
    solution: `user_input = input()

if not user_input.strip():
    print("You must provide a number")
else:
    try:
        num = int(user_input)
        if num <= 0:
            print("The number must be greater than zero")
        elif (num >= 1 and num <= 20) or num >= 60:
            print("Acceptable")
        elif num == 30:
            print("Perfect")
        elif num >= 31 and num <= 39:
            print("Centre")
        else:
            print("No message")
    except ValueError:
        print("You must provide a number")
`,
    markScheme: `Pearson Edexcel 4CP0/02 Mark Scheme Rubric (6 Marks):
• 1 mark (M1): Checks for empty string and outputs 'You must provide a number'.
• 1 mark (A1): Checks for negative number or 0 (num <= 0) and outputs 'The number must be greater than zero'.
• 1 mark (A1): Checks for 1 to 20 inclusive or 60 or more, and outputs 'Acceptable'.
• 1 mark (A1): Checks for 30 exactly and outputs 'Perfect'.
• 1 mark (A1): Checks for 31 to 39 inclusive and outputs 'Centre'.
• 1 mark (A1): Outputs 'No message' for all other numbers (e.g., 21-29, 40-59).`,
    tests: [
      {
        in: [""],
        out: "You must provide a number",
        m: 1,
      },
      {
        in: ["-8"],
        out: "The number must be greater than zero",
        m: 1,
      },
      {
        in: ["0"],
        out: "The number must be greater than zero",
        m: 0.5,
      },
      {
        in: ["15"],
        out: "Acceptable",
        m: 1,
      },
      {
        in: ["75"],
        out: "Acceptable",
        m: 0.5,
      },
      {
        in: ["30"],
        out: "Perfect",
        m: 1,
      },
      {
        in: ["35"],
        out: "Centre",
        m: 0.5,
      },
      {
        in: ["25"],
        out: "No message",
        m: 0.5,
      },
    ],
  },

  // =========================================================================
  // QUESTION 04c (6 Marks)
  // =========================================================================
  {
    id: "y11_q04c",
    unit: "Y11",
    unitName: "Python Practice Assessment – Year 11",
    title: "Q04c: Key Construction Subprogram",
    level: "Core",
    difficulty: "Moderate",
    type: "code",
    marks: 6,
    year: 2024,
    session: "Practice",
    paperTitle: "Year 11: Official Python Practice Assessment",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    brief: `A program is required to create a new key.

The program takes two inputs:
• The first input is a four-character string.
• The second input is a whole number.

The key is constructed by joining the first two characters from the string, the number, and the final two characters from the string.

**Example:**
When the user enters the four-character string \`abcd\` and the integer \`123\`, the program must construct and display the new key \`ab123cd\`.

**Instructions:**
1. Open **Q04c** in the code editor.
2. Amend the code to:
   • Complete the subprogram to construct the new key.
   • Complete the call to the subprogram.
3. Do not add any further functionality.
4. Save your code as **Q04cFINISHED**.`,
    hint: "Use string slicing to extract the first two characters (text[:2]) and last two characters (text[2:] or text[-2:]). Convert the whole number to a string using str(num) and concatenate them.",
    starter: `# Q04c - Key Construction Subprogram
# Amend the code to:
# • complete the subprogram to construct the new key
# • complete the call to the subprogram.
# Do not add any further functionality.

def construct_key(text, num):
    # Complete the subprogram to construct the new key
    pass

# Main program inputs
string_input = input()
number_input = int(input())

# Complete the call to the subprogram and display the result
`,
    solution: `def construct_key(text, num):
    first_two = text[:2]
    last_two = text[2:]
    return first_two + str(num) + last_two

string_input = input()
number_input = int(input())

new_key = construct_key(string_input, number_input)
print(new_key)
`,
    markScheme: `Pearson Edexcel 4CP0/02 Mark Scheme Rubric (6 Marks):
• 1 mark (M1): Slices the first two characters of the string (text[:2]).
• 1 mark (M1): Slices the final two characters of the string (text[2:] or text[-2:]).
• 1 mark (M1): Converts the integer parameter to string and concatenates with sliced substrings.
• 1 mark (A1): Returns the constructed key from the subprogram.
• 1 mark (M1): Calls the subprogram passing both inputs as arguments.
• 1 mark (A1): Correctly prints / displays the returned key.`,
    tests: [
      {
        in: ["abcd", "123"],
        out: "ab123cd",
        m: 2,
      },
      {
        in: ["wxyz", "45"],
        out: "wx45yz",
        m: 1.5,
      },
      {
        in: ["code", "9"],
        out: "co9de",
        m: 1.5,
      },
      {
        in: ["star", "2026"],
        out: "st2026ar",
        m: 1,
      },
    ],
  },

  // =========================================================================
  // QUESTION 06 (15 Marks)
  // =========================================================================
  {
    id: "y11_q06",
    unit: "Y11",
    unitName: "Python Practice Assessment – Year 11",
    title: "Q06: 2D Word Pairs Analysis & Sorting",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 15,
    year: 2024,
    session: "Practice",
    paperTitle: "Year 11: Official Python Practice Assessment",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    brief: `A program stores pairs of words in a two-dimensional array.
Each word in a pair starts with a different letter.
Each pair of words should be in alphabetical order, but some are not.
The last pair in the array is an empty pair.

The program must:
• replace the final blank pair of words with the variables \`word1\` and \`word2\`
• display the pair number of each pair, followed by each word in the pair, without punctuation
• display the longer word in the pair, indented
• display any pair found to be not in alphabetical order, in alphabetical order, indented, without punctuation.

Figure 9 shows part of the intended output from a functional program:
\`\`\`
1 apple banana
    banana
2 wrist leg
    wrist
    leg wrist
3 blue yellow
    yellow
4 speaker keyboard
    keyboard
    keyboard speaker
\`\`\`

**Instructions:**
1. Open the file **Q06** in the code editor.
2. Write a program to produce the intended output.
3. You must use the structure and variables given in Q06 to complete the program.
4. **Your program should function correctly even if the number of pairs in the array is changed.**
5. You should use techniques to make your code easy to read.`,
    hint: "Use pairs[-1] = [word1, word2] to replace the blank pair. Use a for loop with range(len(pairs)) so it adapts if the number of pairs changes. Use len() to find the longer word. To check alphabetical order, compare word1 > word2.",
    starter: `# Q06 - 2D Word Pairs Analysis
word1 = "speaker"
word2 = "keyboard"

pairs = [
    ["apple", "banana"],
    ["wrist", "leg"],
    ["blue", "yellow"],
    ["", ""]
]

# Write your program below to produce the intended output.
# Must work correctly even if the number of pairs in the array is changed.
`,
    solution: `word1 = "speaker"
word2 = "keyboard"

pairs = [
    ["apple", "banana"],
    ["wrist", "leg"],
    ["blue", "yellow"],
    ["", ""]
]

# Replace final blank pair
pairs[-1] = [word1, word2]

# Iterate dynamically over all pairs
for i in range(len(pairs)):
    pair_num = i + 1
    w1 = pairs[i][0]
    w2 = pairs[i][1]

    # 1. Display pair number and both words without punctuation
    print(str(pair_num) + " " + w1 + " " + w2)

    # 2. Display the longer word in the pair, indented
    if len(w1) > len(w2):
        print("    " + w1)
    else:
        print("    " + w2)

    # 3. If not in alphabetical order, display in alphabetical order, indented
    if w1 > w2:
        print("    " + w2 + " " + w1)
`,
    markScheme: `Pearson Edexcel 4CP0/02 Mark Scheme Rubric (15 Marks):
• 2 marks: Replaces the final blank pair with [word1, word2] dynamically.
• 3 marks: Iterates through the 2D array using length of array (len(pairs)), not a fixed hardcoded range.
• 3 marks: Displays pair index (1-based) followed by both words without punctuation on the first line.
• 3 marks: Determines length of each word and outputs the longer word with 4-space indentation.
• 3 marks: Detects if pair is out of alphabetical order (w1 > w2) and prints in alphabetical order (w2 + ' ' + w1), indented.
• 1 mark: Code readability, meaningful variable names, and clear indentation structure.`,
    tests: [
      {
        in: [],
        out: "1 apple banana\n    banana\n2 wrist leg\n    wrist\n    leg wrist\n3 blue yellow\n    yellow\n4 speaker keyboard\n    keyboard\n    keyboard speaker",
        m: 10,
      },
      {
        in: [],
        out: "1 apple banana\n    banana\n2 wrist leg\n    wrist\n    leg wrist\n3 blue yellow\n    yellow\n4 speaker keyboard\n    keyboard\n    keyboard speaker",
        m: 5,
      },
    ],
  },
];

export const YEAR11_PRACTICE_UNIT: IGCSEUnit = {
  code: "Y11",
  title: "Paper 2: Year 11 Practice Assessment",
  topicGroup: "Past Examination Papers",
  paper: "Paper 2",
  spec: "Topic 2: Programming (4CP0/02)",
  blurb:
    "Official Edexcel 4CP0/2AW Paper 2 Python Practice Assessment tasks including Q03c (Validation), Q04c (Subprograms & Slicing), and Q06 (2D Arrays, Sorting & Indentation).",
  tasks: YEAR11_PRACTICE_TASKS,
};
