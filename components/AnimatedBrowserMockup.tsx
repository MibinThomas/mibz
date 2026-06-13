"use client";

import React from "react";
import Image from "next/image";

interface AnimatedBrowserMockupProps {
  slug: string;
  url: string;
  themeColor: string;
  type?: string; // Kept optional for backwards compatibility
}

export default function AnimatedBrowserMockup({
  slug,
  url,
  themeColor,
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

      {/* Viewport Core - Real Desktop Screenshot Preview */}
      <div className="flex-grow relative overflow-hidden bg-brand-dark/40 select-none">
        {/* Themed Glow Background */}
        <div
          className="absolute -right-12 -bottom-12 w-36 h-36 rounded-full opacity-20 blur-[45px] transition-transform duration-700 group-hover/mockup:scale-150 pointer-events-none z-10"
          style={{ backgroundColor: themeColor }}
        />

        {/* Real Screenshot Image */}
        <Image
          src={`/screenshots/${slug}.png`}
          alt={`${slug} desktop preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top opacity-85 transition-all duration-500 group-hover/mockup:opacity-100 group-hover/mockup:scale-[1.02]"
          loading="lazy"
        />
      </div>
    </div>
  );
}
