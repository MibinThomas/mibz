import React from "react";
import { ArrowDown, TrendingUp } from "lucide-react";

export default function Hero() {

  // Sleek SVG line graph fallback representation for screen-readers and reduced-motion settings
  const fallbackGraph = (
    <svg
      viewBox="0 0 400 250"
      className="w-full max-w-lg aspect-video opacity-85 select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="grid-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      
      {/* Grid lines */}
      <line x1="10" y1="10" x2="10" y2="240" stroke="#1f2937" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="10" y1="240" x2="390" y2="240" stroke="#1f2937" strokeWidth="1" />
      <line x1="100" y1="10" x2="100" y2="240" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="5,5" />
      <line x1="200" y1="10" x2="200" y2="240" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="5,5" />
      <line x1="300" y1="10" x2="300" y2="240" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="5,5" />
      <line x1="10" y1="180" x2="390" y2="180" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="5,5" />
      <line x1="10" y1="120" x2="390" y2="120" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="5,5" />
      <line x1="10" y1="60" x2="390" y2="60" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="5,5" />

      {/* Area under curve */}
      <path
        d="M 10 240 L 10 210 Q 100 170 200 100 T 390 30 L 390 240 Z"
        fill="url(#grid-grad)"
      />

      {/* Main Growth Curve Line */}
      <path
        d="M 10 210 Q 100 170 200 100 T 390 30"
        fill="none"
        stroke="url(#line-grad)"
        strokeWidth="3.5"
        className="stroke-draw-animation"
      />

      {/* Interactive/static indicator circles */}
      <circle cx="10" cy="210" r="5" fill="#10b981" />
      <circle cx="100" cy="180" r="5" fill="#10b981" />
      <circle cx="200" cy="100" r="5" fill="#3b82f6" />
      <circle cx="390" cy="30" r="6" fill="#3b82f6" className="animate-ping" />
      <circle cx="390" cy="30" r="4.5" fill="#3b82f6" />
    </svg>
  );

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-between overflow-hidden pt-24 pb-16 px-6 md:px-12"
      aria-label="Welcome"
    >
      {/* Background Gradients & Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] aspect-square rounded-full bg-brand-emerald/5 blur-[120px] pointer-events-none -z-25" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] aspect-square rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none -z-25" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Hero Left Column: Descriptive SEO Info */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gray-900/60 border border-brand-gray-800/40 text-brand-emerald text-xs font-semibold tracking-wider uppercase select-none animate-pulse">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>UAE & GCC Growth Partner</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight">
              Scaling E-Commerce <br />
              Brands via <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand-blue">Performance Marketing</span>
            </h1>
            <p className="font-sans text-brand-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              {"Hi, I'm"} <strong className="text-white font-medium">Mibin Thomas</strong>. I engineer high-ROAS paid media funnels, optimize conversion rates (CRO), and deploy advanced GA4 dashboards to drive profitable e-commerce growth.
            </p>
          </div>

          {/* Quick value proposition statistics cards */}
          <div className="grid grid-cols-3 gap-4 max-w-lg border-y border-brand-gray-800/40 py-6">
            <div className="space-y-1">
              <span className="block text-2xl font-bold font-heading text-white">+40%</span>
              <span className="block text-xs text-brand-gray-400 uppercase tracking-wide">Organic Traffic</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-bold font-heading text-white">4.5x</span>
              <span className="block text-xs text-brand-gray-400 uppercase tracking-wide">Average ROAS</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-bold font-heading text-white">-30%</span>
              <span className="block text-xs text-brand-gray-400 uppercase tracking-wide">CAC Reduction</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="#portfolio"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-semibold text-center hover:opacity-95 transition-all duration-350 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] focus:outline-none focus:ring-2 focus:ring-brand-emerald"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full bg-brand-gray-900/60 border border-brand-gray-800/60 text-white font-heading font-semibold text-center hover:bg-brand-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-emerald"
            >
              {"Let's Scale"}
            </a>
          </div>
        </div>

        {/* Hero Right Column: Empty placeholder on desktop, fallback SVG on mobile */}
        <div className="lg:col-span-5 h-[280px] sm:h-[360px] lg:h-[480px] w-full flex items-center justify-center relative pointer-events-none select-none">
          <div className="block lg:hidden w-full h-full flex items-center justify-center">
            {fallbackGraph}
          </div>
        </div>
      </div>

      {/* Scroll indicator banner at bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-90 transition-opacity">
        <span className="font-heading font-semibold text-[10px] tracking-widest text-brand-gray-400 uppercase select-none">
          Scroll to explore
        </span>
        <ArrowDown className="w-4 h-4 text-brand-emerald animate-bounce" />
      </div>
    </section>
  );
}
