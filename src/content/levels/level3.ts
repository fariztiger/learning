/* Level 3 — Smart Money Concepts */
import type { Lesson, Level } from '@/lib/types';
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
import { q, s, scn, scene, txt, widget } from '../helpers';

/* --- lesson 1: BOS/CHoCH scenes --- */
let bosBase = makeTrend({ seed: 3101, start: 2350, count: 26, dir: 1, strength: 1.25, vol: 1.9 });
const bosCandles = compose([
  bosBase,
  makeTrend({ seed: 3102, start: 2382, count: 12, dir: 1, strength: 1.5, vol: 1.8 }),
  makeTrend({ seed: 3103, start: 2400, count: 16, dir: -1, strength: 1.35, vol: 2.1 }),
]);

/* --- lesson 2/3: liquidity + sweep story (the flagship example) --- */
let sweepBase = makeRange({ seed: 3201, lo: 2388, hi: 2402, count: 26 });
sweepBase = injectEqualHighs(sweepBase, { indices: [8, 15, 22], level: 2401.2, seed: 21 });
sweepBase = injectSweep(sweepBase, { at: 25, level: 2401.2, side: 'high', seed: 22, hold: 2 });
const sweepCandles = compose([
  sweepBase,
  makeTrend({ seed: 3202, start: 2397, count: 14, dir: -1, strength: 1.3, vol: 2.0 }),
]);

/* --- order blocks / S&D --- */
const obCandles = compose([
  makeTrend({ seed: 3301, start: 2412, count: 10, dir: -1, strength: 1.0, vol: 1.7 }),
  makeTrend({ seed: 3302, start: 2398, count: 12, dir: 1, strength: 1.6, vol: 1.8 }),
  makeWalk({ seed: 3303, start: 2418, count: 8, vol: 1.4, drift: -0.15 }),
  makeTrend({ seed: 3304, start: 2416, count: 12, dir: 1, strength: 1.2, vol: 1.8 }),
]);

/* --- FVG lesson --- */
let fvgBase = makeTrend({ seed: 3401, start: 2385, count: 14, dir: -1, strength: 1.1, vol: 1.8 });
fvgBase = injectFVG(fvgBase, { at: 8, direction: 'bear', seed: 31, gap: 3.4 });
const fvgCandles = compose([
  fvgBase,
  makeWalk({ seed: 3402, start: 2372, count: 10, vol: 1.5, drift: 0.3 }),
  makeTrend({ seed: 3403, start: 2376, count: 12, dir: 1, strength: 1.3, vol: 1.9 }),
]);

/* --- displacement --- */
let dispBase = makeRange({ seed: 3501, lo: 2392, hi: 2400, count: 16 });
dispBase = injectFVG(dispBase, { at: 12, direction: 'bull', seed: 41, gap: 3.8 });
const dispCandles = compose([
  dispBase,
  makeTrend({ seed: 3502, start: 2406, count: 12, dir: 1, strength: 1.1, vol: 1.7 }),
  makeWalk({ seed: 3503, start: 2420, count: 12, vol: 1.6, drift: -0.35 }),
]);

/* --- premium/discount --- */
const pdCandles = makeTrend({ seed: 3601, start: 2360, count: 30, dir: 1, strength: 1.35, vol: 2.0 });

/* --- MTF scene --- */
const mtfCandles = makeWalk({ seed: 3701, start: 2400, count: 44, vol: 2.2, drift: 0.42 });

const l3Structure: Lesson = {
  id: 'l3-structure',
  levelId: 'l3',
  title: s('Market Structure: BOS & CHoCH', 'Struktur Pasaran: BOS & CHoCH'),
  summary: s(
    'Break of Structure vs Change of Character — the two events that tell you who is really in control.',
    'Break of Structure vs Change of Character — dua peristiwa yang memberitahu siapa yang benar-benar mengawal.'
  ),
  minutes: 11,
  xp: 60,
  skills: ['structure', 'smc'],
  steps: [
    txt(
      s('Structure events are the market\'s punctuation', 'Peristiwa struktur ialah tanda baca pasaran'),
      s(
        'BOS (Break of Structure) happens when price continues the trend by breaking the last swing high in an uptrend (or swing low in a downtrend). CHoCH (Change of Character) happens when price breaks the last protective swing AGAINST the trend — the first real warning that direction may be changing.',
        'BOS (Break of Structure) berlaku apabila harga meneruskan trend dengan memecahkan swing high terakhir dalam uptrend (atau swing low dalam downtrend). CHoCH (Change of Character) berlaku apabila harga memecahkan swing pelindung terakhir BERTENTANGAN trend — amaran sebenar pertama bahawa arah mungkin berubah.'
      ),
      {
        bullets: [
          s('BOS = trend continuation confirmed ("still in control").', 'BOS = pengesahan penerusan trend ("masih mengawal").'),
          s('CHoCH = first sign of reversal ("control is being contested").', 'CHoCH = tanda pertama pembalikan ("kawalan dicabar").'),
          s('MSS (Market Structure Shift) = an aggressive CHoCH with displacement — a stronger signal.', 'MSS (Market Structure Shift) = CHoCH agresif dengan anjakan — isyarat lebih kuat.'),
        ],
      }
    ),
    scn(
      s('BOS then CHoCH — a complete sentence', 'BOS kemudian CHoCH — ayat lengkap'),
      scene('l3-bos', bosCandles, [
        {
          caption: s(
            'Uptrend building: HH, HL, HH. Each break of a previous high is a BOS — the trend is confirming itself.',
            'Uptrend terbentuk: HH, HL, HH. Setiap pecahan high sebelumnya ialah BOS — trend mengesahkan dirinya.'
          ),
          state: {
            revealTo: 20,
            highlights: [{ from: 12, to: 20, tone: 'bull', label: s('BOS — continuation', 'BOS — penerusan') }],
          },
        },
        {
          caption: s(
            'One more push to a final high… then price turns and breaks the LAST higher low. That break is a CHoCH — the character of the market just changed.',
            'Satu tolakan lagi ke high terakhir… kemudian harga berpatah dan memecahkan higher low TERAKHIR. Pecahan itu ialah CHoCH — watak pasaran baru sahaja berubah.'
          ),
          state: {
            revealTo: 34,
            highlights: [{ from: 27, to: 34, tone: 'bear', label: s('CHoCH — warning', 'CHoCH — amaran') }],
          },
        },
        {
          caption: s(
            'After CHoCH, the market prints lower highs and lower lows — a downtrend. Traders who bought every pullback out of habit get trapped. Structure told them when to stop.',
            'Selepas CHoCH, pasaran menghasilkan lower high dan lower low — downtrend. Trader yang membeli setiap pullback secara kebiasaan terperangkap. Struktur memberitahu mereka bilanya untuk berhenti.'
          ),
          state: {
            revealTo: 53,
            highlights: [{ from: 35, to: 53, tone: 'bear', label: s('Downtrend confirmed', 'Downtrend disahkan') }],
          },
        },
      ])
    ),
    q(
      s('In an uptrend, price breaks the last higher low with a strong candle. What is this called?', 'Dalam uptrend, harga memecahkan higher low terakhir dengan lilin kuat. Apakah ini dipanggil?'),
      [
        {
          text: s('CHoCH — the first structural warning of a possible reversal.', 'CHoCH — amaran struktur pertama pembalikan mungkin.'),
          correct: true,
          why: s('Exactly. Breaking the protective swing against the trend = Change of Character. It opens the door to reversal scenarios; it does not guarantee them.', 'Tepat. Memecahkan swing pelindung bertentangan trend = Change of Character. Ia membuka pintu kepada skenario pembalikan; ia tidak menjaminnya.'),
        },
        {
          text: s('BOS — the trend is continuing.', 'BOS — trend diteruskan.'),
          why: s('BOS is a break in the direction of the trend (like breaking the last HIGH in an uptrend). Breaking the LOW against the trend is a different event.', 'BOS ialah pecahan mengikut arah trend (seperti memecahkan HIGH terakhir dalam uptrend). Memecahkan RENDAH bertentangan trend ialah peristiwa berbeza.'),
        },
        {
          text: s('A liquidity sweep.', 'Liquidity sweep.'),
          why: s('A sweep wicks beyond a level and closes back. Here the candle CLOSED below the low — that is a structural break, not just a sweep. (Level 3 lesson 3 covers sweeps properly.)', 'Sweep melebihi paras dengan bayang dan ditutup balik. Di sini lilin DITUTUP di bawah rendah — itu pecahan struktur, bukan sekadar sweep. (Pelajaran 3 Tahap 3 membahas sweep dengan betul.)'),
        },
      ]
    ),
    widget(
      'structure-builder',
      s('Structure drills', 'Latihan struktur'),
      s(
        'Mark the swings on practice charts — the lab tells you if you are reading BOS and CHoCH correctly.',
        'Tanda swing pada carta latihan — makmal memberitahu sama ada anda membaca BOS dan CHoCH dengan betul.'
      )
    ),
  ],
};

const l3Liquidity: Lesson = {
  id: 'l3-liquidity',
  levelId: 'l3',
  title: s('Liquidity: The Map Behind the Map', 'Kecairan: Peta Di Sebalik Peta'),
  summary: s(
    'Buy-side and sell-side liquidity, internal vs external, and why orders cluster where everyone can see them.',
    'Kecairan beli dan jual, dalaman vs luaran, dan mengapa order berkelompok di tempat yang semua orang nampak.'
  ),
  minutes: 11,
  xp: 60,
  skills: ['liquidity', 'smc'],
  steps: [
    txt(
      s('Liquidity is where orders live', 'Kecairan ialah tempat order hidup'),
      s(
        'Liquidity means available orders: stop losses, breakout orders, take profits. When many traders place stops above equal highs, an area of BUY-SIDE LIQUIDITY forms — a pool of orders waiting above price. Below equal lows sits SELL-SIDE LIQUIDITY.',
        'Kecairan bermaksud order tersedia: stop loss, order breakout, take profit. Apabila ramai trader meletak stop di atas high sama, kawasan KECAIRAN BELI terbentuk — kolam order menunggu di atas harga. Di bawah rendah sama duduk KECAIRAN JUAL.'
      ),
      {
        bullets: [
          s('External liquidity = beyond the major swing highs/lows (the "obvious" stops).', 'Kecairan luaran = melepasi swing high/rendah utama (stop yang "jelas").'),
          s('Internal liquidity = within the range: trendline stops, equal minor highs, session opens.', 'Kecairan dalaman = dalam range: stop garisan trend, high kecil sama, pembukaan sesi.'),
          s('Price is often drawn toward liquidity pools — this is a model of behaviour, not a crystal ball.', 'Harga sering tertarik ke kolam kecairan — ini model kelakuan, bukan bola kristal.'),
        ],
        callout: {
          tone: 'note',
          text: s(
            'Important honesty: we cannot see real order books in retail platforms. "Liquidity" here is a behavioural model inferred from visible price action — a map, not surveillance of institutions. Use it as one lens among several.',
            'Kejujuran penting: kita tidak boleh melihat buku order sebenar dalam platform runcit. "Kecairan" di sini ialah model kelakuan yang disimpulkan daripada tindakan harga yang kelihatan — satu pemandangan, bukan pengawasan institusi. Guna ia sebagai satu lensa antara beberapa.'
          ),
        },
      }
    ),
    scn(
      s('Build the liquidity map', 'Bina peta kecairan'),
      scene('l3-liquidity', sweepCandles, [
        {
          caption: s(
            'Price tests the same high multiple times. Each test leaves stop losses just above the highs — and breakout buy orders above too.',
            'Harga menguji high sama beberapa kali. Setiap ujian meninggalkan stop loss di atas high — dan order beli breakout juga di atas.'
          ),
          state: {
            revealTo: 18,
            highlights: [
              { from: 6, to: 10, tone: 'gold', label: s('Test 1', 'Ujian 1') },
              { from: 13, to: 17, tone: 'gold', label: s('Test 2', 'Ujian 2') },
            ],
          },
        },
        {
          caption: s(
            'Mark the level: this is BUY-SIDE LIQUIDITY (BSL). Everyone can see it — and that is exactly why price often goes there later.',
            'Tandakan paras: ini KECAIRAN BELI (BSL). Semua orang boleh nampaknya — dan itu sebab harga sering ke sana kemudian.'
          ),
          state: {
            revealTo: 22,
            highlights: [{ from: 6, to: 22, tone: 'bear', pFrom: 2400, pTo: 2403, label: s('Buy-side liquidity', 'Kecairan beli') }],
          },
        },
        {
          caption: s(
            'Below the recent lows lies sell-side liquidity (SSL) — the stops of buyers. The market now has a map: pools above and below. Watch what happens next in the sweep lesson.',
            'Di bawah rendah terkini terletak kecairan jual (SSL) — stop pembeli. Pasaran kini mempunyai peta: kolam di atas dan di bawah. Lihat apa berlaku seterusnya dalam pelajaran sweep.'
          ),
          state: {
            revealTo: 27,
            highlights: [{ from: 23, to: 27, tone: 'sky', pFrom: 2387, pTo: 2391, label: s('Sell-side liquidity', 'Kecairan jual') }],
          },
        },
      ])
    ),
    q(
      s('Why do liquidity pools form above obvious equal highs?', 'Mengapa kolam kecairan terbentuk di atas high sama yang jelas?'),
      [
        {
          text: s('Because both breakout buyers and short sellers\' stops cluster there.', 'Kerana kedua-dua pembeli breakout dan stop penjual singkat berkelompok di situ.'),
          correct: true,
          why: s('Exactly — two kinds of orders in one place: buy-stop entries above, and the stop losses of shorts above. That concentration is the "pool".', 'Tepat — dua jenis order di satu tempat: entri buy-stop di atas, dan stop loss penjual singkat di atas. Kepekatan itulah "kolam".'),
        },
        {
          text: s('Because banks publish their orders there.', 'Kerana bank menerbitkan order mereka di situ.'),
          why: s('Institutional orders are not published to retail. The model works precisely because stops are predictable — they sit where the technical logic is obvious.', 'Order institusi tidak diterbitkan kepada runcit. Model ini berfungsi tepat kerana stop boleh diramal — ia duduk di mana logik teknikal jelas.'),
        },
        {
          text: s('Because price magnets physically attract candles.', 'Kerana magnet harga menarik lilin secara fizikal.'),
          why: s('No magnets — just incentives. Large players need counterparties to fill big orders, and clustered stops provide that volume. Model, not magic.', 'Tiada magnet — hanya insentif. Pemain besar memerlukan pihak lawan untuk mengisi order besar, dan stop berkelompok menyediakan isipadu itu. Model, bukan magik.'),
        },
      ]
    ),
    widget(
      'sweep-spotter',
      s('Liquidity spotter', 'Pengesan kecairan'),
      s(
        'Scan charts for equal highs/lows and predict where the pools sit before price reaches them.',
        'Imbas carta untuk high/rendah sama dan ramal di mana kolam duduk sebelum harga sampai.'
      )
    ),
  ],
};

const l3Sweeps: Lesson = {
  id: 'l3-sweeps',
  levelId: 'l3',
  title: s('Liquidity Sweeps & Runs', 'Liquidity Sweep & Run'),
  summary: s(
    'The full sweep sequence — observe, identify, understand, practice. One of the highest-value setups in trading.',
    'Urutan sweep penuh — perhatikan, kenal pasti, fahami, latih. Antara setup paling bernilai dalam dagangan.'
  ),
  minutes: 13,
  xp: 70,
  skills: ['liquidity', 'smc', 'traps'],
  steps: [
    txt(
      s('The sweep: a story in five beats', 'Sweep: cerita dalam lima rentak'),
      s(
        'A liquidity sweep is when price trades BEYOND a pool of liquidity (equal highs/lows) and then closes back inside. The stops are triggered, breakout traders are trapped, and price often reverses. It looks like a breakout — and that is the point.',
        'Liquidity sweep ialah apabila harga didagangkan MELEBIHI kolam kecairan (high/rendah sama) kemudian ditutup semula ke dalam. Stop dicetuskan, trader breakout terperangkap, dan harga sering membalik. Ia kelihatan seperti breakout — dan itu tujuannya.'
      ),
      {
        bullets: [
          s('Beat 1: equal highs/lows form — the pool becomes visible.', 'Rentak 1: high/rendah sama terbentuk — kolam menjadi kelihatan.'),
          s('Beat 2: orders cluster around it (stops + breakout orders).', 'Rentak 2: order berkelompok di sekelilingnya (stop + order breakout).'),
          s('Beat 3: price drives beyond the level — the sweep.', 'Rentak 3: harga memandu melepasi paras — sweep.'),
          s('Beat 4: price closes back inside — the trap is sprung.', 'Rentak 4: harga ditutup semula ke dalam — perangkap terpicu.'),
          s('Beat 5: displacement away from the pool — the real move.', 'Rentak 5: anjakan menjauhi kolam — pergerakan sebenar.'),
        ],
      }
    ),
    scn(
      s('Beat 1–2: the pool forms', 'Rentak 1–2: kolam terbentuk'),
      scene('l3-sweep-a', sweepCandles.slice(0, 24), [
        {
          caption: s(
            'Candles forming. Two, three touches at almost the same high. Nothing dramatic — yet this is the most important development on the chart.',
            'Lilin terbentuk. Dua, tiga sentuhan pada hampir high yang sama. Tiada yang mendadak — namun ini perkembangan paling penting pada carta.'
          ),
          state: { revealTo: 10 },
        },
        {
          caption: s(
            'The equal highs are now highlighted. Above them: stops of short sellers and buy-stop orders of breakout traders. This cluster is the pool.',
            'High sama kini diserlahkan. Di atasnya: stop penjual singkat dan order buy-stop trader breakout. Kelompok ini ialah kolam.'
          ),
          state: {
            revealTo: 23,
            highlights: [{ from: 7, to: 22, tone: 'gold', pFrom: 2399.5, pTo: 2403, label: s('BSL pool', 'Kolam BSL') }],
          },
        },
      ])
    ),
    scn(
      s('Beat 3–5: the trap and the move', 'Rentak 3–5: perangkap dan pergerakan'),
      scene('l3-sweep-b', sweepCandles, [
        {
          caption: s(
            'Watch the candle that pokes above the highs. To a breakout trader, this looks like the moment they waited for.',
            'Perhatikan lilin yang menyentuh ke atas high. Kepada trader breakout, ini kelihatan seperti saat yang mereka nantikan.'
          ),
          state: {
            revealTo: 27,
            highlights: [{ from: 25, to: 27, tone: 'bear', label: s('The sweep', 'Sweep') }],
          },
        },
        {
          caption: s(
            'But price CLOSES back below the highs. The breakout fails within one candle. Buy-stops are filled and underwater; short stops were taken. Both groups now fuel the reversal.',
            'Tetapi harga DITUTUP semula di bawah high. Breakout gagal dalam satu lilin. Buy-stop terisi dan rugi; stop singkat diambil. Kedua-dua kumpulan kini membiayai pembalikan.'
          ),
          state: {
            revealTo: 31,
            highlights: [{ from: 25, to: 31, tone: 'bear', label: s('Close back inside', 'Tutup semula ke dalam') }],
            notes: [{ x: 27, p: 2403, tone: 'bear', text: s('Trapped', 'Terperangkap') }],
          },
        },
        {
          caption: s(
            'The displacement down begins — strong red candles, small pullbacks. Sweep traders call this the "real move": it runs toward the OTHER pool (sell-side liquidity below).',
            'Anjakan ke bawah bermula — lilin merah kuat, pullback kecil. Trader sweep memanggil ini "pergerakan sebenar": ia menuju ke kolam LAIN (kecairan jual di bawah).'
          ),
          state: {
            revealTo: 40,
            highlights: [{ from: 32, to: 40, tone: 'violet', label: s('Real move', 'Pergerakan sebenar') }],
          },
        },
      ])
    ),
    {
      kind: 'chartTask',
      title: s('Spot the sweep candle', 'Kesan lilin sweep'),
      instruction: s(
        'Tap the single candle that swept above the equal highs and closed back below.',
        'Ketik satu lilin yang menyapu ke atas high sama dan ditutup semula di bawah.'
      ),
      candles: sweepCandles,
      target: { x: 25, p: 2404, r: 4, label: s('Sweep candle', 'Lilin sweep') },
      hint: s('Long upper wick above the earlier highs, body closed back inside the range.', 'Bayang atas panjang melepasi high sebelumnya, badan ditutup semula dalam range.'),
      success: s(
        'Excellent — you found the sweep. The wick collected the liquidity above the highs; the close back inside rejected the breakout. This single candle contains the whole story.',
        'Cemerlang — anda menemui sweep. Bayang mengumpul kecairan di atas high; penutupan ke dalam menolak breakout. Lilin tunggal ini mengandungi seluruh cerita.'
      ),
      miss: s(
        'The sweep candle is the one whose WICK goes above the equal highs but whose BODY closes back below them. Look near the top of the range.',
        'Lilin sweep ialah yang BAYANGnya ke atas high sama tetapi BADANnya ditutup semula di bawahnya. Lihat berhampiran atas range.'
      ),
    },
    txt(
      s('Sweep vs continuation — the honest difference', 'Sweep vs perterusan — beza jujur'),
      s(
        'Not every poke beyond a level is a sweep. If price closes BEYOND the level and keeps going with displacement, that is continuation (a real breakout). If it closes back inside, it is a sweep (trap). Your decision point is the CLOSE and the FOLLOW-THROUGH — never the wick alone. When unsure: NO TRADE is a valid, professional answer.',
        'Tidak setiap sentuhan melepasi paras ialah sweep. Jika harga DITUTUP MELEPASI paras dan terus bergerak dengan anjakan, itu penerusan (breakout sebenar). Jika ditutup semula ke dalam, itu sweep (perangkap). Titik keputusan anda ialah PENUTUPAN dan SUSULAN — bukan bayang semata-mata. Jika tidak pasti: NO TRADE ialah jawapan sah dan profesional.'
      ),
      {
        callout: {
          tone: 'key',
          text: s(
            'Practice this in the Arena — "valid vs invalid sweep" scenarios give instant reasoning feedback.',
            'Latih ini di Arena — skenario "sweep sah vs tidak sah" memberi maklum balas pemikiran serta-merta.'
          ),
        },
      }
    ),
    q(
      s('Price wicks above equal highs but closes back below. What does the CLOSE tell you?', 'Harga melebihi high sama dengan bayang tetapi ditutup semula di bawah. Apa yang PENUTUPAN beritahu anda?'),
      [
        {
          text: s('The breakout failed at least for now — liquidity above was swept and rejected.', 'Breakout gagal buat masa ini — kecairan di atas telah disapu dan ditolak.'),
          correct: true,
          why: s('Correct. Closes represent agreement; wicks represent exploration. A close back inside after taking out the highs is the classic sweep signature.', 'Betul. Penutupan mewakili persetujuan; bayang mewakili penerokaan. Penutupan ke dalam selepas mengambil high ialah tanda tangan sweep klasik.'),
        },
        {
          text: s('Price will definitely now fall forever.', 'Harga kini pasti jatuh selamanya.'),
          why: s('Sweeps often lead to reversals, but "definitely forever" does not exist. Manage the trade with invalidation and targets like any other idea.', 'Sweep sering membawa kepada pembalikan, tetapi "pasti selamanya" tidak wujud. Urus dagangan dengan pembatalan dan sasaran seperti idea lain.'),
        },
        {
          text: s('Nothing — closes do not matter.', 'Tiada apa — penutupan tidak penting.'),
          why: s('Closes are the MOST important part of a candle — they mark what the market agreed on. Ignoring closes means ignoring evidence.', 'Penutupan ialah bahangan PALING penting dalam lilin — ia menandakan apa yang pasaran setujui. Mengabaikan penutupan bermaksud mengabaikan bukti.'),
        },
      ]
    ),
  ],
};

const l3SD: Lesson = {
  id: 'l3-sd',
  levelId: 'l3',
  title: s('Supply, Demand & Order Blocks', 'Bekalan, Permintaan & Order Block'),
  summary: s(
    'Where strong moves begin — and how to mark zones where the "smart money" decision likely happened.',
    'Di mana pergerakan kuat bermula — dan cara menanda zon di mana keputusan "wang pintar" mungkin berlaku.'
  ),
  minutes: 11,
  xp: 60,
  skills: ['smc', 'zones'],
  steps: [
    txt(
      s('Every strong move has an origin', 'Setiap pergerakan kuat mempunyai asal'),
      s(
        'A demand zone is the last down-candles before a strong upward move. A supply zone is the last up-candles before a strong downward move. The idea: significant decisions were made there, and if price returns, those areas may react again. In SMC language these are called Order Blocks.',
        'Zon permintaan ialah lilin turun terakhir sebelum pergerakan naik kuat. Zon bekalan ialah lilin naik terakhir sebelum pergerakan turun kuat. Ideanya: keputusan penting dibuat di situ, dan jika harga kembali, kawasan itu mungkin bertindak balas semula. Dalam bahasa SMC ia dipanggil Order Block.'
      ),
      {
        bullets: [
          s('Quality zone = the origin of a move with displacement (big candles away).', 'Zon berkualiti = asal pergerakan dengan anjakan (lilin besar menjauh).'),
          s('The tighter the zone, the better the risk definition.', 'Lebih ketat zon, lebih baik takrifan risiko.'),
          s('Mitigation = price returning to a zone and "using it up" — each touch weakens it.', 'Mitigasi = harga kembali ke zon dan "menggunakannya" — setiap sentuhan melemahkannya.'),
        ],
      }
    ),
    scn(
      s('Mark the origin', 'Tanda asal'),
      scene('l3-ob', obCandles, [
        {
          caption: s(
            'Price falls… then a strong, fast rally begins. Look at the LAST down candles before the launch — that is the demand zone / bullish order block.',
            'Harga jatuh… kemudian kenaikan kuat dan pantas bermula. Lihat lilin turun TERAKHIR sebelum pelancaran — itu zon permintaan / order block bullish.'
          ),
          state: {
            revealTo: 21,
            highlights: [{ from: 9, to: 13, tone: 'bull', pFrom: 2394, pTo: 2402, label: s('Demand / OB', 'Permintaan / OB') }],
          },
        },
        {
          caption: s(
            'Later, price pulls back INTO the zone and rallies again. The zone "worked" — but notice it took time and did not react instantly. Zones are areas of interest, not entry buttons.',
            'Kemudian harga menarik balik KE DALAM zon dan naik semula. Zon "berfungsi" — tetapi perhatikan ia mengambil masa dan tidak bertindak serta-merta. Zon ialah kawasan minat, bukan butang entri.'
          ),
          state: {
            revealTo: 32,
            highlights: [{ from: 26, to: 32, tone: 'gold', label: s('Mitigation', 'Mitigasi') }],
          },
        },
        {
          caption: s(
            'After mitigation, the zone is weaker. Fresh zones (untouched) carry more weight than zones price has already revisited.',
            'Selepas mitigasi, zon menjadi lebih lemah. Zon baharu (tidak disentuh) membawa lebih berat daripada zon yang telah dilawati semula harga.'
          ),
          state: { revealTo: 41 },
        },
      ])
    ),
    q(
      s('What makes a high-quality order block?', 'Apa yang menjadikan order block berkualiti?'),
      [
        {
          text: s('It is the origin of a displacement move and remains unmitigated.', 'Ia asal pergerakan anjakan dan kekal belum mitigasi.'),
          correct: true,
          why: s('Yes. Displacement shows real decision energy; unmitigated means the zone is still "fresh". Both criteria come from observable price action.', 'Ya. Anjakan menunjukkan tenaga keputusan sebenar; belum mitigasi bermakna zon masih "baharu". Kedua-dua kriteria datang daripada tindakan harga yang boleh diperhatikan.'),
        },
        {
          text: s('It is very large and has been touched five times.', 'Ia sangat besar dan telah disentuh lima kali.'),
          why: s('Large, heavily-tested zones are weak zones — the orders there have been used up. Shrink to the origin candle cluster.', 'Zon besar yang banyak diuji ialah zon lemah — order di situ telah digunakan. Kecilkan kepada kelompok lilin asal.'),
        },
        {
          text: s('It appears on a broker\'s news calendar.', 'Ia muncul pada kalendar berita broker.'),
          why: s('News calendars schedule events; order blocks are price-action features. Different tools entirely.', 'Kalendar berita menjadualkan peristiwa; order block ialah ciri tindakan harga. Alat yang berbeza sepenuhnya.'),
        },
      ]
    ),
  ],
};

const l3FVG: Lesson = {
  id: 'l3-fvg',
  levelId: 'l3',
  title: s('Fair Value Gaps (FVG)', 'Fair Value Gap (FVG)'),
  summary: s(
    'Imbalances left by fast moves — where price "owes" a revisit, and how traders use them.',
    'Ketidakseimbangan yang ditinggalkan pergerakan pantas — di mana harga "berhutang" lawatan semula, dan bagaimana trader menggunakannya.'
  ),
  minutes: 11,
  xp: 60,
  skills: ['smc', 'fvg'],
  steps: [
    txt(
      s('When speed leaves a gap', 'Apabila kelajuan meninggalkan jurang'),
      s(
        'In a fast move, the third candle can leave a gap between its low and the first candle\'s high (bullish FVG) — an area price traded through so quickly that only one side was served. Traders watch these imbalances as magnets and reaction zones.',
        'Dalam pergerakan pantas, lilin ketiga boleh meninggalkan jurang antara rendahnya dan high lilin pertama (FVG bullish) — kawasan yang dilalui harga terlalu pantas sehingga hanya satu pihak dilayan. Trader memerhati ketidakseimbangan ini sebagai magnet dan zon tindak balas.'
      ),
      {
        bullets: [
          s('Bullish FVG: low of candle 3 is ABOVE high of candle 1 — a gap "below" price.', 'FVG bullish: rendah lilin 3 DI ATAS high lilin 1 — jurang "di bawah" harga.'),
          s('Bearish FVG: high of candle 3 BELOW low of candle 1 — a gap "above" price.', 'FVG bearish: high lilin 3 DI BAWAH rendah lilin 1 — jurang "di atas" harga.'),
          s('FVGs often pair with displacement candles — they are the shadow of speed.', 'FVG sering berpasangan dengan lilin anjakan — ia bayang kelajuan.'),
          s('Price may fill (mitigate) the gap later — partially or fully.', 'Harga mungkin mengisi (mitigasi) jurang kemudian — sebahagian atau sepenuhnya.'),
        ],
      }
    ),
    scn(
      s('Watch an FVG being created', 'Perhatikan FVG dicipta'),
      scene('l3-fvg', fvgCandles, [
        {
          caption: s(
            'Downtrend in progress. Then one candle falls hard — with so much speed that a gap forms between candle 1 and candle 3.',
            'Downtrend berjalan. Kemudian satu lilin jatuh teruk — dengan kelajuan sehingga jurang terbentuk antara lilin 1 dan lilin 3.'
          ),
          state: {
            revealTo: 10,
            highlights: [{ from: 7, to: 10, tone: 'bear', label: s('Displacement', 'Anjakan') }],
          },
        },
        {
          caption: s(
            'The shaded area between the wicks is the Fair Value Gap — an inefficiency. Note how the move continues away from it first: gaps rarely fill instantly during strong momentum.',
            'Kawasan berlorek antara bayang ialah Fair Value Gap — satu ketidakcekapan. Perhatikan bagaimana pergerakan menjauhinya dahulu: jurang jarang diisi serta-merta semasa momentum kuat.'
          ),
          state: {
            revealTo: 16,
            highlights: [{ from: 8, to: 14, tone: 'sky', pFrom: 2370.5, pTo: 2375.5, label: s('FVG', 'FVG') }],
          },
        },
        {
          caption: s(
            'Later, price climbs back and trades INTO the gap. This "fill" is called mitigation. Notice: entering right at the gap edge is aggressive; waiting for a reaction inside it is conservative.',
            'Kemudian harga naik semula dan didagangkan KE DALAM jurang. "Isian" ini dipanggil mitigasi. Perhatian: memasukinya tepat di tepi jurang adalah agresif; menunggu tindak balas di dalamnya adalah konservatif.'
          ),
          state: {
            revealTo: 35,
            highlights: [{ from: 26, to: 35, tone: 'gold', label: s('Mitigation / fill', 'Mitigasi / isian') }],
          },
        },
      ])
    ),
    {
      kind: 'chartTask',
      title: s('Find the FVG', 'Cari FVG'),
      instruction: s(
        'Tap the gap between candle 1 and candle 3 of the fast move — the Fair Value Gap.',
        'Ketik jurang antara lilin 1 dan lilin 3 pergerakan pantas — Fair Value Gap.'
      ),
      candles: fvgCandles,
      target: { x: 9, p: 2373, r: 4.5, label: s('FVG', 'FVG') },
      hint: s('It is inside the strong fall — between the wicks of the candles surrounding the biggest one.', 'Ia di dalam kejatuhan kuat — antara bayang lilin mengelilingi yang terbesar.'),
      success: s(
        'That is the gap. You are looking at market inefficiency — the footprint of speed. In Level 4 you will use these as entry areas with confirmation.',
        'Itulah jurangnya. Anda melihat ketidakcekapan pasaran — tapak kelajuan. Di Tahap 4 anda akan gunakan ini sebagai kawasan entri dengan pengesahan.'
      ),
      miss: s(
        'The FVG is the empty AREA between the wick of the first candle and the wick of the third candle of the fast sequence — usually mid-move.',
        'FVG ialah KOSONG antara bayang lilin pertama dan bayang lilin ketiga urutan pantas — biasanya pertengahan pergerakan.'
      ),
    },
    widget(
      'fvg-finder',
      s('FVG finder drill', 'Latihan pencari FVG'),
      s(
        'Random charts, one job: click every gap you can find. Speed and accuracy both count.',
        'Carta rawak, satu tugas: klik setiap jurang yang anda jumpai. Kelajuan dan ketepatan dikira.'
      )
    ),
    q(
      s('A bullish FVG forms during a rally. Price later returns to it. What is the conservative play?', 'FVG bullish terbentuk semasa kenaikan. Harga kembali kepadanya kemudian. Apakah permainan konservatif?'),
      [
        {
          text: s('Wait for a reaction candle inside/above the gap before considering entry.', 'Tunggu lilin tindak balas di dalam/atas jurang sebelum mempertimbangkan entri.'),
          correct: true,
          why: s('Good discipline. Gaps are areas of interest, not guarantees. Confirmation reduces the chance of catching a falling knife through the zone.', 'Disiplin baik. Jurang ialah kawasan minat, bukan jaminan. Pengesahan mengurangkan peluang menangkap pisau jatuh menembusi zon.'),
        },
        {
          text: s('Buy instantly at the first touch, full size.', 'Beli serta-merta pada sentuhan pertama, saiz penuh.'),
          why: s('Aggressive entries at unconfirmed zones are how accounts bleed. If you do scale in, size small and define invalidation below the gap.', 'Entri agresif pada zon belum disahkan ialah bagaimana akaun berdarah. Jika masuk berperingkat, saiz kecil dan takrifkan pembatalan di bawah jurang.'),
        },
        {
          text: s('Ignore it — gaps never matter.', 'Abaikan — jurang tidak pernah penting.'),
          why: s('Gaps are one of the most-watched features of modern price action. Ignoring them is optional — understanding them is not.', 'Jurang antara ciri paling diperhatikan dalam tindakan harga moden. Mengabaikannya adalah pilihan — memahaminya bukan.'),
        },
      ]
    ),
  ],
};

const l3Displacement: Lesson = {
  id: 'l3-displacement',
  levelId: 'l3',
  title: s('Displacement & Momentum', 'Anjakan & Momentum'),
  summary: s(
    'How to read the energy of the market — the difference between drifting and deciding.',
    'Cara membaca tenaga pasaran — beza antara hanyut dan membuat keputusan.'
  ),
  minutes: 9,
  xp: 55,
  skills: ['smc', 'momentum'],
  steps: [
    txt(
      s('Energy leaves fingerprints', 'Tenaga meninggalkan cap jari'),
      s(
        'Displacement is a strong, one-sided move: large bodies, aligned direction, small opposite wicks, often leaving an FVG. It shows decision — one side pressing with intent. Drifting candles (small, overlapping, alternating) show indecision.',
        'Anjakan ialah pergerakan kuat satu pihak: badan besar, arah sejajar, bayang bertentangan kecil, sering meninggalkan FVG. Ia menunjukkan keputusan — satu pihak menekan dengan niat. Lilin hanyut (kecil, bertindih, berselang-seli) menunjukkan kebimbangan.'
      ),
      {
        bullets: [
          s('Displacement through a level = conviction (BOS likely valid).', 'Anjakan melepasi paras = keyakinan (BOS mungkin sah).'),
          s('Displacement away from a zone = the zone defended successfully.', 'Anjakan menjauhi zon = zon dipertahankan berjaya.'),
          s('Loss of displacement = momentum fading — manage expectations.', 'Kehilangan anjakan = momentum pudar — urus jangkaan.'),
        ],
      }
    ),
    scn(
      s('From drift to decision', 'Daripada hanyut kepada keputusan'),
      scene('l3-disp', dispCandles, [
        {
          caption: s(
            'A quiet range: small candles, no commitment. This is drift — energy stored but not released.',
            'Range tenang: lilin kecil, tiada komitmen. Ini hanyut — tenaga tersimpan tetapi tidak dilepaskan.'
          ),
          state: {
            revealTo: 15,
            highlights: [{ from: 0, to: 15, tone: 'mist', label: s('Drift', 'Hanyut') }],
          },
        },
        {
          caption: s(
            'Then: three large green candles, minimal upper wicks, leaving a gap behind. This is displacement — a decision was made.',
            'Kemudian: tiga lilin hijau besar, bayang atas minimum, meninggalkan jurang. Ini anjakan — keputusan telah dibuat.'
          ),
          state: {
            revealTo: 22,
            highlights: [{ from: 16, to: 21, tone: 'bull', label: s('Displacement', 'Anjakan') }],
            notes: [{ x: 18, p: 2407, tone: 'bull', text: s('FVG behind', 'FVG di belakang') }],
          },
        },
        {
          caption: s(
            'The move extends, then momentum fades — smaller candles, choppier. Traders who bought the FIRST displacement and planned exits early keep profit; those who chase the exhausted move pay them.',
            'Pergerakan melanjut, kemudian momentum pudar — lilin lebih kecil, lebih berombak. Trader yang membeli anjakan PERTAMA dan merancang keluar awal menyimpan untung; yang mengejar pergerakan habis membayar mereka.'
          ),
          state: {
            revealTo: 39,
            highlights: [{ from: 30, to: 39, tone: 'gold', label: s('Momentum fading', 'Momentum pudar') }],
          },
        },
      ])
    ),
    q(
      s('Which candle sequence best signals displacement?', 'Urutan lilin mana paling baik menandakan anjakan?'),
      [
        {
          text: s('Three same-direction large-bodied candles with small opposing wicks and a gap left behind.', 'Tiga lilin berbadan besar satu arah dengan bayang bertentangan kecil dan jurang ditinggalkan.'),
          correct: true,
          why: s('That is the textbook signature: speed, one-sidedness and an inefficiency (gap). Displacement is the visual proof of decision.', 'Itu tanda tangan teksbook: kelajuan, satu pihak dan ketidakcekapan (jurang). Anjakan ialah bukti visual keputusan.'),
        },
        {
          text: s('Ten alternating tiny candles.', 'Sepuluh lilin kecil berselang-seli.'),
          why: s('That is the definition of drift/indecision — the opposite of displacement.', 'Itu definisi hanyut/kebimbangan — bertentangan dengan anjakan.'),
        },
        {
          text: s('One candle with a huge wick but tiny body.', 'Satu lilin dengan bayang besar tetapi badan kecil.'),
          why: s('Big wicks show rejection (a fight), not one-sided decision (a conquest). Related concept — different meaning.', 'Bayang besar menunjukkan penolakan (pertarungan), bukan keputusan satu pihak (penaklukan). Konsep berkaitan — makna berbeza.'),
        },
      ]
    ),
  ],
};

const l3PD: Lesson = {
  id: 'l3-premium',
  levelId: 'l3',
  title: s('Premium, Discount & Fibonacci', 'Premium, Discount & Fibonacci'),
  summary: s(
    'Why buying high feels clever and loses money — and how range anchoring finds fair areas to deal in.',
    'Mengapa membeli tinggi terasa bijak dan kehilangan wang — dan bagaimana penambatan range mencari kawasan adil untuk berdagang.'
  ),
  minutes: 10,
  xp: 55,
  skills: ['smc', 'fibonacci'],
  steps: [
    txt(
      s('Buy cheap, sell dear', 'Beli murah, jual mahal'),
      s(
        'Anchor Fibonacci (or simply the range) to the most recent major swing: the top (premium) and bottom (discount) with the midpoint (equilibrium). Buying in premium = paying above fair value; buying in discount = paying below. This does not predict direction — it improves WHERE you engage relative to the range.',
        'Tambat Fibonacci (atau hanya range) pada swing utama terkini: atas (premium) dan bawah (discount) dengan titik tengah (keseimbangan). Membeli dalam premium = membayar melebihi nilai adil; membeli dalam discount = membayar di bawah. Ini tidak meramal arah — ia memperbaiki DI MANA anda berinteraksi berbanding range.'
      ),
      {
        bullets: [
          s('Premium = upper half of the range — favour sells/TP of longs.', 'Premium = separuh atas range — utamakan jual/TP long.'),
          s('Discount = lower half — favour buys/TP of shorts.', 'Discount = separuh bawah — utamakan beli/TP singkat.'),
          s('Key fib pockets: 0.5 (equilibrium), 0.618–0.705 (deep discount/premium).', 'Poket fib utama: 0.5 (keseimbangan), 0.618–0.705 (diskaun/premium dalam).'),
        ],
      }
    ),
    scn(
      s('The range and its halves', 'Range dan separuhnya'),
      scene('l3-pd', pdCandles, [
        {
          caption: s(
            'A swing from the low to the high. Draw the range: the high is premium, the low is discount, the middle is equilibrium.',
            'Swing dari rendah ke tinggi. Lukis range: tinggi ialah premium, rendah ialah discount, tengah ialah keseimbangan.'
          ),
          state: {
            revealTo: 22,
            highlights: [
              { from: 0, to: 29, tone: 'bear', pFrom: 2400, pTo: 2418, label: s('Premium', 'Premium') },
              { from: 0, to: 29, tone: 'bull', pFrom: 2352, pTo: 2372, label: s('Discount', 'Discount') },
            ],
          },
        },
        {
          caption: s(
            'Notice the sharpest rallies begin in discount and stall in premium. Not always — but often enough to build a rule around it.',
            'Perhatikan kenaikan paling tajam bermula dalam discount dan tersekat dalam premium. Tidak selalu — tetapi cukup kerap untuk membina peraturan mengelilinginya.'
          ),
          state: {
            revealTo: 29,
            highlights: [{ from: 0, to: 29, tone: 'gold', pFrom: 2372, pTo: 2400, label: s('Equilibrium (0.5)', 'Keseimbangan (0.5)') }],
          },
        },
      ])
    ),
    q(
      s('An uptrend pulls back into the discount half of its range with bullish confirmation. What does premium/discount analysis suggest?', 'Uptrend menarik balik ke separuh discount rangenya dengan pengesahan bullish. Apa yang analisis premium/discount cadangkan?'),
      [
        {
          text: s('This is a favourable area to look for longs — buying at relative fair value or below.', 'Ini kawasan berfaedah untuk mencari long — membeli pada nilai adil relatif atau ke bawah.'),
          correct: true,
          why: s('Well reasoned. The tool does not guarantee a win — it stacks location in your favour, so the same setup in discount has better expectancy than in premium.', 'Pemikiran baik. Alat ini tidak menjamin kemenangan — ia menyusun lokasi memihak kepada anda, jadi setup sama dalam discount mempunyai jangkaan lebih baik berbanding premium.'),
        },
        {
          text: s('It guarantees the uptrend resumes.', 'Ia menjamin uptrend disambung.'),
          why: s('No guarantee — price can break the range entirely. "Favourable area" is about odds and R:R, not certainty.', 'Tiada jaminan — harga boleh memecahkan range sepenuhnya. "Kawasan berfaedah" tentang peluang dan R:R, bukan kepastian.'),
        },
        {
          text: s('It means you should only sell.', 'Ia bermaksud anda patut menjual sahaja.'),
          why: s('Selling into a discount during an uptrend is the LOWEST quality use of this tool. The tool matches action to location: buys in discount, sells in premium.', 'Menjual dalam discount semasa uptrend ialah penggunaan alat ini yang PALING rendah kualitinya. Alat ini memadankan tindakan dengan lokasi: beli dalam discount, jual dalam premium.'),
        },
      ]
    ),
  ],
};

const l3MTF: Lesson = {
  id: 'l3-mtf',
  levelId: 'l3',
  title: s('Multi-Timeframe Analysis', 'Analisis Pelbagai Timeframe'),
  summary: s(
    'Top-down context: where the big picture points, and where the small picture triggers.',
    'Konteks atas-ke-bawah: ke mana gambaran besar menunjuk, dan di mana gambaran kecil mencetuskan.'
  ),
  minutes: 10,
  xp: 55,
  skills: ['mtf', 'smc', 'process'],
  steps: [
    txt(
      s('Zoom out to decide, zoom in to act', 'Zoom keluar untuk memutus, zoom masuk untuk bertindak'),
      s(
        'Multi-timeframe analysis (MTF) is simple in principle: read the higher timeframe (HTF) for DIRECTION and key zones, then drop to a lower timeframe (LTF) for PRECISION entry. Never let the LTF talk you out of the HTF context — and never enter on the LTF without the HTF permission.',
        'Analisis pelbagai timeframe (MTF) mudah pada dasarnya: baca timeframe lebih tinggi (HTF) untuk ARAH dan zon utama, kemudian turun ke timeframe lebih rendah (LTF) untuk ketepatan entri. Jangan biarkan LTF memujuk anda keluar dari konteks HTF — dan jangan masuk pada LTF tanpa kebenaran HTF.'
      ),
      {
        bullets: [
          s('HTF (H4/D1): trend, premium/discount, major zones.', 'HTF (H4/D1): trend, premium/discount, zon utama.'),
          s('Mid TF (H1): structure shifts, BOS/CHoCH, working zones.', 'TF tengah (H1): anjakan struktur, BOS/CHoCH, zon kerja.'),
          s('LTF (M5–M15): entry triggers, precise stops.', 'LTF (M5–M15): pencetus entri, stop tepat.'),
          s('The classic beginner mistake: perfect LTF entry against a hostile HTF.', 'Kesilapan klasik pemula: entri LTF sempurna menentang HTF yang bermusuhan.'),
        ],
      }
    ),
    widget(
      'mtf-lab',
      s('Multi-timeframe lab', 'Makmal pelbagai timeframe'),
      s(
        'See one market at three timeframes side by side. Make the top-down call before the lab reveals the coaching.',
        'Lihat satu pasaran pada tiga timeframe bersebelahan. Buat panggilan atas-ke-bawah sebelum makmal mendedahkan bimbingan.'
      )
    ),
    q(
      s('HTF is bearish in premium. LTF shows a beautiful bullish pattern. What is the disciplined read?', 'HTF bearish dalam premium. LTF menunjukkan corak bullish cantik. Apakah bacaan berdisiplin?'),
      [
        {
          text: s('Skip the long — the LTF pattern is a pullback trade against HTF context.', 'Langkau long — corak LTF ialah dagangan pullback menentang konteks HTF.'),
          correct: true,
          why: s('Correct. Counter-context LTF patterns are usually trap fuel. The filter that saves the most money in trading is "does the HTF agree?".', 'Betul. Corak LTF lawan-konteks biasanya bahan api perangkap. Penapis yang menjimatkan paling banyak wang dalam dagangan ialah "adakah HTF bersetuju?".'),
        },
        {
          text: s('Take it with full size — the LTF is always right.', 'Ambil dengan saiz penuh — LTF sentiasa betul.'),
          why: s('LTF detail is only meaningful WITHIN a context. Full-size counter-trend entries are account killers.', 'Butiran LTF hanya bermakna DALAM konteks. Entri lawan-trend saiz penuh ialah pembunuh akaun.'),
        },
        {
          text: s('Take it with double size to average the loss.', 'Ambil dengan saiz dua kali ganda untuk purata kerugian.'),
          why: s('Averaging into losers without a plan is the fastest path to a blowup. Never add to a trade whose original idea is invalidated.', 'Mempurata rugi tanpa pelan ialah laluan terpantas ke arah kehancuran. Jangan tambah dagangan yang idea asalnya telah dibatalkan.'),
        },
      ]
    ),
  ],
};

export const level3: Level = {
  id: 'l3',
  index: 3,
  title: s('Smart Money Concepts', 'Konsep Wang Pintar'),
  tagline: s('Liquidity, order blocks, FVGs and displacement', 'Kecairan, order block, FVG dan anjakan'),
  description: s(
    'BOS/CHoCH, liquidity mapping, sweeps, supply & demand, FVGs, displacement, premium/discount and MTF.',
    'BOS/CHoCH, pemetaan kecairan, sweep, bekalan & permintaan, FVG, anjakan, premium/discount dan MTF.'
  ),
  color: '#8B7CF6',
  lessons: [l3Structure, l3Liquidity, l3Sweeps, l3SD, l3FVG, l3Displacement, l3PD, l3MTF],
};
