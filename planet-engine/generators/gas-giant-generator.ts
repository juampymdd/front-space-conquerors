import * as THREE from 'three';
import type { MaskSet, PlanetColors, AtmosphereConfig } from '../types/planet.types';
import { BasePlanetGenerator, GLSL_SIMPLEX_NOISE } from './base-generator';

/**
 * GASEOSO: Sin superficie sólida, solo bandas fluidas y atmósfera densa
 * 
 * OPTIMIZADO: Sin desplazamiento, solo shader de bandas animado
 */
export class GasGiantGenerator extends BasePlanetGenerator {
  private colors: PlanetColors;
  private bandCount: number;

  constructor(seed: number, radius: number = 1, resolution: number = 24) {
    // Resolución baja porque no hay detalle geométrico
    super(seed, radius, resolution);
    
    this.bandCount = this.rng.rangeInt(6, 12);
    
    // Paleta aleatoria
    const paletteIndex = this.rng.rangeInt(0, 3);
    const palettes = [
      { base: '#d4a574', secondary: '#c4956a', accent: '#8b6914', water: '#cc6622' },
      { base: '#e6d5a8', secondary: '#d4c088', accent: '#a89060', water: '#c4a060' },
      { base: '#4a7ab0', secondary: '#3d6a9a', accent: '#2d4a6a', water: '#1a3a5a' },
      { base: '#a0d8e8', secondary: '#80c8d8', accent: '#60a8b8', water: '#4088a8' },
    ];
    
    this.colors = palettes[paletteIndex];
  }

  getMasks(point: THREE.Vector3): MaskSet {
    const normalized = point.clone().normalize();
    return {
      continent: 0,
      mountainRange: 0,
      latitude: Math.abs(normalized.y),
      humidity: 1,
    };
  }

  getColors(): PlanetColors {
    return this.colors;
  }

  getAtmosphereConfig(): AtmosphereConfig {
    return {
      enabled: true,
      density: 0.4,
      color: this.colors.secondary || this.colors.base,
    };
  }

  getTerrainUniforms(): Record<string, THREE.IUniform> {
    return {
      uBandCount: { value: this.bandCount },
      uFlowSpeed: { value: 0.05 },
    };
  }

  // Sin desplazamiento - esfera perfecta
  getVertexShader(): string {
    return `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vLatitude;
      varying vec3 vViewPosition;
      
      uniform float uRadius;
      
      void main() {
        vec3 spherePos = normalize(position);
        vec3 newPosition = spherePos * uRadius;
        
        vNormal = normalize(normalMatrix * spherePos);
        vPosition = spherePos;
        vLatitude = spherePos.y;
        
        vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
        vViewPosition = -mvPosition.xyz;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  }

  getFragmentShader(): string {
    return `
      ${GLSL_SIMPLEX_NOISE}
      
      uniform vec3 uColorBase;
      uniform vec3 uColorSecondary;
      uniform vec3 uColorAccent;
      uniform vec3 uColorWater; // Usado para tormentas oscuras
      uniform float uTime;
      uniform float uSeed;
      uniform float uBandCount;
      uniform float uFlowSpeed;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vLatitude;
      varying vec3 vViewPosition;
      
      // Función simple de domain warping local
      float localWarp(vec3 p) {
        return snoise(p + vec3(snoise(p), snoise(p + 12.3), snoise(p + 45.6)));
      }
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
        
        // Animación de flujo
        float time = uTime * uFlowSpeed;
        
        // Coordenadas deformadas para turbulencia
        // Las bandas se mueven a distintas velocidades según latitud
        float speed = 1.0 + sin(vLatitude * 10.0) * 0.5; // Velocidad variable por banda
        vec3 flowPos = vPosition * 2.5 + vec3(time * speed, 0.0, 0.0);
        
        // Ruido turbulento
        float turbulence = localWarp(flowPos);
        
        // Patrón de bandas principal
        float bandBase = vLatitude * uBandCount + turbulence * 0.5;
        float band = sin(bandBase * 3.14159);
        
        // "La Gran Mancha" (Tormenta)
        // Máscara localizada
        vec3 stormCenter = normalize(vec3(0.5, -0.2, 0.8)); // Posición arbitraria
        float stormDist = distance(vPosition, stormCenter);
        float stormMask = smoothstep(0.4, 0.0, stormDist);
        
        // Vórtice de la tormenta
        float vortex = 0.0;
        if (stormMask > 0.01) {
             vec3 vortexPos = vPosition * 10.0;
             // Rotación simple
             float ang = atan(vPosition.y - stormCenter.y, vPosition.x - stormCenter.x) + time * 2.0;
             vortex = snoise(vec3(cos(ang) * 2.0, sin(ang) * 2.0, time));
        }
        
        // Mezcla de colores
        vec3 color;
        
        // Color base de bandas
        color = mix(uColorBase, uColorSecondary, smoothstep(-0.8, 0.8, band));
        
        // Agregar detalles turbulentos (accent)
        color = mix(color, uColorAccent, smoothstep(0.3, 0.8, abs(turbulence)));
        
        // Agregar tormenta
        vec3 stormColor = mix(uColorWater, uColorAccent, vortex * 0.5 + 0.5);
        color = mix(color, stormColor, stormMask * 0.8);
        
        // Iluminación
        // Gaseoso: Iluminación difusa suave (Lambert)
        float diff = max(dot(normal, lightDir), 0.0) * 0.8 + 0.2; // Luz ambiental fuerte
        
        // Rim Light / Atmosphere Fresnel (Dispersión atmosférica)
        // Oscurecimiento en los bordes (Limb Darkening) típico de gigantes gaseosos
        float fresnel = pow(max(0.0, 1.0 - dot(viewDir, normal)), 2.0);
        
        // En gigantes gaseosos, el borde se oscurece y se vuelve más saturado/azulado a veces
        // Aquí simulamos absorción atmosférica
        vec3 atmosphere = color * diff * (1.0 - fresnel * 0.6);
        
        // Añadir un ligero brillo en el terminador
        atmosphere += uColorSecondary * fresnel * 0.1;

        gl_FragColor = vec4(atmosphere, 1.0);
      }
    `;
  }

  getCustomUniforms(): Record<string, THREE.IUniform> {
    return {
      uTime: { value: 0 },
    };
  }
}
