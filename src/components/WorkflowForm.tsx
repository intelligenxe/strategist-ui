"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Switch } from "@headlessui/react";
import { useAuth } from "@/contexts/AuthContext";
import { WorkflowSummary } from "@/types";
import { startRun } from "@/services/api";
import SubmitButton from "./SubmitButton";

const ARRAY_FIELDS = new Set(["focus_areas"]);

const WORKFLOW_SCHEMAS: Record<string, { required: string[]; optional: string[] }> = {
  swot: {
    required: ["company_name", "ticker", "industry"],
    optional: ["focus_areas"],
  },
  five_forces: {
    required: ["company_name", "ticker", "industry"],
    optional: ["focus_areas"],
  },
};

const RAG_ENABLED_WORKFLOWS = new Set(["swot", "five_forces"]);

interface WorkflowFormProps {
  workflow: WorkflowSummary;
}

interface StoredFormState {
  inputs: Record<string, string>;
  useRag: boolean;
}

function humanize(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function storageKey(name: string): string {
  return `workflow-form:${name}`;
}

function loadStoredState(name: string): StoredFormState {
  if (typeof window === "undefined") return { inputs: {}, useRag: false };
  try {
    const raw = window.sessionStorage.getItem(storageKey(name));
    if (!raw) return { inputs: {}, useRag: false };
    const parsed = JSON.parse(raw) as Partial<StoredFormState>;
    return {
      inputs: parsed.inputs ?? {},
      useRag: Boolean(parsed.useRag),
    };
  } catch {
    return { inputs: {}, useRag: false };
  }
}

export default function WorkflowForm({ workflow }: WorkflowFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const initial = loadStoredState(workflow.name);
  const [inputs, setInputs] = useState<Record<string, string>>(initial.inputs);
  const [useRag, setUseRag] = useState<boolean>(initial.useRag);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload: StoredFormState = { inputs, useRag };
    window.sessionStorage.setItem(storageKey(workflow.name), JSON.stringify(payload));
  }, [inputs, useRag, workflow.name]);

  function handleInputChange(key: string, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  const fallback = WORKFLOW_SCHEMAS[workflow.name];
  const requiredInputs =
    workflow.required_inputs?.length ? workflow.required_inputs : fallback?.required ?? [];
  const optionalInputs =
    workflow.optional_inputs?.length ? workflow.optional_inputs : fallback?.optional ?? [];

  const supportsRag = RAG_ENABLED_WORKFLOWS.has(workflow.name);

  async function handleSubmit() {
    if (!user) return;

    for (const key of requiredInputs) {
      if (!inputs[key]?.trim()) {
        setError(`Please fill in the required field: ${humanize(key)}`);
        return;
      }
    }

    const processed: Record<string, unknown> = {};
    const allKeys = [...requiredInputs, ...optionalInputs];
    for (const key of allKeys) {
      const value = inputs[key]?.trim();
      if (!value) continue;
      if (ARRAY_FIELDS.has(key)) {
        processed[key] = value.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        processed[key] = value;
      }
    }

    if (supportsRag) {
      processed.use_rag = useRag;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await startRun(workflow.name, processed, user.token);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(storageKey(workflow.name));
      }
      router.push(`/workflows/runs/${result.run_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start workflow");
      setSubmitting(false);
    }
  }

  function renderField(key: string, required: boolean) {
    const isArray = ARRAY_FIELDS.has(key);
    const placeholder = isArray
      ? `Comma-separated, e.g., item 1, item 2`
      : `Enter ${humanize(key).toLowerCase()}`;

    return (
      <div key={key}>
        <label
          htmlFor={`field-${key}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {humanize(key)}
          {required && <span className="text-red-500 ml-1">*</span>}
          {isArray && <span className="ml-2 text-xs text-gray-400">(comma-separated)</span>}
        </label>
        <input
          id={`field-${key}`}
          type="text"
          value={inputs[key] || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
          disabled={submitting}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requiredInputs.map((key) => renderField(key, true))}
      {optionalInputs.map((key) => renderField(key, false))}

      {supportsRag && (
        <div className="flex items-center gap-3 pt-1">
          <Switch
            checked={useRag}
            onChange={setUseRag}
            aria-label="Use my knowledge base"
            className={`${
              useRag ? "bg-blue-600" : "bg-gray-300"
            } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span
              aria-hidden="true"
              className={`${
                useRag ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform`}
            />
          </Switch>
          {useRag ? (
            <Link
              href={`/rag?return=${workflow.name}`}
              className="inline-flex items-center justify-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Tailored Strategy (optional)
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center justify-center rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
            >
              Tailored Strategy (optional)
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="pt-2">
        <SubmitButton
          onClick={handleSubmit}
          loading={submitting}
          label="Run Workflow"
          loadingLabel="Starting..."
        />
      </div>
    </div>
  );
}
