"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface UnifiedSceneProps {
  scrollProgress: number;
  activeAboutIndex?: number;
}

export default function UnifiedScene({ scrollProgress }: UnifiedSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Refs for individual meshes
  const starsRef = useRef<THREE.Points>(null);
  
  // Globe Refs
  const globeRef = useRef<THREE.Group>(null);
  const connectionDotsRef = useRef<(THREE.Mesh | null)[]>([]);

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

  // GCC Marketing & E-commerce Hotspot coordinates
  const gccNodesRaw = useMemo(() => [
    { name: "Dubai", lat: 0.44, lon: 0.96, color: "#10b981" },
    { name: "Riyadh", lat: 0.42, lon: 0.80, color: "#3b82f6" },
    { name: "Doha", lat: 0.44, lon: 0.89, color: "#f59e0b" },
    { name: "Kuwait", lat: 0.51, lon: 0.84, color: "#ec4899" },
    { name: "Muscat", lat: 0.40, lon: 1.01, color: "#10b981" },
  ], []);

  const globeRadius = 1.6;

  const gccNodes = useMemo(() => {
    return gccNodesRaw.map((node) => {
      // Spherical coordinates conversion
      const x = globeRadius * Math.cos(node.lat) * Math.sin(node.lon);
      const y = globeRadius * Math.sin(node.lat);
      const z = globeRadius * Math.cos(node.lat) * Math.cos(node.lon);
      return {
        ...node,
        position: new THREE.Vector3(x, y, z),
      };
    });
  }, [gccNodesRaw]);

  // GCC Connections network Bezier curves
  const connectionCurves = useMemo(() => {
    const connections = [
      { from: 1, to: 0 }, // Riyadh -> Dubai
      { from: 1, to: 2 }, // Riyadh -> Doha
      { from: 2, to: 0 }, // Doha -> Dubai
      { from: 3, to: 1 }, // Kuwait -> Riyadh
      { from: 4, to: 0 }, // Muscat -> Dubai
    ];

    return connections.map((conn, idx) => {
      const start = gccNodes[conn.from].position;
      const end = gccNodes[conn.to].position;
      
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(globeRadius + 0.22); // arch height
      
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      return {
        id: idx,
        points: curve.getPoints(20),
        color: gccNodes[conn.from].color,
        start,
        mid,
        end,
      };
    });
  }, [gccNodes]);

  // Set connection dots ref array length
  useMemo(() => {
    connectionDotsRef.current = connectionDotsRef.current.slice(0, connectionCurves.length);
  }, [connectionCurves]);

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
    // (Other foreground elements removed, keeping only background stars and globe)

    // Ambient stars movement
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.01;
    }

    // --- 4. Background Globe Scroll & Time Animation ---
    if (globeRef.current) {
      // Rotation: combines slow steady time auto-rotation + active scroll progress rotation
      globeRef.current.rotation.y = time * 0.04 + scrollProgress * Math.PI * 1.6;
      // Tilt: maps directly to page scroll
      globeRef.current.rotation.x = -0.15 + scrollProgress * 0.5;
    }

    // Animate network packet dots along Bezier curves
    connectionCurves.forEach((c, idx) => {
      const dot = connectionDotsRef.current[idx];
      if (dot) {
        const progress = (time * 0.3 + idx * 0.2) % 1.0;
        const t = progress;
        const mt = 1 - t;
        
        // Quadratic Bezier interpolation
        const x = mt * mt * c.start.x + 2 * mt * t * c.mid.x + t * t * c.end.x;
        const y = mt * mt * c.start.y + 2 * mt * t * c.mid.y + t * t * c.end.y;
        const z = mt * mt * c.start.z + 2 * mt * t * c.mid.z + t * t * c.end.z;
        
        dot.position.set(x, y, z);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 8]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-10, -5, -8]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, -2, 0]} intensity={1.2} color="#ff7600" distance={6} />

      {/* Foreground meshes removed - keeping only light sources, starfield, and background globe */}

      {/* --- BACKGROUND PARTICLES --- */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.65} sizeAttenuation />
      </points>

      {/* --- 4. HOLOGRAPHIC GLOBE BACKGROUND --- */}
      <group ref={globeRef} position={[0.5, -0.25, -2.5]}>
        {/* Semi-transparent dark globe body */}
        <mesh>
          <sphereGeometry args={[globeRadius, 32, 32]} />
          <meshPhysicalMaterial
            color="#090d16"
            emissive="#0d1b2a"
            emissiveIntensity={0.6}
            transparent
            opacity={0.45}
            roughness={0.4}
            metalness={0.8}
            depthWrite={false}
          />
        </mesh>

        {/* Emerald grid wireframe (lat/lon lines) */}
        <mesh>
          <sphereGeometry args={[globeRadius + 0.008, 30, 30]} />
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.15}
            wireframe
            depthWrite={false}
          />
        </mesh>

        {/* GCC Hotspot Nodes */}
        {gccNodes.map((node, idx) => (
          <group key={idx} position={node.position}>
            {/* Core glowing marker */}
            <mesh>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshBasicMaterial color={node.color} />
            </mesh>
            {/* Inner pulsing network ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.075, 0.008, 4, 16]} />
              <meshBasicMaterial color={node.color} transparent opacity={0.6} />
            </mesh>
            {/* Outer fading beacon ripple */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.12, 0.005, 4, 16]} />
              <meshBasicMaterial color={node.color} transparent opacity={0.3} />
            </mesh>
          </group>
        ))}

        {/* Connecting Network curves */}
        {connectionCurves.map((curve) => (
          <line key={curve.id}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array(curve.points.flatMap(p => [p.x, p.y, p.z])), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color={curve.color} transparent opacity={0.45} />
          </line>
        ))}

        {/* Data transmission packet meshes */}
        {connectionCurves.map((curve, idx) => (
          <mesh key={`dot-${curve.id}`} ref={(el) => { connectionDotsRef.current[idx] = el; }}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}

        {/* Rotating Outer Orbit Ring 1 - Emerald */}
        <group rotation={[Math.PI / 4, Math.PI / 6, 0]}>
          <mesh>
            <torusGeometry args={[2.0, 0.01, 8, 64]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.25} />
          </mesh>
        </group>

        {/* Rotating Outer Orbit Ring 2 - Electric Blue */}
        <group rotation={[-Math.PI / 3, -Math.PI / 5, 0]}>
          <mesh>
            <torusGeometry args={[2.25, 0.008, 8, 64]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
          </mesh>
        </group>

        {/* Rotating Outer Orbit Ring 3 - Orange/Amber */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[1.82, 0.005, 8, 48]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.15} />
          </mesh>
        </group>
      </group>

    </group>
  );
}

// TimelineRails helper removed
