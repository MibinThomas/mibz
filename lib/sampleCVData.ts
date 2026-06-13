import { CVData } from "../types/cv";

export const sampleCVData: CVData = {
  personalInfo: {
    fullName: "Mibin Thomas",
    jobTitle: "Senior Growth Marketer & Developer",
    email: "mibin@example.com",
    phone: "+971 50 123 4567",
    location: "Dubai, UAE",
    linkedinUrl: "https://www.linkedin.com/in/mibin-thomas/",
    portfolioUrl: "https://mibinthomas.com",
    githubUrl: "https://github.com/mibinthomas"
  },
  summary: "Results-driven Growth Marketer and Web Developer with over 6 years of experience scaling e-commerce brands in the UAE and GCC region. Spearheaded paid advertising campaigns across Meta, Google, and TikTok that generated over $15M in tracked revenue. Combining deep technical expertise in Next.js and full-stack integration with data-driven CRO strategies to optimize funnel conversion rates and lower acquisition costs.",
  experience: [
    {
      id: "exp-1",
      company: "Apex Digital UAE",
      position: "Lead Growth Engineer & Performance Specialist",
      location: "Dubai, UAE",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      description: "- Spearheaded performance marketing campaigns across Meta, TikTok, and Google Ads, managing an annual ad spend of $1.2M with a consistent 4.2x ROAS.\n- Engineered custom headless e-commerce store templates using Next.js and Shopify API, improving page speed by 45% and mobile conversion rate by 1.2%.\n- Developed advanced GA4 and GTM analytics tagging structures to capture granular conversion funnels, reducing attribution gaps by 25%.\n- Directed a team of three media buyers and two designers to execute rapid A/B testing on ad creatives, resulting in a 30% reduction in customer acquisition cost (CAC)."
    },
    {
      id: "exp-2",
      company: "Gulf E-Commerce Solutions",
      position: "Digital Marketing & Developer Associate",
      location: "Dubai, UAE",
      startDate: "2020-01",
      endDate: "2022-02",
      current: false,
      description: "- Executed paid social campaigns on Snapchat and Meta, growing a retail brand's online sales by 180% year-over-year in Saudi Arabia and UAE.\n- Designed and built over 25 landing pages using Tailwind CSS and React, achieving an average landing page conversion rate of 6.5%.\n- Implemented email automation sequences using Klaviyo, driving 22% of total e-commerce store revenue through personalized flows.\n- Conducted comprehensive conversion rate optimization (CRO) audits, identifying funnel bottlenecks to increase average order value (AOV) by 15%."
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Heriot-Watt University Dubai",
      degree: "Bachelor of Science in Computer Science & Information Systems",
      location: "Dubai, UAE",
      startDate: "2016",
      endDate: "2019"
    }
  ],
  skills: [
    { id: "sk-1", name: "Meta Ads Manager", category: "marketing" },
    { id: "sk-2", name: "Google Analytics (GA4)", category: "marketing" },
    { id: "sk-3", name: "TikTok Ads Manager", category: "marketing" },
    { id: "sk-4", name: "Search Engine Optimization (SEO)", category: "marketing" },
    { id: "sk-5", name: "React & Next.js", category: "technical" },
    { id: "sk-6", name: "TypeScript & JavaScript", category: "technical" },
    { id: "sk-7", name: "Tailwind CSS & Git", category: "development" },
    { id: "sk-8", name: "Headless E-Commerce Integration", category: "technical" },
    { id: "sk-9", name: "A/B Testing & CRO", category: "soft" },
    { id: "sk-10", name: "Data Analytics & Attribution", category: "soft" }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Meta Certified Media Buying Professional",
      issuer: "Meta Blueprint",
      year: "2024",
      url: "https://meta.blueprint.certification"
    },
    {
      id: "cert-2",
      name: "Google Analytics Certification",
      issuer: "Google Skillshop",
      year: "2025"
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "SmartFunnel - Custom Headless Checkout System",
      url: "https://github.com/mibinthomas/smartfunnel",
      techStack: "Next.js, TypeScript, Stripe API, Tailwind CSS",
      description: "A fast, single-page headless checkout application engineered to optimize conversion rates for direct-to-consumer e-commerce brands in the Gulf region.",
      features: "- Achieved an average page loading speed of 0.4 seconds, outperforming default store checkouts by 300%.\n- Integrated multi-currency localized payment systems (Stripe, Tabby, Apple Pay) specific to the GCC market.\n- Automated immediate upsell/cross-sell suggestions, resulting in an average 12% increase in average order value."
    },
    {
      id: "proj-2",
      name: "GCC Attribution Analytics Tracker",
      techStack: "Node.js, Google Cloud Functions, GA4 Measurement Protocol",
      description: "An attribution analytics server designed to reconcile server-side events and client cookies to accurately track customer purchase journeys.",
      features: "- Solved iOS14+ tracking limitations by utilizing server-side CAPI event forwarding.\n- Reconciled discrepancies between CRM records and Google Analytics data to within a 3% error margin.\n- Generated automated automated ROI dashboards utilizing Looker Studio integrations."
    }
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Professional / Fluent" },
    { id: "lang-2", name: "Malayalam", proficiency: "Native" }
  ],
  customSections: [
    {
      id: "cust-1",
      title: "Honors & Awards",
      content: "- Winner of GCC Digital Marketer of the Year (E-Commerce Summit 2024)\n- Top Performer Award (Apex Digital UAE, 2023)"
    }
  ]
};
