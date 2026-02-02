

import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";
import { Frame } from "./Frame";

const buttonVariants = cva(
  [
    "group font-bold mb-2 relative px-8 py-2 cursor-pointer transition-all [&:hover_svg]:drop-shadow-xl outline-none",
    "[&>span]:relative [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:group-hover:text-shadow-lg",
  ],
  {
    variants: {
      variant: {
        default:
          "[--color-frame-1-stroke:var(--color-primary)]/70 [--color-frame-1-fill:var(--color-primary)]/10 [--color-frame-2-stroke:var(--color-primary)]/50 [--color-frame-2-fill:var(--color-primary)]/5 text-primary hover:text-shadow-glow hover:[--color-frame-1-stroke:var(--color-primary)] [&:hover_svg]:drop-shadow-[0_0_15px_rgba(20,160,230,0.6)]",
        accent:
          "[--color-frame-1-stroke:var(--color-accent)]/70 [--color-frame-1-fill:var(--color-accent)]/10 [--color-frame-2-stroke:var(--color-accent)]/50 [--color-frame-2-fill:var(--color-accent)]/5 text-accent hover:text-shadow-glow-accent hover:[--color-frame-1-stroke:var(--color-accent)] [&:hover_svg]:drop-shadow-[0_0_15px_rgba(202,65,34,0.6)]",
        destructive:
          "[--color-frame-1-stroke:var(--color-destructive)]/70 [--color-frame-1-fill:var(--color-destructive)]/10 [--color-frame-2-stroke:var(--color-destructive)]/50 [--color-frame-2-fill:var(--color-destructive)]/5 text-destructive hover:[--color-frame-1-stroke:var(--color-destructive)] [&:hover_svg]:drop-shadow-[0_0_15px_rgba(255,42,109,0.6)]",
        secondary:
          "[--color-frame-1-stroke:var(--color-secondary)]/70 [--color-frame-1-fill:var(--color-secondary)]/10 [--color-frame-2-stroke:var(--color-secondary)]/50 [--color-frame-2-fill:var(--color-secondary)]/5 text-secondary-foreground hover:[--color-frame-1-stroke:var(--color-secondary)] [&:hover_svg]:drop-shadow-[0_0_15px_rgba(0,86,122,0.6)]",
        success:
          "[--color-frame-1-stroke:var(--color-success)]/70 [--color-frame-1-fill:var(--color-success)]/10 [--color-frame-2-stroke:var(--color-success)]/50 [--color-frame-2-fill:var(--color-success)]/5 text-success hover:[--color-frame-1-stroke:var(--color-success)] [&:hover_svg]:drop-shadow-[0_0_15px_rgba(0,255,159,0.6)]",
      },
      shape: {
        default: "",
        flat: "[--color-frame-2-stroke:transparent] [--color-frame-2-fill:transparent]",
        simple: "ps-8 pe-6",
        "tab-left": "",
        "tab-center": "",
        "tab-right": "",
      },
      size: {
        default: "h-10 px-8 py-2 text-sm",
        sm: "h-8 px-4 text-xs",
        lg: "h-14 px-10 text-lg",
        xl: "h-16 px-12 text-xl",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  children,
  variant = "default",
  shape = "default",
  size = "default",
  customPaths,
  enableViewBox,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    customPaths?: string[];
    enableViewBox?: boolean;
  }) {
  return (
    <button
      {...props}
      className={twMerge(buttonVariants({ variant, shape, size, className }))}
    >
      <div className="absolute inset-0 -mb-2">
        {!customPaths && (shape == "default" || shape == "flat") && (
          <Frame
            enableViewBox={enableViewBox}
            paths={JSON.parse(
              '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","17","0"],["L","100% - 7","0"],["L","100% + 0","0% + 9.5"],["L","100% - 18","100% - 6"],["L","4","100% - 6"],["L","0","100% - 15"],["L","17","0"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","9","100% - 6"],["L","100% - 22","100% - 6"],["L","100% - 25","100% + 0"],["L","12","100% + 0"],["L","9","100% - 6"]]}]'
            )}
          />
        )}
        {!customPaths && shape == "simple" && (
          <Frame
            enableViewBox={enableViewBox}
            paths={JSON.parse(
              '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","17","0"],["L","100% - 0","0"],["L","100% - 0","100% - 6"],["L","0% + 3","100% - 6"],["L","0% - 0","100% - 16"],["L","17","0"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","8","100% - 6"],["L","100% - 5","100% - 6"],["L","100% - 7","100% - 0"],["L","10","100% - 0"],["L","8","100% - 6"]]}]'
            )}
          />
        )}
        {customPaths?.map((customPath, customPathKey) => {
          return <Frame key={customPathKey} paths={JSON.parse(customPath)} enableViewBox={enableViewBox} />;
        })}
      </div>
      <span>{children}</span>
    </button>
  );
}

export { Button };
                