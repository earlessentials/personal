import type { Metadata } from "next";
import { LadyInShore } from "@/components/LadyInShore";
import "../lady-in-shore/shore.css";

export const metadata: Metadata = {
  title: "Lady on Shore",
  description: "The quiet shoreline where visitors meet Pearling Lim.",
};

export default function AboutPage() { return <LadyInShore/>; }
