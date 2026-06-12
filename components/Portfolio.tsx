"use client";

import React, { useState, useRef, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, FolderGit2, X, BarChart3, Settings2 } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  summary: string;
  role: string;
  outcome: string;
  tech: string[];
  metrics: string;
  gradient: string;
  url: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Logistics Without Borders",
    category: "Paid Acquisition & Analytics",
    summary: "Created multi-channel campaign architectures across the GCC region, linking API-driven server conversions with GA4 standard trackers.",
    role: "Performance Marketer & Analytics Lead",
    outcome: "+35% lead acquisition volume at 18% lower cost per acquisition (CPA) using offline conversion uploads.",
    tech: ["GA4 APIs", "GTM Server-side", "Meta CAPI", "Looker Studio"],
    metrics: "18% lower CPA",
    gradient: "from-blue-600/20 to-emerald-600/20",
    url: "#"
  },
  {
    id: 2,
    title: "BOSQ Ergonomic Living Campaign",
    category: "Growth & SEO Restructure",
    summary: "Led technical website optimization, resolved duplicate canonical URL indexes, and scaled Meta catalog assets for high-end workspace seating.",
    role: "Paid Media Specialist & SEO strategist",
    outcome: "+40% organic traffic lift within 6 months and a reduction of cart drop-offs on product description pages.",
    tech: ["Shopify Plus", "Meta Ads", "Google Ads", "Technical SEO"],
    metrics: "+40% Organic Traffic Lift",
    gradient: "from-emerald-650/20 to-purple-600/20",
    url: "#"
  },
  {
    id: 3,
    title: "Premium Window Tinting UAE",
    category: "Paid Search & High-Ticket Leads",
    summary: "Engineered ultra-local search structures on Google Maps and search networks targeting high-net-worth vehicle owners in Dubai and Abu Dhabi.",
    role: "Lead Generation Architect",
    outcome: "Generated consistent high-intent booking conversions and reduced customer contact time by 40%.",
    tech: ["Google Local Service Ads", "Local SEO", "WhatsApp Funnel", "CallRail"],
    metrics: "40% faster contact time",
    gradient: "from-zinc-800/50 to-zinc-950/50",
    url: "#"
  },
  {
    id: 4,
    title: "Together Thrive Community",
    category: "Growth Marketing & Funnels",
    summary: "Orchestrated onboarding funnels and micro-targeted referral pages for a prominent regional community initiative.",
    role: "Growth Engineer",
    outcome: "Grew active community membership from scratch to +15,000 users with zero direct media spend.",
    tech: ["Viral Loops", "ActiveCampaign", "React Web", "Analytics Tracking"],
    metrics: "+15,000 members organic",
    gradient: "from-indigo-600/20 to-pink-650/20",
    url: "#"
  },
  {
    id: 5,
    title: "Custom Luxury Furniture Maker",
    category: "Catalog Scaling",
    summary: "Created localized Meta Advantage Shopping campaigns and high-ticket Google Search structures with asset feed optimizations.",
    role: "Paid Catalog Strategist",
    outcome: "Maintained a consistent 4.8x ROAS over 12 months with optimized dynamic creative feeds.",
    tech: ["Meta Catalogs", "Merchant Center", "Dynamic Remarketing"],
    metrics: "Average 4.8x ROAS",
    gradient: "from-yellow-600/10 to-emerald-600/20",
    url: "#"
  },
  {
    id: 6,
    title: "Premium Interior Design Studio",
    category: "Visual Funnels & Pinterest Traffic",
    summary: "Built visually-driven funnels on Pinterest and Instagram showcasing high-end villa remodels across Riyadh and Dubai.",
    role: "Social Traffic Optimizer",
    outcome: "Increased site referrals from visual social channels by 220% and unlocked luxury consultation leads.",
    tech: ["Pinterest Ads", "Instagram Ads", "Showit CMS", "Pixel Setup"],
    metrics: "+220% Visual Referral Traffic",
    gradient: "from-cyan-600/20 to-blue-600/20",
    url: "#"
  },
  {
    id: 7,
    title: "UAE SEO Authority Agency",
    category: "Organic Keyword Mapping",
    summary: "Restructured internal keyword hierarchies, optimized core web vitals, and established topical authority outlines for high-competition keywords.",
    role: "SEO Architect",
    outcome: "Ranked 18 high-volume transactional terms on Page 1 of Google within four months.",
    tech: ["Semrush", "Screaming Frog", "Structured Schema", "Wordpress Core"],
    metrics: "18 keywords on Page 1",
    gradient: "from-emerald-600/20 to-sky-600/20",
    url: "#"
  },
  {
    id: 8,
    title: "Multi-Purpose Smart Furniture",
    category: "Crowdfunding & Pre-Launch",
    summary: "Constructed pre-launch landing systems, integrated email collection forms, and executed pre-registration campaigns on Meta.",
    role: "Pre-Launch Campaign Lead",
    outcome: "Secured +8,000 VIP pre-registrations leading to a fully funded Indiegogo launching window.",
    tech: ["Leadpages", "Zapier Automation", "Meta Pixel API", "Klaviyo"],
    metrics: "+8,000 VIP subscribers",
    gradient: "from-orange-600/20 to-purple-600/20",
    url: "#"
  }
];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="relative bg-[#050505] py-24 px-6 md:px-12 border-t border-brand-gray-900/40">
      
      {/* Background visual element */}
      <div className="absolute top-[20%] right-[10%] w-[40%] aspect-square rounded-full bg-brand-blue/3 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <span className="text-brand-emerald text-sm font-semibold uppercase tracking-wider block">
              Case Studies & Portfolio
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Growth Projects That Delivered ROI
            </h2>
            <p className="text-brand-gray-400 text-sm sm:text-base">
              A showcase of B2B and e-commerce campaigns executed across the GCC region. Hover to interact with the parallax depth, and click to view the implementation results.
            </p>
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <TiltCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Case Study Modal Detail View */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-brand-card border border-brand-gray-800/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Banner Gradient */}
              <div className={`h-32 bg-gradient-to-r ${selectedProject.gradient} relative flex items-end p-6 border-b border-brand-gray-800/40`}>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-brand-dark/50 text-brand-gray-400 hover:text-white hover:bg-brand-dark transition-colors focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                  aria-label="Close case study details"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-emerald bg-brand-dark/40 px-2 py-0.5 rounded">
                    {selectedProject.category}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Modal Core Contents */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-brand-gray-800/40 pb-6">
                  {/* Scope of work */}
                  <div className="space-y-1">
                    <span className="text-xs text-brand-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Settings2 className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Role Scope</span>
                    </span>
                    <p className="text-sm font-medium text-white">{selectedProject.role}</p>
                  </div>
                  {/* Results Metric */}
                  <div className="space-y-1">
                    <span className="text-xs text-brand-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-brand-emerald" />
                      <span>Metric Hit</span>
                    </span>
                    <p className="text-sm font-bold text-brand-emerald">{selectedProject.metrics}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">Project Summary</h4>
                  <p className="text-brand-gray-400 text-sm leading-relaxed">{selectedProject.summary}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-brand-emerald text-sm uppercase tracking-wider">Outcome & ROI</h4>
                  <p className="text-brand-gray-300 text-sm leading-relaxed">{selectedProject.outcome}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">Tech Stack Deployment</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((techItem) => (
                      <span
                        key={techItem}
                        className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-brand-dark border border-brand-gray-800 text-brand-gray-300"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 sm:p-6 bg-[#0a0a0a] border-t border-brand-gray-800/40 flex items-center justify-end">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-full bg-brand-gray-800 text-white font-heading font-semibold text-sm hover:bg-brand-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                >
                  Close Case Study
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* 
  Custom Hardware-Accelerated 3D Parallax Tilt Card component.
  Calculates cursor position and applies dynamic rotations on X and Y axes.
*/
function TiltCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize coordinates around card center: values range from -0.5 to 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Apply tilt angles: max 12 degrees tilt
    setRotateX(-mouseY * 12);
    setRotateY(mouseX * 12);
  };

  const handleMouseLeave = () => {
    // Reset to flat
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group bg-brand-card border border-brand-gray-800/45 rounded-xl overflow-hidden cursor-pointer select-none transition-all duration-300 hover:border-brand-emerald/45 h-80 flex flex-col justify-between"
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Top Banner Cover Gradient representing Screenshot placeholder */}
      <div className={`h-28 bg-gradient-to-br ${project.gradient} relative p-5 flex items-start justify-between border-b border-brand-gray-800/20`}>
        <FolderGit2 className="w-5 h-5 text-brand-emerald/70" />
        <span className="text-[9px] font-bold text-brand-blue uppercase tracking-widest bg-brand-dark/60 px-2 py-0.5 rounded">
          {project.category}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-grow flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-base text-white group-hover:text-brand-emerald transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-brand-gray-400 text-xs leading-relaxed line-clamp-3">
            {project.summary}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-brand-gray-800/30">
          <span className="text-xs font-bold text-brand-emerald">
            {project.metrics}
          </span>
          <span className="text-[10px] text-brand-gray-500 font-bold uppercase tracking-wider flex items-center gap-0.5">
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
