import * as THREE from 'three';
import type { MaskSet, PlanetColors, AtmosphereConfig } from '../types/planet.types';
import { BasePlanetGenerator, GLSL_SIMPLEX_NOISE } from './base-generator';
import { PlanetMaskSystem } from './mask-generators';

/**
 * ROCOSO: Continentes amplios, cordilleras localizadas, grandes llanuras
 * 
 * OPTIMIZADO: Elevación calculada en GPU
 */
export class RockyPlanetGenerator extends BasePlanetGenerator {
  private maskSystem: PlanetMaskSystem;
  private colors: PlanetColors;
  private continentCount: number;
  private oceanRatio: number;

  constructor(seed: number, radius: number = 1, resolution: number = 32) {
    super(seed, radius, resolution);
    
    // Parámetros del planeta
    this.continentCount = this.rng.rangeInt(4, 6);
    this.oceanRatio = this.rng.range(0.4, 0.6);
    this.maskSystem = new PlanetMaskSystem(seed, this.continentCount, this.oceanRatio);
    
    // Colores de planeta rocoso terrestre
    this.colors = {
      base: '#4a6741',      // Verde tierra
      secondary: '#8b7355', // Marrón montaña
      accent: '#c4a35a',    // Arena/desierto
      water: '#1a4c6e',     // Océano profundo
    };
  }

  getMasks(point: THREE.Vector3): MaskSet {
    return this.maskSystem.getMasks(point);
  }

  getColors(): PlanetColors {
    return this.colors;
  }

  getAtmosphereConfig(): AtmosphereConfig {
    return {
      enabled: true,
      density: 0.15,
      color: '#87ceeb',
    };
  }

  /**
   * Uniforms específicos para terreno rocoso
   */
  getTerrainUniforms(): Record<string, THREE.IUniform> {
    return {
      uContinentScale: { value: 2.0 },
      uMountainScale: { value: 4.0 },
      uDetailScale: { value: 12.0 },
      uContinentStrength: { value: 0.03 },
      uMountainStrength: { value: 0.08 },
      uDetailStrength: { value: 0.01 },
      uOceanLevel: { value: this.oceanRatio },
    };
  }

  getVertexShader(): string {
    return `
      ${GLSL_SIMPLEX_NOISE}
      
      uniform float uSeed;
      uniform float uRadius;
      uniform float uContinentScale;
      uniform float uMountainScale;
      uniform float uDetailScale;
      uniform float uContinentStrength;
      uniform float uMountainStrength;
      uniform float uDetailStrength;
      uniform float uOceanLevel;
      
      varying float vElevation;
      varying float vContinentMask;
      varying float vLatitude;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // Normalizar posición para calcular sobre esfera unitaria
        vec3 spherePos = normalize(position);
        
        // CAPA 1: Máscara de continentes (ruido de baja frecuencia)
        float continentNoise = snoise(spherePos * uContinentScale + uSeed * 0.01);
        float continentMask = smoothstep(-0.2, 0.3, continentNoise);
        
        // CAPA 2: Elevación base de continentes
        float continentElevation = continentMask * uContinentStrength;
        
        // CAPA 3: Montañas en bordes (gradiente del ruido)
        float mountainNoise = ridgeNoise(spherePos * uMountainScale + uSeed * 0.02, 4, 2.0, 0.5);
        float edgeFactor = abs(continentNoise) < 0.3 ? 1.0 - abs(continentNoise) / 0.3 : 0.0;
        float mountainElevation = mountainNoise * edgeFactor * uMountainStrength * continentMask;
        
        // CAPA 4: Detalle fino
        float detailNoise = fbm(spherePos * uDetailScale + uSeed * 0.03, 3, 2.0, 0.5);
        float detailElevation = detailNoise * uDetailStrength * continentMask;
        
        // Elevación total
        float elevation = continentElevation + mountainElevation + detailElevation;
        
        // Océanos al nivel 0
        if (continentMask < 0.3) {
          elevation = -0.005;
        }
        
        // Desplazar en dirección radial
        vec3 newPosition = spherePos * (uRadius + elevation);
        
        // Pasar datos al fragment shader
        vElevation = elevation;
        vContinentMask = continentMask;
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
      uniform vec3 uColorAccent;
      uniform vec3 uColorWater;
      
      varying float vElevation;
      varying float vContinentMask;
      varying float vLatitude;
      varying vec3 vNormal;
      
      void main() {
        vec3 color;
        
        // Océano vs Tierra
        if (vContinentMask < 0.3) {
          float depth = 1.0 - vContinentMask / 0.3;
          color = mix(uColorWater * 1.2, uColorWater * 0.6, depth);
        } else {
          float landHeight = (vElevation + 0.02) / 0.12;
          
          if (landHeight < 0.3) {
            color = uColorBase;
          } else if (landHeight < 0.7) {
            color = mix(uColorBase, uColorSecondary, (landHeight - 0.3) / 0.4);
          } else {
            color = mix(uColorSecondary, uColorAccent, (landHeight - 0.7) / 0.3);
          }
          
          // Nieve en latitudes altas
          float snowLine = 0.7 - vLatitude * 0.4;
          if (landHeight > snowLine) {
            color = mix(color, vec3(1.0), min(1.0, (landHeight - snowLine) / 0.2));
          }
        }
        
        // Iluminación
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.3);
        
        gl_FragColor = vec4(color * diff, 1.0);
      }
    `;
  }
}
