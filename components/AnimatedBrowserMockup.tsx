"use client";

import React from "react";

interface AnimatedBrowserMockupProps {
  url: string;
  themeColor: string;
  type:
    | "automotive"
    | "logistics"
    | "healthcare"
    | "furniture"
    | "interior"
    | "marketing"
    | "recruitment"
    | "education";
}

export default function AnimatedBrowserMockup({
  url,
  themeColor,
  type,
}: AnimatedBrowserMockupProps) {
  // Parse short URL for address bar
  const displayUrl = url.replace("https://", "").replace("www.", "");

  return (
    <div className="w-full aspect-video rounded-xl border border-brand-gray-800 bg-brand-card/30 backdrop-blur-sm overflow-hidden flex flex-col relative group/mockup transition-all duration-500 shadow-2xl">
      {/* Top Browser Bar */}
      <div className="h-7 border-b border-brand-gray-800/80 bg-brand-dark/40 px-3 flex items-center gap-3 relative select-none">
        {/* Window Controls */}
        <div className="flex gap-1.5 items-center flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>

        {/* Address Bar */}
        <div className="flex-grow max-w-[240px] mx-auto h-4.5 rounded bg-brand-dark/80 border border-brand-gray-800/60 px-2 flex items-center justify-between text-[8px] font-sans text-brand-gray-500">
          <span className="truncate">{displayUrl}</span>
          <span className="opacity-40">🔒</span>
        </div>
      </div>

      {/* Viewport Core - Abstract industry wireframe preview */}
      <div className="flex-grow relative overflow-hidden bg-brand-dark/20 p-4 flex flex-col justify-between select-none">
        {/* Themed Glow Background */}
        <div
          className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-25 blur-[35px] transition-transform duration-700 group-hover/mockup:scale-150"
          style={{ backgroundColor: themeColor }}
        />

        {type === "automotive" && (
          <div className="w-full h-full flex flex-col justify-between opacity-80 text-brand-gray-400">
            <div className="flex items-center justify-between border-b border-brand-gray-800/40 pb-2">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Automotive Performance</span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
            </div>
            <div className="flex-grow flex items-center justify-center py-2 relative">
              <svg className="w-16 h-16 opacity-40 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 10 10" />
                <line x1="12" y1="12" x2="19" y2="12" stroke={themeColor} strokeWidth="1.5" />
                <circle cx="12" cy="12" r="1.5" fill="white" />
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-1.5 rounded-full bg-brand-gray-800" />
              <div className="h-1.5 rounded-full bg-brand-gray-800" />
              <div className="h-1.5 rounded-full bg-brand-gray-800/40" />
            </div>
          </div>
        )}

        {type === "logistics" && (
          <div className="w-full h-full flex flex-col justify-between opacity-80 text-brand-gray-400">
            <div className="flex items-center justify-between border-b border-brand-gray-800/40 pb-2">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Global Route Networks</span>
              <span className="text-[8px] opacity-65">Transit: Active</span>
            </div>
            <div className="flex-grow flex items-center justify-center py-1">
              <svg className="w-20 h-12 opacity-35" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="0.75">
                <path d="M10 20 Q 30 10 50 30 T 90 20" stroke={themeColor} strokeWidth="1.25" strokeDasharray="2,2" />
                <circle cx="10" cy="20" r="1.5" fill="white" />
                <circle cx="50" cy="30" r="1.5" fill="white" />
                <circle cx="90" cy="20" r="1.5" fill={themeColor} className="animate-ping" />
                <circle cx="90" cy="20" r="1.5" fill={themeColor} />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-1.5 rounded-full bg-brand-gray-800" />
              <div className="h-1.5 rounded-full bg-brand-gray-800/40" />
            </div>
          </div>
        )}

        {type === "healthcare" && (
          <div className="w-full h-full flex flex-col justify-between opacity-80 text-brand-gray-400">
            <div className="flex items-center justify-between border-b border-brand-gray-800/40 pb-2">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Patient Care Hub</span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
            </div>
            <div className="flex-grow flex items-center justify-center py-1">
              <svg className="w-full h-10 opacity-45" viewBox="0 0 120 30" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M0 15 L 40 15 L 45 5 L 50 25 L 55 12 L 60 18 L 65 15 L 120 15" stroke={themeColor} strokeWidth="1.5" />
              </svg>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <div className="h-1.5 rounded bg-brand-gray-800" />
              <div className="h-1.5 rounded bg-brand-gray-800" />
              <div className="h-1.5 rounded bg-brand-gray-800" />
              <div className="h-1.5 rounded bg-brand-gray-800/30" />
            </div>
          </div>
        )}

        {(type === "furniture" || type === "interior") && (
          <div className="w-full h-full flex flex-col justify-between opacity-80 text-brand-gray-400">
            <div className="flex items-center justify-between border-b border-brand-gray-800/40 pb-2">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Spatial Design Catalog</span>
              <span className="text-[7px] uppercase font-bold tracking-widest px-1 bg-brand-gray-800 rounded">Luxury</span>
            </div>
            <div className="flex-grow flex items-center justify-center gap-2 py-2">
              {/* Mock wireframe furniture shapes */}
              <div className="w-8 h-8 rounded border border-brand-gray-800/80 flex items-center justify-center relative">
                <div className="w-4 h-4 border" style={{ borderColor: themeColor }} />
              </div>
              <div className="w-8 h-8 rounded border border-brand-gray-800/80 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border border-brand-gray-700" />
              </div>
              <div className="w-8 h-8 rounded border border-brand-gray-800/80 flex items-center justify-center">
                <div className="w-5 h-2 border border-brand-gray-750" />
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-brand-gray-800" />
          </div>
        )}

        {type === "marketing" && (
          <div className="w-full h-full flex flex-col justify-between opacity-80 text-brand-gray-400">
            <div className="flex items-center justify-between border-b border-brand-gray-800/40 pb-2">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Search Optimization Tracker</span>
              <span className="text-[8px] font-bold text-brand-emerald">+240%</span>
            </div>
            <div className="flex-grow flex items-end justify-between py-2 gap-1 px-4">
              {/* Mock Bar Chart */}
              <div className="w-2.5 h-4 bg-brand-gray-800 rounded-sm" />
              <div className="w-2.5 h-6 bg-brand-gray-800 rounded-sm" />
              <div className="w-2.5 h-8 rounded-sm" style={{ backgroundColor: themeColor }} />
              <div className="w-2.5 h-11 rounded-sm" style={{ backgroundColor: themeColor }} />
            </div>
            <div className="h-1.5 w-full rounded-full bg-brand-gray-800" />
          </div>
        )}

        {type === "recruitment" && (
          <div className="w-full h-full flex flex-col justify-between opacity-80 text-brand-gray-400">
            <div className="flex items-center justify-between border-b border-brand-gray-800/40 pb-2">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Applicant Gateway</span>
              <span className="text-[7px] bg-brand-gray-800 px-1 py-0.5 rounded text-brand-blue">Active</span>
            </div>
            <div className="flex-grow flex flex-col justify-center gap-1.5 py-1">
              <div className="h-3 rounded border border-brand-gray-800 bg-brand-dark/20 flex items-center justify-between px-2 text-[6px]">
                <span>Candidate Profile</span>
                <span style={{ color: themeColor }}>✓</span>
              </div>
              <div className="h-3 rounded border border-brand-gray-800 bg-brand-dark/20 flex items-center justify-between px-2 text-[6px]">
                <span>Workspace Access</span>
                <span className="opacity-45">🔒</span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-brand-gray-800" />
          </div>
        )}

        {type === "education" && (
          <div className="w-full h-full flex flex-col justify-between opacity-80 text-brand-gray-400">
            <div className="flex items-center justify-between border-b border-brand-gray-800/40 pb-2">
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Academy Enrollment</span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
            </div>
            <div className="flex-grow flex items-center justify-center gap-3 py-2">
              <svg className="w-10 h-10 opacity-55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={themeColor} strokeWidth="1.5" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
              <div className="flex flex-col gap-1">
                <div className="h-2 w-10 bg-brand-gray-800 rounded" />
                <div className="h-2.5 w-14 bg-brand-gray-800 rounded" />
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-brand-gray-800" />
          </div>
        )}
      </div>
    </div>
  );
}
