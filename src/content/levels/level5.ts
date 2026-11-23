/* Level 5 — Advanced Trading Laboratory */
import type { Lesson, Level } from '@/lib/types';
import { compose, makeRange, makeTrend, makeWalk, injectSweep, injectEqualLows, injectEqualHighs } from '@/lib/chart/builders';
import { q, s, scn, scene, txt, widget } from '../helpers';

const goldCandles = compose([
  makeRange({ seed: 5101, lo: 2396, hi: 2406, count: 12 }),
  makeTrend({ seed: 5102, start: 2401, count: 10, dir: 1, strength: 1.6, vol: 2.4 }),
  makeTrend({ seed: 5103, start: 2418, count: 10, dir: -1, strength: 1.3, vol: 2.2 }),
  makeWalk({ seed: 5104, start: 2404, count: 12, vol: 1.8, drift: 0.2 }),
]);

const newsCandles = compose([
  makeWalk({ seed: 5201, start: 2400, count: 16, vol: 1.3, drift: 0.05 }),
  makeWalk({ seed: 5202, start: 2401, count: 4, vol: 7.5, drift: -1.2 }),
  makeTrend({ seed: 5203, start: 2396, count: 14, dir: -1, strength: 1.05, vol: 2.2 }),
]);

const atrCandles = makeWalk({ seed: 5301, start: 2400, count: 48, vol: 2.6, drift: 0.3 });

let trailBase = makeTrend({ seed: 5401, start: 2350, count: 30, dir: 1, strength: 1.3, vol: 2.1 });
trailBase = injectSweep(trailBase, { at: 24, level: 2406, side: 'high', seed: 61, hold: 1 });
const trailCandles = compose([
  trailBase,
  makeTrend({ seed: 5402, start: 2404, count: 16, dir: -1, strength: 1.35, vol: 2.2 }),
]);

const l5Gold: Lesson = {
  id: 'l5-gold',
  levelId: 'l5',
  title: s('Gold Behaviour & Trading Sessions', 'Kelakuan Emas & Sesi Dagangan'),
  summary: s(
    'How XAUUSD actually behaves, when it moves most, and how sessions look in Malaysia time.',
    'Bagaimana XAUUSD benar-benar berkelakuan, bila ia bergerak paling banyak, dan bagaimana sesi kelihatan dalam waktu Malaysia.'
  ),
  minutes: 11,
  xp: 65,
  skills: ['sessions', 'gold'],
  steps: [
    txt(
      s('Gold has a personality', 'Emas mempunyai personaliti'),
      s(
        'XAUUSD is driven by the US dollar, real interest rates and risk sentiment. Behaviourally: it trends strongly during London and New York, consolidates during the Asian session more often, and can move $20–50 in a session. It respects technical structure well — which is why it is popular for the concepts you have learned.',
        'XAUUSD didorong oleh dolar AS, kadar faedah sebenar dan sentimen risiko. Secara kelakuan: ia bergerak trend dengan kuat semasa London dan New York, lebih kerap berkonsolidasi semasa sesi Asia, dan boleh bergerak $20–50 dalam satu sesi. Ia menghormati struktur teknikal dengan baik — sebab itu ia popular untuk konsep yang anda pelajari.'
      ),
      {
        bullets: [
          s('London open (3:00 pm MYT summer / 4:00 pm winter): liquidity sweep setups are common.', 'Pembukaan London (3:00 ptg MYT musim panas / 4:00 ptg musim sejuk): setup liquidity sweep adalah biasa.'),
          s('New York (8:00 pm / 9:30 pm MYT): the biggest directional moves and news reactions.', 'New York (8:00 mlm / 9:30 mlm MYT): pergerakan arah terbesar dan tindak balas berita.'),
          s('London–NY overlap is the highest-volume window of the day.', 'Tindih London–NY ialah tetingkap isipadu tertinggi dalam sehari.'),
          s('Friday late New York and Sunday open: thin liquidity, wider spreads.', 'New York lewat Jumaat dan pembukaan Ahad: kecairan nipis, spread lebih luas.'),
        ],
      }
    ),
    widget(
      'session-clock',
      s('Live session clock', 'Jam sesi langsung'),
      s(
        'Real-time London, New York and Asian sessions in MYT — with daylight saving handled automatically.',
        'Sesi London, New York dan Asia masa nyata dalam MYT — dengan pelarasan waktu siang dikendalikan secara automatik.'
      )
    ),
    scn(
      s('A gold session, narrated', 'Sesi emas, dinarasikan'),
      scene('l5-gold', goldCandles, [
        {
          caption: s(
            'Asian session: quiet range. Gold often coils here — energy builds while Europe sleeps.',
            'Sesi Asia: range tenang. Emas kerap membalut di sini — tenaga terbina ketika Eropah tidur.'
          ),
          state: {
            revealTo: 11,
            highlights: [{ from: 0, to: 11, tone: 'mist', label: s('Asia: range', 'Asia: range') }],
          },
        },
        {
          caption: s(
            'London opens — expansion. Note how the moves accelerate: this is when your M15/H1 setups begin to matter.',
            'London dibuka — pengembangan. Perhatikan bagaimana pergerakan mempercepat: inilah masa setup M15/H1 anda mula penting.'
          ),
          state: {
            revealTo: 21,
            highlights: [{ from: 12, to: 21, tone: 'gold', label: s('London expansion', 'Pengembangan London') }],
          },
        },
        {
          caption: s(
            'New York continuation or reversal — the news hours. Plan trades around the session logic, not randomly across the clock.',
            'Sambungan atau pembalikan New York — jam berita. Rancang dagangan mengikut logik sesi, bukan rawak merentasi jam.'
          ),
          state: {
            revealTo: 33,
            highlights: [{ from: 22, to: 33, tone: 'violet', label: s('NY session', 'Sesi NY') }],
          },
        },
      ])
    ),
    q(
      s('Why do many gold setups form around the London open (in MYT)?', 'Mengapa banyak setup emas terbentuk sekitar pembukaan London (dalam MYT)?'),
      [
        {
          text: s('Liquidity and volume surge after the quiet Asian session — creating sweeps, breakouts and displacement.', 'Kecairan dan isipadu melonjak selepas sesi Asia tenang — mewujudkan sweep, breakout dan anjakan.'),
          correct: true,
          why: s('Exactly. The session transition is where resting orders get triggered and directional players step in. Your tools (structure, liquidity, FVG) shine brightest in these windows.', 'Tepat. Peralihan sesi ialah tempat order rehat dicetuskan dan pemain arah masuk. Alat anda (struktur, kecairan, FVG) bersinar paling terang dalam tetingkap ini.'),
        },
        {
          text: s('Gold only trades during London hours.', 'Emas hanya didagangkan semasa jam London.'),
          why: s('Gold trades nearly around the clock on weekdays (with brief breaks). It is about WHEN quality movement concentrates, not when trading is possible.', 'Emas didagangkan hampir sepanjang jam pada hari bekerja (dengan rehat singkat). Ia tentang BILA pergerangan berkualiti tertumpu, bukan bila dagangan boleh dilakukan.'),
        },
        {
          text: s('Brokers lower spreads to zero at the open.', 'Broker menurunkan spread ke sifar pada pembukaan.'),
          why: s('Spreads tighten when volume rises, but never assume zero. Session planning is about behaviour and volatility, not fee rumours.', 'Spread mengetat apabila isipadu meningkat, tetapi jangan andaikan sifar. Perancangan sesi tentang kelakuan dan volatiliti, bukan khabar angin yuran.'),
        },
      ]
    ),
  ],
};

const l5News: Lesson = {
  id: 'l5-news',
  levelId: 'l5',
  title: s('Economic News & Event Risk', 'Berita Ekonomi & Risiko Peristiwa'),
  summary: s(
    'The recurring events that move gold — and how professionals plan around them instead of gambling on them.',
    'Peristiwa berulang yang menggerakkan emas — dan bagaimana profesional merancang mengelilinginya dan bukan berjudi atasnya.'
  ),
  minutes: 10,
  xp: 60,
  skills: ['news', 'risk', 'process'],
  steps: [
    txt(
      s('News is scheduled chaos', 'Berita ialah huru-hara terjadual'),
      s(
        'Certain events move gold violently: US Non-Farm Payrolls (first Friday monthly), CPI inflation, FOMC rate decisions (8/year), GDP and employment data. The pattern is predictable (the calendar), the reaction is not. Spreads widen, slippage grows, and technical levels get swept both ways.',
        'Peristiwa tertentu menggerakkan emas dengan hebat: Non-Farm Payrolls AS (Jumaat pertama bulanan), inflasi CPI, keputusan kadar FOMC (8 kali/tahun), data KDNK dan pekerjaan. Coraknya boleh diramal (kalendar), tindak balasnya tidak. Spread melebar, gelinciran meningkat, dan paras teknikal disapu dua hala.'
      ),
      {
        bullets: [
          s('Rule 1: know the calendar before you plan any trade for the day.', 'Peraturan 1: kenali kalendar sebelum anda merancang mana-mana dagangan untuk hari itu.'),
          s('Rule 2: decide in advance — stand aside during the release, or trade only post-release structures.', 'Peraturan 2: tentukan awal — ketepikan semasa pelepasan, atau dagangkan hanya struktur selepas pelepasan.'),
          s('Rule 3: never widen stops to "survive" news volatility.', 'Peraturan 3: jangan sesekali melebarkan stop untuk "terselamat" daripada volatiliti berita.'),
        ],
      }
    ),
    widget(
      'news-planner',
      s('News event guide', 'Panduan peristiwa berita'),
      s(
        'An educational map of recurring market-moving events and how to plan around them. Not live data — a planning template.',
        'Peta pendidikan peristiwa berulang yang menggerakkan pasaran dan cara merancang mengelilinginya. Bukan data langsung — templat perancangan.'
      )
    ),
    scn(
      s('What news does to a chart', 'Apa yang berita lakukan pada carta'),
      scene('l5-news', newsCandles, [
        {
          caption: s(
            'Pre-news drift: small candles, tight range. The market is waiting.',
            'Hanyut pra-berita: lilin kecil, range ketat. Pasaran sedang menunggu.'
          ),
          state: {
            revealTo: 15,
            highlights: [{ from: 0, to: 15, tone: 'mist', label: s('Pre-news calm', 'Tenang pra-berita') }],
          },
        },
        {
          caption: s(
            'The release: giant candles, both directions, wicks everywhere. Stop losses on both sides get swept. This is the most expensive moment for unprepared traders.',
            'Pelepasan: lilin gergasi, dua arah, bayang di mana-mana. Stop loss kedua-dua pihak disapu. Ini saat paling mahal untuk trader tidak bersedia.'
          ),
          state: {
            revealTo: 20,
            highlights: [{ from: 16, to: 20, tone: 'bear', label: s('News candle', 'Lilin berita') }],
          },
        },
        {
          caption: s(
            'Then a new trend often emerges from the chaos — and THAT is the structure prepared traders wait for. Patience around news is a skill that pays repeatedly.',
            'Kemudian trend baharu sering muncul dari huru-hara — dan ITULAH struktur yang dinanti trader bersedia. Kesabaran di sekitar berita ialah kemahiran yang membayar berulang kali.'
          ),
          state: {
            revealTo: 33,
            highlights: [{ from: 22, to: 33, tone: 'gold', label: s('Post-news trend', 'Trend selepas berita') }],
          },
        },
      ])
    ),
    q(
      s('NFP releases in 10 minutes and your setup looks perfect. What is the professional decision?', 'NFP dilepaskan dalam 10 minit dan setup anda kelihatan sempurna. Apakah keputusan profesional?'),
      [
        {
          text: s('Skip or wait until after the release — event risk overrides any pattern.', 'Langkau atau tunggu selepas pelepasan — risiko peristiwa mengatasi mana-mana corak.'),
          correct: true,
          why: s('Correct. Pre-news entries face spread widening, slippage and two-way sweeps that no stop can reliably survive. The market will still be there afterwards.', 'Betul. Entri pra-berita berdepan pelebaran spread, gelinciran dan sapuan dua hala yang tiada stop boleh terselamat dengan dipercayai. Pasaran masih akan ada selepas itu.'),
        },
        {
          text: s('Enter now with double size to catch the spike.', 'Masuk sekarang dengan saiz dua kali gada untuk menangkap lonjakan.'),
          why: s('That is gambling on direction with elevated costs and no exit reliability — the definition of negative expectancy behaviour.', 'Itu berjudi mengikut arah dengan kos meningkat dan tiada kebolehpercayaan keluar — definisi kelakuan jangkaan negatif.'),
        },
        {
          text: s('Move the stop far away so the news cannot hit it.', 'Jauhkan stop supaya berita tidak boleh memukulnya.'),
          why: s('A far stop multiplies risk beyond the plan. If the trade needs a special stop for news, it is not the planned trade.', 'Stop jauh menggandakan risiko melepasi pelan. Jika dagangan perlukan stop khas untuk berita, ia bukan dagangan yang dirancang.'),
        },
      ]
    ),
  ],
};

const l5VolTools: Lesson = {
  id: 'l5-voltools',
  levelId: 'l5',
  title: s('ATR, ADX & Volatility Tools', 'ATR, ADX & Alat Volatiliti'),
  summary: s(
    'Measuring instead of guessing: how wide should stops be, and is the trend actually strong?',
    'Mengukur dan bukan meneka: berapa lebar stop patutnya, dan adakah trend benar-benar kuat?'
  ),
  minutes: 10,
  xp: 60,
  skills: ['tools', 'risk'],
  steps: [
    txt(
      s('ATR: the market\'s ruler', 'ATR: pembaris pasaran'),
      s(
        'Average True Range measures average candle-to-candle movement over N periods (usually 14). It answers "how big is normal right now?" Traders use ATR to set stops beyond noise (e.g., 1–2× ATR), scale position size to volatility, and judge whether a move is exceptional.',
        'Average True Range mengukur purata pergerakan lilin ke lilin melepasi N tempoh (biasanya 14). Ia menjawab "betapa besarnya normal sekarang?" Trader guna ATR untuk menetapkan stop melepasi hingar (cth., 1–2× ATR), menskala saiz posisi mengikut volatiliti, dan menilai sama ada pergerakan luar biasa.'
      ),
      {
        bullets: [
          s('Stop placement: entry ± 1–2 ATR (combined with structural invalidation, never instead of it).', 'Penempatan stop: entry ± 1–2 ATR (digabungkan dengan pembatalan struktur, bukan menggantikannya).'),
          s('Size adjustment: high ATR → smaller lots for the same dollar risk.', 'Pelarasan saiz: ATR tinggi → lot lebih kecil untuk risiko dolar sama.'),
          s('Compression: unusually low ATR often precedes expansion.', 'Pemampatan: ATR rendah luar biasa sering mendahului pengembangan.'),
        ],
      }
    ),
    txt(
      s('ADX: is the trend worth it?', 'ADX: adakah trend berbaloi?'),
      s(
        'The Average Directional Index measures trend STRENGTH (not direction) on a 0–100 scale. Readings above ~20–25 suggest a trending environment where trend-following setups work better; below ~20 suggests ranging conditions where they fail more. It is a filter, not a signal.',
        'Average Directional Index mengukur KUAT trend (bukan arah) pada skala 0–100. Bacaan melebihi ~20–25 mencadangkan persekitaran trend di mana setup pengikut-trend berfungsi lebih baik; di bawah ~20 mencadangkan keadaan range di mana ia gagal lebih kerap. Ia penapis, bukan isyarat.'
      ),
      {
        bullets: [
          s('ADX rising = trend strengthening; ADX falling = momentum fading.', 'ADX naik = trend menguat; ADX turun = momentum pudar.'),
          s('Never use ADX alone — pair it with your structure reads.', 'Jangan guna ADX sendirian — pasangkannya dengan bacaan struktur anda.'),
          s('Every indicator is derived from price. Price action stays primary.', 'Setiap petunjuk diturunkan daripada harga. Tindakan harga kekal utama.'),
        ],
      }
    ),
    q(
      s('ATR doubles after a quiet week. How should your trade parameters change?', 'ATR dua kali ganda selepas minggu tenang. Bagaimana parameter dagangan anda patut berubah?'),
      [
        {
          text: s('Widen structural stops to respect new noise levels and reduce lot size to keep risk constant.', 'Lebarkan stop struktur untuk menghormati tahap hingar baharu dan kurangkan saiz lot untuk mengekalkan risiko tetap.'),
          correct: true,
          why: s('Exactly — risk % stays fixed, stop distance adapts to volatility, size adapts to keep R constant. That is professional parameter management.', 'Tepat — % risiko kekal tetap, jarak stop menyesuaikan dengan volatiliti, saiz menyesuaikan untuk mengekalkan R tetap. Itu pengurusan parameter profesional.'),
        },
        {
          text: s('Keep everything the same — only price matters.', 'Kekalkan segalanya sama — hanya harga penting.'),
          why: s('Ignoring volatility change means stops sit inside noise and get harvested. The parameters must match the weather.', 'Mengabaikan perubahan volatiliti bermakna stop duduk dalam hingar dan dituai. Parameter mesti sepadan dengan cuaca.'),
        },
        {
          text: s('Double your size to make up for wider stops.', 'Gandakan saiz anda untuk mengimbangi stop lebih luas.'),
          why: s('Doubling size with wider stops doubles RISK. The goal is constant risk per trade, not constant thrill.', 'Menggandakan saiz dengan stop lebih luas menggandakan RISIKO. Matlamatnya risiko tetap setiap dagangan, bukan keterujaan tetap.'),
        },
      ]
    ),
    widget(
      'risk-calc',
      s('Volatility-aware sizing', 'Saiz sedar volatiliti'),
      s(
        'Use the sandbox to see how wider stops force smaller lots — the math of surviving wild markets.',
        'Guna sandbox untuk melihat bagaimana stop lebih luas memaksa lot lebih kecil — matematik terselamat dalam pasaran liar.'
      )
    ),
  ],
};

const l5Trailing: Lesson = {
  id: 'l5-trailing',
  levelId: 'l5',
  title: s('Trailing Stops & Advanced Management', 'Trailing Stop & Pengurusan Mahir'),
  summary: s(
    'Letting winners run without giving everything back — structured trailing, breakeven logic and partial exits.',
    'Membiarkan pemenang berjalan tanpa menyerahkan semuanya — trailing berstruktur, logik impas dan keluar separa.'
  ),
  minutes: 9,
  xp: 55,
  skills: ['risk', 'process'],
  steps: [
    txt(
      s('The management trilemma', 'Dilema pengurusan'),
      s(
        'Every open trade balances three goals: protect capital, lock profit, let the winner run. You cannot maximise all three at once — management is choosing which to prioritise at each stage. Structured trailing is how that choice becomes a rule instead of a mood.',
        'Setiap dagangan terbuka mengimbangi tiga matlamat: lindung modal, kunci untung, biar pemenang berjalan. Anda tidak boleh memaksimumkan ketiga-tiganya serentak — pengurusan ialah memilih mana untuk diutamakan pada setiap peringkat. Trailing berstruktur ialah bagaimana pilihan itu menjadi peraturan dan bukan suasana hati.'
      ),
      {
        bullets: [
          s('Structure trail: move stop below each confirmed higher low (uptrend) — the cleanest method.', 'Trail struktur: pindah stop di bawah setiap higher low disahkan (uptrend) — kaedah paling bersih.'),
          s('ATR trail: stop = price − k×ATR — adapts to volatility mechanically.', 'Trail ATR: stop = harga − k×ATR — menyesuaikan dengan volatiliti secara mekanikal.'),
          s('Breakeven: a special case of trailing that sacrifices room for survival — use it when structure confirms, not from fear.', 'Impas: kes khas trailing yang mengorbankan ruang untuk kelangsungan — guna apabila struktur mengesahkan, bukan kerana takut.'),
          s('Partial exits at opposing liquidity let you bank profit while keeping a runner.', 'Keluar separa pada kecairan bertentangan membolehkan anda menyimpan untung sambil mengekalkan pelari.'),
        ],
      }
    ),
    scn(
      s('Trailing a winner', 'Trailing pemenang'),
      scene('l5-trail', trailCandles, [
        {
          caption: s(
            'Uptrend in motion. After each confirmed higher low, the trailing stop steps up. Notice it lags price — deliberately.',
            'Uptrend bergerak. Selepas setiap higher low disahkan, stop trailing melangkah naik. Perhatikan ia ketinggalan harga — secara sengaja.'
          ),
          state: {
            revealTo: 20,
            highlights: [{ from: 6, to: 14, tone: 'bull', label: s('HL trail', 'Trail HL') }],
          },
        },
        {
          caption: s(
            'The trend shows a sweep of the final high — one warning sign. A structure trail below the last HL survives this noise; a naive "fixed pips" trail might not.',
            'Trend menunjukkan sweep high terakhir — satu tanda amaran. Trail struktur di bawah HL terakhir terselamat daripada hingar ini; trail "pip tetap" naif mungkin tidak.'
          ),
          state: {
            revealTo: 28,
            highlights: [{ from: 24, to: 27, tone: 'bear', label: s('Warning', 'Amaran') }],
          },
        },
        {
          caption: s(
            'When the structure breaks, the trail exits you — with most of the move banked. You will never catch the exact top; you are not supposed to.',
            'Apabila struktur pecah, trail mengeluarkan anda — dengan kebanyakan pergerakan disimpan. Anda tidak akan menangkap puncak tepat; anda tidak sepatutnya.'
          ),
          state: {
            revealTo: 45,
            highlights: [{ from: 30, to: 45, tone: 'gold', label: s('Trail exit', 'Keluar trail') }],
          },
        },
      ])
    ),
    q(
      s('What is the main weakness of trailing stops?', 'Apakah kelemahan utama trailing stop?'),
      [
        {
          text: s('They lock less profit on trades that retrace deeply before continuing — tradeoff for protection.', 'Mereka mengunci kurang untung pada dagangan yang menarik balik dalam sebelum diteruskan — pertukaran untuk perlindungan.'),
          correct: true,
          why: s('Right — trailing converts "maximum theoretical profit" into "protected realistic profit". Nothing is free; the price of protection is giving back open profit on some trades.', 'Betul — trailing menukar "keuntungan teoritikal maksimum" kepada "keuntungan realistik dilindungi". Tiada apa percuma; harga perlindungan ialah menyerahkan untung terbuka pada sesetengah dagangan.'),
        },
        {
          text: s('They guarantee the best exit price.', 'Mereka menjamin harga keluar terbaik.'),
          why: s('No exit method guarantees the best price — that requires hindsight, which live markets do not offer.', 'Tiada kaedah keluar menjamin harga terbaik — itu memerlukan pandangan ke belakang, yang pasaran langsung tidak tawarkan.'),
        },
        {
          text: s('They prevent all losses.', 'Mereka menghalang semua kerugian.'),
          why: s('Trailing protects open profit; it does not prevent initial losses. That is the stop loss\'s job — different tool, different stage.', 'Trail melindungi untung terbuka; ia tidak menghalang kerugian awal. Itu tugas stop loss — alat berbeza, peringkat berbeza.'),
        },
      ]
    ),
  ],
};

const l5Research: Lesson = {
  id: 'l5-research',
  levelId: 'l5',
  title: s('Backtesting & Strategy Research', 'Backtesting & Kajian Strategi'),
  summary: s(
    'How to test an idea honestly — sample size, overfitting, and the difference between a rule and a story.',
    'Cara menguji idea dengan jujur — saiz sampel, overfitting, dan beza antara peraturan dan cerita.'
  ),
  minutes: 11,
  xp: 65,
  skills: ['research', 'process'],
  steps: [
    txt(
      s('Test the rule, not the memory', 'Uji peraturan, bukan ingatan'),
      s(
        'Backtesting means replaying historical scenarios and recording what your written rules would have done — entries, stops, targets, outcomes. Done honestly, it produces statistics: win rate, average R, expectancy, max drawdown. Done dishonestly (tweaking rules until the past looks perfect), it produces overfitting: a strategy that fits history and dies in reality.',
        'Backtesting bermaksud memainkan semula skenario sejarah dan merakam apa yang peraturan bertulis anda akan lakukan — entri, stop, sasaran, hasil. Dibuat jujur, ia menghasilkan statistik: kadar kemenangan, purata R, jangkaan, drawdown maksimum. Dibuat tidak jujur (mengolah peraturan sehingga masa lalu kelihatan sempurna), ia menghasilkan overfitting: strategi yang memadankan sejarah dan mati dalam realiti.'
      ),
      {
        bullets: [
          s('Write the rules BEFORE testing. Testing is for evaluating rules, not inventing them.', 'Tulis peraturan SEBELUM menguji. Pengujian untuk menilai peraturan, bukan menciptanya.'),
          s('Sample size matters: 10 trades prove nothing; 50–100+ starts to be meaningful.', 'Saiz sampel penting: 10 dagangan tidak membuktikan apa-apa; 50–100+ mula bermakna.'),
          s('Out-of-sample thinking: would these rules work on data/charts you have never seen?', 'Pemikiran luar-sampel: adakah peraturan ini berfungsi pada data/carta yang tidak pernah anda lihat?'),
          s('Your simulator + Arena scenarios are designed for exactly this kind of practice.', 'Simulator + skenario Arena anda direka untuk latihan jenis ini.'),
        ],
      }
    ),
    q(
      s('A strategy wins 90% in backtesting after you added 6 special conditions fitted to the past data. Honest verdict?', 'Strategi menang 90% dalam backtesting selepas anda menambah 6 syarat khas yang dipadankan dengan data lepas. Vonis jujur?'),
      [
        {
          text: s('Likely overfitted — complexity fitted to history rarely survives live conditions.', 'Kemungkinan besar overfitting — kerumitan yang dipadankan dengan sejarah jarang terselamat dalam keadaan langsung.'),
          correct: true,
          why: s('Sharp eye. Each special condition carved the rules to fit past noise. Simpler rules that survive across many scenarios beat clever rules that fit one chart.', 'Mata tajam. Setiap syarat khas mengukir peraturan untuk memadankan hingar lepas. Peraturan lebih mudah yang terselamat merentasi banyak skenario mengalahkan peraturan bijak yang memadankan satu carta.'),
        },
        {
          text: s('Excellent — 90% means guaranteed profits.', 'Cemerlang — 90% bermaksud keuntungan dijamin.'),
          why: s('Win rate alone means nothing without R multiples and drawdown — and fitted backtests inflate every statistic.', 'Kadar kemenangan sahaja tidak bermakna tanpa gandaan R dan drawdown — dan backtest yang dipadan mengembungkan setiap statistik.'),
        },
        {
          text: s('Add more conditions to reach 95%.', 'Tambah lagi syarat untuk mencapai 95%.'),
          why: s('More fitting = more fragility. The goal is robustness across conditions, not perfection on one dataset.', 'Lebih pemadanan = lebih rapuh. Matlamatnya kekukuhan merentasi keadaan, bukan kesempurnaan pada satu set data.'),
        },
      ]
    ),
    txt(
      s('A research workflow that works', 'Aliran kerja kajian yang berfungsi'),
      s(
        '1) State the hypothesis. 2) Write exact rules (market, session, setup, entry, stop, target, size). 3) Test on a meaningful sample with zero peeking at future candles. 4) Record every trade in a journal. 5) Compute win rate, average R, expectancy, worst streak. 6) Paper-trade it live in the simulator before risking money. 7) If it survives — small real risk; if not — return to step 1.',
        '1) Nyatakan hipotesis. 2) Tulis peraturan tepat (pasaran, sesi, setup, entri, stop, sasaran, saiz). 3) Uji pada sampel bermakna tanpa mengintip lilin masa depan. 4) Rekod setiap dagangan dalam jurnal. 5) Kira kadar kemenangan, purata R, jangkaan, siri terburuk. 6) Dagang kertas secara langsung dalam simulator sebelum merisikokan wang. 7) Jika terselamat — risiko sebenar kecil; jika tidak — kembali ke langkah 1.'
      ),
      {
        callout: {
          tone: 'key',
          text: s(
            'The chart simulator on this platform replays without future candles — the same honest constraint used by professional research.',
            'Simulator carta di platform ini memainkan semula tanpa lilin masa depan — kekangan jujur yang sama digunakan oleh kajian profesional.'
          ),
        },
      }
    ),
  ],
};

const l5Journal: Lesson = {
  id: 'l5-journal',
  levelId: 'l5',
  title: s('Journals, Expectancy & Drawdown', 'Jurnal, Jangkaan & Drawdown'),
  summary: s(
    'The scoreboard of a real trading business — and the numbers that tell you if it is working.',
    'Papan skor perniagaan dagangan sebenar — dan nombor yang memberitahu sama ada ia berfungsi.'
  ),
  minutes: 10,
  xp: 60,
  skills: ['process', 'research'],
  steps: [
    txt(
      s('Expectancy: the only number that matters long-term', 'Jangkaan: satu-satunya nombor penting jangka panjang'),
      s(
        'Expectancy = (win% × avg win in R) − (loss% × avg loss in R). If you win 40% with average wins of +2.5R and losses of −1R: 0.4×2.5 − 0.6×1 = +0.4R per trade. That is a real business. A journal is how you measure it honestly.',
        'Jangkaan = (win% × purata menang dalam R) − (loss% × purata rugi dalam R). Jika anda menang 40% dengan purata menang +2.5R dan rugi −1R: 0.4×2.5 − 0.6×1 = +0.4R setiap dagangan. Itu perniagaan sebenar. Jurnal ialah cara anda mengukurnya dengan jujur.'
      ),
      {
        bullets: [
          s('Log every trade: setup, screenshots, emotions, mistakes, R result.', 'Rekod setiap dagangan: setup, tangkapan skrin, emosi, kesilapan, hasil R.'),
          s('Review weekly: which setups have positive expectancy? Which habits cost R?', 'Semak mingguan: setup mana mempunyai jangkaan positif? Tabiat mana menelan R?'),
          s('Drawdown = peak-to-trough equity decline. Know your maximum tolerated drawdown BEFORE it happens.', 'Drawdown = penurunan ekuiti puncak-ke-lembah. Kenali drawdown maksimum yang anda sanggup SEBELUM ia berlaku.'),
        ],
      }
    ),
    q(
      s('After 30 trades your expectancy is −0.2R. What does that mean?', 'Selepas 30 dagangan jangkaan anda −0.2R. Apa maksudnya?'),
      [
        {
          text: s('The process, as executed, loses money per trade on average — the rules or execution need work.', 'Proses yang dilaksanakan kehilangan wang setiap dagangan secara purata — peraturan atau pelaksanaan perlu diperbaiki.'),
          correct: true,
          why: s('Precise. Negative expectancy means more trades = more loss. Stop live size, return to research: check the setups, the sample, and — most often — the execution discipline.', 'Tepat. Jangkaan negatif bermaksud lebih banyak dagangan = lebih banyak kerugian. Hentikan saiz langsung, kembali ke kaji semula: semak setup, sampel, dan — paling kerap — disiplin pelaksanaan.'),
        },
        {
          text: s('Just trade more — the law of averages will fix it.', 'Dagang lebih — hukum purata akan membetulkannya.'),
          why: s('The law of large numbers converges TO the expectancy — it does not rescue a negative one. More volume on a losing process compounds the loss.', 'Hukum nombor besar menumpu KEPADA jangkaan — ia tidak menyelamatkan yang negatif. Lebih isipadu pada proses rugi memperbesarkan kerugian.'),
        },
        {
          text: s('Increase risk to win it back faster.', 'Tingkatkan risiko untuk memenanginya kembali lebih pantas.'),
          why: s('That is the tilt spiral. Raising risk on negative expectancy multiplies the bleed. Fix the process first.', 'Itu lingkaran kemiringan. Meningkatkan risiko pada jangkaan negatif menggandakan pendarahan. Betulkan proses dahulu.'),
        },
      ]
    ),
    q(
      s('What is the healthiest attitude toward drawdown?', 'Apakah sikap paling sihat terhadap drawdown?'),
      [
        {
          text: s('It is a normal cost of business — plan a maximum in advance and reduce size when it approaches.', 'Ia kos perniagaan normal — rancang maksimum awal dan kurangkan saiz apabila ia menghampiri.'),
          correct: true,
          why: s('Mature view. Drawdowns are inevitable; blowing past your planned maximum is not. Pre-committed rules (like cutting risk after X% drawdown) keep you in the game.', 'Pandangan matang. Drawdown tidak dapat dielakkan; melampaui maksimum yang dirancang bukan. Peraturan pra-komit (seperti mengurangkan risiko selepas X% drawdown) mengekalkan anda dalam permainan.'),
        },
        {
          text: s('It should never happen to a good trader.', 'Ia tidak sepatutnya berlaku kepada trader baik.'),
          why: s('Every strategy has losing streaks — including profitable ones. Expecting zero drawdown leads to system-hopping at the worst moment.', 'Setiap strategi mempunyai siri kerugian — termasuk yang untung. Menjangkakan sifar drawdown membawa kepada lompat-sistem pada saat paling teruk.'),
        },
        {
          text: s('Ignore it until the account recovers.', 'Abaikan sehingga akaun pulih.'),
          why: s('Ignoring drawdown removes the only feedback that triggers risk reduction. Measure it weekly — knowledge is the antidote to panic.', 'Mengabaikan drawdown menghapuskan satu-satunya maklum balas yang mencetuskan pengurangan risiko. Ukur setiap minggu — pengetahuan ialah penawar panik.'),
        },
      ]
    ),
  ],
};

const l5Psych: Lesson = {
  id: 'l5-psychology',
  levelId: 'l5',
  title: s('Psychology & Independent Thinking', 'Psikologi & Pemikiran Bebas'),
  summary: s(
    'The final skill: making your own decisions, under uncertainty, without a guru — and staying sane doing it.',
    'Kemahiran akhir: membuat keputusan sendiri, dalam ketidakpastian, tanpa guru — dan kekal waras melakukannya.'
  ),
  minutes: 10,
  xp: 65,
  skills: ['psychology', 'process'],
  steps: [
    txt(
      s('The market is a mirror', 'Pasaran ialah cermin'),
      s(
        'Your trading results reflect your habits: how you handle boredom (overtrading), fear (cutting winners early), hope (holding losers), excitement (oversizing), and ego (refusing to be wrong). The technical skills you learned are the easy half. The hard half is executing them consistently while your emotions argue.',
        'Keputusan dagangan anda mencerminkan tabiat anda: bagaimana anda menangani kebosanan (dagangan berlebihan), takut (memotong pemenang awal), harapan (memegang rugi), keterujaan (saiz berlebihan), dan ego (enggan mengaku salah). Kemahiran teknikal yang anda pelajari ialah bahagian mudah. Bahagian sukar ialah melaksanakannya secara konsisten sambil emosi anda berhujah.'
      ),
      {
        bullets: [
          s('Pre-commit decisions: written plans remove most emotional errors.', 'Keputusan pra-komit: pelan bertulis menghapuskan kebanyakan kesilapan emosi.'),
          s('Fixed routines beat fixed motivation: same checklist, every session.', 'Rutin tetap mengatasi motivasi tetap: senarai semak sama, setiap sesi.'),
          s('A trading diary of emotions reveals your personal traps faster than any course.', 'Diari emosi dagangan mendedahkan perangkap peribadi anda lebih pantas daripada mana-mana kursus.'),
          s('Independence means testing ideas yourself — not outsourcing thinking to signal groups.', 'Kemerdekaan bermaksud menguji idea sendiri — bukan menyerahkan pemikiran kepada kumpulan isyarat.'),
        ],
      }
    ),
    q(
      s('A "guru" account shows 12 straight winning trades and sells premium signals. Critical thinking says:', 'Akaun "guru" menunjukkan 12 dagangan menang berturut dan menjual isyarat premium. Pemikiran kritis berkata:'),
      [
        {
          text: s('Curated highlight reels prove nothing — verify rules, drawdowns, sample size and incentives first.', 'Sorotan terpilih tidak membuktikan apa-apa — sahkan peraturan, drawdown, saiz sampel dan insentif dahulu.'),
          correct: true,
          why: s('Excellent. Real track records include losses and drawdowns. Anyone can show a lucky streak; honest statistics and transparent rules are the only evidence that matters.', 'Cemerlang. Rekod sebenar termasuk kerugian dan drawdown. Sesiapa boleh menunjukkan siri nasib; statistik jujur dan peraturan telus ialah satu-satunya bukti yang penting.'),
        },
        {
          text: s('12 wins in a row means they have cracked the market.', '12 kemenangan berturut bermakna mereka telah memecahkan pasaran.'),
          why: s('Even a coin-flip strategy produces long winning streaks in large samples. Streaks without context are noise with good marketing.', 'Malah strategi syiling menghasilkan siri kemenangan panjang dalam sampel besar. Siri tanpa konteks ialah hingar dengan pemasaran baik.'),
        },
        {
          text: s('Follow them with full account size.', 'Ikut mereka dengan saiz akaun penuh.'),
          why: s('Outsourcing your decisions at full size is the fastest way to lose both money and the chance to develop real skill.', 'Menyerahkan keputusan anda pada saiz penuh ialah cara terpantas kehilangan wang dan peluang mengembangkan kemahiran sebenar.'),
        },
      ]
    ),
    txt(
      s('Your graduation — and what it means', 'Kelulusan anda — dan maksudnya'),
      s(
        'If you have come this far: you can read candles, map structure, find liquidity, spot sweeps and FVGs, build rule-based setups, size positions, plan around news, research strategies and manage your own psychology. That is demonstrated competence — a foundation, not a promise of profit. The market will still surprise you; that is its nature. Your job is not to be right every time. Your job is to take only the trades where being right pays more than being wrong costs — and to do it again tomorrow, and the day after.',
        'Jika anda telah sampai sejauh ini: anda boleh membaca lilin, memetakan struktur, mencari kecairan, mengesan sweep dan FVG, membina setup berperaturan, mensaizkan posisi, merancang di sekitar berita, mengkaji strategi dan mengurus psikologi sendiri. Itu kompetensi terbukti — satu asas, bukan janji keuntungan. Pasaran masih akan mengejutkan anda; itu fitrahnya. Tugas anda bukan untuk betul setiap masa. Tugas anda ialah hanya mengambil dagangan di mana betul membayar lebih daripada salah menelan kos — dan melakukannya lagi esok, dan lusa.'
      ),
      {
        callout: {
          tone: 'key',
          text: s(
            'Complete the Practice Arena certification run to put the whole skill set under pressure — with feedback on every decision.',
            'Selesaikan larian pensijilan Arena Latihan untuk meletakkan keseluruhan kemahiran di bawah tekanan — dengan maklum balas atas setiap keputusan.'
          ),
        },
      }
    ),
  ],
};

export const level5: Level = {
  id: 'l5',
  index: 5,
  title: s('Advanced Trading Lab', 'Makmal Dagangan Mahir'),
  tagline: s('Gold behaviour, sessions, research and discipline', 'Kelakuan emas, sesi, kajian dan disiplin'),
  description: s(
    'Gold sessions in MYT, news planning, ATR/ADX, trailing, backtesting, journals, expectancy and psychology.',
    'Sesi emas dalam MYT, perancangan berita, ATR/ADX, trailing, backtesting, jurnal, jangkaan dan psikologi.'
  ),
  color: '#FF5C7A',
  lessons: [l5Gold, l5News, l5VolTools, l5Trailing, l5Research, l5Journal, l5Psych],
};
