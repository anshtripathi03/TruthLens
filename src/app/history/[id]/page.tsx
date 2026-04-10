"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHistory } from "@/hooks/useHistory";
import Link from "next/link";
import ConfidenceBar from "@/components/ConfidenceBar";

export default function HistoryRecordPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { selectedRecord: record, fetchRecord, deleteRecord, loading, error } = useHistory();

  useEffect(() => {
    if (id) fetchRecord(id);
  }, [id, fetchRecord]);

  const handleDelete = async () => {
    if (!confirm("Delete this record permanently?")) return;
    const ok = await deleteRecord(id);
    if (ok) router.push("/history");
  };

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleString(undefined, { dateStyle: "full", timeStyle: "medium" });

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-12">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 h-24 shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-12">
        <div className="glass-card p-6 border-red-500/30 bg-red-500/5 text-red-400 text-sm">
          ❌ {error}
        </div>
        <Link href="/history" className="mt-4 inline-block text-violet-400 text-sm hover:underline">
          ← Back to History
        </Link>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="px-4 sm:px-6 py-12 fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
        <Link href="/history" className="hover:text-violet-400 transition-colors">History</Link>
        <span>/</span>
        <span className="text-slate-400 font-mono truncate">{record.id}</span>
      </div>

      {/* Verdict Banner */}
      <div className={`glass-card p-6 mb-4 ${record.is_fake ? "border-red-500/30 bg-red-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-5xl">{record.is_fake ? "⚠️" : "✅"}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-bold text-slate-100 truncate">{record.filename}</h1>
              <span className={record.is_fake ? "badge-fake" : "badge-real"}>
                {record.is_fake ? "DEEPFAKE" : "AUTHENTIC"}
              </span>
            </div>
            <p className="text-sm text-slate-400">{record.recommendation}</p>
            <p className="text-xs text-slate-600 mt-2">{formatDate(record.timestamp)}</p>
          </div>
        </div>

        <div className="mt-5">
          <ConfidenceBar
            value={record.confidence}
            label="Confidence Score"
            size="md"
          />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {[
          { label: "Media Type", value: record.media_type, emoji: record.media_type === "image" ? "🖼️" : record.media_type === "video" ? "🎬" : "🎙️" },
          { label: "Processing Time", value: `${record.processing_time_ms.toFixed(0)}ms`, emoji: "⏱" },
          {
            label: "Provenance Score",
            value: record.provenance_score != null ? `${(record.provenance_score * 100).toFixed(1)}%` : "N/A",
            emoji: "🔎",
          },
        ].map((item) => (
          <div key={item.label} className="glass-card p-4">
            <div className="text-lg mb-1">{item.emoji}</div>
            <div className="text-sm font-semibold text-slate-200 capitalize">{item.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Technical fields */}
      <div className="glass-card p-5 space-y-3 mb-4">
        <h3 className="text-sm font-semibold text-slate-300">Technical Details</h3>
        {[
          { key: "Record ID", val: record.id },
          { key: "File Hash", val: record.file_hash },
          ...(record.model_fingerprint ? [{ key: "Model Fingerprint", val: record.model_fingerprint }] : []),
        ].map(({ key, val }) => (
          <div key={key} className="flex items-start gap-3 text-xs">
            <span className="text-slate-500 flex-shrink-0 w-36">{key}</span>
            <code className="text-violet-400 font-mono break-all">{val}</code>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link href="/history" className="btn-ghost px-5 py-2.5 text-sm">
          ← Back
        </Link>
        <button
          onClick={handleDelete}
          className="px-5 py-2.5 text-sm rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
        >
          Delete Record
        </button>
      </div>
    </div>
  );
}
