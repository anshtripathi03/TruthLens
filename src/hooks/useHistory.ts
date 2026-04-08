"use client";

import { useCallback } from "react";
import { historyService } from "@/services/api";
import { useHistoryStore } from "@/store";
import type { HistoryParams } from "@/lib/types";
import { AxiosError } from "axios";

export function useHistory() {
  const {
    setHistory,
    setLoading,
    setError,
    setSelectedRecord,
    setStats,
    setStatsLoading,
    removeRecord,
  } = useHistoryStore();

  const history = useHistoryStore((s) => s.history);
  const stats = useHistoryStore((s) => s.stats);
  const selectedRecord = useHistoryStore((s) => s.selectedRecord);
  const loading = useHistoryStore((s) => s.loading);
  const statsLoading = useHistoryStore((s) => s.statsLoading);
  const error = useHistoryStore((s) => s.error);

  const fetchHistory = useCallback(
    async (params: HistoryParams = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await historyService.getHistory(params);
        setHistory(data);
        return data;
      } catch (err) {
        const msg =
          err instanceof AxiosError ? err.message : "Failed to load history";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setHistory]
  );

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await historyService.getStats();
      setStats(data);
      return data;
    } catch (err) {
      const msg =
        err instanceof AxiosError ? err.message : "Failed to load stats";
      setError(msg);
      return null;
    } finally {
      setStatsLoading(false);
    }
  }, [setStatsLoading, setStats, setError]);

  const fetchRecord = useCallback(
    async (id: string) => {
      try {
        const data = await historyService.getRecord(id);
        setSelectedRecord(data);
        return data;
      } catch (err) {
        const msg =
          err instanceof AxiosError ? err.message : "Failed to load record";
        setError(msg);
        return null;
      }
    },
    [setSelectedRecord, setError]
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      try {
        await historyService.deleteRecord(id);
        removeRecord(id);
        return true;
      } catch (err) {
        const msg =
          err instanceof AxiosError ? err.message : "Failed to delete record";
        setError(msg);
        return false;
      }
    },
    [removeRecord, setError]
  );

  return {
    history,
    stats,
    selectedRecord,
    loading,
    statsLoading,
    error,
    fetchHistory,
    fetchStats,
    fetchRecord,
    deleteRecord,
  };
}
