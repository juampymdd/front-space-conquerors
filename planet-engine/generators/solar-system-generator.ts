import { SeededRandom } from '../utils/seeded-random';
import { StarGenerator, STAR_CONFIGS } from '../generators/star-generator';
import type { StarType } from '../generators/star-generator';
import type { PlanetType } from '../types/planet.types';
import type {
  SolarSystemConfig,
  SolarSystemData,
  SolarPlanetData,
  SolarStarData,
  OrbitData,
  SolarZone,
  RingData,
  RingBand,
  SolarMoonData,
} from '../types/solar-system.types';

// Tipos de planeta permitidos por zona
const ZONE_PLANET_TYPES: Record<SolarZone, PlanetType[]> = {
  inner: ['rocky', 'volcanic'],
  habitable: ['rocky', 'oceanic', 'jungle'],
  outer: ['icy', 'gas_giant'],
};

// Rangos de excentricidad por zona (más estables cerca del sol)
const ZONE_ECCENTRICITY: Record<SolarZone, { min: number; max: number }> = {
  inner: { min: 0.01, max: 0.1 },
  habitable: { min: 0.02, max: 0.15 },
  outer: { min: 0.05, max: 0.3 },
};

/**
 * Generador de sistemas solares procedurales
 */
export class SolarSystemGenerator {
  private seed: number;
  private rng: SeededRandom;

  constructor(seed: number) {
    this.seed = seed;
    this.rng = new SeededRandom(seed);
  }

  /**
   * Genera un sistema solar completo
   */
  generate(config: Partial<SolarSystemConfig> = {}): SolarSystemData {
    const planetCount = config.planetCount ?? this.rng.rangeInt(9, 12);
    const systemRadius = config.systemRadius ?? 35; // Más compacto para mejor visualización
    
    // Generar estrella
    const star = this.generateStar(config.starType);
    
    // Generar planetas con órbitas
    const planets = this.generatePlanets(planetCount, systemRadius, star.radius);
    
    return {
      id: `system-${this.seed}`,
      seed: this.seed,
      star,
      planets,
    };
  }

  /**
   * Genera la estrella central
   */
  private generateStar(preferredType?: StarType): SolarStarData {
    // Seleccionar tipo de estrella (ponderado hacia amarillas)
    const starTypes: StarType[] = ['red_dwarf', 'yellow_dwarf', 'orange_giant', 'blue_giant'];
    const weights = [0.2, 0.5, 0.2, 0.1]; // Yellow dwarf más común
    
    let starType = preferredType;
    if (!starType) {
      const roll = this.rng.next();
      let cumulative = 0;
      for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (roll < cumulative) {
          starType = starTypes[i];
          break;
        }
      }
      starType = starType ?? 'yellow_dwarf';
    }
    
    const config = STAR_CONFIGS[starType];
    
    return {
      id: `star-${this.seed}`,
      name: `Star-${this.seed}`,
      type: starType,
      seed: this.seed,
      radius: 4 * config.radiusMultiplier, // Estrella grande (4-8 unidades)
    };
  }

  /**
   * Genera todos los planetas del sistema
   */
  private generatePlanets(
    count: number,
    systemRadius: number,
    starRadius: number
  ): SolarPlanetData[] {
    const planets: SolarPlanetData[] = [];
    
    // Distancia mínima desde la estrella
    const minDistance = starRadius * 2;
    
    // Distribuir órbitas logarítmicamente (más juntas cerca, más separadas lejos)
    const orbitDistances = this.generateOrbitDistances(count, minDistance, systemRadius);
    
    let gasGiantCount = 0;
    
    for (let i = 0; i < count; i++) {
      const distance = orbitDistances[i];
      const zone = this.getZone(distance, systemRadius);
      const planetSeed = this.seed * 1000 + i;
      
      const planet = this.generatePlanet(i, planetSeed, distance, zone, gasGiantCount);
      if (planet.type === 'gas_giant') {
        gasGiantCount++;
      }
      planets.push(planet);
    }
    
    return planets;
  }

  /**
   * Genera distancias de órbita usando ley de Titius-Bode modificada
   * Con separación mínima garantizada
   */
  private generateOrbitDistances(
    count: number,
    minDistance: number,
    maxDistance: number
  ): number[] {
    const distances: number[] = [];
    const minSeparation = 3.5; // Separación mínima entre órbitas
    
    for (let i = 0; i < count; i++) {
      // Distribución más espaciada
      const baseDistance = minDistance + (i / (count - 1)) * (maxDistance - minDistance);
      const variation = (this.rng.next() - 0.5) * 1.5; // Menos variación
      
      let distance = baseDistance + variation;
      
      // Asegurar separación mínima del planeta anterior
      if (i > 0) {
        const minAllowed = distances[i - 1] + minSeparation;
        distance = Math.max(distance, minAllowed);
      }
      
      distances.push(Math.max(minDistance, Math.min(maxDistance, distance)));
    }
    
    return distances;
  }

  /**
   * Determina la zona del sistema basándose en la distancia
   */
  private getZone(distance: number, systemRadius: number): SolarZone {
    const normalizedDistance = distance / systemRadius;
    
    if (normalizedDistance < 0.3) {
      return 'inner' as SolarZone;
    } else if (normalizedDistance < 0.5) {
      return 'habitable' as SolarZone;
    } else {
      return 'outer' as SolarZone;
    }
  }

  /**
   * Genera un planeta individual
   */
  private generatePlanet(
    index: number,
    seed: number,
    orbitDistance: number,
    zone: SolarZone,
    gasGiantCount: number
  ): SolarPlanetData {
    const rng = new SeededRandom(seed);
    
    // Seleccionar tipo de planeta según zona
    let allowedTypes = [...ZONE_PLANET_TYPES[zone]];
    
    // Limitar gigantes gaseosos a un máximo de 2
    if (gasGiantCount >= 2) {
      allowedTypes = allowedTypes.filter(t => t !== 'gas_giant');
    }
    
    const planetType = allowedTypes[rng.rangeInt(0, allowedTypes.length - 1)];
    
    // Tamaño del planeta (proporcional a la estrella)
    let radius = rng.range(0.2, 0.5);  // Planetas normales (pequeños vs estrella)
    if (planetType === 'gas_giant') {
      radius = rng.range(0.8, 1.2);    // Gigantes gaseosos (aún menores que estrella)
    }
    
    // Generar datos de órbita elíptica
    const orbit = this.generateOrbit(orbitDistance, zone, rng);
    
    // Generar anillos para gigantes gaseosos (probabilidad basada en masa/radio)
    let rings: RingData | undefined;
    if (planetType === 'gas_giant') {
      rings = this.generateRings(radius, rng);
    }
    
    // Generar lunas
    const moons = this.generateMoons(seed, radius, planetType, rng);
    
    return {
      id: `planet-${seed}`,
      name: `Planet-${index + 1}`, // Se sobrescribirá con nombre de DB
      type: planetType,
      seed,
      radius,
      orbit,
      rings,
      moons,
    };
  }

  /**
   * Genera lunas para un planeta
   */
  private generateMoons(
    planetSeed: number,
    planetRadius: number,
    planetType: PlanetType,
    rng: SeededRandom
  ): SolarMoonData[] {
    const moons: SolarMoonData[] = [];
    
    // Probabilidad de tener lunas
    // Gigantes gaseosos: 100% (2-5 lunas)
    // Rocosos/Habitables: 30% (0-1 luna)
    // Otros: 10%
    let maxMoons = 0;
    let moonProb = 0.1;

    if (planetType === 'gas_giant') {
      maxMoons = rng.rangeInt(2, 5);
      moonProb = 1.0;
    } else if (['rocky', 'oceanic', 'jungle'].includes(planetType)) {
      maxMoons = 1;
      moonProb = 0.3;
    }

    if (rng.next() > moonProb) return [];

    const actualMoonCount = maxMoons > 1 ? rng.rangeInt(1, maxMoons) : 1;
    let currentOrbitDist = planetRadius * 2.2; // Aumentar margen inicial (era 1.5)

    for (let i = 0; i < actualMoonCount; i++) {
      const moonSeed = planetSeed + 500 + i;
      const moonRng = new SeededRandom(moonSeed);
      
      const moonRadius = planetRadius * moonRng.range(0.1, 0.25);
      const orbitDist = currentOrbitDist + moonRng.range(0.5, 1.0); // Más separación (era 0.3, 0.6)
      
      moons.push({
        id: `moon-${moonSeed}`,
        name: `Moon ${i + 1}`,
        seed: moonSeed,
        radius: moonRadius,
        orbit: {
          semiMajorAxis: orbitDist,
          eccentricity: moonRng.range(0, 0.05),
          inclination: moonRng.range(-0.2, 0.2),
          startAngle: moonRng.range(0, Math.PI * 2),
          orbitalPeriod: Math.pow(orbitDist, 1.5) * 0.5, // Más rápido que planetas
        }
      });

      currentOrbitDist = orbitDist + moonRadius;
    }

    return moons;
  }

  /**
   * Genera datos de órbita elíptica
   */
  private generateOrbit(
    distance: number,
    zone: SolarZone,
    rng: SeededRandom
  ): OrbitData {
    const eccRange = ZONE_ECCENTRICITY[zone];
    
    return {
      semiMajorAxis: distance,
      eccentricity: rng.range(eccRange.min, eccRange.max),
      inclination: rng.range(-0.1, 0.1), // Pequeña inclinación (radianes)
      startAngle: rng.range(0, Math.PI * 2),
      // Período proporcional a distancia^1.5 (tercera ley de Kepler simplificada)
      orbitalPeriod: Math.pow(distance, 1.5) * 2,
    };
  }

  /**
   * Genera anillos para un gigante gaseoso
   * Crea un sistema de múltiples bandas delgadas como Saturno
   */
  private generateRings(planetRadius: number, rng: SeededRandom): RingData | undefined {
    // Probabilidad alta de tener anillos para gigantes gaseosos
    const ringProbability = 0.8 + (planetRadius - 0.8) * 0.375;
    
    if (rng.next() > ringProbability) {
      return undefined;
    }
    
    // Paletas de colores para los anillos (tonos Saturno)
    const palettes = [
      ['#d4a574', '#c9b896', '#a89070', '#8a7a6a', '#b8a88a'], // Marrones/Beige
      ['#e3e3e3', '#cfcfcf', '#b5b5b5', '#999999', '#7a7a7a'], // Grises/Hielo
      ['#c2b280', '#d2b48c', '#bc8f8f', '#a0522d', '#cd853f'], // Tierra/Arena
    ];
    
    const palette = palettes[rng.rangeInt(0, palettes.length - 1)];
    const bands: RingBand[] = [];
    const bandCount = rng.rangeInt(4, 8); // 4 a 8 bandas para mayor detalle
    
    let currentRadius = 1.2 + rng.range(0.1, 0.3); // Radio inicial
    const ringTilt = rng.range(0.1, 0.4);
    
    for (let i = 0; i < bandCount; i++) {
      const bandWidth = rng.range(0.1, 0.25);
      const gap = rng.range(0.01, 0.05); // Pequeños huecos entre bandas
      
      bands.push({
        innerRadius: currentRadius,
        outerRadius: currentRadius + bandWidth,
        color: palette[rng.rangeInt(0, palette.length - 1)],
        opacity: rng.range(0.4, 0.8),
      });
      
      currentRadius += bandWidth + gap;
    }
    
    return {
      tilt: ringTilt,
      bands: bands,
    };
  }

  /**
   * Crea el generador de estrella
   */
  createStarGenerator(starData: SolarStarData): StarGenerator {
    return new StarGenerator(starData.seed, starData.type, starData.radius);
  }
}
