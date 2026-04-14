// Auth
export interface AuthUser {
  token: string;
  user_id: number;
  username: string;
}

// RAG
export interface UploadResponse {
  message: string;
  document?: string;
  chunks?: number;
}

export interface QueryResponse {
  answer: string;
  sources?: Array<{ document: string; chunk: string; score: number }>;
}

export interface StatsResponse {
  total_chunks: number;
  documents: string[];
}

// URL Ingestion
export interface IngestUrlResult {
  url: string;
  status: "ok" | "error";
  error?: string;
}

export interface IngestUrlsResponse {
  total_chunks: number;
  results: IngestUrlResult[];
}

// Body-based document delete
export interface DeleteDocumentResponse {
  deleted: boolean;
  filename: string;
  chunks_remaining: number;
}

// UI
export interface ApiOption {
  id: string;
  label: string;
}

// Workflows
export type WorkflowStatus = "running" | "completed" | "failed";

export interface WorkflowSummary {
  name: string;
  description: string;
  required_inputs: string[];
  optional_inputs: string[];
}

export interface WorkflowTool {
  name: string;
  description: string;
}

export interface RunStart {
  run_id: number;
  workflow: string;
  status: "running";
  created_at: string;
}

export interface RunSummary {
  run_id: number;
  workflow: string;
  status: WorkflowStatus;
  inputs?: Record<string, unknown>;
  created_at: string;
  completed_at: string | null;
}

export interface RunDetail {
  run_id: number;
  workflow: string;
  status: WorkflowStatus;
  inputs: Record<string, unknown>;
  result: Record<string, unknown> | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}
