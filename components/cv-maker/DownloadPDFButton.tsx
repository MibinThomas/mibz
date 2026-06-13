import React from "react";
import { Printer, FileJson, FileCode, Cloud, Loader2 } from "lucide-react";

interface DownloadPDFButtonProps {
  onPrint: () => void;
  onExportJSON: () => void;
  onExportHTML: () => void;
  onCloudSync: () => void;
  dbConfigured: boolean;
  cloudSyncStatus: "unsynced" | "syncing" | "synced" | "error" | "disabled";
}

export default function DownloadPDFButton({
  onPrint,
  onExportJSON,
  onExportHTML,
  onCloudSync,
  dbConfigured,
  cloudSyncStatus
}: DownloadPDFButtonProps) {
  
  const renderCloudButton = () => {
    if (!dbConfigured) {
      return (
        <button
          type="button"
          disabled
          className="h-10 px-3.5 rounded-xl bg-brand-card/20 border border-white/5 text-brand-gray-650 transition-all text-xs font-medium flex items-center justify-center gap-1.5 cursor-not-allowed"
          title="Setup Neon DATABASE_URL or Supabase credentials in .env.local to enable real-time database syncing"
        >
          <Cloud className="w-4 h-4 text-brand-gray-800" />
          <span>Sync (Local)</span>
        </button>
      );
    }

    let icon = <Cloud className="w-4 h-4 text-brand-blue" />;
    let label = "Sync to Cloud";
    let buttonClass = "border-brand-blue/30 bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10";

    if (cloudSyncStatus === "syncing") {
      icon = <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />;
      label = "Syncing...";
    } else if (cloudSyncStatus === "synced") {
      icon = <Cloud className="w-4 h-4 text-brand-emerald" />;
      label = "Synced";
      buttonClass = "border-brand-emerald/30 bg-brand-emerald/5 text-brand-emerald hover:bg-brand-emerald/10";
    } else if (cloudSyncStatus === "error") {
      icon = <Cloud className="w-4 h-4 text-red-500 animate-pulse" />;
      label = "Sync Failed";
      buttonClass = "border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10";
    }

    return (
      <button
        type="button"
        onClick={onCloudSync}
        disabled={cloudSyncStatus === "syncing"}
        className={`h-10 px-3.5 rounded-xl border transition-all text-xs font-semibold flex items-center justify-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-brand-emerald hover:scale-[1.02] active:scale-[0.98] ${buttonClass}`}
        title="Sync and backup this CV draft dynamically in Neon / Supabase database"
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Native Browser Print Button (Gold Standard for selectable text) */}
      <button
        type="button"
        onClick={onPrint}
        className="h-10 px-4.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
      >
        <Printer className="w-4 h-4" />
        <span>Print & Save PDF</span>
      </button>

      {/* Cloud Sync Database button */}
      {renderCloudButton()}

      {/* Export CV as HTML (Using Blob URL storage) */}
      <button
        type="button"
        onClick={onExportHTML}
        className="h-10 px-3.5 rounded-xl bg-brand-card/40 hover:bg-brand-card/70 border border-white/5 text-brand-gray-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-semibold flex items-center justify-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-brand-emerald"
        title="Download your CV as a standalone, styled HTML document"
      >
        <FileCode className="w-4 h-4 text-brand-emerald" />
        <span>Export HTML</span>
      </button>

      {/* Export CV Data to JSON (Utility for backup using Blob URL storage) */}
      <button
        type="button"
        onClick={onExportJSON}
        className="h-10 px-3.5 rounded-xl bg-brand-card/40 hover:bg-brand-card/70 border border-white/5 text-brand-gray-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-semibold flex items-center justify-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-brand-emerald"
        title="Backup your data as a JSON file to import later"
      >
        <FileJson className="w-4 h-4 text-brand-gray-400" />
        <span>Backup JSON</span>
      </button>
    </div>
  );
}
