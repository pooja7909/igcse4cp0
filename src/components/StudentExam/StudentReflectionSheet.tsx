import React, { useState, useEffect } from "react";
import {
  FileText,
  Printer,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Sparkles,
  Target,
  Check,
  Edit3,
  Save,
  HelpCircle,
} from "lucide-react";
import { Assessment, IGCSETask, ReflectionSheetData } from "../../types";

interface StudentReflectionSheetProps {
  assessment: Assessment;
  studentName: string;
  className?: string;
  submittedAt?: number;
  result?: {
    totalMarks: number;
    maxMarks: number;
    percentage: number;
    marks?: Record<string, number>;
    answers?: Record<string, any>;
    detailedResults?: Record<string, any>;
  } | null;
  allTasks?: Record<string, IGCSETask>;
  teacherFeedback?: string;
  reflectionData?: ReflectionSheetData;
  isTeacherEditable?: boolean;
  onSaveTeacherReflection?: (data: ReflectionSheetData) => Promise<void> | void;
  onNavigateToPractice?: (unitCode?: string) => void;
  onClose?: () => void;
}

// 4CP0 Specification Topics Default Mapping
const SPEC_MAPPING: Record<string, { topic: string; specRef: string; simpleConcept: string; advice: string }> = {
  p25_q01a: {
    topic: "Selection Constructs",
    specRef: "Topic 2.1",
    simpleConcept: "Using 'if' for conditions instead of loop keywords",
    advice: "Remember: 'if' is used to make decisions. 'for' and 'while' are used to repeat code.",
  },
  p25_q01bi: {
    topic: "Error Types",
    specRef: "Topic 2.3",
    simpleConcept: "Telling apart syntax errors, logic errors, and runtime crashes",
    advice: "Syntax errors stop code before running. Logic errors give wrong answers. Runtime errors crash while running.",
  },
  p25_q01bii: {
    topic: "Loops & Adding Totals",
    specRef: "Topic 2.1 & 2.2",
    simpleConcept: "Setting the right loop range and adding (+) to total counts",
    advice: "Check loop ranges carefully. When counting or adding totals, make sure you use + instead of - or reset.",
  },
  u04a: {
    topic: "If / Else Decisions",
    specRef: "Topic 2.1",
    simpleConcept: "Writing if-else conditions with correct comparison signs (>=, <=, ==)",
    advice: "Check the exact comparison signs (like >= 50). Don't forget the colon ':' at the end of the if line.",
  },
  u05c: {
    topic: "Repeating Loops",
    specRef: "Topic 2.2",
    simpleConcept: "Stopping a while loop before it repeats forever",
    advice: "Inside your while loop, make sure your counter variable goes up (e.g. count = count + 1) so it stops.",
  },
  u15a: {
    topic: "Trace Tables",
    specRef: "Topic 1.2",
    simpleConcept: "Tracking variable numbers step-by-step through a loop",
    advice: "Follow the code one line at a time. Only write down the new value when that line finishes.",
  },
};

export const StudentReflectionSheet: React.FC<StudentReflectionSheetProps> = ({
  assessment,
  studentName,
  className = "Class 1",
  submittedAt = Date.now(),
  result,
  allTasks = {},
  teacherFeedback,
  reflectionData,
  isTeacherEditable = false,
  onSaveTeacherReflection,
  onNavigateToPractice,
  onClose,
}) => {
  // Reflection fields: editable by teacher, viewable by student
  const [reflectionStrengths, setReflectionStrengths] = useState<string>(
    reflectionData?.reflectionStrengths || ""
  );
  const [reflectionMisconceptions, setReflectionMisconceptions] = useState<string>(
    reflectionData?.reflectionMisconceptions || ""
  );
  const [reflectionActionPlan, setReflectionActionPlan] = useState<string>(
    reflectionData?.reflectionActionPlan || ""
  );

  // Per-question teacher concept notes (e.g. "Could not answer: Two-way selection")
  const [questionNotes, setQuestionNotes] = useState<
    Record<string, { conceptFailed?: string; teacherAdvice?: string }>
  >(reflectionData?.questionNotes || {});

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keep state synchronized if reflectionData updates
  useEffect(() => {
    if (reflectionData) {
      if (reflectionData.reflectionStrengths !== undefined) {
        setReflectionStrengths(reflectionData.reflectionStrengths);
      }
      if (reflectionData.reflectionMisconceptions !== undefined) {
        setReflectionMisconceptions(reflectionData.reflectionMisconceptions);
      }
      if (reflectionData.reflectionActionPlan !== undefined) {
        setReflectionActionPlan(reflectionData.reflectionActionPlan);
      }
      if (reflectionData.questionNotes) {
        setQuestionNotes(reflectionData.questionNotes);
      }
    }
  }, [reflectionData]);

  const questionList = (assessment.questions || []).map((q: any) => {
    const fullTask = allTasks[q.id] || q;
    return { ...fullTask, ...q };
  });

  const marksMap = result?.marks || {};
  const totalScore = result?.totalMarks ?? 0;
  const maxScore = result?.maxMarks ?? assessment.maxMarks ?? 1;
  const percentage = result?.percentage ?? Math.round((totalScore / Math.max(1, maxScore)) * 100);

  // Categorize questions into Mastery levels
  const mastered: any[] = [];
  const developing: any[] = [];
  const focusAreas: any[] = [];

  questionList.forEach((q: any, idx: number) => {
    const awarded = marksMap[q.id] ?? 0;
    const qMax = q.marks || 1;
    const item = { ...q, index: idx + 1, awarded, maxMarks: qMax };
    if (awarded === qMax) {
      mastered.push(item);
    } else if (awarded > 0) {
      developing.push(item);
    } else {
      focusAreas.push(item);
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const updatedData: ReflectionSheetData = {
      reflectionStrengths,
      reflectionMisconceptions,
      reflectionActionPlan,
      questionNotes,
      updatedAt: Date.now(),
    };

    try {
      if (onSaveTeacherReflection) {
        await onSaveTeacherReflection(updatedData);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error("Failed to save reflection sheet:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuestionNoteChange = (qId: string, field: "conceptFailed" | "teacherAdvice", value: string) => {
    setQuestionNotes((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto my-4 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden print:border-none print:shadow-none print:my-0">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 print:bg-white print:text-black print:p-4 print:border-b-2 print:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-purple-200 text-xs font-bold tracking-wider uppercase block print:text-slate-600">
                Post-Assessment Learning & Reflection
              </span>
              {isTeacherEditable && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Teacher Editing Mode
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1 print:text-2xl print:text-slate-900">
              Student Reflection & Action Sheet
            </h1>
            <p className="text-xs text-purple-200/90 mt-0.5 print:text-slate-600">
              Clear breakdown of what went well, what concepts need practice, and simple next steps.
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {isTeacherEditable && (
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : saveSuccess ? "Saved ✓" : "Save Changes"}</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2 shadow-sm cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white text-slate-800 hover:bg-purple-50 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Clean Student Metadata Banner - No candidate number */}
        <div className="mt-6 pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs print:border-slate-300 print:text-slate-800">
          <div>
            <span className="text-purple-300/80 block font-medium print:text-slate-500">Student</span>
            <span className="font-bold text-white text-base print:text-slate-900">{studentName}</span>
          </div>
          <div>
            <span className="text-purple-300/80 block font-medium print:text-slate-500">Assessment</span>
            <span className="font-bold text-white text-sm truncate block print:text-slate-900">{assessment.title}</span>
          </div>
          <div>
            <span className="text-purple-300/80 block font-medium print:text-slate-500">Score Achieved</span>
            <span className="font-extrabold text-white text-base print:text-slate-900">
              {totalScore} / {maxScore} Marks ({percentage}%)
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Simple 3-Box Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Got Full Marks</span>
            </div>
            <div className="text-2xl font-black text-emerald-950 font-mono">
              {mastered.length} <span className="text-xs font-normal text-emerald-700">Questions</span>
            </div>
            <p className="text-[11px] text-emerald-800/80">You answered these questions completely correctly.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <div className="flex items-center gap-2 text-amber-800">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Partial Marks</span>
            </div>
            <div className="text-2xl font-black text-amber-950 font-mono">
              {developing.length} <span className="text-xs font-normal text-amber-700">Questions</span>
            </div>
            <p className="text-[11px] text-amber-800/80">Good attempt, but a small detail or boundary was missed.</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Needs Practice</span>
            </div>
            <div className="text-2xl font-black text-rose-950 font-mono">
              {focusAreas.length} <span className="text-xs font-normal text-rose-700">Questions</span>
            </div>
            <p className="text-[11px] text-rose-800/80">Questions you could not answer or where points were lost.</p>
          </div>
        </div>

        {/* Teacher Feedback Note (if present) */}
        {teacherFeedback && (
          <div className="p-4 sm:p-5 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Teacher Overall Comment
            </div>
            <p className="text-xs text-purple-950 leading-relaxed font-medium whitespace-pre-line">
              {teacherFeedback}
            </p>
          </div>
        )}

        {/* Question-by-Question Simple Concept Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-700" />
              Where You Succeeded & What Concept Went Wrong
            </h3>
            <span className="text-xs text-slate-500 font-medium print:hidden">
              {isTeacherEditable ? "Teacher can edit concepts & advice below" : "Simple student-friendly breakdown"}
            </span>
          </div>

          <div className="space-y-3">
            {questionList.map((q: any, idx: number) => {
              const awarded = marksMap[q.id] ?? 0;
              const qMax = q.marks || 1;
              const isFull = awarded === qMax;
              const isPartial = awarded > 0 && awarded < qMax;
              const specInfo = SPEC_MAPPING[q.id] || {
                topic: q.unitName || q.unit || "Programming Concept",
                specRef: "Topic Ref",
                simpleConcept: q.title || `Concept for Question ${idx + 1}`,
                advice: q.hint || "Review how this code works and practice again in the question bank.",
              };

              const customNote = questionNotes[q.id] || {};
              const defaultConceptFailed = !isFull
                ? `Could not answer: ${specInfo.simpleConcept}`
                : "Mastered this concept";
              const conceptFailedValue = customNote.conceptFailed !== undefined
                ? customNote.conceptFailed
                : defaultConceptFailed;
              const adviceValue = customNote.teacherAdvice !== undefined
                ? customNote.teacherAdvice
                : (q.markScheme || specInfo.advice);

              return (
                <div
                  key={q.id || idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isFull
                      ? "bg-emerald-50/40 border-emerald-200"
                      : isPartial
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-rose-50/30 border-rose-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {q.title || `Question ${idx + 1}`}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-500">
                          • {specInfo.topic}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                        isFull
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : isPartial
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-rose-100 text-rose-800 border-rose-300"
                      }`}
                    >
                      {awarded} / {qMax} Marks
                    </span>
                  </div>

                  {/* Concept Statement & Teacher Guidance */}
                  <div className="mt-3 p-3.5 bg-white/95 border border-slate-200 rounded-xl space-y-2 text-xs">
                    {/* Concept Status / Could not answer field */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          {isFull ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          {isFull ? "Concept Applied:" : "Concept Check:"}
                        </span>
                        {isTeacherEditable && (
                          <span className="text-[10px] font-semibold text-purple-700">Teacher Editable</span>
                        )}
                      </div>

                      {isTeacherEditable ? (
                        <input
                          type="text"
                          value={conceptFailedValue}
                          onChange={(e) => handleQuestionNoteChange(q.id, "conceptFailed", e.target.value)}
                          placeholder="e.g. Could not answer: Two-way selection using if/else"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      ) : (
                        <p className={`font-semibold text-xs ${isFull ? "text-emerald-900" : "text-rose-900"}`}>
                          {conceptFailedValue}
                        </p>
                      )}
                    </div>

                    {/* How to solve it / Mark Scheme takeaway */}
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-purple-600" />
                          What To Remember / How To Solve:
                        </span>
                        {isTeacherEditable && (
                          <span className="text-[10px] font-semibold text-purple-700">Teacher Advice</span>
                        )}
                      </div>

                      {isTeacherEditable ? (
                        <textarea
                          rows={2}
                          value={adviceValue}
                          onChange={(e) => handleQuestionNoteChange(q.id, "teacherAdvice", e.target.value)}
                          placeholder="Simple instructions for student on what went wrong and how to fix it..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      ) : (
                        <p className="text-slate-700 leading-relaxed font-sans text-xs whitespace-pre-line">
                          {adviceValue}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Main Action & Reflection Prompts - Simple & Teacher-Editable */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-700" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Action & Next Steps Plan
                </h3>
                <p className="text-xs text-slate-500">
                  {isTeacherEditable
                    ? "As the teacher, you can write or edit what the student should work on."
                    : "Review your teacher's feedback and action steps below."}
                </p>
              </div>
            </div>

            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-3 py-1 rounded-full">
                <Check className="w-3.5 h-3.5" /> All Changes Saved!
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            {/* Box 1: Strengths */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 block">
                  1. What went well (Concepts mastered):
                </label>
                {isTeacherEditable && (
                  <span className="text-[10px] text-purple-700 font-bold uppercase">Editable</span>
                )}
              </div>
              {isTeacherEditable ? (
                <textarea
                  rows={2}
                  value={reflectionStrengths}
                  onChange={(e) => setReflectionStrengths(e.target.value)}
                  placeholder="e.g. Understood Python variable assignment and correctly used print statements..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              ) : (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 min-h-[48px] whitespace-pre-line">
                  {reflectionStrengths || "Solid performance on fundamental constructs. Keep reviewing key keywords."}
                </div>
              )}
            </div>

            {/* Box 2: Misconceptions */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 block">
                  2. Concepts that were difficult (Where marks were dropped):
                </label>
                {isTeacherEditable && (
                  <span className="text-[10px] text-purple-700 font-bold uppercase">Editable</span>
                )}
              </div>
              {isTeacherEditable ? (
                <textarea
                  rows={2}
                  value={reflectionMisconceptions}
                  onChange={(e) => setReflectionMisconceptions(e.target.value)}
                  placeholder="e.g. Could not answer: while loop boundary checks, and missed the colon after 'else'..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              ) : (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 min-h-[48px] whitespace-pre-line">
                  {reflectionMisconceptions || "Review questions where you received 0 or partial marks above to see what was missed."}
                </div>
              )}
            </div>

            {/* Box 3: Action Plan */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 block">
                  3. Simple action steps to improve:
                </label>
                {isTeacherEditable && (
                  <span className="text-[10px] text-purple-700 font-bold uppercase">Editable</span>
                )}
              </div>
              {isTeacherEditable ? (
                <textarea
                  rows={3}
                  value={reflectionActionPlan}
                  onChange={(e) => setReflectionActionPlan(e.target.value)}
                  placeholder="1. Practice 3 questions on if/else statements.&#10;2. Step through the trace table line by line.&#10;3. Check loop ranges using range(len(list))."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              ) : (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 min-h-[48px] whitespace-pre-line font-medium text-indigo-950 bg-indigo-50/40">
                  {reflectionActionPlan || "1. Review the mark scheme for each missed question.\n2. Complete the recommended practice units below.\n3. Re-run your code with test cases."}
                </div>
              )}
            </div>

            {isTeacherEditable && (
              <div className="flex justify-end pt-2 print:hidden">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : saveSuccess ? "Saved Successfully!" : "Save All Reflection Fields"}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Practice Units */}
        {onNavigateToPractice && (
          <div className="pt-2 print:hidden">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
              Practice Units To Strengthen These Concepts:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigateToPractice("U04")}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-all group cursor-pointer"
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                  Unit 4
                </span>
                <h5 className="font-bold text-slate-800 text-xs mt-1 group-hover:text-purple-900">
                  Selection & If/Else
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Decisions using if, elif, and relational checks (==, !=, &gt;=, &lt;=).
                </p>
              </button>

              <button
                onClick={() => onNavigateToPractice("U05")}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-all group cursor-pointer"
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                  Unit 5
                </span>
                <h5 className="font-bold text-slate-800 text-xs mt-1 group-hover:text-purple-900">
                  Loops (For & While)
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Loop boundaries, counters, and stopping infinite loops.
                </p>
              </button>

              <button
                onClick={() => onNavigateToPractice("U15")}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-all group cursor-pointer"
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                  Unit 15
                </span>
                <h5 className="font-bold text-slate-800 text-xs mt-1 group-hover:text-purple-900">
                  Trace Tables
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tracking variable values line-by-line during dry runs.
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
