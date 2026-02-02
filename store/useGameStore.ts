import { create } from 'zustand';
import { Zap, Database, Gem, Fuel } from 'lucide-react';

export interface Resource {
  id: string;
  nameKey: string; // Translation key
  amount: number;
  max: number;
  icon: any;
  color: string;
}

export interface PlanetData {
  id: string;
  name: string;
  type: string;
  seed: number;
  resources: Resource[];
}

export interface FleetMovement {
  id: string;
  type: 'attack' | 'defend' | 'transport' | 'expedition' | 'espionage' | 'colonize';
  origin: {
    name: string;
    type: string;
    seed: number;
  };
  destination: {
    name: string;
    type: string;
    seed: number;
  };
  sentAt: Date;
  arrivalAt: Date;
  status: 'outgoing' | 'returning';
  fleet: Record<string, number>;
  resources?: Record<string, number>;
}

interface GameState {
  selectedPlanetId: string;
  planets: PlanetData[];
  fleetMovements: FleetMovement[];
  setSelectedPlanetId: (id: string) => void;
  updateResource: (planetId: string, resourceId: string, amount: number) => void;
  addFleetMovement: (movement: FleetMovement) => void;
}

const MOCK_PLANETS: PlanetData[] = [
  {
    id: "1",
    name: "Aethelgard Primus",
    type: "volcanic",
    seed: 12345,
    resources: [
      { id: "metal", nameKey: "metal", amount: 42800, max: 100000, icon: Database, color: "#94a3b8" },
      { id: "crystal", nameKey: "crystal", amount: 15200, max: 50000, icon: Gem, color: "#38bdf8" },
      { id: "deuterium", nameKey: "deuterium", amount: 8400, max: 20000, icon: Fuel, color: "#a855f7" },
      { id: "energy", nameKey: "energy", amount: 2400, max: 5000, icon: Zap, color: "#fbbf24" },
    ]
  },
  {
    id: "2",
    name: "Cygnus Prime",
    type: "icy",
    seed: 67890,
    resources: [
      { id: "metal", nameKey: "metal", amount: 12000, max: 100000, icon: Database, color: "#94a3b8" },
      { id: "crystal", nameKey: "crystal", amount: 38500, max: 50000, icon: Gem, color: "#38bdf8" },
      { id: "deuterium", nameKey: "deuterium", amount: 12000, max: 20000, icon: Fuel, color: "#a855f7" },
      { id: "energy", nameKey: "energy", amount: 1800, max: 5000, icon: Zap, color: "#fbbf24" },
    ]
  },
  {
    id: "3",
    name: "Nova Terras",
    type: "jungle",
    seed: 11223,
    resources: [
      { id: "metal", nameKey: "metal", amount: 25000, max: 100000, icon: Database, color: "#94a3b8" },
      { id: "crystal", nameKey: "crystal", amount: 21000, max: 50000, icon: Gem, color: "#38bdf8" },
      { id: "deuterium", nameKey: "deuterium", amount: 19500, max: 20000, icon: Fuel, color: "#a855f7" },
      { id: "energy", nameKey: "energy", amount: 4200, max: 5000, icon: Zap, color: "#fbbf24" },
    ]
  },
  {
    id: "4",
    name: "Xylos VII",
    type: "gas_giant",
    seed: 44556,
    resources: [
      { id: "metal", nameKey: "metal", amount: 5000, max: 100000, icon: Database, color: "#94a3b8" },
      { id: "crystal", nameKey: "crystal", amount: 8000, max: 50000, icon: Gem, color: "#38bdf8" },
      { id: "deuterium", nameKey: "deuterium", amount: 45000, max: 50000, icon: Fuel, color: "#a855f7" },
      { id: "energy", nameKey: "energy", amount: 9500, max: 10000, icon: Zap, color: "#fbbf24" },
    ]
  },
];

const MOCK_MOVEMENTS: FleetMovement[] = [
  {
    id: "m1",
    type: 'attack',
    origin: { name: "Aethelgard Primus", type: "volcanic", seed: 12345 },
    destination: { name: "Xylos VII", type: "gas_giant", seed: 44556 },
    sentAt: new Date(Date.now() - 1000 * 60 * 10), // Sent 10m ago
    arrivalAt: new Date(Date.now() + 1000 * 60 * 15), // Total 25m journey
    status: 'outgoing',
    fleet: { cazaLigero: 50, destructor: 5 }
  },
  {
    id: "m2",
    type: 'defend',
    origin: { name: "Nova Terras", type: "jungle", seed: 11223 },
    destination: { name: "Cygnus Prime", type: "icy", seed: 67890 },
    sentAt: new Date(Date.now() - 1000 * 60 * 30), // Sent 30m ago
    arrivalAt: new Date(Date.now() + 1000 * 60 * 8), // Total 38m journey
    status: 'outgoing',
    fleet: { naveBatalla: 2, cruceroPesado: 10 }
  },
  {
    id: "m3",
    type: 'transport',
    origin: { name: "Cygnus Prime", type: "icy", seed: 67890 },
    destination: { name: "Aethelgard Primus", type: "volcanic", seed: 12345 },
    sentAt: new Date(Date.now() - 1000 * 60 * 5), // Sent 5m ago
    arrivalAt: new Date(Date.now() + 1000 * 60 * 25), // Total 30m journey
    status: 'outgoing',
    fleet: { naveCarga: 20 },
    resources: { metal: 15000, crystal: 10000, deuterium: 5000 }
  },
  {
    id: "m4",
    type: 'espionage',
    origin: { name: "Xylos VII", type: "gas_giant", seed: 44556 },
    destination: { name: "Nova Terras", type: "jungle", seed: 11223 },
    sentAt: new Date(Date.now() - 1000 * 60 * 2), // Sent 2m ago
    arrivalAt: new Date(Date.now() + 1000 * 60 * 3), // Total 5m journey (very fast)
    status: 'outgoing',
    fleet: { sondaEspionaje: 5 }
  },
  {
    id: "m5",
    type: 'colonize',
    origin: { name: "Aethelgard Primus", type: "volcanic", seed: 12345 },
    destination: { name: "Unknown System", type: "terran", seed: 99999 },
    sentAt: new Date(Date.now() - 1000 * 60 * 120), // Sent 2h ago
    arrivalAt: new Date(Date.now() + 1000 * 60 * 60), // Total 3h journey (long range)
    status: 'outgoing',
    fleet: { colonizador: 1, cazaLigero: 50, naveCarga: 5 }
  }
];

export const useGameStore = create<GameState>((set) => ({
  selectedPlanetId: MOCK_PLANETS[0].id,
  planets: MOCK_PLANETS,
  fleetMovements: MOCK_MOVEMENTS,
  setSelectedPlanetId: (id) => set({ selectedPlanetId: id }),
  updateResource: (planetId, resourceId, amount) => set((state) => ({
    planets: state.planets.map((p) => 
      p.id === planetId 
        ? { 
            ...p, 
            resources: p.resources.map((r) => 
              r.id === resourceId ? { ...r, amount } : r
            ) 
          } 
        : p
    )
  })),
  addFleetMovement: (movement) => set((state) => ({
    fleetMovements: [...state.fleetMovements, movement]
  })),
}));
