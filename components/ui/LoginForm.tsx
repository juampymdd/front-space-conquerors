import React from "react";
import { useRouter } from "next/navigation";
import { Frame } from "./Frame";
import { Button } from "./Button";
import { Input } from "./Input";
import { Terminal } from "lucide-react";
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, logic for authentication would go here
    router.push('/dashboard');
  };
  
  return (
    <div className="max-w-md w-full mx-auto relative group">
      {/* Background Decorative Frame */}
      <div className="absolute inset-x-4 -inset-y-4 -z-10 blur-xl bg-primary/5 group-hover:bg-primary/10 transition-colors" />
      
      <div className="relative p-10">
        <div className="absolute inset-0 -z-10">
          <Frame
            paths={JSON.parse(
              '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-primary)/40","fill":"transparent"},"path":[["M","20","0"],["L","100% - 20","0"],["L","100%","20"],["L","100%","100% - 20"],["L","100% - 20","100%"],["L","20","100%"],["L","0","100% - 20"],["L","0","20"],["Z"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-primary)/20","fill":"var(--color-primary)/5"},"path":[["M","0","30"],["L","10","40"],["L","10","60"],["L","0","70"]]}]'
            )}
          />
        </div>

        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center justify-center p-3 mb-4 relative">
             <Frame
               paths={JSON.parse('[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-primary)","fill":"transparent"},"path":[["M","0","0"],["L","100%","0"],["L","100%","100%"],["L","0","100%"],["Z"]]}]')}
               enableViewBox
             />
             <Terminal className="text-primary size-6" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-primary text-shadow-glow">{t('title')}</h2>
          {t('subtitle') && <p className="text-xs font-mono text-foreground/40 uppercase tracking-[0.2em]">{t('subtitle')}</p>}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-primary/60 ml-1">{t('commanderId')}</label>
              <Input placeholder={t('commanderIdPlaceholder')} type="text" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-primary/60">{t('password')}</label>
                <button className="text-[8px] font-mono uppercase text-foreground/30 hover:text-primary transition-colors">{t('forgotPassword')}</button>
              </div>
              <Input placeholder={t('passwordPlaceholder')} type="password" />
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full h-12 text-sm uppercase tracking-[0.2em]" variant="accent">
              <span>{t('submit')}</span>
            </Button>
          </div>

          {t('securedLine') && (
            <div className="flex items-center justify-center gap-2 pt-4 opacity-40">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-[9px] font-mono uppercase tracking-widest">{t('securedLine')}</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
