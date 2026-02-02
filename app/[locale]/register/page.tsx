"use client";

import { RegisterForm } from "@/components/ui/RegisterForm";
import { Card } from "@/components/ui/Card";
import { Frame } from "@/components/ui/Frame";
import { Button } from "@/components/ui/Button";
import { Rocket } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-black text-foreground font-mono">
      {/* Background Effects - Same as landing */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14a0e610_1px,transparent_1px),linear-gradient(to_bottom,#14a0e610_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,160,230,0.15),transparent_70%)] opacity-40" />
        <div className="scanline" />
      </div>

      {/* Navbar - Same as landing */}
      <nav className="relative z-50">
        <div className="absolute inset-0 -z-10 [&>svg]:drop-shadow-[0_0px_20px_var(--color-primary)] [--color-frame-1-stroke:var(--color-primary)] [--color-frame-1-fill:var(--color-primary)]/20 [--color-frame-2-stroke:var(--color-primary)] [--color-frame-2-fill:transparent] [--color-frame-3-stroke:var(--color-accent)] [--color-frame-3-fill:var(--color-accent)]/50">
          <Frame
            paths={JSON.parse(
              '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","0% + 34","7"],["L","0% + 79.5","7"],["L","0% + 96.5","13"],["L","100% - 21.5","13"],["L","100% + 0","34"],["L","100% - 13","100% - 15"],["L","100% - 26","100% - 6"],["L","0% + 11.5","100% - 6"],["L","0","100% - 18"],["L","13","0% + 28"],["L","34","7"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","18","100% - 6"],["L","100% - 33.5","100% - 6"],["L","100% - 39.5","100% - 0"],["L","24","100% + 0"],["L","18","100% - 6"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-3-stroke)","fill":"var(--color-frame-3-fill)"},"path":[["M","17","7"],["L","0% + 26.5","7"],["L","0% + 12.5","0% + 20"],["L","13","0% + 11"],["L","17","7"]]}]'
            )}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 border border-primary rounded flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary uppercase tracking-wider">
                  Space Conquerors
                </h1>
                <p className="text-[10px] text-primary/50 uppercase tracking-widest">
                  Galactic Domination
                </p>
              </div>
            </Link>

            {/* Back Button */}
            <Link href="/">
              <Button variant="secondary" size="sm">
                ← {t('auth.back')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-150px)] py-8 px-4">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <RegisterForm />
          </Card>
          
          {/* Login Link */}
          <div className="text-center">
            <p className="text-xs text-foreground/50 font-mono uppercase tracking-wider mb-3">
              {t('auth.register.hasAccount')}
            </p>
            <Link 
              href="/login"
              className="text-sm text-primary hover:text-primary/80 transition-colors font-mono uppercase tracking-wider"
            >
              {t('auth.register.login')} →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
