"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        // Replace the current locale in the pathname with the new one
        const segments = pathname.split('/');
        segments[1] = newLocale;
        const newPath = segments.join('/');
        router.push(newPath);
    };

    const localeLabels: Record<string, string> = {
        en: 'English',
        es: 'Español',
        zh: '中文',
        ko: '한국어',
        ja: '日本語',
        de: 'Deutsch'
    };

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 text-sm text-primary/70 hover:text-primary transition-colors uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>{localeLabels[locale] || locale.toUpperCase()}</span>
            </button>

            <div className="absolute top-full right-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-black/90 border border-primary/20 rounded overflow-hidden backdrop-blur-sm shadow-xl min-w-[120px]">
                    {routing.locales.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => switchLocale(loc)}
                            className={`block w-full px-4 py-2 text-left text-sm uppercase tracking-wider transition-colors ${locale === loc
                                ? 'bg-primary/20 text-primary'
                                : 'text-primary/70 hover:bg-primary/10 hover:text-primary'
                                }`}
                        >
                            {localeLabels[loc] || loc.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
