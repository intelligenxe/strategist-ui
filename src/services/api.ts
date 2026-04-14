import { AuthUser, UploadResponse, QueryResponse, StatsResponse, IngestUrlsResponse, DeleteDocumentResponse, WorkflowSummary, WorkflowTool, RunStart, RunSummary, RunDetail } from "@/types";

async function authFetch(url: string, options: RequestInit, token: string): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Token ${token}`,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("auth");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return res;
}

// Auth (no token needed)

export async function loginUser(username: string, password: string): Promise<AuthUser> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.non_field_errors?.[0] || data?.error || "Login failed");
  }

  return res.json();
}

export async function registerUser(
  username: string,
  password: string,
  email: string
): Promise<AuthUser> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const msg =
      data?.username?.[0] || data?.email?.[0] || data?.password?.[0] || data?.error || "Registration failed";
    throw new Error(msg);
  }

  return res.json();
}

// RAG operations (all require token)

export async function uploadDocument(
  file: File,
  extractionMethod: string,
  token: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("document", file, file.name);
  formData.append("extraction_method", extractionMethod);

  const res = await authFetch("/api/rag/upload", { method: "POST", body: formData }, token);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Upload failed");
  }

  return res.json();
}

export async function queryKnowledgeBase(
  question: string,
  topK: number,
  token: string
): Promise<QueryResponse> {
  const res = await authFetch(
    "/api/rag/query",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, top_k: topK }),
    },
    token
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Query failed");
  }

  return res.json();
}

export async function getStats(token: string): Promise<StatsResponse> {
  const res = await authFetch("/api/rag/stats", {}, token);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to fetch stats");
  }

  return res.json();
}

export async function deleteDocument(filename: string, token: string): Promise<void> {
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    await deleteDocumentByBody(filename, token);
    return;
  }

  const res = await authFetch(
    `/api/rag/documents/${encodeURIComponent(filename)}`,
    { method: "DELETE" },
    token
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to delete document");
  }
}

export async function deleteDocumentByBody(
  filename: string,
  token: string
): Promise<DeleteDocumentResponse> {
  const res = await authFetch(
    "/api/rag/documents/delete",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    },
    token
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to delete document");
  }

  return res.json();
}

export async function ingestUrls(
  urls: string[],
  sourceType: string,
  token: string
): Promise<IngestUrlsResponse> {
  const res = await authFetch(
    "/api/rag/ingest-urls",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls, source_type: sourceType }),
    },
    token
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || data?.detail || data?.message || "URL ingestion failed");
  }

  return res.json();
}

export async function clearKnowledgeBase(token: string): Promise<void> {
  const res = await authFetch(
    "/api/rag/clear",
    { method: "DELETE" },
    token
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to clear knowledge base");
  }
}

// Workflow operations (all require token; async contract)

export async function listWorkflows(token: string): Promise<{ workflows: WorkflowSummary[] }> {
  const res = await authFetch("/api/workflows", {}, token);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to fetch workflows");
  }

  return res.json();
}

export async function listWorkflowTools(token: string): Promise<{ tools: WorkflowTool[] }> {
  const res = await authFetch("/api/workflows/tools", {}, token);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to fetch tools");
  }

  return res.json();
}

export async function startRun(
  workflow: string,
  inputs: Record<string, unknown>,
  token: string
): Promise<RunStart> {
  const res = await authFetch(
    "/api/workflows/run",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow, inputs }),
    },
    token
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to start workflow");
  }

  return res.json();
}

export async function listRuns(token: string): Promise<{ runs: RunSummary[] }> {
  const res = await authFetch("/api/workflows/runs", {}, token);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to fetch workflow runs");
  }

  return res.json();
}

export async function getRunDetail(id: number, token: string): Promise<RunDetail> {
  const res = await authFetch(`/api/workflows/runs/${id}`, {}, token);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to fetch run details");
  }

  return res.json();
}

export async function deleteRun(id: number, token: string): Promise<void> {
  const res = await authFetch(
    `/api/workflows/runs/${id}`,
    { method: "DELETE" },
    token
  );
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to delete run");
  }
}
