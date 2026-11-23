/* Level 4 — Strategy & Execution */
import type { Lesson, Level } from '@/lib/types';
import { compose, injectEqualHighs, injectSweep, makeRange, makeTrend, makeWalk, injectFVG } from '@/lib/chart/builders';
import { q, s, scn, scene, txt, widget } from '../helpers';

let setupBase = makeRange({ seed: 4101, lo: 2388, hi: 2400, count: 20 });
setupBase = injectEqualHighs(setupBase, { indices: [7, 13, 18], level: 2399, seed: 51 });
setupBase = injectSweep(setupBase, { at: 19, level: 2399, side: 'high', seed: 52, hold: 2 });
const setupCandles = compose([
  setupBase,
  makeTrend({ seed: 4102, start: 2394, count: 18, dir: -1, strength: 1.25, vol: 1.9 }),
]);

const triggerCandles = compose([
  makeTrend({ seed: 4201, start: 2380, count: 16, dir: 1, strength: 1.3, vol: 1.9 }),
  makeWalk({ seed: 4202, start: 2400, count: 12, vol: 1.5, drift: -0.28 }),
  makeTrend({ seed: 4203, start: 2395, count: 12, dir: 1, strength: 1.15, vol: 1.8 }),
]);

const invalidCandles = compose([
  makeTrend({ seed: 4301, start: 2410, count: 14, dir: -1, strength: 1.2, vol: 1.9 }),
  makeTrend({ seed: 4302, start: 2392, count: 14, dir: 1, strength: 1.25, vol: 1.9 }),
]);

const mgmtCandles = makeTrend({ seed: 4501, start: 2360, count: 52, dir: 1, strength: 1.15, vol: 2.1 });

const l4Setup: Lesson = {
  id: 'l4-setup',
  levelId: 'l4',
  title: s('From Concepts to a Rule-Based Setup', 'Daripada Konsep kepada Setup Berperaturan'),
  summary: s(
    'Combine structure, liquidity, zones and confirmation into a written, repeatable trading plan.',
    'Gabungkan struktur, kecairan, zon dan pengesahan menjadi pelan dagangan bertulis dan boleh diulang.'
  ),
  minutes: 11,
  xp: 65,
  skills: ['process', 'execution'],
  steps: [
    txt(
      s('A setup is a checklist, not a feeling', 'Setup ialah senarai semak, bukan perasaan'),
      s(
        'A professional setup answers, in writing: WHICH market condition, WHERE you will engage (zone), WHAT confirms the idea (trigger), WHERE you are wrong (invalidation), WHERE you take profit (targets), and HOW MUCH you risk (size). If any answer is missing, it is not a setup — it is a guess.',
        'Setup profesional menjawab, secara bertulis: KEADAAN pasaran mana, DI MANA anda berinteraksi (zon), APA yang mengesahkan idea (pencetus), DI MANA anda salah (pembatalan), DI MANA anda ambil untung (sasaran), dan BERAPA anda risiko (saiz). Jika mana-mana jawapan tiada, ia bukan setup — ia tekaan.'
      ),
      {
        bullets: [
          s('Example skeleton: "In a bullish HTF, after a sweep of SSL, on CHoCH + FVG mitigation, buy with SL below the sweep low, TP at opposing liquidity."', 'Rangka contoh: "Dalam HTF bullish, selepas sweep SSL, pada CHoCH + mitigasi FVG, beli dengan SL di bawah rendah sweep, TP pada kecairan bertentangan."'),
          s('Every word in that sentence was taught in earlier levels — this is where they combine.', 'Setiap perkataan dalam ayat itu telah diajar di tahap terdahulu — di sinilah ia bergabung.'),
          s('If the market does not present your setup: NO TRADE. Waiting is a position.', 'Jika pasaran tidak mempersembahkan setup anda: NO TRADE. Menunggu ialah satu kedudukan.'),
        ],
        callout: {
          tone: 'key',
          text: s(
            'The market does not pay you for activity. It pays you for executed patience.',
            'Pasaran tidak membayar anda untuk aktiviti. Ia membayar anda untuk kesabaran yang dilaksanakan.'
          ),
        },
      }
    ),
    scn(
      s('A full setup, narrated', 'Setup penuh, dinarasikan'),
      scene('l4-setup', setupCandles, [
        {
          caption: s(
            'Step 1 — Context & pool: range with equal highs. Above = buy-side liquidity. Our bias: a sweep of that pool may set up a reversal.',
            'Langkah 1 — Konteks & kolam: range dengan high sama. Di atas = kecairan beli. Andaian kami: sweep kolam itu mungkin menetapkan pembalikan.'
          ),
          state: {
            revealTo: 18,
            highlights: [{ from: 5, to: 18, tone: 'gold', pFrom: 2397, pTo: 2401, label: s('BSL pool', 'Kolam BSL') }],
          },
        },
        {
          caption: s(
            'Step 2 — The sweep happens: price takes the highs and closes back below. This is our event. The trap is sprung.',
            'Langkah 2 — Sweep berlaku: harga mengambil high dan ditutup semula di bawah. Ini peristiwa kami. Perangkap terpicu.'
          ),
          state: {
            revealTo: 23,
            highlights: [{ from: 19, to: 22, tone: 'bear', label: s('Sweep event', 'Peristiwa sweep') }],
          },
        },
        {
          caption: s(
            'Step 3 — Confirmation: strong red candles (displacement) away from the pool, breaking the range lows = CHoCH. Now the plan activates.',
            'Langkah 3 — Pengesahan: lilin merah kuat (anjakan) menjauhi kolam, memecahkan rendah range = CHoCH. Kini pelan diaktifkan.'
          ),
          state: {
            revealTo: 30,
            highlights: [{ from: 24, to: 30, tone: 'violet', label: s('CHoCH + displacement', 'CHoCH + anjakan') }],
          },
        },
        {
          caption: s(
            'Step 4 — Execution zone: we plan to sell on a pullback toward the broken structure/FVG, with stop above the sweep high and target at the range lows (sell-side liquidity). Every parameter is written BEFORE entry.',
            'Langkah 4 — Zon pelaksanaan: kami merancang menjual pada pullback ke arah struktur/FVG yang pecah, dengan stop di atas high sweep dan sasaran pada rendah range (kecairan jual). Setiap parameter ditulis SEBELUM entri.'
          ),
          state: {
            revealTo: 37,
            highlights: [{ from: 31, to: 37, tone: 'sky', pFrom: 2388, pTo: 2394, label: s('Entry zone', 'Zon entri') }],
          },
        },
      ])
    ),
    q(
      s('Your checklist says "buy after CHoCH with FVG trigger". The market rallies without you. What now?', 'Senarai semak anda berkata "beli selepas CHoCH dengan pencetus FVG". Pasaran naik tanpa anda. Apa sekarang?'),
      [
        {
          text: s('Nothing. Missed trades are free lessons — wait for the next valid setup.', 'Tiada apa. Dagangan terlepas ialah pelajaran percuma — tunggu setup sah seterusnya.'),
          correct: true,
          why: s('Professional response. Chasing after the fact converts a planned trade into an emotional one. The market runs multiple times a week; your edge is in the plan, not the chase.', 'Respons profesional. Mengejar selepas fakta menukar dagangan berancang menjadi emosi. Pasaran bergerak beberapa kali seminggu; kelebihan anda dalam pelan, bukan kejaran.'),
        },
        {
          text: s('Chase it at market with bigger size to recover the missed profit.', 'Kejar pada pasaran dengan saiz lebih besar untuk memulihkan untung terlepas.'),
          why: s('That is revenge trading against the market for "owing" you. The market owes nothing. Bigger size on a worse price is the classic blowup recipe.', 'Itu dagangan dendam terhadap pasaran kerana "berhutang" kepada anda. Pasaran tidak berhutang apa-apa. Saiz lebih besar pada harga lebih teruk ialah resipi kehancuran klasik.'),
        },
        {
          text: s('Rewrite the rules to say "enter at any time".', 'Tulis semula peraturan untuk "masuk pada bila-bila masa".'),
          why: s('Rules that change to fit the last outcome are not rules. Amend rules between sessions, with evidence — never mid-trade.', 'Peraturan yang berubah untuk memadankan hasil terakhir bukan peraturan. Pinda peraturan antara sesi, dengan bukti — bukan semasa dagangan.'),
        },
      ]
    ),
    widget(
      'rr-calc',
      s('Plan builder sandbox', 'Sandbox pembina pelan'),
      s(
        'Set entry, stop and target on a hypothetical trade — see the R multiple and position maths live.',
        'Tetapkan entry, stop dan sasaran pada dagangan hipotesis — lihat gandaan R dan matematik posisi secara langsung.'
      )
    ),
  ],
};

const l4Entries: Lesson = {
  id: 'l4-entries',
  levelId: 'l4',
  title: s('Entry Triggers & Confirmation', 'Pencetus Entri & Pengesahan'),
  summary: s(
    'Zone first, trigger second — the exact moments that turn an area of interest into a decision.',
    'Zon dahulu, pencetus kedua — saat tepat yang menukar kawasan minat kepada keputusan.'
  ),
  minutes: 9,
  xp: 55,
  skills: ['execution', 'process'],
  steps: [
    txt(
      s('The two-step entry', 'Entri dua langkah'),
      s(
        'Step 1: find the ZONE (where price may react — FVG, order block, sweep level). Step 2: wait for the TRIGGER (evidence price is actually reacting — rejection candle, CHoCH on lower TF, momentum shift). Entering the zone without a trigger is catching a falling knife. Entering the trigger without a zone is chasing.',
        'Langkah 1: cari ZON (di mana harga mungkin bertindak balas — FVG, order block, paras sweep). Langkah 2: tunggu PENCETUS (bukti harga benar-benar bertindak balas — lilin penolakan, CHoCH pada TF rendah, anjakan momentum). Memasuki zon tanpa pencetus seperti menangkap pisau jatuh. Memasuki pencetus tanpa zon seperti mengejar.'
      ),
      {
        bullets: [
          s('Triggers: rejection/pin bar at the zone, engulfing, LTF CHoCH, displacement back in your direction.', 'Pencetus: penolakan/pin bar pada zon, engulfing, CHoCH LTF, anjakan semula ke arah anda.'),
          s('Better trigger quality = tighter stop = larger size for the same risk.', 'Kualiti pencetus lebih baik = stop lebih ketat = saiz lebih besar untuk risiko sama.'),
          s('If the trigger appears far from your zone, the trade is already over — wait for the next one.', 'Jika pencetus muncul jauh dari zon anda, dagangan telah pun tamat — tunggu yang seterusnya.'),
        ],
      }
    ),
    scn(
      s('Zone vs trigger', 'Zon vs pencetus'),
      scene('l4-triggers', triggerCandles, [
        {
          caption: s(
            'An uptrend creates a demand area. Price returns to it — but nothing happens yet. Zone reached is NOT an entry.',
            'Uptrend mewujudkan kawasan permintaan. Harga kembali kepadanya — tetapi tiada apa berlaku lagi. Zon dicapai BUKAN entri.'
          ),
          state: {
            revealTo: 20,
            highlights: [{ from: 14, to: 20, tone: 'gold', pFrom: 2392, pTo: 2397, label: s('Zone reached', 'Zon dicapai') }],
          },
        },
        {
          caption: s(
            'The trigger: a rejection candle + bullish displacement out of the zone. NOW the plan has evidence. Note how much safer the stop can be.',
            'Pencetus: lilin penolakan + anjakan bullish keluar dari zon. KINI pelan mempunyai bukti. Perhatikan betapa lebih selamat stopnya.'
          ),
          state: {
            revealTo: 28,
            highlights: [{ from: 21, to: 27, tone: 'bull', label: s('Trigger', 'Pencetus') }],
          },
        },
        {
          caption: s(
            'Two-step entries lose some profit compared with gambling the zone — but they save you from the many times the zone fails. Survival first.',
            'Entri dua langkah kehilangan sedikit untung berbanding mempertaruhkan zon — tetapi ia menyelamatkan anda daripada banyak kali zon gagal. Kelangsungan dahulu.'
          ),
          state: { revealTo: 39 },
        },
      ])
    ),
    q(
      s('Price touches your demand zone and immediately drops through it. What does the two-step method tell you?', 'Harga menyentuh zon permintaan anda dan terus jatuh menembusinya. Apa yang kaedah dua langkah beritahu anda?'),
      [
        {
          text: s('No trigger = no entry. The zone failed; stand aside and reassess.', 'Tiada pencetus = tiada entri. Zon gagal; ketepikan dan nilai semula.'),
          correct: true,
          why: s('Exactly. The trigger is what proves the zone is defended. Without it, you simply watched — and watching costs nothing.', 'Tepat. Pencetus yang membuktikan zon dipertahankan. Tanpanya, anda hanya memerhati — dan memerhati tidak berkos apa-apa.'),
        },
        {
          text: s('Double the position since price is cheaper now.', 'Gandakan posisi kerana harga lebih murah sekarang.'),
          why: s('Adding to a failing zone without confirmation is the "catching a falling knife" trap — cheap prices can get much cheaper.', 'Menambah kepada zon yang gagal tanpa pengesahan ialah perangkap "menangkap pisau jatuh" — harga murah boleh menjadi jauh lebih murah.'),
        },
        {
          text: s('Assume the trigger will come later and enter now.', 'Andaikan pencetus akan datang kemudian dan masuk sekarang.'),
          why: s('Trading on future assumptions is how hope replaces evidence. Wait for the trigger to exist in the present.', 'Berdagang atas andaian masa depan ialah bagaimana harapan menggantikan bukti. Tunggu pencetus wujud pada masa kini.'),
        },
      ]
    ),
  ],
};

const l4Invalidation: Lesson = {
  id: 'l4-invalidation',
  levelId: 'l4',
  title: s('Invalidation & Structural Stop Loss', 'Pembatalan & Stop Loss Struktur'),
  summary: s(
    'Where your idea is proven wrong — the most important line you will ever draw.',
    'Di mana idea anda terbukti salah — garisan paling penting yang akan anda lukis.'
  ),
  minutes: 10,
  xp: 60,
  skills: ['risk', 'execution'],
  steps: [
    txt(
      s('The stop is a statement of honesty', 'Stop ialah pernyataan kejujuran'),
      s(
        'A stop loss is not a random distance or a money amount you "hope" to survive. It is placed where YOUR IDEA IS INVALID. For a sweep-reversal short: above the sweep high. For a demand long: below the demand zone. If price reaches that point, the hypothesis failed — exit without argument.',
        'Stop loss bukan jarak rawak atau jumlah wang yang anda "harap" terselamat. Ia diletakkan di mana IDEA ANDA TIDAK SAH. Untuk singkat pembalikan-sweep: di atas high sweep. Untuk long permintaan: di bawah zon permintaan. Jika harga sampai ke titik itu, hipotesis gagal — keluar tanpa berhujah.'
      ),
      {
        bullets: [
          s('Structure-based stops: beyond the swing/zone that defines the idea.', 'Stop berasaskan struktur: melepasi swing/zon yang mentakrifkan idea.'),
          s('Volatility buffer: add a small ATR-style margin so noise alone does not stop you (we measure with ATR in L5).', 'Penampan volatiliti: tambah margin kecil gaya ATR supaya hingar semata-mata tidak menghentikan anda (kita ukur dengan ATR di L5).'),
          s('If the structural stop makes position size tiny — that is information: skip the trade.', 'Jika stop struktur menjadikan saiz posisi sangat kecil — itu maklumat: langkau dagangan.'),
        ],
        callout: {
          tone: 'risk',
          text: s(
            'Never widen a stop after entry. Widening a stop is not "giving the trade room" — it is changing the risk AFTER the contract is signed. Decide the invalidation point first; the market then either respects your idea or it does not.',
            'Jangan sekali-kali melebarkan stop selepas entri. Melebarkan stop bukan "memberi ruang dagangan" — ia menukar risiko SELEPAS kontrak ditandatangani. Tentukan titik pembatalan dahulu; pasaran kemudian sama ada menghormati idea anda atau tidak.'
          ),
        },
      }
    ),
    scn(
      s('Where is the idea wrong?', 'Di mana idea salah?'),
      scene('l4-inval', invalidCandles, [
        {
          caption: s(
            'A falling market forms a low, then rallies. A trader considers buying the pullback. First question: WHERE is this idea proven wrong?',
            'Pasaran jatuh membentuk rendah, kemudian naik. Trader mempertimbangkan membeli pullback. Soalan pertama: DI MANA idea ini terbukti salah?'
          ),
          state: { revealTo: 14 },
        },
        {
          caption: s(
            'The answer: below the swing low that defines the structure. If price goes there, the higher-low pattern is dead and the long idea has no basis.',
            'Jawapannya: di bawah swing low yang mentakrifkan struktur. Jika harga ke sana, corak higher-low mati dan idea long tiada asas.'
          ),
          state: {
            revealTo: 22,
            highlights: [{ from: 12, to: 22, tone: 'bear', pFrom: 2388, pTo: 2392, label: s('Invalidation', 'Pembatalan') }],
          },
        },
        {
          caption: s(
            'Place the stop THERE, measure the distance, and size the position so that reaching the invalidation costs exactly your planned risk (e.g., 1%). The stop is the plan — not the pain.',
            'Letak stop DI SANA, ukur jaraknya, dan saizkan posisi supaya sampai ke pembatalan menelan tepat risiko yang dirancang (cth., 1%). Stop ialah pelan — bukan kesakitan.'
          ),
          state: {
            revealTo: 27,
            highlights: [{ from: 12, to: 27, tone: 'gold', label: s('Stop = invalidation', 'Stop = pembatalan') }],
          },
        },
      ])
    ),
    q(
      s('Your long trade is losing and approaching the structural stop. What is the correct action?', 'Dagangan long anda rugi dan menghampiri stop struktur. Apakah tindakan yang betul?'),
      [
        {
          text: s('Let it hit the stop — the idea is invalid; exit is the plan.', 'Biarkan ia memukul stop — idea tidak sah; keluar ialah pelan.'),
          correct: true,
          why: s('Textbook discipline. The stop is where the hypothesis dies. Taking planned losses is the cost of the business — and the reason you survive to take the winners.', 'Disiplin teksbook. Stop ialah tempat hipotesis mati. Mengambil kerugian terancang ialah kos perniagaan — dan sebab anda terselamat untuk mengambil pemenang.'),
        },
        {
          text: s('Widen the stop and hope for a reversal.', 'Lebarkan stop dan berharap pembalikan.'),
          why: s('Hope is not a strategy. Widening stops converts a planned 1% loss into an unplanned 5% loss — the death spiral of most accounts.', 'Harapan bukan strategi. Melebarkan stop menukar kerugian terancang 1% menjadi tidak terancang 5% — lingkaran kematian kebanyakan akaun.'),
        },
        {
          text: s('Add another position to average down.', 'Tambah posisi lain untuk purata turun.'),
          why: s('Scaling into a broken idea multiplies risk exactly when the evidence turned against you. Add only to WINNERS within a pre-planned structure.', 'Menambah pada idea yang rosak menggandakan risiko tepat ketika bukti menentang anda. Tambah hanya pada PEMENANG dalam struktur terancang.'),
        },
      ]
    ),
  ],
};

const l4Targets: Lesson = {
  id: 'l4-targets',
  levelId: 'l4',
  title: s('Targets & Reward-to-Risk', 'Sasaran & Ganjaran-ke-Risiko'),
  summary: s(
    'Where to take profit, how to think in R multiples, and why 2R changes everything.',
    'Di mana mengambil untung, cara berfikir dalam gandaan R, dan mengapa 2R mengubah segalanya.'
  ),
  minutes: 9,
  xp: 55,
  skills: ['risk', 'execution'],
  steps: [
    txt(
      s('Targets live where liquidity lives', 'Sasaran hidup di mana kecairan hidup'),
      s(
        'Do not pick targets by greed. Logical targets sit where price has a reason to go: opposing liquidity pools, previous swing extremes, range edges, or measured moves. The R multiple (reward ÷ risk) then tells you whether the trade is worth taking at all.',
        'Jangan pilih sasaran mengikut ketamakan. Sasaran logik duduk di tempat harga mempunyai sebab untuk pergi: kolam kecairan bertentangan, keterlaluan swing sebelumnya, tepi range, atau pergerakan terukur. Gandaan R (ganjaran ÷ risiko) kemudian memberitahu sama ada dagangan berbaloi langsung.'
      ),
      {
        bullets: [
          s('Below 1R expectancy, you need an extremely high win rate — usually a losing proposition.', 'Di bawah jangkaan 1R, anda perlukan kadar kemenangan sangat tinggi — biasanya cadangan yang rugi.'),
          s('2R+ means you can be wrong half the time and still survive or profit.', '2R+ bermakna anda boleh salah separuh masa dan masih terselamat atau untung.'),
          s('Scaling out (partial TP) is allowed — but decide the rules before entry, not during euphoria.', 'Keluar berperingkat (TP separa) dibenarkan — tetapi tentukan peraturan sebelum entri, bukan semasa euforia.'),
        ],
      }
    ),
    q(
      s('A trade risks $100 to a structural stop. The nearest real liquidity target is $180 away. Verdict?', 'Satu dagangan merisikokan $100 ke stop struktur. Sasaran kecairan sebenar terdekat $180 jauhnya. Vonis?'),
      [
        {
          text: s('1.8R — acceptable but marginal; consider skipping or restructuring for 2R+.', '1.8R — boleh diterima tetapi marginal; pertimbang langkau atau struktur semula untuk 2R+.'),
          correct: true,
          why: s('Solid judgement. 1.8R is not terrible, but the best trades are usually obvious 2R+. If the stop can be tighter on better confirmation, the same target becomes 2.5R+. If not — skipping is fine.', 'Hakim mantap. 1.8R tidak teruk, tetapi dagangan terbaik biasanya jelas 2R+. Jika stop boleh lebih ketat pada pengesahan lebih baik, sasaran sama menjadi 2.5R+. Jika tidak — langkau adalah baik.'),
        },
        {
          text: s('Great trade — any profit is good.', 'Dagangan hebat — sebarang untung adalah baik.'),
          why: s('"Any profit" ignores the losses that come with it. A 0.5R win strategy loses money over time if the win rate is not extraordinary. Think in expectancy, not single outcomes.', '"Sebarang untung" mengabaikan kerugian yang datang bersamanya. Strategi menang 0.R kehilangan wang dari masa ke masa jika kadar kemenangan tidak luar biasa. Fikir dalam jangkaan, bukan hasil tunggal.'),
        },
        {
          text: s('Move the stop closer to make it 3R.', 'Dekatkan stop untuk menjadikannya 3R.'),
          why: s('Moving the stop closer than the invalidation point inflates the R number while increasing stop-out probability. R must be computed with a REAL stop.', 'Menghampirkan stop melepasi titik pembatalan meningkatkan nombor R sambil meningkatkan kebarangkalian stop-out. R mesti dikira dengan stop SEBENAR.'),
        },
      ]
    ),
    widget(
      'rr-calc',
      s('R:R playground', 'Taman permainan R:R'),
      s(
        'Move entry, stop and target. Watch R change. Build intuition for what 2R feels like on a chart.',
        'Gerakkan entry, stop dan sasaran. Lihat R berubah. Bina gerak hati untuk bagaimana 2R terasa pada carta.'
      )
    ),
  ],
};

const l4Sizing: Lesson = {
  id: 'l4-sizing',
  levelId: 'l4',
  title: s('Position Sizing & Risk Control', 'Saiz Posisi & Kawalan Risiko'),
  summary: s(
    'The formula that keeps you alive: fixed fractional risk, correct lot maths, and honest assumptions.',
    'Formula yang mengekalkan anda hidup: risiko pecahan tetap, matematik lot betul, dan andaian jujur.'
  ),
  minutes: 10,
  xp: 60,
  skills: ['risk', 'process'],
  steps: [
    txt(
      s('Risk first, size second', 'Risiko dahulu, saiz kedua'),
      s(
        'Decide the RISK (e.g., 1% of account), then the invalidation (stop distance), then compute size: size = risk money ÷ (stop distance × value per unit). For XAUUSD (100 oz/lot): lots = risk$ ÷ (100 × |entry − SL|). Everything else is commentary.',
        'Tentukan RISIKO (cth., 1% akaun), kemudian pembatalan (jarak stop), kemudian kira saiz: saiz = wang risiko ÷ (jarak stop × nilai per unit). Untuk XAUUSD (100 auns/lot): lot = risiko$ ÷ (100 × |entry − SL|). Segala lain ialah ulasan.'
      ),
      {
        bullets: [
          s('Fixed fractional: risk the same PERCENTAGE per trade — 0.5–2% is the professional band.', 'Pecahan tetap: risiko PERATUSAN sama setiap dagangan — 0.5–2% ialah jalur profesional.'),
          s('In a losing streak, percentage risk shrinks automatically — your drawdown stays survivable.', 'Dalam siri kerugian, risiko peratusan mengecil secara automatik — drawdown anda kekal terselamat.'),
          s('Contract specs matter: gold 100oz/lot is common but NOT universal — verify yours.', 'Spesifikasi kontrak penting: emas 100 auns/lot adalah biasa tetapi TIDAK universal — sahkan milik anda.'),
        ],
        callout: {
          tone: 'note',
          text: s(
            'The calculator in Tools assumes XAUUSD = 100 oz per standard lot and ignores spread, commission and slippage. Real fills differ — treat results as planning estimates and verify with your broker specifications.',
            'Kalkulator dalam Alat mengandaikan XAUUSD = 100 auns setiap lot standard dan mengabaikan spread, komisen serta gelinciran. Isian sebenar berbeza — anggap hasil sebagai anggaran perancangan dan sahkan dengan spesifikasi broker anda.'
          ),
        },
      }
    ),
    widget(
      'risk-calc',
      s('Risk sandbox', 'Sandbox risiko'),
      s(
        'Set account size, risk percent, entry and stop. The sandbox computes lots, money at risk and R:R — with assumptions shown.',
        'Tetapkan saiz akaun, peratus risiko, entry dan stop. Sandbox mengira lot, wang berisiko dan R:R — dengan andaian dipaparkan.'
      )
    ),
    q(
      s('Account $10,000, risk 1%, stop distance equivalent to $2 per 0.01 lot per $1 move… entry 2400, SL 2390 (=$10 move). Lot size?', 'Akaun $10,000, risiko 1%, jarak stop bersamaan $2 per 0.01 lot per $1 gerakan… entry 2400, SL 2390 (=$10 gerakan). Saiz lot?'),
      [
        {
          text: s('0.10 lots — $100 risk ÷ (100 oz × $10 move) = 0.10.', '0.10 lot — risiko $100 ÷ (100 auns × $10 gerakan) = 0.10.'),
          correct: true,
          why: s('Exactly right. 1% of $10,000 = $100. Each 0.10 lot (10 oz) moves ~$10 per $1, so a $10 adverse move = ~$100. Math first, always.', 'Tepat sekali. 1% daripada $10,000 = $100. Setiap 0.10 lot (10 auns) bergerak ~$10 per $1, jadi gerakan menentang $10 = ~$100. Matematik dahulu, sentiasa.'),
        },
        {
          text: s('1.00 lots — to make the trade worthwhile.', '1.00 lot — supaya dagangan berbaloi.'),
          why: s('With 1 lot (100 oz), the same $10 stop distance = $1,000 risk = 10% of the account. One loss like that and the survival math collapses.', 'Dengan 1 lot (100 auns), jarak stop $10 sama = risiko $1,000 = 10% akaun. Satu kerugian sedemikian dan matematik kelangsungan runtuh.'),
        },
        {
          text: s('0.01 lots — smaller is always safer.', '0.01 lot — lebih kecil sentiasa lebih selamat.'),
          why: s('Too small is safe but inefficient: risking 0.1% means profits barely register. Risk the amount your plan states — no more, no less.', 'Terlalu kecil selamat tetapi tidak cekap: merisikokan 0.1% bermaksud keuntungan hampir tidak terdaftar. Risikokan jumlah yang dinyatakan pelan anda — tidak lebih, tidak kurang.'),
        },
      ]
    ),
  ],
};

const l4Management: Lesson = {
  id: 'l4-management',
  levelId: 'l4',
  title: s('Trade Management & Scenario Planning', 'Pengurusan Dagangan & Perancangan Skenario'),
  summary: s(
    'What to do while the trade is open — before emotions write the rules for you.',
    'Apa yang perlu dilakukan semasa dagangan terbuka — sebelum emosi menulis peraturan untuk anda.'
  ),
  minutes: 9,
  xp: 55,
  skills: ['process', 'psychology'],
  steps: [
    txt(
      s('Plan the trade, then trade the plan', 'Rancang dagangan, kemudian dagangkan pelan'),
      s(
        'While a trade is open, three scenarios exist: it works, it stalls, it fails. Decide in advance what you do in each. If price reaches target: take it per plan. If it stalls at a decision area: reduce or move to breakeven per plan. If invalidation: exit per plan. The plan is written when you are calm so it can govern you when you are not.',
        'Semasa dagangan terbuka, tiga skenario wujud: ia berjaya, ia tersekat, ia gagal. Tentukan awal apa yang anda lakukan dalam setiap satu. Jika harga sampai sasaran: ambil ikut pelan. Jika tersekat di kawasan keputusan: kurang atau pindah ke impas ikut pelan. Jika pembatalan: keluar ikut pelan. Pelan ditulis ketika anda tenang supaya ia boleh mengawal anda ketika anda tidak.'
      ),
      {
        bullets: [
          s('Breakeven move: only AFTER structure confirms, not out of fear.', 'Gerakan impas: hanya SELEPAS struktur mengesahkan, bukan kerana takut.'),
          s('Partial profits: legitimate if pre-planned; destructive if improvised.', 'Keuntungan separa: sah jika terancang; memusnahkan jika disangga.'),
          s('Screens are for monitoring decisions — not for manufacturing new ones.', 'Skrin untuk memantau keputusan — bukan mengilang yang baharu.'),
        ],
      }
    ),
    scn(
      s('Managing a running trade', 'Mengurus dagangan yang berjalan'),
      scene('l4-manage', mgmtCandles, [
        {
          caption: s(
            'Your long is working. Price makes a new high — the trend is healthy. Do nothing; let the plan breathe.',
            'Long anda berfungsi. Harga membuat high baharu — trend sihat. Buat apa-apa tiada; biarkan pelan bernafas.'
          ),
          state: {
            revealTo: 18,
            highlights: [{ from: 8, to: 16, tone: 'bull', label: s('Working', 'Berfungsi') }],
          },
        },
        {
          caption: s(
            'After the next confirmed higher low, you may move the stop below THAT low (per plan). This locks survival without strangling the trade.',
            'Selepas higher low seterusnya yang disahkan, anda boleh memindah stop DI BAWAH rendah ITU (ikut pelan). Ini mengunci kelangsungan tanpa mencekik dagangan.'
          ),
          state: {
            revealTo: 32,
            highlights: [{ from: 22, to: 30, tone: 'gold', label: s('New invalidation', 'Pembatalan baharu') }],
          },
        },
        {
          caption: s(
            'At the opposing liquidity area, the plan says take profit. Euphoria says "let it run". The plan was written by the calm version of you — trust that person.',
            'Di kawasan kecairan bertentangan, pelan berkata ambil untung. Euforia berkata "biar ia jalan". Pelan ditulis oleh versi tenang anda — percayai orang itu.'
          ),
          state: {
            revealTo: 51,
            highlights: [{ from: 44, to: 51, tone: 'violet', label: s('Target zone', 'Zon sasaran') }],
          },
        },
      ])
    ),
    q(
      s('Price is halfway to target and suddenly reverses to your entry. The plan says "breakeven stop after new high". What now?', 'Harga separuh ke sasaran dan tiba-tiba berbalik ke entri anda. Pelan berkata "stop impas selepas high baharu". Apa sekarang?'),
      [
        {
          text: s('Follow the pre-written rule — if it was triggered, the stop is at breakeven; if not, original stop stands.', 'Ikut peraturan pra-tulis — jika telah dicetuskan, stop di impas; jika tidak, stop asal kekal.'),
          correct: true,
          why: s('The rule was written in advance exactly for this moment. Consistency with your own rules IS the edge — outcomes vary, process compounds.', 'Peraturan ditulis awal tepat untuk saat ini. Konsistensi dengan peraturan sendiri IALAH kelebihan — hasil berbeza-beza, proses berkembang maju.'),
        },
        {
          text: s('Panic-close immediately regardless of rules.', 'Panik-tutup serta-merta tanpa mengira peraturan.'),
          why: s('Emotional exits destroy process. Sometimes they save money — but they teach the wrong lesson: that panic governs, not the plan.', 'Keluar emosi memusnahkan proses. Kadangkala ia menjimatkan wang — tetapi ia mengajar pelajaran salah: bahawa panik yang mengawal, bukan pelan.'),
        },
        {
          text: s('Add to the position since price is at your entry again.', 'Tambah posisi kerana harga semula di entri anda.'),
          why: s('Adding after a stall is rarely planned. Unless the plan pre-defines scale-ins, the correct size at that moment is the size you already hold.', 'Menambah selepas tersekat jarang dirancang. Kecuali pelan mentakrifkan masuk berperingkat, saiz betul pada saat itu ialah saiz yang anda sudah pegang.'),
        },
      ]
    ),
  ],
};

export const level4: Level = {
  id: 'l4',
  index: 4,
  title: s('Strategy & Execution', 'Strategi & Pelaksanaan'),
  tagline: s('Turn analysis into a repeatable, rule-based plan', 'Tukar analisis kepada pelan berulang berasaskan peraturan'),
  description: s(
    'Setups, triggers, invalidation, targets, sizing and management — the complete execution loop.',
    'Setup, pencetus, pembatalan, sasaran, saiz dan pengurusan — gelung pelaksanaan lengkap.'
  ),
  color: '#F5B942',
  lessons: [l4Setup, l4Entries, l4Invalidation, l4Targets, l4Sizing, l4Management],
};
