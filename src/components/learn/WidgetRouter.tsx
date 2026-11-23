'use client';

import type { Step } from '@/lib/types';
import { useLang } from '@/lib/i18n';
import { CandleAnatomyLab } from './widgets/CandleAnatomyLab';
import { RiskCalculator, RRBuilder } from './widgets/RiskTools';
import { SessionClock } from './widgets/SessionClock';
import { ClickGame, StructureBuilder } from './widgets/PracticeWidgets';
import { MtfLab, NewsPlanner } from './widgets/MtfLab';

type WidgetName = Extract<Step, { kind: 'widget' }>['widget'];

export function WidgetRouter({ widget, title, caption }: { widget: WidgetName; title: { en: string; ms: string }; caption: { en: string; ms: string } }) {
  const { L } = useLang();

  const header = (
    <div className="mb-4">
      <div className="chip-gold">{L(title)}</div>
      <p className="mt-2 text-[13.5px] text-mist-300">{L(caption)}</p>
    </div>
  );

  switch (widget) {
    case 'candle-anatomy':
      return <CandleAnatomyLab />;
    case 'risk-calc':
      return <RiskCalculator />;
    case 'rr-calc':
      return <RRBuilder />;
    case 'session-clock':
      return <SessionClock />;
    case 'structure-builder':
      return <StructureBuilder />;
    case 'sweep-spotter':
      return <ClickGame kind="sweep" />;
    case 'fvg-finder':
      return <ClickGame kind="fvg" />;
    case 'mtf-lab':
      return <MtfLab />;
    case 'news-planner':
      return <NewsPlanner />;
    default:
      return (
        <div className="card p-6">
          {header}
          <p className="text-mist-400">Widget coming soon.</p>
        </div>
      );
  }
}
