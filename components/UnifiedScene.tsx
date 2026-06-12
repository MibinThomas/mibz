"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface UnifiedSceneProps {
  scrollProgress: number;
  activeAboutIndex: number;
}

export default function UnifiedScene({ scrollProgress, activeAboutIndex }: UnifiedSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Refs for individual meshes
  const rocketRef = useRef<THREE.Group>(null);
  const thrusterFlameRef = useRef<THREE.Points>(null);
  const starsRef = useRef<THREE.Points>(null);
  const timelineGroupRef = useRef<THREE.Group>(null);
  const timelineSphereRefs = useRef<(THREE.Mesh | null)[]>([]);
  const timelineCursorRef = useRef<THREE.Mesh>(null);
  const dashboardGroupRef = useRef<THREE.Group>(null);

  // --- Data structures ---
  // About career track coordinates
  const milestonePoints = useMemo(() => [
    new THREE.Vector3(-1.6, -1.2, 0.4),
    new THREE.Vector3(-0.8, -0.6, -0.4),
    new THREE.Vector3(0, 0, 0.6),
    new THREE.Vector3(0.8, 0.6, -0.4),
    new THREE.Vector3(1.6, 1.2, 0.4),
  ], []);

  // Services Bar Chart Coordinates
  const barChartHeights = [1.2, 1.8, 0.9, 2.2];

  // Procedural flame particles
  const [flamePositions, flameColors] = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.25;
      positions[i * 3 + 1] = -1.2 - Math.random() * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.25;

      const ratio = Math.random();
      const col = new THREE.Color(ratio < 0.3 ? "#ffea00" : ratio < 0.7 ? "#ff7600" : "#ff0000");
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return [positions, colors];
  }, []);

  // Starfield
  const [starPositions, starColors] = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colEmerald = new THREE.Color("#10b981");
    const colBlue = new THREE.Color("#3b82f6");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      const mixRatio = Math.random();
      const finalColor = new THREE.Color().lerpColors(colEmerald, colBlue, mixRatio);
      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }
    return [positions, colors];
  }, []);

  // Set ref list size dynamically
  useMemo(() => {
    timelineSphereRefs.current = timelineSphereRefs.current.slice(0, milestonePoints.length);
  }, [milestonePoints]);

  // Unified Frame update containing camera path interpolation and object behaviors
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const camera = state.camera;

    // --- 1. Camera path interpolation based on scroll checkpoints ---
    // Define checkpoints
    const checkpointHero = { cam: new THREE.Vector3(0.3, 0.4, 5.0), look: new THREE.Vector3(0, -0.6, 0) };
    const checkpointAbout = { cam: new THREE.Vector3(1.8, 0.0, 4.0), look: new THREE.Vector3(0, 0.1, 0) };
    const checkpointServices = { cam: new THREE.Vector3(-2.2, 1.4, 3.8), look: new THREE.Vector3(0, 0.3, -0.5) };
    const checkpointContact = { cam: new THREE.Vector3(0, -1.0, 5.0), look: new THREE.Vector3(0, -1.8, 0) };

    const targetCam = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (scrollProgress < 0.2) {
      // Hero
      const t = scrollProgress / 0.2;
      targetCam.lerpVectors(checkpointHero.cam, checkpointAbout.cam, t);
      // Let the look-at target track the rocket launching upwards slightly
      const launchOffsetY = scrollProgress * 5.0;
      const lookHero = new THREE.Vector3(0, -0.6 + launchOffsetY, 0);
      targetLook.lerpVectors(lookHero, checkpointAbout.look, t);
    } else if (scrollProgress < 0.55) {
      // About
      const t = (scrollProgress - 0.2) / 0.35;
      targetCam.lerpVectors(checkpointAbout.cam, checkpointServices.cam, t);
      targetLook.lerpVectors(checkpointAbout.look, checkpointServices.look, t);
    } else if (scrollProgress < 0.85) {
      // Services / Portfolio
      const t = (scrollProgress - 0.55) / 0.3;
      targetCam.lerpVectors(checkpointServices.cam, checkpointContact.cam, t);
      targetLook.lerpVectors(checkpointServices.look, checkpointContact.look, t);
    } else {
      // Contact
      targetCam.copy(checkpointContact.cam);
      targetLook.copy(checkpointContact.look);
    }

    // Apply lerped camera vectors
    camera.position.lerp(targetCam, 0.05);
    camera.lookAt(targetLook);

    // --- 2. Element visibility and scale based on scroll sections ---
    // Rocket (Visible in Hero [0.0 - 0.25], launched high and faded after)
    if (rocketRef.current) {
      const rocketY = -1.2 + scrollProgress * 8.0; // Launch high
      rocketRef.current.position.y = THREE.MathUtils.lerp(rocketRef.current.position.y, rocketY, 0.08);
      rocketRef.current.rotation.y = time * 0.5;
      rocketRef.current.rotation.z = Math.sin(time * 0.8) * 0.04;
      
      // Scale down as we scroll out of Hero
      const targetScale = scrollProgress < 0.3 ? 1.0 : 0.0;
      rocketRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }

    // Timeline Track (Visible in About [0.15 - 0.55])
    if (timelineGroupRef.current) {
      const targetScale = (scrollProgress > 0.1 && scrollProgress < 0.6) ? 1.0 : 0.0;
      timelineGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      
      // Floating active chrome sphere
      milestonePoints.forEach((_, idx) => {
        const sphere = timelineSphereRefs.current[idx];
        if (sphere) {
          if (idx === activeAboutIndex && scrollProgress > 0.1 && scrollProgress < 0.6) {
            sphere.position.y = Math.sin(time * 2.2) * 0.12 + 0.15;
            sphere.rotation.y = time * 1.5;
          } else {
            sphere.position.y = THREE.MathUtils.lerp(sphere.position.y, 0.15, 0.1);
            sphere.rotation.y = time * 0.3;
          }
        }
      });

      // Cursor movement
      if (timelineCursorRef.current && milestonePoints[activeAboutIndex]) {
        const targetPos = milestonePoints[activeAboutIndex].clone();
        targetPos.y += 0.45 + Math.sin(time * 2.5) * 0.04;
        timelineCursorRef.current.position.lerp(targetPos, 0.08);
        timelineCursorRef.current.rotation.z = time * 2;
      }
    }

    // Services 3D Dashboard Grid (Visible in Services/Portfolio [0.5 - 0.85])
    if (dashboardGroupRef.current) {
      const targetScale = (scrollProgress > 0.48 && scrollProgress < 0.88) ? 1.0 : 0.0;
      dashboardGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      dashboardGroupRef.current.rotation.y = time * 0.15;
    }

    // Flame exhaust particles update
    if (thrusterFlameRef.current && scrollProgress < 0.3) {
      const positions = thrusterFlameRef.current.geometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        if (positions[i * 3 + 1] < -3.5) {
          positions[i * 3] = (Math.random() - 0.5) * 0.2;
          positions[i * 3 + 1] = -1.2;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
        } else {
          positions[i * 3 + 1] -= 0.09 + Math.random() * 0.06;
          positions[i * 3] += (Math.random() - 0.5) * 0.01;
        }
      }
      thrusterFlameRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Ambient stars movement
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 8]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-10, -5, -8]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, -2, 0]} intensity={1.2} color="#ff7600" distance={6} />

      {/* --- 1. ROCKET UNIT (Hero Segment) --- */}
      <group ref={rocketRef} position={[0, -1.2, 0]}>
        {/* Fuselage body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 1.8, 24]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.15} clearcoat={1.0} clearcoatRoughness={0.1} />
        </mesh>
        {/* Nose cone */}
        <mesh position={[0, 1.3, 0]}>
          <coneGeometry args={[0.42, 0.8, 24]} />
          <meshPhysicalMaterial color="#10b981" metalness={0.85} roughness={0.2} emissive="#064e3b" emissiveIntensity={0.2} />
        </mesh>
        {/* Dome window */}
        <mesh position={[0, 0.4, 0.38]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.9} roughness={0.05} opacity={0.8} transparent />
        </mesh>
        {/* Tail Nozzle */}
        <mesh position={[0, -1.02, 0]}>
          <cylinderGeometry args={[0.3, 0.38, 0.25, 16]} />
          <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.3} />
        </mesh>
        {/* Stabilizer Fins */}
        <mesh position={[0, -0.65, -0.5]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.6, 0.35]} />
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.43, -0.65, 0.25]} rotation={[0, Math.PI / 3, 0]}>
          <boxGeometry args={[0.06, 0.6, 0.35]} />
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.43, -0.65, 0.25]} rotation={[0, -Math.PI / 3, 0]}>
          <boxGeometry args={[0.06, 0.6, 0.35]} />
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Thruster Flame Plume */}
        <points ref={thrusterFlameRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[flamePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[flameColors, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.12} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} sizeAttenuation />
        </points>
      </group>

      {/* --- 2. CAREER TRACK SYSTEM (About Segment) --- */}
      <group ref={timelineGroupRef}>
        <TimelineRails points={milestonePoints} />
        {milestonePoints.map((pos, idx) => {
          const isActive = idx === activeAboutIndex;
          const color = idx % 2 === 0 ? "#10b981" : "#3b82f6";
          return (
            <group key={idx} position={pos}>
              {/* Pedestal base */}
              <mesh position={[0, -0.28, 0]}>
                <cylinderGeometry args={[0.22, 0.28, 0.08, 16]} />
                <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Glass core */}
              <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.28, 16]} />
                <meshStandardMaterial color={color} roughness={0.05} opacity={isActive ? 0.85 : 0.3} transparent emissive={color} emissiveIntensity={isActive ? 0.8 : 0.1} />
              </mesh>
              {/* Chrome sphere */}
              <mesh ref={(el) => { timelineSphereRefs.current[idx] = el; }} position={[0, 0.15, 0]}>
                <sphereGeometry args={[0.14, 24, 24]} />
                <meshPhysicalMaterial color={isActive ? "#ffffff" : "#9ca3af"} metalness={0.98} roughness={0.05} clearcoat={1.0} clearcoatRoughness={0.05} />
              </mesh>
            </group>
          );
        })}
        {/* Holographic Cursor */}
        <mesh ref={timelineCursorRef}>
          <torusGeometry args={[0.07, 0.015, 8, 16]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* --- 3. SERVICES BAR CHART GRID (Services Segment) --- */}
      <group ref={dashboardGroupRef} position={[0, -0.5, 0]}>
        {/* Grid Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.9} />
        </mesh>
        
        {/* Grid Lines */}
        <gridHelper args={[4, 10, "#1f2937", "#1f2937"]} position={[0, -0.19, 0]} />

        {/* 4 E-Commerce Columns (Metallic Towers) */}
        {barChartHeights.map((h, i) => {
          const x = -1.2 + i * 0.8;
          const color = i % 2 === 0 ? "#10b981" : "#3b82f6";
          return (
            <group key={i} position={[x, -0.2, 0]}>
              {/* Solid bar */}
              <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[0.3, h, 0.3]} />
                <meshPhysicalMaterial color={color} metalness={0.8} roughness={0.15} clearcoat={1.0} clearcoatRoughness={0.1} />
              </mesh>
              {/* Glowing Top Indicator */}
              <mesh position={[0, h + 0.08, 0]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color={color} />
              </mesh>
              {/* Light glow */}
              <pointLight position={[0, h, 0]} intensity={0.5} distance={2} color={color} />
            </group>
          );
        })}
      </group>

      {/* --- BACKGROUND PARTICLES --- */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.65} sizeAttenuation />
      </points>

    </group>
  );
}

function TimelineRails({ points }: { points: THREE.Vector3[] }) {
  const segments = useMemo(() => {
    const lines: React.ReactNode[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      const dist = start.distanceTo(end);
      const pos = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      lines.push(
        <mesh key={i} position={pos} quaternion={quaternion}>
          <cylinderGeometry args={[0.03, 0.03, dist, 8]} />
          <meshStandardMaterial color="#4b5563" metalness={0.85} roughness={0.3} />
        </mesh>
      );
    }
    return lines;
  }, [points]);
  return <group>{segments}</group>;
}
