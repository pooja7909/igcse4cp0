// Python syntax highlighter replicating Python IDLE color archetypes
// Supports both IDLE Classic (clean light) and IDLE Dark (modern deep slate)

export interface HighlightToken {
  type: "keyword" | "builtin" | "string" | "comment" | "number" | "boolean" | "defname" | "operator" | "punctuation" | "text";
  text: string;
}

const PYTHON_KEYWORDS = new Set([
  "def", "class", "if", "elif", "else", "while", "for", "in", "return",
  "import", "from", "as", "try", "except", "finally", "raise", "with",
  "pass", "break", "continue", "lambda", "yield", "global", "nonlocal",
  "assert", "del", "and", "or", "not", "is", "async", "await",
]);

const PYTHON_BUILTINS = new Set([
  "print", "input", "int", "str", "float", "bool", "len", "range",
  "list", "dict", "set", "tuple", "sum", "max", "min", "abs", "round",
  "type", "sorted", "open", "enumerate", "zip", "map", "filter",
  "any", "all", "chr", "ord", "bin", "hex", "oct", "pow", "format",
]);

const PYTHON_CONSTANTS = new Set(["True", "False", "None"]);

export function tokenizePythonLine(line: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  let i = 0;
  const len = line.length;

  while (i < len) {
    // 1. Whitespace
    if (/\s/.test(line[i])) {
      let ws = "";
      while (i < len && /\s/.test(line[i])) {
        ws += line[i];
        i++;
      }
      tokens.push({ type: "text", text: ws });
      continue;
    }

    // 2. Comment: # to end of line
    if (line[i] === "#") {
      tokens.push({ type: "comment", text: line.slice(i) });
      break;
    }

    // 3. String literals (Triple-quoted or Single/Double)
    if (line.slice(i, i + 3) === '"""' || line.slice(i, i + 3) === "'''") {
      const q = line.slice(i, i + 3);
      let str = q;
      i += 3;
      while (i < len) {
        if (line.slice(i, i + 3) === q) {
          str += q;
          i += 3;
          break;
        }
        str += line[i];
        i++;
      }
      tokens.push({ type: "string", text: str });
      continue;
    }

    if (line[i] === '"' || line[i] === "'") {
      const q = line[i];
      let str = q;
      i++;
      while (i < len) {
        const ch = line[i];
        str += ch;
        if (ch === q && line[i - 1] !== "\\") {
          i++;
          break;
        }
        i++;
      }
      tokens.push({ type: "string", text: str });
      continue;
    }

    // 4. f-strings or r-strings: f"...", r"..."
    if ((line[i] === "f" || line[i] === "F" || line[i] === "r" || line[i] === "R") && (line[i + 1] === '"' || line[i + 1] === "'")) {
      const prefix = line[i];
      const q = line[i + 1];
      let str = prefix + q;
      i += 2;
      while (i < len) {
        const ch = line[i];
        str += ch;
        if (ch === q && line[i - 1] !== "\\") {
          i++;
          break;
        }
        i++;
      }
      tokens.push({ type: "string", text: str });
      continue;
    }

    // 5. Numbers
    if (/[0-9]/.test(line[i])) {
      let num = "";
      while (i < len && /[0-9.eE_]/.test(line[i])) {
        num += line[i];
        i++;
      }
      tokens.push({ type: "number", text: num });
      continue;
    }

    // 6. Identifiers / Words
    if (/[a-zA-Z_]/.test(line[i])) {
      let word = "";
      while (i < len && /[a-zA-Z0-9_]/.test(line[i])) {
        word += line[i];
        i++;
      }

      // Check if previous token was 'def' or 'class'
      const prevNonWs = tokens.filter((t) => t.type !== "text").pop();
      if (prevNonWs && (prevNonWs.text === "def" || prevNonWs.text === "class")) {
        tokens.push({ type: "defname", text: word });
      } else if (PYTHON_KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", text: word });
      } else if (PYTHON_BUILTINS.has(word)) {
        tokens.push({ type: "builtin", text: word });
      } else if (PYTHON_CONSTANTS.has(word)) {
        tokens.push({ type: "boolean", text: word });
      } else {
        tokens.push({ type: "text", text: word });
      }
      continue;
    }

    // 7. Operators and Colons
    if (line[i] === ":") {
      tokens.push({ type: "operator", text: ":" });
      i++;
      continue;
    }

    if (/[+\-*/%=<>!&|^~]/.test(line[i])) {
      let op = "";
      while (i < len && /[+\-*/%=<>!&|^~]/.test(line[i])) {
        op += line[i];
        i++;
      }
      tokens.push({ type: "operator", text: op });
      continue;
    }

    // 8. Other punctuation
    tokens.push({ type: "punctuation", text: line[i] });
    i++;
  }

  return tokens;
}

/**
 * Returns Tailwind CSS class names for tokens based on theme (classic IDLE vs dark IDLE)
 */
export function getTokenClasses(token: HighlightToken, theme: "classic" | "dark" = "classic"): string {
  if (theme === "classic") {
    // IDLE Classic light palette:
    // Keywords: IDLE orange (#e65100 / text-orange-700 font-semibold)
    // Builtins: IDLE purple (#7b1fa2 / text-purple-700 font-medium)
    // Strings: IDLE green (#2e7d32 / text-emerald-700)
    // Comments: IDLE red (#c62828 / text-red-600 italic)
    // Numbers: IDLE blue (#1565c0 / text-blue-700)
    // Booleans: Dark blue/indigo (#1e3a8a font-semibold)
    // Def names: IDLE cyan-blue (#0284c7 font-semibold)
    // Operators: Bold slate (#1e293b font-semibold)
    switch (token.type) {
      case "keyword":
        return "text-orange-600 font-semibold";
      case "builtin":
        return "text-purple-700 font-semibold";
      case "string":
        return "text-emerald-700";
      case "comment":
        return "text-red-600 italic";
      case "number":
        return "text-blue-700 font-mono";
      case "boolean":
        return "text-indigo-700 font-semibold";
      case "defname":
        return "text-sky-700 font-semibold";
      case "operator":
        return "text-slate-900 font-medium";
      default:
        return "text-slate-900";
    }
  } else {
    // IDLE Dark modern palette:
    switch (token.type) {
      case "keyword":
        return "text-amber-400 font-semibold";
      case "builtin":
        return "text-purple-400 font-semibold";
      case "string":
        return "text-emerald-400";
      case "comment":
        return "text-rose-400 italic";
      case "number":
        return "text-sky-300 font-mono";
      case "boolean":
        return "text-indigo-300 font-semibold";
      case "defname":
        return "text-cyan-300 font-semibold";
      case "operator":
        return "text-amber-200 font-medium";
      default:
        return "text-slate-100";
    }
  }
}
