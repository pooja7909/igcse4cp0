/**
 * Flexible, Method-Agnostic Output Comparator and Anti-Hardcoding Evaluator.
 * Aligned with Pearson Edexcel International GCSE (4CP0) Assessment Principles:
 * - "Any valid method that produces the correct output must be awarded full marks."
 * - Hardcoding static outputs without algorithmic processing of inputs is disallowed.
 */

import { CodeTestCase } from "../types";

export function normalizeText(s: string): string {
  return String(s || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

/**
 * Strips conversational prompts and echoed input prefixes
 * (e.g. "Enter score: 85" -> "85", "Result = Pass" -> "Pass", "Total: 150" -> "150")
 */
export function stripPrompts(s: string): string {
  const norm = normalizeText(s);
  const lines = norm.split("\n");
  const cleanedLines = lines.map((line) => {
    // Matches "Prompt string: <answer>" or "Prompt string? <answer>" or "Label = <answer>"
    const promptMatch = line.match(/^([A-Za-z0-9 _\-\(\)\$#@]+[:?=]\s*)(.+)$/);
    if (promptMatch && promptMatch[2]) {
      return promptMatch[2].trim();
    }
    return line;
  });
  return cleanedLines.join("\n").trim();
}

/**
 * Extracts all integer and floating point numbers from a text string.
 */
export function extractNumbers(s: string): number[] {
  const matches = (s || "").match(/-?\d+(?:\.\d+)?/g);
  if (!matches) return [];
  return matches.map(Number).filter((n) => !isNaN(n));
}

/**
 * Flexible, method-agnostic output comparator.
 * If any method is used (while, for, comprehension, recursion, built-ins)
 * and the calculated answer is correct, it is marked correct.
 */
export function flexibleCompareOutputs(
  actual: string,
  expected: string
): { matches: boolean; reason: string } {
  // If expected is empty or not provided (e.g. stripped for confidentiality), it must never match
  if (expected === undefined || expected === null || String(expected).trim() === "") {
    return { matches: false, reason: "no_expected_output_specified" };
  }

  // If actual program output is completely empty while expected is non-empty, it must not match
  if (actual === undefined || actual === null || String(actual).trim() === "") {
    return { matches: false, reason: "empty_program_output" };
  }

  const actNorm = normalizeText(actual);
  const expNorm = normalizeText(expected);

  // 1. Exact normalized match
  if (actNorm === expNorm) {
    return { matches: true, reason: "exact_match" };
  }

  // 2. Prompt-stripped match (e.g. "Score: Pass" vs "Pass" or "Result: 42" vs "42")
  const actStripped = stripPrompts(actual);
  const expStripped = stripPrompts(expected);
  if (actStripped === expNorm || actStripped === expStripped) {
    return { matches: true, reason: "prompt_stripped_match" };
  }

  // 3. Case-insensitive match (e.g. "pass" vs "Pass", "yes" vs "Yes", "valid" vs "Valid")
  if (actNorm.toLowerCase() === expNorm.toLowerCase()) {
    return { matches: true, reason: "case_insensitive_match" };
  }
  if (actStripped.toLowerCase() === expStripped.toLowerCase()) {
    return { matches: true, reason: "prompt_stripped_case_match" };
  }

  // 4. Numeric tolerance match (e.g. 12.5 vs 12.50, 4.0 vs 4, or 3.1415 vs 3.14 within ±0.02)
  const actNums = extractNumbers(actStripped || actNorm);
  const expNums = extractNumbers(expStripped || expNorm);

  if (expNums.length > 0 && actNums.length === expNums.length) {
    let allNumsMatch = true;
    for (let i = 0; i < expNums.length; i++) {
      const diff = Math.abs(actNums[i] - expNums[i]);
      if (diff > 0.02 && diff / Math.max(0.001, Math.abs(expNums[i])) > 0.01) {
        allNumsMatch = false;
        break;
      }
    }
    if (allNumsMatch) {
      return { matches: true, reason: "numeric_equivalence_match" };
    }
  }

  // If expected is a single number and the student printed it as their final number
  if (expNums.length === 1 && actNums.length > 0) {
    const lastActNum = actNums[actNums.length - 1];
    if (Math.abs(lastActNum - expNums[0]) <= 0.02) {
      return { matches: true, reason: "final_numeric_match" };
    }
  }

  // 5. Line presence match (student prints intermediate info/headers and final answer on last line, or checks sub-outputs)
  const actLines = actNorm.split("\n").map((l) => l.trim()).filter(Boolean);
  const expLines = expNorm.split("\n").map((l) => l.trim()).filter(Boolean);

  if (actLines.length > 0 && expLines.length === 1) {
    const target = expLines[0].toLowerCase().trim();
    const strippedTarget = stripPrompts(expLines[0]).toLowerCase().trim();

    const lastAct = actLines[actLines.length - 1];
    const strippedLastAct = stripPrompts(lastAct);
    if (
      lastAct === expLines[0] ||
      lastAct.toLowerCase() === target ||
      strippedLastAct === expLines[0] ||
      strippedLastAct.toLowerCase() === strippedTarget
    ) {
      return { matches: true, reason: "last_line_match" };
    }

    const anyLineMatch = actLines.some((l) => {
      const low = l.toLowerCase().trim();
      const str = stripPrompts(l).toLowerCase().trim();
      return (
        low === target ||
        str === strippedTarget ||
        low.replace(/\s+/g, " ") === target.replace(/\s+/g, " ") ||
        str.replace(/\s+/g, " ") === strippedTarget.replace(/\s+/g, " ")
      );
    });
    if (anyLineMatch) {
      return { matches: true, reason: "line_presence_match" };
    }
  }

  // 6. Multiline sequence match with flexible whitespace / table padding
  if (actLines.length === expLines.length && expLines.length > 1) {
    let allLinesMatch = true;
    for (let i = 0; i < expLines.length; i++) {
      const a = stripPrompts(actLines[i]).toLowerCase().replace(/\s+/g, " ");
      const e = stripPrompts(expLines[i]).toLowerCase().replace(/\s+/g, " ");
      if (a !== e) {
        allLinesMatch = false;
        break;
      }
    }
    if (allLinesMatch) {
      return { matches: true, reason: "multiline_flexible_match" };
    }
  }

  // 7. Token set match: If expected has specific key answer tokens (e.g. ['Paris', 'France', '250'])
  const expTokens = expNorm.toLowerCase().split(/[\s,;:|]+/).filter(Boolean);
  const actTokens = actNorm.toLowerCase().split(/[\s,;:|]+/).filter(Boolean);
  if (expTokens.length > 0 && expTokens.length <= 4 && actTokens.length >= expTokens.length) {
    let matchedCount = 0;
    for (const t of expTokens) {
      if (actTokens.includes(t)) matchedCount++;
    }
    if (matchedCount === expTokens.length) {
      return { matches: true, reason: "token_inclusion_match" };
    }
  }

  return { matches: false, reason: "mismatch" };
}

/**
 * Checks for hardcoding patterns in student Python code.
 * Rejects solutions that bypass algorithmic logic by statically printing answers.
 */
export function detectAntiHardcoding(
  code: string,
  tests: CodeTestCase[]
): { isHardcoded: boolean; reason?: string } {
  if (!code || !tests || tests.length === 0) {
    return { isHardcoded: false };
  }

  const cleanedCode = code
    .replace(/#.*$/gm, "") // remove comments
    .replace(/'''[\s\S]*?'''/g, "") // remove docstrings
    .replace(/"""[\s\S]*?"""/g, "")
    .trim();

  // Test suite requires stdin inputs
  const testsWithInputs = tests.filter((t) => t.in && t.in.length > 0);
  const distinctOutputs = new Set(tests.map((t) => normalizeText(t.out).toLowerCase())).size;

  if (testsWithInputs.length >= 2 && distinctOutputs >= 2) {
    const hasInputCall = /\binput\s*\(/.test(cleanedCode) || /\bsys\.stdin\b/.test(cleanedCode);
    const hasArgs = /\bdef\s+\w+\s*\([^)]+\)/.test(cleanedCode);

    // If tests require inputs across varying outputs, but student code never calls input()
    if (!hasInputCall && !hasArgs) {
      // Check if they merely have print("...")
      const hasPrint = /\bprint\s*\(/.test(cleanedCode);
      if (hasPrint) {
        return {
          isHardcoded: true,
          reason:
            "Hardcoded output detected: The question requires processing dynamic inputs. Your code must read values using input() rather than printing static values.",
        };
      }
    }
  }

  // Check if code has multiple hardcoded branch lookups explicitly matching test cases
  // e.g. "if x == 'test1_input': print('test1_output') elif x == 'test2_input': print('test2_output')"
  // when the problem expects calculation/logic
  const ifCount = (cleanedCode.match(/\b(if|elif)\b/g) || []).length;
  const printCount = (cleanedCode.match(/\bprint\s*\(/g) || []).length;
  const hasArithmeticOrLoops =
    /[+\-*/%]|(\bfor\b)|(\bwhile\b)|(\bsum\b)|(\blen\b)|(\bappend\b)|(\bint\b)|(\bfloat\b)/.test(
      cleanedCode
    );

  if (tests.length >= 3 && ifCount >= 3 && printCount >= 3 && !hasArithmeticOrLoops) {
    // Count how many test outputs are literally written as string constants in the code
    let literalOutputsCount = 0;
    for (const t of tests) {
      const expStr = normalizeText(t.out).replace(/\n/g, "");
      if (expStr && cleanedCode.includes(expStr)) {
        literalOutputsCount++;
      }
    }
    if (literalOutputsCount >= 3) {
      return {
        isHardcoded: true,
        reason:
          "Hardcoded lookups detected: Solutions must compute answers dynamically using algorithms, variables, and calculations rather than hardcoding static output tables.",
      };
    }
  }

  return { isHardcoded: false };
}

/**
 * Returns pedagogical praise acknowledging the student's specific chosen method.
 */
export function diagnoseMethodUsed(code: string): string {
  const cleaned = code.replace(/#.*$/gm, "");
  const hasWhile = /\bwhile\b/.test(cleaned);
  const hasFor = /\bfor\b/.test(cleaned);
  const hasComp = /\[\s*.+\s+for\s+.+\s+in\s+.+\]/.test(cleaned);
  const hasDef = /\bdef\b/.test(cleaned);
  const hasBuiltin = /\b(sum|max|min|sorted|len)\b/.test(cleaned);

  if (hasComp) {
    return "Method recognized: List comprehension. Valid Pythonic approach accepted.";
  }
  if (hasWhile) {
    return "Method recognized: While loop iteration. Valid algorithmic approach accepted.";
  }
  if (hasFor) {
    return "Method recognized: For loop traversal. Valid algorithmic approach accepted.";
  }
  if (hasDef) {
    return "Method recognized: Modular subprogram definition. Valid design accepted.";
  }
  if (hasBuiltin) {
    return "Method recognized: Python standard built-in functions. Valid computation accepted.";
  }
  return "Method recognized: Direct programmatic calculation. Valid solution accepted.";
}
