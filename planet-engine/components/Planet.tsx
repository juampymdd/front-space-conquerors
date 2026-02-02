"use client";

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { PlanetType } from '../types/planet.types';
import { PlanetFactory } from '../factory.planet';
import { calculateOrbitalPosition, generateOrbitPath } from '../types/solar-system.types';
import type { SolarPlanetData, SolarMoonData } from '../types/solar-system.types';

interface PlanetProps {
  /** Datos completos del planeta (desde DB/Generador) */
  data?: SolarPlanetData;
  /** Tipo manual (si no hay data) */
  type?: PlanetType;
  /** Seed manual (si no hay data) */
  seed?: number;
  radius?: number;
  resolution?: number;
  /** Distancia inicial a la cámara para LOD */
  initialDistance?: number;
  /** Si true, actualiza LOD dinámicamente */
  dynamicLOD?: boolean;
}

export const Planet = ({ 
  data,
  type = 'rocky', 
  seed = 12345, 
  radius = 2, 
  resolution = 32,
  initialDistance = 5,
  dynamicLOD = false 
}: PlanetProps) => {
  // Priorizar datos del objeto SolarPlanetData
  const effectiveType = data?.type || type;
  const effectiveSeed = data?.seed || seed;
  const effectiveRadius = data?.radius ? data.radius * 2 : radius; // Escalar para vista individual

  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const generatorRef = useRef(PlanetFactory.create(type, seed, radius, resolution));
  const { camera } = useThree();

  // Crear el generador y generar geometría/material
  const { geometry, material } = useMemo(() => {
    const gen = PlanetFactory.create(effectiveType, effectiveSeed, effectiveRadius, resolution);
    generatorRef.current = gen;
    
    const geo = gen.generateGeometryWithLOD(initialDistance);
    const mat = gen.createMaterial();
    
    return { geometry: geo, material: mat };
  }, [effectiveType, effectiveSeed, effectiveRadius, resolution, initialDistance]);

  // Guardar referencia al material para animaciones
  useEffect(() => {
    if (material) {
      materialRef.current = material;
    }
  }, [material]);

  // Animación: rotación y actualización de tiempo
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      
      // Actualizar uniforme de tiempo si existe
      if (materialRef.current?.uniforms?.uTime) {
        materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      }

      // LOD dinámico (opcional, para sistema solar)
      if (dynamicLOD) {
        const distance = camera.position.distanceTo(meshRef.current.position);
        // TODO: Implementar cambio de geometría en runtime si es necesario
        // const newResolution = generatorRef.current.calculateLODResolution(distance);
        void distance; // Evitar warning de variable no usada
      }
    }
  });

  // Factor de escala para las lunas (para que coincidan con el escalado del planeta en esta vista)
  const scaleFactor = data?.radius ? effectiveRadius / data.radius : 1;

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} />
      
      {/* Renderizar anillos si vienen en la data */}
      {data?.rings && (
        <group rotation={[-Math.PI / 2 + data.rings.tilt, data.rings.tilt * 0.5, 0]}>
          {data.rings.bands.map((band, i) => (
            <mesh key={i}>
              <ringGeometry 
                args={[
                  effectiveRadius * band.innerRadius, 
                  effectiveRadius * band.outerRadius, 
                  128 // Más resolución para vista de cerca
                ]} 
              />
              <meshBasicMaterial 
                color={band.color} 
                transparent 
                opacity={band.opacity}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}
      {/* Renderizar lunas si vienen en la data con el mismo factor de escala */}
      {data?.moons?.map((moon) => (
        <OrbitingMoon key={moon.id} moon={moon} scale={scaleFactor} />
      ))}
    </group>
  );
};

/**
 * Componente para renderizar una luna orbitando un planeta
 */
const OrbitingMoon = ({ moon, scale = 1 }: { moon: SolarMoonData; scale?: number }) => {
  const moonRef = useRef<THREE.Mesh>(null!);
  
  // Escalar la órbita (ser robusto ante datos planos o anidados)
  const effectiveOrbit = useMemo(() => {
    const orbit = moon.orbit || {
      semiMajorAxis: (moon as any).semiMajorAxis,
      eccentricity: (moon as any).eccentricity,
      inclination: (moon as any).inclination,
      startAngle: (moon as any).startAngle,
      orbitalPeriod: (moon as any).orbitalPeriod,
    };
    
    return {
      ...orbit,
      semiMajorAxis: (orbit.semiMajorAxis || 0) * scale
    };
  }, [moon, scale]);

  const orbitPoints = useMemo(() => generateOrbitPath(effectiveOrbit, 64), [effectiveOrbit]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const pos = calculateOrbitalPosition(effectiveOrbit, time);
    if (moonRef.current) {
      moonRef.current.position.set(pos.x, pos.y, pos.z);
    }
  });

  return (
    <>
      <Line 
        points={orbitPoints.map(p => new THREE.Vector3(p.x, p.y, p.z))} 
        color="#ffffff" 
        lineWidth={0.2} 
        transparent 
        opacity={0.3} 
      />
      <mesh ref={moonRef}>
        <sphereGeometry args={[moon.radius * scale, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} emissive="#ffffff" emissiveIntensity={0.1} />
      </mesh>
    </>
  );
};