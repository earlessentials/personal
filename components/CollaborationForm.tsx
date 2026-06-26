"use client";

import { FormEvent, useState } from "react";
import { TurtleArt } from "./MarineArt";
import { site } from "@/content/site";

export function CollaborationForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get("name") || "").trim()) next.name = "Please share your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") || ""))) next.email = "Please enter a valid email address.";
    if (!String(data.get("project") || "").trim()) next.project = "Tell me what you are working on.";
    if (!String(data.get("whyMe") || "").trim()) next.whyMe = "Tell me why you reached out.";
    if (!String(data.get("collaboration") || "").trim()) next.collaboration = "Describe what collaboration looks like.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const subject = `[Pearl's Cove Collaboration] ${String(data.get("name"))}`;
    const body = [
      `Name: ${String(data.get("name"))}`,
      `Email: ${String(data.get("email"))}`,
      `Website / LinkedIn / GitHub: ${String(data.get("link") || "Not provided")}`,
      "",
      "What are you working on?",
      String(data.get("project")),
      "",
      "Why me?",
      String(data.get("whyMe")),
      "",
      "What does collaboration look like?",
      String(data.get("collaboration")),
      "",
      "Scope",
      `Timeline: ${String(data.get("timeline") || "Not specified")}`,
      `Commitment: ${String(data.get("commitment") || "Not specified")}`,
      "",
      "Success",
      String(data.get("success") || "Not specified"),
      "",
      "Anything else?",
      String(data.get("anythingElse") || "Nothing else"),
    ].join("\n");
    window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) return <div className="collab-sent" role="status">
    <TurtleArt/>
    <h2>The turtle has the letter.</h2>
    <p>Your email app opened with the collaboration note addressed to <strong>{site.contactEmail}</strong>. Press send there to complete the swim.</p>
    <button type="button" onClick={() => setSent(false)}>Write another note</button>
  </div>;

  return <form className="collab-form" onSubmit={submit} noValidate>
    <p className="kicker">Collaboration Form</p>
    <h2>A thoughtful answer beats a quick one.</h2>
    <fieldset>
      <legend>About you</legend>
      <div className="form-pair">
        <label>Name<input name="name" autoComplete="name" aria-invalid={!!errors.name}/>{errors.name && <span className="field-error">{errors.name}</span>}</label>
        <label>Email<input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email}/>{errors.email && <span className="field-error">{errors.email}</span>}</label>
      </div>
      <label>Website / LinkedIn / GitHub <span className="optional-label">(optional)</span><input name="link" inputMode="url"/></label>
    </fieldset>
    <label>What are you working on?<textarea name="project" rows={5} aria-invalid={!!errors.project} placeholder="Tell me about the project, company, idea, or problem in a few paragraphs."/>{errors.project && <span className="field-error">{errors.project}</span>}</label>
    <label>Why me?<textarea name="whyMe" rows={4} aria-invalid={!!errors.whyMe} placeholder="What made you think we'd work well together? If there's something specific I've made, written, or talked about that prompted you to reach out, mention it."/>{errors.whyMe && <span className="field-error">{errors.whyMe}</span>}</label>
    <label>What does collaboration look like?<textarea name="collaboration" rows={5} aria-invalid={!!errors.collaboration} placeholder="Build a product, technical consulting, design or strategy, research, writing, speaking, or something else entirely."/>{errors.collaboration && <span className="field-error">{errors.collaboration}</span>}</label>
    <fieldset>
      <legend>Scope</legend>
      <label>What&apos;s the expected timeline?<input name="timeline"/></label>
      <label>What level of commitment are you looking for?<select name="commitment" defaultValue=""><option value="">Choose one...</option><option>One conversation</option><option>A few hours</option><option>A short project</option><option>Ongoing collaboration</option></select></label>
    </fieldset>
    <label>Success<textarea name="success" rows={4} placeholder="If this goes well, what does success look like six months from now?"/></label>
    <label>Anything else?<textarea name="anythingElse" rows={4} placeholder="Anything I should know before I reply?"/></label>
    <button className="send-button" type="submit">Send it with the turtle <span aria-hidden="true">→</span></button>
    <p className="form-note">This opens your email app with the collaboration note addressed to {site.contactEmail} and ready to send.</p>
  </form>;
}
