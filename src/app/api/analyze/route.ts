import { NextRequest, NextResponse } from "next/server";

const ANALYZE_URL = "https://intelligenxe.org/api/chk/analyze/";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const res = await fetch(ANALYZE_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json(
      { error: errorText || "Analysis request failed" },
      { status: res.status }
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const json = await res.json();
    return NextResponse.json(json);
  }

  const text = await res.text();
  return new NextResponse(text, {
    headers: { "Content-Type": "text/plain" },
  });
}
