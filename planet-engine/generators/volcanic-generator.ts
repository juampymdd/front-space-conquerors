import * as THREE from 'three';
import type { MaskSet, PlanetColors, AtmosphereConfig } from '../types/planet.types';
import { BasePlanetGenerator, GLSL_SIMPLEX_NOISE, GLSL_LIGHTING_HELPERS } from './base-generator';

/**
 * VOLCÁNICO: Superficie plana con pocos volcanes grandes
 * 
 * OPTIMIZADO: Volcanes generados en GPU
 */
export class VolcanicPlanetGenerator extends BasePlanetGenerator {
  private colors: PlanetColors;

  constructor(seed: number, radius: number = 1, resolution: number = 32) {
    super(seed, radius, resolution);
    

    
    this.colors = {
      base: '#1a1a1a',
      secondary: '#3d1a00',
      accent: '#ff4400',
      water: '#ffee00',
    };
  }

  getMasks(point: THREE.Vector3): MaskSet {
    const normalized = point.clone().normalize();
    return {
      continent: 1,
      mountainRange: 0,
      latitude: Math.abs(normalized.y),
      humidity: 0,
    };
  }

  getColors(): PlanetColors {
    return this.colors;
  }

  getAtmosphereConfig(): AtmosphereConfig {
    return {
      enabled: true,
      density: 0.25,
      color: '#ff3300',
    };
  }

  getTerrainUniforms(): Record<string, THREE.IUniform> {
    return {
      uCracksScale: { value: 6.0 },
      uLavaFlowSpeed: { value: 0.1 },
    };
  }

  getVertexShader(): string {
    return `
      ${GLSL_SIMPLEX_NOISE}
      ${GLSL_LIGHTING_HELPERS}
      
      uniform float uSeed;
      uniform float uRadius;
      uniform float uCracksScale;
      
      varying float vElevation;
      varying float vHeat;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 spherePos = normalize(position);
        
        // Terreno base muy rugoso y caótico
        float baseNoise = fbm(spherePos * 3.0 + uSeed * 0.01, 5, 2.0, 0.5);
        float mountainNoise = ridgeNoise(spherePos * 5.0 + uSeed * 0.02, 5, 2.0, 0.5);
        
        float terrain = baseNoise * 0.02 + mountainNoise * 0.08;
        
        // Canales de lava (grietas profundas)
        float crackNoise = warp(spherePos * uCracksScale + uSeed * 0.05, 1.0);
        // Normalizamos el ruido para tener más control (asumiendo output -1 a 1)
        float normalizedNoise = crackNoise * 0.5 + 0.5; 
        
        // Hacemos que la lava sea MUCHO más común y visible (Nivel infernal)
        float cracks = smoothstep(0.35, 0.6, normalizedNoise); 
        
        // Donde hay grietas, el terreno se hunde
        float elevation = terrain - cracks * 0.08; 
        
        // Heat map para el fragment shader (donde hay grietas hay lava)
        float heat = cracks;
        
        vec3 newPosition = spherePos * (uRadius + elevation);
        
        vElevation = elevation;
        vHeat = heat;
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
      uniform float uTime;
      uniform float uSeed;
      uniform float uLavaFlowSpeed;
      
      varying float vElevation;
      varying float vHeat;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5)); // Luz "arriba-derecha" en View Space

        vec3 color;
        
        // Flujo de lava
        float flow = uTime * uLavaFlowSpeed;
        float lavaDetail = warp(vPosition * 15.0 + vec3(flow, flow * 0.5, 0.0), 0.5);
        
        // Temperatura de la lava basada en el mapa de calor (vHeat) y detalle
        float lavaTemp = vHeat * (0.5 + 0.5 * lavaDetail);
        
        if (vHeat > 0.5) {
          // Zona de lava
          // Gradiente de temperatura: Amarillo brillante -> Naranja -> Rojo oscuro -> Negro (costra)
          vec3 hotColor = vec3(1.0, 1.0, 0.5); // Amarillo muy caliente
          vec3 midColor = uColorAccent; // Naranja/Rojo
          vec3 coolColor = uColorSecondary; // Rojo oscuro/Marrón
          
          float t = smoothstep(0.5, 0.9, lavaTemp); // Transición más rápida al color caliente
          color = mix(coolColor, midColor, t);
          color = mix(color, hotColor, smoothstep(0.7, 1.0, lavaTemp));
          
          // Costra flotando (menos densa)
          float crust = smoothstep(0.4, 0.7, snoise(vPosition * 30.0 + flow));
          color = mix(color, uColorBase * 0.5, crust * 0.5); // Menos opacidad de costra
          
        } else {
          // Zona de roca
          float rockSimple = fbm(vPosition * 20.0, 3, 2.0, 0.5);
          color = mix(uColorBase, uColorSecondary, rockSimple);
          
          // Perturbar normal de la roca
          normal = perturbNormal(normal, viewDir, rockSimple, 0.8);
        }
        
        float diff = max(dot(normal, lightDir), 0.1);
        float spec = calculateSpecular(normal, viewDir, lightDir, 10.0);
        
        // Emisivo EXTREMO en lava caliente
        float emissive = max(0.0, lavaTemp - 0.4) * 8.0;
        
        // Humo/Atmósfera densa
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0);
        vec3 smoke = vec3(0.1, 0.1, 0.1) * fresnel * 0.8;
         
        gl_FragColor = vec4(color * diff + vec3(spec * 0.1) + smoke + color * emissive * 0.8, 1.0);
      }
    `;
  }

  getCustomUniforms(): Record<string, THREE.IUniform> {
    return {
      uTime: { value: 0 },
    };
  }
}
