
import React from "react";
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ResourceHUD, ResourceData } from "@/components/ui/ResourceHUD";
import { Globe, Users, Shield, Zap } from "lucide-react";

interface PlanetCardProps {
  name: string;
  type: string;
  population: string;
  defense: string;
  energy: string;
  resources: ResourceData[];
}

export function PlanetCard({
  name,
  type,
  population,
  defense,
  energy,
  resources,
}: PlanetCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors group">
      <CardTitle className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-primary/20 bg-primary/5 rounded-sm group-hover:bg-primary/10 transition-colors">
            <Globe className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black italic tracking-tighter uppercase">{name}</h3>
            <p className="text-[10px] font-mono text-primary/40 uppercase tracking-widest">{type}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono text-primary/30 uppercase">Status</div>
          <div className="text-xs font-bold text-success uppercase leading-none">Colonized</div>
        </div>
      </CardTitle>
      
      <CardContent className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-foreground/40 uppercase">
              <Users size={12} /> Population
            </div>
            <div className="text-sm font-bold font-mono tracking-tight">{population}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-foreground/40 uppercase">
              <Shield size={12} /> Defense
            </div>
            <div className="text-sm font-bold font-mono tracking-tight text-success">{defense}</div>
          </div>
          <div className="space-y-1 col-span-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-foreground/40 uppercase">
              <Zap size={12} /> Power Grid
            </div>
            <div className="flex items-center gap-3">
                <div className="text-sm font-bold font-mono tracking-tight">{energy}</div>
                <div className="flex-1 h-1.5 bg-primary/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary shadow-glow w-3/4 animate-pulse" />
                </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-primary/10">
          <div className="text-[10px] font-mono text-primary/40 uppercase tracking-widest mb-3">Resource Output</div>
          <ResourceHUD resources={resources} />
        </div>
      </CardContent>

      <CardFooter className="mt-8 flex gap-3">
        <Button className="flex-1" shape="flat">Manage</Button>
        <Button variant="secondary" shape="flat" className="px-3">
          <Rocket className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

import { Rocket } from "lucide-react";
