declare const Sk: any;

export interface PythonRunResult {
  out: string;
  err: string | null;
}

// Built-in text files for IGCSE Topic 2.5 File Handling curriculum exercises
export const VIRTUAL_FILES: Record<string, string> = {
  "message.txt": "Welcome to Computer Science\nGood luck with Paper 2!\n",
  "names.txt": "Alice\nBob\nCharlie\nDiana\n",
  "scores.txt": "Alice,85\nBob,42\nCharlie,90\nDiana,68\nEthan,55\n",
  "runners.txt": "Sara,12.4\nLeo,11.8\nMia,13.1\nNoah,12.0\n",
  "sales.txt": "Book,12.50,4\nPen,1.20,10\nRuler,0.80,5\nFolder,3.50,2\n",
  "inventory.txt": "Apples,15,0.60\nBananas,30,0.40\nOranges,20,0.80\nPears,10,0.90\n",
  "temperatures.txt": "18.5\n21.0\n19.2\n23.4\n17.8\n22.1\n20.0\n",
  "students.txt": "101,Maya Patel,Grade 9\n102,Lucas Davies,Grade 7\n103,Chloe Smith,Grade 8\n104,Arjun Rao,Grade 9\n",
  "log.txt": "2026-09-01 08:00:00 - System Initialized\n2026-09-01 09:15:20 - User Login\n",
  "passwords.txt": "admin123\nPassw0rd!\nsecure99\nletmein\n",
  "roster.txt": "",
  "summary.txt": "",
  "audit.txt": "",
  "alerts.txt": "",
  "baggage_audit.txt": "",
  "irrigation_alerts.txt": "",
  "urgent_donors.txt": "",
  "box_office_summary.txt": "",
  "rebate_vouchers.txt": "",
  "solar_weekly_report.txt": "",
  "overdue_notices.txt": "",
};

export function runPython(
  code: string,
  inputs: string[] = [],
  onOut?: (text: string, kind: "out" | "in") => void
): Promise<PythonRunResult> {
  return new Promise((resolve) => {
    if (typeof Sk === "undefined") {
      // Skulpt not yet loaded from CDN or offline
      resolve({
        out: "",
        err: "Python runner engine is initializing. Please check your internet connection or reload.",
      });
      return;
    }

    let out = "";
    let inputIndex = 0;

    Sk.configure({
      output: (text: string) => {
        out += text;
        if (onOut) onOut(text, "out");
      },
      read: (filename: string) => {
        // Support virtual text files for file handling practice
        const cleanName = filename.replace(/^\.\//, "");
        if (VIRTUAL_FILES[cleanName] !== undefined) {
          return VIRTUAL_FILES[cleanName];
        }
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][filename] === undefined) {
          throw new Error("File not found: '" + filename + "'");
        }
        return Sk.builtinFiles["files"][filename];
      },
      __future__: Sk.python3,
      inputfunTakesPrompt: true,
      execLimit: 4000,
      inputfun: (promptText: string) => {
        const value = inputIndex < inputs.length ? inputs[inputIndex++] : "";
        if (onOut) onOut((promptText || "") + value + "\n", "in");
        return Promise.resolve(value);
      },
    });

    Sk.misceval
      .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true))
      .then(() => resolve({ out, err: null }))
      .catch((e: any) => {
        let msg = e ? e.toString() : "Error";
        if (/TimeLimitError/.test(msg)) {
          msg = "Your program ran for too long (exceeded 4 seconds limit). Is there an infinite loop?";
        }
        resolve({ out, err: msg });
      });
  });
}

export function normalizeOutput(s: string): string {
  return String(s || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

/**
 * Strips echoed input prompts (e.g. "Mark: ", "Enter score: ", "Number? ")
 * so automated tests evaluate the calculated output rather than prompt strings.
 */
export function stripInputPrompts(s: string): string {
  const norm = normalizeOutput(s);
  // Strip prompts like "Mark: Pass" -> "Pass", or lines that are only prompt labels
  const lines = norm.split("\n");
  const cleanedLines = lines.map((line) => {
    // If line has a prompt pattern followed by text: e.g. "Mark: 50" -> "50" or "Mark: Pass" -> "Pass"
    const promptMatch = line.match(/^([A-Za-z0-9 _\-]+[:?]\s*)(.+)$/);
    if (promptMatch && promptMatch[2]) {
      return promptMatch[2].trim();
    }
    return line;
  });

  return cleanedLines.join("\n").trim();
}

export function compareOutputs(actual: string, expected: string): boolean {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);

  // Exact normalized match
  if (normActual === normExpected) return true;

  // Match with input prompt prefixes stripped (e.g. 'Mark: Pass' vs 'Pass')
  const strippedActual = stripInputPrompts(actual);
  if (strippedActual === normExpected) return true;

  // Case-insensitive fallback if text matches (useful for diagnostic analysis)
  return false;
}
