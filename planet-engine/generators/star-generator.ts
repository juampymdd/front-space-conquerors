import * as THREE from 'three';
import type { MaskSet, PlanetColors, AtmosphereConfig } from '../types/planet.types';
import { BasePlanetGenerator, GLSL_SIMPLEX_NOISE } from './base-generator';

/**
 * Tipos de estrellas
 */
export type StarType = 'red_dwarf' | 'yellow_dwarf' | 'orange_giant' | 'blue_giant';

export interface StarConfig {
  type: StarType;
  name: string;
  temperature: number; // Kelvin
  colorPrimary: string;
  colorSecondary: string;
  coronaColor: string;
  radiusMultiplier: number; // Relativo al tamaño base
}

const STAR_CONFIGS: Record<StarType, Omit<StarConfig, 'name'>> = {
  red_dwarf: {
    type: 'red_dwarf',
    temperature: 3000,
    colorPrimary: '#ff4422',
    colorSecondary: '#cc2200',
    coronaColor: '#ff6644',
    radiusMultiplier: 0.6,
  },
  yellow_dwarf: {
    type: 'yellow_dwarf',
    temperature: 5500,
    colorPrimary: '#ffdd44',
    colorSecondary: '#ffaa22',
    coronaColor: '#ffee88',
    radiusMultiplier: 1.0,
  },
  orange_giant: {
    type: 'orange_giant',
    temperature: 4500,
    colorPrimary: '#ff8833',
    colorSecondary: '#dd6622',
    coronaColor: '#ffaa55',
    radiusMultiplier: 1.5,
  },
  blue_giant: {
    type: 'blue_giant',
    temperature: 20000,
    colorPrimary: '#88ccff',
    colorSecondary: '#4488ff',
    coronaColor: '#aaddff',
    radiusMultiplier: 2.0,
  },
};

/**
 * ESTRELLA: Esfera emisiva con corona animada
 * 
 * No tiene superficie sólida, solo shader de emisión
 */
export class StarGenerator extends BasePlanetGenerator {
  private starType: StarType;
  private config: StarConfig;
  private colors: PlanetColors;

  constructor(seed: number, starType: StarType = 'yellow_dwarf', radius: number = 3, resolution: number = 24) {
    super(seed, radius, resolution);
    
    this.starType = starType;
    this.config = { 
      ...STAR_CONFIGS[starType], 
      name: `Star-${seed}` 
    };
    
    this.colors = {
      base: this.config.colorPrimary,
      secondary: this.config.colorSecondary,
      accent: this.config.coronaColor,
    };
  }

  // La estrella no tiene máscaras de terreno
  getMasks(_point: THREE.Vector3): MaskSet {
    return {
      continent: 0,
      mountainRange: 0,
      latitude: 0,
      humidity: 0,
    };
  }

  getColors(): PlanetColors {
    return this.colors;
  }

  getAtmosphereConfig(): AtmosphereConfig {
    return {
      enabled: true,
      density: 0.8,
      color: this.config.coronaColor,
    };
  }

  getTerrainUniforms(): Record<string, THREE.IUniform> {
    return {
      uTemperature: { value: this.config.temperature },
    };
  }

  // Sin desplazamiento de terreno - esfera perfecta
  getVertexShader(): string {
    return `
      uniform float uRadius;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vec3 spherePos = normalize(position);
        vec3 newPosition = spherePos * uRadius;
        
        vNormal = normalize(normalMatrix * spherePos);
        vPosition = spherePos;
        vUv = uv;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;
  }

  getFragmentShader(): string {
    return `
      ${GLSL_SIMPLEX_NOISE}
      
      uniform vec3 uColorBase;
      uniform vec3 uColorSecondary;
      uniform vec3 uColorAccent;
      uniform float uTime;
      uniform float uSeed;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // Ruido para superficie solar (manchas solares, granulación)
        float noise1 = snoise(vPosition * 4.0 + uTime * 0.1 + uSeed * 0.01);
        float noise2 = snoise(vPosition * 8.0 - uTime * 0.05 + uSeed * 0.02);
        float noise3 = snoise(vPosition * 16.0 + uTime * 0.2 + uSeed * 0.03);
        
        // Combinar ruidos para textura solar
        float surfacePattern = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
        
        // Manchas solares (zonas más oscuras)
        float sunspots = smoothstep(0.3, 0.5, noise1 * noise2);
        
        // Color base con variación
        vec3 baseColor = mix(uColorBase, uColorSecondary, surfacePattern * 0.5 + 0.5);
        
        // Aplicar manchas (más oscuro)
        baseColor = mix(baseColor, uColorSecondary * 0.7, sunspots * 0.3);
        
        // Borde más brillante (limb brightening invertido para estrellas)
        float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        fresnel = pow(fresnel, 2.0);
        
        // Corona en el borde
        vec3 coronaColor = uColorAccent;
        vec3 finalColor = mix(baseColor, coronaColor, fresnel * 0.5);
        
        // Pulso de brillo
        float pulse = 0.95 + 0.05 * sin(uTime * 0.5);
        finalColor *= pulse;
        
        // Las estrellas son emisivas, no necesitan iluminación externa
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }

  getCustomUniforms(): Record<string, THREE.IUniform> {
    return {
      uTime: { value: 0 },
    };
  }

  // Getters específicos de estrella
  getStarType(): StarType {
    return this.starType;
  }

  getConfig(): StarConfig {
    return this.config;
  }

  getRadiusMultiplier(): number {
    return this.config.radiusMultiplier;
  }
}

// Exportar configuraciones para uso externo
export { STAR_CONFIGS };
