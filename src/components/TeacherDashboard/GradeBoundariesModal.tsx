import React, { useState, useMemo } from "react";
import {
  Award,
  Sliders,
  CheckCircle2,
  RotateCcw,
  X,
  AlertCircle,
  TrendingUp,
  Percent,
  Hash,
  Info,
  Check,
  Sparkles,
  Users,
} from "lucide-react";
import { Assessment, StudentSession } from "../../types";
import {
  GradeBoundaries,
  GradeTier,
  DEFAULT_GRADE_BOUNDARIES,
  GRADE_BOUNDARY_PRESETS,
  validateGradeBoundaries,
  getEdexcelGrade,
  isCustomBoundaries,
  formatBoundaryRange,
} from "../../utils/gradeBoundaries";
import { teacherFetch } from "../../utils/teacherAuth";

interface GradeBoundariesModalProps {
  assessment: Assessment;
  students?: StudentSession[];
  onClose: () => void;
  onSaved: (newBoundaries: GradeBoundaries) => void;
}

export const GradeBoundariesModal: React.FC<GradeBoundariesModalProps> = ({
  assessment,
  students = [],
  onClose,
  onSaved,
}) => {
  const maxMarks = assessment?.maxMarks || 20;

  // Initial boundaries from assessment or default
  const [boundaries, setBoundaries] = useState<GradeBoundaries>(() => {
    return {
      ...DEFAULT_GRADE_BOUNDARIES,
      ...(assessment?.gradeBoundaries || {}),
    };
  });

  const [inputMode, setInputMode] = useState<"percentage" | "marks">("percentage");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active preset identifier
  const activePresetId = useMemo(() => {
    for (const preset of GRADE_BOUNDARY_PRESETS) {
      let match = true;
      const grades: (keyof GradeBoundaries)[] = [9, 8, 7, 6, 5, 4, 3, 2, 1];
      for (const g of grades) {
        if (boundaries[g] !== preset.boundaries[g]) {
          match = false;
          break;
        }
      }
      if (match) return preset.id;
    }
    return "custom";
  }, [boundaries]);

  // Validation
  const validation = useMemo(() => {
    return validateGradeBoundaries(boundaries);
  }, [boundaries]);

  // Cohort grade distribution under current boundaries
  const cohortDistribution = useMemo(() => {
    const counts: Record<GradeTier, number> = {
      "9": 0,
      "8": 0,
      "7": 0,
      "6": 0,
      "5": 0,
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0,
      "U": 0,
    };

    const gradedStudents = students.filter(
      (s) => s.status === "submitted" || s.totalMarks !== undefined
    );

    for (const s of gradedStudents) {
      const g = getEdexcelGrade(s.percentage, boundaries, maxMarks).grade;
      counts[g] = (counts[g] || 0) + 1;
    }

    const totalGraded = gradedStudents.length;
    const passCount =
      counts["9"] + counts["8"] + counts["7"] + counts["6"] + counts["5"] + counts["4"];
    const strongPassCount =
      counts["9"] + counts["8"] + counts["7"] + counts["6"] + counts["5"];
    const topTierCount = counts["9"] + counts["8"] + counts["7"];

    return {
      counts,
      totalGraded,
      passPct: totalGraded > 0 ? Math.round((passCount / totalGraded) * 100) : 0,
      strongPassPct: totalGraded > 0 ? Math.round((strongPassCount / totalGraded) * 100) : 0,
      topTierPct: totalGraded > 0 ? Math.round((topTierCount / totalGraded) * 100) : 0,
    };
  }, [students, boundaries, maxMarks]);

  const handleApplyPreset = (presetBoundaries: GradeBoundaries) => {
    setBoundaries({ ...presetBoundaries });
    setErrorMsg(null);
  };

  const handlePercentageChange = (grade: keyof GradeBoundaries, value: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    setBoundaries((prev) => ({
      ...prev,
      [grade]: clamped,
    }));
    setErrorMsg(null);
  };

  const handleMarksChange = (grade: keyof GradeBoundaries, rawMarks: number) => {
    const clampedMarks = Math.max(0, Math.min(maxMarks, isNaN(rawMarks) ? 0 : rawMarks));
    const calculatedPct = Math.round((clampedMarks / maxMarks) * 100);
    setBoundaries((prev) => ({
      ...prev,
      [grade]: calculatedPct,
    }));
    setErrorMsg(null);
  };

  const handleResetToDefault = () => {
    setBoundaries({ ...DEFAULT_GRADE_BOUNDARIES });
    setErrorMsg(null);
  };

  const handleSave = async () => {
    const val = validateGradeBoundaries(boundaries);
    if (!val.valid) {
      setErrorMsg(val.error || "Please ensure grade boundaries are strictly decreasing from Grade 9 down to Grade 1.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await teacherFetch(`/api/assessments/${assessment.id}/grade-boundaries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gradeBoundaries: boundaries }),
      });

      if (!res.ok) {
        // Fallback to PUT
        const putRes = await teacherFetch(`/api/assessments/${assessment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gradeBoundaries: boundaries }),
        });
        if (!putRes.ok) {
          throw new Error("Failed to save grade boundaries to server.");
        }
      }

      setSuccessMsg("Grade boundaries successfully updated! All candidate grades have been recalculated.");
      onSaved(boundaries);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update grade boundaries.");
    } finally {
      setSaving(false);
    }
  };

  const gradeTiers: { grade: keyof GradeBoundaries; label: string; desc: string; color: string }[] = [
    { grade: 9, label: "Grade 9", desc: "Exceptional standard (top 3% nationally)", color: "text-emerald-700 bg-emerald-50 border-emerald-300" },
    { grade: 8, label: "Grade 8", desc: "A* equivalent boundary", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { grade: 7, label: "Grade 7", desc: "A grade equivalent benchmark", color: "text-teal-700 bg-teal-50 border-teal-300" },
    { grade: 6, label: "Grade 6", desc: "High B equivalent benchmark", color: "text-blue-700 bg-blue-50 border-blue-300" },
    { grade: 5, label: "Grade 5", desc: "Strong Pass benchmark (Department standard)", color: "text-cyan-700 bg-cyan-50 border-cyan-300" },
    { grade: 4, label: "Grade 4", desc: "Standard Pass benchmark (Level 2 pass)", color: "text-amber-700 bg-amber-50 border-amber-300" },
    { grade: 3, label: "Grade 3", desc: "Foundation tier pass benchmark", color: "text-orange-700 bg-orange-50 border-orange-300" },
    { grade: 2, label: "Grade 2", desc: "Foundation award standard", color: "text-orange-800 bg-orange-100 border-orange-300" },
    { grade: 1, label: "Grade 1", desc: "Minimum passing award benchmark", color: "text-red-700 bg-red-50 border-red-300" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Set & Modify Grade Boundaries
                </h2>
                {isCustomBoundaries(boundaries) ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Custom Adjusted
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Official Edexcel Standard
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Assessment: <span className="font-semibold text-slate-700">{assessment.title}</span> (Max:{" "}
                <span className="font-semibold text-purple-700">{maxMarks} Marks</span>)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Preset Buttons & Quick Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Pre-configured Examination Series & Presets</span>
              </label>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Official 4CP0 Standard
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {GRADE_BOUNDARY_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset.boundaries)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? "bg-purple-50/80 border-purple-500 shadow-sm ring-1 ring-purple-500/30"
                        : "bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{preset.shortLabel}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                      {preset.description}
                    </p>
                    <div className="mt-2 text-[10px] text-slate-600 font-mono flex items-center gap-1">
                      <span className="font-semibold text-purple-700">9: {preset.boundaries[9]}%</span>
                      <span>•</span>
                      <span>7: {preset.boundaries[7]}%</span>
                      <span>•</span>
                      <span>4: {preset.boundaries[4]}%</span>
                    </div>
                  </button>
                );
              })}

              <div
                className={`p-3 rounded-xl border text-left flex flex-col justify-between ${
                  activePresetId === "custom"
                    ? "bg-amber-50/80 border-amber-400 shadow-sm ring-1 ring-amber-400/30"
                    : "bg-slate-50/50 border-dashed border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Custom Thresholds</span>
                    {activePresetId === "custom" && (
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Modified percentages or raw mark targets specific to this assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Input Mode Switcher & Overview Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Threshold Input Mode:</span>
              <div className="inline-flex rounded-xl p-1 bg-slate-200/80">
                <button
                  type="button"
                  onClick={() => setInputMode("percentage")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inputMode === "percentage"
                      ? "bg-white text-purple-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Percentage (%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("marks")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inputMode === "marks"
                      ? "bg-white text-purple-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Raw Marks (/{maxMarks})</span>
                </button>
              </div>
            </div>

            {/* Quick Cohort Summary */}
            {cohortDistribution.totalGraded > 0 && (
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-emerald-700">{cohortDistribution.topTierPct}%</span>
                  <span className="text-slate-500 text-[11px]">(Grades 7–9)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-blue-700">{cohortDistribution.strongPassPct}%</span>
                  <span className="text-slate-500 text-[11px]">(Grades 5+)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-amber-700">{cohortDistribution.passPct}%</span>
                  <span className="text-slate-500 text-[11px]">(Grade 4+ Pass)</span>
                </div>
              </div>
            )}
          </div>

          {/* Validation Warning */}
          {!validation.valid && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Invalid Boundary Order: </span>
                {validation.error}
              </div>
            </div>
          )}

          {/* Interactive Grade Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Grade Award</th>
                  <th className="py-2.5 px-3">Description / Tier</th>
                  <th className="py-2.5 px-3 text-center">Minimum Threshold</th>
                  <th className="py-2.5 px-3 text-center">Equivalent Marks</th>
                  <th className="py-2.5 px-3">Boundary Range</th>
                  <th className="py-2.5 px-3 text-right">
                    Cohort Preview ({cohortDistribution.totalGraded})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradeTiers.map(({ grade, label, desc, color }) => {
                  const pctVal = boundaries[grade];
                  const rawMarkVal = Math.ceil((pctVal / 100) * maxMarks);
                  const candidateCount = cohortDistribution.counts[String(grade) as GradeTier] || 0;
                  const candidatePct =
                    cohortDistribution.totalGraded > 0
                      ? Math.round((candidateCount / cohortDistribution.totalGraded) * 100)
                      : 0;

                  return (
                    <tr
                      key={grade}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg font-bold border font-mono ${color}`}
                        >
                          {label}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-500 font-medium">
                        {desc}
                      </td>

                      {/* Threshold Input */}
                      <td className="py-2.5 px-3 text-center">
                        {inputMode === "percentage" ? (
                          <div className="inline-flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={pctVal}
                              onChange={(e) =>
                                handlePercentageChange(grade, parseInt(e.target.value, 10))
                              }
                              className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="font-bold text-slate-500">%</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={maxMarks}
                              value={rawMarkVal}
                              onChange={(e) =>
                                handleMarksChange(grade, parseInt(e.target.value, 10))
                              }
                              className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="font-bold text-slate-500">marks</span>
                          </div>
                        )}
                      </td>

                      {/* Marks equivalent */}
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {rawMarkVal} / {maxMarks}
                      </td>

                      {/* Range */}
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        {formatBoundaryRange(String(grade) as GradeTier, boundaries, maxMarks)}
                      </td>

                      {/* Cohort Candidates Preview */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <span className="font-bold text-slate-800">
                            {candidateCount} student{candidateCount !== 1 ? "s" : ""}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ({candidatePct}%)
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Grade U Row */}
                <tr className="bg-slate-50/50 hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-bold border font-mono bg-slate-100 text-slate-700 border-slate-300">
                      Grade U
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-medium">
                    Unclassified (Below Grade 1 threshold)
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500 font-bold">
                    &lt; {boundaries[1]}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                    &lt; {Math.ceil((boundaries[1] / 100) * maxMarks)} marks
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    {formatBoundaryRange("U", boundaries, maxMarks)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <span className="font-bold text-slate-800">
                        {cohortDistribution.counts["U"]} student
                        {cohortDistribution.counts["U"] !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        (
                        {cohortDistribution.totalGraded > 0
                          ? Math.round(
                              (cohortDistribution.counts["U"] / cohortDistribution.totalGraded) * 100
                            )
                          : 0}
                        %)
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Explanatory notes */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/70 text-xs text-purple-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-950">
              <Info className="w-4 h-4 text-purple-700" />
              <span>How Grade Boundaries Apply Across the Platform:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-purple-800 text-[11px]">
              <li>
                <strong>Live Exam Hall:</strong> Candidate grades in the live analytics table and inspector are immediately recalculated using these thresholds.
              </li>
              <li>
                <strong>Student Results Portal:</strong> When marks are released, candidate scorecards display the official grade award corresponding to these boundaries.
              </li>
              <li>
                <strong>Performance Trends & Analytics:</strong> Visualizer charts (9-1 Grade Distribution, Grade benchmarking, and CSV exports) automatically reflect these custom thresholds.
              </li>
            </ul>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-100 text-red-800 border border-red-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors shadow-xs"
            >
              Reset to Edexcel Baseline
            </button>

            <button
              type="button"
              disabled={saving || !validation.valid}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Boundaries...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Apply & Save Boundaries</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
