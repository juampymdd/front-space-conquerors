
"use client";

import React, { useState } from "react";
import { Frame } from "@/components/ui/Frame";
import { twMerge } from "tailwind-merge";
import { UpgradeItem } from "./UpgradeItem";
import { Rocket, Microscope, Shield, Globe } from "lucide-react";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { 
  DialogRoot, 
  DialogBackdrop, 
  DialogPositioner, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogCloseTrigger,
  Portal 
} from "@/components/ui/Dialog";
import type { PlanetType } from "@/planet-engine/types/planet.types";
import { useTranslations } from "next-intl";

// Real paths based on generation and copying to public/assets
const ASSET_PATHS = {
  // Fleets
  CazaLigero: "/assets/caza_ligero_asset_1770053976337.png",
  CruceroPesado: "/assets/crucero_pesado_asset_1770053991074.png",
  NaveCarga: "/assets/nave_carga_asset_1770054004940.png",
  SondaEspionaje: "/assets/sonda_espionaje_asset_1770054019808.png",
  Reciclador: "/assets/reciclador_asset_1770054034032.png",
  Destructor: "/assets/destructor_asset_1770054050196.png",
  SateliteSolar: "/assets/satelite_solar_asset_1770054063508.png",
  NaveBatalla: "/assets/nave_batalla_asset_1770054078546.png",
  // Techs
  TechEnergia: "/assets/tech_energia_asset_1770054105882.png",
  TechLaser: "/assets/tech_laser_asset_1770054119808.png",
  TechMotores: "/assets/tech_motores_asset_1770054134914.png",
  TechIones: "/assets/tech_iones_asset_1770054149545.png",
  TechHiperespacio: "/assets/tech_hiperespacio_asset_1770054165187.png",
  TechPlasma: "/assets/tech_plasma_asset_1770054178871.png",
  // Generics
  GenericFleet: "/assets/fleet_item_preview_1770053767921.png",
  GenericTech: "/assets/tech_item_preview_1770053782933.png",
  GenericDefense: "/assets/defense_item_preview_1770053798026.png",
};

const UPGRADES = {
  fleet: [
    { key: "cazaLigero", level: 12, image: ASSET_PATHS.CazaLigero },
    { key: "cruceroPesado", level: 4, image: ASSET_PATHS.CruceroPesado },
    { key: "naveCarga", level: 8, image: ASSET_PATHS.NaveCarga },
    { key: "sondaEspionaje", level: 25, image: ASSET_PATHS.SondaEspionaje },
    { key: "reciclador", level: 10, image: ASSET_PATHS.Reciclador },
    { key: "destructor", level: 2, image: ASSET_PATHS.Destructor },
    { key: "sateliteSolar", level: 45, image: ASSET_PATHS.SateliteSolar },
    { key: "naveBatalla", level: 6, image: ASSET_PATHS.NaveBatalla },
  ],
  techs: [
    { key: "techEnergia", level: 15, image: ASSET_PATHS.TechEnergia },
    { key: "techLaser", level: 10, image: ASSET_PATHS.TechLaser },
    { key: "techMotores", level: 12, image: ASSET_PATHS.TechMotores },
    { key: "techIones", level: 8, image: ASSET_PATHS.TechIones },
    { key: "techHiperespacio", level: 5, image: ASSET_PATHS.TechHiperespacio },
    { key: "techPlasma", level: 3, image: ASSET_PATHS.TechPlasma },
    { key: "researchNetwork", level: 4, image: ASSET_PATHS.GenericTech },
    { key: "astrophysics", level: 11, image: ASSET_PATHS.GenericTech },
  ],
  defenses: [
    { key: "missileLauncher", level: 150, image: ASSET_PATHS.GenericDefense },
    { key: "smallLaser", level: 80, image: ASSET_PATHS.GenericDefense },
    { key: "largeLaser", level: 40, image: ASSET_PATHS.GenericDefense },
    { key: "gaussCannon", level: 15, image: ASSET_PATHS.GenericDefense },
    { key: "ionCannon", level: 25, image: ASSET_PATHS.GenericDefense },
    { key: "plasmaCannon", level: 5, image: ASSET_PATHS.GenericDefense },
    { key: "smallShield", level: 1, image: ASSET_PATHS.GenericDefense },
    { key: "largeShield", level: 1, image: ASSET_PATHS.GenericDefense },
  ],
};

import { SolarSystemView } from "./SolarSystemView";

interface Planet {
  id: string;
  name: string;
  type: PlanetType;
  seed: number;
}

interface ManagementHubProps {
  selectedPlanet: Planet;
}

export function ManagementHub({ selectedPlanet }: ManagementHubProps) {
  const t = useTranslations("dashboard");
  const [selectedItem, setSelectedItem] = useState<{
    key: string;
    tab: string;
    image: string;
  } | null>(null);

  return (
    <div className="flex flex-col h-full">
      <TabsRoot defaultValue="planet" className="flex-1 flex flex-col min-h-0 gap-0">
        <TabsList className="px-0 relative z-20">
          <TabsTrigger value="planet">
            {t("tabs.planetView")}
          </TabsTrigger>
          <TabsTrigger value="solar">
            {t("tabs.solarSystem")}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 relative -mt-0.5">
          <TabsContent value="planet" className="h-full mt-0 pt-10 flex flex-col">
            <TabsRoot defaultValue="fleet" className="h-full flex flex-col">
              <div className="flex flex-1 gap-8 min-h-0">
                {/* Sub-navigation (Trapezoidal Tabs on the left) */}
                <TabsList className="w-48 flex flex-col gap-3 px-0 border-none shrink-0">
                  <TabsTrigger 
                    value="fleet"
                    className="w-full justify-start gap-4 h-auto py-5 px-6 data-[selected]:border-primary"
                  >
                    <Rocket size={18} className="shrink-0" />
                    <span className="text-sm font-bold uppercase tracking-widest text-left">{t("categories.fleet")}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="techs"
                    className="w-full justify-start gap-4 h-auto py-5 px-6 data-[selected]:border-primary"
                  >
                    <Microscope size={18} className="shrink-0" />
                    <span className="text-sm font-bold uppercase tracking-widest text-left">{t("categories.techs")}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="defenses"
                    className="w-full justify-start gap-4 h-auto py-5 px-6 data-[selected]:border-primary"
                  >
                    <Shield size={18} className="shrink-0" />
                    <span className="text-sm font-bold uppercase tracking-widest text-left">{t("categories.defenses")}</span>
                  </TabsTrigger>
                  
                  <div className="flex-1" />
                  
                  <div className="p-4 border border-orange-500/20 bg-orange-500/5 mr-4">
                    <div className="text-[10px] font-mono text-orange-500/60 uppercase tracking-widest mb-2">{t("buildQueue.title")}</div>
                    <div className="text-xs font-bold text-orange-500">{t("buildQueue.status")}</div>
                  </div>
                </TabsList>

                {/* Upgrade Grid Contained in Sub-TabsContent */}
                <div className="flex-1 min-h-0 relative">
                  {(Object.keys(UPGRADES) as Array<keyof typeof UPGRADES>).map((tab) => (
                    <TabsContent 
                      key={tab} 
                      value={tab} 
                      className="h-full mt-0 px-8 pt-8 pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent overflow-y-auto"
                    >
                      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4 pb-8">
                        {UPGRADES[tab].map((item, idx) => (
                          <UpgradeItem 
                            key={idx} 
                            name={t(`upgrades.${tab}.${item.key}.name`)} 
                            level={item.level} 
                            imageUrl={item.image}
                            onInfoClick={() => setSelectedItem({ ...item, tab })}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </div>
            </TabsRoot>
          </TabsContent>

          <TabsContent value="solar" className="h-full mt-0 overflow-hidden relative px-4 pb-4">
            <div className="absolute inset-0 z-0">
              <Frame
                paths={JSON.parse(
                  '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-primary)/20","fill":"var(--color-primary)/5"},"path":[["M","20","0"],["L","100% - 20","0"],["L","100%","20"],["L","100%","100% - 20"],["L","100% - 20","100%"],["L","20","100%"],["L","0","100% - 20"],["L","0","20"],["Z"]]}]'
                )}
              />
            </div>
            
            <div className="relative h-full w-full overflow-hidden">
               <SolarSystemView 
                seed={selectedPlanet.seed} 
                selectedPlanetId={`planet-${selectedPlanet.seed}`}
                className="absolute inset-0 size-full" 
              />
              
              <div className="absolute top-8 left-8 z-10 p-5 bg-background/60 backdrop-blur-xl border border-primary/20 pointer-events-none skew-x-[-10deg]">
                <div className="skew-x-[10deg]">
                  <h3 className="text-xl font-black text-primary uppercase tracking-[0.2em]">{selectedPlanet.name} System</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="size-1.5 bg-primary animate-pulse" />
                    <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">
                      {t("solarView.overlayTitle")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </TabsRoot>

      <DialogRoot 
        open={!!selectedItem} 
        onOpenChange={(details) => !details.open && setSelectedItem(null)}
      >
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent className="max-w-2xl">
              {selectedItem && (
                <div className="space-y-6">
                  <div className="relative h-64 w-full overflow-hidden border border-primary/20 bg-black/40">
                    <img 
                      src={selectedItem.image} 
                      alt={t(`upgrades.${selectedItem.tab}.${selectedItem.key}.name`)}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
                  </div>
                  
                  <div className="space-y-4">
                    <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase text-primary">
                      {t(`upgrades.${selectedItem.tab}.${selectedItem.key}.name`)}
                    </DialogTitle>
                    <div className="h-px w-full bg-primary/20" />
                    <DialogDescription className="text-lg text-primary/80 leading-relaxed font-mono">
                      {t(`upgrades.${selectedItem.tab}.${selectedItem.key}.description`)}
                    </DialogDescription>
                  </div>
                </div>
              )}
              <DialogCloseTrigger />
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </div>
  );
}
