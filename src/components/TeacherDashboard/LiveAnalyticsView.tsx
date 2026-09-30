import React, { useState, useEffect } from "react";
import { Assessment, StudentSession, LiveAssessmentStats, IGCSETask } from "../../types";
import { PythonSnippetViewer } from "../PythonSnippetViewer";
import { teacherFetch } from "../../utils/teacherAuth";
import { StudentReflectionSheet } from "../StudentExam/StudentReflectionSheet";
import { ReleaseResultsModal } from "./ReleaseResultsModal";
import { GradeBoundariesModal } from "./GradeBoundariesModal";
import { getEdexcelGrade, isCustomBoundaries } from "../../utils/gradeBoundaries";
import { copyToClipboard } from "../../utils/clipboard";
export { getEdexcelGrade };
import { ResultReleaseSettings } from "../../types";
import {
  subscribeToAssessmentStudents,
  syncAssessmentToFirestore,
  syncStudentSessionToFirestore,
} from "../../firebase";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  QrCode,
  RefreshCw,
  Search,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  FileCode,
  Edit3,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  RotateCcw,
  FileText,
  CheckCheck,
  Share2,
  Lock,
  Unlock,
} from "lucide-react";

function checkCellMatch(given: any, expected: any): boolean {
  if (expected === undefined || expected === null) return false;
  const g = String(given ?? "").toLowerCase().trim();
  const expStr = String(expected).toLowerCase().trim();
  return expStr.split("|").some((alt) => alt.trim() === g);
}

interface LiveAnalyticsViewProps {
  assessment: Assessment;
  allTasks: Record<string, IGCSETask>;
  onShowQr: () => void;
  onEditAssessment?: () => void;
  onViewTrends?: () => void;
}

export const LiveAnalyticsView: React.FC<LiveAnalyticsViewProps> = ({
  assessment,
  allTasks,
  onShowQr,
  onEditAssessment,
  onViewTrends,
}) => {
  const questionIds = assessment?.questionIds || [];
  const [students, setStudents] = useState<StudentSession[]>([]);
  const [stats, setStats] = useState<LiveAssessmentStats>({
    totalJoined: 0,
    inProgressCount: 0,
    submittedCount: 0,
    avgScore: 0,
    avgPercentage: 0,
    maxMarks: assessment?.maxMarks || 20,
  });
  const [questionAnalytics, setQuestionAnalytics] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentSession | null>(null);
  const [viewingReflectionSheet, setViewingReflectionSheet] = useState<StudentSession | null>(null);
  const [overrideMark, setOverrideMark] = useState<string>("");
  const [feedbackNote, setFeedbackNote] = useState<string>("");
  const [selectedQId, setSelectedQId] = useState<string>("");
  const [generatingAiFeedback, setGeneratingAiFeedback] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [expandedMarkSchemes, setExpandedMarkSchemes] = useState<Record<string, boolean>>({});
  const [showAllMarkSchemes, setShowAllMarkSchemes] = useState(true);
  const [isRegrading, setIsRegrading] = useState(false);
  const [regradeNotice, setRegradeNotice] = useState<string | null>(null);
  const [releaseSettings, setReleaseSettings] = useState<ResultReleaseSettings | null>(
    assessment?.releaseSettings || null
  );
  const [showReleaseModal, setShowReleaseModal] = useState<boolean>(false);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment>(assessment);
  const [showGradeBoundariesModal, setShowGradeBoundariesModal] = useState<boolean>(false);

  useEffect(() => {
    setCurrentAssessment(assessment);
  }, [assessment]);

  const fetchLiveData = async () => {
    if (!assessment?.id) return;
    try {
      const res = await teacherFetch(`/api/assessments/${assessment.id}/live`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        setStats(data.stats || stats);
        setQuestionAnalytics(data.questionAnalytics || {});
        if (data.releaseSettings) {
          setReleaseSettings(data.releaseSettings);
        }
        if (data.assessment) {
          setCurrentAssessment(data.assessment);
        } else if (data.gradeBoundaries) {
          setCurrentAssessment((prev) => ({
            ...prev,
            gradeBoundaries: data.gradeBoundaries,
          }));
        }
      }
    } catch (err) {
      console.warn("Could not fetch live assessment data:", err);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);

    // Real-time Firestore subscription: when student submits, updates teacher monitor instantly!
    let unsubscribeFs = () => {};
    if (assessment?.id) {
      unsubscribeFs = subscribeToAssessmentStudents(assessment.id, (studentMap) => {
        const studentList = Object.values(studentMap);
        if (studentList.length > 0) {
          setStudents((prev) => {
            // Merge with existing so no student data is lost
            const byId = new Map<string, StudentSession>();
            for (const s of prev) byId.set(s.studentId, s);
            for (const s of studentList) byId.set(s.studentId, s);
            return Array.from(byId.values());
          });

          // Recalculate quick stats immediately
          const total = studentList.length;
          const submitted = studentList.filter((s) => s.status === "submitted").length;
          const inProg = total - submitted;
          const totalPct = studentList.reduce((acc, s) => acc + (s.percentage || 0), 0);
          const avgScore = total > 0 ? Math.round(totalPct / total) : 0;

          setStats((prev) => ({
            ...prev,
            totalStudents: total,
            submittedCount: submitted,
            inProgressCount: inProg,
            averageScore: avgScore,
          }));
        }
      });
    }

    return () => {
      clearInterval(interval);
      unsubscribeFs();
    };
  }, [assessment?.id]);

  const handleExportCsv = () => {
    const questions = questionIds.map((id, i) => `Q${i + 1} (${allTasks[id]?.marks || 0}m)`);
    const headers = [
      "Candidate Name",
      "Candidate Number",
      "Class",
      "Status",
      "Total Score",
      "Percentage",
      "Grade (9-1)",
      ...questions,
      "Submitted At",
    ];
    const rows = students.map((s) => {
      const qScores = questionIds.map((id) => (s.marks && s.marks[id] !== undefined ? s.marks[id] : "—"));
      const submittedDate = s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString() : "In Progress";
      const grade =
        s.status === "submitted"
          ? getEdexcelGrade(s.percentage, currentAssessment?.gradeBoundaries, currentAssessment?.maxMarks).grade
          : "—";
      return [
        `"${s.name}"`,
        `"${s.candidateNumber}"`,
        `"${s.className}"`,
        `"${s.status}"`,
        s.totalMarks,
        `${s.percentage}%`,
        `"${grade}"`,
        ...qScores,
        `"${submittedDate}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${assessment.title.replace(/\s+/g, "_")}_Results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveOverride = async () => {
    if (!selectedStudent || !selectedQId) return;
    try {
      const res = await teacherFetch(`/api/assessments/${assessment.id}/override-mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.studentId,
          questionId: selectedQId,
          mark: Number(overrideMark),
          feedback: feedbackNote,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedStudent(data.studentSession);
        syncStudentSessionToFirestore(assessment.id, data.studentSession).catch(() => {});
        fetchLiveData();
      }
    } catch (e) {
      alert("Failed to update mark");
    }
  };

  const handleQuickMark = async (qId: string, markValue: number) => {
    if (!selectedStudent || !assessment?.id) return;
    try {
      const res = await teacherFetch(`/api/assessments/${assessment.id}/override-mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.studentId,
          questionId: qId,
          mark: markValue,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.studentSession) {
          setSelectedStudent(data.studentSession);
          syncStudentSessionToFirestore(assessment.id, data.studentSession).catch(() => {});
          setStudents((prev) =>
            prev.map((s) => (s.studentId === data.studentSession.studentId ? data.studentSession : s))
          );
          fetchLiveData();
        }
      }
    } catch (err) {
      console.error("Failed to update quick mark:", err);
    }
  };

  const handleRegradeStudent = async () => {
    if (!selectedStudent || !assessment?.id) return;
    setIsRegrading(true);
    try {
      const res = await teacherFetch(`/api/assessments/${assessment.id}/regrade-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent.studentId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.studentSession) {
          setSelectedStudent(data.studentSession);
          syncStudentSessionToFirestore(assessment.id, data.studentSession).catch(() => {});
          setStudents((prev) =>
            prev.map((s) => (s.studentId === data.studentSession.studentId ? data.studentSession : s))
          );
          setRegradeNotice("Successfully re-evaluated candidate against latest mark schemes & test cases!");
          fetchLiveData();
          setTimeout(() => setRegradeNotice(null), 4500);
        }
      }
    } catch (err) {
      console.error("Failed to regrade student:", err);
    } finally {
      setIsRegrading(false);
    }
  };

  const handleGenerateAiFeedback = async () => {
    if (!selectedStudent || !assessment?.id) return;
    setGeneratingAiFeedback(true);
    try {
      const res = await teacherFetch(`/api/assessments/${assessment.id}/generate-student-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent.studentId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.aiDiagnostic) {
          setSelectedStudent((prev) =>
            prev ? { ...prev, aiDiagnostic: data.aiDiagnostic } : null
          );
          setStudents((prev) =>
            prev.map((s) =>
              s.studentId === selectedStudent.studentId
                ? { ...s, aiDiagnostic: data.aiDiagnostic }
                : s
            )
          );
        }
      }
    } catch (e) {
      console.error("Failed to generate AI feedback:", e);
    } finally {
      setGeneratingAiFeedback(false);
    }
  };

  const handleSaveTeacherReflection = async (studentId: string, reflectionData: any) => {
    if (!assessment?.id || !studentId) return;
    try {
      const res = await teacherFetch(`/api/assessments/${assessment.id}/update-reflection-sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, reflectionSheet: reflectionData }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.studentSession) {
          setStudents((prev) =>
            prev.map((s) => (s.studentId === studentId ? data.studentSession : s))
          );
          if (selectedStudent?.studentId === studentId) {
            setSelectedStudent(data.studentSession);
          }
          if (viewingReflectionSheet?.studentId === studentId) {
            setViewingReflectionSheet(data.studentSession);
          }
        }
      }
    } catch (e) {
      console.error("Failed to save teacher reflection:", e);
    }
  };

  const handleCopyReport = () => {
    if (!selectedStudent?.aiDiagnostic) return;
    const diag = selectedStudent.aiDiagnostic;
    const reportText = `PEARSON EDEXCEL 4CP0 DIAGNOSTIC REPORT
Candidate: ${selectedStudent.name} (${selectedStudent.candidateNumber}) - Class ${selectedStudent.className}
Score: ${selectedStudent.totalMarks}/${selectedStudent.maxMarks} (${selectedStudent.percentage}%) - Grade ${getEdexcelGrade(selectedStudent.percentage, currentAssessment?.gradeBoundaries, currentAssessment?.maxMarks).grade}

EXAMINER DIAGNOSIS:
${diag.overallSummary}

PRIORITY 4CP0 SPECIFICATION TOPICS TO REVISE:
${diag.focusTopics.map((t) => `• ${t}`).join("\n")}

QUESTION-LEVEL ANALYSIS & MISCONCEPTIONS:
${diag.questionBreakdowns
  .map(
    (q, idx) =>
      `Q${idx + 1} (${q.marksAwarded}/${q.maxMarks}m):
 - Error: ${q.studentError}
 - Edexcel Topic: ${q.specTopic}
 - Revision Action: ${q.revisionAction}`
  )
  .join("\n\n")}`;

    copyToClipboard(reportText).then((success) => {
      if (success) {
        setCopiedReport(true);
        setTimeout(() => setCopiedReport(false), 2500);
      }
    });
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.candidateNumber && s.candidateNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.className && s.className.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Live Examination Monitor
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{assessment.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            PIN: <span className="font-mono font-bold text-slate-800">{assessment.code}</span> •{" "}
            {questionIds.length} Questions • {assessment.maxMarks} Max Marks •{" "}
            {assessment.durationMinutes > 0 ? `${assessment.durationMinutes} Mins` : "Untimed"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Release Results to Students Button */}
          <button
            type="button"
            onClick={() => setShowReleaseModal(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-sm transition-all cursor-pointer ${
              releaseSettings?.resultsReleased
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                : "bg-purple-700 hover:bg-purple-800 shadow-purple-700/20"
            }`}
            title="Configure and release marks, mark schemes, and reflection sheets to students"
          >
            {releaseSettings?.resultsReleased ? (
              <>
                <Unlock className="w-4 h-4 text-emerald-200" />
                <span>Results Released (Edit Settings)</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Release Results to Students</span>
              </>
            )}
          </button>

          {/* Grade Boundaries Modal Button */}
          <button
            type="button"
            onClick={() => setShowGradeBoundariesModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 shadow-xs transition-colors"
            title="Set or modify 9-1 grade boundaries for this exam paper"
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>Grade Boundaries</span>
            {isCustomBoundaries(currentAssessment?.gradeBoundaries) && (
              <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                Custom
              </span>
            )}
          </button>

          {onViewTrends && (
            <button
              onClick={onViewTrends}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-colors"
              title="View IGCSE Unit Performance Trends across all units"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Performance Trends</span>
            </button>
          )}

          {onEditAssessment && (
            <button
              onClick={onEditAssessment}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 shadow-sm transition-colors"
              title="Add, remove, or reorder questions for this assessment"
            >
              <Edit3 className="w-4 h-4 text-amber-700" />
              Edit Questions
            </button>
          )}

          <button
            onClick={onShowQr}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 shadow-sm transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Project QR Code
          </button>

          <button
            onClick={handleExportCsv}
            disabled={students.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={fetchLiveData}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Refresh now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Candidates</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalJoined}</div>
          <span className="text-[11px] text-slate-500">Registered to exam</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-semibold">Currently Writing</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{stats.inProgressCount}</div>
          <span className="text-[11px] text-slate-500">Live active sessions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold">Submissions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{stats.submittedCount}</div>
          <span className="text-[11px] text-slate-500">Auto-marked & graded</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-semibold">Class Average</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700">
            {stats.avgPercentage}%
            <span className="text-xs font-normal text-slate-500 ml-1.5">
              ({stats.avgScore}/{stats.maxMarks})
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Overall class performance</span>
        </div>
      </div>

      {/* Question Difficulty Breakdown */}
      {questionIds.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Question Difficulty Analysis
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {questionIds.map((qId, idx) => {
              const task = allTasks[qId];
              const qStat = questionAnalytics[qId] || { averageMarks: 0, attempts: 0 };
              const maxM = task ? task.marks : 1;
              const pct = maxM > 0 ? Math.round((qStat.averageMarks / maxM) * 100) : 0;
              const isChallenging = pct < 50 && qStat.attempts > 0;

              return (
                <div
                  key={qId}
                  className={`p-3 rounded-xl border ${
                    isChallenging
                      ? "bg-red-50/50 border-red-200 text-red-950"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold">Q{idx + 1}</span>
                    <span className="text-[11px] text-slate-500">{task?.level || "Exam"}</span>
                  </div>
                  <div className="text-lg font-extrabold">
                    {pct}% <span className="text-xs font-normal text-slate-500">avg</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 70 ? "bg-emerald-500" : pct >= 45 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Candidates Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, candidate # or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredStudents.length} of {students.length} candidates
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Progress</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3">%</th>
                <th className="px-3 py-3 text-center">Grade (9–1)</th>
                {/* Individual Question Heatmap Headers */}
                {questionIds.map((qId, i) => (
                  <th key={qId} className="px-2 py-3 text-center" title={allTasks[qId]?.title || `Q${i + 1}`}>
                    Q{i + 1}
                  </th>
                ))}
                <th className="px-3 py-3">Submitted</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isSubmitted = student.status === "submitted";
                  return (
                    <tr
                      key={student.studentId}
                      onClick={() => setSelectedStudent(student)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {student.className || "Class 1"}
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Writing (Q{student.currentQuestionIndex + 1})
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-3 font-medium text-slate-700">
                        {student.answeredQuestions?.length || 0} / {questionIds.length}
                      </td>

                      <td className="px-3 py-3 font-bold text-slate-900 text-sm">
                        {isSubmitted ? `${student.totalMarks}/${assessment.maxMarks}` : "—"}
                      </td>

                      <td className="px-3 py-3 font-extrabold text-sm">
                        {isSubmitted ? (
                          <span
                            className={
                              student.percentage >= 70
                                ? "text-emerald-700"
                                : student.percentage >= 50
                                ? "text-blue-700"
                                : "text-amber-700"
                            }
                          >
                            {student.percentage}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {isSubmitted ? (
                          (() => {
                            const g = getEdexcelGrade(student.percentage, currentAssessment?.gradeBoundaries, currentAssessment?.maxMarks);
                            return (
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold text-xs border ${g.color}`}
                              >
                                {g.grade}
                              </span>
                            );
                          })()
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Question Matrix Cells */}
                      {questionIds.map((qId) => {
                        const mark = student.marks ? student.marks[qId] : undefined;
                        const task = allTasks[qId];
                        const maxM = task ? task.marks : 1;

                        let cellClass = "bg-slate-100 text-slate-400";
                        if (isSubmitted && mark !== undefined) {
                          if (mark === maxM) cellClass = "bg-emerald-100 text-emerald-900 font-bold";
                          else if (mark > 0) cellClass = "bg-amber-100 text-amber-900 font-medium";
                          else cellClass = "bg-red-100 text-red-900";
                        } else if (student.answeredQuestions?.includes(qId)) {
                          cellClass = "bg-purple-100 text-purple-900 font-medium";
                        }

                        return (
                          <td key={qId} className="px-1.5 py-3 text-center">
                            <span
                              className={`inline-block w-6 h-6 leading-6 rounded text-[11px] font-mono ${cellClass}`}
                            >
                              {isSubmitted && mark !== undefined ? mark : student.answeredQuestions?.includes(qId) ? "✓" : "•"}
                            </span>
                          </td>
                        );
                      })}

                      <td className="px-3 py-3 text-slate-500 text-[11px]">
                        {student.submittedAt
                          ? new Date(student.submittedAt).toLocaleTimeString()
                          : "In progress"}
                      </td>

                      <td className="px-3 py-3 text-right">
                        <span className="inline-flex items-center text-xs font-semibold text-purple-700 hover:text-purple-800">
                          Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7 + questionIds.length} className="p-8 text-center text-slate-500">
                    No student sessions recorded yet. Project the QR code for students to join!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Inspector Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end p-0">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Student Response Inspector
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedStudent.className ? `Class ${selectedStudent.className}` : "Student Submission"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingReflectionSheet(selectedStudent)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="View or Print Candidate Reflection & Revision Sheet"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Reflection Sheet</span>
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Score Summary Box */}
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-purple-700 block">Overall Auto-Graded Score</span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-2xl font-extrabold text-purple-950">
                      {selectedStudent.totalMarks} / {assessment.maxMarks} Marks ({selectedStudent.percentage}%)
                    </span>
                    {selectedStudent.status === "submitted" && (
                      (() => {
                        const g = getEdexcelGrade(selectedStudent.percentage, currentAssessment?.gradeBoundaries, currentAssessment?.maxMarks);
                        return (
                          <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs border ${g.color}`}>
                            Grade {g.grade} (9–1)
                          </span>
                        );
                      })()
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  Status:{" "}
                  <strong className="text-slate-900 capitalize">{selectedStudent.status}</strong>
                  {selectedStudent.submittedAt && (
                    <div className="text-[11px]">
                      Submitted: {new Date(selectedStudent.submittedAt).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Diagnostic & Topic Focus Report */}
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 border border-purple-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-purple-600 text-white rounded-xl shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                        AI Candidate Diagnostic & Topic Focus
                      </h4>
                      <p className="text-[11px] text-purple-700">
                        Analyzes misconceptions & isolates Pearson Edexcel 4CP0 clauses requiring intervention.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedStudent.aiDiagnostic && (
                      <button
                        onClick={handleCopyReport}
                        className="px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-100/50 transition-colors flex items-center gap-1.5"
                      >
                        {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedReport ? "Report Copied!" : "Copy Report"}
                      </button>
                    )}
                    <button
                      onClick={handleGenerateAiFeedback}
                      disabled={generatingAiFeedback}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {generatingAiFeedback
                        ? "Analyzing Submissions..."
                        : selectedStudent.aiDiagnostic
                        ? "Regenerate Diagnostic"
                        : "Generate AI Diagnostic"}
                    </button>
                  </div>
                </div>

                {selectedStudent.aiDiagnostic ? (
                  <div className="space-y-4 pt-2">
                    {/* Overall Summary */}
                    <div className="p-3.5 bg-white border border-purple-100 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Examiner Diagnostic Summary
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {selectedStudent.aiDiagnostic.overallSummary}
                      </p>
                    </div>

                    {/* Priority 4CP0 Focus Topics */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                        Priority Topics To Focus On:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.aiDiagnostic.focusTopics?.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-purple-100/80 text-purple-900 border border-purple-200 text-xs font-bold flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white/70 border border-dashed border-purple-200 rounded-xl text-center text-xs text-purple-700">
                    Click <strong>Generate AI Diagnostic</strong> to diagnose student errors, detect misconceptions, and isolate target 4CP0 topics to revise.
                  </div>
                )}
              </div>

              {/* Regrade Notification */}
              {regradeNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between animate-fade-in font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    {regradeNotice}
                  </span>
                  <button onClick={() => setRegradeNotice(null)} className="text-emerald-600 hover:text-emerald-800">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Inspector Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Submitted Answers & Mark Scheme Audit
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Audit candidate solutions against official Edexcel 4CP0 mark scheme criteria and test suites.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAllMarkSchemes(!showAllMarkSchemes)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    {showAllMarkSchemes ? "Hide All Mark Schemes" : "View All Mark Schemes"}
                  </button>
                  <button
                    onClick={handleRegradeStudent}
                    disabled={isRegrading}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                    title="Re-run automated marking across candidate answers against latest mark schemes and test cases"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRegrading ? "animate-spin" : ""}`} />
                    {isRegrading ? "Re-evaluating..." : "Re-evaluate Answers"}
                  </button>
                </div>
              </div>

              {/* Question-by-Question Breakdown */}
              <div className="space-y-5">
                {questionIds.map((qId, qIdx) => {
                  const task = assessment?.questions?.find((q: any) => q?.id === qId) || allTasks[qId];
                  const answer = selectedStudent.answers ? selectedStudent.answers[qId] : null;
                  const awarded = selectedStudent.marks ? selectedStudent.marks[qId] : 0;
                  const maxM = task ? task.marks : 1;
                  const isExpanded = showAllMarkSchemes || !!expandedMarkSchemes[qId];
                  const breakdown = selectedStudent.aiDiagnostic?.questionBreakdowns?.find(
                    (b) => b.questionId === qId
                  );

                  const isFull = awarded === maxM;
                  const isPartial = awarded > 0 && awarded < maxM;

                  return (
                    <div
                      key={qId}
                      className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white shadow-sm space-y-4 transition-all"
                    >
                      {/* Question Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                            {qIdx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">
                              {task?.title || `Question ${qIdx + 1}`}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                                {task?.type}
                              </span>
                              {task?.level && (
                                <span className="text-[10px] font-medium text-slate-500">
                                  {task.level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setExpandedMarkSchemes((prev) => ({
                                ...prev,
                                [qId]: !isExpanded,
                              }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                              isExpanded
                                ? "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                            <span>Mark Scheme</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-slate-500" />
                            )}
                          </button>

                          <span
                            className={`text-xs font-black px-3 py-1 rounded-full border ${
                              isFull
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : isPartial
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "bg-rose-50 text-rose-800 border-rose-300"
                            }`}
                          >
                            {awarded} / {maxM} Marks
                          </span>
                        </div>
                      </div>

                      {/* Question Brief / Problem Description */}
                      {task?.brief && (
                        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 space-y-1">
                          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                            Question Brief / Task Specification:
                          </span>
                          <p className="whitespace-pre-line leading-relaxed font-sans">{task.brief}</p>
                        </div>
                      )}

                      {/* Official Mark Scheme & Model Solution Panel (when expanded) */}
                      {isExpanded && (
                        <div className="p-4 bg-gradient-to-br from-amber-50/60 via-purple-50/40 to-slate-50 border border-amber-200/80 rounded-2xl space-y-3.5 text-xs">
                          <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                            <span className="font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                              <BookOpen className="w-4 h-4 text-amber-600" />
                              Official Pearson Edexcel Mark Scheme & Criteria
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              4CP0 Specification
                            </span>
                          </div>

                          {/* Detailed Mark Points / Scheme Description */}
                          {task?.markScheme ? (
                            <div className="p-3 bg-white/90 border border-amber-200 rounded-xl text-slate-800 space-y-1.5">
                              <span className="font-bold text-amber-900 block text-[11px]">
                                Marking Scheme & Guidance:
                              </span>
                              <div className="whitespace-pre-line leading-relaxed font-sans text-slate-700">
                                {task.markScheme}
                              </div>
                            </div>
                          ) : task?.markPoints && task.markPoints.length > 0 ? (
                            <div className="p-3 bg-white/90 border border-amber-200 rounded-xl space-y-1.5">
                              <span className="font-bold text-amber-900 block text-[11px]">
                                Mark Points Allocation:
                              </span>
                              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                                {task.markPoints.map((mp: any, i: number) => (
                                  <li key={i}>
                                    <strong>{mp.marks} Mark{mp.marks > 1 ? "s" : ""}:</strong> {mp.criteria || mp.criterion || mp.c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}

                          {/* For MCQ: Show Correct Answer */}
                          {task?.type === "mcq" && task.questions && task.questions.length > 0 && (
                            <div className="p-3 bg-white/90 border border-emerald-200 rounded-xl space-y-1">
                              <span className="font-bold text-emerald-900 block text-[11px]">
                                Correct Multiple Choice Answer:
                              </span>
                              <div className="text-slate-800 font-medium">
                                Option {String.fromCharCode(65 + ((task.questions[0] as any).a ?? 0))}:{" "}
                                <span className="font-bold text-emerald-800">
                                  {(task.questions[0] as any).options?.[(task.questions[0] as any).a ?? 0]}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* For Table: Show Complete Expected Trace Table */}
                          {task?.type === "table" && task.rows && (
                            <div className="p-3 bg-white/90 border border-amber-200 rounded-xl space-y-2">
                              <span className="font-bold text-amber-900 block text-[11px]">
                                Expected Complete Trace Table (Reference Solution):
                              </span>
                              <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full text-xs text-left border-collapse font-mono">
                                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold font-sans">
                                    <tr>
                                      <th className="p-2 border-r border-slate-200">Row</th>
                                      {(task.columns || []).map((col: any, cIdx: number) => (
                                        <th key={cIdx} className="p-2 border-r border-slate-200">
                                          {typeof col === "string" ? col : col.label || `Col ${cIdx + 1}`}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {(task.rows as any[]).map((row: any, rIdx: number) => {
                                      const cells = Array.isArray(row) ? row : row?.c || [];
                                      return (
                                        <tr key={rIdx}>
                                          <td className="p-2 text-slate-400 bg-slate-50 border-r border-slate-200 font-sans">
                                            {rIdx + 1}
                                          </td>
                                          {cells.map((cell: any, cIdx: number) => {
                                            const val = typeof cell === "object" ? cell?.v : cell;
                                            const isGiven = typeof cell === "object" ? cell?.g : false;
                                            return (
                                              <td
                                                key={cIdx}
                                                className={`p-2 border-r border-slate-100 ${
                                                  isGiven
                                                    ? "text-slate-400 bg-slate-50 italic"
                                                    : "text-emerald-800 bg-emerald-50/60 font-bold"
                                                }`}
                                              >
                                                {String(val ?? "")}
                                              </td>
                                            );
                                          })}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* For Code: Show Reference Model Solution */}
                          {task?.solution && (
                            <div className="space-y-1">
                              <span className="font-bold text-slate-700 block text-[11px]">
                                Reference / Model Python Solution:
                              </span>
                              <PythonSnippetViewer
                                code={task.solution}
                                title="Official Model Solution"
                              />
                            </div>
                          )}

                          {/* Automated Test Suite Specs */}
                          {task?.tests && task.tests.length > 0 && (
                            <div className="p-3 bg-white/90 border border-slate-200 rounded-xl space-y-1.5">
                              <span className="font-bold text-slate-800 block text-[11px]">
                                Automated Test Suite ({task.tests.length} test{task.tests.length > 1 ? "s" : ""}):
                              </span>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left border-collapse">
                                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                    <tr>
                                      <th className="p-1.5">Test #</th>
                                      <th className="p-1.5">Input Values</th>
                                      <th className="p-1.5">Expected Output Pattern</th>
                                      <th className="p-1.5 text-right">Marks</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 font-mono">
                                    {task.tests.map((t: any, tIdx: number) => (
                                      <tr key={tIdx}>
                                        <td className="p-1.5 text-slate-500 font-sans">Test {tIdx + 1}</td>
                                        <td className="p-1.5 text-slate-600">
                                          {t.in && t.in.length > 0 ? t.in.join(", ") : "(None)"}
                                        </td>
                                        <td className="p-1.5 text-slate-800 whitespace-pre-line">{t.out}</td>
                                        <td className="p-1.5 text-right font-bold text-purple-700">
                                          {t.m ?? 1}m
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Candidate Submitted Content */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                            Candidate Submitted Response:
                          </span>
                          {answer === null || answer === undefined ? (
                            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Unanswered / Blank
                            </span>
                          ) : null}
                        </div>

                        {task?.type === "code" ? (
                          typeof answer === "string" && answer.trim().length > 0 ? (
                            <PythonSnippetViewer code={answer} title="Student Python Submission" />
                          ) : (
                            <div className="p-3 bg-rose-50/70 border border-rose-200 text-rose-800 text-xs italic rounded-xl flex items-center justify-between">
                              <span>(No Python code submitted)</span>
                              <span className="font-mono font-bold">0 / {maxM} Marks</span>
                            </div>
                          )
                        ) : task?.type === "table" ? (
                          Array.isArray(answer) &&
                          answer.length > 0 &&
                          answer.some((row: any) => Array.isArray(row) && row.some((c: any) => String(c ?? "").trim().length > 0)) ? (
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                              <table className="w-full text-xs text-left border-collapse font-mono">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                                  <tr>
                                    <th className="p-2 border-r border-slate-200">#</th>
                                    {(task.columns || []).map((col: any, cIdx: number) => (
                                      <th key={cIdx} className="p-2 border-r border-slate-200">
                                        {typeof col === "string" ? col : col.label || `Col ${cIdx + 1}`}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {answer.map((row: any, rIdx: number) => (
                                    <tr key={rIdx}>
                                      <td className="p-2 text-slate-400 bg-slate-50 border-r border-slate-200 font-sans">
                                        {rIdx + 1}
                                      </td>
                                      {Array.isArray(row) &&
                                        row.map((val: any, cIdx: number) => {
                                          const expectedCell = (task.rows as any)?.[rIdx]?.[cIdx];
                                          const expVal =
                                            typeof expectedCell === "object" ? expectedCell?.v : expectedCell;
                                          const isGiven =
                                            typeof expectedCell === "object" ? expectedCell?.g : false;
                                          const matches = checkCellMatch(val, expVal);
                                          return (
                                            <td
                                              key={cIdx}
                                              className={`p-2 border-r border-slate-100 ${
                                                isGiven
                                                  ? "text-slate-400 bg-slate-50"
                                                  : matches
                                                  ? "bg-emerald-50 text-emerald-800 font-bold"
                                                  : "bg-rose-50 text-rose-800"
                                              }`}
                                            >
                                              {String(val ?? "")}
                                            </td>
                                          );
                                        })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="p-3 bg-rose-50/70 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-between">
                              <span className="font-semibold italic">
                                (Blank — Candidate submitted no values in this trace table)
                              </span>
                              <span className="font-mono font-bold bg-rose-100 px-2 py-0.5 rounded text-rose-900">
                                0 / {maxM} Marks
                              </span>
                            </div>
                          )
                        ) : task?.type === "mcq" ? (
                          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 font-semibold">Candidate Choice:</span>
                              <span
                                className={`font-bold px-2 py-0.5 rounded ${
                                  awarded > 0
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {Array.isArray(answer)
                                  ? `Option ${String.fromCharCode(65 + Number(answer[0]))}`
                                  : answer !== null && answer !== undefined
                                  ? `Option ${String.fromCharCode(65 + Number(answer))}`
                                  : "(No answer selected)"}
                              </span>
                            </div>
                          </div>
                        ) : typeof answer === "object" ? (
                          <pre className="p-3 bg-white border border-slate-200 font-mono text-xs rounded-xl overflow-x-auto">
                            {JSON.stringify(answer, null, 2)}
                          </pre>
                        ) : (
                          <div className="p-3 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl font-mono">
                            {String(answer || "(Blank)")}
                          </div>
                        )}
                      </div>

                      {/* AI Question-Level Error & Spec Topic Breakdown */}
                      {breakdown && (
                        <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-purple-900 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              AI Diagnostic Analysis:
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-200/70 text-purple-900 font-bold">
                              {breakdown.specTopic}
                            </span>
                          </div>
                          <div className="text-purple-950 font-medium">
                            <span className="font-bold text-slate-700">Student Error:</span> {breakdown.studentError}
                          </div>
                          <div className="text-purple-900">
                            <span className="font-bold text-slate-700">Target Revision Action:</span> {breakdown.revisionAction}
                          </div>
                        </div>
                      )}

                      {/* Teacher Quick Marking Bar & Adjustment Controls */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-slate-500 font-medium mr-1">Quick Mark:</span>
                          {Array.from({ length: maxM + 1 }).map((_, mVal) => (
                            <button
                              key={mVal}
                              onClick={() => handleQuickMark(qId, mVal)}
                              className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                                awarded === mVal
                                  ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50"
                              }`}
                              title={`Set mark to ${mVal}/${maxM}`}
                            >
                              {mVal}m
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedQId(qId);
                            setOverrideMark(String(awarded));
                            setFeedbackNote(selectedStudent.feedback || "");
                          }}
                          className="text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200/60"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Adjust Mark & Comment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mark Override / Feedback Editor if active */}
              {selectedQId && (
                <div className="p-4 bg-purple-50 border border-purple-300 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-purple-900">
                      Adjust Mark for {allTasks[selectedQId]?.title || selectedQId}
                    </h5>
                    <button onClick={() => setSelectedQId("")} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-700">Awarded Marks:</label>
                    <input
                      type="number"
                      value={overrideMark}
                      onChange={(e) => setOverrideMark(e.target.value)}
                      max={allTasks[selectedQId]?.marks || 20}
                      min={0}
                      className="w-20 px-2 py-1 text-sm border border-slate-300 rounded bg-white font-mono"
                    />
                    <span className="text-xs text-slate-500">
                      / {allTasks[selectedQId]?.marks || 20} Marks
                    </span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Teacher Feedback to Student:</label>
                    <textarea
                      value={feedbackNote}
                      onChange={(e) => setFeedbackNote(e.target.value)}
                      placeholder="e.g. Excellent syntax, watch indentation on the loop..."
                      rows={2}
                      className="w-full p-2 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <button
                    onClick={handleSaveOverride}
                    className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition-colors"
                  >
                    Save Adjusted Mark
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Teacher Modal viewing Candidate Reflection & Intervention Sheet */}
      {viewingReflectionSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-2 sm:p-4 border border-slate-200">
            <div className="sticky top-2 z-20 flex justify-end mb-2 pr-2">
              <button
                type="button"
                onClick={() => setViewingReflectionSheet(null)}
                className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close Reflection Sheet</span>
              </button>
            </div>
            <StudentReflectionSheet
              assessment={assessment}
              studentName={viewingReflectionSheet.name}
              className={viewingReflectionSheet.className}
              submittedAt={viewingReflectionSheet.submittedAt || Date.now()}
              result={{
                totalMarks: viewingReflectionSheet.totalMarks,
                maxMarks: viewingReflectionSheet.maxMarks || assessment.maxMarks,
                percentage: viewingReflectionSheet.percentage,
                marks: viewingReflectionSheet.marks,
                answers: viewingReflectionSheet.answers,
              }}
              allTasks={allTasks}
              teacherFeedback={viewingReflectionSheet.feedback}
              reflectionData={viewingReflectionSheet.reflectionSheet}
              isTeacherEditable={true}
              onSaveTeacherReflection={(newData) =>
                handleSaveTeacherReflection(viewingReflectionSheet.studentId, newData)
              }
              onClose={() => setViewingReflectionSheet(null)}
            />
          </div>
        </div>
      )}

      {/* Teacher Modal to Release Results & Select Components to Share */}
      {showReleaseModal && (
        <ReleaseResultsModal
          assessment={currentAssessment}
          students={students}
          currentSettings={releaseSettings || undefined}
          onClose={() => setShowReleaseModal(false)}
          onSaved={(newSettings) => {
            setReleaseSettings(newSettings);
            syncAssessmentToFirestore({
              ...currentAssessment,
              releaseSettings: newSettings,
            }).catch(() => {});
            fetchLiveData();
          }}
        />
      )}

      {/* Teacher Modal to Set & Modify Grade Boundaries */}
      {showGradeBoundariesModal && (
        <GradeBoundariesModal
          assessment={currentAssessment}
          students={students}
          onClose={() => setShowGradeBoundariesModal(false)}
          onSaved={(newBoundaries) => {
            const updated = {
              ...currentAssessment,
              gradeBoundaries: newBoundaries,
            };
            setCurrentAssessment(updated);
            syncAssessmentToFirestore(updated).catch(() => {});
            fetchLiveData();
          }}
        />
      )}
    </div>
  );
};
