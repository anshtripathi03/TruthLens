"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import DetectionResultView from "@/components/DetectionResultView";
import { useDetectImage } from "@/hooks/useDetection";

export default function ImageDetectPage() {
  const [file, setFile] = useState<File | null>(null);
  const { detect, result, loading, error } = useDetectImage();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-4">
          🖼️ Image Detection
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Image Deepfake Analysis</h1>
        <p className="text-slate-400 text-sm">
          Detect AI-generated or manipulated faces, GAN artifacts, and synthetic imagery.
        </p>
      </div>

      <div className="glass-card p-6 mb-6">
        <FileDropzone
          onFile={setFile}
          currentFile={file}
          accept="image/*"
          label="Drop an image file"
          sublabel="Supported: JPG, PNG, WEBP, HEIC, and more"
          icon={
            <div className="text-5xl text-center">🖼️</div>
          }
        />
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => file && detect(file)}
            disabled={!file || loading}
            className="btn-primary px-8 py-2.5 text-sm flex-1 flex items-center justify-center gap-2"
            id="image-detect-submit"
          >
            {loading ? (
              <><svg className="w-4 h-4 spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.2" /><path d="M12 2a10 10 0 010 20" strokeLinecap="round" /></svg>Analyzing…</>
            ) : "Analyze Image"}
          </button>
          {file && <button onClick={() => setFile(null)} className="btn-ghost px-5 py-2.5 text-sm">Clear</button>}
        </div>
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
