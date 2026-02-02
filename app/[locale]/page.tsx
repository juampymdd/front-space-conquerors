"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Frame } from "@/components/ui/Frame";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { HeroPlanet } from "@/components/HeroPlanet";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Rocket, Shield, Globe, Menu, X, Terminal } from "lucide-react";
import { useTranslations } from 'next-intl';
import Link from "next/link";

export default function Page() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-foreground font-mono">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14a0e610_1px,transparent_1px),linear-gradient(to_bottom,#14a0e610_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,160,230,0.15),transparent_70%)] opacity-40" />
        <div className="scanline" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50">
        <div className="absolute inset-0 -z-10 [&>svg]:drop-shadow-[0_0px_20px_var(--color-primary)] [--color-frame-1-stroke:var(--color-primary)] [--color-frame-1-fill:var(--color-primary)]/20 [--color-frame-2-stroke:var(--color-primary)] [--color-frame-2-fill:transparent] [--color-frame-3-stroke:var(--color-accent)] [--color-frame-3-fill:var(--color-accent)]/50">
          <Frame
            paths={JSON.parse(
              '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","0% + 34","7"],["L","0% + 79.5","7"],["L","0% + 96.5","13"],["L","100% - 21.5","13"],["L","100% + 0","34"],["L","100% - 13","100% - 15"],["L","100% - 26","100% - 6"],["L","0% + 11.5","100% - 6"],["L","0","100% - 18"],["L","13","0% + 28"],["L","34","7"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","18","100% - 6"],["L","100% - 33.5","100% - 6"],["L","100% - 39.5","100% - 0"],["L","24","100% + 0"],["L","18","100% - 6"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-3-stroke)","fill":"var(--color-frame-3-fill)"},"path":[["M","17","7"],["L","0% + 26.5","7"],["L","0% + 12.5","0% + 20"],["L","13","0% + 11"],["L","17","7"]]}]'
            )}
          />
        </div>

        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex items-center gap-3">
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
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-primary/70 hover:text-primary transition-colors uppercase tracking-wider"
              >
                {t('nav.features')}
              </a>
              <a
                href="#gameplay"
                className="text-sm text-primary/70 hover:text-primary transition-colors uppercase tracking-wider"
              >
                {t('nav.gameplay')}
              </a>
              <a
                href="#universe"
                className="text-sm text-primary/70 hover:text-primary transition-colors uppercase tracking-wider"
              >
                {t('nav.universe')}
              </a>
              <LanguageSwitcher />
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="secondary" size="sm" className="hidden sm:flex">
                  <Terminal className="w-4 h-4 mr-2" />
                  {t('nav.dashboard')}
                </Button>
              </Link>
              <button 
                className="md:hidden text-primary p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-primary/20 z-50">
            <div className="container mx-auto px-6 py-6 space-y-4">
              <a
                href="#features"
                className="block text-sm text-primary/70 hover:text-primary transition-colors uppercase tracking-wider py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.features')}
              </a>
              <a
                href="#gameplay"
                className="block text-sm text-primary/70 hover:text-primary transition-colors uppercase tracking-wider py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.gameplay')}
              </a>
              <a
                href="#universe"
                className="block text-sm text-primary/70 hover:text-primary transition-colors uppercase tracking-wider py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.universe')}
              </a>
              <div className="pt-4 border-t border-primary/20">
                <LanguageSwitcher />
              </div>
              <div className="pt-4 space-y-3">
                <Link href="/dashboard" className="block">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Terminal className="w-4 h-4 mr-2" />
                    {t('nav.dashboard')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 md:pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Desktop: Side-by-side layout */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Content */}
            <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs tracking-widest uppercase animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {t('hero.badge')}
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-shadow-glow">
                {t('hero.title')}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-primary/70 max-w-xl leading-relaxed">
                {t('hero.description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 pt-4">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg w-full">
                    <Terminal className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    {t('hero.goToDashboard')}
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg w-full"
                  >
                    <Shield className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    {t('hero.learnMore')}
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 max-w-lg">
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    10K+
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-primary/50 uppercase tracking-wider">
                    {t('hero.stats.players')}
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    500+
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-primary/50 uppercase tracking-wider">
                    {t('hero.stats.planets')}
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    24/7
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-primary/50 uppercase tracking-wider">
                    {t('hero.stats.battles')}
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Planet - Shows below content on mobile, to the right on desktop */}
            <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-[600px] pointer-events-none">
              <HeroPlanet />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-shadow-glow mb-4">
              {t('features.title')}
            </h2>
            <p className="text-primary/60 max-w-xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
            {[
              {
                icon: Globe,
                titleKey: 'features.colonization.title',
                descKey: 'features.colonization.description',
              },
              {
                icon: Shield,
                titleKey: 'features.fleet.title',
                descKey: 'features.fleet.description',
              },
              {
                icon: Rocket,
                titleKey: 'features.research.title',
                descKey: 'features.research.description',
              },
            ].map((feature, i) => (
              <Card key={i}>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="mb-2">{t(feature.titleKey)}</CardTitle>
                <CardDescription className="text-sm">
                  {t(feature.descKey)}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/20 bg-black py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between opacity-50 text-xs font-mono uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span className="w-4 h-4 bg-primary rounded-full" />
            <span>{t('footer.copyright')}</span>
          </div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t('footer.contact')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}