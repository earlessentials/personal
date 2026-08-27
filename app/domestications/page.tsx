"use client";

import { useMemo, useState } from "react";

type CategoryKey = "palatability" | "composure" | "usefulness" | "legibility";

type Category = {
  key: CategoryKey;
  letter: string;
  name: string;
  quote: string;
  description: string;
  questions: string[];
  reflection: string;
};

const categories: Category[] = [
  {
    key: "palatability",
    letter: "A",
    name: "PALATABILITY",
    quote: "“Aku belajar membuat diriku lebih mudah diterima.”",
    description:
      "Palatability menjadi dominan ketika approval mulai memengaruhi seberapa banyak truth, desire, preference, ambition, atau disagreement yang kamu izinkan terlihat.",
    questions: [
      "Aku sering menghaluskan opini agar orang lain lebih nyaman menerimanya.",
      "Aku memberikan penjelasan panjang setelah mengatakan tidak karena penolakan singkat terasa terlalu keras.",
      "Aku sering mengatakan “terserah” meskipun sebenarnya memiliki preferensi yang cukup jelas.",
      "Ekspresi wajah, tone, atau reaksi orang lain dapat membuatku cepat mengubah cara menyampaikan sesuatu.",
      "Aku mengecilkan ambisi, pencapaian, standar, atau keinginanku agar tidak terlihat terlalu demanding, intimidating, atau full of myself.",
      "Aku sering tersenyum, tertawa, atau menggunakan humor ketika menyampaikan sesuatu yang sebenarnya membuatku kesal.",
      "Aku merasa perlu memastikan orang lain memahami bahwa aku tetap “orang baik” setelah menetapkan boundary.",
      "Aku menghabiskan cukup banyak energi memikirkan bagaimana keputusan pribadiku akan dipersepsikan orang lain.",
      "Menjadi disliked terasa cukup mengganggu sampai aku terkadang memilih kompromi yang sebenarnya tidak kuinginkan.",
      "Aku lebih mudah mengetahui apa yang membuat orang lain nyaman daripada menyebutkan dengan jelas apa yang kuinginkan sendiri.",
    ],
    reflection:
      "Kalau aku berhenti mengoptimalkan diriku agar mudah disukai, bagian mana dari diriku yang kemungkinan muncul lebih dulu?",
  },
  {
    key: "composure",
    letter: "B",
    name: "COMPOSURE",
    quote:
      "“Aku belajar bahwa semakin sedikit emosiku mengganggu orang lain, semakin aman posisiku.”",
    description:
      "Composure menjadi dominan ketika emotional regulation perlahan berubah menjadi emotional restriction, sehingga ketenangan terasa seperti satu-satunya bentuk diri yang boleh terlihat.",
    questions: [
      "Aku merasa uncomfortable ketika orang lain melihatku sangat marah, sedih, takut, overwhelmed, atau emotionally messy.",
      "Aku cenderung menganalisis perasaanku sebelum benar-benar memberi diriku kesempatan merasakannya.",
      "Saat seseorang menyakitiku, aku cepat memahami perspektif mereka sampai pengalamanku sendiri menjadi kurang terlihat.",
      "Orang sering menggambarkanku sebagai mature, calm, rational, strong, atau emotionally stable.",
      "Aku merasa harus memiliki penjelasan yang masuk akal sebelum emosiku terasa legitimate.",
      "Aku sering mengatakan “aku ngerti kenapa dia begitu” bahkan ketika perilakunya membuatku terluka.",
      "Kehilangan composure di depan orang lain terasa seperti kehilangan dignity atau control.",
      "Aku lebih nyaman membicarakan emosi secara intelektual daripada memperlihatkan intensitas emosinya secara langsung.",
      "Aku sering menunggu sampai sendirian untuk memproses emosi yang sebenarnya muncul saat bersama orang lain.",
      "Aku merasa bertanggung jawab menjaga percakapan tetap reasonable bahkan ketika pihak lain sudah membuatku sangat marah.",
    ],
    reflection:
      "Kalau aku tidak perlu terlihat reasonable sepanjang waktu, emosi apa yang akhirnya mendapat lebih banyak ruang?",
  },
  {
    key: "usefulness",
    letter: "C",
    name: "USEFULNESS",
    quote: "“Aku belajar bahwa menjadi berguna memberiku tempat.”",
    description:
      "Usefulness menjadi dominan ketika contribution, productivity, reliability, dan caretaking mulai terlalu dekat dengan self-worth dan belonging.",
    questions: [
      "Aku sering menawarkan bantuan sebelum seseorang benar-benar memintanya.",
      "Istirahat terasa jauh lebih nyaman setelah aku merasa sudah cukup produktif.",
      "Aku merasa bersalah ketika mengetahui seseorang membutuhkan bantuan yang sebenarnya mampu kuberikan.",
      "Aku sering menjadi fixer, organizer, problem-solver, caretaker, atau reliable person dalam relationship.",
      "Aku jauh lebih nyaman memberi bantuan daripada menerimanya.",
      "Aku pernah merasa resentful kepada orang yang menerima bantuan atau akses yang sebelumnya kuberikan sendiri.",
      "Menjadi dibutuhkan membuatku merasa memiliki posisi yang jelas dalam relationship.",
      "Aku sulit menikmati aktivitas yang tidak menghasilkan progress, improvement, money, knowledge, atau sesuatu yang “berguna.”",
      "Ketika seseorang memiliki masalah, pikiranku cepat mencari solusi meskipun mereka belum meminta solusi.",
      "Bayangan menjadi kurang productive, less needed, atau temporarily irrelevant memunculkan discomfort yang cukup kuat.",
    ],
    reflection:
      "Kalau tidak ada seorang pun yang membutuhkan sesuatu dariku selama satu bulan, bagian mana dari identitasku yang paling kehilangan pegangan?",
  },
  {
    key: "legibility",
    letter: "D",
    name: "LEGIBILITY",
    quote: "“Aku belajar membuat hidupku mudah dijelaskan.”",
    description:
      "Legibility menjadi dominan ketika coherence, consistency, reputation, dan identitas yang recognizable mulai membatasi experimentation dan kemampuan berubah pikiran.",
    questions: [
      "Aku merasa uncomfortable ketika tidak memiliki jawaban jelas tentang “sekarang aku sedang melakukan apa.”",
      "Aku sering mempertimbangkan apakah sebuah keputusan cocok dengan identity, career trajectory, personal brand, atau reputation-ku.",
      "Mengubah pikiran setelah sebelumnya sangat yakin terasa embarrassing atau membuatku terlihat inconsistent.",
      "Aku merasa lebih aman ketika kehidupan memiliki trajectory yang bisa dijelaskan dengan mudah kepada orang lain.",
      "Aku pernah mengabaikan curiosity karena terasa random, impractical, off-brand, atau tidak nyambung dengan diriku selama ini.",
      "Aku merasa pressure untuk terus menjadi orang yang dikenal orang lain sebagai “aku.”",
      "Saat ingin mencoba sesuatu yang sangat berbeda, aku cepat memikirkan bagaimana cara menjelaskannya kepada orang lain.",
      "Fase hidup yang undefined terasa lebih mengganggu bagiku daripada menjalani sesuatu yang familiar namun kurang menarik.",
      "Aku cenderung ingin memberi label, rencana, atau tujuan pada interest baru agar terasa legitimate.",
      "Membayangkan hidupku menjadi jauh lebih sulit dijelaskan terasa sekaligus menarik dan menakutkan.",
    ],
    reflection:
      "Apa yang mungkin kucoba kalau hidupku tidak harus terlihat coherent dari luar?",
  },
];

const flowLabels = [
  "Pembuka",
  "Palatability",
  "Composure",
  "Usefulness",
  "Legibility",
  "Profil",
  "Optionality",
  "The Real Score",
];

const readingRows = [
  {
    score: "0–10",
    level: "LOW",
    interpretation:
      "Pola ini relatif jarang mengatur perilakumu, atau kamu memiliki fleksibilitas yang cukup besar di area ini.",
  },
  {
    score: "11–20",
    level: "MODERATE",
    interpretation:
      "Pola ini hadir dan memengaruhi beberapa konteks, sementara kamu masih memiliki cukup banyak behavioral range.",
  },
  {
    score: "21–30",
    level: "HIGH",
    interpretation:
      "Pola ini cukup kuat dalam membentuk keputusan, relationship, self-presentation, atau cara kamu mengelola kebutuhan.",
  },
  {
    score: "31–40",
    level: "DOMINANT",
    interpretation:
      "Pola ini kemungkinan sudah sangat terintegrasi dengan identity dan dapat terasa seperti “memang aku orangnya begini.”",
  },
];

const optionalityPrompts = [
  "Kualitas yang paling sering kutampilkan:",
  "Reward yang biasanya kudapat dari kualitas ini:",
  "Harga yang kubayar untuk mempertahankannya:",
  "Perilaku kebalikannya yang paling sulit kulakukan:",
  "Hal yang kuprediksi akan terjadi kalau aku mulai melakukan kebalikannya:",
  "Eksperimen kecil dan reversible yang bisa kulakukan minggu ini:",
  "Evidence yang akan kuperhatikan:",
];

const initialAnswers: Record<CategoryKey, number[]> = {
  palatability: Array(10).fill(-1),
  composure: Array(10).fill(-1),
  usefulness: Array(10).fill(-1),
  legibility: Array(10).fill(-1),
};

function getLevel(score: number) {
  if (score <= 10) return "LOW";
  if (score <= 20) return "MODERATE";
  if (score <= 30) return "HIGH";
  return "DOMINANT";
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [name, setName] = useState("");
  const [answers, setAnswers] =
    useState<Record<CategoryKey, number[]>>(initialAnswers);
  const [reflections, setReflections] = useState<string[]>(
    optionalityPrompts.map(() => ""),
  );

  const totals = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category.key,
          answers[category.key].reduce(
            (sum, value) => sum + (value >= 0 ? value : 0),
            0,
          ),
        ]),
      ) as Record<CategoryKey, number>,
    [answers],
  );

  const answeredCount = Object.values(answers).flat().filter((v) => v >= 0).length;

  const ranking = useMemo(
    () =>
      categories
        .map((category, index) => ({
          ...category,
          score: totals[category.key],
          originalIndex: index,
        }))
        .sort(
          (a, b) => b.score - a.score || a.originalIndex - b.originalIndex,
        ),
    [totals],
  );

  function selectScore(key: CategoryKey, questionIndex: number, score: number) {
    setAnswers((current) => ({
      ...current,
      [key]: current[key].map((value, index) =>
        index === questionIndex ? score : value,
      ),
    }));
  }

  function moveTo(nextStep: number) {
    setStep(nextStep);
    setFurthestStep((current) => Math.max(current, nextStep));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setAnswers(initialAnswers);
    setReflections(optionalityPrompts.map(() => ""));
    setStep(0);
    setFurthestStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function escapeHtml(value: string) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function downloadReport() {
    const safeName = escapeHtml(name.trim() || "Anonymous");
    const date = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    const scoreRows = categories
      .map((category) => {
        const score = totals[category.key];
        return `<tr><td>${category.name[0] + category.name.slice(1).toLowerCase()}</td><td>${score} / 40</td><td>${score * 2.5}%</td><td>${getLevel(score)}</td></tr>`;
      })
      .join("");
    const rankingRows = ranking
      .map(
        (category, index) =>
          `<li><span>0${index + 1}</span><strong>${category.name}</strong><b>${category.score} / 40</b></li>`,
      )
      .join("");
    const reflectionRows = optionalityPrompts
      .map(
        (prompt, index) =>
          `<section><h3>${escapeHtml(prompt)}</h3><p>${escapeHtml(reflections[index].trim() || "—")}</p></section>`,
      )
      .join("");
    const report = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Four Domestications Report — ${safeName}</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#fffaf5;color:#0c2340;font-family:Arial,sans-serif;line-height:1.55}main{max-width:920px;margin:auto;padding:64px 42px}.eyebrow{font:700 11px monospace;letter-spacing:.14em;color:#801d3d}.cover{border:3px solid #0c2340;padding:48px;box-shadow:12px 12px 0 #801d3d}.cover h1{margin:18px 0 38px;font-family:Georgia,serif;font-size:64px;font-style:italic;letter-spacing:-.05em;line-height:.86}.name{display:flex;justify-content:space-between;gap:20px;padding-top:20px;border-top:2px solid #0c2340}.name strong{font-family:Georgia,serif;font-size:28px}.name span{font:11px monospace}h2{margin:72px 0 24px;font-family:Georgia,serif;font-size:38px;font-style:italic}table{width:100%;border-collapse:collapse}th,td{padding:14px;border:1px solid #0c2340;text-align:left}th{background:#0c2340;color:white;font:10px monospace;letter-spacing:.08em}ol{margin:0;padding:0;list-style:none}li{display:grid;grid-template-columns:50px 1fr auto;gap:20px;padding:17px;border-bottom:1px solid #0c2340}li:first-child{background:#801d3d;color:white}li span,li b{font:11px monospace}li strong{font-family:Georgia,serif;font-size:22px}section{padding:22px 0;border-bottom:1px solid #cfc6bd}section h3{margin:0 0 8px;color:#801d3d;font:700 11px monospace;letter-spacing:.05em}section p{margin:0;font-family:Georgia,serif;font-size:20px}.footer{margin-top:70px;padding-top:18px;border-top:2px solid #0c2340;font:10px monospace}@media print{main{padding:20px}.cover{box-shadow:none}h2{page-break-after:avoid}section{page-break-inside:avoid}}</style>
</head><body><main>
<div class="cover"><p class="eyebrow">THE FOUR DOMESTICATIONS SCORECARD</p><h1>YOUR FOUR<br>DOMESTICATIONS<br>PROFILE</h1><div class="name"><strong>${safeName}</strong><span>${date}</span></div></div>
<h2>Four Domestications Profile</h2><table><thead><tr><th>Domestication</th><th>Skor</th><th>Persentase</th><th>Level</th></tr></thead><tbody>${scoreRows}</tbody></table>
<h2>The Dominance Map</h2><ol>${rankingRows}</ol>
<h2>The Optionality Test</h2>${reflectionRows}
<p class="footer">© 2026 Pearling Lim. All Rights Reserved</p>
</main></body></html>`;
    const blob = new Blob([report], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = (name.trim() || "my")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    link.href = url;
    link.download = `${fileName || "my"}-four-domestications-report.html`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  const activeCategory = step >= 1 && step <= 4 ? categories[step - 1] : null;
  const activeComplete = activeCategory
    ? answers[activeCategory.key].every((value) => value >= 0)
    : true;

  return (
    <div className={`site-shell step-${step}`}>
      <header className="topbar">
        <button className="wordmark" onClick={() => moveTo(0)}>
          <span className="wordmark-mark">FD</span>
          <span>THE FOUR DOMESTICATIONS</span>
        </button>
        <div className="topbar-progress" aria-label="Progres scorecard">
          <span>{name.trim() ? `${name.trim()} · ` : ""}{answeredCount}/40 terjawab</span>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${(answeredCount / 40) * 100}%` }} />
          </div>
        </div>
      </header>

      <div className="category-ticker" aria-hidden="true">
        <div>
          <span>PALATABILITY</span><i>✦</i><span>COMPOSURE</span><i>✦</i>
          <span>USEFULNESS</span><i>✦</i><span>LEGIBILITY</span><i>✦</i>
          <span>PALATABILITY</span><i>✦</i><span>COMPOSURE</span><i>✦</i>
          <span>USEFULNESS</span><i>✦</i><span>LEGIBILITY</span><i>✦</i>
        </div>
      </div>

      <div className="page-grid">
        <aside className="step-nav" aria-label="Tahapan scorecard">
          <p className="nav-label">ALUR SCORECARD</p>
          <ol>
            {flowLabels.map((label, index) => (
              <li key={label} className={step === index ? "active" : ""}>
                <button
                  onClick={() => moveTo(index)}
                  disabled={index > furthestStep}
                  aria-current={step === index ? "step" : undefined}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <main>
          {step === 0 && (
            <section className="intro-page page-enter">
              <div className="hero">
                <div className="hero-grid">
                  <div className="hero-copy">
                    <p className="eyebrow">THE FERAL &amp; FALLOW SEASON OF THE SELF</p>
                    <h1>
                      <span>THE FOUR</span>
                      <span>DOMESTI—</span>
                      <span>CATIONS</span>
                      <em>SCORECARD</em>
                    </h1>
                    <p className="hero-question">
                      Pola mana yang paling kuat membentuk cara kamu menjadi
                      “acceptable”?
                    </p>
                  </div>
                  <div className="hero-catalog" aria-hidden="true">
                    <div className="issue-orbit"><span>04</span></div>
                    {categories.map((category, index) => (
                      <div key={category.key}>
                        <span>0{index + 1}</span>
                        <strong>{category.name}</strong>
                        <i>{category.letter}</i>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hero-footer" aria-hidden="true">
                  <span>0—4</span><span>40 PERNYATAAN</span><span>04 POLA</span>
                </div>
              </div>

              <div className="personalization-card content-width">
                <div className="personalization-index" aria-hidden="true">YOU</div>
                <label htmlFor="participant-name">
                  <span>Sebelum mulai, siapa namamu?</span>
                  <input
                    id="participant-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nama kamu"
                    autoComplete="name"
                    maxLength={60}
                  />
                </label>
                <p>
                  {name.trim()
                    ? `Scorecard ini akan disiapkan khusus untuk ${name.trim()}.`
                    : "Namamu akan digunakan untuk mempersonalisasi profil dan report."}
                </p>
              </div>

              <div className="intro-copy content-width">
                <p>
                  Kamu jarang dijinakkan melalui satu pengalaman besar. Prosesnya
                  sering jauh lebih halus: perilaku tertentu menghasilkan
                  approval, belonging, safety, admiration, opportunity, atau love,
                  lalu perilaku tersebut diulang cukup lama sampai terasa seperti
                  personality.
                </p>
                <p>
                  Scorecard ini membantu kamu melihat pola mana yang paling dominan
                  di antara Palatability, Composure, Usefulness, dan Legibility,
                  sekaligus membedakan kualitas yang masih kamu gunakan secara
                  fleksibel dari kualitas yang sudah mulai terasa compulsory.
                </p>
              </div>

              <div className="instruction-card content-width">
                <div>
                  <p className="section-number">01 / CARA MENGISI</p>
                  <h2>Cara Mengisi</h2>
                  <p>
                    Beri skor pada setiap pernyataan berdasarkan seberapa akurat
                    pernyataan tersebut menggambarkan pola hidupmu dalam 6–12 bulan
                    terakhir.
                  </p>
                </div>
                <div className="score-key" role="table" aria-label="Arti skor">
                  <div className="score-key-head" role="row">
                    <span role="columnheader">Skor</span>
                    <span role="columnheader">Arti</span>
                  </div>
                  {[
                    ["0", "Hampir tidak pernah / sama sekali tidak menggambarkanku"],
                    ["1", "Jarang"],
                    ["2", "Kadang-kadang"],
                    ["3", "Sering"],
                    ["4", "Hampir selalu / sangat menggambarkanku"],
                  ].map(([score, meaning]) => (
                    <div className="score-key-row" role="row" key={score}>
                      <span className="score-badge" role="cell">{score}</span>
                      <span role="cell">{meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              <blockquote className="truth-note content-width">
                Jawab berdasarkan apa yang benar-benar kamu lakukan, bukan
                berdasarkan versi dirimu yang ingin kamu percaya.
              </blockquote>

              <div className="page-actions content-width align-right">
                <button
                  className="primary-button"
                  disabled={!name.trim()}
                  onClick={() => moveTo(1)}
                >
                  Mulai scorecard <span aria-hidden="true">→</span>
                </button>
              </div>
            </section>
          )}

          {activeCategory && (
            <section className={`assessment-page page-enter category-${activeCategory.key}`}>
              <span className="assessment-backdrop-letter" aria-hidden="true">
                {activeCategory.letter}
              </span>
              <div className="assessment-heading content-width">
                <div className="letter-tile">{activeCategory.letter}</div>
                <div>
                  <p className="eyebrow">DOMESTICATION {activeCategory.letter} / 04</p>
                  <h1>{activeCategory.name}</h1>
                  <p className="category-quote">{activeCategory.quote}</p>
                </div>
                <div className="score-orbit" aria-live="polite">
                  <span>TOTAL</span>
                  <strong>{totals[activeCategory.key]}</strong>
                  <small>/ 40</small>
                </div>
              </div>
              <p className="category-description content-width">
                {activeCategory.description}
              </p>

              <div className="question-table-head content-width" aria-hidden="true">
                <span>#</span>
                <span>Pernyataan</span>
                <span>Skor 0–4</span>
              </div>

              <div className="questions content-width">
                {activeCategory.questions.map((question, index) => (
                  <fieldset
                    className={`question-card ${
                      answers[activeCategory.key][index] >= 0 ? "answered" : ""
                    }`}
                    key={question}
                  >
                    <legend className="sr-only">
                      Pernyataan {index + 1}: {question}
                    </legend>
                    <span className="question-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p>{question}</p>
                    <div className="rating" aria-label={`Skor untuk pernyataan ${index + 1}`}>
                      {[0, 1, 2, 3, 4].map((score) => (
                        <label
                          key={score}
                          className={
                            answers[activeCategory.key][index] === score
                              ? "selected"
                              : ""
                          }
                        >
                          <input
                            type="radio"
                            name={`${activeCategory.key}-${index}`}
                            value={score}
                            checked={answers[activeCategory.key][index] === score}
                            onChange={() =>
                              selectScore(activeCategory.key, index, score)
                            }
                          />
                          <span>{score}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>

              <div className="category-summary content-width">
                <div className="total-block" aria-live="polite">
                  <span>TOTAL {activeCategory.name}:</span>
                  <strong>{totals[activeCategory.key]}</strong>
                  <span>/ 40</span>
                </div>
                <div className="reflection-block">
                  <span>Pertanyaan refleksi:</span>
                  <p>{activeCategory.reflection}</p>
                </div>
              </div>

              <div className="page-actions content-width">
                <button className="text-button" onClick={() => moveTo(step - 1)}>
                  <span aria-hidden="true">←</span> Kembali
                </button>
                <div className="continue-wrap">
                  {!activeComplete && (
                    <span className="answer-count">
                      {answers[activeCategory.key].filter((value) => value >= 0).length}/10
                      terjawab
                    </span>
                  )}
                  <button
                    className="primary-button"
                    disabled={!activeComplete}
                    onClick={() => moveTo(step + 1)}
                  >
                    Selanjutnya <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="results-page page-enter">
              <div className="results-hero content-width">
                <p className="eyebrow">HASIL SCORECARD</p>
                <h1>YOUR FOUR<br />DOMESTICATIONS<br />PROFILE</h1>
                <p>{name.trim()}, masukkan total masing-masing kategori.</p>
                <div className="results-spotlight">
                  <span>PRIMARY DOMESTICATION</span>
                  <strong>{ranking[0].name}</strong>
                  <b>{ranking[0].score}<small>/40</small></b>
                </div>
              </div>

              <div className="profile-grid content-width">
                {categories.map((category) => {
                  const score = totals[category.key];
                  return (
                    <article className={`profile-card profile-${category.key}`} key={category.key}>
                      <span className="profile-watermark" aria-hidden="true">
                        {category.letter}
                      </span>
                      <div className="profile-card-top">
                        <span>{category.letter}</span>
                        <span className="level-pill">{getLevel(score)}</span>
                      </div>
                      <h2>{category.name[0] + category.name.slice(1).toLowerCase()}</h2>
                      <div className="score-display">
                        <strong>{score}</strong><span>/ 40</span>
                      </div>
                      <div className="percentage-row">
                        <span>Persentase</span><strong>{score * 2.5}%</strong>
                      </div>
                      <div className="mini-track" aria-hidden="true">
                        <span style={{ width: `${score * 2.5}%` }} />
                      </div>
                      <div
                        className="score-ring"
                        style={{
                          background: `conic-gradient(var(--burgundy) ${score * 2.5}%, var(--paper) 0)`,
                        }}
                        aria-hidden="true"
                      >
                        <span>{score * 2.5}%</span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <p className="profile-table-labels content-width">
                <span>Domestication</span><span>Skor</span><span>Persentase</span>
              </p>

              <div className="formula-note content-width">
                <div><span>Rumus persentase:</span><strong>Skor ÷ 40 × 100 = %</strong></div>
                <p>Contoh: skor 28 berarti 70%.</p>
              </div>

              <section className="reading-section content-width">
                <p className="section-number">02 / INTERPRETASI</p>
                <h2>CARA MEMBACA SKORMU</h2>
                <div className="reading-table">
                  <div className="reading-head">
                    <span>Skor</span><span>Level</span><span>Interpretasi</span>
                  </div>
                  {readingRows.map((row) => (
                    <div className="reading-row" key={row.level}>
                      <strong>{row.score}</strong>
                      <span className="level-pill">{row.level}</span>
                      <p>{row.interpretation}</p>
                    </div>
                  ))}
                </div>
                <div className="interpretive-copy">
                  <p>
                    Score tinggi tidak berarti kualitas tersebut buruk.
                    Palatability bisa menjadi social intelligence. Composure bisa
                    menjadi emotional regulation. Usefulness bisa menjadi
                    generosity dan competence. Legibility bisa menciptakan
                    consistency dan trust.
                  </p>
                  <p>Pertanyaan yang lebih penting adalah:</p>
                  <blockquote>
                    Apakah aku masih bisa memilih kebalikannya ketika situasi
                    membutuhkannya?
                  </blockquote>
                  <p>
                    Karena titik kritis domestication muncul ketika sebuah kekuatan
                    kehilangan optionality.
                  </p>
                </div>
              </section>

              <section className="dominance-section content-width">
                <div className="dominance-title">
                  <div>
                    <p className="section-number">03 / RANKING</p>
                    <h2>THE DOMINANCE MAP</h2>
                  </div>
                  <p>Sekarang urutkan skormu dari tertinggi ke terendah.</p>
                </div>
                <ol className="ranking-list">
                  {ranking.map((category, index) => {
                    const role = [
                      "Primary Domestication",
                      "Secondary Domestication",
                      "Supporting Pattern",
                      "Lowest Pattern",
                    ][index];
                    return (
                      <li key={category.key}>
                        <span className="rank-number">0{index + 1}</span>
                        <div><span>{role}</span><strong>{category.name[0] + category.name.slice(1).toLowerCase()}</strong></div>
                        <span className="rank-score">{category.score} / 40</span>
                      </li>
                    );
                  })}
                </ol>
                <div className="dominance-copy">
                  <p>
                    Primary Domestication menunjukkan strategi sosial yang paling
                    mungkin kamu gunakan untuk mempertahankan safety, approval,
                    belonging, atau coherence. Secondary Domestication sering
                    bekerja sebagai pendukungnya, sehingga kombinasi keduanya jauh
                    lebih informatif daripada satu skor secara terpisah.
                  </p>
                  <p>
                    Contohnya, Palatability + Composure dapat menciptakan seseorang
                    yang sangat mahir membuat disagreement terlihat effortless dan
                    emotionally clean, sampai orang lain hampir tak pernah
                    mengetahui seberapa banyak yang sebenarnya sedang ia tahan.
                    Usefulness + Palatability dapat menciptakan seseorang yang terus
                    memberi sambil memastikan semua orang nyaman, kemudian bingung
                    kenapa hidupnya penuh resentment. Composure + Legibility dapat
                    menghasilkan identitas yang terlihat luar biasa coherent dan
                    stable sambil menyisakan sangat sedikit ruang untuk messiness dan
                    experimentation. Usefulness + Legibility dapat membuat
                    achievement dan productivity menjadi pusat identity karena
                    menjadi kompeten memberi rasa value sekaligus cerita yang jelas
                    tentang siapa dirimu.
                  </p>
                </div>
              </section>

              <div className="page-actions content-width">
                <button className="text-button" onClick={() => moveTo(4)}>
                  <span aria-hidden="true">←</span> Kembali
                </button>
                <div className="action-group">
                  <button className="download-button" onClick={downloadReport}>
                    Download report <span aria-hidden="true">↓</span>
                  </button>
                  <button className="primary-button" onClick={() => moveTo(6)}>
                    Lanjutkan refleksi <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === 6 && (
            <section className="optionality-page page-enter">
              <div className="optionality-symbol" aria-hidden="true">
                <span>O</span><span>P</span><span>T</span>
              </div>
              <div className="optionality-heading content-width">
                <p className="eyebrow">REFLEKSI TERARAH</p>
                <h1>THE OPTIONALITY TEST</h1>
                <p>
                  Sekarang ambil Primary Domestication-mu dan selesaikan bagian
                  ini.
                </p>
                <div className="primary-result">
                  <span>PRIMARY DOMESTICATION</span>
                  <strong>{ranking[0].name}</strong>
                  <span>{ranking[0].score} / 40</span>
                </div>
              </div>

              <div className="optionality-form content-width">
                {optionalityPrompts.map((prompt, index) => (
                  <label key={prompt}>
                    <span className="prompt-number">0{index + 1}</span>
                    <span>{prompt}</span>
                    <textarea
                      rows={index === 5 ? 4 : 3}
                      value={reflections[index]}
                      onChange={(event) =>
                        setReflections((current) =>
                          current.map((value, reflectionIndex) =>
                            reflectionIndex === index ? event.target.value : value,
                          ),
                        )
                      }
                    />
                  </label>
                ))}
              </div>

              <div className="page-actions content-width">
                <button className="text-button" onClick={() => moveTo(5)}>
                  <span aria-hidden="true">←</span> Kembali
                </button>
                <button className="primary-button" onClick={() => moveTo(7)}>
                  Lihat the real score <span aria-hidden="true">→</span>
                </button>
              </div>
            </section>
          )}

          {step === 7 && (
            <section className="real-score-page page-enter">
              <div className="closing-ribbon" aria-hidden="true">
                BEHAVIORAL RANGE · BEHAVIORAL RANGE · BEHAVIORAL RANGE ·
              </div>
              <div className="closing-heading content-width">
                <p className="eyebrow">PENUTUP</p>
                <h1>THE REAL SCORE</h1>
              </div>
              <div className="real-score-grid content-width">
                <article><span>A</span><p>Kalau Palatability-mu tinggi, pertanyaannya adalah apakah kamu masih bisa membuat seseorang kecewa tanpa langsung mengedit dirimu.</p></article>
                <article><span>B</span><p>Kalau Composure-mu tinggi, pertanyaannya adalah apakah kamu masih bisa memiliki emosi yang messy tanpa buru-buru mengubahnya menjadi analisis.</p></article>
                <article><span>C</span><p>Kalau Usefulness-mu tinggi, pertanyaannya adalah apakah kamu masih bisa menerima, beristirahat, dan hadir tanpa harus membuktikan manfaatmu.</p></article>
                <article><span>D</span><p>Kalau Legibility-mu tinggi, pertanyaannya adalah apakah kamu masih bisa menjadi undefined, berubah pikiran, mencoba sesuatu yang random, dan membiarkan hidupmu temporarily stop making sense.</p></article>
              </div>
              <div className="closing-copy content-width">
                <p>
                  Karena tujuan The Feral &amp; Fallow Season of the Self adalah
                  memastikan bahwa kualitas yang pernah membantumu bertahan,
                  berhasil, dicintai, dan diterima tetap menjadi tools yang bisa
                  kamu gunakan, alih-alih kontrak yang harus kamu patuhi.
                </p>
                <blockquote>
                  “How much of my behavioral range is still available to me when
                  approval is no longer guaranteed?”
                </blockquote>
              </div>
              <div className="page-actions content-width">
                <button className="text-button" onClick={() => moveTo(6)}>
                  <span aria-hidden="true">←</span> Kembali
                </button>
                <div className="action-group">
                  <button className="download-button" onClick={downloadReport}>
                    Download report <span aria-hidden="true">↓</span>
                  </button>
                  <button className="outline-button" onClick={restart}>
                    Ulangi scorecard
                  </button>
                </div>
              </div>
            </section>
          )}

          <footer className="site-footer">
            <span>© 2026 Pearling Lim. All Rights Reserved</span>
            <span>THE FOUR DOMESTICATIONS SCORECARD</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
