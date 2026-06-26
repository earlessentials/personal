"use client";

import { useEffect, useState } from "react";

const treasure = ["A strange note", "An unusual pearl", "A tiny message", "A hidden illustration"];
const paradoxes = [
  { question: "Can you become yourself while remaining shaped by what you inherited?", left: "I author myself.", right: "I am made by inheritance.", carry: "Identity is an inheritance re-signed in your own hand." },
  { question: "Should a good decision be optimized, or meaningful?", left: "Efficiency protects my energy.", right: "Meaning refuses the shortest route.", carry: "The best path is not always the fastest one, but it should know what it is protecting." },
  { question: "Does certainty help you live, or stop you from looking?", left: "Certainty lets me move.", right: "Wonder keeps me awake.", carry: "Borrow enough certainty to act, then return it before it hardens." },
];

function PearlCollector() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [target, setTarget] = useState({ x: 55, y: 45 });
  const [reward, setReward] = useState("");
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setTime((current) => {
      if (current <= 1) { setPlaying(false); setReward(treasure[Math.min(score, treasure.length - 1)]); return 0; }
      return current - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [playing, score]);
  function start() { setScore(0); setTime(20); setReward(""); setPlaying(true); }
  function collect() { if (!playing) return; setScore((current) => current + 1); setTarget({ x: 12 + Math.random() * 76, y: 15 + Math.random() * 68 }); }
  return <div className="arcade-game pearl-collector">
    <div className="game-head"><div><p className="kicker">Game 01 · collect</p><h2>Pearl Dive</h2></div><div className="game-stats"><span>Pearls <b>{score}</b></span><span>Current <b>{time}s</b></span></div></div>
    <div className="game-board" aria-label="Pearl Dive game board">
      <div className="game-rays" aria-hidden="true"/><div className="game-seaweed" aria-hidden="true"/>
      {playing ? <button className="game-pearl" style={{ left: `${target.x}%`, top: `${target.y}%` }} onClick={collect} aria-label="Collect pearl"><span/></button> : <div className="game-intro"><p>{reward || "Collect the wandering pearls before the current changes."}</p><button onClick={start}>{reward ? "Dive again" : "Begin the dive"}</button></div>}
      <div className="tiny-diver" aria-hidden="true"><i/><span>⌁</span></div>
    </div>
    <p className="game-help">Keyboard: Tab to the pearl, Enter or Space to collect. Touch: tap the pearl.</p>
    {playing && <button className="pause-game" onClick={() => setPlaying(false)}>Pause</button>}
  </div>;
}

function ParadoxGame() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<"left" | "right" | null>(null);
  const paradox = paradoxes[index];
  const next = () => { setIndex((current) => (current + 1) % paradoxes.length); setChoice(null); };
  return <div className="arcade-game paradox-game">
    <div className="game-head"><div><p className="kicker">Game 02 · philosophical</p><h2>The Two-Current Machine</h2></div><div className="game-stats"><span>Contradiction <b>{index + 1}/3</b></span></div></div>
    <div className="paradox-cabinet">
      <div className="paradox-dial" aria-hidden="true"><i/><span>HOLD</span></div>
      <article><p className="paradox-question">{paradox.question}</p><div className="current-choices"><button onClick={() => setChoice("left")} aria-pressed={choice === "left"}>{paradox.left}</button><span>AND</span><button onClick={() => setChoice("right")} aria-pressed={choice === "right"}>{paradox.right}</button></div>
      {choice && <div className="paradox-reveal" aria-live="polite"><small>The machine refuses to score you. Both currents remain true.</small><blockquote>{paradox.carry}</blockquote><button onClick={next}>Raise another paradox →</button></div>}</article>
    </div>
  </div>;
}

function CrabShuffle() {
  const [crab, setCrab] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const choose = (shell:number) => { if (selected !== null) return; setSelected(shell); if (shell === crab) setScore((current) => current + 1); };
  const next = () => { setCrab(Math.floor(Math.random() * 3)); setSelected(null); setRound((current) => current === 5 ? 1 : current + 1); };
  return <div className="arcade-game crab-shuffle">
    <div className="game-head"><div><p className="kicker">Game 03 · pure mischief</p><h2>Crab, Actually</h2></div><div className="game-stats"><span>Found <b>{score}</b></span><span>Round <b>{round}/5</b></span></div></div>
    <div className="shuffle-table"><p>The crab insists this is a game of strategy. It is mostly a game of crab.</p><div className="shuffle-shells">{[0,1,2].map((shell)=><button key={shell} className={selected === null ? "" : shell === crab ? "has-crab" : "is-empty"} onClick={() => choose(shell)} aria-label={`Lift shell ${shell + 1}`}><span className="shuffle-shell"><i/><i/><i/></span><b>{selected !== null && shell === crab ? "🦀" : "?"}</b></button>)}</div>
      {selected !== null && <div className="shuffle-result" aria-live="polite"><strong>{selected === crab ? "The crab respects you. Temporarily." : "The crab has outmaneuvered you."}</strong><button onClick={next}>{round === 5 ? "Play five more" : "Shuffle again"} →</button></div>}
    </div>
  </div>;
}

export function PearlDive() {
  const [game, setGame] = useState<"pearl" | "paradox" | "crab">("pearl");
  const cabinets = [
    { id: "pearl" as const, number: "01", title: "Pearl Dive", line: "Catch what glows." },
    { id: "paradox" as const, number: "02", title: "Two-Current Machine", line: "Choose. Then keep both." },
    { id: "crab" as const, number: "03", title: "Crab, Actually", line: "No wisdom. Only crab." },
  ];
  return <div className="coral-arcade">
    <div className="arcade-marquee"><span>✦</span><div><p className="kicker">Three cabinets below sea level</p><h2>Pearl Dive: Coral Arcade</h2><p>One useful game, one philosophical game, and one crab with suspicious confidence.</p></div><span>✦</span></div>
    <nav className="arcade-cabinets" aria-label="Choose an arcade game">{cabinets.map((cabinet)=><button key={cabinet.id} className={game === cabinet.id ? "active" : ""} onClick={() => setGame(cabinet.id)} aria-pressed={game === cabinet.id}><span>{cabinet.number}</span><i aria-hidden="true"/><strong>{cabinet.title}</strong><small>{cabinet.line}</small></button>)}</nav>
    <div className="arcade-stage">{game === "pearl" ? <PearlCollector/> : game === "paradox" ? <ParadoxGame/> : <CrabShuffle/>}</div>
  </div>;
}
