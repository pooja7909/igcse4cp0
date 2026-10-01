export type QuestionType = "code" | "mcq" | "table" | "inspect" | "sort" | "theory";
export type QuestionDifficulty = "Easy" | "Moderate" | "Hard";
export type QuestionLevel = "Easy" | "Moderate" | "Hard" | "Starter" | "Core" | "Exam-style" | "Fix the error" | "Sort by hand" | "Trace table" | "Extension";

export function getTaskDifficulty(task: { difficulty?: QuestionDifficulty; level?: string; marks?: number }): QuestionDifficulty {
  if (task.difficulty) return task.difficulty;
  const lvl = (task.level || "").toLowerCase();
  if (lvl === "easy" || lvl === "starter" || lvl === "sort by hand") return "Easy";
  if (lvl === "hard" || lvl === "exam-style") return "Hard";
  if (lvl === "moderate" || lvl === "core" || lvl === "fix the error" || lvl === "trace table") return "Moderate";
  const m = task.marks || 0;
  if (m <= 3) return "Easy";
  if (m <= 6) return "Moderate";
  return "Hard";
}

export interface CodeTestCase {
  in: string[];
  out: string;
  m: number;
}

export interface MCQQuestion {
  q: string;
  options: string[];
  a: number; // 0-based index of correct option
}

export interface TableColumn {
  label: string;
  type?: "text" | "select";
  options?: string[];
}

export interface TableCell {
  v: string; // expected value or preset value
  g?: boolean; // true = given/preset, false = student answers
}

export interface InspectQuestion {
  q: string;
  a: string[]; // accepted string variants
  why?: string;
}

export interface TheoryQuestion {
  q: string;
  keywords: string[];
  maxMarks: number;
  criteria: string[];
}

export interface MarkPoint {
  id: string; // e.g. "MP1", "MP2"
  marks: number;
  criterion?: string;
  description?: string;
  exemplarCode?: string;
  acceptedAnswers?: string[];
  alternativeAnswers?: string[];
  negativeIndicators?: string[];
}

export interface QuestionPart {
  id: string;
  label: string; // e.g. "1(a)", "1(b)", "4(c)"
  question: string;
  marks: number;
  type: QuestionType;
  starter?: string;
  starterFileName?: string; // original python file name, e.g. "Q01.py"
  solution?: string;
  tests?: CodeTestCase[];
  markPoints?: MarkPoint[];
  markScheme?: string;
  options?: string[]; // For MCQ sub-parts
  correctOption?: number;
}

export interface IGCSETask {
  id: string;
  unit: string; // e.g. "U01", "U02", ..., "U99"
  unitName?: string;
  title: string;
  level: QuestionLevel;
  difficulty?: QuestionDifficulty;
  type: QuestionType;
  brief: string;
  marks: number;
  image?: string; // base64 or URL for question diagram/photo
  hint?: string;
  note?: string;
  code?: string; // code snippet to display/inspect
  starter?: string; // starter python code
  starterFileName?: string; // original python file name, e.g. "Q01.py"
  solution?: string; // reference solution
  tests?: CodeTestCase[]; // for code questions
  questions?: (MCQQuestion | InspectQuestion | TheoryQuestion)[];
  columns?: TableColumn[]; // for table/trace questions
  rows?: TableCell[][] | string[][]; // for table/trace or sort questions
  algo?: "bubble" | "merge"; // for sort tasks
  data?: (number | string)[]; // for sort tasks
  desc?: boolean; // for sort tasks
  labels?: string[]; // for sort tasks
  markScheme?: string; // Teacher mark scheme criteria and notes
  markPoints?: MarkPoint[]; // Detailed individual marking points
  parts?: QuestionPart[]; // Sub-parts e.g. 1(a), 1(b)
  source?: {
    examBoard: string;
    qualification: string;
    paper?: string;
    session?: string;
    year?: number;
    questionPaperFile?: string;
    markSchemeFile?: string;
  };
  authorId?: string; // ID of teacher who authored question
  authorName?: string; // Name of teacher who authored question
  authorSchool?: string; // School of teacher who authored question
  custom?: boolean;
  paperTitle?: string;
  examBoard?: string;
  paper?: string;
  year?: number;
  session?: string;
  generationMode?: string;
  isSimilar?: boolean;
  parentTaskId?: string;
  specReference?: string;
  commandWord?: string;
  variationMode?: string;
  modelUsed?: string;
  createdAt?: number;
}

export interface TeacherProfile {
  id: string;
  email: string;
  name: string;
  school: string;
  department: string;
  role?: "teacher" | "head_of_dept" | "examiner";
  avatarColor?: string;
  createdAt?: number;
}

export interface IGCSEUnit {
  code: string;
  title: string;
  spec?: string;
  blurb?: string;
  topicGroup?: string; // e.g. "Topic 1: Problem solving", "Topic 2: Programming", "Topic 3: Data", etc.
  paper?: "Paper 1" | "Paper 2" | "Both";
  tasks: IGCSETask[];
}

import { GradeBoundaries } from "./utils/gradeBoundaries";

export interface ResultReleaseSettings {
  resultsReleased: boolean; // Master toggle
  shareTotalScore: boolean; // Show overall score, percentage, and 9-1 grade
  shareQuestionMarks: boolean; // Show per-question marks breakdown
  shareMarkScheme: boolean; // Show official mark scheme criteria & guidance (where they went wrong)
  shareSubmissionsAndAnswers: boolean; // Show candidate answers/code vs corrections/test cases
  shareTeacherFeedback: boolean; // Show teacher personal comments & examiner diagnostic
  shareReflectionSheet: boolean; // Show student reflection sheet & targeted revision focus
  releasedAt?: number;
  releasedStudentIds?: string[]; // Empty/undefined = all students, or array of specific candidate IDs
}

export interface Assessment {
  id: string;
  title: string;
  code: string; // 6-digit PIN for quick student join
  type?: "task" | "assessment"; // "task" = Practice/Classwork task with hints enabled; "assessment" = Formal timed exam paper
  customHeaderBanner?: string; // Custom institution/school header displayed to students
  customSubtitle?: string; // Custom subtitle e.g. "Year 10 Computing • Room 204"
  customInstructions?: string; // Custom student instructions displayed at top of exam
  durationMinutes: number; // 0 = untimed
  showScoreImmediately: boolean;
  allowCopyPaste?: boolean; // Teacher setting: whether students can copy/paste code or text
  showOperatorToolbar?: boolean; // Teacher setting: whether to show IDLE relational/arithmetic/logical strip (hidden in formal assessments)
  shareSolutions?: boolean; // Teacher setting: whether students are allowed to view solutions/mark scheme
  releaseSettings?: ResultReleaseSettings;
  questionIds: string[];
  questions?: IGCSETask[]; // Full task objects preserved with assessment
  maxMarks: number;
  gradeBoundaries?: GradeBoundaries;
  createdAt: number;
  status: "active" | "archived";
  authorId?: string;
  authorName?: string;
  authorSchool?: string;
  students?: Record<string, StudentSession>;
}

export interface ReflectionSheetQuestionOverride {
  conceptFailed?: string; // e.g. "Could not answer: Selection using if/else conditions"
  teacherAdvice?: string; // e.g. "Focus on checking comparison operator >="
}

export interface ReflectionSheetData {
  overallSummary?: string;
  masteredNotes?: string;
  developingNotes?: string;
  focusAreasNotes?: string;
  questionNotes?: Record<string, ReflectionSheetQuestionOverride>;
  reflectionStrengths?: string;
  reflectionMisconceptions?: string;
  reflectionActionPlan?: string;
  recommendedUnits?: string[];
  updatedAt?: number;
}

export interface StudentSession {
  studentId: string;
  name: string;
  candidateNumber?: string;
  className?: string;
  status: "joined" | "in_progress" | "submitted";
  currentQuestionIndex: number;
  answeredQuestions: string[];
  answers: Record<string, any>;
  marks: Record<string, number>;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  joinedAt: number;
  lastActiveAt: number;
  submittedAt?: number;
  resultsReleased?: boolean;
  releaseSettings?: ResultReleaseSettings;
  feedback?: string;
  questionFeedback?: Record<string, string>;
  reflectionSheet?: ReflectionSheetData;
  aiDiagnostic?: {
    overallSummary: string;
    focusTopics: string[];
    questionBreakdowns: {
      questionId: string;
      marksAwarded: number;
      maxMarks: number;
      studentError: string;
      specTopic: string;
      revisionAction: string;
    }[];
  };
}

export interface LiveAssessmentStats {
  totalJoined: number;
  inProgressCount: number;
  submittedCount: number;
  avgScore: number;
  avgPercentage: number;
  maxMarks: number;
}

export interface QuestionAnalyticsItem {
  totalAwarded: number;
  attempts: number;
  averageMarks: number;
}

export interface MarkPointBreakdown {
  markPointId: string;
  awarded: number;
  maxMarks?: number;
  criterion: string;
  reason: string;
}

export interface MarkResult {
  m: number;
  M: number;
  passed: boolean;
  detail?: any;
  feedback?: string;
  breakdown?: MarkPointBreakdown[] | string[];
}

export interface ExtractedPaper {
  paperTitle: string;
  examBoard: string;
  qualification: string;
  paper?: string;
  session?: string;
  year?: number;
  totalQuestions: number;
  totalSubParts: number;
  totalMarkPoints: number;
  totalMarks: number;
  questions: IGCSETask[];
}

export interface AiPracticeScaffold {
  concept: string;
  level1Clue: string;
  level2LogicSteps: string[];
  level3Structure: string;
  whatWentWrong?: string;
  howToImprove?: string;
  immediateNextStep: string;
}
