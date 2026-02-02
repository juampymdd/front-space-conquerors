import React, { useState } from "react";
import { Frame } from "./Frame";
import { 
  Rocket, 
  Shield, 
  Cpu, 
  Settings2, 
  Map, 
  Users, 
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

const menuItems = [
  { icon: Map, key: "galacticMap", detailKey: "sectors" },
  { icon: Rocket, key: "fleetCommand", detailKey: "vessels" },
  { icon: Shield, key: "defenseOps", detailKey: "shields" },
  { icon: Cpu, key: "techLabs", detailKey: "discovery" },
  { icon: Users, key: "diplomacy", detailKey: "requests" },
  { icon: Settings2, key: "systemConfig", detailKey: "version" },
];

export function Sidebar() {
  const t = useTranslations("dashboard.mainSidebar");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={twMerge(
        "relative flex flex-col transition-all duration-300 z-40 bg-background/40 backdrop-blur-sm border-r border-primary/10",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="p-4 flex justify-end">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="size-8 flex items-center justify-center border border-primary/20 hover:border-primary/50 text-primary/50 hover:text-primary transition-all"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-2 px-3">
        {menuItems.map((item, idx) => (
          <div 
            key={idx}
            className="group relative cursor-pointer"
          >
            <div 
              className={twMerge(
                "flex items-center gap-4 px-3 py-3 relative z-10 transition-colors",
                "group-hover:text-primary"
              )}
            >
              <item.icon size={20} className="shrink-0 text-primary/70 group-hover:text-primary group-hover:drop-shadow-glow" />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-bold uppercase tracking-tight leading-none">
                    {t(item.key)}
                  </span>
                  <span className="text-[10px] font-mono text-foreground/40 mt-1 leading-none">
                    {t(`details.${item.detailKey}`)}
                  </span>
                </div>
              )}
            </div>
            
            {/* Hover Frame Effect */}
            <div className="absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Frame
                paths={JSON.parse(
                  '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-primary)/30","fill":"var(--color-primary)/5"},"path":[["M","0","0"],["L","100% - 10","0"],["L","100%","10"],["L","100%","100%"],["L","5","100%"],["L","0","100% - 5"],["Z"]]}]'
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-primary/10">
        {!isCollapsed && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-primary/10 pb-2">
              <span className="text-[10px] font-mono text-primary/60 uppercase">{t("powerGrid")}</span>
              <span className="text-xs font-bold text-success">{t("stable")}</span>
            </div>
            <div className="h-1 bg-primary/10 w-full overflow-hidden">
              <div className="h-full bg-primary shadow-glow w-3/4 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
