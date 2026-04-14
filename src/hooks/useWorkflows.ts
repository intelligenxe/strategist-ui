"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WorkflowSummary, RunSummary, RunDetail } from "@/types";
import { listWorkflows, listRuns, getRunDetail, deleteRun as deleteRunApi } from "@/services/api";

const POLL_INTERVAL_MS = 4000;
const POLL_MAX_COUNT = 150;

export function useWorkflowsList() {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listWorkflows(user.token);
      setWorkflows(data.workflows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load workflows");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { workflows, loading, error, refetch };
}

export function useRunsList() {
  const { user } = useAuth();
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listRuns(user.token);
      setRuns(data.runs);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load runs");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteRun = useCallback(
    async (id: number) => {
      if (!user) return;
      setDeleteError(null);
      try {
        await deleteRunApi(id, user.token);
        setRuns((prev) => prev.filter((r) => r.run_id !== id));
      } catch (err: unknown) {
        setDeleteError(err instanceof Error ? err.message : "Failed to delete run");
      }
    },
    [user]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { runs, loading, error, refetch, deleteRun, deleteError };
}

export function useRunStatus(runId: number | null) {
  const { user } = useAuth();
  const [data, setData] = useState<RunDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingTimeout, setPollingTimeout] = useState(false);

  const pollCountRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!user || runId === null) return;

    let cancelled = false;

    async function fetchOnce() {
      if (!user || runId === null) return;
      try {
        const detail = await getRunDetail(runId, user.token);
        if (cancelled || !isMountedRef.current) return;
        setData(detail);
        setError(null);

        if (detail.status !== "running") {
          stopPolling();
          return;
        }

        if (intervalRef.current === null) {
          setIsPolling(true);
          pollCountRef.current = 0;
          intervalRef.current = setInterval(async () => {
            pollCountRef.current += 1;
            if (pollCountRef.current >= POLL_MAX_COUNT) {
              stopPolling();
              setPollingTimeout(true);
              return;
            }
            try {
              const next = await getRunDetail(runId, user.token);
              if (!isMountedRef.current) return;
              setData(next);
              if (next.status !== "running") {
                stopPolling();
              }
            } catch (err: unknown) {
              if (!isMountedRef.current) return;
              setError(err instanceof Error ? err.message : "Polling failed");
            }
          }, POLL_INTERVAL_MS);
        }
      } catch (err: unknown) {
        if (cancelled || !isMountedRef.current) return;
        setError(err instanceof Error ? err.message : "Failed to load run");
        stopPolling();
      }
    }

    fetchOnce();

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [user, runId, stopPolling]);

  return { data, error, isPolling, pollingTimeout };
}
