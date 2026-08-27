"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lang = "en" | "id";
type MoneyKey =
  | "essentials"
  | "debt"
  | "dependents"
  | "guaranteed"
  | "variable"
  | "savings"
  | "reserve"
  | "transitionCosts"
  | "bridge";

type MoneyState = Record<MoneyKey, number>;

const initialMoney: MoneyState = {
  essentials: 12_000_000,
  debt: 3_000_000,
  dependents: 2_500_000,
  guaranteed: 8_000_000,
  variable: 8_000_000,
  savings: 90_000_000,
  reserve: 30_000_000,
  transitionCosts: 6_000_000,
  bridge: 6_000_000,
};

const copy = {
  en: {
    navCalculator: "Calculator",
    navGuide: "How it works",
    issue: "by Pearling",
    headerWhisper: "Plan the leap. Keep the floor.",
    folio: "A practical field guide for uncertain next chapters",
    ticker: ["Survival floor", "Runway", "Bridge income", "Room to experiment"],
    eyebrow: "Transition runway calculator",
    titleA: "Make room for change,",
    titleB: "without guessing the cost.",
    intro:
      "Turn “I want to quit everything” into a grounded plan for your floor, runway, bridge income, and experimentation capacity.",
    notCommand: "A planning tool, never a command to quit.",
    warningLabel: "Calculator warning",
    inputWarning: "This is a simplified estimate. Recheck every input, test pessimistic scenarios, and never use one result as the sole basis for a major financial decision.",
    resultWarning: "Live estimate only — the result is sensitive to every assumption above.",
    scenarioWarning: "A longer runway is not a guarantee. Income can stop, expenses can rise, and emergencies can happen.",
    personalKicker: "Make this copy yours",
    personalTitle: "First, tell us your name.",
    personalHelp: "Your name personalizes this page and your downloadable report. It stays in this browser.",
    nameLabel: "What should we call you?",
    namePlaceholder: "Your first name",
    intentionLabel: "What are you making room for?",
    intentions: {
      explore: "Testing a new career",
      build: "Building a business",
      pause: "Taking a meaningful pause",
      learn: "Studying or reskilling",
      other: "My next chapter",
    },
    calculatorKicker: "Step 01 · Your reality",
    calculatorTitle: "Start with the numbers that already hold your life.",
    calculatorIntro:
      "Use monthly averages. Keep your emergency reserve truly protected, and count only money you can actually access.",
    monthly: "Monthly",
    oneTime: "One-time",
    available: "Available now",
    protected: "Protected",
    inputs: {
      essentials: ["Essential expenses", "Housing, food, utilities, transport, healthcare and basics."],
      debt: ["Debt obligations", "Minimum payments you must continue servicing."],
      dependents: ["Dependants support", "Support for children, parents or others who rely on you."],
      guaranteed: ["Guaranteed income", "Salary, retainers or contractual income you can count on."],
      variable: ["Variable income", "Freelance, commission or irregular income before discounting."],
      savings: ["Savings available", "Liquid savings that could support your transition."],
      reserve: ["Emergency reserve", "Money you have decided not to touch."],
      transitionCosts: ["Expected transition costs", "Courses, equipment, relocation, setup or admin costs."],
      bridge: ["Bridge income retained", "Stable income you could deliberately keep while experimenting."],
    },
    assumptionsKicker: "Step 02 · Your assumptions",
    assumptionsTitle: "Tune how cautious this plan should be.",
    assumptionsIntro: "The defaults mirror the workbook. Move them when your evidence says otherwise.",
    reliability: "Variable income reliability",
    reliabilityHelp: "Only this share of variable income counts as dependable.",
    comfort: "Comfort buffer",
    comfortHelp: "Breathing room above your bare-minimum survival floor.",
    experimentShare: "Maximum experimentation share",
    experimentShareHelp: "Caps exploration spending as a share of deployable cash.",
    minRunway: "Minimum runway to protect",
    minRunwayHelp: "Your experimentation budget cannot spend through this guardrail.",
    months: "months",
    reset: "Reset example",
    resultKicker: "Your live plan",
    resultTitle: "Here is your runway",
    resultTitleNamed: "here is your runway",
    forGoal: "For",
    currentRunway: "Current runway",
    openEnded: "Open-ended",
    openEndedShort: "Open",
    noMonthlyBurn: "Adjusted income covers your survival floor.",
    monthlyBurn: "monthly burn",
    withBridge: "Runway with bridge",
    experimentBudget: "Experimentation budget",
    spendCeiling: "Your spending ceiling while preserving the runway target.",
    survivalFloor: "Survival floor",
    comfortFloor: "Comfort floor",
    deployableCash: "Deployable cash",
    adjustedIncome: "Adjusted income",
    runwayScale: "Runway strength",
    protectedTarget: "Protected target",
    readoutTitle: "What the numbers are telling you",
    runwaySignal: "Runway signal",
    bridgeEffect: "Bridge effect",
    experimentRule: "Experimentation rule",
    signals: {
      covered: "Your reliability-adjusted income already covers your survival floor. At this floor, the transition is not drawing down deployable cash.",
      under3: "Your runway is under 3 months. Large irreversible moves deserve caution until burn falls, cash rises, or stable income is retained.",
      under6: "You have a short runway. Small, reversible experiments are more defensible than an all-at-once leap.",
      under12: "You have meaningful room to experiment, while large commitments still deserve scenario testing.",
      strong: "You have a substantial runway at your survival floor. The question is now how deliberately you want to use that optionality.",
      bridgeCovered: "With this bridge income, your survival floor is fully covered each month.",
      bridgeNotNeeded: "Bridge income is not required to extend runway because adjusted income already covers your survival floor.",
      bridgeExtendsA: "Your bridge extends runway by",
      bridgeExtendsB: "months — the measurable value of keeping some stability while you experiment.",
      bridgeNoEffect: "This bridge amount does not materially extend runway. Revisit the amount or your floor.",
      noBudget: "Deployable cash is already needed to protect your minimum runway. Fund exploration from surplus or revise the cost and income structure.",
      hasBudget: "You have a positive experimentation budget. Treat it as a ceiling, not a target, while protecting your minimum runway.",
    },
    scenarioKicker: "Step 03 · Pressure-test the bridge",
    scenarioTitle: "See what a little stability can buy you.",
    scenarioIntro: "Compare your current plan with lighter and stronger bridge-income choices before making a big commitment.",
    scenario: "Scenario",
    bridgeIncome: "Bridge income / month",
    netBurn: "Net burn / month",
    runway: "Runway",
    noBridge: "No bridge",
    lightBridge: "Light bridge",
    yourBridge: "Your bridge",
    strongerBridge: "Stronger bridge",
    floorCovered: "Floor covered",
    guideKicker: "The complete guide",
    guideTitle: "Use the tool without lying to yourself.",
    guideIntro: "Runway is an estimate, not a promise. These are the rules that keep the model useful.",
    howInputs: "What to enter",
    howOutputs: "How the five outputs work",
    guardrails: "Honest-reading guardrails",
    inputGuide: [
      ["Essential expenses", "Your recurring living costs before debt and dependant support."],
      ["Debt obligations", "Minimum monthly payments that continue during a transition."],
      ["Dependants support", "The average monthly support you remain responsible for."],
      ["Guaranteed income", "Income you can reasonably expect and collect each month."],
      ["Variable income", "Your average irregular income; the reliability factor discounts it."],
      ["Savings available", "Liquid savings you can access for the transition."],
      ["Emergency reserve", "Money you explicitly refuse to use; it stays outside runway."],
      ["Transition costs", "One-time costs removed before runway is calculated."],
      ["Bridge income", "Income you keep so the emerging chapter does not need to pay rent immediately."],
    ],
    outputGuide: [
      ["Survival floor", "Essential expenses + debt + dependant support: your minimum monthly operating requirement."],
      ["Comfort floor", "The survival floor plus your chosen buffer. It is a planning assumption, not a universal threshold."],
      ["Runway", "Deployable cash ÷ current net burn. When adjusted income covers the floor, runway is open-ended."],
      ["Runway with bridge", "The same calculation after adding deliberate bridge income."],
      ["Experimentation budget", "The smaller of your experimentation cap and cash left after protecting minimum runway."],
    ],
    guardrailList: [
      "Expenses move, income changes, emergencies happen, and transition costs are often underestimated.",
      "Raise variable-income reliability only when you have evidence the income is consistently collectible.",
      "Adjust the comfort buffer to your real life; 20% is a useful default, not a scientific constant.",
      "The experimentation budget is a guardrail. You do not need to spend all of it.",
      "Before an irreversible decision, test several income and expense scenarios.",
    ],
    formulaNote: "Built from the Fallow Math Transition Runway workbook · Values stay on this device only.",
    disclaimer: "This tool supports planning and reflection. It is not financial advice and cannot predict future income, expenses or emergencies.",
    footerLine: "Give desire enough room to meet reality.",
    moodLabel: "Runway mood",
    moods: {
      covered: "Wide open",
      tight: "Tightrope",
      testing: "Testing ground",
      roaming: "Room to roam",
      spacious: "Spacious",
    },
    dispatchKicker: "Field note · Keep this",
    dispatchQuote: "You do not need total certainty. You need enough room for curiosity to become evidence.",
    dispatchBridge: "A bridge is not a failure of courage. It is architecture for a braver experiment.",
    dispatchFormula: "RUNWAY = DEPLOYABLE CASH ÷ MONTHLY BURN",
    worksheetLabel: "Working paper · edit the pale cards",
    guideMantra: "READ / TEST / REPEAT",
    downloadReport: "Download my report",
    reportHint: "Print-ready HTML · opens in any browser",
    reportTitle: "Fallow Math · Personal Transition Runway Report",
    reportGenerated: "Generated",
    reportName: "Prepared for",
    reportGoal: "Making room for",
    reportInputs: "Your inputs",
    reportAssumptions: "Planning assumptions",
    reportOutputs: "Your transition numbers",
    reportInsights: "What the numbers suggest",
    reportPrivacy: "This report was generated locally on your device. The calculator did not send these values to a server.",
    comprehensiveKicker: "Want to go deeper?",
    comprehensiveTitle: "Use a more comprehensive reflection tool.",
    comprehensiveCopy: "For a broader, more human look at your transition beyond runway math, continue with the Conscious tool.",
    comprehensiveButton: "Explore the comprehensive tool ↗",
    privacyKicker: "Privacy & responsibility",
    privacyHeading: "Read this before you rely on the result.",
    privacyTitle: "Privacy policy",
    privacyIntro: "Fallow Math is designed to minimize data collection.",
    privacyItems: [
      "Your name, language, transition intention, and disclaimer acknowledgement are stored only in this browser using local storage so the experience can remain personalized.",
      "Financial inputs and calculated results remain in the page session and are not intentionally transmitted to a Fallow Math server by this calculator.",
      "The downloadable report is assembled on your device. You decide where to save, share, or delete it.",
      "External websites, including the comprehensive tool, have their own privacy practices. Review them before sharing information.",
      "You can remove saved preferences by clearing this site's browser data. This policy must be updated if analytics, accounts, forms, or other data services are added later.",
    ],
    legalTitle: "Disclaimer & limitation of liability",
    legalItems: [
      "This calculator is for general educational, planning, and reflection purposes only. It is not personalized financial, investment, tax, accounting, legal, psychological, or career advice.",
      "Outputs depend entirely on the figures and assumptions you enter. They are simplified estimates, may be incomplete or inaccurate, and do not predict future income, expenses, inflation, emergencies, or market conditions.",
      "Do not use this calculator as the only basis for resigning, borrowing, investing, spending savings, or making another significant or irreversible decision. Obtain independent advice from appropriately qualified professionals.",
      "You remain responsible for checking the information and for every decision you make. To the fullest extent permitted by applicable law, the creator and operators disclaim liability for losses, damages, costs, or consequences arising from use of or reliance on this website or report.",
      "No website disclaimer can remove rights or responsibilities that cannot legally be excluded. If you need terms tailored to a business or jurisdiction, ask a qualified lawyer to review them.",
    ],
    legalUpdated: "Last updated: 27 August 2026",
    copyright: "© 2026 Pearling Lim. All Rights Reserved",
    navLegal: "Privacy & disclaimer",
    consentKicker: "Before you begin · required",
    consentTitle: "Fallow Math is a calculator, a tool",
    consentBody: "Fallow Math offers a simplified planning estimate that CANNOT know what will happen next, and it MUST NOT BE the only source behind a major decision",
    consentPoints: [
      "The result changes whenever an input or assumption changes.",
      "It is not personalized financial, legal, tax, psychological, investment, accounting, or career advice.",
      "You remain responsible for checking the numbers and seeking qualified advice when needed.",
    ],
    consentCheck: "I have read this notice and understand that Fallow Math is only a calculator and reflection tool.",
    consentAgree: "I understand & agree",
    consentPrivacy: "Your acknowledgement is saved only in this browser so you do not need to repeat it every visit.",
    consentLanguage: "Language",
  },
  id: {
    navCalculator: "Kalkulator",
    navGuide: "Cara pakai",
    issue: "by Pearling",
    headerWhisper: "Rencanakan lompatan. Jaga pijakan.",
    folio: "Panduan lapangan untuk bab berikutnya yang belum pasti",
    ticker: ["Kebutuhan minimum", "Runway", "Pendapatan jembatan", "Ruang bereksperimen"],
    eyebrow: "Kalkulator runway transisi",
    titleA: "Beri ruang untuk berubah,",
    titleB: "tanpa menebak biayanya.",
    intro:
      "Ubah “aku ingin berhenti dari semuanya” menjadi rencana yang membumi: kebutuhan minimum, runway, pendapatan jembatan, dan ruang untuk bereksperimen.",
    notCommand: "Alat untuk merencanakan, bukan perintah untuk resign.",
    warningLabel: "Peringatan kalkulator",
    inputWarning: "Ini adalah perkiraan sederhana. Periksa ulang setiap angka, uji skenario pesimistis, dan jangan jadikan satu hasil sebagai satu-satunya dasar keputusan keuangan besar.",
    resultWarning: "Hanya perkiraan saat ini — hasil sangat sensitif terhadap setiap asumsi di atas.",
    scenarioWarning: "Runway yang lebih panjang bukan jaminan. Pendapatan bisa berhenti, pengeluaran bisa naik, dan keadaan darurat bisa terjadi.",
    personalKicker: "Buat salinan ini jadi milik kamu",
    personalTitle: "Pertama, beri tahu nama kamu.",
    personalHelp: "Nama kamu dipakai untuk mempersonalisasi halaman dan laporan unduhan. Data ini tetap di browser kamu.",
    nameLabel: "Aku boleh memanggil kamu siapa?",
    namePlaceholder: "Nama panggilan kamu",
    intentionLabel: "Kamu sedang membuka ruang untuk apa?",
    intentions: {
      explore: "Mencoba jalur karier baru",
      build: "Membangun bisnis",
      pause: "Mengambil jeda yang bermakna",
      learn: "Belajar atau menambah keahlian",
      other: "Bab berikutnya dalam hidupku",
    },
    calculatorKicker: "Langkah 01 · Realita kamu",
    calculatorTitle: "Mulai dari angka yang menopang hidup kamu sekarang.",
    calculatorIntro:
      "Pakai rata-rata bulanan. Jaga dana darurat tetap terlindungi, dan hitung hanya uang yang benar-benar bisa kamu akses.",
    monthly: "Per bulan",
    oneTime: "Sekali bayar",
    available: "Tersedia sekarang",
    protected: "Dilindungi",
    inputs: {
      essentials: ["Pengeluaran pokok", "Tempat tinggal, makan, utilitas, transportasi, kesehatan, dan kebutuhan dasar."],
      debt: ["Kewajiban utang", "Cicilan minimum yang tetap harus kamu bayar."],
      dependents: ["Biaya tanggungan", "Dukungan untuk anak, orang tua, atau orang lain yang bergantung pada kamu."],
      guaranteed: ["Pendapatan terjamin", "Gaji, retainer, atau kontrak yang bisa kamu andalkan."],
      variable: ["Pendapatan variabel", "Freelance, komisi, atau pemasukan tidak tetap sebelum didiskon."],
      savings: ["Tabungan tersedia", "Tabungan likuid yang bisa mendukung masa transisi."],
      reserve: ["Dana darurat", "Uang yang sudah kamu putuskan untuk tidak disentuh."],
      transitionCosts: ["Perkiraan biaya transisi", "Kursus, alat, relokasi, persiapan, atau biaya administrasi."],
      bridge: ["Pendapatan jembatan", "Pendapatan stabil yang sengaja kamu pertahankan saat bereksperimen."],
    },
    assumptionsKicker: "Langkah 02 · Asumsi kamu",
    assumptionsTitle: "Atur seberapa hati-hati rencana ini.",
    assumptionsIntro: "Angka awal mengikuti workbook. Ubah saat bukti dari hidup kamu berkata lain.",
    reliability: "Keandalan pendapatan variabel",
    reliabilityHelp: "Hanya bagian ini yang dianggap cukup bisa diandalkan.",
    comfort: "Buffer kenyamanan",
    comfortHelp: "Ruang bernapas di atas kebutuhan minimum kamu.",
    experimentShare: "Porsi maksimal eksperimen",
    experimentShareHelp: "Membatasi biaya eksplorasi dari kas transisi yang tersedia.",
    minRunway: "Runway minimum yang dijaga",
    minRunwayHelp: "Anggaran eksperimen tidak boleh melewati pagar pengaman ini.",
    months: "bulan",
    reset: "Ulangi contoh",
    resultKicker: "Rencana kamu saat ini",
    resultTitle: "Ini runway kamu",
    resultTitleNamed: "ini runway kamu",
    forGoal: "Untuk",
    currentRunway: "Runway saat ini",
    openEnded: "Tanpa batas",
    openEndedShort: "Terbuka",
    noMonthlyBurn: "Pendapatan yang disesuaikan menutup kebutuhan minimum kamu.",
    monthlyBurn: "defisit per bulan",
    withBridge: "Runway dengan jembatan",
    experimentBudget: "Anggaran eksperimen",
    spendCeiling: "Batas pengeluaran sambil tetap menjaga target runway.",
    survivalFloor: "Kebutuhan minimum",
    comfortFloor: "Kebutuhan nyaman",
    deployableCash: "Kas transisi",
    adjustedIncome: "Pendapatan disesuaikan",
    runwayScale: "Kekuatan runway",
    protectedTarget: "Target terlindungi",
    readoutTitle: "Apa yang angka ini ceritakan ke kamu",
    runwaySignal: "Sinyal runway",
    bridgeEffect: "Dampak jembatan",
    experimentRule: "Aturan eksperimen",
    signals: {
      covered: "Pendapatan kamu yang sudah disesuaikan menutup kebutuhan minimum. Pada batas ini, transisi kamu tidak mengurangi kas yang tersedia.",
      under3: "Runway kamu kurang dari 3 bulan. Tahan keputusan besar yang sulit dibatalkan sampai defisit turun, kas naik, atau pendapatan stabil bertambah.",
      under6: "Runway kamu masih pendek. Eksperimen kecil yang mudah dibatalkan lebih aman daripada lompatan sekaligus.",
      under12: "Kamu punya ruang yang cukup untuk bereksperimen, tetapi komitmen besar tetap perlu diuji lewat beberapa skenario.",
      strong: "Kamu punya runway yang kuat pada kebutuhan minimum. Pertanyaan berikutnya adalah seberapa sengaja kamu ingin memakai pilihan itu.",
      bridgeCovered: "Dengan pendapatan jembatan ini, kebutuhan minimum kamu tertutup setiap bulan.",
      bridgeNotNeeded: "Pendapatan jembatan tidak dibutuhkan untuk memperpanjang runway karena pendapatan yang disesuaikan sudah menutup kebutuhan minimum.",
      bridgeExtendsA: "Pendapatan jembatan memperpanjang runway kamu sebanyak",
      bridgeExtendsB: "bulan — nilai nyata dari mempertahankan sedikit stabilitas saat kamu bereksperimen.",
      bridgeNoEffect: "Nominal jembatan ini belum memperpanjang runway secara berarti. Coba tinjau nominal atau kebutuhan minimum kamu.",
      noBudget: "Kas transisi sudah dibutuhkan untuk menjaga runway minimum. Danai eksplorasi dari surplus atau ubah struktur biaya dan pendapatan.",
      hasBudget: "Kamu punya anggaran eksperimen yang positif. Anggap ini sebagai batas, bukan target belanja, sambil menjaga runway minimum.",
    },
    scenarioKicker: "Langkah 03 · Uji pendapatan jembatan",
    scenarioTitle: "Lihat seberapa besar ruang yang dibeli oleh sedikit stabilitas.",
    scenarioIntro: "Bandingkan rencana kamu dengan opsi pendapatan jembatan yang lebih ringan dan lebih kuat sebelum mengambil komitmen besar.",
    scenario: "Skenario",
    bridgeIncome: "Pendapatan jembatan / bulan",
    netBurn: "Defisit / bulan",
    runway: "Runway",
    noBridge: "Tanpa jembatan",
    lightBridge: "Jembatan ringan",
    yourBridge: "Jembatan kamu",
    strongerBridge: "Jembatan lebih kuat",
    floorCovered: "Kebutuhan tertutup",
    guideKicker: "Panduan lengkap",
    guideTitle: "Pakai alat ini tanpa membohongi diri sendiri.",
    guideIntro: "Runway adalah perkiraan, bukan janji. Pegangan ini membantu model tetap berguna.",
    howInputs: "Apa yang perlu diisi",
    howOutputs: "Cara kerja lima hasil utama",
    guardrails: "Pagar pengaman untuk membaca hasil",
    inputGuide: [
      ["Pengeluaran pokok", "Biaya hidup rutin sebelum utang dan biaya tanggungan."],
      ["Kewajiban utang", "Pembayaran minimum bulanan yang tetap berjalan saat transisi."],
      ["Biaya tanggungan", "Rata-rata dukungan bulanan yang tetap menjadi tanggung jawab kamu."],
      ["Pendapatan terjamin", "Pendapatan yang cukup masuk akal untuk kamu harapkan dan tagih tiap bulan."],
      ["Pendapatan variabel", "Rata-rata pemasukan tidak tetap; faktor keandalan akan mendiskonnya."],
      ["Tabungan tersedia", "Tabungan likuid yang bisa kamu akses untuk transisi."],
      ["Dana darurat", "Uang yang kamu putuskan tidak akan disentuh; nilainya tidak masuk runway."],
      ["Biaya transisi", "Biaya sekali bayar yang dikurangi sebelum runway dihitung."],
      ["Pendapatan jembatan", "Pendapatan yang dipertahankan agar bab baru hidup kamu tidak harus langsung membayar semua tagihan."],
    ],
    outputGuide: [
      ["Kebutuhan minimum", "Pengeluaran pokok + utang + tanggungan: kebutuhan operasional minimum bulanan kamu."],
      ["Kebutuhan nyaman", "Kebutuhan minimum ditambah buffer pilihan kamu. Ini asumsi perencanaan, bukan ukuran universal."],
      ["Runway", "Kas transisi ÷ defisit saat ini. Jika pendapatan menutup kebutuhan minimum, runway menjadi terbuka."],
      ["Runway dengan jembatan", "Perhitungan yang sama setelah menambahkan pendapatan jembatan."],
      ["Anggaran eksperimen", "Nilai terkecil antara batas eksperimen dan kas yang tersisa setelah runway minimum dijaga."],
    ],
    guardrailList: [
      "Pengeluaran berubah, pendapatan bergerak, keadaan darurat terjadi, dan biaya transisi sering terlalu rendah diperkirakan.",
      "Naikkan keandalan pendapatan variabel hanya saat kamu punya bukti bahwa pemasukan itu konsisten dan bisa ditagih.",
      "Sesuaikan buffer kenyamanan dengan hidup kamu; 20% adalah titik awal, bukan angka ilmiah.",
      "Anggaran eksperimen adalah pagar pengaman. Kamu tidak harus menghabiskan semuanya.",
      "Sebelum keputusan yang sulit dibatalkan, uji beberapa skenario pendapatan dan pengeluaran.",
    ],
    formulaNote: "Dibuat dari workbook Fallow Math Transition Runway · Data hanya tersimpan di perangkat ini.",
    disclaimer: "Alat ini membantu kamu merencanakan dan berefleksi. Jangan digunakan sebagai satu-satunya nasihat keuangan dan tidak bisa memprediksi pendapatan, pengeluaran, atau keadaan darurat di masa depan",
    footerLine: "Beri keinginan cukup ruang untuk bertemu realita.",
    moodLabel: "Suasana runway",
    moods: {
      covered: "Terbuka lebar",
      tight: "Di ujung tali",
      testing: "Ruang uji",
      roaming: "Bebas menjelajah",
      spacious: "Lapang",
    },
    dispatchKicker: "Catatan lapangan · Simpan ini",
    dispatchQuote: "Kamu tidak butuh kepastian total. Kamu butuh cukup ruang agar rasa ingin tahu berubah menjadi bukti.",
    dispatchBridge: "Pendapatan jembatan bukan tanda kurang berani. Ini arsitektur untuk eksperimen yang lebih berani.",
    dispatchFormula: "RUNWAY = KAS TRANSISI ÷ DEFISIT BULANAN",
    worksheetLabel: "Kertas kerja · ubah kartu berwarna pucat",
    guideMantra: "BACA / UJI / ULANGI",
    downloadReport: "Unduh laporan aku",
    reportHint: "HTML siap cetak · bisa dibuka di browser",
    reportTitle: "Fallow Math · Laporan Runway Transisi Pribadi",
    reportGenerated: "Dibuat pada",
    reportName: "Disiapkan untuk",
    reportGoal: "Membuka ruang untuk",
    reportInputs: "Input kamu",
    reportAssumptions: "Asumsi perencanaan",
    reportOutputs: "Angka transisi kamu",
    reportInsights: "Apa yang angka ini tunjukkan",
    reportPrivacy: "Laporan ini dibuat secara lokal di perangkat kamu. Kalkulator tidak mengirimkan angka-angka ini ke server.",
    comprehensiveKicker: "Ingin melihat lebih dalam?",
    comprehensiveTitle: "Gunakan alat refleksi yang lebih komprehensif.",
    comprehensiveCopy: "Untuk melihat transisi kamu secara lebih luas  lanjutkan dengan tool yang lebih lengkap: Get Conscious",
    comprehensiveButton: "Lihat alat yang lebih komprehensif ↗",
    privacyKicker: "Privasi & tanggung jawab",
    privacyHeading: "Baca ini sebelum kamu mengandalkan hasilnya.",
    privacyTitle: "Kebijakan privasi",
    privacyIntro: "Fallow Math dirancang untuk meminimalkan pengumpulan data.",
    privacyItems: [
      "Nama, bahasa, tujuan transisi, dan persetujuan atas penyangkalan hanya disimpan di browser ini melalui penyimpanan lokal agar pengalaman tetap personal.",
      "Input keuangan dan hasil kalkulasi tetap berada dalam sesi halaman dan tidak sengaja dikirim ke server Fallow Math oleh kalkulator ini.",
      "Laporan unduhan dibuat di perangkat kamu. Kamu menentukan sendiri tempat menyimpan, membagikan, atau menghapusnya.",
      "Situs eksternal, termasuk alat yang lebih komprehensif, memiliki praktik privasinya sendiri. Baca kebijakan mereka sebelum membagikan informasi.",
      "Kamu dapat menghapus preferensi tersimpan dengan membersihkan data situs di browser. Kebijakan ini harus diperbarui jika analitik, akun, formulir, atau layanan data lain ditambahkan nanti.",
    ],
    legalTitle: "Penyangkalan & batasan tanggung jawab",
    legalItems: [
      "Kalkulator ini hanya untuk edukasi umum, perencanaan, dan refleksi. JANGAN digunakan sebagai sumber nasihat keuangan, investasi, pajak, akuntansi, hukum, psikologis, atau karier yang dipersonalisasi.",
      "Hasil sepenuhnya bergantung pada angka dan asumsi yang kamu masukkan. Hasil adalah perkiraan sederhana, bisa tidak lengkap atau tidak akurat, dan tidak memprediksi pendapatan, pengeluaran, inflasi, keadaan darurat, atau kondisi pasar di masa depan.",
      "Jangan gunakan kalkulator ini sebagai satu-satunya dasar untuk resign, berutang, berinvestasi, memakai tabungan, atau mengambil keputusan besar yang sulit dibatalkan. Minta saran independen dari profesional yang berkualifikasi.",
      "Kamu tetap bertanggung jawab untuk memeriksa informasi dan setiap keputusan yang kamu ambil. Sejauh diizinkan hukum yang berlaku, pembuat dan pengelola tidak bertanggung jawab atas kerugian, kerusakan, biaya, atau akibat dari penggunaan atau ketergantungan pada situs maupun laporan ini.",
      "Penyangkalan di situs tidak dapat menghapus hak atau tanggung jawab yang secara hukum tidak boleh dikecualikan. Jika kamu memerlukan ketentuan yang sesuai untuk bisnis atau yurisdiksi tertentu, minta pengacara berkualifikasi untuk meninjaunya.",
    ],
    legalUpdated: "Terakhir diperbarui: 27 Agustus 2026",
    copyright: "© 2026 Pearling Lim. All Rights Reserved",
    navLegal: "Privasi & penyangkalan",
    consentKicker: "Sebelum mulai · wajib",
    consentTitle: "Fallow Math adalah kalkulator, sebuah alat",
    consentBody: "Fallow Math memberikan perkiraan perencanaan sederhana yang TIDAK DAPAT mengetahui apa yang akan terjadi selanjutnya, dan TIDAK BOLEH menjadi satu-satunya sumber di balik keputusan besar",
    consentPoints: [
      "Hasil akan berubah setiap kali input atau asumsi berubah.",
      "Ini bukan nasihat keuangan, hukum, pajak, psikologis, investasi, akuntansi, atau karier yang dipersonalisasi.",
      "Kamu tetap bertanggung jawab memeriksa angka dan mencari saran profesional jika diperlukan.",
    ],
    consentCheck: "Aku sudah membaca pemberitahuan ini dan memahami bahwa Fallow Math hanya kalkulator dan alat refleksi.",
    consentAgree: "Aku mengerti & setuju",
    consentPrivacy: "Persetujuan kamu hanya disimpan di browser ini agar kamu tidak perlu mengulanginya setiap kali berkunjung.",
    consentLanguage: "Bahasa",
  },
} as const;

const moneyOrder: MoneyKey[] = [
  "essentials",
  "debt",
  "dependents",
  "guaranteed",
  "variable",
  "savings",
  "reserve",
  "transitionCosts",
  "bridge",
];

function formatMoney(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

function formatInput(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

function formatRunway(value: number, lang: Lang, short = false) {
  if (!Number.isFinite(value)) return short ? copy[lang].openEndedShort : copy[lang].openEnded;
  return `${value.toFixed(1)} ${copy[lang].months}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function safeFilename(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "personal";
}

function MoneyInput({
  id,
  label,
  note,
  badge,
  value,
  lang,
  onChange,
}: {
  id: string;
  label: string;
  note: string;
  badge: string;
  value: number;
  lang: Lang;
  onChange: (value: number) => void;
}) {
  return (
    <label className="money-field" htmlFor={id}>
      <span className="field-heading">
        <span>{label}</span>
        <span className="field-badge">{badge}</span>
      </span>
      <span className="money-control">
        <span aria-hidden="true">Rp</span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={formatInput(value, lang)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "");
            onChange(digits ? Number(digits) : 0);
          }}
          aria-describedby={`${id}-help`}
        />
      </span>
      <span className="field-note" id={`${id}-help`}>{note}</span>
    </label>
  );
}

function AssumptionSlider({
  id,
  label,
  help,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <label className="slider-field" htmlFor={id}>
      <span className="slider-copy">
        <span>
          <strong>{label}</strong>
          <small>{help}</small>
        </span>
        <output htmlFor={id}>{Math.round(value)}{suffix}</output>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--range-progress": `${percentage}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [name, setName] = useState("");
  const [intention, setIntention] = useState<keyof typeof copy.en.intentions>("explore");
  const [money, setMoney] = useState<MoneyState>(initialMoney);
  const [reliability, setReliability] = useState(50);
  const [comfortBuffer, setComfortBuffer] = useState(20);
  const [experimentShare, setExperimentShare] = useState(15);
  const [minRunway, setMinRunway] = useState(3);
  const [hydrated, setHydrated] = useState(false);
  const [consentRequired, setConsentRequired] = useState(true);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const consentDialogRef = useRef<HTMLElement>(null);
  const consentCheckboxRef = useRef<HTMLInputElement>(null);

  const t = copy[lang];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("fallow-math-preferences");
      if (saved) {
        const parsed = JSON.parse(saved) as { lang?: Lang; name?: string; intention?: keyof typeof copy.en.intentions };
        if (parsed.lang === "en" || parsed.lang === "id") setLang(parsed.lang);
        if (typeof parsed.name === "string") setName(parsed.name);
        if (parsed.intention && parsed.intention in copy.en.intentions) setIntention(parsed.intention);
      }
      setConsentRequired(window.localStorage.getItem("fallow-math-disclaimer-consent-v3") !== "accepted");
    } catch {
      // Device-local preferences are optional; the calculator works without them.
      setConsentRequired(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!consentRequired) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => consentCheckboxRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [consentRequired]);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        "fallow-math-preferences",
        JSON.stringify({ lang, name, intention }),
      );
    } catch {
      // Ignore unavailable storage (for example, privacy-restricted browsing).
    }
  }, [hydrated, intention, lang, name]);

  const acceptDisclaimer = () => {
    if (!consentConfirmed) return;
    try {
      window.localStorage.setItem("fallow-math-disclaimer-consent-v3", "accepted");
    } catch {
      // Consent still applies for this visit if browser storage is unavailable.
    }
    setConsentRequired(false);
  };

  const trapConsentFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      consentDialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
      ) ?? [],
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const results = useMemo(() => {
    const survival = money.essentials + money.debt + money.dependents;
    const comfort = survival * (1 + comfortBuffer / 100);
    const adjustedIncome = money.guaranteed + money.variable * (reliability / 100);
    const burn = Math.max(survival - adjustedIncome, 0);
    const deployable = Math.max(money.savings - money.reserve - money.transitionCosts, 0);
    const runway = burn === 0 ? Number.POSITIVE_INFINITY : deployable / burn;
    const bridgeBurn = Math.max(burn - money.bridge, 0);
    const bridgeRunway = bridgeBurn === 0 ? Number.POSITIVE_INFINITY : deployable / bridgeBurn;
    const experimentation = Math.max(
      Math.min(deployable * (experimentShare / 100), deployable - bridgeBurn * minRunway),
      0,
    );
    return { survival, comfort, adjustedIncome, burn, deployable, runway, bridgeBurn, bridgeRunway, experimentation };
  }, [comfortBuffer, experimentShare, minRunway, money, reliability]);

  const signal = !Number.isFinite(results.runway)
    ? t.signals.covered
    : results.runway < 3
      ? t.signals.under3
      : results.runway < 6
        ? t.signals.under6
        : results.runway < 12
          ? t.signals.under12
          : t.signals.strong;

  const bridgeSignal = !Number.isFinite(results.bridgeRunway)
    ? !Number.isFinite(results.runway)
      ? t.signals.bridgeNotNeeded
      : t.signals.bridgeCovered
    : results.bridgeRunway > results.runway
      ? `${t.signals.bridgeExtendsA} ${(results.bridgeRunway - results.runway).toFixed(1)} ${t.signals.bridgeExtendsB}`
      : t.signals.bridgeNoEffect;

  const experimentSignal = results.experimentation === 0 ? t.signals.noBudget : t.signals.hasBudget;
  const runwayMood = !Number.isFinite(results.runway)
    ? t.moods.covered
    : results.runway < 3
      ? t.moods.tight
      : results.runway < 6
        ? t.moods.testing
        : results.runway < 12
          ? t.moods.roaming
          : t.moods.spacious;
  const runwayProgress = !Number.isFinite(results.runway)
    ? 100
    : Math.min((results.runway / Math.max(12, minRunway * 2)) * 100, 100);

  const lightBridge = money.bridge > 0 ? money.bridge / 2 : results.survival * 0.2;
  const strongerBridge = money.bridge > 0 ? money.bridge * 1.5 : results.survival * 0.6;
  const scenarios = [
    [t.noBridge, 0],
    [t.lightBridge, lightBridge],
    [t.yourBridge, money.bridge],
    [t.strongerBridge, strongerBridge],
  ] as const;

  const updateMoney = (key: MoneyKey, value: number) => {
    setMoney((current) => ({ ...current, [key]: Math.max(0, value) }));
  };

  const reset = () => {
    setMoney(initialMoney);
    setReliability(50);
    setComfortBuffer(20);
    setExperimentShare(15);
    setMinRunway(3);
  };

  const downloadReport = () => {
    const locale = lang === "id" ? "id-ID" : "en-US";
    const reportName = name.trim() || (lang === "id" ? "Kamu" : "You");
    const generated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(new Date());
    const inputRows = moneyOrder.map((key) => {
      const [label] = t.inputs[key];
      return `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(formatMoney(money[key], lang))}</td></tr>`;
    }).join("");
    const assumptionRows = [
      [t.reliability, `${reliability}%`],
      [t.comfort, `${comfortBuffer}%`],
      [t.experimentShare, `${experimentShare}%`],
      [t.minRunway, `${minRunway} ${t.months}`],
    ].map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
    const outputRows = [
      [t.survivalFloor, formatMoney(results.survival, lang)],
      [t.comfortFloor, formatMoney(results.comfort, lang)],
      [t.adjustedIncome, formatMoney(results.adjustedIncome, lang)],
      [t.deployableCash, formatMoney(results.deployable, lang)],
      [t.currentRunway, formatRunway(results.runway, lang)],
      [t.withBridge, formatRunway(results.bridgeRunway, lang)],
      [t.experimentBudget, formatMoney(results.experimentation, lang)],
    ].map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
    const insightItems = [signal, bridgeSignal, experimentSignal]
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
    const report = `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(t.reportTitle)} — ${escapeHtml(reportName)}</title>
<style>
  :root{--navy:#0c1b33;--burgundy:#7a1838;--paper:#fffdfa;--line:#d7dbe0}*{box-sizing:border-box}body{margin:0;background:#eee9e3;color:var(--navy);font:14px/1.55 Arial,sans-serif}.report{width:min(900px,calc(100% - 32px));margin:32px auto;padding:54px;background:var(--paper);border:2px solid var(--navy);box-shadow:12px 14px 0 var(--burgundy)}header{padding-bottom:28px;border-bottom:5px solid var(--navy)}.folio{color:var(--burgundy);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}h1{max-width:720px;margin:12px 0 16px;font:italic 46px/1.02 Georgia,serif;letter-spacing:-.04em}.meta{display:flex;gap:26px;flex-wrap:wrap;color:#657084;font-size:12px}.hero{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:28px 0}.hero div{padding:20px;color:#fff;background:var(--navy)}.hero div:last-child{background:var(--burgundy)}.hero span{display:block;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.hero strong{display:block;margin-top:8px;font:32px Georgia,serif}h2{margin:34px 0 12px;font:26px Georgia,serif}table{width:100%;border-collapse:collapse}th,td{padding:10px 12px;border-bottom:1px solid var(--line);text-align:left}th{font-size:11px}td{text-align:right;font-variant-numeric:tabular-nums}.columns{display:grid;grid-template-columns:1fr 1fr;gap:30px}.insights{padding:22px 28px;background:#f6ecef}.insights li+li{margin-top:12px}.warning{margin-top:34px;padding:20px;border:2px solid var(--burgundy);color:#5c102a;background:#faeef2;font-weight:700}.privacy{margin-top:18px;color:#657084;font-size:11px}footer{display:flex;justify-content:space-between;gap:20px;margin-top:38px;padding-top:18px;border-top:1px solid var(--navy);font-size:10px;font-weight:700}@media(max-width:650px){.report{padding:26px}.columns,.hero{grid-template-columns:1fr}h1{font-size:36px}}@media print{body{background:#fff}.report{width:100%;margin:0;padding:20mm;border:0;box-shadow:none}}
</style></head><body><main class="report">
<header><div class="folio">FALLOW MATH · ${escapeHtml(t.moodLabel)}: ${escapeHtml(runwayMood)}</div><h1>${escapeHtml(t.reportTitle)}</h1><div class="meta"><span>${escapeHtml(t.reportName)}: <strong>${escapeHtml(reportName)}</strong></span><span>${escapeHtml(t.reportGoal)}: <strong>${escapeHtml(t.intentions[intention])}</strong></span><span>${escapeHtml(t.reportGenerated)}: ${escapeHtml(generated)}</span></div></header>
<section class="hero"><div><span>${escapeHtml(t.currentRunway)}</span><strong>${escapeHtml(formatRunway(results.runway, lang))}</strong></div><div><span>${escapeHtml(t.experimentBudget)}</span><strong>${escapeHtml(formatMoney(results.experimentation, lang))}</strong></div></section>
<div class="columns"><section><h2>${escapeHtml(t.reportInputs)}</h2><table>${inputRows}</table></section><section><h2>${escapeHtml(t.reportAssumptions)}</h2><table>${assumptionRows}</table><h2>${escapeHtml(t.reportOutputs)}</h2><table>${outputRows}</table></section></div>
<section><h2>${escapeHtml(t.reportInsights)}</h2><ol class="insights">${insightItems}</ol></section>
<div class="warning">${escapeHtml(t.disclaimer)} ${escapeHtml(t.inputWarning)}</div><p class="privacy">${escapeHtml(t.reportPrivacy)}</p>
<footer><span>Fallow Math · ${escapeHtml(t.legalUpdated)}</span></footer>
</main></body></html>`;

    const blob = new Blob([report], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `fallow-math-report-${safeFilename(reportName)}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="site-shell">
      {consentRequired && (
        <div className="consent-overlay">
          <section
            className="consent-dialog"
            ref={consentDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
            aria-describedby="consent-description"
            onKeyDown={trapConsentFocus}
          >
            <aside className="consent-folio" aria-hidden="true">
              <span>FALLOW<br />MATH</span>
              <strong>!</strong>
              <small>READ<br />FIRST</small>
            </aside>
            <div className="consent-paper">
              <div className="consent-topline">
                <p>{t.consentKicker}</p>
                <div className="consent-language" aria-label={t.consentLanguage}>
                  <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
                  <button className={lang === "id" ? "active" : ""} onClick={() => setLang("id")} aria-pressed={lang === "id"}>ID</button>
                </div>
              </div>
              <div className="consent-heading">
                <span aria-hidden="true">01</span>
                <h2 id="consent-title">{t.consentTitle}</h2>
              </div>
              <p className="consent-description" id="consent-description">{t.consentBody}</p>
              <ul>{t.consentPoints.map((point) => <li key={point}>{point}</li>)}</ul>
              <label className="consent-check">
                <input ref={consentCheckboxRef} type="checkbox" checked={consentConfirmed} onChange={(event) => setConsentConfirmed(event.target.checked)} />
                <span aria-hidden="true" />
                <strong>{t.consentCheck}</strong>
              </label>
              <button className="consent-button" type="button" disabled={!consentConfirmed} onClick={acceptDisclaimer}>
                <span>{t.consentAgree}</span><i aria-hidden="true">→</i>
              </button>
              <p className="consent-privacy">{t.consentPrivacy}</p>
            </div>
          </section>
        </div>
      )}
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Fallow Math home">
          <span className="brand-copy">Fallow Math<small>{t.issue}</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#calculator">{t.navCalculator}</a>
          <a href="#guide">{t.navGuide}</a>
          <a href="#legal">{t.navLegal}</a>
        </nav>
        <div className="language-toggle" aria-label="Language">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
          <button className={lang === "id" ? "active" : ""} onClick={() => setLang("id")} aria-pressed={lang === "id"}>ID</button>
          <span className={lang === "id" ? "toggle-pill right" : "toggle-pill"} aria-hidden="true" />
        </div>
      </header>

      <main id="top">
        <section className="hero page-width">
          <div className="hero-folio"><span>VOL. 01</span>{t.folio}</div>
          <div className="hero-copy">
            <p className="eyebrow"><span />{t.eyebrow}</p>
            <h1>{t.titleA}<br /><em>{t.titleB}</em></h1>
            <p className="hero-intro">{t.intro}</p>
            <p className="quiet-note"><span aria-hidden="true">✓</span>{t.notCommand}</p>
          </div>
          <div className="personal-card">
            <span className="card-tab">PERSONAL COPY</span>
            <div className="personal-card-number" aria-hidden="true">00</div>
            <div className="personal-intro">
              <span>{t.personalKicker}</span>
              <h2>{t.personalTitle}</h2>
              <p>{t.personalHelp}</p>
            </div>
            <label htmlFor="name">
              <span>{t.nameLabel}</span>
              <input id="name" value={name} placeholder={t.namePlaceholder} onChange={(event) => setName(event.target.value.slice(0, 40))} />
            </label>
            <label htmlFor="intention">
              <span>{t.intentionLabel}</span>
              <select id="intention" value={intention} onChange={(event) => setIntention(event.target.value as typeof intention)}>
                {Object.entries(t.intentions).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>
            <p>{t.formulaNote}</p>
          </div>
          <div className="hero-sticker" aria-hidden="true"><span>PLAN</span><strong>↓</strong><span>THEN LEAP</span></div>
        </section>

        <div className="editorial-ticker" aria-label={t.ticker.join(", ")}>
          <div className="ticker-track">
            {[...t.ticker, ...t.ticker].map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}
          </div>
        </div>

        <section className="calculator page-width" id="calculator">
          <div className="calculator-tab">{t.worksheetLabel}</div>
          <div className="inputs-panel">
            <div className="section-heading">
              <p className="section-kicker">{t.calculatorKicker}</p>
              <h2>{t.calculatorTitle}</h2>
              <p>{t.calculatorIntro}</p>
            </div>
            <div className="warning-strip"><strong>! {t.warningLabel}</strong><p>{t.inputWarning}</p></div>
            <div className="money-grid">
              {moneyOrder.map((key) => {
                const [label, note] = t.inputs[key];
                const badge = key === "transitionCosts" ? t.oneTime : key === "savings" ? t.available : key === "reserve" ? t.protected : t.monthly;
                return <MoneyInput key={key} id={`money-${key}`} label={label} note={note} badge={badge} value={money[key]} lang={lang} onChange={(value) => updateMoney(key, value)} />;
              })}
            </div>

            <div className="assumptions-block">
              <div className="section-heading compact">
                <p className="section-kicker">{t.assumptionsKicker}</p>
                <h2>{t.assumptionsTitle}</h2>
                <p>{t.assumptionsIntro}</p>
              </div>
              <div className="slider-grid">
                <AssumptionSlider id="reliability" label={t.reliability} help={t.reliabilityHelp} value={reliability} min={0} max={100} step={5} suffix="%" onChange={setReliability} />
                <AssumptionSlider id="comfort" label={t.comfort} help={t.comfortHelp} value={comfortBuffer} min={0} max={60} step={5} suffix="%" onChange={setComfortBuffer} />
                <AssumptionSlider id="experiment-share" label={t.experimentShare} help={t.experimentShareHelp} value={experimentShare} min={0} max={50} step={5} suffix="%" onChange={setExperimentShare} />
                <AssumptionSlider id="minimum-runway" label={t.minRunway} help={t.minRunwayHelp} value={minRunway} min={1} max={24} step={1} suffix={` ${t.months}`} onChange={setMinRunway} />
              </div>
              <button className="reset-button" onClick={reset}><span aria-hidden="true">↺</span>{t.reset}</button>
            </div>
          </div>

          <aside className="results-panel" aria-live="polite">
            <div className="result-heading">
              <p>{t.resultKicker}</p>
              <h2>{name.trim() ? `${name.trim()}, ${t.resultTitleNamed}` : t.resultTitle}</h2>
              <span>{t.forGoal} {t.intentions[intention].toLowerCase()}</span>
            </div>

            <div className="mood-stamp"><span>{t.moodLabel}</span><strong>{runwayMood}</strong><i aria-hidden="true">✶</i></div>

            <div className="runway-card">
              <div className="runway-card-top">
                <span>{t.currentRunway}</span>
                <span className="live-dot"><i /> Live</span>
              </div>
              <strong>{formatRunway(results.runway, lang, true)}</strong>
              <p>{results.burn === 0 ? t.noMonthlyBurn : `${formatMoney(results.burn, lang)} ${t.monthlyBurn}`}</p>
              <div className="runway-track" aria-label={`${t.runwayScale}: ${Math.round(runwayProgress)}%`}>
                <span style={{ width: `${runwayProgress}%` }} />
                <i style={{ left: `${Math.min((minRunway / Math.max(12, minRunway * 2)) * 100, 96)}%` }} />
              </div>
              <div className="track-labels"><span>0</span><span>{t.protectedTarget}: {minRunway} {t.months}</span></div>
            </div>

            <div className="headline-metrics">
              <div>
                <span>{t.withBridge}</span>
                <strong>{formatRunway(results.bridgeRunway, lang, true)}</strong>
              </div>
              <div className="accent-metric">
                <span>{t.experimentBudget}</span>
                <strong>{formatMoney(results.experimentation, lang)}</strong>
              </div>
            </div>
            <p className="metric-footnote">{t.spendCeiling}</p>

            <dl className="metric-list">
              <div><dt>{t.survivalFloor}</dt><dd>{formatMoney(results.survival, lang)}</dd></div>
              <div><dt>{t.comfortFloor}</dt><dd>{formatMoney(results.comfort, lang)}</dd></div>
              <div><dt>{t.adjustedIncome}</dt><dd>{formatMoney(results.adjustedIncome, lang)}</dd></div>
              <div><dt>{t.deployableCash}</dt><dd>{formatMoney(results.deployable, lang)}</dd></div>
            </dl>

            <div className="readout">
              <h3>{t.readoutTitle}</h3>
              <div><span>01</span><p><strong>{t.runwaySignal}</strong>{signal}</p></div>
              <div><span>02</span><p><strong>{t.bridgeEffect}</strong>{bridgeSignal}</p></div>
              <div><span>03</span><p><strong>{t.experimentRule}</strong>{experimentSignal}</p></div>
            </div>
            <div className="result-warning"><span aria-hidden="true">!</span><p>{t.resultWarning}</p></div>
            <button className="report-button" type="button" onClick={downloadReport}>
              <span>{t.downloadReport}</span><i aria-hidden="true">↓</i>
              <small>{t.reportHint}</small>
            </button>
          </aside>
        </section>

        <section className="editorial-dispatch page-width">
          <div className="dispatch-index"><span>FM</span><strong>01</strong></div>
          <div className="dispatch-quote">
            <p>{t.dispatchKicker}</p>
            <blockquote>“{name.trim() ? `${name.trim()}, ` : ""}{t.dispatchQuote.charAt(0).toLowerCase() + t.dispatchQuote.slice(1)}”</blockquote>
          </div>
          <aside>
            <p>{t.dispatchBridge}</p>
            <code>{t.dispatchFormula}</code>
          </aside>
        </section>

        <section className="scenario-section">
          <div className="scenario-watermark" aria-hidden="true">WHAT IF?</div>
          <div className="page-width">
            <div className="scenario-heading">
              <p className="section-kicker light">{t.scenarioKicker}</p>
              <h2>{t.scenarioTitle}</h2>
              <p>{t.scenarioIntro}</p>
              <div className="scenario-warning"><span aria-hidden="true">!</span>{t.scenarioWarning}</div>
            </div>
            <div className="scenario-table" role="table" aria-label={t.scenarioTitle}>
              <div className="scenario-row scenario-header" role="row">
                <span role="columnheader">{t.scenario}</span>
                <span role="columnheader">{t.bridgeIncome}</span>
                <span role="columnheader">{t.netBurn}</span>
                <span role="columnheader">{t.runway}</span>
              </div>
              {scenarios.map(([label, bridge], index) => {
                const burn = Math.max(results.burn - bridge, 0);
                const runway = burn === 0 ? Number.POSITIVE_INFINITY : results.deployable / burn;
                const width = !Number.isFinite(runway) ? 100 : Math.min((runway / 24) * 100, 100);
                return (
                  <div className={`scenario-row ${index === 2 ? "selected" : ""}`} role="row" key={label}>
                    <span role="cell"><i>{String(index + 1).padStart(2, "0")}</i><strong>{label}</strong>{index === 2 && <em>•</em>}</span>
                    <span role="cell">{formatMoney(bridge, lang)}</span>
                    <span role="cell">{burn === 0 ? "—" : formatMoney(burn, lang)}</span>
                    <span className="scenario-runway" role="cell"><b style={{ width: `${width}%` }} /><strong>{Number.isFinite(runway) ? formatRunway(runway, lang) : t.floorCovered}</strong></span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="guide page-width" id="guide">
          <div className="guide-mantra" aria-hidden="true">{t.guideMantra}</div>
          <div className="guide-heading">
            <p className="section-kicker">{t.guideKicker}</p>
            <h2>{t.guideTitle}</h2>
            <p>{t.guideIntro}</p>
          </div>
          <div className="guide-grid">
            <details open>
              <summary><span>01</span>{t.howInputs}<i>+</i></summary>
              <div className="guide-content rows">
                {t.inputGuide.map(([title, description]) => <div key={title}><strong>{title}</strong><p>{description}</p></div>)}
              </div>
            </details>
            <details>
              <summary><span>02</span>{t.howOutputs}<i>+</i></summary>
              <div className="guide-content rows">
                {t.outputGuide.map(([title, description]) => <div key={title}><strong>{title}</strong><p>{description}</p></div>)}
              </div>
            </details>
            <details>
              <summary><span>03</span>{t.guardrails}<i>+</i></summary>
              <ol className="guide-content guardrail-list">
                {t.guardrailList.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
              </ol>
            </details>
          </div>
          <div className="disclaimer"><span aria-hidden="true">i</span><p>{t.disclaimer}</p></div>
        </section>

        <section className="comprehensive-cta">
          <div className="page-width">
            <div>
              <p>{t.comprehensiveKicker}</p>
              <h2>{t.comprehensiveTitle}</h2>
            </div>
            <p>{t.comprehensiveCopy}</p>
            <a className="comprehensive-button" href="https://www.getconscious.xyz" target="_blank" rel="noreferrer">{t.comprehensiveButton}</a>
          </div>
        </section>

        <section className="legal-section page-width" id="legal">
          <div className="legal-heading">
            <p className="section-kicker">{t.privacyKicker}</p>
            <h2>{t.privacyHeading}</h2>
            <span>{t.legalUpdated}</span>
          </div>
          <div className="legal-grid">
            <details open>
              <summary><span>01</span>{t.privacyTitle}<i>+</i></summary>
              <div className="legal-content"><p>{t.privacyIntro}</p><ul>{t.privacyItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </details>
            <details open>
              <summary><span>02</span>{t.legalTitle}<i>+</i></summary>
              <div className="legal-content"><ul>{t.legalItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </details>
          </div>
        </section>
      </main>

      <footer>
        <div className="page-width">
          <div className="brand"><span className="brand-copy">Fallow Math<small>{t.issue}</small></span></div>
          <p>{t.footerLine}</p>
          <nav><a href="#legal">{t.navLegal}</a><a href="#top">↑ Top</a></nav>
          <div className="footer-copyright">{t.copyright}</div>
        </div>
      </footer>
    </div>
  );
}
