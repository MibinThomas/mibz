import React, { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { 
  User, FileText, Briefcase, 
  GraduationCap, Tag, FolderGit, Award, 
  Languages, Camera, X, ChevronLeft, ChevronRight, CheckCircle2 
} from "lucide-react";
import { CVFormValues } from "../../lib/cvSchema";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
import SkillsInput from "./SkillsInput";
import ProjectsForm from "./ProjectsForm";
import CertificationsForm from "./CertificationsForm";
import LanguageForm from "./LanguageForm";
import CustomSectionForm from "./CustomSectionForm";

export default function CVForm() {
  const { register, watch, setValue, trigger, formState: { errors } } = useFormContext<CVFormValues>();
  const profileImage = watch("personalInfo.profileImage");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState<string>("personal");

  const steps = [
    { id: "personal", title: "Personal Details", label: "Contact", icon: User },
    { id: "summary", title: "Professional Summary", label: "Summary", icon: FileText },
    { id: "experience", title: "Work Experience", label: "Experience", icon: Briefcase },
    { id: "projects", title: "Projects", label: "Projects", icon: FolderGit },
    { id: "skills", title: "Skills", label: "Skills", icon: Tag },
    { id: "education", title: "Education", label: "Education", icon: GraduationCap },
    { id: "certifications", title: "Certifications", label: "Certificates", icon: Award },
    { id: "languages", title: "Languages", label: "Languages", icon: Languages },
    { id: "customSections", title: "Custom Sections", label: "Custom Details", icon: FileText },
  ];

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
        setValue("personalInfo.profileImage", compressedBase64, { shouldValidate: true, shouldDirty: true });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("personalInfo.profileImage", "", { shouldValidate: true, shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSection = (section: string) => {
    setActiveSection(section);
  };

  const hasError = (section: keyof CVFormValues | "personal") => {
    if (section === "personal") {
      return !!errors.personalInfo;
    }
    return !!errors[section];
  };

  const isStepCompleted = (stepId: string) => {
    const values = watch();
    if (stepId === "personal" ? hasError("personal") : hasError(stepId as keyof CVFormValues)) return false;
    
    switch (stepId) {
      case "personal":
        return !!(values.personalInfo?.fullName && values.personalInfo?.email && values.personalInfo?.phone);
      case "summary":
        return !!(values.summary && values.summary.length >= 10);
      case "experience":
        return !!(values.experience && values.experience.length > 0);
      case "projects":
        return !!(values.projects && values.projects.length > 0);
      case "skills":
        return !!(values.skills && values.skills.length >= 5);
      case "education":
        return !!(values.education && values.education.length > 0);
      case "certifications":
        return !!(values.certifications && values.certifications.length > 0);
      case "languages":
        return !!(values.languages && values.languages.length > 0);
      case "customSections":
        return !!(values.customSections && values.customSections.length > 0);
      default:
        return false;
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(steps[currentIndex - 1].id);
    }
  };

  const handleContinue = async () => {
    let sectionValid = true;
    if (activeSection === "personal") {
      sectionValid = await trigger("personalInfo");
    } else if (activeSection === "summary") {
      sectionValid = await trigger("summary");
    } else if (activeSection === "skills") {
      sectionValid = await trigger("skills");
    }
    
    if (sectionValid) {
      const currentIndex = steps.findIndex(s => s.id === activeSection);
      if (currentIndex < steps.length - 1) {
        setActiveSection(steps[currentIndex + 1].id);
      } else {
        alert("കൊള്ളാം! താങ്കൾ എല്ലാ വിവരങ്ങളും നൽകിയിരിക്കുന്നു. CV ഡൗൺലോഡ് ചെയ്യാനായി മുകളിലുള്ള 'Print & Save PDF' ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.");
      }
    }
  };

  return (
    <div className="bg-brand-card/30 backdrop-blur-md border border-white/5 shadow-lg rounded-2xl overflow-hidden transition-all duration-200">
      {/* Root level hidden input to keep profile image registration always mounted */}
      <input type="hidden" {...register("personalInfo.profileImage")} />

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* STEPPER SIDEBAR NAVIGATION (Desktop: Left 3 cols, Mobile: Horizontal scroll tab at top) */}
        <div className="md:col-span-3 bg-brand-dark/40 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar scroll-smooth">
          <div className="flex md:flex-col w-full min-w-max md:min-w-0 md:p-3 p-2 gap-1.5 md:gap-2">
            {steps.map((step) => {
              const isActive = activeSection === step.id;
              const isCompleted = isStepCompleted(step.id);
              const isErr = step.id === "personal" ? hasError("personal") : hasError(step.id as keyof CVFormValues);
              const Icon = step.icon;
              
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => toggleSection(step.id)}
                  className={`px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none ${
                    isActive 
                      ? "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30 font-bold shadow-[0_0_12px_rgba(16,185,129,0.08)]" 
                      : "text-brand-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  } w-auto md:w-full`}
                >
                  <div className="flex items-center gap-2 md:gap-2.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-brand-emerald" : "text-brand-gray-500"}`} />
                    <span className="text-[11px] md:text-xs tracking-wide truncate max-w-[100px] md:max-w-none">{step.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {isErr && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Validation errors" />
                    )}
                    {isCompleted && !isErr && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE FORM FIELDS COLUMN (9 cols) */}
        <div className="md:col-span-9 p-5 md:p-6 flex flex-col justify-between min-h-[500px]">
          
          <div className="space-y-4 flex-grow">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                {steps.find(s => s.id === activeSection)?.title}
              </h3>
            </div>

            <div className="py-2">
              {activeSection === "personal" && (
                <div className="space-y-4 animate-fadeIn">
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
                          className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
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
                          className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
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
                        className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
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
                        className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
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
                        className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
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
                        className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
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
                        className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
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
                        className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "summary" && (
                <div className="space-y-4 animate-fadeIn">
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
                </div>
              )}

              {activeSection === "experience" && (
                <div className="animate-fadeIn">
                  <ExperienceForm />
                </div>
              )}

              {activeSection === "projects" && (
                <div className="animate-fadeIn">
                  <ProjectsForm />
                </div>
              )}

              {activeSection === "skills" && (
                <div className="animate-fadeIn">
                  <SkillsInput />
                </div>
              )}

              {activeSection === "education" && (
                <div className="animate-fadeIn">
                  <EducationForm />
                </div>
              )}

              {activeSection === "certifications" && (
                <div className="animate-fadeIn">
                  <CertificationsForm />
                </div>
              )}

              {activeSection === "languages" && (
                <div className="animate-fadeIn">
                  <LanguageForm />
                </div>
              )}

              {activeSection === "customSections" && (
                <div className="animate-fadeIn">
                  <CustomSectionForm />
                </div>
              )}
            </div>
          </div>

          {/* STEPPER FOOTER BUTTONS CONTROLS */}
          <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={activeSection === "personal"}
              className={`h-10 px-4 rounded-xl border border-white/5 bg-brand-card/40 hover:bg-brand-card/70 text-xs text-brand-gray-300 hover:text-white transition-all flex items-center justify-center gap-1.5 font-semibold ${
                activeSection === "personal" ? "opacity-30 cursor-not-allowed" : "hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="h-10 px-4.5 rounded-xl bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark hover:opacity-95 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_12px_rgba(16,185,129,0.1)]"
            >
              <span>{activeSection === "customSections" ? "Finish Builder" : "Continue"}</span>
              {activeSection !== "customSections" && <ChevronRight className="w-4 h-4 text-brand-dark" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
