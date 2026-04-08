import apiClient from "@/lib/axios";
import type {
  DetectionResult,
  BatchResult,
  ProvenanceReport,
  PaginatedHistory,
  AnalysisRecord,
  AnalysisStats,
  HealthResponse,
  HistoryParams,
} from "@/lib/types";

// ─── Health ───────────────────────────────────────────────────────────────────
export const healthService = {
  getHealth: async (): Promise<HealthResponse> => {
    const { data } = await apiClient.get<HealthResponse>("/health");
    return data;
  },
};

// ─── Detection ────────────────────────────────────────────────────────────────
export const detectionService = {
  /** Auto-detect media type and run deepfake analysis */
  detectAuto: async (file: File): Promise<DetectionResult> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<DetectionResult>("/detect", form);
    return data;
  },

  /** Detect deepfake in an image */
  detectImage: async (file: File): Promise<DetectionResult> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<DetectionResult>(
      "/detect/image",
      form
    );
    return data;
  },

  /** Detect deepfake in a video */
  detectVideo: async (file: File): Promise<DetectionResult> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<DetectionResult>(
      "/detect/video",
      form
    );
    return data;
  },

  /** Detect deepfake in audio */
  detectAudio: async (file: File): Promise<DetectionResult> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<DetectionResult>(
      "/detect/audio",
      form
    );
    return data;
  },

  /** Batch detect – up to 10 mixed-type files */
  detectBatch: async (files: File[]): Promise<BatchResult> => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const { data } = await apiClient.post<BatchResult>("/detect/batch", form);
    return data;
  },
};

// ─── Provenance ───────────────────────────────────────────────────────────────
export const provenanceService = {
  /** Metadata & provenance analysis (no ML inference) */
  analyzeProvenance: async (file: File): Promise<ProvenanceReport> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<ProvenanceReport>(
      "/provenance/analyze",
      form
    );
    return data;
  },
};

// ─── History ──────────────────────────────────────────────────────────────────
export const historyService = {
  /** Paginated history with optional filters */
  getHistory: async (params: HistoryParams = {}): Promise<PaginatedHistory> => {
    const { data } = await apiClient.get<PaginatedHistory>("/history", {
      params,
    });
    return data;
  },

  /** Aggregate stats across all records */
  getStats: async (): Promise<AnalysisStats> => {
    const { data } = await apiClient.get<AnalysisStats>("/history/stats");
    return data;
  },

  /** Single analysis record */
  getRecord: async (recordId: string): Promise<AnalysisRecord> => {
    const { data } = await apiClient.get<AnalysisRecord>(
      `/history/${recordId}`
    );
    return data;
  },

  /** Delete a single analysis record */
  deleteRecord: async (recordId: string): Promise<void> => {
    await apiClient.delete(`/history/${recordId}`);
  },
};
