import { CVData, WorkExperience, Education, Project, Certification, Language } from "../types/cv";

// Helper to generate unique short IDs
const generateId = () => "entry-" + Math.random().toString(36).substring(2, 11);

// Standard date range regex detector (e.g., "Jan 2020 - Present", "2018 - 2021", "06/2019 to Current")
const DATE_RANGE_REGEX = /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{1,2})?[-.\s/\d]{0,4}\b\d{4}\b\s*(?:-|to|–|present|current)\s*(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{1,2})?[-.\s/\d]{0,4}\b\d{4}\b|present|current|now)?/i;

// Action verbs list for suggestions
export const ACTION_VERBS = [
  "managed", "developed", "optimized", "improved", "created", "implemented", 
  "designed", "engineered", "led", "directed", "built", "accelerated", 
  "formulated", "established", "spearheaded", "executed", "collaborated", 
  "coordinated", "increased", "reduced", "delivered", "programmed", 
  "architected", "launched", "streamlined", "transformed", "pioneered"
];

/**
 * Main parser utility to convert raw text into a CVData structure.
 */
export function parseResumeText(text: string): CVData {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const parsedData: CVData = {
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

  if (lines.length === 0) return parsedData;

  // 1. EXTRACT CONTACT INFORMATION (Scan first 15 lines primarily)
  const contactLinesLimit = Math.min(lines.length, 15);
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/i;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  
  // Find email
  for (let i = 0; i < contactLinesLimit; i++) {
    const match = lines[i].match(emailRegex);
    if (match) {
      parsedData.personalInfo.email = match[0];
      break;
    }
  }

  // Find phone
  for (let i = 0; i < contactLinesLimit; i++) {
    const match = lines[i].match(phoneRegex);
    if (match) {
      parsedData.personalInfo.phone = match[0];
      break;
    }
  }

  // Find Links (LinkedIn, GitHub, Portfolio)
  for (let i = 0; i < contactLinesLimit; i++) {
    const line = lines[i].toLowerCase();
    
    if (line.includes("linkedin.com/")) {
      const match = lines[i].match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-]+/i);
      if (match) parsedData.personalInfo.linkedinUrl = match[0];
    } else if (line.includes("github.com/")) {
      const match = lines[i].match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\-]+/i);
      if (match) parsedData.personalInfo.githubUrl = match[0];
    } else if (line.includes("http://") || line.includes("https://") || line.includes("www.")) {
      // General URL filter to separate portfolio from other links
      const match = lines[i].match(/(?:https?:\/\/)?(?:www\.)?[\w\-]+\.[\w\.]+(?:\/[\w\-]*)*(?:\?[\w\-\=\&]*)?/i);
      if (match && !match[0].includes("linkedin") && !match[0].includes("github")) {
        parsedData.personalInfo.portfolioUrl = match[0];
      }
    }
  }

  // Find Location
  // Looking for common location formats or key location indicator words
  const locationKeywords = ["uae", "dubai", "london", "usa", "uk", "canada", "singapore", "india", "abudhabi", "shariah", "ny", "ca", "tx", "san francisco", "new york", "city"];
  for (let i = 0; i < contactLinesLimit; i++) {
    const line = lines[i].toLowerCase();
    // Exclude emails, phone numbers, and web links from being matching location
    if (emailRegex.test(lines[i]) || phoneRegex.test(lines[i]) || line.includes(".com") || line.includes("http")) {
      continue;
    }
    
    // Check if line contains city/country indicators or matches City, Country pattern
    const commaSplit = lines[i].split(",");
    const hasKeyword = locationKeywords.some(keyword => line.includes(keyword));
    if ((commaSplit.length >= 2 && commaSplit[0].trim().length < 25 && commaSplit[1].trim().length < 25) || hasKeyword) {
      parsedData.personalInfo.location = lines[i];
      break;
    }
  }

  // Extract Name (First line that doesn't contain links, email, phone, and has length < 40 chars)
  for (let i = 0; i < contactLinesLimit; i++) {
    const line = lines[i];
    const isContact = emailRegex.test(line) || phoneRegex.test(line) || line.toLowerCase().includes("http") || line.toLowerCase().includes("www.") || line.toLowerCase().includes("linkedin.com");
    if (!isContact && line.split(/\s+/).length >= 2 && line.length < 35) {
      parsedData.personalInfo.fullName = line;
      
      // Attempt to guess Job Title from next lines
      for (let j = i + 1; j < Math.min(i + 4, contactLinesLimit); j++) {
        const nextLine = lines[j];
        const isNextContact = emailRegex.test(nextLine) || phoneRegex.test(nextLine) || nextLine.toLowerCase().includes("http") || nextLine.toLowerCase().includes("linkedin.com");
        const jobTitleKeywords = ["engineer", "developer", "manager", "designer", "consultant", "specialist", "executive", "architect", "analyst", "lead", "director", "head", "intern", "associate", "writer"];
        
        if (!isNextContact && jobTitleKeywords.some(k => nextLine.toLowerCase().includes(k)) && nextLine.length < 45) {
          parsedData.personalInfo.jobTitle = nextLine;
          break;
        }
      }
      break;
    }
  }

  // 2. SEGMENT INTO SECTION TEXT BLOCKS
  // Define heading patterns
  const sectionHeadings = {
    summary: /^(?:professional\s+)?summary|profile|about\s+me|career\s+objective|objective|executive\s+summary$/i,
    experience: /^(?:work\s+)?experience|employment(?:\s+history)?|work\s+history|professional\s+experience|career\s+history$/i,
    education: /^education|academic(?:\s+details|\s+background)?|qualifications|academic\s+qualifications$/i,
    skills: /^(?:technical\s+)?skills|core\s+competencies|expertise|technologies|skills\s+&\s+tools$/i,
    certifications: /^certifications|certificates|awards|credentials|professional\s+certifications$/i,
    projects: /^projects|personal\s+projects|key\s+projects|portfolio$/i,
    languages: /^languages|language\s+profile$/i,
    custom: /^(?:volunteer|volunteering|publications|interests|hobbies|extracurricular)$/i,
  };

  interface SectionBlock {
    type: keyof typeof sectionHeadings;
    title: string;
    lines: string[];
  }

  const sections: SectionBlock[] = [];
  let currentSection: SectionBlock | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line matches any section heading patterns and is relatively short (typical heading style)
    let headingType: keyof typeof sectionHeadings | null = null;
    
    if (line.length < 40) {
      for (const [key, regex] of Object.entries(sectionHeadings)) {
        if (regex.test(line.replace(/[:\-\s\•]/g, "").trim())) {
          headingType = key as keyof typeof sectionHeadings;
          break;
        }
      }
    }

    if (headingType) {
      currentSection = {
        type: headingType,
        title: line,
        lines: [],
      };
      sections.push(currentSection);
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }

  // 3. PARSE EACH INDIVIDUAL SECTION BLOCK
  for (const section of sections) {
    const secLines = section.lines;

    switch (section.type) {
      case "summary":
        parsedData.summary = secLines.join(" ");
        break;

      case "skills": {
        // Collect skill strings
        const skillNames: string[] = [];
        secLines.forEach(l => {
          // Check if skill line is comma/semicolon/pipe/bullet separated
          const tokens = l.split(/[,\;\|•\-\*]/).map(t => t.trim()).filter(t => t.length > 1);
          if (tokens.length > 1) {
            skillNames.push(...tokens);
          } else {
            skillNames.push(l);
          }
        });

        // Map and categorize skill names
        parsedData.skills = Array.from(new Set(skillNames)).map(name => {
          const lowerName = name.toLowerCase();
          let category = "technical";
          
          if (["react", "node", "git", "python", "javascript", "typescript", "css", "html", "sql", "aws", "docker", "c++", "c#", "java", "next.js", "nextjs", "php"].some(k => lowerName.includes(k))) {
            category = "development";
          } else if (["seo", "sales", "marketing", "ads", "content", "social media", "copywriting", "analytics", "campaign"].some(k => lowerName.includes(k))) {
            category = "marketing";
          } else if (["communication", "leadership", "teamwork", "adaptability", "critical thinking", "problem solving", "time management", "organization"].some(k => lowerName.includes(k))) {
            category = "soft";
          }

          return {
            id: generateId(),
            name,
            category,
          };
        });
        break;
      }

      case "experience": {
        // Parse work history entries
        const expEntries: WorkExperience[] = [];
        let activeExp: WorkExperience | null = null;
        let bullets: string[] = [];

        for (let j = 0; j < secLines.length; j++) {
          const l = secLines[j];
          const hasDate = DATE_RANGE_REGEX.test(l);
          const isBullet = /^[•\-\*▪]/.test(l);

          // If line has date range and isn't a bullet description, we start a new entry
          if (hasDate && !isBullet) {
            // Save previous entry's bullets
            if (activeExp) {
              activeExp.description = bullets.join("\n");
              expEntries.push(activeExp);
            }
            
            bullets = [];
            
            // Guess title, company, dates from line
            // Google - Software Engineer (Jan 2020 - Present)
            // or: Google | Software Engineer | 2018 - 2020
            const dateMatch = l.match(DATE_RANGE_REGEX);
            const dateStr = dateMatch ? dateMatch[0] : "";
            const textWithoutDate = l.replace(DATE_RANGE_REGEX, "").trim();

            const splitTokens = textWithoutDate
              .split(/[\-\|,\(\)]+/)
              .map(t => t.trim())
              .filter(t => t.length > 0);

            let company = "Company";
            let position = "Position";
            let location = "";

            if (splitTokens.length >= 2) {
              position = splitTokens[0];
              company = splitTokens[1];
              if (splitTokens.length >= 3) {
                location = splitTokens[2];
              }
            } else if (splitTokens.length === 1) {
              position = splitTokens[0];
            }

            // Parse Dates
            let startDate = "";
            let endDate = "";
            let current = false;
            
            if (dateStr) {
              const dateParts = dateStr.split(/[-–to]+/i).map(d => d.trim());
              startDate = dateParts[0] || "";
              endDate = dateParts[1] || "";
              current = endDate.toLowerCase().includes("present") || endDate.toLowerCase().includes("current");
            }

            activeExp = {
              id: generateId(),
              company,
              position,
              location,
              startDate,
              endDate,
              current,
              description: "",
            };
          } else if (isBullet && activeExp) {
            bullets.push(l.replace(/^[•\-\*▪]\s*/, ""));
          } else if (activeExp) {
            // Append as bullet or additional line description
            bullets.push(l);
          }
        }

        // Save last entry
        if (activeExp) {
          activeExp.description = bullets.join("\n");
          expEntries.push(activeExp);
        }

        parsedData.experience = expEntries;
        break;
      }

      case "education": {
        const eduEntries: Education[] = [];
        let activeEdu: Education | null = null;

        for (let j = 0; j < secLines.length; j++) {
          const l = secLines[j];
          const hasDate = DATE_RANGE_REGEX.test(l);
          const isDegree = /bachelor|master|phd|degree|b\.s\.|m\.s\.|b\.a\.|m\.a\.|diploma/i.test(l);

          if ((hasDate || isDegree) && !l.startsWith("•") && !l.startsWith("-")) {
            if (activeEdu) eduEntries.push(activeEdu);

            const dateMatch = l.match(DATE_RANGE_REGEX);
            const dateStr = dateMatch ? dateMatch[0] : "";
            const textWithoutDate = l.replace(DATE_RANGE_REGEX, "").trim();

            const splitTokens = textWithoutDate
              .split(/[\-\|,\(\)]+/)
              .map(t => t.trim())
              .filter(t => t.length > 0);

            let institution = "Institution";
            let degree = "Degree";
            let location = "";

            if (splitTokens.length >= 2) {
              degree = splitTokens[0];
              institution = splitTokens[1];
              if (splitTokens.length >= 3) {
                location = splitTokens[2];
              }
            } else if (splitTokens.length === 1) {
              if (isDegree) {
                degree = splitTokens[0];
              } else {
                institution = splitTokens[0];
              }
            }

            // Parse Dates
            let startDate = "";
            let endDate = "";
            if (dateStr) {
              const dateParts = dateStr.split(/[-–to]+/i).map(d => d.trim());
              startDate = dateParts[0] || "";
              endDate = dateParts[1] || "";
            }

            activeEdu = {
              id: generateId(),
              institution,
              degree,
              location,
              startDate,
              endDate,
            };
          } else if (activeEdu) {
            // If additional detail lines exist
            if (l.toLowerCase().includes("gpa") || l.toLowerCase().includes("honors")) {
              activeEdu.degree += ` (${l})`;
            } else if (activeEdu.institution === "Institution") {
              activeEdu.institution = l;
            }
          }
        }

        if (activeEdu) eduEntries.push(activeEdu);
        parsedData.education = eduEntries;
        break;
      }

      case "projects": {
        const projEntries: Project[] = [];
        let activeProj: Project | null = null;
        let projBullets: string[] = [];

        for (let j = 0; j < secLines.length; j++) {
          const l = secLines[j];
          const isBullet = /^[•\-\*▪]/.test(l);
          
          // Projects split: usually lines containing tech stacks or URL links, or bold text titles
          // Let's create new project when a line is not a bullet and has length < 40
          if (!isBullet && l.length < 40 && l.split(/\s+/).length < 6) {
            if (activeProj) {
              activeProj.description = projBullets.join("\n");
              projEntries.push(activeProj);
            }
            
            projBullets = [];
            
            activeProj = {
              id: generateId(),
              name: l,
              techStack: "",
              description: "",
            };
          } else if (isBullet && activeProj) {
            const cleanText = l.replace(/^[•\-\*▪]\s*/, "");
            
            // Try to guess tech stack from bullet descriptors
            if (cleanText.toLowerCase().includes("tech stack") || cleanText.toLowerCase().includes("technologies")) {
              activeProj.techStack = cleanText.replace(/tech\s+stack:?|technologies:?/i, "").trim();
            } else {
              projBullets.push(cleanText);
            }
          } else if (activeProj) {
            projBullets.push(l);
          }
        }

        if (activeProj) {
          activeProj.description = projBullets.join("\n");
          projEntries.push(activeProj);
        }

        parsedData.projects = projEntries;
        break;
      }

      case "certifications": {
        const certEntries: Certification[] = [];
        
        secLines.forEach(l => {
          if (l.length > 5 && !l.startsWith("•") && !l.startsWith("-")) {
            // AWS Certified Developer - Amazon Web Services, 2021
            const tokens = l.split(/[,-|]+/).map(t => t.trim());
            const name = tokens[0] || "Certification";
            const issuer = tokens[1] || "";
            const yearMatch = l.match(/\b\d{4}\b/);
            const year = yearMatch ? yearMatch[0] : "";

            certEntries.push({
              id: generateId(),
              name,
              issuer,
              year,
            });
          }
        });

        parsedData.certifications = certEntries;
        break;
      }

      case "languages": {
        const langEntries: Language[] = [];

        secLines.forEach(l => {
          if (l.length > 2) {
            // English - Fluent
            // Spanish (Intermediate)
            const tokens = l.split(/[\-\(]+/).map(t => t.trim().replace(/\)/g, ""));
            const name = tokens[0] || "Language";
            const proficiency = tokens[1] || "Native";

            langEntries.push({
              id: generateId(),
              name,
              proficiency,
            });
          }
        });

        parsedData.languages = langEntries;
        break;
      }

      case "custom": {
        parsedData.customSections.push({
          id: generateId(),
          title: section.title,
          content: secLines.join("\n"),
        });
        break;
      }
    }
  }

  // Fallback: If no experience/education was parsed but text is huge, parse blocks as custom sections
  if (parsedData.experience.length === 0 && parsedData.education.length === 0 && sections.length === 0) {
    parsedData.summary = "CV Parser was unable to identify distinct headings automatically. Please refine your section headings using standard format like 'Work Experience', 'Skills', or 'Education' to trigger parsing.";
    parsedData.customSections.push({
      id: generateId(),
      title: "Extracted Content",
      content: text,
    });
  }

  return parsedData;
}
