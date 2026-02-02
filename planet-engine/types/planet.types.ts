// Tipos de planetas soportados
export type PlanetType = 'rocky' | 'oceanic' | 'jungle' | 'volcanic' | 'icy' | 'gas_giant';

// Configuración de los niveles de ruido (FBM)
export interface NoiseConfig {
  seed: number;
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
}

// Set de máscaras para el punto actual
export interface MaskSet {
  continent: number;      // 0 = océano, 1 = tierra
  mountainRange: number;  // 0 = llanura, 1 = zona montañosa
  latitude: number;       // 0 = ecuador, 1 = polo
  humidity: number;       // 0 = seco, 1 = húmedo
}

// Configuración de atmósfera
export interface AtmosphereConfig {
  enabled: boolean;
  density: number;
  color: string;
  innerRadius?: number;
  outerRadius?: number;
}

// Colores del planeta
export interface PlanetColors {
  base: string;
  secondary?: string;
  accent: string;
  water?: string;
  atmosphere?: string;
}

// Parámetros maestros del planeta
export interface PlanetParameters {
  type: PlanetType;
  radius: number;
  resolution: number;
  seed: number;
  colors: PlanetColors;
  atmosphere: AtmosphereConfig;
}

// Resultado de la generación de elevación
export interface ElevationResult {
  elevation: number;
  masks: MaskSet;
}