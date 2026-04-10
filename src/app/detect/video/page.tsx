"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import DetectionResultView from "@/components/DetectionResultView";
import { useDetectVideo } from "@/hooks/useDetection";

export default function VideoDetectPage() {
  const [file, setFile] = useState<File | null>(null);
  const { detect, result, loading, error } = useDetectVideo();

  return (
    <div className="px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full mb-4">
          🎬 Video Detection
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Video Deepfake Analysis</h1>
        <p className="text-slate-400 text-sm">
          Frame-by-frame analysis to catch manipulated faces, body swaps, and lip-sync deepfakes.
          Analysis may take a minute for large files.
        </p>
      </div>

      <div className="glass-card p-6 border-purple-500/15 mb-6">
        <FileDropzone
          onFile={setFile}
          currentFile={file}
          accept="video/*"
          label="Drop a video file"
          sublabel="Supported: MP4, MOV, AVI, MKV, WEBM"
          maxSizeMB={500}
          icon={<div className="text-5xl">🎬</div>}
        />
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => file && detect(file)}
            disabled={!file || loading}
            className="btn-primary px-8 py-2.5 text-sm flex-1 flex items-center justify-center gap-2"
            id="video-detect-submit"
          >
            {loading ? (
              <><svg className="w-4 h-4 spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M12 2a10 10 0 010 20" strokeLinecap="round" /></svg>Analyzing frames…</>
            ) : "Analyze Video"}
          </button>
          {file && <button onClick={() => setFile(null)} className="btn-ghost px-5 py-2.5 text-sm">Clear</button>}
        </div>
        {loading && (
          <p className="text-xs text-slate-500 mt-3 text-center">
            ⏳ Video analysis takes 30–120 seconds depending on file size…
          </p>
        )}
      </div>

      {error && (
        <div className="glass-card p-4 border-red-500/30 bg-red-500/5 mb-5 text-sm text-red-400 flex gap-2">
          <span>❌</span>{error}
        </div>
      )}
      {result && <DetectionResultView result={result} filename={file?.name} />}
    </div>
  );
}
