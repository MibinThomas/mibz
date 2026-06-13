import React from "react";
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { CVData } from "../../types/cv";

interface ATSScoreProps {
  data: CVData;
}

const ACTION_VERBS = [
  "led", "developed", "created", "scaled", "managed", "built", "designed", 
  "implemented", "improved", "optimized", "optimised", "spearheaded", 
  "engineered", "directed", "executed", "accelerated", "launched", 
  "automated", "designed", "increased", "decreased", "saved", "maximized",
  "generated", "formulated", "established", "supervised"
];

export default function ATSScore({ data }: ATSScoreProps) {
  // 1. Contact details completed
  const hasContactDetails = !!(
    data.personalInfo.fullName &&
    data.personalInfo.jobTitle &&
    data.personalInfo.email &&
    data.personalInfo.phone &&
    data.personalInfo.location
  );

  // 2. Professional summary added
  const hasSummary = data.summary && data.summary.trim().length >= 30;

  // 3. Work experience added
  const hasExperience = data.experience && data.experience.length > 0;

  // 4. At least 5 skills added
  const hasFiveSkills = data.skills && data.skills.length >= 5;

  // 5. Bullet points contain action verbs
  let hasActionVerbs = false;
  let checkedBullets = 0;
  let matchingBullets = 0;

  const checkTextForVerbs = (text: string) => {
    if (!text) return;
    const lines = text.split("\n");
    lines.forEach((line) => {
      const trimmed = line.replace(/^[\s-•*]+/, "").trim().toLowerCase();
      if (trimmed.length > 5) {
        checkedBullets++;
        const words = trimmed.split(/\s+/);
        // check if any word (especially the first few words) matches action verbs
        const hasVerb = words.slice(0, 3).some((word) => 
          ACTION_VERBS.some(verb => word.startsWith(verb))
        );
        if (hasVerb) matchingBullets++;
      }
    });
  };

  data.experience.forEach((exp) => checkTextForVerbs(exp.description));
  data.projects.forEach((proj) => {
    checkTextForVerbs(proj.description);
    if (proj.features) checkTextForVerbs(proj.features);
  });

  if (checkedBullets > 0) {
    // If at least 60% of bullet lines begin with/contain action verbs
    hasActionVerbs = (matchingBullets / checkedBullets) >= 0.6;
  }

  // 6. No overly long paragraphs
  let noLongParagraphs = true;
  if (data.summary && data.summary.length > 400) {
    noLongParagraphs = false;
  }
  data.experience.forEach((exp) => {
    if (exp.description && exp.description.length > 800) {
      noLongParagraphs = false;
    }
  });

  // 7. Projects or certifications added
  const hasProjectsOrCertifications = 
    (data.projects && data.projects.length > 0) || 
    (data.certifications && data.certifications.length > 0);

  // 8. LinkedIn or portfolio link added
  const hasLinks = !!(data.personalInfo.linkedinUrl || data.personalInfo.portfolioUrl || data.personalInfo.githubUrl);

  // 9. Standard section headings used
  const hasStandardHeadings = true; // Handled by our pre-set templates

  // 10. CV Length Check (character count)
  let cvLengthStatus: "good" | "short" | "long" = "good";
  // Estimating length
  const totalLength = 
    data.personalInfo.fullName.length +
    data.personalInfo.jobTitle.length +
    data.summary.length +
    data.experience.reduce((acc, curr) => acc + curr.company.length + curr.position.length + curr.description.length, 0) +
    data.education.reduce((acc, curr) => acc + curr.institution.length + curr.degree.length, 0) +
    data.skills.reduce((acc, curr) => acc + curr.name.length, 0);

  if (totalLength < 600) {
    cvLengthStatus = "short";
  } else if (totalLength > 5500) {
    cvLengthStatus = "long";
  }

  // Compile items
  const items = [
    { label: "Contact details completed", passed: hasContactDetails, tip: "Fill out name, job title, email, phone and location." },
    { label: "Professional summary added", passed: hasSummary, tip: "Add a 3-5 line description of your core achievements and background." },
    { label: "Work experience added", passed: hasExperience, tip: "Include at least one professional work history entry." },
    { label: "At least 5 skills added", passed: hasFiveSkills, tip: `Currently has ${data.skills.length} skills. Add at least 5 skills.` },
    { label: "Action verbs in bullet points", passed: hasActionVerbs || checkedBullets === 0, tip: "Begin bullet points with action verbs (e.g. Optimized, Developed, Lead)." },
    { label: "Concise summaries & paragraphs", passed: noLongParagraphs, tip: "Keep summary under 4 lines and descriptions in bullet lists rather than large blocks of text." },
    { label: "Projects or certifications added", passed: hasProjectsOrCertifications, tip: "Add details of custom projects or certifications to showcase credentials." },
    { label: "Professional profile links included", passed: hasLinks, tip: "Link your LinkedIn, GitHub, or Portfolio URL." },
    { label: "ATS-friendly section headings", passed: hasStandardHeadings, tip: "System outputs standard headers (Work Experience, Education, Skills, etc.)." },
    { 
      label: "Optimal resume length", 
      passed: cvLengthStatus === "good", 
      tip: cvLengthStatus === "short" 
        ? "Resume content is too brief. Add more experience or project details." 
        : "Resume is very long (exceeds 5,500 characters). Streamline details to fit 1-2 pages."
    }
  ];

  const passedCount = items.filter(item => item.passed).length;
  const scorePercentage = Math.round((passedCount / items.length) * 100);

  // Determine color theme for score
  let scoreColorClass = "text-red-500 border-red-500/20 bg-red-500/5";
  let ringBg = "stroke-red-500";
  if (scorePercentage >= 80) {
    scoreColorClass = "text-brand-emerald border-brand-emerald/20 bg-brand-emerald/5";
    ringBg = "stroke-brand-emerald";
  } else if (scorePercentage >= 50) {
    scoreColorClass = "text-amber-500 border-amber-500/20 bg-amber-500/5";
    ringBg = "stroke-amber-500";
  }

  return (
    <div className="bg-brand-card/50 border border-brand-gray-800/80 rounded-xl p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-brand-gray-800 pb-3">
        <TrendingUp className="w-5 h-5 text-brand-emerald" />
        <h2 className="text-base font-heading font-semibold text-white">ATS Compatibility Score</h2>
      </div>

      {/* Score Circle & KPI */}
      <div className={`flex flex-col sm:flex-row items-center gap-6 p-4 border rounded-lg ${scoreColorClass}`}>
        {/* SVG Circle chart */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="stroke-brand-gray-800"
              strokeWidth="3.5"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`transition-all duration-1000 ease-out ${ringBg}`}
              strokeWidth="3.5"
              strokeDasharray={`${scorePercentage}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-heading text-white">{scorePercentage}%</span>
            <span className="text-[9px] uppercase tracking-wider text-brand-gray-400 font-semibold">ATS Score</span>
          </div>
        </div>

        {/* Dynamic score info */}
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-semibold text-white">
            {scorePercentage >= 80 
              ? "Excellent ATS Compatibility!" 
              : scorePercentage >= 50 
                ? "Good Start, Needs Polish" 
                : "Awaiting Essential Details"}
          </h3>
          <p className="text-xs text-brand-gray-400 leading-relaxed">
            {scorePercentage >= 80 
              ? "Your resume has standard formats, contains active verbs, and includes all major required fields for recruiter parsing systems." 
              : "Review the checklist items below to enhance your score and ensure resume parsers index your data accurately."}
          </p>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-brand-gray-400 uppercase tracking-wider">
          ATS Checklist
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`p-2.5 rounded-lg border flex items-start gap-2.5 transition-all text-xs ${
                item.passed 
                  ? "bg-brand-emerald/5 border-brand-emerald/10 text-white" 
                  : "bg-brand-gray-900/40 border-brand-gray-800/60 text-brand-gray-300"
              }`}
            >
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-semibold block">{item.label}</span>
                {!item.passed && (
                  <span className="text-[10px] text-brand-gray-400 block leading-normal">{item.tip}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested action verbs if verb check failed */}
      {!hasActionVerbs && checkedBullets > 0 && (
        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex gap-2.5">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-white block">Recommended Action Verbs</span>
            <span className="text-brand-gray-400 block leading-relaxed">
              Start your bullet items with active words like: <strong>Spearheaded, Architected, Designed, Implemented, Generated, Streamlined, Coordinated, Boosted, Managed.</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
