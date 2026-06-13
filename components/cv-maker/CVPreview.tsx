import React from "react";
import { CVData, CVStyleConfig } from "../../types/cv";

interface CVPreviewProps {
  data: CVData;
  styleConfig: CVStyleConfig;
}

const fontFamilies: Record<CVStyleConfig["fontFamily"], string> = {
  Arial: "Arial, Helvetica, sans-serif",
  Calibri: "Calibri, Candara, Segoe, sans-serif",
  Helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  TimesNewRoman: "'Times New Roman', Times, Baskerville, serif",
  Georgia: "Georgia, Cambria, 'Times New Roman', Times, serif"
};

const fontSizes: Record<CVStyleConfig["fontSize"], { text: string; h1: string; h2: string; h3: string }> = {
  sm: { text: "text-[12px] leading-[1.35]", h1: "text-[20px]", h2: "text-[13px]", h3: "text-[12px]" },
  md: { text: "text-[14px] leading-[1.45]", h1: "text-[24px]", h2: "text-[15px]", h3: "text-[14px]" },
  lg: { text: "text-[16px] leading-[1.55]", h1: "text-[28px]", h2: "text-[17px]", h3: "text-[16px]" }
};

const paddingSizes: Record<CVStyleConfig["spacing"], string> = {
  compact: "p-8 sm:p-10",      // 0.5 in approx
  normal: "p-10 sm:p-12",       // 0.75 in approx
  spacious: "p-12 sm:p-16"      // 1.0 in approx
};

const gapSizes: Record<CVStyleConfig["spacing"], string> = {
  compact: "space-y-3",
  normal: "space-y-4.5",
  spacious: "space-y-6"
};

const sectionGapSizes: Record<CVStyleConfig["spacing"], string> = {
  compact: "space-y-2",
  normal: "space-y-3",
  spacious: "space-y-4.5"
};

const itemGapSizes: Record<CVStyleConfig["spacing"], string> = {
  compact: "space-y-1.5",
  normal: "space-y-2.5",
  spacious: "space-y-3.5"
};

const accentHex: Record<CVStyleConfig["accentColor"], string> = {
  emerald: "#10b981",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  gray: "#4b5563",
  red: "#ef4444"
};

export default function CVPreview({ data, styleConfig }: CVPreviewProps) {
  const { templateId, fontFamily, fontSize, spacing, accentColor } = styleConfig;

  const fontStyle = { fontFamily: fontFamilies[fontFamily] };
  const sizeClasses = fontSizes[fontSize];
  const paddingClass = paddingSizes[spacing];
  const gapClass = gapSizes[spacing];
  const secGapClass = sectionGapSizes[spacing];
  const itemGapClass = itemGapSizes[spacing];
  const accentColorHex = accentHex[accentColor];

  // Helper to split text by lines into bullets
  const renderBullets = (text: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc pl-5 space-y-1 mt-1">
        {text
          .split("\n")
          .map((line) => line.replace(/^[\s-•*]+/, "").trim())
          .filter(Boolean)
          .map((bullet, idx) => (
            <li key={idx} className="text-justify">{bullet}</li>
          ))}
      </ul>
    );
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto shadow-2xl transition-all duration-300">
      
      {/* 
        Print Styling Override Injector
        Ensures that when printing, ONLY this element takes the page width,
        with pure black text on white background and high contrast layouts.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide everything except the CV Preview paper sheet */
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Hide all headers, builder panels, CTAs and social dials */
          header, footer, nav, .no-print, button, .builder-sidebar, .floating-dial, .contact-dial, [role="banner"], [role="contentinfo"] {
            display: none !important;
          }

          /* Force print preview container to fill the window */
          #cv-preview-sheet {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0.5in !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 0 !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            page-break-after: avoid !important;
          }
          
          /* Keep text clean and crisp */
          a {
            text-decoration: none !important;
            color: #000000 !important;
          }
          
          /* Enforce proper page breaks inside categories */
          .cv-section {
            page-break-inside: avoid !important;
          }
        }
      `}} />

      {/* Simulated A4 Paper Wrapper */}
      <div
        id="cv-preview-sheet"
        style={fontStyle}
        className={`w-full min-h-[1050px] bg-white text-black border border-brand-gray-300 rounded-sm overflow-hidden flex flex-col justify-between ${paddingClass} ${gapClass} ${sizeClasses.text}`}
      >
        <div className="space-y-5 flex-grow">
          {/* ==========================================
              TEMPLATE HEADER RENDERING
              ========================================== */}
          
          {/* 1. Classic Professional: Centered Profile */}
          {templateId === "classic" && (
            <div className="text-center space-y-2">
              {data.personalInfo.profileImage && (
                <div className="flex justify-center mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={data.personalInfo.profileImage} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover border border-brand-gray-300 shadow-sm" 
                  />
                </div>
              )}
              <h1 className={`${sizeClasses.h1} font-bold tracking-tight text-black`}>
                {data.personalInfo.fullName || "Your Full Name"}
              </h1>
              <div className="text-xs uppercase tracking-wider font-semibold text-brand-gray-650">
                {data.personalInfo.jobTitle || "Job Title / Profession"}
              </div>
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-brand-gray-650">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
                {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
              </div>
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-brand-gray-600 font-medium">
                {data.personalInfo.linkedinUrl && (
                  <span className="underline">{data.personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
                )}
                {data.personalInfo.portfolioUrl && (
                  <span className="underline">{data.personalInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
                )}
                {data.personalInfo.githubUrl && (
                  <span className="underline">{data.personalInfo.githubUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
                )}
              </div>
              <hr style={{ borderColor: accentColorHex }} className="border-t-2 mt-3" />
            </div>
          )}

          {/* 2. Modern Minimal: Left Aligned Modern */}
          {templateId === "minimal" && (
            <div className="border-b border-brand-gray-300 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                {data.personalInfo.profileImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={data.personalInfo.profileImage} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border border-brand-gray-300 flex-shrink-0" 
                  />
                )}
                <div className="space-y-1">
                  <h1 className={`${sizeClasses.h1} font-bold tracking-tight text-black`}>
                    {data.personalInfo.fullName || "Your Full Name"}
                  </h1>
                  <div className="text-sm font-semibold tracking-wide" style={{ color: accentColorHex }}>
                    {data.personalInfo.jobTitle || "Job Title / Profession"}
                  </div>
                </div>
              </div>
              <div className="text-xs text-brand-gray-650 space-y-0.5 md:text-right">
                {data.personalInfo.email && <div className="font-medium">{data.personalInfo.email}</div>}
                {(data.personalInfo.phone || data.personalInfo.location) && (
                  <div>{data.personalInfo.phone} | {data.personalInfo.location}</div>
                )}
                <div className="flex flex-wrap md:justify-end gap-x-2 gap-y-0.5 font-medium">
                  {data.personalInfo.linkedinUrl && (
                    <span className="underline">{data.personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  )}
                  {data.personalInfo.portfolioUrl && (
                    <span className="underline">{data.personalInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. Executive Clean: High Contrast Heading */}
          {templateId === "executive" && (
            <div className="space-y-3 pb-3 border-b-2" style={{ borderColor: accentColorHex }}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex gap-4 items-start">
                  {data.personalInfo.profileImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={data.personalInfo.profileImage} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-lg object-cover border-2 flex-shrink-0" 
                      style={{ borderColor: accentColorHex }}
                    />
                  )}
                  <div className="space-y-1.5">
                    <h1 className={`${sizeClasses.h1} font-bold text-black uppercase tracking-wide`}>
                      {data.personalInfo.fullName || "Your Full Name"}
                    </h1>
                    <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-gray-650">
                      {data.personalInfo.jobTitle || "Job Title / Profession"}
                    </h2>
                  </div>
                </div>
                <div className="text-xs text-brand-gray-600 md:text-right space-y-1">
                  {data.personalInfo.email && <div>Email: <span className="font-semibold text-black">{data.personalInfo.email}</span></div>}
                  {data.personalInfo.phone && <div>Phone: <span className="font-semibold text-black">{data.personalInfo.phone}</span></div>}
                  {data.personalInfo.location && <div>Location: <span className="font-semibold text-black">{data.personalInfo.location}</span></div>}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-gray-600">
                {data.personalInfo.linkedinUrl && (
                  <span>LinkedIn: <span className="underline text-black">{data.personalInfo.linkedinUrl}</span></span>
                )}
                {data.personalInfo.portfolioUrl && (
                  <span>Portfolio: <span className="underline text-black">{data.personalInfo.portfolioUrl}</span></span>
                )}
              </div>
            </div>
          )}

          {/* 4. Developer Focused: Technical Profile header */}
          {templateId === "developer" && (
            <div className="border-b border-brand-gray-300 pb-4 space-y-2">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-grow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <h1 className={`${sizeClasses.h1} font-extrabold tracking-tight text-black`}>
                      {data.personalInfo.fullName || "Your Full Name"}
                    </h1>
                    <div className="flex flex-wrap gap-x-2 text-xs font-mono text-brand-gray-600">
                      {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                      {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
                    </div>
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-gray-650 flex flex-wrap gap-x-3 items-center">
                    <span className="text-sm font-bold" style={{ color: accentColorHex }}>{data.personalInfo.jobTitle || "Job Title"}</span>
                    {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-brand-gray-650 font-mono">
                    {data.personalInfo.linkedinUrl && (
                      <span>[LinkedIn: <span className="underline">{data.personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>]</span>
                    )}
                    {data.personalInfo.portfolioUrl && (
                      <span>[Portfolio: <span className="underline">{data.personalInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>]</span>
                    )}
                    {data.personalInfo.githubUrl && (
                      <span>[GitHub: <span className="underline">{data.personalInfo.githubUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>]</span>
                    )}
                  </div>
                </div>
                {data.personalInfo.profileImage && (
                  <div className="p-1 border border-brand-gray-350 font-mono text-[9px] flex flex-col items-center gap-1 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={data.personalInfo.profileImage} 
                      alt="Avatar" 
                      className="w-16 h-16 object-cover border border-brand-gray-300" 
                    />
                    <span>[AVATAR]</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Marketing Specialist: Elegant large spacing */}
          {templateId === "marketing" && (
            <div className="space-y-2 pb-4 border-b border-brand-gray-300">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                {data.personalInfo.profileImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={data.personalInfo.profileImage} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover border-2 shadow-sm flex-shrink-0" 
                    style={{ borderColor: accentColorHex }}
                  />
                )}
                <div className="flex-grow space-y-2 w-full">
                  <h1 className={`${sizeClasses.h1} font-extrabold tracking-tight text-black text-left`}>
                    {data.personalInfo.fullName || "Your Full Name"}
                  </h1>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                    <div className="text-sm font-semibold tracking-wide" style={{ color: accentColorHex }}>
                      {data.personalInfo.jobTitle || "Job Title / Profession"}
                    </div>
                    <div className="text-xs text-brand-gray-600 md:text-right space-y-0.5 font-medium">
                      {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
                      {data.personalInfo.phone && <div>{data.personalInfo.phone} • {data.personalInfo.location}</div>}
                      {data.personalInfo.portfolioUrl && (
                        <div className="underline text-black font-semibold">{data.personalInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, "")}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ==========================================
              SECTIONS RENDER (VERTICAL FLOW ONLY)
              ========================================== */}

          <div className={secGapClass}>
            
            {/* Section Helper Function */}
            {/* We map titles cleanly with optional left accent markers for Executive Clean */}
            {(() => {
              const renderSectionHeading = (title: string) => {
                if (templateId === "executive") {
                  return (
                    <h2
                      style={{ borderLeftColor: accentColorHex }}
                      className={`${sizeClasses.h2} font-bold uppercase tracking-wider border-l-4 pl-2.5 text-black mt-4 mb-2 cv-section-header`}
                    >
                      {title}
                    </h2>
                  );
                }
                if (templateId === "developer") {
                  return (
                    <div className="border-b border-brand-gray-300 pb-0.5 mt-4 mb-2 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-brand-gray-400">&gt;_</span>
                      <h2 className={`${sizeClasses.h2} font-extrabold tracking-wide font-mono text-black uppercase cv-section-header`}>
                        {title}
                      </h2>
                    </div>
                  );
                }
                return (
                  <div className="mt-4 mb-2">
                    <h2 className={`${sizeClasses.h2} font-bold tracking-wide text-black uppercase cv-section-header`}>
                      {title}
                    </h2>
                    <hr className="border-t border-brand-gray-300 mt-1" />
                  </div>
                );
              };

              return (
                <div className={secGapClass}>
                  
                  {/* PROFESSIONAL SUMMARY */}
                  {data.summary && (
                    <div className="cv-section space-y-1">
                      {renderSectionHeading("Professional Summary")}
                      <p className="text-justify leading-relaxed whitespace-pre-line">
                        {data.summary}
                      </p>
                    </div>
                  )}

                  {/* WORK EXPERIENCE */}
                  {data.experience.length > 0 && (
                    <div className="cv-section space-y-3">
                      {renderSectionHeading("Work Experience")}
                      <div className={itemGapClass}>
                        {data.experience.map((exp) => (
                          <div key={exp.id} className="space-y-1 page-break-avoid">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                              <div>
                                <span className="font-bold text-black">{exp.position}</span>
                                <span className="text-brand-gray-650"> | </span>
                                <span className="font-semibold text-brand-gray-800">{exp.company}</span>
                              </div>
                              <div className="text-xs text-brand-gray-600 sm:text-right font-medium">
                                <span>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                                {exp.location && <span className="block italic text-[11px]">{exp.location}</span>}
                              </div>
                            </div>
                            <div className="text-brand-gray-850 leading-relaxed text-sm">
                              {renderBullets(exp.description)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PROJECTS */}
                  {data.projects.length > 0 && (
                    <div className="cv-section space-y-3">
                      {renderSectionHeading("Projects")}
                      <div className={itemGapClass}>
                        {data.projects.map((proj) => (
                          <div key={proj.id} className="space-y-1 page-break-avoid">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                              <div>
                                <span className="font-bold text-black">{proj.name}</span>
                                {proj.url && (
                                  <span className="text-xs text-brand-gray-650 underline ml-2">({proj.url})</span>
                                )}
                              </div>
                              <div className="text-[11px] font-semibold text-brand-gray-650 font-mono">
                                {proj.techStack}
                              </div>
                            </div>
                            <p className="text-brand-gray-800 leading-normal">{proj.description}</p>
                            {proj.features && (
                              <div className="text-brand-gray-850 leading-relaxed text-sm">
                                {renderBullets(proj.features)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SKILLS */}
                  {data.skills.length > 0 && (
                    <div className="cv-section space-y-2">
                      {renderSectionHeading("Skills")}
                      <div className="space-y-1.5">
                        {/* If dynamic groupings exist, print them inline */}
                        {["technical", "marketing", "development", "soft"].map((cat) => {
                          const catSkills = data.skills.filter((s) => s.category === cat);
                          if (catSkills.length === 0) return null;
                          return (
                            <div key={cat} className="text-sm">
                              <span className="font-bold text-black uppercase tracking-wide text-xs">
                                {cat === "technical" ? "Technical" : cat === "marketing" ? "Marketing Tools" : cat === "development" ? "Development Tools" : "Soft Skills"}:
                              </span>{" "}
                              <span className="text-brand-gray-850">
                                {catSkills.map((s) => s.name).join(", ")}
                              </span>
                            </div>
                          );
                        })}

                        {/* Uncategorized skills */}
                        {(() => {
                          const uncategorized = data.skills.filter(
                            (s) => !["technical", "marketing", "development", "soft"].includes(s.category || "")
                          );
                          if (uncategorized.length === 0) return null;
                          return (
                            <div className="text-sm">
                              <span className="font-bold text-black uppercase tracking-wide text-xs">Skills:</span>{" "}
                              <span className="text-brand-gray-850">
                                {uncategorized.map((s) => s.name).join(", ")}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* EDUCATION */}
                  {data.education.length > 0 && (
                    <div className="cv-section space-y-3">
                      {renderSectionHeading("Education")}
                      <div className={itemGapClass}>
                        {data.education.map((edu) => (
                          <div key={edu.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 page-break-avoid">
                            <div>
                              <span className="font-bold text-black">{edu.degree}</span>
                              <div className="text-brand-gray-800 font-semibold">{edu.institution}</div>
                            </div>
                            <div className="text-xs text-brand-gray-600 sm:text-right font-medium">
                              <span>{edu.startDate} – {edu.endDate}</span>
                              {edu.location && <span className="block italic text-[11px]">{edu.location}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CERTIFICATIONS */}
                  {data.certifications.length > 0 && (
                    <div className="cv-section space-y-2">
                      {renderSectionHeading("Certifications")}
                      <ul className="list-disc pl-5 space-y-1">
                        {data.certifications.map((cert) => (
                          <li key={cert.id} className="page-break-avoid">
                            <span className="font-semibold text-black">{cert.name}</span> – <span className="text-brand-gray-700">{cert.issuer} ({cert.year})</span>
                            {cert.url && <span className="text-xs text-brand-gray-650 underline ml-2">({cert.url})</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* LANGUAGES */}
                  {data.languages.length > 0 && (
                    <div className="cv-section space-y-2">
                      {renderSectionHeading("Languages")}
                      <p className="text-brand-gray-850">
                        {data.languages.map((lang) => `${lang.name} (${lang.proficiency})`).join(", ")}
                      </p>
                    </div>
                  )}

                  {/* CUSTOM SECTIONS */}
                  {data.customSections.map((sect) => (
                    <div key={sect.id} className="cv-section space-y-2 page-break-avoid">
                      {renderSectionHeading(sect.title)}
                      <div className="text-brand-gray-850 leading-relaxed">
                        {sect.content.includes("\n") ? renderBullets(sect.content) : <p className="text-justify">{sect.content}</p>}
                      </div>
                    </div>
                  ))}

                </div>
              );
            })()}

          </div>
        </div>

        {/* Dynamic Footer koordinats referencer matching Mibin Thomas branding portfolio */}
        <div className="border-t border-brand-gray-300 pt-3 text-center text-[10px] text-brand-gray-400 no-print flex justify-between items-center select-none font-mono">
          <span>ATS SELECTABLE FORMAT</span>
          <span>A4 Letter Layout</span>
          <span>GENERATED VIA MIBINTHOMAS.COM</span>
        </div>
      </div>
    </div>
  );
}
