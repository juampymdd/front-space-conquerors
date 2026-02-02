
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ManagementHub } from "./components/ManagementHub";
import { PlanetListSidebar } from "./components/PlanetListSidebar";
import { useGameStore } from "@/store/useGameStore";

export default function DashboardPage() {
  const { selectedPlanetId, planets, setSelectedPlanetId } = useGameStore();
  
  const selectedPlanet = planets.find(p => p.id === selectedPlanetId) || planets[0];

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] gap-8">
        {/* Main Central Management Area */}
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <ManagementHub selectedPlanet={selectedPlanet as any} />
        </div>

        {/* Right Planets Sidebar */}
        <div className="h-full hidden xl:block">
          <PlanetListSidebar 
            planets={planets as any} 
            selectedId={selectedPlanetId} 
            onSelect={setSelectedPlanetId} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
