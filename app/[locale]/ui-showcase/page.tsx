
"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  CheckboxRoot,
  CheckboxControl,
  CheckboxLabel,
  CheckboxHiddenInput,
} from "@/components/ui/Checkbox";
import {
  RadioGroupRoot,
  RadioGroupLabel,
  RadioGroupItem,
  RadioItemText,
  RadioItemHiddenInput,
  RadioItemControl,
} from "@/components/ui/RadioGroup";
import {
  SwitchRoot,
  SwitchHiddenInput,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
} from "@/components/ui/Switch";
import {
  AlertRoot,
  AlertTitle,
  AlertDescription,
  AlertCloseTrigger,
} from "@/components/ui/Alert";
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/Tabs";
import {
  ComboboxRoot,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxPositioner,
  ComboboxContent,
  ComboboxItemGroup,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
} from "@/components/ui/Combobox";
import {
  MenuRoot,
  MenuTrigger,
  MenuPositioner,
  MenuContent,
  MenuItem,
} from "@/components/ui/Menu";
import {
  DialogRoot,
  DialogTrigger,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogCloseTrigger,
} from "@/components/ui/Dialog";
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Chart, getColor } from "@/components/ui/Chart";
import { Frame } from "@/components/ui/Frame";
import { Navbar } from "@/components/ui/Navbar";
import { Sidebar } from "@/components/ui/Sidebar";
import { LoginForm } from "@/components/ui/LoginForm";
import { ResourceHUD } from "@/components/ui/ResourceHUD";
import {
  createToaster,
  Toaster,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastCloseTrigger,
} from "@/components/ui/Toast";
import { createListCollection } from "@ark-ui/react/combobox";
import { 
  Search, Settings, User, LogOut, Info, AlertTriangle, 
  Terminal, Activity, Zap, Shield, Rocket, Globe
} from "lucide-react";
import { TextArea } from "@/components/ui/TextArea";

const toaster = createToaster({
  placement: "bottom-end",
  overlap: true,
  gap: 16,
});

export default function UIShowcasePage() {
  const combos = useMemo(() => createListCollection({
    items: ["Orion System", "Cygnus Loop", "Andromeda Galaxy", "Centauri Prime"],
  }), []);

  const notify = (type: "info" | "success" | "warning" | "error" = "info") => {
    toaster.create({
      title: `${type.toUpperCase()} TRANSMISSION`,
      description: "Atmospheric processors are running at peak efficiency.",
      type,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 space-y-16 relative overflow-hidden">
      {/* Visual Effects */}
      <div className="scanline fixed inset-0 pointer-events-none z-50 opacity-[0.03]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-primary-rgb),0.1),transparent_70%)] pointer-events-none" />

      <style jsx global>{`
        .scanline {
          background: linear-gradient(
            to bottom,
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.25) 50%
          ),
          linear-gradient(
            to right,
            rgba(255, 0, 0, 0.06),
            rgba(0, 255, 0, 0.02),
            rgba(0, 0, 255, 0.06)
          );
          background-size: 100% 4px, 2px 100%;
        }
        .text-shadow-glow {
          text-shadow: 0 0 10px var(--color-primary), 0 0 20px var(--color-primary);
        }
      `}</style>

      <Toaster toaster={toaster}>
        {(toast) => (
          <ToastRoot key={toast.id}>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
            <ToastCloseTrigger />
          </ToastRoot>
        )}
      </Toaster>

      <header className="space-y-4 border-b border-primary/20 pb-8 relative z-10">
        <h1 className="text-6xl font-black tracking-tighter text-shadow-glow uppercase italic text-primary">
          SYSTEM INTERFACE <span className="text-xs font-mono not-italic text-primary/50 align-top ml-2">v1.2.0</span>
        </h1>
        <p className="text-foreground/60 max-w-2xl text-lg font-mono leading-relaxed">
          {">"} BOOTING COMPONENT LIBRARY... <br />
          {">"} STABILIZING SVG FRAMES... <br />
          {">"} READY.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 space-y-2 sticky top-8 h-fit z-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 opacity-50">Modules</h2>
          {[
            "Layouts",
            "Game HUD",
            "Buttons",
            "Forms",
            "Inputs",
            "Selection",
            "Feedback & Overlays",
            "Navigation",
            "Data & Analytics",
          ].map((item) => (
            <button
              key={item}
              onClick={() => {
                const id = item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="block w-full text-left px-4 py-2 border-l-2 border-transparent hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-mono uppercase tracking-widest"
            >
              {item}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-3 space-y-32">
          {/* Layouts Section */}
          <section id="layouts" className="space-y-8">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter text-primary">Layouts</h2>
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Multi-functional Navbar</h3>
                <nav className="relative h-28 flex items-center">
                  <div className="absolute inset-0 -z-10 h-24 mt-2 [&>svg]:drop-shadow-[0_0px_20px_var(--color-primary)] [--color-frame-1-stroke:var(--color-primary)] [--color-frame-1-fill:var(--color-primary)]/20 [--color-frame-2-stroke:var(--color-primary)] [--color-frame-2-fill:transparent] [--color-frame-3-stroke:var(--color-accent)] [--color-frame-3-fill:var(--color-accent)]/50">
                    <Frame
                      paths={JSON.parse(
                        '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","0% + 34","7"],["L","0% + 79.5","7"],["L","0% + 96.5","13"],["L","100% - 21.5","13"],["L","100% + 0","34"],["L","100% - 13","100% - 15"],["L","100% - 26","100% - 6"],["L","0% + 11.5","100% - 6"],["L","0","100% - 18"],["L","13","0% + 28"],["L","34","7"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","18","100% - 6"],["L","100% - 33.5","100% - 6"],["L","100% - 39.5","100% - 0"],["L","24","100% + 0"],["L","18","100% - 6"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-3-stroke)","fill":"var(--color-frame-3-fill)"},"path":[["M","17","7"],["L","0% + 26.5","7"],["L","0% + 12.5","0% + 20"],["L","13","0% + 11"],["L","17","7"]]}]'
                      )}
                    />
                  </div>

                  <div className="w-full h-16 flex items-center relative z-10 px-6">
                    {/* Brand */}
                    <div className="flex items-center gap-4">
                      <div className="p-2 border border-primary/40 bg-primary/10 rounded-sm">
                        <Terminal className="size-5 text-primary text-shadow-glow" />
                      </div>
                      <h1 className="text-2xl font-black italic tracking-tighter text-primary text-shadow-glow uppercase">
                        COSMIC<span className="text-foreground">OS</span>
                      </h1>
                    </div>

                    <div className="h-8 w-[1px] bg-primary/20 mx-6" />

                    {/* HUD Elements */}
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                        <Zap size={14} className="text-primary animate-pulse" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-primary/40 leading-none uppercase">Reactor</span>
                          <span className="text-xs font-bold text-primary leading-none mt-1">100%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Activity size={14} className="text-success" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-success/40 leading-none uppercase">Shields</span>
                          <span className="text-xs font-bold text-success leading-none mt-1">NOMINAL</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1" />

                    {/* Navigation / Actions */}
                    <div className="flex items-center gap-3">
                      <div className="hidden md:flex gap-1 mr-4">
                        {["Fleet", "Map", "Intel"].map((item) => (
                          <Button key={item} variant="secondary" shape="flat" className="text-[10px] uppercase tracking-widest h-9 px-4">
                            {item}
                          </Button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pl-4 border-l border-primary/20">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-bold text-primary uppercase leading-none">Cmdr. Juamp</div>
                          <div className="text-[10px] font-mono text-primary/40 uppercase leading-none mt-1.5 tracking-tighter">LVL 42 // ALPHA</div>
                        </div>
                        <div className="size-10 border border-primary/30 bg-primary/10 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          <User className="size-5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Collapsible Sidebar</h3>
                <div className="h-[500px] border border-primary/10 flex bg-black/20 rounded-sm overflow-hidden">
                  <Sidebar />
                  <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-4">
                    <Globe className="size-16 text-primary/20 animate-spin-slow" />
                    <div className="text-xs font-mono text-primary/30 uppercase tracking-[0.3em]">Sector Mainframe Access</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Game HUD Section */}
          <section id="game-hud" className="space-y-8">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter text-primary">Game State HUD</h2>
            <div className="p-8 bg-primary/5 border border-primary/10">
              <ResourceHUD />
            </div>
          </section>

          {/* Buttons Section */}
          <section id="buttons" className="space-y-8">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter text-primary">Buttons</h2>
            <div className="grid gap-12">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Semantic States</h3>
                <div className="flex flex-wrap gap-6">
                  <Button variant="default">Primary Command</Button>
                  <Button variant="accent">High Energy</Button>
                  <Button variant="secondary">Auxiliary</Button>
                  <Button variant="success">Safe Mode</Button>
                  <Button variant="destructive">Critical Vent</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Procedural Shapes</h3>
                <div className="flex flex-wrap gap-6">
                  <Button shape="default">Industrial</Button>
                  <Button shape="simple">Minimalist</Button>
                  <Button shape="flat">Clean Cut</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Forms Section */}
          <section id="forms" className="space-y-12">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter text-primary">Authentication</h2>
            <div className="py-16 bg-primary/[0.02] border border-primary/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-primary/20 uppercase tracking-widest">Encrypting...</div>
               <LoginForm />
            </div>
          </section>

          {/* Inputs Section */}
          <section id="inputs" className="space-y-8">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter text-primary">Data Entry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Input Fields</h3>
                <div className="space-y-6">
                  <Input placeholder="TARGET COORDINATES..." />
                  <Input type="password" placeholder="BIOMETRIC KEY..." />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Log Entry</h3>
                <TextArea placeholder="TRANSMIT MESSAGE TO COMMAND..." rows={4} />
              </div>
            </div>
          </section>

          {/* Selection Section */}
          <section id="selection" className="space-y-8">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter text-primary">Toggles & Switches</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Checkbox</h3>
                <div className="space-y-4">
                  <CheckboxRoot>
                    <CheckboxControl />
                    <CheckboxLabel className="text-xs font-mono uppercase tracking-wider">Hull Shields</CheckboxLabel>
                    <CheckboxHiddenInput />
                  </CheckboxRoot>
                  <CheckboxRoot defaultChecked>
                    <CheckboxControl />
                    <CheckboxLabel className="text-xs font-mono uppercase tracking-wider">Life Support</CheckboxLabel>
                    <CheckboxHiddenInput />
                  </CheckboxRoot>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Radio Group</h3>
                <RadioGroupRoot defaultValue="ion">
                  <RadioGroupItem value="ion">
                    <RadioItemControl />
                    <RadioItemText className="text-xs font-mono uppercase">Ion Drive</RadioItemText>
                    <RadioItemHiddenInput />
                  </RadioGroupItem>
                  <RadioGroupItem value="warp">
                    <RadioItemControl />
                    <RadioItemText className="text-xs font-mono uppercase">Warp Core</RadioItemText>
                    <RadioItemHiddenInput />
                  </RadioGroupItem>
                </RadioGroupRoot>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Switch</h3>
                <div className="space-y-4">
                  <SwitchRoot defaultChecked>
                    <SwitchControl><SwitchThumb /></SwitchControl>
                    <SwitchLabel className="text-xs font-mono uppercase">Auto-Pilot</SwitchLabel>
                    <SwitchHiddenInput />
                  </SwitchRoot>
                  <SwitchRoot>
                    <SwitchControl><SwitchThumb /></SwitchControl>
                    <SwitchLabel className="text-xs font-mono uppercase">Invisibility</SwitchLabel>
                    <SwitchHiddenInput />
                  </SwitchRoot>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Section */}
          <section id="feedback-&-overlays" className="space-y-8">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter text-primary">Tactical Feedback</h2>
            
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// System Alerts</h3>
                <div className="grid gap-6 max-w-3xl">
                  <AlertRoot>
                    <AlertTitle className="gap-2 uppercase tracking-widest"><Info className="size-4" /> Comms Linked</AlertTitle>
                    <AlertDescription className="text-xs font-mono">Satellite array has established a secure handshake with the Orion constellation.</AlertDescription>
                    <AlertCloseTrigger />
                  </AlertRoot>
                  
                  <AlertRoot className="[--color-frame-1-stroke:var(--color-destructive)] [--color-frame-1-fill:var(--color-destructive)]/20">
                    <AlertTitle className="text-destructive gap-2 uppercase tracking-widest"><AlertTriangle className="size-4" /> Core Breach</AlertTitle>
                    <AlertDescription className="text-xs font-mono">Coolant levels dropping below 12%. Immediate intervention required.</AlertDescription>
                  </AlertRoot>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Interactive Notifications</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="accent" onClick={() => notify("info")}>Trigger Info</Button>
                  <Button variant="success" onClick={() => notify("success")}>Trigger Success</Button>
                  <Button variant="destructive" onClick={() => notify("error")}>Trigger Alert</Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-12 pt-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Critical Dialog</h3>
                  <DialogRoot>
                    <DialogTrigger asChild>
                      <Button variant="accent">System Purge</Button>
                    </DialogTrigger>
                    <DialogBackdrop />
                    <DialogPositioner>
                      <DialogContent>
                        <DialogTitle className="text-primary text-shadow-glow uppercase italic">Authorization Required</DialogTitle>
                        <DialogDescription className="mt-4 mb-8 font-mono text-xs opacity-60">
                          PROCEED WITH CAUTION. Initializing a system-wide purge will erase all local satellite telemetry. This action is irreversible.
                        </DialogDescription>
                        <div className="flex justify-end gap-3 pt-4">
                          <DialogCloseTrigger asChild>
                            <Button shape="flat">Abstain</Button>
                          </DialogCloseTrigger>
                          <Button variant="destructive">Execute Purge</Button>
                        </div>
                        <DialogCloseTrigger className="absolute top-4 right-4" />
                      </DialogContent>
                    </DialogPositioner>
                  </DialogRoot>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Dropdown Access</h3>
                  <MenuRoot>
                    <MenuTrigger asChild>
                      <Button variant="secondary">Terminal Utilities</Button>
                    </MenuTrigger>
                    <MenuPositioner>
                      <MenuContent>
                        <MenuItem value="edit" className="gap-3 font-mono text-[10px] uppercase"><Settings className="size-3" /> Root Config</MenuItem>
                        <MenuItem value="profile" className="gap-3 font-mono text-[10px] uppercase"><User className="size-3" /> Pilot ID</MenuItem>
                        <MenuItem value="logout" className="gap-3 text-destructive font-mono text-[10px] uppercase"><LogOut className="size-3" /> Terminate Link</MenuItem>
                      </MenuContent>
                    </MenuPositioner>
                  </MenuRoot>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Galactic Index</h3>
                  <ComboboxRoot collection={combos}>
                    <ComboboxControl>
                      <ComboboxTrigger />
                    </ComboboxControl>
                    <ComboboxPositioner>
                      <ComboboxContent>
                        <ComboboxInput />
                        <ComboboxItemGroup>
                          {combos.items.map((item) => (
                            <ComboboxItem key={item} item={item}>
                              <ComboboxItemText className="font-mono text-[10px] uppercase">{item}</ComboboxItemText>
                              <ComboboxItemIndicator />
                            </ComboboxItem>
                          ))}
                        </ComboboxItemGroup>
                      </ComboboxContent>
                    </ComboboxPositioner>
                  </ComboboxRoot>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Section */}
          <section id="navigation" className="space-y-12">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter text-primary">Terminal Navigation</h2>
            <div className="space-y-16">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Sub-system Tabs</h3>
                <TabsRoot defaultValue="system">
                  <TabsList>
                    <TabsTrigger value="system" className="font-mono text-[10px] uppercase">Telemetry</TabsTrigger>
                    <TabsTrigger value="cargo" className="font-mono text-[10px] uppercase">Cargo Manifest</TabsTrigger>
                    <TabsTrigger value="crew" className="font-mono text-[10px] uppercase">Crew Bio</TabsTrigger>
                  </TabsList>
                  <div className="mt-8">
                    <TabsContent value="system" className="min-h-32 p-8 bg-primary/5 border border-primary/10">
                      <div className="flex gap-4">
                         <Activity className="text-success animate-pulse" />
                         <div className="space-y-1">
                            <div className="text-[10px] font-mono uppercase text-primary/60">Core Integrity</div>
                            <div className="text-lg font-black italic text-success">98.4% STABLE</div>
                         </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="cargo" className="min-h-32 p-8 bg-primary/5 border border-primary/10 flex items-center justify-center opacity-30 italic font-mono text-xs">
                       Scanning for illicit materials...
                    </TabsContent>
                    <TabsContent value="crew" className="min-h-32 p-8 bg-primary/5 border border-primary/10">
                       <ul className="space-y-2 font-mono text-xs">
                          <li className="flex justify-between border-b border-primary/5 pb-1"><span>CMD. JUAMP</span> <span className="text-primary/60">ON DECK</span></li>
                          <li className="flex justify-between border-b border-primary/5 pb-1"><span>BOT. AX-42</span> <span className="text-success">MAINTENANCE</span></li>
                       </ul>
                    </TabsContent>
                  </div>
                </TabsRoot>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Technical Accordion</h3>
                <AccordionRoot defaultValue={['item-1']} collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="uppercase italic tracking-[0.1em]">Atmospheric specifications</AccordionTrigger>
                    <AccordionContent className="font-mono text-xs leading-relaxed opacity-70">
                      The current pressurized environment consists of 78% Nitrogen, 21% Oxygen, and trace amounts of Argon. Radiation shielding is active and performing within expected tolerances.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="uppercase italic tracking-[0.1em]">Propulsion schemas</AccordionTrigger>
                    <AccordionContent className="font-mono text-xs leading-relaxed opacity-70">
                      Utilizing high-efficiency vacuum-optimized plasma thrusters for sub-orbital maneuvers and localized orbital stabilization.
                    </AccordionContent>
                  </AccordionItem>
                </AccordionRoot>
              </div>
            </div>
          </section>

          {/* Data Section */}
          <section id="data-analytics" className="space-y-12">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter text-primary">Data Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// Resource Telemetry</h3>
                <div className="h-80 border border-primary/20 bg-black/40 p-6 relative overflow-hidden backdrop-blur-md">
                   <div className="absolute top-4 right-6 flex items-center gap-2">
                      <div className="size-2 bg-primary rounded-full animate-ping" />
                      <span className="text-[10px] font-mono text-primary uppercase">Live Sync</span>
                   </div>
                  <Chart
                    config={{
                      type: 'line',
                      data: {
                        labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
                        datasets: [
                          {
                            label: "Energy Production",
                            data: [65, 59, 80, 81, 56, 95],
                            borderColor: getColor("--color-primary") || "cyan",
                            backgroundColor: getColor("--color-primary", 0.1) || "rgba(0, 255, 255, 0.1)",
                            tension: 0.2,
                            fill: true,
                            pointRadius: 4,
                            pointBackgroundColor: getColor("--color-primary")
                          },
                        ],
                      },
                      options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { font: { family: 'monospace', size: 10 } } },
                          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { font: { family: 'monospace', size: 10 } } }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-mono text-primary/50 uppercase tracking-[0.2em]">// SVG Frame Engine</h3>
                <div className="h-80 relative group bg-black/20 overflow-hidden">
                  <Frame
                    paths={JSON.parse(
                      '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-primary)","fill":"transparent"},"path":[["M","20","0"],["L","100% - 20","0"],["L","100%","20"],["L","100%","100% - 20"],["L","100% - 20","100%"],["L","20","100%"],["L","0","100% - 20"],["L","0","20"],["Z"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-primary)","fill":"var(--color-primary)/10"},"path":[["M","100% - 15","15"],["L","100% - 5","15"],["L","100% - 10","20"],["L","100% - 15","20"]]}]'
                    )}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-xs font-mono opacity-40 uppercase tracking-[0.2em] leading-relaxed">
                    All components are constructed using the procedural SVG Frame engine for infinite scalability and consistent design tokens.
                    <div className="mt-6 p-3 border border-primary/20 bg-primary/5 text-primary text-[8px] tracking-tighter w-full line-clamp-2">
                       FRAME_PATH: [["M","20","0"],["L","100% - 20","0"],["L","100%","20"]...]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <footer className="pt-24 pb-12 border-t border-primary/20 text-center text-[10px] font-mono opacity-30 uppercase tracking-[0.5em] relative z-20">
        &copy; 2026 Space Conquerors Terminal // Powered by Ark UI
      </footer>
    </div>
  );
}
