"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Trash2, Check, 
  Eye, RefreshCw, Undo, FileDown
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CVForm from "./CVForm";
import CVPreview from "./CVPreview";
import TemplateSelector from "./TemplateSelector";
import ATSScoreChecker from "./ATSScoreChecker";
import CVUploadConverter from "./CVUploadConverter";
import DownloadPDFButton from "./DownloadPDFButton";

import { cvSchema, CVFormValues } from "../../lib/cvSchema";
import { sampleCVData } from "../../lib/sampleCVData";
import { CVStyleConfig, CVData } from "../../types/cv";

const defaultStyleConfig: CVStyleConfig = {
  templateId: "classic",
  fontSize: "md",
  spacing: "normal",
  accentColor: "emerald",
  fontFamily: "Inter",
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
    profileImage: "",
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
  // Navigation & Gateway states: "initial" | "scratch" | "upload" | "workspace"
  const [appMode, setAppMode] = useState<"initial" | "upload" | "workspace">("initial");
  const [styleConfig, setStyleConfig] = useState<CVStyleConfig>(defaultStyleConfig);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview" | "ats">("edit");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "saving">("idle");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showUploadAnotherConfirm, setShowUploadAnotherConfirm] = useState(false);
  const [highlightMissing, setHighlightMissing] = useState(false);
  
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
  
  // Watch all values to feed directly to live preview and ATSScoreChecker
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
                setAppMode("workspace");
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

  // Load initial draft from localStorage if it exists and we aren't fetching a cloud resume
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("syncId")) return; 

      const savedDraft = localStorage.getItem("mibz-cv-draft");
      const savedStyles = localStorage.getItem("mibz-cv-styles");
      
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          reset(parsed);
          setAppMode("workspace"); // Jump directly to workspace if user has a saved draft
        } catch (e) {
          console.error("Error parsing CV draft", e);
        }
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

  // Auto-save draft on data changes (Only triggers if workspace is active)
  useEffect(() => {
    if (typeof window !== "undefined" && appMode === "workspace") {
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
  }, [watchedValues, styleConfig, appMode]);

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

  // Start fresh from scratch
  const handleCreateFromScratch = () => {
    reset(emptyCVData);
    setAppMode("workspace");
    scrollToBuilder();
  };



  // Handle successful file parsing
  const handleParseComplete = (parsedData: CVData) => {
    reset(parsedData);
    setAppMode("workspace");
    scrollToBuilder();
  };

  // Reset current changes to blank state or template sample
  const handleReset = () => {
    reset(sampleCVData);
    setShowResetConfirm(false);
  };

  // Clear fields completely
  const handleClearAll = () => {
    reset(emptyCVData);
    localStorage.removeItem("mibz-cv-draft");
    setShowClearConfirm(false);
  };

  // Triggers upload gateway again
  const handleUploadAnother = () => {
    reset(emptyCVData);
    localStorage.removeItem("mibz-cv-draft");
    setAppMode("upload");
    setShowUploadAnotherConfirm(false);
  };

  // Scroll to Builder Container
  const scrollToBuilder = () => {
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
    
    const safeName = (watchedValues.personalInfo?.fullName || "Untitled").trim().replace(/\s+/g, "-");
    downloadAnchor.download = `${safeName}-ATS-CV.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
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
      Georgia: "Georgia, Cambria, 'Times New Roman', Times, serif",
      Inter: "Inter, sans-serif",
      Outfit: "Outfit, sans-serif",
      Poppins: "Poppins, sans-serif",
      Lora: "Lora, serif"
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
  <title>${watchedValues.personalInfo?.fullName || "Resume"} - CV</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
    
    const safeName = (watchedValues.personalInfo?.fullName || "Untitled").trim().replace(/\s+/g, "-");
    downloadAnchor.download = `${safeName}-ATS-CV.html`;
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
        setAppMode("workspace");
      } catch {
        alert("Failed to parse JSON file. Make sure it is a valid CV backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-between selection:bg-brand-emerald/30 selection:text-brand-emerald text-foreground antialiased relative">
      
      {/* Dynamic highlighting styles for missing empty inputs */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes highlightPulse {
          0%, 100% { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.1); }
          50% { border-color: rgba(239, 68, 68, 0.85); box-shadow: 0 0 8px 2px rgba(239, 68, 68, 0.15); }
        }
        .highlight-missing input:placeholder-shown:not([type="checkbox"]),
        .highlight-missing textarea:placeholder-shown {
          animation: highlightPulse 1.5s infinite ease-in-out !important;
          background-color: rgba(239, 68, 68, 0.03) !important;
        }
      `}} />

      <Navbar />

      {/* Main Container */}
      <main id="main-content" className="flex-grow z-10 pt-24 pb-16">
        
        {/* HERO HEADER */}
        {appMode !== "initial" && (
          <section className="relative px-6 md:px-12 max-w-7xl mx-auto py-8 text-center overflow-hidden no-print">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-emerald/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3 max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-emerald/20 bg-brand-emerald/5 text-brand-emerald text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                100% Recruiter Safe & Selectable Text
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-white leading-tight">
                ATS Friendly <span className="bg-gradient-to-r from-brand-emerald to-brand-blue bg-clip-text text-transparent">CV Maker</span>
              </h1>

              <p className="text-xs md:text-sm text-brand-gray-400 max-w-2xl mx-auto leading-relaxed">
                Check your ATS score in real-time, edit the content directly in the builder, and export a clean recruiter-friendly resume.
              </p>
            </motion.div>
          </section>
        )}

        {/* 2. CHOICE INITIAL GATEWAY */}
        <section ref={builderRef} className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
          <AnimatePresence mode="wait">
            
            {appMode === "initial" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6 md:py-12"
              >
                {/* Left Hero Content */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-emerald/20 bg-brand-emerald/5 text-brand-emerald text-xs font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
                    </span>
                    <span>62,938 resumes created today</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight text-white leading-tight">
                    Create an <span className="bg-gradient-to-r from-brand-emerald to-brand-blue bg-clip-text text-transparent">ATS-friendly</span> resume, get hired faster
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-brand-gray-400 max-w-xl leading-relaxed">
                    Tired of never hearing back? Make a resume that passes the Applicant Tracking System (ATS) and get your talent noticed by recruiters.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={handleCreateFromScratch}
                      className="px-7 py-4 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-bold text-xs sm:text-sm hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(16,185,129,0.2)] flex items-center gap-2"
                    >
                      Create ATS Resume Now
                    </button>
                    <button
                      onClick={() => setAppMode("upload")}
                      className="px-7 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-heading font-semibold text-xs sm:text-sm hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      Improve My Resume
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 max-w-md">
                    <div className="space-y-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-brand-emerald font-heading">48%</span>
                      <p className="text-xs text-brand-gray-400 font-medium">more likely to get hired</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-brand-blue font-heading">12%</span>
                      <p className="text-xs text-brand-gray-400 font-medium">better pay with your next job</p>
                    </div>
                  </div>
                </div>

                {/* Right Visual Graphic Mockup */}
                <div className="lg:col-span-5 relative w-full flex justify-center items-center">
                  <div className="relative w-full max-w-[380px] aspect-[1/1.25] p-3 bg-brand-card/25 border border-white/5 rounded-3xl backdrop-blur-md flex items-center justify-center shadow-2xl relative z-10 overflow-visible">
                    
                    {/* Glowing Blur behind graphic */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-brand-emerald/10 to-brand-blue/10 rounded-3xl blur-[40px] -z-10 pointer-events-none" />
                    
                    {/* Mockup A4 Resume Sheet */}
                    <div className="w-[85%] aspect-[1/1.414] bg-white text-black p-4.5 sm:p-5 shadow-2xl rounded-lg border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between select-none">
                      <div className="space-y-2.5">
                        <div className="text-center space-y-1 pb-2 border-b border-gray-100">
                          <div className="h-3 w-28 bg-gray-900 rounded mx-auto"></div>
                          <div className="h-2 w-16 bg-gray-400 rounded mx-auto"></div>
                          <div className="h-1.5 w-24 bg-gray-300 rounded mx-auto"></div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="h-2 w-12 bg-gray-900 rounded"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                            <div className="h-1.5 w-[85%] bg-gray-100 rounded"></div>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="h-2 w-16 bg-gray-900 rounded"></div>
                          <div className="space-y-1">
                            <div className="flex gap-2 justify-between">
                              <div className="h-1.5 w-20 bg-gray-800 rounded"></div>
                              <div className="h-1 w-10 bg-gray-300 rounded"></div>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                            <div className="h-1.5 w-[90%] bg-gray-100 rounded"></div>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="h-2 w-10 bg-gray-900 rounded"></div>
                          <div className="flex gap-1 flex-wrap">
                            <div className="h-3 w-10 bg-gray-50 border border-gray-100 rounded-sm"></div>
                            <div className="h-3 w-12 bg-gray-50 border border-gray-100 rounded-sm"></div>
                            <div className="h-3 w-8 bg-gray-50 border border-gray-100 rounded-sm"></div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-1.5 flex justify-between items-center text-[5px] text-gray-400 font-mono">
                        <span>A4 STANDARD FORMAT</span>
                        <span>SELECTABLE TEXT</span>
                      </div>
                    </div>

                    {/* Floating ATS Score Ring Card */}
                    <div className="absolute top-6 -left-10 bg-white/95 backdrop-blur-sm border border-gray-100 p-2.5 rounded-2xl shadow-xl flex flex-col items-center gap-1 transform -rotate-6 scale-95 sm:scale-100 hover:scale-105 transition-transform duration-300 select-none">
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-100"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-brand-emerald"
                            strokeDasharray="100, 100"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-[8px] font-bold text-gray-900">100%</span>
                      </div>
                      <span className="text-[7px] font-bold text-gray-800 uppercase tracking-wider animate-pulse">ATS friendly</span>
                    </div>

                    {/* Floating PDF download tag */}
                    <div className="absolute top-1/3 -right-8 w-10 h-10 bg-red-500 rounded-xl shadow-xl flex items-center justify-center text-white font-bold text-[10px] tracking-tight transform rotate-12 hover:scale-115 transition-transform duration-300">
                      PDF
                    </div>

                    {/* Floating JSON data tag */}
                    <div className="absolute bottom-16 -left-6 w-10 h-10 bg-brand-blue rounded-xl shadow-xl flex items-center justify-center text-white font-bold text-[10px] tracking-tight transform -rotate-12 hover:scale-115 transition-transform duration-300">
                      JSON
                    </div>

                    {/* Floating HTML format tag */}
                    <div className="absolute bottom-6 -right-6 w-10 h-10 bg-brand-emerald rounded-xl shadow-xl flex items-center justify-center text-brand-dark font-bold text-[10px] tracking-tight transform rotate-6 hover:scale-115 transition-transform duration-300">
                      HTML
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CONVERTER COMPONENT INTERFACE */}
            {appMode === "upload" && (
              <CVUploadConverter
                onParseComplete={handleParseComplete}
                onCancel={() => setAppMode("initial")}
              />
            )}

            {/* 4. WORKSPACE DASHBOARD */}
            {appMode === "workspace" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                
                {/* TOOLBAR/CONTROL PANEL */}
                <div className="bg-brand-card/30 backdrop-blur-md border border-white/5 shadow-lg rounded-2xl p-5 flex flex-col lg:flex-row items-center justify-between gap-5 relative overflow-visible no-print">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-emerald/5 via-transparent to-brand-blue/5 pointer-events-none" />
                  
                  {/* Draft autosave and general actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto relative z-10">
                    <div className="text-left">
                      <h2 className="text-xs font-bold text-white flex items-center gap-2 tracking-wider uppercase">
                        CV Builder Workspace
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
                        </span>
                      </h2>
                      
                      <div className="text-[10px] font-mono text-brand-gray-400 flex items-center gap-2 mt-1">
                        {saveStatus === "saving" && (
                          <span className="text-brand-blue flex items-center gap-1.5 font-semibold">
                            <RefreshCw className="w-3 h-3 animate-spin text-brand-blue" /> Auto-saving...
                          </span>
                        )}
                        {saveStatus === "saved" && (
                          <span className="text-brand-emerald flex items-center gap-1.5 font-semibold">
                            <Check className="w-3 h-3 text-brand-emerald" /> Stored locally
                          </span>
                        )}
                        {saveStatus === "idle" && (
                          <span className="text-brand-gray-500 font-medium">Draft saved</span>
                        )}
                      </div>
                    </div>

                    <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

                    {/* Return upload gateways */}
                    <div className="relative w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setShowUploadAnotherConfirm(!showUploadAnotherConfirm)}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-white/5 bg-brand-card/40 hover:bg-brand-card/70 text-xs text-brand-gray-300 hover:text-white transition-all shadow-sm flex items-center justify-center gap-1.5 font-semibold hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Upload Another CV
                      </button>

                      {showUploadAnotherConfirm && (
                        <div className="absolute left-0 top-12 w-64 bg-brand-card border border-white/10 rounded-2xl p-4 shadow-2xl z-20 space-y-3 backdrop-blur-lg">
                          <p className="text-xs text-brand-gray-300 leading-normal">
                            Uploading another CV will clear your active workspace data. Are you sure?
                          </p>
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setShowUploadAnotherConfirm(false)}
                              className="px-3 py-1 rounded-lg bg-white/5 text-[10px] text-brand-gray-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleUploadAnother}
                              className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-650 text-white text-[10px] font-bold transition-colors"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons panel */}
                  <div className="flex flex-wrap items-center justify-end gap-2.5 w-full lg:w-auto relative z-10">
                    {/* Backup importer */}
                    <label className="h-10 px-4 rounded-xl bg-brand-card/40 hover:bg-brand-card/70 border border-white/5 text-brand-gray-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
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

                    {/* Reset actions */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(!showResetConfirm)}
                        className="h-10 px-4 rounded-xl border border-white/5 bg-brand-card/40 text-brand-gray-400 hover:text-white text-xs font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-brand-card/70"
                        title="Reset to sample templates"
                      >
                        Reset Changes
                      </button>
                      
                      {showResetConfirm && (
                        <div className="absolute right-0 top-12 w-56 bg-brand-card border border-white/10 rounded-2xl p-4 shadow-2xl z-20 space-y-3 backdrop-blur-lg">
                          <p className="text-xs text-brand-gray-300 leading-normal">
                            Reset all details to the sample resume data?
                          </p>
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setShowResetConfirm(false)}
                              className="px-3 py-1 rounded-lg bg-white/5 text-[10px] text-brand-gray-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleReset}
                              className="px-3 py-1 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-[10px] font-semibold transition-colors"
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Clear completely */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(!showClearConfirm)}
                        className="h-10 px-4 rounded-xl border border-red-500/15 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear All</span>
                      </button>

                      {showClearConfirm && (
                        <div className="absolute right-0 top-12 w-56 bg-brand-card border border-white/10 rounded-2xl p-4 shadow-2xl z-20 space-y-3 backdrop-blur-lg">
                          <p className="text-xs text-brand-gray-300 leading-normal">
                            Are you sure you want to clear all CV fields? This draft will be deleted.
                          </p>
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setShowClearConfirm(false)}
                              className="px-3 py-1 rounded-lg bg-white/5 text-[10px] text-brand-gray-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleClearAll}
                              className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cloud Sync active share banner */}
                {dbConfigured && syncId && (
                  <div className="bg-brand-card/30 backdrop-blur-md border border-white/5 shadow-md rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs relative overflow-hidden no-print">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-emerald/5 to-transparent pointer-events-none" />
                    
                    <div className="space-y-1 text-left w-full relative z-10">
                      <span className="font-bold text-white text-sm flex items-center gap-2">
                        {cloudSyncStatus === "synced" ? "🚀 Cloud Synchronization Active" : "☁️ Real-time Cloud Backups Enabled"}
                      </span>
                      <p className="text-brand-gray-400 leading-relaxed max-w-2xl">
                        Your CV draft sync token: <code className="text-brand-emerald bg-brand-dark/80 border border-white/5 px-2 py-0.5 rounded-lg font-mono font-bold text-[11px]">{syncId}</code>. 
                        {cloudSyncStatus === "synced" 
                          ? "Retrieve or edit it on any browser using the sharing link below:" 
                          : "Save your work to the database to generate a unique sharing link."}
                      </p>
                      {cloudSyncStatus === "synced" && (
                        <div className="bg-brand-dark/70 border border-white/5 px-3 py-2 rounded-xl text-brand-blue hover:text-brand-blue/80 transition-colors flex items-center gap-2 break-all select-all font-mono font-medium mt-2 w-full sm:w-auto">
                          {typeof window !== "undefined" ? `${window.location.origin}/cv-maker?syncId=${syncId}` : ""}
                        </div>
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
                        className="w-full sm:w-auto h-9 px-4 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-blue hover:opacity-90 text-brand-dark font-heading font-bold transition-opacity flex items-center justify-center gap-1.5 flex-shrink-0 relative z-10"
                      >
                        Copy Link
                      </button>
                    )}
                  </div>
                )}

                {/* Sync error banner */}
                {cloudSyncError && (
                  <div className="bg-red-500/5 border border-red-500/15 backdrop-blur-sm rounded-2xl p-4 text-xs text-red-400 flex items-center gap-2.5 no-print">
                    ⚠️ <strong>Database sync failed:</strong> {cloudSyncError}
                  </div>
                )}

                {/* MOBILE VIEW NAVIGATION TABS */}
                <div className="lg:hidden flex p-1 bg-brand-card/60 backdrop-blur-md border border-white/5 rounded-2xl relative my-3 no-print">
                  <button
                    type="button"
                    onClick={() => setMobileTab("edit")}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all relative z-10 text-center focus:outline-none"
                  >
                    <span className={mobileTab === "edit" ? "text-brand-emerald font-extrabold transition-all" : "text-brand-gray-400 transition-all"}>Edit Form</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab("preview")}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all relative z-10 text-center focus:outline-none"
                  >
                    <span className={mobileTab === "preview" ? "text-brand-emerald font-extrabold transition-all" : "text-brand-gray-400 transition-all"}>Live Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab("ats")}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all relative z-10 text-center focus:outline-none"
                  >
                    <span className={mobileTab === "ats" ? "text-brand-emerald font-extrabold transition-all" : "text-brand-gray-400 transition-all"}>ATS Score</span>
                  </button>
                  
                  {/* Sliding Highlight Pill */}
                  <motion.div
                    className="absolute top-1 bottom-1 rounded-xl bg-brand-emerald/10 border border-brand-emerald/25 -z-0"
                    initial={false}
                    animate={{
                      left: mobileTab === "edit" ? "4px" : mobileTab === "preview" ? "calc(33.33% + 2px)" : "calc(66.66% + 2px)",
                      width: "calc(33.33% - 6px)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                </div>

                {/* WORKSPACE CONTENT GRID */}
                <div className="workspace-grid grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* LEFT / EDIT & STYLE CUSTOMIZER COLUMN */}
                  <div className={`lg:col-span-8 space-y-6 ${mobileTab === "edit" ? "block" : "hidden lg:block"} no-print`}>
                    
                    {/* Template styles */}
                    <TemplateSelector config={styleConfig} onChange={setStyleConfig} />

                    {/* Forms wrapper */}
                    <FormProvider {...methods}>
                      <form onSubmit={(e) => e.preventDefault()} className={`space-y-4 ${highlightMissing ? "highlight-missing" : ""}`}>
                        <CVForm />
                      </form>
                    </FormProvider>
                  </div>

                  {/* RIGHT / OUTPUT SIDEBAR (PREVIEW & ATS) */}
                  <div className={`preview-column lg:col-span-4 lg:sticky lg:top-24 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar pr-1 ${mobileTab === "preview" || mobileTab === "ats" ? "block" : "hidden lg:block"}`}>
                    
                    {/* ATS Score (Stacked at top on desktop, or under ats tab on mobile) */}
                    <div className={`no-print ${mobileTab === "ats" ? "block" : "hidden lg:block"}`}>
                      <ATSScoreChecker 
                        data={watchedValues}
                        onHighlightMissingFields={setHighlightMissing}
                      />
                    </div>
                    
                    {/* Live Preview (Stacked below ATS on desktop, or under preview tab on mobile) */}
                    <div className={`cv-preview-wrapper ${mobileTab === "preview" ? "block" : "hidden lg:block"}`}>
                      <div className="hidden lg:flex items-center justify-between border-b border-brand-gray-800 pb-2 mb-3 no-print">
                        <span className="text-[10px] font-semibold text-brand-gray-400 tracking-wider uppercase flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-brand-emerald" /> Live A4 Preview
                        </span>
                        <span className="text-[9px] font-mono text-brand-gray-500">
                          Standard Letter / A4 Print
                        </span>
                      </div>
                      <CVPreview data={watchedValues} styleConfig={styleConfig} />
                    </div>

                  </div>

                </div>

                {/* MOBILE VIEW ACTIONS */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-brand-dark/95 border-t border-brand-gray-800 p-4 z-40 flex items-center justify-between gap-3 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] no-print">
                  <button
                    onClick={() => {
                      localStorage.setItem("mibz-cv-draft", JSON.stringify(watchedValues));
                      alert("Draft saved successfully!");
                    }}
                    className="flex-1 h-11 border border-brand-gray-800 bg-brand-card rounded-xl text-xs font-semibold text-white"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => setMobileTab("preview")}
                    className="h-11 px-4 border border-brand-gray-850 bg-brand-dark rounded-xl text-brand-gray-300"
                    title="Preview Layout"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex-[2] h-11 bg-gradient-to-r from-brand-emerald to-brand-blue rounded-xl text-xs font-bold text-brand-dark flex items-center justify-center gap-1.5"
                  >
                    <FileDown className="w-4.5 h-4.5" />
                    <span>Download PDF</span>
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </section>

        {/* BOTTOM DEVELOPER CTA */}
        <section className="px-6 md:px-12 max-w-5xl mx-auto pt-20 pb-6 text-center no-print">
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-brand-card/70 via-brand-dark to-brand-card/40 border border-brand-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-blue/5 blur-[50px] rounded-full pointer-events-none -z-10"></div>
            
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                Looking for automated web solutions?
              </h2>
              <p className="text-xs md:text-sm text-brand-gray-400 leading-relaxed">
                I design premium, conversion-focused websites featuring advanced cloud-linked tools, dynamic search checkers, and search engine optimizations.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="/#contact"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-semibold text-xs transition-opacity hover:opacity-90 flex items-center gap-1"
                >
                  Contact Me
                </a>
                <a
                  href="/portfolio"
                  className="px-5 py-2.5 rounded-full border border-brand-gray-800 bg-brand-dark hover:bg-brand-card text-brand-gray-300 hover:text-white transition-colors text-xs font-semibold"
                >
                  View Portfolios
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

    </div>
  );
}
