"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GrowthSceneProps {
  scrollProgress: number;
}

export default function GrowthScene({ scrollProgress }: GrowthSceneProps) {
  const rocketRef = useRef<THREE.Group>(null);
  const thrusterFlameRef = useRef<THREE.Points>(null);
  const starsRef = useRef<THREE.Points>(null);

  // Procedural thruster exhaust particles representing flame & smoke
  const [flamePositions, flameColors] = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Small cone distribution below thruster
      positions[i * 3] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = -1.2 - Math.random() * 2.0; // Shoot downward
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      // Color transition from bright yellow to deep red
      const ratio = Math.random();
      const color = new THREE.Color();
      if (ratio < 0.3) {
        color.set("#ffea00"); // Yellow core
      } else if (ratio < 0.7) {
        color.set("#ff7600"); // Orange plume
      } else {
        color.set("#ff0000"); // Red outer edge
      }
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  // Background stars environment
  const [starPositions, starColors] = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colEmerald = new THREE.Color("#10b981");
    const colBlue = new THREE.Color("#3b82f6");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const mixVal = Math.random();
      const finalColor = new THREE.Color().lerpColors(colEmerald, colBlue, mixVal);
      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Scroll-linked launch mechanics
    if (rocketRef.current) {
      // Smoothly interpolate height from resting position to launched position
      const targetY = -1.0 + scrollProgress * 3.5;
      rocketRef.current.position.y = THREE.MathUtils.lerp(
        rocketRef.current.position.y,
        targetY,
        0.08
      );

      // Rocket attitude rotation (subtle pitch & yaw as it launches)
      rocketRef.current.rotation.y = time * 0.4;
      rocketRef.current.rotation.z = Math.sin(time * 0.8) * 0.05 + (scrollProgress * 0.15);
      rocketRef.current.rotation.x = Math.cos(time * 0.5) * 0.03;
    }

    // 2. Animate Flame Particles (flame thrusters pulse)
    if (thrusterFlameRef.current) {
      const positions = thrusterFlameRef.current.geometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        // Reset particles that shoot too far down
        if (positions[i * 3 + 1] < -4.0) {
          positions[i * 3] = (Math.random() - 0.5) * 0.25;
          positions[i * 3 + 1] = -1.2;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
        } else {
          // Shoot particles downward with high velocity
          positions[i * 3 + 1] -= 0.1 + Math.random() * 0.08;
          // Apply light spread
          positions[i * 3] += (Math.random() - 0.5) * 0.02;
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.02;
        }
      }
      thrusterFlameRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Stars rotation
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.015;
    }
  });

  return (
    <group>
      {/* Dynamic Lighting System for metallic sheen */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[10, 15, 8]} intensity={1.8} color="#ffffff" castShadow />
      <directionalLight position={[-10, -5, -8]} intensity={0.6} color="#3b82f6" />
      
      {/* Thruster reflection glow */}
      <pointLight position={[0, -2, 0]} intensity={1.8} distance={6} color="#ff7600" />
      <pointLight position={[2, 2, 2]} intensity={1.0} color="#10b981" />

      {/* Grid launchpad */}
      <gridHelper 
        args={[15, 24, "#1f2937", "#0d131f"]} 
        position={[0, -2.4, 0]} 
        rotation={[0.08, 0, 0]}
      />

      {/* DETAILED REALISTIC ROCKET GROUP */}
      <group ref={rocketRef} position={[0, -1.0, 0]}>
        
        {/* Main Fuselage Body (Silver Brushed Metal) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 2.0, 32]} />
          <meshPhysicalMaterial
            color="#d1d5db"
            metalness={0.9}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Nose Cone (Gleaming Emerald Metallic Finish) */}
        <mesh position={[0, 1.45, 0]}>
          <coneGeometry args={[0.5, 0.9, 32]} />
          <meshStandardMaterial
            color="#10b981"
            metalness={0.85}
            roughness={0.2}
            emissive="#064e3b"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Cockpit Window Ring (Black Trim) */}
        <mesh position={[0, 0.5, 0.45]} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.18, 0.04, 8, 24]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Cockpit Glass Dome */}
        <mesh position={[0, 0.5, 0.45]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.05}
            opacity={0.8}
            transparent
          />
        </mesh>

        {/* Tail Thruster Nozzle (Industrial Copper) */}
        <mesh position={[0, -1.15, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 0.3, 16]} />
          <meshStandardMaterial
            color="#b45309"
            metalness={0.95}
            roughness={0.3}
          />
        </mesh>

        {/* Aerodynamic Stabilizer Fins (3-axis symmetric grid) */}
        {/* Fin 1 - Back */}
        <mesh position={[0, -0.7, -0.65]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.7, 0.4]} />
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.3} />
        </mesh>
        
        {/* Fin 2 - Left front */}
        <mesh position={[-0.56, -0.7, 0.325]} rotation={[0, Math.PI / 3, 0]}>
          <boxGeometry args={[0.08, 0.7, 0.4]} />
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Fin 3 - Right front */}
        <mesh position={[0.56, -0.7, 0.325]} rotation={[0, -Math.PI / 3, 0]}>
          <boxGeometry args={[0.08, 0.7, 0.4]} />
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Thruster Plume Flame Particles */}
        <points ref={thrusterFlameRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[flamePositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[flameColors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.15}
            vertexColors
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>

      </group>

      {/* Outer Atmosphere Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

    </group>
  );
}
