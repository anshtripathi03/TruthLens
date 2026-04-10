"use client";

import { useEffect, useState } from "react";
import { useHistory } from "@/hooks/useHistory";
import Link from "next/link";
import type { HistoryParams } from "@/lib/types";

const PAGE_SIZE = 10;

const MEDIA_FILTERS = [
  { label: "All Types", value: "" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Audio", value: "audio" },
];

const FAKE_FILTERS = [
  { label: "All Results", value: "" },
  { label: "Fake", value: "true" },
  { label: "Real", value: "false" },
];

export default function HistoryPage() {
  const {
    history,
    stats,
    loading,
    statsLoading,
    error,
    fetchHistory,
    fetchStats,
    deleteRecord,
  } = useHistory();

  const [page, setPage] = useState(1);
  const [mediaType, setMediaType] = useState("");
  const [isFakeFilter, setIsFakeFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const params: HistoryParams = {
      page,
      page_size: PAGE_SIZE,
    };
    if (mediaType) params.media_type = mediaType;
    if (isFakeFilter !== "") params.is_fake = isFakeFilter === "true";
    fetchHistory(params);
  }, [page, mediaType, isFakeFilter, fetchHistory]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this analysis record?")) return;
    setDeleting(id);
    await deleteRecord(id);
    setDeleting(null);
  };

  const totalPages = history ? Math.ceil(history.total / PAGE_SIZE) : 1;

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
          📋 Analysis History
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Detection History</h1>
        <p className="text-slate-400 text-sm">
          Paginated view of all past analyses with filter controls.
        </p>
      </div>

      {/* Stats row */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Scans", value: stats.total_scans, color: "#8b5cf6" },
            { label: "Fakes", value: stats.fake_count, color: "#ef4444" },
            { label: "Authentic", value: stats.real_count, color: "#10b981" },
            {
              label: "Avg Confidence",
              value: `${(stats.average_confidence * 100).toFixed(1)}%`,
              color: "#06b6d4",
            },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <span className="text-xs text-slate-500 font-medium">Filter by:</span>
        <div className="flex gap-1 flex-wrap">
          {MEDIA_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setMediaType(f.value); setPage(1); }}
              className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                mediaType === f.value
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {FAKE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setIsFakeFilter(f.value); setPage(1); }}
              className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                isFakeFilter === f.value
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card p-4 border-red-500/30 bg-red-500/5 mb-5 text-sm text-red-400 flex gap-2">
          <span>❌</span>{error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-4 h-16 shimmer" />
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && history && (
        <>
          {history.results.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-slate-400 font-medium">No records found</p>
              <p className="text-slate-600 text-sm mt-1">Try changing the filters or run an analysis first.</p>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-xs text-slate-500">
                      <th className="px-4 py-3 text-left font-medium">File</th>
                      <th className="px-4 py-3 text-left font-medium">Type</th>
                      <th className="px-4 py-3 text-left font-medium">Verdict</th>
                      <th className="px-4 py-3 text-left font-medium">Confidence</th>
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.results.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="text-slate-200 truncate font-medium">
                            {record.filename}
                          </p>
                          <p className="text-xs text-slate-600 font-mono truncate">
                            {record.file_hash.slice(0, 16)}…
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-400 capitalize">
                            {record.media_type === "image" ? "🖼️" : record.media_type === "video" ? "🎬" : "🎙️"}{" "}
                            {record.media_type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={record.is_fake ? "badge-fake" : "badge-real"}>
                            {record.is_fake ? "FAKE" : "REAL"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-white/[0.06] rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${record.confidence * 100}%`,
                                  background: record.is_fake ? "#ef4444" : "#10b981",
                                }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 tabular-nums">
                              {(record.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {formatDate(record.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/history/${record.id}`}
                              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDelete(record.id)}
                              disabled={deleting === record.id}
                              className="text-xs text-slate-600 hover:text-red-400 transition-colors disabled:opacity-40"
                            >
                              {deleting === record.id ? "…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Page {page} of {totalPages} — {history.total} total records
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-ghost px-3 py-1 text-xs disabled:opacity-30"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="btn-ghost px-3 py-1 text-xs disabled:opacity-30"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
