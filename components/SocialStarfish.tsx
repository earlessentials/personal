"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { StarfishArt } from "./MarineArt";

function SocialLogo({ platform }: { platform: string }) {
  if (platform === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle className="logo-dot" cx="17.5" cy="6.5" r="1"/></svg>;
  if (platform === "tiktok") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a4.6 4.6 0 1 1-3.5-4.46v3.2a1.6 1.6 0 1 0 .5 1.16V3h3Zm0 0c.5 2.8 2.1 4.3 5 4.7v3.1c-2-.1-3.7-.8-5-2"/></svg>;
  if (platform === "linkedin") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="5" r="2"/><path d="M10 21V9h4v2c1-1.6 6-2.2 6 4v6h-4v-5c0-2.4-2-2.4-2 0v5Z"/></svg>;
  if (platform === "youtube") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 7.3a2.8 2.8 0 0 0-2-2C17.2 5 12 5 12 5s-5.2 0-7 .3a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.7 12 29 29 0 0 0 3 16.7a2.8 2.8 0 0 0 2 2c1.8.3 7 .3 7 .3s5.2 0 7-.3a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .3-4.7 29 29 0 0 0-.3-4.7Z"/><path className="logo-cutout" d="m10 9 5 3-5 3Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path className="logo-cutout" d="m4 7 8 6 8-6"/></svg>;
}

export function SocialStarfish() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => { window.removeEventListener("keydown", close); previous?.focus(); };
  }, [open]);

  return <>
    <button className="social-starfish" onClick={() => setOpen(true)} aria-label="Open Pearling’s social media details">
      <StarfishArt/><span className="object-label">Socials</span>
    </button>
    {open && <div className="social-veil" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
      <div className="social-panel" role="dialog" aria-modal="true" aria-labelledby="social-title" tabIndex={-1} ref={panel}>
        <button className="round-close" onClick={() => setOpen(false)} aria-label="Close social links">×</button>
        <StarfishArt/>
        <p className="kicker">Signals from the shore</p>
        <h2 id="social-title">Stay in the current</h2>
        <div className="social-links">
          {site.socials.map((social) => <a key={`${social.platform}-${social.handle}`} href={social.url} target={social.platform === "email" ? undefined : "_blank"} rel={social.platform === "email" ? undefined : "noreferrer"} aria-label={`${social.label}: ${social.handle}`}>
            <i className={`social-logo social-logo-${social.platform}`}><SocialLogo platform={social.platform}/></i><span>{social.label}<strong>{social.handle}</strong></span><em>↗</em>
          </a>)}
        </div>
        <p className="social-note">Eight small signals, all carried by one determined starfish.</p>
      </div>
    </div>}
  </>;
}
