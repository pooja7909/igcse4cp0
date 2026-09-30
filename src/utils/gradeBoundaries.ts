export interface GradeBoundaries {
  9: number; // minimum % for Grade 9 (e.g. 85)
  8: number; // minimum % for Grade 8 (e.g. 76)
  7: number; // minimum % for Grade 7 (e.g. 68)
  6: number; // minimum % for Grade 6 (e.g. 60)
  5: number; // minimum % for Grade 5 (e.g. 52)
  4: number; // minimum % for Grade 4 (e.g. 44)
  3: number; // minimum % for Grade 3 (e.g. 35)
  2: number; // minimum % for Grade 2 (e.g. 25)
  1: number; // minimum % for Grade 1 (e.g. 15)
}

export type GradeTier = "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1" | "U";

export interface GradeBoundaryPreset {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  boundaries: GradeBoundaries;
}

export const EDEXCEL_STANDARD_BOUNDARIES: GradeBoundaries = {
  9: 85,
  8: 76,
  7: 68,
  6: 60,
  5: 52,
  4: 44,
  3: 35,
  2: 25,
  1: 15,
};

export const DEFAULT_GRADE_BOUNDARIES: GradeBoundaries = EDEXCEL_STANDARD_BOUNDARIES;

export const GRADE_BOUNDARY_PRESETS: GradeBoundaryPreset[] = [
  {
    id: "standard",
    name: "Pearson Edexcel Standard (4CP0)",
    shortLabel: "Edexcel Standard",
    description: "Official baseline standard for Pearson Edexcel International GCSE (9-1) Computer Science.",
    boundaries: { ...EDEXCEL_STANDARD_BOUNDARIES },
  },
  {
    id: "summer_2024",
    name: "Summer 2024 Exam Series",
    shortLabel: "June 2024 Series",
    description: "Empirical boundaries adjusted for June 2024 Paper 1 & Paper 2 grade awarding benchmarks.",
    boundaries: {
      9: 81,
      8: 72,
      7: 64,
      6: 56,
      5: 48,
      4: 40,
      3: 31,
      2: 22,
      1: 14,
    },
  },
  {
    id: "summer_2023",
    name: "Summer 2023 Exam Series",
    shortLabel: "June 2023 Series",
    description: "Boundaries reflecting post-pandemic standard normalization in the 2023 awarding series.",
    boundaries: {
      9: 83,
      8: 74,
      7: 66,
      6: 58,
      5: 50,
      4: 42,
      3: 33,
      2: 24,
      1: 15,
    },
  },
  {
    id: "strict_mock",
    name: "Strict / High Target Mock",
    shortLabel: "High Mock",
    description: "Challenging thresholds (+5%) designed for internal mock exams to stretch higher-tier candidates.",
    boundaries: {
      9: 90,
      8: 80,
      7: 72,
      6: 65,
      5: 58,
      4: 50,
      3: 40,
      2: 30,
      1: 20,
    },
  },
  {
    id: "lenient_diagnostic",
    name: "Foundation / Diagnostic",
    shortLabel: "Diagnostic",
    description: "Accessible boundaries suitable for formative assessments, baseline testing, and Year 10 starts.",
    boundaries: {
      9: 75,
      8: 65,
      7: 55,
      6: 48,
      5: 40,
      4: 32,
      3: 24,
      2: 16,
      1: 10,
    },
  },
];

export interface GradeAward {
  grade: GradeTier;
  color: string;
  badgeBg: string;
  textClass: string;
  label: string;
  minPct: number;
  minMarks?: number;
}

/**
 * Returns grade info according to provided or standard Edexcel boundaries.
 */
export const getEdexcelGrade = (
  pct: number,
  customBoundaries?: Partial<GradeBoundaries> | null,
  maxMarks?: number
): GradeAward => {
  const b: GradeBoundaries = {
    ...EDEXCEL_STANDARD_BOUNDARIES,
    ...(customBoundaries || {}),
  };

  const getMarks = (thresholdPct: number) => {
    if (!maxMarks || maxMarks <= 0) return undefined;
    return Math.ceil((thresholdPct / 100) * maxMarks);
  };

  if (pct >= b[9]) {
    return {
      grade: "9",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      badgeBg: "bg-emerald-500",
      textClass: "text-emerald-700",
      label: "Grade 9 (Exceptional Standard)",
      minPct: b[9],
      minMarks: getMarks(b[9]),
    };
  }
  if (pct >= b[8]) {
    return {
      grade: "8",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeBg: "bg-emerald-400",
      textClass: "text-emerald-600",
      label: "Grade 8 (High Distinction / A*)",
      minPct: b[8],
      minMarks: getMarks(b[8]),
    };
  }
  if (pct >= b[7]) {
    return {
      grade: "7",
      color: "bg-teal-50 text-teal-700 border-teal-200",
      badgeBg: "bg-teal-500",
      textClass: "text-teal-700",
      label: "Grade 7 (Distinction / A)",
      minPct: b[7],
      minMarks: getMarks(b[7]),
    };
  }
  if (pct >= b[6]) {
    return {
      grade: "6",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      badgeBg: "bg-blue-500",
      textClass: "text-blue-700",
      label: "Grade 6 (High Merit / B)",
      minPct: b[6],
      minMarks: getMarks(b[6]),
    };
  }
  if (pct >= b[5]) {
    return {
      grade: "5",
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
      badgeBg: "bg-cyan-500",
      textClass: "text-cyan-700",
      label: "Grade 5 (Strong Pass / High C)",
      minPct: b[5],
      minMarks: getMarks(b[5]),
    };
  }
  if (pct >= b[4]) {
    return {
      grade: "4",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      badgeBg: "bg-amber-500",
      textClass: "text-amber-700",
      label: "Grade 4 (Standard Pass / C)",
      minPct: b[4],
      minMarks: getMarks(b[4]),
    };
  }
  if (pct >= b[3]) {
    return {
      grade: "3",
      color: "bg-orange-50 text-orange-700 border-orange-200",
      badgeBg: "bg-orange-500",
      textClass: "text-orange-700",
      label: "Grade 3 (Foundation Standard / D)",
      minPct: b[3],
      minMarks: getMarks(b[3]),
    };
  }
  if (pct >= b[2]) {
    return {
      grade: "2",
      color: "bg-orange-100 text-orange-800 border-orange-300",
      badgeBg: "bg-orange-400",
      textClass: "text-orange-800",
      label: "Grade 2 (Foundation / E)",
      minPct: b[2],
      minMarks: getMarks(b[2]),
    };
  }
  if (pct >= b[1]) {
    return {
      grade: "1",
      color: "bg-red-50 text-red-700 border-red-200",
      badgeBg: "bg-red-500",
      textClass: "text-red-700",
      label: "Grade 1 (Minimum Pass / F-G)",
      minPct: b[1],
      minMarks: getMarks(b[1]),
    };
  }

  return {
    grade: "U",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    badgeBg: "bg-slate-400",
    textClass: "text-slate-600",
    label: "Unclassified (Below Grade 1)",
    minPct: 0,
    minMarks: 0,
  };
};

/**
 * Validates that grade boundaries are monotonically decreasing:
 * 100 >= 9 > 8 > 7 > 6 > 5 > 4 > 3 > 2 > 1 >= 0
 */
export const validateGradeBoundaries = (
  b: GradeBoundaries
): { valid: boolean; error?: string } => {
  const grades: (keyof GradeBoundaries)[] = [9, 8, 7, 6, 5, 4, 3, 2, 1];

  for (let i = 0; i < grades.length; i++) {
    const g = grades[i];
    const val = Number(b[g]);

    if (isNaN(val) || val < 0 || val > 100) {
      return { valid: false, error: `Grade ${g} boundary must be a percentage between 0 and 100.` };
    }

    if (i > 0) {
      const prevGrade = grades[i - 1];
      const prevVal = Number(b[prevGrade]);
      if (val >= prevVal) {
        return {
          valid: false,
          error: `Grade ${prevGrade} boundary (${prevVal}%) must be strictly higher than Grade ${g} boundary (${val}%).`,
        };
      }
    }
  }

  return { valid: true };
};

/**
 * Checks whether the given boundaries differ from official standard
 */
export const isCustomBoundaries = (boundaries?: GradeBoundaries | null): boolean => {
  if (!boundaries) return false;
  return (
    boundaries[9] !== EDEXCEL_STANDARD_BOUNDARIES[9] ||
    boundaries[8] !== EDEXCEL_STANDARD_BOUNDARIES[8] ||
    boundaries[7] !== EDEXCEL_STANDARD_BOUNDARIES[7] ||
    boundaries[6] !== EDEXCEL_STANDARD_BOUNDARIES[6] ||
    boundaries[5] !== EDEXCEL_STANDARD_BOUNDARIES[5] ||
    boundaries[4] !== EDEXCEL_STANDARD_BOUNDARIES[4] ||
    boundaries[3] !== EDEXCEL_STANDARD_BOUNDARIES[3] ||
    boundaries[2] !== EDEXCEL_STANDARD_BOUNDARIES[2] ||
    boundaries[1] !== EDEXCEL_STANDARD_BOUNDARIES[1]
  );
};

/**
 * Formats a boundary interval string (e.g. "85%+" or "76-84%")
 */
export const formatBoundaryRange = (
  grade: GradeTier,
  boundaries: GradeBoundaries,
  maxMarks?: number
): string => {
  const b = boundaries;
  const numGrade = Number(grade);
  const min = grade === "U" ? 0 : (b[numGrade as keyof GradeBoundaries] ?? 0);

  if (grade === "9") {
    if (maxMarks && maxMarks > 0) {
      const minM = Math.ceil((min / 100) * maxMarks);
      return `${min}%+ (${minM}/${maxMarks} marks)`;
    }
    return `${min}%+`;
  }

  if (grade === "U") {
    const g1 = b[1];
    if (maxMarks && maxMarks > 0) {
      const maxM = Math.max(0, Math.ceil((g1 / 100) * maxMarks) - 1);
      return `<${g1}% (0–${maxM} marks)`;
    }
    return `<${g1}%`;
  }

  const nextHigherGrade = (numGrade + 1) as keyof GradeBoundaries;
  const max = b[nextHigherGrade] - 1;

  if (maxMarks && maxMarks > 0) {
    const minM = Math.ceil((min / 100) * maxMarks);
    const maxM = Math.max(minM, Math.ceil((b[nextHigherGrade] / 100) * maxMarks) - 1);
    return `${min}%–${max}% (${minM}–${maxM} marks)`;
  }

  return `${min}%–${max}%`;
};
