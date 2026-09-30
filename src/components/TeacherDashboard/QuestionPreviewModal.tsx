import React from "react";
import { IGCSETask, getTaskDifficulty } from "../../types";
import { PythonSnippetViewer } from "../PythonSnippetViewer";
import {
  X,
  Eye,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Code,
  Code2,
  ListChecks,
  Table as TableIcon,
  Search,
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
  Gauge,
} from "lucide-react";

interface QuestionPreviewModalProps {
  task: IGCSETask | null;
  isOpen: boolean;
  onClose: () => void;
  isSelected?: boolean;
  onToggleSelect?: (taskId: string) => void;
  onSetAsTask?: (task: IGCSETask) => void;
  onSetAsAssessment?: (task: IGCSETask) => void;
  onGenerateSimilar?: (task: IGCSETask) => void;
  onNextQuestion?: () => void;
  onPrevQuestion?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const QuestionPreviewModal: React.FC<QuestionPreviewModalProps> = ({
  task,
  isOpen,
  onClose,
  isSelected = false,
  onToggleSelect,
  onSetAsTask,
  onSetAsAssessment,
  onGenerateSimilar,
  onNextQuestion,
  onPrevQuestion,
  hasPrev = false,
  hasNext = false,
}) => {
  if (!isOpen || !task) return null;

  const getTypeIcon = () => {
    switch (task.type) {
      case "code":
        return <Code2 className="w-4 h-4 text-emerald-600" />;
      case "mcq":
        return <ListChecks className="w-4 h-4 text-blue-600" />;
      case "table":
        return <TableIcon className="w-4 h-4 text-purple-600" />;
      case "inspect":
        return <Search className="w-4 h-4 text-amber-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
              {getTypeIcon()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {task.unit}
                </span>
                {(() => {
                  const diff = getTaskDifficulty(task);
                  if (diff === "Easy") {
                    return (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Easy
                      </span>
                    );
                  }
                  if (diff === "Moderate") {
                    return (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                        Moderate
                      </span>
                    );
                  }
                  return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                      Hard
                    </span>
                  );
                })()}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {task.level}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {task.marks} {task.marks === 1 ? "Mark" : "Marks"}
                </span>
                {task.starterFileName && (
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                    <Code className="w-3 h-3 text-amber-700" />
                    {task.starterFileName}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate mt-0.5">
                {task.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleSelect && (
              <button
                type="button"
                onClick={() => onToggleSelect(task.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isSelected
                    ? "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-600/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Selected</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                    <span>Select Question</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable Question Details */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-slate-800">
          {/* Question Brief / Specification */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Question Instructions & Brief
            </span>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed whitespace-pre-line text-slate-900 font-normal">
              {task.brief}
            </div>
          </div>

          {/* Hint if present */}
          {task.hint && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <span className="font-bold">Student Hint:</span> {task.hint}
            </div>
          )}

          {/* Reference code for code inspection */}
          {task.code && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Code Under Inspection
              </span>
              <PythonSnippetViewer code={task.code} title="Inspected Python Code" />
            </div>
          )}

          {/* Code Question Details */}
          {task.type === "code" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter Template Provided to Candidate
                </span>
                <PythonSnippetViewer
                  code={task.starter || "# Python solution"}
                  title="Starter Code"
                />
              </div>

              {task.tests && task.tests.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Automated Marking Test Suite ({task.tests.length} Cases)</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      Auto-marked via Python 3 (Skulpt)
                    </span>
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {task.tests.map((test, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            Test Case #{idx + 1}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                            {test.m || 1} mark
                          </span>
                        </div>

                        {test.in && test.in.length > 0 && (
                          <div>
                            <span className="text-slate-500 text-[10px] block">Inputs (stdin):</span>
                            <code className="text-slate-800 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 block truncate">
                              {test.in.join(", ")}
                            </code>
                          </div>
                        )}

                        <div>
                          <span className="text-slate-500 text-[10px] block">Expected Output:</span>
                          <code className="text-emerald-700 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 block truncate font-semibold">
                            {test.out}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solved Python Program Solution (Neatly formatted for Teacher) */}
              {task.solution && (
                <div className="space-y-2 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Teacher Mark Scheme: Solved Python Program
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      Full {task.marks} Marks Model Answer
                    </span>
                  </div>
                  <PythonSnippetViewer
                    code={task.solution}
                    title="Model Python Solution (Solved Neatly)"
                  />
                </div>
              )}

              {/* Step-by-Step Marking Breakdown */}
              {(task.markPoints || task.markScheme) && (
                <div className="space-y-2.5 p-4 bg-purple-50/70 border border-purple-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-700" />
                      Step-by-Step Marking Criteria & Steps
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-800">
                      Total: {task.marks} {task.marks === 1 ? "Mark" : "Marks"}
                    </span>
                  </div>

                  {task.markPoints && task.markPoints.length > 0 ? (
                    <div className="space-y-2 divide-y divide-purple-100">
                      {task.markPoints.map((mp, mIdx) => (
                        <div key={mp.id || mIdx} className="pt-2 first:pt-0 flex items-start gap-2.5 text-xs">
                          <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-mono font-bold text-[10px] shrink-0 mt-0.5">
                            MP{mIdx + 1} ({mp.marks || 1}M)
                          </span>
                          <div className="flex-1 space-y-1">
                            <p className="font-semibold text-slate-800">{mp.description}</p>
                            {mp.exemplarCode && (
                              <code className="block p-2 rounded-lg bg-white border border-purple-200 font-mono text-[11px] text-purple-950 whitespace-pre overflow-x-auto">
                                {mp.exemplarCode}
                              </code>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-purple-200 whitespace-pre-line leading-relaxed font-sans">
                      {task.markScheme}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MCQ Question Details */}
          {task.type === "mcq" && task.questions && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Multiple Choice Questions & Mark Scheme
              </span>

              {(task.questions as any[]).map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
                >
                  <p className="text-xs font-bold text-slate-900">
                    {task.questions!.length > 1 ? `${qIdx + 1}. ` : ""}
                    {q.q}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isCorrect = q.a === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
                            isCorrect
                              ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                              : "bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-mono">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table Question Details */}
          {task.type === "table" && task.rows && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Truth / Trace Table Columns & Mark Scheme
              </span>
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                    <tr>
                      {task.columns?.map((c, i) => (
                        <th key={i} className="p-2.5">
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {task.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => {
                          const val = typeof cell === "object" && cell !== null && "v" in cell ? cell.v : String(cell ?? "-");
                          const isGiven = typeof cell === "object" && cell !== null && "g" in cell ? cell.g : false;
                          return (
                            <td key={cIdx} className="p-2.5 font-mono text-slate-700">
                              {val}
                              {isGiven && (
                                <span className="ml-1.5 text-[10px] text-slate-400 font-sans">
                                  (given)
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Theory Question Details */}
          {task.type === "theory" && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Edexcel 4CP0 Mark Scheme Keywords
              </span>
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs space-y-1">
                <div className="text-purple-950 font-medium">
                  <strong>Required Concepts:</strong>{" "}
                  {((task.questions as any)?.[0]?.keywords || []).join(", ") || "Specific domain terminology"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Navigation & Selection Controls */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevQuestion}
              disabled={!hasPrev}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              type="button"
              onClick={onNextQuestion}
              disabled={!hasNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {onGenerateSimilar && (
              <button
                type="button"
                onClick={() => {
                  onGenerateSimilar(task);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all shadow-xs"
                title="Generate an authentic syllabus-aligned variation of this question in the Question Bank"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Similar</span>
              </button>
            )}

            {onSetAsTask && (
              <button
                type="button"
                onClick={() => {
                  onSetAsTask(task);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
                title="Assign question as an interactive practice task with hints and auto-tests"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Set as Task</span>
              </button>
            )}

            {onSetAsAssessment && (
              <button
                type="button"
                onClick={() => {
                  onSetAsAssessment(task);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-xs"
                title="Set as a formal timed exam assessment"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Set as Assessment</span>
              </button>
            )}

            {onToggleSelect && (
              <button
                type="button"
                onClick={() => onToggleSelect(task.id)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  isSelected
                    ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                }`}
              >
                {isSelected ? "Deselect Question" : "Select Question"}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
