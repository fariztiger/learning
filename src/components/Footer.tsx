'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { Logo } from './Icons';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-20 border-t border-white/[0.07] bg-ink-900/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="w-10 h-10" />
              <div className="font-display text-lg font-bold">
                TIGERFX <span className="text-gold-400">Academy</span>
              </div>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist-300">{t('footer.tagline')}</p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-mist-400">{t('footer.education')}</p>
          </div>
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist-400">
              {t('nav.learn')}
            </div>
            <ul className="space-y-2 text-sm text-mist-300">
              <li><Link className="hover:text-gold-300 transition" href="/learn">{t('learn.title')}</Link></li>
              <li><Link className="hover:text-gold-300 transition" href="/simulator">{t('nav.simulator')}</Link></li>
              <li><Link className="hover:text-gold-300 transition" href="/arena">{t('nav.arena')}</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist-400">
              {t('nav.tools')}
            </div>
            <ul className="space-y-2 text-sm text-mist-300">
              <li><Link className="hover:text-gold-300 transition" href="/tools">{t('tools.risk')}</Link></li>
              <li><Link className="hover:text-gold-300 transition" href="/tools">{t('tools.sessions')}</Link></li>
              <li><Link className="hover:text-gold-300 transition" href="/glossary">{t('glossary.title')}</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist-400">
              {t('nav.broker')}
            </div>
            <ul className="space-y-2 text-sm text-mist-300">
              <li><Link className="hover:text-gold-300 transition" href="/broker">{t('broker.register')}</Link></li>
              <li><Link className="hover:text-gold-300 transition" href="/dashboard">{t('nav.dashboard')}</Link></li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-mist-400">{t('home.risk.body')}</p>
          </div>
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist-400">
              {t('nav.contact')}
            </div>
            <ul className="space-y-2 text-sm text-mist-300">
              <li>
                <Link className="hover:text-gold-300 transition" href="/about">{t('nav.about')}</Link>
              </li>
              <li>
                <a className="hover:text-gold-300 transition" href="mailto:tigerhyip@gmail.com">tigerhyip@gmail.com</a>
              </li>
              <li>
                <a className="hover:text-gold-300 transition" href="https://t.me/fariztiger" target="_blank" rel="noopener noreferrer">Telegram @fariztiger</a>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-mist-400">{t('about.cta')}</p>
          </div>
        </div>
        <div className="divider my-8" />
        <div className="flex flex-col gap-2 text-xs text-mist-400 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} TIGERFX Academy. {t('footer.rights')}</div>
          <div className="flex items-center gap-3">
            <span className="chip !text-[10px]">{t('common.simulated')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
