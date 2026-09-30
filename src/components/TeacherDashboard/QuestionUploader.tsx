import React, { useState, useEffect, useRef } from "react";
import { IGCSETask, IGCSEUnit, QuestionType, ExtractedPaper, MarkPoint } from "../../types";
import { QuestionCard } from "../QuestionCard";
import { teacherFetch } from "../../utils/teacherAuth";
import { copyToClipboard } from "../../utils/clipboard";
import {
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Save,
  Trash2,
  FileText,
  BookOpen,
  Code2,
  CheckSquare,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  Eye,
  Edit3,
  Plus,
  Check,
  RotateCcw,
  ListChecks,
  FileCode,
  Terminal,
  X,
  Copy,
} from "lucide-react";

export interface PythonStarterFile {
  name: string;
  code: string;
  size: string;
  lineCount: number;
}

interface UploadedDoc {
  name: string;
  size: string;
  mimeType: string;
  base64: string;
  isPdf: boolean;
}

interface QuestionUploaderProps {
  units: IGCSEUnit[];
  onQuestionAdded: (newTask: IGCSETask) => void;
  onQuestionsBatchAdded?: (newTasks: IGCSETask[]) => void;
}

export const QuestionUploader: React.FC<QuestionUploaderProps> = ({
  units,
  onQuestionAdded,
  onQuestionsBatchAdded,
}) => {
  // Workflow mode: "batch_paper" (default: full past paper + mark scheme pipeline), "convert" (single question), "generate_similar" (synthesis), "json_import"
  const [mode, setMode] = useState<"batch_paper" | "convert" | "generate_similar" | "json_import">("batch_paper");

  // JSON Import state
  const [jsonInput, setJsonInput] = useState("");
  const [jsonParsedTasks, setJsonParsedTasks] = useState<IGCSETask[] | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Single Question fields
  const [questionText, setQuestionText] = useState("");
  const [markSchemeText, setMarkSchemeText] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [preferredUnit, setPreferredUnit] = useState("");
  const [preferredType, setPreferredType] = useState<QuestionType | "">("");

  // Paper Metadata for Batch Import
  const [paperMetadata, setPaperMetadata] = useState({
    examBoard: "Pearson Edexcel",
    qualification: "International GCSE (9-1) Computer Science (4CP0)",
    paper: "Paper 2 (Application of Computational Thinking)",
    session: "June",
    year: 2025,
  });

  // Dual document state: Question file and Mark Scheme file
  const [questionDoc, setQuestionDoc] = useState<UploadedDoc | null>(null);
  const [markSchemeDoc, setMarkSchemeDoc] = useState<UploadedDoc | null>(null);

  // Drag states
  const [qDragging, setQDragging] = useState(false);
  const [mDragging, setMDragging] = useState(false);

  const qFileInputRef = useRef<HTMLInputElement>(null);
  const mFileInputRef = useRef<HTMLInputElement>(null);
  const pyFileInputRef = useRef<HTMLInputElement>(null);
  const singlePyFileInputRef = useRef<HTMLInputElement>(null);

  // Authentic candidate Python starter files (.py) for practical papers
  const [starterFiles, setStarterFiles] = useState<PythonStarterFile[]>([]);
  const [pyDragging, setPyDragging] = useState(false);
  const [viewingStarterFile, setViewingStarterFile] = useState<PythonStarterFile | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Results state
  const [extractedPaper, setExtractedPaper] = useState<ExtractedPaper | null>(null);
  const [approvedQuestionIds, setApprovedQuestionIds] = useState<Set<string>>(new Set());
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [previewTask, setPreviewTask] = useState<IGCSETask | null>(null);

  // Single task draft state
  const [draftTask, setDraftTask] = useState<IGCSETask | null>(null);
  const [conversionNote, setConversionNote] = useState<string | null>(null);

  // Helper to read PDF or Image file
  const readFileAsDoc = (file: File): Promise<UploadedDoc> => {
    return new Promise((resolve, reject) => {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const isImage = file.type.startsWith("image/");

      if (!isPdf && !isImage) {
        reject(new Error("Please upload a PDF document (.pdf) or an image (PNG, JPG, WebP)."));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          mimeType: isPdf ? "application/pdf" : file.type || "image/png",
          base64: reader.result as string,
          isPdf,
        });
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });
  };

  const handleQuestionFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const doc = await readFileAsDoc(file);
        setQuestionDoc(doc);
        setErrorMsg(null);
      } catch (err: any) {
        setErrorMsg(err.message);
      }
    }
  };

  const handleMarkSchemeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const doc = await readFileAsDoc(file);
        setMarkSchemeDoc(doc);
        setErrorMsg(null);
      } catch (err: any) {
        setErrorMsg(err.message);
      }
    }
  };

  // Helper to read authentic Python (.py) starter files
  const readPythonFiles = async (files: FileList | File[]): Promise<PythonStarterFile[]> => {
    const loaded: PythonStarterFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isPy =
        file.name.toLowerCase().endsWith(".py") ||
        file.name.toLowerCase().endsWith(".txt") ||
        file.type.includes("python") ||
        file.type.includes("text");
      if (isPy) {
        try {
          const code = await file.text();
          const lineCount = code.split("\n").length;
          const sizeKb = (file.size / 1024).toFixed(1) + " KB";
          loaded.push({
            name: file.name,
            code,
            size: sizeKb,
            lineCount,
          });
        } catch (e) {
          console.error("Error reading Python file:", file.name, e);
        }
      }
    }
    return loaded;
  };

  const handleStarterFilesDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setPyDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = await readPythonFiles(e.dataTransfer.files);
      if (newFiles.length > 0) {
        setStarterFiles((prev) => {
          const map = new Map(prev.map((f) => [f.name, f]));
          newFiles.forEach((f) => map.set(f.name, f));
          return Array.from(map.values()).sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { numeric: true })
          );
        });
        setSuccessMsg(`✓ Added ${newFiles.length} Python starter file(s): ${newFiles.map((f) => f.name).join(", ")}`);
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg("Please upload Python files ending in .py");
      }
    }
  };

  const handleStarterFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = await readPythonFiles(e.target.files);
      if (newFiles.length > 0) {
        setStarterFiles((prev) => {
          const map = new Map(prev.map((f) => [f.name, f]));
          newFiles.forEach((f) => map.set(f.name, f));
          return Array.from(map.values()).sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { numeric: true })
          );
        });
        setSuccessMsg(`✓ Added ${newFiles.length} Python starter file(s): ${newFiles.map((f) => f.name).join(", ")}`);
        setTimeout(() => setSuccessMsg(null), 5000);
      }
      e.target.value = "";
    }
  };

  const removeStarterFile = (name: string) => {
    setStarterFiles((prev) => prev.filter((f) => f.name !== name));
  };

  // Clipboard paste listener: quick paste screenshots
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            try {
              const doc = await readFileAsDoc(file);
              if (!questionDoc) {
                setQuestionDoc(doc);
                setSuccessMsg("Question screenshot pasted from clipboard!");
              } else {
                setMarkSchemeDoc(doc);
                setSuccessMsg("Mark scheme screenshot pasted from clipboard!");
              }
              setTimeout(() => setSuccessMsg(null), 3500);
              break;
            } catch (err: any) {
              setErrorMsg(err.message);
            }
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [questionDoc]);

  // One-click Paper 2 2025 Inspiration Templates
  const handleLoadPaper2Template = (preset: "validation" | "subprogram" | "database" | "capstone") => {
    if (preset === "validation") {
      setQuestionText(
        "Question 3(c): A student is writing a program to validate numbers entered by a user. The program must accept numbers from 1 to 20 or greater than 60 as 'Acceptable'. If number is 30, print 'Perfect'. If 31 to 39 inclusive, print 'Centre'. If empty, print 'You must provide a number'. If negative or zero, print 'The number must be greater than zero'. For any other number, print 'No message'."
      );
      setMarkSchemeText(
        "Mark Scheme: Award 1 mark for empty string check; 1 mark for non-positive check; 1 mark for range check (1 to 20 or > 60); 1 mark for exact 30 check; 1 mark for 31-39 check; 1 mark for default 'No message'. Total 6 marks."
      );
      setPreferredUnit("U03");
      setPreferredType("code");
      setSuccessMsg("Loaded 2025 Paper 2 Q03c Validation Pattern.");
    } else if (preset === "subprogram") {
      setQuestionText(
        "Question 4(c): Devise a subprogram named 'construct_key' that takes two parameters: 'text' and 'digits'. It must return a new key with digits inserted between the first two characters and remaining characters of text."
      );
      setMarkSchemeText(
        "Mark Scheme: Subprogram definition with 2 parameters (1m); Slices text[:2] (1m); Slices text[2:] (1m); Concatenates text[:2] + digits + text[2:] (1m); Returns constructed string (1m). Total 5 marks."
      );
      setPreferredUnit("U04");
      setPreferredType("code");
      setSuccessMsg("Loaded 2025 Paper 2 Q04c Subprogram Pattern.");
    } else if (preset === "database") {
      setQuestionText(
        "Question 5(b): Devise a SQL query to retrieve the PlayerName and Score from table 'Leaderboard' where Level is 'Hard' and Score is greater than 100, ordered by Score descending."
      );
      setMarkSchemeText(
        "Mark Scheme: SELECT PlayerName, Score (1m); FROM Leaderboard (1m); WHERE Level = 'Hard' AND Score > 100 (2m); ORDER BY Score DESC (1m). Total 5 marks."
      );
      setPreferredUnit("U08");
      setPreferredType("theory");
      setSuccessMsg("Loaded Database/SQL Query Pattern.");
    } else if (preset === "capstone") {
      setQuestionText(
        "Question 6 (20-Mark Capstone): A program is required to manage book loans for a school library. Read records from 'books.txt', allow loan registration, calculate overdue fines (£0.50 per day past 14 days), and write updated records back to file."
      );
      setMarkSchemeText(
        "Mark Scheme: File reading (3m); Data structure manipulation (4m); Fine calculation algorithm (4m); Validation checks (3m); File output formatting (3m); Overall code structure & efficiency (3m). Total 20 marks."
      );
      setPreferredUnit("U05");
      setPreferredType("code");
      setSuccessMsg("Loaded 20-Marker Capstone Exam Synthesis pattern.");
    }
  };

  // Run Past Paper Extraction Pipeline
  const handleBatchConvertPaper = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionDoc && !markSchemeDoc && starterFiles.length === 0) {
      setErrorMsg("Please upload at least a Question Paper / Mark Scheme file (PDF or Image) or Python starter code files (.py).");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setExtractedPaper(null);

    try {
      const res = await teacherFetch("/api/convert-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionDoc: questionDoc
            ? { base64: questionDoc.base64, name: questionDoc.name, mimeType: questionDoc.mimeType }
            : undefined,
          markSchemeDoc: markSchemeDoc
            ? { base64: markSchemeDoc.base64, name: markSchemeDoc.name, mimeType: markSchemeDoc.mimeType }
            : undefined,
          starterFiles: starterFiles.map((sf) => ({
            name: sf.name,
            code: sf.code,
            size: sf.size,
            lineCount: sf.lineCount,
          })),
          paperMetadata,
          preferredUnit: preferredUnit || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Server request failed (${res.status})` }));
        throw new Error(err.error || "Failed to process past paper");
      }

      const data = await res.json();
      const paper: ExtractedPaper = data.paper;

      // Ensure starterFileName is connected if any matching starter file exists
      if (starterFiles.length > 0 && Array.isArray(paper.questions)) {
        paper.questions.forEach((q, idx) => {
          if (q.type === "code" && !q.starterFileName) {
            const qNum = idx + 1;
            const match = starterFiles.find(
              (sf) =>
                sf.name.toLowerCase().includes(`q0${qNum}`) ||
                sf.name.toLowerCase().includes(`q${qNum}`) ||
                sf.name.toLowerCase().includes(`question_${qNum}`) ||
                sf.name.toLowerCase().includes(`question${qNum}`)
            ) || starterFiles[idx] || starterFiles[0];
            if (match) {
              q.starterFileName = match.name;
              if (!q.starter || q.starter.trim().length === 0) {
                q.starter = match.code;
              }
            }
          }
        });
      }

      setExtractedPaper(paper);
      // Pre-select and approve all detected questions
      const allIds = new Set(paper.questions.map((q) => q.id));
      setApprovedQuestionIds(allIds);

      setSuccessMsg(
        `✓ Paper extracted successfully! Detected ${paper.totalQuestions} questions, ${paper.totalSubParts} sub-parts, and ${paper.totalMarkPoints} structured mark points (${paper.totalMarks} total marks)${starterFiles.length > 0 ? ` with ${starterFiles.length} Python starter scaffold(s) attached` : ""}.`
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process past paper.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Single Question Convert / Generate
  const handleSingleConvert = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasContent =
      Boolean(questionText.trim()) ||
      Boolean(markSchemeText.trim()) ||
      Boolean(questionDoc) ||
      Boolean(markSchemeDoc);

    if (!hasContent) {
      setErrorMsg("Please provide question text, mark scheme, or upload a Question/Mark Scheme file (PDF or Image).");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setConversionNote(null);

    try {
      const res = await teacherFetch("/api/convert-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText,
          markScheme: markSchemeText,
          starterCode,
          preferredUnit,
          preferredType: preferredType || undefined,
          mode: mode === "generate_similar" ? "generate_similar" : "convert",
          questionDoc: questionDoc
            ? { base64: questionDoc.base64, name: questionDoc.name, mimeType: questionDoc.mimeType }
            : undefined,
          markSchemeDoc: markSchemeDoc
            ? { base64: markSchemeDoc.base64, name: markSchemeDoc.name, mimeType: markSchemeDoc.mimeType }
            : undefined,
          imageBase64: questionDoc && !questionDoc.isPdf ? questionDoc.base64 : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Server request failed (${res.status})` }));
        throw new Error(err.error || "Failed to process question");
      }

      const data = await res.json();
      const taskWithImage: IGCSETask = {
        ...data.task,
        image: (!questionDoc?.isPdf && questionDoc?.base64) || data.task.image,
      };
      setDraftTask(taskWithImage);

      if (mode === "generate_similar") {
        setConversionNote(
          `✨ Synthesized fresh exam-style question following the computational pattern. Classified under "${data.task.unit}: ${data.task.unitName || ""}".`
        );
      } else {
        setConversionNote(
          `📋 Digitized question and verified mark scheme under "${data.task.unit}: ${data.task.unitName || ""}".`
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to convert question.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle selection for a question
  const toggleQuestionApproval = (qId: string) => {
    setApprovedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) {
        next.delete(qId);
      } else {
        next.add(qId);
      }
      return next;
    });
  };

  // Toggle Select All
  const toggleSelectAll = () => {
    if (!extractedPaper) return;
    if (approvedQuestionIds.size === extractedPaper.questions.length) {
      setApprovedQuestionIds(new Set());
    } else {
      setApprovedQuestionIds(new Set(extractedPaper.questions.map((q) => q.id)));
    }
  };

  // Update a specific MarkPoint in the extracted paper
  const handleUpdateMarkPoint = (
    qIndex: number,
    mpIndex: number,
    field: "criterion" | "marks",
    value: string | number
  ) => {
    if (!extractedPaper) return;
    const updated = { ...extractedPaper };
    const question = { ...updated.questions[qIndex] };
    const markPoints = [...(question.markPoints || [])];

    if (markPoints[mpIndex]) {
      markPoints[mpIndex] = {
        ...markPoints[mpIndex],
        [field]: field === "marks" ? Number(value) || 1 : value,
      };
      question.markPoints = markPoints;
      // Recalculate question marks
      question.marks = markPoints.reduce((acc, mp) => acc + (mp.marks || 1), 0);
      updated.questions[qIndex] = question;
      setExtractedPaper(updated);
    }
  };

  // Add a new MarkPoint to a question
  const handleAddMarkPoint = (qIndex: number) => {
    if (!extractedPaper) return;
    const updated = { ...extractedPaper };
    const question = { ...updated.questions[qIndex] };
    const markPoints = [...(question.markPoints || [])];
    const newMpId = `MP${markPoints.length + 1}`;

    markPoints.push({
      id: newMpId,
      marks: 1,
      criterion: "New marking criterion",
    });

    question.markPoints = markPoints;
    question.marks = markPoints.reduce((acc, mp) => acc + (mp.marks || 1), 0);
    updated.questions[qIndex] = question;
    setExtractedPaper(updated);
  };

  // Update starter code or starter file name for an extracted question
  const handleUpdateQuestionStarter = (
    qIndex: number,
    newStarter: string,
    fileName?: string
  ) => {
    if (!extractedPaper) return;
    const updated = { ...extractedPaper };
    const question = { ...updated.questions[qIndex] };
    question.starter = newStarter;
    if (fileName !== undefined) {
      question.starterFileName = fileName;
    }
    updated.questions[qIndex] = question;
    setExtractedPaper(updated);
  };

  // Load a .py file specifically for an extracted question
  const handleLoadPyFileForQuestion = async (qIndex: number, file: File) => {
    try {
      const code = await file.text();
      handleUpdateQuestionStarter(qIndex, code, file.name);
      setSuccessMsg(`✓ Attached ${file.name} to Question ${qIndex + 1}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg("Failed to read Python file: " + err.message);
    }
  };

  // Direct import of .py files into Question Bank as practical tasks
  const handlePythonFilesImportAsTasks = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const pyFiles = await readPythonFiles(e.target.files);
      if (pyFiles.length > 0) {
        const tasks: IGCSETask[] = pyFiles.map((pf, idx) => {
          const match = pf.name.match(/q0?([0-9]+)/i);
          const qNum = match ? match[1] : `${idx + 1}`;
          const lines = pf.code.split("\n");
          const commentLines = lines
            .filter((l) => l.trim().startsWith("#"))
            .map((l) => l.replace(/^#\s*/, ""))
            .filter(Boolean);
          const brief =
            commentLines.length > 0
              ? commentLines.slice(0, 4).join(" ")
              : `Complete the authentic Python program specified in ${pf.name}. Ensure all required inputs, computations, and outputs conform to the specification.`;

          return {
            id: `q_py_file_${Date.now().toString(36)}_${idx + 1}`,
            unit: "U03",
            unitName: "Topic 3: Problem solving and programming",
            title: `Question ${qNum}: Programming Practice (${pf.name})`,
            level: "Exam-style",
            type: "code",
            brief,
            marks: 6,
            starter: pf.code,
            starterFileName: pf.name,
            solution: pf.code + "\n# Sample passing solution\n",
            tests: [
              { in: ["10"], out: "10\n", m: 3 },
              { in: ["20"], out: "20\n", m: 3 },
            ],
            custom: true,
            createdAt: Date.now(),
          };
        });

        setJsonParsedTasks((prev) => [...(prev || []), ...tasks]);
        setJsonInput(JSON.stringify(tasks, null, 2));
        setSuccessMsg(`✓ Loaded ${tasks.length} Python starter file(s) as programming questions!`);
        setTimeout(() => setSuccessMsg(null), 5000);
      }
      e.target.value = "";
    }
  };

  // Save selected or all questions into Bank
  const handleSaveExtractedQuestions = async (onlySelected: boolean) => {
    if (!extractedPaper) return;

    const questionsToSave = onlySelected
      ? extractedPaper.questions.filter((q) => approvedQuestionIds.has(q.id))
      : extractedPaper.questions;

    if (questionsToSave.length === 0) {
      setErrorMsg("Please select at least one question to save.");
      return;
    }

    try {
      setIsProcessing(true);
      if (onQuestionsBatchAdded) {
        onQuestionsBatchAdded(questionsToSave);
      } else {
        questionsToSave.forEach((q) => onQuestionAdded(q));
      }

      setSuccessMsg(
        `✓ Saved ${questionsToSave.length} verified questions from "${extractedPaper.paperTitle}" to the Question Bank!`
      );
      setExtractedPaper(null);
      setQuestionDoc(null);
      setMarkSchemeDoc(null);
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save questions to bank.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Save Single Draft Task
  const handleSaveSingleTask = () => {
    if (!draftTask) return;
    onQuestionAdded(draftTask);
    setSuccessMsg(`Question "${draftTask.title}" saved to the active question bank under ${draftTask.unit}!`);
    setDraftTask(null);
    setQuestionText("");
    setMarkSchemeText("");
    setStarterCode("");
    setQuestionDoc(null);
    setMarkSchemeDoc(null);
    setConversionNote(null);
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  // JSON Import Handlers
  const handleParseJson = (rawText: string) => {
    try {
      setJsonError(null);
      if (!rawText.trim()) {
        setJsonError("Please paste or upload JSON content.");
        setJsonParsedTasks(null);
        return;
      }
      const parsed = JSON.parse(rawText.trim());
      let tasks: IGCSETask[] = [];

      if (Array.isArray(parsed)) {
        tasks = parsed;
      } else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.tasks)) {
          tasks = parsed.tasks;
        } else if (Array.isArray(parsed.questions)) {
          tasks = parsed.questions;
        } else if (parsed.id || parsed.title) {
          tasks = [parsed];
        } else {
          throw new Error("JSON must be a question object or an array of question objects (tasks/questions).");
        }
      } else {
        throw new Error("Invalid JSON structure.");
      }

      const validTasks: IGCSETask[] = tasks.map((t: any, idx: number) => ({
        id: t.id || `custom_json_${Date.now()}_${idx}`,
        title: t.title || `Imported Question ${idx + 1}`,
        brief: t.brief || t.title || "Exam question",
        type: t.type || "code",
        marks: Number(t.marks) || 1,
        level: t.level || "Exam-style",
        difficulty: t.difficulty || "Moderate",
        question: t.question || "",
        unit: t.unit || "U99",
        unitName: t.unitName || "Teacher Added Questions",
        starter: t.starter || "",
        cases: t.cases || [],
        options: t.options || [],
        answer: t.answer,
        rubric: t.rubric,
        markPoints: t.markPoints || [],
      }));

      setJsonParsedTasks(validTasks);
      setSuccessMsg(`✓ Successfully parsed ${validTasks.length} question(s) from JSON.`);
    } catch (e: any) {
      setJsonError(e.message || "Failed to parse JSON string. Please ensure valid JSON formatting.");
      setJsonParsedTasks(null);
    }
  };

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || "";
      setJsonInput(content);
      handleParseJson(content);
    };
    reader.readAsText(file);
  };

  const handleSaveJsonQuestions = () => {
    if (!jsonParsedTasks || jsonParsedTasks.length === 0) return;
    if (onQuestionsBatchAdded) {
      onQuestionsBatchAdded(jsonParsedTasks);
    } else {
      jsonParsedTasks.forEach((t) => onQuestionAdded(t));
    }
    setSuccessMsg(`✓ Imported ${jsonParsedTasks.length} questions into the active Question Bank!`);
    setJsonInput("");
    setJsonParsedTasks(null);
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  const handleLoadSampleJson = () => {
    const sample = [
      {
        id: `sample_py_${Date.now().toString(36)}`,
        title: "Calculate Perimeter of a Rectangle",
        unit: "U01",
        unitName: "Topic 1: Problem solving",
        type: "code",
        marks: 3,
        level: "Exam-style",
        question: "Write a program that takes length and width as inputs, and prints the perimeter of the rectangle (2 * (length + width)).",
        starter: "# Complete the perimeter calculation\nlength = int(input())\nwidth = int(input())\n",
        cases: [
          { in: ["5", "3"], out: "16", m: 1 },
          { in: ["10", "4"], out: "28", m: 1 },
          { in: ["7", "7"], out: "28", m: 1 },
        ],
      },
    ];
    const text = JSON.stringify(sample, null, 2);
    setJsonInput(text);
    handleParseJson(text);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector & Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Past Paper & Mark Scheme Ingestion Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Upload full past exam papers and official mark schemes in <strong>PDF or Image</strong> format. Detect all questions, sub-parts, and structured MarkPoints (`MP1`, `MP2`) with automated test suites.
            </p>
          </div>

          {/* Workflow Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => {
                setMode("batch_paper");
                setErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "batch_paper"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Past Paper Import
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("convert");
                setErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "convert"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Single Question
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("generate_similar");
                setErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "generate_similar"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Pattern Generator
            </button>
            <button
              id="btn-mode-json-import"
              type="button"
              onClick={() => {
                setMode("json_import");
                setErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "json_import"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              JSON / File Import
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* WORKFLOW 1: FULL PAST PAPER INGESTION (DEFAULT) */}
        {/* ======================================================== */}
        {mode === "batch_paper" && (
          <form onSubmit={handleBatchConvertPaper} className="space-y-5">
            {/* Step Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-purple-900 truncate">Question Paper</div>
                  <div className="text-[10px] text-purple-700 truncate">PDF / Screenshot</div>
                </div>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-emerald-900 truncate">Mark Scheme</div>
                  <div className="text-[10px] text-emerald-700 truncate">Official criteria</div>
                </div>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-900 truncate">Python Starters (.py)</div>
                  <div className="text-[10px] text-amber-700 truncate">Q01.py – Q06.py scaffolds</div>
                </div>
              </div>
              <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-indigo-900 truncate">Extract & Grade</div>
                  <div className="text-[10px] text-indigo-700 truncate">All parts & test suites</div>
                </div>
              </div>
            </div>

            {/* Document Upload Area (Side by side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question Paper File */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Past Question Paper (PDF / Image):</span>
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, PNG, JPG</span>
                </label>

                {!questionDoc ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setQDragging(true);
                    }}
                    onDragLeave={() => setQDragging(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setQDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        try {
                          const doc = await readFileAsDoc(file);
                          setQuestionDoc(doc);
                        } catch (err: any) {
                          setErrorMsg(err.message);
                        }
                      }
                    }}
                    onClick={() => qFileInputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                      qDragging
                        ? "border-purple-500 bg-purple-50/60 scale-[1.01]"
                        : "border-slate-300 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/20"
                    }`}
                  >
                    <input
                      ref={qFileInputRef}
                      type="file"
                      accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg,image/webp,image/*"
                      onChange={handleQuestionFileChange}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 text-center">
                      Drop Question Paper PDF or Images
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Click to browse or paste screenshot
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        {questionDoc.isPdf ? (
                          <FileText className="w-5 h-5" />
                        ) : (
                          <img
                            src={questionDoc.base64}
                            alt="Question preview"
                            className="w-full h-full object-cover rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {questionDoc.name}
                        </div>
                        <div className="text-[10px] text-purple-700 font-medium">
                          {questionDoc.isPdf ? "PDF Document" : "Image"} • {questionDoc.size}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionDoc(null);
                        if (qFileInputRef.current) qFileInputRef.current.value = "";
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                      title="Remove question paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Mark Scheme File */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Mark Scheme (PDF / Image):</span>
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, PNG, JPG</span>
                </label>

                {!markSchemeDoc ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setMDragging(true);
                    }}
                    onDragLeave={() => setMDragging(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setMDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        try {
                          const doc = await readFileAsDoc(file);
                          setMarkSchemeDoc(doc);
                        } catch (err: any) {
                          setErrorMsg(err.message);
                        }
                      }
                    }}
                    onClick={() => mFileInputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                      mDragging
                        ? "border-emerald-500 bg-emerald-50/60 scale-[1.01]"
                        : "border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20"
                    }`}
                  >
                    <input
                      ref={mFileInputRef}
                      type="file"
                      accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg,image/webp,image/*"
                      onChange={handleMarkSchemeFileChange}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 text-center">
                      Drop Mark Scheme PDF or Images
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Click to browse official mark criteria
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        {markSchemeDoc.isPdf ? (
                          <FileText className="w-5 h-5" />
                        ) : (
                          <img
                            src={markSchemeDoc.base64}
                            alt="Mark scheme preview"
                            className="w-full h-full object-cover rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {markSchemeDoc.name}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-medium">
                          {markSchemeDoc.isPdf ? "PDF Document" : "Image"} • {markSchemeDoc.size}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMarkSchemeDoc(null);
                        if (mFileInputRef.current) mFileInputRef.current.value = "";
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                      title="Remove mark scheme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Python Starter Files (.py) Upload Area */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-amber-100 text-amber-700">
                    <FileCode className="w-3.5 h-3.5" />
                  </span>
                  <span>Authentic Candidate Python Starter Files (.py):</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    (e.g. Q01.py, Q02.py, Q03.py, Q04.py, Q05.py, Q06.py)
                  </span>
                </label>
                {starterFiles.length > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {starterFiles.length} file{starterFiles.length > 1 ? "s" : ""} attached
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Recommended for Paper 2
                  </span>
                )}
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setPyDragging(true);
                }}
                onDragLeave={() => setPyDragging(false)}
                onDrop={handleStarterFilesDrop}
                onClick={() => pyFileInputRef.current?.click()}
                className={`p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  pyDragging
                    ? "border-amber-500 bg-amber-50/70 scale-[1.005]"
                    : "border-slate-200 hover:border-amber-400 bg-amber-50/20 hover:bg-amber-50/40"
                }`}
              >
                <input
                  type="file"
                  ref={pyFileInputRef}
                  onChange={handleStarterFilesChange}
                  multiple
                  accept=".py,.txt"
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {starterFiles.length === 0
                          ? "Drag & drop Python starter files (.py) here"
                          : `${starterFiles.length} Python starter file${starterFiles.length > 1 ? "s" : ""} loaded`}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Automatically links each Python scaffold to its question (e.g. Q01.py → Question 1)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      pyFileInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-400 text-slate-700 hover:text-amber-800 font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>Browse .py Files</span>
                  </button>
                </div>

                {/* Attached files pills/cards */}
                {starterFiles.length > 0 && (
                  <div
                    className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {starterFiles.map((sf) => (
                      <div
                        key={sf.name}
                        className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-amber-200/80 shadow-2xs text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">
                            .py
                          </span>
                          <div className="min-w-0">
                            <div className="font-mono font-semibold text-slate-800 truncate" title={sf.name}>
                              {sf.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {sf.lineCount} lines • {sf.size}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setViewingStarterFile(sf)}
                            className="p-1 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded"
                            title="Inspect code"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStarterFile(sf.name)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {starterFiles.length > 0 && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>
                    ✓ {starterFiles.length} starter scaffold{starterFiles.length > 1 ? "s" : ""} will be integrated into code questions during extraction.
                  </span>
                  <button
                    type="button"
                    onClick={() => setStarterFiles([])}
                    className="text-red-500 hover:text-red-700 hover:underline font-medium"
                  >
                    Clear all starter files
                  </button>
                </div>
              )}
            </div>

            {/* Exam Paper Metadata Configuration */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Exam Board:</label>
                <input
                  type="text"
                  value={paperMetadata.examBoard}
                  onChange={(e) => setPaperMetadata({ ...paperMetadata, examBoard: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Paper:</label>
                <select
                  value={paperMetadata.paper}
                  onChange={(e) => setPaperMetadata({ ...paperMetadata, paper: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="Paper 2 (Application of Computational Thinking)">Paper 2 (Coding & Practical)</option>
                  <option value="Paper 1 (Principles of Computer Science)">Paper 1 (Theory & Principles)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Session:</label>
                <select
                  value={paperMetadata.session}
                  onChange={(e) => setPaperMetadata({ ...paperMetadata, session: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="June">June Series</option>
                  <option value="November">November Series</option>
                  <option value="Sample">Sample Assessment Material</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Year:</label>
                <input
                  type="number"
                  value={paperMetadata.year}
                  onChange={(e) => setPaperMetadata({ ...paperMetadata, year: Number(e.target.value) || 2025 })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                Detects all questions (Q1–Q6, sub-parts a/b/c) and aligns with mark points for 100% automated grading.
              </span>
              <button
                type="submit"
                disabled={isProcessing || (!questionDoc && !markSchemeDoc && starterFiles.length === 0)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isProcessing
                  ? "Ingesting & Analyzing Paper with Gemini..."
                  : !questionDoc && !markSchemeDoc && starterFiles.length > 0
                  ? `Generate Practice Tasks from ${starterFiles.length} Python Starter(s)`
                  : "Extract All Questions & Mark Scheme"}
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* WORKFLOW 2 & 3: SINGLE QUESTION & PATTERN GENERATOR */}
        {/* ======================================================== */}
        {(mode === "convert" || mode === "generate_similar") && (
          <form onSubmit={handleSingleConvert} className="space-y-4">
            {/* Quick Inspiration buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Load 2025 Paper 2 Pattern Inspirations (1-Click):</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadPaper2Template("validation")}
                  className="p-2 text-left bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-slate-200 rounded-lg transition-colors cursor-pointer text-xs"
                >
                  <div className="font-bold text-slate-800">Q03(c): Validation</div>
                  <div className="text-[10px] text-slate-500">Complex conditional checks (6m)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPaper2Template("subprogram")}
                  className="p-2 text-left bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-slate-200 rounded-lg transition-colors cursor-pointer text-xs"
                >
                  <div className="font-bold text-slate-800">Q04(c): Subprograms</div>
                  <div className="text-[10px] text-slate-500">String slicing & key return (5m)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPaper2Template("database")}
                  className="p-2 text-left bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-slate-200 rounded-lg transition-colors cursor-pointer text-xs"
                >
                  <div className="font-bold text-slate-800">Database / SQL</div>
                  <div className="text-[10px] text-slate-500">SELECT / WHERE filter (5m)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPaper2Template("capstone")}
                  className="p-2 text-left bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-slate-200 rounded-lg transition-colors cursor-pointer text-xs"
                >
                  <div className="font-bold text-slate-800">Q06: 20-Mark Capstone</div>
                  <div className="text-[10px] text-slate-500">Full file I/O & records (20m)</div>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Question Text / Context:</label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Paste raw question text or instructions here..."
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Mark Scheme Criteria / Test Values:</label>
              <textarea
                value={markSchemeText}
                onChange={(e) => setMarkSchemeText(e.target.value)}
                placeholder="Paste official mark scheme rubrics, test data tables, acceptable answers..."
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>

            {/* Optional Python Starter Code for Single Question */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-amber-600" />
                  <span>Candidate Python Starter Scaffold (Optional):</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={singlePyFileInputRef}
                    accept=".py,.txt"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const code = await file.text();
                        setStarterCode(code);
                        setSuccessMsg(`✓ Loaded ${file.name} starter scaffold!`);
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => singlePyFileInputRef.current?.click()}
                    className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors"
                  >
                    <Upload className="w-3 h-3 text-amber-600" />
                    <span>Upload .py File</span>
                  </button>
                  {starterCode && (
                    <button
                      type="button"
                      onClick={() => setStarterCode("")}
                      className="text-[11px] text-slate-400 hover:text-red-600 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                placeholder="# Optional candidate starter code or function definitions (e.g. def calculate_tax(income):)..."
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Target Syllabus Unit:</label>
                <select
                  value={preferredUnit}
                  onChange={(e) => setPreferredUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">✨ Auto-detect with AI</option>
                  {units.map((u) => (
                    <option key={u.code} value={u.code}>
                      {u.code}: {u.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Question Format:</label>
                <select
                  value={preferredType}
                  onChange={(e) => setPreferredType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">✨ Auto-detect best format</option>
                  <option value="code">Write Python Code (auto-run tests)</option>
                  <option value="theory">Theory / Written Response (MarkPoints)</option>
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="table">Trace / Completion Table</option>
                  <option value="inspect">Code Inspection / Line numbered</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isProcessing
                  ? "Processing with Gemini..."
                  : mode === "generate_similar"
                  ? "Generate Similar Question"
                  : "Convert & Verify Question"}
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* WORKFLOW 4: DIRECT JSON / FILE IMPORT */}
        {/* ======================================================== */}
        {mode === "json_import" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-purple-50/70 border border-purple-200 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-700" />
                  Direct JSON Question Importer
                </h4>
                <p className="text-[11px] text-purple-700 mt-0.5">
                  Upload a <code>.json</code> file or paste a JSON question object / array directly.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleJson}
                  className="px-3 py-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-white border border-purple-200 hover:border-purple-300 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Load Sample JSON Template
                </button>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg shadow-xs transition-colors cursor-pointer">
                  <FileCode className="w-3.5 h-3.5 text-amber-700" />
                  <span>Upload .py Starter Files</span>
                  <input
                    type="file"
                    multiple
                    accept=".py,.txt"
                    onChange={handlePythonFilesImportAsTasks}
                    className="hidden"
                  />
                </label>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .json File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleJsonFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {jsonError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{jsonError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Paste Question JSON:</label>
                {jsonInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setJsonInput("");
                      setJsonParsedTasks(null);
                      setJsonError(null);
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  if (e.target.value.trim()) {
                    handleParseJson(e.target.value);
                  } else {
                    setJsonParsedTasks(null);
                    setJsonError(null);
                  }
                }}
                placeholder='[\n  {\n    "id": "q_perimeter",\n    "title": "Calculate Perimeter",\n    "unit": "U01",\n    "type": "code",\n    "marks": 3,\n    "question": "Write a program...",\n    "starter": "length = int(input())\\n",\n    "cases": [{ "in": ["5", "3"], "out": "16", "m": 1 }]\n  }\n]'
                rows={8}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                {jsonParsedTasks
                  ? `✓ Valid JSON: ${jsonParsedTasks.length} question(s) ready to import.`
                  : "Paste valid question JSON or click 'Load Sample JSON Template'."}
              </span>
              <button
                type="button"
                onClick={handleSaveJsonQuestions}
                disabled={!jsonParsedTasks || jsonParsedTasks.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Import {jsonParsedTasks ? jsonParsedTasks.length : 0} Question(s) to Bank
              </button>
            </div>

            {jsonParsedTasks && jsonParsedTasks.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h5 className="text-xs font-bold text-slate-700">Preview Parsed Questions:</h5>
                <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1">
                  {jsonParsedTasks.map((t, idx) => (
                    <div
                      key={t.id || idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-purple-100 text-purple-800">
                          {t.unit}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">{t.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-500">{t.marks} Marks</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 font-semibold text-slate-600 uppercase">
                          {t.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* BATCH REVIEW & MARK SCHEME VERIFICATION SCREEN */}
      {/* ======================================================== */}
      {extractedPaper && (
        <div className="bg-white border-2 border-purple-300 rounded-2xl p-6 space-y-5 animate-in fade-in-50 duration-200 shadow-sm">
          {/* Header & Metric Chips */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                  {extractedPaper.examBoard} {extractedPaper.year}
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {extractedPaper.paperTitle}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Mark Scheme Verification Stage: Review, refine criteria, or adjust marks before committing to the school question bank.
              </p>
            </div>

            {/* Overall Metrics */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 bg-purple-50 rounded-xl border border-purple-200 text-center">
                <span className="text-[10px] font-semibold text-purple-600 block uppercase">Questions</span>
                <span className="text-sm font-bold text-purple-900">{extractedPaper.totalQuestions}</span>
              </div>
              <div className="px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <span className="text-[10px] font-semibold text-blue-600 block uppercase">Sub-Parts</span>
                <span className="text-sm font-bold text-blue-900">{extractedPaper.totalSubParts}</span>
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] font-semibold text-emerald-600 block uppercase">Mark Points</span>
                <span className="text-sm font-bold text-emerald-900">{extractedPaper.totalMarkPoints}</span>
              </div>
              <div className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <span className="text-[10px] font-semibold text-amber-600 block uppercase">Total Marks</span>
                <span className="text-sm font-bold text-amber-900">{extractedPaper.totalMarks}m</span>
              </div>
            </div>
          </div>

          {/* Batch Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ListChecks className="w-4 h-4" />
                {approvedQuestionIds.size === extractedPaper.questions.length
                  ? "Deselect All"
                  : "Select All Questions"}
              </button>
              <span className="text-xs text-slate-500">
                ({approvedQuestionIds.size} of {extractedPaper.questions.length} selected)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveExtractedQuestions(true)}
                disabled={approvedQuestionIds.size === 0 || isProcessing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Selected ({approvedQuestionIds.size}) to Bank
              </button>
              <button
                type="button"
                onClick={() => handleSaveExtractedQuestions(false)}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Approve & Save All ({extractedPaper.questions.length}) to Bank
              </button>
            </div>
          </div>

          {/* Extracted Questions Verification List */}
          <div className="space-y-3">
            {extractedPaper.questions.map((task, qIdx) => {
              const isApproved = approvedQuestionIds.has(task.id);
              const isExpanded = expandedQuestionId === task.id;
              const hasMarkPoints = Array.isArray(task.markPoints) && task.markPoints.length > 0;
              const hasTests = Array.isArray(task.tests) && task.tests.length > 0;

              return (
                <div
                  key={task.id || qIdx}
                  className={`border rounded-xl transition-all ${
                    isApproved
                      ? "border-purple-200 bg-white"
                      : "border-slate-200 bg-slate-50/50 opacity-70"
                  }`}
                >
                  {/* Summary Bar */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isApproved}
                        onChange={() => toggleQuestionApproval(task.id)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 mt-1 sm:mt-0 cursor-pointer"
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {task.title}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                            {task.unit}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                            {task.type.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            {task.marks} Marks
                          </span>
                          {task.type === "code" && (
                            task.starterFileName ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <FileCode className="w-3 h-3 text-amber-700" />
                                {task.starterFileName}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] text-slate-500 bg-slate-100 font-mono">
                                No .py starter
                              </span>
                            )
                          )}
                          {task.parts && task.parts.length > 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                              {task.parts.length} Sub-parts
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-1">
                          {task.brief}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewTask(previewTask?.id === task.id ? null : task)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {previewTask?.id === task.id ? "Hide Preview" : "Preview"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedQuestionId(isExpanded ? null : task.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-xs font-semibold text-purple-700 transition-colors cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Mark Scheme ({task.markPoints?.length || 0} pts)</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Interactive Question Card Preview */}
                  {previewTask?.id === task.id && (
                    <div className="p-4 bg-slate-50 border-t border-purple-100">
                      <div className="mb-2 text-xs font-bold text-slate-700">
                        Interactive Candidate Practice Preview:
                      </div>
                      <QuestionCard
                        task={task}
                        mode="practice"
                        studentAnswer={task.starter || ""}
                        onAnswerChange={() => {}}
                      />
                    </div>
                  )}

                  {/* Expanded Mark Scheme Verification Drawer */}
                  {isExpanded && (
                    <div className="p-4 bg-purple-50/30 border-t border-purple-100 space-y-4">
                      {/* Mark Points Table */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-purple-600" />
                            <span>Granular Mark Points (Verified Criteria):</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddMarkPoint(qIdx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-100 hover:bg-purple-200 text-[11px] font-bold text-purple-800 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            Add Mark Point
                          </button>
                        </div>

                        {hasMarkPoints ? (
                          <div className="space-y-2">
                            {task.markPoints!.map((mp, mpIdx) => (
                              <div
                                key={mp.id || mpIdx}
                                className="p-2.5 bg-white rounded-lg border border-purple-200/80 flex items-start gap-3"
                              >
                                <span className="px-2 py-1 rounded bg-purple-100 text-purple-900 font-mono font-bold text-xs shrink-0 mt-0.5">
                                  {mp.id || `MP${mpIdx + 1}`}
                                </span>
                                <div className="flex-1 space-y-1">
                                  <textarea
                                    value={mp.criterion}
                                    onChange={(e) =>
                                      handleUpdateMarkPoint(qIdx, mpIdx, "criterion", e.target.value)
                                    }
                                    rows={1}
                                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white font-sans"
                                  />
                                  {mp.acceptedAnswers && mp.acceptedAnswers.length > 0 && (
                                    <div className="text-[10px] text-emerald-700">
                                      <strong>Acceptable terms:</strong> {mp.acceptedAnswers.join(", ")}
                                    </div>
                                  )}
                                  {mp.negativeIndicators && mp.negativeIndicators.length > 0 && (
                                    <div className="text-[10px] text-red-600">
                                      <strong>Do NOT accept:</strong> {mp.negativeIndicators.join(", ")}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={mp.marks}
                                    onChange={(e) =>
                                      handleUpdateMarkPoint(qIdx, mpIdx, "marks", e.target.value)
                                    }
                                    className="w-12 px-1.5 py-1 text-xs border border-slate-200 rounded text-center font-bold"
                                  />
                                  <span className="text-xs font-semibold text-slate-500">marks</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-white rounded-lg border border-dashed border-purple-200 text-xs text-slate-500">
                            No granular mark points defined yet. Uses overall mark scheme rubric.
                          </div>
                        )}
                      </div>

                      {/* Candidate Python Starter Scaffold (if Code question) */}
                      {task.type === "code" && (
                        <div className="space-y-2 pt-2 border-t border-purple-100">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <FileCode className="w-4 h-4 text-amber-600" />
                              <span>Candidate Python Starter Scaffold:</span>
                              {task.starterFileName && (
                                <span className="text-[11px] font-mono font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                  {task.starterFileName}
                                </span>
                              )}
                            </label>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* Quick selector from batch uploaded starterFiles if available */}
                              {starterFiles.length > 0 && (
                                <select
                                  value={task.starterFileName || ""}
                                  onChange={(e) => {
                                    const selected = starterFiles.find((sf) => sf.name === e.target.value);
                                    if (selected) {
                                      handleUpdateQuestionStarter(qIdx, selected.code, selected.name);
                                    } else if (e.target.value === "") {
                                      handleUpdateQuestionStarter(qIdx, task.starter || "", "");
                                    }
                                  }}
                                  className="px-2 py-1 text-[11px] font-mono bg-white border border-amber-300 text-amber-900 rounded-lg"
                                >
                                  <option value="">-- Link uploaded starter --</option>
                                  {starterFiles.map((sf) => (
                                    <option key={sf.name} value={sf.name}>
                                      {sf.name} ({sf.lineCount} lines)
                                    </option>
                                  ))}
                                </select>
                              )}

                              {/* Upload specific .py file for this question */}
                              <label className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                                <Upload className="w-3 h-3 text-amber-600" />
                                <span>Attach .py</span>
                                <input
                                  type="file"
                                  accept=".py,.txt"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleLoadPyFileForQuestion(qIdx, f);
                                    e.target.value = "";
                                  }}
                                  className="hidden"
                                />
                              </label>

                              {task.starter && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setViewingStarterFile({
                                      name: task.starterFileName || `${task.title}.py`,
                                      code: task.starter || "",
                                      size: `${(new Blob([task.starter || ""]).size / 1024).toFixed(1)} KB`,
                                      lineCount: (task.starter || "").split("\n").length,
                                    })
                                  }
                                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Inspect</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <textarea
                            value={task.starter || ""}
                            onChange={(e) => handleUpdateQuestionStarter(qIdx, e.target.value)}
                            placeholder="# Candidate starter scaffold / function template..."
                            rows={4}
                            className="w-full px-3 py-2 text-xs border border-amber-200 rounded-xl bg-amber-50/20 focus:bg-white focus:ring-2 focus:ring-amber-500 font-mono"
                          />
                        </div>
                      )}

                      {/* Automated Code Tests if Code question */}
                      {task.type === "code" && hasTests && (
                        <div className="space-y-2 pt-2 border-t border-purple-100">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-purple-600" />
                            <span>Automated Code Test Suite ({task.tests!.length} test runs):</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                            {task.tests!.map((t, tIdx) => (
                              <div key={tIdx} className="p-2 bg-white rounded-lg border border-slate-200">
                                <div className="font-bold text-purple-700">
                                  Test Case {tIdx + 1} ({t.m} marks)
                                </div>
                                <div className="text-slate-600 truncate">
                                  Inputs: {JSON.stringify(t.in)}
                                </div>
                                <div className="text-emerald-700 truncate">
                                  Expected Output: {JSON.stringify(t.out)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-parts if detected */}
                      {task.parts && task.parts.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-purple-100">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span>Sub-parts Detected ({task.parts.length}):</span>
                          </label>
                          <div className="space-y-1.5">
                            {task.parts.map((sp, spIdx) => (
                              <div key={sp.id || spIdx} className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-purple-700">{sp.label}</span>
                                  <span className="text-slate-700 truncate max-w-md">{sp.question}</span>
                                </div>
                                <span className="font-bold text-slate-600 shrink-0">{sp.marks} Marks</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Single Task Draft Preview (for convert or generate_similar) */}
      {draftTask && !extractedPaper && (
        <div className="bg-slate-50 border-2 border-purple-300 rounded-2xl p-6 space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-200 text-purple-900">
                  {draftTask.unit}: {draftTask.unitName || draftTask.unit}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {draftTask.marks} Marks • {draftTask.level} • Type: {draftTask.type}
                </span>
              </div>
              {conversionNote && (
                <p className="text-xs text-purple-900 font-medium mt-1">{conversionNote}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveSingleTask}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save to School Question Bank
            </button>
          </div>

          <QuestionCard
            task={draftTask}
            mode="practice"
            studentAnswer={draftTask.starter || ""}
            onAnswerChange={() => {}}
          />
        </div>
      )}

      {/* Python Starter File Code Inspection Modal */}
      {viewingStarterFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50"
          onClick={() => setViewingStarterFile(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs font-mono">
                  .py
                </div>
                <div>
                  <h4 className="text-sm font-mono font-bold text-slate-100">{viewingStarterFile.name}</h4>
                  <p className="text-[11px] text-slate-400 font-sans">
                    {viewingStarterFile.lineCount} lines • {viewingStarterFile.size} • Python 3 Scaffold
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const success = await copyToClipboard(viewingStarterFile.code);
                    if (success) {
                      setSuccessMsg(`Copied ${viewingStarterFile.name} code to clipboard!`);
                      setTimeout(() => setSuccessMsg(null), 3000);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingStarterFile(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 bg-slate-950 text-slate-100 overflow-y-auto font-mono text-xs leading-relaxed flex-1">
              <pre className="whitespace-pre overflow-x-auto">
                {viewingStarterFile.code.split("\n").map((line, lIdx) => (
                  <div key={lIdx} className="table-row">
                    <span className="table-cell select-none text-right pr-4 text-slate-600 text-[11px] w-8">
                      {lIdx + 1}
                    </span>
                    <span className="table-cell text-slate-200">{line || " "}</span>
                  </div>
                ))}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
              <span>Candidate will see this authentic starter scaffold preloaded in the code editor.</span>
              <button
                type="button"
                onClick={() => setViewingStarterFile(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
