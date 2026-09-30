import { IGCSETask, IGCSEUnit } from "../types";

export type EdexcelPaper = "Paper 1" | "Paper 2";

export type Paper2QuestionStyle =
  | "all"
  | "q1_q2_bug_fix"
  | "q3_validation"
  | "q4_file_records"
  | "q5_subprograms"
  | "q6_20_marker"
  | "past_paper";

export interface QuestionStyleMeta {
  id: Paper2QuestionStyle;
  label: string;
  shortLabel: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const PAPER_2_STYLES: Record<Paper2QuestionStyle, QuestionStyleMeta> = {
  all: {
    id: "all",
    label: "All Question Styles",
    shortLabel: "All Styles",
    badge: "All Papers & Units",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200",
    description: "Browse all authentic Edexcel Paper 2 programming questions and past papers.",
  },
  q1_q2_bug_fix: {
    id: "q1_q2_bug_fix",
    label: "Q1 / Q2 Style: Syntax Correction & Bug Fixing",
    shortLabel: "Q1/Q2 Bug Fixes",
    badge: "Q1/Q2 Code Fix",
    color: "text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Starter code provided with deliberate syntax, logic, or runtime errors to diagnose and correct.",
  },
  q3_validation: {
    id: "q3_validation",
    label: "Q3 Style: Validation Routines & Test Tables",
    shortLabel: "Q3 Validation",
    badge: "Q3 Validation & Trace",
    color: "text-blue-800",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Input validation (range, presence, type checks), truth tables, and boundary/erroneous test cases.",
  },
  q4_file_records: {
    id: "q4_file_records",
    label: "Q4 Style: File Handling & Record Processing",
    shortLabel: "Q4 File I/O",
    badge: "Q4 File & Records",
    color: "text-teal-800",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    description: "Reading, parsing, and writing CSV or text files, record aggregation, and formatted reporting.",
  },
  q5_subprograms: {
    id: "q5_subprograms",
    label: "Q5 Style: Subprograms, Functions & Algorithms",
    shortLabel: "Q5 Subprograms",
    badge: "Q5 Functions & Logic",
    color: "text-purple-800",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Writing modular subprograms (functions and procedures) with formal parameters, return values, and searches.",
  },
  q6_20_marker: {
    id: "q6_20_marker",
    label: "Q6 Style: 20-Marker Extended Scenario Problem",
    shortLabel: "Q6 20-Marker",
    badge: "Q6 20-Marker Scenario",
    color: "text-rose-800",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    description: "Comprehensive multi-part problem solving with subprograms, state management, and real-world system rules.",
  },
  past_paper: {
    id: "past_paper",
    label: "Official Past Examination Papers",
    shortLabel: "Past Papers",
    badge: "Authentic Past Paper",
    color: "text-indigo-800",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    description: "Complete authentic Pearson Edexcel (4CP0) Paper 2 question sets from 2025, 2024, and SAM series.",
  },
};

/**
 * Determines whether a unit belongs to Paper 1 or Paper 2.
 */
export function getUnitPaper(unit: IGCSEUnit): EdexcelPaper {
  if (unit.paper === "Paper 1") return "Paper 1";
  if (unit.paper === "Paper 2") return "Paper 2";

  const p1Codes = ["U14", "U15", "U16", "U17", "U18", "U19", "U23", "U24", "U25", "U26", "U27", "U28", "U29", "U30", "U31", "U32"];
  if (p1Codes.includes(unit.code)) return "Paper 1";
  return "Paper 2";
}

/**
 * Detects the specific Edexcel Paper 2 style of a task.
 */
export function getPaper2TaskStyle(task: IGCSETask): Paper2QuestionStyle {
  const brief = (task.brief || "").toLowerCase();
  const title = (task.title || "").toLowerCase();
  const starter = (task.starter || "").toLowerCase();
  const unit = task.unit || "";

  // 1. Past Papers
  if (
    task.year ||
    task.session ||
    task.paperTitle ||
    unit.includes("2025") ||
    unit.includes("SAM") ||
    unit.includes("2024") ||
    unit.includes("Past") ||
    title.includes("june 20") ||
    title.includes("question 1") ||
    title.includes("question 2") ||
    title.includes("question 3") ||
    title.includes("question 4") ||
    title.includes("question 5") ||
    title.includes("question 6")
  ) {
    if (task.marks >= 15 || title.includes("question 6")) {
      return "q6_20_marker";
    }
    if (brief.includes("file") || brief.includes("csv") || title.includes("question 4")) {
      return "q4_file_records";
    }
    if (brief.includes("valid") || task.type === "table" || title.includes("question 3")) {
      return "q3_validation";
    }
    if (starter.includes("fix") || brief.includes("correct") || brief.includes("error") || title.includes("question 1") || title.includes("question 2")) {
      return "q1_q2_bug_fix";
    }
    return "past_paper";
  }

  // 2. 20-Marker Scenarios
  if (task.marks >= 15 || unit === "U20M" || brief.includes("20-mark") || brief.includes("scenario") || title.includes("scenario") || title.includes("capstone")) {
    return "q6_20_marker";
  }

  // 3. File & Records Processing
  if (
    unit === "U11" ||
    unit === "U08" ||
    brief.includes("file") ||
    brief.includes(".csv") ||
    brief.includes(".txt") ||
    brief.includes("read from a file") ||
    brief.includes("write to a file") ||
    starter.includes("open(") ||
    brief.includes("record")
  ) {
    return "q4_file_records";
  }

  // 4. Validation & Test Tables
  if (
    task.type === "table" ||
    unit === "U10" ||
    brief.includes("valid") ||
    brief.includes("presence check") ||
    brief.includes("range check") ||
    brief.includes("length check") ||
    brief.includes("truth table") ||
    brief.includes("trace table") ||
    brief.includes("test table") ||
    brief.includes("boundary")
  ) {
    return "q3_validation";
  }

  // 5. Bug Fixing & Starter Code Refactoring
  if (
    starter.includes("fixme") ||
    starter.includes("# fix") ||
    starter.includes("# error") ||
    starter.includes("# bug") ||
    brief.includes("correct the code") ||
    brief.includes("find the error") ||
    brief.includes("refactor") ||
    brief.includes("fix the syntax") ||
    title.includes("fix") ||
    title.includes("debug") ||
    task.type === "inspect"
  ) {
    return "q1_q2_bug_fix";
  }

  // 6. Subprograms & Functions
  if (
    unit === "U09" ||
    brief.includes("function") ||
    brief.includes("procedure") ||
    brief.includes("subprogram") ||
    brief.includes("parameter") ||
    brief.includes("return") ||
    starter.includes("def ")
  ) {
    return "q5_subprograms";
  }

  // Fallback to starter/core practice
  return "q1_q2_bug_fix";
}
