import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText,
  Lock,
  Unlock,
  Printer,
  RotateCcw,
  Eye,
  Check,
  X,
  Code,
  AlertTriangle,
} from "lucide-react";
import { Assessment, IGCSETask, ResultReleaseSettings } from "../../types";
import { StudentReflectionSheet } from "./StudentReflectionSheet";
import { getEdexcelGrade } from "../../utils/gradeBoundaries";

interface StudentResultPortalProps {
  assessment: Assessment;
  studentId?: string;
  candidateNumber?: string;
  studentName: string;
  className?: string;
  submittedAt?: number;
  initialResult?: any;
  allTasks?: Record<string, IGCSETask>;
  onClose?: () => void;
}

export const StudentResultPortal: React.FC<StudentResultPortalProps> = ({
  assessment,
  studentId,
  candidateNumber,
  studentName,
  className,
  submittedAt = Date.now(),
  initialResult,
  allTasks = {},
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultsReleased, setResultsReleased] = useState<boolean>(
    assessment.type === "task" || (initialResult?.resultsReleased ?? false)
  );
  const [releaseSettings, setReleaseSettings] = useState<ResultReleaseSettings | null>(
    initialResult?.releaseSettings || assessment.releaseSettings || null
  );
  const [studentData, setStudentData] = useState<any>(initialResult?.student || initialResult || null);
  const [activeTab, setActiveTab] = useState<"breakdown" | "reflection">("breakdown");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const isPracticeTask = assessment.type === "task";

  // Fetch / poll released result
  const fetchStudentResult = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const targetId = studentId || candidateNumber || studentName;
      if (!targetId) return;
      const res = await fetch(`/api/assessments/${assessment.id}/student-result/${encodeURIComponent(targetId)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to load candidate result");
      }

      setResultsReleased(data.resultsReleased);
      if (data.releaseSettings) {
        setReleaseSettings(data.releaseSettings);
      }
      if (data.student) {
        setStudentData(data.student);
      }
    } catch (err: any) {
      console.warn("Could not check student results:", err);
      setErrorMsg(err.message || "Could not connect to assessment server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentResult();
    // Poll every 8 seconds in case the teacher releases results while student is waiting
    const interval = setInterval(fetchStudentResult, 8000);
    return () => clearInterval(interval);
  }, [assessment.id, studentId, candidateNumber]);

  const toggleQuestionExpand = (qId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const questionList = (assessment.questions || []).map((q: any) => {
    const fullTask = allTasks[q.id] || q;
    return { ...fullTask, ...q };
  });

  const marksMap = studentData?.marks || {};
  const answersMap = studentData?.answers || {};
  const totalScore = studentData?.totalMarks;
  const maxScore = studentData?.maxMarks || assessment.maxMarks;
  const percentage = studentData?.percentage;

  // Grade calculation respecting custom teacher grade boundaries
  const getGrade = (pct: number) => {
    return getEdexcelGrade(pct, assessment.gradeBoundaries, maxScore);
  };

  const gradeInfo = percentage !== undefined ? getGrade(percentage) : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                {isPracticeTask ? "Practice Task Review" : "Student Result Portal"}
              </span>
              <span className="text-xs font-mono text-slate-500">
                PIN: {assessment.code}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {assessment.title}
            </h2>
            <p className="text-xs text-slate-500">
              Student: <strong>{studentName}</strong>{className ? ` • Class ${className}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStudentResult}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh result status"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Checking..." : "Refresh"}</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Alert if NOT yet released */}
        {!resultsReleased && !isPracticeTask && (
          <div className="mt-5 p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4 text-amber-600" />
              Results Pending Teacher Moderation & Release
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Your teacher is currently reviewing submissions. Once your teacher releases the results, this portal will automatically unlock your overall score, question-by-question mark scheme guidance (showing where you went wrong), and post-assessment reflection sheet.
            </p>
            <div className="pt-2">
              <button
                onClick={fetchStudentResult}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Check If Teacher Released Results
              </button>
            </div>
          </div>
        )}

        {/* Results Unlocked Card */}
        {(resultsReleased || isPracticeTask) && (
          <div className="mt-5 space-y-6">
            {/* Release Notice Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  Results released by teacher. Review your performance and mark scheme breakdown below.
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                Official Pearson 4CP0 Audit
              </span>
            </div>

            {/* Score & Grade Overview (If teacher allowed shareTotalScore) */}
            {releaseSettings?.shareTotalScore !== false && totalScore !== undefined && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 border border-purple-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                    Your Overall Result
                  </span>
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    {totalScore} <span className="text-lg font-normal text-slate-600">/ {maxScore} Marks</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    Achieved {percentage}% across this assessment
                  </span>
                </div>

                {gradeInfo && (
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Edexcel 9–1 GCSE Equivalent
                    </span>
                    <span className={`px-4 py-1.5 rounded-xl font-mono font-extrabold text-base border shadow-xs inline-block ${gradeInfo.color}`}>
                      Grade {gradeInfo.grade}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Teacher Feedback Note (If teacher allowed shareTeacherFeedback) */}
            {releaseSettings?.shareTeacherFeedback !== false && studentData?.feedback && (
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Teacher Examiner Comment
                </div>
                <p className="text-indigo-950 font-medium leading-relaxed whitespace-pre-line">
                  {studentData.feedback}
                </p>
              </div>
            )}

            {/* View Mode Tabs: Question Breakdown vs Reflection Sheet */}
            <div className="flex border-b border-slate-200 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("breakdown")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "breakdown"
                    ? "border-purple-700 text-purple-900"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Question-by-Question & Mark Scheme Breakdown</span>
              </button>

              {releaseSettings?.shareReflectionSheet !== false && (
                <button
                  type="button"
                  onClick={() => setActiveTab("reflection")}
                  className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "reflection"
                      ? "border-purple-700 text-purple-900"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Candidate Reflection Sheet & Focus Plan</span>
                </button>
              )}
            </div>

            {/* TAB 1: QUESTION BREAKDOWN & MARK SCHEME */}
            {activeTab === "breakdown" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Inspect where marks were secured or dropped against examiner criteria</span>
                  <button
                    onClick={() => {
                      const allOpen: Record<string, boolean> = {};
                      questionList.forEach((q) => {
                        allOpen[q.id] = true;
                      });
                      setExpandedQuestions(allOpen);
                    }}
                    className="text-purple-700 hover:underline font-bold"
                  >
                    Expand All Questions
                  </button>
                </div>

                <div className="space-y-3">
                  {questionList.map((q, idx) => {
                    const awarded = marksMap[q.id] ?? 0;
                    const qMax = q.marks || 1;
                    const isFull = awarded === qMax;
                    const isPartial = awarded > 0 && awarded < qMax;
                    const studentAns = answersMap[q.id];
                    const isExpanded = expandedQuestions[q.id] ?? true;

                    return (
                      <div
                        key={q.id || idx}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isFull
                            ? "bg-white border-emerald-200"
                            : isPartial
                            ? "bg-white border-amber-200"
                            : "bg-white border-rose-200"
                        }`}
                      >
                        {/* Question Header Bar */}
                        <div
                          onClick={() => toggleQuestionExpand(q.id)}
                          className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isFull
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isPartial
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">
                                {q.title || `Question ${idx + 1}`}
                              </h4>
                              <span className="text-[11px] text-slate-500">
                                {q.unitName || q.unit || "Programming & Algorithms"} • {q.level || "Core"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {releaseSettings?.shareQuestionMarks !== false && (
                              <span
                                className={`text-xs font-black px-2.5 py-0.5 rounded-full border font-mono ${
                                  isFull
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : isPartial
                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                    : "bg-rose-100 text-rose-800 border-rose-300"
                                }`}
                              >
                                {awarded} / {qMax} Marks
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Collapsible Question Detail */}
                        {isExpanded && (
                          <div className="p-4 pt-1 border-t border-slate-100 space-y-3 text-xs">
                            {/* Brief / Task prompt */}
                            <div className="p-3 rounded-xl bg-slate-50 text-slate-700 leading-relaxed">
                              <strong className="block text-slate-900 mb-0.5 font-bold">Question Brief:</strong>
                              <p className="whitespace-pre-line">{q.brief}</p>
                            </div>

                            {/* Candidate's submitted response (If shareSubmissionsAndAnswers allowed) */}
                            {releaseSettings?.shareSubmissionsAndAnswers !== false && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                                  Your Submitted Response:
                                </span>
                                {typeof studentAns === "string" ? (
                                  <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                                    {studentAns || "(No response entered)"}
                                  </pre>
                                ) : Array.isArray(studentAns) ? (
                                  <div className="font-mono text-slate-800 font-bold">
                                    Selected Option Index: {JSON.stringify(studentAns)}
                                  </div>
                                ) : (
                                  <div className="text-slate-600 italic">
                                    {studentAns ? JSON.stringify(studentAns) : "(No response recorded)"}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Official Mark Scheme & Guidance (Only if teacher allowed shareSolutions and releaseSettings) */}
                            {assessment.shareSolutions === false ? (
                              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
                                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Examiner mark scheme and model solutions are withheld by your teacher for this in-class assessment.</span>
                              </div>
                            ) : releaseSettings?.shareMarkScheme !== false ? (
                              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                                <div className="flex items-center gap-1.5 text-purple-900 font-bold uppercase tracking-wider text-[11px]">
                                  <Award className="w-4 h-4 text-purple-700" />
                                  Official Mark Scheme & Examiner Takeaway:
                                </div>
                                <div className="text-purple-950 leading-relaxed font-sans text-xs whitespace-pre-line">
                                  {q.markScheme || q.hint || "Review core construct logic and validation conditions."}
                                </div>

                                {q.markPoints && q.markPoints.length > 0 && (
                                  <div className="pt-2 border-t border-purple-200/60 space-y-1">
                                    <span className="font-bold text-purple-900 text-[10px] uppercase tracking-wider block">
                                      Mark Allocation Criteria:
                                    </span>
                                    <ul className="list-disc pl-5 space-y-0.5 text-purple-900">
                                      {q.markPoints.map((mp: any, mIdx: number) => (
                                        <li key={mIdx}>
                                          <strong>{mp.marks} Mark{mp.marks > 1 ? "s" : ""}:</strong>{" "}
                                          {mp.criterion || mp.criteria || mp.c}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {!isFull && (
                                  <div className="mt-2 p-2 rounded-lg bg-white/80 border border-purple-200 text-purple-900 font-medium">
                                    💡 <strong>Examiner Advice:</strong>{" "}
                                    {isPartial
                                      ? "Double-check boundaries, operator syntax, and exact required case/format."
                                      : "Review this topic in the practice bank before your next timed exam."}
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: CANDIDATE REFLECTION SHEET */}
            {activeTab === "reflection" && releaseSettings?.shareReflectionSheet !== false && (
              <div className="pt-2">
                <StudentReflectionSheet
                  assessment={assessment}
                  studentName={studentName}
                  className={className}
                  submittedAt={submittedAt}
                  result={{
                    totalMarks: totalScore ?? 0,
                    maxMarks: maxScore,
                    percentage: percentage ?? 0,
                    marks: marksMap,
                    answers: answersMap,
                  }}
                  allTasks={allTasks}
                  teacherFeedback={studentData?.feedback}
                  reflectionData={studentData?.reflectionSheet}
                  isTeacherEditable={false}
                  onClose={() => setActiveTab("breakdown")}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
