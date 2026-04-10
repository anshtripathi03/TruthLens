"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useHealth } from "@/hooks/useHealth";
import { useHistory } from "@/hooks/useHistory";

const QUICK_ACTIONS = [
  {
    title: "Auto Detect",
    description: "Upload any file and let AI detect the media type automatically",
    href: "/detect",
    icon: "🤖",
    gradient: "from-violet-600/20 to-cyan-600/20",
    border: "border-violet-500/20",
  },
  {
    title: "Image Analysis",
    description: "Detect deepfake faces and AI-generated images",
    href: "/detect/image",
    icon: "🖼️",
    gradient: "from-blue-600/20 to-violet-600/20",
    border: "border-blue-500/20",
  },
  {
    title: "Video Analysis",
    description: "Frame-by-frame deepfake detection in video files",
    href: "/detect/video",
    icon: "🎬",
    gradient: "from-purple-600/20 to-pink-600/20",
    border: "border-purple-500/20",
  },
  {
    title: "Audio Analysis",
    description: "Identify AI-cloned voices and synthetic audio",
    href: "/detect/audio",
    icon: "🎙️",
    gradient: "from-cyan-600/20 to-blue-600/20",
    border: "border-cyan-500/20",
  },
  {
    title: "Batch Detection",
    description: "Analyze up to 10 mixed-type files at once",
    href: "/detect/batch",
    icon: "📦",
    gradient: "from-amber-600/20 to-orange-600/20",
    border: "border-amber-500/20",
  },
  {
    title: "Provenance Check",
    description: "Metadata forensics — no ML, just provenance signals",
    href: "/provenance",
    icon: "🔎",
    gradient: "from-emerald-600/20 to-cyan-600/20",
    border: "border-emerald-500/20",
  },
];

export default function HomePage() {
  const { health, fetchHealth } = useHealth();
  const { stats, fetchStats } = useHistory();

  useEffect(() => {
    fetchHealth();
    fetchStats();
  }, [fetchHealth, fetchStats]);

  const statItems = stats
    ? [
        { label: "Total Scans", value: stats.total_scans, color: "#8b5cf6" },
        { label: "Fakes Detected", value: stats.fake_count, color: "#ef4444" },
        { label: "Authentic Files", value: stats.real_count, color: "#10b981" },
        {
          label: "Avg Confidence",
          value: `${(stats.average_confidence * 100).toFixed(1)}%`,
          color: "#06b6d4",
        },
      ]
    : null;

  return (
    <div className="relative min-h-screen max-w-7xl mx-auto overflow-hidden">
      {/* Decorative orbs */}
      <div className="bg-glow-violet top-[-100px] left-[-100px]" />
      <div className="bg-glow-cyan bottom-[10%] right-[-80px]" />

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 pulse-dot" />
            Powered by DeepTrace ML Engine
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-5">
            <span className="gradient-text">Truth</span>
            <span className="text-slate-100">Lens</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed">
            Advanced AI-powered deepfake detection for images, videos, and audio.
            Upload any media file and get instant analysis with confidence scores,
            artifact signatures, and provenance data.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/detect" className="btn-primary px-8 py-3 text-sm rounded-xl">
              Start Detecting
            </Link>
            <Link href="/history" className="btn-ghost px-8 py-3 text-sm rounded-xl">
              View History
            </Link>
          </div>
        </div>

        {/* Health Status */}
        {health && (
          <div className="glass-card p-4 mb-10 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-sm font-medium text-slate-300">API Online</span>
              <span className="text-xs text-slate-500">v{health.version}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              {Object.entries(health.models_loaded).map(([k, v]) => (
                <span key={k}>
                  <span className="text-violet-400">{k}</span>: {String(v)}
                </span>
              ))}
              <span>GPU: {health.gpu_available ? "✅" : "❌"}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        {statItems && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {statItems.map((s) => (
              <div key={s.label} className="glass-card p-5 text-center">
                <div
                  className="text-3xl font-extrabold tabular-nums"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-slate-200 mb-5">Choose Analysis Type</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`glass-card p-6 group cursor-pointer border ${action.border} hover:scale-[1.01] transition-transform duration-200`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} border ${action.border} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
              >
                {action.icon}
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">{action.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{action.description}</p>
              <div className="mt-4 flex items-center gap-1 text-violet-400 text-xs font-medium">
                Analyze now
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
