import React, { useState } from "react";
import { tokenizePythonLine, getTokenClasses } from "../utils/pythonHighlighter";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";

interface PythonSnippetViewerProps {
  code: string;
  title?: string;
  showLineNumbers?: boolean;
  allowCopy?: boolean;
}

export const PythonSnippetViewer: React.FC<PythonSnippetViewerProps> = ({
  code,
  title = "Python Code",
  showLineNumbers = true,
  allowCopy = true,
}) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = async () => {
    if (!allowCopy) return;
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-slate-300 bg-white overflow-hidden shadow-sm my-3 font-mono text-xs md:text-sm">
      {/* Header bar */}
      <div className="bg-slate-100/90 px-3.5 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs font-sans text-slate-700">
        <span className="font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {title}
        </span>
        {allowCopy && (
          <button
            onClick={handleCopy}
            className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Code body with line numbers */}
      <div className="flex overflow-x-auto p-2 bg-[#fdfdfd]">
        {showLineNumbers && (
          <div className="select-none text-right pr-3 pl-1 font-mono text-xs text-slate-400 border-r border-slate-200/80">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <pre className="pl-3.5 pr-2 py-0 text-slate-900 font-mono text-xs md:text-sm leading-6 flex-1 overflow-x-auto">
          {lines.map((line, i) => {
            const tokens = tokenizePythonLine(line);
            return (
              <div key={i} className="leading-6">
                {tokens.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  tokens.map((token, tIdx) => (
                    <span key={tIdx} className={getTokenClasses(token, "classic")}>
                      {token.text}
                    </span>
                  ))
                )}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
