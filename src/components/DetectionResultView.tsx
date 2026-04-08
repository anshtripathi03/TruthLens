"use client";

import type { DetectionResult } from "@/lib/types";
import { ConfidenceGauge } from "@/components/ConfidenceBar";
import ConfidenceBar from "@/components/ConfidenceBar";

interface DetectionResultViewProps {
  result: DetectionResult;
  filename?: string;
}

const mediaTypeIcon: Record<string, string> = {
  image: "🖼️",
  video: "🎬",
  audio: "🎙️",
};

export default function DetectionResultView({
  result,
  filename,
}: DetectionResultViewProps) {
  return (
    <div className="w-full space-y-4 fade-in-up">
      {/* Verdict Banner */}
      <div
        className={`glass-card p-6 flex flex-col sm:flex-row items-center gap-6 ${
          result.is_fake
            ? "border-red-500/30 bg-red-500/5"
            : "border-emerald-500/30 bg-emerald-500/5"
        }`}
      >
        {/* Emoji + badge */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="text-5xl">{result.is_fake ? "⚠️" : "✅"}</div>
          <span className={result.is_fake ? "badge-fake" : "badge-real"}>
            {result.is_fake ? "DEEPFAKE" : "AUTHENTIC"}
          </span>
        </div>

        {/* Gauge */}
        <ConfidenceGauge value={result.confidence} isFake={result.is_fake} size={110} />

        {/* Info */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          {filename && (
            <p className="text-xs text-slate-500 font-mono truncate">{filename}</p>
          )}
          <p className="text-slate-300 font-medium leading-snug">
            {result.recommendation}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-slate-500 justify-center sm:justify-start">
            <span>
              {mediaTypeIcon[result.media_type] ?? "📄"}{" "}
              <span className="capitalize">{result.media_type}</span>
            </span>
            <span>⏱ {result.processing_time_ms.toFixed(0)}ms</span>
            <span>📦 {result.file_size_mb.toFixed(2)} MB</span>
            {result.resolution && (
              <span>📐 {result.resolution}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Confidence",
            value: `${(result.confidence * 100).toFixed(1)}%`,
            color: result.is_fake ? "#ef4444" : "#10b981",
          },
          {
            label: "Provenance Score",
            value: result.provenance_score != null
              ? `${(result.provenance_score * 100).toFixed(1)}%`
              : "N/A",
            color: "#8b5cf6",
          },
          {
            label: "Artifacts Found",
            value: result.artifact_signatures.filter((a) => a.detected).length,
            color: "#f59e0b",
          },
          {
            label: "Anomalies",
            value: result.metadata_anomalies.length,
            color: "#06b6d4",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div
              className="text-2xl font-bold tabular-nums"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Artifact Signatures */}
      {result.artifact_signatures.length > 0 && (
        <div className="glass-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300">Artifact Signatures</h3>
          <div className="space-y-3">
            {result.artifact_signatures.map((sig) => (
              <div key={sig.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sig.detected ? "bg-red-400" : "bg-emerald-400"
                      }`}
                    />
                    <span className="text-sm text-slate-300 font-medium">{sig.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{sig.description}</span>
                </div>
                <ConfidenceBar value={sig.severity} size="sm" showPercent={false} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frame Analysis */}
      {result.frame_analysis && result.frame_analysis.length > 0 && (
        <div className="glass-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300">
            Frame Analysis ({result.frame_analysis.length} frames)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-400 border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-white/[0.06]">
                  <th className="pb-2 text-left font-medium">Frame</th>
                  <th className="pb-2 text-left font-medium">Timestamp</th>
                  <th className="pb-2 text-left font-medium">Confidence</th>
                  <th className="pb-2 text-left font-medium">Face</th>
                </tr>
              </thead>
              <tbody>
                {result.frame_analysis.slice(0, 20).map((f) => (
                  <tr key={f.frame_index} className="border-b border-white/[0.04]">
                    <td className="py-1.5 font-mono">#{f.frame_index}</td>
                    <td className="py-1.5 font-mono">{f.timestamp_sec.toFixed(2)}s</td>
                    <td className="py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/[0.06] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${f.confidence * 100}%`,
                              background: f.confidence > 0.7 ? "#ef4444" : "#10b981",
                            }}
                          />
                        </div>
                        <span>{(f.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-1.5">
                      <span className={f.face_detected ? "text-emerald-400" : "text-slate-600"}>
                        {f.face_detected ? "✓" : "✗"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.frame_analysis.length > 20 && (
              <p className="text-xs text-slate-600 mt-2">
                Showing first 20 of {result.frame_analysis.length} frames
              </p>
            )}
          </div>
        </div>
      )}

      {/* Metadata Anomalies */}
      {result.metadata_anomalies.length > 0 && (
        <div className="glass-card p-5 space-y-2">
          <h3 className="text-sm font-semibold text-slate-300">
            Metadata Anomalies
          </h3>
          <ul className="space-y-1">
            {result.metadata_anomalies.map((a, i) => (
              <li key={i} className="text-xs text-amber-400 flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">⚠️</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Model fingerprint */}
      {result.model_fingerprint && (
        <div className="glass-card px-4 py-3 flex items-center gap-3">
          <span className="text-xs text-slate-500">Model fingerprint:</span>
          <code className="text-xs text-violet-400 font-mono break-all">
            {result.model_fingerprint}
          </code>
        </div>
      )}
    </div>
  );
}
