"use client";

import type { ProvenanceReport } from "@/lib/types";
import ConfidenceBar from "@/components/ConfidenceBar";

interface ProvenanceReportViewProps {
  report: ProvenanceReport;
}

const riskColor: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#dc2626",
};

const riskBg: Record<string, string> = {
  low: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  medium: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  high: "bg-red-500/10 border-red-500/30 text-red-400",
  critical: "bg-red-700/15 border-red-700/40 text-red-300",
};

export default function ProvenanceReportView({ report }: ProvenanceReportViewProps) {
  const riskKey = report.risk_level.toLowerCase();
  const color = riskColor[riskKey] ?? "#94a3b8";
  const badgeClass = riskBg[riskKey] ?? "bg-slate-500/10 border-slate-500/30 text-slate-400";

  const metaEntries = Object.entries(report.metadata_extracted ?? {});

  return (
    <div className="space-y-4 fade-in-up">
      {/* Header */}
      <div className={`glass-card p-6 ${riskKey === "high" || riskKey === "critical" ? "border-red-500/30 bg-red-500/5" : "border-emerald-500/20"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-4xl">{riskKey === "low" ? "🛡️" : riskKey === "medium" ? "🔍" : "🚨"}</div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-bold text-slate-100 truncate">{report.filename}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeClass}`}>
                {report.risk_level} Risk
              </span>
            </div>
            <p className="text-sm text-slate-400 capitalize">{report.media_type}</p>
          </div>
        </div>

        {/* Provenance score bar */}
        <div className="mt-5">
          <ConfidenceBar
            value={report.provenance_score}
            label="Provenance Score (higher = more suspicious)"
            size="lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold tabular-nums" style={{ color }}>
            {(report.provenance_score * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Suspicion Score</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">
            {report.metadata_anomalies.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Anomalies</div>
        </div>
        <div className="glass-card p-4 text-center col-span-2 md:col-span-1">
          <div className="text-2xl font-bold text-cyan-400">
            {metaEntries.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Metadata Fields</div>
        </div>
      </div>

      {/* Anomalies */}
      {report.metadata_anomalies.length > 0 && (
        <div className="glass-card p-5 space-y-2">
          <h3 className="text-sm font-semibold text-slate-300">Detected Anomalies</h3>
          <ul className="space-y-1.5">
            {report.metadata_anomalies.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-amber-400 flex-shrink-0">⚠️</span>
                <span className="text-slate-400">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Extracted Metadata */}
      {metaEntries.length > 0 && (
        <div className="glass-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300">Extracted Metadata</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-500">
                  <th className="pb-2 text-left font-medium pr-4">Key</th>
                  <th className="pb-2 text-left font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {metaEntries.map(([k, v]) => (
                  <tr key={k} className="border-b border-white/[0.04]">
                    <td className="py-1.5 pr-4 text-cyan-400 font-mono font-medium break-all">{k}</td>
                    <td className="py-1.5 text-slate-400 font-mono break-all">
                      {typeof v === "object" ? JSON.stringify(v) : String(v)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
