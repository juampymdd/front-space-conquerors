"use client";

import React, { useMemo, Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { twMerge } from "tailwind-merge";
import * as THREE from "three";
import { MoveLeft, Info, Target } from "lucide-react";
import { SolarSystem } from "@/planet-engine/components/SolarSystem";
import { SolarSystemGenerator } from "@/planet-engine/generators/solar-system-generator";
import { useTranslations } from "next-intl";

interface SolarSystemViewProps {
  seed: number;
  selectedPlanetId?: string;
  className?: string;
}

export function SolarSystemView({ seed, selectedPlanetId: initialPlanetId, className }: SolarSystemViewProps) {
  const t = useTranslations("dashboard.solarView");
  const tp = useTranslations("dashboard.planetTypes");
  const [activePlanet, setActivePlanet] = useState<any>(null);
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [isFollowing, setIsFollowing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const controlsRef = useRef<any>(null);

  const systemData = useMemo(() => {
    const generator = new SolarSystemGenerator(seed);
    return generator.generate({
      planetCount: 10,
      systemRadius: 60
    });
  }, [seed]);

  const handlePlanetSelect = (planet: any) => {
    if (planet) {
      setActivePlanet(planet);
      setIsFollowing(true);
      setIsResetting(false);
    } else {
      resetCamera();
    }
  };

  const handlePositionUpdate = (planetId: string, position: THREE.Vector3) => {
    if (activePlanet?.id === planetId) {
      targetPosition.copy(position);
    }
  };

  const resetCamera = () => {
    setActivePlanet(null);
    setIsFollowing(false);
    setIsResetting(true);
    // Explicitly set a new vector to trigger state updates correctly
    setTargetPosition(new THREE.Vector3(0, 0, 0));
    
    // Hard reset controls target if available to prevent fighting
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
    }
  };

  return (
    <div className={twMerge("relative overflow-hidden group/solar", className)}>
      <Canvas
        camera={{ position: [0, 60, 100], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={150} color="#ffffff" distance={400} decay={1} />
          
          <Grid 
            infiniteGrid 
            sectionSize={10} 
            sectionThickness={1.5} 
            sectionColor="#4d9fff" 
            cellSize={2} 
            cellThickness={0.5} 
            cellColor="#1a3a5c" 
            fadeDistance={200} 
            fadeStrength={5}
            position={[0, -2, 0]} 
          />
          
          <SolarSystem 
            data={systemData} 
            selectedPlanetId={activePlanet?.id || null}
            onPlanetSelect={handlePlanetSelect}
            onPlanetPositionUpdate={handlePositionUpdate}
          />

          <CameraFollower 
            target={targetPosition} 
            isFollowing={isFollowing}
            isResetting={isResetting}
            onResetComplete={() => setIsResetting(false)}
            controlsRef={controlsRef} 
          />

          <OrbitControls 
            ref={controlsRef}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={2.5}
            maxDistance={500}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {/* Info Menu Overlay */}
      <div className={twMerge(
        "absolute right-6 top-6 w-72 transition-all duration-700 ease-in-out z-30",
        activePlanet ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}>
        {activePlanet && (
          <div className="bg-background/80 backdrop-blur-xl border border-primary/20 p-6 space-y-6 shadow-2xl relative overflow-hidden">
            {/* HUD Scanline Effect inside menu */}
            <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="text-[10px] font-mono text-primary/40 uppercase tracking-[0.2em] mb-1">
                  {t("targetIdentity")}
                </div>
                <h3 className="text-xl font-black text-primary uppercase tracking-widest">{activePlanet.name}</h3>
              </div>
              <div className="size-8 border border-primary/20 flex items-center justify-center text-primary/40">
                <Target size={16} />
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/5 border border-primary/10">
                  <div className="text-[9px] font-mono text-primary/40 uppercase mb-1 text-left">
                    {t("classification")}
                  </div>
                  <div className="text-xs font-bold text-primary uppercase text-left">
                    {tp(activePlanet.type.toLowerCase())}
                  </div>
                </div>
                <div className="p-3 bg-primary/5 border border-primary/10">
                  <div className="text-[9px] font-mono text-primary/40 uppercase mb-1 text-left">
                    {t("orbitRadius")}
                  </div>
                  <div className="text-xs font-bold text-primary text-left">{activePlanet.orbit.semiMajorAxis.toFixed(1)} AU</div>
                </div>
              </div>

              <div className="p-4 border border-primary/5 bg-primary/[0.02]">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={12} className="text-primary/40" />
                  <span className="text-[9px] font-mono text-primary/40 uppercase tracking-widest">
                    {t("orbitalTelemetry")}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-primary/40 uppercase">{t("eccentricity")}</span>
                    <span className="text-primary font-mono">{activePlanet.orbit.eccentricity.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-primary/40 uppercase">{t("inclination")}</span>
                    <span className="text-primary font-mono">{activePlanet.orbit.inclination.toFixed(2)}°</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-primary/40 uppercase">{t("period")}</span>
                    <span className="text-primary font-mono">{activePlanet.orbit.orbitalPeriod.toFixed(1)}d</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={resetCamera}
              className="w-full h-10 border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-mono uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn relative z-10"
            >
              <MoveLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
              {t("backButton")}
            </button>
          </div>
        )}
      </div>

      {/* Decorative HUD for system view */}
      <div className={twMerge(
        "absolute bottom-6 left-6 z-10 transition-opacity duration-500",
        activePlanet ? "opacity-0" : "opacity-40"
      )}>
        <div className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] flex items-center gap-3">
          <span className="inline-block size-1.5 bg-primary animate-pulse" />
          {t("liveFeed")} // Seed {seed}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 60, 100);

function CameraFollower({ 
  target, 
  isFollowing, 
  isResetting, 
  onResetComplete, 
  controlsRef 
}: { 
  target: THREE.Vector3; 
  isFollowing: boolean; 
  isResetting: boolean;
  onResetComplete: () => void;
  controlsRef: React.RefObject<any> 
}) {
  useFrame(({ camera }) => {
    if (controlsRef.current) {
      if (isFollowing) {
        // Smoothly move the controls target to follow the planet
        controlsRef.current.target.lerp(target, 0.1);
        
        const direction = new THREE.Vector3()
          .subVectors(camera.position, controlsRef.current.target)
          .normalize();
        
        const desiredDistance = 3.5;
        const desiredPosition = new THREE.Vector3()
          .copy(controlsRef.current.target)
          .add(direction.multiplyScalar(desiredDistance));
        
        camera.position.lerp(desiredPosition, 0.1);
      } else if (isResetting) {
        // Smoothly return to overview position and center target
        controlsRef.current.target.lerp(target, 0.15); // Faster lerp for target
        camera.position.lerp(DEFAULT_CAMERA_POSITION, 0.05);

        // Check if we arrived or are very close
        const distToPos = camera.position.distanceTo(DEFAULT_CAMERA_POSITION);
        const distToTarget = controlsRef.current.target.distanceTo(target);
        
        if (distToPos < 0.2 && distToTarget < 0.05) {
          // Force final values
          camera.position.copy(DEFAULT_CAMERA_POSITION);
          controlsRef.current.target.copy(target);
          onResetComplete();
        }
      }
      
      controlsRef.current.update();
    }
  });
  return null;
}
