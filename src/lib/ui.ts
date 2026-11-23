/* Bilingual UI strings — EN + BM. Every UI string lives here. */

import type { S } from './types';

export const UI = {
  /* nav */
  'nav.home': { en: 'Home', ms: 'Utama' },
  'nav.learn': { en: 'Learn', ms: 'Belajar' },
  'nav.simulator': { en: 'Simulator', ms: 'Simulator' },
  'nav.arena': { en: 'Practice Arena', ms: 'Arena Latihan' },
  'nav.dashboard': { en: 'Dashboard', ms: 'Papan Pemuka' },
  'nav.tools': { en: 'Tools', ms: 'Alat' },
  'nav.glossary': { en: 'Glossary', ms: 'Glosari' },
  'nav.broker': { en: 'Open Account', ms: 'Buka Akaun' },
  'nav.menu': { en: 'Menu', ms: 'Menu' },

  /* common */
  'cta.start': { en: 'Start Learning Free', ms: 'Mula Belajar Percuma' },
  'cta.continue': { en: 'Continue Learning', ms: 'Teruskan Belajar' },
  'cta.explore': { en: 'Explore the Platform', ms: 'Terokai Platform' },
  'cta.practice': { en: 'Open Practice Arena', ms: 'Buka Arena Latihan' },
  'cta.simulator': { en: 'Launch Chart Simulator', ms: 'Buka Simulator Carta' },
  'common.minutes': { en: 'min', ms: 'min' },
  'common.level': { en: 'Level', ms: 'Tahap' },
  'common.lesson': { en: 'Lesson', ms: 'Pelajaran' },
  'common.xp': { en: 'XP', ms: 'XP' },
  'common.completed': { en: 'Completed', ms: 'Selesai' },
  'common.progress': { en: 'Progress', ms: 'Kemajuan' },
  'common.next': { en: 'Next', ms: 'Seterusnya' },
  'common.back': { en: 'Back', ms: 'Kembali' },
  'common.close': { en: 'Close', ms: 'Tutup' },
  'common.correct': { en: 'Correct!', ms: 'Betul!' },
  'common.incorrect': { en: 'Not quite', ms: 'Belum tepat' },
  'common.tryAgain': { en: 'Try again', ms: 'Cuba lagi' },
  'common.step': { en: 'Step', ms: 'Langkah' },
  'common.of': { en: 'of', ms: 'daripada' },
  'common.skip': { en: 'Skip intro', ms: 'Langkau' },
  'common.finish': { en: 'Finish Lesson', ms: 'Tamatkan Pelajaran' },
  'common.reset': { en: 'Reset', ms: 'Set Semula' },
  'common.check': { en: 'Check my answer', ms: 'Semak jawapan' },
  'common.reveal': { en: 'Reveal answer', ms: 'Tunjuk jawapan' },
  'common.hint': { en: 'Hint', ms: 'Petunjuk' },
  'common.why': { en: 'Why?', ms: 'Kenapa?' },
  'common.simulated': {
    en: 'Simulated teaching data — not real market prices.',
    ms: 'Data simulasi untuk pembelajaran — bukan harga pasaran sebenar.',
  },
  'common.streak': { en: 'day streak', ms: 'hari berturut' },

  /* landing */
  'hero.badge': {
    en: 'Interactive · Bilingual · Built for real beginners',
    ms: 'Interaktif · Dwibahasa · Dibina untuk pemula sebenar',
  },
  'hero.title1': { en: 'From Zero Knowledge', ms: 'Daripada Sifar Pengetahuan' },
  'hero.title2': { en: 'to Independent Trading Mastery', ms: 'kepada Penguasaan Dagangan Bebas' },
  'hero.sub': {
    en: 'TIGERFX Academy turns complete beginners into disciplined, independent traders through animated lessons, a professional chart simulator and honest, risk-first education in Bahasa Melayu and English.',
    ms: 'TIGERFX Academy mengubah pemula menjadi trader berdisiplin dan bebas melalui pelajaran beranimasi, simulator carta profesional dan pendidikan jujur yang mengutamakan risiko — dalam Bahasa Melayu dan English.',
  },
  'hero.stat1': { en: 'Interactive lessons', ms: 'Pelajaran interaktif' },
  'hero.stat2': { en: 'Practice scenarios', ms: 'Skenario latihan' },
  'hero.stat3': { en: 'Chart drawing tools', ms: 'Alat lukisan carta' },
  'hero.stat4': { en: 'Risk-first education', ms: 'Pendidikan utamakan risiko' },
  'home.path.title': { en: 'The Learning Path', ms: 'Laluan Pembelajaran' },
  'home.path.sub': {
    en: 'Five levels. One journey. Every concept taught visually before it is explained technically.',
    ms: 'Lima tahap. Satu perjalanan. Setiap konsep diajar secara visual sebelum dijelaskan secara teknikal.',
  },
  'home.features.title': { en: 'Built like a product, not a PDF', ms: 'Dibina seperti produk, bukan PDF' },
  'home.features.sub': {
    en: 'Everything on this platform exists to make you better at reading markets and managing risk.',
    ms: 'Segala-galanya di platform ini wujud untuk menjadikan anda lebih mahir membaca pasaran dan mengurus risiko.',
  },
  'home.promise.title': { en: 'Our honest promise', ms: 'Janji jujur kami' },
  'home.promise.body': {
    en: 'No strategy guarantees profit. Markets carry substantial risk of loss. TIGERFX Academy teaches analysis, risk management and decision discipline — completion means demonstrated knowledge, not promised returns. We will never pressure you to open a broker account to learn.',
    ms: 'Tiada strategi menjamin keuntungan. Pasaran membawa risiko kerugian yang besar. TIGERFX Academy mengajar analisis, pengurusan risiko dan disiplin keputusan — penyelesaian bermaksud pengetahuan terbukti, bukan pulangan dijanjikan. Kami tidak akan sesekali memaksa anda membuka akaun broker untuk belajar.',
  },
  'home.risk.title': { en: 'Risk warning', ms: 'Amaran risiko' },
  'home.risk.body': {
    en: 'Trading forex and gold (CFDs) involves significant risk and is not suitable for everyone. You can lose more than your initial deposit depending on leverage and jurisdiction. Never trade money you cannot afford to lose. Seek independent advice if needed. All charts, examples and simulators on this site use synthetic teaching data.',
    ms: 'Dagangan forex dan emas (CFD) melibatkan risiko besar dan tidak sesuai untuk semua orang. Anda boleh kehilangan lebih daripada deposit awal bergantung pada leveraj dan bidang kuasa. Jangan sekali-kali berdagang dengan wang yang anda tidak mampu hilangkan. Dapatkan nasihat bebas jika perlu. Semua carta, contoh dan simulator di laman ini menggunakan data simulasi untuk pembelajaran.',
  },

  /* learn page */
  'learn.title': { en: 'Curriculum', ms: 'Kurikulum' },
  'learn.sub': {
    en: 'A complete beginner-to-advanced journey. Finish what you start — every lesson ends with practice.',
    ms: 'Perjalanan lengkap dari pemula ke mahir. Selesaikan apa yang anda mula — setiap pelajaran berakhir dengan latihan.',
  },
  'learn.lessonsCount': { en: 'lessons', ms: 'pelajaran' },
  'learn.locked': {
    en: 'Recommended order — nothing is locked. Learn at your pace.',
    ms: 'Susunan disyorkan — tiada yang dikunci. Belajar ikut kadar anda.',
  },
  'learn.startLevel': { en: 'Start level', ms: 'Mula tahap' },
  'learn.review': { en: 'Review', ms: 'Ulang kaji' },
  'learn.assessment': { en: 'Practical assessment', ms: 'Penilaian praktikal' },

  /* lesson player */
  'lesson.objectives': { en: 'What you will learn', ms: 'Apa yang anda akan pelajari' },
  'lesson.quizTitle': { en: 'Check your understanding', ms: 'Semak kefahaman anda' },
  'lesson.quizExplain': { en: 'Explanation', ms: 'Penjelasan' },
  'lesson.sceneHint': {
    en: 'Watch the chart, then use the caption to guide your thinking.',
    ms: 'Perhatikan carta, kemudian gunakan kapsyen untuk membimbing pemikiran anda.',
  },
  'lesson.taskTap': { en: 'Tap the chart where it happens', ms: 'Ketik pada carta di mana ia berlaku' },
  'lesson.done': { en: 'Lesson complete!', ms: 'Pelajaran selesai!' },
  'lesson.doneSub': {
    en: 'Your progress is saved on this device automatically.',
    ms: 'Kemajuan anda disimpan pada peranti ini secara automatik.',
  },
  'lesson.nextLesson': { en: 'Next lesson', ms: 'Pelajaran seterusnya' },
  'lesson.backCurriculum': { en: 'Back to curriculum', ms: 'Kembali ke kurikulum' },
  'lesson.score': { en: 'Quiz score', ms: 'Markah kuiz' },
  'lesson.widgetTry': {
    en: 'Explore the interactive tool below — change the inputs and watch what happens.',
    ms: 'Terokai alat interaktif di bawah — ubah input dan lihat apa yang berlaku.',
  },

  /* simulator */
  'sim.title': { en: 'Chart Simulator', ms: 'Simulator Carta' },
  'sim.sub': {
    en: 'A replay-first trading terminal for practice. Draw analysis, plan trades with risk/reward, and get structural feedback on your drawings.',
    ms: 'Terminal dagangan untuk latihan berasaskan replay. Lukis analisis, rancang dagangan dengan risiko/ganjaran, dan dapatkan maklum balas struktur pada lukisan anda.',
  },
  'sim.play': { en: 'Play', ms: 'Main' },
  'sim.pause': { en: 'Pause', ms: 'Jeda' },
  'sim.step': { en: 'Step', ms: 'Langkah' },
  'sim.rewind': { en: 'Rewind', ms: 'Undur' },
  'sim.speed': { en: 'Speed', ms: 'Kelajuan' },
  'sim.mode': { en: 'Mode', ms: 'Mod' },
  'sim.guided': { en: 'Guided', ms: 'Berpandu' },
  'sim.independent': { en: 'Independent', ms: 'Bebas' },
  'sim.drawings': { en: 'Your analysis', ms: 'Analisis anda' },
  'sim.feedback': { en: 'Analysis feedback', ms: 'Maklum balas analisis' },
  'sim.feedbackEmpty': {
    en: 'Draw a level, zone, trendline or trade plan on the chart to receive structural feedback here.',
    ms: 'Lukis paras, zon, garisan trend atau pelan dagangan pada carta untuk menerima maklum balas struktur di sini.',
  },
  'sim.scenario': { en: 'Scenario', ms: 'Skenario' },
  'sim.market': { en: 'Free market', ms: 'Pasaran bebas' },
  'sim.newData': { en: 'New data', ms: 'Data baharu' },
  'sim.hiddenFuture': {
    en: 'Future candles stay hidden until revealed — no hindsight.',
    ms: 'Lilin masa depan kekal tersembunyi sehingga didedahkan — tiada pandangan ke belakang.',
  },
  'sim.tool.cursor': { en: 'Select', ms: 'Pilih' },
  'sim.tool.pan': { en: 'Pan', ms: 'Anjak' },
  'sim.tool.hline': { en: 'Horizontal line', ms: 'Garisan mendatar' },
  'sim.tool.trendline': { en: 'Trendline', ms: 'Garisan trend' },
  'sim.tool.rect': { en: 'Zone', ms: 'Zon' },
  'sim.tool.fib': { en: 'Fibonacci', ms: 'Fibonacci' },
  'sim.tool.arrow': { en: 'Arrow', ms: 'Anak panah' },
  'sim.tool.text': { en: 'Text note', ms: 'Nota teks' },
  'sim.tool.trade': { en: 'Trade plan', ms: 'Pelan dagangan' },
  'sim.tool.eraser': { en: 'Eraser', ms: 'Pemadam' },
  'sim.tradeHelp': {
    en: 'Trade tool: click 1 = entry, click 2 = stop loss, click 3 = take profit.',
    ms: 'Alat dagangan: klik 1 = entry, klik 2 = stop loss, klik 3 = take profit.',
  },
  'sim.undo': { en: 'Undo', ms: 'Buat asal' },
  'sim.redo': { en: 'Redo', ms: 'Ulang buat' },
  'sim.clear': { en: 'Clear all', ms: 'Kosongkan' },
  'sim.zoomHint': { en: 'Scroll to zoom · drag to pan · double-click to fit', ms: 'Tatal untuk zoom · seret untuk anjak · dwi-klik untuk penuhkan' },
  'sim.rr': { en: 'Risk / Reward check', ms: 'Semakan Risiko / Ganjaran' },
  'sim.analysisTitle': { en: 'Structural analysis', ms: 'Analisis struktur' },
  'sim.guideTask': { en: 'Guided task', ms: 'Tugasan berpandu' },
  'sim.session.now': { en: 'Sessions now', ms: 'Sesi sekarang' },

  /* arena */
  'arena.title': { en: 'Practice Arena', ms: 'Arena Latihan' },
  'arena.sub': {
    en: 'Scenario-based drills with reasoning feedback. Progress is earned by understanding, not clicking.',
    ms: 'Latihan berasaskan skenario dengan maklum balas pemikiran. Kemajuan diperoleh melalui kefahaman, bukan klikan.',
  },
  'arena.tier.foundation': { en: 'Foundation', ms: 'Asas' },
  'arena.tier.intermediate': { en: 'Intermediate', ms: 'Pertengahan' },
  'arena.tier.advanced': { en: 'Advanced', ms: 'Mahir' },
  'arena.tier.certification': { en: 'Certification', ms: 'Pensijilan' },
  'arena.start': { en: 'Start scenario', ms: 'Mula skenario' },
  'arena.review': { en: 'Review scenario', ms: 'Ulang kaji skenario' },
  'arena.attempts': { en: 'attempts', ms: 'percubaan' },
  'arena.best': { en: 'best', ms: 'terbaik' },
  'arena.grade': { en: 'Your grade', ms: 'Markah anda' },
  'arena.reasoning': { en: 'Reasoning', ms: 'Pemikiran' },
  'arena.submit': { en: 'Submit analysis', ms: 'Hantar analisis' },
  'arena.nextScenario': { en: 'Next scenario', ms: 'Skenario seterusnya' },
  'arena.lockedHint': {
    en: 'Finish earlier tiers to unlock the certification run.',
    ms: 'Selesaikan tier awal untuk membuka larian pensijilan.',
  },

  /* dashboard */
  'dash.title': { en: 'Your Dashboard', ms: 'Papan Pemuka Anda' },
  'dash.welcome': { en: 'Welcome back', ms: 'Selamat kembali' },
  'dash.level': { en: 'Current level', ms: 'Tahap semasa' },
  'dash.roadmap': { en: 'Learning roadmap', ms: 'Peta hala tuju' },
  'dash.skills': { en: 'Skills profile', ms: 'Profil kemahiran' },
  'dash.achievements': { en: 'Achievements', ms: 'Pencapaian' },
  'dash.recent': { en: 'Recent activity', ms: 'Aktiviti terkini' },
  'dash.suggested': { en: 'Suggested next', ms: 'Cadangan seterusnya' },
  'dash.streakTitle': { en: 'Learning streak', ms: 'Streak pembelajaran' },
  'dash.reset': { en: 'Reset progress', ms: 'Set semula kemajuan' },
  'dash.resetConfirm': {
    en: 'This clears all local progress on this device. Continue?',
    ms: 'Ini mengosongkan semua kemajuan tempatan pada peranti ini. Teruskan?',
  },
  'dash.export': { en: 'Export progress', ms: 'Eksport kemajuan' },
  'dash.import': { en: 'Import progress', ms: 'Import kemajuan' },
  'dash.noAccount': {
    en: 'No signup required — progress is stored locally on this device.',
    ms: 'Tiada pendaftaran diperlukan — kemajuan disimpan secara tempatan pada peranti ini.',
  },

  /* glossary */
  'glossary.title': { en: 'Trading Glossary', ms: 'Glosari Dagangan' },
  'glossary.sub': {
    en: 'Every term in plain language, in both languages. Tap a card to flip it.',
    ms: 'Setiap istilah dalam bahasa mudah, dalam kedua-dua bahasa. Ketik kad untuk membalikkannya.',
  },
  'glossary.search': { en: 'Search terms…', ms: 'Cari istilah…' },

  /* tools */
  'tools.title': { en: 'Trader Toolkit', ms: 'Kit Alat Trader' },
  'tools.risk': { en: 'Position Size & Risk', ms: 'Saiz Posisi & Risiko' },
  'tools.riskSub': {
    en: 'Calculate position size from your risk. Assumptions are stated — always verify with your broker contract specifications.',
    ms: 'Kira saiz posisi berdasarkan risiko anda. Andaian dinyatakan sentiasa sahkan dengan spesifikasi kontrak broker anda.',
  },
  'tools.sessions': { en: 'Market Session Clock', ms: 'Jam Sesi Pasaran' },
  'tools.sessionsSub': {
    en: 'London, New York and Asian sessions live in Malaysia Time (GMT+8), with automatic daylight-saving handling.',
    ms: 'Sesi London, New York dan Asia secara langsung dalam Waktu Malaysia (GMT+8), dengan pelarasan waktu siang automatik.',
  },
  'tools.news': { en: 'Economic News Guide', ms: 'Panduan Berita Ekonomi' },
  'tools.newsSub': {
    en: 'Understand the recurring events that move gold and currencies — and how to plan around them.',
    ms: 'Fahami peristiwa berulang yang menggerakkan emas dan mata wang — dan cara merancang di sekelilingnya.',
  },
  'tools.assumptions': { en: 'Assumptions & limitations', ms: 'Andaian & batasan' },

  /* broker */
  'broker.title': { en: 'Ready for a live account?', ms: 'Bersedia untuk akaun langsung?' },
  'broker.sub': {
    en: 'This is optional and completely separate from your education. Learn first — decide later.',
    ms: 'Ini adalah pilihan dan sepenuhnya berasingan daripada pendidikan anda. Belajar dahulu — buat keputusan kemudian.',
  },
  'broker.register': { en: 'Register with Valetax', ms: 'Daftar dengan Valetax' },
  'broker.disclosure': { en: 'Referral disclosure', ms: 'Pendedahan rujukan' },
  'broker.disclosureBody': {
    en: 'Links on this page are partner links for Valetax. We may receive a commission if you open an account through them. This never affects your learning access — all education is free and account opening is never required. We do not collect or store your broker credentials or documents.',
    ms: 'Pautan di halaman ini ialah pautan rakan untuk Valetax. Kami mungkin menerima komisen jika anda membuka akaun melalui mereka. Ini tidak pernah menjejaskan akses pembelajaran anda — semua pendidikan adalah percuma dan pembukaan akaun tidak pernah diwajibkan. Kami tidak mengumpul atau menyimpan kredensial atau dokumen broker anda.',
  },
  'broker.riskTitle': { en: 'Trading risk information', ms: 'Maklumat risiko dagangan' },
  'broker.fallback': {
    en: 'The registration form could not load. You can register directly on the Valetax website instead.',
    ms: 'Borang pendaftaran tidak dapat dimuatkan. Anda boleh mendaftar terus di laman web Valetax.',
  },

  /* widgets */
  'w.candle.title': { en: 'Candle Anatomy Lab', ms: 'Makmal Anatomi Lilin' },
  'w.candle.caption': {
    en: 'Drag the sliders to reshape the candle. The lab names what you built.',
    ms: 'Seret pelarung untuk membentuk semula lilin. Makmal menamakan apa yang anda bina.',
  },
  'w.risk.title': { en: 'Risk Sandbox', ms: 'Sandbox Risiko' },
  'w.risk.caption': {
    en: 'Set account size, risk %, entry and stop. See position size and the money at risk instantly.',
    ms: 'Tetapkan saiz akaun, % risiko, entry dan stop. Lihat saiz posisi serta wang yang berisiko serta-merta.',
  },
  'w.session.title': { en: 'Session Clock', ms: 'Jam Sesi' },
  'w.rr.title': { en: 'Risk/Reward Builder', ms: 'Pembina Risiko/Ganjaran' },
  'w.structure.title': { en: 'Structure Builder', ms: 'Pembina Struktur' },
  'w.sweep.title': { en: 'Sweep Spotter', ms: 'Pengesan Sweep' },
  'w.fvg.title': { en: 'FVG Finder', ms: 'Pencari FVG' },
  'w.mtf.title': { en: 'Multi-Timeframe Lab', ms: 'Makmal Masa Pelbagai' },
  'w.mtf.caption': {
    en: 'See one market at three timeframes side by side. Make the top-down call before the lab reveals the coaching.',
    ms: 'Lihat satu pasaran pada tiga timeframe bersebelahan. Buat panggilan atas-ke-bawah sebelum makmal mendedahkan bimbingan.',
  },
  'w.news.title': { en: 'News Planner', ms: 'Perancang Berita' },

  /* achievements */
  'ach.unlocked': { en: 'Achievement unlocked', ms: 'Pencapaian dibuka' },

  /* footer */
  'footer.tagline': {
    en: 'From Zero Knowledge to Independent Trading Mastery',
    ms: 'Daripada Sifar Pengetahuan ke Penguasaan Dagangan Bebas',
  },
  'footer.education': {
    en: 'Education only — not financial advice.',
    ms: 'Pendidikan sahaja — bukan nasihat kewangan.',
  },
  'footer.rights': { en: 'All rights reserved.', ms: 'Hak cipta terpelihara.' },
} as const satisfies Record<string, S>;

export type UIKey = keyof typeof UI;
