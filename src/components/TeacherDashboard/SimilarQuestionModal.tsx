import React, { useState, useEffect } from "react";
import { IGCSETask } from "../../types";
import { teacherFetch } from "../../utils/teacherAuth";
import {
  Sparkles,
  Wand2,
  X,
  RefreshCw,
  Check,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Table,
  Sliders,
  Code,
  FileText,
  Plus,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface SimilarQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceTask: IGCSETask | null;
  onQuestionSaved: (task: IGCSETask) => void;
  onAddToAssessment?: (task: IGCSETask) => void;
  onSetAsTask?: (task: IGCSETask) => void;
  onSetAsAssessment?: (task: IGCSETask) => void;
}

export const SimilarQuestionModal: React.FC<SimilarQuestionModalProps> = ({
  isOpen,
  onClose,
  sourceTask,
  onQuestionSaved,
  onAddToAssessment,
  onSetAsTask,
  onSetAsAssessment,
}) => {
  const [variationMode, setVariationMode] = useState<
    "parallel" | "easier" | "harder" | "code_to_trace" | "code_to_inspect"
  >("parallel");
  const [customDirective, setCustomDirective] = useState<string>("");
  const [targetMarksOverride, setTargetMarksOverride] = useState<number | "">("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTask, setGeneratedTask] = useState<IGCSETask | null>(null);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<
    "brief" | "starter" | "solution" | "tests" | "rubric"
  >("brief");
  const [isEditingGenerated, setIsEditingGenerated] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [editableBrief, setEditableBrief] = useState("");
  const [editableStarter, setEditableStarter] = useState("");
  const [editableSolution, setEditableSolution] = useState("");
  const [editableMarks, setEditableMarks] = useState<number>(3);

  // Reset when source task changes or modal opens
  useEffect(() => {
    if (isOpen && sourceTask) {
      setGeneratedTask(null);
      setError(null);
      setSavedSuccessMessage(null);
      setVariationMode("parallel");
      setCustomDirective("");
      setTargetMarksOverride("");
      setIsEditingGenerated(false);
      setActivePreviewTab("brief");
      setEditableTitle("");
      setEditableBrief("");
      setEditableStarter("");
      setEditableSolution("");
      setEditableMarks(sourceTask.marks || 3);
    }
  }, [isOpen, sourceTask]);

  if (!isOpen || !sourceTask) return null;

  const getEffectiveGeneratedTask = (): IGCSETask => {
    if (!generatedTask) throw new Error("No task generated");
    return {
      ...generatedTask,
      title: editableTitle || generatedTask.title,
      brief: editableBrief || generatedTask.brief,
      starter: editableStarter !== undefined ? editableStarter : generatedTask.starter,
      solution: editableSolution !== undefined ? editableSolution : generatedTask.solution,
      marks: Number(editableMarks) || generatedTask.marks,
    };
  };

  const handleGenerateSimilar = async () => {
    setIsGenerating(true);
    setError(null);
    setSavedSuccessMessage(null);

    try {
      let targetMarks =
        targetMarksOverride !== "" ? Number(targetMarksOverride) : sourceTask.marks;
      if (targetMarksOverride === "") {
        if (variationMode === "easier") targetMarks = Math.max(1, sourceTask.marks - 1);
        if (variationMode === "harder") targetMarks = sourceTask.marks + 2;
        if (variationMode === "code_to_trace" || variationMode === "code_to_inspect")
          targetMarks = 3;
      }

      const res = await teacherFetch("/api/generate-similar-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceTask,
          variationMode,
          customInstruction: customDirective.trim() || undefined,
          targetMarks,
          preferredDifficulty:
            variationMode === "easier"
              ? "Easy"
              : variationMode === "harder"
              ? "Hard"
              : "Moderate",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate similar question");
      }

      const data = await res.json();
      if (!data.task) throw new Error("Invalid response received from generator");

      setGeneratedTask(data.task);
      setEditableTitle(data.task.title || "");
      setEditableBrief(data.task.brief || "");
      setEditableStarter(data.task.starter || "");
      setEditableSolution(data.task.solution || "");
      setEditableMarks(data.task.marks || targetMarks);
      setActivePreviewTab("brief");
      setIsEditingGenerated(false);
    } catch (err: any) {
      console.error("AI question variation generation error:", err);
      setError(err.message || "Failed to generate similar question.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToBankOnly = async () => {
    try {
      const task = getEffectiveGeneratedTask();
      const res = await teacherFetch("/api/custom-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        onQuestionSaved(task);
        setSavedSuccessMessage(`✓ Successfully added "${task.title}" to the Question Bank.`);
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save question to Question Bank.");
    }
  };

  const handleSaveAndAddToAssessment = async () => {
    try {
      const task = getEffectiveGeneratedTask();
      const res = await teacherFetch("/api/custom-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        onQuestionSaved(task);
        if (onAddToAssessment) {
          onAddToAssessment(task);
        }
        onClose();
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save question to assessment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
              <Wand2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  Generate Similar Question
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950">
                  Pearson 4CP0 AI Engine
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Derives an authentic syllabus-aligned variation preserving 4CP0 mark scheme criteria and test suites.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Source Question Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Original Question Source
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {sourceTask.unit} • {sourceTask.type.toUpperCase()}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  {sourceTask.marks} Marks
                </span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-900">{sourceTask.title}</h4>
            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
              {sourceTask.brief}
            </p>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block flex items-center justify-between">
              <span>Choose Variation Mode:</span>
              <span className="text-[11px] font-normal text-slate-500">
                Aligned with Pearson Edexcel Specification 4CP0
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {/* Mode 1: Parallel */}
              <button
                type="button"
                onClick={() => setVariationMode("parallel")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  variationMode === "parallel"
                    ? "bg-purple-50/90 border-purple-500 ring-2 ring-purple-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Parallel Variant
                  </span>
                  {variationMode === "parallel" && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Same marks and cognitive level. Transfers logic to a fresh authentic scenario (e.g. drone telemetry, sensor log).
                </p>
              </button>

              {/* Mode 2: Easier */}
              <button
                type="button"
                onClick={() => {
                  setVariationMode("easier");
                  if (targetMarksOverride === "") {
                    setTargetMarksOverride(Math.max(1, sourceTask.marks - 1));
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  variationMode === "easier"
                    ? "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    Foundation / Scaffolded
                  </span>
                  {variationMode === "easier" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Simpler requirement with scaffolded starter code comments for reinforcement.
                </p>
              </button>

              {/* Mode 3: Harder */}
              <button
                type="button"
                onClick={() => {
                  setVariationMode("harder");
                  if (targetMarksOverride === "") {
                    setTargetMarksOverride(sourceTask.marks + 2);
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  variationMode === "harder"
                    ? "bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-rose-600" />
                    Higher / Extension
                  </span>
                  {variationMode === "harder" && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Adds validation, boundary cases, and edge handling to challenge high-achievers.
                </p>
              </button>

              {/* Mode 4: Code to Trace */}
              <button
                type="button"
                onClick={() => {
                  setVariationMode("code_to_trace");
                  setTargetMarksOverride(3);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  variationMode === "code_to_trace"
                    ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-amber-600" />
                    Trace Table Conversion
                  </span>
                  {variationMode === "code_to_trace" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Converts the programming task into a Paper 2 dry-run trace table question.
                </p>
              </button>

              {/* Mode 5: Code to Inspect */}
              <button
                type="button"
                onClick={() => {
                  setVariationMode("code_to_inspect");
                  setTargetMarksOverride(3);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  variationMode === "code_to_inspect"
                    ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-blue-600" />
                    Code Inspection & Debug
                  </span>
                  {variationMode === "code_to_inspect" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Paper 2 program analysis, line referencing, and syntax/logic error identification.
                </p>
              </button>
            </div>
          </div>

          {/* Teacher Custom Context & Marks Customization */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="sm:col-span-3">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Custom Scenario or Teacher Directive (Optional):
              </label>
              <input
                type="text"
                value={customDirective}
                onChange={(e) => setCustomDirective(e.target.value)}
                placeholder="e.g. Focus on greenhouse temperature regulation, require sentinel loop, or 2 decimal place formatting"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Target Marks:
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={
                  targetMarksOverride !== ""
                    ? targetMarksOverride
                    : variationMode === "easier"
                    ? Math.max(1, sourceTask.marks - 1)
                    : variationMode === "harder"
                    ? sourceTask.marks + 2
                    : variationMode === "code_to_trace" || variationMode === "code_to_inspect"
                    ? 3
                    : sourceTask.marks
                }
                onChange={(e) => setTargetMarksOverride(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          {!generatedTask && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleGenerateSimilar}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deriving 4CP0 Question with Gemini API...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate 4CP0 Question with Gemini 3.8 Flash</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Generated Question Preview */}
          {generatedTask && (
            <div className="space-y-4 pt-2 border-t border-slate-200 animate-in fade-in duration-200">
              {savedSuccessMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{savedSuccessMessage}</span>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-100 text-indigo-900">
                      {generatedTask.unit}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-900">
                      {editableMarks} Marks
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-900">
                      {generatedTask.type.toUpperCase()}
                    </span>
                    {generatedTask.commandWord && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900">
                        Command: {generatedTask.commandWord}
                      </span>
                    )}
                    {generatedTask.specReference && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-800">
                        {generatedTask.specReference}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {generatedTask.modelUsed || "gemini-3.8-flash"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingGenerated(!isEditingGenerated)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                    >
                      {isEditingGenerated ? "View Preview" : "Edit Details"}
                    </button>
                  </div>
                </div>

                {/* Title */}
                {isEditingGenerated ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Question Title:</label>
                    <input
                      type="text"
                      value={editableTitle}
                      onChange={(e) => setEditableTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ) : (
                  <h4 className="text-base font-extrabold text-slate-900">
                    {editableTitle || generatedTask.title}
                  </h4>
                )}

                {/* Preview Tabs */}
                <div className="flex items-center gap-1 border-b border-indigo-100 pb-1.5 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab("brief")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activePreviewTab === "brief"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    Brief / Scenario
                  </button>
                  {generatedTask.starter && (
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab("starter")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activePreviewTab === "starter"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      Starter Code
                    </button>
                  )}
                  {generatedTask.solution && (
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab("solution")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activePreviewTab === "solution"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      Model Solution
                    </button>
                  )}
                  {generatedTask.tests && generatedTask.tests.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab("tests")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activePreviewTab === "tests"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      Test Suite ({generatedTask.tests.length})
                    </button>
                  )}
                  {(generatedTask.markScheme || generatedTask.markPoints) && (
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab("rubric")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activePreviewTab === "rubric"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      Mark Scheme
                    </button>
                  )}
                </div>

                {/* Tab Body */}
                {isEditingGenerated ? (
                  <div className="space-y-3 bg-white p-3.5 rounded-xl border border-indigo-100">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Problem Brief / Requirements:
                      </label>
                      <textarea
                        rows={5}
                        value={editableBrief}
                        onChange={(e) => setEditableBrief(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {generatedTask.type === "code" && (
                      <>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Starter Code Scaffold:
                          </label>
                          <textarea
                            rows={4}
                            value={editableStarter}
                            onChange={(e) => setEditableStarter(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Reference Solution:
                          </label>
                          <textarea
                            rows={5}
                            value={editableSolution}
                            onChange={(e) => setEditableSolution(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Marks Allocated:
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={editableMarks}
                        onChange={(e) => setEditableMarks(Number(e.target.value) || 1)}
                        className="w-32 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {activePreviewTab === "brief" && (
                      <div className="p-3.5 rounded-xl bg-white border border-indigo-100 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {editableBrief || generatedTask.brief}
                      </div>
                    )}

                    {activePreviewTab === "starter" && (
                      <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-56">
                        {editableStarter || generatedTask.starter || "# No starter code provided"}
                      </pre>
                    )}

                    {activePreviewTab === "solution" && (
                      <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-56">
                        {editableSolution || generatedTask.solution || "# Reference solution"}
                      </pre>
                    )}

                    {activePreviewTab === "tests" && generatedTask.tests && (
                      <div className="space-y-2">
                        {generatedTask.tests.map((test, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white border border-indigo-100 text-xs flex items-center justify-between gap-3"
                          >
                            <div className="space-y-0.5">
                              <div className="font-semibold text-slate-800">
                                <span className="text-slate-500 font-mono">Test {idx + 1} Input:</span>{" "}
                                <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono font-bold">
                                  {JSON.stringify(test.in)}
                                </code>
                              </div>
                              <div className="text-slate-600">
                                <span className="text-slate-500 font-mono">Expected Output:</span>{" "}
                                <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono font-bold">
                                  {test.out.trim()}
                                </code>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                              {test.m}m
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activePreviewTab === "rubric" && (
                      <div className="p-3.5 rounded-xl bg-white border border-indigo-100 text-xs space-y-2">
                        {generatedTask.markScheme && (
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {generatedTask.markScheme}
                          </p>
                        )}
                        {generatedTask.markPoints && (
                          <div className="space-y-1.5 pt-1 border-t border-slate-100">
                            {generatedTask.markPoints.map((mp, i) => (
                              <div key={i} className="flex items-start gap-2 text-slate-700">
                                <span className="font-mono font-bold text-indigo-600 shrink-0">
                                  {mp.id || `MP${i + 1}`} ({mp.marks}m):
                                </span>
                                <span>{mp.criterion}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions for Generated Question */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {onAddToAssessment ? (
                    <button
                      type="button"
                      onClick={handleSaveAndAddToAssessment}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Save to Bank & Add to Assessment</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveToBankOnly}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save to Question Bank</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleGenerateSimilar}
                    disabled={isGenerating}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                    <span>Regenerate Another Variant</span>
                  </button>
                </div>

                {/* Additional Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {onAddToAssessment && (
                    <button
                      type="button"
                      onClick={handleSaveToBankOnly}
                      className="py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-purple-600" />
                      <span>Save to Bank Only</span>
                    </button>
                  )}

                  {onSetAsTask && (
                    <button
                      type="button"
                      onClick={() => {
                        const task = getEffectiveGeneratedTask();
                        handleSaveToBankOnly();
                        onSetAsTask(task);
                        onClose();
                      }}
                      className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Set as Practice Task</span>
                    </button>
                  )}

                  {onSetAsAssessment && (
                    <button
                      type="button"
                      onClick={() => {
                        const task = getEffectiveGeneratedTask();
                        handleSaveToBankOnly();
                        onSetAsAssessment(task);
                        onClose();
                      }}
                      className="py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-600" />
                      <span>Set as Formal Exam</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
