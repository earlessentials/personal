"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ladyInShore as copy } from "@/content/ladyInShore";
import { CompassMenu } from "./CompassMenu";
import { assetPath } from "@/lib/paths";

function RichText({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return <span key={index}>{part}</span>;
  })}</>;
}

function Shell({ className = "" }: { className?: string }) {
  return <span className={`shore-shell ${className}`} aria-hidden="true"><i/><i/><i/></span>;
}

function Grass({ className = "" }: { className?: string }) {
  return <span className={`shore-grass ${className}`} aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index}/>)}</span>;
}

function BirdFlight() {
  return <div className="shore-birds" aria-hidden="true"><i/><i/><i/></div>;
}

function Cottage() {
  return <div className="shore-cottage" aria-label="A white seaside cottage with a writing porch">
    <div className="cottage-chimney"/><div className="cottage-roof"/>
    <div className="cottage-wall"><span className="cottage-window"><i/><i/></span><span className="cottage-door"/><span className="linen-curtain left"/><span className="linen-curtain right"/></div>
    <div className="cottage-porch"><span className="porch-books"/><span className="porch-lantern">✦</span><span className="porch-cup">◡</span><span className="porch-letters">≋</span><span className="porch-flowers">❀</span></div>
    <div className="shell-chimes" aria-hidden="true"><i/><i/><i/></div><Grass className="cottage-grass"/>
  </div>;
}

function PortraitCottage() {
  return <section className="shore-scene cottage-scene" aria-labelledby="meet-pearling">
    <div className="shore-portrait-wrap">
      <div className="shore-portrait"><Image src={assetPath("/media/lady-on-shore/photoshoot-revised.jpg")} width={3808} height={5077} alt="Pearling Lim in a black portrait by the shore" priority/></div>
      <div className="portrait-shells" aria-hidden="true"><Shell/><Shell/><Shell/><Shell/></div>
    </div>
    <Cottage/>
    <div className="porch-notice" id="meet-pearling">
      <span className="notice-pin" aria-hidden="true"/>
      {copy.introduction.map((paragraph, index) => <p className={index === 0 ? "shore-introduction" : "shore-introduction-tail"} key={paragraph}><RichText text={paragraph}/></p>)}
      <span className="pressed-flower" aria-hidden="true">❀</span>
    </div>
  </section>;
}

function HolyTrinity() {
  return <section className="shore-section holy-trinity" aria-labelledby="holy-trinity-title">
    <header className="trinity-heading"><p className="shore-kicker">Chamber 2 · the inner weather</p><h2 id="holy-trinity-title">{copy.trinity.title}</h2></header>
    <div className="trinity-constellation">
      {copy.trinity.principles.map((principle,index)=><article className={`trinity-orb trinity-orb-${index + 1}`} key={principle.title}><span>{String(index + 1).padStart(2,"0")}</span><h3>{principle.title}</h3><p>{principle.line}</p></article>)}
      <blockquote>{copy.trinity.intersection}</blockquote><i className="trinity-thread one"/><i className="trinity-thread two"/><i className="trinity-thread three"/>
    </div>
    <div className="trinity-manifesto">
      <article className="truth-letter"><p className="shore-kicker">Existentially honest</p>{copy.trinity.truth.map((line)=><p key={line}>{line}</p>)}</article>
      <article className="ripening-timeline"><p className="shore-kicker">How an insight ripens</p>{copy.trinity.ripening.map((line,index)=><div key={line}><span>{String(index + 1).padStart(2,"0")}</span><p>{line}</p></div>)}<strong>{copy.trinity.learner}</strong></article>
      <article className="polarity-notes"><p className="shore-kicker">Polarity & paradox</p>{copy.trinity.writingBeliefs.map((line,index)=><p key={line} className={index === 2 ? "paradox-line" : ""}>{line}</p>)}</article>
      <blockquote className="writing-exhale">{copy.trinity.exhale}</blockquote>
      <article className="writing-craft"><p className="shore-kicker">The practice</p>{copy.trinity.craft.map((line,index)=><p key={line} className={index === copy.trinity.craft.length - 1 ? "all-in-one" : ""}>{line}</p>)}</article>
    </div>
  </section>;
}

function WritingCorner() {
  return <section className="shore-scene writing-scene" aria-labelledby="brain-note">
    <Grass className="writing-grass"/>
    <div className="driftwood-desk" aria-hidden="true"><span className="desk-pen"/><span className="desk-compass">✦</span><span className="desk-mug">◡</span><span className="desk-maps">⌁</span><span className="shell-paperweight">◉</span></div>
    <article className="journal-spread">
      <div className="journal-page"><h2 id="brain-note">{copy.note.title}</h2><aside className="management-note"><p><RichText text={copy.note.aside}/></p></aside></div>
      <div className="journal-page ruled"><p className="journal-copy"><RichText text={copy.note.body}/></p></div>
    </article>
  </section>;
}

function IdentityVisual({ index }: { index: number }) {
  if (index === 0) return <div className="identity-prop compass-letters" aria-hidden="true"><span>✦</span><i/><i/><i/></div>;
  if (index === 1) return <div className="identity-prop tide-pool" aria-hidden="true"><i/></div>;
  if (index === 2) return <div className="identity-prop artist-table" aria-hidden="true"><span/><i/><i/><i/></div>;
  return <div className="identity-prop blueprint-pile" aria-hidden="true"><span>⌁</span><i/><i/><b>●</b></div>;
}

function ManyTides() {
  return <section className="shore-section many-tides" aria-labelledby="many-tides-title">
    <header className="shore-heading"><h2 id="many-tides-title">{copy.tides.title}</h2></header>
    <div className="tide-zones">
      {copy.tides.identities.map((identity, index) => <article className={`tide-zone tide-zone-${index + 1}`} key={identity.title} tabIndex={0}>
        <IdentityVisual index={index}/><h3>{identity.title}</h3>{identity.paragraphs.map((paragraph)=><p key={paragraph}><RichText text={paragraph}/></p>)}<span className="zone-ripple" aria-hidden="true"/>
      </article>)}
    </div>
  </section>;
}

function BookOyster() {
  return <section className="shore-section shore-book" aria-labelledby="shore-book-title">
    <div className="book-still-life" aria-hidden="true"><span className="reading-glasses">∞</span><span className="tea-cup">◡</span><span className="book-flowers">❀</span><span className="bookmark"/></div>
    <div className="book-oyster">
      <span className="oyster-top"/><span className="oyster-bottom"/>
      <Image src={assetPath("/media/exist-while-existing-cover.png")} width={1333} height={1999} alt="Exist While Existing by Pearling Lim"/>
      <i/><i/><i/><i/>
    </div>
    <div className="book-margin"><h2 id="shore-book-title"><RichText text={copy.book.title}/></h2><p className="book-heading"><RichText text={copy.book.heading}/></p><p className="book-deck"><RichText text={copy.book.body}/></p><a className="book-copy-button" href="https://www.amazon.com/Exist-Beyond-Existing-Pearling-Lim-ebook/dp/B0GHZDZYDF" target="_blank" rel="noreferrer">Grab the copy <span aria-hidden="true">↗</span></a></div>
  </section>;
}

function Workshops() {
  return <section className="shore-section shore-workshops" aria-labelledby="workshops-title">
    <header className="shore-heading"><p className="shore-kicker">Chamber 6 · on demand</p><h2 id="workshops-title">{copy.workshops.title}</h2><p className="section-intro">{copy.workshops.intro}</p></header>
    <div className="workshop-tide-shelf">
      {copy.workshops.items.map((workshop,index)=><a className={`workshop-shell workshop-shell-${index + 1}`} href={workshop.url} target="_blank" rel="noreferrer" key={workshop.title}><span className="workshop-number">0{index + 1}</span><figure><Image src={assetPath(workshop.image)} width={1280} height={720} alt={`${workshop.title} workshop artwork`}/><i aria-hidden="true"/></figure><div><small>{workshop.label}</small><h3>{workshop.title}</h3><span>Watch on demand ↗</span></div></a>)}
    </div>
  </section>;
}

function ThinkingChart() {
  const nodes = [
    {x:90,y:220,label:["A better","question"]},
    {x:280,y:110,label:["Notice","patterns"]},
    {x:455,y:265,label:["Connect the","unconnected"]},
    {x:650,y:110,label:["Shape a","framework"]},
    {x:835,y:265,label:["Build","something real"]},
    {x:1030,y:170,label:["Tell the","story"]},
  ];
  return <section className="shore-section thinking-chart thinking-chart-quiet" aria-label="A better question leads to noticing patterns, connecting the unconnected, shaping a framework, building something real, telling the story, and returning to a better question">
    <div className="nautical-chart">
      <svg viewBox="0 0 1120 420" role="img" aria-label="A small boat follows a six-step thinking loop between miniature islands">
        <path className="route-line" d="M90 220C155 95 220 85 280 110S390 265 455 265 575 115 650 110 760 260 835 265 950 160 1030 170"/>
        <path className="route-line return" d="M1030 170C980 385 220 410 90 220"/>
        {nodes.map((node,index)=><g className="chart-island" key={node.label.join("-")} transform={`translate(${node.x} ${node.y})`}><ellipse rx="64" ry="23"/><path d="M-38 0-8-44 12-16 32-50 48 2Z"/><rect className="chart-label-plate" x="-68" y="20" width="136" height="45" rx="5"/><text y="39" textAnchor="middle">{node.label.map((line,lineIndex)=><tspan x="0" dy={lineIndex ? 15 : 0} key={line}>{line}</tspan>)}</text><circle className="chart-step" cx="-48" cy="-38" r="12"/><text className="chart-step-number" x="-48" y="-34" textAnchor="middle">{index + 1}</text></g>)}
        <g className="chart-boat"><path d="m-17 9 35 0-8 11h-19Z"/><path d="M0 8V-23l19 23Z"/></g>
      </svg>
    </div>
  </section>;
}

function AncientTurtle() {
  return <section className="shore-section turtle-farewell" aria-labelledby="say-hello-title">
    <div className="ancient-turtle" aria-hidden="true"><span className="turtle-head"><i/></span><span className="turtle-shell"><i/><i/><i/><b>✦</b></span><span className="turtle-flipper one"/><span className="turtle-flipper two"/></div>
    <div className="farewell-sign"><h2 id="say-hello-title">{copy.contact.title}</h2><blockquote>{copy.contact.line}</blockquote></div>
    <Link className="rope-envelope" href="/contact" aria-label="Open the vintage envelope and visit Contact"><span>✉</span><i aria-hidden="true"/></Link>
  </section>;
}

function SoundToggle() {
  const [on, setOn] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const toggle = () => {
    if (on) { source.current?.stop(); source.current = null; context.current?.close(); context.current = null; setOn(false); return; }
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audio = new AudioCtor(); const length = audio.sampleRate * 3; const buffer = audio.createBuffer(1,length,audio.sampleRate); const data = buffer.getChannelData(0);
    for (let index=0; index<length; index++) data[index] = (Math.random()*2-1) * .22;
    const waves = audio.createBufferSource(); const filter = audio.createBiquadFilter(); const gain = audio.createGain(); filter.type="lowpass"; filter.frequency.value=520; gain.gain.value=.045; waves.buffer=buffer; waves.loop=true; waves.connect(filter).connect(gain).connect(audio.destination); waves.start();
    context.current=audio; source.current=waves; setOn(true);
  };
  return <button className="shore-sound" onClick={toggle} aria-pressed={on}>{on ? "Quiet the tide" : "Hear the tide"}</button>;
}

export function LadyInShore() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => root.style.setProperty("--shore-progress", `${window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)}`);
    update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update);
  }, []);
  return <main className="shore-page" id="main-content">
    <div className="shore-atmosphere" aria-hidden="true"><div className="shore-sun"/><div className="shore-mist one"/><div className="shore-mist two"/><BirdFlight/></div>
    <Link className="shore-return" href="/">← Return to Pearl's Cove</Link><SoundToggle/>
    <section className="shore-opening" aria-labelledby="shore-title"><div className="opening-sea" aria-hidden="true"><i/><i/><i/></div><div className="weathered-sign"><span/><h1 id="shore-title">{copy.title}</h1><blockquote>“{copy.openingQuote}”</blockquote></div><div className="pearl-hermit" aria-hidden="true"><span>●</span><i/><i/><i/></div><div className="footprint-trail" aria-hidden="true">{Array.from({length:8},(_,index)=><i key={index}/>)}</div></section>
    <PortraitCottage/><HolyTrinity/><WritingCorner/><ManyTides/><BookOyster/><ThinkingChart/><Workshops/><AncientTurtle/>
    <footer className="shore-footer">© 2026 Pearling Lim. All Rights Reserved</footer><CompassMenu/>
  </main>;
}
