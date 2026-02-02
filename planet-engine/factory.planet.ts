import type { PlanetType } from './types/planet.types';
import { 
  BasePlanetGenerator,
  RockyPlanetGenerator,
  OceanicPlanetGenerator,
  VolcanicPlanetGenerator,
  IcyPlanetGenerator,
  JunglePlanetGenerator,
  GasGiantGenerator
} from './generators';

/**
 * Factory para crear planetas según su tipo
 * Cada tipo tiene su propio generador con lógica distinta
 */
export class PlanetFactory {
  /**
   * Crea un generador de planeta según el tipo especificado
   */
  static create(
    type: PlanetType, 
    seed: number, 
    radius: number = 1, 
    resolution: number = 64
  ): BasePlanetGenerator {
    switch (type) {
      case 'rocky':
        return new RockyPlanetGenerator(seed, radius, resolution);
      case 'oceanic':
        return new OceanicPlanetGenerator(seed, radius, resolution);
      case 'volcanic':
        return new VolcanicPlanetGenerator(seed, radius, resolution);
      case 'icy':
        return new IcyPlanetGenerator(seed, radius, resolution);
      case 'jungle':
        return new JunglePlanetGenerator(seed, radius, resolution);
      case 'gas_giant':
        return new GasGiantGenerator(seed, radius, resolution);
      default:
        return new RockyPlanetGenerator(seed, radius, resolution);
    }
  }

  /**
   * Genera un tipo de planeta aleatorio
   */
  static getRandomType(seed: number): PlanetType {
    const types: PlanetType[] = ['rocky', 'oceanic', 'volcanic', 'icy', 'jungle', 'gas_giant'];
    const index = Math.floor((seed * 1000) % types.length);
    return types[Math.abs(index)];
  }

  /**
   * Lista de todos los tipos disponibles
   */
  static getAllTypes(): PlanetType[] {
    return ['rocky', 'oceanic', 'volcanic', 'icy', 'jungle', 'gas_giant'];
  }

  /**
   * Obtiene un nombre descriptivo para el tipo
   */
  static getTypeName(type: PlanetType): string {
    const names: Record<PlanetType, string> = {
      rocky: 'Rocoso',
      oceanic: 'Oceánico',
      volcanic: 'Volcánico',
      icy: 'Helado',
      jungle: 'Selvático',
      gas_giant: 'Gigante Gaseoso',
    };
    return names[type];
  }
}