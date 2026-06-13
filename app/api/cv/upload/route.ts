import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require("pdf-parse");
import mammoth from "mammoth";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in request." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let extractedText = "";

    const filename = file.name.toLowerCase();

    if (filename.endsWith(".pdf") || file.type === "application/pdf") {
      const parsedPdf = await pdf(buffer);
      extractedText = parsedPdf.text || "";
    } else if (
      filename.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else if (filename.endsWith(".txt") || file.type === "text/plain") {
      extractedText = buffer.toString("utf-8");
    } else if (filename.endsWith(".doc")) {
      // Best-effort ASCII string extraction for legacy .doc binary files
      const asciiRegex = /[\x20-\x7E\s]{4,}/g;
      const textMatches = buffer.toString("ascii").match(asciiRegex) || [];
      extractedText = textMatches
        .map(t => t.trim())
        .filter(t => t.length > 3)
        .join("\n");
      
      if (!extractedText.trim() || extractedText.length < 50) {
        return NextResponse.json(
          { error: "Failed to extract readable text from legacy DOC format. Please convert to PDF or DOCX." },
          { status: 422 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload PDF, DOC, DOCX, or TXT." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, text: extractedText });
  } catch (error) {
    console.error("File parsing error:", error);
    const message = error instanceof Error ? error.message : "Unknown parsing error";
    return NextResponse.json(
      { error: `Parsing failed: ${message}` },
      { status: 500 }
    );
  }
}
