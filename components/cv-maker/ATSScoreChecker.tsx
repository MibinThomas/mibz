import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, ArrowDown, HelpCircle, Highlighter, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CVData } from "../../types/cv";
import { ACTION_VERBS } from "../../lib/resumeParser";

interface ATSScoreCheckerProps {
  data: CVData;
  onHighlightMissingFields?: (highlight: boolean) => void;
}

export default function ATSScoreChecker({ data, onHighlightMissingFields }: ATSScoreCheckerProps) {
  const [showAutoTips, setShowAutoTips] = useState<Record<string, boolean>>({});
  const [highlightActive, setHighlightActive] = useState(false);

  // 1. Scoring Logic calculations
  let score = 0;
  const breakdown: { name: string; max: number; current: number; passed: boolean; tip: string; id: string }[] = [];

  // Personal Contact details
  const p = data.personalInfo;
  const hasContact = !!(p.fullName && p.email && p.phone && p.location);
  const contactPoints = hasContact ? 10 : 0;
  score += contactPoints;
  breakdown.push({
    id: "personalInfo-section",
    name: "Contact Information",
    max: 10,
    current: contactPoints,
    passed: hasContact,
    tip: "Fill in your full name, email, phone number, and location address.",
  });

  // LinkedIn or Portfolio Links
  const hasLinks = !!(p.linkedinUrl || p.portfolioUrl || p.githubUrl);
  const linkPoints = hasLinks ? 5 : 0;
  score += linkPoints;
  breakdown.push({
    id: "personalInfo-section",
    name: "LinkedIn / Portfolio Link",
    max: 5,
    current: linkPoints,
    passed: hasLinks,
    tip: "Add your LinkedIn profile, GitHub, or professional website link.",
  });

  // Summary check
  const summaryLines = data.summary ? data.summary.split(/\n+/).length : 0;
  const summaryValid = !!data.summary && summaryLines <= 5 && data.summary.length > 50;
  const summaryPoints = summaryValid ? 10 : 0;
  score += summaryPoints;
  breakdown.push({
    id: "summary-section",
    name: "Professional Summary",
    max: 10,
    current: summaryPoints,
    passed: summaryValid,
    tip: data.summary 
      ? (summaryLines > 5 ? "Your summary is too long (keep it under 5 lines/paragraphs)." : "Your summary is too short (aim for 3-5 lines).") 
      : "Add a professional summary of 3-5 lines describing your core expertise.",
  });

  // Work Experience Check
  const hasExp = data.experience.length > 0;
  const expPoints = hasExp ? 15 : 0;
  score += expPoints;
  breakdown.push({
    id: "experience-section",
    name: "Work Experience",
    max: 15,
    current: expPoints,
    passed: hasExp,
    tip: "Add at least one professional work experience entry.",
  });

  // Experience Bullet points
  const allHasBullets = hasExp && data.experience.every(e => e.description && e.description.split(/\n+/).filter(b => b.trim().length > 0).length >= 1);
  const bulletPoints = allHasBullets ? 10 : 0;
  score += bulletPoints;
  breakdown.push({
    id: "experience-section",
    name: "Result-focused Bullet Points",
    max: 10,
    current: bulletPoints,
    passed: allHasBullets,
    tip: "Describe your job achievements in bullet points rather than long paragraphs.",
  });

  // Action Verbs
  let hasActionVerbs = false;
  let detectedActionVerbsCount = 0;
  if (hasExp) {
    const fullText = data.experience.map(e => e.description).join(" ").toLowerCase();
    const matches = ACTION_VERBS.filter(verb => new RegExp(`\\b${verb}`, 'i').test(fullText));
    detectedActionVerbsCount = matches.length;
    hasActionVerbs = matches.length >= 3;
  }
  const verbPoints = hasActionVerbs ? 10 : 0;
  score += verbPoints;
  breakdown.push({
    id: "experience-section",
    name: "Action Verbs & Achievements",
    max: 10,
    current: verbPoints,
    passed: hasActionVerbs,
    tip: `Include action verbs (e.g. managed, developed, optimized, engineered). Found ${detectedActionVerbsCount} matches (aim for at least 3).`,
  });

  // Skills check
  const skillsCount = data.skills.length;
  const skillsValid = skillsCount >= 5;
  const skillsPoints = skillsValid ? 10 : 0;
  score += skillsPoints;
  breakdown.push({
    id: "skills-section",
    name: "Relevant Skills",
    max: 10,
    current: skillsPoints,
    passed: skillsValid,
    tip: `Add at least 5-10 role-specific skill tags. Currently you have ${skillsCount} skills.`,
  });

  // Education check
  const hasEdu = data.education.length > 0;
  const eduPoints = hasEdu ? 10 : 0;
  score += eduPoints;
  breakdown.push({
    id: "education-section",
    name: "Education History",
    max: 10,
    current: eduPoints,
    passed: hasEdu,
    tip: "Add your academic history or highest educational degree.",
  });

  // Projects or Certifications check
  const hasProjOrCert = data.projects.length > 0 || data.certifications.length > 0;
  const projCertPoints = hasProjOrCert ? 10 : 0;
  score += projCertPoints;
  breakdown.push({
    id: "projects-section",
    name: "Projects / Certifications",
    max: 10,
    current: projCertPoints,
    passed: hasProjOrCert,
    tip: "Add certifications (AWS, Google, PMI) or key projects to prove practical skills.",
  });

  // Formatting Safety (Template always safe)
  const formattingPoints = 10;
  score += formattingPoints;
  breakdown.push({
    id: "template-selector-section",
    name: "ATS-Safe Formatting",
    max: 10,
    current: formattingPoints,
    passed: true,
    tip: "You are using an approved single-column layout without tables, graphics, or text-boxes that break parsers.",
  });

  // Rating Categories mapping
  let scoreColor = "text-red-500 border-red-500/20 bg-red-500/5";
  let scoreProgressColor = "stroke-red-500";
  let scoreLabel = "Weak, Needs Major Fixes";
  let scoreDesc = "Your resume has critical formatting or content gaps that may cause ATS scanners to reject it.";

  if (score >= 85) {
    scoreColor = "text-brand-emerald border-brand-emerald/20 bg-brand-emerald/5";
    scoreProgressColor = "stroke-brand-emerald";
    scoreLabel = "Excellent ATS Friendly CV";
    scoreDesc = "Excellent structure! Your resume is single-column, rich in keywords, and 100% recruiter-safe.";
  } else if (score >= 70) {
    scoreColor = "text-brand-blue border-brand-blue/20 bg-brand-blue/5";
    scoreProgressColor = "stroke-brand-blue";
    scoreLabel = "Good, Needs Minor Improvements";
    scoreDesc = "Very solid foundation. Address the checklist warning items below to achieve a perfect ATS score.";
  } else if (score >= 50) {
    scoreColor = "text-amber-500 border-amber-500/20 bg-amber-500/5";
    scoreProgressColor = "stroke-amber-500";
    scoreLabel = "Average, Needs Improvements";
    scoreDesc = "Considerable gaps in information or description formats. Review bullet points and action words.";
  }

  // Scroll handler to scroll directly to form container sections
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      
      // Flash the background of the form to attract focus
      el.classList.add("ring-2", "ring-brand-emerald", "ring-offset-2", "ring-offset-brand-dark");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-brand-emerald", "ring-offset-2", "ring-offset-brand-dark");
      }, 1500);
    }
  };

  const toggleTip = (id: string) => {
    setShowAutoTips(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleHighlightClick = () => {
    if (onHighlightMissingFields) {
      const state = !highlightActive;
      setHighlightActive(state);
      onHighlightMissingFields(state);
    }
  };

  // SVG parameters
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-brand-card/50 border border-brand-gray-800 rounded-2xl p-5 space-y-6 text-left relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-brand-emerald/3 blur-[45px] rounded-full pointer-events-none"></div>

      {/* HEADER WITH HIGHLIGHT TOOL */}
      <div className="flex items-center justify-between border-b border-brand-gray-800 pb-3">
        <div>
          <h3 className="font-heading font-bold text-white text-base flex items-center gap-1.5">
            ATS Score Checker
          </h3>
          <p className="text-[10px] text-brand-gray-400">Live score based on parser algorithms</p>
        </div>

        {onHighlightMissingFields && (
          <button
            onClick={handleHighlightClick}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              highlightActive 
                ? "bg-brand-emerald/10 border-brand-emerald text-brand-emerald shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                : "border-brand-gray-800 bg-brand-dark text-brand-gray-300 hover:text-white"
            }`}
            title="Highlight empty inputs in form workspace"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>{highlightActive ? "Clear highlights" : "Highlight Gaps"}</span>
          </button>
        )}
      </div>

      {/* CIRCULAR GAUGE PANEL */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-brand-dark/40 border border-brand-gray-850">
        
        {/* SVG Circle */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-brand-gray-800"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active score bar */}
            <motion.circle
              cx="56"
              cy="56"
              r={radius}
              className={`${scoreProgressColor} transition-all duration-500`}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-bold font-mono text-white leading-none block">{score}</span>
            <span className="text-[9px] text-brand-gray-400 block font-semibold mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Score metrics */}
        <div className="space-y-1 text-center sm:text-left">
          <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${scoreColor}`}>
            {scoreLabel}
          </span>
          <p className="text-[11px] text-brand-gray-300 leading-relaxed pt-1">
            {scoreDesc}
          </p>
        </div>
      </div>

      {/* DETAILED CHECKLIST GATEWAY */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-brand-gray-300 flex items-center justify-between px-1">
          <span>ATS Checklist</span>
          <span className="text-[10px] font-mono font-normal text-brand-gray-400">Section details</span>
        </h4>

        <div className="space-y-1.5">
          {breakdown.map((item, index) => {
            const hasTip = showAutoTips[item.name];

            return (
              <div
                key={index}
                className="bg-brand-dark/20 border border-brand-gray-850/60 rounded-xl p-2.5 space-y-2 hover:border-brand-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                    ) : item.max > 5 ? (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs font-semibold ${item.passed ? "text-brand-gray-200" : "text-brand-gray-300"}`}>
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-brand-gray-400">
                      +{item.current}/{item.max}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleTip(item.name)}
                      className="p-1 rounded text-brand-gray-400 hover:text-white hover:bg-brand-gray-800/50 transition-colors cursor-pointer"
                      title="Show improvement suggestions"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                    {!item.passed && (
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className="p-1 rounded text-brand-blue hover:text-white hover:bg-brand-blue/10 transition-colors cursor-pointer"
                        title="Scroll to edit section"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible auto-improve details */}
                <AnimatePresence>
                  {hasTip && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[10px] text-brand-gray-400 border-t border-brand-gray-800/40 pt-2 leading-relaxed mt-1">
                        💡 <strong>Improvement tip:</strong> {item.tip}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK AUTO IMPROVEMENTS SUMMARY */}
      {score < 100 && (
        <div className="border-t border-brand-gray-800 pt-4 space-y-2.5">
          <h4 className="text-xs font-bold text-white flex items-center gap-1 px-1">
            <Search className="w-3.5 h-3.5 text-brand-blue" />
            <span>Score Fix Suggestions</span>
          </h4>
          
          <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-xl p-3.5 text-xs text-brand-gray-300 leading-relaxed space-y-2">
            <span className="font-semibold text-brand-blue block">Action Checklist to reach 100%:</span>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-brand-gray-300">
              {!hasContact && (
                <li>Missing contact details. Double check your <strong>name, email, phone, location</strong>.</li>
              )}
              {!hasLinks && (
                <li>Increase recruiter engagement: Add your <strong>LinkedIn or GitHub profile link</strong>.</li>
              )}
              {!summaryValid && (
                <li>Professional Summary: Add a profile summary strictly between <strong>3 to 5 lines</strong>.</li>
              )}
              {!hasExp && (
                <li>No employment history found. List at least <strong>one work experience entry</strong>.</li>
              )}
              {hasExp && !allHasBullets && (
                <li>Work entries require layout spacing: Describe details using <strong>bullet points</strong>, not paragraphs.</li>
              )}
              {hasExp && !hasActionVerbs && (
                <li>Improve bullet strength: Include at least 3 active verbs like <strong>managed, developed, optimized</strong>.</li>
              )}
              {!skillsValid && (
                <li>Keyword deficiency: Add at least <strong>5 role-specific skills</strong> (e.g. software, operations).</li>
              )}
              {!hasEdu && (
                <li>Academic missing: Add a <strong>university degree</strong> or diploma.</li>
              )}
              {!hasProjOrCert && (
                <li>Increase authority: List key <strong>projects</strong> or professional <strong>certifications</strong>.</li>
              )}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
