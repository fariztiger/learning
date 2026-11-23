import type { S } from '@/lib/types';
import { s } from './helpers';

export interface Achievement {
  id: string;
  title: S;
  desc: S;
  icon: string;
  xp: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    title: s('First Steps', 'Langkah Pertama'),
    desc: s('Complete your first lesson.', 'Selesaikan pelajaran pertama anda.'),
    icon: 'compass',
    xp: 30,
  },
  {
    id: 'quiz-ace',
    title: s('Perfect Quiz', 'Kuiz Sempurna'),
    desc: s('Answer every option right in a quiz step (first try counts).', 'Jawab setiap pilihan betul dalam langkah kuiz (percubaan pertama dikira).'),
    icon: 'star',
    xp: 40,
  },
  {
    id: 'candle-whisperer',
    title: s('Candle Whisperer', 'Bisik Lilin'),
    desc: s('Complete the Candlestick Anatomy lesson.', 'Selesaikan pelajaran Anatomi Lilin.'),
    icon: 'candle',
    xp: 30,
  },
  {
    id: 'structure-hunter',
    title: s('Structure Hunter', 'Pemburu Struktur'),
    desc: s('Complete all of Level 2 — Reading Price Action.', 'Selesaikan semua Tahap 2 — Membaca Tindakan Harga.'),
    icon: 'chart',
    xp: 60,
  },
  {
    id: 'liquidity-master',
    title: s('Liquidity Master', 'Ketua Kecairan'),
    desc: s('Complete the Smart Money Concepts level.', 'Selesaikan tahap Konsep Wang Pintar.'),
    icon: 'layers',
    xp: 80,
  },
  {
    id: 'risk-guardian',
    title: s('Risk Guardian', 'Penjaga Risiko'),
    desc: s('Complete the Position Sizing lesson.', 'Selesaikan pelajaran Saiz Posisi.'),
    icon: 'shield',
    xp: 50,
  },
  {
    id: 'arena-debut',
    title: s('Arena Debut', 'Debut Arena'),
    desc: s('Pass your first Practice Arena scenario (60%+).', 'Lulus skenario Arena Latihan pertama anda (60%+).'),
    icon: 'target',
    xp: 40,
  },
  {
    id: 'arena-champion',
    title: s('Arena Champion', 'Juara Arena'),
    desc: s('Pass every scenario in the Foundation tier.', 'Lulus setiap skenario dalam tier Foundation.'),
    icon: 'trophy',
    xp: 90,
  },
  {
    id: 'certified',
    title: s('TIGERFX Certified', 'Bersijil TIGERFX'),
    desc: s('Pass the Certification scenario at 70%+.', 'Lulus skenario Pensijilan pada 70%+.'),
    icon: 'graduation',
    xp: 150,
  },
  {
    id: 'streak-3',
    title: s('Momentum', 'Momentum'),
    desc: s('Learn 3 days in a row.', 'Belajar 3 hari berturut-turut.'),
    icon: 'flame',
    xp: 45,
  },
  {
    id: 'streak-7',
    title: s('Disciplined', 'Berdisiplin'),
    desc: s('Learn 7 days in a row.', 'Belajar 7 hari berturut-turut.'),
    icon: 'bolt',
    xp: 100,
  },
  {
    id: 'bilingual',
    title: s('Bilingual Mind', 'Minda Dwibahasa'),
    desc: s('Switch the platform language at least once.', 'Tukar bahasa platform sekurang-kurangnya sekali.'),
    icon: 'globe',
    xp: 25,
  },
  {
    id: 'graduate',
    title: s('Graduate', 'Graduan'),
    desc: s('Complete every lesson in all five levels.', 'Selesaikan setiap pelajaran dalam semua lima tahap.'),
    icon: 'trophy',
    xp: 250,
  },
];

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
