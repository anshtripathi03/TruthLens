"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useHealth } from "@/hooks/useHealth";
import { useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/detect", label: "Auto Detect" },
  { href: "/detect/image", label: "Image" },
  { href: "/detect/video", label: "Video" },
  { href: "/detect/audio", label: "Audio" },
  { href: "/detect/batch", label: "Batch" },
  { href: "/provenance", label: "Provenance" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const { health, fetchHealth } = useHealth();

  useEffect(() => {
    fetchHealth();
    const storedKey = localStorage.getItem("truthlens_api_key") || "";
    setApiKey(storedKey);
  }, [fetchHealth]);

  const saveKey = () => {
    localStorage.setItem("truthlens_api_key", apiKey);
    setShowSettings(false);
  };

  const isOnline = health?.status === "ok" || health?.status === "healthy";

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#060912]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 text-white" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight gradient-text">TruthLens</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Health badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full pulse-dot ${isOnline ? "bg-emerald-400" : "bg-red-400"}`} />
              {isOnline ? "API Online" : "API Offline"}
            </div>

            {/* Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              className="btn-ghost px-3 py-1.5 text-sm"
              aria-label="Settings"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden btn-ghost p-2"
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/[0.06] bg-[#060912]/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative glass-card p-6 w-full max-w-md fade-in-up">
            <h2 className="text-lg font-bold mb-4 gradient-text">API Configuration</h2>
            <label className="block text-sm text-slate-400 mb-2">X-API-Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 mb-4"
            />
            <p className="text-xs text-slate-500 mb-5">
              Key is stored in localStorage and sent as <code className="text-violet-400">X-API-Key</code> header.
            </p>
            <div className="flex gap-3">
              <button onClick={saveKey} className="btn-primary px-5 py-2 text-sm flex-1">Save Key</button>
              <button onClick={() => setShowSettings(false)} className="btn-ghost px-5 py-2 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
