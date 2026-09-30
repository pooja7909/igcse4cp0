import { IGCSETask, MarkResult, MCQQuestion, InspectQuestion, TableCell, TableColumn, TheoryQuestion } from "../types";
import { runPython, normalizeOutput } from "./pythonRunner";
import {
  flexibleCompareOutputs,
  detectAntiHardcoding,
  diagnoseMethodUsed,
} from "./flexibleGrader";

function normalizeStringAnswer(s: string | number | null | undefined): string {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^[#\s]+/, "")
    .replace(/[.\u2019']+$/, "")
    .replace(/^["'\u201c]+|["'\u201d]+$/g, "");
}

function cellMatches(given: string | undefined, expected: string | number): boolean {
  const g = normalizeStringAnswer(given);
  return String(expected)
    .split("|")
    .some((alt) => normalizeStringAnswer(alt) === g);
}

function normalizeList(s: string): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[\[\]()"']/g, "")
    .split(/[,\s]+/)
    .filter(Boolean)
    .join(",");
}

/**
 * Checks if code is empty, whitespace-only, or identical to starter code (ignoring comments/whitespace)
 */
function isEffectivelyEmptyOrUnmodified(code: string, starter: string): boolean {
  if (!code || typeof code !== "string" || !code.trim()) return true;
  const strip = (s: string) => s.replace(/#.*$/gm, "").replace(/\s+/g, "").trim();
  const strippedCode = strip(code);
  const strippedStarter = strip(starter || "");
  if (!strippedCode) return true;
  if (strippedStarter && strippedCode === strippedStarter) return true;
  return false;
}

/**
 * Generates specific, diagnostic feedback based directly on the student's written code or answers.
 */
function diagnoseCodeFeedback(
  code: string,
  testResults: Array<{
    testIndex: number;
    inputs: string[];
    expected: string;
    actual: string;
    error: string | null;
    marks: number;
    maxMarks: number;
    passed: boolean;
  }>,
  earnedMarks: number,
  maxMarks: number
): string {
  const allPassed = testResults.every((t) => t.passed);
  if (allPassed) {
    // Recognize specific good practices in student's code
    const hasGte = code.includes(">=");
    const hasLte = code.includes("<=");
    const hasLoop = /\b(for|while)\b/.test(code);
    const hasDef = /\bdef\b/.test(code);

    let specificPraise = "All automated test cases passed.";
    if (hasGte) specificPraise = "Correctly handled all boundary comparisons (>=) and branch logic.";
    else if (hasLte) specificPraise = "Properly evaluated lower boundary comparisons (<=) and selection statements.";
    else if (hasLoop) specificPraise = "Correctly implemented iterative loop control and boundary termination.";
    else if (hasDef) specificPraise = "Cleanly structured subprogram function with correct return values.";

    return `Full marks (${earnedMarks}/${maxMarks})! ${specificPraise} Output matches Pearson Edexcel specification.`;
  }

  // Find first failing test
  const fail = testResults.find((t) => !t.passed);
  if (!fail) return `Earned ${earnedMarks} of ${maxMarks} marks.`;

  // 1. Runtime Error in student's code
  if (fail.error) {
    if (fail.error.includes("IndentationError")) {
      return `IndentationError: Python IDLE requires a uniform 4-space indent under block statements (after ':'). Review indentation around your selection or loop body.`;
    }
    if (fail.error.includes("SyntaxError")) {
      if (code.includes("<>")) {
        return `SyntaxError: '<>' is not supported in Python 3. Write '!=' for not-equal, exactly as specified in Python IDLE.`;
      }
      if (/(?<![=<>!])=>/.test(code)) {
        return `SyntaxError: '=>' is invalid syntax. Write '>=' for greater-than-or-equal, exactly as specified in Python IDLE.`;
      }
      if (/(?<![=<>!])=</.test(code)) {
        return `SyntaxError: '=<' is invalid syntax. Write '<=' for less-than-or-equal, exactly as specified in Python IDLE.`;
      }
      if (code.includes("≠") || code.includes("≥") || code.includes("≤")) {
        return `SyntaxError (Mathematical Symbol): Symbols like '≠', '≥', and '≤' are not valid Python ASCII operators. In Python IDLE, write '!=' for not-equal, '>=' for greater-than-or-equal, and '<=' for less-than-or-equal.`;
      }
      return `SyntaxError in your code: ${fail.error.replace(/Error: /g, "")}. Check for missing colons (:), unclosed parentheses, or quotes.`;
    }
    if (fail.error.includes("NameError")) {
      const match = fail.error.match(/name '(\w+)' is not defined/);
      const varName = match ? `'${match[1]}'` : "a variable";
      return `NameError: You referenced ${varName} before assigning it. Verify your variable names and spelling.`;
    }
    if (fail.error.includes("ValueError")) {
      return `ValueError during execution: Check your input conversions (e.g. int() or float()). Your program crashed when processing input ${JSON.stringify(fail.inputs)}.`;
    }
    if (fail.error.includes("IndexError")) {
      return `IndexError: Your code attempted to access a list or string index out of range. Check string slice or list indices.`;
    }
    return `Runtime Error on test ${fail.testIndex} (Input: ${JSON.stringify(fail.inputs)}): ${fail.error}`;
  }

  const actNorm = normalizeOutput(fail.actual);
  const expNorm = normalizeOutput(fail.expected);

  // 2. Case sensitivity error (e.g. 'pass' vs 'Pass')
  if (actNorm.toLowerCase() === expNorm.toLowerCase() && actNorm !== expNorm) {
    return `Case Sensitivity Mismatch on input ${JSON.stringify(fail.inputs)}: Your program printed '${actNorm}', but Pearson 4CP0 requires exact case '${expNorm}'. In Python, string comparisons are case-sensitive.`;
  }

  // 3. Boundary comparison check (e.g. >= vs > or <= vs <)
  // Check if student used '>' instead of '>='
  const codeHasGt = code.includes(">") && !code.includes(">=");
  const codeHasLt = code.includes("<") && !code.includes("<=");
  if (codeHasGt && (actNorm === "Fail" || expNorm === "Pass")) {
    return `Boundary Condition Issue on input ${JSON.stringify(fail.inputs)}: Your code printed '${actNorm}' instead of '${expNorm}'. You used strict inequality (>) instead of greater-than-or-equal (>=). Remember that a threshold like 50 is inclusive, so you must write '>= 50'.`;
  }
  if (codeHasLt && (actNorm === "Fail" || expNorm === "Pass")) {
    return `Boundary Condition Issue on input ${JSON.stringify(fail.inputs)}: Your code printed '${actNorm}' instead of '${expNorm}'. Check your comparison operator; you may need '<=' rather than '<'.`;
  }

  // 4. Extra input prompt or formatting in output
  if (actNorm.includes(":") && !expNorm.includes(":")) {
    return `Formatting Notice: Your program output includes prompt text ('${actNorm}') alongside the calculated result. Expected pure output '${expNorm}'. Ensure only the requested result is printed.`;
  }

  // 5. General logic discrepancy based on what student printed
  if (!actNorm) {
    return `Empty Output on test ${fail.testIndex} with input ${JSON.stringify(fail.inputs)}: Your program terminated without printing the expected result '${expNorm}'. Did you include print()?`;
  }

  return `Logic Flaw on test case ${fail.testIndex} (Input: ${JSON.stringify(fail.inputs)}): Your program outputted '${actNorm}', but the specification expects '${expNorm}'. Review your conditional branches or calculation.`;
}

export async function autoMarkTask(task: IGCSETask, answer: any): Promise<MarkResult> {
  const maxMarks = task.marks || 1;

  // 1. Python Code question
  if (task.type === "code") {
    const code = typeof answer === "string" ? answer.trim() : "";
    const starter = typeof task.starter === "string" ? task.starter.trim() : "";

    // If candidate wrote nothing, or submitted effectively unmodified starter code
    if (isEffectivelyEmptyOrUnmodified(code, starter)) {
      return {
        m: 0,
        M: maxMarks,
        passed: false,
        detail: [],
        feedback: !code ? `No code submitted (0/${maxMarks} marks).` : `Starter code was not modified (0/${maxMarks} marks).`,
      };
    }

    if (!task.tests || task.tests.length === 0) {
      return { m: 0, M: maxMarks, passed: false, detail: [] };
    }

    // Check for hardcoded shortcuts
    const hardcodeCheck = detectAntiHardcoding(code, task.tests);

    let earnedMarks = 0;
    const testResults = [];

    for (let i = 0; i < task.tests.length; i++) {
      const tc = task.tests[i];
      const res = await runPython(code, tc.in || []);
      const cmp = !res.err && flexibleCompareOutputs(res.out, tc.out);
      const passed = Boolean(cmp && cmp.matches);
      const m = passed ? tc.m || 1 : 0;
      earnedMarks += m;
      testResults.push({
        testIndex: i + 1,
        inputs: tc.in || [],
        expected: tc.out,
        actual: res.out,
        error: res.err,
        marks: m,
        maxMarks: tc.m || 1,
        passed,
        matchReason: cmp ? cmp.reason : "error",
      });
    }

    if (hardcodeCheck.isHardcoded) {
      return {
        m: 0,
        M: maxMarks,
        passed: false,
        detail: testResults,
        feedback: `Anti-Hardcoding Guard (0/${maxMarks} marks): ${hardcodeCheck.reason}`,
      };
    }

    const allPassed = testResults.every((t) => t.passed);
    let feedbackText = diagnoseCodeFeedback(code, testResults, earnedMarks, maxMarks);
    if (allPassed) {
      const methodNote = diagnoseMethodUsed(code);
      feedbackText += ` [${methodNote}]`;
    }

    return {
      m: Math.min(maxMarks, earnedMarks),
      M: maxMarks,
      passed: allPassed,
      detail: testResults,
      feedback: feedbackText,
    };
  }

  // 2. Multiple Choice (MCQ)
  if (task.type === "mcq") {
    const rawAnswers = Array.isArray(answer)
      ? answer
      : answer !== null && answer !== undefined && answer !== ""
      ? [answer]
      : [];

    const parseAnswerIndex = (val: any): number | null => {
      if (val === null || val === undefined || val === "") return null;
      if (typeof val === "number" && !isNaN(val)) return val;
      if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed === "") return null;
        if (/^-?\d+$/.test(trimmed)) {
          const num = Number(trimmed);
          if (!isNaN(num)) return num;
        }
      }
      return null;
    };

    const answersArr: (number | null)[] = rawAnswers.map(parseAnswerIndex);
    const questions = ((task.questions || (task as any).mcqs || []) as MCQQuestion[]);
    
    // Strict guard: If no selection was made at all, award 0 marks
    if (
      answersArr.length === 0 ||
      answersArr.every((ans) => ans === null)
    ) {
      return {
        m: 0,
        M: maxMarks,
        passed: false,
        detail: [],
        feedback: `No option selected (0/${maxMarks} marks).`,
      };
    }

    let earned = 0;
    const feedbackItems: string[] = [];

    const detail = questions.map((q, idx) => {
      let chosenIdx = answersArr[idx] ?? null;
      const options: string[] = (q as any).options || (q as any).o || [];
      let isCorrect = chosenIdx !== null && chosenIdx === q.a;

      // Handle string answer matching option text
      if (!isCorrect && typeof answer === "string" && answer.trim().length > 0) {
        const cleanAns = answer.trim().toLowerCase();
        if (options[q.a] && options[q.a].trim().toLowerCase() === cleanAns) {
          isCorrect = true;
          chosenIdx = q.a;
        } else if (cleanAns.length === 1 && cleanAns >= "a" && cleanAns <= "z") {
          const letterIdx = cleanAns.charCodeAt(0) - 97;
          if (letterIdx === q.a) {
            isCorrect = true;
            chosenIdx = q.a;
          }
        }
      }

      if (isCorrect) {
        earned += 1;
      } else {
        const chosenText = chosenIdx !== null && chosenIdx !== undefined && options[chosenIdx] ? `"${options[chosenIdx]}"` : "no selection";
        const correctText = options[q.a] || `Option ${q.a + 1}`;
        const explanation = (q as any).why ? ` (${(q as any).why})` : "";
        feedbackItems.push(`Q${idx + 1}: You chose ${chosenText}. Correct is "${correctText}"${explanation}`);
      }
      return {
        questionIndex: idx,
        chosen: chosenIdx,
        correct: q.a,
        passed: isCorrect,
      };
    });

    const isFull = earned === maxMarks;
    let feedback = "";
    if (isFull) {
      feedback = `Excellent! All ${questions.length} questions answered correctly (${earned}/${maxMarks} marks).`;
    } else if (feedbackItems.length > 0) {
      feedback = feedbackItems.slice(0, 2).join("; ");
      if (feedbackItems.length > 2) feedback += `; and ${feedbackItems.length - 2} other correction(s).`;
    } else {
      feedback = `Scored ${earned} of ${maxMarks} marks.`;
    }

    return {
      m: earned,
      M: maxMarks,
      passed: isFull,
      detail,
      feedback,
    };
  }

  // 3. Trace / Data Table
  if (task.type === "table") {
    const rows = (task.rows || []) as TableCell[][];
    const studentTable = Array.isArray(answer) ? answer : [];
    
    // Strict guard: Check if candidate entered any values into fillable cells
    let enteredFillableValues = false;
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r] || [];
      for (let c = 0; c < row.length; c++) {
        const cell = row[c];
        if (cell && !cell.g) {
          const studentVal = (studentTable[r] || [])[c];
          if (studentVal !== undefined && studentVal !== null && String(studentVal).trim() !== "") {
            enteredFillableValues = true;
            break;
          }
        }
      }
      if (enteredFillableValues) break;
    }

    if (!enteredFillableValues) {
      return {
        m: 0,
        M: maxMarks,
        passed: false,
        detail: [],
        feedback: `No values entered in trace table (0/${maxMarks} marks).`,
      };
    }

    let earned = 0;
    let totalMarkableCells = 0;
    const errorsList: string[] = [];

    const colHeaders: string[] = (task.columns || (task as any).cols || []).map((c: any) => (typeof c === "string" ? c : c?.label || ""));

    const detail = rows.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (cell.g) return null; // Given cell, no marks
        totalMarkableCells++;
        const studentVal = (studentTable[rIdx] || [])[cIdx];
        const ok = cellMatches(studentVal, cell.v);
        if (ok) {
          earned++;
        } else {
          const colName = colHeaders[cIdx] || `Col ${cIdx + 1}`;
          if (errorsList.length < 3) {
            errorsList.push(`Row ${rIdx + 1} (${colName}): entered "${studentVal ?? ""}" vs expected "${cell.v}"`);
          }
        }
        return {
          row: rIdx,
          col: cIdx,
          given: studentVal,
          expected: cell.v,
          passed: ok,
        };
      })
    );

    const m = maxMarks > 0 && totalMarkableCells > 0 ? Math.round((earned / totalMarkableCells) * maxMarks) : earned;
    const isFull = earned === totalMarkableCells && totalMarkableCells > 0;
    let feedback = "";
    if (isFull) {
      feedback = `Perfect trace table (${m}/${maxMarks} marks)! All variable states tracked accurately across loop iterations.`;
    } else if (errorsList.length > 0) {
      feedback = `Trace discrepancy (${m}/${maxMarks} marks): ${errorsList.join("; ")}. Check variable updates per iteration.`;
    } else {
      feedback = `Table score: ${earned} of ${totalMarkableCells} cells correct (${m}/${maxMarks} marks).`;
    }

    return {
      m,
      M: maxMarks,
      passed: isFull,
      detail,
      feedback,
    };
  }

  // 4. Code Inspection / Exact Short Answer
  if (task.type === "inspect") {
    const studentAnswers = Array.isArray(answer)
      ? answer
      : answer !== null && answer !== undefined && String(answer).trim() !== ""
      ? [answer]
      : [];
    
    // Strict guard: If no answers were provided, award 0 marks
    const hasValues = studentAnswers.some((a: any) => a !== undefined && a !== null && String(a).trim() !== "");
    if (!hasValues) {
      return {
        m: 0,
        M: maxMarks,
        passed: false,
        detail: [],
        feedback: `No inspection answers entered (0/${maxMarks} marks).`,
      };
    }

    const questions = (task.questions || []) as InspectQuestion[];
    let earned = 0;
    const feedbackItems: string[] = [];

    const detail = questions.map((q, idx) => {
      const studentVal = normalizeStringAnswer(studentAnswers[idx]);
      const ok = q.a.some((acc) => normalizeStringAnswer(acc) === studentVal);
      if (ok) {
        earned++;
      } else {
        const studentDisp = studentAnswers[idx] ? `"${studentAnswers[idx]}"` : "blank";
        const correctDisp = q.a.length === 1 ? `"${q.a[0]}"` : `one of [${q.a.join(", ")}]`;
        feedbackItems.push(`Part ${idx + 1}: You wrote ${studentDisp}, expected ${correctDisp}${q.why ? ` (${q.why})` : ""}`);
      }
      return {
        questionIndex: idx,
        studentAnswer: studentAnswers[idx] || "",
        accepted: q.a,
        passed: ok,
        why: q.why,
      };
    });

    const isFull = earned === maxMarks;
    let feedback = "";
    if (isFull) {
      feedback = `All ${questions.length} parts identified correctly (${earned}/${maxMarks} marks)!`;
    } else if (feedbackItems.length > 0) {
      feedback = feedbackItems.join("; ");
    } else {
      feedback = `Identified ${earned} of ${maxMarks} correctly.`;
    }

    return {
      m: earned,
      M: maxMarks,
      passed: isFull,
      detail,
      feedback,
    };
  }

  // 5. Sorting pass-by-pass
  if (task.type === "sort") {
    const studentRows = Array.isArray(answer) ? answer : [];
    
    // Strict guard: If no sort entries were made, award 0 marks
    const hasValues = studentRows.some((row: any) =>
      Array.isArray(row) && row.some((c: any) => c !== undefined && c !== null && String(c).trim() !== "")
    );
    if (!hasValues) {
      return {
        m: 0,
        M: maxMarks,
        passed: false,
        detail: [],
        feedback: `No sort trace steps entered (0/${maxMarks} marks).`,
      };
    }

    const expectedRows = (task.rows || []) as string[][];
    let earned = 0;
    let totalBoxes = 0;
    const errorsList: string[] = [];

    const detail = expectedRows.map((row, rIdx) =>
      row.map((expectedCell, cIdx) => {
        totalBoxes++;
        const studentCell = (studentRows[rIdx] || [])[cIdx] || "";
        const ok = normalizeList(studentCell) === normalizeList(expectedCell);
        if (ok) {
          earned++;
        } else {
          if (errorsList.length < 2) {
            errorsList.push(`Pass ${rIdx + 1}, Pos ${cIdx + 1}: entered "${studentCell}" vs expected "${expectedCell}"`);
          }
        }
        return {
          row: rIdx,
          col: cIdx,
          student: studentCell,
          expected: expectedCell,
          passed: ok,
        };
      })
    );

    const isFull = earned === totalBoxes;
    let feedback = "";
    if (isFull) {
      feedback = `Flawless sort trace (${earned}/${totalBoxes} passes correct)!`;
    } else if (errorsList.length > 0) {
      feedback = `Sorting error: ${errorsList.join("; ")}. Ensure pairwise comparisons and swap logic are followed.`;
    } else {
      feedback = `Sort dry-run: ${earned} of ${totalBoxes} passes correct.`;
    }

    return {
      m: earned,
      M: maxMarks,
      passed: isFull,
      detail,
      feedback,
    };
  }

  // 6. Theory / Free response
  if (task.type === "theory") {
    const questions = (task.questions || []) as TheoryQuestion[];
    let studentTexts: string[] = [];
    if (Array.isArray(answer)) {
      studentTexts = answer.map((a: any) => String(a ?? "").trim());
    } else if (typeof answer === "object" && answer !== null) {
      studentTexts = Object.values(answer).map((a: any) => String(a ?? "").trim());
    } else {
      studentTexts = [String(answer ?? "").trim()];
    }

    const hasAnyText = studentTexts.some((t) => t.length > 0);
    // Strict guard: If candidate entered no response, award 0 marks immediately
    if (!hasAnyText) {
      return {
        m: 0,
        M: maxMarks,
        passed: false,
        detail: [],
        feedback: `No response submitted (0/${maxMarks} marks).`,
      };
    }

    const rawStudentText = studentTexts.filter(Boolean).join("\n");
    let earned = 0;

    // Check with server if available, or keyword heuristic
    try {
      const response = await fetch("/api/mark-written", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[0]?.q || task.brief,
          studentAnswer: rawStudentText,
          markScheme: (questions[0]?.criteria || []).join("; ") || task.markScheme || task.hint || "",
          maxMarks: maxMarks,
          markPoints: task.markPoints || undefined,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return {
          m: data.awardedMarks ?? 0,
          M: maxMarks,
          passed: (data.awardedMarks ?? 0) >= maxMarks * 0.7,
          feedback: data.feedback,
          detail: data.breakdown,
          breakdown: data.breakdown,
        };
      }
    } catch (e) {
      // Fallback to keyword matching
    }

    // Heuristic keyword matching with student-based feedback
    const keywords = (questions[0]?.keywords || (task as any).keywords || []).map((k: string) => k.toLowerCase());
    const text = normalizeStringAnswer(rawStudentText);
    const matchedKws: string[] = [];
    const missingKws: string[] = [];

    for (const kw of keywords) {
      if (text.includes(kw)) {
        matchedKws.push(kw);
      } else {
        missingKws.push(kw);
      }
    }

    // Only award marks if keywords actually match! Never default to 0.5!
    const ratio = keywords.length > 0 && matchedKws.length > 0
      ? Math.min(1, matchedKws.length / Math.max(1, Math.ceil(keywords.length / 2)))
      : 0;
    earned = Math.round(ratio * maxMarks);

    let feedback = "";
    if (matchedKws.length > 0 && missingKws.length > 0) {
      feedback = `Marked based on your response (${earned}/${maxMarks}m): You correctly mentioned [${matchedKws.slice(0, 3).join(", ")}]. To gain full marks, incorporate key concepts like [${missingKws.slice(0, 2).join(", ")}].`;
    } else if (matchedKws.length > 0) {
      feedback = `Excellent answer (${earned}/${maxMarks}m): You accurately identified all core 4CP0 mark scheme concepts: [${matchedKws.join(", ")}].`;
    } else if (!rawStudentText.trim()) {
      feedback = `No response submitted (0/${maxMarks}m). Expected concepts from syllabus: [${keywords.slice(0, 3).join(", ")}].`;
    } else {
      feedback = `Reviewed your answer (${earned}/${maxMarks}m): Needs stronger technical precision. Consider explaining: [${keywords.slice(0, 3).join(", ")}].`;
    }

    return {
      m: earned,
      M: maxMarks,
      passed: earned >= maxMarks * 0.7,
      feedback,
    };
  }

  return { m: 0, M: maxMarks, passed: false };
}
