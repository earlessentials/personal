import Link from "next/link";
import { CompassMenu } from "./CompassMenu";
import { site } from "@/content/site";

export function InnerPage({ eyebrow, title, intro, variant = "default", children }: { eyebrow: string; title: string; intro: string; variant?: string; children: React.ReactNode }) {
  return <main id="main-content" className={`inner-page inner-${variant}`}>
    <a className="skip-link" href="#page-content">Skip to content</a>
    <div className="inner-water" aria-hidden="true"/><div className="paper-grain" aria-hidden="true"/>
    <Link href="/" className="return-sea">← Return to the sea</Link>
    <header className="inner-header">
      <p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{intro}</p>
    </header>
    <div id="page-content" className="inner-content">{children}</div>
    <footer className="inner-footer">{site.copyright}</footer>
    <CompassMenu/>
  </main>;
}
