"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import DetectionResultView from "@/components/DetectionResultView";
import { useDetectAuto } from "@/hooks/useDetection";

export default function AutoDetectPage() {
  const [file, setFile] = useState<File | null>(null);
  const { detect, result, loading, error } = useDetectAuto();

  const handleSubmit = async () => {
    if (!file) return;
    await detect(file);
  };

  return (
    <div className="px-4 sm:px-6 max-w-7xl mx-auto py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
          🤖 Auto Detect
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mb-2">
          Automatic Detection
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Upload any media file — image, video, or audio — and the AI will
          automatically detect the type and run deepfake analysis.
        </p>
      </div>

      <div className="glass-card p-6 mb-6">
        <FileDropzone
          onFile={setFile}
          currentFile={file}
          accept="image/*,video/*,audio/*"
          label="Drop an image, video, or audio file"
          sublabel="Supported: JPG, PNG, MP4, MOV, MP3, WAV, and more"
        />

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="btn-primary px-8 py-2.5 text-sm flex-1 flex items-center justify-center gap-2"
            id="auto-detect-submit"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                  <path d="M12 2a10 10 0 010 20" strokeLinecap="round" />
                </svg>
                Analyzing…
              </>
            ) : (
              "Analyze File"
            )}
          </button>
          {(file || result) && (
            <button
              onClick={() => { setFile(null); }}
              className="btn-ghost px-5 py-2.5 text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="glass-card p-4 border-red-500/30 bg-red-500/5 mb-5 text-sm text-red-400 flex items-start gap-2">
          <span className="flex-shrink-0 mt-0.5">❌</span>
          {error}
        </div>
      )}

      {result && <DetectionResultView result={result} filename={file?.name} />}
    </div>
  );
}
