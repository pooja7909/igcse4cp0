import React, { useState, useMemo } from "react";
import { IGCSEUnit, IGCSETask, MarkResult } from "../types";
import { QuestionCard } from "./QuestionCard";
import {
  getUnitPaper,
  getPaper2TaskStyle,
  PAPER_2_STYLES,
  Paper2QuestionStyle,
  EdexcelPaper,
} from "../utils/examPaperStyles";
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Award,
  ChevronRight,
  Code2,
  Sparkles,
  HelpCircle,
  FileText,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  Clock,
  ShieldAlert,
  Flame,
  Binary,
  Globe,
  HardDrive,
  Scale,
  BrainCircuit,
} from "lucide-react";

interface PracticeModeProps {
  units: IGCSEUnit[];
  allTasks: Record<string, IGCSETask>;
  onOpenHelpGuide?: () => void;
  allowCopyPaste?: boolean;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  units,
  allTasks,
  onOpenHelpGuide,
  allowCopyPaste,
}) => {
  // Active Paper: default is "Paper 2" (Onscreen Python programming)
  const [selectedPaper, setSelectedPaper] = useState<EdexcelPaper>("Paper 2");

  // Filter units by paper
  const paperUnits = useMemo(() => {
    return units.filter((u) => getUnitPaper(u) === selectedPaper);
  }, [units, selectedPaper]);

  const [selectedUnitCode, setSelectedUnitCode] = useState<string>(() => {
    const firstP2 = units.find((u) => getUnitPaper(u) === "Paper 2");
    return firstP2?.code || "U01";
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [questionStyleFilter, setQuestionStyleFilter] = useState<Paper2QuestionStyle>("all");
  const [isAssessmentMode, setIsAssessmentMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, MarkResult>>({});

  // When switching paper, ensure an appropriate unit is selected
  const handleSelectPaper = (paper: EdexcelPaper) => {
    setSelectedPaper(paper);
    const available = units.filter((u) => getUnitPaper(u) === paper);
    if (available.length > 0) {
      setSelectedUnitCode(available[0].code);
      if (available[0].tasks && available[0].tasks[0]) {
        setSelectedTaskId(available[0].tasks[0].id);
      }
    }
  };

  const activeUnit = paperUnits.find((u) => u.code === selectedUnitCode) || paperUnits[0] || units[0];

  // Filter tasks within active unit
  const filteredTasks = useMemo(() => {
    if (!activeUnit) return [];
    return (activeUnit.tasks || []).filter((task) => {
      if (levelFilter !== "all" && task.level !== levelFilter) return false;
      if (selectedPaper === "Paper 2" && questionStyleFilter !== "all") {
        const style = getPaper2TaskStyle(task);
        if (style !== questionStyleFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(q) ||
          task.brief.toLowerCase().includes(q) ||
          (task.unit && task.unit.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeUnit, levelFilter, questionStyleFilter, searchQuery, selectedPaper]);

  const currentTask =
    (selectedTaskId && allTasks[selectedTaskId]) ||
    filteredTasks[0] ||
    activeUnit?.tasks[0];

  const handleAnswerChange = (newAns: any) => {
    if (!currentTask) return;
    setAnswers((prev) => ({
      ...prev,
      [currentTask.id]: newAns,
    }));
  };

  const handleCheck = (result: MarkResult) => {
    if (!currentTask) return;
    setResults((prev) => ({
      ...prev,
      [currentTask.id]: result,
    }));
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* SECTION 1: TWO MAIN HEADINGS - PAPER 1 & PAPER 2                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* HEADING 1: PAPER 1 (WRITTEN THEORY) */}
        <button
          type="button"
          onClick={() => handleSelectPaper("Paper 1")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            selectedPaper === "Paper 1"
              ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-500 text-white shadow-lg ring-2 ring-indigo-500/40"
              : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                selectedPaper === "Paper 1"
                  ? "bg-indigo-500/30 text-indigo-200 border border-indigo-400/40"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              Paper 1 • 4CP0/01
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                selectedPaper === "Paper 1"
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              Queued / Work Next
            </span>
          </div>

          <h3
            className={`text-lg font-black tracking-tight mt-2.5 ${
              selectedPaper === "Paper 1" ? "text-white" : "text-slate-900"
            }`}
          >
            Paper 1: Principles of Computer Science
          </h3>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              selectedPaper === "Paper 1" ? "text-indigo-200/90" : "text-slate-500"
            }`}
          >
            Written Paper (2 Hours • 80 Marks • 50%) • Computational Thinking, Algorithms, Data Representation, Systems Hardware, Networks & Ethics.
          </p>
        </button>

        {/* HEADING 2: PAPER 2 (ONSCREEN PYTHON) */}
        <button
          type="button"
          onClick={() => handleSelectPaper("Paper 2")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            selectedPaper === "Paper 2"
              ? "bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/40"
              : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                selectedPaper === "Paper 2"
                  ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              Paper 2 • 4CP0/02
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                selectedPaper === "Paper 2"
                  ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-emerald-100 text-emerald-800 font-extrabold"
              }`}
            >
              Active • Live Python Runner
            </span>
          </div>

          <h3
            className={`text-lg font-black tracking-tight mt-2.5 ${
              selectedPaper === "Paper 2" ? "text-white" : "text-slate-900"
            }`}
          >
            Paper 2: Application of Computational Thinking
          </h3>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              selectedPaper === "Paper 2" ? "text-emerald-200/90" : "text-slate-500"
            }`}
          >
            Onscreen Practical (3 Hours • 80 Marks • 50%) • Browser Python 3 Runner, Automated Test Cases, Code Refactoring, Bug Fixing, CSV Files & 20-Markers.
          </p>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PAPER 1 VIEW: STATUS & ROADMAP (WORKING ON THIS LATER)                    */}
      {/* ========================================================================= */}
      {selectedPaper === "Paper 1" && (
        <div className="space-y-6">
          {/* Paper 1 Working Notice Banner */}
          <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-purple-50 border border-indigo-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Paper 1: Principles of Computer Science
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pearson Edexcel International GCSE (9–1) Computer Science • Specification 4CP0/01
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPaper("Paper 2")}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Switch to Paper 2 (Onscreen Python)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Development Roadmap Callout */}
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs space-y-1.5">
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-800 block">
                📌 Roadmap Notice
              </span>
              <p className="leading-relaxed">
                As requested, we will focus on building out and expanding <strong>Paper 1</strong> questions and units next. Teachers can also upload upcoming past paper PDFs and mark schemes directly via the <strong>Question Uploader</strong>.
              </p>
              <p className="text-amber-800">
                Below is the official Pearson Edexcel 4CP0 Paper 1 syllabus framework. You can preview available Paper 1 questions or toggle back to Paper 2 above for live coding practice.
              </p>
            </div>

            {/* Paper 1 Syllabus Topic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Topic 1: Problem Solving & Algorithms</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pseudocode, flowcharts, trace tables, linear vs binary search, bubble sort and merge sort algorithms.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  <Binary className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Topic 3: Data Representation</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Binary, hexadecimal, two&apos;s complement integers, ASCII / Unicode character sets, sound digitization, and image bitmap representation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                  <HardDrive className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Topic 4: Computers & Hardware</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Von Neumann architecture, fetch-decode-execute cycle, CPU registers, RAM/ROM, secondary storage hierarchy, and systems software.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Topic 5: Communication & Networks</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Star and mesh topologies, packet switching, TCP/IP stack, DNS, network protocols, cyber security threats, and defensive countermeasures.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  <Scale className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Topic 6: The Bigger Picture</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Environmental impact (e-waste, data center energy), ethical questions, privacy, Computer Misuse Act, and GDPR legislation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-2xs space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                    Interactive Python Coding
                  </span>
                  <h4 className="text-xs font-bold text-emerald-950 mt-1">Ready to code for Paper 2?</h4>
                  <p className="text-[11px] text-emerald-700 leading-relaxed mt-0.5">
                    Paper 2 includes our fully interactive browser Python runner, auto-tests, trace tables, and AI scaffolding.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectPaper("Paper 2")}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Start Paper 2 Python Practice →
                </button>
              </div>
            </div>
          </div>

          {/* Paper 1 Available Units Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Paper 1 Unit Bank Preview
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {activeUnit ? `${activeUnit.code}: ${activeUnit.title}` : "Select a Paper 1 Unit"}
              </h3>
            </div>

            <select
              value={selectedUnitCode}
              onChange={(e) => {
                setSelectedUnitCode(e.target.value);
                const nextUnit = paperUnits.find((u) => u.code === e.target.value);
                if (nextUnit && nextUnit.tasks && nextUnit.tasks[0]) {
                  setSelectedTaskId(nextUnit.tasks[0].id);
                }
              }}
              className="w-full sm:w-80 px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {paperUnits.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.code}: {u.title} ({(u.tasks || []).length} items)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAPER 2 VIEW: ACTIVE PRACTICAL ONSCREEN PYTHON PROGRAMMING                */}
      {/* ========================================================================= */}
      {selectedPaper === "Paper 2" && (
        <div className="space-y-6">
          {/* Top Banner for Paper 2 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Paper 2 • 4CP0/02
                </span>
                {activeUnit?.spec && (
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Spec §{activeUnit.spec}
                  </span>
                )}
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50/60 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Onscreen Python Examination
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    allowCopyPaste
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-amber-800 bg-amber-50 border-amber-200"
                  }`}
                  title={
                    allowCopyPaste
                      ? "Teacher setting: Copy and paste is permitted in practice mode"
                      : "Teacher setting: Copy and paste is disabled in practice mode"
                  }
                >
                  <ShieldAlert className="w-3 h-3" />
                  {allowCopyPaste ? "Copy/Paste: Allowed" : "Copy/Paste: Disabled by Teacher"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeUnit ? `${activeUnit.code}: ${activeUnit.title}` : "Paper 2 Programming"}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Auto-marked exercises aligned with Pearson Edexcel International GCSE (9–1) Computer Science (4CP0/02). Practice bug fixing, input validation routines, CSV file parsing, and 20-marker capstone scenarios.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setSelectedPaper("Paper 2");
                  setSelectedUnitCode("U11");
                  const u11 = units.find((u) => u.code === "U11");
                  if (u11 && u11.tasks && u11.tasks[0]) {
                    setSelectedTaskId(u11.tasks[0].id);
                  }
                  setQuestionStyleFilter("q4_file_records");
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 border ${
                  selectedUnitCode === "U11"
                    ? "bg-teal-600 text-white border-teal-700 shadow-sm"
                    : "bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200"
                }`}
                title="Go straight to Topic 2.5: Text File Handling questions"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text File Handling (U11)</span>
              </button>

              {onOpenHelpGuide && (
                <button
                  type="button"
                  onClick={onOpenHelpGuide}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Learn how Practice Mode, Python runner, and AI Scaffolding work"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                  <span>Features Guide</span>
                </button>
              )}

              <select
                value={selectedUnitCode}
                onChange={(e) => {
                  setSelectedUnitCode(e.target.value);
                  const nextUnit = paperUnits.find((u) => u.code === e.target.value);
                  if (nextUnit && nextUnit.tasks && nextUnit.tasks[0]) {
                    setSelectedTaskId(nextUnit.tasks[0].id);
                  }
                }}
                className="w-full sm:w-80 px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              >
                <optgroup label="Practical Python Curriculum (Topic 2)">
                  {paperUnits
                    .filter((u) => !u.code.includes("2025") && !u.code.includes("SAM") && u.code !== "U20M" && u.code !== "Y11_MOCK")
                    .map((u) => (
                      <option key={u.code} value={u.code}>
                        {u.code}: {u.title} ({(u.tasks || []).length} tasks)
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Official Past Papers & 20-Markers">
                  {paperUnits
                    .filter((u) => u.code.includes("2025") || u.code.includes("SAM") || u.code === "U20M" || u.code === "Y11_MOCK")
                    .map((u) => (
                      <option key={u.code} value={u.code}>
                        {u.code}: {u.title} ({(u.tasks || []).length} tasks)
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* EXAMINATION QUESTION STYLE FILTER BAR (VARIETY OF EXAM QUESTIONS)        */}
          {/* ========================================================================= */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Filter by Examination Paper Style:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(Object.keys(PAPER_2_STYLES) as Paper2QuestionStyle[]).map((styleKey) => {
                const meta = PAPER_2_STYLES[styleKey];
                const isSelected = questionStyleFilter === styleKey;

                return (
                  <button
                    key={styleKey}
                    type="button"
                    onClick={() => {
                      setQuestionStyleFilter(styleKey);
                      if (styleKey === "q4_file_records") {
                        const hasQ4 = activeUnit?.tasks?.some((t) => getPaper2TaskStyle(t) === "q4_file_records");
                        if (!hasQ4) {
                          setSelectedUnitCode("U11");
                          const u11 = units.find((u) => u.code === "U11");
                          if (u11 && u11.tasks && u11.tasks[0]) {
                            setSelectedTaskId(u11.tasks[0].id);
                          }
                        }
                      } else if (styleKey === "q6_20_marker") {
                        const hasQ6 = activeUnit?.tasks?.some((t) => getPaper2TaskStyle(t) === "q6_20_marker");
                        if (!hasQ6) {
                          const capstone = units.find((u) => u.code === "U20M" || u.code.includes("2025"));
                          if (capstone) {
                            setSelectedUnitCode(capstone.code);
                            if (capstone.tasks && capstone.tasks[0]) {
                              setSelectedTaskId(capstone.tasks[0].id);
                            }
                          }
                        }
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                    title={meta.description}
                  >
                    <span>{meta.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Student Mode Switcher: Guided Practice vs Assessment Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700">Student Mode:</span>
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setIsAssessmentMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                !isAssessmentMode
                  ? "bg-white text-purple-900 shadow-xs ring-1 ring-purple-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Guided Practice (AI Tutor Active)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAssessmentMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAssessmentMode
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Assessment Mode (Exam Conditions)</span>
            </button>
          </div>
        </div>

        {isAssessmentMode ? (
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Assessment Mode: AI Practice Tutor, clues, and scaffolding are strictly hidden</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-medium hidden md:block">
            Switch to Assessment Mode when testing yourself under strict examination conditions.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN QUESTION WORKSPACE                                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Task Sidebar with Exam Style Metadata */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Unit Questions ({(filteredTasks || []).length})
              </span>
              <span className="text-xs text-slate-400">
                {Object.keys(results).length} completed
              </span>
            </div>

            {/* Difficulty Filter buttons */}
            <div className="flex items-center gap-1">
              {(["all", "starter", "core", "exam"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                    levelFilter === lvl
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Task list items */}
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  No questions match this filter style.
                </div>
              ) : (
                filteredTasks.map((t) => {
                  const isSelected = currentTask && currentTask.id === t.id;
                  const res = results[t.id];
                  const styleKey = getPaper2TaskStyle(t);
                  const styleMeta = PAPER_2_STYLES[styleKey] || PAPER_2_STYLES.all;

                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTaskId(t.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 font-semibold shadow-sm ring-1 ring-emerald-400/50"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 w-full">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {res ? (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                res.passed ? "text-emerald-600" : "text-amber-500"
                              }`}
                            />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-slate-300 shrink-0" />
                          )}
                          <span className="truncate font-bold text-slate-900 block">
                            {t.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-bold shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                          {t.marks}m
                        </span>
                      </div>

                      {/* Exam Style Badge */}
                      {selectedPaper === "Paper 2" && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${styleMeta.bgColor} ${styleMeta.color} ${styleMeta.borderColor}`}
                          >
                            {styleMeta.badge}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            • {t.level}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Active Question Card */}
        <div className="lg:col-span-3">
          {currentTask ? (
            <QuestionCard
              key={currentTask.id}
              task={currentTask}
              mode={isAssessmentMode ? "exam" : "practice"}
              hideAiScaffold={isAssessmentMode}
              studentAnswer={answers[currentTask.id]}
              onAnswerChange={handleAnswerChange}
              onCheck={handleCheck}
              allowCopyPaste={allowCopyPaste}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-2">
              <p className="font-bold text-slate-700">No question selected</p>
              <p className="text-xs text-slate-400">
                Choose a question from the sidebar or adjust your filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
