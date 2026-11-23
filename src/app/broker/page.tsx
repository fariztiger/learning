'use client';

/* Optional broker registration — Valetax embed with lazy loading,
   referral disclosure, risk information and safe fallback. */

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { Reveal } from '@/components/Reveal';
import { Icon } from '@/components/Icons';

const IFRAME_SRC =
  'https://ma.valetax.com/embed/register/block?code=hH45rM8BFKetIFihM9x1vNpHhyUWZQEBI5buovZ16aZAsEnIJA%2FRoF5pzYXc74x%2FC3uNdOitzA8oi386TAMxcaLf3gq0e2GYsun0wrToL9LMT8zpQt%2BKeZB8jGbuxptQ&lang=en&background=default';

const FALLBACK_URL = 'https://ma.valetax.com/';

export default function BrokerPage() {
  const { t, lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  // Load third-party embed only when it scrolls near the viewport
  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // If the embed has not produced a frame within 8s, show fallback
  useEffect(() => {
    if (!visible || failed) return;
    const timer = setTimeout(() => {
      const iframe = holderRef.current?.querySelector('iframe');
      if (!iframe) setFailed(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [visible, failed]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <div className="chip border-gold-400/30 text-gold-200">
          {lang === 'ms' ? 'PILIHAN — BUKAN SYARAT' : 'OPTIONAL — NEVER REQUIRED'}
        </div>
        <h1 className="mt-3 h-display text-[clamp(2rem,4vw,2.9rem)] text-balance">{t('broker.title')}</h1>
        <p className="mt-3 max-w-2xl text-mist-300">{t('broker.sub')}</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 space-y-3">
          {[
            {
              icon: 'book',
              text: {
                en: 'All lessons, tools and the simulator remain 100% free without any account.',
                ms: 'Semua pelajaran, alat dan simulator kekal 100% percuma tanpa sebarang akaun.',
              },
            },
            {
              icon: 'shield',
              text: {
                en: 'We never collect or store broker credentials or documents — registration happens on Valetax\'s secure form.',
                ms: 'Kami tidak pernah mengumpul atau menyimpan kredensial atau dokumen broker — pendaftaran berlaku pada borang selamat Valetax.',
              },
            },
            {
              icon: 'target',
              text: {
                en: 'Learn first. Live trading involves substantial risk of loss — only trade with money you can afford to lose.',
                ms: 'Belajar dahulu. Dagangan langsung melibatkan risiko kerugian yang besar — hanya berdagang dengan wang yang anda mampu hilangkan.',
              },
            },
          ].map((row, i) => (
            <div key={i} className="card flex items-center gap-3.5 p-4">
              <div className="w-9 h-9 rounded-xl bg-gold-400/[0.12] text-gold-300 flex items-center justify-center shrink-0">
                <Icon name={row.icon} className="w-4.5 h-4.5" />
              </div>
              <p className="text-[13.5px] leading-relaxed text-mist-200">{lang === 'ms' ? row.text.ms : row.text.en}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* registration embed */}
      <Reveal delay={140}>
        <div ref={holderRef} className="card mt-8 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-white/[0.07] p-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 flex items-center justify-center font-display font-bold">
              V
            </div>
            <div>
              <div className="font-display text-[16px] font-bold">{t('broker.register')}</div>
              <div className="text-[11px] text-mist-400">
                {lang === 'ms'
                  ? 'Borang selamat hos Valetax — bukan di laman kami'
                  : 'Secure Valetax-hosted form — not on our site'}
              </div>
            </div>
          </div>

          <div className="p-2">
            {!visible ? (
              <div className="h-[220px] animate-pulse rounded-xl bg-white/[0.04]" />
            ) : failed ? (
              <div className="p-8 text-center">
                <Icon name="info" className="mx-auto w-8 h-8 text-gold-300" />
                <p className="mt-3 text-[13.5px] text-mist-300">{t('broker.fallback')}</p>
                <a
                  href={FALLBACK_URL}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="btn-primary mt-4"
                >
                  {t('broker.register')}
                  <Icon name="arrow-right" className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <iframe
                src={IFRAME_SRC}
                width="100%"
                height="490px"
                title="Valetax Registration"
                loading="lazy"
                onError={() => setFailed(true)}
                className="rounded-xl"
              />
            )}
          </div>

          <div className="px-5 pb-5">
            <a
              href={FALLBACK_URL}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="text-[11.5px] text-gold-300 underline underline-offset-2 hover:text-gold-200"
            >
              {lang === 'ms'
                ? 'Buka borang pendaftaran di laman Valetax secara langsung ↗'
                : 'Open the registration form directly on the Valetax website ↗'}
            </a>
          </div>
        </div>
      </Reveal>

      {/* disclosure + risk */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="card h-full border-gold-400/20 p-6">
            <div className="flex items-center gap-2 text-gold-300">
              <Icon name="info" className="w-5 h-5" />
              <h2 className="font-display text-[16px] font-bold">{t('broker.disclosure')}</h2>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-mist-300">{t('broker.disclosureBody')}</p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card h-full border-bear/25 p-6">
            <div className="flex items-center gap-2 text-bear">
              <Icon name="shield" className="w-5 h-5" />
              <h2 className="font-display text-[16px] font-bold">{t('broker.riskTitle')}</h2>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-mist-300">{t('home.risk.body')}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
