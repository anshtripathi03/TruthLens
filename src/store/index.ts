import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  DetectionResult,
  BatchResult,
  ProvenanceReport,
  PaginatedHistory,
  AnalysisRecord,
  AnalysisStats,
  HealthResponse,
} from "@/lib/types";

// ─── Detection Store ──────────────────────────────────────────────────────────
interface DetectionState {
  result: DetectionResult | null;
  batchResult: BatchResult | null;
  loading: boolean;
  error: string | null;
  setResult: (result: DetectionResult | null) => void;
  setBatchResult: (result: BatchResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useDetectionStore = create<DetectionState>()(
  devtools(
    (set) => ({
      result: null,
      batchResult: null,
      loading: false,
      error: null,
      setResult: (result) => set({ result }),
      setBatchResult: (batchResult) => set({ batchResult }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      reset: () =>
        set({ result: null, batchResult: null, loading: false, error: null }),
    }),
    { name: "DetectionStore" }
  )
);

// ─── Provenance Store ─────────────────────────────────────────────────────────
interface ProvenanceState {
  report: ProvenanceReport | null;
  loading: boolean;
  error: string | null;
  setReport: (report: ProvenanceReport | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProvenanceStore = create<ProvenanceState>()(
  devtools(
    (set) => ({
      report: null,
      loading: false,
      error: null,
      setReport: (report) => set({ report }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      reset: () => set({ report: null, loading: false, error: null }),
    }),
    { name: "ProvenanceStore" }
  )
);

// ─── History Store ────────────────────────────────────────────────────────────
interface HistoryState {
  history: PaginatedHistory | null;
  stats: AnalysisStats | null;
  selectedRecord: AnalysisRecord | null;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  setHistory: (history: PaginatedHistory | null) => void;
  setStats: (stats: AnalysisStats | null) => void;
  setSelectedRecord: (record: AnalysisRecord | null) => void;
  removeRecord: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setStatsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  devtools(
    (set, get) => ({
      history: null,
      stats: null,
      selectedRecord: null,
      loading: false,
      statsLoading: false,
      error: null,
      setHistory: (history) => set({ history }),
      setStats: (stats) => set({ stats }),
      setSelectedRecord: (selectedRecord) => set({ selectedRecord }),
      removeRecord: (id) => {
        const h = get().history;
        if (!h) return;
        set({
          history: {
            ...h,
            total: h.total - 1,
            results: h.results.filter((r) => r.id !== id),
          },
        });
      },
      setLoading: (loading) => set({ loading }),
      setStatsLoading: (statsLoading) => set({ statsLoading }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          history: null,
          stats: null,
          selectedRecord: null,
          loading: false,
          statsLoading: false,
          error: null,
        }),
    }),
    { name: "HistoryStore" }
  )
);

// ─── Health Store ─────────────────────────────────────────────────────────────
interface HealthState {
  health: HealthResponse | null;
  loading: boolean;
  error: string | null;
  setHealth: (health: HealthResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useHealthStore = create<HealthState>()(
  devtools(
    (set) => ({
      health: null,
      loading: false,
      error: null,
      setHealth: (health) => set({ health }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: "HealthStore" }
  )
);
