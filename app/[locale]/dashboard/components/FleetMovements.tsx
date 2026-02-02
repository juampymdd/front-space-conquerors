"use client";

import React, { useEffect, useState } from "react";
import { Frame } from "@/components/ui/Frame";
import { useGameStore, FleetMovement } from "@/store/useGameStore";
import { useTranslations } from "next-intl";
import { 
  Sword, 
  Shield, 
  Truck, 
  Compass, 
  ChevronRight, 
  Clock, 
  MapPin,
  Rocket,
  Globe,
  Database,
  Gem,
  Fuel,
  Eye,
  Flag
} from "lucide-react";
import { twMerge } from "tailwind-merge";

import { motion, AnimatePresence } from "framer-motion";
import { ASSET_PATHS } from "@/constants/assets";
import { SmallPlanet } from "./SmallPlanet";
import type { PlanetType } from "@/planet-engine/types/planet.types";

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft("ARRIVED");
        clearInterval(timer);
        return;
      }

      const h = Math.floor(distance / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${h > 0 ? h + "h " : ""}${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span>{timeLeft}</span>;
}

import { 
  AccordionRoot, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/Accordion";
import { ScrollArea } from "@/components/ui/ScrollArea";

function MissionCard({ movement, currentTime, mounted }: { movement: FleetMovement, currentTime: number, mounted: boolean }) {
  const t = useTranslations("dashboard.movements");
  const tu = useTranslations("dashboard.upgrades.fleet");
  
  const missionConfigs = {
    attack: { 
      icon: Sword, 
      color: "#ef4444", 
      accent: "rgba(239, 68, 68, 0.2)",
      gradient: "from-destructive/20 via-transparent to-transparent",
      nickname: "Furia Roja"
    },
    defend: { 
      icon: Shield, 
      color: "#60a5fa", 
      accent: "rgba(96, 165, 250, 0.2)",
      gradient: "from-blue-500/20 via-transparent to-transparent",
      nickname: "Bastión Cobalto"
    },
    transport: { 
      icon: Truck, 
      color: "#34d399", 
      accent: "rgba(52, 211, 153, 0.2)",
      gradient: "from-emerald-500/20 via-transparent to-transparent",
      nickname: "Ruta de Suministro"
    },
    expedition: { 
      icon: Compass, 
      color: "#fbbf24", 
      accent: "rgba(251, 191, 36, 0.2)",
      gradient: "from-amber-500/20 via-transparent to-transparent",
      nickname: "Exploración Vacía"
    },
    espionage: { 
      icon: Eye, 
      color: "#a855f7", 
      accent: "rgba(168, 85, 247, 0.2)",
      gradient: "from-purple-500/20 via-transparent to-transparent",
      nickname: "Ojo Silencioso"
    },
    colonize: { 
      icon: Flag, 
      color: "#22d3ee", 
      accent: "rgba(34, 211, 238, 0.2)",
      gradient: "from-cyan-500/20 via-transparent to-transparent",
      nickname: "Nuevo Horizonte"
    },
  };

  const config = missionConfigs[movement.type];
  const Icon = config.icon;

  return (
    <AccordionItem value={movement.id} className="mb-4">
      <AccordionTrigger className="w-full">
        <div className="flex-1 flex items-center justify-between pe-4">
          <div className="flex items-center gap-4">
            <div 
              className="size-10 flex items-center justify-center border border-primary/20 shadow-glow"
              style={{ backgroundColor: config.accent, boxShadow: `0 0 15px ${config.accent}` }}
            >
              <Icon size={20} style={{ color: config.color }} />
            </div>
            <div className="flex flex-col items-start translate-y-0.5">
              <span className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: config.color }}>
                {t(`types.${movement.type}`)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-primary/60 uppercase tracking-widest">
                  Operación: {config.nickname}
                </span>
                <span className="text-primary/20 text-[9px]">|</span>
                <span className="text-[9px] font-mono text-primary/40 uppercase tracking-widest">
                   #{movement.id.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-3 py-1.5 bg-primary/5 border border-primary/10">
            <Clock size={12} className="text-primary/60" />
            <span className="text-xs font-bold font-mono tracking-widest text-primary">
              <Countdown targetDate={movement.arrivalAt} />
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-0">
        <div className="flex flex-col gap-8 pt-6">
          {/* Tactical Space Lane Visualization */}
        <div className="flex items-center gap-8 px-4 relative">
          {/* Progress Calculation */}
          {(() => {
            const now = currentTime; // Use the state variable
            const start = new Date(movement.sentAt).getTime();
            const end = new Date(movement.arrivalAt).getTime();
            const total = end - start;
            const elapsed = now - start;
            const progress = mounted ? Math.min(Math.max(elapsed / total, 0), 1) : 0;
            const remainingDuration = (end - now) / 1000; // in seconds

            return (
              <>
                {/* Origin */}
                <div className="flex flex-col items-center gap-3 w-28 shrink-0">
                   <div className="size-20 rounded-full border border-primary/20 bg-primary/5 p-1 relative">
                      <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
                      <SmallPlanet 
                        type={movement.origin.type as PlanetType} 
                        seed={movement.origin.seed} 
                        className="size-full rounded-full overflow-hidden" 
                      />
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">{movement.origin.name}</span>
                      <span className="text-[7px] font-mono text-primary/40 uppercase mt-1 px-1.5 py-0.5 border border-primary/10">
                        {t("origin")}
                      </span>
                   </div>
                </div>

                {/* Lane */}
                <div className="flex-1 relative h-6 flex items-center">
                  <div className="absolute inset-x-0 h-px bg-primary/10" />
                  
                  {/* Animated Path (completed part) */}
                  <div 
                    className="absolute h-px transition-all duration-1000 ease-linear"
                    style={{ 
                      width: `${progress * 100}%`,
                      background: `linear-gradient(to right, transparent, ${config.color})` 
                    }}
                  />

                  {/* Moving Ship Icon */}
                  <div
                    className="absolute z-10 transition-all duration-1000 ease-linear"
                    style={{ left: `${progress * 100}%`, transform: "translateX(-50%)" }}
                  >
                    <div className="relative flex items-center justify-center">
                      <Rocket 
                        size={20} 
                        className="rotate-45" 
                        style={{ 
                          color: config.color,
                          filter: `drop-shadow(0 0 8px ${config.color})`
                        }} 
                      />
                      {/* Engine Glow */}
                      <div 
                        className="absolute top-1/2 -left-6 -translate-y-1/2 w-8 h-[2px] opacity-80"
                        style={{ background: `linear-gradient(to left, ${config.color}, transparent)` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex flex-col items-center gap-3 w-28 shrink-0">
                   <div className="size-20 rounded-full border border-primary/20 bg-primary/5 p-1 relative">
                      <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
                      <SmallPlanet 
                        type={movement.destination.type as PlanetType} 
                        seed={movement.destination.seed} 
                        className="size-full rounded-full overflow-hidden" 
                      />
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">{movement.destination.name}</span>
                      <span className="text-[7px] font-mono text-primary/40 uppercase mt-1 px-1.5 py-0.5 border border-primary/10">
                        {t("destination")}
                      </span>
                   </div>
                </div>
              </>
            );
          })()}
        </div>

          {/* Details Section */}
          <div className="border-t border-primary/10 pt-4 flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              {Object.entries(movement.fleet).map(([shipKey, count]) => {
                const shipImage = ASSET_PATHS[shipKey as keyof typeof ASSET_PATHS];
                return (
                  <div key={shipKey} className="group/ship relative flex items-center gap-4 bg-primary/5 border border-primary/10 p-2 min-w-40 hover:bg-primary/10 transition-colors">
                    <div className="size-12 bg-black/60 border border-primary/20 overflow-hidden shrink-0">
                      <img src={shipImage} alt={shipKey} className="size-full object-cover opacity-90 group-hover/ship:scale-110 group-hover/ship:opacity-100 transition-all" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-tight truncate text-primary/80">
                        {tu(`${shipKey}.name`)}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-mono text-primary/40 uppercase">Efectivos:</span>
                        <span className="text-xs font-mono font-black text-primary">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {movement.resources && Object.keys(movement.resources).length > 0 && (
              <div className="flex flex-col gap-3 pb-2">
                <div className="flex items-center gap-2 text-primary/40">
                  <div className="h-px flex-1 bg-primary/10" />
                  <span className="text-[9px] font-black uppercase tracking-widest px-2">Cargamento Detectado</span>
                  <div className="h-px w-8 bg-primary/10" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(movement.resources).map(([resKey, amount]) => {
                    const resIcons = { 
                      metal: { icon: Database, color: "#94a3b8" }, 
                      crystal: { icon: Gem, color: "#38bdf8" }, 
                      deuterium: { icon: Fuel, color: "#a855f7" } 
                    };
                    const resConfig = resIcons[resKey as keyof typeof resIcons];
                    const ResIcon = resConfig.icon;
                    return (
                      <div key={resKey} className="flex items-center gap-2.5 px-3 py-1.5 bg-primary/5 border border-primary/10">
                        <ResIcon size={12} style={{ color: resConfig.color }} />
                        <div className="flex flex-col">
                          <span className="text-[7px] font-mono text-primary/40 uppercase tracking-tighter leading-none mb-0.5">{resKey}</span>
                          <span className="text-[10px] font-mono font-bold text-foreground leading-none">{amount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function FleetMovements() {
  const t = useTranslations("dashboard.movements");
  const { fleetMovements } = useGameStore();
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col px-8 pt-8 pb-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="size-2 bg-primary shadow-glow" />
        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-primary">
          {t("title")}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="flex items-center gap-3 text-xs font-mono text-primary/40 uppercase tracking-[0.2em]">
          <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 border border-primary/20">
            {fleetMovements.length}
          </span> 
          {t("activeMissions")}
        </div>
      </div>

      <div className="flex-1 min-h-0 relative -mr-6 pr-6">
        <ScrollArea className="h-full pr-4 pb-4">
          {fleetMovements.length > 0 ? (
            <AccordionRoot defaultValue={[fleetMovements[0].id]} className="flex flex-col gap-2">
              {fleetMovements.map((movement) => (
                <MissionCard key={movement.id} movement={movement} currentTime={currentTime} mounted={mounted} />
              ))}
            </AccordionRoot>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-primary/30 gap-4">
              <div className="size-20 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center animate-spin-slow">
                 <Rocket size={32} className="opacity-50" />
              </div>
              <p className="font-mono text-sm uppercase tracking-widest">{t("noMovements")}</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
