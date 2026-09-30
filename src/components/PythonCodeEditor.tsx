import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  tokenizePythonLine,
  getTokenClasses,
  HighlightToken,
} from "../utils/pythonHighlighter";
import {
  validatePythonSyntax,
  formatPythonIndentation,
  SyntaxIssue,
} from "../utils/pythonSyntaxValidator";
import { copyToClipboard } from "../utils/clipboard";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Terminal,
  Lock,
  ShieldAlert,
} from "lucide-react";

interface PythonCodeEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  starterCode?: string;
  onRun?: () => void;
  isRunning?: boolean;
  minHeight?: string;
  readOnly?: boolean;
  title?: string;
  allowCopyPaste?: boolean;
  showOperatorToolbar?: boolean;
  isAssessment?: boolean;
}

export const PythonCodeEditor: React.FC<PythonCodeEditorProps> = ({
  value,
  onChange,
  starterCode,
  onRun,
  isRunning = false,
  minHeight = "240px",
  readOnly = false,
  title = "Python 3 IDLE Workspace",
  allowCopyPaste,
  showOperatorToolbar,
  isAssessment = false,
}) => {
  const [theme, setTheme] = useState<"classic" | "dark">("classic");
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [dismissedWarning, setDismissedWarning] = useState(false);
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null);

  // Effective security toggles: In assessment mode, operator toolbar is hidden and copy/paste is blocked by default unless teacher explicitly enabled it
  const canCopyPaste = allowCopyPaste !== undefined ? allowCopyPaste : !isAssessment;
  const canShowToolbar = showOperatorToolbar !== undefined ? showOperatorToolbar : !isAssessment;

  const triggerClipboardNotice = (action: string) => {
    setClipboardNotice(`${action} is disabled by the teacher for this session.`);
    setTimeout(() => setClipboardNotice(null), 3500);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Validate Python syntax and strict indentations in real-time
  const validation = useMemo(() => {
    return validatePythonSyntax(value);
  }, [value]);

  const lines = useMemo(() => value.split("\n"), [value]);

  // Sync scroll between textarea, backdrop, and line numbers gutter
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (backdropRef.current) {
      backdropRef.current.scrollTop = scrollTop;
      backdropRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  // Update cursor line and column position for status bar and line highlighting
  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current) return;
    const selStart = textareaRef.current.selectionStart;
    const textBefore = value.slice(0, selStart);
    const lineList = textBefore.split("\n");
    const currentLine = lineList.length;
    const currentCol = lineList[lineList.length - 1].length + 1;
    setCursorPos({ line: currentLine, col: currentCol });
  }, [value]);

  useEffect(() => {
    updateCursorPosition();
  }, [value, updateCursorPosition]);

  // IDLE Indentation Keyboard Handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;

    // Clipboard block: Prevent Ctrl+C, Ctrl+V, Ctrl+X, Cmd+C, Cmd+V, Cmd+X, Shift+Insert if copy/paste is restricted by teacher
    if (!canCopyPaste) {
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === "c") {
          e.preventDefault();
          triggerClipboardNotice("Copying (Ctrl+C)");
          return;
        }
        if (k === "v") {
          e.preventDefault();
          triggerClipboardNotice("Pasting (Ctrl+V)");
          return;
        }
        if (k === "x") {
          e.preventDefault();
          triggerClipboardNotice("Cutting (Ctrl+X)");
          return;
        }
        if (k === "insert") {
          e.preventDefault();
          triggerClipboardNotice("Copying");
          return;
        }
      }
      if (e.shiftKey && e.key === "Insert") {
        e.preventDefault();
        triggerClipboardNotice("Pasting (Shift+Insert)");
        return;
      }
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    // 1. Run Module: F5 or Ctrl+Enter or Cmd+Enter (classic IDLE shortcut)
    if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key === "Enter")) {
      e.preventDefault();
      if (onRun) onRun();
      return;
    }

    // 2. IDLE Comment / Uncomment: Alt+3 (Comment Out), Alt+4 (Uncomment), or Ctrl+/
    if ((e.altKey && e.key === "3") || ((e.ctrlKey || e.metaKey) && e.key === "/")) {
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const lineEnd = value.indexOf("\n", selectionEnd);
      const actualEnd = lineEnd === -1 ? value.length : lineEnd;
      const selectedBlock = value.substring(lineStart, actualEnd);
      const blockLines = selectedBlock.split("\n");

      const newBlockLines = blockLines.map((line) => (line.trim().length > 0 ? "## " + line : line));
      const newText = value.substring(0, lineStart) + newBlockLines.join("\n") + value.substring(actualEnd);
      onChange(newText);
      return;
    }

    if (e.altKey && e.key === "4") {
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const lineEnd = value.indexOf("\n", selectionEnd);
      const actualEnd = lineEnd === -1 ? value.length : lineEnd;
      const selectedBlock = value.substring(lineStart, actualEnd);
      const blockLines = selectedBlock.split("\n");

      const newBlockLines = blockLines.map((line) => line.replace(/^[ \t]*##?[ \t]?/, ""));
      const newText = value.substring(0, lineStart) + newBlockLines.join("\n") + value.substring(actualEnd);
      onChange(newText);
      return;
    }

    // 3. Tab Key (IDLE 4-space indentation)
    if (e.key === "Tab") {
      e.preventDefault();

      if (e.shiftKey) {
        // Shift+Tab: Dedent (remove up to 4 spaces from start of current line or all selected lines)
        const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
        const lineEnd = value.indexOf("\n", selectionEnd);
        const actualEnd = lineEnd === -1 ? value.length : lineEnd;

        const selectedBlock = value.substring(lineStart, actualEnd);
        const blockLines = selectedBlock.split("\n");

        let removedTotal = 0;
        let firstLineRemoved = 0;

        const newBlockLines = blockLines.map((line, idx) => {
          let spacesToRemove = 0;
          for (let s = 0; s < 4 && s < line.length; s++) {
            if (line[s] === " ") spacesToRemove++;
            else break;
          }
          if (idx === 0) firstLineRemoved = spacesToRemove;
          removedTotal += spacesToRemove;
          return line.slice(spacesToRemove);
        });

        const newText =
          value.substring(0, lineStart) +
          newBlockLines.join("\n") +
          value.substring(actualEnd);

        onChange(newText);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = Math.max(lineStart, selectionStart - firstLineRemoved);
            textareaRef.current.selectionEnd = Math.max(lineStart, selectionEnd - removedTotal);
            updateCursorPosition();
          }
        }, 0);
      } else {
        // Normal Tab: Indent
        if (selectionStart !== selectionEnd) {
          // Multi-line selection: indent each line by 4 spaces
          const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
          const lineEnd = value.indexOf("\n", selectionEnd);
          const actualEnd = lineEnd === -1 ? value.length : lineEnd;

          const selectedBlock = value.substring(lineStart, actualEnd);
          const blockLines = selectedBlock.split("\n");
          const newBlockLines = blockLines.map((line) => "    " + line);

          const newText =
            value.substring(0, lineStart) +
            newBlockLines.join("\n") +
            value.substring(actualEnd);

          onChange(newText);

          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = selectionStart + 4;
              textareaRef.current.selectionEnd = selectionEnd + 4 * blockLines.length;
              updateCursorPosition();
            }
          }, 0);
        } else {
          // Single cursor: insert 4 spaces (or snap to next 4-space column stop like IDLE)
          const textBefore = value.substring(0, selectionStart);
          const currentLineText = textBefore.substring(textBefore.lastIndexOf("\n") + 1);
          const currentCol = currentLineText.length;
          const spacesToAdd = 4 - (currentCol % 4);
          const indentStr = " ".repeat(spacesToAdd);

          const newText =
            value.substring(0, selectionStart) +
            indentStr +
            value.substring(selectionEnd);

          onChange(newText);

          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
                selectionStart + spacesToAdd;
              updateCursorPosition();
            }
          }, 0);
        }
      }
      return;
    }

    // 3. Enter Key (IDLE Auto-Indentation on Colon :)
    if (e.key === "Enter") {
      e.preventDefault();

      // Find current line text before cursor
      const textBefore = value.substring(0, selectionStart);
      const lastNewline = textBefore.lastIndexOf("\n");
      const currentLine = textBefore.substring(lastNewline + 1);

      // Extract existing indentation
      const match = currentLine.match(/^([ \t]*)/);
      let indent = match ? match[1] : "";

      // Check if current line ends with ':' (ignoring comments and trailing spaces)
      const codeOnly = currentLine.replace(/#.*$/, "").trimEnd();
      const shouldIncreaseIndent = codeOnly.endsWith(":");
      const isTerminalStatement = /^(return|break|continue|pass|raise)\b/.test(codeOnly.trim());

      if (shouldIncreaseIndent) {
        // IDLE strictly adds 4 spaces after a block header ':'
        indent += "    ";
      } else if (isTerminalStatement && indent.length >= 4) {
        // IDLE smart unindent after terminal block statements
        indent = indent.slice(4);
      }

      const insertText = "\n" + indent;
      const newText =
        value.substring(0, selectionStart) +
        insertText +
        value.substring(selectionEnd);

      onChange(newText);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
            selectionStart + insertText.length;
          updateCursorPosition();
        }
      }, 0);
      return;
    }

    // 4. Backspace Key (Smart Dedent: delete 4 spaces at once if inside indentation)
    if (e.key === "Backspace" && selectionStart === selectionEnd) {
      const textBefore = value.substring(0, selectionStart);
      const lastNewline = textBefore.lastIndexOf("\n");
      const currentLineBeforeCursor = textBefore.substring(lastNewline + 1);

      // If everything before the cursor on this line is only spaces
      if (currentLineBeforeCursor.length > 0 && /^[ ]+$/.test(currentLineBeforeCursor)) {
        const col = currentLineBeforeCursor.length;
        const spacesToDelete = col % 4 === 0 ? 4 : col % 4;

        e.preventDefault();
        const newText =
          value.substring(0, selectionStart - spacesToDelete) +
          value.substring(selectionEnd);

        onChange(newText);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
              selectionStart - spacesToDelete;
            updateCursorPosition();
          }
        }, 0);
        return;
      }
    }
  };

  const handleCopy = async () => {
    if (!canCopyPaste) {
      triggerClipboardNotice("Copying");
      return;
    }
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFormatIndentation = () => {
    const formatted = formatPythonIndentation(value);
    onChange(formatted);
  };

  const handleReset = () => {
    if (starterCode !== undefined) {
      onChange(starterCode);
    }
  };

  const handleInsertOperator = (op: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + " " + op + " ");
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const needsLeftSpace = before.length > 0 && !/[\s([{=+\-*/%<>,:]$/.test(before);
    const needsRightSpace = after.length > 0 && !/^[\s)\]},:]/.test(after);
    const textToInsert = `${needsLeftSpace ? " " : ""}${op}${needsRightSpace ? " " : ""}`;
    const newText = before + textToInsert + after;
    onChange(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const nextPos = start + textToInsert.length;
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = nextPos;
        updateCursorPosition();
      }
    }, 0);
  };

  const isClassic = theme === "classic";

  return (
    <div
      className={`rounded-xl border transition-colors overflow-hidden flex flex-col font-sans ${
        isClassic
          ? "bg-white border-slate-300 shadow-sm"
          : "bg-slate-950 border-slate-800 shadow-lg"
      }`}
    >
      {/* IDLE Workspace Top Bar */}
      <div
        className={`px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 border-b text-xs select-none ${
          isClassic
            ? "bg-slate-100/90 border-slate-200 text-slate-700"
            : "bg-slate-900 border-slate-800 text-slate-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-600 text-white font-mono text-[10px] font-black">
              Py
            </div>
            <span className={isClassic ? "text-slate-800" : "text-white"}>{title}</span>
          </div>

          <span
            className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
              isClassic
                ? "bg-purple-100 text-purple-800"
                : "bg-purple-900/60 text-purple-300 border border-purple-800"
            }`}
          >
            Strict 4-Space Indent (IDLE)
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Format / PEP 8 Indent Fixer: Hidden during assessment */}
          {!isAssessment && (
            <button
              type="button"
              onClick={handleFormatIndentation}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                isClassic
                  ? "bg-white hover:bg-slate-200 text-slate-700 border border-slate-200"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
              title="Auto-format indentation to PEP 8 4-space standard"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="hidden md:inline">Auto-Indent (PEP 8)</span>
            </button>
          )}

          {/* Starter Reset: Hidden during assessment */}
          {!isAssessment && starterCode !== undefined && (
            <button
              type="button"
              onClick={handleReset}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                isClassic
                  ? "bg-white hover:bg-slate-200 text-slate-700 border border-slate-200"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
              title="Reset code to original starter"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Reset</span>
            </button>
          )}

          {/* Copy Code: In assessment mode, copy is strictly HIDDEN. In practice mode, only visible if copy/paste is permitted */}
          {!isAssessment && canCopyPaste && (
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                isClassic
                  ? "bg-white hover:bg-slate-200 text-slate-700 border border-slate-200"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
              title="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(isClassic ? "dark" : "classic")}
            className={`p-1.5 rounded-md text-[11px] transition-colors ${
              isClassic
                ? "bg-white hover:bg-slate-200 text-slate-700 border border-slate-200"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            }`}
            title={isClassic ? "Switch to IDLE Dark theme" : "Switch to IDLE Classic theme"}
          >
            {isClassic ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Run Button (if onRun supplied) */}
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-50"
              title="Run Python Module (F5 / Ctrl+Enter)"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isRunning ? "Running..." : "Run (F5)"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Clipboard Warning Toast */}
      {clipboardNotice && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in duration-150 select-none">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{clipboardNotice}</span>
        </div>
      )}

      {/* Python IDLE Operator Helper Strip (Hidden in formal assessments or when showOperatorToolbar is false) */}
      {canShowToolbar && (
        <div
          className={`px-3 py-1.5 flex flex-wrap items-center justify-between gap-1.5 border-b text-[11px] select-none ${
            isClassic
              ? "bg-slate-50/90 border-slate-200 text-slate-700"
              : "bg-slate-900/80 border-slate-800 text-slate-300"
          }`}
        >
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              IDLE Relational:
            </span>
            {[
              { label: ">=", tip: "Greater than or equal to (Python IDLE standard notation)" },
              { label: "<=", tip: "Less than or equal to (Python IDLE standard notation)" },
              { label: "!=", tip: "Not equal to (Python IDLE notation; do not use <> or ≠)" },
              { label: "==", tip: "Equal to comparison (do not use single =)" },
              { label: ">", tip: "Strictly greater than" },
              { label: "<", tip: "Strictly less than" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleInsertOperator(item.label)}
                title={item.tip}
                className={`px-1.5 py-0.5 rounded font-mono font-bold text-xs transition-all ${
                  isClassic
                    ? "bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300 shadow-2xs"
                    : "bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-600 shadow-2xs"
                }`}
              >
                {item.label}
              </button>
            ))}

            <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700 mx-0.5">|</span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Arithmetic:
            </span>
            {[
              { label: "%", tip: "Modulo (remainder in Python IDLE; pseudocode MOD)" },
              { label: "//", tip: "Integer floor division (pseudocode DIV)" },
              { label: "**", tip: "Exponentiation / power (never ^ which is XOR)" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleInsertOperator(item.label)}
                title={item.tip}
                className={`hidden sm:inline-block px-1.5 py-0.5 rounded font-mono font-bold text-xs transition-all ${
                  isClassic
                    ? "bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300 shadow-2xs"
                    : "bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-600 shadow-2xs"
                }`}
              >
                {item.label}
              </button>
            ))}

            <span className="hidden md:inline-block text-slate-300 dark:text-slate-700 mx-0.5">|</span>

            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Logical:
            </span>
            {[
              { label: "and", tip: "Boolean logical AND (lowercase in Python)" },
              { label: "or", tip: "Boolean logical OR (lowercase in Python)" },
              { label: "not", tip: "Boolean logical NOT (lowercase in Python)" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleInsertOperator(item.label)}
                title={item.tip}
                className={`hidden md:inline-block px-1.5 py-0.5 rounded font-mono font-medium text-xs transition-all ${
                  isClassic
                    ? "bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-slate-300 hover:border-emerald-300 shadow-2xs"
                    : "bg-slate-800 hover:bg-emerald-950 text-emerald-300 hover:text-emerald-200 border border-slate-700 hover:border-emerald-600 shadow-2xs"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-500">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">&gt;=, &lt;=, !=</span>
            <span>(never =&gt;, =&lt;, &lt;&gt;)</span>
          </div>
        </div>
      )}

      {/* Real-time Syntax / Indentation Alert Banner */}
      {!validation.isValid && validation.primaryError && !dismissedWarning && (
        <div
          className={`px-3.5 py-1.5 text-xs flex items-center justify-between border-b gap-2 ${
            validation.primaryError.type === "IndentationError"
              ? isClassic
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-amber-950/60 border-amber-800 text-amber-200"
              : isClassic
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-rose-950/60 border-rose-800 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="font-bold shrink-0">Line {validation.primaryError.line}:</span>
            <span className="truncate">{validation.primaryError.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setDismissedWarning(true)}
            className="text-[11px] opacity-60 hover:opacity-100 shrink-0 ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Editor Body: Line numbers + Code area */}
      <div className="relative flex flex-1 overflow-hidden" style={{ minHeight }}>
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          className={`w-12 select-none border-r text-right pr-2.5 pt-3 pb-3 font-mono text-xs overflow-hidden ${
            isClassic
              ? "bg-slate-50 border-slate-200 text-slate-400"
              : "bg-slate-900/80 border-slate-800 text-slate-600"
          }`}
          style={{ lineHeight: "24px" }}
        >
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const hasError = validation.issues.some((i) => i.line === lineNum);
            const isCurrentLine = cursorPos.line === lineNum;

            return (
              <div
                key={idx}
                className={`relative flex items-center justify-end h-[24px] ${
                  hasError
                    ? "font-bold text-red-600"
                    : isCurrentLine
                    ? isClassic
                      ? "text-slate-800 font-bold"
                      : "text-slate-200 font-bold"
                    : ""
                }`}
              >
                {hasError && (
                  <span
                    className="absolute left-1.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                    title={`Error on line ${lineNum}`}
                  />
                )}
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Editor Main Canvas (Syntax Highlight Backdrop + Transparent Interactive Textarea) */}
        <div className="relative flex-1 overflow-hidden">
          {/* Active Line Highlight Layer */}
          <div
            className="absolute left-0 right-0 pointer-events-none transition-all duration-75"
            style={{
              top: `${(cursorPos.line - 1) * 24 + 12 - (textareaRef.current?.scrollTop || 0)}px`,
              height: "24px",
              backgroundColor: isClassic ? "rgba(241, 245, 249, 0.7)" : "rgba(30, 41, 59, 0.4)",
            }}
          />

          {/* Syntax Highlight Backdrop */}
          <div
            ref={backdropRef}
            aria-hidden="true"
            className="absolute inset-0 p-3 font-mono text-xs md:text-sm select-none pointer-events-none overflow-hidden whitespace-pre"
            style={{
              fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
              lineHeight: "24px",
              tabSize: 4,
            }}
          >
            {lines.map((lineText, lineIdx) => {
              const tokens = tokenizePythonLine(lineText);
              const lineNum = lineIdx + 1;
              const hasError = !isAssessment && validation.issues.some((i) => i.line === lineNum);

              return (
                <div
                  key={lineIdx}
                  className={`h-[24px] leading-[24px] block whitespace-pre ${
                    hasError ? (isClassic ? "bg-red-50/60" : "bg-red-950/20") : ""
                  }`}
                >
                  {renderTokensWithGuides(tokens, theme)}
                </div>
              );
            })}
          </div>

          {/* Interactive Native Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setDismissedWarning(false);
            }}
            onKeyDown={handleKeyDown}
            onCopy={(e) => {
              if (!canCopyPaste) {
                e.preventDefault();
                triggerClipboardNotice("Copying");
              }
            }}
            onCut={(e) => {
              if (!canCopyPaste) {
                e.preventDefault();
                triggerClipboardNotice("Cutting");
              }
            }}
            onPaste={(e) => {
              if (!canCopyPaste) {
                e.preventDefault();
                triggerClipboardNotice("Pasting");
              }
            }}
            onScroll={handleScroll}
            onSelect={updateCursorPosition}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full p-3 font-mono text-xs md:text-sm bg-transparent text-transparent resize-none overflow-auto whitespace-pre outline-none focus:outline-none"
            style={{
              fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
              lineHeight: "24px",
              tabSize: 4,
              caretColor: isClassic ? "#0f172a" : "#38bdf8",
            }}
            placeholder="# Write your Python 3 solution here..."
          />
        </div>
      </div>

      {/* IDLE Status Bar */}
      <div
        className={`px-3.5 py-1.5 flex items-center justify-between border-t text-[11px] font-mono select-none ${
          isClassic
            ? "bg-slate-50 border-slate-200 text-slate-600"
            : "bg-slate-900 border-slate-800 text-slate-400"
        }`}
      >
        <div className="flex items-center gap-3">
          <span>
            Ln <strong className={isClassic ? "text-slate-900" : "text-slate-100"}>{cursorPos.line}</strong>, Col{" "}
            <strong className={isClassic ? "text-slate-900" : "text-slate-100"}>{cursorPos.col}</strong>
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden sm:inline">Spaces: 4 (Tab)</span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden md:inline">Python 3 (4CP0)</span>
        </div>

        {!isAssessment && (
          <div className="flex items-center gap-2">
            {validation.isValid ? (
              <span className="flex items-center gap-1 text-emerald-600 font-sans font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valid Syntax</span>
              </span>
            ) : (
              <span
                className={`flex items-center gap-1 font-sans font-semibold text-[11px] ${
                  validation.primaryError?.type === "IndentationError"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {validation.primaryError?.type === "IndentationError"
                    ? "Indentation Notice"
                    : "Syntax Error"}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Render tokens with exact character matching to ensure 100% alignment with textarea
function renderTokensWithGuides(tokens: HighlightToken[], theme: "classic" | "dark") {
  if (tokens.length === 0) return <span>&nbsp;</span>;

  return tokens.map((token, idx) => {
    const cls = getTokenClasses(token, theme);
    return (
      <span key={idx} className={cls}>
        {token.text}
      </span>
    );
  });
}
