
import React from "react";
import { Frame } from "@/components/ui/Frame";
import { twMerge } from "tailwind-merge";

interface UpgradeItemProps {
  name: string;
  level: number;
  imageUrl?: string;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

export function UpgradeItem({ name, level, imageUrl, onIncrease, onDecrease }: UpgradeItemProps) {
  return (
    <div className="relative group overflow-hidden flex flex-col h-full">
      <div className="absolute inset-0 -z-10">
        <Frame
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-primary)/30","fill":"var(--color-primary)/5"},"path":[["M","10","0"],["L","100% - 10","0"],["L","100%","10"],["L","100%","100%"],["L","10","100%"],["L","0","100% - 10"],["L","0","0% + 10"],["Z"]]}]'
          )}
        />
      </div>
      
      {/* Image Header */}
      {imageUrl && (
        <div className="h-28 w-full relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-700 scale-110 group-hover:scale-100 grayscale-[0.5] group-hover:grayscale-0"
          />
          <div className="absolute bottom-0 left-0 w-full h-px bg-primary/20 shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)]" />
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 size-8 border-t border-r border-primary/40 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="text-center space-y-1">
          <h4 className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.2em] leading-none">{name}</h4>
          <div className="text-xl font-black font-mono tracking-tighter text-shadow-glow text-primary truncate">
            {level.toString().padStart(4, '0')}
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-3 px-1">
          <button 
            onClick={onDecrease}
            className="size-7 border border-primary/20 bg-primary/5 flex items-center justify-center text-primary/50 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all text-sm font-bold skew-x-[-15deg]"
          >
            <span className="skew-x-[15deg]">-</span>
          </button>
          
          <div className="flex-1 h-5 bg-primary/10 relative overflow-hidden flex items-center justify-center border border-primary/5">
            <span className="text-[10px] font-mono text-primary font-bold relative z-10">{level}</span>
            <div 
              className="absolute inset-y-0 left-0 bg-primary/30 transition-all duration-700 ease-out" 
              style={{ width: `${Math.min((level / 50) * 100, 100)}%` }} 
            />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(var(--color-primary-rgb),0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite]" />
          </div>
          
          <button 
            onClick={onIncrease}
            className="size-7 border border-primary/20 bg-primary/5 flex items-center justify-center text-primary/50 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all text-sm font-bold skew-x-[-15deg]"
          >
            <span className="skew-x-[15deg]">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
