import { InnerPage } from "@/components/InnerPage";
import { PearlDive } from "@/components/PearlDive";

export const metadata = { title: "Pearl Dive: Coral Arcade", description: "Three interactive games below the surface." };
export default function PlayPage() { return <InnerPage eyebrow="The Coral Arcade" title="Play beneath the surface" intro="Three cabinets, no leaderboard: collect pearls, hold a paradox, or attempt to outwit a crab." variant="play"><PearlDive/></InnerPage>; }
