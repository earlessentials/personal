"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { pearls, type Pearl } from "@/content/pearls";
import { worlds } from "@/content/worlds";
import { ArcadeShellArt, BottleArt, OysterArt, ShellArt, TurtleArt } from "./MarineArt";
import { CompassMenu } from "./CompassMenu";
import { PearlModal } from "./PearlModal";
import { SocialStarfish } from "./SocialStarfish";
import { assetPath } from "@/lib/paths";

function Intro({ onEnter }: { onEnter: () => void }) {
  return <div className="intro-veil">
    <div className="intro-card">
      <span className="intro-star" aria-hidden="true">✦</span>
      <button className="enter-water" onClick={onEnter}>{site.entranceLabel} <span>→</span></button>
    </div>
  </div>;
}

function PearlButton({ pearl, onOpen }: { pearl: Pearl; onOpen: (pearl: Pearl) => void }) {
  return <button
    className={`map-pearl pearl-${pearl.id}${pearl.featured ? " is-filled" : ""}`}
    style={{ "--x": `${pearl.coordinates.x}%`, "--y": `${pearl.coordinates.y}%` } as React.CSSProperties}
    onClick={() => onOpen(pearl)} aria-label={`Open pearl: ${pearl.title}`}
  ><span className="pearl-dot"/><span className="object-label">{pearl.title}</span></button>;
}

export function SeaWorld() {
  const [intro, setIntro] = useState(true);
  const [pearl, setPearl] = useState<Pearl | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [found, setFound] = useState(false);
  const sea = useRef<HTMLElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIntro(localStorage.getItem("pearl-entered") !== "yes");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const enter = () => { localStorage.setItem("pearl-entered", "yes"); setIntro(false); };
  const replay = () => setIntro(true);
  const randomPearl = useCallback(() => {
    const choices = pearls.filter((item) => item.id !== pearl?.id);
    setPearl(choices[Math.floor(Math.random() * choices.length)]);
  }, [pearl]);

  function move(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    setPointer({ x: (event.clientX / window.innerWidth - .5) * 8, y: (event.clientY / window.innerHeight - .5) * 6 });
  }

  return <main id="main-content" className="sea-page" onPointerMove={move} ref={sea}>
    <a className="skip-link" href="#destinations">Skip to destinations</a>
    <video className="sea-video" autoPlay muted loop playsInline preload="metadata" poster={assetPath("/art/sea-poster.svg")} aria-hidden="true">
      <source src={assetPath("/media/sea.mp4")} type="video/mp4" />
    </video>
    <div className="video-wash" aria-hidden="true" />
    <div className="paper-grain" aria-hidden="true" />
    <div className="light-rays" aria-hidden="true" />
    <div className="bubbles" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties}/>)}</div>

    <header className="sea-title" style={{ transform: `translate3d(${pointer.x * -.25}px,${pointer.y * -.25}px,0)` }}>
      <h1>{site.title}</h1>
      <span>{site.subtitle}</span>
    </header>

    <section id="destinations" className="sea-map" aria-label="The five shells">
      {worlds.map((world, index) => <Link
        className={`shell-destination shell-${world.id}`}
        key={world.id} href={`/worlds/${world.id}`}
        style={{ "--x": `${world.coordinates.x}%`, "--y": `${world.coordinates.y}%`, transform: `translate3d(${pointer.x * ((index % 2) ? .5 : -.4)}px,${pointer.y * .35}px,0)` } as React.CSSProperties}
      >
        <span className="shell-halo"/>
        <ShellArt type={world.shellType}/>
        <span className="world-label"><small>Shell 0{index + 1}</small><strong>{world.title}</strong><em>{world.shortDescription}</em></span>
      </Link>)}

      {pearls.map((item) => <PearlButton key={item.id} pearl={item} onOpen={setPearl}/>)}

      <Link className="turtle-contact" href="/contact"><TurtleArt/><span className="object-label">The turtle knows where to find me <b>Send a message →</b></span></Link>
      <Link className="oyster-portal oyster-services" href="/services"><OysterArt/><span className="object-label">Open for collaborations</span></Link>
      <Link className="oyster-portal oyster-play" href="/play"><ArcadeShellArt/><span className="object-label">Pearl Dive · Coral Arcade</span></Link>
      <Link className="drift-bottle" href="/drift"><BottleArt/><span className="object-label">Probably nothing here</span></Link>
      <Link className="lady-shore" href="/about">
        <span className="lady-frame"><Image src={assetPath("/media/lady-in-shore.jpg")} width={1254} height={1254} alt="Lady on Shore portrait"/></span>
        <span className="object-label">Lady on Shore <b>About Pearling →</b></span>
      </Link>
      <SocialStarfish/>

      <button className={`hidden-cave ${found ? "found" : ""}`} onClick={() => setFound(true)} aria-label="Inspect the hidden cave">
        <span>{found ? "An unfinished idea was hiding here." : "?"}</span>
      </button>
      <span className="map-sign sign-one">This way to<br/>something unfinished →</span>
      <span className="map-sign sign-two">The map becomes<br/>less reliable from here</span>
      <div className="seaweed bed-one" aria-hidden="true"><i/><i/><i/><i/></div>
      <div className="seaweed bed-two" aria-hidden="true"><i/><i/><i/><i/><i/></div>
      <div className="tiny-fish" aria-hidden="true"><i/><i/><i/></div>
    </section>

    <p className="explore-note">Drift, tap, or use the compass. There is no correct way through.</p>
    <footer className="sea-footer">{site.copyright}</footer>
    <CompassMenu onReplay={replay}/>
    {intro && <Intro onEnter={enter}/>} 
    {pearl && <PearlModal pearl={pearl} onClose={() => setPearl(null)} onRandom={randomPearl}/>} 
  </main>;
}
