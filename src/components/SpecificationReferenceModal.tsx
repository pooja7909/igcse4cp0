import React, { useState } from "react";
import {
  BookOpen,
  X,
  Code2,
  ListOrdered,
  FileCheck,
  Cpu,
  Layers,
  HelpCircle,
  Award,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface SpecificationReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecificationReferenceModal: React.FC<SpecificationReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "topics" | "programming_scope" | "pseudocode" | "flowcharts" | "taxonomy">("programming_scope");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-blue-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Pearson Edexcel International GCSE (9–1) Computer Science
                </h2>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                  Specification 4CP0
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official syllabus breakdown, pseudocode command set (Appendix 5), flowchart symbols, and command words taxonomy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto gap-2 py-2">
          {[
            { id: "programming_scope", label: "Programming Scope (Topic 2 & Python)", icon: Sparkles },
            { id: "overview", label: "Qualification Overview", icon: Award },
            { id: "topics", label: "6 Specification Topics", icon: Layers },
            { id: "pseudocode", label: "Appendix 5: Pseudocode", icon: Code2 },
            { id: "flowcharts", label: "Appendix 6: Flowcharts", icon: ListOrdered },
            { id: "taxonomy", label: "Appendix 7: Command Words", icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Paper Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded">
                      Paper 1 • 4CP0/01
                    </span>
                    <span className="text-xs font-bold text-blue-800 bg-blue-200/70 px-2.5 py-0.5 rounded-full">
                      50% Weighting
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Principles of Computer Science
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Written examination testing knowledge, understanding, and application of computational principles across all 6 topics.
                  </p>
                  <div className="pt-2 border-t border-blue-200/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Duration:</span>
                      <strong className="text-slate-800">2 hours</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Raw Marks:</span>
                      <strong className="text-slate-800">80 marks</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Question Styles:</span>
                      <strong className="text-slate-800">Multiple-choice, short open-response, extended answers</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                      Paper 2 • 4CP0/02
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-full">
                      50% Weighting
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Application of Computational Thinking
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Practical on-screen programming examination in Python (or C#/Java) assessing algorithm design, program coding, trace tables, and error correction.
                  </p>
                  <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Duration:</span>
                      <strong className="text-slate-800">3 hours</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Raw Marks:</span>
                      <strong className="text-slate-800">80 marks</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Assessment Format:</span>
                      <strong className="text-slate-800">Practical IDE tasks, trace tables, code inspection, 20m design problem</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 9-1 Grading Framework */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Pearson Edexcel 9–1 Grading Scale
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The International GCSE Computer Science qualification is graded on the official 9-point scale where Grade 9 is the highest standard, down to Grade 1. Performance below the minimum threshold is recorded as Unclassified (U).
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 pt-2">
                  {[
                    { g: "9", desc: "Top 85%+", bg: "bg-purple-100 text-purple-800 border-purple-300" },
                    { g: "8", desc: "76%+", bg: "bg-indigo-100 text-indigo-800 border-indigo-300" },
                    { g: "7", desc: "68%+", bg: "bg-blue-100 text-blue-800 border-blue-300" },
                    { g: "6", desc: "60%+", bg: "bg-teal-100 text-teal-800 border-teal-300" },
                    { g: "5", desc: "Strong 52%", bg: "bg-emerald-100 text-emerald-800 border-emerald-300" },
                    { g: "4", desc: "Pass 44%", bg: "bg-lime-100 text-lime-800 border-lime-300" },
                    { g: "3", desc: "35%+", bg: "bg-yellow-100 text-yellow-800 border-yellow-300" },
                    { g: "2", desc: "25%+", bg: "bg-amber-100 text-amber-800 border-amber-300" },
                    { g: "1", desc: "15%+", bg: "bg-orange-100 text-orange-800 border-orange-300" },
                    { g: "U", desc: "<15%", bg: "bg-red-100 text-red-800 border-red-300" },
                  ].map((tier) => (
                    <div
                      key={tier.g}
                      className={`text-center p-2 rounded-xl border ${tier.bg}`}
                    >
                      <div className="font-extrabold text-base">{tier.g}</div>
                      <div className="text-[10px] font-medium opacity-80">{tier.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment Objectives */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white">
                <h4 className="text-sm font-bold text-slate-900">
                  Assessment Objectives (AO Weightings)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-blue-700">AO1</span>
                      <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">27.5%</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Demonstrate knowledge and understanding of the key principles of computer science.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-emerald-700">AO2</span>
                      <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">42.5%</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Apply knowledge and understanding of key concepts and principles of computer science.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-purple-700">AO3</span>
                      <span className="text-xs font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">30.0%</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Analyse problems in computational terms: make reasoned judgements, design, program, test, evaluate, and refine solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "topics" && (
            <div className="space-y-4">
              {[
                {
                  num: "Topic 1",
                  title: "Problem Solving",
                  spec: "Section 1.1 & 1.2",
                  bullets: [
                    "1.1 Algorithms: Concept of algorithm, constructs (sequence, selection, iteration), conventions (flowcharts, pseudocode).",
                    "1.1.5 Trace tables: Identify and correct errors in algorithms with multi-column dry runs.",
                    "1.1.8 Standard algorithms: Bubble sort, merge sort, linear search, binary search.",
                    "1.2 Decomposition & Abstraction: Break down problems, model real-world scenarios, program abstractions.",
                  ],
                },
                {
                  num: "Topic 2",
                  title: "Programming",
                  spec: "Section 2.1 to 2.6",
                  bullets: [
                    "2.1 Develop code: Syntax, runtime, and logic errors; test data (normal, boundary, erroneous).",
                    "2.2 Constructs: Sequencing, selection (IF..THEN..ELSE), iteration (WHILE, FOR, REPEAT).",
                    "2.3 Data types & structures: Integer, real, Boolean, char, string, 1D and 2D arrays, records, variables & constants.",
                    "2.4 Input/Output & Validation: Keyboard input, screen output, validation checks, file handling (read/write).",
                    "2.5 Operators: Python IDLE requires relational (==, !=, <, <=, >, >=), arithmetic (+, -, *, /, %, //, **), and logical (and, or, not). [Paper 1 pseudocode uses: =, <>, MOD, DIV, ^].",
                    "2.6 Subprograms: User-written procedures and functions, parameters, return values, scope (local vs global).",
                  ],
                },
                {
                  num: "Topic 3",
                  title: "Data",
                  spec: "Section 3.1 to 3.4",
                  bullets: [
                    "3.1 Binary: Unsigned integers, signed (sign & magnitude, two's complement), denary conversions (0-255), binary addition, shifts (logical/arithmetic), overflow, hexadecimal.",
                    "3.2 Data representation: ASCII and Unicode character sets, bitmap images (pixels, resolution, colour depth), sound sampling (frequency & resolution).",
                    "3.3 Data storage & compression: IEC binary prefixes (KiB 2¹⁰, MiB 2²⁰, GiB 2³⁰, TiB 2⁴⁰) vs SI decimal (kB 10³, MB 10⁶, GB 10⁹, TB 10¹²), lossy (JPEG, MP3) vs lossless (RLE), file size calculation.",
                    "3.4 Encryption: Need for encryption, historical ciphers: Pigpen cipher, Caesar cipher, Vigenère cipher, Rail Fence cipher.",
                  ],
                },
                {
                  num: "Topic 4",
                  title: "Computers",
                  spec: "Section 4.1 to 4.5",
                  bullets: [
                    "4.1 Machines & computational models: Input-process-output, sequential, parallel, multi-agent models.",
                    "4.2 Hardware & Von Neumann: CPU (CU, ALU, registers [PC, MAR, MDR, ACC], clock, buses [data, address, control]), fetch-decode-execute cycle, clock speed, cores, cache, RAM, ROM, virtual memory, secondary storage (magnetic, optical, solid state), cloud storage, embedded systems.",
                    "4.3 Logic: Truth tables and logic statements for AND, OR, NOT gates.",
                    "4.4 Software: Operating system functions (file, process, hardware, UI), utility software (compression, defragmentation, backup, anti-malware), simulation.",
                    "4.5 Programming languages: High-level vs low-level, translators (assembler, compiler, interpreter advantages/disadvantages).",
                  ],
                },
                {
                  num: "Topic 5",
                  title: "Communication and the Internet",
                  spec: "Section 5.1 to 5.3",
                  bullets: [
                    "5.1 Networks: LAN, WAN, PAN, client-server, peer-to-peer, wired vs wireless, bandwidth (Mbps/Gbps), topologies (bus, ring, star, mesh), 4-layer TCP/IP model (Application, Transport, Network, Data Link), protocols (Ethernet, Wi-Fi, TCP/IP, HTTP, HTTPS, FTP, POP3, SMTP, IMAP), 3G/4G/5G.",
                    "5.2 Network security: Firewalls, physical security, access control, cyber attacks (phishing, shoulder surfing, pharming, unpatched software, USB, eavesdropping), penetration testing, ethical hacking, secure coding.",
                    "5.3 The Internet & WWW: IP addressing (IPv4 vs IPv6), DNS, web servers, URLs, ISP, hardware components (modem, router, switch, WAP).",
                  ],
                },
                {
                  num: "Topic 6",
                  title: "The Bigger Picture",
                  spec: "Section 6.1",
                  bullets: [
                    "6.1.1 Environmental impact: E-waste, health, energy consumption, natural resources.",
                    "6.1.2 Ethical impact: Privacy, digital inclusion, professionalism, societal surveillance.",
                    "6.1.3 Legal impact: Intellectual property, copyright, software patents, software licensing (open source vs proprietary), cybersecurity legislation.",
                    "6.1.4 Emerging trends: Quantum computing, DNA computing, Artificial Intelligence (AI), Nanotechnology.",
                  ],
                },
              ].map((topic) => (
                <div key={topic.num} className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-blue-700 text-sm">{topic.num}:</span>
                      <h4 className="font-bold text-slate-900 text-sm">{topic.title}</h4>
                    </div>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {topic.spec}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {topic.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === "programming_scope" && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-teal-500/10 border border-indigo-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Pearson Edexcel 4CP0 Programming Boundaries & Syllabus Expectations
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Paper 2 evaluates <strong>practical computational thinking and algorithmic problem-solving</strong>. Candidates are expected to construct logic using core programming constructs (loops, conditionals, and standard operators). Questions must never assume or force advanced built-in library functions that students have not been taught.
                  </p>
                </div>
              </div>

              {/* Two Column Grid: Expected vs Not Expected */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: What students ARE expected to know */}
                <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                      Expected Knowledge (Prescribed in 4CP0 Syllabus)
                    </h5>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                      <strong className="text-emerald-900 font-bold block">1. Standard I/O & Casting:</strong>
                      <p className="text-slate-600">
                        <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">input("prompt")</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">print(...)</code>, and explicit type conversions: <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">int()</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">float()</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">str()</code>.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                      <strong className="text-emerald-900 font-bold block">2. Inbuilt Functions in Syllabus:</strong>
                      <p className="text-slate-600">
                        • <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">len()</code> (LENGTH in pseudocode) for length of strings and arrays.<br/>
                        • <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">random</code> module: <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">import random</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">random.randint(a, b)</code> (RANDOM(n) in pseudocode).
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                      <strong className="text-emerald-900 font-bold block">3. Constructs & Control Flow:</strong>
                      <p className="text-slate-600">
                        • Selection: <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">if</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">elif</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">else</code>.<br/>
                        • Iteration: count-controlled <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">for i in range(...)</code> and condition-controlled <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">while &lt;condition&gt;:</code>.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-emerald-900 font-bold block">4. Operators (Python IDLE Standard):</strong>
                        <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Exact Python 3 IDLE Syntax</span>
                      </div>
                      <p className="text-slate-600">
                        • <strong>Relational Comparisons:</strong> <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">&gt;=</code> (greater than or equal to), <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">&lt;=</code> (less than or equal to), <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">!=</code> (not equal to), <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">==</code> (equality check), <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">&gt;</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">&lt;</code>.<br/>
                        <span className="text-xs text-rose-600 font-medium block mt-0.5">⚠️ Never write <code className="line-through">&lt;&gt;</code>, <code className="line-through">=&gt;</code>, <code className="line-through">=&lt;</code>, or math symbols <code className="line-through">≠</code>, <code className="line-through">≥</code>, <code className="line-through">≤</code> in Python code; Python IDLE will throw a SyntaxError.</span>
                        • <strong>Arithmetic:</strong> <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">+</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">-</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">*</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">/</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">%</code> (MOD / remainder), <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">//</code> (DIV / floor division), <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">**</code> (exponent / power; never ^ which is XOR).<br/>
                        • <strong>Logical:</strong> <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">and</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">or</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">not</code> (must be strictly lowercase).
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                      <strong className="text-emerald-900 font-bold block">5. Subprograms & Files:</strong>
                      <p className="text-slate-600">
                        • Defining functions/procedures with parameters: <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">def calc(a, b):</code> and returning values with <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">return</code>.<br/>
                        • Reading/writing basic text files (<code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">open</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">readline</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">write</code>, <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono">close</code>).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 2: What students have NOT done / Not expected */}
                <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/30 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-rose-200/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <h5 className="font-bold text-xs uppercase tracking-wider text-rose-800">
                      Functions NOT Expected in Coursework / Exams
                    </h5>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-1">
                      <strong className="text-rose-900 font-bold block">1. No Inbuilt max() or min():</strong>
                      <p className="text-slate-600">
                        Students have not been taught <code className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded font-mono">max()</code> or <code className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded font-mono">min()</code> as a prerequisite. When finding highest or lowest values, exam tasks require <strong>algorithmic loop comparisons</strong>:
                      </p>
                      <pre className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`highest = scores[0]
for score in scores:
    if score > highest:
        highest = score`}
                      </pre>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-1">
                      <strong className="text-rose-900 font-bold block">2. No Inbuilt sort() or sorted():</strong>
                      <p className="text-slate-600">
                        Students are taught algorithmic sorting (<strong>bubble sort</strong> and <strong>merge sort</strong> logic in Topic 1.1.8). They are NOT expected to call Python's built-in <code className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded font-mono">.sort()</code> or <code className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded font-mono">sorted()</code>.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-1">
                      <strong className="text-rose-900 font-bold block">3. No String zfill():</strong>
                      <p className="text-slate-600">
                        String formatting with <code className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded font-mono">.zfill()</code> is NOT part of the course. Padding is handled via simple string concatenation: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">if len(val) &lt; 2: val = "0" + val</code>.
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                      <strong className="text-amber-900 font-bold block">★ Student Freedom & Permissibility Rule:</strong>
                      <p className="text-amber-800 leading-relaxed">
                        <strong>Yes, students CAN use them if they want!</strong> If a candidate has already learned and chooses to write <code className="bg-white px-1 py-0.5 rounded font-mono text-amber-900">max()</code>, <code className="bg-white px-1 py-0.5 rounded font-mono">min()</code>, or <code className="bg-white px-1 py-0.5 rounded font-mono">.sort()</code> in their code, they will <strong>never be penalized</strong>. All automated test cases and mark schemes accept any valid implementation that produces the correct program output.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2D List Specification Rules */}
              <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/40 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <h5 className="font-bold text-xs uppercase tracking-wider text-blue-900">
                      Two-Dimensional (2D) Lists Specification Rule (Topic 2.3.2)
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-[11px] font-bold">
                    Strict Specification Rule
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <strong className="text-emerald-800 font-bold block">✓ Allowed & Expected 2D List Structures:</strong>
                    <p className="text-slate-600 leading-relaxed">
                      A 2D array in 4CP0 represents a flat grid or table. Rows must contain <strong>mixed values of numbers and strings</strong> or <strong>just strings</strong>:
                    </p>
                    <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
{`# 1. Mixed strings and numbers:
students = [
    ["Alice", 85, "Pass"],
    ["Bob", 72, "Merit"],
    ["Charlie", 42, "Fail"]
]

# 2. Just strings (e.g. game grid):
grid = [
    ["X", "O", "X"],
    ["O", "X", "O"],
    ["O", "O", "X"]
]`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <strong className="text-rose-800 font-bold block">✗ Disallowed 2D List Structures:</strong>
                    <p className="text-slate-600 leading-relaxed">
                      <strong>NO list inside a 2D list row!</strong> Candidates are never given and must never be required to navigate 3D nested lists or sub-lists embedded inside a cell:
                    </p>
                    <pre className="p-3 rounded-xl bg-slate-900 text-rose-400 font-mono text-xs overflow-x-auto leading-relaxed">
{`# INVALID for 4CP0: List inside a row cell!
tbl_gymnasts = [
    ["Ava", [8.5, 9.2, 8.8]],   # ✗ Nested sub-list
    ["Liam", [9.4, 9.6, 9.5]]  # ✗ Requires 3D indexing
]

# CORRECT 4CP0 Specification Format:
tbl_gymnasts = [
    ["Ava", 8.5, 9.2, 8.8],     # ✓ Flat mixed row
    ["Liam", 9.4, 9.6, 9.5]    # ✓ Standard 2D row[0], row[1:]
]`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pseudocode" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Official Pearson Edexcel Pseudocode Command Set (Appendix 5):</strong>
                  <p className="mt-0.5">
                    Indices start at 0. String concatenation uses the <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">&</code> operator. Types coerce automatically where context requires.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Edexcel Pseudocode Syntax</th>
                      <th className="px-4 py-3">Specification Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">Assign Variable</td>
                      <td className="px-4 py-3 font-mono">SET Variable TO &lt;value / expression&gt;</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">SET Sum TO Score + 10</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">Constant</td>
                      <td className="px-4 py-3 font-mono">CONST &lt;TYPE&gt; &lt;NAME&gt;</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">CONST REAL PI<br/>SET PI TO 3.14159</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">1D Array Element</td>
                      <td className="px-4 py-3 font-mono">SET Array[index] TO &lt;value&gt;</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">SET ArrayMarks[3] TO 56</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">1D Array Initialise</td>
                      <td className="px-4 py-3 font-mono">SET Array TO [&lt;val1&gt;, &lt;val2&gt;]</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">SET ArrayValues TO [1, 2, 3, 4]</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">2D Array</td>
                      <td className="px-4 py-3 font-mono">SET Array[Row, Col] TO &lt;val&gt;</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">SET ClassMarks[2, 4] TO 92</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">Selection (IF)</td>
                      <td className="px-4 py-3 font-mono">IF &lt;exp&gt; THEN ... [ELSE ...] END IF</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">IF Score &gt;= 50 THEN<br/>  SEND 'Pass' TO DISPLAY<br/>END IF</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">While Loop</td>
                      <td className="px-4 py-3 font-mono">WHILE &lt;condition&gt; DO ... END WHILE</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">WHILE Flag = 0 DO<br/>  SEND 'Waiting' TO DISPLAY<br/>END WHILE</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">Repeat Until</td>
                      <td className="px-4 py-3 font-mono">REPEAT ... UNTIL &lt;condition&gt;</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">REPEAT<br/>  SET Go TO Go + 1<br/>UNTIL Go = 10</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">Count-controlled Loop</td>
                      <td className="px-4 py-3 font-mono">FOR &lt;id&gt; FROM &lt;start&gt; TO &lt;end&gt; [STEP &lt;s&gt;] DO ... END FOR</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">FOR Index FROM 1 TO 10 DO<br/>  SEND Array[Index] TO DISPLAY<br/>END FOR</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">For Each Loop</td>
                      <td className="px-4 py-3 font-mono">FOR EACH &lt;id&gt; FROM &lt;array&gt; DO ... END FOREACH</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">FOR EACH Word FROM WordsArray DO<br/>  SEND Word TO DISPLAY<br/>END FOREACH</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">Input / Output</td>
                      <td className="px-4 py-3 font-mono">RECEIVE &lt;var&gt; FROM (&lt;type&gt;) KEYBOARD<br/>SEND &lt;exp&gt; TO DISPLAY</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">RECEIVE Age FROM (INTEGER) KEYBOARD<br/>SEND 'Hello ' & Name TO DISPLAY</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">File Handling</td>
                      <td className="px-4 py-3 font-mono">READ &lt;File&gt; &lt;record&gt;<br/>WRITE &lt;File&gt; &lt;record&gt;</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">READ MyFile.txt Record<br/>WRITE MyFile.txt Name, Score</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">Subprograms</td>
                      <td className="px-4 py-3 font-mono">PROCEDURE &lt;id&gt;(...) ... END PROCEDURE<br/>FUNCTION &lt;id&gt;(...) ... RETURN &lt;exp&gt; END FUNCTION</td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50">FUNCTION Add(a, b) BEGIN FUNCTION<br/>  RETURN a + b<br/>END FUNCTION</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-700">Operators & Functions</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        <div className="text-slate-800 font-semibold mb-1">Pseudocode (Paper 1):</div>
                        <div className="text-slate-600 mb-2">MOD, DIV, ^, =, &lt;&gt;, &lt;, &lt;=, &gt;, &gt;=, AND, OR, NOT, LENGTH(), RANDOM(n)</div>
                        <div className="text-emerald-700 font-bold mb-1">Python IDLE (Paper 2 Practical):</div>
                        <div className="text-emerald-800 font-semibold">%, //, **, ==, !=, &lt;, &lt;=, &gt;, &gt;=, and, or, not, len(), random.randint()</div>
                      </td>
                      <td className="px-4 py-3 font-mono bg-slate-50/50 text-xs">
                        <div className="font-semibold text-slate-700">Python IDLE Examples:</div>
                        <div className="text-emerald-700">7 % 3 == 1 (mod)</div>
                        <div className="text-emerald-700">7 // 3 == 2 (div)</div>
                        <div className="text-emerald-700">2 ** 3 == 8 (power)</div>
                        <div className="text-emerald-700 font-bold">score &gt;= 50 and score &lt;= 100</div>
                        <div className="text-emerald-700 font-bold">status != "COMPLETE"</div>
                        <div className="text-rose-600 font-medium text-[10px] mt-1">⚠️ Do not write &lt;&gt;, =&gt;, =&lt;, ≠, ≥, or ≤ in Python</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "flowcharts" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Official Pearson Edexcel Flowchart Symbols (Appendix 6)
              </h4>
              <p className="text-xs text-slate-600">
                Learners must recognise and produce algorithms using standard flowchart shapes:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2">
                  <div className="w-24 h-10 border-2 border-slate-800 rounded-full mx-auto flex items-center justify-center font-bold text-xs">
                    Start / End
                  </div>
                  <h5 className="font-bold text-xs text-slate-800 text-center">Terminator</h5>
                  <p className="text-[11px] text-slate-500 text-center">
                    Denotes the start and end of an algorithm or subprogram.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2">
                  <div className="w-24 h-10 border-2 border-slate-800 mx-auto flex items-center justify-center font-bold text-xs">
                    Process
                  </div>
                  <h5 className="font-bold text-xs text-slate-800 text-center">Process Rectangle</h5>
                  <p className="text-[11px] text-slate-500 text-center">
                    Denotes a process, calculation, or variable assignment to be carried out.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2">
                  <div className="w-12 h-12 border-2 border-slate-800 rotate-45 mx-auto flex items-center justify-center">
                    <span className="-rotate-45 font-bold text-[10px]">Decision?</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-800 text-center">Decision Diamond</h5>
                  <p className="text-[11px] text-slate-500 text-center">
                    Denotes a conditional branch with Yes/No or True/False outgoing paths.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2">
                  <div className="w-24 h-10 border-2 border-slate-800 -skew-x-12 mx-auto flex items-center justify-center font-bold text-xs">
                    <span className="skew-x-12">Input / Output</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-800 text-center">Parallelogram</h5>
                  <p className="text-[11px] text-slate-500 text-center">
                    Denotes receiving data from input devices or displaying output.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2">
                  <div className="w-24 h-10 border-2 border-slate-800 mx-auto flex items-center justify-between px-2 font-bold text-xs border-x-4">
                    <span>Subprocess</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-800 text-center">Subprogram Box</h5>
                  <p className="text-[11px] text-slate-500 text-center">
                    Denotes a subprocess or procedure defined in a separate flowchart.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2">
                  <div className="w-24 h-10 flex items-center justify-center mx-auto text-slate-800 font-bold">
                    ───►
                  </div>
                  <h5 className="font-bold text-xs text-slate-800 text-center">Flowline (Arrow)</h5>
                  <p className="text-[11px] text-slate-500 text-center">
                    Shows the direction of execution and logical flow of the program.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "taxonomy" && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Pearson Edexcel Examination Command Words Taxonomy (Appendix 7):</strong>
                  <p className="mt-0.5">
                    Command words determine the depth of answer required in written and practical assessments. Notice the crucial difference between <em>Describe</em> (account without justification) and <em>Explain</em> (linked reasoning required for full marks).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { word: "Explain", def: "Requires a justification or exemplification of a point. Mark schemes require linked marking points with reasoning; at least 1 mark is reserved for justification." },
                  { word: "Describe", def: "Give an account of something. Statements need to be developed as they are often linked, but do not need to include a justification or reason." },
                  { word: "Devise", def: "Plan or invent a procedure from existing principles or ideas. Often used for designing new algorithms or data structures." },
                  { word: "Evaluate", def: "Review information, bring it together to form a conclusion drawing on evidence (strengths, weaknesses, alternative actions, context)." },
                  { word: "Calculate", def: "Obtain a numerical answer, showing relevant working. If the answer has a unit (e.g. bits, KiB, seconds), this must be included." },
                  { word: "Amend", def: "Requires changes, additions, deletions, or rearrangement of program code or symbolic representations." },
                  { word: "Construct / Create", def: "Requires creation of an artefact using subject-specific symbolic representations, rules, and syntax." },
                  { word: "State / Name / Give", def: "Recall one or more pieces of technical information or select from a given stimulus. Usually 1 or 2 marks." },
                  { word: "Compare and/or contrast", def: "Identify similarities and differences between two or more items without requiring a final conclusion." },
                  { word: "State what is meant by", def: "Recall and state the technical definition of a computing term clearly." },
                ].map((item) => (
                  <div key={item.word} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <span className="font-extrabold text-blue-700 text-sm block">{item.word}</span>
                    <p className="text-slate-600 leading-relaxed">{item.def}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Pearson Edexcel International GCSE (9-1) Computer Science (4CP0)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
