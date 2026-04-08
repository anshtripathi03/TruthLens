// ─── Enums ────────────────────────────────────────────────────────────────────
export type MediaType = "video" | "audio" | "image";

// ─── Shared Structures ────────────────────────────────────────────────────────
export interface ArtifactSignature {
  name: string;
  detected: boolean;
  severity: number;
  description: string;
}

export interface FrameResult {
  frame_index: number;
  timestamp_sec: number;
  confidence: number;
  face_detected: boolean;
}

// ─── Detection ────────────────────────────────────────────────────────────────
export interface DetectionResult {
  media_type: MediaType;
  is_fake: boolean;
  confidence: number; // 0–1
  model_fingerprint?: string | null;
  artifact_signatures: ArtifactSignature[];
  frame_analysis?: FrameResult[] | null;
  processing_time_ms: number;
  file_size_mb: number;
  resolution?: string | null;
  metadata_anomalies: string[];
  provenance_score?: number | null;
  recommendation: string;
}

// ─── Batch Detection ──────────────────────────────────────────────────────────
export interface BatchItemResult {
  filename: string;
  success: boolean;
  result?: DetectionResult | null;
  error?: string | null;
}

export interface BatchResult {
  total_files: number;
  processed: number;
  fake_count: number;
  average_confidence: number;
  results: BatchItemResult[];
}

// ─── Provenance ───────────────────────────────────────────────────────────────
export interface ProvenanceReport {
  filename: string;
  media_type: MediaType;
  provenance_score: number; // 0–1
  metadata_anomalies: string[];
  metadata_extracted: Record<string, unknown>;
  risk_level: string;
}

// ─── History ──────────────────────────────────────────────────────────────────
export interface AnalysisRecord {
  id: string;
  timestamp: string; // date-time
  media_type: string;
  filename: string;
  file_hash: string;
  is_fake: boolean;
  confidence: number;
  model_fingerprint?: string | null;
  provenance_score?: number | null;
  processing_time_ms: number;
  recommendation: string;
}

export interface PaginatedHistory {
  total: number;
  page: number;
  page_size: number;
  results: AnalysisRecord[];
}

export interface AnalysisStats {
  total_scans: number;
  fake_count: number;
  real_count: number;
  fake_percentage: number;
  average_confidence: number;
  by_media_type: Record<string, unknown>;
  by_recommendation: Record<string, unknown>;
}

// ─── Health ───────────────────────────────────────────────────────────────────
export interface HealthResponse {
  status: string;
  version: string;
  models_loaded: Record<string, unknown>;
  gpu_available: boolean;
}

// ─── Query Params ─────────────────────────────────────────────────────────────
export interface HistoryParams {
  page?: number;
  page_size?: number;
  media_type?: string | null;
  is_fake?: boolean | null;
}

// ─── API Error ────────────────────────────────────────────────────────────────
export interface APIError {
  detail?: Array<{ loc: (string | number)[]; msg: string; type: string }>;
  message?: string;
}
