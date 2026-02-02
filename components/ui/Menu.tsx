
import { twMerge } from "tailwind-merge";


import { ChevronDown } from "lucide-react";
import { Menu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import { Button } from "./Button";
import { Frame } from "./Frame";

import { useMemo } from "react";

function MenuRoot({
  children,
  ...rest
}: React.ComponentProps<typeof Menu.Root>) {
  return <Menu.Root {...rest}>{children}</Menu.Root>;
}

function MenuTrigger({
  children,
  className,
  asChild,
  ...rest
}: React.ComponentProps<typeof Menu.Trigger>) {
  return (
    <Menu.Trigger asChild {...rest}>
      {!asChild ? (
        <Button
          className={twMerge([
            "data-[state=open]:drop-shadow-[0_0px_20px_var(--color-primary)]",
            className,
          ])}
        >
          {children}
          <Menu.Indicator className="ms-auto transition-transform group-data-[state=open]:rotate-180">
            <ChevronDown className="size-4" />
          </Menu.Indicator>
        </Button>
      ) : (
        children
      )}
    </Menu.Trigger>
  );
}

function MenuPositioner({
  children,
  className,
  ...rest
}: React.ComponentProps<typeof Menu.Positioner>) {
  return (
    <Portal>
      <Menu.Positioner className={twMerge("z-[100000]", className)} style={{ zIndex: 100000 }} {...rest}>
        {children}
      </Menu.Positioner>
    </Portal>
  );
}

function MenuContent({
  children,
  className,
  ...rest
}: React.ComponentProps<typeof Menu.Content>) {
  const paths = useMemo(() => [
    {
      show: true,
      style: { strokeWidth: "1", stroke: "var(--color-frame-1-stroke)", fill: "var(--color-frame-1-fill)" },
      path: [["M", "14", "6"], ["L", "50% - 7", "6"], ["L", "50% - 2", "0"], ["L", "50% + 4", "0"], ["L", "50% + 9", "6"], ["L", "100% - 13", "6"], ["L", "100% + 0", "19"], ["L", "100% + 0", "100% - 26"], ["L", "100% - 13", "100% - 12"], ["L", "50% + 13", "100% - 12"], ["L", "50% - 0", "100% + 0"], ["L", "0% + 14", "100% + 0"], ["L", "0% + 0", "100% - 13"], ["L", "0", "0% + 19"], ["L", "14", "6"]]
    },
    {
      show: true,
      style: { strokeWidth: "1", stroke: "var(--color-accent)", fill: "var(--color-accent)" },
      path: [["M", "100% - 18", "100% - 10"], ["L", "100% - 26", "100% - 10"], ["L", "100% - 31", "100% - 4.5"], ["L", "100% - 23", "100% - 4.5"], ["L", "100% - 18", "100% - 10"]]
    },
    {
      show: true,
      style: { strokeWidth: "1", stroke: "var(--color-accent)", fill: "var(--color-accent)" },
      path: [["M", "100% - 31", "100% - 10"], ["L", "100% - 39", "100% - 10"], ["L", "100% - 44", "100% - 4.5"], ["L", "100% - 36", "100% - 4.5"], ["L", "100% - 31", "100% - 10"]]
    },
    {
      show: true,
      style: { strokeWidth: "1", stroke: "var(--color-accent)", fill: "var(--color-accent)" },
      path: [["M", "100% - 44", "100% - 10"], ["L", "100% - 52", "100% - 10"], ["L", "100% - 57", "100% - 4.5"], ["L", "100% - 49", "100% - 4.5"], ["L", "100% - 44", "100% - 10"]]
    }
  ] as any, []);

  return (
    <Menu.Content
      className={twMerge([
        "group relative min-w-(--reference-width) px-6 py-7 outline-none mt-4 backdrop-blur-xl",
        "[&[data-state='open']]:animate-in [&[data-state='open']]:zoom-in-80 [&[data-state='open']]:fade-in-0 [&[data-state='open']]:duration-200 [&[data-state='open'][data-placement='bottom-start']]:slide-in-from-top-2 [&[data-state='open'][data-placement='left-start']]:slide-in-from-right-2 [&[data-state='open'][data-placement='right-start']]:slide-in-from-left-2 [&[data-state='open'][data-placement='top-start']]:slide-in-from-bottom-2",
        "[&[data-state='closed']]:animate-out [&[data-state='closed']]:zoom-out-80 [&[data-state='closed']]:fade-out-0 [&[data-state='closed']]:duration-200",
        "z-[100000]",
        "[--color-frame-1-stroke:var(--color-primary)]",
        "[--color-frame-1-fill:var(--color-primary)]/10",
        "[--color-frame-2-stroke:var(--color-accent)]",
        className,
      ])}
      {...rest}
    >
      <div className="absolute inset-0 group-data-[placement=top-start]:scale-y-[-1]">
        <Frame
          paths={paths}
          enableBackdropBlur={true}
        />
      </div>
      <div className="relative flex flex-col gap-2.5">{children}</div>
    </Menu.Content>
  );
}

function MenuItem({
  children,
  className,
  asChild,
  ...rest
}: React.ComponentProps<typeof Menu.Item>) {
  return (
    <Menu.Item asChild {...rest}>
      {!asChild ? (
        <div
          className={twMerge([
            "cursor-pointer flex items-center -mx-3 px-4 py-2 border border-transparent hover:border-primary/40 hover:bg-primary/10 data-[highlighted]:border-primary/40 data-[highlighted]:bg-primary/10 transition-all duration-200 group/item outline-none",
            className,
          ])}
        >
          <div className="flex-1 flex items-center gap-3">
            {children}
          </div>
          <div className="size-1.5 bg-primary shadow-[0_0_8px_var(--color-primary)] transition-all opacity-0 group-hover/item:opacity-100" />
        </div>
      ) : (
        children
      )}
    </Menu.Item>
  );
}

function MenuItemGroup(props: React.ComponentProps<typeof Menu.ItemGroup>) {
  return <Menu.ItemGroup {...props} />;
}

function MenuItemGroupLabel(props: React.ComponentProps<typeof Menu.ItemGroupLabel>) {
  return <Menu.ItemGroupLabel {...props} />;
}

export { MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem, MenuItemGroup, MenuItemGroupLabel };
              