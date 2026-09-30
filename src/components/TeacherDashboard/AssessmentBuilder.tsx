import React, { useState, useMemo, useEffect } from "react";
import { IGCSEUnit, IGCSETask, Assessment, getTaskDifficulty } from "../../types";
import { QuestionPreviewModal } from "./QuestionPreviewModal";
import { SimilarQuestionModal } from "./SimilarQuestionModal";
import { ManualQuestionBuilder } from "./ManualQuestionBuilder";
import { PythonSnippetViewer } from "../PythonSnippetViewer";
import { teacherFetch } from "../../utils/teacherAuth";
import {
  GradeBoundaries,
  DEFAULT_GRADE_BOUNDARIES,
  isCustomBoundaries,
} from "../../utils/gradeBoundaries";
import { GradeBoundariesModal } from "./GradeBoundariesModal";
import {
  isPastPaperTask,
  getPastPaperInfo,
  groupPastPapersByYearAndSeries,
} from "../../utils/pastPaperUtils";
import {
  PlusCircle,
  Clock,
  CheckSquare,
  Square,
  Search,
  BookOpen,
  Eye,
  CheckCircle,
  Sparkles,
  Award,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit3,
  Save,
  AlertTriangle,
  RotateCcw,
  Check,
  Plus,
  ListOrdered,
  Folder,
  Calendar,
  Copy,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  FileText,
  BookmarkPlus,
  Wand2,
} from "lucide-react";

interface AssessmentBuilderProps {
  units: IGCSEUnit[];
  allTasks: Record<string, IGCSETask>;
  onAssessmentCreated: (newAssessment: Assessment) => void;
  editingAssessment?: Assessment | null;
  onAssessmentUpdated?: (updatedAssessment: Assessment) => void;
  onAssessmentDeleted?: (deletedId: string) => void;
  onCancelEdit?: () => void;
  allAssessments?: Assessment[];
  onSelectAssessmentToEdit?: (assessmentId: string) => void;
  onQuestionUpdated?: (task: IGCSETask) => void;
  initialMode?: "assessment" | "task";
}

export const AssessmentBuilder: React.FC<AssessmentBuilderProps> = ({
  units,
  allTasks,
  onAssessmentCreated,
  editingAssessment = null,
  onAssessmentUpdated,
  onAssessmentDeleted,
  onCancelEdit,
  allAssessments = [],
  onSelectAssessmentToEdit,
  onQuestionUpdated,
  initialMode,
}) => {
  const isEditMode = !!editingAssessment;

  const [assignmentMode, setAssignmentMode] = useState<"assessment" | "task">(() => {
    if (editingAssessment?.type) return editingAssessment.type;
    return initialMode || "assessment";
  });
  const [title, setTitle] = useState(() => {
    if (editingAssessment?.title) return editingAssessment.title;
    return initialMode === "task" ? "Classwork Practice Task" : "IGCSE Computer Science Paper 2 Mock";
  });
  const [durationMinutes, setDurationMinutes] = useState(() => {
    if (typeof editingAssessment?.durationMinutes === "number") return editingAssessment.durationMinutes;
    return initialMode === "task" ? 0 : 45;
  });
  const [showScoreImmediately, setShowScoreImmediately] = useState(true);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([
    "u01a",
    "u04a",
    "u05c",
    "u10a",
    "u15a",
  ]);
  const [editingQuestionTask, setEditingQuestionTask] = useState<IGCSETask | null>(null);
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "teacher" | "past_papers" | "similar">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [boundaries, setBoundaries] = useState<GradeBoundaries>(
    editingAssessment?.gradeBoundaries || DEFAULT_GRADE_BOUNDARIES
  );
  const [showBoundariesModal, setShowBoundariesModal] = useState<boolean>(false);
  const [allowCopyPaste, setAllowCopyPaste] = useState<boolean>(() => {
    if (editingAssessment?.allowCopyPaste !== undefined) return editingAssessment.allowCopyPaste;
    return (editingAssessment?.type || initialMode || "assessment") === "task";
  });
  const [showOperatorToolbar, setShowOperatorToolbar] = useState<boolean>(() => {
    if (editingAssessment?.showOperatorToolbar !== undefined) return editingAssessment.showOperatorToolbar;
    return (editingAssessment?.type || initialMode || "assessment") === "task";
  });
  const [shareSolutions, setShareSolutions] = useState<boolean>(() => {
    if (editingAssessment?.shareSolutions !== undefined) return editingAssessment.shareSolutions;
    return (editingAssessment?.type || initialMode || "assessment") === "task";
  });
  const [customHeaderBanner, setCustomHeaderBanner] = useState<string>(() => {
    return editingAssessment?.customHeaderBanner || "";
  });
  const [customSubtitle, setCustomSubtitle] = useState<string>(() => {
    return editingAssessment?.customSubtitle || "";
  });
  const [customInstructions, setCustomInstructions] = useState<string>(() => {
    return editingAssessment?.customInstructions || "";
  });
  const [expandedMarkSchemeTaskIds, setExpandedMarkSchemeTaskIds] = useState<Record<string, boolean>>({});

  // Sync state when editingAssessment changes
  useEffect(() => {
    if (editingAssessment) {
      setTitle(editingAssessment.title || "");
      setAssignmentMode(editingAssessment.type || "assessment");
      setDurationMinutes(
        typeof editingAssessment.durationMinutes === "number"
          ? editingAssessment.durationMinutes
          : 45
      );
      setShowScoreImmediately(
        editingAssessment.showScoreImmediately !== undefined
          ? editingAssessment.showScoreImmediately
          : true
      );
      setAllowCopyPaste(
        editingAssessment.allowCopyPaste !== undefined
          ? editingAssessment.allowCopyPaste
          : editingAssessment.type === "task"
      );
      setShowOperatorToolbar(
        editingAssessment.showOperatorToolbar !== undefined
          ? editingAssessment.showOperatorToolbar
          : editingAssessment.type === "task"
      );
      setShareSolutions(
        editingAssessment.shareSolutions !== undefined
          ? editingAssessment.shareSolutions
          : editingAssessment.type === "task"
      );
      setCustomHeaderBanner(editingAssessment.customHeaderBanner || "");
      setCustomSubtitle(editingAssessment.customSubtitle || "");
      setCustomInstructions(editingAssessment.customInstructions || "");
      setSelectedTaskIds(editingAssessment.questionIds ? [...editingAssessment.questionIds] : []);
      setBoundaries(editingAssessment.gradeBoundaries || DEFAULT_GRADE_BOUNDARIES);
      setStatusMessage(null);
    }
  }, [editingAssessment]);

  // Robust task lookup supporting tasks from allAssessments as well
  const getTask = (id: string): IGCSETask | undefined => {
    if (allTasks[id]) return allTasks[id];
    for (const a of allAssessments) {
      if (a.questions) {
        const found = a.questions.find((q) => q.id === id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const totalSelectedMarks = selectedTaskIds.reduce(
    (acc, id) => acc + (getTask(id)?.marks || 0),
    0
  );

  // Question Selection Tab Mode
  const [selectionSourceTab, setSelectionSourceTab] = useState<
    "curriculum" | "past_papers" | "existing_assessments" | "custom"
  >("curriculum");
  const [selectedPastPaperFolder, setSelectedPastPaperFolder] = useState<string>("ALL");
  const [paperFilter, setPaperFilter] = useState<"all" | "Paper 1" | "Paper 2">("Paper 2");
  const [assessmentSearchQuery, setAssessmentSearchQuery] = useState("");
  const [expandedAssessmentId, setExpandedAssessmentId] = useState<string | null>(null);

  // Consolidated list of all tasks across units & existing assessments
  const allTasksList = useMemo(() => {
    const map = new Map<string, IGCSETask>();
    for (const t of Object.values(allTasks)) map.set(t.id, t);
    for (const a of allAssessments) {
      if (a.questions) {
        for (const q of a.questions) {
          if (!map.has(q.id)) map.set(q.id, q);
        }
      }
    }
    return Array.from(map.values());
  }, [allTasks, allAssessments]);

  // Organize past papers into year-based folders
  const pastPaperGroups = useMemo(() => {
    return groupPastPapersByYearAndSeries(allTasksList);
  }, [allTasksList]);

  // Split units for organized dropdown
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

  // Available other assessments excluding current edit target
  const availableOtherAssessments = useMemo(() => {
    return allAssessments.filter((a) => {
      if (editingAssessment && a.id === editingAssessment.id) return false;
      if (!assessmentSearchQuery.trim()) return true;
      const q = assessmentSearchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        (a.type || "").toLowerCase().includes(q)
      );
    });
  }, [allAssessments, editingAssessment, assessmentSearchQuery]);

  // Add all questions from an existing assessment
  const handleAddAllFromAssessment = (assessment: Assessment) => {
    const idsToAdd = (assessment.questionIds || []).filter((id) => !selectedTaskIds.includes(id));
    if (idsToAdd.length === 0) {
      setStatusMessage(`All questions from "${assessment.title}" are already in this assignment.`);
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    setSelectedTaskIds((prev) => [...prev, ...idsToAdd]);
    setStatusMessage(`✓ Added ${idsToAdd.length} question(s) from "${assessment.title}"!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Add all questions from a past paper series
  const handleAddAllFromPastPaper = (tasks: IGCSETask[], label: string) => {
    const idsToAdd = tasks.map((t) => t.id).filter((id) => !selectedTaskIds.includes(id));
    if (idsToAdd.length === 0) {
      setStatusMessage(`All questions from ${label} are already in this assignment.`);
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    setSelectedTaskIds((prev) => [...prev, ...idsToAdd]);
    setStatusMessage(`✓ Added ${idsToAdd.length} question(s) from ${label}!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Question management
  const addQuestion = (taskId: string) => {
    if (!selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds((prev) => [...prev, taskId]);
    }
  };

  const removeQuestion = (taskId: string) => {
    setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
  };

  const toggleTask = (taskId: string) => {
    if (selectedTaskIds.includes(taskId)) {
      removeQuestion(taskId);
    } else {
      addQuestion(taskId);
    }
  };

  const moveQuestion = (fromIndex: number, direction: -1 | 1) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= selectedTaskIds.length) return;
    const updated = [...selectedTaskIds];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setSelectedTaskIds(updated);
  };

  const selectAllInUnit = (unit: IGCSEUnit) => {
    const unitTaskIds = unit.tasks.map((t) => t.id);
    const allSelected = unitTaskIds.every((id) => selectedTaskIds.includes(id));

    if (allSelected) {
      setSelectedTaskIds((prev) => prev.filter((id) => !unitTaskIds.includes(id)));
    } else {
      setSelectedTaskIds((prev) => Array.from(new Set([...prev, ...unitTaskIds])));
    }
  };

  // Submit Handler (Create or Update)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (selectedTaskIds.length === 0) {
      alert("Please select at least one question for the assessment.");
      return;
    }
    if (!title.trim()) {
      alert("Please provide an assessment title.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (isEditMode && editingAssessment) {
        // Full question objects to guarantee all students get exact questions even across browsers/devices
        const selectedQuestions = selectedTaskIds.map((id) => allTasks[id]).filter(Boolean);

        // UPDATE existing assessment via PUT
        const res = await teacherFetch(`/api/assessments/${editingAssessment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            type: assignmentMode,
            customHeaderBanner,
            customSubtitle,
            customInstructions,
            durationMinutes: Number(durationMinutes) || 0,
            showScoreImmediately,
            allowCopyPaste,
            showOperatorToolbar,
            shareSolutions,
            questionIds: selectedTaskIds,
            questions: selectedQuestions,
            maxMarks: totalSelectedMarks,
            gradeBoundaries: boundaries,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setStatusMessage("Changes saved successfully!");
          try {
            const raw = localStorage.getItem("edexcel_saved_assessments");
            let list: Assessment[] = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(list)) list = [];
            const idx = list.findIndex((a) => a.id === data.assessment.id);
            if (idx >= 0) list[idx] = data.assessment;
            else list.unshift(data.assessment);
            localStorage.setItem("edexcel_saved_assessments", JSON.stringify(list));
          } catch (e) {}
          if (onAssessmentUpdated) {
            onAssessmentUpdated(data.assessment);
          }
          setTimeout(() => setStatusMessage(null), 4000);
        } else {
          throw new Error("Server error");
        }
      } else {
        const selectedQuestions = selectedTaskIds.map((id) => allTasks[id]).filter(Boolean);

        // CREATE new assessment via POST
        const res = await teacherFetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            type: assignmentMode,
            customHeaderBanner,
            customSubtitle,
            customInstructions,
            durationMinutes: Number(durationMinutes) || 0,
            showScoreImmediately,
            allowCopyPaste,
            showOperatorToolbar,
            shareSolutions,
            questionIds: selectedTaskIds,
            questions: selectedQuestions,
            maxMarks: totalSelectedMarks,
            gradeBoundaries: boundaries,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          try {
            const raw = localStorage.getItem("edexcel_saved_assessments");
            let list: Assessment[] = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(list)) list = [];
            list.unshift(data.assessment);
            localStorage.setItem("edexcel_saved_assessments", JSON.stringify(list));
          } catch (e) {}
          onAssessmentCreated(data.assessment);
        } else {
          throw new Error("Server error");
        }
      }
    } catch (err) {
      // Offline fallback: create or update locally so teachers can still build assessments on static hosts/Vercel
      const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const fallbackAssessment: Assessment = {
        id: editingAssessment ? editingAssessment.id : `local_${Date.now()}`,
        title,
        code: editingAssessment ? editingAssessment.code : fallbackCode,
        type: assignmentMode,
        customHeaderBanner,
        customSubtitle,
        customInstructions,
        durationMinutes: Number(durationMinutes) || 0,
        showScoreImmediately,
        allowCopyPaste,
        showOperatorToolbar,
        shareSolutions,
        questionIds: selectedTaskIds,
        questions: selectedTaskIds.map((id) => allTasks[id]).filter(Boolean),
        maxMarks: totalSelectedMarks,
        createdAt: editingAssessment ? editingAssessment.createdAt : Date.now(),
        status: "active",
        students: editingAssessment ? editingAssessment.students : {},
      };
      try {
        const raw = localStorage.getItem("edexcel_saved_assessments");
        let list: Assessment[] = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];
        const idx = list.findIndex((a) => a.id === fallbackAssessment.id);
        if (idx >= 0) list[idx] = fallbackAssessment;
        else list.unshift(fallbackAssessment);
        localStorage.setItem("edexcel_saved_assessments", JSON.stringify(list));
      } catch (e) {}

      if (isEditMode && onAssessmentUpdated) {
        onAssessmentUpdated(fallbackAssessment);
        setStatusMessage("Changes saved locally!");
      } else {
        onAssessmentCreated(fallbackAssessment);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Assessment
  const handleDeleteAssessment = async () => {
    if (!editingAssessment) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to completely delete "${editingAssessment.title}" (Code: ${editingAssessment.code})?\n\nThis will remove the assessment and all student attempt data permanently.`
    );
    if (!confirmDelete) return;

    setIsSubmitting(true);
    try {
      const res = await teacherFetch(`/api/assessments/${editingAssessment.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (onAssessmentDeleted) {
          onAssessmentDeleted(editingAssessment.id);
        }
      } else {
        alert("Failed to delete assessment");
      }
    } catch (e) {
      alert("Error deleting assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUnits = units
    .map((u) => ({
      ...u,
      tasks: u.tasks.filter((t) => {
        const isPast = isPastPaperTask(t);
        const isSim = Boolean(
          t.generationMode === "generate_similar" ||
            t.isSimilar ||
            t.title.toLowerCase().includes("similar") ||
            t.id.includes("_sim_")
        );
        const isTeacher = Boolean((t.custom && !isPast) || t.authorName || t.authorId);

        if (unitFilter === "all_past_papers") {
          if (!isPast) return false;
        } else if (unitFilter !== "all" && u.code !== unitFilter) {
          return false;
        }

        if (paperFilter !== "all") {
          const isP1 = ["U14", "U15", "U16", "U17", "U18", "U19", "U23", "U24", "U25", "U26", "U27", "U28", "U29", "U30", "U31", "U32"].includes(u.code);
          const unitPaper = u.paper || (isP1 ? "Paper 1" : "Paper 2");
          if (unitPaper !== paperFilter) return false;
        }

        if (difficultyFilter !== "all" && getTaskDifficulty(t) !== difficultyFilter) return false;

        if (sourceFilter === "teacher") {
          if (!isTeacher) return false;
        } else if (sourceFilter === "past_papers") {
          if (!isPast) return false;
        } else if (sourceFilter === "similar") {
          if (!isSim) return false;
        }

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.brief.toLowerCase().includes(q) ||
          t.level.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          (t.starterFileName || "").toLowerCase().includes(q) ||
          (t.paperTitle || "").toLowerCase().includes(q)
        );
      }),
    }))
    .filter((u) => u.tasks.length > 0);

  const filteredPastPaperGroups = useMemo(() => {
    if (selectedPastPaperFolder === "ALL") return pastPaperGroups;
    return pastPaperGroups.filter((g) => g.id === selectedPastPaperFolder);
  }, [pastPaperGroups, selectedPastPaperFolder]);

  // Question preview state
  const [previewTask, setPreviewTask] = useState<IGCSETask | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [similarModalTask, setSimilarModalTask] = useState<IGCSETask | null>(null);

  const handleOpenSimilarModal = (task: IGCSETask) => {
    setSimilarModalTask(task);
  };

  const allVisibleTasks = useMemo(() => {
    return filteredUnits.flatMap((u) => u.tasks);
  }, [filteredUnits]);

  const previewTaskIndex = useMemo(() => {
    if (!previewTask) return -1;
    return allVisibleTasks.findIndex((t) => t.id === previewTask.id);
  }, [allVisibleTasks, previewTask]);

  const handleOpenPreview = (task: IGCSETask) => {
    setPreviewTask(task);
    setIsPreviewOpen(true);
  };

  const handleNextPreview = () => {
    if (previewTaskIndex >= 0 && previewTaskIndex < allVisibleTasks.length - 1) {
      setPreviewTask(allVisibleTasks[previewTaskIndex + 1]);
    }
  };

  const handlePrevPreview = () => {
    if (previewTaskIndex > 0) {
      setPreviewTask(allVisibleTasks[previewTaskIndex - 1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Mode Selector & Status */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              isEditMode ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"
            }`}
          >
            {isEditMode ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {isEditMode ? `Edit Assignment: ${editingAssessment.title}` : "Set New Assessment / Task"}
              </h3>
              {isEditMode && (
                <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  PIN: {editingAssessment.code}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? "Add or delete questions, adjust order, change time limits, or update settings. Changes update immediately."
                : "Select questions from the 1,000+ IGCSE repository to launch a secure exam or practice task."}
            </p>
          </div>
        </div>

        {/* Existing Assessment Selector (Quick Edit Dropdown) */}
        <div className="flex items-center gap-2">
          {allAssessments.length > 0 && onSelectAssessmentToEdit && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Choose to Edit:</span>
              <select
                value={isEditMode ? editingAssessment?.id : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    onSelectAssessmentToEdit(e.target.value);
                  } else if (onCancelEdit) {
                    onCancelEdit();
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="">-- Set Brand New Assessment --</option>
                {allAssessments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.code}) - {a.questionIds?.length || 0} questions
                  </option>
                ))}
              </select>
            </div>
          )}

          {isEditMode && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Create New Instead</span>
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Configuration Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Mode Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Assignment Mode:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setAssignmentMode("assessment");
                setAllowCopyPaste(false);
                setShowOperatorToolbar(false);
                if (title === "Classwork Practice Task" || title.includes("Practice Task")) {
                  setTitle("IGCSE Computer Science Paper 2 Mock");
                }
              }}
              className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                assignmentMode === "assessment"
                  ? "border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/20"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  assignmentMode === "assessment" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Formal Assessment</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                    Exam
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Exam conditions with countdown timer and final mark grading. Copying and hints locked by default.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setAssignmentMode("task");
                setAllowCopyPaste(true);
                setShowOperatorToolbar(true);
                if (title.includes("Mock")) {
                  setTitle("Classwork Practice Task");
                }
                if (durationMinutes === 45) {
                  setDurationMinutes(0);
                }
              }}
              className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                assignmentMode === "task"
                  ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  assignmentMode === "task" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Practice Task</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    Practice
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Formative classwork with live test runners & AI Scaffolding (Levels 1–3 step-by-step guidance, syntax debugging, what went wrong & program improvement).
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Title and Duration Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700">
              {assignmentMode === "task" ? "Task Title:" : "Assessment Title:"}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={
                assignmentMode === "task"
                  ? "e.g. Topic 4: Subroutines & Functions Practice"
                  : "e.g. Year 11 Paper 2 Mock Examination"
              }
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Duration (Minutes, 0 for untimed):
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                min={0}
                max={240}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Custom Assessment Header & Banner (Make it different every time) */}
        <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Customize Student Assessment Header & School Banner
            </span>
            <span className="text-[11px] font-semibold text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
              Personalize for every test / group
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                School / Institution Header Banner:
              </label>
              <input
                type="text"
                value={customHeaderBanner}
                onChange={(e) => setCustomHeaderBanner(e.target.value)}
                placeholder="e.g. St. Jude's High School • Computer Science Dept"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
              />
              <span className="text-[10px] text-slate-500 block">
                Replaces the top title bar header for all students taking this test.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Class / Room Subtitle:
              </label>
              <input
                type="text"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                placeholder="e.g. Class 10A • Teacher: Mr. Adams • Room 204"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
              />
              <span className="text-[10px] text-slate-500 block">
                Shown right below the school banner.
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-xs font-bold text-slate-700">
              In-Class Student Instructions:
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. In-class timed assessment. Work independently. No outside editors or websites."
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
            />
          </div>

          {/* Live Header Preview */}
          {(customHeaderBanner || title) && (
            <div className="mt-2 p-3 bg-white/95 border border-purple-200 rounded-xl shadow-2xs">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
                Student Header Preview:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">
                  {customHeaderBanner || "Edexcel CS AutoGrader"}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {assignmentMode === "task" ? "Practice Task" : "Assessment"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {customSubtitle || customInstructions || title}
              </p>
            </div>
          )}
        </div>

        {/* Options & Action Row */}
        <div className="pt-3 space-y-3 border-t border-slate-100">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={allowCopyPaste}
              onChange={(e) => setAllowCopyPaste(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5 shrink-0"
            />
            <div>
              <span className="font-bold text-slate-800">Allow students to Copy & Paste code/text</span>
              <span className="text-[11px] text-slate-500 block">
                {allowCopyPaste
                  ? "Enabled: Students can copy code snippets and use keyboard shortcuts (Ctrl+C, Ctrl+V)."
                  : "Strictly disabled: Keyboard copy/paste shortcuts (Ctrl+C, Ctrl+V, Ctrl+X) and copy buttons are hidden and blocked."}
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showOperatorToolbar}
              onChange={(e) => setShowOperatorToolbar(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5 shrink-0"
            />
            <div>
              <span className="font-bold text-slate-800">Show IDLE Relational & Arithmetic Operator Strip</span>
              <span className="text-[11px] text-slate-500 block">
                Helper buttons for relational and arithmetic operators (==, !=, &lt;=, &gt;=, //, %, **) (hidden by default in formal assessments).
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showScoreImmediately}
              onChange={(e) => setShowScoreImmediately(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5 shrink-0"
            />
            <div>
              <span className="font-bold text-slate-800">Show candidate auto-marked score immediately</span>
              <span className="text-[11px] text-slate-500 block">
                Display total marks, percentage, and 9-1 grade right after candidate finishes.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={shareSolutions}
              onChange={(e) => setShareSolutions(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Share Mark Scheme & Model Solutions with Students</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  shareSolutions ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-purple-100 text-purple-800 border border-purple-300"
                }`}>
                  {shareSolutions ? "Visible to Students on Submission" : "Withheld from Students (Teacher Only)"}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                {shareSolutions
                  ? "Enabled: Students can inspect the fully solved Python programs and step-by-step mark breakdown once they submit."
                  : "Withheld (Recommended for Formal Exams): Model solutions and mark breakdown remain confidential to teacher; students only see score/grade."}
              </span>
            </div>
          </label>
        </div>

        {/* Grade Boundaries Configuration Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">Grade Boundaries (9-1):</span>
                {isCustomBoundaries(boundaries) ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Custom Configured
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Standard Edexcel (4CP0)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Grade 9: {boundaries[9]}% • Grade 7: {boundaries[7]}% • Grade 4: {boundaries[4]}% (Click to preview or modify thresholds)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBoundariesModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-600" />
              <span>Modify Grade Boundaries</span>
            </button>
          </div>
        </div>

        {/* Actions Row */}
        <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDeleteAssessment}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                title="Permanently delete this entire assessment"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Assignment</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting || selectedTaskIds.length === 0}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer ${
                isEditMode
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                  : assignmentMode === "task"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                  : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
              }`}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEditMode ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes to Assessment</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {assignmentMode === "task"
                      ? "Create & Launch Practice Task"
                      : "Create & Launch Exam Assessment"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

      {/* SECTION: Currently Included Questions (Live List with Add / Delete / Reorder) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Included Questions ({selectedTaskIds.length} Questions, {totalSelectedMarks} Total Marks)
              </h4>
              <p className="text-xs text-slate-500">
                Use the delete (trash) button to remove any question, or the arrows to reorder questions.
              </p>
            </div>
          </div>

          {selectedTaskIds.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedTaskIds([])}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
            >
              Clear All Questions
            </button>
          )}
        </div>

        {selectedTaskIds.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No questions selected yet</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Browse the question bank below and click &quot;+ Add to Assignment&quot; to add questions.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 divide-y divide-slate-100">
            {selectedTaskIds.map((taskId, index) => {
              const task = getTask(taskId);
              if (!task) {
                return (
                  <div
                    key={taskId}
                    className="p-3 bg-red-50 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="font-mono text-red-700 font-bold">Unknown Question ID: {taskId}</span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(taskId)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"
                      title="Remove invalid question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              }

              const diff = getTaskDifficulty(task);

              return (
                <div key={task.id} className="pt-2.5 first:pt-0">
                  <div className="flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Reorder Arrows */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveQuestion(index, -1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move question up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === selectedTaskIds.length - 1}
                        onClick={() => moveQuestion(index, 1)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move question down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Question Number Badge */}
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      Q{index + 1}
                    </span>

                    {/* Question Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900 truncate">{task.title}</span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {task.type}
                        </span>
                        {diff === "Easy" && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            Easy
                          </span>
                        )}
                        {diff === "Moderate" && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            Moderate
                          </span>
                        )}
                        {diff === "Hard" && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                            Hard
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{task.brief}</p>
                    </div>
                  </div>

                  {/* Marks & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                      {task.marks} Marks
                    </span>

                    {/* View Mark Scheme & Solved Python Program Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedMarkSchemeTaskIds((prev) => ({
                          ...prev,
                          [task.id]: !prev[task.id],
                        }));
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        expandedMarkSchemeTaskIds[task.id]
                          ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                          : "bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200"
                      }`}
                      title="Inspect neatly solved Python program and step-by-step marking rubric"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{expandedMarkSchemeTaskIds[task.id] ? "Hide Mark Scheme" : "Mark Scheme"}</span>
                    </button>

                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(task)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                      title="Preview this question"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Question Details Button */}
                    <button
                      type="button"
                      onClick={() => setEditingQuestionTask(task)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                      title="Edit question prompt, code, test cases, or marks"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* DELETE / REMOVE QUESTION BUTTON */}
                    <button
                      type="button"
                      onClick={() => removeQuestion(task.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete / remove question from this assessment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Expanded Mark Scheme & Solved Solution */}
                {expandedMarkSchemeTaskIds[task.id] && (
                  <div className="mt-3 p-4 bg-slate-50 border border-purple-200 rounded-xl space-y-3.5 text-xs">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-700" />
                        <span className="font-bold text-purple-950 uppercase tracking-wider text-[11px]">
                          Official Mark Scheme & Solved Model Solution
                        </span>
                      </div>
                      <span className="font-mono font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                        Total: {task.marks} {task.marks === 1 ? "Mark" : "Marks"}
                      </span>
                    </div>

                    {/* Solved Python Program */}
                    {task.type === "code" && task.solution && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Solved Python Program (Model Solution):</span>
                        </span>
                        <PythonSnippetViewer
                          code={task.solution}
                          title="Neatly Solved Python Solution"
                        />
                      </div>
                    )}

                    {/* Step-by-Step Marking Breakdown */}
                    {task.markPoints && task.markPoints.length > 0 ? (
                      <div className="space-y-2 pt-1">
                        <span className="font-bold text-slate-800 block">
                          Step-by-Step Marking Rubric:
                        </span>
                        <div className="space-y-2 divide-y divide-purple-100 bg-white p-3 rounded-xl border border-purple-100">
                          {task.markPoints.map((mp, mIdx) => (
                            <div key={mp.id || mIdx} className="pt-2 first:pt-0 flex items-start gap-2.5">
                              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold text-[10px] shrink-0 mt-0.5">
                                MP{mIdx + 1} ({mp.marks || 1}M)
                              </span>
                              <div className="flex-1 space-y-1">
                                <p className="font-semibold text-slate-800">
                                  {mp.description || (mp as any).criterion}
                                </p>
                                {mp.exemplarCode && (
                                  <code className="block p-2 rounded-lg bg-slate-50 border border-purple-100 font-mono text-[11px] text-purple-950 whitespace-pre overflow-x-auto">
                                    {mp.exemplarCode}
                                  </code>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : task.markScheme ? (
                      <div className="space-y-1 bg-white p-3 rounded-xl border border-purple-100">
                        <span className="font-bold text-slate-800 block">Mark Scheme Criteria:</span>
                        <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                          {task.markScheme}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* SECTION: Question Selection Engine (Curriculum Bank, Past Papers by Year, Other Assessments, Custom) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {/* Source Mode Selector Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-purple-600" />
              Add Questions to Assessment
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Select questions from Curriculum Topic Units, Past Examination Papers by Year, or your previously created Assessments.
            </p>
          </div>

          {/* Source Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setSelectionSourceTab("curriculum")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectionSourceTab === "curriculum"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Curriculum Bank (U01–U32)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectionSourceTab("past_papers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectionSourceTab === "past_papers"
                  ? "bg-white text-blue-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-blue-600" />
              <span>Past Papers by Year</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectionSourceTab("existing_assessments")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectionSourceTab === "existing_assessments"
                  ? "bg-white text-purple-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Copy className="w-3.5 h-3.5 text-purple-600" />
              <span>From Other Assessments ({availableOtherAssessments.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectionSourceTab("custom")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectionSourceTab === "custom"
                  ? "bg-white text-amber-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Custom & Similar</span>
            </button>
          </div>
        </div>

        {/* TAB 1: FROM ALREADY MADE ASSESSMENTS */}
        {selectionSourceTab === "existing_assessments" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-50/70 p-3.5 rounded-xl border border-purple-200">
              <div>
                <h5 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <Copy className="w-4 h-4 text-purple-600" />
                  Import Questions from Previously Created Assessments
                </h5>
                <p className="text-[11px] text-purple-700 mt-0.5">
                  Reuse questions from any past tests, mock exams, or practice assignments you created. Click &quot;Add All&quot; or expand to pick individual questions.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={assessmentSearchQuery}
                  onChange={(e) => setAssessmentSearchQuery(e.target.value)}
                  placeholder="Filter assessments by title or code..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {availableOtherAssessments.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No other assessments available yet</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Once you create and save assessments, you can effortlessly reuse and mix their questions here into new assessments.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectionSourceTab("curriculum")}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Browse Question Bank Instead</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                {availableOtherAssessments.map((a) => {
                  const isExpanded = expandedAssessmentId === a.id;
                  const aTaskIds = a.questionIds || [];
                  const allInCurrent =
                    aTaskIds.length > 0 && aTaskIds.every((id) => selectedTaskIds.includes(id));

                  return (
                    <div
                      key={a.id}
                      className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-all"
                    >
                      <div className="p-3.5 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 border-b border-slate-100">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900">{a.title}</span>
                            <span className="font-mono text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                              PIN: {a.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                a.type === "task"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {a.type === "task" ? "Practice Task" : "Formal Assessment"}
                            </span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {a.durationMinutes ? `${a.durationMinutes}m` : "Untimed"}
                            </span>
                            <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                              {a.maxMarks || 0} Marks
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Contains {aTaskIds.length} question(s) • Created {new Date(a.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Add All Button */}
                          <button
                            type="button"
                            onClick={() => handleAddAllFromAssessment(a)}
                            disabled={allInCurrent}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              allInCurrent
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                            }`}
                          >
                            {allInCurrent ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>All Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add All ({aTaskIds.length} Qs)</span>
                              </>
                            )}
                          </button>

                          {/* Expand / Browse Questions Toggle */}
                          <button
                            type="button"
                            onClick={() => setExpandedAssessmentId(isExpanded ? null : a.id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors flex items-center gap-1 text-xs font-semibold"
                            title={isExpanded ? "Collapse questions" : "Browse individual questions"}
                          >
                            <span>{isExpanded ? "Hide" : "Browse"}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Question List */}
                      {isExpanded && (
                        <div className="p-3 bg-slate-50/40 border-t border-slate-100 space-y-2">
                          <div className="text-[11px] font-bold text-slate-600 px-1">
                            Questions in &quot;{a.title}&quot; (Select individual questions below):
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {aTaskIds.map((taskId, qIdx) => {
                              const qTask = getTask(taskId);
                              if (!qTask) {
                                return (
                                  <div
                                    key={taskId}
                                    className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-400"
                                  >
                                    Question ID: {taskId}
                                  </div>
                                );
                              }
                              const isQSelected = selectedTaskIds.includes(qTask.id);
                              const qDiff = getTaskDifficulty(qTask);

                              return (
                                <div
                                  key={qTask.id}
                                  className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                                    isQSelected
                                      ? "bg-purple-50/70 border-purple-300 shadow-2xs"
                                      : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => toggleTask(qTask.id)}
                                    className="mt-0.5 text-purple-600 focus:outline-none shrink-0"
                                  >
                                    {isQSelected ? (
                                      <CheckSquare className="w-4 h-4 text-purple-600" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                                    )}
                                  </button>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span
                                        onClick={() => toggleTask(qTask.id)}
                                        className="font-bold text-xs text-slate-900 truncate cursor-pointer hover:text-purple-700"
                                      >
                                        Q{qIdx + 1}. {qTask.title}
                                      </span>
                                      <span className="text-[11px] font-bold text-slate-700 font-mono shrink-0">
                                        {qTask.marks}m
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{qTask.brief}</p>
                                    <div className="flex items-center justify-between gap-2 mt-2">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                          {qTask.type}
                                        </span>
                                        {qDiff === "Easy" && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                            Easy
                                          </span>
                                        )}
                                        {qDiff === "Moderate" && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                            Moderate
                                          </span>
                                        )}
                                        {qDiff === "Hard" && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                                            Hard
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenPreview(qTask)}
                                          className="p-1 rounded text-slate-500 hover:text-purple-700 hover:bg-purple-100/50"
                                          title="Preview question"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenSimilarModal(qTask)}
                                          className="p-1 rounded text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50"
                                          title="Generate AI-powered 4CP0 variation of this question"
                                        >
                                          <Wand2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => toggleTask(qTask.id)}
                                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                            isQSelected
                                              ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                                              : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                          }`}
                                        >
                                          {isQSelected ? "✓ Added" : "+ Add"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAST PAPERS BY YEAR */}
        {selectionSourceTab === "past_papers" && (
          <div className="space-y-4">
            {/* Past Papers Year Folder Navigation Bar */}
            <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/60 to-indigo-50/90 border border-blue-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
                    <Folder className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-blue-950">
                      📁 Past Examination Papers Archive (Folders by Year & Series)
                    </h4>
                    <p className="text-[11px] text-blue-700/80">
                      Select any exam series below to select entire papers or pick individual genuine questions
                    </p>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search past paper questions..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Year / Series Folder Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedPastPaperFolder("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedPastPaperFolder === "ALL"
                      ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-300"
                      : "bg-white text-blue-900 border border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  All Past Papers
                </button>

                {pastPaperGroups.map((g) => {
                  const isSelected = selectedPastPaperFolder === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedPastPaperFolder(g.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-blue-700 text-white shadow-sm ring-2 ring-blue-400"
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

            {/* Display Filtered Past Paper Groups */}
            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
              {filteredPastPaperGroups.map((group) => {
                const groupTasks = group.tasks.filter((t) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    t.title.toLowerCase().includes(q) ||
                    t.brief.toLowerCase().includes(q) ||
                    t.id.toLowerCase().includes(q) ||
                    (t.starterFileName || "").toLowerCase().includes(q)
                  );
                });
                if (groupTasks.length === 0) return null;

                const allInGroupSelected =
                  groupTasks.length > 0 && groupTasks.every((t) => selectedTaskIds.includes(t.id));

                return (
                  <div
                    key={group.id}
                    className="border border-blue-200 rounded-xl overflow-hidden bg-white shadow-xs"
                  >
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50/80 to-slate-50 border-b border-blue-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-900 text-sm">{group.paperTitle}</span>
                        <span className="text-xs text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded-full">
                          {group.year} • {group.session} • {groupTasks.length} Qs
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddAllFromPastPaper(groupTasks, group.paperTitle)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          allInGroupSelected
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                        }`}
                      >
                        {allInGroupSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Entire Paper Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Entire Paper ({groupTasks.length} Qs)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {groupTasks.map((t) => {
                        const isSelected = selectedTaskIds.includes(t.id);
                        const diff = getTaskDifficulty(t);

                        return (
                          <div
                            key={t.id}
                            className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                              isSelected
                                ? "bg-blue-50/80 border-blue-300 shadow-xs"
                                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleTask(t.id)}
                              className="mt-0.5 text-blue-600 focus:outline-none shrink-0"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  onClick={() => toggleTask(t.id)}
                                  className="font-bold text-slate-900 text-xs truncate cursor-pointer hover:text-blue-700"
                                >
                                  {t.title}
                                </span>
                                <span className="text-[11px] font-bold text-slate-600 font-mono shrink-0">
                                  {t.marks}m
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">{t.brief}</p>

                              <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                    {t.type}
                                  </span>
                                  {t.starterFileName && (
                                    <span className="text-amber-900 font-mono font-bold bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                                      {t.starterFileName}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPreview(t)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600 hover:text-blue-700 hover:bg-blue-100/60 transition-colors"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Preview</span>
                                  </button>

                                  {isSelected ? (
                                    <button
                                      type="button"
                                      onClick={() => removeQuestion(t.id)}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 transition-colors"
                                    >
                                      <Check className="w-3 h-3 text-blue-700" />
                                      <span>In Assessment</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => addQuestion(t.id)}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                    >
                                      <Plus className="w-3 h-3 text-emerald-600" />
                                      <span>Add</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3 & 4: CURRICULUM TOPIC UNITS & CUSTOM BANK */}
        {(selectionSourceTab === "curriculum" || selectionSourceTab === "custom") && (
          <div className="space-y-4">
            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {selectionSourceTab === "custom"
                      ? "Custom Teacher Uploads & Similar Questions"
                      : "Curriculum Topic Units (U01–U32)"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Search and select questions aligned with Pearson Edexcel Computer Science.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks by keyword or code..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                {selectionSourceTab === "curriculum" && (
                  <select
                    value={paperFilter}
                    onChange={(e) => setPaperFilter(e.target.value as any)}
                    className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="Paper 2">💻 Paper 2 (Onscreen Python)</option>
                    <option value="Paper 1">📄 Paper 1 (Written Theory)</option>
                    <option value="all">🌐 All Papers</option>
                  </select>
                )}

                {selectionSourceTab === "curriculum" && (
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value as any)}
                    className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="all">All Sources</option>
                    <option value="past_papers">Past Papers & 2025 Series</option>
                    <option value="teacher">Teacher Uploads & Custom</option>
                    <option value="similar">AI Generated Similar</option>
                  </select>
                )}

                <select
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none max-w-xs font-semibold text-slate-800"
                >
                  <option value="all">All Units & Past Papers</option>
                  <optgroup label="📁 Past Examination Papers">
                    <option value="all_past_papers">📂 All Past Papers</option>
                    {pastPaperUnits.map((u) => (
                      <option key={u.code} value={u.code}>
                        📅 {u.title} ({u.tasks.length} Qs)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📚 Curriculum Topic Units">
                    {curriculumUnits.map((u) => (
                      <option key={u.code} value={u.code}>
                        {u.code}: {u.title} ({u.tasks.length} Qs)
                      </option>
                    ))}
                  </optgroup>
                  {customUnits.length > 0 && (
                    <optgroup label="🛠️ Custom & Teacher Units">
                      {customUnits.map((u) => (
                        <option key={u.code} value={u.code}>
                          {u.code}: {u.title} ({u.tasks.length} Qs)
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>

                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="text-xs py-1.5 px-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none font-semibold text-slate-800"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">🟢 Easy</option>
                  <option value="Moderate">🟡 Moderate</option>
                  <option value="Hard">🟣 Hard</option>
                </select>
              </div>
            </div>

            {/* Units and Question Accordion List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {filteredUnits
                .filter((u) => {
                  if (selectionSourceTab === "custom") {
                    return u.tasks.some(
                      (t) =>
                        t.custom ||
                        t.authorName ||
                        t.isSimilar ||
                        t.generationMode === "generate_similar"
                    );
                  }
                  return true;
                })
                .map((u) => {
                  const tasksToRender =
                    selectionSourceTab === "custom"
                      ? u.tasks.filter(
                          (t) =>
                            t.custom ||
                            t.authorName ||
                            t.isSimilar ||
                            t.generationMode === "generate_similar"
                        )
                      : u.tasks;

                  const unitTaskIds = tasksToRender.map((t) => t.id);
                  const allSelected =
                    unitTaskIds.length > 0 &&
                    unitTaskIds.every((id) => selectedTaskIds.includes(id));

                  return (
                    <div
                      key={u.code}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
                    >
                      {/* Unit Header */}
                      <div className="px-4 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-200 font-mono text-xs font-bold text-slate-800">
                            {u.code}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{u.title}</span>
                          <span className="text-xs text-slate-500 hidden sm:inline">
                            ({tasksToRender.length} tasks)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (allSelected) {
                              setSelectedTaskIds((prev) =>
                                prev.filter((id) => !unitTaskIds.includes(id))
                              );
                            } else {
                              setSelectedTaskIds((prev) =>
                                Array.from(new Set([...prev, ...unitTaskIds]))
                              );
                            }
                          }}
                          className="text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
                        >
                          {allSelected ? "Deselect All in Unit" : "Select All in Unit"}
                        </button>
                      </div>

                      {/* Tasks List */}
                      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {tasksToRender.map((t) => {
                          const isSelected = selectedTaskIds.includes(t.id);
                          return (
                            <div
                              key={t.id}
                              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                                isSelected
                                  ? "bg-purple-50/80 border-purple-300 shadow-sm"
                                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                              }`}
                            >
                              {/* Checkbox Toggle */}
                              <button
                                type="button"
                                onClick={() => toggleTask(t.id)}
                                className="mt-0.5 text-purple-600 focus:outline-none shrink-0"
                                title={isSelected ? "Remove from assessment" : "Add to assessment"}
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-purple-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span
                                    onClick={() => toggleTask(t.id)}
                                    className="font-bold text-slate-900 text-xs truncate cursor-pointer hover:text-purple-700"
                                    title="Click to toggle selection"
                                  >
                                    {t.title}
                                  </span>
                                  <span className="text-[11px] font-bold text-slate-600 font-mono shrink-0">
                                    {t.marks}m
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.brief}</p>

                                <div className="flex items-center justify-between gap-2 mt-2">
                                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                                    <span className="capitalize font-medium text-slate-500">{t.type}</span>
                                    <span>•</span>
                                    {(() => {
                                      const diff = getTaskDifficulty(t);
                                      if (diff === "Easy") {
                                        return (
                                          <span className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            Easy
                                          </span>
                                        );
                                      }
                                      if (diff === "Moderate") {
                                        return (
                                          <span className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-200">
                                            Moderate
                                          </span>
                                        );
                                      }
                                      return (
                                        <span className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-purple-100 text-purple-800 border border-purple-200">
                                          Hard
                                        </span>
                                      );
                                    })()}
                                    {t.starterFileName && (
                                      <span className="text-amber-900 font-mono font-bold bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                                        {t.starterFileName}
                                      </span>
                                    )}
                                    {t.custom && (
                                      <span className="text-purple-900 font-bold bg-purple-100 border border-purple-200 px-1.5 py-0.5 rounded text-[10px]">
                                        Teacher
                                      </span>
                                    )}
                                    {(t.isSimilar || t.generationMode === "generate_similar") && (
                                      <span className="text-indigo-900 font-bold bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 rounded text-[10px]">
                                        Similar
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {/* Preview Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPreview(t)}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600 hover:text-purple-700 hover:bg-purple-100/60 transition-colors"
                                      title="Preview question"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Preview</span>
                                    </button>

                                    {/* Generate Similar Quick Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenSimilarModal(t)}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors"
                                      title="Generate an AI-powered 4CP0 variation of this question"
                                    >
                                      <Wand2 className="w-3 h-3 text-indigo-600" />
                                      <span>Similar</span>
                                    </button>

                                    {/* ADD / REMOVE BUTTON */}
                                    {isSelected ? (
                                      <button
                                        type="button"
                                        onClick={() => removeQuestion(t.id)}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-purple-800 bg-purple-100 hover:bg-purple-200 transition-colors"
                                        title="Click to remove from assessment"
                                      >
                                        <Check className="w-3 h-3 text-purple-700" />
                                        <span>In Assessment</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => addQuestion(t.id)}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                        title="Add question to assessment"
                                      >
                                        <Plus className="w-3 h-3 text-emerald-600" />
                                        <span>Add</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Question Detail Modal */}
      <QuestionPreviewModal
        task={previewTask}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        isSelected={previewTask ? selectedTaskIds.includes(previewTask.id) : false}
        onToggleSelect={toggleTask}
        onGenerateSimilar={(task) => handleOpenSimilarModal(task)}
        onNextQuestion={handleNextPreview}
        onPrevQuestion={handlePrevPreview}
        hasPrev={previewTaskIndex > 0}
        hasNext={previewTaskIndex >= 0 && previewTaskIndex < allVisibleTasks.length - 1}
      />

      {/* AI Generate Similar Question Modal */}
      <SimilarQuestionModal
        isOpen={Boolean(similarModalTask)}
        onClose={() => setSimilarModalTask(null)}
        sourceTask={similarModalTask}
        onQuestionSaved={(task) => {
          if (onQuestionUpdated) {
            onQuestionUpdated(task);
          }
        }}
        onAddToAssessment={(task) => {
          addQuestion(task.id);
        }}
      />

      {/* Edit Question Details Modal */}
      {editingQuestionTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto">
            <ManualQuestionBuilder
              units={units}
              initialTask={editingQuestionTask}
              onQuestionCreated={(updatedTask) => {
                if (onQuestionUpdated) {
                  onQuestionUpdated(updatedTask);
                }
                setEditingQuestionTask(null);
                setStatusMessage(`Question "${updatedTask.title}" updated successfully!`);
                setTimeout(() => setStatusMessage(null), 3500);
              }}
              onCancel={() => setEditingQuestionTask(null)}
            />
          </div>
        </div>
      )}

      {/* Grade Boundaries Modal */}
      {showBoundariesModal && (
        <GradeBoundariesModal
          assessment={{
            ...(editingAssessment || {
              id: "temp_new",
              title,
              code: "NEW",
              maxMarks: totalSelectedMarks || 20,
              questionIds: selectedTaskIds,
              createdAt: Date.now(),
              status: "active",
              durationMinutes: Number(durationMinutes) || 0,
              showScoreImmediately,
            }),
            maxMarks: totalSelectedMarks || 20,
            gradeBoundaries: boundaries,
          }}
          onClose={() => setShowBoundariesModal(false)}
          onSaved={(newBoundaries) => {
            setBoundaries(newBoundaries);
          }}
        />
      )}
    </div>
  );
};
