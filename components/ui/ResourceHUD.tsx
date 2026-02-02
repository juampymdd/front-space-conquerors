
import React from "react";
import { Frame } from "./Frame";
import { Zap, Coins, Microscope, Fuel } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ResourceProps {
  icon: any;
  label: string;
  value: string;
  percent: number;
  color: string;
}

function ResourceItem({ icon: Icon, label, value, percent, color }: ResourceProps) {
  return (
    <div className="relative group w-48">
      <div className="absolute inset-0 -z-10">
        <Frame
          paths={JSON.parse(
            `[{"show":true,"style":{"strokeWidth":"1","stroke":"${color}/30","fill":"var(--color-background)"},"path":[["M","10","0"],["L","100%","0"],["L","100%","100% - 10"],["L","100% - 10","100%"],["L","0","100%"],["L","0","10"],["Z"]]}]`
          )}
        />
      </div>
      <div className="px-4 py-2 flex items-center gap-3">
        <div className={twMerge("p-1.5 border border-primary/10", `bg-${color}/10`)}>
          <Icon size={14} style={{ color }} />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest">{label}</span>
          <span className="text-xs font-bold font-mono tracking-tight text-foreground">{value}</span>
        </div>
      </div>
      {/* Progress mini-bar at bottom */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-primary/10 w-full overflow-hidden">
        <div
          className="h-full shadow-glow transition-all duration-1000"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export interface ResourceData {
  icon: any;
  label: string;
  value: string;
  percent: number;
  color: string;
}

export function ResourceHUD({ resources }: { resources?: ResourceData[] }) {
  const defaultResources: ResourceData[] = [
    {
      icon: Zap,
      label: "Energy",
      value: "42,800 GW",
      percent: 85,
      color: "var(--color-primary)",
    },
    {
      icon: Coins,
      label: "Credits",
      value: "1.2M ¢",
      percent: 60,
      color: "#fbbf24",
    },
    {
      icon: Microscope,
      label: "Research",
      value: "782k RP",
      percent: 30,
      color: "var(--color-success)",
    },
    {
      icon: Fuel,
      label: "Deuterium",
      value: "12.5k T",
      percent: 95,
      color: "var(--color-accent)",
    },
  ];

  const displayResources = resources || defaultResources;

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {displayResources.map((resource, idx) => (
        <ResourceItem key={idx} {...resource} />
      ))}
    </div>
  );
}
