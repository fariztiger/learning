/* Level 1 — Absolute Beginner */
import type { Lesson, Level } from '@/lib/types';
import { injectEqualHighs, injectSweep, makeRange, makeTrend, makeWalk, compose, injectFVG, rebase } from '@/lib/chart/builders';
import { q, s, scn, scene, txt, widget } from '../helpers';

/* ---------------------------- shared scene data ---------------------------- */

const introCandles = makeWalk({ seed: 101, start: 2400, count: 46, vol: 2.0, drift: 0.28 });

const pairCandles = rebase(makeWalk({ seed: 202, start: 1.085, count: 40, vol: 0.0016, drift: 0.00012 }), 1.085);

const bidAskCandles = makeRange({ seed: 303, lo: 2396, hi: 2404, count: 36 });

const candleStory = compose([
  makeRange({ seed: 404, lo: 2398, hi: 2404, count: 12 }),
  makeTrend({ seed: 405, start: 2401, count: 10, dir: 1, strength: 1.1, vol: 1.8 }),
  makeTrend({ seed: 406, start: 2413, count: 10, dir: -1, strength: 1.2, vol: 2.0 }),
]);

const tfBase = makeWalk({ seed: 505, start: 2400, count: 48, vol: 2.4, drift: 0.35 });

const levCandles = makeTrend({ seed: 606, start: 2380, count: 40, dir: 1, strength: 1.4, vol: 2.2 });

/* --------------------------------- lessons -------------------------------- */

const l1WhatIsTrading: Lesson = {
  id: 'l1-what-is-trading',
  levelId: 'l1',
  title: s('What is Trading?', 'Apa itu Dagangan?'),
  summary: s(
    'Why prices move, what buyers and sellers do, and what it means to trade a market like gold.',
    'Mengapa harga bergerak, apa yang pembeli dan penjual lakukan, dan apa maksud berdagang pasaran seperti emas.'
  ),
  minutes: 8,
  xp: 40,
  skills: ['basics'],
  steps: [
    txt(
      s('Markets are conversations', 'Pasaran ialah perbualan'),
      s(
        'Every market is a giant meeting place between buyers and sellers. When more people want to buy than sell, prices rise. When more want to sell than buy, prices fall. A "price" is simply the last agreed point between them.',
        'Setiap pasaran ialah tempat pertemuan besar antara pembeli dan penjual. Apabila lebih ramai mahu membeli daripada menjual, harga naik. Apabila lebih ramai mahu menjual daripada membeli, harga turun. "Harga" hanyalah titik persetujuan terakhir antara mereka.'
      ),
      {
        bullets: [
          s('Trading = buying or selling an asset hoping the price moves in your favour.', 'Dagangan = membeli atau menjual aset dengan harapan harga bergerak memihak kepada anda.'),
          s('You do not need to predict the future — you need a process with an edge and strict risk control.', 'Anda tidak perlu meramal masa depan — anda perlukan proses dengan kelebihan dan kawalan risiko yang ketat.'),
          s('A trade is a hypothesis: "IF this happens, THEN price may go there."', 'Dagangan ialah hipotesis: "JIKA ini berlaku, MAKA harga mungkin ke sana."'),
        ],
        callout: {
          tone: 'risk',
          text: s(
            'Trading is risky. Most beginner accounts lose money, often because of poor risk management — not because the analysis was wrong.',
            'Dagangan berisiko. Kebanyakan akaun pemula kehilangan wang, sering kerana pengurusan risiko yang lemah — bukan kerana analisis salah.'
          ),
        },
      }
    ),
    scn(
      s('Watch a market breathe', 'Perhatikan pasaran bernafas'),
      scene('l1-intro', introCandles, [
        {
          caption: s(
            'Each candle shows a slice of time. Green candles close higher than they opened — buyers won that slice. Red candles close lower — sellers won.',
            'Setiap lilin menunjukkan satu potongan masa. Lilin hijau ditutup lebih tinggi daripada pembukaan — pembeli memenangi potongan itu. Lilin merah ditutup lebih rendah — penjual menang.'
          ),
          state: { revealTo: 12 },
        },
        {
          caption: s(
            'Notice the movement is not a straight line. Price breathes: pushes up, pulls back, pushes again. This rhythm is the raw material of every strategy you will learn.',
            'Perhatikan pergerakan bukan garis lurus. Harga bernafas: naik, tarik balik, naik semula. Irama ini ialah bahan mentah setiap strategi yang anda akan pelajari.'
          ),
          state: {
            revealTo: 28,
            highlights: [{ from: 13, to: 22, tone: 'sky', label: s('Rhythm / Irama', 'Irama') }],
          },
        },
        {
          caption: s(
            'And sometimes price moves with force. These strong moves are the market telling you where the energy is. Never trade without asking: who is in control right now — buyers or sellers?',
            'Dan kadangkala harga bergerak dengan kuat. Pergerakan kuat ini memberitahu anda di mana tenaga berada. Jangan berdagang tanpa bertanya: siapa yang mengawal sekarang — pembeli atau penjual?'
          ),
          state: {
            revealTo: 45,
            highlights: [{ from: 30, to: 45, tone: 'gold', label: s('Expansion / Pengembangan', 'Pengembangan') }],
          },
        },
      ])
    ),
    q(
      s('A candle closes higher than it opened. What does that tell you?', 'Satu lilin ditutup lebih tinggi daripada pembukaannya. Apa yang ia beritahu anda?'),
      [
        {
          text: s('Buyers were in control during that time slice.', 'Pembeli mengawal semasa potongan masa itu.'),
          correct: true,
          why: s(
            'Exactly. The close above the open means the net result of the battle between buyers and sellers was a win for buyers. The wicks show how far the fight travelled.',
            'Tepat sekali. Penutupan di atas pembukaan bermakna hasil pertarungan antara pembeli dan penjual ialah kemenangan untuk pembeli. Bayang menunjukkan sejauh mana pertarungan berlaku.'
          ),
        },
        {
          text: s('The price will definitely keep rising.', 'Harga pasti akan terus naik.'),
          why: s(
            'Not necessarily. One candle is one slice of information, not a promise. Trading edge comes from reading many candles in context — and always preparing for the idea to be wrong.',
            'Belum tentu. Satu lilin ialah satu potongan maklumat, bukan janji. Kelebihan dagangan datang daripada membaca banyak lilin dalam konteks — dan sentiasa bersedia jika idea anda salah.'
          ),
        },
        {
          text: s('Nobody traded during that period.', 'Tiada siapa berdagang semasa tempoh itu.'),
          why: s(
            'If nobody traded, there would be no candle at all. Every candle exists because trades happened — the open, high, low and close are all real transaction prices (in live markets).',
            'Jika tiada siapa berdagang, tiada langsung lilin wujud. Setiap lilin wujud kerana dagangan berlaku — buka, tinggi, rendah dan tutup semuanya harga transaksi sebenar (dalam pasaran langsung).'
          ),
        },
      ]
    ),
    txt(
      s('Key takeaway', 'Rumusan utama'),
      s(
        'You are not gambling when you trade with a written plan, defined risk and honest self-review. You are testing hypotheses. Some will fail — that is normal. The goal of this academy is to make sure your process survives those failures.',
        'Anda tidak berjudi apabila berdagang dengan pelan bertulis, risiko ditakrif dan semakan jujur. Anda menguji hipotesis. Sebahagiannya akan gagal — itu normal. Matlamat akademi ini ialah memastikan proses anda terselamat daripada kegagalan tersebut.'
      ),
      {
        callout: {
          tone: 'key',
          text: s(
            'Complete this course and you will have demonstrated knowledge — not guaranteed profits. Nobody can promise returns.',
            'Selesaikan kursus ini dan anda telah menunjukkan pengetahuan — bukan keuntungan dijamin. Tiada siapa boleh menjanjikan pulangan.'
          ),
        },
      }
    ),
  ],
};

const l1ForexGold: Lesson = {
  id: 'l1-forex-gold',
  levelId: 'l1',
  title: s('Forex & Gold (XAUUSD)', 'Forex & Emas (XAUUSD)'),
  summary: s(
    'What currency pairs are, how gold is quoted, and why XAUUSD is the most traded metal.',
    'Apa itu pasangan mata wang, bagaimana emas dinilai, dan mengapa XAUUSD ialah logam paling banyak didagangkan.'
  ),
  minutes: 9,
  xp: 45,
  skills: ['basics', 'forex'],
  steps: [
    txt(
      s('Currencies trade in pairs', 'Mata wang didagangkan secara berpasangan'),
      s(
        'A currency pair compares two economies: EUR/USD asks "how many US dollars for one euro?" When you buy EUR/USD you are buying euros and selling dollars at the same time. Price = the exchange rate.',
        'Pasangan mata wang membandingkan dua ekonomi: EUR/USD bertanya "berapa dolar AS untuk satu euro?" Apabila anda membeli EUR/USD anda membeli euro dan menjual dolar pada masa yang sama. Harga = kadar pertukaran.'
      ),
      {
        bullets: [
          s('Base currency = the first one (EUR). Quote currency = the second (USD).', 'Mata wang asas = yang pertama (EUR). Mata wang sebut harga = yang kedua (USD).'),
          s('If EUR/USD rises, the euro strengthened (or the dollar weakened).', 'Jika EUR/USD naik, euro menguat (atau dolar melemah).'),
          s('Gold trades the same way: XAUUSD = price of one troy ounce of gold in US dollars.', 'Emas didagangkan dengan cara yang sama: XAUUSD = harga satu troy auns emas dalam dolar AS.'),
        ],
      }
    ),
    scn(
      s('Two markets, one language', 'Dua pasaran, satu bahasa'),
      scene('l1-pairs', pairCandles, [
        {
          caption: s(
            'This is a EUR/USD-style chart. The same candle language you just learned works for every liquid market in the world.',
            'Ini carta gaya EUR/USD. Bahasa lilin yang anda pelajari tadi berfungsi untuk setiap pasaran cecair di dunia.'
          ),
          state: { revealTo: 12 },
        },
        {
          caption: s(
            'Currencies move in tiny units called pips. For EUR/USD a pip is 0.0001 — a move from 1.0850 to 1.0860 is 10 pips.',
            'Mata wang bergerak dalam unit kecil dipanggil pip. Untuk EUR/USD, satu pip ialah 0.0001 — pergerakan dari 1.0850 ke 1.0860 ialah 10 pip.'
          ),
          state: {
            revealTo: 25,
            highlights: [{ from: 14, to: 25, tone: 'sky', pFrom: 1.0838, pTo: 1.0868, label: s('Pips move', 'Pergerakan pip') }],
          },
        },
        {
          caption: s(
            'Gold (XAUUSD) is quoted in dollars per ounce, and it moves much faster — a daily swing of $30–60 is common. That is why risk control matters even more with gold.',
            'Emas (XAUUSD) dinilai dalam dolar per auns, dan ia bergerak lebih pantas — swing harian $30–60 adalah biasa. Sebab itu kawalan risiko lebih penting dengan emas.'
          ),
          state: { revealTo: 39 },
        },
      ])
    ),
    q(
      s('You buy XAUUSD at 2400. It rises to 2420. What happened?', 'Anda membeli XAUUSD pada 2400. Ia naik ke 2420. Apa yang berlaku?'),
      [
        {
          text: s('Gold became more expensive in dollars — your position gains $20 per ounce.', 'Emas menjadi lebih mahal dalam dolar — posisi anda untung $20 per auns.'),
          correct: true,
          why: s(
            'Right. XAUUSD is dollars per ounce. The quote moved 20 dollars up, so a long position gains $20 for each ounce controlled. The exact money depends on your position size (covered in the lots lesson).',
            'Betul. XAUUSD ialah dolar per auns. Sebut harga bergerak naik $20, jadi posisi long untung $20 bagi setiap auns yang dikawal. Jumlah wang sebenar bergantung pada saiz posisi anda (dikaji dalam pelajaran lot).'
          ),
        },
        {
          text: s('The dollar became stronger than gold.', 'Dolar menjadi lebih kuat daripada emas.'),
          why: s(
            'Actually the opposite reading: gold buys MORE dollars per ounce now. XAUUSD rising means gold strengthened against the dollar (or the dollar weakened against gold).',
            'Sebenarnya bacaan bertentangan: emas membeli LEBIH dolar per auns sekarang. XAUUSD naik bermakna emas menguat berbanding dolar (atau dolar melemah berbanding emas).'
          ),
        },
        {
          text: s('You earned exactly $20 in your account.', 'Anda memperoleh tepat $20 dalam akaun anda.'),
          why: s(
            'Not automatically — it is $20 per ounce, and your position size decides how many ounces you control. With 0.1 lots (10 oz) the gain is about $200; with 0.01 lots (1 oz) about $20.',
            'Tidak automatik — ia $20 per auns, dan saiz posisi anda menentukan berapa auns yang dikawal. Dengan 0.1 lot (10 auns) keuntungan kira-kira $200; dengan 0.01 lot (1 auns) kira-kira $20.'
          ),
        },
      ]
    ),
    txt(
      s('Why traders watch gold', 'Mengapa trader memerhati emas'),
      s(
        'Gold is a global benchmark: it reacts to interest rates, the US dollar, inflation fears and geopolitical stress. It trades nearly 24 hours a day through the week, with the most movement during London and New York hours. In Malaysia time that is roughly 3:00 pm to 6:00 am (we will use live session clocks later).',
        'Emas ialah penanda aras global: ia bertindak balas kepada kadar faedah, dolar AS, kebimbangan inflasi dan tekanan geopolitik. Ia didagangkan hampir 24 jam sehari sepanjang minggu, dengan pergerakan terbesar semasa jam London dan New York. Dalam waktu Malaysia, ia kira-kira 3:00 petang hingga 6:00 pagi (kita akan guna jam sesi langsung kemudian).'
      ),
      {
        bullets: [
          s('XAUUSD = spot gold, quoted in USD per troy ounce.', 'XAUUSD = emas spot, dinilai dalam USD per troy auns.'),
          s('High liquidity, tight spreads — but also fast, volatile moves.', 'Kecairan tinggi, spread ketat — tetapi juga pergerakan pantas dan tidak menentu.'),
          s('News events can move gold violently within seconds.', 'Peristiwa berita boleh menggerakkan emas dengan hebat dalam beberapa saat.'),
        ],
        callout: {
          tone: 'risk',
          text: s(
            'Volatility is a double-edged sword: it creates opportunity and it creates losses just as fast. Position size is your shield.',
            'Volatiliti ialah pedang bermata dua: ia mewujudkan peluang dan juga kerugian sama pantas. Saiz posisi ialah perisai anda.'
          ),
        },
      }
    ),
  ],
};

const l1Quotes: Lesson = {
  id: 'l1-quotes',
  levelId: 'l1',
  title: s('Bid, Ask & Spread', 'Bid, Ask & Spread'),
  summary: s(
    'Why there are two prices, what the spread costs you, and how it affects every trade.',
    'Mengapa terdapat dua harga, berapa kos spread, dan bagaimana ia mempengaruhi setiap dagangan.'
  ),
  minutes: 7,
  xp: 40,
  skills: ['basics', 'execution'],
  steps: [
    txt(
      s('Two prices, always', 'Dua harga, sentiasa'),
      s(
        'Every market shows two prices at once. The BID is what you can sell at. The ASK is what you can buy at. The difference between them is the SPREAD — a small automatic cost of doing business, paid to the market (via your broker).',
        'Setiap pasaran menunjukkan dua harga serentak. BID ialah harga anda boleh jual. ASK ialah harga anda boleh beli. Beza antaranya ialah SPREAD — kos perniagaan automatik kecil, dibayar kepada pasaran (melalui broker anda).'
      ),
      {
        bullets: [
          s('Buy at the ask, close the trade at the bid (for a long).', 'Beli pada ask, tutup dagangan pada bid (untuk long).'),
          s('The moment you enter, you are slightly "down" by the spread — that is normal.', 'Sebaik sahaja anda masuk, anda sedikit "rugi" sebanyak spread — itu normal.'),
          s('Tight-spread markets like gold are cheaper to trade frequently.', 'Pasaran spread ketat seperti emas lebih murah untuk didagangkan kerap.'),
        ],
      }
    ),
    scn(
      s('Spread in action', 'Spread dalam tindakan'),
      scene('l1-spread', bidAskCandles, [
        {
          caption: s(
            'Imagine XAUUSD bid = 2400.00 and ask = 2400.25. The spread is $0.25. If you buy, your position starts $0.25 per ounce behind.',
            'Bayangkan XAUUSD bid = 2400.00 dan ask = 2400.25. Spread ialah $0.25. Jika anda beli, posisi anda bermula $0.25 per auns di belakang.'
          ),
          state: {
            revealTo: 10,
            highlights: [{ from: 0, to: 10, tone: 'gold', pFrom: 2399.6, pTo: 2400.6, label: s('Bid/Ask zone', 'Zon Bid/Ask') }],
          },
        },
        {
          caption: s(
            'Price must travel at least the spread for your trade to break even. Small spreads = easier to profit from small moves — but never forget they exist.',
            'Harga mesti bergerak sekurang-kurangnya sebanyak spread untuk dagangan anda impas. Spread kecil = lebih mudah untung daripada pergerakan kecil — tetapi jangan sesekali lupa ia wujud.'
          ),
          state: { revealTo: 22 },
        },
        {
          caption: s(
            'During news, spreads can widen dramatically for a few seconds. This is one reason experienced traders avoid entering exactly at high-impact news releases.',
            'Semasa berita, spread boleh melebar dengan mendadak selama beberapa saat. Ini sebab trader berpengalaman mengelak daripada memasuki tepat pada pelepasan berita impak tinggi.'
          ),
          state: {
            revealTo: 35,
            highlights: [{ from: 24, to: 35, tone: 'bear', label: s('Spread risk', 'Risiko spread') }],
          },
        },
      ])
    ),
    q(
      s('Why is a trade slightly negative right after opening it?', 'Mengapa dagangan sedikit negatif sejurus selepas dibuka?'),
      [
        {
          text: s('Because the spread is paid immediately when crossing bid/ask.', 'Kerana spread dibayar serta-merta apabila melintasi bid/ask.'),
          correct: true,
          why: s(
            'Correct. You buy at the higher ask and can sell at the lower bid, so the spread is a built-in small hurdle. It also means very short trades fight a real cost.',
            'Betul. Anda membeli pada ask yang lebih tinggi dan boleh menjual pada bid yang lebih rendah, jadi spread ialah halangan kecil terbina-dalam. Ini juga bermakna dagangan sangat singkat melawan kos sebenar.'
          ),
        },
        {
          text: s('Because the broker is charging a hidden commission.', 'Kerana broker mengenakan komisen tersembunyi.'),
          why: s(
            'The spread is not hidden — good brokers display it openly. Some accounts also add commission per trade instead of (or on top of) a spread. Always read your broker contract specs.',
            'Spread bukan tersembunyi — broker baik memaparkannya secara terbuka. Sesetengah akaun juga menambah komisen setiap dagangan selain (atau di atas) spread. Sentiasa baca spesifikasi kontrak broker anda.'
          ),
        },
        {
          text: s('Because price data is delayed.', 'Kerana data harga lewat.'),
          why: s(
            'Delay affects what you SEE, not why a position starts negative. The opening gap between bid and ask is a structural feature of how markets quote prices.',
            'Kelewatan mempengaruhi apa yang anda LIHAT, bukan mengapa posisi bermula negatif. Jurang antara bid dan ask ialah ciri struktural bagaimana pasaran menyebut harga.'
          ),
        },
      ]
    ),
    txt(
      s('Mental model', 'Model mental'),
      s(
        'Think of the spread like a tiny toll booth: you pay it every time you cross. Good trade planning — with room for the spread, target and stop — is what separates planned trades from impulsive ones.',
        'Fikir spread seperti pondok tol kecil: anda membayarnya setiap kali melintasi. Perancangan dagangan yang baik — dengan ruang untuk spread, sasaran dan stop — memisahkan dagangan berancang daripada impulsif.'
      )
    ),
  ],
};

const l1Candles: Lesson = {
  id: 'l1-candles',
  levelId: 'l1',
  title: s('Candlestick Anatomy', 'Anatomi Lilin'),
  summary: s(
    'Open, high, low, close — and what the body and wicks reveal about the fight between buyers and sellers.',
    'Buka, tinggi, rendah, tutup — dan apa yang badan serta bayang dedahkan tentang pertarungan pembeli dan penjual.'
  ),
  minutes: 10,
  xp: 50,
  skills: ['candles', 'basics'],
  steps: [
    txt(
      s('Four prices in one candle', 'Empat harga dalam satu lilin'),
      s(
        'Each candle compresses four prices: OPEN (where it started), HIGH (highest point), LOW (lowest point), CLOSE (where it ended). The rectangle (body) spans open→close. The thin lines (wicks/shadows) show the extremes.',
        'Setiap lilin memampatkan empat harga: OPEN (mula), HIGH (titik tertinggi), LOW (titik terendah), CLOSE (tamat). Segi empat (badan) merentasi open→close. Garisan nipis (bayang) menunjukkan keterlaluan.'
      ),
      {
        bullets: [
          s('Bullish (green): close above open — buyers won the period.', 'Bullish (hijau): tutup di atas buka — pembeli memenangi tempoh itu.'),
          s('Bearish (red): close below open — sellers won.', 'Bearish (merah): tutup di bawah buka — penjual menang.'),
          s('Long wicks show rejection — price went there and was pushed back.', 'Bayang panjang menunjukkan penolakan — harga ke sana dan ditolak balik.'),
        ],
      }
    ),
    widget(
      'candle-anatomy',
      s('Build a candle', 'Bina sebuah lilin'),
      s(
        'Move the sliders to change open, high, low and close. Watch how the shape changes meaning.',
        'Gerakkan pelarung untuk menukar open, high, low dan close. Lihat bagaimana bentuk menukar makna.'
      )
    ),
    scn(
      s('Read the fight', 'Baca pertarungan'),
      scene('l1-candlestory', candleStory, [
        {
          caption: s(
            'A small body with long wicks means indecision: both sides fought hard and nobody clearly won. Traders call this "indecision" or "rejection" depending on where the wicks are.',
            'Badan kecil dengan bayang panjang bermaksud kebimbangan: kedua-dua pihak bertarung hebat dan tiada pihak jelas menang. Trader memanggilnya "kebimbangan" atau "penolakan" bergantung pada kedudukan bayang.'
          ),
          state: {
            revealTo: 11,
            highlights: [{ from: 7, to: 11, tone: 'violet', label: s('Indecision', 'Kebimbangan') }],
          },
        },
        {
          caption: s(
            'A strong body with tiny wicks means conviction: one side dominated from open to close. After a long move, such candles often show momentum — the fuel of breakouts.',
            'Badan kuat dengan bayang kecil bermaksud keyakinan: satu pihak mengawal dari buka ke tutup. Selepas pergerakan panjang, lilin sedemikian sering menunjukkan momentum — bahan api breakout.'
          ),
          state: {
            revealTo: 21,
            highlights: [{ from: 12, to: 21, tone: 'bull', label: s('Conviction', 'Keyakinan') }],
          },
        },
        {
          caption: s(
            'And when a strong move is fully reversed by the next candles, the story changed. Always read candles as a sequence — a story — never in isolation.',
            'Dan apabila pergerakan kuat dibatalkan sepenuhnya oleh lilin seterusnya, cerita telah berubah. Sentiasa baca lilin sebagai urutan — sebuah cerita — bukan secara terasing.'
          ),
          state: {
            revealTo: 31,
            highlights: [{ from: 22, to: 31, tone: 'bear', label: s('Reversal story', 'Cerita pembalikan') }],
          },
        },
      ])
    ),
    q(
      s('A candle has a very long lower wick and a small body near the top. What does it suggest?', 'Satu lilin mempunyai bayang bawah sangat panjang dan badan kecil di bahagian atas. Apa yang ia cadangkan?'),
      [
        {
          text: s('Sellers pushed price down but buyers rejected the low and pushed back.', 'Penjual menolak harga turun tetapi pembeli menolak rendah dan menolak balik.'),
          correct: true,
          why: s(
            'Well read. The long lower wick is the "footprint" of the fight below: price traded much lower and was rejected back up. Context decides if this is a reversal hint or just a pause.',
            'Bacaan baik. Bayang bawah panjang ialah "tapak" pertarungan di bawah: harga didagangkan jauh lebih rendah dan ditolak naik semula. Konteks menentukan sama ada ini petunjuk pembalikan atau hanya jeda.'
          ),
        },
        {
          text: s('The market was closed during that candle.', 'Pasaran ditutup semasa lilin itu.'),
          why: s(
            'A closed market produces no candles at all. Wicks form because trading happened at those extreme prices and then price moved back.',
            'Pasaran tertutup tidak menghasilkan lilin langsung. Bayang terbentuk kerana dagangan berlaku pada harga melampau tersebut kemudian harga bergerak balik.'
          ),
        },
        {
          text: s('It guarantees price will rise next.', 'Ia menjamin harga akan naik seterusnya.'),
          why: s(
            'No candle guarantees anything. It suggests rejection, and traders look for confirmation next — never certainty. Welcome to probabilistic thinking!',
            'Tiada lilin menjamin apa-apa. Ia mencadangkan penolakan, dan trader mencari pengesahan seterusnya — bukan kepastian. Selamat datang kepada pemikiran probabiliti!'
          ),
        },
      ]
    ),
  ],
};

const l1Timeframes: Lesson = {
  id: 'l1-timeframes',
  levelId: 'l1',
  title: s('Timeframes & Chart Basics', 'Timeframe & Asas Carta'),
  summary: s(
    'What M15, H1 and D1 mean, how the same market looks different on each, and which to learn first.',
    'Apa maksud M15, H1 dan D1, bagaimana pasaran yang sama berbeza pada setiap timeframe, dan yang mana untuk dipelajari dahulu.'
  ),
  minutes: 7,
  xp: 40,
  skills: ['charts', 'basics'],
  steps: [
    txt(
      s('Zoom levels of time', 'Aras zoom masa'),
      s(
        'A timeframe is how much time each candle covers: M1 = one minute, M15 = fifteen minutes, H1 = one hour, D1 = one day. The same market tells a different story at each zoom level — all of them are true at the same time.',
        'Timeframe ialah berapa masa setiap lilin meliputi: M1 = satu minit, M15 = lima belas minit, H1 = satu jam, D1 = satu hari. Pasaran yang sama menceritakan cerita berbeza pada setiap aras zoom — semuanya benar pada masa yang sama.'
      ),
      {
        bullets: [
          s('Higher timeframe (D1/H1) = bigger picture, fewer signals, more reliable structure.', 'Timeframe lebih tinggi (D1/H1) = gambaran lebih besar, isyarat kurang, struktur lebih dipercayai.'),
          s('Lower timeframe (M5/M15) = detail and precision for entries, but more noise.', 'Timeframe lebih rendah (M5/M15) = butiran dan ketepatan untuk entri, tetapi lebih hingar.'),
          s('Beginners learn fastest on M15–H1 charts where moves are readable and slow enough to study.', 'Pemula belajar paling pantas pada carta M15–H1 di mana pergerakan mudah dibaca dan cukup perlahan untuk dikaji.'),
        ],
      }
    ),
    scn(
      s('The same market, three zooms', 'Pasaran sama, tiga zoom'),
      scene('l1-timeframes', tfBase, [
        {
          caption: s(
            'This is one market on a medium timeframe. Notice how trends and pullbacks are easy to see here.',
            'Ini pasaran yang sama pada timeframe sederhana. Perhatikan bagaimana trend dan pullback mudah dilihat di sini.'
          ),
          state: { revealTo: 14 },
        },
        {
          caption: s(
            'Zoom in (lower timeframe) and every single swing becomes its own miniature trend. More detail — but more false-looking signals.',
            'Zoom masuk (timeframe lebih rendah) dan setiap swing menjadi trend mini tersendiri. Lebih terperinci — tetapi lebih banyak isyarat yang kelihatan palsu.'
          ),
          state: {
            revealTo: 28,
            highlights: [{ from: 15, to: 28, tone: 'sky', label: s('Lower TF detail', 'Butiran TF rendah') }],
          },
        },
        {
          caption: s(
            'Zoom out (higher timeframe) and that whole section becomes one small part of a bigger move. Never judge a big decision on a tiny chart.',
            'Zoom keluar (timeframe lebih tinggi) dan seluruh bahagian itu menjadi satu bahagian kecil pergerakan lebih besar. Jangan buat keputusan besar pada carta kecil.'
          ),
          state: {
            revealTo: 47,
            highlights: [{ from: 0, to: 47, tone: 'gold', label: s('Higher TF context', 'Konteks TF tinggi') }],
          },
        },
      ])
    ),
    q(
      s('Which timeframe is best for a complete beginner to first learn structure?', 'Timeframe mana terbaik untuk pemula mula belajar struktur?'),
      [
        {
          text: s('M15–H1: readable moves with enough time to think.', 'M15–H1: pergerakan mudah dibaca dengan cukup masa untuk berfikir.'),
          correct: true,
          why: s(
            'Good choice. These timeframes show clean swings without the hyperactivity of M1. You will add multi-timeframe analysis properly in Level 3.',
            'Pilihan baik. Timeframe ini menunjukkan swing bersih tanpa hiperaktiviti M1. Anda akan menambah analisis pelbagai timeframe dengan betul di Tahap 3.'
          ),
        },
        {
          text: s('M1, because more candles means more practice.', 'M1, kerana lebih banyak lilin bermaksud lebih banyak latihan.'),
          why: s(
            'More candles ≠ more learning. M1 noise teaches beginners to see patterns that are not meaningful. Speed comes AFTER skill.',
            'Lebih banyak lilin ≠ lebih banyak pembelajaran. Hingar M1 mengajar pemula melihat corak yang tidak bermakna. Kelajuan datang SELEPAS kemahiran.'
          ),
        },
        {
          text: s('D1 only — everything else is noise.', 'D1 sahaja — selain itu semua hingar.'),
          why: s(
            'D1 is excellent for context, but each candle is a full day — slow feedback makes learning basics harder. Combine D1 context with M15–H1 detail as you advance.',
            'D1 sangat baik untuk konteks, tetapi setiap lilin ialah satu hari penuh — maklum balas perlahan menyukarkan pembelajaran asas. Gabungkan konteks D1 dengan butiran M15–H1 apabila anda maju.'
          ),
        },
      ]
    ),
    txt(
      s('Chart hygiene', 'Kebersihan carta'),
      s(
        'Clean charts read better: one or two tools at a time, clear colours with fixed meanings (green = bullish/support, red = bearish/resistance), and always know which timeframe you are looking at before acting.',
        'Carta bersih lebih mudah dibaca: satu atau dua alat pada satu masa, warna jelas dengan makna tetap (hijau = bullish/sokongan, merah = bearish/rintangan), dan sentiasa tahu timeframe yang anda lihat sebelum bertindak.'
      )
    ),
  ],
};

const l1Leverage: Lesson = {
  id: 'l1-leverage',
  levelId: 'l1',
  title: s('Lots, Leverage, Margin & Equity', 'Lot, Leveraj, Margin & Ekuiti'),
  summary: s(
    'The mechanics of position size and borrowed exposure — the concepts that decide how fast accounts grow or die.',
    'Mekanik saiz posisi dan pendedahan pinjaman — konsep yang menentukan kelajuan akaun berkembang atau mati.'
  ),
  minutes: 11,
  xp: 55,
  skills: ['risk', 'basics'],
  steps: [
    txt(
      s('Lots = how much you control', 'Lot = berapa banyak yang anda kawal'),
      s(
        'A "lot" is the unit of position size. For gold (XAUUSD), 1 standard lot = 100 troy ounces. So 0.10 lots = 10 ounces, 0.01 lots = 1 ounce. If gold moves $1 and you hold 0.10 lots, your P&L moves about $10.',
        '"Lot" ialah unit saiz posisi. Untuk emas (XAUUSD), 1 lot standard = 100 troy auns. Jadi 0.10 lot = 10 auns, 0.01 lot = 1 auns. Jika emas bergerak $1 dan anda pegang 0.10 lot, P&L anda bergerak kira-kira $10.'
      ),
      {
        bullets: [
          s('Forex standard lot = 100,000 units of the base currency.', 'Lot standard forex = 100,000 unit mata wang asas.'),
          s('Contract sizes differ per broker and per symbol — always check the specs.', 'Saiz kontrak berbeza mengikut broker dan simbol — sentiasa semak spesifikasi.'),
          s('Bigger lots = bigger profits AND bigger losses. Size is risk.', 'Lot lebih besar = keuntungan lebih besar DAN kerugian lebih besar. Saiz ialah risiko.'),
        ],
      }
    ),
    txt(
      s('Leverage & margin', 'Leveraj & margin'),
      s(
        'Leverage lets you control a large position with a small deposit (margin). 1:100 leverage means $1,000 margin can control $100,000 of exposure. Leverage magnifies BOTH profit and loss equally — it does not change the odds, only the stakes.',
        'Leveraj membolehkan anda mengawal posisi besar dengan deposit kecil (margin). Leveraj 1:100 bermakna margin $1,000 boleh mengawal pendedahan $100,000. Leveraj membesarkan KEUNTUNGAN dan KERUGIAN sama rata — ia tidak mengubah peluang, hanya pertaruhan.'
      ),
      {
        bullets: [
          s('Margin = the deposit reserved to hold the position.', 'Margin = deposit yang ditahan untuk memegang posisi.'),
          s('Equity = balance + floating P&L. If equity falls below margin requirements, stop-out can close trades automatically.', 'Ekuiti = baki + P&L terapung. Jika ekuiti jatuh di bawah keperluan margin, stop-out boleh menutup dagangan secara automatik.'),
          s('Professional traders use far less leverage than their broker allows.', 'Trader profesional menggunakan leveraj jauh lebih rendah daripada yang dibenarkan broker.'),
        ],
        callout: {
          tone: 'risk',
          text: s(
            'High leverage is the #1 reason beginners blow accounts. A 1:500 account can lose 50% of equity on a single careless 1% price move. Choose small size first; leverage is optional power, not a requirement.',
            'Leveraj tinggi ialah sebab #1 pemula memusnahkan akaun. Akaun 1:500 boleh kehilangan 50% ekuiti pada satu pergerakan harga cuai 1%. Pilih saiz kecil dahulu; leveraj ialah kuasa pilihan, bukan keperluan.'
          ),
        },
      }
    ),
    scn(
      s('Margin in a live sequence', 'Margin dalam urutan langsung'),
      scene('l1-leverage', levCandles, [
        {
          caption: s(
            'You open a BUY of 0.10 lots (10 oz) on gold at 2380 with $500 equity and 1:100 leverage. Margin used: about $238. You still have free margin to breathe.',
            'Anda membuka BUY 0.10 lot (10 auns) emas pada 2380 dengan ekuiti $500 dan leveraj 1:100. Margin digunakan: kira-kira $238. Anda masih ada margin bebas untuk bernafas.'
          ),
          state: { revealTo: 8 },
        },
        {
          caption: s(
            'Price moves up $14 → floating profit ≈ $140 (10 oz × $14). Your equity is now about $640. Leverage worked in your favour.',
            'Harga naik $14 → keuntungan terapung ≈ $140 (10 auns × $14). Ekuiti anda kini kira-kira $640. Leveraj berpihak kepada anda.'
          ),
          state: {
            revealTo: 20,
            highlights: [{ from: 9, to: 20, tone: 'bull', label: s('+ $140 floating', '+ $140 terapung') }],
          },
        },
        {
          caption: s(
            'Now imagine the opposite entry: price falls $14 instead. Floating LOSS ≈ $140 — more than a quarter of your starting equity gone on one small move. This is why size decides survival.',
            'Bayangkan entri bertentangan: harga turun $14 pula. KERUGIAN terapung ≈ $140 — lebih suku ekuiti permulaan anda hilang pada satu pergerakan kecil. Sebab itu saiz menentukan kelangsungan.'
          ),
          state: {
            revealTo: 39,
            highlights: [{ from: 21, to: 39, tone: 'bear', label: s('Same size, opposite outcome', 'Saiz sama, hasil bertentangan') }],
          },
        },
      ])
    ),
    q(
      s('What does leverage change about a trade?', 'Apa yang leveraj ubah tentang dagangan?'),
      [
        {
          text: s('How much exposure you control per dollar of margin.', 'Berapa pendedahan yang anda kawal setiap dolar margin.'),
          correct: true,
          why: s(
            'Exactly. Leverage scales exposure and therefore scales P&L swings. Your edge (or lack of one) is unchanged — only the size of each bet changes.',
            'Tepat. Leveraj menskala pendedahan dan dengan itu menskala ayunan P&L. Kelebihan anda (atau ketiadaannya) tidak berubah — hanya saiz setiap pertaruhan berubah.'
          ),
        },
        {
          text: s('It increases the probability of winning.', 'Ia meningkatkan kebarangkalian menang.'),
          why: s(
            'No — probabilities come from your strategy and market behaviour. Leverage only decides how violently equity reacts to those probabilities.',
            'Tidak — kebarangkalian datang daripada strategi anda dan kelakuan pasaran. Leveraj hanya menentukan betapa hebat ekuiti bertindak balas kepada kebarangkalian tersebut.'
          ),
        },
        {
          text: s('It eliminates the need for a stop loss.', 'Ia menghapuskan keperluan stop loss.'),
          why: s(
            'The opposite! With leverage, a stop loss (or equivalent hard risk limit) is MORE important, because moves that seem small can consume large parts of equity.',
            'Sebaliknya! Dengan leveraj, stop loss (atau had risiko keras setara) LEBIH penting, kerana pergerakan yang kelihatan kecil boleh memakan bahagian besar ekuiti.'
          ),
        },
      ]
    ),
  ],
};

const l1Pnl: Lesson = {
  id: 'l1-pnl',
  levelId: 'l1',
  title: s('Profit, Loss, Pips & Points', 'Untung, Rugi, Pip & Point'),
  summary: s(
    'How to compute P&L in gold and forex, and how to think in R multiples instead of money.',
    'Cara mengira P&L dalam emas dan forex, dan cara berfikir dalam gandaan R dan bukan wang.'
  ),
  minutes: 9,
  xp: 45,
  skills: ['risk', 'basics'],
  steps: [
    txt(
      s('The P&L formula', 'Formula P&L'),
      s(
        'P&L = position size × price change. For XAUUSD with lots: P&L ≈ lots × 100 × (exit − entry) for a buy. If you buy 0.20 lots at 2400 and exit at 2415: 0.20 × 100 × 15 = $300.',
        'P&L = saiz posisi × perubahan harga. Untuk XAUUSD dengan lot: P&L ≈ lot × 100 × (keluar − masuk) untuk beli. Jika anda beli 0.20 lot pada 2400 dan keluar pada 2415: 0.20 × 100 × 15 = $300.'
      ),
      {
        bullets: [
          s('For forex pairs, distance is measured in pips; pip value depends on pair and lot size.', 'Untuk pasangan forex, jarak diukur dalam pip; nilai pip bergantung pada pasangan dan saiz lot.'),
          s('Points vs pips: brokers quote both; for gold many traders call $0.10 a "point".', 'Point vs pip: broker menyebut kedua-duanya; untuk emas ramai trader memanggil $0.10 satu "point".'),
          s('Always compute P&L BEFORE entry — never after.', 'Sentiasa kira P&L SEBELUM entri — bukan selepas.'),
        ],
      }
    ),
    q(
      s('You SELL 0.50 lots of XAUUSD at 2410 and cover at 2402. What is the approximate P&L?', 'Anda MENJUAL 0.50 lot XAUUSD pada 2410 dan tutup pada 2402. Apakah P&L anggaran?'),
      [
        {
          text: s('+$400 (price fell $8, 50 oz × $8 = $400)', '+$400 (harga turun $8, 50 auns × $8 = $400)'),
          correct: true,
          why: s(
            'Correct. 0.50 lots = 50 ounces. For a sell, profit comes from the price falling: $8 × 50 oz = +$400 before spread/commission.',
            'Betul. 0.50 lot = 50 auns. Untuk jual, keuntungan datang daripada harga turun: $8 × 50 auns = +$400 sebelum spread/komisen.'
          ),
        },
        {
          text: s('−$400, because sells lose when price falls.', '−$400, kerana jual rugi apabila harga turun.'),
          why: s(
            'Selling profits when price falls — you sold high and bought back lower. If price had RISEN to 2418 instead, that would be a $400 loss.',
            'Jual untung apabila harga turun — anda jual tinggi dan beli balik lebih rendah. Jika harga NAIK ke 2418 pula, itu kerugian $400.'
          ),
        },
        {
          text: s('+$8.', '+$8.'),
          why: s(
            'That would be true for 1 ounce (0.01 lots). With 0.50 lots you control 50 ounces, so multiply the $8 move by 50.',
            'Itu benar untuk 1 auns (0.01 lot). Dengan 0.50 lot anda mengawal 50 auns, jadi darab pergerakan $8 dengan 50.'
          ),
        },
      ]
    ),
    txt(
      s('Think in R, not dollars', 'Fikir dalam R, bukan dolar'),
      s(
        'If you risk $100 to make $250, that is +2.5R (R = the amount risked). Thinking in R keeps you honest: a "small loss" is one that stayed within your planned R, and a "good win" is one that paid multiple R. Money scales with account size — R does not.',
        'Jika anda risiko $100 untuk membuat $250, itu +2.5R (R = jumlah yang dirisikokan). Berfikir dalam R menjadikan anda jujur: "kerugian kecil" ialah yang kekal dalam R yang dirancang, dan "kemenangan baik" ialah yang membayar berganda R. Wang berskala dengan saiz akaun — R tidak.'
      ),
      {
        callout: {
          tone: 'key',
          text: s(
            'This whole academy grades decisions in R. A losing trade with a good plan is a well-executed trade. A winning trade with no plan is luck — luck does not compound.',
            'Akademi ini menilai keputusan dalam R. Dagangan rugi dengan pelan baik ialah dagangan yang dilaksanakan dengan baik. Dagangan untung tanpa pelan ialah nasib — nasib tidak berkembang maju.'
          ),
        },
      }
    ),
    q(
      s('A trade risks $50 and closes for +$150. What is the result in R?', 'Satu dagangan merisikokan $50 dan ditutup pada +$150. Apakah hasil dalam R?'),
      [
        {
          text: s('+3R', '+3R'),
          correct: true,
          why: s('150 ÷ 50 = 3R. The trade paid three times the risk — excellent execution if it was planned.', '150 ÷ 50 = 3R. Dagangan membayar tiga kali risiko — pelaksanaan cemerlang jika ia dirancang.'),
        },
        {
          text: s('+1.5R', '+1.5R'),
          why: s('R divides profit by the amount RISKED ($50), not by the profit itself. 150/50 = 3.', 'R membahagi keuntungan dengan jumlah DIRISIKOKAN ($50), bukan dengan keuntungan itu sendiri. 150/50 = 3.'),
        },
        {
          text: s('+150R', '+150R'),
          why: s('That would mean risking just $1 to make $150. R is a ratio of profit to risk — here the ratio is 3.', 'Itu bermakna merisikokan hanya $1 untuk membuat $150. R ialah nisbah keuntungan kepada risiko — di sini nisbahnya 3.'),
        },
      ]
    ),
  ],
};

export const level1: Level = {
  id: 'l1',
  index: 1,
  title: s('Absolute Beginner', 'Pemula Mutlak'),
  tagline: s('What markets are, and how a candle tells its story', 'Apa itu pasaran, dan bagaimana lilin menceritakan kisahnya'),
  description: s(
    'Start from zero: markets, Forex, gold, candles, timeframes, and the vocabulary of risk.',
    'Mula dari sifar: pasaran, Forex, emas, lilin, timeframe, dan kosa kata risiko.'
  ),
  color: '#4CC9F0',
  lessons: [l1WhatIsTrading, l1ForexGold, l1Quotes, l1Candles, l1Timeframes, l1Leverage, l1Pnl],
};
