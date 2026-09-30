import { IGCSETask, IGCSEUnit } from "../types";

export interface PastPaperGroup {
  id: string; // e.g. "june_2025", "nov_2023", "june_2024", "june_2023", "year_11", "uploaded"
  seriesLabel: string; // e.g. "June 2025", "November 2023"
  paperTitle: string; // e.g. "Summer 2025 Paper 2 (4CP0/2AW)"
  year: number;
  session: string; // "June", "November", "Practice", "Custom"
  unitCode?: string;
  tasks: IGCSETask[];
}

/**
 * Robustly checks if a task originates from a past examination paper.
 */
export function isPastPaperTask(task: IGCSETask): boolean {
  if (!task) return false;
  if (task.paperTitle || task.examBoard || task.paper) return true;
  if (task.year !== undefined && task.year > 2000) return true;
  if (task.session) return true;
  if (task.source && (task.source.paper || task.source.year || task.source.session)) return true;

  const unit = (task.unit || "").toUpperCase();
  if (
    unit.startsWith("P2") ||
    unit.startsWith("P1") ||
    unit === "P25" ||
    unit === "P26" ||
    unit === "P24" ||
    unit === "P23" ||
    unit === "Y11" ||
    unit.startsWith("PAST") ||
    unit.startsWith("EXAM")
  ) {
    return true;
  }

  const uName = (task.unitName || "").toLowerCase();
  if (
    uName.includes("paper") ||
    uName.includes("past exam") ||
    uName.includes("summer 202") ||
    uName.includes("autumn 202") ||
    uName.includes("november 202") ||
    uName.includes("june 202") ||
    uName.includes("practice assessment – year 11")
  ) {
    return true;
  }

  const id = (task.id || "").toLowerCase();
  if (
    id.startsWith("p25_") ||
    id.startsWith("p26_") ||
    id.startsWith("p24_") ||
    id.startsWith("p23_") ||
    id.startsWith("y11_") ||
    id.startsWith("exam_") ||
    id.startsWith("q_paper_") ||
    id.startsWith("past_") ||
    id.includes("4cp0") ||
    id.includes("2025") ||
    id.includes("2024") ||
    id.includes("2023")
  ) {
    return true;
  }

  return false;
}

/**
 * Returns canonical metadata for a past paper task.
 */
export function getPastPaperInfo(task: IGCSETask): {
  year: number;
  session: string;
  seriesLabel: string;
  paperTitle: string;
  groupId: string;
} {
  const text = `${task.paperTitle || ""} ${task.unitName || ""} ${task.title || ""} ${task.unit || ""} ${task.id || ""}`.toLowerCase();

  // June 2025 Series
  if (text.includes("2025") || task.unit === "P25" || task.unit === "P26" || task.id.startsWith("p25_") || task.id.startsWith("p26_")) {
    const isCompanion = text.includes("companion") || task.unit === "P26" || task.id.startsWith("p26_");
    return {
      year: 2025,
      session: "June",
      seriesLabel: "June 2025",
      paperTitle: isCompanion
        ? "June 2025: Paper 2 Pattern Companion Bank"
        : "June 2025: Paper 2 (4CP0/2AW) Official Exam",
      groupId: isCompanion ? "june_2025_companion" : "june_2025",
    };
  }

  // November 2023 Series
  if (text.includes("nov") || text.includes("november") || text.includes("autumn 2023") || task.unit === "P23" || task.id.startsWith("p23_") || text.includes("2023")) {
    if (text.includes("june") || text.includes("summer")) {
      return {
        year: 2023,
        session: "June",
        seriesLabel: "June 2023",
        paperTitle: "June 2023: Paper 2 (4CP0/2P) Summer Series",
        groupId: "june_2023",
      };
    }
    return {
      year: 2023,
      session: "November",
      seriesLabel: "November 2023",
      paperTitle: "November 2023: Paper 2 (4CP0/2P) Autumn Series",
      groupId: "nov_2023",
    };
  }

  // June 2024 Series
  if (text.includes("2024") || task.unit === "P24" || task.id.startsWith("p24_")) {
    return {
      year: 2024,
      session: "June",
      seriesLabel: "June 2024",
      paperTitle: "June 2024: Paper 2 (4CP0/2AW) Summer Series",
      groupId: "june_2024",
    };
  }

  // Year 11 Official Practice Assessment
  if (text.includes("year 11") || task.unit === "Y11" || task.id.startsWith("y11_")) {
    return {
      year: 2024,
      session: "Practice",
      seriesLabel: "Year 11 Practice",
      paperTitle: "Pearson Edexcel Year 11 Practice Assessment Paper",
      groupId: "year_11_practice",
    };
  }

  // Uploaded or Custom past paper
  const yearMatch = text.match(/\b(20\d\d)\b/);
  const detectedYear = task.year || (yearMatch ? parseInt(yearMatch[1], 10) : 2025);
  const session = text.includes("nov") ? "November" : text.includes("jan") ? "January" : "June";
  const title = task.paperTitle || task.unitName || `Pearson Edexcel Past Paper (${detectedYear})`;

  return {
    year: detectedYear,
    session,
    seriesLabel: `${session} ${detectedYear}`,
    paperTitle: title,
    groupId: `paper_${detectedYear}_${session.toLowerCase()}`,
  };
}

/**
 * Organizes an array of tasks into neat folders grouped by Year & Series.
 */
export function groupPastPapersByYearAndSeries(tasks: IGCSETask[]): PastPaperGroup[] {
  const pastTasks = tasks.filter(isPastPaperTask);
  const map: Record<string, PastPaperGroup> = {};

  for (const t of pastTasks) {
    const info = getPastPaperInfo(t);
    if (!map[info.groupId]) {
      map[info.groupId] = {
        id: info.groupId,
        seriesLabel: info.seriesLabel,
        paperTitle: info.paperTitle,
        year: info.year,
        session: info.session,
        unitCode: t.unit,
        tasks: [],
      };
    }
    map[info.groupId].tasks.push(t);
  }

  // Sort groups descending by year, then June before November
  return Object.values(map).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.session.localeCompare(b.session);
  });
}
