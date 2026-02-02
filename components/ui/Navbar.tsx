import React from "react";
import { Frame } from "./Frame";
import { Button } from "./Button";
import { 
  MenuRoot, 
  MenuTrigger, 
  MenuPositioner, 
  MenuContent, 
  MenuItem 
} from "./Menu";
import { ResourceHUD } from "./ResourceHUD";
import { User, Terminal, Zap, Activity, Rocket, Settings, LogOut } from "lucide-react";
import { useTranslations } from 'next-intl';

export function Navbar() {
  const t = useTranslations("dashboard.navbar");
  const ts = useTranslations("dashboard.status");

  return (
    <nav className="relative h-28 w-full flex items-center px-6 z-50">
      {/* Background Frame (Landing style) */}
      <div className="absolute inset-0 -z-10 [&>svg]:drop-shadow-[0_0px_20px_var(--color-primary)] [--color-frame-1-stroke:var(--color-primary)] [--color-frame-1-fill:var(--color-primary)]/20 [--color-frame-2-stroke:var(--color-primary)] [--color-frame-2-fill:transparent] [--color-frame-3-stroke:var(--color-accent)] [--color-frame-3-fill:var(--color-accent)]/50">
        <Frame
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","0% + 34","7"],["L","0% + 79.5","7"],["L","0% + 96.5","13"],["L","100% - 21.5","13"],["L","100% + 0","34"],["L","100% - 13","100% - 15"],["L","100% - 26","100% - 6"],["L","0% + 11.5","100% - 6"],["L","0","100% - 18"],["L","13","0% + 28"],["L","34","7"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","18","100% - 6"],["L","100% - 33.5","100% - 6"],["L","100% - 39.5","100% - 0"],["L","24","100% + 0"],["L","18","100% - 6"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-3-stroke)","fill":"var(--color-frame-3-fill)"},"path":[["M","17","7"],["L","0% + 26.5","7"],["L","0% + 12.5","0% + 20"],["L","13","0% + 11"],["L","17","7"]]}]'
          )}
        />
      </div>

      {/* Content */}
      <div className="w-full flex items-center relative z-10">
        {/* Brand (Landing style) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 border border-primary rounded flex items-center justify-center">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-primary uppercase tracking-wider leading-none">
              Space Conquerors
            </h1>
            <p className="text-[10px] text-primary/50 uppercase tracking-widest mt-1">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-primary/20 mx-6" />

        <div className="flex-1 px-8">
          <ResourceHUD />
        </div>

        <div className="flex-1" />

        {/* Navigation / Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex gap-1 mr-4">
            {["fleet", "map", "intel"].map((key) => (
              <Button key={key} variant="secondary" shape="flat" className="text-[10px] uppercase tracking-widest h-9 px-4">
                {t(`menu.${key}`)}
              </Button>
            ))}
          </div>

          <MenuRoot>
            <MenuTrigger asChild>
              <div className="flex items-center gap-3 pl-4 border-l border-primary/20 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-primary uppercase leading-none group-hover:text-shadow-glow transition-all">Cmdr. Juamp</div>
                  <div className="text-[10px] font-mono text-primary/40 uppercase leading-none mt-1.5 tracking-tighter">
                    {ts("level")} 42 // ALPHA
                  </div>
                </div>
                <div className="size-10 border border-primary/30 bg-primary/10 flex items-center justify-center group-hover:border-primary transition-colors">
                  <User className="size-5 text-primary" />
                </div>
              </div>
            </MenuTrigger>
            <MenuPositioner>
              <MenuContent className="min-w-[200px]">
                <MenuItem value="profile" className="gap-3 font-mono text-[10px] uppercase tracking-widest">
                  <User className="size-3.5" />
                  {t("userMenu.profile")}
                </MenuItem>
                <MenuItem value="settings" className="gap-3 font-mono text-[10px] uppercase tracking-widest">
                  <Settings className="size-3.5" />
                  {t("userMenu.settings")}
                </MenuItem>
                <div className="h-px bg-primary/20 my-1" />
                <MenuItem value="logout" className="gap-3 text-destructive font-mono text-[10px] uppercase tracking-widest">
                  <LogOut className="size-3.5" />
                  {t("userMenu.logout")}
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        </div>
      </div>
    </nav>
  );
}
