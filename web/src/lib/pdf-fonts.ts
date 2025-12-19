import type { jsPDF } from "jspdf";

let fontLoaded = false;
let fontBase64: string | null = null;

/**
 * Dynamically load and register Noto Sans SC font for jsPDF
 * Font is cached after first load to avoid repeated fetches
 */
export async function registerChineseFont(pdf: jsPDF): Promise<void> {
  if (!fontLoaded) {
    const response = await fetch("/fonts/NotoSansSC-Regular.ttf");
    if (!response.ok) {
      throw new Error("Failed to load Chinese font");
    }
    const arrayBuffer = await response.arrayBuffer();
    fontBase64 = arrayBufferToBase64(arrayBuffer);
    fontLoaded = true;
  }

  if (fontBase64) {
    pdf.addFileToVFS("NotoSansSC-Regular.ttf", fontBase64);
    pdf.addFont("NotoSansSC-Regular.ttf", "NotoSansSC", "normal");
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

export const CHINESE_FONT_NAME = "NotoSansSC";
