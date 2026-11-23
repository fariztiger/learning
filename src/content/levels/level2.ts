/* Level 2 — Reading Price Action */
import type { Lesson, Level } from '@/lib/types';
import { compose, injectBreak, injectEqualHighs, injectEqualLows, makeRange, makeTrend, makeWalk } from '@/lib/chart/builders';
import { q, s, scn, scene, txt, widget } from '../helpers';

const trendCandles = makeTrend({ seed: 2101, start: 2360, count: 54, dir: 1, strength: 1.25, vol: 2.0 });
const srCandles = compose([
  makeWalk({ seed: 2110, start: 2400, count: 10, vol: 1.6, drift: -0.2 }),
  makeRange({ seed: 2111, lo: 2388, hi: 2396, count: 16 }),
  makeTrend({ seed: 2112, start: 2392, count: 8, dir: 1, strength: 1.2, vol: 1.7 }),
  makeRange({ seed: 2113, lo: 2398, hi: 2406, count: 14 }),
]);
const patternCandles = compose([
  makeTrend({ seed: 2120, start: 2410, count: 14, dir: -1, strength: 1.1, vol: 1.9 }),
  makeRange({ seed: 2121, lo: 2386, hi: 2393, count: 8 }),
  makeTrend({ seed: 2122, start: 2390, count: 14, dir: 1, strength: 1.15, vol: 1.9 }),
]);

let breakoutBase = makeRange({ seed: 2130, lo: 2392, hi: 2402, count: 22 });
breakoutBase = injectEqualHighs(breakoutBase, { indices: [8, 14, 19], level: 2401.5, seed: 4 });
const breakoutCandles = compose([
  breakoutBase,
  makeTrend({ seed: 2131, start: 2402, count: 12, dir: 1, strength: 1.35, vol: 1.8 }),
]);

let falseBase = makeRange({ seed: 2140, lo: 2394, hi: 2404, count: 20 });
falseBase = injectEqualHighs(falseBase, { indices: [7, 13, 17], level: 2403.5, seed: 6 });
const falseCandles = compose([
  falseBase,
  makeTrend({ seed: 2141, start: 2404, count: 14, dir: -1, strength: 1.25, vol: 2.1 }),
]);

const pullbackCandles = makeTrend({ seed: 2150, start: 2350, count: 56, dir: 1, strength: 1.2, vol: 2.1 });
const rangeCandles = makeRange({ seed: 2160, lo: 2380, hi: 2408, count: 52 });

const l2Trends: Lesson = {
  id: 'l2-trends',
  levelId: 'l2',
  title: s('Trends & Market Structure', 'Trend & Struktur Pasaran'),
  summary: s(
    'Swing highs and lows, the HH/HL/LH/LL language, and how to name what the market is doing right now.',
    'Swing high dan rendah, bahasa HH/HL/LH/LL, dan cara menamakan apa yang pasaran lakukan sekarang.'
  ),
  minutes: 10,
  xp: 55,
  skills: ['structure', 'price-action'],
  steps: [
    txt(
      s('Structure is a language', 'Struktur ialah bahasa'),
      s(
        'Markets move in swings: a push up (swing high), a pull back (swing low), another push. By comparing each new swing to the previous one, you can describe market condition precisely: HH = higher high, HL = higher low, LH = lower high, LL = lower low.',
        'Pasaran bergerak dalam swing: tolak naik (swing high), tarik balik (swing low), tolak lagi. Dengan membandingkan setiap swing baharu dengan yang sebelumnya, anda boleh menerangkan keadaan pasaran dengan tepat: HH = higher high, HL = higher low, LH = lower high, LL = lower low.'
      ),
      {
        bullets: [
          s('Uptrend = HH + HL. Downtrend = LH + LL.', 'Uptrend = HH + HL. Downtrend = LH + LL.'),
          s('Range = swings failing to make progress in either direction.', 'Range = swing gagal membuat kemajuan ke mana-mana arah.'),
          s('The trend is your context — never fight it without a structural reason.', 'Trend ialah konteks anda — jangan lawannya tanpa sebab struktur.'),
        ],
      }
    ),
    scn(
      s('Label the trend live', 'Label trend secara langsung'),
      scene('l2-trend', trendCandles, [
        {
          caption: s(
            'Here comes the first swing high and pullback. Watch how each push goes further than the last one.',
            'Berikut swing high pertama dan pullback. Perhatikan bagaimana setiap tolak lebih jauh daripada yang sebelumnya.'
          ),
          state: { revealTo: 12, notes: [{ x: 5, p: 0, tone: 'sky', text: s('Swing low 1', 'Swing low 1') }] },
        },
        {
          caption: s(
            'Higher High, Higher Low, Higher High… this is an uptrend in its purest form. Each HL is where buyers re-entered.',
            'Higher High, Higher Low, Higher High… ini uptrend dalam bentuk paling tulen. Setiap HL ialah tempat pembeli masuk semula.'
          ),
          state: {
            revealTo: 28,
            highlights: [
              { from: 4, to: 12, tone: 'bull', label: s('HH', 'HH') },
              { from: 13, to: 21, tone: 'bull', label: s('HL', 'HL') },
            ],
          },
        },
        {
          caption: s(
            'The trend holds AS LONG AS the last HL survives. When price breaks below the last higher low, the trend is challenged — that moment has a special name we will learn in Level 3 (CHoCH).',
            'Trend kekal SELAGI HL terakhir terselamat. Apabila harga jatuh di bawah higher low terakhir, trend dicabar — saat itu mempunyai nama khas yang kita pelajari di Tahap 3 (CHoCH).'
          ),
          state: {
            revealTo: 53,
            highlights: [{ from: 34, to: 53, tone: 'gold', label: s('Trend continues / continues', 'Trend diteruskan') }],
          },
        },
      ])
    ),
    q(
      s('Price forms: High at 2410, pullback to 2395, new high at 2418. Structure label?', 'Harga membentuk: High pada 2410, pullback ke 2395, high baharu pada 2418. Label struktur?'),
      [
        {
          text: s('HH (higher high) after a HL — uptrend behaviour.', 'HH (higher high) selepas HL — kelakuan uptrend.'),
          correct: true,
          why: s('2418 > 2410 = higher high. Combined with the higher low, this is textbook uptrend structure.', '2418 > 2410 = higher high. Digabungkan dengan higher low, ini struktur uptrend teksbook.'),
        },
        {
          text: s('LL — the market is falling.', 'LL — pasaran sedang jatuh.'),
          why: s('A lower low would require price to fall BELOW the previous low. Here the new high exceeds the old one.', 'Lower low memerlukan harga jatuh DI BAWAH rendah sebelumnya. Di sini high baharu melebihi yang lama.'),
        },
        {
          text: s('Structure cannot be known from three swings.', 'Struktur tidak boleh diketahui daripada tiga swing.'),
          why: s('Three swings already give one comparison (HH or LH). More swings refine the read, but the language starts immediately.', 'Tiga swing sudah memberikan satu perbandingan (HH atau LH). Lebih banyak swing memperhalusi bacaan, tetapi bahasa bermula serta-merta.'),
        },
      ]
    ),
    widget(
      'structure-builder',
      s('Structure Builder', 'Pembina Struktur'),
      s(
        'Click the swing highs and lows on the chart in order. The lab checks your structure reading.',
        'Klik swing high dan rendah pada carta mengikut susunan. Makmal menyemak bacaan struktur anda.'
      )
    ),
  ],
};

const l2SR: Lesson = {
  id: 'l2-sr',
  levelId: 'l2',
  title: s('Support & Resistance', 'Sokongan & Rintangan'),
  summary: s(
    'Where price reacts, why levels matter, and how to draw zones instead of perfect lines.',
    'Di mana harga bertindak balas, mengapa paras penting, dan cara melukis zon dan bukan garisan sempurna.'
  ),
  minutes: 9,
  xp: 50,
  skills: ['levels', 'price-action'],
  steps: [
    txt(
      s('Levels are memory', 'Paras ialah ingatan'),
      s(
        'Support is a price area where buyers have stepped in before. Resistance is where sellers have stepped in before. These levels matter not because of magic lines, but because of human memory — traders remember prices where decisions happened.',
        'Sokongan ialah kawasan harga di mana pembeli pernah masuk sebelum ini. Rintangan ialah tempat penjual pernah masuk. Paras ini penting bukan kerana garisan ajaib, tetapi kerana ingatan manusia — trader mengingati harga di mana keputusan berlaku.'
      ),
      {
        bullets: [
          s('Draw ZONES (areas), not razor-thin lines — price is messy.', 'Lukis ZON (kawasan), bukan garisan setipis pisau — harga tidak kemas.'),
          s('A level touched multiple times is stronger — but also more crowded.', 'Paras yang disentuh beberapa kali lebih kuat — tetapi juga lebih sesak.'),
          s('Old support often becomes resistance after a break (and vice versa).', 'Sokongan lama sering menjadi rintangan selepas pecah (dan sebaliknya).'),
        ],
      }
    ),
    scn(
      s('Watch a level earn respect', 'Perhatikan paras mendapat penghormatan'),
      scene('l2-sr', srCandles, [
        {
          caption: s(
            'Price falls into an area and bounces. Mark this first reaction — it is now a candidate support zone.',
            'Harga jatuh ke kawasan dan melantun. Tandakan tindak balas pertama ini — ia kini zon sokongan kandidat.'
          ),
          state: {
            revealTo: 14,
            highlights: [{ from: 10, to: 16, tone: 'bull', pFrom: 2387, pTo: 2394, label: s('Reaction 1', 'Tindak balas 1') }],
          },
        },
        {
          caption: s(
            'A second visit. Notice price does not turn at the exact same number — it reacts within the ZONE. That is why we draw boxes.',
            'Lawatan kedua. Perhatikan harga tidak berpatah pada nombor yang sama tepat — ia bertindak balas dalam ZON. Sebab itu kita melukis kotak.'
          ),
          state: {
            revealTo: 24,
            highlights: [{ from: 17, to: 24, tone: 'bull', pFrom: 2387, pTo: 2394, label: s('Reaction 2', 'Tindak balas 2') }],
          },
        },
        {
          caption: s(
            'The zone held and price launched. Notice where it paused next — a NEW resistance area is forming above. Markets build staircases of these levels.',
            'Zon bertahan dan harga melancarkan. Perhatikan di mana ia berhenti seterusnya — kawasan rintangan BARU sedang terbentuk di atas. Pasaran membina tangga paras ini.'
          ),
          state: {
            revealTo: 47,
            highlights: [{ from: 36, to: 44, tone: 'bear', pFrom: 2402, pTo: 2407, label: s('New resistance', 'Rintangan baharu') }],
          },
        },
      ])
    ),
    {
      kind: 'chartTask',
      title: s('Find the support zone', 'Cari zon sokongan'),
      instruction: s(
        'Tap the chart where price reacted UP from a level more than once — the support zone.',
        'Ketik carta di mana harga bertindak balas NAIK dari paras lebih daripada sekali — zon sokongan.'
      ),
      candles: srCandles,
      target: { x: 14, p: 2390, r: 5, label: s('Support zone', 'Zon sokongan') },
      hint: s(
        'Look for the area where two or more downward moves were rejected.',
        'Cari kawasan di mana dua atau lebih pergerakan ke bawah ditolak.'
      ),
      success: s(
        'Yes! Two clear reactions at roughly the same area — that is a valid support zone. Notice the reactions do not hit the exact same price; the zone is a range.',
        'Ya! Dua tindak balas jelas di kawasan hampir sama — itu zon sokongan sah. Perhatikan tindak balas tidak menyentuh harga yang tepat sama; zon ialah julat.'
      ),
      miss: s(
        'Not quite. Support forms where downward moves get rejected by buyers — usually at previous swing lows. Try the lower half of the chart where candles bounce up.',
        'Belum tepat. Sokongan terbentuk di mana pergerakan ke bawah ditolak pembeli — biasanya pada swing low sebelumnya. Cuba bahagian bawah carta di mana lilin melantun naik.'
      ),
    },
    q(
      s('Why are zones better than single lines for S/R?', 'Mengapa zon lebih baik daripada garisan tunggal untuk S/R?'),
      [
        {
          text: s('Price reacts in areas; a zone captures the messy reality of turning points.', 'Harga bertindak balas di kawasan; zon menangkap realiti kemas titik pusingan.'),
          correct: true,
          why: s('Exactly. Institutional orders, spreads and volatility make turning "areas" rather than exact prices. Zones give your trades room to breathe.', 'Tepat. Order institusi, spread dan volatiliti menjadikan kawasan pusingan dan bukan harga tepat. Zon memberi ruang dagangan anda bernafas.'),
        },
        {
          text: s('Lines are illegal on most platforms.', 'Garisan tidak dibenarkan pada kebanyakan platform.'),
          why: s('Lines are perfectly legal — they are just too precise. Use lines for reference prices (like entries) and zones for structure.', 'Garisan dibenarkan sepenuhnya — ia terlalu tepat. Guna garisan untuk harga rujukan (seperti entri) dan zon untuk struktur.'),
        },
        {
          text: s('Zones predict exactly where price will turn.', 'Zon meramal tepat di mana harga akan berpatah.'),
          why: s('Nothing predicts exactly. Zones mark areas where reactions are LIKELY — probability, not certainty. Always plan for the zone to fail.', 'Tiada apa meramal tepat. Zon menanda kawasan di mana tindak balas BERKEMUNGKINAN — probabiliti, bukan kepastian. Sentiasa rancang jika zon gagal.'),
        },
      ]
    ),
  ],
};

const l2Patterns: Lesson = {
  id: 'l2-patterns',
  levelId: 'l2',
  title: s('Candle Formations & Patterns', 'Bentukan & Corak Lilin'),
  summary: s(
    'Engulfing, pin bars, dojis and inside bars — what each reveals and why context beats memorisation.',
    'Engulfing, pin bar, doji dan inside bar — apa yang setiap satu dedahkan dan mengapa konteks mengatasi hafalan.'
  ),
  minutes: 10,
  xp: 50,
  skills: ['candles', 'price-action'],
  steps: [
    txt(
      s('Patterns are sentences, not magic', 'Corak ialah ayat, bukan magik'),
      s(
        'Candlestick patterns are short "sentences" in the market language: a pin bar says "price tried to go there and was rejected"; an engulfing candle says "the other side took control completely". The pattern only matters WHERE it appears — at a level, after a trend, at a liquidity area.',
        'Corak lilin ialah "ayat" pendek dalam bahasa pasaran: pin bar berkata "harga cuba ke sana dan ditolak"; lilin engulfing berkata "pihak lain mengawal sepenuhnya". Corak hanya penting DI MANA ia muncul — pada paras, selepas trend, di kawasan kecairan.'
      ),
      {
        bullets: [
          s('Bullish engulfing: a red candle fully covered by the next green one — buyers overwhelmed sellers.', 'Bullish engulfing: lilin merah dilindungi sepenuhnya oleh lilin hijau seterusnya — pembeli mengatasi penjual.'),
          s('Pin bar / hammer: long wick rejecting a level — the market said "no" to those prices.', 'Pin bar / hammer: bayang panjang menolak paras — pasaran berkata "tidak" kepada harga tersebut.'),
          s('Doji: open and close nearly equal — indecision. Its meaning depends on where it forms.', 'Doji: buka dan tutup hampir sama — kebimbangan. Maknanya bergantung pada tempat ia terbentuk.'),
          s('Inside bar: a candle contained by the previous one — energy compressing before expansion.', 'Inside bar: lilin terkandung oleh yang sebelumnya — tenaga memampat sebelum pengembangan.'),
        ],
      }
    ),
    scn(
      s('Patterns in their habitat', 'Corak dalam habitatnya'),
      scene('l2-patterns', patternCandles, [
        {
          caption: s(
            'Downtrend first. Then watch the bottom: a small candle, then a large green body covering the previous red one — bullish engulfing at the low.',
            'Downtrend dahulu. Kemudian perhatikan bahagian bawah: lilin kecil, kemudian badan hijau besar melindungi lilin merah sebelumnya — bullish engulfing pada paras rendah.'
          ),
          state: {
            revealTo: 21,
            highlights: [{ from: 18, to: 21, tone: 'bull', label: s('Engulfing at low', 'Engulfing pada rendah') }],
          },
        },
        {
          caption: s(
            'The reversal begins. This is the correct way to use patterns: as confirmation at a decision point — never as a signal floating in empty space.',
            'Pembalikan bermula. Inilah cara betul menggunakan corak: sebagai pengesahan pada titik keputusan — bukan isyarat terapung di ruang kosong.'
          ),
          state: {
            revealTo: 36,
            highlights: [{ from: 22, to: 36, tone: 'gold', label: s('Follow-through', 'Susulan') }],
          },
        },
      ])
    ),
    q(
      s('A perfect bullish pin bar appears in the middle of a strong downtrend, far from any level. What is the best action?', 'Pin bar bullish sempurna muncul di tengah downtrend kuat, jauh dari mana-mana paras. Apakah tindakan terbaik?'),
      [
        {
          text: s('Do nothing — the pattern lacks context. Wait for price to reach a level.', 'Buat apa-apa tiada — corak tiada konteks. Tunggu harga sampai ke paras.'),
          correct: true,
          why: s('Excellent judgment. Pattern quality without context is noise. The best traders are professional waiters — context first, pattern second.', 'Penghakiman cemerlang. Kualiti corak tanpa konteks ialah hingar. Trader terbaik ialah pelayan profesional — konteks dahulu, corak kemudian.'),
        },
        {
          text: s('Buy immediately — pin bars always reverse the trend.', 'Beli serta-merta — pin bar sentiasa membalikkan trend.'),
          why: s('"Always" is the most expensive word in trading. Pin bars fail constantly in strong trends. Context decides validity.', '"Sentiasa" ialah paling mahal dalam dagangan. Pin bar sering gagal dalam trend kuat. Konteks menentukan kesahan.'),
        },
        {
          text: s('Sell, because the trend is down.', 'Jual, kerana trend menurun.'),
          why: s('Selling because of one contradictory candle is also impulsive. The disciplined answer: no trade without a level or trigger. NO TRADE is a valid position.', 'Menjual kerana satu lilin bercanggah juga impulsif. Jawapan berdisiplin: tiada dagangan tanpa paras atau pencetus. NO TRADE ialah kedudukan sah.'),
        },
      ]
    ),
    widget(
      'candle-anatomy',
      s('Pattern sandbox', 'Sandbox corak'),
      s(
        'Rebuild each pattern with the sliders: hammer, engulfing, doji. Learn them by making them.',
        'Bina semula setiap corak dengan pelarung: hammer, engulfing, doji. Belajar dengan membina.'
      )
    ),
  ],
};

const l2Breakouts: Lesson = {
  id: 'l2-breakouts',
  levelId: 'l2',
  title: s('Breakouts & False Breakouts', 'Breakout & False Breakout'),
  summary: s(
    'How real expansion looks, how traps are set, and the confirmation question that saves you money.',
    'Bagaimana pengembangan sebenar kelihatan, bagaimana perangkap dipasang, dan soalan pengesahan yang menjimatkan wang anda.'
  ),
  minutes: 10,
  xp: 55,
  skills: ['levels', 'structure', 'liquidity'],
  steps: [
    txt(
      s('A breakout is a statement', 'Breakout ialah kenyataan'),
      s(
        'When price closes beyond a well-watched level with strong candles, it is a statement: "this level no longer holds". The strongest breakouts show DISPLACEMENT — large-bodied candles moving away quickly, leaving gaps and no hesitation.',
        'Apabila harga ditutup melepasi paras yang diperhatikan dengan lilin kuat, ia satu kenyataan: "paras ini tidak lagi bertahan". Breakout terkuat menunjukkan ANJAKAN — lilin berbadan besar bergerak jauh dengan pantas, meninggalkan jurang dan tanpa teragak-agak.'
      ),
      {
        bullets: [
          s('A close beyond the level matters more than a wick beyond it.', 'Penutupan melepasi paras lebih penting daripada bayang melepasinya.'),
          s('Volume and speed confirm intent (in our simulator: candle size and follow-through).', 'Isipadu dan kelajuan mengesahkan niat (dalam simulator kita: saiz lilin dan susulan).'),
          s('Retests of broken levels are normal — a breakout plan includes the retest.', 'Ujian semula paras yang pecah adalah normal — pelan breakout termasuk ujian semula.'),
        ],
      }
    ),
    scn(
      s('A clean breakout', 'Breakout bersih'),
      scene('l2-breakout', breakoutCandles, [
        {
          caption: s(
            'A range with several equal highs. This cluster is about to be tested — watch how the break happens.',
            'Range dengan beberapa high sama. Kelompok ini akan diuji — perhatikan bagaimana pecahan berlaku.'
          ),
          state: {
            revealTo: 20,
            highlights: [{ from: 6, to: 20, tone: 'gold', pFrom: 2400, pTo: 2403, label: s('Equal highs', 'High sama') }],
          },
        },
        {
          caption: s(
            'Strong candles close above the level and keep going with small pullbacks. This is displacement — the market is not hesitating.',
            'Lilin kuat ditutup di atas paras dan terus bergerak dengan pullback kecil. Ini anjakan — pasaran tidak teragak-agak.'
          ),
          state: {
            revealTo: 33,
            highlights: [{ from: 22, to: 33, tone: 'bull', label: s('Displacement', 'Anjakan') }],
          },
        },
      ])
    ),
    scn(
      s('A false breakout (trap)', 'False breakout (perangkap)'),
      scene('l2-false', falseCandles, [
        {
          caption: s(
            'Same setup: equal highs watched by everyone. But watch what happens when price pokes above…',
            'Setup sama: high sama diperhatikan semua orang. Tetapi perhatikan apa berlaku apabila harga menyentuh ke atas…'
          ),
          state: {
            revealTo: 19,
            highlights: [{ from: 5, to: 18, tone: 'gold', pFrom: 2402, pTo: 2404.5, label: s('Buy-side liquidity', 'Kecairan beli') }],
          },
        },
        {
          caption: s(
            'Price briefly trades above the highs — triggering breakout buy orders and stop losses of short sellers — then closes back below. This is a false breakout; in Level 3 we call this a liquidity sweep.',
            'Harga sebentar didagangkan di atas paras — mencetuskan order beli breakout dan stop loss penjual singkat — kemudian ditutup semula di bawah. Ini false breakout; di Tahap 3 kita memanggilnya liquidity sweep.'
          ),
          state: {
            revealTo: 27,
            highlights: [{ from: 20, to: 24, tone: 'bear', label: s('Trap!', 'Perangkap!') }],
          },
        },
        {
          caption: s(
            'The reversal is fast because trapped buyers exit and sellers pile in. Notice: the SAME level created both a breakout opportunity and a trap. Confirmation is what separates them.',
            'Pembalikan pantas kerana pembeli terperangkap keluar dan penjual membanjiri. Perhatian: paras yang SAMA mewujudkan peluang breakout dan perangkap. Pengesahan yang memisahkan mereka.'
          ),
          state: {
            revealTo: 40,
            highlights: [{ from: 28, to: 40, tone: 'bear', label: s('Trap resolution', 'Penyelesaian perangkap') }],
          },
        },
      ])
    ),
    {
      kind: 'chartTask',
      title: s('Click the trap', 'Klik perangkap'),
      instruction: s(
        'Tap the exact candle where price poked above the highs and closed back below — the false breakout.',
        'Ketik lilin tepat di mana harga menyentuh ke atas paras dan ditutup semula di bawah — false breakout.'
      ),
      candles: falseCandles,
      target: { x: 22, p: 2405, r: 4.5, label: s('Sweep candle', 'Lilin sweep') },
      hint: s('It is the candle with the long upper wick above the earlier highs.', 'Ia lilin dengan bayang atas panjang melepasi high sebelumnya.'),
      success: s(
        'Perfect. The wick above + close below = trapped breakout buyers. These candles are one of the highest-value moments on any chart.',
        'Sempurna. Bayang ke atas + penutupan di bawah = pembeli breakout terperangkap. Lilin ini antara saat paling bernilai pada mana-mana carta.'
      ),
      miss: s(
        'Look for the candle whose wick goes ABOVE the earlier equal highs but whose body closes back INSIDE the range.',
        'Cari lilin yang bayangnya ke ATAS high sama sebelumnya tetapi badannya ditutup semula DALAM range.'
      ),
    },
    q(
      s('What most reliably distinguishes a real breakout from a trap?', 'Apa yang paling dipercayai membezakan breakout sebenar daripada perangkap?'),
      [
        {
          text: s('How price CLOSES and behaves after leaving the level.', 'Bagaimana harga DITUTUP dan berkelakuan selepas meninggalkan paras.'),
          correct: true,
          why: s('Well put. Wicks overshoot all the time; closes and follow-through reveal conviction. A real breakout shows displacement and holds outside the level.', 'Baik. Bayang sering melampau; penutupan dan susulan mendedahkan keyakinan. Breakout sebenar menunjukkan anjakan dan kekal di luar paras.'),
        },
        {
          text: s('The round number of the level.', 'Nombor bulat paras.'),
          why: s('Round numbers attract attention, but they do not confirm anything by themselves. Behaviour after the break is the evidence.', 'Nombu bulat menarik perhatian, tetapi ia tidak mengesahkan apa-apa sendiri. Kelakuan selepas pecahan ialah bukti.'),
        },
        {
          text: s('A tip from a trading group.', 'Tip dari kumpulan dagangan.'),
          why: s('External tips are not evidence you can verify. Learn to read the break itself — that skill works on every market, forever.', 'Tip luaran bukan bukti yang boleh anda sahkan. Belajar membaca pecahan itu sendiri — kemahiran itu berfungsi pada setiap pasaran, selamanya.'),
        },
      ]
    ),
  ],
};

const l2Pullbacks: Lesson = {
  id: 'l2-pullbacks',
  levelId: 'l2',
  title: s('Pullbacks & Reversals', 'Pullback & Pembalikan'),
  summary: s(
    'The difference between a temporary pause and a genuine change of direction — and how to trade both safely.',
    'Beza antara jeda sementara dan perubahan arah sebenar — dan cara berdagang kedua-duanya dengan selamat.'
  ),
  minutes: 9,
  xp: 50,
  skills: ['structure', 'price-action'],
  steps: [
    txt(
      s('Pullback or reversal?', 'Pullback atau pembalikan?'),
      s(
        'A pullback is a pause WITHIN a trend: price retraces a bit, then the trend continues. A reversal is a change of trend itself. The honest answer: you cannot know in advance — but structure gives you evidence and a plan.',
        'Pullback ialah jeda DALAM trend: harga menarik balik sedikit, kemudian trend diteruskan. Pembalikan ialah perubahan trend itu sendiri. Jawapan jujur: anda tidak boleh tahu awal — tetapi struktur memberi anda bukti dan pelan.'
      ),
      {
        bullets: [
          s('In an uptrend, pullbacks make HIGHER lows. If a low breaks, the trend is in question.', 'Dalam uptrend, pullback membuat rendah lebih tinggi. Jika rendah pecah, trend dipersoalkan.'),
          s('Reversal clues: structure break (LH/LL), momentum dying, level rejection with follow-through.', 'Petunjuk pembalikan: pecahan struktur (LH/LL), momentum mati, penolakan paras dengan susulan.'),
          s('Trade pullbacks with the trend; trade reversals only with strong confirmation.', 'Dagangkan pullback mengikut trend; dagangkan pembalikan hanya dengan pengesahan kuat.'),
        ],
      }
    ),
    scn(
      s('A pullback that honoured the trend', 'Pullback yang menghormati trend'),
      scene('l2-pullback', pullbackCandles, [
        {
          caption: s(
            'Uptrend with healthy pullbacks. Each pullback stays ABOVE the previous low — the trend breathes but never breaks.',
            'Uptrend dengan pullback sihat. Setiap pullback kekal DI ATAS rendah sebelumnya — trend bernafas tetapi tidak pernah pecah.'
          ),
          state: {
            revealTo: 24,
            highlights: [
              { from: 10, to: 15, tone: 'sky', label: s('Pullback 1', 'Pullback 1') },
              { from: 19, to: 23, tone: 'sky', label: s('Pullback 2', 'Pullback 2') },
            ],
          },
        },
        {
          caption: s(
            'Each pause ends where the last buyers re-entered. Entering ON the pullback (not after the surge) is how disciplined traders get better prices and smaller stops.',
            'Setiap jeda berakhir di mana pembeli terakhir masuk semula. Memasuki SEMASA pullback (bukan selepas lonjakan) ialah cara trader berdisiplin mendapat harga lebih baik dan stop lebih kecil.'
          ),
          state: {
            revealTo: 55,
            highlights: [{ from: 30, to: 55, tone: 'bull', label: s('Trend intact', 'Trend utuh') }],
          },
        },
      ])
    ),
    q(
      s('In an uptrend, price pulls back and breaks the last higher low. What is the correct first read?', 'Dalam uptrend, harga menarik balik dan memecahkan higher low terakhir. Apakah bacaan pertama yang betul?'),
      [
        {
          text: s('The uptrend is challenged — tighten risk and wait for new evidence.', 'Uptrend dicabar — ketatkan risiko dan tunggu bukti baharu.'),
          correct: true,
          why: s('Exactly. Breaking the last HL is the first structural warning. It does not guarantee a full reversal — but it ends the "trend is safe" assumption.', 'Tepat. Memecahkan HL terakhir ialah amaran struktur pertama. Ia tidak menjamin pembalikan penuh — tetapi ia menamatkan andaian "trend selamat".'),
        },
        {
          text: s('Definitely a full reversal — sell everything now.', 'Sudah pasti pembalikan penuh — jual segalanya sekarang.'),
          why: s('One broken low is a warning, not a verdict. Reversals need confirmation: lower highs, momentum shift, rejection of rallies.', 'Satu rendah pecah ialah amaran, bukan vonis. Pembalikan memerlukan pengesahan: lower high, anjakan momentum, penolakan kenaikan.'),
        },
        {
          text: s('Nothing changed; ignore it.', 'Tiada apa berubah; abaikan.'),
          why: s('Ignoring a broken higher low is how trends turn accounts into lessons. The read is: evidence changed, so management must change.', 'Mengabaikan higher low yang pecah ialah bagaimana trend menukar akaun menjadi pelajaran. Bacaannya: bukti berubah, jadi pengurusan mesti berubah.'),
        },
      ]
    ),
  ],
};

const l2Volatility: Lesson = {
  id: 'l2-volatility',
  levelId: 'l2',
  title: s('Volatility & Ranges', 'Volatiliti & Range'),
  summary: s(
    'When markets breathe quietly and when they explode — and why your strategy must match the weather.',
    'Apabila pasaran bernafas perlahan dan apabila ia meletup — dan mengapa strategi anda mesti sepadan dengan cuaca.'
  ),
  minutes: 8,
  xp: 45,
  skills: ['price-action', 'risk'],
  steps: [
    txt(
      s('Markets have weather', 'Pasaran mempunyai cuaca'),
      s(
        'Volatility is how much price moves per unit of time. High volatility = big candles, fast swings. Low volatility = small candles, tight ranges. Neither is "good" or "bad" — but each favours different behaviour. Breakout strategies love volatility expansion; range strategies love quiet.',
        'Volatiliti ialah berapa banyak harga bergerak per unit masa. Volatiliti tinggi = lilin besar, swing pantas. Volatiliti rendah = lilin kecil, range ketat. Kedua-duanya bukan "baik" atau "buruk" — tetapi setiap satu menyukai kelakuan berbeza. Strategi breakout menyukai pengembangan volatiliti; strategi range menyukai ketenangan.'
      ),
      {
        bullets: [
          s('Ranges: price bouncing between clear floor and ceiling — fade the edges, avoid the middle.', 'Range: harga melantun antara lantai dan siling jelas — dagang tepi, elak tengah.'),
          s('Expansion: candles grow, swings accelerate — switch to trend/breakout thinking.', 'Pengembangan: lilin membesar, swing mempercepat — tukar kepada pemikiran trend/breakout.'),
          s('Your stop distance must respect volatility — tight stops in wild markets get hit by noise.', 'Jarak stop anda mesti menghormati volatiliti — stop ketat dalam pasaran liar dipukul hingar.'),
        ],
        callout: {
          tone: 'tip',
          text: s(
            'You will measure volatility properly with ATR in Level 5. For now, learn to SEE it: candle size and swing depth are the raw visual clues.',
            'Anda akan mengukur volatiliti dengan betul menggunakan ATR di Tahap 5. Buat masa ini, belajar MELIHATnya: saiz lilin dan kedalaman swing ialah petunjuk visual mentah.'
          ),
        },
      }
    ),
    scn(
      s('Quiet range, then weather change', 'Range tenang, kemudian cuaca berubah'),
      scene('l2-range', rangeCandles, [
        {
          caption: s(
            'A wide, quiet range. See how candles are small and evenly paced — this is low-energy weather.',
            'Range luas dan tenang. Lihat bagaimana lilin kecil dan sama rentak — ini cuaca tenaga rendah.'
          ),
          state: {
            revealTo: 22,
            highlights: [{ from: 0, to: 22, tone: 'mist', pFrom: 2378, pTo: 2410, label: s('Range box', 'Kotak range') }],
          },
        },
        {
          caption: s(
            'Both edges get tested. Traders who buy the ceiling or sell the floor in the MIDDLE of the range pay for it. The edge is where the odds live.',
            'Kedua-dua tepi diuji. Trader yang membeli siling atau menjual lantai di TENGAH range membayarnya. Tepi ialah tempat peluang hidup.'
          ),
          state: {
            revealTo: 38,
            highlights: [
              { from: 24, to: 30, tone: 'bear', label: s('Selling the ceiling', 'Menjual siling') },
              { from: 33, to: 38, tone: 'bull', label: s('Buying the floor', 'Membeli lantai') },
            ],
          },
        },
        {
          caption: s(
            'Ranges end eventually — often with a sweep of one edge first. Everything you learned connects: levels, patterns, breakouts, traps. This is one language.',
            'Range akhirnya tamat — sering dengan sweep satu tepi dahulu. Segala yang anda pelajari bersambung: paras, corak, breakout, perangkap. Ini satu bahasa.'
          ),
          state: { revealTo: 51 },
        },
      ])
    ),
    q(
      s('Candles suddenly triple in size after a quiet week. What should your plan account for?', 'Lilin tiba-tiba tiga kali ganda selepas minggu tenang. Apa yang pelan anda perlu ambil kira?'),
      [
        {
          text: s('Wider stops and smaller position size — volatility raises both opportunity and risk.', 'Stop lebih luas dan saiz posisi lebih kecil — volatiliti meningkatkan peluang dan risiko.'),
          correct: true,
          why: s('Professional answer. When volatility expands, fixed-dollar risk still applies — but the stop must sit beyond wider noise, so size must shrink to keep R constant.', 'Jawapan profesional. Apabila volatiliti berkembang, risiko dolar tetap masih terpakai — tetapi stop mesti duduk melepasi hingar lebih luas, jadi saiz mesti mengecil untuk mengekalkan R tetap.'),
        },
        {
          text: s('Same size, tighter stops to protect profit.', 'Saiz sama, stop lebih ketat untuk lindung keuntungan.'),
          why: s('Tighter stops in expanding volatility = guaranteed noise hits. Widen the stop to match the new weather, and reduce size to keep the same risk.', 'Stop lebih ketat dalam volatiliti berkembang = hingar dijamin memukul. Lebarkan stop untuk sepadan cuaca baharu, dan kurangkan saiz untuk mengekalkan risiko sama.'),
        },
        {
          text: s('Nothing — candle size does not matter.', 'Tiada apa — saiz lilin tidak penting.'),
          why: s('Candle size IS volatility. Ignoring a weather change is like sailing a storm with a sun hat.', 'Saiz lilin IALAH volatiliti. Mengabaikan perubahan cuaca seperti belayar ribut dengan topi matahari.'),
        },
      ]
    ),
  ],
};

export const level2: Level = {
  id: 'l2',
  index: 2,
  title: s('Reading Price Action', 'Membaca Tindakan Harga'),
  tagline: s('Trends, structure and the levels that matter', 'Trend, struktur dan paras yang penting'),
  description: s(
    'Swing structure, S/R, candlestick formations, breakouts, pullbacks and volatility.',
    'Struktur swing, S/R, bentukan lilin, breakout, pullback dan volatiliti.'
  ),
  color: '#22C98B',
  lessons: [l2Trends, l2SR, l2Patterns, l2Breakouts, l2Pullbacks, l2Volatility],
};
