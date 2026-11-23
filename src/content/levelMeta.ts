import type { S } from '@/lib/types';

export interface LevelMeta {
  id: string;
  index: number;
  title: S;
  tagline: S;
  description: S;
  color: string;
  icon: string;
  skills: S[];
}

export const LEVEL_META: LevelMeta[] = [
  {
    id: 'l1',
    index: 1,
    title: { en: 'Absolute Beginner', ms: 'Pemula Mutlak' },
    tagline: { en: 'What markets are, and how a candle tells its story', ms: 'Apa itu pasaran, dan bagaimana lilin menceritakan kisahnya' },
    description: {
      en: 'Start from zero: what trading is, how Forex and gold work, what a candlestick really shows, and the vocabulary of lots, leverage, margin and P&L.',
      ms: 'Mula dari sifar: apa itu dagangan, bagaimana Forex dan emas berfungsi, apa yang lilin tunjukkan, serta kosa kata lot, leveraj, margin dan P&L.',
    },
    color: '#4CC9F0',
    icon: 'compass',
    skills: [
      { en: 'Market basics', ms: 'Asas pasaran' },
      { en: 'Candlesticks', ms: 'Lilin' },
      { en: 'Risk vocabulary', ms: 'Kosa kata risiko' },
    ],
  },
  {
    id: 'l2',
    index: 2,
    title: { en: 'Reading Price Action', ms: 'Membaca Tindakan Harga' },
    tagline: { en: 'Trends, structure and the levels that matter', ms: 'Trend, struktur dan paras yang penting' },
    description: {
      en: 'Learn to see the market the way analysts do: swing points, HH/HL/LH/LL structure, support & resistance, breakouts, false breakouts, pullbacks and volatility.',
      ms: 'Belajar melihat pasaran seperti penganalisis: titik swing, struktur HH/HL/LH/LL, sokongan & rintangan, breakout, false breakout, pullback dan volatiliti.',
    },
    color: '#22C98B',
    icon: 'chart',
    skills: [
      { en: 'Market structure', ms: 'Struktur pasaran' },
      { en: 'S/R levels', ms: 'Paras S/R' },
      { en: 'Breakouts', ms: 'Breakout' },
    ],
  },
  {
    id: 'l3',
    index: 3,
    title: { en: 'Smart Money Concepts', ms: 'Konsep Wang Pintar' },
    tagline: { en: 'Liquidity, order blocks, FVGs and displacement', ms: 'Kecairan, order block, FVG dan anjakan' },
    description: {
      en: 'The core SMC toolkit: BOS & CHoCH, internal vs external liquidity, sweeps and runs, supply & demand, order blocks, fair value gaps, premium/discount and multi-timeframe logic.',
      ms: 'Kit alat SMC teras: BOS & CHoCH, kecairan dalaman vs luaran, sweep dan run, bekalan & permintaan, order block, fair value gap, premium/discount dan logik pelbagai timeframe.',
    },
    color: '#8B7CF6',
    icon: 'layers',
    skills: [
      { en: 'Liquidity', ms: 'Kecairan' },
      { en: 'BOS / CHoCH', ms: 'BOS / CHoCH' },
      { en: 'FVG & zones', ms: 'FVG & zon' },
    ],
  },
  {
    id: 'l4',
    index: 4,
    title: { en: 'Strategy & Execution', ms: 'Strategi & Pelaksanaan' },
    tagline: { en: 'Turn analysis into a repeatable, rule-based plan', ms: 'Tukar analisis kepada pelan berulang berasaskan peraturan' },
    description: {
      en: 'Combine concepts into complete setups: confirmation triggers, invalidation, structural stops, targets, reward-to-risk, position sizing and trade management.',
      ms: 'Gabungkan konsep menjadi setup lengkap: pencetus pengesahan, pembatalan, stop struktur, sasaran, ganjaran-risiko, saiz posisi dan pengurusan dagangan.',
    },
    color: '#F5B942',
    icon: 'target',
    skills: [
      { en: 'Setups', ms: 'Setup' },
      { en: 'Position sizing', ms: 'Saiz posisi' },
      { en: 'Trade management', ms: 'Pengurusan dagangan' },
    ],
  },
  {
    id: 'l5',
    index: 5,
    title: { en: 'Advanced Trading Lab', ms: 'Makmal Dagangan Mahir' },
    tagline: { en: 'Gold behaviour, sessions, research and discipline', ms: 'Kelakuan emas, sesi, kajian dan disiplin' },
    description: {
      en: 'Gold-specific behaviour, London/New York sessions in Malaysia time, economic news, ATR/ADX, trailing stops, backtesting, journals, expectancy, drawdown and trading psychology.',
      ms: 'Kelakuan khusus emas, sesi London/New York dalam waktu Malaysia, berita ekonomi, ATR/ADX, trailing stop, backtesting, jurnal, jangkaan, drawdown dan psikologi dagangan.',
    },
    color: '#FF5C7A',
    icon: 'bolt',
    skills: [
      { en: 'Sessions & news', ms: 'Sesi & berita' },
      { en: 'Backtesting', ms: 'Backtesting' },
      { en: 'Psychology', ms: 'Psikologi' },
    ],
  },
];
