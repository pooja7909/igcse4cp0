import QRCode from "qrcode";
import { Assessment } from "../types";

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
  } catch (err) {
    console.error("Failed to generate QR code:", err);
    return "";
  }
}

/**
 * Packs essential assessment configuration into a URL-safe Base64 string.
 * This guarantees that students can join any teacher-created assessment
 * even on stateless serverless hosts like Vercel with zero 404s.
 */
export function packAssessment(a: Assessment): string {
  try {
    const payload = {
      id: a.id,
      code: a.code,
      title: a.title,
      type: a.type || "assessment",
      durationMinutes: a.durationMinutes || 0,
      showScoreImmediately: !!a.showScoreImmediately,
      allowCopyPaste: !!a.allowCopyPaste,
      showOperatorToolbar: !!a.showOperatorToolbar,
      shareSolutions: !!a.shareSolutions,
      questionIds: a.questionIds || [],
      questions: a.questions || [],
      maxMarks: a.maxMarks || 0,
      customHeaderBanner: a.customHeaderBanner,
      customSubtitle: a.customSubtitle,
      customInstructions: a.customInstructions,
    };
    const jsonStr = JSON.stringify(payload);
    if (typeof btoa !== "undefined") {
      return encodeURIComponent(btoa(encodeURIComponent(jsonStr)));
    }
  } catch (e) {
    console.warn("Could not pack assessment for URL:", e);
  }
  return "";
}

/**
 * Unpacks assessment payload from a URL-safe Base64 string.
 */
export function unpackAssessment(packStr: string): Assessment | null {
  try {
    if (!packStr) return null;
    const decodedUri = decodeURIComponent(packStr);
    const jsonStr = decodeURIComponent(atob(decodedUri));
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.code && parsed.title) {
      return parsed as Assessment;
    }
  } catch (e) {
    console.warn("Could not unpack assessment from URL:", e);
  }
  return null;
}

export function getAssessmentStudentUrl(
  assessmentOrCode: Assessment | string,
  type: "task" | "assessment" = "assessment"
): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const code = typeof assessmentOrCode === "string" ? assessmentOrCode : assessmentOrCode.code;

  return `${origin}/?${type}=${encodeURIComponent(code)}`;
}
