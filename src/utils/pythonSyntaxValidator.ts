// Strict Python 3 syntax & indentation validator matching Python IDLE / PEP 8 standards

declare const Sk: any;

export interface SyntaxIssue {
  line: number;
  column?: number;
  type: "IndentationError" | "SyntaxError" | "TabError" | "Warning";
  message: string;
  expectedIndent?: number;
  foundIndent?: number;
}

export interface ValidationResult {
  isValid: boolean;
  issues: SyntaxIssue[];
  primaryError: SyntaxIssue | null;
}

// Block openers that MUST be followed by an indented block and MUST end with ':'
const BLOCK_HEADER_REGEX = /^\s*(def\s+\w+|class\s+\w+|if\b|elif\b|else\s*:|for\b|while\b|try\s*:|except\b|finally\s*:|with\b|async\s+def\b|async\s+for\b|async\s+with\b)/;

// Check if a line is a block header that should end with ':'
const BLOCK_START_KEYWORDS = ["def", "class", "if", "elif", "else", "for", "while", "try", "except", "finally", "with", "async"];

export function validatePythonSyntax(code: string): ValidationResult {
  const issues: SyntaxIssue[] = [];

  // Try Skulpt AST / parser if available in browser
  if (typeof Sk !== "undefined") {
    try {
      // Ensure Python 3 mode is configured for Skulpt
      if (typeof Sk.configure === "function") {
        Sk.configure({ __future__: Sk.python3 });
      }
      // Only invoke parser if code is non-empty and lines don't end on unfinished binary operators like >=
      const trimmedCode = code.trim();
      const lastLine = trimmedCode.split("\n").pop() || "";
      const isFinishingOperator = /[+\-*/%=<>!&|^~,(\[]\s*$/.test(lastLine);

      if (trimmedCode.length > 0 && !isFinishingOperator && typeof Sk.parse === "function") {
        Sk.parse("<stdin>", code);
      }
    } catch (e: any) {
      const parsedIssue = extractSkulptError(e, code);
      if (parsedIssue) {
        issues.push(parsedIssue);
      }
    }
  }

  // Perform strict static AST/lexer indentation checks to catch indentation errors in real-time
  const lines = code.split("\n");
  const indentStack: number[] = [0];
  let previousBlockHeaderLine: { lineNum: number; indent: number; text: string } | null = null;

  // Bracket tracker
  const bracketStack: { char: string; line: number; col: number }[] = [];
  let inTripleSingle = false;
  let inTripleDouble = false;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];

    // Check for mixed tabs
    if (rawLine.includes("\t")) {
      issues.push({
        line: lineNum,
        type: "TabError",
        message: "TabError: Inconsistent use of tabs and spaces in indentation (IDLE uses 4 spaces)",
      });
    }

    // Handle multiline string literals
    const count3Single = (rawLine.match(/'''/g) || []).length;
    const count3Double = (rawLine.match(/"""/g) || []).length;
    if (count3Single % 2 !== 0) inTripleSingle = !inTripleSingle;
    if (count3Double % 2 !== 0) inTripleDouble = !inTripleDouble;

    if (inTripleSingle || inTripleDouble) {
      continue; // Inside multiline docstring, indentation rules relaxed
    }

    // Strip comments for syntax inspection
    const commentIdx = rawLine.indexOf("#");
    const codePart = commentIdx !== -1 ? rawLine.slice(0, commentIdx) : rawLine;

    // Check if line is empty or purely whitespace
    if (codePart.trim().length === 0) {
      continue;
    }

    // Calculate leading indentation (counting tabs as 4 spaces if any)
    let currentIndent = 0;
    for (let c = 0; c < codePart.length; c++) {
      if (codePart[c] === " ") {
        currentIndent += 1;
      } else if (codePart[c] === "\t") {
        currentIndent += 4;
      } else {
        break;
      }
    }

    const trimmed = codePart.trim();

    // Check bracket matching on this line
    let inSingleQuote = false;
    let inDoubleQuote = false;
    for (let c = 0; c < codePart.length; c++) {
      const char = codePart[c];
      const prev = c > 0 ? codePart[c - 1] : "";

      if (char === "'" && prev !== "\\" && !inDoubleQuote) {
        inSingleQuote = !inSingleQuote;
      } else if (char === '"' && prev !== "\\" && !inSingleQuote) {
        inDoubleQuote = !inDoubleQuote;
      } else if (!inSingleQuote && !inDoubleQuote) {
        if (char === "(" || char === "[" || char === "{") {
          bracketStack.push({ char, line: lineNum, col: c + 1 });
        } else if (char === ")" || char === "]" || char === "}") {
          if (bracketStack.length === 0) {
            issues.push({
              line: lineNum,
              column: c + 1,
              type: "SyntaxError",
              message: `SyntaxError: unmatched '${char}'`,
            });
          } else {
            const last = bracketStack.pop()!;
            const expected = last.char === "(" ? ")" : last.char === "[" ? "]" : "}";
            if (char !== expected) {
              issues.push({
                line: lineNum,
                column: c + 1,
                type: "SyntaxError",
                message: `SyntaxError: closing '${char}' does not match '${last.char}' from line ${last.line}`,
              });
            }
          }
        }
      }
    }

    // Check 0: Unterminated string literal on this line (missing closing single or double quotation mark)
    if ((inSingleQuote || inDoubleQuote) && !rawLine.trimEnd().endsWith("\\")) {
      const quoteChar = inDoubleQuote ? '"' : "'";
      issues.push({
        line: lineNum,
        type: "SyntaxError",
        message: `SyntaxError: unterminated string literal (missing closing quotation mark ${quoteChar} on line ${lineNum})`,
      });
    }

    // Check 1: Did the previous statement open a block with ':'?
    if (previousBlockHeaderLine !== null) {
      if (currentIndent <= previousBlockHeaderLine.indent) {
        issues.push({
          line: lineNum,
          column: currentIndent + 1,
          type: "IndentationError",
          message: `IndentationError: expected an indented block after '${previousBlockHeaderLine.text.slice(0, 25)}' statement on line ${previousBlockHeaderLine.lineNum}`,
          expectedIndent: previousBlockHeaderLine.indent + 4,
          foundIndent: currentIndent,
        });
      } else {
        indentStack.push(currentIndent);
      }
      previousBlockHeaderLine = null;
    } else {
      // Line is not immediately following a block header
      const topIndent = indentStack[indentStack.length - 1];

      if (currentIndent > topIndent) {
        issues.push({
          line: lineNum,
          column: currentIndent + 1,
          type: "IndentationError",
          message: `IndentationError: unexpected indent (line ${lineNum} is indented ${currentIndent} spaces, expected ${topIndent})`,
          expectedIndent: topIndent,
          foundIndent: currentIndent,
        });
      } else if (currentIndent < topIndent) {
        // Dedent: must match an existing outer indentation level
        const matchIdx = indentStack.lastIndexOf(currentIndent);
        if (matchIdx === -1) {
          issues.push({
            line: lineNum,
            column: currentIndent + 1,
            type: "IndentationError",
            message: `IndentationError: unindent does not match any outer indentation level (found ${currentIndent} spaces)`,
            foundIndent: currentIndent,
          });
        } else {
          // Valid dedent, pop deeper levels
          indentStack.splice(matchIdx + 1);
        }
      }
    }

    // Check 2: Invalid assignment in condition (e.g. "if i=target:" instead of "==")
    const condMatch = trimmed.match(/^(?:if|elif|while)\s+(.+):$/);
    if (condMatch) {
      const condText = condMatch[1];
      if (/(?<![=!<>])=(?![=])/.test(condText)) {
        issues.push({
          line: lineNum,
          type: "SyntaxError",
          message: `SyntaxError: invalid syntax (assignment '=' used in condition; did you mean '=='?)`,
        });
      }
    }

    // Check 2b: Non-Python or confused relational operators (<>, =>, =<, ≠, ≥, ≤)
    // Enforcing exact Python IDLE specifications (>=, <=, !=)
    if (codePart.includes("<>")) {
      issues.push({
        line: lineNum,
        type: "SyntaxError",
        message: "SyntaxError: '<>' is not supported in Python 3; use '!=' for not-equal (Python IDLE specification)",
      });
    }
    if (/(?<![=<>!])=>/.test(codePart)) {
      issues.push({
        line: lineNum,
        type: "SyntaxError",
        message: "SyntaxError: '=>' is invalid syntax in Python; write '>=' for greater-than-or-equal (Python IDLE specification)",
      });
    }
    if (/(?<![=<>!])=</.test(codePart)) {
      issues.push({
        line: lineNum,
        type: "SyntaxError",
        message: "SyntaxError: '=<' is invalid syntax in Python; write '<=' for less-than-or-equal (Python IDLE specification)",
      });
    }
    if (codePart.includes("≠")) {
      issues.push({
        line: lineNum,
        type: "SyntaxError",
        message: "SyntaxError: invalid character '≠'; in Python IDLE, write '!=' for not-equal",
      });
    }
    if (codePart.includes("≥")) {
      issues.push({
        line: lineNum,
        type: "SyntaxError",
        message: "SyntaxError: invalid character '≥'; in Python IDLE, write '>=' for greater-than-or-equal",
      });
    }
    if (codePart.includes("≤")) {
      issues.push({
        line: lineNum,
        type: "SyntaxError",
        message: "SyntaxError: invalid character '≤'; in Python IDLE, write '<=' for less-than-or-equal",
      });
    }

    // Check 3: Missing colon on block statements
    // e.g. "if x == 5" without colon at end
    const firstWord = trimmed.split(/[\s(:]/)[0];
    if (BLOCK_START_KEYWORDS.includes(firstWord)) {
      if (
        (firstWord === "else" || firstWord === "try" || firstWord === "finally") &&
        !trimmed.endsWith(":")
      ) {
        issues.push({
          line: lineNum,
          type: "SyntaxError",
          message: `SyntaxError: expected ':' after '${firstWord}'`,
        });
      } else if (
        ["if", "elif", "for", "while", "def", "class", "with", "except"].includes(firstWord)
      ) {
        if (!trimmed.endsWith(":")) {
          // Could be multiline condition if bracket is open
          if (bracketStack.length === 0) {
            issues.push({
              line: lineNum,
              type: "SyntaxError",
              message: `SyntaxError: expected ':' at end of '${firstWord}' statement`,
            });
          }
        }
      }
    }

    // Check 4: Does this line end with a colon (new block opener)?
    if (trimmed.endsWith(":")) {
      previousBlockHeaderLine = {
        lineNum,
        indent: currentIndent,
        text: trimmed,
      };
    }
  }

  // Check for trailing block header without any block
  if (previousBlockHeaderLine !== null) {
    issues.push({
      line: previousBlockHeaderLine.lineNum,
      type: "IndentationError",
      message: `IndentationError: expected an indented block after '${previousBlockHeaderLine.text.slice(0, 25)}' statement at end of file`,
      expectedIndent: previousBlockHeaderLine.indent + 4,
    });
  }

  // Check for unclosed brackets at end of file
  if (bracketStack.length > 0) {
    const unclosed = bracketStack[bracketStack.length - 1];
    issues.push({
      line: unclosed.line,
      column: unclosed.col,
      type: "SyntaxError",
      message: `SyntaxError: unclosed '${unclosed.char}' opened on line ${unclosed.line}`,
    });
  }

  // Deduplicate issues by line and type
  const uniqueIssues: SyntaxIssue[] = [];
  const seen = new Set<string>();
  for (const issue of issues) {
    const key = `${issue.line}_${issue.type}_${issue.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueIssues.push(issue);
    }
  }

  // Priority: IndentationError > SyntaxError > TabError > Warning
  const primaryError =
    uniqueIssues.find((i) => i.type === "IndentationError") ||
    uniqueIssues.find((i) => i.type === "SyntaxError") ||
    uniqueIssues.find((i) => i.type === "TabError") ||
    uniqueIssues[0] ||
    null;

  return {
    isValid: uniqueIssues.length === 0,
    issues: uniqueIssues,
    primaryError,
  };
}

function extractSkulptError(e: any, code?: string): SyntaxIssue | null {
  if (!e) return null;
  const raw = String(e.toString ? e.toString() : e);
  const lineMatch = raw.match(/line (\d+)/i) || (e.traceback && e.traceback[0] && [null, e.traceback[0].lineno]);
  const colMatch = raw.match(/col(?:umn)? (\d+)/i);
  const line = lineMatch ? parseInt(lineMatch[1], 10) : 1;
  const column = colMatch ? parseInt(colMatch[1], 10) : undefined;

  let type: SyntaxIssue["type"] = "SyntaxError";
  if (raw.includes("IndentationError")) type = "IndentationError";
  else if (raw.includes("TabError")) type = "TabError";

  let message = raw.replace(/^<stdin>:\s*/, "").replace(/^.*Error:\s*/, `${type}: `);

  // Translate cryptic Skulpt "bad input on line X" into clear Python syntax error
  if (message.includes("bad input") && code) {
    const lines = code.split("\n");
    const targetLine = lines[line - 1] || "";
    const doubleQuotes = (targetLine.match(/"/g) || []).length;
    const singleQuotes = (targetLine.match(/'/g) || []).length;

    if (targetLine.includes("<>")) {
      message = `SyntaxError: invalid syntax ('<>' is not supported in Python 3; write '!=' for not-equal as per Python IDLE specifications)`;
    } else if (/(?<![=<>!])=>/.test(targetLine)) {
      message = `SyntaxError: invalid syntax ('=>' is not a valid operator; write '>=' for greater-than-or-equal in Python IDLE)`;
    } else if (/(?<![=<>!])=</.test(targetLine)) {
      message = `SyntaxError: invalid syntax ('=<' is not a valid operator; write '<=' for less-than-or-equal in Python IDLE)`;
    } else if (targetLine.includes("≠")) {
      message = `SyntaxError: invalid character '≠' (in Python IDLE, write '!=' for not-equal)`;
    } else if (targetLine.includes("≥")) {
      message = `SyntaxError: invalid character '≥' (in Python IDLE, write '>=' for greater-than-or-equal)`;
    } else if (targetLine.includes("≤")) {
      message = `SyntaxError: invalid character '≤' (in Python IDLE, write '<=' for less-than-or-equal)`;
    } else if (doubleQuotes % 2 !== 0) {
      message = `SyntaxError: unterminated string literal (missing closing quote " on line ${line})`;
    } else if (singleQuotes % 2 !== 0) {
      message = `SyntaxError: unterminated string literal (missing closing quote ' on line ${line})`;
    } else if (/(?:if|elif|while)\s+[^:]*[^=!<>]=([^=][^:]*)?:/.test(targetLine)) {
      message = `SyntaxError: invalid syntax (assignment '=' used in condition; did you mean '=='?)`;
    } else {
      message = `SyntaxError: invalid syntax on line ${line}`;
    }
  }

  return {
    line,
    column,
    type,
    message,
  };
}

/**
 * Re-indents Python code to follow strict 4-space indentation (PEP 8 / IDLE standard).
 */
export function formatPythonIndentation(code: string): string {
  const lines = code.split("\n");
  const result: string[] = [];
  let currentIndentLevel = 0;
  const indentStep = "    "; // 4 spaces

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (trimmed.length === 0) {
      result.push("");
      continue;
    }

    // Dedent keywords that close blocks on their own line
    if (/^(elif\b|else:|except\b|finally:)/.test(trimmed)) {
      currentIndentLevel = Math.max(0, currentIndentLevel - 1);
    }

    const newLine = indentStep.repeat(currentIndentLevel) + trimmed;
    result.push(newLine);

    // If this line ended with a colon, the next line should be indented +1 level
    if (trimmed.endsWith(":")) {
      currentIndentLevel += 1;
      // Check if subsequent lines have an indented body
      let hasSubsequentBody = false;
      for (let j = i + 1; j < lines.length; j++) {
        const nextTrimmed = lines[j].trim();
        if (nextTrimmed.length > 0) {
          // If the next non-empty line isn't an unindented statement, it might be the body
          hasSubsequentBody = true;
          break;
        }
      }
      if (!hasSubsequentBody) {
        result.push(indentStep.repeat(currentIndentLevel) + "pass");
      }
    }
  }

  return result.join("\n");
}
