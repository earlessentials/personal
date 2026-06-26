"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Pearl } from "@/content/pearls";
import { assetPath } from "@/lib/paths";

export function PearlModal({ pearl, onClose, onRandom }: { pearl: Pearl; onClose: () => void; onRandom: () => void }) {
  const modal = useRef<HTMLDivElement>(null);
  const externalGift = pearl.gift?.href.startsWith("http");
  const giftHref = pearl.gift ? (externalGift ? pearl.gift.href : assetPath(pearl.gift.href)) : "";
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    modal.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && modal.current) {
        const items = [...modal.current.querySelectorAll<HTMLElement>('a, button')];
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); previous?.focus(); };
  }, [onClose]);
  return <div className="pearl-veil" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="pearl-panel" role="dialog" aria-modal="true" aria-labelledby="pearl-title" tabIndex={-1} ref={modal}>
      <button className="round-close" onClick={onClose} aria-label="Return this pearl to the sea">×</button>
      <p className="kicker">{pearl.type} · The Pearl Archive</p>
      <div className="pearl-orb" aria-hidden="true" />
      <h2 id="pearl-title">{pearl.title}</h2>
      <p className="pearl-excerpt">{pearl.excerpt}</p>
      <p>{pearl.body}</p>
      {pearl.gift && <a className="pearl-gift" href={giftHref} download={externalGift ? undefined : true} target={externalGift ? "_blank" : undefined} rel={externalGift ? "noreferrer" : undefined}>
        <small>{pearl.gift.description}</small><strong>{pearl.gift.label} {externalGift ? "↗" : "↓"}</strong>
      </a>}
      <div className="pearl-actions">
        <Link href="/pearls">Open the full archive</Link>
        <button onClick={onRandom}>Open another pearl</button>
        <button onClick={onClose}>Return it to the sea</button>
      </div>
    </div>
  </div>;
}
