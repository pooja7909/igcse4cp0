import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Clock, FileCheck, ArrowRight, BookOpen, Lock, Sparkles, Eye, Share2, LogOut } from "lucide-react";
import { Assessment, IGCSETask } from "../../types";
import { StudentReflectionSheet } from "./StudentReflectionSheet";
import { StudentResultPortal } from "./StudentResultPortal";

interface StudentSubmissionConfirmationProps {
  assessment: Assessment;
  studentId?: string;
  studentName: string;
  candidateNumber?: string;
  className?: string;
  submittedAt: number;
  questionCount: number;
  result?: {
    totalMarks: number;
    maxMarks: number;
    percentage: number;
    marks?: Record<string, number>;
    answers?: Record<string, any>;
    detailedResults?: Record<string, any>;
  } | null;
  allTasks?: Record<string, IGCSETask>;
  onReturnToHome: () => void;
}

export const StudentSubmissionConfirmation: React.FC<StudentSubmissionConfirmationProps> = ({
  assessment,
  studentId,
  studentName,
  candidateNumber,
  className,
  submittedAt,
  questionCount,
  result,
  allTasks = {},
  onReturnToHome,
}) => {
  const isTask = assessment.type === "task";
  const showScore = isTask || assessment.showScoreImmediately;
  const canViewSolutions = isTask || assessment.shareSolutions || assessment.showScoreImmediately;
  const [showResultPortal, setShowResultPortal] = useState(Boolean(canViewSolutions));
  const receiptCode = `4CP0-${assessment.code || "EXAM"}-${Math.abs(submittedAt).toString(36).toUpperCase().slice(-5)}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-8">
        {/* Success Badge */}
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-inner ${
          isTask ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
        }`}>
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isTask ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-purple-50 text-purple-800 border-purple-200"
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            {isTask ? "Practice Task Completed & Submitted" : "Examination Submission Recorded"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTask ? "Task Completed Successfully!" : "Response Received Successfully"}
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your responses for <strong>{assessment.title}</strong> have been submitted directly to your teacher.
          </p>
        </div>

        {/* Score Card (Shown when showScoreImmediately is true or for practice tasks) */}
        {showScore && result && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 block">
              {isTask ? "Practice Task Result" : "Assessment Result"}
            </span>
            <div className="text-3xl font-extrabold text-purple-900 font-mono">
              {result.totalMarks} <span className="text-lg font-normal text-purple-600">/ {result.maxMarks} Marks</span>
            </div>
            <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900">
              {result.percentage}% Overall Score
            </span>
          </div>
        )}

        {/* Submission Receipt Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Submission Details
            </span>
            <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              Receipt: {receiptCode}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Student</span>
              <span className="font-bold text-slate-800 text-sm">{studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Class Group</span>
              <span className="font-bold text-slate-800">{className || "Class 1"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Questions Completed</span>
              <span className="font-bold text-slate-800">{questionCount} Questions</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Submission Timestamp</span>
              <span className="font-semibold text-slate-700">
                {new Date(submittedAt).toLocaleDateString()} at {new Date(submittedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Return Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-slate-200">
          {canViewSolutions && (
            <button
              type="button"
              onClick={() => setShowResultPortal(!showResultPortal)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer border border-purple-200"
            >
              <Eye className="w-4 h-4" />
              <span>{showResultPortal ? "Hide Detailed Results" : "View Results & Mark Scheme"}</span>
            </button>
          )}

          <button
            id="finish-and-close-session-btn"
            type="button"
            onClick={onReturnToHome}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer ${
              isTask
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 active:bg-emerald-800"
                : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20 active:bg-black"
            }`}
          >
            {isTask ? (
              <>
                <LogOut className="w-4 h-4" />
                <span>Exit Task Session</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Exit Exam Session</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Your answers have been securely recorded and sent to your teacher. Clicking <strong>Exit {isTask ? "Task" : "Exam"} Session</strong> closes this workstation session and returns to your candidate screen.
        </p>
      </div>

      {/* Embedded Detailed Results & Mark Scheme Portal */}
      {showResultPortal && (
        <StudentResultPortal
          assessment={assessment}
          studentId={studentId}
          studentName={studentName}
          candidateNumber={candidateNumber}
          className={className}
          submittedAt={submittedAt}
          initialResult={result}
          allTasks={allTasks}
        />
      )}
    </div>
  );
};
