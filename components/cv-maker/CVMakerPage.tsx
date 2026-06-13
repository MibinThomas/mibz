"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, BookOpen, Trash2, Check, 
  ArrowRight, Download, Eye, EyeOff, RefreshCw, Undo
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CVForm from "./CVForm";
import CVPreview from "./CVPreview";
import TemplateSelector from "./TemplateSelector";
import ATSScore from "./ATSScore";
import DownloadPDFButton from "./DownloadPDFButton";

import { cvSchema, CVFormValues } from "../../lib/cvSchema";
import { sampleCVData } from "../../lib/sampleCVData";
import { CVStyleConfig, CVData } from "../../types/cv";

const defaultStyleConfig: CVStyleConfig = {
  templateId: "classic",
  fontSize: "md",
  spacing: "normal",
  accentColor: "emerald",
  fontFamily: "Calibri",
};

const emptyCVData: CVData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    portfolioUrl: "",
    githubUrl: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
  customSections: [],
};

export default function CVMakerPage() {
  const [styleConfig, setStyleConfig] = useState<CVStyleConfig>(defaultStyleConfig);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "saving">("idle");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Database cloud sync states
  const [dbConfigured, setDbConfigured] = useState(false);
  const [syncId, setSyncId] = useState("");
  const [cloudSyncStatus, setCloudSyncStatus] = useState<"unsynced" | "syncing" | "synced" | "error" | "disabled">("disabled");
  const [cloudSyncError, setCloudSyncError] = useState("");

  const builderRef = useRef<HTMLDivElement>(null);

  // Initialize React Hook Form
  const methods = useForm<CVFormValues>({
    resolver: zodResolver(cvSchema),
    defaultValues: emptyCVData,
    mode: "onChange",
  });

  const { reset, watch } = methods;
  
  // Watch all values to feed directly to live preview and ATSScore
  const watchedValues = watch() as CVData;

  // 1. Check DB configuration status and load sync ID on mount
  useEffect(() => {
    async function checkDb() {
      try {
        const res = await fetch("/api/cv?status=1");
        const json = await res.json();
        if (json.dbConfigured) {
          setDbConfigured(true);
          setCloudSyncStatus("unsynced");
          
          let id = localStorage.getItem("mibz-cv-sync-id");
          if (!id) {
            id = "sync-" + Math.random().toString(36).substring(2, 11) + "-" + Math.random().toString(36).substring(2, 11);
            localStorage.setItem("mibz-cv-sync-id", id);
          }
          setSyncId(id);

          // Check if syncId exists in URL parameters to load from cloud
          const urlParams = new URLSearchParams(window.location.search);
          const urlSyncId = urlParams.get("syncId");
          if (urlSyncId) {
            setCloudSyncStatus("syncing");
            const loadRes = await fetch(`/api/cv?id=${urlSyncId}`);
            if (loadRes.ok) {
              const loadJson = await loadRes.json();
              if (loadJson.data) {
                reset(loadJson.data);
                setSyncId(urlSyncId);
                localStorage.setItem("mibz-cv-sync-id", urlSyncId);
                setCloudSyncStatus("synced");
              }
            } else {
              setCloudSyncStatus("error");
              setCloudSyncError("Failed to retrieve resume draft from cloud database.");
            }
          }
        }
      } catch (err) {
        console.error("Error checking db configuration status", err);
      }
    }
    checkDb();
  }, [reset]);

  // Load initial draft from localStorage if it exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("syncId")) return; // Don't load from localStorage if loading from cloud

      const savedDraft = localStorage.getItem("mibz-cv-draft");
      const savedStyles = localStorage.getItem("mibz-cv-styles");
      
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          reset(parsed);
        } catch (e) {
          console.error("Error parsing CV draft", e);
        }
      } else {
        reset(sampleCVData);
      }

      if (savedStyles) {
        try {
          setStyleConfig(JSON.parse(savedStyles));
        } catch (e) {
          console.error("Error parsing style configurations", e);
        }
      }
    }
  }, [reset]);

  // Auto-save draft on data changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSaveStatus("saving");
      
      // If synced, mark as unsynced since user made changes
      setCloudSyncStatus((prev) => (prev === "synced" ? "unsynced" : prev));

      const delay = setTimeout(() => {
        localStorage.setItem("mibz-cv-draft", JSON.stringify(watchedValues));
        localStorage.setItem("mibz-cv-styles", JSON.stringify(styleConfig));
        setSaveStatus("saved");
        
        const idleDelay = setTimeout(() => setSaveStatus("idle"), 2000);
        return () => clearTimeout(idleDelay);
      }, 1000);

      return () => clearTimeout(delay);
    }
  }, [watchedValues, styleConfig]);

  // Cloud Synchronize Handler
  const handleCloudSync = async () => {
    if (!dbConfigured || !syncId) return;
    setCloudSyncStatus("syncing");
    setCloudSyncError("");

    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          syncId,
          fullName: watchedValues.personalInfo.fullName || "Unnamed Draft",
          jobTitle: watchedValues.personalInfo.jobTitle || "",
          cvData: watchedValues,
        }),
      });

      if (res.ok) {
        setCloudSyncStatus("synced");
      } else {
        const errJson = await res.json();
        setCloudSyncStatus("error");
        setCloudSyncError(errJson.error || "Failed to sync to cloud.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error. Failed to sync.";
      setCloudSyncStatus("error");
      setCloudSyncError(errorMessage);
    }
  };

  // Handle Load Sample Data
  const handleLoadSample = () => {
    reset(sampleCVData);
    setStyleConfig(defaultStyleConfig);
    // Smooth scroll to builder
    scrollToBuilder();
  };

  // Handle Clear All Fields
  const handleClearAll = () => {
    reset(emptyCVData);
    setShowClearConfirm(false);
  };

  // Scroll to Builder Container
  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Print CV / PDF Download trigger
  const handlePrint = () => {
    window.print();
  };

  // Export JSON file using Blob URL storage
  const handleExportJSON = () => {
    const jsonString = JSON.stringify(watchedValues, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `resume_${watchedValues.personalInfo.fullName.replace(/\s+/g, "_") || "cv"}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url); // release memory
  };

  // Export standalone styled HTML file using Blob URL storage
  const handleExportHTML = () => {
    const previewElement = document.getElementById("cv-preview-sheet");
    if (!previewElement) return;

    const fontFamilies = {
      Arial: "Arial, Helvetica, sans-serif",
      Calibri: "Calibri, Candara, Segoe, sans-serif",
      Helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      TimesNewRoman: "'Times New Roman', Times, Baskerville, serif",
      Georgia: "Georgia, Cambria, 'Times New Roman', Times, serif"
    };

    const paddingStyles = {
      compact: "padding: 0.5in;",
      normal: "padding: 0.75in;",
      spacious: "padding: 1.0in;"
    };

    const contentHtml = previewElement.innerHTML;
    const currentFont = fontFamilies[styleConfig.fontFamily];
    const currentPadding = paddingStyles[styleConfig.spacing];

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${watchedValues.personalInfo.fullName || "Resume"} - CV</title>
  <style>
    body {
      background: #ffffff;
      color: #000000;
      margin: 0;
      padding: 0;
      font-family: ${currentFont};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #cv-preview-sheet {
      box-sizing: border-box;
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
      background: white;
      color: black;
      ${currentPadding}
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    /* Global Typography Sizing */
    .text-[12px] { font-size: 12px; line-height: 1.35; }
    .text-[14px] { font-size: 14px; line-height: 1.45; }
    .text-[16px] { font-size: 16px; line-height: 1.55; }
    .text-[20px] { font-size: 20px; }
    .text-[24px] { font-size: 24px; }
    .text-[28px] { font-size: 28px; }
    .text-[13px] { font-size: 13px; }
    .text-[15px] { font-size: 15px; }
    .text-[17px] { font-size: 17px; }
    
    .font-bold { font-weight: bold; }
    .font-semibold { font-weight: 600; }
    .font-extrabold { font-weight: 800; }
    
    .uppercase { text-transform: uppercase; }
    .tracking-tight { letter-spacing: -0.025em; }
    .tracking-wide { letter-spacing: 0.025em; }
    .tracking-widest { letter-spacing: 0.1em; }
    
    .text-center { text-align: center; }
    .text-justify { text-align: justify; }
    .underline { text-decoration: underline; }
    .italic { font-style: italic; }
    
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .justify-between { justify-content: space-between; }
    .items-center { align-items: center; }
    
    .grid { display: grid; }
    .gap-1 { gap: 0.25rem; }
    
    .border-b { border-bottom: 1px solid #d1d5db; }
    .border-b-2 { border-bottom: 2px solid #d1d5db; }
    .border-t { border-top: 1px solid #d1d5db; }
    .border-l-4 { border-left: 4px solid #d1d5db; }
    
    .pl-5 { padding-left: 1.25rem; }
    .pl-2\\.5 { padding-left: 0.625rem; }
    .pb-4 { padding-bottom: 1rem; }
    .pb-3 { padding-bottom: 0.75rem; }
    .pb-0\\.5 { padding-bottom: 0.125rem; }
    .pt-3 { padding-top: 0.75rem; }
    .mt-3 { margin-top: 0.75rem; }
    .mt-4 { margin-top: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .ml-2 { margin-left: 0.5rem; }
    
    .space-y-1 > * + * { margin-top: 0.25rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-3 > * + * { margin-top: 0.75rem; }
    
    .list-disc { list-style-type: disc; }
    .leading-relaxed { line-height: 1.625; }
    .leading-normal { line-height: 1.5; }
    
    hr { border: 0; }
    
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #cv-preview-sheet {
        margin: 0 !important;
        padding: 0.5in !important;
        max-width: 100% !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div id="cv-preview-sheet">
    ${contentHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `resume_${watchedValues.personalInfo.fullName.replace(/\s+/g, "_") || "cv"}.html`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  // Import JSON file logic
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        reset(parsed);
      } catch {
        alert("Failed to parse JSON file. Make sure it is a valid CV backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-between selection:bg-brand-emerald/30 selection:text-brand-emerald text-foreground antialiased relative">
      
      <Navbar />

      {/* Main Container */}
      <main id="main-content" className="flex-grow z-10 pt-24 pb-16">
        
        {/* HERO SECTION */}
        <section className="relative px-6 md:px-12 max-w-7xl mx-auto py-12 md:py-20 text-center overflow-hidden">
          {/* Glowing background shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-emerald/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>
          <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-brand-blue/5 blur-[90px] rounded-full pointer-events-none -z-10"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-emerald/20 bg-brand-emerald/5 text-brand-emerald text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              100% Recruiter Safe & Selectable Text
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-tight">
              ATS Friendly <span className="bg-gradient-to-r from-brand-emerald to-brand-blue bg-clip-text text-transparent">CV Maker</span>
            </h1>

            <p className="text-base md:text-lg text-brand-gray-400 max-w-2xl mx-auto leading-relaxed">
              Create a clean, recruiter-ready resume that is easy to read, easy to edit, and built for modern hiring systems. Zero tables, zero columns that break parsers, and zero graphics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                onClick={scrollToBuilder}
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] cursor-pointer group"
              >
                <span>Start Building</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={handleLoadSample}
                className="w-full sm:w-auto h-12 px-8 rounded-full border border-brand-gray-800 bg-brand-card hover:bg-brand-gray-900 text-white font-heading font-semibold hover:border-brand-gray-650 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-brand-emerald" />
                <span>Load Sample CV</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* BUILDER WORKSPACE */}
        <section ref={builderRef} className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-6 scroll-mt-24">
          
          {/* CONTROL BAR (Top Panel) */}
          <div className="bg-brand-card/50 border border-brand-gray-800/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Status alerts */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="text-left">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  CV Builder Workspace
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-ping"></span>
                </h2>
                <div className="text-[10px] font-mono text-brand-gray-400 flex items-center gap-2 mt-0.5">
                  {saveStatus === "saving" && (
                    <span className="text-brand-blue flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Saving draft...
                    </span>
                  )}
                  {saveStatus === "saved" && (
                    <span className="text-brand-emerald flex items-center gap-1">
                      <Check className="w-3 h-3" /> Draft saved to browser
                    </span>
                  )}
                  {saveStatus === "idle" && (
                    <span className="text-brand-gray-500">Draft up to date</span>
                  )}
                </div>
              </div>
            </div>

            {/* Print and Utility Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
              {/* Import JSON button wrapper */}
              <label className="h-10 px-3.5 rounded-lg bg-brand-dark hover:bg-brand-card border border-brand-gray-800 text-brand-gray-300 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer focus-within:ring-1 focus-within:ring-brand-emerald select-none">
                <Undo className="w-4 h-4 text-brand-gray-400 rotate-90" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="sr-only"
                />
              </label>

              <DownloadPDFButton
                onPrint={handlePrint}
                onExportJSON={handleExportJSON}
                onExportHTML={handleExportHTML}
                onCloudSync={handleCloudSync}
                dbConfigured={dbConfigured}
                cloudSyncStatus={cloudSyncStatus}
              />

              {/* Clear fields triggers */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(!showClearConfirm)}
                  className="h-10 px-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>

                {/* Clear Confirmation Modal Pop-over */}
                {showClearConfirm && (
                  <div className="absolute right-0 bottom-12 md:bottom-auto md:top-12 w-56 bg-brand-dark border border-brand-gray-800 rounded-xl p-3.5 shadow-2xl z-20 space-y-3">
                    <p className="text-xs font-medium text-brand-gray-300 leading-normal">
                      Are you sure you want to clear all data? This draft will be deleted.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="px-2.5 py-1 rounded bg-brand-card text-[11px] font-semibold text-brand-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="px-2.5 py-1 rounded bg-red-500 text-brand-dark text-[11px] font-bold hover:bg-red-600"
                      >
                        Yes, Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cloud Sync Retrieval Banner */}
          {dbConfigured && syncId && (
            <div className="bg-brand-card/40 border border-brand-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 text-left w-full">
                <span className="font-semibold text-white block">
                  {cloudSyncStatus === "synced" ? "🚀 Cloud Synchronization Active" : "☁️ Real-time Cloud Backups Enabled"}
                </span>
                <span className="text-brand-gray-400 block leading-normal">
                  Your CV draft has a unique sync token: <code className="text-brand-emerald bg-brand-dark px-1.5 py-0.5 rounded font-mono font-semibold">{syncId}</code>. 
                  {cloudSyncStatus === "synced" 
                    ? "Retrieve or edit it on any browser using the sharing link below:" 
                    : "Save your work to the database to generate a unique sharing link."}
                </span>
                {cloudSyncStatus === "synced" && (
                  <span className="text-brand-blue block mt-1 break-all select-all font-mono font-medium underline">
                    {typeof window !== "undefined" ? `${window.location.origin}/cv-maker?syncId=${syncId}` : ""}
                  </span>
                )}
              </div>
              {cloudSyncStatus === "synced" && (
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/cv-maker?syncId=${syncId}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert("Sharing URL copied to clipboard!");
                  }}
                  className="w-full sm:w-auto h-8 px-3 rounded bg-brand-emerald text-brand-dark font-heading font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 flex-shrink-0"
                >
                  Copy Link
                </button>
              )}
            </div>
          )}

          {/* Sync failure warning alert */}
          {cloudSyncError && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-xs text-red-400">
              ⚠️ <strong>Database sync failed:</strong> {cloudSyncError}
            </div>
          )}

          {/* MAIN COLUMN WRAPPER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDE: BUILDER FORM PANEL */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Template Style Selectors */}
              <TemplateSelector config={styleConfig} onChange={setStyleConfig} />

              {/* Form elements wrapped in React Hook Form FormProvider */}
              <FormProvider {...methods}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <CVForm />
                </form>
              </FormProvider>

              {/* ATS scoring widget */}
              <ATSScore data={watchedValues} />
            </div>

            {/* RIGHT SIDE: LIVE A4 PREVIEW PANEL (Sticky on desktop viewports) */}
            <div className="hidden lg:block lg:col-span-6 lg:sticky lg:top-24 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar pr-1">
              <div className="flex items-center justify-between border-b border-brand-gray-800 pb-2">
                <span className="text-xs font-semibold text-brand-gray-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-brand-emerald" /> Live A4 Preview
                </span>
                <span className="text-[10px] font-mono text-brand-gray-500">
                  Standard Letter / A4 Print Area
                </span>
              </div>
              <CVPreview data={watchedValues} styleConfig={styleConfig} />
            </div>

          </div>

        </section>

        {/* BOTTOM CTA: Portfolio developer pitch */}
        <section className="px-6 md:px-12 max-w-5xl mx-auto pt-24 pb-6 text-center">
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-brand-card/70 via-brand-dark to-brand-card/40 border border-brand-gray-800/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-blue/5 blur-[50px] rounded-full pointer-events-none -z-10"></div>
            
            <div className="max-w-2xl mx-auto space-y-5">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">
                Want a portfolio website with smart career tools?
              </h2>
              <p className="text-sm md:text-base text-brand-gray-400 leading-relaxed">
                I build modern, responsive, and conversion-focused web experiences with custom integrations, 3D interactive visuals, and SEO excellence.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <a
                  href="/#contact"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  Contact Me
                </a>
                <a
                  href="/portfolio"
                  className="px-6 py-2.5 rounded-full border border-brand-gray-800 bg-brand-dark hover:bg-brand-card text-brand-gray-300 hover:text-white transition-colors text-sm font-semibold"
                >
                  View My Work
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* MOBILE STICKY TOGGLE BUTTON */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)}
          className="p-4 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark shadow-[0_4px_20px_rgba(16,185,129,0.4)] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label={mobilePreviewOpen ? "Close Live Preview" : "Show Live Preview"}
        >
          {mobilePreviewOpen ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE FULL-SCREEN PREVIEW OVERLAY */}
      <AnimatePresence>
        {mobilePreviewOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-md pt-20 pb-6 px-4 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-brand-gray-800 pb-3 mb-4">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-brand-emerald" /> Mobile CV Preview
              </span>
              <button
                onClick={() => setMobilePreviewOpen(false)}
                className="px-3 py-1.5 rounded-md bg-brand-card hover:bg-brand-gray-800 border border-brand-gray-800 text-brand-gray-400 hover:text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
            
            <div className="flex-grow flex items-center justify-center p-1 overflow-x-auto">
              <div className="w-full max-w-[500px]">
                <CVPreview data={watchedValues} styleConfig={styleConfig} />
              </div>
            </div>
            
            <div className="pt-4 flex gap-2">
              <button
                onClick={() => {
                  setMobilePreviewOpen(false);
                  handlePrint();
                }}
                className="flex-grow h-11 rounded-lg bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-bold text-sm flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save PDF</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

    </div>
  );
}
