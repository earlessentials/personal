import type { Metadata } from "next";
import "./domestications.css";

export const metadata: Metadata = {
  title: "The Four Domestications Scorecard",
  description:
    "Temukan pola yang paling kuat membentuk cara kamu menjadi acceptable.",
  icons: {
    icon: "/domestications/favicon.svg",
    shortcut: "/domestications/favicon.svg",
  },
  openGraph: {
    title: "The Four Domestications Scorecard",
    description:
      "Temukan pola yang paling kuat membentuk cara kamu menjadi acceptable.",
    images: ["/domestications/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Four Domestications Scorecard",
    description:
      "Temukan pola yang paling kuat membentuk cara kamu menjadi acceptable.",
    images: ["/domestications/og.jpg"],
  },
};

export default function DomesticationsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div lang="id">{children}</div>;
}
