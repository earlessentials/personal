import type { Metadata } from "next";
import "./fallowmath.css";

export const metadata: Metadata = {
  title: { absolute: "Fallow Math — Transition Runway Calculator" },
  description:
    "A bilingual, personalized calculator for planning your financial runway, bridge income, and experimentation budget.",
  alternates: {
    canonical: "/fallowmath/",
  },
  openGraph: {
    title: "Fallow Math — Make Room for Change",
    description: "Plan your floor, runway, bridge income, and room to experiment.",
    type: "website",
    url: "/fallowmath/",
    images: [
      {
        url: "/fallowmath/og.jpg",
        width: 1200,
        height: 630,
        alt: "Fallow Math editorial cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fallow Math — Make Room for Change",
    description: "Plan your floor, runway, bridge income, and room to experiment.",
    images: ["/fallowmath/og.jpg"],
  },
};

export default function FallowMathLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
