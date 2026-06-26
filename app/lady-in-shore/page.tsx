import type { Metadata } from "next";
import { LadyInShore } from "@/components/LadyInShore";
import "./shore.css";

export const metadata: Metadata = {
  title: "Lady on Shore",
  description: "The quiet shoreline where visitors meet Pearling Lim.",
};

export default function LadyInShorePage() { return <LadyInShore/>; }
