import React from "react";
import { Frame } from "@/components/ui/Frame";
import { twMerge } from "tailwind-merge";
import { SmallPlanet } from "./SmallPlanet";
import type { PlanetType } from "@/planet-engine/types/planet.types";
import { useTranslations } from "next-intl";

interface Planet {
  id: string;
  name: string;
  type: PlanetType;
  seed: number;
}

interface PlanetListSidebarProps {
  planets: Planet[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function PlanetListSidebar({ planets, selectedId, onSelect }: PlanetListSidebarProps) {
  const t = useTranslations("dashboard");

  return (
    <aside className="w-64 bg-background/40 backdrop-blur-sm border-l border-primary/10 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-primary/10">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-primary text-shadow-glow">
          {t("sidebar.title")}
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {planets.map((planet) => {
          const isSelected = planet.id === selectedId;
          
          return (
            <div 
              key={planet.id}
              onClick={() => onSelect(planet.id)}
              className={twMerge(
                "group relative cursor-pointer px-4 py-3 transition-all duration-500",
                isSelected ? "text-primary bg-primary/5 py-8" : "text-foreground/60 hover:text-primary"
              )}
            >
              <div className={twMerge(
                "flex items-center gap-4 relative z-10 transition-all duration-500",
                isSelected && "flex-col gap-6 text-center"
              )}>
                <div className={twMerge(
                  "size-12 rounded-full border-[0.5px] border-primary/20 bg-primary/2 flex items-center justify-center transition-all duration-500 shrink-0 overflow-hidden",
                  isSelected && "size-32 border-primary/40 bg-primary/10"
                )}>
                  <SmallPlanet 
                    type={planet.type} 
                    seed={planet.seed} 
                    className="size-full" 
                  />
                </div>
                <div className={twMerge(
                  "flex flex-col min-w-0 transition-all duration-500",
                  isSelected && "items-center"
                )}>
                  <span className={twMerge(
                    "text-sm font-bold uppercase tracking-wider leading-none truncate",
                    isSelected && "text-base tracking-[0.2em]"
                  )}>{planet.name}</span>
                  <span className="text-[10px] font-mono opacity-50 uppercase mt-2 truncate">
                    {t(`planetTypes.${planet.type.toLowerCase()}`)}
                  </span>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary shadow-glow" />
              )}
              
              <div className="absolute inset-0 -z-0">
                <Frame
                  paths={JSON.parse(
                    `[{"show":${isSelected},"style":{"strokeWidth":"1","stroke":"var(--color-primary)/20","fill":"transparent"},"path":[["M","0","0"],["L","100%","0"],["L","100%","100%"],["L","0","100%"],["Z"]]}]`
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
