import * as THREE from 'three';
import type { MaskSet, PlanetColors, AtmosphereConfig } from '../types/planet.types';
import { BasePlanetGenerator, GLSL_SIMPLEX_NOISE } from './base-generator';

/**
 * OCEÁNICO: 80-95% agua, islas suaves, mínima elevación
 * 
 * OPTIMIZADO: Elevación calculada en GPU
 */
export class OceanicPlanetGenerator extends BasePlanetGenerator {
  private colors: PlanetColors;
  private waterCoverage: number;

  constructor(seed: number, radius: number = 1, resolution: number = 32) {
    super(seed, radius, resolution);
    
    // 60-80% agua para que haya islas visibles
    this.waterCoverage = this.rng.range(0.60, 0.80);
    
    this.colors = {
      base: '#3a7a5c',
      secondary: '#f5e6c8',
      accent: '#2d5a4a',
      water: '#0066aa',
    };
  }

  getMasks(point: THREE.Vector3): MaskSet {
    const normalized = point.clone().normalize();
    return {
      continent: 0.1, // Casi todo agua
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
      density: 0.2,
      color: '#4da6ff',
    };
  }

  getTerrainUniforms(): Record<string, THREE.IUniform> {
    return {
      uWaterCoverage: { value: this.waterCoverage },
      uIslandScale: { value: 4.0 }, // Escala más baja = islas más grandes
      uIslandHeight: { value: 0.025 },
    };
  }

  getVertexShader(): string {
    return `
      ${GLSL_SIMPLEX_NOISE}
      
      uniform float uSeed;
      uniform float uRadius;
      uniform float uWaterCoverage;
      uniform float uIslandScale;
      uniform float uIslandHeight;
      
      varying float vElevation;
      varying float vContinentMask;
      varying float vLatitude;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vec3 spherePos = normalize(position);
        
        // Ruido para islas - usar múltiples frecuencias para variedad
        float islandNoise = snoise(spherePos * uIslandScale + uSeed * 0.01);
        float islandNoise2 = snoise(spherePos * uIslandScale * 2.0 + uSeed * 0.02) * 0.3;
        float combinedNoise = islandNoise + islandNoise2;
        
        // Threshold más balanceado
        float islandThreshold = uWaterCoverage - 0.3;
        float islandMask = smoothstep(islandThreshold, islandThreshold + 0.3, combinedNoise);
        
        // Elevación muy suave
        float elevation = islandMask * uIslandHeight;
        
        // Océano
        if (islandMask < 0.3) {
          elevation = -0.005;
        }
        
        vec3 newPosition = spherePos * (uRadius + elevation);
        
        vElevation = elevation;
        vContinentMask = islandMask;
        vLatitude = abs(spherePos.y);
        vNormal = normalize(normalMatrix * spherePos);
        vPosition = newPosition;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;
  }

  getFragmentShader(): string {
    return `
      uniform vec3 uColorBase;
      uniform vec3 uColorSecondary;
      uniform vec3 uColorWater;
      uniform float uTime;
      
      varying float vElevation;
      varying float vContinentMask;
      varying float vLatitude;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vec3 color;
        
        if (vContinentMask < 0.3) {
          float depth = 1.0 - vContinentMask / 0.3;
          vec3 shallowWater = uColorWater * 1.3;
          vec3 deepWater = uColorWater * 0.5;
          color = mix(shallowWater, deepWater, depth * 0.7);
        } else {
          float beachZone = smoothstep(0.3, 0.5, vContinentMask);
          float vegetationZone = smoothstep(0.5, 0.7, vContinentMask);
          color = mix(uColorSecondary, uColorBase, vegetationZone);
        }
        
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.4);
        
        gl_FragColor = vec4(color * diff, 1.0);
      }
    `;
  }

  getCustomUniforms(): Record<string, THREE.IUniform> {
    return {
      uTime: { value: 0 },
    };
  }
}
