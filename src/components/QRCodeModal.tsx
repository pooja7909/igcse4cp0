import React, { useEffect, useState } from "react";
import { generateQrDataUrl, getAssessmentStudentUrl } from "../utils/qrHelper";
import { copyToClipboard } from "../utils/clipboard";
import { Assessment } from "../types";
import { X, Copy, Check, Printer, QrCode, ExternalLink, Sparkles, ShieldCheck } from "lucide-react";

interface QRCodeModalProps {
  assessment: Assessment;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ assessment, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const isTask = assessment.type === "task";
  const studentJoinUrl = getAssessmentStudentUrl(assessment, isTask ? "task" : "assessment");

  useEffect(() => {
    generateQrDataUrl(studentJoinUrl).then((url) => {
      setQrUrl(url);
    });
  }, [studentJoinUrl]);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(studentJoinUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isTask ? "bg-emerald-50/80 border-emerald-100" : "bg-purple-50/80 border-purple-100"
        }`}>
          <div className="flex items-center gap-2.5">
            {isTask ? (
              <Sparkles className="w-5 h-5 text-emerald-600" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            )}
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isTask ? "Student Task Link & QR" : "Student Assessment Link & QR"}
              </h3>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isTask ? "bg-emerald-100 text-emerald-800" : "bg-purple-100 text-purple-800"
              }`}>
                {isTask ? "Classwork Practice Task" : "Formal Examination"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg">{assessment.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTask
                ? "Students open this link to view and submit this practice task with live tests and hints"
                : "Students open this link to sit and submit this formal examination under exam conditions"}
            </p>
          </div>

          {/* QR Code image */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner inline-block">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="Student Access QR Code"
                className="w-52 h-52 mx-auto object-contain"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-sm">
                Generating QR...
              </div>
            )}
          </div>

          {/* PIN Code Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {isTask ? "Task Access PIN:" : "Examination PIN:"}
            </span>
            <span className={`font-mono text-3xl font-extrabold tracking-widest block ${
              isTask ? "text-emerald-700" : "text-purple-700"
            }`}>
              {assessment.code}
            </span>
          </div>

          {/* Direct Link */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span>{isTask ? "Direct Student Task URL:" : "Direct Student Assessment URL:"}</span>
              <span className="text-emerald-600 font-semibold normal-case">Exclusive student view</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-2.5 rounded-lg text-xs font-mono text-slate-700 truncate border border-slate-200">
              <span className="truncate flex-1">{studentJoinUrl}</span>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-md hover:bg-white text-slate-700 transition-colors shrink-0"
                title="Copy URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Sign
          </button>
          <div className="flex items-center gap-2">
            <a
              href={studentJoinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Preview
            </a>
            <button
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-1.5 rounded-lg shadow-sm transition-colors ${
                isTask ? "bg-emerald-600 hover:bg-emerald-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> {isTask ? "Copy Task Link" : "Copy Exam Link"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
