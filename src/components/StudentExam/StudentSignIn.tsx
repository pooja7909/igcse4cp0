import React, { useState, useEffect } from "react";
import { Assessment, StudentSession } from "../../types";
import { QRScannerModal } from "../QRScannerModal";
import { StudentResultLookupModal } from "./StudentResultLookupModal";
import { SEED_ASSESSMENTS, SEED_ASSESSMENTS_MAP } from "../../data/seedAssessments";
import { unpackAssessment } from "../../utils/qrHelper";
import { fetchAssessmentFromFirestore, syncStudentSessionToFirestore } from "../../firebase";
import {
  QrCode,
  KeyRound,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileText,
  BookOpen,
  HelpCircle,
} from "lucide-react";

interface StudentSignInProps {
  initialCode?: string;
  initialMode?: "task" | "assessment";
  onJoinExam: (assessment: Assessment, studentSession: any) => void;
  onOpenHelpGuide?: () => void;
  sessionExitedMessage?: string | null;
  onClearSessionExitedMessage?: () => void;
}

export const StudentSignIn: React.FC<StudentSignInProps> = ({
  initialCode,
  initialMode = "assessment",
  onJoinExam,
  onOpenHelpGuide,
  sessionExitedMessage,
  onClearSessionExitedMessage,
}) => {
  const [pinCode, setPinCode] = useState(initialCode || "");
  const [candidateName, setCandidateName] = useState(() => {
    try {
      return localStorage.getItem("edexcel_student_name") || "";
    } catch {
      return "";
    }
  });
  const [candidateNumber, setCandidateNumber] = useState("");
  const [className, setClassName] = useState(() => {
    try {
      return localStorage.getItem("edexcel_student_class") || "11B";
    } catch {
      return "11B";
    }
  });
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [availableAssessments, setAvailableAssessments] = useState<Assessment[]>([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [showLookupModal, setShowLookupModal] = useState(false);

  const isTask = initialMode === "task";

  // Fetch all active assessments created/edited by teacher
  useEffect(() => {
    let list: Assessment[] = [...SEED_ASSESSMENTS];

    // 1. Check for packed assessment in URL parameters (?pack=... or ?p=...)
    let unpackedCode: string | null = null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const packParam = urlParams.get("pack") || urlParams.get("p");
      if (packParam) {
        const unpacked = unpackAssessment(packParam);
        if (unpacked) {
          unpackedCode = unpacked.code;
          const idx = list.findIndex((a) => a.id === unpacked.id || a.code === unpacked.code);
          if (idx >= 0) {
            list[idx] = { ...list[idx], ...unpacked };
          } else {
            list.unshift(unpacked);
          }
          // Save unpacked assessment to localStorage so it persists on this device
          try {
            const raw = localStorage.getItem("edexcel_saved_assessments");
            const existing: Assessment[] = raw ? JSON.parse(raw) : [];
            const eIdx = existing.findIndex((a) => a.id === unpacked.id || a.code === unpacked.code);
            if (eIdx >= 0) existing[eIdx] = unpacked;
            else existing.unshift(unpacked);
            localStorage.setItem("edexcel_saved_assessments", JSON.stringify(existing));
          } catch (e) {}

          // Background sync to server so serverless function registers it
          fetch("/api/assessments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(unpacked),
          }).catch(() => {});
        }
      }
    } catch (e) {}

    // 2. Fetch active assessments from server
    fetch("/api/assessments")
      .then((res) => (res.ok ? res.json() : { assessments: [] }))
      .then((data) => {
        const serverList: Assessment[] = (data.assessments || []).filter((a: Assessment) => a.status !== "archived");
        for (const item of serverList) {
          const idx = list.findIndex((a) => a.id === item.id || a.code === item.code);
          if (idx >= 0) {
            list[idx] = { ...list[idx], ...item };
          } else {
            list.push(item);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        // 3. Merge locally saved assessments
        try {
          const localSaved = localStorage.getItem("edexcel_saved_assessments");
          if (localSaved) {
            const parsed = JSON.parse(localSaved);
            if (Array.isArray(parsed)) {
              for (const item of parsed) {
                const idx = list.findIndex((a) => a.id === item.id || a.code === item.code);
                if (idx >= 0) {
                  list[idx] = { ...list[idx], ...item };
                } else {
                  list.push(item);
                }
              }
            }
          }
        } catch (e) {}

        // Sort by createdAt descending so latest edited/created is first
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setAvailableAssessments(list);

        if (unpackedCode) {
          setPinCode(unpackedCode.toUpperCase());
        } else if (initialCode) {
          setPinCode(initialCode.toUpperCase());
        } else if (list.length > 0) {
          setPinCode(list[0].code);
        } else {
          setPinCode("IGCSE1");
        }
        setLoadingAssessments(false);
      });
  }, [initialCode]);

  const selectedAssessment = availableAssessments.find(
    (a) => a.code.toUpperCase() === pinCode.trim().toUpperCase()
  );

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) {
      setErrorMsg(`Please enter the 6-character ${isTask ? "task" : "assessment"} PIN or scan the QR code.`);
      return;
    }
    if (!candidateName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const formattedPin = pinCode.trim().toUpperCase();
    const trimmedName = candidateName.trim();
    const trimmedClass = className.trim() || "Year 11";

    try {
      localStorage.setItem("edexcel_student_name", trimmedName);
      localStorage.setItem("edexcel_student_class", trimmedClass);
      // Clean up legacy un-namespaced session key if present
      localStorage.removeItem(`edexcel_session_${formattedPin}`);
    } catch {}

    const normalizedStudentKey = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const cachedStudentIdKey = `edexcel_session_${formattedPin}_${normalizedStudentKey}`;
    const cachedStudentId = (() => {
      try {
        return localStorage.getItem(cachedStudentIdKey) || undefined;
      } catch {
        return undefined;
      }
    })();

    try {
      const res = await fetch(`/api/assessments/${formattedPin}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          className: trimmedClass,
          studentId: cachedStudentId,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.studentSession?.studentId) {
          try {
            localStorage.setItem(cachedStudentIdKey, data.studentSession.studentId);
          } catch {}
          // Sync joined status to Firestore so teacher sees student immediately
          syncStudentSessionToFirestore(data.assessment.id, data.studentSession).catch(() => {});
        }
        onJoinExam(data.assessment, data.studentSession);
        return;
      }
    } catch (err: any) {
      console.warn("Server join unavailable, trying offline/local assessment fallback.");
    }

    // Local / static host fallback
    let matched = availableAssessments.find(
      (a) => a.code.toUpperCase() === formattedPin
    );
    if (!matched) {
      matched = SEED_ASSESSMENTS.find(
        (a) => a.code.toUpperCase() === formattedPin
      );
    }
    if (!matched) {
      try {
        const raw = localStorage.getItem("edexcel_saved_assessments");
        if (raw) {
          const list: Assessment[] = JSON.parse(raw);
          matched = list.find((a) => a.code.toUpperCase() === formattedPin);
        }
      } catch (e) {}
    }

    // Check Firestore if not found locally
    if (!matched) {
      try {
        const fsAssessment = await fetchAssessmentFromFirestore(formattedPin);
        if (fsAssessment) {
          matched = fsAssessment;
        }
      } catch (e) {
        console.warn("Firestore lookup failed:", e);
      }
    }

    if (matched) {
      const fallbackSession: StudentSession = {
        studentId: cachedStudentId || `s_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: candidateName.trim(),
        candidateNumber: candidateNumber.trim(),
        className: className.trim() || "Class 1",
        status: "in_progress",
        currentQuestionIndex: 0,
        answeredQuestions: [],
        answers: {},
        marks: {},
        totalMarks: 0,
        maxMarks: matched.maxMarks || 25,
        percentage: 0,
        joinedAt: Date.now(),
        lastActiveAt: Date.now(),
      };
      // Write joined session to Firestore
      syncStudentSessionToFirestore(matched.id, fallbackSession).catch(() => {});
      onJoinExam(matched, fallbackSession);
      setIsLoading(false);
      return;
    }

    setErrorMsg(`${isTask ? "Task" : "Assessment"} not found with PIN: ${formattedPin}`);
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-6">
      {sessionExitedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1.5 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Workstation Session Closed
            </span>
            {onClearSessionExitedMessage && (
              <button
                type="button"
                onClick={onClearSessionExitedMessage}
                className="text-emerald-700 hover:text-emerald-950 text-xs font-bold cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-emerald-800 leading-relaxed font-medium">
            {sessionExitedMessage}
          </p>
        </div>
      )}

      <div className="text-center space-y-2">
        <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-sm ${
          isTask ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
        }`}>
          {isTask ? <Sparkles className="w-8 h-8" /> : <GraduationCap className="w-8 h-8" />}
        </div>
        <div className="inline-block">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            isTask ? "bg-emerald-100 text-emerald-800" : "bg-purple-100 text-purple-800"
          }`}>
            {isTask ? "Classwork Practice Task" : "In-Class Assessment"}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isTask ? "Student Task Sign-In" : "Student Assessment Sign-In"}
        </h2>
        <p className="text-xs text-slate-500">
          {isTask
            ? "Enter your name and class to open your assigned practice task with live tests."
            : "Enter your name and class to begin your in-class assessment."}
        </p>
      </div>

      {/* QR Code Action Button */}
      {!initialCode && (
        <>
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className={`w-full py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2.5 font-bold text-sm transition-all ${
              isTask
                ? "border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800"
                : "border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 text-purple-800"
            }`}
          >
            <QrCode className={`w-5 h-5 ${isTask ? "text-emerald-600" : "text-purple-600"}`} />
            <span>Scan QR Code with Camera</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs uppercase text-slate-400 font-semibold absolute">
              or enter PIN manually
            </span>
          </div>
        </>
      )}

      {/* Form */}
      <form onSubmit={handleJoin} className="space-y-4">
        {/* Active Assessment Selection / Banner */}
        {availableAssessments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Select Active Assessment:
              </label>
              <span className="text-[11px] text-purple-600 font-semibold">
                {availableAssessments.length} Available
              </span>
            </div>

            {availableAssessments.length > 1 ? (
              <select
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
              >
                {availableAssessments.map((a) => (
                  <option key={a.id} value={a.code}>
                    {a.title} [PIN: {a.code}] • {(a.questionIds || []).length} questions • {a.maxMarks}m
                  </option>
                ))}
              </select>
            ) : null}

            {selectedAssessment && (
              <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-purple-950 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedAssessment.title}</span>
                  </div>
                  <div className="text-purple-700 text-[11px] mt-0.5">
                    {(selectedAssessment.questionIds || []).length} questions • {selectedAssessment.maxMarks} max marks •{" "}
                    {selectedAssessment.durationMinutes > 0 ? `${selectedAssessment.durationMinutes} mins` : "Untimed"}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">PIN CODE</span>
                  <span className="font-mono font-extrabold text-sm text-purple-900 bg-white px-2 py-0.5 rounded border border-purple-200 shadow-xs">
                    {selectedAssessment.code}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>{isTask ? "Task Access PIN:" : "Assessment Access PIN:"}</span>
            {initialCode ? (
              <span className="text-[11px] text-emerald-600 font-medium">Auto-filled from teacher link</span>
            ) : (
              <span className="text-[11px] text-slate-400 font-normal">6-character code</span>
            )}
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              maxLength={12}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.toUpperCase())}
              placeholder="e.g. IGCSE1"
              className={`w-full pl-10 pr-4 py-2.5 font-mono text-base font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
                isTask ? "focus:ring-emerald-500" : "focus:ring-purple-500"
              }`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Student Full Name:
            </label>
            {candidateName && (
              <button
                type="button"
                onClick={() => {
                  setCandidateName("");
                  try {
                    localStorage.removeItem("edexcel_student_name");
                  } catch {}
                }}
                className="text-[11px] text-slate-400 hover:text-purple-600 transition-colors font-medium cursor-pointer"
              >
                Clear / Switch Student
              </button>
            )}
          </div>
          <input
            type="text"
            required
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="e.g. Alex Smith"
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
              isTask ? "focus:ring-emerald-500" : "focus:ring-purple-500"
            }`}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Class / Group:</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g. 11B (optional)"
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${
              isTask ? "focus:ring-emerald-500" : "focus:ring-purple-500"
            }`}
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            {isTask
              ? "All your answers and code runs are saved as you work. Submit when you have completed your tasks."
              : "Responses are auto-saved in real-time. Do not close this tab until you have submitted your final paper."}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
            isTask
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
              : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/25"
          }`}
        >
          <span>
            {isLoading
              ? "Connecting..."
              : isTask
              ? "Open Practice Task"
              : "Begin Examination"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Check Released Results Link & Help Guide for Candidates */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 text-center">
        <button
          type="button"
          onClick={() => setShowLookupModal(true)}
          className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-600" />
          <span>Check Released Results & Mark Scheme</span>
        </button>

        {onOpenHelpGuide && (
          <>
            <span className="text-slate-300 text-xs hidden sm:inline">•</span>
            <button
              type="button"
              onClick={onOpenHelpGuide}
              className="text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors inline-flex items-center gap-1 cursor-pointer py-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>How does this work? (Features Guide)</span>
            </button>
          </>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScannerModal
          onScanSuccess={(scannedCode) => {
            setPinCode(scannedCode);
            setShowScanner(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Student Result & Mark Scheme Lookup Modal */}
      {showLookupModal && (
        <StudentResultLookupModal
          onClose={() => setShowLookupModal(false)}
        />
      )}
    </div>
  );
};
