/* Practice Arena scenario bank — deterministic synthetic charts + graded tasks */
import type { Scenario } from '@/lib/types';
import {
  compose,
  injectBreak,
  injectEqualHighs,
  injectEqualLows,
  injectFVG,
  injectSweep,
  makeRange,
  makeTrend,
  makeWalk,
} from '@/lib/chart/builders';
import { s } from './helpers';

/* ---- shared generators ---- */
function sweepShort(seed: number) {
  let base = makeRange({ seed, lo: 2390, hi: 2402, count: 22 });
  base = injectEqualHighs(base, { indices: [7, 13, 18], level: 2401, seed: seed + 1 });
  base = injectSweep(base, { at: 20, level: 2401, side: 'high', seed: seed + 2, hold: 2 });
  return compose([base, makeTrend({ seed: seed + 3, start: 2396, count: 16, dir: -1, strength: 1.25, vol: 1.9 })]);
}

function sweepLong(seed: number) {
  let base = makeRange({ seed, lo: 2378, hi: 2392, count: 22 });
  base = injectEqualLows(base, { indices: [7, 13, 18], level: 2379, seed: seed + 1 });
  base = injectSweep(base, { at: 20, level: 2379, side: 'low', seed: seed + 2, hold: 2 });
  return compose([base, makeTrend({ seed: seed + 3, start: 2384, count: 16, dir: 1, strength: 1.25, vol: 1.9 })]);
}

export const SCENARIOS: Scenario[] = [
  /* ---------------- FOUNDATION ---------------- */
  {
    id: 'sc-support',
    tier: 'foundation',
    levelId: 'l2',
    title: s('Find the floor', 'Cari lantai'),
    context: s(
      'XAUUSD M15 has been falling and is now interacting with a zone where buyers appeared before. You are marking support.',
      'XAUUSD M15 telah jatuh dan kini berinteraksi dengan zon di mana pembeli muncul sebelum ini. Anda menanda sokongan.'
    ),
    candles: compose([
      makeWalk({ seed: 6101, start: 2408, count: 10, vol: 1.6, drift: -0.45 }),
      makeRange({ seed: 6102, lo: 2388, hi: 2396, count: 14 }),
      makeTrend({ seed: 6103, start: 2392, count: 8, dir: 1, strength: 1.2, vol: 1.7 }),
      makeRange({ seed: 6104, lo: 2394, hi: 2402, count: 12 }),
    ]),
    revealTo: 33,
    task: {
      type: 'identify',
      question: s('Tap the support zone — the area where price was rejected upward more than once.', 'Ketik zon sokongan — kawasan di mana harga ditolak naik lebih daripada sekali.'),
      targets: [{ x: 16, p: 2391, r: 5.5, label: s('Support zone', 'Zon sokongan') }],
      minHits: 1,
      explain: s(
        'The support zone sits where the fall stalled and multiple candles bounced. Support is an AREA of repeated reactions — notice the turns do not happen at one exact price.',
        'Zon sokongan duduk di mana kejatuhan tersekat dan beberapa lilin melantun. Sokongan ialah KAWASAN tindak balas berulang — perhatikan pusingan tidak berlaku pada satu harga tepat.'
      ),
    },
    xp: 60,
  },
  {
    id: 'sc-candle',
    tier: 'foundation',
    levelId: 'l1',
    title: s('Read the rejection', 'Baca penolakan'),
    context: s(
      'A single candle shows a dramatic fight. Decide what it means before the next candle arrives.',
      'Satu lilin menunjukkan pertarungan dramatik. Tentukan maksudnya sebelum lilin seterusnya tiba.'
    ),
    candles: makeWalk({ seed: 6201, start: 2398, count: 26, vol: 2.2, drift: -0.12 }),
    revealTo: 25,
    task: {
      type: 'decide',
      question: s(
        'After a long fall, a candle forms with a very long lower wick and a small bullish body at the top of its range. What is the best first read?',
        'Selepas kejatuhan panjang, satu lilin terbentuk dengan bayang bawah sangat panjang dan badan bullish kecil di atas julatnya. Apakah bacaan pertama terbaik?'
      ),
      options: [
        { id: 'buy', label: s('Buy now — reversal guaranteed', 'Beli sekarang — pembalikan dijamin') },
        { id: 'sell', label: s('Sell now — trend continues always', 'Jual sekarang — trend diteruskan sentiasa') },
        { id: 'no-trade', label: s('Note the rejection, wait for confirmation', 'Nota penolakan, tunggu pengesahan') },
      ],
      correct: 'no-trade',
      explain: {
        buy: s(
          'A rejection wick is evidence sellers were pushed back — not a guarantee. Buying without confirmation is exactly how long wicks trap eager traders. The wick is a question; the next candles answer it.',
          'Bayang penolakan ialah bukti penjual ditolak balik — bukan jaminan. Membeli tanpa pengesahan tepat bagaimana bayang panjang memerangkap trader tergesa-gesa. Bayang ialah soalan; lilin seterusnya menjawabnya.'
        ),
        sell: s(
          'Selling INTO a strong rejection candle ignores the evidence on the chart. The long lower wick shows buyers fighting — selling here fights the freshest information.',
          'Menjual KE DALAM lilin penolakan kuat mengabaikan bukti pada carta. Bayang bawah panjang menunjukkan pembeli bertarung — menjual di sini melawan maklumat terbaharu.'
        ),
        'no-trade': s(
          'Correct discipline. The long lower wick marks a rejection (potential demand), but one candle proves nothing. Wait for follow-through — a bullish close, a higher low, or a displacement — then act with a defined invalidation.',
          'Disiplin betul. Bayang bawah panjang menanda penolakan (permintaan berpotensi), tetapi satu lilin tidak membuktikan apa-apa. Tunggu susulan — penutupan bullish, higher low, atau anjakan — kemudian bertindak dengan pembatalan ditakrifkan.'
        ),
      },
    },
    xp: 60,
  },
  {
    id: 'sc-trend',
    tier: 'foundation',
    levelId: 'l2',
    title: s('Name that structure', 'Namakan struktur itu'),
    context: s(
      'This market has printed several swings. You must decide what regime you are in BEFORE planning trades.',
      'Pasaran ini telah menghasilkan beberapa swing. Anda mesti menentukan rejim anda SEBELUM merancang dagangan.'
    ),
    candles: makeTrend({ seed: 6301, start: 2350, count: 42, dir: 1, strength: 1.3, vol: 2.1 }),
    revealTo: 41,
    task: {
      type: 'decide',
      question: s('The chart shows successive higher highs and higher lows with healthy pullbacks. Your plan should be…', 'Carta menunjukkan higher high dan higher low berturut dengan pullback sihat. Pelan anda patut…'),
      options: [
        { id: 'buy', label: s('Favour longs on pullbacks (with confirmation)', 'Utamakan long pada pullback (dengan pengesahan)') },
        { id: 'sell', label: s('Short every rally — what goes up must come down', 'Singkat setiap kenaikan — yang naik mesti turun') },
        { id: 'no-trade', label: s('No-trade: trends are unpredictable', 'No-trade: trend tidak boleh diramal') },
      ],
      correct: 'buy',
      explain: {
        buy: s(
          'Structure-aligned trading: in an HH/HL uptrend, pullback longs are the highest-quality plans. Confirmation and invalidation still apply — the trend gives you the right DIRECTION, your triggers give you the right MOMENT.',
          'Dagangan selari struktur: dalam uptrend HH/HL, long pullback ialah pelan paling berkualiti. Pengesahan dan pembatalan masih terpakai — trend memberi ARAH yang betul, pencetus memberi MASA yang betul.'
        ),
        sell: s(
          'Fading a healthy uptrend without structural evidence is fighting both the trend and the tape. If you want reversal trades, wait for a CHoCH first — the structure must give permission.',
          'Menentang uptrend sihat tanpa bukti struktur melawan trend dan pita. Jika anda mahu dagangan pembalikan, tunggu CHoCH dahulu — struktur mesti memberi kebenaran.'
        ),
        'no-trade': s(
          'Trends are not unpredictable — they are probabilistic. Refusing all trades in a clear trend forfeits the best conditions price action offers. Trade WITH structure, with risk defined.',
          'Trend tidak tidak-boleh-diramal — ia bersifat probabiliti. Menolak semua dagangan dalam trend jelas melepaskan keadaan terbaik yang ditawarkan tindakan harga. Dagangkan DENGAN struktur, dengan risiko ditakrifkan.'
        ),
      },
    },
    xp: 60,
  },

  /* ---------------- INTERMEDIATE ---------------- */
  {
    id: 'sc-sweep-valid',
    tier: 'intermediate',
    levelId: 'l3',
    title: s('Valid sweep — take the trap', 'Sweep sah — ambil perangkap'),
    context: s(
      'XAUUSD M15. Equal highs have been tested three times. London session is opening. Watch the sequence develop and act on the trap.',
      'XAUUSD M15. High sama telah diuji tiga kali. Sesi London sedang dibuka. Perhatikan urutan berkembang dan bertindak atas perangkap.'
    ),
    candles: sweepShort(6401),
    revealTo: 26,
    task: {
      type: 'decide',
      question: s(
        'Price wicks above the equal highs, closes back below with a strong red body. What is the highest-quality decision?',
        'Harga melepasi high sama dengan bayang, ditutup semula di bawah dengan badan merah kuat. Apakah keputusan paling berkualiti?'
      ),
      options: [
        { id: 'sell', label: s('Sell (short) with stop above the sweep high', 'Jual (singkat) dengan stop di atas high sweep') },
        { id: 'buy', label: s('Buy the breakout above the highs', 'Beli breakout di atas high') },
        { id: 'no-trade', label: s('No trade — wait for more information', 'Tiada dagangan — tunggu lebih banyak maklumat') },
      ],
      correct: 'sell',
      explain: {
        sell: s(
          'Textbook sweep trade: liquidity above the highs was taken (stops + breakout orders filled), the close back below rejected the breakout, and strong red candles show displacement. Stop above the sweep high = structural invalidation; targets at the lows below = sell-side liquidity.',
          'Dagangan sweep teksbook: kecairan di atas high diambil (stop + order breakout terisi), penutupan di bawah menolak breakout, dan lilin merah kuat menunjukkan anjakan. Stop di atas high sweep = pembatalan struktur; sasaran pada rendah di bawah = kecairan jual.'
        ),
        buy: s(
          'Buying after the sweep candle closed back below the highs means buying INTO trap resolution — the exact moment trapped buyers are being liquidated. The breakout already failed its first test.',
          'Membeli selepas lilin sweep ditutup semula di bawah high bermakna membeli KE DALAM penyelesaian perangkap — saat tepat pembeli terperangkap dilikuidasi. Breakout telah gagal ujian pertamanya.'
        ),
        'no-trade': s(
          'Waiting is usually safe — but this is one of the clearest setups in the curriculum: pool + sweep + close back + displacement. When your written setup appears in full, executing IS the discipline.',
          'Menunggu biasanya selamat — tetapi ini antara setup paling jelas dalam kurikulum: kolam + sweep + tutup kembali + anjakan. Apabila setup bertulis anda muncul sepenuhnya, melaksanakan ITULAH disiplin.'
        ),
      },
    },
    xp: 90,
  },
  {
    id: 'sc-sweep-invalid',
    tier: 'intermediate',
    levelId: 'l3',
    title: s('Invalid sweep — don\'t force it', 'Sweep tidak sah — jangan paksa'),
    context: s(
      'A similar liquidity setup — but watch the CLOSE carefully. Not every poke above highs is a sweep.',
      'Setup kecairan serupa — tetapi perhatikan PENUTUPAN dengan teliti. Bukan setiap sentuhan di atas high ialah sweep.'
    ),
    candles: compose([
      injectBreak(makeRange({ seed: 6501, lo: 2388, hi: 2400, count: 18 }), { at: 17, level: 2399, direction: 'up', seed: 6502 }),
      makeTrend({ seed: 6503, start: 2402, count: 18, dir: 1, strength: 1.35, vol: 1.8 }),
    ]),
    revealTo: 24,
    task: {
      type: 'decide',
      question: s(
        'Price pushes above the range highs and CLOSES above them, with follow-through candles continuing upward. A "guru" calls it a sweep. Your analysis?',
        'Harga menolak melepasi high range dan DITUTUP di atasnya, dengan lilin susulan meneruskan ke atas. Seorang "guru" memanggilnya sweep. Analisis anda?'
      ),
      options: [
        { id: 'buy', label: s('This is a valid breakout continuation — look for pullback longs', 'Ini penerusan breakout sah — cari long pullback') },
        { id: 'sell', label: s('Sell — every push above highs is a sweep', 'Jual — setiap tolakan di atas high ialah sweep') },
        { id: 'no-trade', label: s('No-trade — information unavailable', 'Tiada dagangan — maklumat tidak tersedia') },
      ],
      correct: 'buy',
      explain: {
        buy: s(
          'Correct. The candle CLOSED above the level and price kept going — that is displacement-based continuation, not a sweep. The rule is behavioural: close back inside = trap; close outside with follow-through = genuine breakout. Pullbacks to the broken level are the conservative entries.',
          'Betul. Lilin DITUTUP di atas paras dan harga terus bergerak — itu penerusan berasaskan anjakan, bukan sweep. Peraturannya bersifat kelakuan: tutup semula ke dalam = perangkap; tutup di luar dengan susulan = breakout sebenar. Pullback ke paras yang pecah ialah entri konservatif.'
        ),
        sell: s(
          'This is the most expensive pattern-matching error: seeing "sweeps" where none exist. The defining feature of a sweep is the CLOSE BACK INSIDE. Selling a genuine breakout is how accounts get run over.',
          'Ini ralat padanan-corak paling mahal: melihat "sweep" di mana tiada wujud. Ciri penentu sweep ialah PENUTUPAN KEMBALI KE DALAM. Menjual breakout sebenar ialah bagaimana akaun dilanggar.'
        ),
        'no-trade': s(
          'The information IS available: closes above the level + follow-through = breakout behaviour. You can wait for a pullback entry (conservative), but classifying it as "unknown" ignores clear evidence.',
          'Maklumat itu ADA: penutupan di atas paras + susulan = kelakuan breakout. Anda boleh tunggu entri pullback (konservatif), tetapi mengklasifikasikannya sebagai "tidak diketahui" mengabaikan bukti jelas.'
        ),
      },
    },
    xp: 90,
  },
  {
    id: 'sc-fvg',
    tier: 'intermediate',
    levelId: 'l3',
    title: s('Mark the imbalance', 'Tanda ketidakseimbangan'),
    context: s(
      'A fast move just occurred on XAUUSD M15. Imbalances were left behind.',
      'Pergerakan pantas baru sahaja berlaku pada XAUUSD M15. Ketidakseimbangan telah ditinggalkan.'
    ),
    candles: (() => {
      let base = makeTrend({ seed: 6601, start: 2400, count: 12, dir: -1, strength: 1.1, vol: 1.8 });
      base = injectFVG(base, { at: 7, direction: 'bear', seed: 6602, gap: 3.6 });
      return compose([base, makeWalk({ seed: 6603, start: 2382, count: 18, vol: 1.5, drift: 0.22 })]);
    })(),
    revealTo: 28,
    task: {
      type: 'identify',
      question: s('Tap the Fair Value Gap created by the fast fall.', 'Ketik Fair Value Gap yang dicipta oleh kejatuhan pantas.'),
      targets: [{ x: 8, p: 2394, r: 5, label: s('Bearish FVG', 'FVG bearish') }],
      minHits: 1,
      explain: s(
        'The FVG is the empty space between the wicks of candles 1 and 3 of the fast sequence. It marks momentary inefficiency — one-sided speed. Traders watch these areas for mitigation entries when price returns.',
        'FVG ialah ruang kosong antara bayang lilin 1 dan 3 urutan pantas. Ia menanda ketidakcekapan sementara — kelajuan satu pihak. Trader memerhati kawasan ini untuk entri mitigasi apabila harga kembali.'
      ),
    },
    xp: 80,
  },
  {
    id: 'sc-structure-shift',
    tier: 'intermediate',
    levelId: 'l3',
    title: s('Spot the CHoCH', 'Kesan CHoCH'),
    context: s(
      'An uptrend has been running for hours. One moment changes everything.',
      'Uptrend telah berjalan selama berjam-jam. Satu saat mengubah segalanya.'
    ),
    candles: compose([
      makeTrend({ seed: 6701, start: 2360, count: 26, dir: 1, strength: 1.3, vol: 2.0 }),
      makeTrend({ seed: 6702, start: 2396, count: 16, dir: -1, strength: 1.4, vol: 2.1 }),
    ]),
    revealTo: 30,
    task: {
      type: 'identify',
      question: s('Tap the candle that broke the last higher low — the CHoCH candle.', 'Ketik lilin yang memecahkan higher low terakhir — lilin CHoCH.'),
      targets: [{ x: 29, p: 2388, r: 5, label: s('CHoCH break', 'Pecahan CHoCH') }],
      minHits: 1,
      explain: s(
        'The CHoCH candle is the one that CLOSED below the last protective higher low. Everything after it is the market speaking a new structure language: lower highs, lower lows. First warning ≠ full reversal — but it ends the "trend is safe" assumption.',
        'Lilin CHoCH ialah yang DITUTUP di bawah higher low pelindung terakhir. Segala selepasnya ialah pasaran bertutur dalam bahasa struktur baharu: lower high, lower low. Amaran pertama ≠ pembalikan penuh — tetapi ia menamatkan andaian "trend selamat".'
      ),
    },
    xp: 85,
  },

  /* ---------------- ADVANCED ---------------- */
  {
    id: 'sc-trade-plan',
    tier: 'advanced',
    levelId: 'l4',
    title: s('Place the complete trade', 'Letakkan dagangan lengkap'),
    context: s(
      'Daily context is bullish. On M15, price swept sell-side liquidity (below equal lows) and printed a bullish CHoCH. It is now pulling back toward the origin of the displacement. Build the trade.',
      'Konteks harian bullish. Pada M15, harga menyapu kecairan jual (di bawah rendah sama) dan menghasilkan CHoCH bullish. Ia kini menarik balik ke arah asal anjakan. Bina dagangan.'
    ),
    candles: sweepLong(6801),
    revealTo: 28,
    task: {
      type: 'place-trade',
      question: s(
        'Place a BUY trade plan on the chart: entry in the pullback/displacement origin zone, stop below the sweep low, target at the recent highs (buy-side liquidity). Use the trade tool (entry → SL → TP).',
        'Letakkan pelan dagangan BUY pada carta: entri dalam zon pullback/asal anjakan, stop di bawah rendah sweep, sasaran pada high terkini (kecairan beli). Guna alat dagangan (entry → SL → TP).'
      ),
      key: {
        direction: 'buy',
        entryFrom: 2386,
        entryTo: 2392,
        slFrom: 2374,
        slTo: 2379,
        tpFrom: 2398,
        tpTo: 2406,
        minR: 2,
      },
      explain: s(
        'A complete plan: direction follows the bullish CHoCH after the SSL sweep; entry sits at the pullback/displacement origin (not chasing the rally); stop sits below the sweep low — the point where the idea is proven wrong; target sits at the opposing liquidity (recent highs) giving 2R+. This is what "planned trading" looks like.',
        'Pelan lengkap: arah mengikut CHoCH bullish selepas sweep SSL; entri duduk pada pullback/asal anjakan (bukan mengejar kenaikan); stop duduk di bawah rendah sweep — titik di mana idea terbukti salah; sasaran duduk pada kecairan bertentangan (high terkini) memberi 2R+. Inilah rupa "dagangan berancang".'
      ),
    },
    xp: 120,
  },
  {
    id: 'sc-news',
    tier: 'advanced',
    levelId: 'l5',
    title: s('The news dilemma', 'Dilema berita'),
    context: s(
      'Your checklist setup is forming perfectly on XAUUSD. You check the calendar: US CPI releases in 15 minutes.',
      'Setup senarai semak anda terbentuk sempurna pada XAUUSD. Anda menyemak kalendar: CPI AS dilepaskan dalam 15 minit.'
    ),
    candles: compose([
      makeWalk({ seed: 6901, start: 2400, count: 18, vol: 1.4, drift: 0.08 }),
      makeWalk({ seed: 6902, start: 2401, count: 3, vol: 8, drift: 1.5 }),
      makeTrend({ seed: 6903, start: 2406, count: 12, dir: -1, strength: 1.2, vol: 2.4 }),
    ]),
    revealTo: 20,
    task: {
      type: 'decide',
      question: s('CPI in 15 minutes, setup ready now. What does the professional playbook say?', 'CPI dalam 15 minit, setup sedia sekarang. Apa yang kata buku panduan profesional?'),
      options: [
        { id: 'no-trade', label: s('Stand aside through the release; trade only post-news structure', 'Ketepikan melalui pelepasan; dagangkan hanya struktur selepas berita') },
        { id: 'buy', label: s('Enter now — the setup is perfect', 'Masuk sekarang — setup sempurna') },
        { id: 'sell', label: s('Enter now with a wider stop for news volatility', 'Masuk sekarang dengan stop lebih luas untuk volatiliti berita') },
      ],
      correct: 'no-trade',
      explain: {
        'no-trade': s(
          'Correct. Pre-news entries face spread blowouts, slippage and two-way sweeps that no stop structure can reliably survive. Even a "perfect" pattern is degraded by event risk. The market offers fresh structures after the release — that is the professional entry window.',
          'Betul. Entri pra-berita berdepan letupan spread, gelinciran dan sapuan dua hala yang tiada struktur stop boleh terselamat dengan dipercayai. Malah corak "sempurna" terdegradasi oleh risiko peristiwa. Pasaran menawarkan struktur segar selepas pelepasan — itulah tetingkap entri profesional.'
        ),
        buy: s(
          'The pattern may be perfect — but the CONDITIONS are not. News volatility invalidates the normal risk model: your 1% planned risk can become 3% through slippage alone. Event risk overrides pattern quality.',
          'Corak mungkin sempurna — tetapi KEADAAN tidak. Volatiliti berita membatalkan model risiko normal: risiko terancang 1% anda boleh menjadi 3% melalui gelinciran semata-mata. Risiko peristiwa mengatasi kualiti corak.'
        ),
        sell: s(
          'A wider stop does not solve news risk — it multiplies it. If the stop must change to survive the event, the risk model has already broken. Wait, then trade the post-news structure with normal parameters.',
          'Stop lebih luas tidak menyelesaikan risiko berita — ia menggandakannya. Jika stop mesti berubah untuk terselamat daripada peristiwa, model risiko telah pun rosak. Tunggu, kemudian dagangkan struktur selepas berita dengan parameter normal.'
        ),
      },
    },
    xp: 110,
  },
  {
    id: 'sc-failed-setup',
    tier: 'advanced',
    levelId: 'l4',
    title: s('Explain the failure', 'Terangkan kegagalan'),
    context: s(
      'You took a textbook long from a demand zone. It failed and hit your stop. Now you must diagnose WHY — this is how real skill is built.',
      'Anda mengambil long teksbook dari zon permintaan. Ia gagal dan memukul stop anda. Kini anda mesti mendiagnosis KENAPA — beginilah kemahiran sebenar dibina.'
    ),
    candles: compose([
      makeTrend({ seed: 7001, start: 2418, count: 18, dir: -1, strength: 1.35, vol: 2.0 }),
      makeRange({ seed: 7002, lo: 2388, hi: 2396, count: 10 }),
      makeTrend({ seed: 7003, start: 2393, count: 12, dir: -1, strength: 1.2, vol: 1.9 }),
    ]),
    revealTo: 38,
    task: {
      type: 'decide',
      question: s(
        'You bought the demand zone with a proper stop. Price broke the zone and stopped you out. Later it fell further. What is the most useful diagnosis?',
        'Anda membeli zon permintaan dengan stop betul. Harga memecahkan zon dan menghentikan anda. Kemudian ia jatuh lagi. Apakah diagnosis paling berguna?'
      ),
      options: [
        { id: 'no-trade', label: s('The setup was valid; the loss was a planned cost — review sample size, not one trade', 'Setup sah; kerugian ialah kos terancang — semak saiz sampel, bukan satu dagangan') },
        { id: 'buy', label: s('The stop was too tight — widen stops next time', 'Stop terlalu ketat — lebarkan stop lain kali') },
        { id: 'sell', label: s('Trading is rigged — stop trading', 'Dagangan telah dimanipulasi — berhenti berdagang') },
      ],
      correct: 'no-trade',
      explain: {
        'no-trade': s(
          'Mature answer. A planned, correctly-sized loss is a WINNING PROCESS outcome — losses are the cost of a positive-expectancy business. Judge the DECISION, not the single result. Over a 50-trade sample, if the process is sound, the numbers follow. (Also check: was the HTF trend really supporting longs?)',
          'Jawapan matang. Kerugian terancang dan bersaiz betul ialah hasil PROSES MENANG — kerugian ialah kos perniagaan jangkaan positif. Nilai KEPUTUSAN, bukan hasil tunggal. Melepasi sampel 50 dagangan, jika proses mantap, nombor mengikut. (Juga semak: adakah trend HTF benar-benar menyokong long?)'
        ),
        buy: s(
          'Widening stops after a loss is how risk creeps upward. If the stop sat beyond invalidation, its width was correct. Review the CONTEXT (was the HTF hostile?) and the SAMPLE, not the stop distance reflexively.',
          'Melebarkan stop selepas kerugian ialah bagaimana risiko merayap naik. Jika stop berada melepasi pembatalan, lebarnya betul. Semak KONTEKS (adakah HTF bermusuhan?) dan SAMPEL, bukan jarak stop secara refleks.'
        ),
        sell: s(
          'One loss — even three losses — proves nothing about fairness. Markets are adversarial by nature; edge shows over samples. Blame-free, evidence-based review is the only path to improvement.',
          'Satu kerugian — malah tiga kerugian — tidak membuktikan apa-apa tentang keadilan. Pasaran bersifat menentang secara semula jadi; kelebihan muncul melepasi sampel. Semakan tanpa menyalahkan, berasaskan bukti ialah satu-satunya jalan penambahbaikan.'
        ),
      },
    },
    xp: 110,
  },

  /* ---------------- CERTIFICATION ---------------- */
  {
    id: 'sc-cert',
    tier: 'certification',
    levelId: 'l5',
    title: s('TIGERFX Certification Run', 'Larian Pensijilan TIGERFX'),
    context: s(
      'The final exam. HTF: bullish, price in discount of its range. M15: a sweep of sell-side liquidity just occurred, followed by a bullish displacement with an FVG. You must place the full trade — and defend every parameter.',
      'Peperiksaan akhir. HTF: bullish, harga dalam diskaun julatnya. M15: sweep kecairan jual baru sahaja berlaku, diikuti anjakan bullish dengan FVG. Anda mesti meletakkan dagangan penuh — dan mempertahankan setiap parameter.'
    ),
    candles: sweepLong(7101),
    revealTo: 30,
    task: {
      type: 'place-trade',
      question: s(
        'Execute the certification trade: BUY at the FVG/displacement origin zone, stop below the sweep low, target at the range highs. The grading checks direction, entry zone, structural stop, target and R:R ≥ 2.',
        'Laksanakan dagangan pensijilan: BELI pada zon FVG/asal anjakan, stop di bawah rendah sweep, sasaran pada high range. Penilaian menyemak arah, zon entri, stop struktur, sasaran dan R:R ≥ 2.'
      ),
      key: {
        direction: 'buy',
        entryFrom: 2385,
        entryTo: 2393,
        slFrom: 2373,
        slTo: 2379,
        tpFrom: 2397,
        tpTo: 2408,
        minR: 2,
      },
      explain: s(
        'This is the whole curriculum in one decision: HTF context (bullish, discount) → liquidity event (SSL sweep) → confirmation (bullish CHoCH/displacement) → entry zone (FVG origin) → structural invalidation (below sweep low) → liquidity target (range highs) → R:R discipline (2R+). If you placed this trade with those parameters, you are thinking like a trader.',
        'Ini keseluruhan kurikulum dalam satu keputusan: konteks HTF (bullish, diskaun) → peristiwa kecairan (sweep SSL) → pengesahan (CHoCH/anjakan bullish) → zon entri (asal FVG) → pembatalan struktur (di bawah rendah sweep) → sasaran kecairan (high range) → disiplin R:R (2R+). Jika anda meletakkan dagangan ini dengan parameter tersebut, anda berfikir seperti trader.'
      ),
    },
    xp: 250,
  },
];

export function scenariosByTier(tier: Scenario['tier']): Scenario[] {
  return SCENARIOS.filter((sc) => sc.tier === tier);
}

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((sc) => sc.id === id);
}
