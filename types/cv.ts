export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  profileImage?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // bullet points text
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  category: "technical" | "marketing" | "development" | "soft" | string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  url?: string;
  techStack: string; // e.g. "React, Next.js, Tailwind CSS"
  description: string;
  features?: string; // key bullet achievements
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g. "Native", "Fluent", "Conversational"
}

export interface CustomSection {
  id: string;
  title: string;
  content: string; // bullet details or text paragraphs
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  customSections: CustomSection[];
}

export interface CVStyleConfig {
  templateId: "classic" | "minimal" | "executive" | "developer" | "marketing" | "modern_ats" | "ats_sidebar";
  fontSize: "sm" | "md" | "lg";
  spacing: "compact" | "normal" | "spacious";
  accentColor: "emerald" | "blue" | "purple" | "gray" | "red";
  fontFamily: "Arial" | "Calibri" | "Helvetica" | "TimesNewRoman" | "Georgia" | "Inter" | "Outfit" | "Poppins" | "Lora";
}
