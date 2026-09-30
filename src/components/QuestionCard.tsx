import React, { useState, useEffect } from "react";
import { IGCSETask, MarkResult } from "../types";
import { autoMarkTask } from "../utils/autoMarker";
import { runPython } from "../utils/pythonRunner";
import { PythonCodeEditor } from "./PythonCodeEditor";
import { PythonSnippetViewer } from "./PythonSnippetViewer";
import { AiPracticeScaffoldPanel } from "./StudentExam/AiPracticeScaffoldPanel";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  ListChecks,
  Table as TableIcon,
  Search,
  ArrowUpDown,
  BookOpen,
  Award,
} from "lucide-react";

interface QuestionCardProps {
  task: IGCSETask;
  mode: "practice" | "exam" | "preview";
  studentAnswer: any;
  onAnswerChange: (newAnswer: any) => void;
  onCheck?: (result: MarkResult) => void;
  questionNumber?: number;
  allowCopyPaste?: boolean;
  showOperatorToolbar?: boolean;
  hideAiScaffold?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  task,
  mode,
  studentAnswer,
  onAnswerChange,
  onCheck,
  questionNumber,
  allowCopyPaste,
  showOperatorToolbar,
  hideAiScaffold = false,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [inputBuffer, setInputBuffer] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [markResult, setMarkResult] = useState<MarkResult | null>(null);

  // Clear console output and inputs for testing whenever the student moves to a new question
  useEffect(() => {
    setConsoleOutput("");
    setInputBuffer("");
    setIsRunning(false);
    setIsMarking(false);
    setMarkResult(null);
    setShowHint(false);
    setSortStep(0);
  }, [task.id]);

  // Sorting visualiser state
  const [sortStep, setSortStep] = useState(0);

  // Code editor text
  const currentCode =
    typeof studentAnswer === "string" ? studentAnswer : task.starter || "# Write your Python 3 solution here\n";

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput("");
    const inputs = inputBuffer.split("\n");

    const res = await runPython(currentCode, inputs, (txt) => {
      setConsoleOutput((prev) => prev + txt);
    });

    setIsRunning(false);
    if (res.err) {
      setConsoleOutput((prev) => prev + "\n[Runtime Error]: " + res.err);
    } else if (!res.out && !consoleOutput) {
      setConsoleOutput("(Program finished with no printed output)");
    }
  };

  const handleCheckAnswer = async () => {
    setIsMarking(true);
    const result = await autoMarkTask(task, studentAnswer);
    setIsMarking(false);
    setMarkResult(result);
    if (onCheck) {
      onCheck(result);
    }
  };

  const getQuestionTypeIcon = () => {
    switch (task.type) {
      case "code":
        return <Code2 className="w-4 h-4 text-emerald-600" />;
      case "mcq":
        return <ListChecks className="w-4 h-4 text-blue-600" />;
      case "table":
        return <TableIcon className="w-4 h-4 text-purple-600" />;
      case "inspect":
        return <Search className="w-4 h-4 text-amber-600" />;
      case "sort":
        return <ArrowUpDown className="w-4 h-4 text-indigo-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            {getQuestionTypeIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {task.unit}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-600 px-2 py-0.5 rounded-full bg-slate-100">
                {task.level}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {questionNumber ? `Q${questionNumber}. ` : ""}
              {task.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {task.marks} {task.marks === 1 ? "Mark" : "Marks"}
          </span>
          {mode === "practice" && task.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? "Hide Hint" : "Hint"}
            </button>
          )}
        </div>
      </div>

      {/* Hint Alert */}
      {showHint && task.hint && (
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>{task.hint}</p>
        </div>
      )}

      {/* Question Brief */}
      <div className="my-5 text-slate-800 text-sm md:text-base leading-relaxed whitespace-pre-line font-normal">
        {task.brief}
      </div>

      {/* Uploaded Past Paper Diagram / Image if present */}
      {task.image && (
        <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center">
          <img
            src={task.image}
            alt={task.title || "Question Diagram"}
            className="max-h-96 max-w-full rounded-lg object-contain shadow-xs bg-white border border-slate-200/60"
            referrerPolicy="no-referrer"
          />
          <span className="text-[11px] text-slate-400 mt-2 font-medium">Question Diagram / Past Paper Figure</span>
        </div>
      )}

      {/* Code Snippet if applicable (e.g. inspecting code) */}
      {task.code && (
        <PythonSnippetViewer
          code={task.code}
          title="Python Code Reference"
          allowCopy={mode !== "exam" && (allowCopyPaste !== undefined ? allowCopyPaste : true)}
        />
      )}

      {/* AI Scaffolding & Live Practice Guidance: strictly hidden during assessment */}
      {mode === "practice" && !hideAiScaffold && (
        <AiPracticeScaffoldPanel
          task={task}
          studentAnswer={studentAnswer}
          consoleOutput={consoleOutput}
          markResult={markResult}
          isAssessment={hideAiScaffold}
        />
      )}

      {/* Type-Specific Interactive Inputs */}
      {/* 1. CODE QUESTION */}
      {task.type === "code" && (
        <div className="space-y-4 my-4">
          <PythonCodeEditor
            value={currentCode}
            onChange={(val) => onAnswerChange(val)}
            starterCode={task.starter}
            onRun={handleRunCode}
            isRunning={isRunning}
            minHeight="280px"
            allowCopyPaste={allowCopyPaste}
            showOperatorToolbar={showOperatorToolbar}
            isAssessment={mode === "exam"}
          />

          {/* Test Inputs & Runner Console */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Inputs for testing (one per input() line):
                </label>
                <div className="flex items-center gap-2">
                  {mode === "practice" && task.tests && task.tests[0] && task.tests[0].in && task.tests[0].in.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setInputBuffer(task.tests![0].in!.join("\n"))}
                      className="text-[11px] text-purple-600 hover:text-purple-800 hover:underline font-medium cursor-pointer"
                      title="Preload sample test inputs from task specification"
                    >
                      Load Sample Inputs
                    </button>
                  )}
                  {inputBuffer && (
                    <button
                      type="button"
                      onClick={() => setInputBuffer("")}
                      className="text-[11px] text-slate-400 hover:text-slate-700 hover:underline cursor-pointer"
                      title="Clear test inputs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={inputBuffer}
                onChange={(e) => setInputBuffer(e.target.value)}
                className="w-full h-24 p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Line 1&#10;Line 2 (Inputs automatically fed to Python input() calls)"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-700">Console Output:</label>
                  {consoleOutput && (
                    <button
                      type="button"
                      onClick={() => setConsoleOutput("")}
                      className="text-[11px] text-slate-400 hover:text-slate-700 hover:underline cursor-pointer"
                      title="Clear console output"
                    >
                      Clear Output
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 px-3 py-1 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  {isRunning ? "Running..." : "Run Test"}
                </button>
              </div>
              <pre className="w-full h-24 p-2.5 text-xs font-mono bg-slate-900 text-slate-200 rounded-lg overflow-auto whitespace-pre-wrap">
                {consoleOutput || "(Run code to inspect output here)"}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 2. MCQ QUESTION */}
      {task.type === "mcq" && task.questions && (
        <div className="space-y-5 my-4">
          {(task.questions as any[]).map((q, qIdx) => {
            const selectedVal = Array.isArray(studentAnswer) ? studentAnswer[qIdx] : null;
            return (
              <div key={qIdx} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <p className="font-medium text-slate-900 text-sm">
                  {task.questions!.length > 1 ? `${qIdx + 1}. ` : ""}
                  {q.q}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isChecked = selectedVal === optIdx;
                    return (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-all ${
                          isChecked
                            ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-medium shadow-sm"
                            : "bg-white border-slate-200 hover:bg-slate-100 text-slate-800"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`mcq_${task.id}_${qIdx}`}
                          checked={isChecked}
                          onChange={() => {
                            const newArr = Array.isArray(studentAnswer)
                              ? [...studentAnswer]
                              : new Array(task.questions!.length).fill(null);
                            newArr[qIdx] = optIdx;
                            onAnswerChange(newArr);
                          }}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TABLE / TRACE QUESTION */}
      {task.type === "table" && task.columns && task.rows && (
        <div className="my-4 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-100 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                {task.columns.map((col, cIdx) => (
                  <th key={cIdx} className="px-4 py-3 border-r border-slate-200 last:border-r-0">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(task.rows as any[][]).map((row, rIdx) => {
                const currentVals = (Array.isArray(studentAnswer) ? studentAnswer[rIdx] : []) || [];
                return (
                  <tr key={rIdx} className="bg-white hover:bg-slate-50/50">
                    {row.map((cell, cIdx) => {
                      const isGiven = cell.g;
                      const val = isGiven ? cell.v : currentVals[cIdx] ?? "";
                      const colDef = task.columns![cIdx];

                      return (
                        <td key={cIdx} className="p-2 border-r border-slate-200 last:border-r-0">
                          {isGiven ? (
                            <span className="font-mono text-slate-700 font-semibold px-2 py-1 block">
                              {cell.v}
                            </span>
                          ) : colDef.type === "select" && colDef.options ? (
                            <select
                              value={val}
                              onChange={(e) => {
                                const newTable = Array.isArray(studentAnswer)
                                  ? studentAnswer.map((r: any) => [...r])
                                  : (task.rows as any[][]).map((r) => r.map((c) => (c.g ? c.v : "")));
                                if (!newTable[rIdx]) newTable[rIdx] = [];
                                newTable[rIdx][cIdx] = e.target.value;
                                onAnswerChange(newTable);
                              }}
                              className="w-full px-2 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            >
                              <option value="">-- Choose --</option>
                              {colDef.options.map((o, oIdx) => (
                                <option key={oIdx} value={o}>
                                  {o}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => {
                                const newTable = Array.isArray(studentAnswer)
                                  ? studentAnswer.map((r: any) => [...r])
                                  : (task.rows as any[][]).map((r) => r.map((c) => (c.g ? c.v : "")));
                                if (!newTable[rIdx]) newTable[rIdx] = [];
                                newTable[rIdx][cIdx] = e.target.value;
                                onAnswerChange(newTable);
                              }}
                              placeholder="Enter value"
                              className="w-full px-2 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. CODE INSPECTION / SHORT ANSWER */}
      {task.type === "inspect" && task.questions && (
        <div className="space-y-4 my-4">
          {(task.questions as any[]).map((q, qIdx) => {
            const val = Array.isArray(studentAnswer) ? studentAnswer[qIdx] ?? "" : "";
            return (
              <div key={qIdx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <label className="text-sm font-medium text-slate-800 block">
                  {task.questions!.length > 1 ? `${qIdx + 1}. ` : ""}
                  {q.q}
                </label>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => {
                    const newArr = Array.isArray(studentAnswer)
                      ? [...studentAnswer]
                      : new Array(task.questions!.length).fill("");
                    newArr[qIdx] = e.target.value;
                    onAnswerChange(newArr);
                  }}
                  placeholder="Type your exact answer here..."
                  className="w-full max-w-md px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 5. SORT TASK */}
      {task.type === "sort" && task.rows && (
        <div className="space-y-4 my-4">
          <p className="text-xs text-slate-500">
            Write the comma-separated sequence of elements for each pass (e.g. 1, 4, 2, 5, 8):
          </p>
          {(task.rows as any[][]).map((row, rIdx) => {
            const label = task.labels && task.labels[rIdx] ? task.labels[rIdx] : `Pass ${rIdx + 1}`;
            const studentVals = (Array.isArray(studentAnswer) ? studentAnswer[rIdx] : []) || [];
            return (
              <div key={rIdx} className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="w-36 text-xs font-semibold text-slate-700">{label}:</span>
                <input
                  type="text"
                  value={studentVals[0] || ""}
                  onChange={(e) => {
                    const newRows = Array.isArray(studentAnswer)
                      ? studentAnswer.map((r: any) => [...r])
                      : (task.rows as any[][]).map(() => [""]);
                    if (!newRows[rIdx]) newRows[rIdx] = [];
                    newRows[rIdx][0] = e.target.value;
                    onAnswerChange(newRows);
                  }}
                  placeholder="e.g. 1, 2, 4, 5, 8"
                  className="flex-1 min-w-[220px] px-3 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 6. THEORY / FREE RESPONSE */}
      {task.type === "theory" && (
        <div className="space-y-2 my-4">
          <label className="text-xs font-semibold text-slate-700">Your Answer (marked against criteria):</label>
          <textarea
            value={typeof studentAnswer === "string" ? studentAnswer : ""}
            onChange={(e) => onAnswerChange(e.target.value)}
            rows={4}
            className="w-full p-3 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Type your explanation here. The auto-marker evaluates key technical concepts..."
          />
        </div>
      )}

      {/* Bottom Actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {mode === "practice" ? (
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={isMarking}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isMarking ? "Checking..." : `Check Answer (${task.marks} Marks)`}
          </button>
        ) : (
          <div className="text-xs text-slate-500 italic">
            Answers are auto-saved and will be marked on submission.
          </div>
        )}
      </div>

      {/* Verdict & Test Results in Practice/Preview mode */}
      {markResult && (
        <div className="mt-5 space-y-3">
          <div
            className={`p-4 rounded-lg flex items-center justify-between border ${
              markResult.passed
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {markResult.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
              )}
              <span className="font-semibold text-sm">
                {markResult.feedback ||
                  (markResult.passed ? "Full marks earned!" : "Review needed.")}
              </span>
            </div>
            <div className="text-sm font-bold">
              {markResult.m} / {markResult.M} Marks
            </div>
          </div>

          {/* Test Case Detail if code */}
          {task.type === "code" && Array.isArray(markResult.detail) && markResult.detail.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Automated Test Runs:
              </h4>
              {markResult.detail.map((t: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs font-mono space-y-1.5 ${
                    t.passed ? "bg-emerald-50/60 border-emerald-200" : "bg-red-50/70 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-sans">
                    <span className="font-semibold text-slate-800">
                      Test {t.testIndex}: {t.passed ? "Passed ✓" : "Failed ✗"}
                    </span>
                    <span className="text-slate-600">
                      {t.marks}/{t.maxMarks} Marks
                    </span>
                  </div>
                  {t.inputs && t.inputs.length > 0 && (
                    <div className="text-slate-600">
                      <strong>Input:</strong> {t.inputs.join(", ")}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-500 font-sans block text-[11px] font-semibold mb-0.5">
                        Expected Output:
                      </span>
                      <pre className="whitespace-pre-wrap">{t.expected}</pre>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-500 font-sans block text-[11px] font-semibold mb-0.5">
                        Your Program Output:
                      </span>
                      <pre className="whitespace-pre-wrap">{t.actual || "(no output)"}</pre>
                      {t.error && <p className="text-red-600 mt-1">{t.error}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Point-by-point Mark Scheme Breakdown for Theory / Structured questions */}
          {Array.isArray(markResult.breakdown) && markResult.breakdown.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                Mark Scheme Point-by-Point Assessment:
              </h4>
              <div className="space-y-1.5">
                {markResult.breakdown.map((item: any, bIdx: number) => {
                  if (typeof item === "string") {
                    return (
                      <div
                        key={bIdx}
                        className="p-2 rounded-lg border border-emerald-200 bg-emerald-50/60 text-xs text-emerald-900 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    );
                  }
                  const isAwarded = (item.awarded || 0) > 0;
                  return (
                    <div
                      key={bIdx}
                      className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                        isAwarded
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] shrink-0 mt-0.5 ${
                            isAwarded ? "bg-emerald-200 text-emerald-900" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.markPointId || `MP${bIdx + 1}`} {isAwarded ? "✓" : "✗"}
                        </span>
                        <div>
                          <p className="font-medium">{item.criterion}</p>
                          {item.reason && (
                            <p className={`text-[11px] mt-0.5 ${isAwarded ? "text-emerald-700" : "text-slate-500"}`}>
                              {item.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 text-right font-bold">
                        <span className={isAwarded ? "text-emerald-700" : "text-slate-400"}>
                          {item.awarded} / {item.maxMarks || 1}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
