import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  X,
  BookOpen,
  Sparkles,
  LayoutDashboard,
  QrCode,
  Award,
  Layers,
  Code2,
  Bug,
  CheckCircle2,
  Users,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Database,
  Printer,
  FileSpreadsheet,
  Compass,
  ArrowRight,
  GraduationCap,
  Lightbulb,
  Clock,
  Lock,
  Cpu,
  Zap,
} from "lucide-react";
import { AppView } from "./Header";

interface AppFeatureHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView?: (view: AppView) => void;
  onOpenSpecGuide?: () => void;
}

type HelpCategory =
  | "quickstart"
  | "practice_ai"
  | "teacher_assessments"
  | "grade_boundaries"
  | "live_monitoring"
  | "student_portal"
  | "data_persistence"
  | "faq";

export const AppFeatureHelpModal: React.FC<AppFeatureHelpModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
  onOpenSpecGuide,
}) => {
  const [activeCategory, setActiveCategory] = useState<HelpCategory>("quickstart");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(
    () => [
      {
        id: "quickstart" as HelpCategory,
        label: "Quick Start Tour",
        icon: Compass,
        badge: "Overview",
        color: "text-blue-600 bg-blue-50 border-blue-200",
      },
      {
        id: "practice_ai" as HelpCategory,
        label: "Practice & AI Tutor",
        icon: Sparkles,
        badge: "1,000+ Questions",
        color: "text-purple-600 bg-purple-50 border-purple-200",
      },
      {
        id: "teacher_assessments" as HelpCategory,
        label: "Assessment Builder",
        icon: LayoutDashboard,
        badge: "Teacher",
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      },
      {
        id: "grade_boundaries" as HelpCategory,
        label: "Grade Boundaries (9–1)",
        icon: Award,
        badge: "Customizable",
        color: "text-amber-600 bg-amber-50 border-amber-200",
      },
      {
        id: "live_monitoring" as HelpCategory,
        label: "Live Exam Hall & Analytics",
        icon: Users,
        badge: "Real-Time",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      },
      {
        id: "student_portal" as HelpCategory,
        label: "Student Join & Results",
        icon: QrCode,
        badge: "PIN & QR",
        color: "text-cyan-600 bg-cyan-50 border-cyan-200",
      },
      {
        id: "data_persistence" as HelpCategory,
        label: "Data Saving & Reports",
        icon: Database,
        badge: "Permanent",
        color: "text-rose-600 bg-rose-50 border-rose-200",
      },
      {
        id: "faq" as HelpCategory,
        label: "FAQ & Troubleshooting",
        icon: HelpCircle,
        badge: "Answers",
        color: "text-slate-600 bg-slate-50 border-slate-200",
      },
    ],
    []
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-900/40">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Edexcel CS AutoGrader • Feature Guide & Manual
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 text-[11px] font-mono font-bold border border-purple-400/30">
                  Paper 1 & 2
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Complete walkthrough of student practice, AI scaffolding, teacher assessments, grade boundaries, and live analytics.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Nav */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. AI Scaffolding, Grade Boundaries, PIN, CSV)..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Jump to:</span>
            {onNavigateToView && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToView("practice");
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Practice</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToView("teacher");
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold border border-purple-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3 h-3" />
                  <span>Teacher</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToView("exam_join");
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <QrCode className="w-3 h-3" />
                  <span>Exam Hall</span>
                </button>
              </>
            )}
            {onOpenSpecGuide && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSpecGuide();
                }}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" />
                <span>4CP0 Spec</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Main Body with Sidebar + Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Category Sidebar */}
          <div className="w-56 sm:w-64 border-r border-slate-200 bg-slate-50/70 p-3 overflow-y-auto space-y-1 shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Feature Manual
            </div>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? "bg-purple-700 text-white shadow-sm shadow-purple-900/20"
                      : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-500 group-hover:text-purple-600"
                      }`}
                    />
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold shrink-0 ml-1 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/80 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-800"
                    }`}
                  >
                    {cat.badge}
                  </span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-200 px-3 space-y-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-900 block flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  Persistence Status
                </span>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  All exams, student code, marks, grade boundaries & reflections are permanently stored on server disk.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white">
            {/* 1. QUICK START TOUR */}
            {activeCategory === "quickstart" && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <Compass className="w-3.5 h-3.5" />
                    Quick Start Guide
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Welcome to the Edexcel Computer Science (4CP0) Platform
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Designed specifically for teachers and students following the Pearson Edexcel International GCSE (9–1) Computer Science specification, with full coverage of Paper 1 (Principles) and Paper 2 (Application of Computational Thinking & Python 3).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Flow */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        👨‍🎓
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-sm">For Students</h4>
                        <span className="text-[11px] text-emerald-700 font-medium">Practice & Exam Routine</span>
                      </div>
                    </div>
                    <ol className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span><strong>Practice Mode:</strong> Solve 1,000+ Python & SQL coding tasks, trace tables, and 20-marker synthesis questions with live automated grading.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span><strong>AI Scaffolding:</strong> If stuck on any step, use the 3-level AI Tutor for conceptual clues, step-by-step logic, syntax debugging, and improvement tips.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span><strong>Exam Hall & Results:</strong> Enter your teacher's 6-digit PIN or scan QR to sit formal exams, or look up released scorecards and mark schemes anytime.</span>
                      </li>
                    </ol>
                  </div>

                  {/* Teacher Flow */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        👩‍🏫
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-950 text-sm">For Teachers</h4>
                        <span className="text-[11px] text-purple-700 font-medium">Classwork & Assessment Suite</span>
                      </div>
                    </div>
                    <ol className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span><strong>Assessment Builder:</strong> Assemble timed exams or untimed formative practice tasks from the 1,000+ question bank or write custom problems.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span><strong>Set Grade Boundaries:</strong> Adjust the official (9–1) grade thresholds for each paper with one-click presets.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span><strong>Live Monitoring & Marking:</strong> Track student code real-time, override marks, generate AI diagnostics, and release results to students with full feedback.</span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Seven Core Pillars of the Platform
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                      <Code2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      <strong className="block text-slate-800 text-[11px]">1,000+ Questions</strong>
                      <span className="text-[10px] text-slate-500 block">Units U01 to U32</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                      <Sparkles className="w-4 h-4 text-purple-600 mx-auto" />
                      <strong className="block text-slate-800 text-[11px]">AI Scaffolding</strong>
                      <span className="text-[10px] text-slate-500 block">Struggle Support</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                      <Award className="w-4 h-4 text-amber-600 mx-auto" />
                      <strong className="block text-slate-800 text-[11px]">Custom (9–1) Grades</strong>
                      <span className="text-[10px] text-slate-500 block">Editable Boundaries</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                      <Database className="w-4 h-4 text-blue-600 mx-auto" />
                      <strong className="block text-slate-800 text-[11px]">Full Persistence</strong>
                      <span className="text-[10px] text-slate-500 block">Disk & Browser Saved</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRACTICE MODE & AI SCAFFOLDING */}
            {activeCategory === "practice_ai" && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Interactive Practice & AI Scaffolding
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Self-Paced Practice & Progressive Scaffolding Tutor
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Practice mode contains over 1,000 curriculum-aligned questions covering every unit of the Pearson Edexcel specification. When working on practice tasks, an intelligent pedagogical AI tutor assists students whenever they struggle.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border border-purple-200 rounded-2xl p-4.5 bg-purple-50/40 space-y-3">
                    <h4 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      How the 3-Level Progressive AI Scaffolding Works
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Unlike generic chatbots that spoil answers, the AI Scaffolding engine follows pedagogical principles by giving students just enough guidance to think through the problem:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1.5 shadow-xs">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Level 1: Concept Clue</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Explains the question in plain English, highlighting the core computational concept (e.g. Type Conversion, While Loops, String Slicing) without giving away code.
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1.5 shadow-xs">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Level 2: Logic Steps</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Deconstructs the algorithm into 3 to 5 sequential numbered steps (e.g. 1. Take input, 2. Convert type, 3. Check condition, 4. Print format).
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1.5 shadow-xs">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Level 3: Code Skeleton</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Provides structural syntax code with <code className="font-mono text-purple-900 bg-purple-50 px-1"># TODO:</code> placeholders, showing indentation patterns.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase">
                        <Bug className="w-4 h-4 text-rose-600" />
                        <span>"What Went Wrong?" Diagnostic</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        If student code hits a <code className="font-mono text-rose-700 bg-rose-50 px-1">SyntaxError</code>, <code className="font-mono text-rose-700 bg-rose-50 px-1">TypeError</code>, or fails an automated test case, a proactive banner triggers immediately to diagnose the exact error and explain the fix.
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                      <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span>"How to Improve" Exam Tips</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Guidance on Edexcel Paper 2 criteria: using meaningful variable names, casting numeric inputs, handling boundary conditions, and outputting exact strings without extra spaces.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Question Types Supported</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <strong className="block text-slate-800">Python Coding</strong>
                        <span className="text-[11px] text-slate-500">Run & test in browser</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <strong className="block text-slate-800">Trace Tables</strong>
                        <span className="text-[11px] text-slate-500">Step-by-step dry runs</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <strong className="block text-slate-800">Pseudocode to Code</strong>
                        <span className="text-[11px] text-slate-500">Edexcel Appendix 5</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <strong className="block text-slate-800">20-Marker Mastery</strong>
                        <span className="text-[11px] text-slate-500">Synthesis capstones</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TEACHER DASHBOARD & ASSESSMENT BUILDER */}
            {activeCategory === "teacher_assessments" && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Teacher Mode & Assessment Suite
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Creating & Assigning Papers and Practice Tasks
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Teachers can configure customized exams and formative practice tasks, generate 6-digit access codes or QR links, and track live student progress across cohorts.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Assignment Modes: "Practice Task" vs "Formal Assessment"
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                        <strong className="text-emerald-900 font-bold block flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-emerald-700" />
                          Practice Task Mode (Classwork / Homework)
                        </strong>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Students see live Python execution, automated test feedback on each question, and full access to the <strong>AI Practice Scaffolding & Live Tutor</strong>.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1">
                        <strong className="text-purple-900 font-bold block flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-purple-700" />
                          Formal Assessment Mode (Timed Mocks)
                        </strong>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Exam conditions: strict countdown timer, locked navigation tabs, confidential scoring until teacher moderation, and AI scaffolding disabled for exam integrity.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Step-by-Step: How to Create a New Assessment
                    </h4>
                    <ol className="list-decimal pl-4 text-xs text-slate-700 space-y-2">
                      <li>Go to <strong>Teacher Dashboard</strong> and click <strong>Create Assessment</strong>.</li>
                      <li>Select your mode: <strong>Practice Task</strong> or <strong>Formal Exam</strong>.</li>
                      <li>Pick questions from the 1,000+ question bank or upload custom questions with your own test suites and starter code.</li>
                      <li>Set duration, title, and customize the <strong>(9–1) Grade Boundaries</strong>.</li>
                      <li>Click <strong>Save & Publish Assessment</strong>. A unique <strong>6-digit PIN</strong> and <strong>QR code</strong> will be generated immediately for your students.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 4. GRADE BOUNDARIES */}
            {activeCategory === "grade_boundaries" && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <Award className="w-3.5 h-3.5" />
                    Setting & Modifying Grade Boundaries (9–1)
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Custom (9–1) Grade Thresholds Per Assessment
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Grade boundaries can be customized per assessment to match official Pearson Edexcel standards or tailored to your school's mock tiering.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Where Can You Set or Modify Boundaries?
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1">
                        <strong className="text-amber-950 font-bold block">1. In Assessment Builder</strong>
                        <p className="text-slate-600 text-[11px]">
                          When creating or editing any assessment, click the <strong>Grade Boundaries (9–1)</strong> panel to set thresholds before students begin.
                        </p>
                      </div>
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-1">
                        <strong className="text-indigo-950 font-bold block">2. In Live Exam Hall & Analytics</strong>
                        <p className="text-slate-600 text-[11px]">
                          Open any active or past assessment, click the <strong>"Grade Boundaries"</strong> button in the top action bar to adjust thresholds on the fly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <strong className="text-slate-900 font-bold block">Built-In One-Click Presets:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-800 block text-[11px]">Official Edexcel Standard</span>
                        <span className="text-[10px] text-slate-500">9: 78% • 8: 69% • 7: 60% • 4: 38%</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-800 block text-[11px]">Rigorous Mock / Extension</span>
                        <span className="text-[10px] text-slate-500">9: 88% • 8: 80% • 7: 72% • 4: 50%</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-800 block text-[11px]">Standard Linear Baseline</span>
                        <span className="text-[10px] text-slate-500">9: 90% • 8: 80% • 7: 70% • 4: 40%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Instant Dynamic Recalculation:</strong> Modifying grade boundaries automatically updates the live student table, cohort distribution graphs, performance trends, and the candidate's scorecard upon results release.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. LIVE EXAM HALL & MONITORING */}
            {activeCategory === "live_monitoring" && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    Live Exam Hall & Real-Time Monitoring
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Live Candidate Heartbeat, Grading & Moderation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Watch students take exams in real time, inspect their code, override auto-graded marks, and control when results are released.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                      <strong className="text-slate-900 font-bold block">1. Live Heartbeat</strong>
                      <p className="text-slate-600 text-[11px]">
                        See who is online, current question index, answered count, and active elapsed time.
                      </p>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                      <strong className="text-slate-900 font-bold block">2. Student Inspector</strong>
                      <p className="text-slate-600 text-[11px]">
                        Click any candidate row to review their submitted Python code, SQL, or trace table answers question-by-question.
                      </p>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                      <strong className="text-slate-900 font-bold block">3. Manual Overrides</strong>
                      <p className="text-slate-600 text-[11px]">
                        Teacher marks take priority. Adjust marks awarded and write custom comments on candidate work.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                    <h4 className="font-bold text-purple-950 uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      Results Release Controls
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Click <strong>Release Results</strong> in the live view to selectively configure what candidates see on their portal:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                      <li><strong>Share Total Score & Grade:</strong> Disclose overall percentage and GCSE (9–1) grade award.</li>
                      <li><strong>Share Question Marks:</strong> Disclose per-question point breakdown.</li>
                      <li><strong>Share Mark Scheme:</strong> Allow students to see official examiner solutions.</li>
                      <li><strong>Share Reflection Sheet:</strong> Allow students to complete and submit their post-exam self-reflection.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 6. STUDENT PORTAL & RESULTS LOOKUP */}
            {activeCategory === "student_portal" && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <QrCode className="w-3.5 h-3.5" />
                    Student Join & Results Lookup Portal
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Joining Exams and Retrieving Past Results Anytime
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Students can join active sessions via PIN or QR code, and retrieve their released results and mark schemes later with zero lost data.
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-700">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                      How Students Join Active Exams or Tasks
                    </h4>
                    <ol className="list-decimal pl-4 space-y-1.5">
                      <li>Click <strong>Exam Hall</strong> in the top header.</li>
                      <li>Enter the <strong>6-digit PIN</strong> provided by the teacher (e.g. <code className="font-mono bg-slate-100 px-1 font-bold">4CP025</code>) or click <strong>Scan QR Code</strong> with a device camera.</li>
                      <li>Enter Student Name, Class, and optional Candidate Number.</li>
                      <li>Click <strong>Start Assessment</strong>.</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2.5">
                    <h4 className="font-bold text-indigo-950 uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-700" />
                      Candidate Result & Mark Scheme Checker (For Later Use)
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Students don't need an account to view their marks later!
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-1">
                      <span className="font-bold text-indigo-900 block text-[11px]">How to Check Results Later:</span>
                      <p className="text-[11px] text-slate-600">
                        On the <strong>Exam Hall</strong> screen, click <strong>"Check Your Results / Mark Scheme"</strong>. Enter the assessment PIN and your candidate name. Once released by your teacher, your complete scorecard, examiner mark schemes, and reflection sheet appear instantly!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. DATA PERSISTENCE & REPORTS */}
            {activeCategory === "data_persistence" && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <Database className="w-3.5 h-3.5" />
                    Data Persistence & Exports
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Will All Data Be Saved on Both Teacher and Student Ends?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    <strong>Yes, completely.</strong> All assessments, student code, auto-graded marks, teacher comments, reflection sheets, and grade boundaries are saved permanently.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                      <div className="flex items-center gap-2 text-purple-900 font-bold uppercase">
                        <LayoutDashboard className="w-4 h-4 text-purple-700" />
                        <span>Teacher End Persistence</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                        <li>All created assessments stored to server disk (<code className="font-mono text-slate-800">data/assessments_db.json</code>).</li>
                        <li>Teacher custom questions and test suites (<code className="font-mono text-slate-800">data/custom_questions_db.json</code>).</li>
                        <li>Student submission records, scores, and reflection sheets.</li>
                        <li>Grade boundaries saved per assessment.</li>
                        <li>Survives server restarts and browser reloads.</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold uppercase">
                        <GraduationCap className="w-4 h-4 text-emerald-700" />
                        <span>Student End Persistence</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                        <li>Live in-exam progress auto-saved every keystroke to server.</li>
                        <li>Browser localStorage caches active candidate sessions.</li>
                        <li>Submitted answers and code stored permanently in teacher database.</li>
                        <li>Results retrieval anytime via 6-digit PIN & candidate name.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase text-xs">Export & Reporting Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <strong className="block text-slate-800 text-[11px]">Export Cohort CSV</strong>
                          <span className="text-[10px] text-slate-500">Download marks, percentages & awarded grades for Excel/SIMS.</span>
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
                        <Printer className="w-5 h-5 text-indigo-600 shrink-0" />
                        <div>
                          <strong className="block text-slate-800 text-[11px]">Print Official Scorecards</strong>
                          <span className="text-[10px] text-slate-500">Formal printable candidate statements with question marks.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. FAQ */}
            {activeCategory === "faq" && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Frequently Asked Questions
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Common Questions & Troubleshooting
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Quick solutions to common questions for teachers and students.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                    <strong className="text-xs font-bold text-slate-900 block">
                      Q: Can students see the solutions during a formal timed exam?
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      No. When set to <strong>Assessment</strong> mode, the server strictly sanitizes question payloads. Mark schemes, test answers, and explanations are completely stripped before reaching the student. They only become visible after the teacher clicks <strong>Release Results</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                    <strong className="text-xs font-bold text-slate-900 block">
                      Q: How does the in-browser Python runner work?
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      The application embeds an official Python 3 runtime directly in the browser via Pyodide/Web Workers. It handles input prompts, standard output, and tests against automated suites with a 5-second timeout to prevent infinite loops.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                    <strong className="text-xs font-bold text-slate-900 block">
                      Q: What happens if a student accidentally closes their browser tab during an exam?
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Progress is continuously synced to the server. The student can simply reopen the app, enter the same 6-digit PIN and their name, and they will automatically reconnect to their existing session with all previously entered code and answers intact.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                    <strong className="text-xs font-bold text-slate-900 block">
                      Q: Can teachers add their own programming problems or unit tests?
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Yes! In Teacher Mode, use the <strong>Custom Question Creator</strong> to add new coding tasks, test cases, model answers, and mark schemes. Custom questions are saved permanently to disk and can be included in any assessment.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pearson Edexcel International GCSE (9–1) Computer Science Specification 4CP0</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
