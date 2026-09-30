import React, { useEffect } from "react";
import { Assessment, IGCSETask, MarkResult } from "../../types";
import confetti from "canvas-confetti";
import { getEdexcelGrade } from "../../utils/gradeBoundaries";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Printer,
  Sparkles,
} from "lucide-react";

interface ExamResultsProps {
  assessment: Assessment;
  result: {
    marks: Record<string, number>;
    totalMarks: number;
    maxMarks: number;
    percentage: number;
    answers: Record<string, any>;
    detailedResults: Record<string, MarkResult>;
  };
  studentName: string;
  candidateNumber: string;
  onReturnToPractice: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  assessment,
  result,
  studentName,
  candidateNumber,
  onReturnToPractice,
}) => {
  const isTask = assessment.type === "task";

  const gradeInfo = getEdexcelGrade(
    result.percentage,
    assessment.gradeBoundaries,
    result.maxMarks || assessment.maxMarks
  );

  useEffect(() => {
    // Only celebrate with confetti for tasks where score is visible
    if (isTask && result.percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [isTask, result.percentage]);

  // ASSESSMENT MODE: Student must NOT see autograded marks. Only teacher can see them.
  if (!isTask) {
    return (
      <div className="max-w-2xl mx-auto my-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-100 text-purple-800">
              Pearson Edexcel 4CP0 Formal Assessment
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Examination Paper Submitted
            </h2>
            <p className="text-xs text-slate-500">
              {assessment.title}
            </p>
          </div>

          {/* Official Candidate Submission Receipt */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{studentName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Assessment PIN:</span>
              <span className="font-mono font-bold text-purple-700">{assessment.code}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Submission Timestamp:</span>
              <span className="font-mono text-slate-700">{new Date().toLocaleTimeString()} • {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Submission Status:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Received & Transmitted
              </span>
            </div>
          </div>

          {/* Secure Teacher-Only Notice */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-left text-xs space-y-1">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Teacher-Only Assessment Mark Scheme
            </span>
            <p className="text-amber-800 leading-relaxed">
              In accordance with examination guidelines, autograded marks, grade awards, and question marks are reserved strictly for your teacher. Your teacher has received your submission in the teacher dashboard.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Submission Receipt
            </button>
            <button
              onClick={onReturnToPractice}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all"
            >
              Close Exam Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TASK MODE: Student is completing a classwork practice task; they see their marks, grade, and feedback!
  return (
    <div className="max-w-3xl mx-auto my-6 space-y-6">
      {/* Result Hero Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Official Auto-Marked Examination Report
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {assessment.title}
          </h2>
          <p className="text-xs text-slate-500">
            Candidate: <strong>{studentName}</strong> • Candidate No:{" "}
            <strong>{candidateNumber}</strong>
          </p>
        </div>

        {/* Grade & Score Big Display */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-4">
          <div className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Auto-Graded Mark
            </span>
            <div className="text-4xl font-black text-slate-900 mt-1 font-mono">
              {result.totalMarks} <span className="text-xl font-normal text-slate-400">/ {result.maxMarks}</span>
            </div>
            <span className="text-xs font-bold text-slate-600 mt-1 block">
              {result.percentage}% Overall
            </span>
          </div>

          <div className={`border px-6 py-4 rounded-2xl ${gradeInfo.color}`}>
            <span className="text-xs font-semibold uppercase tracking-wider block">
              Pearson Edexcel (9–1) Award
            </span>
            <div className="text-4xl font-black mt-1 tracking-tight">
              Grade {gradeInfo.grade}
            </div>
            <span className="text-xs font-medium mt-1 block">
              {gradeInfo.label}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Results Report
          </button>
          <button
            onClick={onReturnToPractice}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all"
          >
            <BookOpen className="w-4 h-4" /> Back to Practice Bank
          </button>
        </div>
      </div>

      {/* Question Breakdown */}
      {assessment.showScoreImmediately && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Detailed Question Auto-Marking Breakdown:
          </h3>

          <div className="space-y-3">
            {(assessment.questionIds || []).map((qId, i) => {
              const awarded = result.marks ? result.marks[qId] ?? 0 : 0;
              const detail = result.detailedResults ? result.detailedResults[qId] : undefined;
              const ans = result.answers ? result.answers[qId] : undefined;

              return (
                <div key={qId} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      Question {i + 1}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        awarded > 0
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {awarded} Marks Awarded
                    </span>
                  </div>

                  {detail?.feedback && (
                    <p className="text-xs text-slate-600 italic">
                      {detail.feedback}
                    </p>
                  )}

                  {ans !== undefined && (
                    <div className="text-xs text-slate-500 font-mono bg-white p-2.5 rounded border border-slate-200 overflow-x-auto">
                      <strong>Submitted: </strong>
                      {typeof ans === "string" ? ans : JSON.stringify(ans)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
