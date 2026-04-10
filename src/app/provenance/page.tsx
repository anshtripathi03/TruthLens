"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ProvenanceReportView from "@/components/ProvenanceReportView";
import { useProvenance } from "@/hooks/useProvenance";

export default function ProvenancePage() {
  const [file, setFile] = useState<File | null>(null);
  const { analyze, report, loading, error } = useProvenance();

  return (
    <div className="px-4 sm:px-6 max-w-7xl mx-auto py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
          🔎 Provenance Analysis
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Provenance Check</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Lightweight metadata forensics — no ML inference. Analyzes file signatures,
          embedded metadata, timestamps, and encoding anomalies to assess authenticity.
        </p>
      </div>

      {/* Info banner */}
      <div className="glass-card p-4 border-emerald-500/15 bg-emerald-500/5 mb-6 flex gap-3 text-sm text-emerald-300">
        <span className="flex-shrink-0 mt-0.5">ℹ️</span>
        <span>
          Provenance analysis is fast and works on any file type. For deep ML-based
          detection, use the{" "}
          <a href="/detect" className="underline text-emerald-400 hover:text-emerald-300">
            Auto Detect
          </a>{" "}
          feature instead.
        </span>
      </div>

      <div className="glass-card p-6 border-emerald-500/15 mb-6">
        <FileDropzone
          onFile={setFile}
          currentFile={file}
          accept="image/*,video/*,audio/*"
          label="Drop any file for provenance analysis"
          sublabel="Image, video, or audio — all types supported"
          icon={<div className="text-5xl">🔎</div>}
        />
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => file && analyze(file)}
            disabled={!file || loading}
            className="btn-primary px-8 py-2.5 text-sm flex-1 flex items-center justify-center gap-2"
            id="provenance-submit"
          >
            {loading ? (
              <><svg className="w-4 h-4 spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M12 2a10 10 0 010 20" strokeLinecap="round" /></svg>Analyzing metadata…</>
            ) : "Check Provenance"}
          </button>
          {file && (
            <button onClick={() => setFile(null)} className="btn-ghost px-5 py-2.5 text-sm">
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="glass-card p-4 border-red-500/30 bg-red-500/5 mb-5 text-sm text-red-400 flex gap-2">
          <span>❌</span>{error}
        </div>
      )}

      {report && <ProvenanceReportView report={report} />}
    </div>
  );
}
