"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ThreeCanvas from "@/components/ThreeCanvas";
import UnifiedScene from "@/components/UnifiedScene";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeAboutIndex, setActiveAboutIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      
      const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial run

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark overflow-x-hidden flex flex-col justify-between selection:bg-brand-emerald/30 selection:text-brand-emerald">
      
      {/* Dynamic Sticky Header Navigation */}
      <Navbar />

      {/* 
        GLOBAL SCROLL-LINKED 3D VIEWPORT (Fixed on the right side)
        Pointer events are disabled so clicks pass through to standard HTML fields.
      */}
      <div className="hidden lg:block fixed top-0 right-0 w-[45%] h-screen pointer-events-none z-0">
        <div className="w-full h-full p-12">
          <ThreeCanvas fallbackSvg={null} cameraPosition={[0.3, 0.4, 5.0]}>
            <UnifiedScene scrollProgress={scrollProgress} activeAboutIndex={activeAboutIndex} />
          </ThreeCanvas>
        </div>
      </div>

      {/* Main content sections wrapping individual blocks */}
      <main id="main-content" className="flex-grow z-10 relative">
        <Hero />
        <About onActiveIndexChange={setActiveAboutIndex} />
        <Services />
        <Portfolio />
        <Stats />
        <Contact />
      </main>

      {/* Global Footer badge coordinate references */}
      <Footer />
      
    </div>
  );
}
