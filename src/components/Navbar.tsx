'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { afterLangSwitch } from '@/lib/achievements';
import { Logo, Icon } from './Icons';

const LINKS = [
  { href: '/learn', key: 'nav.learn' as const },
  { href: '/simulator', key: 'nav.simulator' as const },
  { href: '/arena', key: 'nav.arena' as const },
  { href: '/dashboard', key: 'nav.dashboard' as const },
  { href: '/tools', key: 'nav.tools' as const },
  { href: '/glossary', key: 'nav.glossary' as const },
];

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/[0.07] shadow-card' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 focus-ring rounded-xl">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-[17px] font-bold tracking-tight">
              TIGERFX <span className="text-gold-400">Academy</span>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-mist-400">
              Trading Mastery
            </div>
          </div>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-xl px-3.5 py-2 text-[13.5px] font-medium transition-colors focus-ring ${
                  active ? 'text-gold-300' : 'text-mist-200 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {t(l.key)}
                {active && <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-gold-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          {/* language toggle */}
          <div className="flex items-center rounded-full border border-white/[0.12] bg-white/[0.04] p-1" role="group" aria-label="Language">
            <button
              onClick={() => {
                if (lang !== 'ms') {
                  setLang('ms');
                  afterLangSwitch('ms');
                }
              }}
              className={`focus-ring rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                lang === 'ms' ? 'bg-gold-400 text-ink-950 shadow-glow' : 'text-mist-300 hover:text-white'
              }`}
              aria-pressed={lang === 'ms'}
            >
              🇲🇾 BM
            </button>
            <button
              onClick={() => {
                if (lang !== 'en') {
                  setLang('en');
                  afterLangSwitch('en');
                }
              }}
              className={`focus-ring rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                lang === 'en' ? 'bg-gold-400 text-ink-950 shadow-glow' : 'text-mist-300 hover:text-white'
              }`}
              aria-pressed={lang === 'en'}
            >
              🇬🇧 EN
            </button>
          </div>

          <Link href="/learn" className="btn-primary hidden !py-2.5 !px-4 text-[13px] sm:inline-flex">
            {t('cta.start')}
          </Link>

          <button
            className="focus-ring rounded-xl border border-white/[0.12] p-2.5 text-mist-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t('nav.menu')}
            aria-expanded={open}
          >
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="glass border-t border-white/[0.07] lg:hidden animate-fade-in">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    active ? 'bg-gold-400/[0.12] text-gold-300' : 'text-mist-200 hover:bg-white/[0.05]'
                  }`}
                >
                  {t(l.key)}
                </Link>
              );
            })}
            <Link href="/broker" className="rounded-xl px-4 py-3 text-sm font-medium text-mist-200 hover:bg-white/[0.05]">
              {t('nav.broker')}
            </Link>
            <Link href="/learn" className="btn-primary mt-2">
              {t('cta.start')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
