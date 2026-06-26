"use client";

import { FormEvent, useState } from "react";
import { BottleArt, TurtleArt } from "./MarineArt";
import { site } from "@/content/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get("name") || "").trim()) next.name = "Please share a name for the letter.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") || ""))) next.email = "Please enter a valid email address.";
    if (!String(data.get("intent") || "")) next.intent = "Please choose what you would like to send.";
    if (!String(data.get("message") || "").trim()) next.message = "The turtle needs a message to carry.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const subject = `[Pearl's Cove] ${String(data.get("intent"))} from ${String(data.get("name"))}`;
    const body = [
      `From: ${String(data.get("name"))}`,
      `Reply to: ${String(data.get("email"))}`,
      `Message type: ${String(data.get("intent"))}`,
      `Project area: ${String(data.get("projectType") || "Not specified")}`,
      "",
      String(data.get("message")),
    ].join("\n");
    window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) return <div className="sent-message" role="status"><BottleArt/><p className="kicker">Letter addressed</p><h2>The turtle knows where to swim.</h2><p>Your email app has opened with the letter addressed to <strong>{site.contactEmail}</strong>. Press send there to complete the journey.</p><button onClick={() => setSent(false)}>Write another letter</button></div>;

  return <div className="contact-scene">
    <div className="underwater-post-scene" aria-hidden="true">
      <div className="turtle-school turtle-one"><TurtleArt/></div><div className="turtle-school turtle-two"><TurtleArt/></div><div className="turtle-school turtle-three"><TurtleArt/></div><div className="turtle-school turtle-four"><TurtleArt/></div>
      <div className="post-bubbles"><i/><i/><i/><i/><i/><i/><i/></div><div className="post-seagrass"><i/><i/><i/><i/><i/></div>
      <div className="chief-mail-turtle"><TurtleArt/><span>Postmaster, usually reliable</span></div>
    </div>
    <form className="bottle-form" onSubmit={submit} noValidate>
      <p className="kicker">The Underwater Post Office</p>
      <p className="post-office-intro">Every good conversation starts by sending something across the water.</p>
      <h2>What are you carrying across the water?</h2>
      <div className="form-pair">
        <div><label>Name<input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} placeholder="Your Name"/></label>{errors.name && <span id="name-error" className="field-error">{errors.name}</span>}</div>
        <div><label>Email<input type="email" name="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} placeholder="Email Address"/></label>{errors.email && <span id="email-error" className="field-error">{errors.email}</span>}</div>
      </div>
      <label>What would you like to send?<select name="intent" defaultValue="" aria-invalid={!!errors.intent} aria-describedby={errors.intent ? "intent-error" : undefined}><option value="" disabled>Choose a message type...</option><option>A project inquiry</option><option>Message</option><option>Human Design Reading</option><option>Strategy session</option><option>Collaboration</option><option>Speaking</option><option>Just saying hello</option><option>Something else</option></select></label>{errors.intent && <span id="intent-error" className="field-error">{errors.intent}</span>}
      <label>Which current is this floating in on? <span className="optional-label">(Optional)</span><select name="projectType" defaultValue=""><option value="">Choose a project area...</option><option>Brand strategy</option><option>Copywriting</option><option>Human Design</option><option>AI and systems</option><option>Speaking and workshops</option><option>Pearl&apos;s Cove</option><option>Something wonderfully unusual</option></select></label>
      <label>Your message<textarea name="message" rows={7} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} placeholder="Drop your letter below. Long, short, thoughtful, or wonderfully unhinged, we'll read it."/></label>{errors.message && <span id="message-error" className="field-error">{errors.message}</span>}
      <button className="send-button" type="submit">Give the letter to the turtle <span>→</span></button>
      <p className="form-note">This opens your email app with the message addressed to {site.contactEmail} and ready to send.</p>
    </form>
  </div>;
}
