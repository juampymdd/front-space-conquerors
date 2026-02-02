"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Planet } from "@/planet-engine/components/Planet";
import { Suspense, useState, useEffect } from "react";

export function HeroPlanet() {
    // Responsive sizing based on viewport
    const [planetSize, setPlanetSize] = useState(2);
    const [cameraDistance, setCameraDistance] = useState(12);

    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            
            // Scale planet and camera based on viewport width
            if (width < 640) {
                // Mobile
                setPlanetSize(0.9);
                setCameraDistance(6.5);
            } else if (width < 1024) {
                // Tablet
                setPlanetSize(1.1);
                setCameraDistance(7.5);
            } else if (width < 1440) {
                // Small desktop
                setPlanetSize(1.3);
                setCameraDistance(9);
            } else {
                // Large desktop
                setPlanetSize(1.5);
                setCameraDistance(10);
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Datos del planeta icy sin luna
    const icyPlanetData = {
        id: "hero-planet",
        name: "Glacius Prime",
        type: "icy" as const,
        seed: 42069,
        radius: planetSize,
        orbit: {
            semiMajorAxis: 0,
            eccentricity: 0,
            inclination: 0,
            startAngle: 0,
            orbitalPeriod: 0,
        },
    };

    return (
        <div className="w-full h-full pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, cameraDistance], fov: 50 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[10, 5, 5]}
                        intensity={2}
                        color="#14a0e6"
                    />
                    <pointLight
                        position={[-8, -5, -5]}
                        intensity={0.8}
                        color="#88ccff"
                    />
                    <pointLight
                        position={[0, 8, 0]}
                        intensity={0.3}
                        color="#ffffff"
                    />

                    {/* Planet with moon */}
                    <Planet data={icyPlanetData} resolution={64} />

                    {/* Controls - auto-rotate */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.3}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
