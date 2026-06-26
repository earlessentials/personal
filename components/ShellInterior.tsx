"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CompassMenu } from "./CompassMenu";
import { ShellArt } from "./MarineArt";
import { site } from "@/content/site";
import { assetPath, sitePath } from "@/lib/paths";

type WorldId = "thinker" | "strategist" | "explorer" | "builder" | "storyteller";

const worldMeta: Record<WorldId, { verb: string; environment: string; sound: string }> = {
  thinker: { verb: "Descend", environment: "The Cave of Returning Questions", sound: "Cave water" },
  strategist: { verb: "Examine", environment: "The Salt & Ink Café", sound: "Cove jazz" },
  explorer: { verb: "Navigate", environment: "The Unfinished Atlas", sound: "Wind and paper" },
  builder: { verb: "Assemble", environment: "The Coral Foundry", sound: "Workshop water" },
  storyteller: { verb: "Witness", environment: "The Nautilus Moving-Image House", sound: "Projector and sea" },
};

function ShellSound({ world }: { world: WorldId }) {
  const [on, setOn] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const jazzTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (jazzTimer.current !== null) window.clearInterval(jazzTimer.current);
    source.current?.stop();
    context.current?.close();
  }, []);
  const toggle = () => {
    if (on) {
      if (jazzTimer.current !== null) window.clearInterval(jazzTimer.current);
      jazzTimer.current = null;
      source.current?.stop();
      source.current = null;
      context.current?.close();
      context.current = null;
      setOn(false);
      return;
    }
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audio = new AudioCtor();
    const length = audio.sampleRate * 3;
    const buffer = audio.createBuffer(1, length, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < length; index++) data[index] = (Math.random() * 2 - 1) * .2;
    const ambience = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();
    filter.type = "lowpass";
    filter.frequency.value = { thinker: 300, strategist: 740, explorer: 920, builder: 520, storyteller: 430 }[world];
    gain.gain.value = .035;
    ambience.buffer = buffer;
    ambience.loop = true;
    ambience.connect(filter).connect(gain).connect(audio.destination);
    ambience.start();
    if (world === "strategist") {
      const chords = [[174.61,220,261.63,329.63],[146.83,196,233.08,293.66],[164.81,207.65,246.94,311.13],[130.81,174.61,220,261.63]];
      let chordIndex = 0;
      const playChord = () => {
        const now = audio.currentTime;
        chords[chordIndex].forEach((frequency, voice) => {
          const note = audio.createOscillator();
          const noteGain = audio.createGain();
          note.type = voice === 0 ? "sine" : "triangle";
          note.frequency.value = frequency;
          note.detune.value = voice * 2 - 3;
          noteGain.gain.setValueAtTime(.0001, now);
          noteGain.gain.exponentialRampToValueAtTime(voice === 0 ? .034 : .014, now + .08);
          noteGain.gain.exponentialRampToValueAtTime(.0001, now + 1.7);
          note.connect(noteGain).connect(audio.destination);
          note.start(now);
          note.stop(now + 1.75);
        });
        chordIndex = (chordIndex + 1) % chords.length;
      };
      playChord();
      jazzTimer.current = window.setInterval(playChord, 1850);
    }
    context.current = audio;
    source.current = ambience;
    setOn(true);
  };
  return <button className="shell-sound" onClick={toggle} aria-pressed={on}><i aria-hidden="true"/>{on ? "Quiet" : worldMeta[world].sound}</button>;
}

function WorldChrome({ world }: { world: WorldId }) {
  useEffect(() => {
    const update = () => document.documentElement.style.setProperty("--world-progress", `${window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)}`);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <>
    <a className="skip-link" href="#world-content">Skip to content</a>
    <Link className="world-return" href="/">← Return to Pearl&apos;s Cove</Link>
    <ShellSound world={world}/>
    <div className={`world-progress progress-${world}`} aria-hidden="true"><span/><i/></div>
    <div className={`entry-portal portal-${world}`} aria-hidden="true"><span/><i/><b/></div>
    <CompassMenu/>
  </>;
}

const coveShells = [
  { id: "thinker", title: "The Thinker", type: "nautilus" as const },
  { id: "strategist", title: "The Strategist", type: "conch" as const },
  { id: "builder", title: "The Builder", type: "clam" as const },
  { id: "storyteller", title: "The Storyteller", type: "scallop" as const },
  { id: "explorer", title: "The Explorer", type: "spiral" as const },
];

function WorldExit({ world }: { world: WorldId }) {
  return <section className={`world-exit ${world}-exit`} aria-labelledby={`${world}-exit-title`}>
    <div className="sand-shimmer" aria-hidden="true"/>
    <div className="exit-copy"><p className="world-kicker">Five shells, one cove</p><h2 id={`${world}-exit-title`}>Follow another shell</h2></div>
    <nav className="exit-shells" aria-label="Pearl's Cove worlds">{coveShells.map((shell) => <Link key={shell.id} href={`/worlds/${shell.id}`} aria-current={shell.id === world ? "page" : undefined}><ShellArt type={shell.type}/><span>{shell.title}</span>{shell.id === world && <small>You are here</small>}</Link>)}</nav>
    <Link className="environmental-return" href="/">Back to Pearl&apos;s Cove</Link>
  </section>;
}

function ThinkerInterior() {
  const standingSteps = [
    ["Name both currents", "State the two opposing truths in their strongest, most generous forms. Refuse the weak version of either."],
    ["Find the meeting line", "Locate the exact situation where they collide. A contradiction is vague in the abstract and sharp in a specific case."],
    ["Watch the wave hold", "Describe the shape their tension produces: the insight that exists only because both truths remain true at once."],
    ["Test the depth", "Push on each current. Note the conditions that flatten the wave and the conditions that keep it standing."],
    ["Mark the water", "Write one sentence a person can carry away that keeps both truths alive."],
  ];
  const loopStages = [
    ["Catch", "raw observation"],
    ["Crack", "invert it"],
    ["Core", "first principles"],
    ["Cross", "borrow domains"],
    ["Carry", "name + one open question"],
  ];
  return <main className="shell-interior thinker-interior" id="world-content">
    <WorldChrome world="thinker"/>
    <section className="thinker-hero question-observatory world-hero" aria-labelledby="thinker-title">
      <div className="observatory-water" aria-hidden="true"><i/><i/><i/></div>
      <div className="question-orbit" aria-hidden="true"><span>?</span><i/><i/><i/><i/></div>
      <div className="thought-shelves" aria-hidden="true"><b>ASSUMPTIONS</b><b>CONTRADICTIONS</b><b>ROOTS</b><b>WONDER</b></div>
      <div className="lantern-snail" aria-hidden="true"><i/><b>✦</b></div><div className="glow-fish" aria-hidden="true"><i/><i/><i/></div>
      <div className="hero-ledger"><p className="world-kicker">The chamber of unanswered things</p><h1 id="thinker-title">The Thinker</h1><p className="world-subtitle">Ideas worth sitting with.</p><a href="#thinker-room-title">Sit with a question <span aria-hidden="true">↓</span></a></div>
    </section>

    <section className="thinker-introduction" aria-labelledby="thinker-room-title"><figure><img src={assetPath("/media/photoshoot/portrait-2664.jpg")} alt="Pearling reading a letter"/><figcaption>Questions before conclusions.</figcaption></figure><article><p className="world-kicker">The philosopher&apos;s room</p><h2 id="thinker-room-title">The Thinker is the philosopher&apos;s room of the index.</h2><p>I love examining assumptions, holding contradictions without rushing to settle them, tracing ideas back to their roots, and staying with a question long enough to learn what it wants.</p><p>Essays, dialogues, slow arguments, and reflections gather here, each one a small practice in looking closely at how we know, what we value, and why we believe.</p><blockquote>“Sometimes, asking a better question changes everything.”</blockquote></article></section>

    <section className="book-chamber" aria-labelledby="thinker-book"><div className="light-shaft" aria-hidden="true"/><div className="stone-pedestal"><img className="thinker-book-cover" src={assetPath("/media/exist-while-existing-cover.png")} alt="Exist Beyond Existing book cover"/><span className="jelly-lamp">◌</span><span className="reading-glasses">∞</span></div><article><p className="world-kicker">The book I wrote</p><h2 id="thinker-book">Exist Beyond Existing</h2><h3>An experiential epistemology of knowing, becoming, and being</h3><p className="book-question">What if the search for meaning is the very thing keeping you from truly living?</p><h4>What it is</h4><p>A philosophical and literary exploration of how knowledge is formed through lived experience rather than explanation.</p><p>It examines the subtle transitions between knowing, becoming, and being: the moments when understanding gives way to presence, and insight is no longer something to acquire, but something to inhabit.</p><h4>What it does and refuses to do</h4><p>The book traces how meaning appears through attention, limitation, uncertainty, and time. It asks what remains when identity loosens, when purpose no longer organises life, and when awareness is no longer something to perform.</p><h4>Who it is for</h4><p>Drawing from existential philosophy, phenomenology, and contemplative inquiry, it speaks to readers who have outgrown instruction and are no longer seeking answers, but coherence to those who sense that life is not meant to be solved, but lived with clarity and restraint.</p><p>A meditation on staying with experience, ambiguity, and being itself.</p><a className="thinker-cta" href="https://www.amazon.com/Exist-Beyond-Existing-Pearling-Lim-ebook/dp/B0GHZDZYDF" target="_blank" rel="noreferrer">Grab a copy <span aria-hidden="true">↗</span></a></article></section>

    <section className="framework-forge" aria-labelledby="forge-title"><header><p className="world-kicker">Frameworks</p><h2 id="forge-title">My own instruments for thinking</h2><p>Built for a single question and kept only after they survive real use.</p></header><div className="standing-instrument"><div className="standing-intro"><p className="world-kicker">Instrument one</p><h3>The Standing Wave</h3><p>A method for thinking with a contradiction instead of resolving it too early. Where two currents meet, water holds a single stable shape. The most durable ideas are standing waves. They stay upright only because two opposing truths keep pushing.</p></div><h3>How to raise a standing wave</h3><ol>{standingSteps.map(([title,copy],index)=><li key={title}><b>{index+1}</b><div><h4>{title}</h4><p>{copy}</p></div></li>)}</ol></div></section>

    <section className="standing-pool" aria-labelledby="pool-title"><header><p className="world-kicker">A worked standing wave</p><h2 id="pool-title">Two currents, one durable idea</h2></header><div className="current current-a"><p><strong>Current A</strong>A person becomes themselves by choosing.</p></div><div className="current current-b"><p><strong>Current B</strong>A person is largely made by what they inherited.</p></div><div className="held-wave" aria-hidden="true"><i/><i/><i/></div><div className="pool-notes"><p><strong>Meeting line</strong>The moment someone claims a value they were raised inside.</p><p><strong>The wave</strong>Identity is an inheritance re-signed in your own hand.</p><p><strong>Carry sentence</strong>You author yourself by deciding which gifts to keep.</p></div><p className="standing-afterthought">Other instruments are still unnamed on the bench. Each earns a name only after it survives a real question.</p></section>

    <section className="conch-spiral-room" aria-labelledby="spiral-title"><header><p className="world-kicker">Instrument two</p><h2 id="spiral-title">Catch–Crack–Core–Cross–Carry</h2></header><div className="thinker-linear-flow" aria-label="Catch Crack Core Cross Carry flowchart">{loopStages.map(([title,copy],index)=><div key={title}><span>{index+1}</span><strong>{title}</strong><small>{copy}</small>{index < loopStages.length-1 && <i aria-hidden="true">→</i>}</div>)}<em>The open question becomes the next Catch</em></div><article className="loop-example"><p className="world-kicker">Worked example</p><dl><div><dt>Catch</dt><dd>“I focus far better in a noisy café than in my silent apartment.”</dd></div><div><dt>Crack</dt><dd>If silence caused focus, libraries would beat cafés for me. They do not. So silence is not the active ingredient.</dd></div><div><dt>Core</dt><dd>What is mechanically true? In a café, I am mildly observed and cannot easily leave. Two forces are present: Gentle social presence + friction to quit</dd></div><div><dt>Cross</dt><dd>Gyms: when others are present, you push harder. Writing groups: social deadlines hold when private ones might be skipped. Open kitchens: chefs work more carefully under observation.</dd></div><div><dt>Carry</dt><dd>Model named: Ambient Accountability. Low-grade, anonymous witness raises baseline effort. Open question: Does it stop working once the witnesses become familiar?</dd></div></dl></article></section>

    <section className="mental-models" aria-labelledby="models-title"><header><p className="world-kicker">Mental Models I Actually Use</p><h2 id="models-title">The handful I reach for without thinking.</h2></header><div><article><span>01</span><h3>The Gap Test</h3><p>Would future-me describe this in moments, or in invoices?</p><small>My fastest decision filter.</small></article><article><span>02</span><h3>Inheritance, re-signed</h3><p>Identity is a gift you decide whether to keep. You author yourself by choosing which inheritances to sign in your own hand.</p></article><article><span>03</span><h3>The interesting over the important</h3><p>Importance is loud and usually someone else&apos;s. Interesting is quiet and yours.</p></article></div></section>

    <section className="gap-chamber" aria-labelledby="gap-title"><header><p className="world-kicker">A concept I keep returning to</p><h2 id="gap-title">The Existence Gap</h2><p>The distance between being alive and being present to your own life. Everyone has one. The work is not to close it forever, that is impossible. It is to notice when it quietly widens.</p></header><div className="existence-flow" aria-label="The Existence Gap flowchart"><div><strong>You, existing</strong><small>Habit · autopilot · survival</small></div><span>the gap</span><div><strong>You, actually here</strong><small>Attention · choice · meaning</small></div><i>notice the gap</i></div><div className="gap-signs"><h3>How to spot yours</h3><p>You can describe your week in tasks, but not in moments.</p><p>You feel busy and unspent at the same time.</p><p>Someone asks how you are, and you answer with your calendar.</p></div></section>

    <section className="thinker-essays" aria-labelledby="essays-title"><header><p className="world-kicker">Essays · Long-form writing</p><h2 id="essays-title">Thinking that earned more than a paragraph.</h2></header><div>{[{title:"Everything is a perspective if your goal is to expand.",url:"https://substack.com/home/post/p-199560831",image:"/media/essays/everything-is-a-perspective.jpg"},{title:"No one is above the program",url:"https://substack.com/home/post/p-199407391",image:"/media/essays/no-one-is-above-the-program.jpg"},{title:"Being fully human",url:"https://open.substack.com/pub/pearling/p/being-fully-human?r=7wq1rf&utm_medium=ios",image:"/media/essays/being-fully-human.jpg"}].map((essay,index)=><a key={essay.title} href={essay.url} target="_blank" rel="noreferrer"><span>0{index+1}</span><img src={assetPath(essay.image)} alt=""/><h3>{essay.title}</h3><small>Read the essay ↗</small></a>)}</div><aside>Yes, I call myself a modern-time philosopher, which mostly means I get paid in ideas and hold alarming opinions about the word authenticity at dinner parties.<br/><strong>Apologies in advance.</strong></aside></section>
    <WorldExit world="thinker"/>
    <footer className="world-footer">{site.copyright}</footer>
  </main>;
}

function StrategistInterior() {
  const [visitorName, setVisitorName] = useState("");
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (entered) return;
    const bodyOverflow = document.body.style.overflow;
    const pageOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = pageOverflow;
    };
  }, [entered]);
  const guestSignals = ["You know too much and struggle to explain it simply.","Your positioning changes every few months.","Your marketing feels random instead of compounding.","You're building with AI but aren't sure what should stay human.","You have plenty of ideas but no system for turning them into products.","You're looking for strategy instead of hacks."];
  const beliefs = ["AI makes execution cheaper. Judgment becomes expensive.","Strategy is subtraction before addition.","Positioning begins with lived experience.","Complexity impresses people. Simplicity gets remembered.","Systems beat motivation.","Curiosity compounds faster than certainty.","Constraints often hide your greatest competitive advantage."];
  const oysterStages = [["Grit","Name the irritant with surgical precision."],["Secrete","Find the smallest repeatable response to that exact friction."],["Layer","Compound those responses into a system that runs without you."],["Luster","Sharpen the system into a position and a one-line message."],["Release","Ship it. The market tells you what it's worth and reveals the next grit."]];
  const strategyMenu = [
    {title:"What’s Really Changed in 2026?",url:"https://www.storyempowers.com/p/what-s-really-changed-in-2026",image:"/media/strategist/menu/changed-2026.avif"},
    {title:"How to Turn LinkedIn into a Passive-Active Income Machine (Without Guesswork)",subtitle:"For experienced coaches, consultants, and freelancers.",url:"https://www.storyempowers.com/p/how-to-turn-linkedin-into-a-passive-active-income-machine-without-guesswork",image:"/media/strategist/menu/linkedin-income.avif"},
    {title:"Authority-Building on Linkedin (and beyond)",url:"https://www.storyempowers.com/p/authority-building-on-linkedin-and-beyond",image:"/media/strategist/menu/authority-building.avif"},
    {title:"The Autonomous Age",subtitle:"Why 2026 belongs to businesses that design for AI and govern it?",url:"https://www.storyempowers.com/p/the-autonomous-age",image:"/media/strategist/menu/autonomous-age.avif"},
  ];
  const strategyLenses = [
    {label:"The complaint",question:"What do people keep tolerating out loud?",signal:"Repeated irritation is unclaimed demand."},
    {label:"The blind spot",question:"What does the category treat as inevitable?",signal:"What everyone accepts is often where position lives."},
    {label:"The lived edge",question:"What can you name because you have survived it?",signal:"Experience becomes authority competitors cannot borrow."},
    {label:"The smallest move",question:"What can reality score this week?",signal:"A reversible test beats a beautiful theory."},
  ];
  const currentExplorations = [
    {title:"AI-native businesses",copy:"If AI can build almost everything, what becomes the true source of competitive advantage? If AI removes the cost of execution, is business ultimately just a reflection of human taste and judgment?",suit:"A"},
    {title:"Decision architecture",copy:"Is the best decision always the right decision? When every decision can be optimized, how do we preserve the freedom to choose what is meaningful instead of merely efficient?",suit:"D"},
    {title:"Human-AI collaboration",copy:"If AI becomes your smartest collaborator, what uniquely human qualities become even more valuable? Does intelligence become more valuable or less valuable, when everyone has access to it? If machines become extensions of our intelligence, what parts of ourselves should never be outsourced?",suit:"H"},
    {title:"Authority in the autonomous age",copy:"What creates trust when knowledge is no longer scarce? Will authority come from knowing more, or from seeing differently?",suit:"A"},
    {title:"AI Experimentation",copy:"Is the future built by those who know the most, or by those willing to test what no one else dares to try?",suit:"E"},
  ];
  const [strategyLensIndex, setStrategyLensIndex] = useState(0);
  const [activeExploration, setActiveExploration] = useState<number | null>(0);
  const activeLens = strategyLenses[strategyLensIndex];
  return <main className="shell-interior strategist-interior" id="world-content">
    <div className={`cafe-access-gate ${entered ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="cafe-gate-title"><i className="gate-panel gate-panel-left" aria-hidden="true"/><i className="gate-panel gate-panel-right" aria-hidden="true"/><form onSubmit={(event) => { event.preventDefault(); if (visitorName.trim()) setEntered(true); }}><p className="cafe-name" id="cafe-gate-title">The Strategist Le Cafe by Pearling</p><label htmlFor="strategist-guest-name">To enter this exclusive café, please enter your name:</label><input id="strategist-guest-name" name="guestName" value={visitorName} onChange={(event) => setVisitorName(event.target.value)} autoComplete="name" autoFocus required/><button type="submit">Enter the café</button></form></div>
    <div className={`strategist-cafe-content ${entered ? "is-accessible" : ""}`} aria-hidden={!entered}>
    <WorldChrome world="strategist"/>
    <section className="cafe-exterior world-hero" aria-labelledby="strategist-title"><div className="cove-cafe-scene" aria-hidden="true"><div className="cafe-sun"><i/></div><div className="cafe-sea"><i/><i/><i/></div><div className="cafe-cliff cliff-left"/><div className="cafe-cliff cliff-right"/><div className="cafe-house"><div className="cafe-awning"><i/><i/><i/><i/><i/></div><div className="cafe-window"><span className="jazz-piano"/><span className="jazz-bass"/><span className="jazz-sax">♪</span></div><div className="cafe-lanterns"><i/><i/><i/></div><div className="cafe-sign">The Strategist<br/><small>Le Café by Pearling</small></div></div><div className="cafe-terrace"><i/><i/><i/><i/></div><div className="cafe-notes"><i>♪</i><i>♩</i><i>♫</i></div><div className="cafe-sailboat"><i/></div></div><div className="cafe-warmth"><p className="cafe-now-playing">Now playing · original cove jazz</p><h1 id="strategist-title">The Strategist</h1><p className="world-subtitle">Every outcome has a pattern.</p>{entered && visitorName && <p className="cafe-welcome">Welcome, {visitorName}. Your table is ready.</p>}</div><div className="crab-server" aria-hidden="true"><i/><span>●</span></div></section>
    <section className="strategist-intro" aria-labelledby="strategist-intro-title"><div className="intro-cafe-copy"><p className="world-kicker">A table for the difficult middle</p><h2 id="strategist-intro-title">Ideas are abundant.<br/>Execution is rare.</h2><p>This world transforms complexity into practical systems that move people, businesses, and ideas forward.</p><blockquote>I believe strategy begins with understanding friction.</blockquote><p>Every business, creator, founder, and idea carries a piece of grit:</p><ul><li>something customers complain about</li><li>something competitors ignore</li><li>something you secretly wish existed</li></ul><p><strong>That&apos;s where leverage lives.</strong></p><p>Everything you&apos;ll find on this page comes from that belief.</p></div><figure><img src={assetPath("/media/photoshoot/portrait-2666.jpg")} alt="Pearling Lim at The Strategist café"/><figcaption>Strategy begins with the grit.</figcaption></figure></section>

    <section className="cafe-manifesto" aria-labelledby="manifesto-title"><header><p className="world-kicker">Your table, my house rules</p><h2 id="manifesto-title">Order what you need. Keep what you believe.</h2></header><div className="manifesto-spread"><article className="guest-order"><div className="receipt-pin" aria-hidden="true"/><p className="manifesto-label">If you&apos;re one of these people...</p><h3>You might enjoy this corner of the internet if:</h3><ol>{guestSignals.map((item,index)=><li key={item}><span>{String(index+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ol><small>One table · no hacks · good questions welcome</small></article><article className="belief-board"><p className="manifesto-label">Things I Believe</p><div>{beliefs.map((belief,index)=><blockquote key={belief} style={{"--belief":index} as React.CSSProperties}><span>{String(index+1).padStart(2,"0")}</span>{belief}</blockquote>)}</div><i className="chalk-pearl" aria-hidden="true"/></article></div><div className="manifesto-crockery" aria-hidden="true"><i/><i/><i/></div></section>

    <section className="friction-console" aria-labelledby="friction-console-title"><header><p className="world-kicker">A live strategy instrument</p><h2 id="friction-console-title">Turn the friction. Find the leverage.</h2><p>Most strategy sessions begin with an answer. This one begins by changing the angle of the question.</p></header><div className="friction-instrument"><button type="button" onClick={() => setStrategyLensIndex((strategyLensIndex + 1) % strategyLenses.length)} aria-label="Turn to the next strategic lens"><span>{String(strategyLensIndex+1).padStart(2,"0")}</span><i aria-hidden="true"/><small>Turn the brass lens</small></button><article key={activeLens.label} aria-live="polite"><p>{activeLens.label}</p><h3>{activeLens.question}</h3><blockquote>{activeLens.signal}</blockquote></article></div><ol>{strategyLenses.map((lens,index)=><li key={lens.label} className={index===strategyLensIndex ? "is-active" : ""}><button type="button" onClick={() => setStrategyLensIndex(index)} aria-pressed={index===strategyLensIndex}><span>{String(index+1).padStart(2,"0")}</span>{lens.label}</button></li>)}</ol></section>

    <section className="oyster-engine strategist-oyster" aria-labelledby="engine-title"><header><p className="world-kicker">The signature instrument</p><h2 id="engine-title">The Oyster Engine</h2><blockquote>Turn the irritation into the pearl.</blockquote><h3>The problem it solves</h3><p>Strategy usually starts by chasing opportunity. The Oyster Engine starts somewhere truer: the irritant.</p><p>An oyster cannot remove the grit lodged inside it, so it does the only thing it can, it coats the grit, layer by layer, until the very thing that hurt becomes the thing of value.</p><p>This is a framework for turning a constraint, complaint, or friction into positioning and momentum.</p></header><div className="oyster-flow" aria-label="The Oyster Engine flowchart">{oysterStages.map(([title,copy],index)=><article key={title}><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p>{index<oysterStages.length-1&&<i aria-hidden="true">→</i>}</article>)}<em>New grit revealed by the market loops back to Grit.</em></div></section>

    <section className="mara-case" aria-labelledby="mara-title"><header><p className="world-kicker">Worked Example</p><h2 id="mara-title">Mara × Burst</h2><p><strong>The Founder:</strong> Mara, an ADHD software engineer who quit her job because every project tool on earth assumed she had a linear brain. She&apos;s building Burst, a planning tool for people who think in spikes.</p></header><div className="mara-example-stage"><figure className="mara-character"><img src={assetPath("/media/strategist/mara-mermaid-coder.png")} alt="Mara, a mermaid software engineer, coding Burst on a pearl-lit laptop"/><figcaption><strong>Mara</strong><span>Founder · mermaid coder · nonlinear brain</span></figcaption></figure><div className="mara-grid"><article><span>01 · Grit</span><h3>Name the irritant with surgical precision</h3><small>Don&apos;t say “productivity is broken.” Find the exact splinter.</small><p>“Every task manager punishes me for how my brain actually works. They reward steady daily streaks, so the moment I miss a day, the app guilt-trips me and I abandon it. The problem isn&apos;t my discipline. It&apos;s that the tool is built for consistency, and my brain runs on intensity.”</p></article><article><span>02 · Secrete</span><h3>Smallest repeatable response to that exact friction</h3><small>The tiniest thing she did once that worked, that she can do again.</small><p>She started capturing tasks in 20-minute “brain dumps” during hyperfocus spikes, then ignoring them entirely until the next spike. No daily check-ins, no streaks. Just: catch the wave when it comes, let it go when it doesn&apos;t. One repeatable ritual: dump fast, surface later.</p></article><article><span>03 · Layer</span><h3>Compound responses into a system that runs without you</h3><small>Stack the small responses until the thing works while she sleeps.</small><p>Burst auto-detects her active windows and only surfaces tasks during them. Missed days literally don&apos;t exist in the UI, there are no streaks to break. An “energy-aware” engine resurfaces the right task at the right spike. The system now runs whether or not Mara shows up that day.</p></article><article><span>04 · Luster</span><h3>Sharpen into a position + one-line message</h3><small>File it down to a single edge no competitor can claim.</small><p><strong>Position:</strong> The only planner that rewards intensity instead of punishing inconsistency.</p><p><strong>One-liner:</strong> “Burst is built for brains that spike, not brains that grind.”</p></article><article><span>05 · Release</span><h3>Ship it; market names its worth + the next grit</h3><small>Put it out, read the signal, find the next splinter.</small><p>She ships to 200 ADHD founders and devs. The signal back: they want it to talk to their calendar so spikes get protected, not just tracked.</p><p><strong>Next grit:</strong> “My best work window is the one everyone else books meetings over.” → the loop begins again.</p></article></div></div><aside><strong>Why this one&apos;s unique:</strong> the irritant (streaks punish spiky brains) is something Mara can name with total authority because she lives it which is exactly what makes the position uncopyable. A competitor can clone the features, but they can&apos;t clone the grit.</aside></section>

    <section className="decision-maps" aria-labelledby="decision-title"><header><p className="world-kicker">Decision Maps</p><h2 id="decision-title">Fast doors, slow doors, reality in the middle.</h2></header><div className="decision-flow" aria-label="Decision map flowchart"><svg viewBox="0 0 1000 820" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="decision-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs></svg><article className="decision-node decision-start">The real problem</article><article className="decision-node decision-diamond">Reversible?</article><span className="decision-label label-yes">Yes</span><span className="decision-label label-no">No</span><article className="decision-node decision-fast">Decide fast, learn faster</article><article className="decision-node decision-slow">Slow down, widen the lens</article><article className="decision-node decision-watch">Watch what reality says</article><article className="decision-node decision-update">Update the map</article><i className="decision-token" aria-hidden="true">●</i></div><div className="decision-notes"><article><h3>The real problem</h3><p>The Release-stage signal: users don&apos;t want it cheaper, they want spikes protected. Her own grit too: “my best window is the one everyone books over.”</p></article><article><h3>Reversible?</h3><p>The gate that sorts the decision. A feature toggle is cheap to pull back, while a repositioning is not.</p></article><article><h3>Yes → Decide fast</h3><p>Spike-protection is a reversible bet, ship a scrappy version now, let real usage teach her.</p></article><article><h3>No → Slow down</h3><p>“Become a team tool” is a one-way door (new buyers, new pricing, new identity). That one gets the wide lens, not a fast yes.</p></article><article><h3>Watch what reality says</h3><p>Both paths converge here: the market scores the move.</p></article><article><h3>Update the map</h3><p>Reality&apos;s verdict feeds back in, which is exactly the Oyster Engine&apos;s Release loop handing her the next grit.</p></article></div></section>

    <section className="copy-clinic strategist-clinic" aria-labelledby="clinic-title"><header><p className="world-kicker">Copy Clinic</p><h2 id="clinic-title">Got a copy that isn&apos;t converting?</h2><p>Send me 3 pieces of your copy: emails, landing pages, ads, LinkedIn posts, or anything else and I&apos;ll review them with actionable feedback to help you write clearer, stronger, and more persuasive copy.</p><a href="https://topmate.io/pearling/2170086" target="_blank" rel="noreferrer">Access my mini copy clinic <span aria-hidden="true">↗</span></a></header><div className="clinic-receipt" aria-hidden="true"><span>01 · DIAGNOSE</span><span>02 · CLARIFY</span><span>03 · CONVERT</span><b>Actionable feedback, served warm.</b></div></section>

    <section className="strategy-library" aria-labelledby="strategy-menu-title"><header><p className="world-kicker">The Strategy Menu</p><h2 id="strategy-menu-title">Four ideas currently being served.</h2></header><div>{strategyMenu.map((item,index)=><a key={item.url} href={item.url} target="_blank" rel="noreferrer"><span>{String(index+1).padStart(2,"0")}</span><img src={assetPath(item.image)} alt={`${item.title} article artwork`}/><h3>{item.title}</h3>{item.subtitle&&<p>{item.subtitle}</p>}<small>Read the strategy ↗</small></a>)}</div></section>

    <section className="strategy-session" aria-labelledby="session-title"><div className="serious-strategist-motion cat-strategist-motion" aria-hidden="true"><div className="strategy-scan"><i/><i/><i/></div><figure><img src={assetPath("/media/strategist/pearling-with-cat.jpg")} alt=""/></figure><span className="serious-caption">Strategy, supervised by the cat</span><div className="orbiting-notes"><i>PATTERN</i><i>SIGNAL</i><i>DECISION</i></div><div className="focus-cursor">+</div></div><article><p className="world-kicker">One conversation, no judgment</p><h2 id="session-title">What if one conversation could save you months of trial, error, and Googling at 2 a.m.?</h2><p>For $259, you get me, your strategy, and zero judgment about the 47 tabs you currently have open. In one call, we untangle the mess in your head, map out what actually matters, and hand you a plan that doesn&apos;t require a midnight existential crisis to execute. You can consider it as a shortcut that&apos;s fully legal and surprisingly affordable for your biz + strategy.</p><p>If we decide to keep building together, it gets waived as part of the package (basically free, retroactively, like a coupon from your future self). If you&apos;d rather take the wheel solo? No string attached. The very next day, you&apos;ll get a written copy of everything we covered, plus a tidy list of constructive things you can run with on your own.</p><p>Either way, you walk away smarter than you came in, which, let&apos;s be honest, beats another 2 a.m. date with the search bar. Ayeee!</p><a href="https://topmate.io/pearling/1077676?utm_source=public_profile&utm_campaign=pearling" target="_blank" rel="noreferrer">Book your session <span aria-hidden="true">↗</span></a></article></section>

    <section className="oops-case" aria-labelledby="oops-title"><header><p className="world-kicker">A case study of myself</p><h2 id="oops-title">The “Oops, I Built a Business” Strategy Breakdown of @heypearling.</h2><p>It all started with a little TikTok page called @heypearling.</p></header><div className="oops-stage"><div className="oops-core" aria-hidden="true"><span>CURIOSITY</span><i/><b>@heypearling</b></div><div className="oops-steps"><article><span>01</span><h3>Create a Curiosity Buffet</h3><p>Instead of boxing myself into one topic, I shared everything numinous: psychology, spirituality, Human Design, relationships, mindset, business, random life observations... basically a buffet for curious people who like expanding their perspective.</p></article><article><span>02</span><h3>Let People Vote With Their Curiosity</h3><p>I paid attention to what people naturally wanted more of instead of deciding for them. Human Design quickly became the thing people kept asking about, so I followed the breadcrumbs.</p></article><article><span>03</span><h3>Go All In</h3><p>Once I saw the interest, I invested heavily in learning, completing Human Design training, advanced trainings, and continuing my education so I could actually know what I was talking about (highly recommended). The deeper I learned, the more valuable my content became, and eventually an entire Human Design business grew from it.</p></article><article><span>04</span><h3>Keep the Flywheel Turning</h3><p>Share what you learn. Listen to your audience. Learn more. Share better. Repeat.</p></article></div></div><div className="curiosity-flywheel" aria-label="The curiosity flywheel"><span>Share</span><i>→</i><span>Listen</span><i>→</i><span>Learn</span><i>→</i><span>Share better</span></div><blockquote>The TikTok page eventually expanded to Instagram, but the philosophy stayed the same: create content that makes people think, feel, question, and see life differently.</blockquote><div className="curiosity-strategy-seal"><span>Curiosity was</span><strong>THE STRATEGY.</strong></div><a className="human-design-route" href={sitePath("/worlds/explorer/#human-design")}>Follow the Human Design rabbit hole <span aria-hidden="true">→</span></a></section>

    <section className="strategist-current" aria-labelledby="strategist-current-title"><header><p className="world-kicker">Currently Thinking About</p><h2 id="strategist-current-title">Things I&apos;m actively exploring</h2><p>Five live questions. Pick a card and turn it over.</p></header><div className="exploration-deck">{currentExplorations.map((topic,index)=><article key={topic.title} className={activeExploration===index ? "is-open" : ""} style={{"--card":index} as React.CSSProperties}><button type="button" onClick={() => setActiveExploration(activeExploration===index ? null : index)} aria-pressed={activeExploration===index}><span className="card-face"><b>{String(index+1).padStart(2,"0")}</b><i>{topic.suit}</i><h3>{topic.title}</h3><small>Turn the card</small></span><span className="card-back"><b>{topic.title}</b><span>{topic.copy}</span><small>Turn it back</small></span></button></article>)}</div></section>

    <section className="strategist-turtle-mail" aria-labelledby="strategist-mail-title"><div className="mail-turtle" aria-hidden="true"><i/><i/><span>✉</span></div><article><p className="world-kicker">The last table</p><h2 id="strategist-mail-title">Turn the insight into something real.</h2><p>If something on this page helped you see your business differently, then it already did its job.</p><p>If you&apos;d like help turning that insight into something real, I&apos;m one conversation away.</p><a href={sitePath("/contact/")}>Find the turtle mail <span aria-hidden="true">→</span></a></article></section>
    <WorldExit world="strategist"/>
    <footer className="world-footer">{site.copyright}</footer>
    </div>
  </main>;
}

function ExplorerInterior() {
  const questions = [
    "If everything you think you know, including logic itself, must be justified by using logic, how can you ever know that your way of knowing is actually trustworthy?",
    "What would you do tomorrow if you were certain you could not fail, and what does your hesitation to answer honestly tell you about what you are actually afraid of?",
    "Are you free, or have you simply learned to want the cage you were given?",
    "What is the difference between the life you are living and the life you would defend to the death, and why is there a gap at all?",
    "If you stopped performing the person you think you should be, who would be left, and could you stand to meet them?",
    "You will die. Knowing this changes nothing about the fact and everything about the day, so why do you keep living as if you forgot?",
    "Do you love people, or do you love the way people make you feel about yourself?",
    "If being good required that no one ever knew you were good, would you still want to be good as badly as you do now?",
    "Is forgiveness something you give to the other person, or something you steal back for yourself?",
    "How responsible are you for the suffering you could prevent but choose not to see?",
    "If you could feel, for one hour, the full inner life of someone you have dismissed, their fear, their reasons, their private dignity, how many of your judgments would survive the hour?",
    "What is a belief you hold so deeply that you have never once tested it, and what are you protecting by not testing it?",
    "If understanding a thing completely would destroy your love for it, do you have a right to demand the truth?",
    "How much of what you call thinking is actually just rearranging things other people thought first?",
    "Could there be truths your mind is structurally incapable of perceiving, the way a dog cannot perceive irony, and how would you ever know?",
    "When you change your mind, did you discover you were wrong, or did you simply become a different person who needed a different belief?",
    "If meaning is something you assign rather than something you find, why does assigned meaning still feel hollow when you do it on purpose?",
    "Would you live your exact life infinitely, in perfect repetition, and if not, what specifically would you need to change to say yes?",
    "Is the goal of life to arrive somewhere, or is arriving the quiet death of the only thing that made you feel alive: the wanting?",
    "If you knew no one would ever remember you, which of your current ambitions would instantly look absurd, and which would survive?",
    "Are you spending your life, or is your life spending you?",
    "If every cell, belief, and memory in you has been replaced over your life, what is the thing that has been continuous enough to call you, and would that thing survive if you stopped believing in it?",
    "Are you the author of your thoughts, or merely the first audience to watch them arrive?",
    "If you could see a perfectly honest list of your true motives behind every selfless act you have ever done, would you become a better person or just a more careful liar?",
    "Which version of you is the real one: who you are alone, who you are with others, or who you are in the gap between the two?",
    "If you had to delete one memory to keep the rest, what would the act of choosing reveal about what you think you are for?",
  ];
  const [questionIndex, setQuestionIndex] = useState(0);
  const revealAnother = () => setQuestionIndex((current) => (current + 1 + Math.floor(Math.random() * (questions.length - 1))) % questions.length);
  return <main className="shell-interior explorer-interior" id="world-content">
    <WorldChrome world="explorer"/>
    <section className="atlas-opening explorer-curiosity-port world-hero" aria-labelledby="explorer-title"><div className="atlas-sky" aria-hidden="true"><i/><i/><i/></div><div className="folded-map-theatre" aria-hidden="true"><div className="map-fold fold-one"><span>WHY?</span><b/></div><div className="map-fold fold-two"><span>WHAT IF</span><b/></div><div className="map-fold fold-three"><span>FOLLOW IT</span><b/></div><div className="map-thread"><i/><i/><i/><i/></div></div><div className="curiosity-boat" aria-hidden="true"><span/><i/><b>?</b></div><div className="atlas-title"><p className="world-kicker">The field notebook is alive</p><h1 id="explorer-title">The Explorer</h1><p className="world-subtitle">Curiosity has no destination.</p><a href="#explorer-intro-title">Begin wandering <span aria-hidden="true">↓</span></a></div><div className="cartographer-gull" aria-hidden="true"><i/><span>⌁</span></div></section>

    <section className="explorer-introduction" aria-labelledby="explorer-intro-title"><article><p className="world-kicker">The field notebook</p><h2 id="explorer-intro-title">How I turn aimless wandering into discoveries I can keep.</h2><p>The Explorer is the field notebook of the index.</p><p>I collect questions the way some people collect souvenirs. Most begin as passing curiosities, become rabbit holes, then quietly return months later as ideas, frameworks, products, or completely different ways of seeing.</p><p>I explore to notice more. Every expedition begins with a question. Every expedition should return with a map.</p></article><figure><img src={assetPath("/media/explorer/photoshoot-new.jpg")} alt="Pearling looking back toward the camera"/><figcaption>Field note: look back before moving on.</figcaption></figure></section>

    <section className="auger-instrument" aria-labelledby="auger-title"><header><p className="world-kicker">The signature instrument</p><h2 id="auger-title">The Auger Spiral</h2><p className="auger-tagline">Drill deep without losing the surface.</p></header><div className="auger-problem"><h3>The problem it solves</h3><p>Curiosity has two common failure modes.</p><p>You either stay shallow, skim ten tabs and learn nothing. Or you disappear into a rabbit hole and surface three hours later with no idea how you got there.</p><p>The Auger Spiral is a framework for drilling deep into curiosity while keeping a tether to the surface, so every descent returns with something worth keeping.</p></div><div className="auger-flow" aria-label="The Auger Spiral flowchart"><span><strong>Anchor</strong><small>Seed question + why it tugs</small></span><i>→</i><span><strong>Descend</strong><small>Ask: what is beneath this?</small></span><i>→</i><span className="auger-choice"><strong>Every three layers</strong><small>Surface + log one keepable insight</small><small>A tangent appears: Branch</small></span><i>→</i><span><strong>Surface</strong><small>Return with a map</small></span></div><div className="auger-notes">{[["Anchor","Write the seed question and why it tugs at you. The why is your rope back to the surface."],["Descend","Go one layer at a time. Every layer asks a single question: What is beneath this?"],["Tether","Every three layers, surface for air. Write one keepable insight in plain language. Stops curiosity becoming confusion."],["Branch","When a tempting tangent appears, park it in a side-channel instead of chasing it immediately. The goal is to remember where you were going."],["Surface","Return with a map: Seed question → discoveries → the new questions you earned."]].map(([title,copy],index)=><article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <section className="expedition-route" aria-labelledby="route-title"><header><p className="world-kicker">The recurring expedition</p><h2 id="route-title">Every discovery earns a new question.</h2></header><div className="route-line">{["A question","Gather sources","Extract insights","Connect to other fields","Unexpected discovery","New open questions"].map((item,index)=><article key={item}><span>{index+1}</span><p>{item}</p></article>)}<div className="route-ship" aria-hidden="true">◒</div></div></section>

    <section className="current-expeditions" aria-labelledby="current-title"><header><p className="world-kicker">Current expeditions</p><h2 id="current-title">Territories I&apos;m wandering through right now.</h2><p>Some will become essays. Some will become products. Most will quietly change how I see.</p></header><div className="expedition-islands">{["Life","Travel","More Human Design Things","Content Creation for Modern Human"].map((topic,index)=><article key={topic}><span>{String(index+1).padStart(2,"0")}</span><h3>{topic}</h3><i aria-hidden="true"/><small>{["The ordinary, inspected closely","Places that rearrange the mind","Maps for the person you already are","Making modern life feel more human"][index]}</small></article>)}<div className="expedition-boat" aria-hidden="true"><i/></div></div></section>
    <section className="human-design-expedition" id="human-design" aria-labelledby="human-design-title"><figure><div className="bodygraph-frame"><img src={assetPath("/media/explorer/bodygraph.jpg")} alt="A Human Design bodygraph with nine colored energy centers and their connecting channels"/><i aria-hidden="true"/></div><figcaption>A map, not a verdict.</figcaption></figure><article><p className="world-kicker">A Human Design expedition</p><h2 id="human-design-title">Have you ever wondered why you can read 37 self-help books, start fresh every Monday, and still feel like you&apos;re trying to assemble IKEA furniture with the wrong manual?</h2><p>Human Design won&apos;t tell you what to have for breakfast (you&apos;re on your own there), but it can offer a fascinating framework for understanding how you naturally make decisions, use your energy, navigate relationships, and move through life. Sometimes the biggest relief in life is finally understanding the person you&apos;ve been all along.</p><p>Whether you&apos;re endlessly curious, standing at a crossroads, or just wondering why everyone else seems to have received the &quot;How to Human&quot; handbook, a Human Design reading is an invitation to see yourself from a fresh perspective.</p><p>Come curious, leave with practical insights, a few &quot;wait...that explains everything&quot; moments, and a much better map for your own journey.</p><a href="https://lynk.id/heypearling/gqYvQMv" target="_blank" rel="noreferrer">Book your reading session <span aria-hidden="true">↗</span></a></article></section>

    <section className="curiosity-cabinet" aria-labelledby="cabinet-title-explorer"><header><p className="world-kicker">Curiosity Cabinet</p><h2 id="cabinet-title-explorer">Random fascinating things, kept for no reason at all.</h2></header><p>A private museum of octopus cognition, why Venetian mirror-makers were forbidden to leave the country, the grammar of perfume, forgotten inventions, unusual rituals, strange architecture, beautiful failures, and historical accidents. None of it was “useful.” All of it eventually was.</p><blockquote>Curiosity is the only investment that pays dividends in currencies you can&apos;t predict.</blockquote><p className="rabbit-holes"><strong>Rabbit Holes:</strong> Deep dives into obscure topics. Descend. Bring back a souvenir.</p></section>

    <section className="random-cove" aria-labelledby="random-title"><div className="random-door" aria-hidden="true"><i/><span>?</span></div><article><p className="world-kicker">The Random Cove</p><h2 id="random-title">A shell that asks back.</h2><p>The idea is simple: Open one shell without knowing what&apos;s inside. Follow whatever catches. Leave with something you didn&apos;t expect to care about.</p><div className="question-card" aria-live="polite"><span>Question {String(questionIndex+1).padStart(2,"0")}</span><blockquote>{questions[questionIndex]}</blockquote></div><button type="button" onClick={revealAnother}>Open another shell</button><small>That&apos;s the spirit.</small></article></section>

    <section className="world-lessons" aria-labelledby="lessons-title"><header><p className="world-kicker">Things the world quietly taught me</p><h2 id="lessons-title">Observations that became companions.</h2><p>After enough wandering, certain observations stop feeling like discoveries and start feeling like companions.</p></header><div className="lesson-compass" aria-hidden="true"><i/><span>N</span><span>E</span><span>S</span><span>W</span></div><ol>{["Almost everything becomes more interesting once you know its history.","Every discipline secretly borrows from another.","Curiosity compounds more reliably than certainty.","Nothing is truly useless if it changes how you see.","Every worthwhile rabbit hole leaves behind a better question than the one you entered with."].map((lesson,index)=><li key={lesson}><span>{index+1}</span><p>{lesson}</p></li>)}</ol><p className="lessons-coda">The goal was never to become someone who notices more.</p><aside><p className="world-kicker">Explorer&apos;s confession</p><blockquote>I currently have forty-seven browser tabs open. I will not be discussing it (hehe)</blockquote></aside></section>
    <WorldExit world="explorer"/>
    <footer className="world-footer">{site.copyright}</footer>
  </main>;
}

function BuilderInterior() {
  const builds = [
    { title: "The Mirror System V1.0", detail: "Bilingual EN & ID", image: "/media/builds/mirror-system.png", url: "https://lynk.id/pearling/kov13g2k0jeg", copy: "A reflective practice for noticing the generic stories, identities, and predictions we mistake for uniquely our own (Barnum Effect)." },
    { title: "Neural Reset Series: A Four-Phase Sonic Rewiring Protocol", detail: "In Bahasa Indonesia", image: "/media/builds/neural-reset-series.png", url: "https://lynk.id/pearling/wy4y0r7dzr71", copy: "Four audio experiences and a guidebook that move through deconstruction, regulation, recoding, and embodiment." },
    { title: "Pearl’s Paradox Chamber", detail: "Bilingual EN & ID", image: "/media/builds/pearls-paradox-chamber.png", url: "https://lynk.id/pearling/4pkop33p870g", copy: "A CustomGPT that helps people remain inside contradictions long enough to discover what a quick answer might conceal." },
    { title: "Becoming Human Again", detail: "Bilingual EN & ID", image: "/media/builds/becoming-human-again.png", url: "https://lynk.id/pearling/x08ekp8p1nx2", copy: "A twenty-one-module body of work, with supporting libraries and vaults, about becoming human again in the modern world." },
    { title: "Identity Vault", detail: "Private digital diary", image: "/media/builds/identity-vault.png", url: "https://earlessentials.github.io/self-concept/", copy: "An on-device space for writing letters to your future self and preserving inherited, performed, rejected, and desired identities in the form of a private digital diary." },
    { title: "Meta Learning Accelerator OS", detail: "In Bahasa Indonesia", image: "/media/builds/meta-learning-accelerator-os.png", url: "https://lynk.id/pearling/86nev6q20ypg", copy: "A learning operating system designed to shorten the distance between encountering an idea, understanding it, practising it, and making it usable. Instead of collecting more information, it helps the learning process become visible, repeatable, and cumulative." },
  ];
  const coralStages = [
    { name: "Polyp", copy: "The smallest version that can live on its own and be shipped today." },
    { name: "Skeleton", copy: "Harden what worked into reusable structure: a template, a checklist, or a system." },
    { name: "Colony", copy: "Connect the units so they reinforce one another through cross-links, shared components, and compounding value." },
    { name: "Reef", copy: "The structure begins sheltering new life: other people, use cases, or products can build on top of it." },
    { name: "Bleach check", copy: "Periodically inspect the system for dead or fragile parts. Prune or repair them before the damage spreads." },
  ];
  return <main className="shell-interior builder-interior" id="world-content">
    <WorldChrome world="builder"/>
    <section className="foundry-opening world-hero" aria-labelledby="builder-title"><div className="builder-cove-scene" aria-hidden="true"><div className="foundry-water"><i/><i/><i/></div><div className="coral-workshop"><div className="workshop-roof"><i/><i/><i/><i/><i/></div><div className="workshop-window"><span className="builder-blueprint">IDEA<br/>↓<br/>THING</span></div><div className="pearl-conveyor"><i/><i/><i/><i/><i/><b/></div><div className="builder-gears"><i/><i/><i/></div><div className="workshop-sign">THE CORAL FOUNDRY<small>small things, shipped alive</small></div></div><div className="builder-jellyfish"><i/><i/><i/></div><div className="tiny-builder-crabs"><i/><i/><i/></div><div className="foundry-bubbles"><i/><i/><i/><i/><i/><i/></div></div><div className="foundry-title"><p className="builder-open-label">THE WORKSHOP IS OPEN</p><h1 id="builder-title">The Builder</h1><p className="world-subtitle">From idea to shipped without losing its soul</p><span>Pull the lever. Let the smallest living version swim.</span></div><div className="hammer-crab" aria-hidden="true"><i/><b>⌕</b></div></section>

    <section className="build-cycle" aria-labelledby="cycle-title"><header><p className="world-kicker">Main worktable</p><h2 id="cycle-title">The build cycle</h2></header><div className="builder-flow build-cycle-flow" aria-label="Idea to shipped flowchart"><span>Idea</span><i>→</i><span>Prototype</span><i>→</i><span>Ship</span><i>→</i><span>Measure</span><i>→</i><span>Iterate</span><i className="loop-arrow">↩ Prototype</i><b>Archive the lesson</b></div></section>

    <section className="coral-nursery" aria-labelledby="nursery-title"><header><p className="world-kicker">A framework that stays alive</p><h2 id="nursery-title">The Coral Protocol</h2><p>Builders tend to plan cathedrals and ship rubble.</p><p>The Coral Protocol replaces the monolith with accretion. Like a coral reef, you build in small living units that can each survive on their own. What works hardens into structure. That structure then shelters the next layer of life.</p><p>It is a framework for shipping durable things in living layers instead of betting everything on one grand launch.</p></header><div className="builder-flow coral-flow" aria-label="The Coral Protocol flowchart">{["1 · Polyp\nSmallest living version","2 · Skeleton\nHarden what worked","3 · Colony\nConnect the units","4 · Reef\nOthers build on it","5 · Bleach check\nPrune what is dead"].map((step,index)=><span key={step}>{step.split("\n").map((line)=><i key={line}>{line}</i>)}{index < 4 && <b aria-hidden="true">→</b>}</span>)}<em>Healthy: return to Polyp</em><em>Fragile: return to Skeleton</em></div><div className="coral-stage-notes">{coralStages.map((stage,index)=><article key={stage.name}><div className={`coral coral-${index+1}`} aria-hidden="true"><i/><i/><i/></div><span>0{index+1}</span><h3>{stage.name}</h3><p>{stage.copy}</p></article>)}</div></section>

    <section className="coral-example" aria-labelledby="example-title"><header><p className="world-kicker">The reef in practice</p><h2 id="example-title">Worked example</h2></header><ol><li><strong>Polyp</strong><p>Ship a single newsletter issue manually and scrappily. Lol.</p></li><li><strong>Skeleton</strong><p>Turn what worked into a repeatable template and a six-step sending workflow.</p></li><li><strong>Colony</strong><p>Cross-link the issues into a searchable archive. Turn recurring segments into reusable blocks.</p></li><li><strong>Reef</strong><p>The archive becomes a course. Readers contribute guest issues. A small community forms around the work.</p></li><li><strong>Bleach check</strong><p>The links-roundup segment is quietly dying, so prune it and redirect the energy.</p></li></ol><p className="coral-conclusion">Nothing here required a grand launch. The reef grew because every layer was alive before the next one started.</p></section>

    <section className="build-gallery" aria-labelledby="builds-title"><header><p className="world-kicker">Objects with a pulse</p><h2 id="builds-title">Some things I have built</h2></header><div className="build-exhibits">{builds.map((build,index)=><article key={build.title}><div className="build-image-wrap"><img src={assetPath(build.image)} alt={`${build.title} cover`}/><span>{String(index+1).padStart(2,"0")}</span></div><div><p className="build-language">{build.detail}</p><h3>{build.title}</h3><p>{build.copy}</p><a href={build.url} target="_blank" rel="noreferrer">Access this build <span aria-hidden="true">↗</span></a></div></article>)}</div></section>

    <section className="tools-law" aria-labelledby="tools-title"><header><p className="world-kicker">The smallest useful machine</p><h2 id="tools-title">Tools are tiny arguments</h2><p>Every tool is a frozen opinion about how a moment of life should feel.</p></header><blockquote><span>My one law:</span>If a system needs willpower to run, the system is broken.<small>Design the meaning into the path of least resistance.</small></blockquote><div className="builder-flow meaning-flow" aria-label="Meaning that survives ordinary life flowchart">{["A felt problem","The smallest meaningful ritual","Place it on the path of least resistance","It survives a bad week","Meaning that survives ordinary life"].map((step,index)=><span key={step}>{step}{index < 4 && <i aria-hidden="true">→</i>}</span>)}</div></section>

    <section className="builder-humour" aria-labelledby="humour-title"><div className="workshop-note"><span className="tape" aria-hidden="true"/><p className="world-kicker">Builder humour</p><h2 id="humour-title">The cure was embarrassingly simple.</h2><p>I once built a productivity system so elaborate that maintaining it became my new unfinished project. The cure was embarrassingly simple. It usually is.</p></div><div className="tiny-machine" aria-hidden="true"><i/><i/><b/></div></section>
    <WorldExit world="builder"/>
    <footer className="world-footer">{site.copyright}</footer>
  </main>;
}

function StorytellerInterior() {
  const chambers = [
    ["Seed", "The small, ordinary status quo", "“This was normal to me.”"],
    ["Pressure", "The disturbance, the question, the crack", "“Then something stopped fitting.”"],
    ["Turn", "The choice or insight that changes the shape", "“So I did the unfamiliar thing.”"],
    ["Expansion", "Consequences ripple outward, same theme at higher stakes", "“And it changed more than I expected.”"],
    ["Open", "One chamber left deliberately unfinished", "“…and you?”"],
  ];
  const detailSets = [
    ["The launch was stressful.", "I refreshed the dashboard so often my thumb learned the gesture in its sleep."],
    ["I was afraid to publish.", "The “Post” button stayed blue for forty-three minutes while I convinced myself one more edit would make me brave."],
    ["The client was difficult.", "By the sixth revision, even the filename had 'FINAL_FINAL_v12' in it."],
    ["I was burnt out.", "I opened my laptop, stared at the screen for twenty minutes, and closed it without typing a single word."],
    ["I worked really hard.", "The cleaners started recognizing me because we arrived at the office at the same time."],
  ];
  const personalPosts = [
    { title: "Your writing has such a distinct signature... if I hired you, wouldn't people immediately know it's you writing and not me?", url: "https://www.linkedin.com/posts/pearlinglim_your-writing-has-such-a-distinct-signature-activity-7439581352863342592-x3px?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-01.jpg" },
    { title: "As a marketer, I see a lot of parallels between a good life and a good ad.", url: "https://www.linkedin.com/posts/pearlinglim_as-a-marketer-i-see-a-lot-of-parallels-between-activity-7441770988478042112-dWPx?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-02.jpg" },
    { title: "Do you want clarity, or do you want control?", url: "https://www.linkedin.com/posts/pearlinglim_do-you-want-clarity-or-do-you-want-control-activity-7423991148911804417-6_fY?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-03.jpg" },
    { title: "I started this year with a 72-hour fast and it turned into an expensive life & business lesson", url: "https://www.linkedin.com/posts/pearlinglim_i-started-this-year-with-a-72-hour-fast-and-activity-7413871921865392129-IkoW?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-04.jpg" },
    { title: "The ONE WORD that describes me this year is RELENTLESS.", url: "https://www.linkedin.com/posts/pearlinglim_the-one-word-that-describes-me-this-year-activity-7411697499943575552-JXFk?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-05.jpg" },
    { title: "This post is doing something to you.", url: "https://www.linkedin.com/posts/pearlinglim_this-post-is-doing-something-to-you-that-activity-7401183296677793792-Jg22?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-06.jpg" },
    { title: "What if I told you that people fail on Linkedin because they speak the wrong language to the wrong nervous system?", url: "https://www.linkedin.com/posts/pearlinglim_what-if-i-told-you-that-people-fail-on-linkedin-activity-7416380950328180736-2Rex?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-07.jpg" },
    { title: "What if stability in business is a myth we tell ourselves to feel safe?", url: "https://www.linkedin.com/posts/pearlinglim_what-if-stability-in-business-is-a-myth-we-activity-7418925329966161920-MkYo?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-08.jpg" },
    { title: "What is the biggest, most damaging lie in your industry that you're still too terrified to call out?", url: "https://www.linkedin.com/posts/pearlinglim_what-is-the-biggest-most-damaging-lie-in-activity-7459927869754982400-l-MJ?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-09.jpg" },
    { title: "Your 'wasted' time is your biggest competitive advantage.", url: "https://www.linkedin.com/posts/pearlinglim_your-wasted-time-is-your-biggest-competitive-activity-7421827669656477697-Wxrn?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAACmvAlwBM08R4tL2rIGW20rOjtsM67S7ixc", image: "/media/storyteller/linkedin/post-10.jpg" },
  ];
  const storyPrompts = [
    "What belief did you defend for years before realizing you were wrong?",
    "What's something you used to chase that no longer matters?",
    "What's a piece of advice you ignored until life forced you to understand it?",
    "What's a lesson that took you far too long to learn?",
    "What changed your definition of success?",
    "What's the most expensive lesson your business has ever taught you?",
    "Tell the story behind a decision that looked wrong at the time but proved right.",
    "When did saying 'no' become more valuable than saying 'yes'?",
    "What's something you stopped doing that made your business better?",
    "What's a failure that quietly became one of your greatest advantages?",
    "What's a client interaction you'll never forget and why?",
    "What's a piece of feedback that completely changed how you work?",
    "When did you realize hard work wasn't the bottleneck?",
    "What's a promotion, rejection, or opportunity that turned out to be a blessing in disguise?",
    "What's something you wish every young professional understood?",
    "Tell the story behind the biggest risk you've taken in your career.",
    "What's something people consistently misunderstand?",
    "What's a pattern you've noticed that most people overlook?",
    "When did you realize people don't buy what they say they want?",
    "What's one truth that's become more obvious the older you've become?",
    "What's a question everyone should ask themselves more often?",
    "Tell the story behind the hardest decision you've ever made.",
    "What's a tiny decision that changed the trajectory of your life?",
    "When did doing less produce better results?",
    "What's something you decided to quit and why?",
    "What's a decision people judged that you're still glad you made?",
    "When did you stop trying to impress people?",
    "What's something you now believe about yourself that younger you wouldn't have believed?",
    "What's a label you've outgrown?",
    "What habit quietly changed who you became?",
    "What's one uncomfortable truth about yourself that made your life better once you accepted it?",
    "What's a mistake you made as a leader that made you better?",
    "When did you learn that leadership isn't about having all the answers?",
    "What's a conversation you avoided for too long?",
    "Tell the story behind a time your team taught you something.",
    "What's one leadership lesson no book prepared you for?",
    "Tell the story behind a coffee, commute, meeting, or walk that unexpectedly changed your thinking.",
    "What's an everyday habit that taught you a surprising lesson?",
    "Describe a moment that seemed insignificant at the time but became unforgettable.",
    "What's the smallest event that ended up having the biggest impact?",
    "What's something completely ordinary that you now see differently?",
    "What's the biggest lie your industry still believes?",
    "What's popular advice you completely disagree with?",
    "What's something everyone optimizes for that you intentionally don't?",
    "What's an unpopular opinion that experience has convinced you is true?",
    "What's a common business rule you've broken successfully?",
  ];
  const library = [
    ["[BIRTHDAY LAUNCH] THERE IS NOTHING WRONG WITH YOU E-BOOK + EXPERIENCE", "A Self-Concept Architecture Playbook. What if I told you that there is nothing wrong with you?", "/media/storyteller/library/nothing-wrong.png"],
    ["[SPECIAL LAUNCH] THE LIVING PARADOX E-BOOK", "Siap berhenti mencari jawaban cepat saat hidup menuntutmu menampung lebih banyak?", "/media/storyteller/library/living-paradox.png"],
    ["[EXPERIENCE] NARRATIVE MAPPING: Rewrite Your Core Story", "Siap menulis ulang hidupmu bahkan kalau kamu belum tahu arah barunya?", "/media/storyteller/library/narrative-mapping.png"],
    ["[EXPERIENCE] LIVING FROM THE LIMINAL", "Siap menerima bahwa kehilangan arah adalah pintu inisiasi?", "/media/storyteller/library/living-liminal.png"],
    ["[EXPERIENCE] The Year Your Soul Fought Back", "Siap berhenti kabur saat hidup menuntut kejujuran yang lebih besar?", "/media/storyteller/library/soul-fought-back.png"],
    ["[TRILOGY] The Identity Shift Playbook", "Siap lepas dari pola lama dan embody versi kamu yang paling powerful?", "/media/storyteller/library/identity-shift.png"],
    ["[TRILOGY] Self-Sabotage Survival Playbook", "Siap lepas dari pola sabotase yang terus narik kamu balik?", "/media/storyteller/library/self-sabotage.png"],
    ["[TRILOGY] ROOTED: Self-Trust & Worth Repair Playbook", "Siap membangun ulang self-trust dari kapasitasmu?", "/media/storyteller/library/rooted.png"],
  ];
  const openingStories = [
    ["An ordinary detail", "refuses to stay ordinary", "and becomes a story."],
    ["A quiet question", "finds a crack in certainty", "and lets the light in."],
    ["A stranger", "chooses the unfamiliar", "and changes the ending."],
    ["One true sentence", "walks past every defense", "and stays for years."],
    ["A small beginning", "returns at higher stakes", "and becomes transformation."],
  ];
  const [storyPromptIndex, setStoryPromptIndex] = useState(0);
  const [openingStoryIndex, setOpeningStoryIndex] = useState(0);
  const revealStoryPrompt = () => setStoryPromptIndex((current) => (current + 1 + Math.floor(Math.random() * (storyPrompts.length - 1))) % storyPrompts.length);
  const turnOpeningStory = () => setOpeningStoryIndex((current) => (current + 1) % openingStories.length);
  return <main className="shell-interior storyteller-interior" id="world-content">
    <WorldChrome world="storyteller"/>
    <section className="story-playhouse world-hero" aria-labelledby="storyteller-title"><div className="playhouse-moon" aria-hidden="true"><i/><i/><i/><span>?</span></div><div className="story-curtains" aria-hidden="true"><i/><i/></div><div className="floating-punctuation" aria-hidden="true"><i>“</i><i>?</i><i>;</i><i>…”</i></div><div className="playbill-title"><p className="world-kicker">Tonight, inside the moving-image house</p><h1 id="storyteller-title">The Storyteller</h1><p className="world-subtitle">Every story changes someone.</p><a href="#nautilus-title">Enter the first chamber <span aria-hidden="true">↓</span></a></div><div className="opening-story-wheel"><p>Turn the story wheel</p><div key={openingStoryIndex} aria-live="polite"><small>{openingStories[openingStoryIndex][0]}</small><strong>{openingStories[openingStoryIndex][1]}</strong><em>{openingStories[openingStoryIndex][2]}</em></div><button type="button" onClick={turnOpeningStory}>Turn again <span aria-hidden="true">↻</span></button></div><div className="story-film-carousel" aria-hidden="true">{chambers.map(([name],index)=><span key={name}><b>0{index+1}</b><strong>{name}</strong><i/></span>)}</div><div className="paper-tide" aria-hidden="true"><i/><i/><i/></div></section>

    <section className="story-nautilus-arc" aria-labelledby="nautilus-title"><header><p className="world-kicker">Chamber 1 · The Nautilus Arc</p><h2 id="nautilus-title">How I build something a stranger will feel.</h2><h3>The problem it solves</h3><p>Most story structures are straight lines (beginning → middle → end). But transformation feels like the same lesson returning at a larger scale. The nautilus builds its shell in chambers, each a perfect echo of the last but bigger, spiraling outward in a golden ratio.</p><p>The Nautilus Arc is a framework for structuring a transformation story as expanding chambers, where the theme repeats at ever-higher stakes.</p></header><div className="story-arc-flow" aria-label="The Nautilus Arc flowchart">{chambers.map(([name,copy],index)=><article key={name} style={{"--arc":index} as React.CSSProperties}><span>{index+1}</span><strong>{name} Chamber</strong><small>{copy}</small>{index<4&&<i aria-hidden="true">→</i>}</article>)}</div><div className="story-chamber-table">{chambers.map(([name,lives,feeling],index)=><article key={name}><span>{index+1}</span><h3>{name}</h3><p>{lives}</p><blockquote>{feeling}</blockquote></article>)}</div><p className="arc-secret"><strong>The secret:</strong> the theme of Chamber 1 returns in Chamber 4, just larger. That echo is what makes a story feel whole rather than merely finished.</p></section>

    <section className="story-process" aria-labelledby="process-title"><div className="story-courier" aria-hidden="true"><div className="courier-gates"><i/><i/></div><div className="courier-envelope"><small>Something irresistible</small><strong>STORY</strong><span>Break the seal</span></div><div className="courier-truth"><small>Delivered inside</small><strong>THE TRUTH</strong></div></div><article><p className="world-kicker">Chamber 2 · Storytelling Process</p><h2 id="process-title">Exactly how I build a story.</h2><p>Story is about a trojan horse, nobody opens the gates for a lecture, they open them for a horse (lol). Story is how a difficult truth strolls past someone&apos;s defenses posed as entertainment, and only unpacks itself once it&apos;s safely inside.</p><h3>The One-Detail Rule</h3><p>A single specific, slightly odd detail beats a paragraph of adjectives.</p></article><div className="detail-film">{detailSets.map(([vague,specific],index)=><article key={vague}><span>Set {index+1}</span><div><small>Vague</small><p>“{vague}”</p></div><i aria-hidden="true">→</i><div><small>Specific</small><p>“{specific}”</p></div></article>)}</div></section>

    <section className="story-anatomy" aria-labelledby="anatomy-title">
      <header className="nike-anatomy-intro"><p className="world-kicker">Chamber 3 · Story Anatomy</p><h2 id="anatomy-title">Famous campaigns and narratives, dissected on the table.</h2><p>Some brands sell products. Others sell a story. The rarest brands do something even more powerful: they sell <strong>an identity people want to step into.</strong></p><p><strong>Nike is one of those brands.</strong></p><p>For decades, Nike has built one of the strongest storytelling ecosystems in modern marketing. Their advertisements are rarely about shoes, apparel, or performance technology. Instead, they tell stories about <strong>ambition, perseverance, identity,</strong> and the quiet battle every person fights within themselves. The product simply becomes <strong>a symbol of that transformation.</strong></p><p>This is what makes Nike an extraordinary case study in storytelling.</p><a href="https://www.storyempowers.com/subscribe" target="_blank" rel="noreferrer">Subscribe for The Storyteller&apos;s Clarity Hub <span aria-hidden="true">↗</span></a><small>Individual hubs and templates included.</small></header>

      <article className="nike-specimen"><p className="world-kicker">Brand Specimen · Nike</p><h3><strong>Nike sell the person you become in it</strong></h3><div><p>At first glance, it seems like Nike sells sportswear.</p><p>In reality, Nike sells something far deeper.</p><p>They sell the belief that <strong>greatness is not reserved for extraordinary people.</strong> It belongs to anyone willing to confront discomfort, push through doubt, and take one more step than yesterday.</p><p>Every campaign revolves around a remarkably consistent emotional arc. <strong>An ordinary person encounters resistance, faces an internal battle, chooses action despite uncertainty, and emerges transformed.</strong> The hero is never the product. <strong>The hero is always the individual wearing it.</strong></p><p>That consistency is why Nike&apos;s campaigns feel timeless. While products evolve every season, <strong>the human desire to become better remains universal.</strong></p></div></article>

      <div className="nike-campaigns" aria-label="Three Nike campaigns explored as story experiences">
        <article className="nike-campaign nike-just-do-it">
          <header><span>Campaign 01 · The decision</span><h3>Just Do It</h3><p>Stop negotiating with fear.</p></header>
          <div className="nike-campaign-stage"><figure><img src={assetPath("/media/storyteller/nike/just-do-it.png")} alt="Nike Just Do It campaign artwork"/><figcaption>The three-word interruption.</figcaption></figure><div className="nike-campaign-copy"><p>Perhaps no slogan in advertising history has become as culturally embedded as <strong>“Just Do It.”</strong></p><p>What makes it brilliant is <strong>its psychological precision.</strong></p><p>The phrase appears at the exact moment people begin <strong>negotiating with themselves.</strong></p><ul className="hesitation-moments"><li>The moment before waking up early.</li><li>The moment before applying for the opportunity.</li><li>The moment before speaking up.</li><li>The moment before beginning.</li></ul><p>Instead of providing motivation through lengthy explanations, Nike compresses <strong>an entire philosophy into three words.</strong> It assumes they already know what needs to be done and simply removes the excuse for waiting.</p><blockquote><strong>The slogan is overcoming hesitation.</strong></blockquote></div></div>
          <dl className="nike-anatomy-strip"><div><dt>Surface Story</dt><dd>Buy Nike sportswear.</dd></div><div><dt>Actual Story</dt><dd><strong>Stop negotiating with fear.</strong></dd></div><div><dt>Main Conflict</dt><dd>Internal hesitation.</dd></div><div><dt>Primary Villain</dt><dd>Self-doubt.</dd></div><div><dt>Hero</dt><dd>The individual making the decision to act.</dd></div><div><dt>Brand Role</dt><dd>The catalyst that gives permission to begin.</dd></div><div><dt>Transformation</dt><dd><strong>Inaction becomes momentum.</strong></dd></div></dl>
          <p className="nike-aftershock">The product becomes almost invisible. What remains is <strong>an emotional experience millions of people recognize instantly.</strong></p>
        </article>

        <article className="nike-campaign nike-find-greatness">
          <header><span>Campaign 02 · The reframe</span><h3>Find Your Greatness</h3><p>Ordinary effort becomes extraordinary.</p></header>
          <div className="nike-campaign-stage"><figure><img src={assetPath("/media/storyteller/nike/find-your-greatness.jpg")} alt="Nike Find Your Greatness campaign artwork"/><figcaption>Greatness, found away from the podium.</figcaption></figure><div className="nike-campaign-copy"><p>During the 2012 Olympics, most brands celebrated <strong>elite athletes standing on podiums.</strong></p><p><strong>Nike deliberately chose another direction.</strong></p><p>Instead of glorifying Olympic champions, they highlighted ordinary people exercising in ordinary places around the world. Some were beginners, some struggled, yet <strong>none of them appeared superhuman.</strong></p><p>The campaign dismantled one of society&apos;s most common assumptions: that <strong>greatness belongs only to the exceptionally gifted.</strong></p><p>Nike reframed greatness as something deeply personal rather than publicly validated. You do not need medals, crowds, or international recognition.</p><blockquote>Greatness can simply mean <strong>showing up today when yesterday you almost quit.</strong></blockquote><p>That shift transformed the campaign from sports advertising into <strong>a universal life philosophy.</strong></p></div></div>
          <dl className="nike-anatomy-strip"><div><dt>Surface Story</dt><dd>Everyday people exercising.</dd></div><div><dt>Expected Narrative</dt><dd>Greatness belongs to champions.</dd></div><div><dt>Nike&apos;s Narrative</dt><dd><strong>Greatness belongs to anyone willing to start.</strong></dd></div><div><dt>Main Conflict</dt><dd>Feeling ordinary.</dd></div><div><dt>Primary Villain</dt><dd>Comparison.</dd></div><div><dt>Hero</dt><dd>The everyday individual.</dd></div><div><dt>Brand Role</dt><dd>Redefining what greatness means.</dd></div><div><dt>Transformation</dt><dd><strong>Ordinary effort becomes extraordinary achievement.</strong></dd></div></dl>
          <p className="nike-aftershock">Rather than making viewers admire professional athletes, the campaign made viewers believe <strong>they could become one version of greatness themselves.</strong></p>
        </article>

        <article className="nike-campaign nike-dream-crazy">
          <header><span>Campaign 03 · The permission</span><h3>Dream Crazy</h3><p>Let impossible become proof.</p></header>
          <div className="nike-campaign-stage"><figure><img src={assetPath("/media/storyteller/nike/dream-crazy.jpg")} alt="Nike Dream Crazy campaign artwork"/><figcaption>The impossible, before it becomes evidence.</figcaption></figure><div className="nike-campaign-copy"><p>If “Just Do It” challenged hesitation, <strong>Dream Crazy challenged limitation.</strong></p><p>Instead of celebrating safe ambitions, Nike celebrated people whose dreams initially looked <strong>impossible, irrational, or unrealistic.</strong></p><p>The campaign centered around athletes who endured rejection, criticism, and enormous personal sacrifice before changing history. Rather than avoiding controversy, Nike embraced the idea that <strong>meaningful progress often requires standing apart from public opinion.</strong></p><blockquote>Every extraordinary achievement <strong>sounds unreasonable before it happens.</strong></blockquote><p>Dream Crazy tells audiences that ridicule is not necessarily evidence they are wrong. Sometimes it is evidence they are attempting <strong>something genuinely original.</strong></p></div></div>
          <dl className="nike-anatomy-strip"><div><dt>Surface Story</dt><dd>Athletes pursuing impossible dreams.</dd></div><div><dt>Main Conflict</dt><dd>Society&apos;s expectations.</dd></div><div><dt>Primary Villain</dt><dd>Fear of judgment.</dd></div><div><dt>Hero</dt><dd>The person willing to dream beyond accepted limits.</dd></div><div><dt>Brand Role</dt><dd>The voice encouraging impossible ambition.</dd></div><div><dt>Transformation</dt><dd><strong>Doubt becomes conviction.</strong></dd></div><div><dt>Core Belief</dt><dd><strong>Today&apos;s impossibility can become tomorrow&apos;s proof.</strong></dd></div></dl>
          <p className="nike-aftershock">Rather than asking audiences to admire successful athletes, Nike invites them to <strong>reconsider the size of their own ambitions.</strong></p>
        </article>
      </div>

      <article className="nike-why"><p className="world-kicker">The pattern beneath all three</p><h3>Why Nike&apos;s Storytelling Works</h3><p>Nike&apos;s campaigns remain remarkably consistent because they always begin with <strong>human psychology rather than product features.</strong></p><p>Across decades of advertising, the company repeatedly follows the same storytelling framework:</p><ol><li>Start with a <strong>universal human desire.</strong></li><li>Introduce an <strong>emotional obstacle</strong> rather than a physical one.</li><li>Position <strong>the audience as the hero.</strong></li><li>Turn the product into <strong>a symbol instead of the solution.</strong></li><li>End with <strong>an identity transformation</strong> rather than a purchase.</li></ol><p><strong>Nike create emotional meaning around the act of wearing them.</strong></p><blockquote>Shoes become <strong>movement.</strong><br/>Training becomes <strong>self-respect.</strong><br/>Sport becomes <strong>personal growth.</strong><br/>Winning becomes <strong>becoming.</strong></blockquote>
        <div className="identity-relay" aria-label="The movement from product to legendary identity"><span>Product</span><i aria-hidden="true">→</i><span>Identity</span><i aria-hidden="true">→</i><strong>Legend</strong></div>
        <p className="identity-relay-copy">From selling products to <strong>selling identity</strong> is what separates memorable brands from legendary ones.</p>
        <div className="nike-story-engine" id="nike-story-engine"><header><small>Press start</small><h3>The Storytelling Blueprint</h3><p>Seven forces. One transformation.</p></header><div className="engine-track" aria-hidden="true"><i/><i/><i/></div><dl><div><span>01</span><dt>Human Desire</dt><dd>I want to become more than I am today.</dd></div><div><span>02</span><dt>Internal Conflict</dt><dd>I don&apos;t know if I&apos;m capable.</dd></div><div><span>03</span><dt>Primary Villain</dt><dd>Fear, doubt, hesitation, and limitation.</dd></div><div><span>04</span><dt>Emotional Proof</dt><dd>Stories of people who acted despite uncertainty.</dd></div><div><span>05</span><dt>Brand Role</dt><dd>The mentor that encourages action, not the hero.</dd></div><div><span>06</span><dt>Transformation</dt><dd><strong>From hesitation to movement.</strong></dd></div><div><span>07</span><dt>Core Belief</dt><dd><strong>Greatness is earned through courage, not granted by talent.</strong></dd></div></dl></div>
        <div className="nike-story-constant"><small>The hidden anatomy</small><p>This is the hidden anatomy behind nearly every iconic Nike campaign.</p><div><span>The product changes.</span><span>The athletes change.</span><span>The visuals change.</span></div><blockquote><strong>But the story never does.</strong></blockquote></div>
      </article>
    </section>

    <section className="story-personal" aria-labelledby="personal-title"><header><p className="world-kicker">Chamber 4 · Personal Corner</p><h2 id="personal-title">Ten stories from my own shoreline.</h2><p>Click a photograph to read the post.</p></header><div>{personalPosts.map((post,index)=><a key={post.url} href={post.url} target="_blank" rel="noreferrer" className={`personal-post personal-post-${index+1}`}><img src={assetPath(post.image)} alt={`LinkedIn story artwork for ${post.title}`}/><span>{String(index+1).padStart(2,"0")}</span><h3>{post.title}</h3><small>Read on LinkedIn ↗</small></a>)}</div></section>

    <section className="story-humour" aria-label="Storyteller humour"><figure><img src={assetPath("/media/photoshoot/portrait-2665.jpg")} alt="Pearling Lim in the Storyteller cove"/></figure><div><blockquote>I once spent three hours on a single comma and called it a productive day.</blockquote><p>I stand by it and the comma stayed.</p></div><span aria-hidden="true">,</span></section>

    <section className="story-workshop" aria-labelledby="workshop-title"><header><p className="world-kicker">Chamber 5 · The Workshop</p><h2 id="workshop-title">Never wonder what to write again.</h2></header><div className="workshop-rules">{["Tell this story without mentioning the lesson until the final sentence.","Start with one oddly specific detail.","Begin with the sentence someone said to you.","Write it in under 200 words.","End with the question that changed your thinking."].map((rule,index)=><article key={rule}><span>0{index+1}</span><p>{rule}</p></article>)}</div><div className="story-prompt-shell" aria-live="polite"><span>Story shell {String(storyPromptIndex+1).padStart(2,"0")}</span><blockquote>{storyPrompts[storyPromptIndex]}</blockquote><button type="button" onClick={revealStoryPrompt}>Draw another prompt</button></div></section>

    <section className="story-library" aria-labelledby="library-title"><header><p className="world-kicker">Chamber 6 · The Library</p><h2 id="library-title">Some ideas are too large for a single post.</h2><p>Over the years, I&apos;ve written a collection of e-books in Bahasa Indonesia exploring storytelling, identity, psychology, narrative, and the patterns that shape how people think.</p><p>Each book began as a question I couldn&apos;t stop thinking about.</p><p>This library is where those questions became answers.</p><p>Browse the collection and ideas, perhaps leave with a different way of seeing the world.</p></header><h3>Inside the Library</h3><div className="library-shelves">{library.map(([title,copy,image],index)=><article key={title} style={{"--book":index} as React.CSSProperties}><span>{String(index+1).padStart(2,"0")}</span><img src={assetPath(image)} alt={`${title} cover`}/><h4>{title}</h4><p>{copy}</p></article>)}</div></section>
    <WorldExit world="storyteller"/>
    <footer className="world-footer">{site.copyright}</footer>
  </main>;
}

export function ShellInterior({ world }: { world: WorldId }) {
  if (world === "thinker") return <ThinkerInterior/>;
  if (world === "strategist") return <StrategistInterior/>;
  if (world === "explorer") return <ExplorerInterior/>;
  if (world === "builder") return <BuilderInterior/>;
  return <StorytellerInterior/>;
}
