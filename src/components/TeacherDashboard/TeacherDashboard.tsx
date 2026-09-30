import React, { useState, useEffect } from "react";
import { Assessment, IGCSETask, IGCSEUnit } from "../../types";
import { SEED_ASSESSMENTS } from "../../data/seedAssessments";
import { LiveAnalyticsView } from "./LiveAnalyticsView";
import { PerformanceTrendsVisualizer } from "./PerformanceTrendsVisualizer";
import { AssessmentBuilder } from "./AssessmentBuilder";
import { QuestionUploader } from "./QuestionUploader";
import { ManualQuestionBuilder } from "./ManualQuestionBuilder";
import { QuestionBankExplorer } from "./QuestionBankExplorer";
import { QRCodeModal } from "../QRCodeModal";
import { teacherFetch, teacherChangePassword } from "../../utils/teacherAuth";
import {
  syncAssessmentToFirestore,
  fetchAllAssessmentsFromFirestore,
  subscribeToAllAssessments,
} from "../../firebase";
import {
  Activity,
  TrendingUp,
  PlusCircle,
  Upload,
  QrCode,
  FileCheck,
  ListOrdered,
  Users,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
  Lock,
  Edit3,
  KeyRound,
  ShieldCheck,
  X,
  Loader2,
  HelpCircle,
} from "lucide-react";

interface TeacherDashboardProps {
  units: IGCSEUnit[];
  allTasks: Record<string, IGCSETask>;
  onQuestionAdded: (task: IGCSETask) => void;
  onQuestionsBatchAdded?: (tasks: IGCSETask[]) => void;
  onLockTeacherMode?: () => void;
  onOpenHelpGuide?: () => void;
  allowPracticeCopyPaste?: boolean;
  onTogglePracticeCopyPaste?: (val: boolean) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  units,
  allTasks,
  onQuestionAdded,
  onQuestionsBatchAdded,
  onLockTeacherMode,
  onOpenHelpGuide,
  allowPracticeCopyPaste,
  onTogglePracticeCopyPaste,
}) => {
  const [activeTab, setActiveTab] = useState<"live" | "trends" | "bank" | "add_question" | "builder" | "upload" | "list">("live");
  const [builderInitialMode, setBuilderInitialMode] = useState<"task" | "assessment">("assessment");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [projectingAssessment, setProjectingAssessment] = useState<Assessment | null>(null);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);

  // Teacher Passcode Modal state
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [oldPasscode, setOldPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const fetchAssessments = async () => {
    // Start with all pre-bundled official papers and mock examinations
    let list: Assessment[] = [...SEED_ASSESSMENTS];
    try {
      const res = await teacherFetch("/api/assessments");
      if (res.ok) {
        const data = await res.json();
        const serverList = data.assessments || [];
        for (const item of serverList) {
          const idx = list.findIndex((a) => a.id === item.id || a.code === item.code);
          if (idx >= 0) {
            list[idx] = { ...list[idx], ...item };
          } else {
            list.push(item);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load assessments from server:", e);
    }

    // Fetch all assessments from Firestore so changes from other devices appear immediately
    try {
      const fsList = await fetchAllAssessmentsFromFirestore();
      for (const item of fsList) {
        const idx = list.findIndex((a) => a.id === item.id || a.code === item.code);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...item };
        } else {
          list.push(item);
        }
      }
    } catch (e) {
      console.warn("Failed to load assessments from Firestore:", e);
    }

    // Merge with any assessments saved locally (ensures full resilience on serverless/Vercel)
    try {
      const localSaved = localStorage.getItem("edexcel_saved_assessments");
      if (localSaved) {
        const parsed: Assessment[] = JSON.parse(localSaved);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const idx = list.findIndex((a) => a.id === item.id || a.code === item.code);
            if (idx >= 0) {
              list[idx] = { ...item, ...list[idx] };
            } else {
              list.push(item);
              // Background sync to server so students can join via PIN immediately
              teacherFetch("/api/assessments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
              }).catch(() => {});
            }
          }
        }
      }
    } catch (e) {}

    // Persist combined list to localStorage
    try {
      if (list.length > 0) {
        localStorage.setItem("edexcel_saved_assessments", JSON.stringify(list));
      }
    } catch (e) {}

    setAssessments(list);
    if (list.length > 0 && !selectedAssessmentId) {
      setSelectedAssessmentId(list[0].id);
    }
  };

  useEffect(() => {
    fetchAssessments();

    // Subscribe to Firestore for real-time assessment list updates across devices
    const unsubscribe = subscribeToAllAssessments((fsList) => {
      if (fsList && fsList.length > 0) {
        setAssessments((prev) => {
          let updated = [...prev];
          for (const item of fsList) {
            const idx = updated.findIndex((a) => a.id === item.id || a.code === item.code);
            if (idx >= 0) {
              updated[idx] = { ...updated[idx], ...item };
            } else {
              updated.unshift(item);
            }
          }
          return updated;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAssessmentCreated = (newAssessment: Assessment) => {
    setAssessments((prev) => [newAssessment, ...prev]);
    setSelectedAssessmentId(newAssessment.id);
    setProjectingAssessment(newAssessment); // immediately open projector modal
    setActiveTab("live");
    // Realtime sync to Firestore so students can join from any device immediately
    syncAssessmentToFirestore(newAssessment).catch(() => {});
  };

  const handleQuickSetAsTask = async (task: IGCSETask) => {
    try {
      const res = await teacherFetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Practice Task: ${task.title}`,
          type: "task",
          durationMinutes: 0,
          showScoreImmediately: true,
          questionIds: [task.id],
          maxMarks: task.marks,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        handleAssessmentCreated(data.assessment);
      }
    } catch (e) {
      console.error("Failed to create quick practice task:", e);
    }
  };

  const handleQuickSetAsAssessment = async (task: IGCSETask) => {
    try {
      const res = await teacherFetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Assessment: ${task.title}`,
          type: "assessment",
          durationMinutes: Math.max(15, task.marks * 2),
          showScoreImmediately: true,
          questionIds: [task.id],
          maxMarks: task.marks,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        handleAssessmentCreated(data.assessment);
      }
    } catch (e) {
      console.error("Failed to create quick assessment:", e);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPasscode.trim()) {
      setPassError("Please enter your current passcode.");
      return;
    }
    if (!newPasscode.trim() || newPasscode.length < 5) {
      setPassError("New passcode must be at least 5 characters.");
      return;
    }

    setIsUpdatingPass(true);
    setPassError("");
    setPassSuccess("");

    const res = await teacherChangePassword(oldPasscode, newPasscode);
    setIsUpdatingPass(false);

    if (res.success) {
      setPassSuccess("Passcode successfully updated and hashed!");
      setOldPasscode("");
      setNewPasscode("");
      setTimeout(() => {
        setIsPassModalOpen(false);
        setPassSuccess("");
      }, 2000);
    } else {
      setPassError(res.error || "Failed to update passcode.");
    }
  };

  const handleQuestionCreatedFromBuilder = (task: IGCSETask) => {
    onQuestionAdded(task);
    setActiveTab("bank");
  };

  const currentAssessment = assessments.find((a) => a.id === selectedAssessmentId) || assessments[0];
  const totalQuestionsCount = Object.keys(allTasks).length;

  return (
    <div className="space-y-6">
      {/* Subnavigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto p-1">
          <button
            onClick={() => setActiveTab("live")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "live"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Class Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab("trends")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "trends"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Performance Trends</span>
          </button>

          <button
            onClick={() => setActiveTab("bank")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "bank"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Question Bank ({totalQuestionsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("add_question")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "add_question"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Add Question</span>
          </button>

          <button
            onClick={() => {
              setEditingAssessmentId(null);
              setBuilderInitialMode("task");
              setActiveTab("builder");
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "builder" && builderInitialMode === "task" && !editingAssessmentId
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                : "text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50"
            }`}
            title="Create a formative practice task or classwork assignment"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Set Practice Task</span>
          </button>

          <button
            onClick={() => {
              setEditingAssessmentId(null);
              setBuilderInitialMode("assessment");
              setActiveTab("builder");
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "builder" && (builderInitialMode === "assessment" || editingAssessmentId)
                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                : "text-purple-700 hover:text-purple-950 hover:bg-purple-50"
            }`}
            title="Create a formal timed in-class examination"
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple-500" />
            <span>Set In-Class Assessment</span>
          </button>

          <button
            id="teacher-tab-upload-json"
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "upload"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload / JSON</span>
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "list"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>All Assessments ({assessments.length})</span>
          </button>
        </div>

        {/* Right side controls: Assessment Switcher & Lock Console */}
        <div className="flex items-center gap-2 px-2 ml-auto">
          {activeTab === "live" && assessments.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden md:inline">Assessment:</span>
              <select
                value={selectedAssessmentId}
                onChange={(e) => setSelectedAssessmentId(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {assessments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {onOpenHelpGuide && (
            <button
              type="button"
              onClick={onOpenHelpGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors cursor-pointer"
              title="Help & Feature Guide: Understand all teacher features, grade boundaries, and analytics"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Feature Guide</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsPassModalOpen(true);
              setPassError("");
              setPassSuccess("");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 text-xs font-bold transition-colors"
            title="Update teacher authentication passcode"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Change Passcode</span>
          </button>

          {onLockTeacherMode && (
            <button
              onClick={onLockTeacherMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-bold transition-colors"
              title="Lock teacher portal to prevent students from viewing marks"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          )}
        </div>
      </div>

      {/* Teacher Practice Mode Security Control Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              allowPracticeCopyPaste ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Practice Mode Copy & Paste Setting:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  allowPracticeCopyPaste
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                {allowPracticeCopyPaste ? "Allowed" : "Blocked (Secure)"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {allowPracticeCopyPaste
                ? "Students can copy snippets and paste solutions while doing free practice in Paper 1 and Paper 2 units."
                : "Students are strictly prohibited from copying & pasting during practice (keyboard shortcuts Ctrl+C/V and copy buttons are hidden/blocked)."}
            </p>
          </div>
        </div>

        {onTogglePracticeCopyPaste && (
          <button
            type="button"
            onClick={() => onTogglePracticeCopyPaste(!allowPracticeCopyPaste)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 ${
              allowPracticeCopyPaste
                ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20"
            }`}
          >
            {allowPracticeCopyPaste ? "Restrict Practice Copy/Paste" : "Allow Practice Copy/Paste"}
          </button>
        )}
      </div>

      {/* Tab 1: Live Monitor */}
      {activeTab === "live" && (
        <>
          {currentAssessment ? (
            <LiveAnalyticsView
              assessment={currentAssessment}
              allTasks={allTasks}
              onShowQr={() => setProjectingAssessment(currentAssessment)}
              onEditAssessment={() => {
                setEditingAssessmentId(currentAssessment.id);
                setActiveTab("builder");
              }}
              onViewTrends={() => setActiveTab("trends")}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
              <Users className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No active assessments yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first examination to generate a classroom QR code and view live student submissions.
              </p>
              <button
                onClick={() => {
                  setEditingAssessmentId(null);
                  setActiveTab("builder");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Set an Assessment
              </button>
            </div>
          )}
        </>
      )}

      {/* Tab 1.5: Performance Trends Across Units & Topics (Recharts Visualizer) */}
      {activeTab === "trends" && (
        <PerformanceTrendsVisualizer
          units={units}
          allTasks={allTasks}
          assessments={assessments}
          onSelectUnitForPractice={(unitCode) => {
            setActiveTab("bank");
          }}
          onCreateTargetedQuiz={(unitCodes) => {
            setEditingAssessmentId(null);
            setActiveTab("builder");
          }}
        />
      )}

      {/* Tab 2: Question Bank Explorer (1,000+ Questions) */}
      {activeTab === "bank" && (
        <QuestionBankExplorer
          units={units}
          allTasks={allTasks}
          onSelectQuestion={() => {
            setEditingAssessmentId(null);
            setActiveTab("builder");
          }}
          onSetAsTask={handleQuickSetAsTask}
          onSetAsAssessment={handleQuickSetAsAssessment}
          onQuestionAdded={onQuestionAdded}
        />
      )}

      {/* Tab 3: Manual Question Builder */}
      {activeTab === "add_question" && (
        <ManualQuestionBuilder
          units={units}
          onQuestionCreated={handleQuestionCreatedFromBuilder}
          onCancel={() => setActiveTab("bank")}
        />
      )}

      {/* Tab 4: Assessment Builder */}
      {activeTab === "builder" && (
        <AssessmentBuilder
          units={units}
          allTasks={allTasks}
          initialMode={builderInitialMode}
          onAssessmentCreated={(created) => {
            setEditingAssessmentId(null);
            handleAssessmentCreated(created);
          }}
          editingAssessment={assessments.find((a) => a.id === editingAssessmentId) || null}
          onAssessmentUpdated={(updated) => {
            setAssessments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setSelectedAssessmentId(updated.id);
            syncAssessmentToFirestore(updated).catch(() => {});
            fetchAssessments();
          }}
          onAssessmentDeleted={(deletedId) => {
            setAssessments((prev) => prev.filter((a) => a.id !== deletedId));
            if (selectedAssessmentId === deletedId) {
              setSelectedAssessmentId("");
            }
            setEditingAssessmentId(null);
            setActiveTab("live");
            fetchAssessments();
          }}
          onCancelEdit={() => setEditingAssessmentId(null)}
          allAssessments={assessments}
          onSelectAssessmentToEdit={(id) => setEditingAssessmentId(id)}
          onQuestionUpdated={(task) => {
            onQuestionAdded(task);
            fetchAssessments();
          }}
        />
      )}

      {/* Tab 5: PDF / JSON Question Uploader */}
      {activeTab === "upload" && (
        <QuestionUploader
          units={units}
          onQuestionAdded={(task) => {
            onQuestionAdded(task);
            setActiveTab("bank");
          }}
          onQuestionsBatchAdded={(tasks) => {
            if (onQuestionsBatchAdded) {
              onQuestionsBatchAdded(tasks);
            } else {
              tasks.forEach((t) => onQuestionAdded(t));
            }
            setActiveTab("bank");
          }}
        />
      )}

      {/* Tab 6: List All Assessments */}
      {activeTab === "list" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Configured Assessments</h3>
            <button
              onClick={() => {
                setEditingAssessmentId(null);
                setActiveTab("builder");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> New Assessment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-3 py-3">PIN Code</th>
                  <th className="px-3 py-3">Questions</th>
                  <th className="px-3 py-3">Max Marks</th>
                  <th className="px-3 py-3">Duration</th>
                  <th className="px-3 py-3">Enrolled</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{a.title}</td>
                    <td className="px-3 py-3 font-mono font-bold text-purple-700">{a.code}</td>
                    <td className="px-3 py-3 text-slate-600">{(a.questionIds || []).length} tasks</td>
                    <td className="px-3 py-3 font-bold text-slate-800">{a.maxMarks}m</td>
                    <td className="px-3 py-3 text-slate-600">
                      {a.durationMinutes > 0 ? `${a.durationMinutes} mins` : "Untimed"}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {a.students ? Object.keys(a.students).length : 0} students
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAssessmentId(a.id);
                          setActiveTab("live");
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                      >
                        Monitor
                      </button>
                      <button
                        onClick={() => {
                          setEditingAssessmentId(a.id);
                          setActiveTab("builder");
                        }}
                        className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold"
                        title="Edit questions, time limit, and settings"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setProjectingAssessment(a)}
                        className="px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold"
                      >
                        Project QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projector QR Code Modal */}
      {projectingAssessment && (
        <QRCodeModal
          assessment={projectingAssessment}
          onClose={() => setProjectingAssessment(null)}
        />
      )}

      {/* Change Passcode Modal */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Change Teacher Passcode</h3>
                  <p className="text-[11px] text-slate-500">Credentials are secured with cryptographic hashing</p>
                </div>
              </div>
              <button
                onClick={() => setIsPassModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Passcode
                </label>
                <input
                  type="password"
                  value={oldPasscode}
                  onChange={(e) => setOldPasscode(e.target.value)}
                  placeholder="Enter current passcode"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Passcode (min 5 chars)
                </label>
                <input
                  type="password"
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="Enter new strong passcode"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                  minLength={5}
                />
              </div>

              {passError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {passError}
                </div>
              )}

              {passSuccess && (
                <div className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-bold">
                  {passSuccess}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPassModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPass}
                  className="flex-1 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-700/20 disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {isUpdatingPass ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Save New Passcode"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
