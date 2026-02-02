import * as THREE from 'three';
import type { MaskSet, PlanetColors, AtmosphereConfig } from '../types/planet.types';
import { BasePlanetGenerator, GLSL_SIMPLEX_NOISE, GLSL_LIGHTING_HELPERS } from './base-generator';

/**
 * SELVÁTICO: Terreno plano con vegetación densa
 * 
 * OPTIMIZADO: Elevación calculada en GPU
 */
export class JunglePlanetGenerator extends BasePlanetGenerator {
  private colors: PlanetColors;

  constructor(seed: number, radius: number = 1, resolution: number = 32) {
    super(seed, radius, resolution);
    
    this.colors = {
      base: '#1a5f1a',
      secondary: '#3d8b3d',
      accent: '#7cba5f',
      water: '#2d5a47',
    };
  }

  getMasks(point: THREE.Vector3): MaskSet {
    const normalized = point.clone().normalize();
    return {
      continent: 0.8,
      mountainRange: 0,
      latitude: Math.abs(normalized.y),
      humidity: 1.0,
    };
  }

  getColors(): PlanetColors {
    return this.colors;
  }

  getAtmosphereConfig(): AtmosphereConfig {
    return {
      enabled: true,
      density: 0.22,
      color: '#7dcea0',
    };
  }

  getTerrainUniforms(): Record<string, THREE.IUniform> {
    return {
      uJungleScale: { value: 3.0 },
      uJungleHeight: { value: 0.02 },
      uRiverThreshold: { value: 0.45 },
    };
  }

  getVertexShader(): string {
    return `
      ${GLSL_SIMPLEX_NOISE}
      ${GLSL_LIGHTING_HELPERS}
      
      uniform float uSeed;
      uniform float uRadius;
      uniform float uJungleScale;
      uniform float uJungleHeight;
      
      varying float vElevation;
      varying float vHumidity;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 spherePos = normalize(position);
        
        // Terreno base: Colinas suaves y valles
        float elevationNoise = fbm(spherePos * uJungleScale + uSeed * 0.01, 4, 2.0, 0.5);
        float hills = smoothstep(-0.2, 0.5, elevationNoise) * uJungleHeight;
        
        // Ríos (domain warping para caminos sinuosos)
        float riverNoise = warp(spherePos * 6.0 + uSeed * 0.03, 0.8);
        float riverMask = 1.0 - smoothstep(0.42, 0.45, abs(riverNoise)); // Cauces de río
        
        // Aplana el terreno donde hay ríos
        hills *= (1.0 - riverMask * 0.8);
        
        // Hundir el río ligeramente
        float riverBed = riverMask * -0.002;
        
        float elevation = hills + riverBed;
        
        // Humedad para vegetación (variación)
        float humidity = warp(spherePos * 4.0 + uSeed * 0.05, 0.5);
        
        vec3 newPosition = spherePos * (uRadius + elevation);
        
        vElevation = elevation;
        vHumidity = humidity;
        vNormal = normalize(normalMatrix * spherePos);
        vPosition = spherePos;
        
        vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
        vViewPosition = -mvPosition.xyz;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  }

  getFragmentShader(): string {
    return `
      ${GLSL_SIMPLEX_NOISE}
      ${GLSL_LIGHTING_HELPERS}

      uniform vec3 uColorBase;
      uniform vec3 uColorSecondary;
      uniform vec3 uColorAccent;
      uniform vec3 uColorWater;
      uniform float uSeed;
      
      varying float vElevation;
      varying float vHumidity;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
        
        vec3 color;
        
        bool isWater = vElevation < 0.0;
        
        if (isWater) {
          // Río/Lago
          float depth = clamp(abs(vElevation) / 0.005, 0.0, 1.0);
          color = mix(uColorWater * 1.2, uColorWater * 0.6, depth);
          
          // Especular de agua
          float spec = calculateSpecular(normal, viewDir, lightDir, 60.0);
          color += vec3(1.0) * spec * 0.6;
        } else {
          // Vegetación densa (Canopy)
          
          // Ruido celular para simular copas de árboles
          float canopyNoise = snoise(vPosition * 150.0 + uSeed); // Alta frecuencia
          float canopy = smoothstep(-0.5, 0.8, canopyNoise);
          
          // Variación de color de vegetación basada en 'humedad' y elevación
          vec3 treeColor1 = uColorBase; // Verde base
          vec3 treeColor2 = uColorSecondary; // Verde más oscuro
          vec3 treeColor3 = uColorAccent; // Verde amarillento (nuevo brote o luz)
          
          // Mezcla base
          float bioMix = smoothstep(0.0, 1.0, vHumidity);
          vec3 vegetationColor = mix(treeColor2, treeColor1, bioMix);
          
          // Highlights del canopy
          vegetationColor = mix(vegetationColor, treeColor3, canopy * 0.4);
          
          color = vegetationColor;
          
          // Perturbar normal para dar volumen al canopy
          normal = perturbNormal(normal, viewDir, canopyNoise, 0.5);
        }
        
        // Iluminación
        float diff = max(dot(normal, lightDir), 0.15);
        
        // Niebla atmosférica baja
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
        vec3 atmosphere = vec3(0.7, 0.9, 1.0) * fresnel * 0.3;
        
        gl_FragColor = vec4(color * diff + atmosphere, 1.0);
      }
    `;
  }
}
