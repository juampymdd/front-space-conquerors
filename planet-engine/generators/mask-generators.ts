import * as THREE from 'three';
import { simplex3D, smoothstep, generateSpherePoints, sphereVoronoi } from '../utils/noise';

/**
 * Genera máscara de continentes usando celdas Voronoi esféricas
 * Evita el problema de ruido uniforme creando "placas" discretas
 */
export function generateContinentMask(
  point: THREE.Vector3,
  continentCenters: THREE.Vector3[],
  oceanRatio: number = 0.6
): number {
  const { minDist } = sphereVoronoi(point, continentCenters);

  // Convertir distancia a máscara (0 = océano, 1 = tierra)
  // El threshold determina qué tan grandes son los continentes
  const threshold = oceanRatio * 1.5;
  return smoothstep(threshold, threshold - 0.4, minDist);
}

/**
 * Crea los puntos de centro de continentes para un planeta
 * Debe llamarse una vez al inicio y cachear los resultados
 */
export function createContinentCenters(
  seed: number,
  continentCount: number
): THREE.Vector3[] {
  return generateSpherePoints(continentCount, seed);
}

/**
 * Genera máscara de cordilleras en bordes de "placas tectónicas"
 * Las montañas ocurren principalmente en los bordes entre mar y tierra
 */
export function generateMountainRangeMask(
  point: THREE.Vector3,
  continentCenters: THREE.Vector3[],
  seed: number
): number {
  const { minDist, secondMinDist } = sphereVoronoi(point, continentCenters);

  // Las montañas están en los bordes entre celdas Voronoi
  const edgeDist = secondMinDist - minDist;
  const edgeStrength = smoothstep(0.3, 0.05, edgeDist);

  // Añadir variación con ruido para que no sean líneas perfectas
  const normalized = point.clone().normalize();
  const noiseOffset = simplex3D(
    normalized.x * 5,
    normalized.y * 5,
    normalized.z * 5,
    seed + 500
  );

  return Math.max(0, edgeStrength + noiseOffset * 0.3);
}

/**
 * Máscara basada en latitud (para hielo polar, clima, etc.)
 * 0 en el ecuador, 1 en los polos
 */
export function generateLatitudeMask(point: THREE.Vector3): number {
  const normalized = point.clone().normalize();
  return Math.abs(normalized.y);
}

/**
 * Máscara de humedad basada en distancia al océano y latitud
 */
export function generateHumidityMask(
  _point: THREE.Vector3,
  continentMask: number,
  latitude: number
): number {
  // Más húmedo cerca del océano (donde continentMask es bajo)
  const oceanProximity = 1 - continentMask;

  // Menos húmedo en latitudes extremas
  const latitudeEffect = 1 - latitude * 0.5;

  return Math.max(0, Math.min(1, oceanProximity * 0.6 + latitudeEffect * 0.4));
}

/**
 * Sistema completo de máscaras precalculado para un planeta
 */
export class PlanetMaskSystem {
  private continentCenters: THREE.Vector3[];
  private seed: number;
  private oceanRatio: number;

  constructor(seed: number, continentCount: number = 5, oceanRatio: number = 0.6) {
    this.seed = seed;
    this.oceanRatio = oceanRatio;
    this.continentCenters = createContinentCenters(seed, continentCount);
  }

  getMasks(point: THREE.Vector3): {
    continent: number;
    mountainRange: number;
    latitude: number;
    humidity: number;
  } {
    const continent = generateContinentMask(point, this.continentCenters, this.oceanRatio);
    const latitude = generateLatitudeMask(point);
    const mountainRange = generateMountainRangeMask(point, this.continentCenters, this.seed);
    const humidity = generateHumidityMask(point, continent, latitude);

    return { continent, mountainRange, latitude, humidity };
  }

  getContinentCenters(): THREE.Vector3[] {
    return this.continentCenters;
  }
}
