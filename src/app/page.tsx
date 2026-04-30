"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useWorkflowsList } from "@/hooks/useWorkflows";
import WorkflowCard from "@/components/WorkflowCard";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { workflows, loading: workflowsLoading, error: workflowsError } = useWorkflowsList();

  return (
    <div>
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <img src="/logo.svg" alt="Strategist" className="h-36 w-36 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to Strategist
        </h1>
        <p className="text-sm text-gray-700 max-w-xl">
          Perform corporate strategy analyses on publicly traded companies worldwide using AI-powered frameworks
        </p>
      </div>

      {isAuthenticated && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Available AI-Powered Corporate Strategy Frameworks</h2>

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
      )}
    </div>
  );
}
