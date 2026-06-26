"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { worlds } from "@/content/worlds";
import { CompassArt } from "./MarineArt";

const extras = [
  ["Lady on Shore", "/about"], ["The Pearl Archive", "/pearls"], ["The Drift", "/drift"], ["Pearl Dive", "/play"], ["Contact", "/contact"],
] as const;

export function CompassMenu({ onReplay }: { onReplay?: () => void }) {
  const [open, setOpen] = useState(false);
  const [night, setNight] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pearl-tide") === "night";
    document.documentElement.dataset.tide = saved ? "night" : "day";
    const frame = window.requestAnimationFrame(() => setNight(saved));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab" && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>('a, button')];
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  function toggleTide() {
    const next = !night;
    setNight(next);
    document.documentElement.dataset.tide = next ? "night" : "day";
    localStorage.setItem("pearl-tide", next ? "night" : "day");
  }

  return <>
    <button className="compass-button" onClick={() => setOpen(true)} aria-label="Open map and accessibility navigation" aria-expanded={open}>
      <CompassArt /> <span>Map</span>
    </button>
    {open && <div className="menu-veil" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="compass-panel" role="dialog" aria-modal="true" aria-label="Cove map" ref={panel}>
        <div className="panel-heading"><p className="kicker">Places beneath the surface</p><button className="round-close" onClick={() => setOpen(false)} aria-label="Close map">×</button></div>
        <nav aria-label="All destinations">
          <Link href="/" onClick={() => setOpen(false)}>Return to the Sea <span>↗</span></Link>
          {worlds.map((world, i) => <Link key={world.id} href={`/worlds/${world.id}`} onClick={() => setOpen(false)}><small>0{i + 1}</small>{world.title}<span>→</span></Link>)}
          {extras.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}><small>•</small>{label}<span>→</span></Link>)}
        </nav>
        <div className="menu-actions">
          <button onClick={toggleTide} aria-pressed={night}>{night ? "☼ Day tide" : "◐ Night tide"}</button>
          {onReplay && <button onClick={() => { onReplay(); setOpen(false); }}>↻ Replay introduction</button>}
        </div>
        <p className="map-description">Pearl’s Cove contains five primary shells: The Thinker, The Strategist, The Builder, The Storyteller, and The Explorer. Additional destinations include Lady on Shore, the Pearl Archive, the Drift, Pearl Dive, and Contact.</p>
      </div>
    </div>}
  </>;
}
