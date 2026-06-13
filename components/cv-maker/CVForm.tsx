import React, { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { User, FileText, ChevronDown, AlertCircle, Briefcase, GraduationCap, Tag, FolderGit, Award, Languages, Camera, X } from "lucide-react";
import { CVFormValues } from "../../lib/cvSchema";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
import SkillsInput from "./SkillsInput";
import ProjectsForm from "./ProjectsForm";
import CertificationsForm from "./CertificationsForm";
import LanguageForm from "./LanguageForm";
import CustomSectionForm from "./CustomSectionForm";

export default function CVForm() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CVFormValues>();
  const profileImage = watch("personalInfo.profileImage");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState<string>("personal");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new globalThis.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setValue("personalInfo.profileImage", compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("personalInfo.profileImage", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };

  // Helper to check if a section contains validation errors
  const hasError = (section: keyof CVFormValues | "personal") => {
    if (section === "personal") {
      return !!errors.personalInfo;
    }
    return !!errors[section];
  };

  const AccordionItem = ({
    id,
    title,
    icon: Icon,
    children,
  }: {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
  }) => {
    const isOpen = activeSection === id;
    const isError = id === "personal" ? hasError("personal") : hasError(id as keyof CVFormValues);

    return (
      <div className="border border-brand-gray-800/80 bg-brand-card/20 rounded-xl overflow-hidden transition-all duration-200">
        {/* Accordion Trigger */}
        <button
          type="button"
          onClick={() => toggleSection(id)}
          className={`w-full px-5 py-4 flex items-center justify-between font-heading font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-brand-emerald/50 ${
            isOpen 
              ? "bg-brand-card text-white border-b border-brand-gray-800" 
              : "text-brand-gray-300 hover:text-white hover:bg-brand-card/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-4.5 h-4.5 ${isOpen ? "text-brand-emerald" : "text-brand-gray-400"}`} />
            <span>{title}</span>
            {isError && (
              <span className="flex items-center gap-1 text-[10px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 font-sans font-medium">
                <AlertCircle className="w-3 h-3" /> Error
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-brand-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Accordion Content */}
        {isOpen && (
          <div className="p-5 bg-brand-dark/25 space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* 1. PERSONAL DETAILS */}
      <AccordionItem id="personal" title="Personal Details" icon={User}>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-5 items-center md:items-start pb-4 border-b border-brand-gray-800/40">
            {/* Image Uploader */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <label className="block text-[11px] font-bold text-brand-gray-300">
                Profile Photo
              </label>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group w-20 h-20 rounded-full border-2 border-dashed border-brand-gray-800 hover:border-brand-emerald bg-brand-dark/50 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all"
                title="Upload profile image"
              >
                {profileImage ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={profileImage} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors z-10"
                      title="Remove image"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-brand-gray-400 group-hover:text-brand-emerald transition-colors">
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span className="text-[9px] font-semibold">Upload</span>
                  </div>
                )}
              </div>
            </div>

            {/* Grid fields */}
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mibin Thomas"
                  {...register("personalInfo.fullName")}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                />
                {errors.personalInfo?.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.personalInfo.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                  Job Title / Profession *
                </label>
                <input
                  type="text"
                  placeholder="e.g. E-Commerce Specialist"
                  {...register("personalInfo.jobTitle")}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                />
                {errors.personalInfo?.jobTitle && (
                  <p className="text-red-500 text-xs mt-1">{errors.personalInfo.jobTitle.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="e.g. mibin@example.com"
                {...register("personalInfo.email")}
                className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
              />
              {errors.personalInfo?.email && (
                <p className="text-red-500 text-xs mt-1">{errors.personalInfo.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                Phone Number *
              </label>
              <input
                type="text"
                placeholder="e.g. +971 50 123 4567"
                {...register("personalInfo.phone")}
                className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
              />
              {errors.personalInfo?.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.personalInfo.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Dubai, UAE"
                {...register("personalInfo.location")}
                className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
              />
              {errors.personalInfo?.location && (
                <p className="text-red-500 text-xs mt-1">{errors.personalInfo.location.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="text"
                placeholder="e.g. https://linkedin.com/in/username"
                {...register("personalInfo.linkedinUrl")}
                className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                Portfolio URL
              </label>
              <input
                type="text"
                placeholder="e.g. https://myportfolio.com"
                {...register("personalInfo.portfolioUrl")}
                className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                GitHub / Profile URL
              </label>
              <input
                type="text"
                placeholder="e.g. https://github.com/username"
                {...register("personalInfo.githubUrl")}
                className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </AccordionItem>

      {/* 2. PROFESSIONAL SUMMARY */}
      <AccordionItem id="summary" title="Professional Summary" icon={FileText}>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-brand-gray-300">
            Summary *
          </label>
          <p className="text-[11px] text-brand-gray-400">
            Write 3–5 lines focused on role, experience, tools, industries and measurable results.
          </p>
          <textarea
            rows={5}
            placeholder="e.g. Growth Specialist with 6+ years experience managing paid social budgets..."
            {...register("summary")}
            className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all leading-relaxed"
          />
          {errors.summary && (
            <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>
          )}
        </div>
      </AccordionItem>

      {/* 3. WORK EXPERIENCE */}
      <AccordionItem id="experience" title="Work Experience" icon={Briefcase}>
        <ExperienceForm />
      </AccordionItem>

      {/* 4. PROJECTS */}
      <AccordionItem id="projects" title="Projects" icon={FolderGit}>
        <ProjectsForm />
      </AccordionItem>

      {/* 5. SKILLS */}
      <AccordionItem id="skills" title="Skills" icon={Tag}>
        <SkillsInput />
      </AccordionItem>

      {/* 6. EDUCATION */}
      <AccordionItem id="education" title="Education" icon={GraduationCap}>
        <EducationForm />
      </AccordionItem>

      {/* 7. CERTIFICATIONS */}
      <AccordionItem id="certifications" title="Certifications" icon={Award}>
        <CertificationsForm />
      </AccordionItem>

      {/* 8. LANGUAGES */}
      <AccordionItem id="languages" title="Languages" icon={Languages}>
        <LanguageForm />
      </AccordionItem>

      {/* 9. CUSTOM SECTIONS */}
      <AccordionItem id="customSections" title="Custom Sections" icon={FileText}>
        <CustomSectionForm />
      </AccordionItem>
    </div>
  );
}
