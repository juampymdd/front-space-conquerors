import * as THREE from 'three';
import type { MaskSet, PlanetColors, AtmosphereConfig } from '../types/planet.types';
import { BasePlanetGenerator, GLSL_SIMPLEX_NOISE, GLSL_LIGHTING_HELPERS } from './base-generator';

/**
 * HELADO: Superficie fracturada, hielo translúcido, grietas profundas
 * 
 * OPTIMIZADO: Elevación y SSS en GPU
 */
export class IcyPlanetGenerator extends BasePlanetGenerator {
  private colors: PlanetColors;

  constructor(seed: number, radius: number = 1, resolution: number = 32) {
    super(seed, radius, resolution);
    
    this.colors = {
      base: '#e8f4f8',      // Nieve blanca
      secondary: '#a8d8ea', // Hielo azul claro
      accent: '#5eb1bf',    // Hielo profundo / grietas
      water: '#2a4858',     // Océano profundo bajo hielo (no visible directamente)
    };
  }

  getMasks(point: THREE.Vector3): MaskSet {
    const normalized = point.clone().normalize();
    return {
      continent: 1,
      mountainRange: 0.2,
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
      density: 0.15,
      color: '#e0f0ff',
    };
  }

  getTerrainUniforms(): Record<string, THREE.IUniform> {
    return {
      uIceScale: { value: 3.0 },
      uCrackScale: { value: 10.0 }, // Escala de grietas
      uSurfaceRoughness: { value: 0.5 },
    };
  }

  getVertexShader(): string {
    return `
      ${GLSL_SIMPLEX_NOISE}
      ${GLSL_LIGHTING_HELPERS}
      
      uniform float uSeed;
      uniform float uRadius;
      uniform float uIceScale;
      uniform float uCrackScale;
      
      varying float vElevation;
      varying float vAo; // Ambient Occlusion basado en grietas
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 spherePos = normalize(position);
        
        // Forma base suave (dunas de nieve/hielo)
        float baseForm = snoise(spherePos * uIceScale + uSeed * 0.01);
        
        // Grietas (Ridge noise invertido y afilado)
        float ridges = ridgeNoise(spherePos * uCrackScale + uSeed * 0.02, 4, 2.0, 0.5);
        ridges = pow(ridges, 2.0); // Hacer picos más agudos
        
        float cracks = 1.0 - ridges; // Invertir para tener grietas
        cracks = smoothstep(0.0, 0.4, cracks); // Aplanar la superficie entre grietas
        
        // Elevación final: Base suave con grietas hundidas
        float elevation = baseForm * 0.01 - (1.0 - cracks) * 0.03;
        
        // Calcular "Ambient Occlusion" simple: las grietas son más oscuras
        vAo = cracks; 
        
        vec3 newPosition = spherePos * (uRadius + elevation);
        
        vElevation = elevation;
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
      uniform float uSeed;
      
      varying float vElevation;
      varying float vAo;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
        
        // MÁSCARA DE NIEVE vs HIELO
        // Generar parches más grandes donde se ve el hielo azul (secondary) en lugar de nieve (base)
        float snowNoise = fbm(vPosition * 2.0 + uSeed * 0.05, 4, 2.0, 0.5);
        float snowMask = smoothstep(0.0, 0.5, snowNoise); // 0 = Hielo, 1 = Nieve
        
        // Superficie base: Mezcla de hielo claro y nieve
        vec3 surfaceColor = mix(uColorSecondary, uColorBase, snowMask);
        
        // Color final: Las grietas (vAo bajo) son hielo profundo (accent), el resto es la superficie
        vec3 color = mix(uColorAccent, surfaceColor, smoothstep(0.1, 0.8, vAo));
        
        // Variación sutil de azul (solo para color, no para normales)
        float microNoise = snoise(vPosition * 30.0);
        color += uColorSecondary * microNoise * 0.05;
        
        // ILUMINACIÓN SSS (Subsurface Scattering Falso)
        // En lugar de Lambert (dot(N, L)), usamos wrap lighting para simular luz pasando por el hielo
        float wrap = 0.5;
        float diffuse = max(0.0, (dot(normal, lightDir) + wrap) / (1.0 + wrap));
        
        // Especular muy fuerte y nítido (hielo mojado/pulido)
        float spec = calculateSpecular(normal, viewDir, lightDir, 80.0);
        
        // Fresnel para bordes helados brillantes
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
        
        vec3 finalColor = color * diffuse; // Color difuso con SSS
        finalColor += vec3(0.8, 0.9, 1.0) * spec * 0.8; // Especular blanco azulado
        finalColor += uColorSecondary * fresnel * 0.5; // Borde brillante
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
}
