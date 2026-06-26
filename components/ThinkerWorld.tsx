import Image from "next/image";
import { thinkerContent as content } from "@/content/thinker";
import { assetPath } from "@/lib/paths";

function StandingWaveDiagram() {
  return <figure className="standing-wave-diagram">
    <figcaption>How two opposing truths become one durable insight</figcaption>
    <div className="wave-current wave-current-a"><small>Current A</small><strong>A strong truth</strong></div>
    <div className="wave-current wave-current-b"><small>Current B</small><strong>Its strong opposite</strong></div>
    <div className="wave-meeting"><small>The meeting line</small><strong>Where both become real</strong></div>
    <div className="wave-shape"><i aria-hidden="true"/><small>The standing wave</small><strong>The stable shape of their tension</strong></div>
    <div className="wave-carry"><small>Carry it away</small><strong>One sentence that keeps both true</strong></div>
  </figure>;
}

function ExistenceGapDiagram() {
  return <figure className="gap-diagram">
    <figcaption>The Existence Gap</figcaption>
    <div className="gap-self"><small>Existing</small><strong>You, moving through life</strong><span>Habit · autopilot · survival</span></div>
    <div className="gap-distance"><span>the gap</span><i/><em>notice it</em></div>
    <div className="gap-present"><small>Present</small><strong>You, actually here</strong><span>Attention · choice · meaning</span></div>
  </figure>;
}

function ConchLoopDiagram() {
  return <figure className="conch-loop-diagram">
    <figcaption>One observation travels through five movements, and returns with a better question.</figcaption>
    <div className="conch-track" aria-label="Catch, Crack, Core, Cross, Carry, then loop back to Catch">
      {content.conchLoop.movements.map((movement) => <div className="conch-node" key={movement.name}>
        <span>{movement.number}</span><strong>{movement.name}</strong><small>{movement.question}</small>
      </div>)}
      <div className="loop-return">The open question becomes the next Catch ↺</div>
    </div>
  </figure>;
}

export function ThinkerWorld() {
  return <div className="thinker-world">
    <nav className="thinker-index" aria-label="The Thinker page contents">
      <a href="#thinker-shell"><span>01</span>Thinker Shell</a>
      <a href="#book"><span>02</span>The book</a>
      <a href="#standing-wave"><span>03</span>Standing Wave</a>
      <a href="#existence-gap"><span>04</span>Existence Gap</a>
      <a href="#experience"><span>05</span>The experience</a>
      <a href="#decision-tool"><span>06</span>Decision tool</a>
      <a href="#conch-loop"><span>07</span>Conch Loop</a>
    </nav>

    <section id="thinker-shell" className="thinker-opening thinker-section">
      <div>
        <p className="section-number">01 · {content.eyebrow}</p>
        <h2>{content.title}</h2>
        <p className="opening-declaration">{content.introduction}</p>
        {content.lede.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <blockquote>{content.belief}</blockquote>
    </section>

    <section id="book" className="thinker-section book-section">
      <div className="book-cover-wrap" aria-label={`Book cover for ${content.book.title}`}>
        <div className="book-cover">
          <Image src={assetPath("/media/exist-while-existing-cover.png")} width={1333} height={1999} sizes="(max-width: 900px) 82vw, 30vw" alt={`Cover of ${content.book.title} by Pearling Lim`} priority/>
        </div>
        <span className="book-shadow" aria-hidden="true"/>
      </div>
      <div className="book-copy">
        <p className="section-number">02 · By the way, I wrote a book</p>
        <h2>{content.book.title}</h2>
        <p className="book-subtitle">{content.book.subtitle}</p>
        <blockquote>{content.book.hook}</blockquote>
        <div className="book-lenses">
          {content.book.lenses.map((lens) => <article key={lens.title}><h3>{lens.title}</h3><p>{lens.body}</p></article>)}
        </div>
        <p className="book-closing">{content.book.closing}</p>
        <a className="amazon-button" href={content.book.url} target="_blank" rel="noreferrer">Grab a copy <span>↗</span></a>
      </div>
    </section>

    <section id="standing-wave" className="thinker-section instrument-section">
      <header><p className="section-number">03 · Thinking instrument</p><h2>{content.standingWave.title}</h2><p className="instrument-subtitle">{content.standingWave.subtitle}</p><p>{content.standingWave.intro}</p></header>
      <StandingWaveDiagram/>
      <div className="instrument-grid">
        <div><p className="kicker">How to raise a standing wave</p><ol className="method-steps">{content.standingWave.steps.map((step) => <li key={step.title}><span>{String(content.standingWave.steps.indexOf(step) + 1).padStart(2,"0")}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol></div>
        <div className="worked-pass"><p className="kicker">A worked pass</p><dl>{content.standingWave.example.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></div>
      </div>
      <p className="bench-note">Other instruments are still unnamed on the bench. Each earns a name only after it survives a real question.</p>
    </section>

    <section id="existence-gap" className="thinker-section gap-section">
      <header><p className="section-number">04 · A concept I keep returning to</p><h2>{content.existenceGap.title}</h2><p className="instrument-subtitle">{content.existenceGap.definition}</p></header>
      <ExistenceGapDiagram/>
      <div className="gap-signals"><p className="kicker">How to spot yours</p><ul>{content.existenceGap.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul></div>
    </section>

    <section id="experience" className="thinker-section experience-section">
      <header><p className="section-number">05 · The moment behind the idea</p><h2>{content.experience.title}</h2></header>
      <article className="flight-note">
        {content.experience.paragraphs.map((paragraph, index) => <p className={index === 3 ? "experience-pivot" : undefined} key={paragraph}>{paragraph}</p>)}
      </article>
    </section>

    <section id="decision-tool" className="thinker-section decision-section">
      <header><p className="section-number">06 · {content.decisionTool.subtitle}</p><h2>{content.decisionTool.title}</h2></header>
      <div className="gap-case">{content.decisionTool.cases.map(([term, definition]) => <article key={term}><span>{term}</span><p>{definition}</p></article>)}</div>
      <aside className="philosopher-aside"><span aria-hidden="true">∴</span><p>Yes, I call myself a modern-time philosopher, which mostly means I get paid in ideas and hold alarming opinions about the word <em>authenticity</em> at dinner parties. Apologies in advance.</p></aside>
    </section>

    <section id="conch-loop" className="thinker-section conch-section">
      <header><p className="section-number">07 · A signature Thinker framework 🐚</p><h2>{content.conchLoop.title}</h2><p className="instrument-subtitle">{content.conchLoop.subtitle}</p><blockquote>{content.conchLoop.maxim}</blockquote><p>{content.conchLoop.problem}</p><p className="loop-note">{content.conchLoop.note}</p></header>
      <ConchLoopDiagram/>
      <div className="movement-table" role="table" aria-label="The five movements of the Conch Loop">
        <div className="movement-head" role="row"><span>Movement</span><span>The move</span><span>The question</span></div>
        {content.conchLoop.movements.map((movement) => <div className="movement-row" role="row" key={movement.name}><strong>{movement.number} · {movement.name}</strong><p>{movement.move}</p><em>“{movement.question}”</em></div>)}
      </div>
      <div className="conch-example"><p className="kicker">Worked example · Ambient Accountability</p>{content.conchLoop.worked.map(([term, definition]) => <article key={term}><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <p className="closing-current">That dangling question is the next Catch. The loop turns again.</p>
    </section>
  </div>;
}
