import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Assessment } from "../types";
import {
  GraduationCap,
  LayoutDashboard,
  QrCode,
  BookOpen,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  ShieldCheck,
  LogOut,
  HelpCircle,
  Edit2,
  RotateCcw,
  Save,
  X,
} from "lucide-react";

export type AppView = "practice" | "teacher" | "exam_join" | "exam_active";

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  activeExamCount: number;
  isExamInProgress: boolean;
  isExamFinished?: boolean;
  studentName?: string;
  className?: string;
  activeAssessment?: Assessment | null;
  onOpenSpecGuide?: () => void;
  onOpenHelpGuide?: () => void;
  isTeacherAuthenticated?: boolean;
  onTeacherLogout?: () => void;
  dedicatedStudentMode?: { type: "task" | "assessment"; title?: string } | null;
  onExitDedicatedMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  activeExamCount,
  isExamInProgress,
  isExamFinished = false,
  studentName,
  className,
  activeAssessment,
  onOpenSpecGuide,
  onOpenHelpGuide,
  isTeacherAuthenticated,
  onTeacherLogout,
  dedicatedStudentMode,
  onExitDedicatedMode,
}) => {
  const isDedicatedTask = dedicatedStudentMode?.type === "task" || activeAssessment?.type === "task";

  // Dynamic institution header customized by teacher for each assessment or globally
  const [globalBrandTitle, setGlobalBrandTitle] = useState(() => {
    return localStorage.getItem("edexcel_custom_brand_title") || "Edexcel CS AutoGrader";
  });
  const [globalBrandBadge, setGlobalBrandBadge] = useState(() => {
    return localStorage.getItem("edexcel_custom_brand_badge") || "4CP0 (9–1)";
  });
  const [globalBrandSubtitle, setGlobalBrandSubtitle] = useState(() => {
    return localStorage.getItem("edexcel_custom_brand_subtitle") || "Pearson Edexcel Papers 1 & 2 • Auto-marked assessment & analytics";
  });

  const [isHeaderEditModalOpen, setIsHeaderEditModalOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState(globalBrandTitle);
  const [tempBadge, setTempBadge] = useState(globalBrandBadge);
  const [tempSubtitle, setTempSubtitle] = useState(globalBrandSubtitle);

  const customBanner = activeAssessment?.customHeaderBanner;
  const customSubtitle = activeAssessment?.customInstructions || activeAssessment?.customSubtitle;

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = tempTitle.trim() || "Edexcel CS AutoGrader";
    const cleanBadge = tempBadge.trim() || "4CP0 (9–1)";
    const cleanSubtitle = tempSubtitle.trim() || "Pearson Edexcel Papers 1 & 2 • Auto-marked assessment & analytics";

    setGlobalBrandTitle(cleanTitle);
    setGlobalBrandBadge(cleanBadge);
    setGlobalBrandSubtitle(cleanSubtitle);

    localStorage.setItem("edexcel_custom_brand_title", cleanTitle);
    localStorage.setItem("edexcel_custom_brand_badge", cleanBadge);
    localStorage.setItem("edexcel_custom_brand_subtitle", cleanSubtitle);
    setIsHeaderEditModalOpen(false);
  };

  const handleResetHeader = () => {
    const cleanTitle = "Edexcel CS AutoGrader";
    const cleanBadge = "4CP0 (9–1)";
    const cleanSubtitle = "Pearson Edexcel Papers 1 & 2 • Auto-marked assessment & analytics";

    setTempTitle(cleanTitle);
    setTempBadge(cleanBadge);
    setTempSubtitle(cleanSubtitle);
    setGlobalBrandTitle(cleanTitle);
    setGlobalBrandBadge(cleanBadge);
    setGlobalBrandSubtitle(cleanSubtitle);

    localStorage.removeItem("edexcel_custom_brand_title");
    localStorage.removeItem("edexcel_custom_brand_badge");
    localStorage.removeItem("edexcel_custom_brand_subtitle");
    setIsHeaderEditModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand - Supports Teacher Custom Header Every Time */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ${
            isDedicatedTask
              ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-700/20"
              : isExamInProgress || dedicatedStudentMode
              ? "bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-600 shadow-purple-700/20"
              : "bg-gradient-to-br from-blue-700 via-indigo-600 to-teal-600 shadow-blue-700/20"
          }`}>
            {isDedicatedTask ? <Sparkles className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                {customBanner || globalBrandTitle}
              </span>
              <span className={`inline-block text-[11px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                isDedicatedTask
                  ? "bg-emerald-100 text-emerald-800"
                  : isExamInProgress || dedicatedStudentMode
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}>
                {isDedicatedTask ? "Practice Task" : isExamInProgress ? "Assessment" : globalBrandBadge}
              </span>

              {/* Quick Teacher Header Edit Button: Only visible to authenticated teachers in Teacher Portal */}
              {isTeacherAuthenticated && currentView === "teacher" && !isExamInProgress && !dedicatedStudentMode && (
                <button
                  type="button"
                  onClick={() => {
                    setTempTitle(globalBrandTitle);
                    setTempBadge(globalBrandBadge);
                    setTempSubtitle(globalBrandSubtitle);
                    setIsHeaderEditModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200 transition-colors cursor-pointer"
                  title="Click to edit school title, badge, or subtitle"
                >
                  <Edit2 className="w-3 h-3 text-purple-600" />
                  <span>Edit Header</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {customSubtitle
                ? customSubtitle
                : isDedicatedTask
                ? "Interactive student classwork assignment with live tests and hints"
                : isExamInProgress || dedicatedStudentMode
                ? (activeAssessment?.title || "In-class assessment in progress")
                : globalBrandSubtitle}
            </p>
          </div>
        </div>

        {/* ISOLATED STUDENT VIEW: When exam submission is complete */}
        {isExamFinished ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Submission Complete</span>
            </div>

            {studentName && (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <span className="text-[11px] text-slate-500 block">Student</span>
                  <span className="text-xs font-bold text-slate-900">
                    {studentName} {className ? `(${className})` : ""}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner text-white bg-emerald-600">
                  {studentName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {onExitDedicatedMode && (
              <button
                id="header-exit-session-btn"
                type="button"
                onClick={onExitDedicatedMode}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                title="Exit session and return to main portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Session</span>
              </button>
            )}
          </div>
        ) : dedicatedStudentMode || isExamInProgress || (currentView === "exam_join" && !isTeacherAuthenticated) ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              isDedicatedTask
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-purple-50 border-purple-200 text-purple-800"
            }`}>
              <Lock className="w-3.5 h-3.5" />
              <span>
                {isDedicatedTask
                  ? "Assigned Classwork Task"
                  : isExamInProgress
                  ? "In-Class Assessment Mode"
                  : "Student Examination Portal"}
              </span>
            </div>

            {studentName && (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Student</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {studentName} {className ? `(${className})` : ""}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner text-white ${
                  isDedicatedTask ? "bg-emerald-600" : "bg-purple-600"
                }`}>
                  {studentName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {onExitDedicatedMode && isExamInProgress && (
              <button
                id="header-exit-dedicated-btn"
                type="button"
                onClick={onExitDedicatedMode}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Exit assessment and return to student sign-in"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Exit</span>
              </button>
            )}
          </div>
        ) : (
          /* Normal View Navigation Tabs: Teacher Mode is HIDDEN from casual student view */
          <div className="flex items-center gap-3">
            {onOpenHelpGuide && (
              <button
                id="header-help-guide-btn"
                type="button"
                onClick={onOpenHelpGuide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all shadow-2xs cursor-pointer group"
                title="Help & Feature Guide"
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-600 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Guide</span>
              </button>
            )}

            {onOpenSpecGuide && (
              <button
                onClick={onOpenSpecGuide}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                title="View Pearson Edexcel 4CP0 Specification & Pseudocode Reference"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Spec Guide</span>
              </button>
            )}

            {/* Student Navigation Strip */}
            <nav className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => onViewChange("practice")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentView === "practice"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Practice</span>
              </button>

              <button
                onClick={() => onViewChange("exam_join")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentView === "exam_join"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>In-Class Assessment</span>
              </button>

              <button
                id="header-tab-teacher"
                onClick={() => onViewChange("teacher")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentView === "teacher"
                    ? "bg-purple-700 text-white shadow-sm"
                    : isTeacherAuthenticated
                    ? "bg-purple-100 text-purple-900 hover:bg-purple-200"
                    : "text-purple-700 hover:text-purple-950 hover:bg-purple-50"
                }`}
                title="Teacher Portal: Manage questions, view live monitor, set tasks and exams"
              >
                <LayoutDashboard className={`w-4 h-4 ${currentView === "teacher" ? "text-amber-300" : "text-purple-600"}`} />
                <span>Teacher Portal</span>
                {isTeacherAuthenticated ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Faculty Authenticated" />
                ) : (
                  <span className="text-[10px] font-normal text-purple-600 border border-purple-200 bg-white px-1.5 py-0.2 rounded hidden xl:inline">
                    Staff
                  </span>
                )}
              </button>
            </nav>

            {/* Lock Teacher Portal Button: Only shown when teacher is logged in */}
            {isTeacherAuthenticated && onTeacherLogout && (
              <button
                type="button"
                onClick={onTeacherLogout}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Lock Teacher Portal & Return to Student View"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Lock Portal</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Teacher Global Header Customizer Modal - Portal to document.body to ensure it renders on top of everything */}
      {isHeaderEditModalOpen && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsHeaderEditModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 my-auto max-h-[85vh] overflow-y-auto z-[100000]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Customize Header & School Branding</h3>
                  <p className="text-xs text-slate-500">Update the top app header shown to teachers and students</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHeaderEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeader} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  School / App Title:
                </label>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="e.g. Edexcel CS AutoGrader or St. Jude's High School"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
                />
                <span className="text-[11px] text-slate-400">
                  File location: <code className="text-purple-700 font-mono">src/components/Header.tsx</code> (Line 79)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Badge Text:
                  </label>
                  <input
                    type="text"
                    value={tempBadge}
                    onChange={(e) => setTempBadge(e.target.value)}
                    placeholder="e.g. 4CP0 (9–1) or Year 11"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Browser Tab Title:
                  </label>
                  <input
                    type="text"
                    disabled
                    value="index.html (<title> tag)"
                    className="w-full px-3.5 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Subtitle / Department Notice:
                </label>
                <input
                  type="text"
                  value={tempSubtitle}
                  onChange={(e) => setTempSubtitle(e.target.value)}
                  placeholder="e.g. Computer Science Dept • Auto-marked assessment & analytics"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Header Live Preview:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {tempTitle || "Edexcel CS AutoGrader"}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {tempBadge || "4CP0 (9–1)"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {tempSubtitle || "Pearson Edexcel Papers 1 & 2 • Auto-marked assessment & analytics"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetHeader}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsHeaderEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Header</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
