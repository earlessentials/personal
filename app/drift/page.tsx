import { InnerPage } from "@/components/InnerPage";
import { DriftJar } from "@/components/DriftJar";
import "./drift.css";

export const metadata = { title: "The Drift", description: "Unsorted things washed into one unusual drawer." };

export default function DriftPage() {
  return <InnerPage eyebrow="Probably nothing here" title="The Drift" intro="A little shell-room for random ideas, fun provocations, and beautifully unnecessary thoughts." variant="drift">
    <p className="archive-note">Not everything here has a purpose. That is partly the point.</p>
    <DriftJar/>
  </InnerPage>;
}
