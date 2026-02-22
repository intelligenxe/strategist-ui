import { StrategistResponse, ApiOption } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchOptions(): Promise<ApiOption[]> {
  const res = await fetch(`${API_BASE_URL}/options`);
  if (!res.ok) throw new Error("Failed to fetch options");
  return res.json();
}

export async function submitStrategistRequest(
  file: File | null,
  prompt: string,
  option: string,
  parameterValue: string
): Promise<StrategistResponse> {
  const formData = new FormData();
  if (file) formData.append("file", file);
  formData.append("prompt", prompt);
  formData.append("option", option);
  formData.append("parameter_value", parameterValue);

  const res = await fetch(`${API_BASE_URL}/strategist`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

const ANALYZE_URL = "https://intelligenxe.org/api/chk/analyze/";

export async function submitAnalyzeRequest(
  file: File
): Promise<StrategistResponse> {
  const formData = new FormData();
  formData.append("document", file, file.name);

  const res = await fetch(ANALYZE_URL, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Analysis request failed");

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const json = await res.json();
    // Map to StrategistResponse shape — try common field names
    const content =
      json.content ?? json.result ?? json.data ?? JSON.stringify(json, null, 2);
    return { content };
  }

  const text = await res.text();
  return { content: text };
}
