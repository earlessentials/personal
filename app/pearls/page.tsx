import { InnerPage } from "@/components/InnerPage";
import { pearls } from "@/content/pearls";
import { assetPath } from "@/lib/paths";

export const metadata = { title: "The Pearl Archive", description: "Small things I decided not to lose." };

export default function PearlsPage() {
  return <InnerPage eyebrow="The archive beneath the reef" title="The Pearl Archive" intro="Small things I decided not to lose." variant="pearls">
    <p className="archive-note">A sentence. A question. A scrap of evidence. Each pearl is small enough to carry and too particular to throw away.</p>
    <section className="pearl-archive-list">
      {pearls.map((pearl, index) => {
        const externalGift = pearl.gift?.href.startsWith("http");
        const giftHref = pearl.gift ? (externalGift ? pearl.gift.href : assetPath(pearl.gift.href)) : "";
        return <article key={pearl.id}>
          <div className={`archive-pearl p-${index + 1}`} aria-hidden="true"/><p className="kicker">{pearl.type} · 0{index + 1}</p><h2>{pearl.title}</h2><p>{pearl.excerpt}</p><details><summary>Open the pearl</summary><p>{pearl.body}</p>{pearl.gift && <a className="archive-gift" href={giftHref} download={externalGift ? undefined : true} target={externalGift ? "_blank" : undefined} rel={externalGift ? "noreferrer" : undefined}>{pearl.gift.label} {externalGift ? "↗" : "↓"}</a>}</details>
        </article>;
      })}
    </section>
  </InnerPage>;
}
