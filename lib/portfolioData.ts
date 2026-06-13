export interface Project {
  slug: string;
  title: string;
  category: string;
  url: string;
  description: string;
  overview: string;
  industry: string;
  role: string;
  features: string[];
  tech: string[];
  themeColor: string; // Primary brand color used for custom ambient glows and card accents
  mockupType:
    | "automotive"
    | "logistics"
    | "healthcare"
    | "furniture"
    | "interior"
    | "marketing"
    | "recruitment"
    | "education";
}

export const projects: Project[] = [
  {
    slug: "powermec",
    title: "Powermec",
    category: "Automotive",
    url: "https://powermec.ae/",
    description: "A modern dark-themed automotive service website with a premium hero section, service highlights, and strong visual presentation.",
    overview: "Powermec is a premium car body, denting, and painting workshop located in Dubai, UAE. The objective was to build a visually engaging, dark-themed website that portrays their high-end craftsmanship, showcasing luxury vehicle transformations and offering seamless appointment inquiries.",
    industry: "Automotive Body & Dent Repair",
    role: "Lead Web Developer",
    features: [
      "Responsive premium dark-mode interface matching luxury automotive branding.",
      "Interactive workshop service highlight panels for body repairs and paint processes.",
      "Conversion-optimized booking form with automatic WhatsApp follow-up routes.",
      "High-speed image showcase featuring before/after slider components."
    ],
    tech: ["Next.js 14", "Tailwind CSS", "Framer Motion", "TypeScript", "React Custom Sliders"],
    themeColor: "#10b981", // Emerald
    mockupType: "automotive"
  },
  {
    slug: "max-plus-uae",
    title: "Max Plus UAE",
    category: "Logistics",
    url: "https://maxplusuae.com/",
    description: "A clean logistics company website focused on transportation, freight, and borderless logistics services.",
    overview: "Max Plus UAE is a cross-border logistics and freight forwarding service provider based in Dubai. The platform was designed to show complex transportation, sea/air cargo, and storage services in a clean, user-friendly layouts tailored to corporate clients.",
    industry: "Logistics & Cross-Border Freight",
    role: "Front-End Developer & UI Designer",
    features: [
      "Custom shipping route interactive map presenting sea and land cargo networks.",
      "Real-time corporate quote builder with dynamic shipping volume calculators.",
      "Fully responsive corporate grids highlighting shipping, custom clearance, and warehousing.",
      "High-performance assets optimization ensuring sub-second LCP scores."
    ],
    tech: ["Next.js 14", "Tailwind CSS", "Lucide Icons", "Google Maps API Integration", "TypeScript"],
    themeColor: "#3b82f6", // Electric Blue
    mockupType: "logistics"
  },
  {
    slug: "metamedicx",
    title: "MetaMedicX",
    category: "Healthcare",
    url: "https://metamedicx.com/",
    description: "A modern healthcare-focused website with clean UI, professional service presentation, and trust-building design.",
    overview: "MetaMedicX is an innovative digital health and clinical consultation portal. The site provides a clean, comforting medical interface that highlights healthcare consulting, clinical services, and patient resources.",
    industry: "Healthcare & Biotech Solutions",
    role: "Full-Stack Developer",
    features: [
      "HIPAA-compliant contact pipelines with secure field sanitization.",
      "Responsive service listing grids categorizing diagnostic, consulting, and patient care tracks.",
      "Dynamic medical articles repository driven by static MDX pre-rendering.",
      "Optimized layout hierarchy to ensure high accessibility scores (WCAG AA compliant)."
    ],
    tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "MDX Parser"],
    themeColor: "#06b6d4", // Cyan
    mockupType: "healthcare"
  },
  {
    slug: "caropticz",
    title: "CarOpticz",
    category: "Automotive",
    url: "https://www.caropticz.com/",
    description: "A sleek automotive service website for tinting, detailing, and car protection services.",
    overview: "CarOpticz is a premier car window tinting and detailing studio in Kochi, India. The goal was to establish a high-end digital storefront highlighting heat-rejection tinting, ceramic coatings, and paint protection films (PPF).",
    industry: "Automotive Window Tinting & Detailing",
    role: "Lead Web Developer",
    features: [
      "Interactive tint simulator demonstrating window transparency percentages on vehicle models.",
      "Clean detailing package pricing comparison panels.",
      "Targeted lead acquisition forms focused on specific automobile models and trim packages.",
      "Fast-loading video backgrounds optimized with WebM formats."
    ],
    tech: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "HTML5 Video Engine"],
    themeColor: "#f59e0b", // Amber/Gold
    mockupType: "automotive"
  },
  {
    slug: "uae-kung-fu",
    title: "UAE Kung Fu Association",
    category: "Education",
    url: "https://uaekungfuassociation.ae/",
    description: "A dynamic association website for Kung Fu, Tai Chi, and Qigong, with strong visual identity and structured content.",
    overview: "The UAE Kung Fu Association website is the official portal for martial arts certifications and academy listings in the region. It hosts training guides, member registers, and club enrollment paths.",
    industry: "Sports & Martial Arts Association",
    role: "Full-Stack Developer",
    features: [
      "Dynamic training class schedules filtering Kung Fu, Tai Chi, and Qigong sessions.",
      "Secure online member registration system with digital enrollment certificates.",
      "Elegant instructor profiles showcasing lineages, certifications, and academy records.",
      "Interactive events timeline showing upcoming national martial arts championships."
    ],
    tech: ["Next.js 14", "Tailwind CSS", "TypeScript", "Prisma ORM", "PostgreSQL"],
    themeColor: "#dc2626", // Red
    mockupType: "education"
  },
  {
    slug: "eg-living",
    title: "EG Living",
    category: "Furniture",
    url: "https://egliving.ae/",
    description: "A custom furniture and interior website with product-focused layouts, elegant visuals, and conversion-focused design.",
    overview: "EG Living is a luxury workspace furniture manufacturer based in Dubai. The platform displays high-end ergonomic seating, solid wood desks, and modular meeting configurations to B2B corporate office designers.",
    industry: "Furniture, Workspace Design & E-Commerce",
    role: "Lead E-Commerce Developer",
    features: [
      "Product collection listings with fast filtering based on workspace categories.",
      "Interactive product details builder showcasing wood finishes and upholstery variables.",
      "GA4 Enhanced E-commerce tags capturing checkout steps and catalog CTR.",
      "Custom responsive B2B inquiry card routing quotes to sales managers."
    ],
    tech: ["Shopify Plus", "Liquid templating", "Tailwind CSS", "GTM Server-side", "JavaScript"],
    themeColor: "#10b981", // Emerald
    mockupType: "furniture"
  },
  {
    slug: "westline",
    title: "Westline",
    category: "Furniture", // Categorized under Furniture/Interior as requested
    url: "https://www.westline.ae/",
    description: "A premium interior design and fit-out website with project-oriented layouts and modern visual storytelling.",
    overview: "Westline is a high-end turnkey interior design and fit-out contractor in Dubai. The website was created to present luxury residential villas and commercial offices through high-impact visual grids.",
    industry: "Interior Design & Fit-Out Contractors",
    role: "Lead Web Developer",
    features: [
      "Immersive project galleries displaying architectural drafts alongside final photos.",
      "Structured fit-out stage indicators showing client process timelines.",
      "Optimized Next.js image components handling large architectural portfolios with lazy loading.",
      "Integrated booking consultation forms."
    ],
    tech: ["Next.js 14", "Tailwind CSS", "Framer Motion", "Sanity CMS", "TypeScript"],
    themeColor: "#8b5cf6", // Purple
    mockupType: "interior"
  },
  {
    slug: "seo-pro-hub",
    title: "SEO Pro Hub",
    category: "Marketing",
    url: "https://seoprohub.ae/",
    description: "A professional SEO agency website focused on lead generation, service clarity, and conversion.",
    overview: "SEO Pro Hub is a specialized search marketing agency in Dubai. The site acts as a client acquisition engine, clarifying SEO packages, displaying case studies, and capturing search performance audit requests.",
    industry: "Digital Marketing & SEO Agency",
    role: "Lead Web Developer & SEO Strategist",
    features: [
      "Real-time site audit request pipeline mapping lead details straight to CRM dashboards.",
      "Dynamic SEO ROI projection tables displaying potential traffic gains.",
      "Optimized schema metadata rendering rich search fragments on Google Search.",
      "Sub-second page speeds built using static compilation frameworks."
    ],
    tech: ["Next.js", "Tailwind CSS", "TypeScript", "Klaviyo API", "JSON-LD Schema"],
    themeColor: "#3b82f6", // Electric Blue
    mockupType: "marketing"
  },
  {
    slug: "hiba-furniture",
    title: "Hiba Furniture",
    category: "Furniture",
    url: "https://hibafurniture.com/",
    description: "A furniture website with clean product presentation, workspace visuals, and enquiry-focused user experience.",
    overview: "Hiba Furniture is a wholesale custom home furniture studio. The website serves as a B2C catalog showing smart beds, space-saving wardrobes, and ergonomic workspace items.",
    industry: "Home Furnishings & Smart Furniture",
    role: "Front-End Developer",
    features: [
      "Custom product selector widget with instantaneous quote calculators.",
      "Dynamic catalog search handling thousands of SKUs.",
      "Direct WhatsApp Business API coordinate integration.",
      "Touch-responsive visual sliders optimized for mobile browsers."
    ],
    tech: ["React Web", "Vite", "Tailwind CSS", "Redux Toolkit", "WhatsApp API Integration"],
    themeColor: "#d97706", // Amber
    mockupType: "furniture"
  },
  {
    slug: "sinolink-international",
    title: "Sinolink International",
    category: "Logistics",
    url: "https://sinolinkinternational.com/",
    description: "A global logistics website with large hero visuals, shipping-oriented messaging, and service highlights.",
    overview: "Sinolink International handles international shipping, air freight, and bulk trade networks between China and the GCC. The website showcases shipping containers, logistical routes, and import/export compliance guidelines.",
    industry: "Global Shipping & Import/Export Trade",
    role: "Lead Web Developer",
    features: [
      "Large-scale interactive hero visual showing global shipping cargo routes.",
      "Custom trade compliance knowledgebase with structured category guides.",
      "Multi-language support handling English, Arabic, and Chinese interfaces.",
      "B2B service quotation forms with automated email alerts."
    ],
    tech: ["Next.js 14", "Tailwind CSS", "Framer Motion", "i18next Integration", "TypeScript"],
    themeColor: "#2563eb", // Blue
    mockupType: "logistics"
  },
  {
    slug: "talentcore-jobs",
    title: "TalentCore Jobs",
    category: "Recruitment",
    url: "https://www.talentcorejobs.com/auth",
    description: "A recruitment platform login/auth interface with clean UI, user-friendly form design, and professional branding.",
    overview: "TalentCore Jobs is a modern HR portal matching candidates with corporate GCC roles. The custom authorization gateway was engineered to provide secure login, signups, and applicant routing.",
    industry: "HR Tech & Candidate Recruitment",
    role: "UI/UX Developer",
    features: [
      "Glassmorphic, highly-polished auth card design optimized for conversion.",
      "Client-side verified password strength meters and accessibility helpers.",
      "Multi-role routing redirection separating job seekers from corporate recruiters.",
      "Zero layout shift design preventing visual errors on mobile keyboards."
    ],
    tech: ["React", "NextAuth.js", "Tailwind CSS", "Framer Motion", "Zod Validation"],
    themeColor: "#db2777", // Pink
    mockupType: "recruitment"
  },
  {
    slug: "voxbridge-academy",
    title: "VoxBridge Academy",
    category: "Education",
    url: "https://voxbridgeacademy.com/",
    description: "An education website with a modern academy layout, course-focused structure, and clean visual design.",
    overview: "VoxBridge Academy is an educational and linguistic training hub. The website presents courses in business communication, language fluencies, and certification curricula for professionals.",
    industry: "E-Learning & Language Education",
    role: "Lead Web Developer",
    features: [
      "Custom course search and filter catalog matching candidate professional paths.",
      "Interactive curriculum visual timeline showing syllabus phases and hours.",
      "Direct online class application portal integrating file uploads for documents.",
      "Optimized CDN assets pipeline ensuring high accessibility index."
    ],
    tech: ["Next.js", "Tailwind CSS", "TypeScript", "GraphQL API", "Sanity CMS"],
    themeColor: "#7c3aed", // Violet
    mockupType: "education"
  },
  {
    slug: "vaitafe",
    title: "Vaitafe",
    category: "Furniture",
    url: "https://vaitafe.com/",
    description: "A modern furniture/workspace website with premium office visuals and clean service navigation.",
    overview: "Vaitafe delivers high-end corporate office workstations and design consulting across the GCC. The website showcases acoustic panels, workstation desks, and office ergonomic designs.",
    industry: "Corporate Office Systems & Furniture",
    role: "UI Developer",
    features: [
      "Clean modular configuration panel demonstrating office layout blueprints.",
      "Acoustic panel material color selection board.",
      "Fully responsive navigation layouts with sidebar drawers.",
      "B2B quote checkout cart enabling procurement managers to download product PDFs."
    ],
    tech: ["Next.js 14", "Tailwind CSS", "Framer Motion", "React PDF Engine", "Sanity Studio"],
    themeColor: "#4f46e5", // Indigo
    mockupType: "furniture"
  },
  {
    slug: "webeyecraft",
    title: "Webeyecraft",
    category: "Marketing",
    url: "https://webeyecraft.com/",
    description: "A premium IT solutions and digital agency website focusing on bespoke web development, branding, and cloud transformation.",
    overview: "Webeyecraft Technologies is a full-service digital agency delivering high-performance mobile and web solutions, custom enterprise applications, and cloud migration services. The platform serves as a modern portfolio showcasing agency capabilities, product case studies, and cloud consultancy services.",
    industry: "IT Services & Digital Solutions",
    role: "Full-Stack Developer & Technical Lead",
    features: [
      "Interactive agency service discovery panels highlighting custom web/app development and digital marketing.",
      "Dynamic project portfolio showcase featuring client digital transformations.",
      "Optimized, secure enterprise client inquiry form with automated routing.",
      "Performance-focused static pages achieving sub-second load times and zero layout shifts."
    ],
    tech: ["Next.js 14", "Tailwind CSS", "Framer Motion", "TypeScript", "Node.js", "Resend API"],
    themeColor: "#6366f1", // Indigo
    mockupType: "marketing"
  }
];
