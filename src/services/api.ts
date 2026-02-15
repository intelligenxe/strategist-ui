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
