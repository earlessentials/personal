import Link from "next/link";
import { InnerPage } from "@/components/InnerPage";
import { TurtleArt } from "@/components/MarineArt";
import { site } from "@/content/site";

export const metadata = {
  title: "Message Sent",
  description: "Your turtle mail is on its way.",
};

export default function ThanksPage() {
  return <InnerPage
    eyebrow="Turtle mail received"
    title="Your message is swimming over."
    intro={`Thank you. The note has been sent to ${site.contactEmail}.`}
    variant="contact"
  >
    <section className="empty-state" aria-labelledby="thanks-title">
      <TurtleArt/>
      <h2 id="thanks-title">The post office has it now.</h2>
      <p>If this was the first live submission, Pearling may need to confirm the FormSubmit activation email once. After that, future notes arrive automatically.</p>
      <Link href="/">Return to Pearl&apos;s Cove →</Link>
    </section>
  </InnerPage>;
}
