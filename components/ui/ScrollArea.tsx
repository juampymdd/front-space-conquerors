import { twMerge } from "tailwind-merge";
import React from "react";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ScrollArea({ children, className, ...props }: ScrollAreaProps) {
  return (
    <div
      className={twMerge([
        "overflow-auto max-h-full w-full",
        // Scrollbar base
        "[&::-webkit-scrollbar]:w-1.5",
        "[&::-webkit-scrollbar]:h-1.5",
        // Track
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-track]:rounded-full",
        // Thumb
        "[&::-webkit-scrollbar-thumb]:bg-primary/20",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:shadow-[0_0_5px_rgba(0,0,0,0.5)]",
        // Hover stats
        "hover:[&::-webkit-scrollbar-thumb]:bg-primary/50",
        "hover:[&::-webkit-scrollbar-thumb]:shadow-[0_0_10px_var(--color-primary)]",
        // Firefox support
        "scrollbar-width-thin scrollbar-color-primary/20 transparent",
        className,
      ])}
      {...props}
    >
      {children}
    </div>
  );
}
