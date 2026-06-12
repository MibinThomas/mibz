"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TimelineSceneProps {
  activeIndex: number;
  scrollProgress: number;
}

export default function TimelineScene({ activeIndex, scrollProgress }: TimelineSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const sphereRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Coordinates of career milestone platforms
  const milestonePoints = useMemo(() => [
    new THREE.Vector3(-1.8, -1.6, 0.4),
    new THREE.Vector3(-0.9, -0.8, -0.6),
    new THREE.Vector3(0, 0, 0.8),
    new THREE.Vector3(0.9, 0.8, -0.6),
    new THREE.Vector3(1.8, 1.6, 0.4),
  ], []);

  // Set ref list size dynamically
  useMemo(() => {
    sphereRefs.current = sphereRefs.current.slice(0, milestonePoints.length);
  }, [milestonePoints]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Slow, drift orientation for the entire track
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.08 + scrollProgress * 0.4;
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.08;
    }

    // 2. Animate Chrome Spheres (float active, spin all)
    milestonePoints.forEach((_, idx) => {
      const sphere = sphereRefs.current[idx];
      if (sphere) {
        // Active sphere floats up and down with amplitude
        if (idx === activeIndex) {
          sphere.position.y = Math.sin(time * 2.5) * 0.15;
          sphere.rotation.y = time * 1.5;
        } else {
          // Standard hover decay
          sphere.position.y = THREE.MathUtils.lerp(sphere.position.y, 0, 0.1);
          sphere.rotation.y = time * 0.3;
        }
      }
    });

    // 3. Translate tracking cursor glowing node
    if (cursorRef.current && milestonePoints[activeIndex]) {
      const targetPos = milestonePoints[activeIndex].clone();
      // Position cursor slightly above the sphere
      targetPos.y += 0.45 + Math.sin(time * 3) * 0.05;
      cursorRef.current.position.lerp(targetPos, 0.08);
      cursorRef.current.rotation.z = time * 2;
      cursorRef.current.rotation.x = time * 1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting controls for reflections */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={0.4} color="#3b82f6" />
      
      {/* Colored point lights to paint the platforms */}
      <pointLight position={[-2, -1.5, 0.5]} intensity={0.8} color="#10b981" distance={4} />
      <pointLight position={[0, 0, 1.0]} intensity={0.8} color="#3b82f6" distance={4} />
      <pointLight position={[2, 1.5, 0.5]} intensity={0.8} color="#10b981" distance={4} />

      {/* Career Track Connecting Pipes (Realistic Tube Rail) */}
      <TimelineRails points={milestonePoints} />

      {/* Career milestones elements */}
      {milestonePoints.map((pos, idx) => {
        const isActive = idx === activeIndex;
        const color = idx % 2 === 0 ? "#10b981" : "#3b82f6";
        
        return (
          <group key={idx} position={pos}>
            
            {/* Pedestal Base (Brushed Charcoal Steel) */}
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.26, 0.32, 0.08, 16]} />
              <meshStandardMaterial color="#1f2937" metalness={0.85} roughness={0.3} />
            </mesh>

            {/* Pedestal Core Column (Translucent Glass) */}
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.32, 16]} />
              <meshStandardMaterial
                color={color}
                roughness={0.05}
                opacity={isActive ? 0.8 : 0.35}
                transparent
                emissive={color}
                emissiveIntensity={isActive ? 0.75 : 0.08}
              />
            </mesh>

            {/* Floating Reflective Chrome Sphere */}
            <mesh
              ref={(el) => { sphereRefs.current[idx] = el; }}
              position={[0, 0.15, 0]}
            >
              <sphereGeometry args={[0.16, 32, 32]} />
              <meshPhysicalMaterial
                color={isActive ? "#ffffff" : "#9ca3af"}
                metalness={0.98}
                roughness={0.05}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
              />
            </mesh>

            {/* Glowing active floor aura */}
            {isActive && (
              <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.3, 0.45, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
              </mesh>
            )}

          </group>
        );
      })}

      {/* Floating Active Cursor Target (Pulsing holographic torus) */}
      <mesh ref={cursorRef}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
      </mesh>

    </group>
  );
}

/* Helper to render realistic connecting pipeline rails between nodes */
function TimelineRails({ points }: { points: THREE.Vector3[] }) {
  const railSegments = useMemo(() => {
    const segments: React.ReactNode[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      
      const distance = start.distanceTo(end);
      const position = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      
      // Calculate rotation matrix to align cylinder with start/end vector
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      const alignAxis = new THREE.Vector3(0, 1, 0); // Cylinders point along Y by default
      const quaternion = new THREE.Quaternion().setFromUnitVectors(alignAxis, direction);

      segments.push(
        <mesh key={i} position={position} quaternion={quaternion}>
          <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
          <meshStandardMaterial
            color="#4b5563"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
      );
    }
    return segments;
  }, [points]);

  return <group>{railSegments}</group>;
}


