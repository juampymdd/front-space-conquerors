
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ManagementHub } from "./components/ManagementHub";
import { PlanetListSidebar } from "./components/PlanetListSidebar";
import type { PlanetType } from "@/planet-engine/types/planet.types";

const PLANETS: { id: string; name: string; type: PlanetType; seed: number }[] = [
  { id: "1", name: "Aethelgard Primus", type: "volcanic", seed: 12345 },
  { id: "2", name: "Cygnus Prime", type: "icy", seed: 67890 },
  { id: "3", name: "Nova Terras", type: "jungle", seed: 11223 },
  { id: "4", name: "Xylos VII", type: "gas_giant", seed: 44556 },
];

export default function DashboardPage() {
  const [selectedPlanetId, setSelectedPlanetId] = useState(PLANETS[0].id);
  const selectedPlanet = PLANETS.find(p => p.id === selectedPlanetId) || PLANETS[0];

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] gap-8">
        {/* Main Central Management Area */}
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <ManagementHub selectedPlanet={selectedPlanet} />
        </div>

        {/* Right Planets Sidebar */}
        <div className="h-full hidden xl:block">
          <PlanetListSidebar 
            planets={PLANETS} 
            selectedId={selectedPlanetId} 
            onSelect={setSelectedPlanetId} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
