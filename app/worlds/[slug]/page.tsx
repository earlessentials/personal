import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShellInterior } from "@/components/ShellInterior";
import { worldById, worlds } from "@/content/worlds";
import "../worlds.css";
import "../strategist-v4.css";
import "../builder-v2.css";
import "../explorer-v2.css";

export function generateStaticParams() { return worlds.map(({ id }) => ({ slug: id })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const world = worldById((await params).slug);
  return { title: world?.title ?? "Unknown world", description: world?.shortDescription };
}

export default async function WorldPage({ params }: { params: Promise<{ slug: string }> }) {
  const world = worldById((await params).slug);
  if (!world) notFound();
  return <ShellInterior world={world.id as "thinker" | "strategist" | "explorer" | "builder" | "storyteller"}/>;
}
