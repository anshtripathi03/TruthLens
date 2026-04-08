"use client";

import { useCallback, useRef, useState } from "react";

interface FileDropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
  maxSizeMB?: number;
  currentFile?: File | null;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function FileDropzone({
  onFile,
  accept = "*/*",
  label = "Drop your file here",
  sublabel = "or click to browse",
  icon,
  maxSizeMB = 500,
  currentFile,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Max ${maxSizeMB} MB.`);
        return;
      }
      onFile(file);
    },
    [onFile, maxSizeMB]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const DefaultIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="4" width="26" height="34" rx="3" className="stroke-slate-600" />
      <path d="M34 4l7 7h-7V4z" className="fill-slate-700 stroke-slate-600" strokeLinejoin="round" />
      <path d="M24 22v14M18 28l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" className="stroke-violet-400" />
    </svg>
  );

  return (
    <div className="w-full">
      <div
        className={`drop-zone p-10 flex flex-col items-center justify-center text-center min-h-[200px] select-none ${dragging ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label="File upload zone"
      >
        <div className={`transition-transform duration-200 ${dragging ? "scale-110" : ""}`}>
          {icon ?? <DefaultIcon />}
        </div>

        {currentFile ? (
          <div className="mt-4 space-y-1">
            <div className="flex items-center gap-2 justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-semibold text-slate-100 truncate max-w-[260px]">
                {currentFile.name}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentFile.type || "unknown type"} • {formatBytes(currentFile.size)}
            </p>
            <p className="text-xs text-violet-400 mt-2">Click or drop to replace</p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-slate-300 font-semibold">{dragging ? "Release to upload" : label}</p>
            <p className="text-sm text-slate-500 mt-1">{sublabel}</p>
            {accept !== "*/*" && (
              <p className="text-xs text-slate-600 mt-2">Accepted: {accept}</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" />
          </svg>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInputChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
