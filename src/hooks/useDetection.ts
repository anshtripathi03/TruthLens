"use client";

import { useState, useCallback } from "react";
import { detectionService } from "@/services/api";
import { useDetectionStore } from "@/store";
import type { DetectionResult } from "@/lib/types";
import { AxiosError } from "axios";

// ─── useDetectAuto ─────────────────────────────────────────────────────────────
export function useDetectAuto() {
  const { setResult, setLoading, setError, reset } = useDetectionStore();
  const result = useDetectionStore((s) => s.result);
  const loading = useDetectionStore((s) => s.loading);
  const error = useDetectionStore((s) => s.error);

  const detect = useCallback(
    async (file: File): Promise<DetectionResult | null> => {
      reset();
      setLoading(true);
      try {
        const data = await detectionService.detectAuto(file);
        setResult(data);
        return data;
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? err.response?.data?.detail?.[0]?.msg ||
              err.message ||
              "Detection failed"
            : "An unexpected error occurred";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [reset, setLoading, setResult, setError]
  );

  return { detect, result, loading, error };
}

// ─── useDetectImage ────────────────────────────────────────────────────────────
export function useDetectImage() {
  const { setResult, setLoading, setError, reset } = useDetectionStore();
  const result = useDetectionStore((s) => s.result);
  const loading = useDetectionStore((s) => s.loading);
  const error = useDetectionStore((s) => s.error);

  const detect = useCallback(
    async (file: File): Promise<DetectionResult | null> => {
      reset();
      setLoading(true);
      try {
        const data = await detectionService.detectImage(file);
        setResult(data);
        return data;
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? err.response?.data?.detail?.[0]?.msg || err.message
            : "Image detection failed";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [reset, setLoading, setResult, setError]
  );

  return { detect, result, loading, error };
}

// ─── useDetectVideo ────────────────────────────────────────────────────────────
export function useDetectVideo() {
  const { setResult, setLoading, setError, reset } = useDetectionStore();
  const result = useDetectionStore((s) => s.result);
  const loading = useDetectionStore((s) => s.loading);
  const error = useDetectionStore((s) => s.error);

  const detect = useCallback(
    async (file: File): Promise<DetectionResult | null> => {
      reset();
      setLoading(true);
      try {
        const data = await detectionService.detectVideo(file);
        setResult(data);
        return data;
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? err.response?.data?.detail?.[0]?.msg || err.message
            : "Video detection failed";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [reset, setLoading, setResult, setError]
  );

  return { detect, result, loading, error };
}

// ─── useDetectAudio ────────────────────────────────────────────────────────────
export function useDetectAudio() {
  const { setResult, setLoading, setError, reset } = useDetectionStore();
  const result = useDetectionStore((s) => s.result);
  const loading = useDetectionStore((s) => s.loading);
  const error = useDetectionStore((s) => s.error);

  const detect = useCallback(
    async (file: File): Promise<DetectionResult | null> => {
      reset();
      setLoading(true);
      try {
        const data = await detectionService.detectAudio(file);
        setResult(data);
        return data;
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? err.response?.data?.detail?.[0]?.msg || err.message
            : "Audio detection failed";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [reset, setLoading, setResult, setError]
  );

  return { detect, result, loading, error };
}

// ─── useDetectBatch ────────────────────────────────────────────────────────────
export function useDetectBatch() {
  const { setBatchResult, setLoading, setError } = useDetectionStore();
  const batchResult = useDetectionStore((s) => s.batchResult);
  const loading = useDetectionStore((s) => s.loading);
  const error = useDetectionStore((s) => s.error);

  const detect = useCallback(
    async (files: File[]) => {
      setBatchResult(null);
      setLoading(true);
      setError(null);
      try {
        const data = await detectionService.detectBatch(files);
        setBatchResult(data);
        return data;
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? err.response?.data?.detail?.[0]?.msg || err.message
            : "Batch detection failed";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setBatchResult, setLoading, setError]
  );

  return { detect, batchResult, loading, error };
}

// ─── Upload progress helper (used across hook consumers) ──────────────────────
export function useUploadProgress() {
  const [progress, setProgress] = useState(0);
  const resetProgress = useCallback(() => setProgress(0), []);
  return { progress, setProgress, resetProgress };
}
