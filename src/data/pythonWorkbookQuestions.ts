import { IGCSETask, IGCSEUnit } from "../types";

export const PYTHON_WORKBOOK_TASKS: IGCSETask[] = [
  // Chapter 1: Introduction to Programming
  {
    id: "wb_ex01",
    unit: "U01",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 1: Mailing Address",
    level: "Starter",
    type: "code",
    brief: "Create a program that displays your name and complete mailing address formatted in the manner that you would usually see it on the outside of an envelope. Your program does not need to read any input from the user.",
    marks: 4,
    hint: "Use multiple print() statements or newline characters (\\n) in a single print statement to display the address on separate lines.",
    starter: "# Write a program that displays a complete mailing address\n\n",
    solution: `## Display a person's complete mailing address.
print("Ben Stephenson")
print("Department of Computer Science")
print("University of Calgary")
print("2500 University Drive NW")
print("Calgary, Alberta T2N 1N4")
print("Canada")
`,
    tests: [
      {
        in: [],
        out: "Ben Stephenson\nDepartment of Computer Science\nUniversity of Calgary\n2500 University Drive NW\nCalgary, Alberta T2N 1N4\nCanada",
        m: 4,
      },
    ],
  },
  {
    id: "wb_ex02",
    unit: "U02",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 2: Hello User",
    level: "Starter",
    type: "code",
    brief: "Write a program that asks the user to enter his or her name. The program should respond with a message that says hello to the user, using his or her name (e.g., 'Hello Alice').",
    marks: 4,
    hint: "Use the input() function to read the user's name and string concatenation or an f-string to display the greeting.",
    starter: "# Read the user's name and say hello\nname = input(\"Enter your name: \")\n",
    solution: `name = input("Enter your name: ")
print("Hello " + name)
`,
    tests: [
      { in: ["Alice"], out: "Hello Alice", m: 2 },
      { in: ["Bob"], out: "Hello Bob", m: 2 },
    ],
  },
  {
    id: "wb_ex03",
    unit: "U02",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 3: Area of a Room",
    level: "Starter",
    type: "code",
    brief: "Write a program that asks the user to enter the width and length of a room as floating point numbers. Once the values have been read, your program should compute and display the area of the room.",
    marks: 5,
    hint: "Remember to convert the input to float with float(input(...)). Multiply length and width to get the area.",
    starter: "# Compute the area of a room\nlength = float(input(\"Enter length: \"))\nwidth = float(input(\"Enter width: \"))\n",
    solution: `length = float(input("Enter length: "))
width = float(input("Enter width: "))
area = length * width
print("The area of the room is", area, "square meters")
`,
    tests: [
      { in: ["5.0", "4.0"], out: "20.0", m: 3 },
      { in: ["3.5", "2.0"], out: "7.0", m: 2 },
    ],
  },
  {
    id: "wb_ex04",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 4: Area of a Field in Acres",
    level: "Core",
    type: "code",
    brief: "Create a program that reads the length and width of a farmer's field from the user in feet. Display the area of the field in acres. (Hint: There are 43,560 square feet in an acre).",
    marks: 5,
    hint: "Compute the total square feet as length * width, then divide by 43560 to find acres.",
    starter: "SQFT_PER_ACRE = 43560\nlength = float(input(\"Enter length in feet: \"))\nwidth = float(input(\"Enter width in feet: \"))\n",
    solution: `SQFT_PER_ACRE = 43560
length = float(input("Enter length in feet: "))
width = float(input("Enter width in feet: "))
acres = (length * width) / SQFT_PER_ACRE
print("The area of the field is", acres, "acres")
`,
    tests: [
      { in: ["43560", "1"], out: "1.0", m: 3 },
      { in: ["87120", "2"], out: "4.0", m: 2 },
    ],
  },
  {
    id: "wb_ex05",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 5: Bottle Deposits Refund",
    level: "Core",
    type: "code",
    brief: "Drink containers holding 1 liter or less have a $0.10 deposit, and containers holding more than 1 liter have a $0.25 deposit. Read the number of each size from the user and display the total refund formatted with two decimal places ($%.2f).",
    marks: 5,
    hint: "Read two integers. Multiply small containers by 0.10 and large containers by 0.25, then format with $%.2f.",
    starter: "# Read small and large container counts\nless = int(input(\"Number of containers 1L or less: \"))\nmore = int(input(\"Number of containers more than 1L: \"))\n",
    solution: `LESS_DEPOSIT = 0.10
MORE_DEPOSIT = 0.25
less = int(input("Number of containers 1L or less: "))
more = int(input("Number of containers more than 1L: "))
refund = less * LESS_DEPOSIT + more * MORE_DEPOSIT
print("Your total refund will be $%.2f." % refund)
`,
    tests: [
      { in: ["10", "4"], out: "$2.00", m: 3 },
      { in: ["3", "5"], out: "$1.55", m: 2 },
    ],
  },
  {
    id: "wb_ex06",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 6: Tax and Tip Calculator",
    level: "Core",
    type: "code",
    brief: "Read the cost of a meal ordered at a restaurant from the user. Compute tax at 5% and tip as 18% of the meal amount (without tax). Display the tax, tip, and grand total, each formatted with two decimal places.",
    marks: 6,
    hint: "Tax is cost * 0.05. Tip is cost * 0.18. Grand total is cost + tax + tip.",
    starter: "meal_cost = float(input(\"Enter meal cost: \"))\n",
    solution: `TAX_RATE = 0.05
TIP_RATE = 0.18
cost = float(input("Enter meal cost: "))
tax = cost * TAX_RATE
tip = cost * TIP_RATE
total = cost + tax + tip
print("Tax: $%.2f" % tax)
print("Tip: $%.2f" % tip)
print("Total: $%.2f" % total)
`,
    tests: [
      { in: ["100.00"], out: "Tax: $5.00\nTip: $18.00\nTotal: $123.00", m: 3 },
      { in: ["50.00"], out: "Tax: $2.50\nTip: $9.00\nTotal: $61.50", m: 3 },
    ],
  },
  {
    id: "wb_ex07",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 7: Sum of First n Positive Integers",
    level: "Starter",
    type: "code",
    brief: "Write a program that reads a positive integer, n, from the user and then displays the sum of all integers from 1 to n using Gauss's formula: sum = (n * (n + 1)) // 2.",
    marks: 4,
    hint: "Use integer division // so the result is a clean integer.",
    starter: "n = int(input(\"Enter n: \"))\n",
    solution: `n = int(input("Enter n: "))
sm = n * (n + 1) // 2
print("The sum of the first", n, "positive integers is", sm)
`,
    tests: [
      { in: ["10"], out: "55", m: 2 },
      { in: ["100"], out: "5050", m: 2 },
    ],
  },
  {
    id: "wb_ex10",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 10: Arithmetic Operations",
    level: "Core",
    type: "code",
    brief: "Read two integers a and b from the user. Display: sum, difference (a - b), product, quotient (a / b), remainder (a % b), and exponentiation (a ** b).",
    marks: 6,
    hint: "Use operators +, -, *, /, %, and **.",
    starter: "a = int(input(\"Enter a: \"))\nb = int(input(\"Enter b: \"))\n",
    solution: `a = int(input("Enter a: "))
b = int(input("Enter b: "))
print("Sum:", a + b)
print("Difference:", a - b)
print("Product:", a * b)
print("Quotient:", a / b)
print("Remainder:", a % b)
print("Power:", a ** b)
`,
    tests: [
      { in: ["10", "3"], out: "Sum: 13\nDifference: 7\nProduct: 30\nQuotient: 3.3333333333333335\nRemainder: 1\nPower: 1000", m: 6 },
    ],
  },
  {
    id: "wb_ex13",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 13: Making Change Algorithm",
    level: "Exam-style",
    type: "code",
    brief: "Read a number of cents from the user as an integer. Compute and display the minimum coin denominations to give change using toonies (200c), loonies (100c), quarters (25c), dimes (10c), nickels (5c), and pennies (1c).",
    marks: 8,
    hint: "Use integer division (//) to get the coin count and modulus (%) to get remaining cents at each coin denomination.",
    starter: "cents = int(input(\"Enter number of cents: \"))\n",
    solution: `cents = int(input("Enter number of cents: "))
print(cents // 200, "toonies")
cents = cents % 200
print(cents // 100, "loonies")
cents = cents % 100
print(cents // 25, "quarters")
cents = cents % 25
print(cents // 10, "dimes")
cents = cents % 10
print(cents // 5, "nickels")
cents = cents % 5
print(cents, "pennies")
`,
    tests: [
      { in: ["389"], out: "1 toonies\n1 loonies\n3 quarters\n1 dimes\n0 nickels\n4 pennies", m: 4 },
      { in: ["45"], out: "0 toonies\n0 loonies\n1 quarters\n2 dimes\n0 nickels\n0 pennies", m: 4 },
    ],
  },
  {
    id: "wb_ex14",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 14: Height Units to Centimeters",
    level: "Core",
    type: "code",
    brief: "Read a number of feet from the user followed by a number of inches. Compute and display the equivalent number of centimeters. (1 foot = 12 inches, 1 inch = 2.54 cm).",
    marks: 5,
    hint: "Convert feet to inches by multiplying by 12, add inches, then multiply total inches by 2.54.",
    starter: "feet = int(input(\"Feet: \"))\ninches = int(input(\"Inches: \"))\n",
    solution: `IN_PER_FT = 12
CM_PER_IN = 2.54
feet = int(input("Feet: "))
inches = int(input("Inches: "))
cm = (feet * IN_PER_FT + inches) * CM_PER_IN
print("Your height in centimeters is:", cm)
`,
    tests: [
      { in: ["5", "10"], out: "177.8", m: 3 },
      { in: ["6", "0"], out: "182.88", m: 2 },
    ],
  },
  {
    id: "wb_ex25",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 25: Units of Time (Seconds to D:HH:MM:SS)",
    level: "Exam-style",
    type: "code",
    brief: "Read a number of seconds from the user. Display the equivalent duration formatted as D:HH:MM:SS with leading zeroes where appropriate.",
    marks: 7,
    hint: "Days = seconds // 86400. Then seconds %= 86400. Hours = seconds // 3600. Then seconds %= 3600. Minutes = seconds // 60. Remaining are seconds.",
    starter: "seconds = int(input(\"Enter seconds: \"))\n",
    solution: `SECONDS_PER_DAY = 86400
SECONDS_PER_HOUR = 3600
SECONDS_PER_MINUTE = 60

seconds = int(input("Enter seconds: "))
days = seconds // SECONDS_PER_DAY
seconds = seconds % SECONDS_PER_DAY
hours = seconds // SECONDS_PER_HOUR
seconds = seconds % SECONDS_PER_HOUR
minutes = seconds // SECONDS_PER_MINUTE
seconds = seconds % SECONDS_PER_MINUTE

print("%d:%02d:%02d:%02d" % (days, hours, minutes, seconds))
`,
    tests: [
      { in: ["90061"], out: "1:01:01:01", m: 4 },
      { in: ["3665"], out: "0:01:01:05", m: 3 },
    ],
  },
  {
    id: "wb_ex32",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 32: Sort 3 Integers Without Loops",
    level: "Core",
    type: "code",
    brief: "Read three integers from the user and display them in sorted order (smallest to largest). You can use conditionals (if/else), comparisons, or built-in functions like min()/max() if you know them.",
    marks: 6,
    hint: "You can arrange them using if statements, or using min() and max() if you have learned them.",
    starter: "a = int(input(\"Enter first: \"))\nb = int(input(\"Enter second: \"))\nc = int(input(\"Enter third: \"))\n",
    solution: `a = int(input("Enter first: "))
b = int(input("Enter second: "))
c = int(input("Enter third: "))

mn = min(a, b, c)
mx = max(a, b, c)
md = a + b + c - mn - mx

print(mn, md, mx)
`,
    tests: [
      { in: ["42", "15", "88"], out: "15 42 88", m: 3 },
      { in: ["9", "-3", "4"], out: "-3 4 9", m: 3 },
    ],
  },
  {
    id: "wb_ex33",
    unit: "U03",
    unitName: "The Python Workbook - Ch 1",
    title: "Workbook Ex 33: Day Old Bread Discount",
    level: "Core",
    type: "code",
    brief: "A bakery sells fresh loaves for $3.49 each. Day-old bread has a 60% discount. Read the number of loaves purchased, and display regular price, discount amount, and total price formatted to 2 decimal places.",
    marks: 6,
    hint: "regular = num * 3.49, discount = regular * 0.60, total = regular - discount.",
    starter: "num_loaves = int(input(\"Number of loaves: \"))\n",
    solution: `BREAD_PRICE = 3.49
DISCOUNT_RATE = 0.60
num_loaves = int(input("Number of loaves: "))
regular_price = num_loaves * BREAD_PRICE
discount = regular_price * DISCOUNT_RATE
total = regular_price - discount
print("Regular price: $%.2f" % regular_price)
print("Discount:      $%.2f" % discount)
print("Total:         $%.2f" % total)
`,
    tests: [
      { in: ["10"], out: "Regular price: $34.90\nDiscount:      $20.94\nTotal:         $13.96", m: 6 },
    ],
  },

  // Chapter 2: If Statement Exercises
  {
    id: "wb_ex34",
    unit: "U04",
    unitName: "The Python Workbook - Ch 2",
    title: "Workbook Ex 34: Even or Odd?",
    level: "Starter",
    type: "code",
    brief: "Write a program that reads an integer from the user. Display a message indicating whether the integer is 'even' or 'odd'.",
    marks: 4,
    hint: "Use the modulus operator: if num % 2 == 0 it is even, otherwise odd.",
    starter: "num = int(input(\"Enter an integer: \"))\n",
    solution: `num = int(input("Enter an integer: "))
if num % 2 == 0:
    print("even")
else:
    print("odd")
`,
    tests: [
      { in: ["42"], out: "even", m: 2 },
      { in: ["17"], out: "odd", m: 2 },
    ],
  },
  {
    id: "wb_ex36",
    unit: "U04",
    unitName: "The Python Workbook - Ch 2",
    title: "Workbook Ex 36: Vowel or Consonant",
    level: "Core",
    type: "code",
    brief: "Read a letter of the alphabet. If a, e, i, o, or u, report that it is a vowel. If y, report that 'sometimes y is a vowel, and sometimes y is a consonant'. Otherwise report consonant.",
    marks: 5,
    hint: "Convert input to lowercase with .lower() before checking membership in 'aeiou'.",
    starter: "letter = input(\"Enter a letter: \").lower()\n",
    solution: `letter = input("Enter a letter: ").lower()
if letter in "aeiou":
    print("vowel")
elif letter == "y":
    print("sometimes vowel, sometimes consonant")
else:
    print("consonant")
`,
    tests: [
      { in: ["a"], out: "vowel", m: 2 },
      { in: ["y"], out: "sometimes vowel, sometimes consonant", m: 2 },
      { in: ["k"], out: "consonant", m: 1 },
    ],
  },
  {
    id: "wb_ex37",
    unit: "U04",
    unitName: "The Python Workbook - Ch 2",
    title: "Workbook Ex 37: Name that Shape (Sides 3-10)",
    level: "Core",
    type: "code",
    brief: "Read the number of sides (3 to 10) from the user and report the name of the polygon: 3=triangle, 4=quadrilateral, 5=pentagon, 6=hexagon, 7=heptagon, 8=octagon, 9=nonagon, 10=decagon. If outside this range, report 'Error'.",
    marks: 6,
    hint: "Use an if-elif-else chain to map side counts to shape names.",
    starter: "nsides = int(input(\"Enter number of sides: \"))\n",
    solution: `nsides = int(input("Enter number of sides: "))
shapes = {
    3: "triangle", 4: "quadrilateral", 5: "pentagon",
    6: "hexagon", 7: "heptagon", 8: "octagon",
    9: "nonagon", 10: "decagon"
}
if nsides in shapes:
    print("That's a", shapes[nsides])
else:
    print("Error")
`,
    tests: [
      { in: ["3"], out: "triangle", m: 2 },
      { in: ["8"], out: "octagon", m: 2 },
      { in: ["12"], out: "Error", m: 2 },
    ],
  },
  {
    id: "wb_ex40",
    unit: "U04",
    unitName: "The Python Workbook - Ch 2",
    title: "Workbook Ex 40: Name that Triangle",
    level: "Core",
    type: "code",
    brief: "Read the lengths of 3 sides of a triangle from the user. Display whether it is 'equilateral' (all 3 sides equal), 'isosceles' (exactly 2 sides equal), or 'scalene' (all 3 sides different).",
    marks: 6,
    hint: "Compare s1 == s2 == s3 first. Next check if s1 == s2 or s2 == s3 or s1 == s3.",
    starter: "s1 = float(input(\"Side 1: \"))\ns2 = float(input(\"Side 2: \"))\ns3 = float(input(\"Side 3: \"))\n",
    solution: `s1 = float(input("Side 1: "))
s2 = float(input("Side 2: "))
s3 = float(input("Side 3: "))

if s1 == s2 == s3:
    print("equilateral")
elif s1 == s2 or s2 == s3 or s1 == s3:
    print("isosceles")
else:
    print("scalene")
`,
    tests: [
      { in: ["5", "5", "5"], out: "equilateral", m: 2 },
      { in: ["5", "5", "8"], out: "isosceles", m: 2 },
      { in: ["3", "4", "5"], out: "scalene", m: 2 },
    ],
  },
  {
    id: "wb_ex57",
    unit: "U04",
    unitName: "The Python Workbook - Ch 2",
    title: "Workbook Ex 57: Is it a Leap Year?",
    level: "Core",
    type: "code",
    brief: "Read a year from the user and display whether or not it is a leap year. Rules: Divisible by 400 is leap; of remaining, divisible by 100 is NOT leap; of remaining, divisible by 4 IS leap; else not.",
    marks: 6,
    hint: "Use modulo 400, 100, and 4 in the correct precedence order.",
    starter: "year = int(input(\"Enter year: \"))\n",
    solution: `year = int(input("Enter year: "))
if year % 400 == 0:
    is_leap = True
elif year % 100 == 0:
    is_leap = False
elif year % 4 == 0:
    is_leap = True
else:
    is_leap = False

if is_leap:
    print("leap year")
else:
    print("not a leap year")
`,
    tests: [
      { in: ["2000"], out: "leap year", m: 2 },
      { in: ["1900"], out: "not a leap year", m: 2 },
      { in: ["2024"], out: "leap year", m: 2 },
    ],
  },

  // Chapter 3: Loop Exercises
  {
    id: "wb_ex64",
    unit: "U06",
    unitName: "The Python Workbook - Ch 3",
    title: "Workbook Ex 64: No More Pennies (Nickel Rounding)",
    level: "Exam-style",
    type: "code",
    brief: "Read item prices until a blank line is entered. Print the exact total on one line, and the rounded cash payment on the second line (rounded to nearest 5 cents: remainder < 2.5 rounds down, >= 2.5 rounds up).",
    marks: 8,
    hint: "Convert cash total into cents (* 100), check remainder when divided by 5, then round accordingly.",
    starter: "total = 0.0\nline = input(\"Enter price: \")\n",
    solution: `total = 0.0
line = input("Enter price: ")
while line != "":
    total += float(line)
    line = input("Enter price: ")

pennies = round(total * 100)
remainder = pennies % 5
if remainder < 2.5:
    cash_cents = pennies - remainder
else:
    cash_cents = pennies + (5 - remainder)

print("Exact: $%.2f" % total)
print("Cash:  $%.2f" % (cash_cents / 100))
`,
    tests: [
      { in: ["1.22", "3.45", ""], out: "Exact: $4.67\nCash:  $4.65", m: 4 },
      { in: ["2.99", "1.99", ""], out: "Exact: $4.98\nCash:  $5.00", m: 4 },
    ],
  },
  {
    id: "wb_ex68",
    unit: "U06",
    unitName: "The Python Workbook - Ch 3",
    title: "Workbook Ex 68: Parity Bits Validator",
    level: "Core",
    type: "code",
    brief: "Read strings containing 8 bits (0s and 1s) until a blank line is entered. For each 8-bit string, compute and display whether the even parity bit should be 0 or 1. If length != 8, display 'Error'.",
    marks: 7,
    hint: "Count the number of '1' bits using .count('1'). For even parity, if ones count is even, parity bit is 0, else 1.",
    starter: "line = input(\"Enter 8 bits: \")\n",
    solution: `line = input("Enter 8 bits: ")
while line != "":
    if len(line) != 8 or line.count("0") + line.count("1") != 8:
        print("Error")
    else:
        ones = line.count("1")
        if ones % 2 == 0:
            print("Parity bit: 0")
        else:
            print("Parity bit: 1")
    line = input("Enter 8 bits: ")
`,
    tests: [
      { in: ["00101101", "11111111", ""], out: "Parity bit: 0\nParity bit: 0", m: 4 },
      { in: ["00000001", ""], out: "Parity bit: 1", m: 3 },
    ],
  },
  {
    id: "wb_ex70",
    unit: "U07",
    unitName: "The Python Workbook - Ch 3",
    title: "Workbook Ex 70: Caesar Cipher",
    level: "Exam-style",
    type: "code",
    brief: "Implement a Caesar cipher. Read a message string and an integer shift amount. Shift letters while preserving case (wrapping around A-Z and a-z). Leave non-letters unchanged. Display shifted message.",
    marks: 8,
    hint: "Use ord(ch) and chr() with modulus 26: (ord(ch) - ord('a') + shift) % 26 + ord('a').",
    starter: "message = input(\"Enter message: \")\nshift = int(input(\"Enter shift: \"))\n",
    solution: `message = input("Enter message: ")
shift = int(input("Enter shift: "))
result = ""
for ch in message:
    if ch.islower():
        result += chr((ord(ch) - ord('a') + shift) % 26 + ord('a'))
    elif ch.isupper():
        result += chr((ord(ch) - ord('A') + shift) % 26 + ord('A'))
    else:
        result += ch
print(result)
`,
    tests: [
      { in: ["Hello, World!", "3"], out: "Khoor, Zruog!", m: 4 },
      { in: ["Khoor, Zruog!", "-3"], out: "Hello, World!", m: 4 },
    ],
  },
  {
    id: "wb_ex72",
    unit: "U07",
    unitName: "The Python Workbook - Ch 3",
    title: "Workbook Ex 72: Is a String a Palindrome?",
    level: "Core",
    type: "code",
    brief: "Read a string from the user and determine whether or not it is a palindrome (reads identical forward and backward, e.g. 'anna', 'civic', 'level'). Print 'palindrome' or 'not palindrome'.",
    marks: 5,
    hint: "Compare the string with its reverse (s[::-1]) or use a two-pointer loop checking characters from both ends.",
    starter: "s = input(\"Enter string: \")\n",
    solution: `s = input("Enter string: ")
is_pal = True
for i in range(len(s) // 2):
    if s[i] != s[len(s) - 1 - i]:
        is_pal = False
        break
if is_pal:
    print("palindrome")
else:
    print("not palindrome")
`,
    tests: [
      { in: ["racecar"], out: "palindrome", m: 2 },
      { in: ["python"], out: "not palindrome", m: 2 },
      { in: ["level"], out: "palindrome", m: 1 },
    ],
  },
  {
    id: "wb_ex75",
    unit: "U06",
    unitName: "The Python Workbook - Ch 3",
    title: "Workbook Ex 75: Greatest Common Divisor (GCD)",
    level: "Core",
    type: "code",
    brief: "Read two positive integers n and m. Find and report their greatest common divisor (the largest number that divides evenly into both).",
    marks: 6,
    hint: "Start d at min(n, m). While n % d != 0 or m % d != 0, decrease d by 1.",
    starter: "n = int(input(\"Enter n: \"))\nm = int(input(\"Enter m: \"))\n",
    solution: `n = int(input("Enter n: "))
m = int(input("Enter m: "))
d = min(n, m)
while n % d != 0 or m % d != 0:
    d -= 1
print("GCD:", d)
`,
    tests: [
      { in: ["12", "18"], out: "GCD: 6", m: 3 },
      { in: ["25", "10"], out: "GCD: 5", m: 3 },
    ],
  },
  {
    id: "wb_ex78",
    unit: "U06",
    unitName: "The Python Workbook - Ch 3",
    title: "Workbook Ex 78: Decimal to Binary Algorithm",
    level: "Core",
    type: "code",
    brief: "Read a decimal number (base 10 integer) from the user. Convert it to binary using the repeated division by 2 algorithm and display the binary string.",
    marks: 6,
    hint: "Keep dividing q // 2 and prepending remainder q % 2 to result string until q == 0.",
    starter: "q = int(input(\"Enter decimal integer: \"))\n",
    solution: `num = int(input("Enter decimal integer: "))
if num == 0:
    result = "0"
else:
    result = ""
    q = num
    while q > 0:
        r = q % 2
        result = str(r) + result
        q = q // 2
print(result)
`,
    tests: [
      { in: ["13"], out: "1101", m: 3 },
      { in: ["42"], out: "101010", m: 3 },
    ],
  },

  // Chapter 4: Function Exercises
  {
    id: "wb_ex84",
    unit: "U09",
    unitName: "The Python Workbook - Ch 4",
    title: "Workbook Ex 84: Median of Three Values Function",
    level: "Core",
    type: "code",
    brief: "Write a function named median(a, b, c) that takes three numbers and returns the median (middle) value. Include a demonstration that reads three numbers and prints the result.",
    marks: 6,
    hint: "You can find the middle value using if/elif comparisons, or using (a + b + c) - min(a, b, c) - max(a, b, c) if you have learned min/max.",
    starter: "def median(a, b, c):\n    # Return middle value\n    pass\n",
    solution: `def median(a, b, c):
    return a + b + c - min(a, b, c) - max(a, b, c)

x = float(input())
y = float(input())
z = float(input())
print(median(x, y, z))
`,
    tests: [
      { in: ["10", "30", "20"], out: "20.0", m: 3 },
      { in: ["5", "1", "9"], out: "5.0", m: 3 },
    ],
  },
  {
    id: "wb_ex89",
    unit: "U09",
    unitName: "The Python Workbook - Ch 4",
    title: "Workbook Ex 89: Capitalize It Function",
    level: "Exam-style",
    type: "code",
    brief: "Write a function capitalize(s) that capitalizes: (1) standalone lowercase 'i' surrounded by spaces, (2) the first character in the string, and (3) the first letter following a '.', '!', or '?'.",
    marks: 8,
    hint: "You can replace ' i ' with ' I ', then scan characters maintaining a flag for capitalizing after terminal punctuation.",
    starter: "def capitalize(s):\n    # Return string with proper capitalization\n    pass\n",
    solution: `def capitalize(s):
    s = s.replace(" i ", " I ")
    chars = list(s)
    cap_next = True
    for i in range(len(chars)):
        if cap_next and chars[i].isalpha():
            chars[i] = chars[i].upper()
            cap_next = False
        elif chars[i] in ".!?":
            cap_next = True
    return "".join(chars)

txt = input()
print(capitalize(txt))
`,
    tests: [
      { in: ["what time do i have to be there? what is the address?"], out: "What time do I have to be there? What is the address?", m: 4 },
      { in: ["hello world. i am here!"], out: "Hello world. I am here!", m: 4 },
    ],
  },
  {
    id: "wb_ex92",
    unit: "U09",
    unitName: "The Python Workbook - Ch 4",
    title: "Workbook Ex 92: Is a Number Prime?",
    level: "Core",
    type: "code",
    brief: "Write a function isPrime(n) returning True if n > 1 is prime, and False otherwise. Read an integer from the user and display whether it is prime.",
    marks: 6,
    hint: "If n <= 1 return False. Check potential divisors from 2 up to int(n**0.5) + 1.",
    starter: "def isPrime(n):\n    # Return True if prime\n    pass\n",
    solution: `def isPrime(n):
    if n <= 1:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

val = int(input())
print(isPrime(val))
`,
    tests: [
      { in: ["17"], out: "True", m: 3 },
      { in: ["24"], out: "False", m: 3 },
    ],
  },
  {
    id: "wb_ex96",
    unit: "U09",
    unitName: "The Python Workbook - Ch 4",
    title: "Workbook Ex 96: Password Strength Validator",
    level: "Core",
    type: "code",
    brief: "Write a function checkPassword(p) that returns True if the password is at least 8 characters long, contains at least one uppercase letter, at least one lowercase letter, and at least one digit. Otherwise False.",
    marks: 6,
    hint: "Check len(p) >= 8 and any(c.isupper() for c in p) and any(c.islower() for c in p) and any(c.isdigit() for c in p).",
    starter: "def checkPassword(p):\n    # Return True if password meets all 4 rules\n    pass\n",
    solution: `def checkPassword(p):
    if len(p) < 8:
        return False
    has_upper = any(c.isupper() for c in p)
    has_lower = any(c.islower() for c in p)
    has_digit = any(c.isdigit() for c in p)
    return has_upper and has_lower and has_digit

pwd = input()
print(checkPassword(pwd))
`,
    tests: [
      { in: ["Secret123"], out: "True", m: 3 },
      { in: ["weakpwd"], out: "False", m: 3 },
    ],
  },
  {
    id: "wb_ex101",
    unit: "U09",
    unitName: "The Python Workbook - Ch 4",
    title: "Workbook Ex 101: Reduce Fraction to Lowest Terms",
    level: "Core",
    type: "code",
    brief: "Write a function reduce(num, den) that computes the greatest common divisor of num and den, and returns both the reduced numerator and denominator.",
    marks: 6,
    hint: "Find GCD using Euclid's algorithm: while b != 0: a, b = b, a % b. Divide num and den by GCD.",
    starter: "def reduce(num, den):\n    # Return reduced (num, den)\n    pass\n",
    solution: `import math

def reduce(num, den):
    g = math.gcd(num, den)
    return num // g, den // g

n = int(input())
d = int(input())
rn, rd = reduce(n, d)
print(f"{rn}/{rd}")
`,
    tests: [
      { in: ["6", "63"], out: "2/21", m: 3 },
      { in: ["12", "16"], out: "3/4", m: 3 },
    ],
  },

  // Chapter 5: List Exercises
  {
    id: "wb_ex104",
    unit: "U08",
    unitName: "The Python Workbook - Ch 5",
    title: "Workbook Ex 104: Sorted Order Until 0",
    level: "Core",
    type: "code",
    brief: "Read integers from the user until 0 is entered. Store them in a list, sort them from smallest to largest, and print each number on its own line (excluding the sentinel 0).",
    marks: 6,
    hint: "Use .append() inside a while loop, then call .sort() or sorted().",
    starter: "numbers = []\nnum = int(input())\n",
    solution: `numbers = []
num = int(input())
while num != 0:
    numbers.append(num)
    num = int(input())

numbers.sort()
for n in numbers:
    print(n)
`,
    tests: [
      { in: ["4", "1", "9", "2", "0"], out: "1\n2\n4\n9", m: 6 },
    ],
  },
  {
    id: "wb_ex107",
    unit: "U08",
    unitName: "The Python Workbook - Ch 5",
    title: "Workbook Ex 107: Avoiding Duplicates",
    level: "Core",
    type: "code",
    brief: "Read words from the user until a blank line is entered. Display each word entered exactly once, in the same order they were first entered.",
    marks: 6,
    hint: "Only append the word to the list if it is not already in the list: if word not in seen: seen.append(word).",
    starter: "words = []\nline = input()\n",
    solution: `words = []
line = input()
while line != "":
    if line not in words:
        words.append(line)
    line = input()

for w in words:
    print(w)
`,
    tests: [
      { in: ["first", "second", "first", "third", "second", ""], out: "first\nsecond\nthird", m: 6 },
    ],
  },
  {
    id: "wb_ex108",
    unit: "U08",
    unitName: "The Python Workbook - Ch 5",
    title: "Workbook Ex 108: Negatives, Zeros, and Positives",
    level: "Core",
    type: "code",
    brief: "Read integers until a blank line is entered. Display all negative numbers, followed by all zeros, followed by all positive numbers, maintaining the order they were entered within each category.",
    marks: 6,
    hint: "Maintain three separate lists: negatives, zeros, positives, then print each list in sequence.",
    starter: "negs = []\nzeros = []\npos = []\n",
    solution: `negs = []
zeros = []
pos = []
line = input()
while line != "":
    n = int(line)
    if n < 0:
        negs.append(n)
    elif n == 0:
        zeros.append(n)
    else:
        pos.append(n)
    line = input()

for val in negs + zeros + pos:
    print(val)
`,
    tests: [
      { in: ["3", "-4", "1", "0", "-1", "0", "-2", ""], out: "-4\n-1\n-2\n0\n0\n3\n1", m: 6 },
    ],
  },
  {
    id: "wb_ex113",
    unit: "U08",
    unitName: "The Python Workbook - Ch 5",
    title: "Workbook Ex 113: Formatting a List in English",
    level: "Core",
    type: "code",
    brief: "Write a function formatList(items) that returns a string formatted with commas and 'and' before the last item (e.g. ['apples', 'oranges', 'bananas'] -> 'apples, oranges and bananas'). Return '<empty>' if list has 0 items.",
    marks: 6,
    hint: "Handle lengths 0, 1, and >1 as special cases.",
    starter: "def formatList(items):\n    # Return formatted English string\n    pass\n",
    solution: `def formatList(items):
    if len(items) == 0:
        return "<empty>"
    if len(items) == 1:
        return str(items[0])
    return ", ".join(str(x) for x in items[:-1]) + " and " + str(items[-1])

items = []
line = input()
while line != "":
    items.append(line)
    line = input()
print(formatList(items))
`,
    tests: [
      { in: ["apples", "oranges", "bananas", ""], out: "apples, oranges and bananas", m: 3 },
      { in: ["apples", "oranges", ""], out: "apples and oranges", m: 3 },
    ],
  },

  // Chapter 6: Dictionary Exercises
  {
    id: "wb_ex128",
    unit: "U08",
    unitName: "The Python Workbook - Ch 6",
    title: "Workbook Ex 128: Dictionary Reverse Lookup",
    level: "Core",
    type: "code",
    brief: "Write a function reverseLookup(d, val) that finds and returns a list of all keys in dictionary d that map to value val.",
    marks: 6,
    hint: "Loop over d.items() and append k whenever v == val.",
    starter: "def reverseLookup(d, val):\n    # Return list of keys matching val\n    pass\n",
    solution: `def reverseLookup(d, val):
    return [k for k, v in d.items() if v == val]

sample = {"apple": "fruit", "banana": "fruit", "carrot": "vegetable"}
target = input()
keys = reverseLookup(sample, target)
print(sorted(keys))
`,
    tests: [
      { in: ["fruit"], out: "['apple', 'banana']", m: 3 },
      { in: ["vegetable"], out: "['carrot']", m: 3 },
    ],
  },
  {
    id: "wb_ex135",
    unit: "U08",
    unitName: "The Python Workbook - Ch 6",
    title: "Workbook Ex 135: Anagram Checker",
    level: "Core",
    type: "code",
    brief: "Two words are anagrams if they contain all of the same letters in a different order (e.g., 'evil' and 'live'). Read two strings and print 'anagram' or 'not anagram'.",
    marks: 6,
    hint: "You can compare sorted(s1.lower()) == sorted(s2.lower()) or count character frequencies in a dictionary.",
    starter: "s1 = input(\"First word: \")\ns2 = input(\"Second word: \")\n",
    solution: `s1 = input("First word: ")
s2 = input("Second word: ")

if sorted(s1.lower()) == sorted(s2.lower()):
    print("anagram")
else:
    print("not anagram")
`,
    tests: [
      { in: ["evil", "live"], out: "anagram", m: 3 },
      { in: ["cat", "dog"], out: "not anagram", m: 3 },
    ],
  },
  {
    id: "wb_ex137",
    unit: "U08",
    unitName: "The Python Workbook - Ch 6",
    title: "Workbook Ex 137: Scrabble Score Calculator",
    level: "Core",
    type: "code",
    brief: "Compute and display the Scrabble score for a word read from the user. 1pt: AEILNORSTU, 2pt: DG, 3pt: BCMP, 4pt: FHVWY, 5pt: K, 8pt: JX, 10pt: QZ.",
    marks: 6,
    hint: "Build a lookup dictionary mapping each uppercase letter to its points, then sum for each character in word.upper().",
    starter: "word = input(\"Enter word: \").upper()\n",
    solution: `points = {
    'A': 1, 'E': 1, 'I': 1, 'L': 1, 'N': 1, 'O': 1, 'R': 1, 'S': 1, 'T': 1, 'U': 1,
    'D': 2, 'G': 2,
    'B': 3, 'C': 3, 'M': 3, 'P': 3,
    'F': 4, 'H': 4, 'V': 4, 'W': 4, 'Y': 4,
    'K': 5,
    'J': 8, 'X': 8,
    'Q': 10, 'Z': 10
}
word = input("Enter word: ").upper()
score = sum(points.get(ch, 0) for ch in word)
print(score)
`,
    tests: [
      { in: ["QUIZ"], out: "22", m: 3 },
      { in: ["PYTHON"], out: "14", m: 3 },
    ],
  },

  // Chapter 8: Recursion Exercises
  {
    id: "wb_ex165",
    unit: "U09",
    unitName: "The Python Workbook - Ch 8",
    title: "Workbook Ex 165: Recursive Euclid GCD",
    level: "Exam-style",
    type: "code",
    brief: "Implement Euclid's recursive algorithm for the greatest common divisor of a and b: if b == 0 return a, else return gcd(b, a % b).",
    marks: 6,
    hint: "Define gcd(a, b): if b == 0: return a; else: return gcd(b, a % b).",
    starter: "def gcd(a, b):\n    # Recursive Euclid GCD\n    pass\n",
    solution: `def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

a = int(input())
b = int(input())
print(gcd(a, b))
`,
    tests: [
      { in: ["48", "18"], out: "6", m: 3 },
      { in: ["101", "10"], out: "1", m: 3 },
    ],
  },
  {
    id: "wb_ex167",
    unit: "U09",
    unitName: "The Python Workbook - Ch 8",
    title: "Workbook Ex 167: Recursive Palindrome",
    level: "Exam-style",
    type: "code",
    brief: "Write a recursive function isPalindrome(s) returning True if s is a palindrome, False otherwise. Base cases: len(s) <= 1 is True. Recursive step: s[0] == s[-1] and isPalindrome(s[1:-1]).",
    marks: 6,
    hint: "No loops are allowed; use recursive slicing.",
    starter: "def isPalindrome(s):\n    # Recursive palindrome checker\n    pass\n",
    solution: `def isPalindrome(s):
    if len(s) <= 1:
        return True
    if s[0] != s[-1]:
        return False
    return isPalindrome(s[1:-1])

txt = input()
print(isPalindrome(txt))
`,
    tests: [
      { in: ["hannah"], out: "True", m: 3 },
      { in: ["algorithm"], out: "False", m: 3 },
    ],
  },
  {
    id: "wb_ex174",
    unit: "U09",
    unitName: "The Python Workbook - Ch 8",
    title: "Workbook Ex 174: Run-Length Encoding",
    level: "Exam-style",
    type: "code",
    brief: "Write a function rle(s) that performs run-length encoding on a string, replacing runs of repeated characters with the count followed by character (e.g. 'AAAAABBB' -> '5A3B').",
    marks: 8,
    hint: "Identify the prefix of identical characters, count how long it is, and recurse on the remainder of the string.",
    starter: "def rle(s):\n    # Run-length encode string s\n    pass\n",
    solution: `def rle(s):
    if not s:
        return ""
    idx = 0
    while idx < len(s) and s[idx] == s[0]:
        idx += 1
    return str(idx) + s[0] + rle(s[idx:])

txt = input()
print(rle(txt))
`,
    tests: [
      { in: ["AAAAABBBCC"], out: "5A3B2C", m: 4 },
      { in: ["WWWWWWWWWWWWBWWWWWWWWWWWWBBB"], out: "12W1B12W3B", m: 4 },
    ],
  },
];

/**
 * Dedicated Python Workbook Unit
 */
export const PYTHON_WORKBOOK_UNIT: IGCSEUnit = {
  code: "U33",
  title: "The Python Workbook (Ben Stephenson Exercises & Solutions)",
  spec: "Paper 2 Practical Programming & Computational Thinking",
  blurb: "174 core exercises and official solutions from 'The Python Workbook' covering variables, arithmetic, conditions, loops, subprograms, lists, dictionaries, and recursion.",
  topicGroup: "The Python Workbook (Exercises & Solutions)",
  paper: "Paper 2",
  tasks: PYTHON_WORKBOOK_TASKS,
};
