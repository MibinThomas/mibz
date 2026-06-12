"use client";

import React from "react";
import { CreditCard, Compass, BarChart, Layers, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Paid Media Strategy",
    icon: <CreditCard className="w-8 h-8 text-brand-emerald" />,
    description: "Paid acquisition campaigns scaled across Meta, Google, and TikTok. Engineered to hit strict CAC targets and maximize net profitability.",
    result: "Average 4.5x ROAS across portfolio accounts",
    tools: ["Meta Ads Manager", "Google Display/Search", "TikTok Ads", "TikTok Pixels"],
    metrics: "Scaled GCC budget by 2x while maintaining target CPA"
  },
  {
    title: "E-Commerce Growth Strategy",
    icon: <Compass className="w-8 h-8 text-brand-blue" />,
    description: "End-to-end user path mapping. We align inventory forecasting, GCC localizations, pricing grids, and multi-channel funnels.",
    result: "Structured scalable customer acquisition templates",
    tools: ["Shopify Plus", "Klaviyo CRM", "Wholesale B2B", "Funnel Mapping"],
    metrics: "Identified +15% revenue lift in cross-sell flows"
  },
  {
    title: "Conversion Rate Optimization (CRO)",
    icon: <Layers className="w-8 h-8 text-brand-emerald" />,
    description: "Audit of product description pages (PDP), cart pathways, and checkouts. Mitigate friction points and increase Average Order Value.",
    result: "-25% cart abandonment drop rate",
    tools: ["Hotjar", "Microsoft Clarity", "Shopify Checkout", "Optimizely"],
    metrics: "+18% Add-to-Cart rate improvement"
  },
  {
    title: "SEO & Analytics Infrastructure",
    icon: <BarChart className="w-8 h-8 text-brand-blue" />,
    description: "Clean schema structures, technical site speed audits, and standardized GA4 tags connected via Google Tag Manager (GTM).",
    result: "+40% Organic Traffic Lift in 6 months",
    tools: ["GTM Server-side", "GA4 Standardized", "Search Console", "Semrush"],
    metrics: "100% data tracking accuracy with Server-Side CAPI"
  }
];

export default function Services() {
  return (
    <section id="services" className="relative bg-[#080808] py-24 px-6 md:px-12 border-t border-brand-gray-900/40">
      
      {/* Background radial overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full bg-brand-emerald/2 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-brand-blue text-sm font-semibold uppercase tracking-wider block">
            Core Service Offerings
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Engineered for High-Conversion Revenue Growth
          </h2>
          <p className="text-brand-gray-400 leading-relaxed text-sm sm:text-base">
            {"Marketing shouldn't be a guessing game. I build highly-targeted, attribution-locked channels that turn media spend into measurable net customer lifetime value."}
          </p>
        </div>

        {/* Services Grid with 3D Flip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group h-[320px] w-full perspective-1000 select-none cursor-pointer"
            >
              {/* Card Container holding Front & Back */}
              <div className="relative w-full h-full transform-style-3d transition-transform duration-700 ease-out group-hover:rotate-y-180">
                
                {/* CARD FRONT PANEL */}
                <div className="absolute inset-0 backface-hidden bg-brand-card border border-brand-gray-800/40 rounded-xl p-8 flex flex-col justify-between hover:border-brand-emerald/40 transition-colors">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-brand-dark rounded-xl border border-brand-gray-800/45">
                        {service.icon}
                      </div>
                      <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading font-bold text-xl text-white">
                        {service.title}
                      </h3>
                      <p className="text-brand-gray-400 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-gray-450 uppercase tracking-widest group-hover:text-brand-emerald transition-colors">
                    <span>Hover to see results</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* CARD BACK PANEL (Flipped view) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-brand-gray-900 border border-brand-emerald/30 rounded-xl p-8 flex flex-col justify-between shadow-lg shadow-brand-emerald/5">
                  <div className="space-y-4">
                    <h3 className="font-heading font-bold text-lg text-brand-emerald">
                      {service.title} Growth Impact
                    </h3>
                    
                    <div className="space-y-2.5">
                      <div className="space-y-0.5">
                        <span className="block text-[10px] text-brand-gray-500 font-bold uppercase tracking-wider">Primary Outcome</span>
                        <span className="block text-sm font-semibold text-white">{service.result}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] text-brand-gray-500 font-bold uppercase tracking-wider">Key Metrics</span>
                        <span className="block text-sm font-semibold text-brand-blue">{service.metrics}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <span className="block text-[10px] text-brand-gray-500 font-bold uppercase tracking-wider">Preferred Tools</span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-dark border border-brand-gray-800 text-brand-gray-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
