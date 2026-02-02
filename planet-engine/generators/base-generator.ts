import * as THREE from 'three';
import type { MaskSet, PlanetColors, AtmosphereConfig } from '../types/planet.types';
import { SeededRandom } from '../utils/seeded-random';

/**
 * Configuración de LOD (Level of Detail)
 */
export interface LODConfig {
  /** Distancia máxima para alta resolución */
  highDetailDistance: number;
  /** Distancia máxima para media resolución */
  mediumDetailDistance: number;
  /** Resolución para alta calidad (cerca) */
  highResolution: number;
  /** Resolución para media calidad */
  mediumResolution: number;
  /** Resolución para baja calidad (lejos) */
  lowResolution: number;
}

const DEFAULT_LOD_CONFIG: LODConfig = {
  highDetailDistance: 10,
  mediumDetailDistance: 30,
  highResolution: 64,
  mediumResolution: 32,
  lowResolution: 16,
};

/**
 * Clase base abstracta para todos los generadores de planetas
 * Cada tipo de planeta implementa su propio generador
 * 
 * OPTIMIZACIONES:
 * - LOD automático según distancia
 * - Cálculos de ruido en GPU (vertex shader)
 * - Cache de geometrías generadas
 */
export abstract class BasePlanetGenerator {
  protected seed: number;
  protected rng: SeededRandom;
  protected radius: number;
  protected resolution: number;
  protected lodConfig: LODConfig;

  // Cache de geometrías por nivel de LOD
  private geometryCache: Map<number, THREE.IcosahedronGeometry> = new Map();

  constructor(seed: number, radius: number = 1, resolution: number = 32, lodConfig?: Partial<LODConfig>) {
    this.seed = seed;
    this.rng = new SeededRandom(seed);
    this.radius = radius;
    this.resolution = resolution;
    this.lodConfig = { ...DEFAULT_LOD_CONFIG, ...lodConfig };
  }

  /**
   * Obtiene las máscaras base para un punto dado
   * Se usa solo para coloración, NO para elevaciones (que van en GPU)
   */
  abstract getMasks(point: THREE.Vector3): MaskSet;

  /**
   * Retorna los colores del planeta
   */
  abstract getColors(): PlanetColors;

  /**
   * Retorna la configuración de atmósfera
   */
  abstract getAtmosphereConfig(): AtmosphereConfig;

  /**
   * Retorna los uniforms específicos del tipo de planeta
   * Estos se pasan al shader para generar el terreno en GPU
   */
  abstract getTerrainUniforms(): Record<string, THREE.IUniform>;

  /**
   * Retorna el vertex shader con ruido en GPU
   */
  abstract getVertexShader(): string;

  /**
   * Retorna el fragment shader específico del tipo
   */
  abstract getFragmentShader(): string;

  /**
   * Retorna los uniforms adicionales específicos del tipo
   */
  getCustomUniforms(): Record<string, THREE.IUniform> {
    return {};
  }

  /**
   * Calcula el nivel de LOD basado en la distancia a la cámara
   */
  calculateLODResolution(distanceToCamera: number): number {
    if (distanceToCamera < this.lodConfig.highDetailDistance) {
      return this.lodConfig.highResolution;
    } else if (distanceToCamera < this.lodConfig.mediumDetailDistance) {
      return this.lodConfig.mediumResolution;
    } else {
      return this.lodConfig.lowResolution;
    }
  }

  /**
   * Genera geometría esférica base (sin deformación)
   * La deformación se hace en el vertex shader (GPU)
   */
  generateGeometry(resolution?: number): THREE.IcosahedronGeometry {
    const res = resolution || this.resolution;

    // Revisar cache
    if (this.geometryCache.has(res)) {
      return this.geometryCache.get(res)!.clone();
    }

    const geometry = new THREE.IcosahedronGeometry(this.radius, res);

    // Cachear para reutilizar
    this.geometryCache.set(res, geometry.clone());

    return geometry;
  }

  /**
   * Genera geometría con LOD automático
   */
  generateGeometryWithLOD(distanceToCamera: number): THREE.IcosahedronGeometry {
    const resolution = this.calculateLODResolution(distanceToCamera);
    return this.generateGeometry(resolution);
  }

  /**
   * Crea el material shader con ruido en GPU
   */
  createMaterial(): THREE.ShaderMaterial {
    const colors = this.getColors();

    const baseUniforms = {
      uTime: { value: 0 },
      uSeed: { value: this.seed },
      uRadius: { value: this.radius },
      uColorBase: { value: new THREE.Color(colors.base) },
      uColorSecondary: { value: new THREE.Color(colors.secondary || colors.base) },
      uColorAccent: { value: new THREE.Color(colors.accent) },
      uColorWater: { value: new THREE.Color(colors.water || '#0044aa') },
    };

    return new THREE.ShaderMaterial({
      uniforms: { 
        ...baseUniforms, 
        ...this.getTerrainUniforms(),
        ...this.getCustomUniforms() 
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(),
    });
  }

  /**
   * Genera el mesh completo del planeta
   */
  generateMesh(distanceToCamera: number = 5): THREE.Mesh {
    const geometry = this.generateGeometryWithLOD(distanceToCamera);
    const material = this.createMaterial();
    return new THREE.Mesh(geometry, material);
  }

  /**
   * Limpia el cache de geometrías
   */
  clearCache(): void {
    this.geometryCache.forEach((geo) => geo.dispose());
    this.geometryCache.clear();
  }

  // Getters
  getSeed(): number {
    return this.seed;
  }

  getRadius(): number {
    return this.radius;
  }

  getResolution(): number {
    return this.resolution;
  }

  getLODConfig(): LODConfig {
    return this.lodConfig;
  }
}

/**
 * Código GLSL común para ruido simplex 3D
 * Se incluye en todos los vertex shaders
 */
export const GLSL_SIMPLEX_NOISE = `
// Simplex 3D Noise - GPU optimizado
vec3 mod289_3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  
  i = mod289_3(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// FBM (Fractal Brownian Motion)
float fbm(vec3 p, int octaves, float lacunarity, float persistence) {
  float value = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  float maxValue = 0.0;
  
  for(int i = 0; i < 8; i++) {
    if(i >= octaves) break;
    value += amplitude * snoise(p * frequency);
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  
  return value / maxValue;
}

// Ridge noise para montañas
float ridgeNoise(vec3 p, int octaves, float lacunarity, float persistence) {
  float value = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  float maxValue = 0.0;
  
  for(int i = 0; i < 8; i++) {
    if(i >= octaves) break;
    float n = 1.0 - abs(snoise(p * frequency));
    n = n * n;
    value += amplitude * n;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  
  return value / maxValue;
}

// Domain Warping para patrones de flujo (lava, nubes)
float warp(vec3 p, float strength) {
  vec3 q = vec3(
    fbm(p + vec3(0.0, 0.0, 0.0), 4, 2.0, 0.5),
    fbm(p + vec3(5.2, 1.3, 2.8), 4, 2.0, 0.5),
    fbm(p + vec3(2.4, 7.1, 1.2), 4, 2.0, 0.5)
  );
  return fbm(p + strength * q, 4, 2.0, 0.5);
}
`;

// Funciones para iluminación y normales
export const GLSL_LIGHTING_HELPERS = `
  // Perturbar normales basado en ruido
  vec3 perturbNormal(vec3 normal, vec3 viewDir, float elevation, float strength) {
    vec3 p = cross(viewDir, normal);
    vec3 t = cross(normal, p);
    vec3 det = t * strength * elevation;
    return normalize(normal + det);
  }

  // Iluminación Especular (Blinn-Phong)
  float calculateSpecular(vec3 normal, vec3 viewDir, vec3 lightDir, float shininess) {
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(normal, halfDir), 0.0);
    return pow(specAngle, shininess);
  }
`;

export const GLSL_NOISE_EXTRAS = `
  // Domain Warping para patrones de flujo (lava, nubes)
  float warp(vec3 p, float strength) {
    vec3 q = vec3(
      fbm(p + vec3(0.0, 0.0, 0.0), 4, 2.0, 0.5),
      fbm(p + vec3(5.2, 1.3, 2.8), 4, 2.0, 0.5),
      fbm(p + vec3(2.4, 7.1, 1.2), 4, 2.0, 0.5)
    );
    return fbm(p + strength * q, 4, 2.0, 0.5);
  }
`;
