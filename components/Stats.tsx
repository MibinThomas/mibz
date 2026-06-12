"use client";

import React, { useEffect, useState, useRef } from "react";
import { Quote, Sparkles } from "lucide-react";

interface StatItem {
  id: number;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: StatItem[] = [
  { id: 1, value: 4.5, suffix: "x", label: "Average ROAS", description: "Across GCC paid ads client portfolios" },
  { id: 2, value: 40, suffix: "%", label: "Organic Traffic Lift", description: "Achieved inside 6 months for BOSQ" },
  { id: 3, value: 1.2, suffix: "M+", label: "Ad Spend Managed", description: "Scaled across Google, Meta, and TikTok" },
  { id: 4, value: 96, suffix: "%", label: "Client Retention", description: "B2B & E-commerce growth engagements" }
];

const testimonials = [
  {
    quote: "Mibin standardized our analytics stack completely. He resolved site structure duplicates and scaled our catalog ads. The +40% lift in organic traffic was a game-changer for our showroom traffic in Dubai.",
    author: "BOSQ Marketing Lead",
    role: "Premium Ergonomic Furniture Brand, UAE",
    metrics: "4.5x Catalog ROAS"
  },
  {
    quote: "We struggled to target high-net-worth vehicle owners in Dubai until Mibin restructured our Google Search funnel. The Local Service LSA ads generated direct booking leads within weeks.",
    author: "Operations Director",
    role: "Luxury Vehicle Window Tinting Service, GCC",
    metrics: "-30% Customer Acquisition Cost (CAC)"
  }
];

export default function Stats() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section
      id="results"
      ref={sectionRef}
      className="relative bg-[#080808] py-24 px-6 md:px-12 border-t border-brand-gray-900/40"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-brand-emerald text-sm font-semibold uppercase tracking-wider block">
            Proven Performance Metrics
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            E-Commerce Growth Confirmed by Data
          </h2>
          <p className="text-brand-gray-400">
            Below are certified performance metrics achieved across our client portfolio campaigns. No guessing, just transparent acquisition ROI.
          </p>
        </div>

        {/* Dynamic Animating Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <CounterCard
              key={stat.id}
              target={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              trigger={visible}
            />
          ))}
        </div>

        {/* Client Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
          {testimonials.map((test, index) => (
            <div
              key={index}
              className="p-8 md:p-10 rounded-2xl bg-brand-card border border-brand-gray-800/40 relative flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-brand-emerald/10 pointer-events-none" />
              
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{test.metrics}</span>
                </div>
                <p className="text-brand-gray-300 text-base leading-relaxed italic">
                  &quot;{test.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-brand-gray-800/30">
                <div className="w-10 h-10 rounded-full bg-brand-dark border border-brand-gray-800 flex items-center justify-center font-heading font-bold text-brand-blue">
                  {test.author[0]}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    {test.author}
                  </h4>
                  <span className="text-xs text-brand-gray-500 font-medium">
                    {test.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CounterCardProps {
  target: number;
  suffix: string;
  label: string;
  description: string;
  trigger: boolean;
}

function CounterCard({ target, suffix, label, description, trigger }: CounterCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const duration = 1500; // 1.5 seconds animation duration
    const stepTime = 30; // Milliseconds per update
    const totalSteps = duration / stepTime;
    const stepValue = target / totalSteps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        // Handle float roundups cleanly
        setCount(parseFloat(start.toFixed(target % 1 === 0 ? 0 : 1)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [trigger, target]);

  return (
    <div className="p-6 rounded-xl bg-brand-card border border-brand-gray-800/30 flex flex-col justify-between gap-4">
      <div className="space-y-1">
        <div className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight flex items-baseline">
          <span>{count}</span>
          <span className="text-brand-emerald">{suffix}</span>
        </div>
        <h3 className="font-heading font-bold text-sm text-brand-gray-200">
          {label}
        </h3>
      </div>
      <p className="text-brand-gray-500 text-xs leading-relaxed border-t border-brand-gray-800/40 pt-3">
        {description}
      </p>
    </div>
  );
}
