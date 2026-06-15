"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Check, 
  Eye, RefreshCw, Undo, Printer
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CVForm from "./CVForm";
import CVPreview from "./CVPreview";
import TemplateSelector from "./TemplateSelector";
import ATSScoreChecker from "./ATSScoreChecker";
import CVUploadConverter from "./CVUploadConverter";

import { cvSchema, CVFormValues } from "../../lib/cvSchema";
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
  const [showUploadAnotherConfirm, setShowUploadAnotherConfirm] = useState(false);
  const [highlightMissing, setHighlightMissing] = useState(false);

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
  
  // DB sync check removed to simplify options

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
                  </div>

                  {/* Actions buttons panel */}
                  <div className="flex flex-wrap items-center justify-end gap-2.5 w-full lg:w-auto relative z-10">
                    {/* Return upload gateways */}
                    <div className="relative w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setShowUploadAnotherConfirm(!showUploadAnotherConfirm)}
                        className="w-full sm:w-auto h-10 px-4 rounded-xl border border-white/5 bg-brand-card/40 hover:bg-brand-card/70 text-xs text-brand-gray-300 hover:text-white transition-all shadow-sm flex items-center justify-center gap-1.5 font-semibold hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Undo className="w-4 h-4 text-brand-gray-400" />
                        <span>Upload Another CV</span>
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

                    {/* View Updated CV */}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          setMobileTab("preview");
                          setTimeout(() => {
                            document.getElementById("cv-preview-sheet")?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 150);
                        } else {
                          document.getElementById("cv-preview-sheet")?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }}
                      className="h-10 px-4 rounded-xl border border-white/5 bg-brand-card/40 hover:bg-brand-card/70 text-xs font-semibold text-brand-gray-300 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4 text-brand-blue" />
                      <span>View Updated CV</span>
                    </button>

                    {/* Download Updated CV */}
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="h-10 px-4.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Download Updated CV</span>
                    </button>
                  </div>
                </div>

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
                    type="button"
                    onClick={() => {
                      if (window.confirm("Uploading another CV will clear your active workspace data. Are you sure?")) {
                        handleUploadAnother();
                      }
                    }}
                    className="flex-1 h-11 border border-brand-gray-800 bg-brand-card rounded-xl text-[10px] sm:text-xs font-semibold text-brand-gray-300 hover:text-white flex items-center justify-center gap-1.5"
                  >
                    <Undo className="w-4 h-4 text-brand-gray-400" />
                    <span>Upload CV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileTab("preview");
                      setTimeout(() => {
                        document.getElementById("cv-preview-sheet")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 150);
                    }}
                    className="flex-1 h-11 border border-brand-gray-850 bg-brand-dark rounded-xl text-[10px] sm:text-xs font-semibold text-brand-gray-300 hover:text-white flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-brand-blue" />
                    <span>View Updated CV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 h-11 bg-gradient-to-r from-brand-emerald to-brand-blue rounded-xl text-[10px] sm:text-xs font-bold text-brand-dark flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Download CV</span>
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
