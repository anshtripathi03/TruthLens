"use client";

import type { BatchResult } from "@/lib/types";
import { ConfidenceGauge } from "@/components/ConfidenceBar";

interface BatchResultViewProps {
  result: BatchResult;
}

export default function BatchResultView({ result }: BatchResultViewProps) {
  const fakeRate = result.total_files > 0
    ? (result.fake_count / result.total_files) * 100
    : 0;

  return (
    <div className="space-y-4 fade-in-up">
      {/* Summary */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-slate-400 mb-4">Batch Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-slate-100">{result.total_files}</div>
            <div className="text-xs text-slate-500 mt-1">Total Files</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400">{result.processed}</div>
            <div className="text-xs text-slate-500 mt-1">Processed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-400">{result.fake_count}</div>
            <div className="text-xs text-slate-500 mt-1">Fakes Detected</div>
          </div>
          <div>
            <ConfidenceGauge value={result.average_confidence} isFake={result.fake_count > 0} size={80} />
          </div>
        </div>

        {/* Fake rate bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">Fake Rate</span>
            <span className="text-red-400 font-bold">{fakeRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{
                width: `${fakeRate}%`,
                background: "linear-gradient(90deg, #f59e0b, #ef4444)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Individual results */}
      <div className="space-y-3">
        {result.results.map((item, idx) => (
          <div
            key={idx}
            className={`glass-card p-4 ${
              !item.success
                ? "border-red-500/20"
                : item.result?.is_fake
                ? "border-red-500/20 bg-red-500/[0.03]"
                : "border-emerald-500/20 bg-emerald-500/[0.03]"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Status icon */}
              <div className="flex-shrink-0 text-xl">
                {!item.success ? "❌" : item.result?.is_fake ? "⚠️" : "✅"}
              </div>

              {/* Filename */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {item.filename}
                </p>
                {item.error && (
                  <p className="text-xs text-red-400 mt-0.5">{item.error}</p>
                )}
                {item.result && (
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
                    <span className="capitalize">{item.result.media_type}</span>
                    <span>Confidence: {(item.result.confidence * 100).toFixed(1)}%</span>
                    <span>{item.result.processing_time_ms.toFixed(0)}ms</span>
                  </div>
                )}
              </div>

              {/* Badge */}
              {item.success && item.result && (
                <span className={item.result.is_fake ? "badge-fake" : "badge-real"}>
                  {item.result.is_fake ? "FAKE" : "REAL"}
                </span>
              )}
            </div>

            {/* Recommendation */}
            {item.result?.recommendation && (
              <p className="text-xs text-slate-500 mt-2 pl-9 leading-relaxed">
                {item.result.recommendation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
