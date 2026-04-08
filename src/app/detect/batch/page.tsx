"use client";

import { useCallback, useState } from "react";
import BatchResultView from "@/components/BatchResultView";
import { useDetectBatch } from "@/hooks/useDetection";

const MAX_FILES = 10;

export default function BatchDetectPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { detect, batchResult, loading, error } = useDetectBatch();
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback((incoming: File[]) => {
    setFiles((prev) => {
      const combined = [...prev, ...incoming];
      return combined.slice(0, MAX_FILES);
    });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const formatBytes = (b: number) =>
    b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-4">
          📦 Batch Detection
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Batch Analysis</h1>
        <p className="text-slate-400 text-sm">
          Upload up to {MAX_FILES} mixed-type files (images, videos, audio). Each file is analyzed
          independently — a failure in one doesn&apos;t stop the others.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={`glass-card border-amber-500/20 p-8 text-center mb-5 cursor-pointer transition-all duration-200 ${
          dragOver ? "border-amber-400/60 bg-amber-500/10" : ""
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById("batch-input")?.click()}
        role="button"
        aria-label="Batch file upload"
      >
        <div className="text-4xl mb-3">📂</div>
        <p className="text-slate-300 font-semibold">
          {dragOver ? "Release to add files" : "Drop multiple files here"}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          or click to browse — {files.length}/{MAX_FILES} files selected
        </p>
        <input
          id="batch-input"
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={onInput}
          aria-label="Batch file input"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="glass-card p-4 mb-5 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">
              {files.length} file{files.length !== 1 ? "s" : ""} queued
            </span>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
            >
              <span className="text-lg flex-shrink-0">
                {f.type.startsWith("image") ? "🖼️" : f.type.startsWith("video") ? "🎬" : "🎙️"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{f.name}</p>
                <p className="text-xs text-slate-500">{f.type || "unknown"} • {formatBytes(f.size)}</p>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                aria-label={`Remove ${f.name}`}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => detect(files)}
          disabled={files.length === 0 || loading}
          className="btn-primary px-8 py-2.5 text-sm flex-1 flex items-center justify-center gap-2"
          id="batch-detect-submit"
        >
          {loading ? (
            <><svg className="w-4 h-4 spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M12 2a10 10 0 010 20" strokeLinecap="round" /></svg>Analyzing {files.length} files…</>
          ) : `Analyze ${files.length || ""} File${files.length !== 1 ? "s" : ""}`}
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 border-red-500/30 bg-red-500/5 mt-5 text-sm text-red-400 flex gap-2">
          <span>❌</span>{error}
        </div>
      )}

      {batchResult && (
        <div className="mt-6">
          <BatchResultView result={batchResult} />
        </div>
      )}
    </div>
  );
}
