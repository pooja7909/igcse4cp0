import React, { useState } from "react";
import {
  Search,
  X,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { StudentResultPortal } from "./StudentResultPortal";
import { IGCSETask } from "../../types";

interface StudentResultLookupModalProps {
  onClose: () => void;
  allTasks?: Record<string, IGCSETask>;
}

export const StudentResultLookupModal: React.FC<StudentResultLookupModalProps> = ({
  onClose,
  allTasks = {},
}) => {
  const [pinCode, setPinCode] = useState("");
  const [studentIdentifier, setStudentIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim() || !studentIdentifier.trim()) {
      setErrorMsg("Please enter both the Assessment PIN and your Name");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/assessments/lookup-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: pinCode.trim(),
          candidateNumber: studentIdentifier.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not find student submission for this PIN");
      }

      setResultData(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Network error looking up results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-purple-200 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              Student Result & Mark Scheme Checker
            </span>
            <h3 className="text-xl font-bold tracking-tight">
              {resultData ? resultData.assessment?.title : "Check Your Assessment Results"}
            </h3>
            <p className="text-xs text-purple-200/90">
              Enter your assessment test code and registered student name to view your individual released marks and examiner mark scheme.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!resultData ? (
            <form onSubmit={handleLookup} className="space-y-4 max-w-md mx-auto py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Assessment PIN / Access Code:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 4CP025 or ZKKZNK"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono font-bold text-center tracking-widest text-lg uppercase focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Student Name:
                </label>
                <input
                  type="text"
                  value={studentIdentifier}
                  onChange={(e) => setStudentIdentifier(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center font-semibold text-base focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? "Searching Submissions..." : "Find My Released Results"}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 bg-slate-50 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-600 font-medium">Candidate Result Verified:</span>
                  <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {resultData.student?.name || studentIdentifier}
                  </span>
                  <span className="font-mono text-purple-700 font-bold text-[11px] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Test Code: {pinCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Done & Close</span>
                </button>
              </div>

              <StudentResultPortal
                assessment={resultData.assessment}
                studentId={resultData.student?.studentId}
                candidateNumber={resultData.student?.candidateNumber || studentIdentifier}
                studentName={resultData.student?.name || studentIdentifier}
                className={resultData.student?.className}
                submittedAt={resultData.student?.submittedAt}
                initialResult={resultData}
                allTasks={allTasks}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
