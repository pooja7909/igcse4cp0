import React, { useState } from "react";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  LogIn,
  ArrowLeft,
  Loader2,
  Mail,
} from "lucide-react";
import { teacherLogin, TeacherProfile } from "../../utils/teacherAuth";

interface TeacherAuthGateProps {
  onAuthenticated: (teacher?: TeacherProfile) => void;
  onCancel: () => void;
}

export const TeacherAuthGate: React.FC<TeacherAuthGateProps> = ({
  onAuthenticated,
  onCancel,
}) => {
  // Login form state
  const [loginMethod, setLoginMethod] = useState<"account" | "passcode">("account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passcode, setPasscode] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (loginMethod === "account") {
      if (!email.trim() || !password.trim()) {
        setError("Please enter both your teacher email and password.");
        return;
      }
      setIsLoading(true);
      const res = await teacherLogin({ email: email.trim(), password });
      setIsLoading(false);

      if (res.success) {
        onAuthenticated(res.teacher);
      } else {
        setError(res.error || "Invalid teacher email or password.");
      }
    } else {
      if (!passcode.trim()) {
        setError("Please enter the teacher passcode / PIN.");
        return;
      }
      setIsLoading(true);
      const res = await teacherLogin({ passcode: passcode.trim() });
      setIsLoading(false);

      if (res.success) {
        onAuthenticated(res.teacher);
      } else {
        setError(res.error || "Incorrect teacher passcode.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
        <Lock className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
          Pearson Edexcel 4CP0 Faculty Portal
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Teacher Console Access
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Sign in with your teacher credentials or master passcode to access the exam builder, past paper ingestion, and live student monitoring.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-left font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* TEACHER SIGN IN FORM */}
      <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
        {/* Method Selector */}
        <div className="flex justify-end text-[11px] mb-1">
          {loginMethod === "account" ? (
            <button
              type="button"
              onClick={() => {
                setLoginMethod("passcode");
                setError("");
              }}
              className="text-purple-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3 h-3" /> Use master passcode instead
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setLoginMethod("account");
                setError("");
              }}
              className="text-purple-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-3 h-3" /> Sign in with teacher email
            </button>
          )}
        </div>

        {loginMethod === "account" ? (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Teacher Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. teacher@school.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all disabled:opacity-60"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter teacher password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all disabled:opacity-60"
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Teacher Passcode / PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={passcode}
                disabled={isLoading}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. 4CP0-teacher"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all disabled:opacity-60"
                autoFocus
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Practice
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-700/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" /> Unlock Console
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-1">
        <div className="flex items-center gap-1.5 text-slate-700 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Teacher Console Access & Security</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Sign in with your verified teacher credentials or school passcode to access the exam builder, past paper ingestion, and live student monitoring.
        </p>
      </div>
    </div>
  );
};
