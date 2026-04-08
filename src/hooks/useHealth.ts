"use client";

import { useCallback } from "react";
import { healthService } from "@/services/api";
import { useHealthStore } from "@/store";
import { AxiosError } from "axios";

export function useHealth() {
  const { setHealth, setLoading, setError } = useHealthStore();
  const health = useHealthStore((s) => s.health);
  const loading = useHealthStore((s) => s.loading);
  const error = useHealthStore((s) => s.error);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await healthService.getHealth();
      setHealth(data);
      return data;
    } catch (err) {
      const msg =
        err instanceof AxiosError ? err.message : "Health check failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setHealth]);

  return { health, loading, error, fetchHealth };
}
