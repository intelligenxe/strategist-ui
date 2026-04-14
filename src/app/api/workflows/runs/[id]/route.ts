import { NextRequest, NextResponse } from "next/server";

const WORKFLOWS_API_URL = process.env.WORKFLOWS_API_URL || "https://intelligenxe.org/api/workflows";

export const maxDuration = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const res = await fetch(`${WORKFLOWS_API_URL}/runs/${id}/`, {
    headers: { Authorization: authHeader },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      data || { error: "Failed to fetch run details" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const res = await fetch(`${WORKFLOWS_API_URL}/runs/${id}/`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(
      data || { error: "Failed to delete run" },
      { status: res.status }
    );
  }

  return new NextResponse(null, { status: 204 });
}
