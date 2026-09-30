import React, { useState } from "react";
import {
  Share2,
  CheckCircle2,
  X,
  Lock,
  Unlock,
  Eye,
  FileText,
  Award,
  BookOpen,
  Sparkles,
  MessageSquare,
  Users,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Assessment, ResultReleaseSettings, StudentSession } from "../../types";
import { teacherFetch } from "../../utils/teacherAuth";

interface ReleaseResultsModalProps {
  assessment: Assessment;
  students: StudentSession[];
  currentSettings?: ResultReleaseSettings;
  onClose: () => void;
  onSaved: (newSettings: ResultReleaseSettings) => void;
}

export const ReleaseResultsModal: React.FC<ReleaseResultsModalProps> = ({
  assessment,
  students,
  currentSettings,
  onClose,
  onSaved,
}) => {
  const [resultsReleased, setResultsReleased] = useState<boolean>(
    currentSettings?.resultsReleased ?? false
  );
  const [shareTotalScore, setShareTotalScore] = useState<boolean>(
    currentSettings?.shareTotalScore ?? true
  );
  const [shareQuestionMarks, setShareQuestionMarks] = useState<boolean>(
    currentSettings?.shareQuestionMarks ?? true
  );
  const [shareMarkScheme, setShareMarkScheme] = useState<boolean>(
    currentSettings?.shareMarkScheme ?? true
  );
  const [shareSubmissionsAndAnswers, setShareSubmissionsAndAnswers] = useState<boolean>(
    currentSettings?.shareSubmissionsAndAnswers ?? true
  );
  const [shareTeacherFeedback, setShareTeacherFeedback] = useState<boolean>(
    currentSettings?.shareTeacherFeedback ?? true
  );
  const [shareReflectionSheet, setShareReflectionSheet] = useState<boolean>(
    currentSettings?.shareReflectionSheet ?? true
  );

  const [audienceMode, setAudienceMode] = useState<"all" | "selected">(
    currentSettings?.releasedStudentIds && currentSettings.releasedStudentIds.length > 0
      ? "selected"
      : "all"
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    currentSettings?.releasedStudentIds || []
  );

  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const submittedStudents = students.filter((s) => s.status === "submitted");

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const applyPreset = (preset: "full" | "feedback_only" | "reflection_only") => {
    if (preset === "full") {
      setShareTotalScore(true);
      setShareQuestionMarks(true);
      setShareMarkScheme(true);
      setShareSubmissionsAndAnswers(true);
      setShareTeacherFeedback(true);
      setShareReflectionSheet(true);
    } else if (preset === "feedback_only") {
      setShareTotalScore(true);
      setShareQuestionMarks(true);
      setShareMarkScheme(false);
      setShareSubmissionsAndAnswers(true);
      setShareTeacherFeedback(true);
      setShareReflectionSheet(false);
    } else if (preset === "reflection_only") {
      setShareTotalScore(false);
      setShareQuestionMarks(false);
      setShareMarkScheme(true);
      setShareSubmissionsAndAnswers(true);
      setShareTeacherFeedback(true);
      setShareReflectionSheet(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorNotice(null);
    setSuccessNotice(null);

    const payload: ResultReleaseSettings = {
      resultsReleased,
      shareTotalScore,
      shareQuestionMarks,
      shareMarkScheme,
      shareSubmissionsAndAnswers,
      shareTeacherFeedback,
      shareReflectionSheet,
      releasedStudentIds: audienceMode === "selected" ? selectedStudentIds : undefined,
    };

    try {
      const res = await teacherFetch(`/api/assessments/${assessment.id}/release-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update release settings");
      }

      setSuccessNotice(
        resultsReleased
          ? "Assessment results and selected feedback components are now released to students!"
          : "Results locked. Students will see confidentiality notice until released."
      );
      onSaved(data.releaseSettings || payload);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorNotice(err.message || "Network error updating release settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-purple-200 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Result Release & Student Feedback Control
            </span>
            <h3 className="text-xl font-bold tracking-tight">
              Release Results: {assessment.title}
            </h3>
            <p className="text-xs text-purple-200/90">
              PIN Code: <span className="font-mono font-bold text-white">{assessment.code}</span> •{" "}
              {submittedStudents.length} Submitted Candidates
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Master Release Switch Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              resultsReleased
                ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20"
                : "bg-amber-50/80 border-amber-300"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    resultsReleased ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                  }`}
                >
                  {resultsReleased ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {resultsReleased ? "Results Released to Students" : "Results Locked (Confidential)"}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {resultsReleased
                      ? "Students can now view their performance, mark scheme corrections, and reflection sheet based on permissions below."
                      : "Marks and model answers remain confidential. Students see a 'Pending Teacher Release' notice."}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={resultsReleased}
                  onChange={(e) => setResultsReleased(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-13 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quick Configuration Presets:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyPreset("full")}
                className="px-3 py-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all text-left flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span>Full Release (All)</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("feedback_only")}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all text-left flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Marks & Notes Only</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("reflection_only")}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all text-left flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Reflection & Guidance</span>
              </button>
            </div>
          </div>

          {/* Selective Components Checklist */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Select What To Share With Students:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Total Score & 9-1 Grade */}
              <label className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/70 flex items-start gap-3 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={shareTotalScore}
                  onChange={(e) => setShareTotalScore(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-purple-700 focus:ring-purple-600 border-slate-300"
                />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">Total Score & 9–1 Grade</strong>
                  <span className="text-slate-500 text-[11px] leading-tight block mt-0.5">
                    Show total score ({assessment.maxMarks} marks), percentage, and Pearson GCSE grade.
                  </span>
                </div>
              </label>

              {/* 2. Question-by-Question Marks */}
              <label className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/70 flex items-start gap-3 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={shareQuestionMarks}
                  onChange={(e) => setShareQuestionMarks(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-purple-700 focus:ring-purple-600 border-slate-300"
                />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">Per-Question Marks</strong>
                  <span className="text-slate-500 text-[11px] leading-tight block mt-0.5">
                    Show the exact marks awarded for each individual question.
                  </span>
                </div>
              </label>

              {/* 3. Mark Scheme & Examiner Guidance */}
              <label className="p-3.5 rounded-2xl border border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 flex items-start gap-3 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={shareMarkScheme}
                  onChange={(e) => setShareMarkScheme(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-purple-700 focus:ring-purple-600 border-purple-300"
                />
                <div className="text-xs">
                  <strong className="text-purple-950 block font-bold">
                    Official Mark Scheme & Guidance
                  </strong>
                  <span className="text-purple-900/80 text-[11px] leading-tight block mt-0.5">
                    Show Pearson Edexcel mark scheme instructions, model criteria, and where marks were dropped.
                  </span>
                </div>
              </label>

              {/* 4. Student Answers & Test Corrections */}
              <label className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/70 flex items-start gap-3 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={shareSubmissionsAndAnswers}
                  onChange={(e) => setShareSubmissionsAndAnswers(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-purple-700 focus:ring-purple-600 border-slate-300"
                />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">Submissions & Test Checks</strong>
                  <span className="text-slate-500 text-[11px] leading-tight block mt-0.5">
                    Show candidate's entered code/answers, test cases passed, and trace differences.
                  </span>
                </div>
              </label>

              {/* 5. Teacher Feedback & AI Diagnostic */}
              <label className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/70 flex items-start gap-3 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={shareTeacherFeedback}
                  onChange={(e) => setShareTeacherFeedback(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-purple-700 focus:ring-purple-600 border-slate-300"
                />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">
                    Teacher Feedback & Commentary
                  </strong>
                  <span className="text-slate-500 text-[11px] leading-tight block mt-0.5">
                    Show teacher written notes and examiner diagnosis with priority 4CP0 topics.
                  </span>
                </div>
              </label>

              {/* 6. Post-Assessment Reflection Sheet */}
              <label className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/60 flex items-start gap-3 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={shareReflectionSheet}
                  onChange={(e) => setShareReflectionSheet(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-700 focus:ring-indigo-600 border-indigo-300"
                />
                <div className="text-xs">
                  <strong className="text-indigo-950 block font-bold">
                    Candidate Reflection Sheet
                  </strong>
                  <span className="text-indigo-900/80 text-[11px] leading-tight block mt-0.5">
                    Allow students to view and print the diagnostic reflection sheet & revision action plan.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Student Audience Selector */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Candidate Release Scope:
            </span>

            <div className="flex gap-4 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="audienceMode"
                  value="all"
                  checked={audienceMode === "all"}
                  onChange={() => setAudienceMode("all")}
                  className="text-purple-700 focus:ring-purple-600"
                />
                <span>All Candidates ({submittedStudents.length} Submitted)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="audienceMode"
                  value="selected"
                  checked={audienceMode === "selected"}
                  onChange={() => setAudienceMode("selected")}
                  className="text-purple-700 focus:ring-purple-600"
                />
                <span>Selected Candidates Only ({selectedStudentIds.length} Chosen)</span>
              </label>
            </div>

            {audienceMode === "selected" && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 max-h-40 overflow-y-auto space-y-1.5 text-xs">
                {submittedStudents.length === 0 ? (
                  <p className="text-slate-400 italic">No candidates have submitted yet.</p>
                ) : (
                  submittedStudents.map((s) => (
                    <label
                      key={s.studentId}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:bg-purple-50/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(s.studentId)}
                          onChange={() => toggleStudentSelection(s.studentId)}
                          className="w-4 h-4 rounded text-purple-700"
                        />
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          ({s.candidateNumber})
                        </span>
                      </div>
                      <span className="font-mono font-bold text-xs text-purple-900">
                        {s.totalMarks}/{s.maxMarks || assessment.maxMarks} Marks ({s.percentage}%)
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Notices */}
          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {errorNotice && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              resultsReleased
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                : "bg-purple-700 hover:bg-purple-800 shadow-purple-700/20"
            }`}
          >
            {saving ? (
              <span>Saving Permissions...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{resultsReleased ? "Save & Release Results" : "Save Lock Settings"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
