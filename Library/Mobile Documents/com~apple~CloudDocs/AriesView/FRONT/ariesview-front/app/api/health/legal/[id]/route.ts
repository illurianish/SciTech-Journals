import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await req.formData();

    const jsonStr = form.get("json");
    if (!jsonStr || typeof jsonStr !== "string") {
      return NextResponse.json(
        { error: "Missing json payload" },
        { status: 400 }
      );
    }

    const data = JSON.parse(jsonStr);

    const documents = form.getAll("documents");
    // TODO: Save `data` to your DB
    // TODO: Upload `documents` (File[]) to S3, GCP, etc.

    return NextResponse.json({
      success: true,
      saved: { ...data, files: documents.length },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // TODO: Fetch from DB with params.id
  return NextResponse.json({ ok: true, message: "Fetch legal hub data here" });
}
