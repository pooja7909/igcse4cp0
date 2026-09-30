import React, { useState, useEffect } from "react";
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Code2,
  Bug,
  Zap,
  ArrowRight,
  RefreshCw,
  X,
  Compass,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { IGCSETask, MarkResult, AiPracticeScaffold } from "../../types";
import { copyToClipboard } from "../../utils/clipboard";

interface AiPracticeScaffoldPanelProps {
  task: IGCSETask;
  studentAnswer: any;
  consoleOutput?: string;
  markResult?: MarkResult | null;
  onApplyStarterTemplate?: (template: string) => void;
  className?: string;
  isAssessment?: boolean;
}

export const AiPracticeScaffoldPanel: React.FC<AiPracticeScaffoldPanelProps> = ({
  task,
  studentAnswer,
  consoleOutput = "",
  markResult,
  onApplyStarterTemplate,
  className = "",
  isAssessment = false,
}) => {
  // Strictly hide if student is doing an assessment
  if (isAssessment) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scaffold, setScaffold] = useState<AiPracticeScaffold | null>(null);
  const [activeTab, setActiveTab] = useState<"scaffold" | "diagnose" | "improve">("scaffold");
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [hasPromptedStruggle, setHasPromptedStruggle] = useState(false);

  // Check if student is struggling based on runtime error or failed auto-marker test
  const hasRuntimeError =
    consoleOutput.includes("Traceback") ||
    consoleOutput.includes("Error:") ||
    consoleOutput.includes("[Runtime Error]");

  const hasFailedTests =
    markResult !== null &&
    markResult !== undefined &&
    (!markResult.passed || markResult.m < markResult.M);

  const isStruggling = hasRuntimeError || hasFailedTests;

  // Auto-alert student gently once if they experience a test failure or runtime crash
  useEffect(() => {
    if (isStruggling && !hasPromptedStruggle && !isOpen) {
      setHasPromptedStruggle(true);
    }
  }, [isStruggling, hasPromptedStruggle, isOpen]);

  // Reset when question changes
  useEffect(() => {
    setScaffold(null);
    setErrorMsg(null);
    setHasPromptedStruggle(false);
    setActiveLevel(1);
    setActiveTab("scaffold");
  }, [task.id]);

  const fetchScaffold = async (
    reason: "stuck_blank" | "test_failed" | "runtime_error" | "general" | "improve" = "general",
    targetTab?: "scaffold" | "diagnose" | "improve",
    targetLevel?: 1 | 2 | 3
  ) => {
    setLoading(true);
    setErrorMsg(null);
    setIsOpen(true);
    if (targetTab) setActiveTab(targetTab);
    if (targetLevel) setActiveLevel(targetLevel);

    try {
      const failedDetail = markResult?.detail
        ? markResult.detail.filter((t: any) => !t.passed)
        : undefined;

      const res = await fetch("/api/ai/practice-scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          studentAnswer,
          consoleOutput,
          failedTests: failedDetail,
          struggleReason: reason,
          scaffoldLevel: targetLevel || activeLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load guidance");
      }

      setScaffold(data.scaffold);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not retrieve AI guidance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySnippet = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 1. Proactive Helper Banner when Student Struggles or Test Fails */}
      {isStruggling && !isOpen && (
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                {hasRuntimeError ? "Program Error Encountered" : "Test Case Not Passing Yet"}
              </span>
              <p className="text-xs text-amber-800">
                Stuck on this step? AI can analyze your code, explain what went wrong, and guide you to the fix.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchScaffold(hasRuntimeError ? "runtime_error" : "test_failed", "diagnose")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnose What Went Wrong</span>
            </button>
            <button
              type="button"
              onClick={() => fetchScaffold("general", "scaffold", 1)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Get Hint</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Trigger Action Bar */}
      {!isOpen ? (
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              if (!scaffold) {
                fetchScaffold(
                  !studentAnswer || studentAnswer === task.starter ? "stuck_blank" : "general"
                );
              } else {
                setIsOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 text-purple-900 font-bold text-xs shadow-xs transition-all cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-purple-600 group-hover:rotate-12 transition-transform" />
            <span>AI Practice Tutor & Scaffolding</span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-purple-200/70 text-purple-800">
              Guidance
            </span>
          </button>

          {/* Quick Start pill if answer is empty */}
          {(!studentAnswer || studentAnswer === task.starter) && (
            <button
              type="button"
              onClick={() => fetchScaffold("stuck_blank", "scaffold", 1)}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Not sure how to start? Get a starting clue</span>
            </button>
          )}
        </div>
      ) : (
        /* 3. Expanded AI Scaffolding Drawer */
        <div className="bg-gradient-to-b from-purple-50/60 to-indigo-50/40 border-2 border-purple-300/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-purple-950">
                    AI Practice Tutor & Scaffolding
                  </h4>
                  {scaffold?.concept && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900">
                      {scaffold.concept}
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-700/90">
                  Step-by-step guidance tailored to Edexcel IGCSE Computer Science.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchScaffold("general")}
                disabled={loading}
                title="Re-analyze with your latest edits"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 hover:bg-purple-100 text-purple-800 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Re-Analyze</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border border-purple-200 cursor-pointer"
                title="Minimize Guidance"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-purple-200/60 pb-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("scaffold")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "scaffold"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-white text-purple-800 hover:bg-purple-100 border border-purple-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Step-by-Step Scaffolding</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("diagnose")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "diagnose"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-white text-purple-800 hover:bg-purple-100 border border-purple-200"
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>What Went Wrong?</span>
              {isStruggling && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("improve")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "improve"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-white text-purple-800 hover:bg-purple-100 border border-purple-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>How to Improve</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center space-y-3 bg-white/70 rounded-xl border border-purple-200">
              <Sparkles className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-purple-900">
                AI is analyzing your program against Edexcel Paper 2 criteria...
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={() => fetchScaffold("general")}
                className="underline font-bold ml-2 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content Views */}
          {!loading && scaffold && (
            <div className="space-y-4">
              {/* TAB 1: SCAFFOLDING LEVELS */}
              {activeTab === "scaffold" && (
                <div className="space-y-3.5">
                  {/* Level Switcher */}
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-purple-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setActiveLevel(1)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeLevel === 1
                          ? "bg-purple-100 text-purple-900 shadow-xs ring-1 ring-purple-300"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      💡 Level 1: Concept Clue
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLevel(2)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeLevel === 2
                          ? "bg-purple-100 text-purple-900 shadow-xs ring-1 ring-purple-300"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🪜 Level 2: Logic Steps
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLevel(3)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeLevel === 3
                          ? "bg-purple-100 text-purple-900 shadow-xs ring-1 ring-purple-300"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      💻 Level 3: Code Structure
                    </button>
                  </div>

                  {/* Level 1 Content */}
                  {activeLevel === 1 && (
                    <div className="bg-white border border-purple-200 rounded-xl p-4 space-y-2.5 shadow-xs">
                      <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Level 1: Understand the Requirement</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {scaffold.level1Clue}
                      </p>
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setActiveLevel(2)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline cursor-pointer"
                        >
                          <span>Still unsure? See Step-by-Step Logic (Level 2)</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Level 2 Content */}
                  {activeLevel === 2 && (
                    <div className="bg-white border border-purple-200 rounded-xl p-4 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
                          <Layers className="w-4 h-4 text-indigo-600" />
                          <span>Level 2: Step-by-Step Logic Breakdown</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Follow each step in order
                        </span>
                      </div>

                      <div className="space-y-2">
                        {scaffold.level2LogicSteps?.map((stepText, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-purple-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{stepText}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setActiveLevel(1)}
                          className="text-xs font-medium text-slate-500 hover:text-slate-800"
                        >
                          ← Back to Concept
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveLevel(3)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline cursor-pointer"
                        >
                          <span>Need syntax help? View Code Skeleton (Level 3)</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Level 3 Content */}
                  {activeLevel === 3 && (
                    <div className="bg-white border border-purple-200 rounded-xl p-4 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
                          <Code2 className="w-4 h-4 text-emerald-600" />
                          <span>Level 3: Structural Code Skeleton</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopySnippet(scaffold.level3Structure)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            {copiedSnippet ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSnippet ? "Copied" : "Copy Skeleton"}</span>
                          </button>
                        </div>
                      </div>

                      <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                        {scaffold.level3Structure}
                      </pre>
                      <p className="text-[11px] text-slate-500 italic">
                        Tip: Fill in the # TODO placeholders with your own variables and logic.
                      </p>
                    </div>
                  )}

                  {/* Immediate Next Step Banner */}
                  {scaffold.immediateNextStep && (
                    <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-300 rounded-xl flex items-start gap-2.5 text-xs text-emerald-950">
                      <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] block mb-0.5">
                          🎯 Your Immediate Next Move:
                        </strong>
                        <span className="font-medium leading-relaxed">
                          {scaffold.immediateNextStep}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: WHAT WENT WRONG? */}
              {activeTab === "diagnose" && (
                <div className="bg-white border border-purple-200 rounded-xl p-4 space-y-3.5 shadow-xs">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                    <Bug className="w-4 h-4 text-rose-600" />
                    <span>Analysis: What Went Wrong in Your Code</span>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                    {scaffold.whatWentWrong || "No specific syntax or runtime bugs detected in your current code snippet. Check test cases or step logic."}
                  </div>

                  {consoleOutput && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        Latest Output / Error Log:
                      </span>
                      <pre className="p-2.5 rounded bg-slate-900 text-rose-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap max-h-36">
                        {consoleOutput}
                      </pre>
                    </div>
                  )}

                  {scaffold.immediateNextStep && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>How to Fix: </strong> {scaffold.immediateNextStep}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: HOW TO IMPROVE */}
              {activeTab === "improve" && (
                <div className="bg-white border border-purple-200 rounded-xl p-4 space-y-3.5 shadow-xs">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>How to Improve Your Program & Score Full Marks</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                    {scaffold.howToImprove || "Ensure your program follows standard variable naming conventions, converts user inputs explicitly, and prints clean formatted outputs."}
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                      Edexcel Exam Conventions Checklist:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                      <li>Use meaningful variable names (e.g. <code className="font-mono bg-white px-1 border rounded">total_score</code> instead of <code className="font-mono bg-white px-1 border rounded">x</code>).</li>
                      <li>Always convert <code className="font-mono bg-white px-1 border rounded">input()</code> to <code className="font-mono bg-white px-1 border rounded">int()</code> or <code className="font-mono bg-white px-1 border rounded">float()</code> if numbers are expected.</li>
                      <li>Match the exact print string format requested in the question brief.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
