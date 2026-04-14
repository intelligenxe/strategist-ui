"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkflowsList, useRunsList } from "@/hooks/useWorkflows";
import WorkflowCard from "@/components/WorkflowCard";
import RunHistory from "@/components/RunHistory";

export default function WorkflowsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const { workflows, loading: workflowsLoading, error: workflowsError } = useWorkflowsList();
  const { runs, loading: runsLoading, refetch: refetchRuns, deleteRun, deleteError: runsDeleteError } = useRunsList();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Workflows</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Available Workflows</h2>

          {workflowsError && (
            <div className="rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-700">{workflowsError}</p>
            </div>
          )}

          {workflowsLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-32 bg-gray-200 rounded-lg" />
              <div className="h-32 bg-gray-200 rounded-lg" />
            </div>
          ) : workflows.length === 0 ? (
            <p className="text-sm text-gray-400">No workflows available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {workflows.map((workflow) => (
                <WorkflowCard key={workflow.name} workflow={workflow} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <RunHistory
            runs={runs}
            loading={runsLoading}
            onRefresh={refetchRuns}
            onDelete={deleteRun}
            deleteError={runsDeleteError}
          />
        </div>
      </div>
    </div>
  );
}
