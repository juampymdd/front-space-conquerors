import { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { StarGenerator } from '../generators/star-generator';
import { PlanetFactory } from '../factory.planet';
import { calculateOrbitalPosition, generateOrbitPath } from '../types/solar-system.types';
import type { SolarSystemData, SolarPlanetData, SolarMoonData } from '../types/solar-system.types';

interface SolarSystemProps {
  data: SolarSystemData;
  onPlanetSelect?: (planet: SolarPlanetData | null) => void;
  selectedPlanetId?: string | null;
  onPlanetPositionUpdate?: (planetId: string, position: THREE.Vector3) => void;
}

/**
 * Componente de Sistema Solar completo
 */
export const SolarSystem = ({ data, onPlanetSelect, selectedPlanetId, onPlanetPositionUpdate }: SolarSystemProps) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Pausar cuando hay hover
  const isPaused = hoveredPlanet !== null;
  
  // Manejar click en planeta (solo notifica al padre)
  const handlePlanetClick = useCallback((planet: SolarPlanetData) => {
    onPlanetSelect?.(planet);
  }, [onPlanetSelect]);

  return (
    <group>
      {/* Estrella central */}
      <Star starData={data.star} isPaused={isPaused} />
      
      {/* Planetas con órbitas */}
      {data.planets.map((planet: SolarPlanetData) => (
        <OrbitingPlanet 
          key={planet.id} 
          planet={planet} 
          isHovered={hoveredPlanet === planet.id}
          isSelected={selectedPlanetId === planet.id}
          isPaused={isPaused}
          pausedTimeRef={pausedTimeRef}
          lastTimeRef={lastTimeRef}
          onHover={setHoveredPlanet}
          onClick={handlePlanetClick}
          onPositionUpdate={onPlanetPositionUpdate}
        />
      ))}
    </group>
  );
};

/**
 * Componente de Estrella
 */
const Star = ({ starData, isPaused }: { starData: SolarSystemData['star']; isPaused: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const pausedTimeRef = useRef<number>(0);
  const lastRealTimeRef = useRef<number>(0);
  
  const { geometry, material } = useMemo(() => {
    const gen = new StarGenerator(starData.seed, starData.type, starData.radius);
    return {
      geometry: gen.generateGeometry(),
      material: gen.createMaterial(),
    };
  }, [starData]);

  useFrame((state) => {
    const realTime = state.clock.getElapsedTime();
    
    // Calcular tiempo efectivo (pausable)
    if (!isPaused) {
      const delta = realTime - lastRealTimeRef.current;
      pausedTimeRef.current += delta;
    }
    lastRealTimeRef.current = realTime;
    
    if (materialRef.current?.uniforms?.uTime) {
      materialRef.current.uniforms.uTime.value = pausedTimeRef.current;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material}>
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
};

/**
 * Componente de Planeta con órbita
 */
const OrbitingPlanet = ({
  planet,
  isHovered,
  isSelected,
  isPaused,
  pausedTimeRef,
  lastTimeRef,
  onHover,
  onClick,
  onPositionUpdate,
}: {
  planet: SolarPlanetData;
  isHovered: boolean;
  isSelected: boolean;
  isPaused: boolean;
  pausedTimeRef: React.MutableRefObject<number>;
  lastTimeRef: React.MutableRefObject<number>;
  onHover: (id: string | null) => void;
  onClick: (planet: SolarPlanetData) => void;
  onPositionUpdate?: (planetId: string, position: THREE.Vector3) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  
  // Generar geometría y material del planeta
  const { geometry, material } = useMemo(() => {
    const gen = PlanetFactory.create(planet.type, planet.seed, planet.radius, 16);
    return {
      geometry: gen.generateGeometry(),
      material: gen.createMaterial(),
    };
  }, [planet]);

  // Generar puntos de la órbita para visualización
  const orbitPoints = useMemo(() => {
    const points = generateOrbitPath(planet.orbit, 64);
    return points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
  }, [planet.orbit]);

  // Actualizar posición orbital
  useFrame((state) => {
    const realTime = state.clock.getElapsedTime();
    
    // Calcular tiempo efectivo (pausable)
    if (!isPaused) {
      const delta = realTime - lastTimeRef.current;
      pausedTimeRef.current += delta;
    }
    lastTimeRef.current = realTime;
    
    const effectiveTime = pausedTimeRef.current;
    const pos = calculateOrbitalPosition(planet.orbit, effectiveTime);
    
    if (groupRef.current) {
      groupRef.current.position.set(pos.x, pos.y, pos.z);
    }
    
    // Rotación del planeta sobre su eje (también pausable)
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += 0.002;
    }
    
    // Actualizar tiempo en material
    if (materialRef.current?.uniforms?.uTime) {
      materialRef.current.uniforms.uTime.value = effectiveTime;
    }
    
    // Notificar posición si está seleccionado
    if (isSelected && onPositionUpdate && groupRef.current) {
      onPositionUpdate(planet.id, groupRef.current.position.clone());
    }
  });

  // Escala por hover o selección
  const scale = isHovered ? 1.15 : isSelected ? 1.1 : 1;

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(planet.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    onHover(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(planet);
  };

  return (
    <>
      {/* Línea de órbita */}
      <Line
        points={orbitPoints.map(p => new THREE.Vector3(p.x, p.y, p.z))}
        color={isHovered ? '#ffffff' : '#333344'}
        lineWidth={isHovered ? 1.5 : 0.5}
        transparent
        opacity={0.5}
      />
      
      {/* Planeta */}
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          material={material}
          scale={scale}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          <primitive object={material} ref={materialRef} attach="material" />
        </mesh>
        
        {/* Anillos (si tiene) */}
        {planet.rings && (
          <group rotation={[-Math.PI / 2 + planet.rings.tilt, planet.rings.tilt * 0.5, 0]}>
            {planet.rings.bands.map((band, i) => (
              <mesh key={i}>
                <ringGeometry 
                  args={[
                    planet.radius * band.innerRadius, 
                    planet.radius * band.outerRadius, 
                    64
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
        
        {/* Glow de hover */}
        {isHovered && (
          <mesh scale={scale * 1.1}>
            <sphereGeometry args={[planet.radius, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </mesh>
        )}
        
        {/* Tooltip con nombre */}
        {isHovered && (
          <Html position={[0, planet.radius + 0.5, 0]} center>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onClick(planet);
              }}
              style={{
                background: 'rgba(0,0,0,0.9)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '2px',
                border: '1px solid rgba(var(--color-primary-rgb), 0.3)',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                userSelect: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <div style={{ fontWeight: '900', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                {planet.name}
              </div>
              <div style={{ opacity: 0.5, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                {planet.type.replace('_', ' ')}
              </div>
            </div>
          </Html>
        )}

        {/* Lunas */}
        {planet.moons?.map((moon) => (
          <OrbitingMoon key={moon.id} moon={moon} />
        ))}
      </group>
    </>
  );
};

/**
 * Componente para renderizar una luna orbitando un planeta
 */
const OrbitingMoon = ({ moon }: { moon: SolarMoonData }) => {
  const moonRef = useRef<THREE.Mesh>(null!);
  const orbitPoints = useMemo(() => generateOrbitPath(moon.orbit, 32), [moon.orbit]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const pos = calculateOrbitalPosition(moon.orbit, time);
    if (moonRef.current) {
      moonRef.current.position.set(pos.x, pos.y, pos.z);
    }
  });

  return (
    <>
      <Line 
        points={orbitPoints.map(p => new THREE.Vector3(p.x, p.y, p.z))} 
        color="#555555" 
        lineWidth={0.2} 
        transparent 
        opacity={0.3} 
      />
      <mesh ref={moonRef}>
        <sphereGeometry args={[moon.radius, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} emissive="#ffffff" emissiveIntensity={0.1} />
      </mesh>
    </>
  );
};
export default SolarSystem;
