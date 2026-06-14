import React from "react";
import { Sliders, Check, Type, Maximize2, Move } from "lucide-react";
import { CVStyleConfig } from "../../types/cv";

interface TemplateSelectorProps {
  config: CVStyleConfig;
  onChange: (newConfig: CVStyleConfig) => void;
}

const templates = [
  { id: "classic", name: "Classic Professional" },
  { id: "minimal", name: "Modern Minimal" },
  { id: "executive", name: "Executive Clean" },
  { id: "developer", name: "Developer Focused" },
  { id: "marketing", name: "Marketing Specialist" },
  { id: "modern_ats", name: "Modern ATS (Single Column)" },
  { id: "ats_sidebar", name: "ATS Clean (Two-Column)" }
] as const;

const fonts = [
  { id: "Arial", name: "Arial (Sans-serif)" },
  { id: "Calibri", name: "Calibri (Clean)" },
  { id: "Helvetica", name: "Helvetica (Modern)" },
  { id: "TimesNewRoman", name: "Times New Roman (Serif)" },
  { id: "Georgia", name: "Georgia (Elegant)" },
  { id: "Inter", name: "Inter (Modern Sans)" },
  { id: "Outfit", name: "Outfit (Geometric)" },
  { id: "Poppins", name: "Poppins (Contemporary)" },
  { id: "Lora", name: "Lora (Modern Serif)" }
] as const;

const fontSizes = [
  { id: "sm", name: "Small (10pt)" },
  { id: "md", name: "Medium (11pt)" },
  { id: "lg", name: "Large (12pt)" }
] as const;

const spacingOptions = [
  { id: "compact", name: "Compact" },
  { id: "normal", name: "Normal" },
  { id: "spacious", name: "Spacious" }
] as const;

const colors = [
  { id: "emerald", hex: "#10b981", name: "Emerald" },
  { id: "blue", hex: "#3b82f6", name: "Blue" },
  { id: "purple", hex: "#8b5cf6", name: "Purple" },
  { id: "gray", hex: "#4b5563", name: "Charcoal" },
  { id: "red", hex: "#ef4444", name: "Burgundy" }
] as const;

export default function TemplateSelector({ config, onChange }: TemplateSelectorProps) {
  const updateConfig = <K extends keyof CVStyleConfig>(key: K, value: CVStyleConfig[K]) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  return (
    <div className="bg-brand-card/30 backdrop-blur-md border border-white/5 shadow-lg rounded-2xl p-5 md:p-6 space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-emerald/5 via-transparent to-brand-blue/5 pointer-events-none" />
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 relative z-10">
        <Sliders className="w-5 h-5 text-brand-emerald" />
        <h2 className="text-xs font-heading font-semibold text-white tracking-wider uppercase">Template & Style Customization</h2>
      </div>

      {/* Templates Selector */}
      <div className="space-y-3 relative z-10">
        <label className="block text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest">
          CV Template
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {templates.map((tpl) => {
            const isSelected = config.templateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => updateConfig("templateId", tpl.id)}
                className={`px-3 py-2.5 rounded-xl text-[11px] font-medium border text-center transition-all flex flex-col justify-center items-center gap-1.5 focus:outline-none hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? "bg-brand-emerald/10 border-brand-emerald text-brand-emerald font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : "bg-brand-dark/60 border-white/5 text-brand-gray-300 hover:border-white/10 hover:text-white"
                }`}
              >
                <span>{tpl.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4.5 gap-y-4 pt-2 relative z-10">
        {/* Font Family Selector */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Type className="w-3.5 h-3.5" /> Font Family
          </label>
          <select
            value={config.fontFamily}
            onChange={(e) => updateConfig("fontFamily", e.target.value as CVStyleConfig["fontFamily"])}
            className="w-full h-10 px-3 bg-brand-dark/60 border border-white/5 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-xl text-xs outline-none transition-all cursor-pointer font-medium"
          >
            {fonts.map((f) => (
              <option key={f.id} value={f.id} className="bg-brand-card">
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Selector */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" /> Font Size
          </label>
          <div className="grid grid-cols-3 gap-1 h-10 bg-brand-dark/60 border border-white/5 rounded-xl p-1">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => updateConfig("fontSize", size.id)}
                className={`rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                  config.fontSize === size.id
                    ? "bg-brand-emerald text-brand-dark font-extrabold shadow-sm"
                    : "text-brand-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={size.name}
              >
                {size.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Spacing Selector */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Move className="w-3.5 h-3.5" /> Spacing / Margins
          </label>
          <div className="grid grid-cols-3 gap-1 h-10 bg-brand-dark/60 border border-white/5 rounded-xl p-1">
            {spacingOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateConfig("spacing", opt.id)}
                className={`rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                  config.spacing === opt.id
                    ? "bg-brand-emerald text-brand-dark font-extrabold shadow-sm"
                    : "text-brand-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={opt.name}
              >
                {opt.id.charAt(0).toUpperCase() + opt.id.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color Selector */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest">
            Accent Line Color
          </label>
          <div className="flex items-center gap-3 h-10">
            {colors.map((c) => {
              const isSelected = config.accentColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateConfig("accentColor", c.id)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-emerald hover:scale-110 ${
                    isSelected
                      ? "border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                      : "border-white/5 hover:border-white/20"
                  }`}
                  title={c.name}
                >
                  {isSelected && (
                    <Check className={`w-3 h-3 ${c.id === "gray" ? "text-white" : "text-brand-dark font-bold"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
