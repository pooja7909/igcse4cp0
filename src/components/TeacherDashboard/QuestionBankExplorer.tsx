import React, { useState, useMemo } from "react";
import { IGCSETask, IGCSEUnit, QuestionDifficulty, getTaskDifficulty } from "../../types";
import { QuestionPreviewModal } from "./QuestionPreviewModal";
import { SimilarQuestionModal } from "./SimilarQuestionModal";
import { PythonSnippetViewer } from "../PythonSnippetViewer";
import { teacherFetch } from "../../utils/teacherAuth";
import {
  isPastPaperTask,
  getPastPaperInfo,
  groupPastPapersByYearAndSeries,
} from "../../utils/pastPaperUtils";
import {
  Search,
  Filter,
  BookOpen,
  Code,
  HelpCircle,
  Table,
  FileText,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  Eye,
  Gauge,
  Wand2,
  RefreshCw,
  Check,
  ArrowRight,
  X,
  AlertCircle,
  Plus,
  FileCode,
  Sliders,
  Folder,
  Calendar,
  Award,
} from "lucide-react";

interface QuestionBankExplorerProps {
  units: IGCSEUnit[];
  allTasks: Record<string, IGCSETask>;
  onSelectQuestion?: (task: IGCSETask) => void;
  onSetAsTask?: (task: IGCSETask) => void;
  onSetAsAssessment?: (task: IGCSETask) => void;
  onQuestionAdded?: (task: IGCSETask) => void;
}

export const QuestionBankExplorer: React.FC<QuestionBankExplorerProps> = ({
  units,
  allTasks,
  onSelectQuestion,
  onSetAsTask,
  onSetAsAssessment,
  onQuestionAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<"ALL" | "TEACHER" | "PAST_PAPERS" | "SIMILAR" | "CORE">("ALL");
  const [selectedPastPaperFolder, setSelectedPastPaperFolder] = useState<string>("ALL");
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedPaper, setSelectedPaper] = useState<"ALL" | "Paper 1" | "Paper 2">("Paper 2");
  const [previewTaskId, setPreviewTaskId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTask, setModalTask] = useState<IGCSETask | null>(null);

  // Similar Question Generator Modal State
  const [similarSourceTask, setSimilarSourceTask] = useState<IGCSETask | null>(null);
  const [isSimilarModalOpen, setIsSimilarModalOpen] = useState(false);

  const allTasksList = useMemo(() => {
    return Object.values(allTasks);
  }, [allTasks]);

  // Organize past papers into year-based folders
  const pastPaperGroups = useMemo(() => {
    return groupPastPapersByYearAndSeries(allTasksList);
  }, [allTasksList]);

  // Split units for organized optgroup dropdown
  const { pastPaperUnits, curriculumUnits, customUnits } = useMemo(() => {
    const past: IGCSEUnit[] = [];
    const curr: IGCSEUnit[] = [];
    const cust: IGCSEUnit[] = [];

    for (const u of units) {
      const isPast =
        u.topicGroup === "Past Examination Papers" ||
        u.code.startsWith("P2") ||
        u.code.startsWith("P1") ||
        u.code === "Y11" ||
        u.code.startsWith("PAST") ||
        u.tasks.some(isPastPaperTask);

      if (isPast) {
        past.push(u);
      } else if (u.code.startsWith("U") && !isNaN(Number(u.code.substring(1)))) {
        curr.push(u);
      } else {
        cust.push(u);
      }
    }
    return { pastPaperUnits: past, curriculumUnits: curr, customUnits: cust };
  }, [units]);

  // Source Category Counts
  const sourceCounts = useMemo(() => {
    let teacher = 0;
    let pastPapers = 0;
    let similar = 0;
    let core = 0;

    for (const t of allTasksList) {
      const isSim = Boolean(
        t.generationMode === "generate_similar" ||
          t.isSimilar ||
          t.title.toLowerCase().includes("similar") ||
          t.id.includes("_sim_")
      );
      const isPast = isPastPaperTask(t);
      const isTeacher = Boolean((t.custom && !isPast) || t.authorName || t.authorId);

      if (isSim) similar++;
      if (isTeacher) teacher++;
      if (isPast) pastPapers++;
      if (!isTeacher && !isSim && !isPast) core++;
    }
    return { all: allTasksList.length, teacher, pastPapers, similar, core };
  }, [allTasksList]);

  // Count distribution across difficulties
  const difficultyCounts = useMemo(() => {
    let easy = 0;
    let moderate = 0;
    let hard = 0;
    for (const t of allTasksList) {
      const diff = getTaskDifficulty(t);
      if (diff === "Easy") easy++;
      else if (diff === "Moderate") moderate++;
      else if (diff === "Hard") hard++;
    }
    return { easy, moderate, hard, total: allTasksList.length };
  }, [allTasksList]);

  // Robust unit selection handler preventing filter conflicts
  const handleSelectUnit = (unitCode: string) => {
    setSelectedUnit(unitCode);
    if (unitCode === "ALL") return;

    if (unitCode === "ALL_PAST_PAPERS") {
      setSelectedSource("PAST_PAPERS");
      setSelectedPastPaperFolder("ALL");
      return;
    }

    const targetUnit = units.find((u) => u.code === unitCode);
    const isPast =
      targetUnit?.topicGroup === "Past Examination Papers" ||
      unitCode.startsWith("P2") ||
      unitCode.startsWith("P1") ||
      unitCode === "Y11" ||
      unitCode.startsWith("PAST") ||
      Boolean(targetUnit?.tasks.some(isPastPaperTask));

    if (isPast) {
      if (selectedSource === "CORE" || selectedSource === "TEACHER" || selectedSource === "SIMILAR") {
        setSelectedSource("PAST_PAPERS");
      }
    } else if (selectedSource === "PAST_PAPERS") {
      setSelectedSource("ALL");
    }
  };

  const filteredTasks = useMemo(() => {
    return allTasksList.filter((t) => {
      const isPast = isPastPaperTask(t);
      const isSim = Boolean(
        t.generationMode === "generate_similar" ||
          t.isSimilar ||
          t.title.toLowerCase().includes("similar") ||
          t.id.includes("_sim_")
      );
      const isTeacher = Boolean((t.custom && !isPast) || t.authorName || t.authorId);

      // Source filter
      if (selectedSource === "TEACHER") {
        if (!isTeacher) return false;
      } else if (selectedSource === "PAST_PAPERS") {
        if (!isPast) return false;
        if (selectedPastPaperFolder !== "ALL") {
          const info = getPastPaperInfo(t);
          if (info.groupId !== selectedPastPaperFolder) return false;
        }
      } else if (selectedSource === "SIMILAR") {
        if (!isSim) return false;
      } else if (selectedSource === "CORE") {
        if (isPast || isTeacher || isSim) return false;
      }

      // Unit filter
      if (selectedUnit === "ALL_PAST_PAPERS") {
        if (!isPast) return false;
      } else if (selectedUnit !== "ALL" && t.unit !== selectedUnit) {
        return false;
      }

      // Paper filter (Paper 1 vs Paper 2)
      if (selectedPaper !== "ALL") {
        const isP1 = ["U14", "U15", "U16", "U17", "U18", "U19", "U23", "U24", "U25", "U26", "U27", "U28", "U29", "U30", "U31", "U32"].includes(t.unit);
        const taskPaper = t.paper || (isP1 ? "Paper 1" : "Paper 2");
        if (taskPaper !== selectedPaper) return false;
      }

      if (selectedType !== "ALL" && t.type !== selectedType) return false;
      if (selectedDifficulty !== "ALL" && getTaskDifficulty(t) !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesBrief = t.brief.toLowerCase().includes(q);
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesFile = (t.starterFileName || "").toLowerCase().includes(q);
        const matchesUnit = (t.unitName || "").toLowerCase().includes(q);
        const matchesPaper = (t.paperTitle || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrief && !matchesId && !matchesFile && !matchesUnit && !matchesPaper) return false;
      }
      return true;
    });
  }, [allTasksList, selectedSource, selectedPastPaperFolder, selectedUnit, selectedPaper, selectedType, selectedDifficulty, searchQuery]);

  const fileHandlingCount = useMemo(() => {
    return allTasksList.filter(
      (t) =>
        t.unit === "U11" ||
        (t.brief || "").toLowerCase().includes("file") ||
        (t.brief || "").toLowerCase().includes(".txt")
    ).length;
  }, [allTasksList]);

  const previewTask = previewTaskId ? allTasks[previewTaskId] : filteredTasks[0] || null;

  const currentModalIndex = modalTask
    ? filteredTasks.findIndex((t) => t.id === modalTask.id)
    : -1;

  const handleOpenModal = (task: IGCSETask) => {
    setModalTask(task);
    setIsModalOpen(true);
  };

  const handleNextModal = () => {
    if (currentModalIndex >= 0 && currentModalIndex < filteredTasks.length - 1) {
      setModalTask(filteredTasks[currentModalIndex + 1]);
    }
  };

  const handlePrevModal = () => {
    if (currentModalIndex > 0) {
      setModalTask(filteredTasks[currentModalIndex - 1]);
    }
  };

  const handleOpenSimilarModal = (task: IGCSETask) => {
    setSimilarSourceTask(task);
    setIsSimilarModalOpen(true);
  };

  const getDifficultyBadge = (diff: QuestionDifficulty) => {
    switch (diff) {
      case "Easy":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Easy
          </span>
        );
      case "Moderate":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Moderate
          </span>
        );
      case "Hard":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Hard
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Pearson Edexcel 4CP0 Question Repository
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-mono font-bold">
                  {allTasksList.length} Questions Available
                </span>
              </div>
              <p className="text-xs text-slate-500">
                All teacher uploaded questions, past paper files, and AI-generated variations are saved directly to your Question Bank.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, .py files, keywords..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Two Headings: Paper 1 & Paper 2 Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelectedPaper("Paper 2")}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedPaper === "Paper 2"
              ? "bg-emerald-950 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/40"
              : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                selectedPaper === "Paper 2"
                  ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              Paper 2 • 4CP0/02
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedPaper === "Paper 2"
                  ? "bg-emerald-400/20 text-emerald-300"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              Active Programming
            </span>
          </div>
          <h4 className={`text-sm font-bold mt-1.5 ${selectedPaper === "Paper 2" ? "text-white" : "text-slate-900"}`}>
            Paper 2: Application of Computational Thinking
          </h4>
          <p className={`text-[11px] mt-0.5 ${selectedPaper === "Paper 2" ? "text-emerald-200/90" : "text-slate-500"}`}>
            Onscreen Python coding, bug fixes, test validation & 20-marker scenarios
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPaper("Paper 1")}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedPaper === "Paper 1"
              ? "bg-slate-900 text-white border-indigo-500 shadow-md ring-2 ring-indigo-500/40"
              : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                selectedPaper === "Paper 1"
                  ? "bg-indigo-500/30 text-indigo-200 border border-indigo-400/40"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-200"
              }`}
            >
              Paper 1 • 4CP0/01
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedPaper === "Paper 1"
                  ? "bg-amber-400/20 text-amber-300"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              Work Next
            </span>
          </div>
          <h4 className={`text-sm font-bold mt-1.5 ${selectedPaper === "Paper 1" ? "text-white" : "text-slate-900"}`}>
            Paper 1: Principles of Computer Science
          </h4>
          <p className={`text-[11px] mt-0.5 ${selectedPaper === "Paper 1" ? "text-indigo-200/90" : "text-slate-500"}`}>
            Written Theory, Algorithms, Data Representation, Networks & Ethics
          </p>
        </button>
      </div>

      {/* Source Category Quick Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-purple-600" />
            Filter by Question Origin:
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredTasks.length}</strong> matching questions
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedSource("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSource === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Questions ({sourceCounts.all})
          </button>

          <button
            type="button"
            onClick={() => setSelectedSource("TEACHER")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedSource === "TEACHER"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100"
            }`}
          >
            <Code className="w-3.5 h-3.5 text-purple-600" />
            Teacher Uploads & Custom ({sourceCounts.teacher})
          </button>

          <button
            type="button"
            onClick={() => setSelectedSource("PAST_PAPERS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedSource === "PAST_PAPERS"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            Past Papers & 2025 Series ({sourceCounts.pastPapers})
          </button>

          <button
            type="button"
            onClick={() => setSelectedSource("SIMILAR")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedSource === "SIMILAR"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Generated Similar ({sourceCounts.similar})
          </button>

          <button
            type="button"
            onClick={() => setSelectedSource("CORE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedSource === "CORE"
                ? "bg-slate-700 text-white shadow-sm"
                : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            Core Curriculum Bank ({sourceCounts.core})
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedPaper("Paper 2");
              setSelectedUnit("U11");
              setSelectedSource("ALL");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedUnit === "U11"
                ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-400"
                : "bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100"
            }`}
            title="Filter to Topic 2.5: Text File Handling questions"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Text File Handling (Topic 2.5) ({fileHandlingCount})</span>
          </button>
        </div>
      </div>

      {/* Difficulty & Topic Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mr-1">
            <Gauge className="w-3.5 h-3.5 text-purple-600" /> Difficulty:
          </span>
          <button
            type="button"
            onClick={() => setSelectedDifficulty("ALL")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedDifficulty === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedDifficulty("Easy")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              selectedDifficulty === "Easy"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${selectedDifficulty === "Easy" ? "bg-white" : "bg-emerald-500"}`} />
            Easy ({difficultyCounts.easy})
          </button>
          <button
            type="button"
            onClick={() => setSelectedDifficulty("Moderate")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              selectedDifficulty === "Moderate"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${selectedDifficulty === "Moderate" ? "bg-white" : "bg-amber-500"}`} />
            Moderate ({difficultyCounts.moderate})
          </button>
          <button
            type="button"
            onClick={() => setSelectedDifficulty("Hard")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              selectedDifficulty === "Hard"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white text-purple-800 border border-purple-200 hover:bg-purple-50"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${selectedDifficulty === "Hard" ? "bg-white" : "bg-purple-500"}`} />
            Hard ({difficultyCounts.hard})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Unit Selector with Grouped Folders */}
          <select
            value={selectedUnit}
            onChange={(e) => handleSelectUnit(e.target.value)}
            className="px-3 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 max-w-xs"
          >
            <option value="ALL">📁 All Units & Past Papers ({allTasksList.length} Qs)</option>

            <optgroup label="📁 Past Examination Papers (By Year & Series)">
              <option value="ALL_PAST_PAPERS">📂 All Past Examination Papers ({sourceCounts.pastPapers} Qs)</option>
              {pastPaperUnits.map((u) => (
                <option key={u.code} value={u.code}>
                  📅 {u.title} ({u.tasks.length} Qs)
                </option>
              ))}
            </optgroup>

            <optgroup label="📚 Curriculum Topic Units (Paper 1 & Paper 2)">
              {curriculumUnits.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.code}: {u.title} ({u.tasks.length} Qs)
                </option>
              ))}
            </optgroup>

            {customUnits.length > 0 && (
              <optgroup label="🛠️ Custom & Extension Banks">
                {customUnits.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.code}: {u.title} ({u.tasks.length} Qs)
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          {/* Type Selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="ALL">All Question Types</option>
            <option value="code">Python 3 Programming</option>
            <option value="mcq">Multiple Choice (MCQ)</option>
            <option value="table">Truth / Trace Tables</option>
            <option value="theory">Theory / Written</option>
            <option value="inspect">Code Inspection</option>
          </select>
        </div>
      </div>

      {/* Dedicated Past Examination Papers Year / Series Folder Navigation */}
      {(selectedSource === "PAST_PAPERS" || selectedUnit === "ALL_PAST_PAPERS" || selectedUnit.startsWith("P2") || selectedUnit === "Y11") && (
        <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/60 to-indigo-50/90 border border-blue-200 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                <Folder className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  📁 Past Examination Papers Archive (Folders by Year & Series)
                </h4>
                <p className="text-[11px] text-blue-700/80">
                  Select a year folder below to filter genuine Edexcel 4CP0 past papers and mark schemes
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-800 bg-white/90 px-2.5 py-1 rounded-full border border-blue-200 shadow-xs">
              {sourceCounts.pastPapers} Total Questions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                setSelectedPastPaperFolder("ALL");
                setSelectedSource("PAST_PAPERS");
                setSelectedUnit("ALL");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedPastPaperFolder === "ALL" && selectedUnit === "ALL"
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-300"
                  : "bg-white text-blue-900 border border-blue-200 hover:bg-blue-100 hover:border-blue-300"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              All Past Papers ({sourceCounts.pastPapers})
            </button>

            {pastPaperGroups.map((g) => {
              const isSelected = selectedPastPaperFolder === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedPastPaperFolder(g.id);
                    setSelectedSource("PAST_PAPERS");
                    setSelectedUnit("ALL");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-blue-700 text-white shadow-md ring-2 ring-blue-400"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-900"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{g.seriesLabel}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isSelected ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {g.tasks.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Split Grid: Question List & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Paginated/Scrollable List */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm max-h-[720px] overflow-y-auto space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <p>No questions matched your filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedSource("ALL");
                  setSelectedUnit("ALL");
                  setSelectedType("ALL");
                  setSelectedDifficulty("ALL");
                  setSearchQuery("");
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 font-bold hover:bg-purple-200"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredTasks.slice(0, 100).map((task) => {
              const isSelected = previewTask?.id === task.id;
              const diff = getTaskDifficulty(task);
              const isSim =
                task.generationMode === "generate_similar" ||
                task.isSimilar ||
                task.title.toLowerCase().includes("similar") ||
                task.id.includes("_sim_");
              const isTeacher = Boolean(task.custom || task.authorName);

              return (
                <div
                  key={task.id}
                  onClick={() => setPreviewTaskId(task.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-purple-50 border-purple-400 shadow-sm"
                      : "bg-slate-50/60 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-purple-700">
                        {task.unit} • {task.type.toUpperCase()}
                      </span>
                      {getDifficultyBadge(diff)}

                      {task.starterFileName && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300" title="Authentic candidate Python starter file linked">
                          <Code className="w-2.5 h-2.5 text-amber-700" />
                          {task.starterFileName}
                        </span>
                      )}

                      {isTeacher && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                          Teacher Upload
                        </span>
                      )}

                      {isSim && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
                          <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                          Similar Question
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {task.marks} Marks
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 mb-2">
                    {task.brief}
                  </p>

                  {/* Action row on card */}
                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(task);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                        title="View full question specification, hint, starter code and mark scheme"
                      >
                        <Eye className="w-3 h-3 text-slate-600" />
                        <span>View</span>
                      </button>

                      {/* Generate Similar Quick Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSimilarModal(task);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors border border-indigo-200/80"
                        title="Generate an authentic Pearson Edexcel exam variation of this question"
                      >
                        <Wand2 className="w-3 h-3 text-indigo-600" />
                        <span>Generate Similar</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {onSetAsTask && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetAsTask(task);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-colors"
                          title="Set as practice task"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Task</span>
                        </button>
                      )}

                      {onSetAsAssessment && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetAsAssessment(task);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold transition-colors"
                          title="Set as formal exam"
                        >
                          <FileText className="w-3 h-3 text-purple-600" />
                          <span>Exam</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {filteredTasks.length > 100 && (
            <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Showing first 100 results. Use the search bar or topic filters to narrow down.
            </div>
          )}
        </div>

        {/* Right Column: Question Preview Inspector */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          {previewTask ? (
            <div className="space-y-4">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-700">
                      {previewTask.unit} • {previewTask.level} • {previewTask.type.toUpperCase()}
                    </span>
                    {getDifficultyBadge(getTaskDifficulty(previewTask))}
                    {previewTask.starterFileName && (
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        {previewTask.starterFileName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {previewTask.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-black px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                    {previewTask.marks} Marks
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenModal(previewTask)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    title="Open full question view modal"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View</span>
                  </button>
                </div>
              </div>

              {/* Generate Similar Spotlight Card */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200/80 rounded-2xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                    <Wand2 className="w-4 h-4 text-indigo-600" />
                    <span>Generate Similar Question in Question Bank</span>
                  </div>
                  <p className="text-[11px] text-indigo-800/80">
                    Create an authentic Pearson Edexcel variant with matching marks, fresh context, and auto-tests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenSimilarModal(previewTask)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-sm shrink-0 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Similar</span>
                </button>
              </div>

              {/* Brief */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">Question Specification:</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {previewTask.brief}
                </p>
              </div>

              {/* Specific Content by type */}
              {previewTask.type === "code" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 block">
                        Python Starter Scaffold {previewTask.starterFileName ? `(${previewTask.starterFileName})` : ""}:
                      </span>
                      {previewTask.starterFileName && (
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Provided to Candidate
                        </span>
                      )}
                    </div>
                    <PythonSnippetViewer
                      code={previewTask.starter || "# Python code template"}
                      title="Starter Code Provided to Candidate"
                    />
                  </div>

                  {/* Teacher Mark Scheme: Solved Python Program */}
                  {previewTask.solution && (
                    <div className="space-y-2 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Teacher Mark Scheme: Solved Python Program
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                          Full {previewTask.marks} Marks Model Solution
                        </span>
                      </div>
                      <PythonSnippetViewer
                        code={previewTask.solution}
                        title="Model Solution (Solved Neatly)"
                      />
                    </div>
                  )}

                  {/* Step-by-Step Marking Breakdown */}
                  {(previewTask.markPoints || previewTask.markScheme) && (
                    <div className="space-y-2 p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-purple-700" />
                          Step-by-Step Marking Breakdown
                        </span>
                        <span className="text-xs font-mono font-bold text-purple-800">
                          {previewTask.marks} Marks Total
                        </span>
                      </div>

                      {previewTask.markPoints && previewTask.markPoints.length > 0 ? (
                        <div className="space-y-1.5 divide-y divide-purple-100">
                          {previewTask.markPoints.map((mp: any, mIdx: number) => (
                            <div key={mp.id || mIdx} className="pt-1.5 first:pt-0 flex items-start gap-2 text-xs">
                              <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-mono font-bold text-[10px] shrink-0 mt-0.5">
                                Step {mIdx + 1} ({mp.marks || 1}M)
                              </span>
                              <div className="flex-1 space-y-0.5">
                                <p className="font-semibold text-slate-800">{mp.criterion || mp.description}</p>
                                {mp.exemplarCode && (
                                  <code className="block p-1.5 rounded bg-white border border-purple-200 font-mono text-[11px] text-purple-950 whitespace-pre overflow-x-auto">
                                    {mp.exemplarCode}
                                  </code>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-purple-200 whitespace-pre-line leading-relaxed font-sans">
                          {previewTask.markScheme}
                        </div>
                      )}
                    </div>
                  )}

                  {previewTask.tests && previewTask.tests.length > 0 && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <strong>Automated Marking Suite:</strong> {previewTask.tests.length} test cases with dynamic input/output checks.
                    </div>
                  )}
                </div>
              )}

              {previewTask.type === "mcq" && previewTask.questions && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Multiple Choice Options:</span>
                  <div className="space-y-1.5">
                    {(previewTask.questions as any)[0]?.options?.map((opt: string, i: number) => {
                      const isCorrect = (previewTask.questions as any)[0]?.a === i;
                      return (
                        <div
                          key={i}
                          className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
                            isCorrect
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : "bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                              Correct Mark Scheme
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {previewTask.type === "table" && previewTask.rows && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Trace / Truth Table Columns:</span>
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border">
                    {previewTask.columns?.map((c) => c.label).join(" | ")}
                  </div>
                </div>
              )}

              {previewTask.type === "theory" && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Official Mark Scheme Criteria:</span>
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border space-y-1">
                    <div>
                      <strong>Keywords:</strong>{" "}
                      {((previewTask.questions as any)?.[0]?.keywords || []).join(", ") || "Examiner technical keywords"}
                    </div>
                  </div>
                </div>
              )}

              {/* Assignment actions */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {onSetAsTask && (
                    <button
                      type="button"
                      onClick={() => onSetAsTask(previewTask)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                      title="Set as practice task with hints enabled"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Set as Task</span>
                    </button>
                  )}

                  {onSetAsAssessment && (
                    <button
                      type="button"
                      onClick={() => onSetAsAssessment(previewTask)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-colors"
                      title="Set as formal timed exam"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Set as Assessment</span>
                    </button>
                  )}
                </div>

                {onSelectQuestion && (
                  <button
                    onClick={() => onSelectQuestion(previewTask)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Add to Assessment / Task Builder
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a question to inspect details.
            </div>
          )}
        </div>
      </div>

      {/* Full Question Preview Modal */}
      {isModalOpen && modalTask && (
        <QuestionPreviewModal
          task={modalTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSetAsTask={onSetAsTask}
          onSetAsAssessment={onSetAsAssessment}
          onGenerateSimilar={(task) => {
            setIsModalOpen(false);
            handleOpenSimilarModal(task);
          }}
          onNextQuestion={handleNextModal}
          onPrevQuestion={handlePrevModal}
          hasNext={currentModalIndex < filteredTasks.length - 1}
          hasPrev={currentModalIndex > 0}
        />
      )}

      {/* GENERATE SIMILAR QUESTION MODAL */}
      <SimilarQuestionModal
        isOpen={isSimilarModalOpen}
        onClose={() => setIsSimilarModalOpen(false)}
        sourceTask={similarSourceTask}
        onQuestionSaved={(task) => {
          if (onQuestionAdded) {
            onQuestionAdded(task);
          }
          setPreviewTaskId(task.id);
        }}
        onSetAsTask={onSetAsTask}
        onSetAsAssessment={onSetAsAssessment}
        onAddToAssessment={onSelectQuestion}
      />
    </div>
  );
};

