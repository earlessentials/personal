import type { Metadata } from "next";
import "./merdeka.css";

export const metadata: Metadata = {
  title: "Gifts for Independence Day by Pearling",
  description: "A playful 17 Agustus carnival with gifts, a lucky wheel, and riddles.",
  alternates: { canonical: "https://www.pearlinglim.com/merdeka2026/" },
};

export default function MerdekaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
