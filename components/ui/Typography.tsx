"use client";

import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText = ({ text, className }: GlitchTextProps) => {
  return (
    <span className={twMerge("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-70 animate-pulse translate-x-[2px] skew-x-12">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-70 animate-pulse -translate-x-[2px] -skew-x-12 animation-delay-75">
        {text}
      </span>
    </span>
  );
};

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export const TypewriterText = ({ text, delay = 50, className }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  return <span className={className}>{displayText}</span>;
};
