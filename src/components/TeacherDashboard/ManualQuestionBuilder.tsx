import React, { useState, useEffect } from "react";
import { IGCSETask, IGCSEUnit, QuestionType, QuestionLevel, CodeTestCase } from "../../types";
import { PythonCodeEditor } from "../PythonCodeEditor";
import {
  PlusCircle,
  Code,
  HelpCircle,
  Table,
  FileText,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  Trash2,
  Play,
  ShieldCheck,
  Award,
  BookOpen,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { teacherFetch, getStoredTeacherProfile } from "../../utils/teacherAuth";
import { runPython } from "../../utils/pythonRunner";
import { flexibleCompareOutputs, detectAntiHardcoding } from "../../utils/flexibleGrader";

interface EditableTestCase {
  id: string;
  label: string;
  in: string; // newline-separated inputs
  out: string;
  m: number;
}

interface ManualQuestionBuilderProps {
  units: IGCSEUnit[];
  onQuestionCreated: (task: IGCSETask) => void;
  onCancel?: () => void;
  initialTask?: IGCSETask;
}

export const ManualQuestionBuilder: React.FC<ManualQuestionBuilderProps> = ({
  units,
  onQuestionCreated,
  onCancel,
  initialTask,
}) => {
  const isEditing = !!initialTask;
  const teacherProfile = getStoredTeacherProfile();

  const [selectedUnit, setSelectedUnit] = useState<string>(
    initialTask?.unit || units[0]?.code || "U01"
  );
  const [questionType, setQuestionType] = useState<QuestionType>(initialTask?.type || "code");
  const [level, setLevel] = useState<QuestionLevel>(initialTask?.level || "Core");
  const [title, setTitle] = useState(initialTask?.title || "");
  const [brief, setBrief] = useState(initialTask?.brief || "");
  const [marks, setMarks] = useState(initialTask?.marks || 4);
  const [hint, setHint] = useState(initialTask?.hint || "");
  const [markScheme, setMarkScheme] = useState(
    initialTask?.markScheme ||
      `Pearson Edexcel International GCSE (4CP0) Official Mark Scheme\nPaper 2: Application of Computational Thinking\nTotal Marks: ${marks || 4}\n\n• M1 (Method): Awarded for valid algorithmic control structure.\n• A1 (Accuracy): Awarded for correct variable manipulation.\n• C1 (Communication): Awarded for specified output format.\n\nSPECIFICATION PRINCIPLE:\nAny valid method (while loops, for loops, list comprehensions, built-ins, recursion) that calculates the correct answer MUST be awarded full marks.\n\nANTI-HARDCODING DIRECTIVE:\nSolutions must read inputs dynamically. Hardcoded output print statements or static lookup tables will be awarded 0 marks.`
  );

  // Dynamic test cases for Python code questions
  const defaultInitialTests: EditableTestCase[] = (initialTask?.tests || []).map((t, idx) => ({
    id: `tc_${idx}_${Date.now()}`,
    label: idx === 0 ? "Typical Normal Input" : idx === 1 ? "Boundary Value" : `Test Vector ${idx + 1}`,
    in: (t.in || []).join("\n"),
    out: t.out || "",
    m: t.m || 1,
  }));

  const [tests, setTests] = useState<EditableTestCase[]>(
    defaultInitialTests.length > 0
      ? defaultInitialTests
      : [
          { id: "tc_1", label: "Typical Normal Input", in: "10\n20", out: "30\n", m: 1 },
          { id: "tc_2", label: "Alternative Normal Input", in: "5\n15", out: "20\n", m: 1 },
          { id: "tc_3", label: "Boundary Test (Zero / Baseline)", in: "0\n0", out: "0\n", m: 1 },
          { id: "tc_4", label: "Anti-Hardcoding Random Vector", in: "50\n150", out: "200\n", m: 1 },
        ]
  );

  // Code editor fields
  const [starterCode, setStarterCode] = useState(
    initialTask?.starter ||
      `# Pearson Edexcel (4CP0) Computer Science\n# Write your Python 3 solution below:\n# Note: Use input() to read values dynamically\n`
  );
  const [solutionCode, setSolutionCode] = useState(
    initialTask?.solution ||
      `# Reference Solution\nimport sys\n\n# Read inputs dynamically\nlines = [line.strip() for line in sys.stdin if line.strip()]\nif len(lines) >= 2:\n    print(int(lines[0]) + int(lines[1]))\n`
  );

  // Type-safe extraction of question details
  const initialFirstQ = initialTask?.questions?.[0] as any;
  const getCellVal = (c: any) => (typeof c === "object" && c !== null ? c.v : c) || "";

  // MCQ type fields
  const [mcqQuestion, setMcqQuestion] = useState(initialFirstQ?.q || "");
  const [opt0, setOpt0] = useState(initialFirstQ?.options?.[0] || "");
  const [opt1, setOpt1] = useState(initialFirstQ?.options?.[1] || "");
  const [opt2, setOpt2] = useState(initialFirstQ?.options?.[2] || "");
  const [opt3, setOpt3] = useState(initialFirstQ?.options?.[3] || "");
  const [correctOpt, setCorrectOpt] = useState(initialFirstQ?.a ?? 0);

  // Theory type fields
  const [theoryPrompt, setTheoryPrompt] = useState(initialFirstQ?.q || "");
  const [keywords, setKeywords] = useState(initialFirstQ?.keywords?.join(", ") || "");
  const [criteria, setCriteria] = useState(initialFirstQ?.criteria?.join("\n") || "");

  // Table type fields
  const [col1Label, setCol1Label] = useState(initialTask?.columns?.[0]?.label || "Input");
  const [col2Label, setCol2Label] = useState(initialTask?.columns?.[1]?.label || "Expected Output");
  const [row1Val1, setRow1Val1] = useState(getCellVal(initialTask?.rows?.[0]?.[0]) || "Test Case 1");
  const [row1Val2, setRow1Val2] = useState(getCellVal(initialTask?.rows?.[0]?.[1]) || "Result 1");
  const [row2Val1, setRow2Val1] = useState(getCellVal(initialTask?.rows?.[1]?.[0]) || "Test Case 2");
  const [row2Val2, setRow2Val2] = useState(getCellVal(initialTask?.rows?.[1]?.[1]) || "Result 2");

  // UI state
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [testRunResults, setTestRunResults] = useState<{
    isRunning: boolean;
    results?: Array<{ id: string; passed: boolean; actualOut: string; reason: string }>;
  }>({ isRunning: false });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState("");

  // Keep total marks in sync when tests change
  const totalTestMarks = tests.reduce((sum, t) => sum + (Number(t.m) || 1), 0);

  const handleAddTestCase = () => {
    const newId = `tc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newIndex = tests.length + 1;
    setTests([
      ...tests,
      {
        id: newId,
        label: `Test Vector ${newIndex} (Anti-Hardcoding)`,
        in: "",
        out: "\n",
        m: 1,
      },
    ]);
  };

  const handleRemoveTestCase = (id: string) => {
    if (tests.length <= 1) {
      setError("Questions require at least one auto-grading test case.");
      return;
    }
    setTests(tests.filter((t) => t.id !== id));
  };

  const handleUpdateTestCase = (id: string, updates: Partial<EditableTestCase>) => {
    setTests(tests.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  // AI-assisted Mark Scheme & Testing Suite Generator
  const handleAutoGenerateMarkScheme = async () => {
    if (!brief.trim()) {
      setError("Please write the question brief / prompt before generating the mark scheme and tests.");
      return;
    }

    setIsGeneratingAi(true);
    setError("");

    try {
      const res = await teacherFetch("/api/teacher/generate-mark-scheme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          brief: brief.trim(),
          marks: Number(marks) || 4,
          unit: selectedUnit,
          type: questionType,
          level,
          starterCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate mark scheme.");
      }

      const gen = data.data;
      if (gen.title && !title) setTitle(gen.title);
      if (gen.markScheme) setMarkScheme(gen.markScheme);
      if (gen.starter) setStarterCode(gen.starter);
      if (gen.solution) setSolutionCode(gen.solution);
      if (gen.hint) setHint(gen.hint);
      if (gen.marks) setMarks(gen.marks);

      if (Array.isArray(gen.tests) && gen.tests.length > 0) {
        const labels = [
          "Normal Typical Input",
          "Alternative Input",
          "Boundary Condition",
          "Anti-Hardcoding Test Vector",
          "Edge Value",
          "Validation Case",
        ];
        const newTests: EditableTestCase[] = gen.tests.map((t: any, idx: number) => ({
          id: `gen_tc_${idx}_${Date.now()}`,
          label: labels[idx % labels.length],
          in: Array.isArray(t.in) ? t.in.join("\n") : String(t.in || ""),
          out: String(t.out || "").endsWith("\n") ? String(t.out) : String(t.out) + "\n",
          m: Number(t.m) || 1,
        }));
        setTests(newTests);
      }
    } catch (e: any) {
      setError(e.message || "Failed to auto-generate mark scheme.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Test-run the reference solution in the browser
  const handleTestRunSolution = async () => {
    if (!solutionCode.trim()) {
      setError("Please provide a reference solution to test against the test cases.");
      return;
    }

    setTestRunResults({ isRunning: true });
    setError("");

    const codeToTest = solutionCode;
    const results: Array<{ id: string; passed: boolean; actualOut: string; reason: string }> = [];

    // First, anti-hardcoding check on reference solution
    const hardcodeCheck = detectAntiHardcoding(
      codeToTest,
      tests.map((t) => ({
        in: t.in ? t.in.split("\n") : [],
        out: t.out,
        m: t.m,
      }))
    );

    for (const t of tests) {
      const inputs = t.in ? t.in.split("\n") : [];
      try {
        const res = await runPython(codeToTest, inputs);
        if (res.err) {
          results.push({
            id: t.id,
            passed: false,
            actualOut: res.err,
            reason: "Runtime execution error",
          });
        } else {
          const comp = flexibleCompareOutputs(res.out, t.out);
          results.push({
            id: t.id,
            passed: comp.matches && !hardcodeCheck.isHardcoded,
            actualOut: res.out,
            reason: hardcodeCheck.isHardcoded
              ? "Anti-Hardcoding alert: static print detected"
              : comp.reason,
          });
        }
      } catch (err: any) {
        results.push({
          id: t.id,
          passed: false,
          actualOut: err?.message || "Execution error",
          reason: "Error",
        });
      }
    }

    setTestRunResults({ isRunning: false, results });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a question title.");
      return;
    }
    if (!brief.trim()) {
      setError("Please enter the question brief / prompt.");
      return;
    }

    const currentUnitObj = units.find((u) => u.code === selectedUnit);
    const taskId =
      initialTask?.id ||
      `custom_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const effectiveMarks = questionType === "code" ? totalTestMarks : Number(marks) || 1;

    let newTask: IGCSETask = {
      id: taskId,
      unit: selectedUnit,
      unitName: currentUnitObj?.title || initialTask?.unitName || "Custom Unit",
      title: title.trim(),
      level,
      type: questionType,
      brief: brief.trim(),
      marks: effectiveMarks,
      hint: hint.trim() || undefined,
      markScheme: markScheme.trim() || undefined,
      custom: true,
      createdAt: initialTask?.createdAt || Date.now(),
      authorId: initialTask?.authorId || teacherProfile?.id,
      authorName: initialTask?.authorName || teacherProfile?.name,
      authorSchool: initialTask?.authorSchool || teacherProfile?.school,
    };

    if (questionType === "code") {
      newTask.starter = starterCode;
      newTask.solution = solutionCode || starterCode;
      newTask.tests = tests.map((t) => ({
        in: t.in ? t.in.split("\n") : [],
        out: t.out.endsWith("\n") ? t.out : t.out + "\n",
        m: Number(t.m) || 1,
      }));
    } else if (questionType === "mcq") {
      newTask.questions = [
        {
          q: mcqQuestion.trim() || brief.trim(),
          options: [
            opt0 || "Option A",
            opt1 || "Option B",
            opt2 || "Option C",
            opt3 || "Option D",
          ],
          a: correctOpt,
        },
      ];
      newTask.marks = Number(marks) || 1;
    } else if (questionType === "theory") {
      newTask.questions = [
        {
          q: theoryPrompt.trim() || brief.trim(),
          keywords: keywords.split(/[\s,;|]+/).filter((w: string) => w.length > 2),
          maxMarks: Number(marks) || 4,
          criteria: criteria
            ? criteria.split("\n").filter((c: string) => c.trim().length > 0)
            : ["Correct technical explanation according to Pearson Edexcel specification"],
        },
      ];
    } else if (questionType === "table") {
      newTask.columns = [
        { label: col1Label || "Input", type: "text" },
        { label: col2Label || "Output", type: "text" },
      ];
      newTask.rows = [
        [{ v: row1Val1, g: true }, { v: row1Val2, g: false }],
        [{ v: row2Val1, g: true }, { v: row2Val2, g: false }],
      ];
    }

    onQuestionCreated(newTask);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header with Teacher Profile Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
              <PlusCircle className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {isEditing
                    ? `Edit Question: ${initialTask?.title || "Question"}`
                    : "Author New Pearson Edexcel (4CP0) Question"}
                </h3>
                {teacherProfile && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    <UserCheck className="w-3 h-3" />
                    Teacher: {teacherProfile.name} ({teacherProfile.school})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Set custom questions, auto-generate official mark schemes, and configure anti-hardcoding test suites.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Auto-grading & Anti-Hardcoding Guarantees Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-purple-900 leading-relaxed">
            <strong className="font-bold text-purple-950 block">Anti-Hardcoding Shield Active:</strong>
            Students must read inputs and compute results dynamically. Static print bypasses or hardcoded lookup tables are automatically detected and awarded 0 marks.
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Award className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-purple-900 leading-relaxed">
            <strong className="font-bold text-purple-950 block">Method-Agnostic Grading:</strong>
            Any valid Python technique (for loops, while loops, list comprehensions, recursion, or built-in functions) is awarded full credit if the computed output is correct.
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>
            {isEditing
              ? "Question and Mark Scheme updated successfully!"
              : "Question successfully added to the Pearson Edexcel Question Bank with Auto-Grading & Mark Scheme!"}
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs font-bold">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Topic Unit</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {units.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.code}: {u.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Question Type</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="code">Python 3 Programming (Code with Auto-Grader)</option>
              <option value="mcq">Multiple Choice Question (MCQ)</option>
              <option value="table">Trace / Truth Table</option>
              <option value="theory">Written Theory (Keyword Criteria)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as QuestionLevel)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="Starter">Starter (Foundation)</option>
              <option value="Core">Core Standard</option>
              <option value="Exam-style">Exam-Style (Advanced)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Total Marks {questionType === "code" && `(Sum: ${totalTestMarks})`}
            </label>
            <input
              type="number"
              min={1}
              max={25}
              value={questionType === "code" ? totalTestMarks : marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              disabled={questionType === "code"}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-75"
            />
          </div>
        </div>

        {/* Title and Hint */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Question Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Student Grade Averaging and List Filtering"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hint (Optional)</label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="e.g. Consider using a while loop or list comprehension to process lines"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Question Brief with Auto-Generate Action */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <label className="block text-xs font-bold text-slate-700">
              Question Brief / Specification Prompt
            </label>
            {questionType === "code" && (
              <button
                type="button"
                onClick={handleAutoGenerateMarkScheme}
                disabled={isGeneratingAi}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-[11px] font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Mark Scheme & Tests...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Generate Mark Scheme & Testing Suite</span>
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            value={brief}
            onChange={(e) => {
              setBrief(e.target.value);
              if (error) setError("");
            }}
            rows={4}
            placeholder="Describe the problem, input format, and output format for the student..."
            className="w-full p-3.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed font-mono"
            required
          />
        </div>

        {/* Official Pearson Edexcel Mark Scheme Section */}
        <div className="p-5 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-700" />
              Official Pearson Edexcel (4CP0) Mark Scheme
            </h4>
            <span className="text-[11px] text-purple-700 font-semibold">
              Specification-Compliant Criteria
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Define the Method marks (M1), Accuracy marks (A1), and Communication marks (C1). Note that any valid alternative programming method that yields the correct outcome must be credited.
          </p>
          <textarea
            value={markScheme}
            onChange={(e) => setMarkScheme(e.target.value)}
            rows={5}
            placeholder="Official mark scheme breakdown..."
            className="w-full p-3 text-xs bg-white border border-purple-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
          />
        </div>

        {/* Dynamic Fields for Code Questions */}
        {questionType === "code" && (
          <div className="space-y-6">
            {/* Starter Code Editor */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Starter Code (Provided to Student)
              </label>
              <PythonCodeEditor
                value={starterCode}
                onChange={(val) => setStarterCode(val)}
                minHeight="140px"
                title="Starter Code Editor"
              />
            </div>

            {/* Model Reference Solution Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Model Reference Solution (Tested against Test Suite)
                </label>
                <button
                  type="button"
                  onClick={handleTestRunSolution}
                  disabled={testRunResults.isRunning}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-sm transition-all disabled:opacity-50"
                >
                  {testRunResults.isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Solution...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Test-Run Solution with Auto-Grader</span>
                    </>
                  )}
                </button>
              </div>
              <PythonCodeEditor
                value={solutionCode}
                onChange={(val) => setSolutionCode(val)}
                minHeight="180px"
                title="Model Solution Editor"
              />
            </div>

            {/* Dynamic Auto-Grader Tests Section */}
            <div className="space-y-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-700" />
                    Auto-Grading Test Suite ({tests.length} Test Vectors)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Varied input-output pairs guarantee anti-hardcoding protection and method-agnostic marking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTestCase}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Test Case</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tests.map((test, index) => {
                  const runRes = testRunResults.results?.find((r) => r.id === test.id);
                  return (
                    <div
                      key={test.id}
                      className={`p-4 bg-white border rounded-2xl space-y-3 transition-all ${
                        runRes
                          ? runRes.passed
                            ? "border-emerald-300 ring-1 ring-emerald-300"
                            : "border-red-300 ring-1 ring-red-300"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-mono font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={test.label}
                            onChange={(e) =>
                              handleUpdateTestCase(test.id, { label: e.target.value })
                            }
                            className="text-xs font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none px-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          {runRes && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                runRes.passed
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {runRes.passed ? "PASS" : "FAIL"}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveTestCase(test.id)}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove test case"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                          Standard Input (one line per input call):
                        </label>
                        <textarea
                          rows={2}
                          value={test.in}
                          onChange={(e) =>
                            handleUpdateTestCase(test.id, { in: e.target.value })
                          }
                          placeholder="e.g. 10&#10;20"
                          className="w-full px-2.5 py-1.5 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                          Expected Output (exact or stripped answer):
                        </label>
                        <textarea
                          rows={2}
                          value={test.out}
                          onChange={(e) =>
                            handleUpdateTestCase(test.id, { out: e.target.value })
                          }
                          placeholder="e.g. 30"
                          className="w-full px-2.5 py-1.5 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-500 font-medium">Mark Allocation:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={test.m}
                            onChange={(e) =>
                              handleUpdateTestCase(test.id, { m: Number(e.target.value) || 1 })
                            }
                            className="w-14 px-2 py-0.5 text-xs font-mono font-bold text-center border border-slate-300 rounded-md"
                          />
                          <span className="text-slate-500 font-semibold">Mark{test.m > 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      {runRes && !runRes.passed && (
                        <div className="p-2 bg-red-50 rounded-lg text-[10px] text-red-700 font-mono">
                          <div>Actual: {JSON.stringify(runRes.actualOut)}</div>
                          <div className="text-red-500">Reason: {runRes.reason}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Fields for MCQ */}
        {questionType === "mcq" && (
          <div className="space-y-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Multiple Choice Options
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Question Prompt</label>
              <input
                type="text"
                value={mcqQuestion}
                onChange={(e) => setMcqQuestion(e.target.value)}
                placeholder="e.g. Which logic gate outputs 1 only when both inputs are 1?"
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { val: opt0, set: setOpt0, idx: 0, label: "Option A" },
                { val: opt1, set: setOpt1, idx: 1, label: "Option B" },
                { val: opt2, set: setOpt2, idx: 2, label: "Option C" },
                { val: opt3, set: setOpt3, idx: 3, label: "Option D" },
              ].map((opt) => (
                <div
                  key={opt.idx}
                  className={`p-3 rounded-xl border transition-all ${
                    correctOpt === opt.idx ? "bg-purple-50 border-purple-400" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                    <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 cursor-pointer">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOpt === opt.idx}
                        onChange={() => setCorrectOpt(opt.idx)}
                      />
                      Correct
                    </label>
                  </div>
                  <input
                    type="text"
                    value={opt.val}
                    onChange={(e) => opt.set(e.target.value)}
                    placeholder={`Enter ${opt.label} text`}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Fields for Theory */}
        {questionType === "theory" && (
          <div className="space-y-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Written Theory & Mark Scheme Keywords
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Key Technical Terms (for auto-marker)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. registers program counter memory address fetch decode execute"
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Separate key terms with spaces or commas.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mark Scheme Bullet Criteria</label>
              <textarea
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                rows={3}
                placeholder="e.g. 1 mark: PC holds address of next instruction&#10;1 mark: MAR receives address via address bus&#10;1 mark: Instruction fetched into MDR"
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between gap-3 pt-5 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            {questionType === "code"
              ? `Auto-Grader configured with ${tests.length} test vectors (${totalTestMarks} Total Marks).`
              : `Total Score: ${marks} Marks.`}
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? "Save Question Changes" : "Save Question to Bank"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
