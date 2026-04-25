"use client";

import Link from "next/link";
import { WorkflowSummary } from "@/types";
import { workflowDisplayName } from "@/lib/workflows";

interface WorkflowCardProps {
  workflow: WorkflowSummary;
}

export default function WorkflowCard({ workflow }: WorkflowCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 transition-colors">
      <h3 className="text-base font-semibold text-gray-900 mb-2">
        {workflowDisplayName(workflow.name)}
      </h3>
      <p className="text-sm text-gray-600 flex-1 mb-4">{workflow.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {(workflow.required_inputs?.length ?? 0)} required
          {(workflow.optional_inputs?.length ?? 0) > 0 && `, ${workflow.optional_inputs!.length} optional`}
        </span>
        <Link
          href={`/workflows/${encodeURIComponent(workflow.name)}`}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Run
        </Link>
      </div>
    </div>
  );
}
