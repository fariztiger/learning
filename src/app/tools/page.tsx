'use client';

/* Trader toolkit page */

import { useLang } from '@/lib/i18n';
import { RiskCalculator, RRBuilder } from '@/components/learn/widgets/RiskTools';
import { SessionClock } from '@/components/learn/widgets/SessionClock';
import { NewsPlanner } from '@/components/learn/widgets/MtfLab';
import { Reveal } from '@/components/Reveal';
import { Icon } from '@/components/Icons';

export default function ToolsPage() {
  const { t, lang } = useLang();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <div className="chip mb-3">{lang === 'ms' ? 'ALAT' : 'TOOLS'}</div>
        <h1 className="h-display text-[clamp(2rem,4vw,2.9rem)]">{t('tools.title')}</h1>
        <p className="mt-3 max-w-2xl text-mist-300">
          {lang === 'ms'
            ? 'Semua alat yang anda perlukan untuk merancang dagangan dengan matematik — bukan perasaan.'
            : 'Everything you need to plan trades with maths — not feelings.'}
        </p>
      </Reveal>

      <div className="mt-8 space-y-6">
        <Reveal>
          <div id="risk">
            <RiskCalculator />
          </div>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <RRBuilder />
          </Reveal>
          <Reveal delay={80}>
            <SessionClock />
          </Reveal>
        </div>
        <Reveal>
          <NewsPlanner />
        </Reveal>

        <Reveal>
          <div className="card border-sky2/20 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky2/[0.12] text-sky2 flex items-center justify-center shrink-0">
                <Icon name="info" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">{t('tools.assumptions')}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mist-300">
                  {lang === 'ms'
                    ? 'Semua alat di halaman ini adalah untuk perancangan pendidikan. Angka diandaikan XAUUSD = 100 auns setiap lot standard, tanpa spread/komisen/gelinciran, dan pengiraan dibundarkan. Kontrak sebenar berbeza mengikut broker. Tiada alat di sini memberi nasihat kewangan atau menjamin hasil.'
                    : 'All tools on this page are for educational planning. Figures assume XAUUSD = 100 oz per standard lot, no spread/commission/slippage, and rounded outputs. Real contracts vary by broker. Nothing here is financial advice or a guarantee of results.'}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
