import { z } from "zod";

export const cvSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
    linkedinUrl: z.string().optional().or(z.literal("")),
    portfolioUrl: z.string().optional().or(z.literal("")),
    githubUrl: z.string().optional().or(z.literal("")),
  }),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string().min(1, "Company name is required"),
      position: z.string().min(1, "Position/Title is required"),
      location: z.string().min(1, "Location is required"),
      startDate: z.string().min(1, "Start date/year is required"),
      endDate: z.string().min(1, "End date/year is required"),
      current: z.boolean(),
      description: z.string().min(1, "Job details/bullets are required"),
    })
  ),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string().min(1, "Institution/School name is required"),
      degree: z.string().min(1, "Degree / Course name is required"),
      location: z.string().min(1, "Location is required"),
      startDate: z.string().min(1, "Start year is required"),
      endDate: z.string().min(1, "End year is required"),
    })
  ),
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Skill name is required"),
      category: z.string(),
    })
  ).min(5, "At least five skills are required"),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Certification name is required"),
      issuer: z.string().min(1, "Organization is required"),
      year: z.string().min(1, "Year is required"),
      url: z.string().optional().or(z.literal("")),
    })
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Project name is required"),
      url: z.string().optional().or(z.literal("")),
      techStack: z.string().min(1, "Tech stack is required"),
      description: z.string().min(1, "Description is required"),
      features: z.string().optional().or(z.literal("")),
    })
  ),
  languages: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Language name is required"),
      proficiency: z.string().min(1, "Proficiency is required"),
    })
  ),
  customSections: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, "Section title is required"),
      content: z.string().min(1, "Details are required"),
    })
  ),
}).refine(
  (data) => data.experience.length > 0 || data.projects.length > 0,
  {
    message: "At least one Work Experience or Project is required",
    path: ["experience"],
  }
);

export type CVFormValues = z.infer<typeof cvSchema>;
