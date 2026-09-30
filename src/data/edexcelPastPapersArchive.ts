import { IGCSETask, IGCSEUnit } from "../types";

/**
 * Pearson Edexcel International GCSE (9-1) Computer Science (4CP0/2P)
 * Paper 2: Application of Computational Thinking - November 2023 Series (Autumn)
 */
export const EDEXCEL_2023_NOV_PAPER_TASKS: IGCSETask[] = [
  {
    id: "p23_nov_q01a",
    unit: "P23N",
    unitName: "Edexcel 4CP0/2P November 2023 Paper 2",
    paperTitle: "November 2023: Paper 2 (4CP0/2P) Autumn Series",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    session: "November",
    year: 2023,
    title: "Q1(a) Arithmetic Operator Modulo / Remainder",
    level: "Core",
    difficulty: "Easy",
    type: "mcq",
    marks: 1,
    brief:
      "A programmer is writing a program in Python to calculate the remainder when one integer is divided by another.\n\n" +
      "Identify the arithmetic operator used to calculate the remainder (modulo) in Python.",
    questions: [
      {
        q: "Which symbol represents the modulo (remainder) operator in Python?",
        options: ["//", "%", "^", "**"],
        a: 1, // %
      },
    ],
    hint: "The % symbol performs modulo division, returning only the remainder.",
  },
  {
    id: "p23_nov_q01b",
    unit: "P23N",
    unitName: "Edexcel 4CP0/2P November 2023 Paper 2",
    paperTitle: "November 2023: Paper 2 (4CP0/2P) Autumn Series",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    session: "November",
    year: 2023,
    title: "Q1(b) Data Type Determination",
    level: "Core",
    difficulty: "Easy",
    type: "table",
    marks: 3,
    brief:
      "Programs manipulate values stored in memory.\n\n" +
      "Complete the table by selecting the correct data type for each expression.",
    columns: [
      { label: "Expression" },
      { label: "Data Type", type: "select", options: ["-", "Integer", "Real / Float", "Boolean", "String"] },
    ],
    rows: [
      [
        { v: "7 // 2", g: true },
        { v: "Integer", g: false },
      ],
      [
        { v: "18.5 + 4", g: true },
        { v: "Real / Float", g: false },
      ],
      [
        { v: '"Edexcel" + "4CP0"', g: true },
        { v: "String", g: false },
      ],
    ],
  },
  {
    id: "p23_nov_q02",
    unit: "P23N",
    unitName: "Edexcel 4CP0/2P November 2023 Paper 2",
    paperTitle: "November 2023: Paper 2 (4CP0/2P) Autumn Series",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    session: "November",
    year: 2023,
    title: "Q2 Caesar Cipher Character Shift",
    level: "Core",
    difficulty: "Moderate",
    type: "code",
    marks: 5,
    starterFileName: "Q02.py",
    brief:
      "A student is creating a Caesar cipher encryption subprogram.\n\n" +
      "The program must:\n" +
      "1. Ask the user to input a single uppercase letter.\n" +
      "2. Ask the user to input an integer shift between 1 and 5.\n" +
      "3. Calculate the ASCII code of the shifted character using ord().\n" +
      "4. If the shifted code exceeds 'Z' (ASCII 90), wrap around by subtracting 26.\n" +
      "5. Print the encrypted character using chr().\n\n" +
      "Example:\n" +
      "Input: 'W', Shift: 5 -> Output: 'B'",
    starter: `# Q02 - Caesar Cipher Character Shift\nletter = input("Enter an uppercase letter: ").strip()\nshift = int(input("Enter shift (1-5): "))\n\n# Complete the encryption below:\n`,
    solution: `letter = input().strip()\nshift = int(input())\n\ncode = ord(letter) + shift\nif code > ord('Z'):\n    code -= 26\n\nprint(chr(code))\n`,
    tests: [
      { in: ["A", "3"], out: "D", m: 2 },
      { in: ["W", "5"], out: "B", m: 2 },
      { in: ["Y", "2"], out: "A", m: 1 },
    ],
  },
  {
    id: "p23_nov_q03",
    unit: "P23N",
    unitName: "Edexcel 4CP0/2P November 2023 Paper 2",
    paperTitle: "November 2023: Paper 2 (4CP0/2P) Autumn Series",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    session: "November",
    year: 2023,
    title: "Q3 Inventory Stock Sentinel Validation",
    level: "Core",
    difficulty: "Moderate",
    type: "code",
    marks: 6,
    starterFileName: "Q03.py",
    brief:
      "A warehouse tracking program records box quantities.\n\n" +
      "The program must:\n" +
      "1. Repeatedly ask the user to input the number of boxes until the sentinel -1 is entered.\n" +
      "2. Reject any negative numbers (other than -1) by displaying 'Invalid quantity'.\n" +
      "3. Accumulate the total boxes entered.\n" +
      "4. Count how many valid boxes entries were greater than or equal to 50 (large shipments).\n" +
      "5. When -1 is entered, display:\n" +
      "   Total: <total>\n" +
      "   Large shipments: <count>",
    starter: `# Q03 - Inventory Stock Sentinel Loop\ntotal = 0\nlarge_count = 0\n\n# Write the sentinel input loop below:\n`,
    solution: `total = 0\nlarge_count = 0\n\nwhile True:\n    qty = int(input())\n    if qty == -1:\n        break\n    if qty < 0:\n        print("Invalid quantity")\n        continue\n    total += qty\n    if qty >= 50:\n        large_count += 1\n\nprint(f"Total: {total}")\nprint(f"Large shipments: {large_count}")\n`,
    tests: [
      { in: ["20", "60", "15", "-1"], out: "Total: 95\nLarge shipments: 1", m: 3 },
      { in: ["70", "-5", "50", "-1"], out: "Invalid quantity\nTotal: 120\nLarge shipments: 2", m: 3 },
    ],
  },
  {
    id: "p23_nov_q06",
    unit: "P23N",
    unitName: "Edexcel 4CP0/2P November 2023 Paper 2",
    paperTitle: "November 2023: Paper 2 (4CP0/2P) Autumn Series",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    session: "November",
    year: 2023,
    title: "Q6 Delivery Fleet Mileage Tracker & Log Writer",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 15,
    starterFileName: "Q06.py",
    brief:
      "A courier firm manages 5 delivery vans.\n\n" +
      "Vans are tracked in parallel lists:\n" +
      "van_ids = ['VAN01', 'VAN02', 'VAN03', 'VAN04', 'VAN05']\n" +
      "drivers = ['Amira', 'David', 'Chen', 'Sarah', 'Kofi']\n" +
      "miles = [145.5, 88.0, 210.2, 95.4, 180.0]\n\n" +
      "Write a Python program that:\n" +
      "1. Prompts for a van ID to search for.\n" +
      "2. If found, prompts for extra miles driven today and adds to that van's miles.\n" +
      "   If not found, displays 'Van not found'.\n" +
      "3. Calculates and prints the total miles and the average miles across all 5 vans (rounded to 1 d.p.).\n" +
      "4. Creates a summary file 'van_summary.txt' containing each driver's name and their final miles.\n" +
      "5. Displays 'Summary report exported'.",
    starter: `# Q06 - Van Mileage Tracker (15 Marks)\nvan_ids = ['VAN01', 'VAN02', 'VAN03', 'VAN04', 'VAN05']\ndrivers = ['Amira', 'David', 'Chen', 'Sarah', 'Kofi']\nmiles = [145.5, 88.0, 210.2, 95.4, 180.0]\n\n# Write your solution below:\n`,
    solution: `van_ids = ['VAN01', 'VAN02', 'VAN03', 'VAN04', 'VAN05']\ndrivers = ['Amira', 'David', 'Chen', 'Sarah', 'Kofi']\nmiles = [145.5, 88.0, 210.2, 95.4, 180.0]\n\ntarget = input().strip()\nif target in van_ids:\n    idx = van_ids.index(target)\n    extra = float(input())\n    miles[idx] += extra\nelse:\n    print("Van not found")\n\ntotal = sum(miles)\navg = round(total / len(miles), 1)\nprint(f"Total miles: {round(total, 1)}")\nprint(f"Average miles: {avg}")\n\nwith open("van_summary.txt", "w") as f:\n    for d, m in zip(drivers, miles):\n        f.write(f"{d}: {round(m, 1)}\\n")\nprint("Summary report exported")\n`,
    tests: [
      { in: ["VAN02", "12.0"], out: "Total miles: 731.1\nAverage miles: 146.2\nSummary report exported", m: 7 },
      { in: ["VAN99"], out: "Van not found\nTotal miles: 719.1\nAverage miles: 143.8\nSummary report exported", m: 8 },
    ],
  },
];

/**
 * Pearson Edexcel International GCSE (9-1) Computer Science (4CP0/2AW)
 * Paper 2: Application of Computational Thinking - June 2024 Series (Summer)
 */
export const EDEXCEL_2024_JUNE_PAPER_TASKS: IGCSETask[] = [
  {
    id: "p24_jun_q01",
    unit: "P24",
    unitName: "Edexcel 4CP0/2AW June 2024 Paper 2",
    paperTitle: "June 2024: Paper 2 (4CP0/2AW) Summer Series",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    session: "June",
    year: 2024,
    title: "Q1 Logic Operation and Hexadecimal Representation",
    level: "Core",
    difficulty: "Easy",
    type: "mcq",
    marks: 2,
    brief:
      "A digital sensor sends status bytes to a computer.\n\n" +
      "Identify the correct hexadecimal equivalent of the 8-bit binary byte: 10111100.",
    questions: [
      {
        q: "What is 10111100 in hexadecimal?",
        options: ["BC", "CB", "AC", "BA"],
        a: 0, // BC (1011 = B=11, 1100 = C=12)
      },
      {
        q: "Which logical operation outputs TRUE only when both inputs are TRUE?",
        options: ["OR", "AND", "NOT", "XOR"],
        a: 1, // AND
      },
    ],
  },
  {
    id: "p24_jun_q02",
    unit: "P24",
    unitName: "Edexcel 4CP0/2AW June 2024 Paper 2",
    paperTitle: "June 2024: Paper 2 (4CP0/2AW) Summer Series",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    session: "June",
    year: 2024,
    title: "Q2 Candidate Code Validation & String Slicing",
    level: "Core",
    difficulty: "Moderate",
    type: "code",
    marks: 6,
    starterFileName: "Q02.py",
    brief:
      "An exam candidate code must be validated.\n\n" +
      "Validation Rules:\n" +
      "1. Must be exactly 7 characters in length.\n" +
      "2. The first 3 characters must be uppercase letters representing the centre code.\n" +
      "3. The last 4 characters must be digits representing the candidate number.\n\n" +
      "Write a Python program that takes a code input from the user and outputs:\n" +
      "- 'Valid candidate code' if all rules are satisfied.\n" +
      "- 'Invalid format' otherwise.",
    starter: `# Q02 - Candidate Code Validation\ncode = input("Enter 7-character candidate code: ").strip()\n\n# Write the validation rules below:\n`,
    solution: `code = input().strip()\n\nif len(code) == 7 and code[:3].isalpha() and code[:3].isupper() and code[3:].isdigit():\n    print("Valid candidate code")\nelse:\n    print("Invalid format")\n`,
    tests: [
      { in: ["LON1234"], out: "Valid candidate code", m: 3 },
      { in: ["lon1234"], out: "Invalid format", m: 1 },
      { in: ["PAR12A4"], out: "Invalid format", m: 1 },
      { in: ["DXB12"], out: "Invalid format", m: 1 },
    ],
  },
  {
    id: "p24_jun_q06",
    unit: "P24",
    unitName: "Edexcel 4CP0/2AW June 2024 Paper 2",
    paperTitle: "June 2024: Paper 2 (4CP0/2AW) Summer Series",
    examBoard: "Pearson Edexcel",
    paper: "Paper 2",
    session: "June",
    year: 2024,
    title: "Q6 Sensor Telemetry Threshold Alarms & Log Exporter",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 15,
    starterFileName: "Q06.py",
    brief:
      "A greenhouse monitor records temperature sensor readings across 4 zones in parallel lists:\n" +
      "zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D']\n" +
      "temperatures = [22.4, 28.1, 18.0, 31.5]\n" +
      "thresholds = [25.0, 26.0, 24.0, 28.0]\n\n" +
      "Write a Python program that:\n" +
      "1. Iterates through the zones and identifies any zone where the temperature exceeds its threshold.\n" +
      "2. For each exceeding zone, displays: 'ALERT: <Zone> exceeds threshold by <difference>C' (rounded to 1 d.p.).\n" +
      "3. If no zones exceed their threshold, displays 'All zones nominal'.\n" +
      "4. Calculates the minimum temperature and corresponding zone name.\n" +
      "5. Writes the alert zones to 'greenhouse_alerts.txt' and outputs 'Alert file generated'.",
    starter: `# Q06 - Greenhouse Sensor Telemetry (15 Marks)\nzones = ['Zone A', 'Zone B', 'Zone C', 'Zone D']\ntemperatures = [22.4, 28.1, 18.0, 31.5]\nthresholds = [25.0, 26.0, 24.0, 28.0]\n\n# Write your solution below:\n`,
    solution: `zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D']\ntemperatures = [22.4, 28.1, 18.0, 31.5]\nthresholds = [25.0, 26.0, 24.0, 28.0]\n\nalerts = []\nfor z, t, th in zip(zones, temperatures, thresholds):\n    if t > th:\n        diff = round(t - th, 1)\n        msg = f"ALERT: {z} exceeds threshold by {diff}C"\n        print(msg)\n        alerts.append(f"{z}: {diff}C over")\n\nif not alerts:\n    print("All zones nominal")\n\nmin_temp = min(temperatures)\nmin_zone = zones[temperatures.index(min_temp)]\nprint(f"Coolest: {min_zone} at {min_temp}C")\n\nwith open("greenhouse_alerts.txt", "w") as f:\n    for a in alerts:\n        f.write(a + "\\n")\nprint("Alert file generated")\n`,
    tests: [
      {
        in: [],
        out: "ALERT: Zone B exceeds threshold by 2.1C\nALERT: Zone D exceeds threshold by 3.5C\nCoolest: Zone C at 18.0C\nAlert file generated",
        m: 15,
      },
    ],
  },
];

/**
 * Returns complete past paper unit structures for all authentic archived series.
 */
export function getArchivedPastPaperUnits(): IGCSEUnit[] {
  return [
    {
      code: "P24",
      title: "June 2024 Paper 2 (4CP0/2AW) - Official Exam & Mark Scheme",
      topicGroup: "Past Examination Papers",
      paper: "Paper 2",
      blurb:
        "Full authentic Pearson Edexcel June 2024 Paper 2: Binary/hexadecimal logic, student candidate ID slicing validator, and greenhouse sensor telemetry monitoring with threshold alert file generation.",
      tasks: EDEXCEL_2024_JUNE_PAPER_TASKS,
    },
    {
      code: "P23N",
      title: "November 2023 Paper 2 (4CP0/2P) - Official Exam & Mark Scheme",
      topicGroup: "Past Examination Papers",
      paper: "Paper 2",
      blurb:
        "Full authentic Pearson Edexcel Autumn / November 2023 Paper 2: Modulo arithmetic, data type classification, Caesar cipher character shift, inventory sentinel while loop, and delivery van mileage tracker with text file report generation.",
      tasks: EDEXCEL_2023_NOV_PAPER_TASKS,
    },
  ];
}
