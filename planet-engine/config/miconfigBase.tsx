import type { NoiseConfig } from "../types/planet.types";


// Definimos el ruido base para el relieve del planeta
const baseNoise: NoiseConfig = {
  seed: Math.random() * 1000,
  scale: 2.0,
  octaves: 6,
  persistence: 0.5,
  lacunarity: 2.0
};

// Esta es tu configuración base
export const miConfigBase = {
  radius: 2,
  resolution: 64, // Calidad de la malla
  terrain: baseNoise,
  atmosphere: {
    enabled: true,
    density: 0.12,
    color: '#ffffff'
  },
  colors: {
    base: '#555555',
    secondary: '#333333',
    accent: '#ffffff'
  }
};