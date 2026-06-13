import { NextRequest, NextResponse } from "next/server";
import { getResume, saveResume, isDbConfigured } from "../../../lib/db";

/**
 * GET /api/cv
 * - If called with ?status=1, checks database environment state.
 * - If called with ?id=<syncId>, retrieves the saved resume.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkStatus = searchParams.get("status");
  const id = searchParams.get("id");

  // Status diagnostics check
  if (checkStatus) {
    return NextResponse.json({
      dbConfigured: isDbConfigured(),
    });
  }

  if (!id) {
    return NextResponse.json(
      { error: "Missing required query parameter: id" },
      { status: 400 }
    );
  }

  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Database not configured. Cloud sync is unavailable." },
      { status: 503 }
    );
  }

  const result = await getResume(id);
  if (result.success) {
    return NextResponse.json({ data: result.data });
  } else {
    return NextResponse.json(
      { error: result.error || "Failed to retrieve resume." },
      { status: result.error?.includes("not found") ? 404 : 500 }
    );
  }
}

/**
 * POST /api/cv
 * - Saves or updates CV data under a unique sync ID.
 */
export async function POST(request: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Database not configured. Cloud sync is unavailable." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { syncId, fullName, jobTitle, cvData } = body;

    if (!syncId || !fullName || !cvData) {
      return NextResponse.json(
        { error: "Missing required parameters: syncId, fullName, cvData" },
        { status: 400 }
      );
    }

    const result = await saveResume(syncId, fullName, jobTitle || "", cvData);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to save resume draft." },
        { status: 500 }
      );
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to parse request body.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
