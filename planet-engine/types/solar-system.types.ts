import type { PlanetType } from './planet.types';
import type { StarType } from '../generators/star-generator';

/**
 * Datos de órbita elíptica
 */
export interface OrbitData {
  /** Semi-eje mayor (distancia promedio al sol) */
  semiMajorAxis: number;
  /** Excentricidad (0 = circular, 0.9 = muy elíptica) */
  eccentricity: number;
  /** Inclinación del plano orbital (radianes) */
  inclination: number;
  /** Ángulo inicial en la órbita (radianes) */
  startAngle: number;
  /** Período orbital (velocidad, en segundos por órbita completa) */
  orbitalPeriod: number;
}

/**
 * Una banda individual del anillo
 */
export interface RingBand {
  /** Radio interno de la banda (relativo al radio del planeta) */
  innerRadius: number;
  /** Radio externo de la banda (relativo al radio del planeta) */
  outerRadius: number;
  /** Color de la banda */
  color: string;
  /** Opacidad (0-1) */
  opacity: number;
}

/**
 * Datos de anillos planetarios (para gigantes gaseosos)
 * Sistema de múltiples bandas como Saturno
 */
export interface RingData {
  /** Inclinación del sistema de anillos en radianes */
  tilt: number;
  /** Múltiples bandas de anillos */
  bands: RingBand[];
}

/**
 * Datos de una luna
 */
export interface SolarMoonData {
  id: string;
  name: string;
  seed: number;
  radius: number;
  orbit: OrbitData; // Órbita relativa al planeta
}

/**
 * Datos de un planeta en el sistema solar
 */
export interface SolarPlanetData {
  id: string;
  name: string;
  type: PlanetType;
  seed: number;
  radius: number;
  orbit: OrbitData;
  /** Anillos opcionales (solo gigantes gaseosos) */
  rings?: RingData;
  /** Lunas opcionales */
  moons?: SolarMoonData[];
}

/**
 * Datos de la estrella central
 */
export interface SolarStarData {
  id: string;
  name: string;
  type: StarType;
  seed: number;
  radius: number;
}

/**
 * Configuración para generar un sistema solar
 */
export interface SolarSystemConfig {
  seed: number;
  starType?: StarType;
  planetCount?: number; // 9-12, default aleatorio
  systemRadius?: number; // Radio máximo del sistema
}

/**
 * Sistema solar completo generado
 */
export interface SolarSystemData {
  id: string;
  seed: number;
  star: SolarStarData;
  planets: SolarPlanetData[];
}

/**
 * Estado de la vista del sistema solar
 */
export type SolarSystemViewState = 
  | { mode: 'system' }
  | { mode: 'planet'; planetId: string };

/**
 * Zonas del sistema solar para distribución de planetas
 */
export type SolarZone = 'inner' | 'habitable' | 'outer';

/**
 * Calcula la posición de un planeta en su órbita elíptica
 * @param orbit Datos de la órbita
 * @param time Tiempo actual (segundos)
 * @returns Posición 3D del planeta
 */
export function calculateOrbitalPosition(
  orbit: OrbitData,
  time: number
): { x: number; y: number; z: number } {
  // Ángulo actual en la órbita
  const angle = orbit.startAngle + (time / orbit.orbitalPeriod) * Math.PI * 2;
  
  // Radio en este punto de la elipse (ecuación polar de elipse)
  const r = (orbit.semiMajorAxis * (1 - orbit.eccentricity ** 2)) / 
            (1 + orbit.eccentricity * Math.cos(angle));
  
  // Posición en el plano orbital
  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  
  // Aplicar inclinación
  const y = z * Math.sin(orbit.inclination);
  const zInclined = z * Math.cos(orbit.inclination);
  
  return { x, y, z: zInclined };
}

/**
 * Genera puntos para visualizar la órbita elíptica
 * @param orbit Datos de la órbita
 * @param segments Número de segmentos
 */
export function generateOrbitPath(
  orbit: OrbitData,
  segments: number = 64
): { x: number; y: number; z: number }[] {
  const points: { x: number; y: number; z: number }[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const r = (orbit.semiMajorAxis * (1 - orbit.eccentricity ** 2)) / 
              (1 + orbit.eccentricity * Math.cos(angle));
    
    const x = r * Math.cos(angle);
    const z = r * Math.sin(angle);
    const y = z * Math.sin(orbit.inclination);
    const zInclined = z * Math.cos(orbit.inclination);
    
    points.push({ x, y, z: zInclined });
  }
  
  return points;
}
