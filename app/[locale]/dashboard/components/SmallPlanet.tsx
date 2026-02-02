
"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Planet } from "@/planet-engine/components/Planet";
import type { PlanetType } from "@/planet-engine/types/planet.types";

interface SmallPlanetProps {
  type: PlanetType;
  seed: number;
  className?: string;
}

export function SmallPlanet({ type, seed, className }: SmallPlanetProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]} // Limit DPR for performance in many instances
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
          
          <Planet 
            type={type} 
            seed={seed} 
            radius={2.2} 
            resolution={24} // Lower resolution for sidebar
          />

          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
