"use client";

import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import Canvas and components with SSR disabled to prevent hydration mismatch errors
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

interface ThreeCanvasProps {
  children: React.ReactNode;
  fallbackSvg: React.ReactNode;
  cameraPosition?: [number, number, number];
}

export default function ThreeCanvas({
  children,
  fallbackSvg,
  cameraPosition = [0, 0, 5],
}: ThreeCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webGlAvailable, setWebGlAvailable] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Detect prefers-reduced-motion media query
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    // Detect WebGL support
    try {
      const canvas = document.createElement("canvas");
      const supportsWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebGlAvailable(supportsWebGL);
    } catch {
      setWebGlAvailable(false);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Show skeletal preloader before mount
  if (!mounted) {
    return <ThreeCanvasSkeleton />;
  }

  // Gracefully degrade to optimized 2D SVGs if WebGL is unavailable or user has requested reduced motion
  if (reducedMotion || !webGlAvailable) {
    return (
      <div className="w-full h-full flex items-center justify-center relative select-none">
        {fallbackSvg}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<ThreeCanvasSkeleton />}>
        <Canvas
          camera={{ position: cameraPosition, fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}

function ThreeCanvasSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-brand-dark/20 animate-pulse relative">
      <div className="flex flex-col items-center gap-4">
        {/* Glowing circular preloader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-brand-emerald/10"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-brand-emerald animate-spin"></div>
        </div>
        <span className="font-heading font-medium text-xs tracking-wider text-brand-gray-400 uppercase select-none">
          Loading 3D Visualizer...
        </span>
      </div>
    </div>
  );
}
