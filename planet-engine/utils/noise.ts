import * as THREE from 'three';
import { SeededRandom } from './seeded-random';

/**
 * Simplex noise 3D implementation para uso en CPU
 * Basado en el algoritmo de Stefan Gustavson
 */

// Gradientes para 3D simplex noise
const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];

// Tabla de permutaciones
const perm = new Array(512);
const gradP = new Array(512);

function initNoise(seed: number): void {
  const rng = new SeededRandom(seed);
  const p = new Array(256);
  
  for (let i = 0; i < 256; i++) {
    p[i] = i;
  }
  
  // Fisher-Yates shuffle con seed
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    gradP[i] = grad3[perm[i] % 12];
  }
}

function dot3(g: number[], x: number, y: number, z: number): number {
  return g[0] * x + g[1] * y + g[2] * z;
}

/**
 * 3D Simplex Noise
 */
export function simplex3D(x: number, y: number, z: number, seed: number = 0): number {
  initNoise(seed);
  
  const F3 = 1 / 3;
  const G3 = 1 / 6;
  
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);
  
  const t = (i + j + k) * G3;
  const X0 = i - t;
  const Y0 = j - t;
  const Z0 = k - t;
  
  const x0 = x - X0;
  const y0 = y - Y0;
  const z0 = z - Z0;
  
  let i1: number, j1: number, k1: number;
  let i2: number, j2: number, k2: number;
  
  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    } else if (x0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
    } else {
      i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
    }
  } else {
    if (y0 < z0) {
      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
    } else if (x0 < z0) {
      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
    } else {
      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    }
  }
  
  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2 * G3;
  const y2 = y0 - j2 + 2 * G3;
  const z2 = z0 - k2 + 2 * G3;
  const x3 = x0 - 1 + 3 * G3;
  const y3 = y0 - 1 + 3 * G3;
  const z3 = z0 - 1 + 3 * G3;
  
  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;
  
  let n0: number, n1: number, n2: number, n3: number;
  
  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * dot3(gradP[ii + perm[jj + perm[kk]]], x0, y0, z0);
  }
  
  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * dot3(gradP[ii + i1 + perm[jj + j1 + perm[kk + k1]]], x1, y1, z1);
  }
  
  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * dot3(gradP[ii + i2 + perm[jj + j2 + perm[kk + k2]]], x2, y2, z2);
  }
  
  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 < 0) {
    n3 = 0;
  } else {
    t3 *= t3;
    n3 = t3 * t3 * dot3(gradP[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x3, y3, z3);
  }
  
  return 32 * (n0 + n1 + n2 + n3);
}

/**
 * Fractal Brownian Motion (FBM) - Ruido de múltiples octavas
 */
export function fbmNoise(
  point: THREE.Vector3,
  octaves: number,
  seed: number,
  lacunarity: number = 2.0,
  persistence: number = 0.5
): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * simplex3D(
      point.x * frequency,
      point.y * frequency,
      point.z * frequency,
      seed + i * 100
    );
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  
  return value / maxValue;
}

/**
 * Ridge noise - Para crear crestas de montañas
 */
export function ridgeNoise(
  point: THREE.Vector3,
  octaves: number,
  seed: number,
  lacunarity: number = 2.0,
  persistence: number = 0.5
): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    let n = simplex3D(
      point.x * frequency,
      point.y * frequency,
      point.z * frequency,
      seed + i * 100
    );
    // Invertir y convertir a crestas
    n = 1 - Math.abs(n);
    n = n * n; // Hacer las crestas más pronunciadas
    
    value += amplitude * n;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  
  return value / maxValue;
}

/**
 * Smoothstep - Interpolación suave
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Genera puntos aleatorios en la esfera para Voronoi
 */
export function generateSpherePoints(count: number, seed: number): THREE.Vector3[] {
  const rng = new SeededRandom(seed);
  const points: THREE.Vector3[] = [];
  
  for (let i = 0; i < count; i++) {
    // Distribución uniforme en esfera usando método de rechazo
    const theta = rng.next() * Math.PI * 2;
    const phi = Math.acos(2 * rng.next() - 1);
    
    points.push(new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    ));
  }
  
  return points;
}

/**
 * Calcula la distancia al punto más cercano en la esfera (para Voronoi)
 */
export function sphereVoronoi(
  point: THREE.Vector3,
  cellCenters: THREE.Vector3[]
): { minDist: number; secondMinDist: number; closestIndex: number } {
  const normalized = point.clone().normalize();
  let minDist = Infinity;
  let secondMinDist = Infinity;
  let closestIndex = 0;
  
  for (let i = 0; i < cellCenters.length; i++) {
    const dist = normalized.distanceTo(cellCenters[i]);
    if (dist < minDist) {
      secondMinDist = minDist;
      minDist = dist;
      closestIndex = i;
    } else if (dist < secondMinDist) {
      secondMinDist = dist;
    }
  }
  
  return { minDist, secondMinDist, closestIndex };
}
