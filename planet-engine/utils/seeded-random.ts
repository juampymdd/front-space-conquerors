/**
 * Mulberry32 PRNG - Generador de números pseudoaleatorios determinístico
 * Permite reproducibilidad total dado el mismo seed
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Genera el siguiente número aleatorio entre 0 y 1
   */
  next(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Genera un número aleatorio en un rango específico
   */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Genera un entero aleatorio en un rango
   */
  rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /**
   * Crea una copia del generador con el mismo estado
   */
  clone(): SeededRandom {
    const clone = new SeededRandom(0);
    clone.seed = this.seed;
    return clone;
  }

  /**
   * Resetea el generador al seed original
   */
  reset(newSeed: number): void {
    this.seed = newSeed;
  }
}
