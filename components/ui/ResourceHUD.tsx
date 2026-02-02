import React from "react";
import { Frame } from "./Frame";
import { twMerge } from "tailwind-merge";
import { useGameStore, Resource } from "@/store/useGameStore";
import { useTranslations } from "next-intl";

export type ResourceData = Resource;

interface ResourceProps {
  icon: any;
  label: string;
  value: string;
  percent: number;
  color: string;
}

function ResourceItem({ icon: Icon, label, value, percent, color }: ResourceProps) {
  return (
    <div className="relative group w-36 xl:w-44">
      <div className="absolute inset-0 -z-10">
        <Frame
          paths={JSON.parse(
            `[{"show":true,"style":{"strokeWidth":"1","stroke":"${color}/30","fill":"var(--color-primary)/5"},"path":[["M","10","0"],["L","100%","0"],["L","100%","100% - 10"],["L","100% - 10","100%"],["L","0","100%"],["L","0","10"],["Z"]]}]`
          )}
        />
      </div>
      <div className="px-3 py-1.5 flex items-center gap-2.5">
        <div className="p-1 border border-primary/10 bg-primary/5">
          <Icon size={12} style={{ color }} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[8px] font-mono text-foreground/40 uppercase tracking-widest truncate">{label}</span>
          <span className="text-[10px] font-bold font-mono tracking-tight text-foreground truncate">{value}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-[1px] bg-primary/10 w-full overflow-hidden">
        <div
          className="h-full shadow-glow transition-all duration-1000"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

interface ResourceHUDProps {
  resources?: ResourceData[];
}

export function ResourceHUD({ resources: propResources }: ResourceHUDProps) {
  const t = useTranslations("dashboard.resources");
  const { selectedPlanetId, planets } = useGameStore();
  
  const selectedPlanet = planets.find(p => p.id === selectedPlanetId);
  const storeResources = selectedPlanet?.resources || [];
  
  const displayResources = propResources || storeResources;

  return (
    <div className="flex items-center gap-3">
      {displayResources.map((resource) => (
        <ResourceItem 
          key={resource.id} 
          icon={resource.icon}
          label={t(resource.nameKey)}
          value={resource.amount.toLocaleString()}
          percent={(resource.amount / resource.max) * 100}
          color={resource.color}
        />
      ))}
    </div>
  );
}
