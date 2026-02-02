
"use client";

import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="scanline fixed inset-0 pointer-events-none z-50 opacity-[0.03]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-primary-rgb),0.1),transparent_70%)] pointer-events-none" />
      
      {/* Fixed Full-width Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      
      <div className="flex h-screen pt-24 overflow-hidden relative">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

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
            rgba(0, 255, 0, 0.06)
          );
          background-size: 100% 4px, 2px 100%;
        }
        .text-shadow-glow {
          text-shadow: 0 0 10px var(--color-primary), 0 0 20px var(--color-primary);
        }
        .shadow-glow {
            box-shadow: 0 0 10px var(--color-primary);
        }
      `}</style>
    </div>
  );
}
