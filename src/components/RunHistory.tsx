"use client";

import Link from "next/link";
import { RunSummary } from "@/types";

interface RunHistoryProps {
  runs: RunSummary[];
  loading: boolean;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  deleteError?: string | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function prettyName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function rowLabel(run: RunSummary): string {
  const ticker = run.inputs?.ticker;
  if (typeof ticker === "string" && ticker.trim()) return ticker.toUpperCase();
  return prettyName(run.workflow);
}

function statusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "failed":
      return "bg-red-100 text-red-700";
    case "running":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function RunHistory({ runs, loading, onRefresh, onDelete, deleteError }: RunHistoryProps) {
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this run?")) {
      onDelete(id);
    }
  };

  return (
    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Recent Runs</h2>
        <button
          type="button"
          onClick={onRefresh}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {deleteError && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200 mb-3">
          <p className="text-sm text-red-700">{deleteError}</p>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      ) : runs.length === 0 ? (
        <p className="text-sm text-gray-400">No workflow runs yet.</p>
      ) : (
        <ul className="space-y-2 max-h-[500px] overflow-y-auto">
          {runs.map((run) => (
            <li key={run.run_id} className="relative">
              <Link
                href={`/workflows/runs/${run.run_id}`}
                className="block rounded bg-white px-3 py-2.5 pr-16 border border-gray-100 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {rowLabel(run)}
                  </span>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(run.status)}`}
                  >
                    {run.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatDate(run.created_at)}</p>
              </Link>
              <button
                type="button"
                onClick={(e) => handleDelete(e, run.run_id)}
                className="absolute bottom-2 right-3 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                aria-label="Delete run"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
