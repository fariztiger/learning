import type { S } from '@/lib/types';
import { s } from './helpers';

export interface GlossaryTerm {
  id: string;
  term: S;
  short: S;
  long: S;
  category: 'basics' | 'price-action' | 'smc' | 'risk' | 'process';
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'forex',
    term: s('Forex (FX)', 'Forex (FX)'),
    short: s('The global market where currencies are exchanged.', 'Pasaran global di mana mata wang ditukar.'),
    long: s(
      'The foreign exchange market — the largest financial market in the world, where currencies trade in pairs (e.g., EUR/USD). It operates 24 hours a day during the week with major centres in London, New York, Tokyo and Sydney.',
      'Pasaran pertukaran asing — pasaran kewangan terbesar di dunia, di mana mata wang didagangkan secara berpasangan (cth., EUR/USD). Ia beroperasi 24 jam sehari sepanjang minggu dengan pusat utama di London, New York, Tokyo dan Sydney.'
    ),
    category: 'basics',
  },
  {
    id: 'xauusd',
    term: s('XAUUSD', 'XAUUSD'),
    short: s('Spot gold quoted in US dollars per troy ounce.', 'Emas spot dinilai dalam dolar AS per troy auns.'),
    long: s(
      'The symbol for spot gold: how many US dollars one troy ounce of gold costs. 1 standard lot = 100 ounces at most brokers. Gold is popular for its liquidity, strong trends during London/New York, and sensitivity to interest rates and the dollar.',
      'Simbol untuk emas spot: berapa dolar AS kos satu troy auns emas. 1 lot standard = 100 auns di kebanyakan broker. Emas popular kerana kecairannya, trend kuat semasa London/New York, serta sensitiviti kepada kadar faedah dan dolar.'
    ),
    category: 'basics',
  },
  {
    id: 'candlestick',
    term: s('Candlestick', 'Lilin (Candlestick)'),
    short: s('One period of price shown as open, high, low, close.', 'Satu tempoh harga ditunjukkan sebagai buka, tinggi, rendah, tutup.'),
    long: s(
      'A candle compresses four prices of a time period into one shape: the body spans open to close; the wicks show the high and low. Green closes above the open (bullish), red closes below (bearish). Candles form the base language of price action.',
      'Lilin memampatkan empat harga tempoh masa kepada satu bentuk: badan merentasi buka hingga tutup; bayang menunjukkan tinggi dan rendah. Hijau ditutup di atas buka (bullish), merah ditutup di bawah (bearish). Lilin menjadi bahasa asas tindakan harga.'
    ),
    category: 'basics',
  },
  {
    id: 'bid-ask',
    term: s('Bid / Ask / Spread', 'Bid / Ask / Spread'),
    short: s('Sell price, buy price, and the gap between them.', 'Harga jual, harga beli, dan jurang antaranya.'),
    long: s(
      'The bid is the price you can sell at; the ask is the price you can buy at. The spread is the difference — a small immediate cost of trading. Spreads widen in low liquidity and around news events.',
      'Bid ialah harga anda boleh jual; ask ialah harga anda boleh beli. Spread ialah beza — kos kecil serta-merta untuk berdagang. Spread melebar dalam kecairan rendah dan sekitar peristiwa berita.'
    ),
    category: 'basics',
  },
  {
    id: 'lot',
    term: s('Lot', 'Lot'),
    short: s('Unit of position size (gold: 1 lot = 100 oz).', 'Unit saiz posisi (emas: 1 lot = 100 auns).'),
    long: s(
      'Lots standardise position size. For XAUUSD at most brokers, 1 standard lot = 100 troy ounces, so a $1 price move = $100 per lot. Micro-lots (0.01) are the beginner-friendly unit. Always verify contract sizes with your broker.',
      'Lot memstandardkan saiz posisi. Untuk XAUUSD di kebanyakan broker, 1 lot standard = 100 troy auns, jadi gerakan harga $1 = $100 setiap lot. Mikro-lot (0.01) ialah unit mesra pemula. Sentiasa sahkan saiz kontrak dengan broker anda.'
    ),
    category: 'risk',
  },
  {
    id: 'leverage',
    term: s('Leverage', 'Leveraj'),
    short: s('Controlling a large position with small margin.', 'Mengawal posisi besar dengan margin kecil.'),
    long: s(
      'Leverage (e.g., 1:100) lets you control exposure larger than your deposit. It magnifies profits and losses equally. High leverage is a leading cause of beginner account losses — use small fractions of what is offered.',
      'Leveraj (cth., 1:100) membolehkan anda mengawal pendedahan lebih besar daripada deposit. Ia membesarkan keuntungan dan kerugian sama rata. Leveraj tinggi ialah punca utama kerugian akaun pemula — gunakan pecahan kecil daripada yang ditawarkan.'
    ),
    category: 'risk',
  },
  {
    id: 'margin',
    term: s('Margin & Equity', 'Margin & Ekuiti'),
    short: s('Deposit held for a position; balance plus floating P&L.', 'Deposit ditahan untuk posisi; baki serta P&L terapung.'),
    long: s(
      'Margin is the capital reserved to open and hold a leveraged position. Equity = balance + floating profit/loss. If equity falls below required margin, the broker may close positions automatically (stop-out).',
      'Margin ialah modal yang ditahan untuk membuka dan memegang posisi berkadar. Ekuiti = baki + keuntungan/kerugian terapung. Jika ekuiti jatuh di bawah margin yang diperlukan, broker boleh menutup posisi secara automatik (stop-out).'
    ),
    category: 'risk',
  },
  {
    id: 'pip',
    term: s('Pip & Point', 'Pip & Point'),
    short: s('Smallest standard price units (FX: 0.0001).', 'Unit harga standard terkecil (FX: 0.0001).'),
    long: s(
      'A pip is the standard unit of price change — for most pairs 0.0001; for JPY pairs 0.01. A point is usually one-tenth of a pip, or in gold common usage $0.10. Precise definitions vary by broker — check their specifications.',
      'Pip ialah unit standard perubahan harga — untuk kebanyakan pasangan 0.0001; untuk pasangan JPY 0.01. Point biasanya satu persepuluh pip, atau dalam penggunaan biasa emas $0.10. Definisi tepat berbeza mengikut broker — semak spesifikasi mereka.'
    ),
    category: 'basics',
  },
  {
    id: 'r-multiple',
    term: s('R Multiple', 'Gandaan R'),
    short: s('Profit or loss measured in units of initial risk.', 'Untung atau rugi diukur dalam unit risiko awal.'),
    long: s(
      'R = the amount risked on a trade. A +2R trade won twice what was risked. Thinking in R standardises results across account sizes and strategies — the core metric of professional performance review.',
      'R = jumlah yang dirisikokan pada dagangan. Dagangan +2R menang dua kali ganda yang dirisikokan. Berfikir dalam R memstandardkan hasil merentasi saiz akaun dan strategi — metrik teras semakan prestasi profesional.'
    ),
    category: 'risk',
  },
  {
    id: 'structure',
    term: s('Market Structure', 'Struktur Pasaran'),
    short: s('The pattern of swing highs and lows (HH/HL/LH/LL).', 'Corak swing high dan rendah (HH/HL/LH/LL).'),
    long: s(
      'Market structure describes the sequence of swing points. Uptrends print higher highs and higher lows; downtrends print lower highs and lower lows. Structure is the primary context tool in this academy.',
      'Struktur pasaran menerangkan urutan titik swing. Uptrend menghasilkan higher high dan higher low; downtrend menghasilkan lower high dan lower low. Struktur ialah alat konteks utama dalam akademi ini.'
    ),
    category: 'price-action',
  },
  {
    id: 'bos',
    term: s('BOS', 'BOS'),
    short: s('Break of Structure — trend continuation event.', 'Break of Structure — peristiwa penerusan trend.'),
    long: s(
      'A Break of Structure occurs when price breaks the most recent swing in the direction of the trend (e.g., a new high above the previous high in an uptrend). It confirms the prevailing side is still in control.',
      'Break of Structure berlaku apabila harga memecahkan swing terkini mengikut arah trend (cth., high baharu melepasi high sebelumnya dalam uptrend). Ia mengesahkan pihak yang berkuasa masih mengawal.'
    ),
    category: 'smc',
  },
  {
    id: 'choch',
    term: s('CHoCH', 'CHoCH'),
    short: s('Change of Character — first reversal warning.', 'Change of Character — amaran pembalikan pertama.'),
    long: s(
      'A Change of Character occurs when price breaks the last swing that protected the trend (e.g., the last higher low in an uptrend). It is the first structural signal that control may be shifting — often the start of reversal setups.',
      'Change of Character berlaku apabila harga memecahkan swing terakhir yang melindungi trend (cth., higher low terakhir dalam uptrend). Ia isyarat struktur pertama bahawa kawalan mungkin beralih — sering permulaan setup pembalikan.'
    ),
    category: 'smc',
  },
  {
    id: 'liquidity',
    term: s('Liquidity', 'Kecairan'),
    short: s('Clusters of orders — stops, breakouts, targets.', 'Kelompok order — stop, breakout, sasaran.'),
    long: s(
      'In price-action language, liquidity refers to areas where many orders sit: above equal highs (buy-side), below equal lows (sell-side). Price is often drawn toward these pools. This is a behavioural model inferred from charts — not direct visibility into institutional order books.',
      'Dalam bahasa tindakan harga, kecairan merujuk kawasan di mana banyak order duduk: di atas high sama (belian), di bawah rendah sama (jualan). Harga sering tertarik ke kolam ini. Ini model kelakuan yang disimpulkan daripada carta — bukan penglihatan langsung ke dalam buku order institusi.'
    ),
    category: 'smc',
  },
  {
    id: 'sweep',
    term: s('Liquidity Sweep', 'Liquidity Sweep'),
    short: s('Wick beyond a level, close back inside — a trap.', 'Bayang melepasi paras, tutup semula ke dalam — perangkap.'),
    long: s(
      'A sweep takes out the orders above/below an obvious level, then closes back inside. Breakout traders are trapped and stop losses fuel the reversal. Distinguished from a real breakout by the CLOSE and the follow-through.',
      'Sweep mengambil order di atas/bawah paras yang jelas, kemudian ditutup semula ke dalam. Trader breakout terperangkap dan stop loss membiayai pembalikan. Dibezakan daripada breakout sebenar melalui PENUTUPAN dan SUSULAN.'
    ),
    category: 'smc',
  },
  {
    id: 'fvg',
    term: s('Fair Value Gap (FVG)', 'Fair Value Gap (FVG)'),
    short: s('A three-candle imbalance left by fast price.', 'Ketidakseimbangan tiga lilin yang ditinggalkan harga pantas.'),
    long: s(
      'When candle 3 moves so fast that a gap exists between its wick and candle 1\'s wick, that area is an FVG — a momentary inefficiency. Price often returns to "mitigate" (fill) these gaps, making them reaction and entry zones.',
      'Apabila lilin 3 bergerak terlalu pantas sehingga jurang wujud antara bayangnya dan bayang lilin 1, kawasan itu ialah FVG — ketidakcekapan sementara. Harga sering kembali untuk "mitigasi" (mengisi) jurang ini, menjadikannya zon tindak balas dan entri.'
    ),
    category: 'smc',
  },
  {
    id: 'order-block',
    term: s('Order Block', 'Order Block'),
    short: s('The origin candles of a displacement move.', 'Lilin asal pergerakan anjakan.'),
    long: s(
      'An order block marks the last opposing candles before a strong, displaced move — the area where significant decisions were likely made. Fresh (unmitigated) order blocks are considered higher quality than those price has already revisited.',
      'Order block menanda lilin bertentangan terakhir sebelum pergerakan kuat beranjak — kawasan di mana keputusan penting kemungkinan dibuat. Order block baharu (belum mitigasi) dianggap lebih berkualiti daripada yang telah dilawati semula harga.'
    ),
    category: 'smc',
  },
  {
    id: 'displacement',
    term: s('Displacement', 'Anjakan'),
    short: s('A strong, one-sided, fast price move.', 'Pergerakan harga kuat, satu pihak, pantas.'),
    long: s(
      'Displacement shows decision energy: large bodies moving in one direction, small opposing wicks, often leaving an FVG. It validates breakouts, confirms zone defences, and is a key ingredient of high-quality entries.',
      'Anjakan menunjukkan tenaga keputusan: badan besar bergerak satu arah, bayang bertentangan kecil, sering meninggalkan FVG. Ia mengesahkan breakout, mengesahan pertahanan zon, dan menjadi bahan utama entri berkualiti tinggi.'
    ),
    category: 'smc',
  },
  {
    id: 'premium-discount',
    term: s('Premium / Discount', 'Premium / Discount'),
    short: s('Upper/lower halves of a trading range.', 'Separuh atas/bawah julat dagangan.'),
    long: s(
      'Anchoring a range from swing low to swing high: the top half is premium (expensive), the bottom half discount (cheap). Buyers seek discount; sellers seek premium. The midpoint is equilibrium. A location filter — never a guarantee.',
      'Menambat julat dari swing low ke swing high: separuh atas ialah premium (mahal), separuh bawah diskaun (murah). Pembeli mencari diskaun; penjual mencari premium. Titik tengah ialah keseimbangan. Penapis lokasi — bukan jaminan.'
    ),
    category: 'smc',
  },
  {
    id: 'mtf',
    term: s('Multi-Timeframe', 'Pelbagai Timeframe'),
    short: s('HTF for context, LTF for entry precision.', 'HTF untuk konteks, LTF untuk ketepatan entri.'),
    long: s(
      'Analysing the same market at several timeframes: higher timeframes define direction and key zones; lower timeframes time entries and refine stops. Discipline rule: never enter on a low timeframe against the higher-timeframe context.',
      'Menganalisis pasaran yang sama pada beberapa timeframe: timeframe lebih tinggi mentakrifkan arah dan zon utama; timeframe lebih rendah menentukan masa entri dan memperhalusi stop. Peraturan disiplin: jangan masuk pada timeframe rendah menentang konteks timeframe tinggi.'
    ),
    category: 'smc',
  },
  {
    id: 'support-resistance',
    term: s('Support & Resistance', 'Sokongan & Rintangan'),
    short: s('Areas where price has reacted before.', 'Kawasan di mana harga pernah bertindak balas.'),
    long: s(
      'Support is an area where buying has previously entered; resistance where selling has. Draw them as zones, not exact lines. Strength grows with multiple valid reactions — and weakens each time price revisits (mitigation).',
      'Sokongan ialah kawasan di mana pembelian pernah masuk; rintangan di mana penjualan pernah masuk. Lukis sebagai zon, bukan garisan tepat. Kekuatan bertambah dengan beberapa tindak balas sah — dan melemah setiap kali harga melawat semula (mitigasi).'
    ),
    category: 'price-action',
  },
  {
    id: 'breakout',
    term: s('Breakout & False Breakout', 'Breakout & False Breakout'),
    short: s('Close beyond a level vs a failed push through it.', 'Tutup melepasi paras vs tolakan gagal menembusinya.'),
    long: s(
      'A breakout closes beyond a level with displacement and holds. A false breakout (trap) pokes beyond and closes back — often a liquidity sweep. The close and follow-through distinguish the two.',
      'Breakout ditutup melepasi paras dengan anjakan dan kekal. False breakout (perangkap) menyentuh melepasinya dan ditutup semula — sering liquidity sweep. Penutupan dan susulan membezakan kedua-duanya.'
    ),
    category: 'price-action',
  },
  {
    id: 'pullback',
    term: s('Pullback', 'Pullback'),
    short: s('A pause/retrace within a continuing trend.', 'Jeda/tarikan dalam trend yang diteruskan.'),
    long: s(
      'A pullback is a temporary move against the trend direction that ends by continuing the trend (e.g., a higher low in an uptrend). Pullbacks offer better entry prices than chasing. They are invalidated when the protecting swing breaks.',
      'Pullback ialah pergerakan sementara bertentangan arah trend yang berakhir dengan meneruskan trend (cth., higher low dalam uptrend). Pullback menawarkan harga entri lebih baik daripada mengejar. Ia tidak sah apabila swing pelindung pecah.'
    ),
    category: 'price-action',
  },
  {
    id: 'volatility',
    term: s('Volatility / ATR', 'Volatiliti / ATR'),
    short: s('How much price moves; ATR measures it.', 'Berapa banyak harga bergerak; ATR mengukurnya.'),
    long: s(
      'Volatility describes movement size per period. Average True Range (ATR) quantifies it over N candles (usually 14). Stops, targets and position sizes should adapt to volatility — the same dollar risk needs smaller size when ATR expands.',
      'Volatiliti menerangkan saiz pergerakan setiap tempoh. Average True Range (ATR) mengkuantifikasikannya melepasi N lilin (biasanya 14). Stop, sasaran dan saiz posisi patut menyesuaikan dengan volatiliti — risiko dolar sama memerlukan saiz lebih kecil apabila ATR berkembang.'
    ),
    category: 'risk',
  },
  {
    id: 'stop-loss',
    term: s('Stop Loss', 'Stop Loss'),
    short: s('The exit where your idea is proven wrong.', 'Keluar di mana idea anda terbukti salah.'),
    long: s(
      'A stop loss is a pre-planned exit at the point of invalidation — not a pain threshold. Place it beyond the structure that defines your idea (with a volatility buffer). Never widen it after entry.',
      'Stop loss ialah keluar terancang pada titik pembatalan — bukan ambang kesakitan. Letakkannya melepasi struktur yang mentakrifkan idea anda (dengan penampan volatiliti). Jangan sekali-kali melebarkannya selepas entri.'
    ),
    category: 'risk',
  },
  {
    id: 'risk-reward',
    term: s('Risk-to-Reward', 'Risiko-ke-Ganjaran'),
    short: s('How much you target per unit risked.', 'Berapa anda sasarkan setiap unit yang dirisikokan.'),
    long: s(
      'R:R compares potential reward to planned risk (e.g., 2:1 = 2R). Higher R:R lowers the required win rate for profitability — 2R+ structures are the academy guideline. Compute it with real structural stops, not optimistic ones.',
      'R:R membandingkan ganjaran berpotensi dengan risiko terancang (cth., 2:1 = 2R). R:R lebih tinggi menurunkan kadar kemenangan diperlukan untuk keuntungan — struktur 2R+ ialah garis panduan akademi. Kiranya dengan stop struktur sebenar, bukan yang optimis.'
    ),
    category: 'risk',
  },
  {
    id: 'position-sizing',
    term: s('Position Sizing', 'Saiz Posisi'),
    short: s('Choosing lot size from risk and stop distance.', 'Memilih saiz lot daripada risiko dan jarak stop.'),
    long: s(
      'Size = risk money ÷ (stop distance × value per unit). Fixed fractional risk (0.5–2% per trade) makes losses survivable and streaks mathematically manageable. Size is risk — the most important variable you fully control.',
      'Saiz = wang risiko ÷ (jarak stop × nilai per unit). Risiko pecahan tetap (0.5–2% setiap dagangan) menjadikan kerugian boleh terselamat dan siri boleh diurus secara matematik. Saiz ialah risiko — pemboleh ubah paling penting yang anda kawal sepenuhnya.'
    ),
    category: 'risk',
  },
  {
    id: 'expectancy',
    term: s('Expectancy', 'Jangkaan'),
    short: s('Average R expected per trade over many trades.', 'Purata R dijangka setiap dagangan melepasi banyak dagangan.'),
    long: s(
      'Expectancy = (win% × avg win) − (loss% × avg loss), in R. Positive expectancy = a real business; negative = more trades lose more. Measured from a journal over a meaningful sample (50+ trades).',
      'Jangkaan = (win% × purata menang) − (loss% × purata rugi), dalam R. Jangkaan positif = perniagaan sebenar; negatif = lebih banyak dagangan rugi lebih banyak. Diukur daripada jurnal melepasi sampel bermakna (50+ dagangan).'
    ),
    category: 'process',
  },
  {
    id: 'drawdown',
    term: s('Drawdown', 'Drawdown'),
    short: s('Peak-to-trough equity decline.', 'Penurunan ekuiti puncak-ke-lembah.'),
    long: s(
      'Drawdown measures how far equity falls from its peak. Every strategy has them. Plan a maximum tolerated drawdown in advance and reduce risk when approaching it — the difference between a business and a blowup.',
      'Drawdown mengukur sejauh mana ekuiti jatuh dari puncaknya. Setiap strategi mempunyainya. Rancang drawdown maksimum yang sanggup ditanggung awal dan kurangkan risiko apabila menghampirinya — beza antara perniagaan dan kehancuran.'
    ),
    category: 'process',
  },
  {
    id: 'backtesting',
    term: s('Backtesting', 'Backtesting'),
    short: s('Replaying history against written rules.', 'Memainkan semula sejarah mengikut peraturan bertulis.'),
    long: s(
      'Systematically applying your rules to historical scenarios to estimate statistics (win rate, avg R, drawdown). Protects against overfitting when rules are written first, tested on large samples, and validated out-of-sample.',
      'Mengaplikasikan peraturan anda secara sistematik kepada skenario sejarah untuk menganggar statistik (kadar kemenangan, purata R, drawdown). Melindungi daripada overfitting apabila peraturan ditulis dahulu, diuji pada sampel besar, dan disahkan luar-sampel.'
    ),
    category: 'process',
  },
  {
    id: 'no-trade',
    term: s('NO TRADE', 'NO TRADE'),
    short: s('The decision that no valid setup exists.', 'Keputusan bahawa tiada setup sah wujud.'),
    long: s(
      'Professional traders spend most of their time waiting. When the market shows none of your setups, the correct position is no position. NO TRADE is a complete, valid decision — and one of the strongest risk controls that exists.',
      'Trader profesional menghabiskan kebanyakan masa menunggu. Apabila pasaran tidak mempersembahkan mana-mana setup anda, kedudukan yang betul ialah tiada kedudukan. NO TRADE ialah keputusan lengkap dan sah — dan antara kawalan risiko terkuat yang wujud.'
    ),
    category: 'process',
  },
];
