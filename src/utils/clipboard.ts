/**
 * Robust, safe clipboard copy utility.
 * In iframe environments or unfocused documents, `navigator.clipboard.writeText`
 * often throws "Document is not focused" or "Write permission denied".
 * This helper gracefully catches errors and falls back to a temporary textarea with `document.execCommand('copy')`.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Attempt 1: Modern navigator.clipboard API if available and document is focused
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Intentionally fall through to textarea fallback (e.g. Document is not focused, permission denied)
    }
  }

  // Attempt 2: Classic document.execCommand fallback using an off-screen textarea
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Prevent scrolling or viewport jumps
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.style.opacity = "0";
    textArea.setAttribute("readonly", "");
    textArea.setAttribute("aria-hidden", "true");
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.warn("Unable to copy text to clipboard:", err);
    return false;
  }
}
