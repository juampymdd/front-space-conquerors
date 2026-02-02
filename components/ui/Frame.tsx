
'use client'
import { useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { type Paths, setupSvgRenderer } from "@left4code/svg-renderer";

function Frame({
  className,
  paths,
  enableBackdropBlur,
  enableViewBox,
  ...props
}: {
  paths: Paths;
  enableBackdropBlur?: boolean;
  enableViewBox?: boolean;
} & React.ComponentProps<"svg">) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && svgRef.current.parentElement) {
      const instance = setupSvgRenderer({
        el: svgRef.current,
        paths,
      });

      return () => instance.destroy();
    }
  }, [paths]);

  return (
    <svg
      {...props}
      className={twMerge([
        "absolute inset-0 size-full",
        enableBackdropBlur && "backdrop-blur-md",
        className,
      ])}
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      viewBox={enableViewBox ? "0 0 100 100" : undefined}
    />
  );
}

export { Frame };
