"use client";

import { useCallback } from "react";
import { provenanceService } from "@/services/api";
import { useProvenanceStore } from "@/store";
import type { ProvenanceReport } from "@/lib/types";
import { AxiosError } from "axios";

export function useProvenance() {
  const { setReport, setLoading, setError, reset } = useProvenanceStore();
  const report = useProvenanceStore((s) => s.report);
  const loading = useProvenanceStore((s) => s.loading);
  const error = useProvenanceStore((s) => s.error);

  const analyze = useCallback(
    async (file: File): Promise<ProvenanceReport | null> => {
      reset();
      setLoading(true);
      try {
        const data = await provenanceService.analyzeProvenance(file);
        setReport(data);
        return data;
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? err.response?.data?.detail?.[0]?.msg || err.message
            : "Provenance analysis failed";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [reset, setLoading, setReport, setError]
  );

  return { analyze, report, loading, error };
}
