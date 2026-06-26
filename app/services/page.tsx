import { InnerPage } from "@/components/InnerPage";
import { OysterArt } from "@/components/MarineArt";
import { CollaborationForm } from "@/components/CollaborationForm";

export const metadata = { title: "Collaborations", description: "Clear offers inside a pair of oysters." };
export default function ServicesPage() { return <InnerPage eyebrow="Two oysters, intentionally clear" title="Ways to work together" intro="Good collaborations usually start with a thoughtful introduction." variant="services">
  <section className="collab-oysters" aria-labelledby="collab-intro">
    <article>
      <OysterArt/>
      <h2 id="collab-intro">The form asks for specifics on purpose.</h2>
      <p>Tell me what you&apos;re building, what you need, and why you reached out.</p>
      <p>The clearer your message, the easier it is for me to give you a clear answer.</p>
    </article>
    <article>
      <OysterArt/>
      <h2>Good collaborations have a tide.</h2>
      <p>One side brings a project. The other brings judgment, language, structure, or a better route through the fog.</p>
      <p>If the current makes sense, the turtle knows where to swim next.</p>
    </article>
  </section>
  <CollaborationForm/>
  </InnerPage>; }
