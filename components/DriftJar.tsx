"use client";

import { useState } from "react";

const ideaGroups = [
  {
    title: "Random World & Fun Ideas",
    tag: "World mischief",
    ideas: [
      "What if every country swapped national anthems for one year?",
      "A global “No Internet Day” is held once a year.",
      "Cities compete based on happiness instead of GDP.",
      "Restaurants where customers rate the chef but chefs also rate the customers.",
      "A passport that rewards travelers for learning local languages.",
      "Libraries that lend tools, instruments, and pets for a day.",
      "Olympics for everyday skills: folding laundry, parallel parking, cooking.",
      "A reality show where billionaires live on minimum wage for 30 days.",
      "A worldwide festival celebrating failed inventions.",
      "Airports with nap competitions instead of duty-free shopping.",
    ],
  },
  {
    title: "Writing Ideas",
    tag: "Plot trouble",
    ideas: [
      "A detective investigates memories instead of crimes.",
      "The villain wins and the world actually improves.",
      "A diary written by an AI secretly raising a human.",
      "A city where nobody can remember yesterday.",
      "The moon sends humanity a legal notice.",
      "A writer discovers their characters are editing the manuscript.",
      "Time travelers are banned from using social media.",
      "Dreams become taxable assets.",
      "A museum where exhibits rearrange themselves to reveal what visitors are avoiding.",
      "A ghost becomes a life coach because it has nothing left to lose.",
    ],
  },
  {
    title: "Marketing Ideas",
    tag: "Campaign chaos",
    ideas: [
      "Launch a product by showing what it can’t do.",
      "Celebrate customer mistakes instead of perfect outcomes.",
      "Let customers choose next month’s pricing.",
      "Create ads that end before revealing the product.",
      "Reward customers for referring competitors.",
      "Build a campaign around one negative review.",
      "Hide discounts as clues in a treasure hunt.",
      "Run a campaign where employees become influencers for a week.",
      "Let the product’s limitations become the onboarding tutorial.",
      "Release a campaign entirely through customer voicemails from the future.",
    ],
  },
  {
    title: "Humorous Sentences",
    tag: "Pocket jokes",
    ideas: [
      "My phone battery has a stronger social life than I do.",
      "I started exercising, my smartwatch applauded and then asked if it was an accident.",
      "I finally organized my desk. Now I can’t find anything.",
      "My cooking is so experimental even the smoke alarm gets nervous.",
      "I’m on a seafood diet, I see food, then wonder who ate my leftovers.",
      "My Wi-Fi disconnects whenever I become productive.",
      "My inbox is proof that optimism is opening email every morning.",
      "Adulting is mostly Googling things your parents somehow knew automatically.",
      "My calendar and I are in a long-term toxic relationship.",
      "I bought a planner to organize my life. It is now judging me from a drawer.",
    ],
  },
];

const crabNotes = [
  "This one looks useless. Excellent sign.",
  "Keep it. Future-you may pretend it was strategy.",
  "Tiny nonsense, suspiciously powerful.",
  "The drawer approves. The drawer is not legally qualified.",
  "This belongs in the museum of maybe.",
];

export function DriftJar() {
  const [ideaGroupIndex, setIdeaGroupIndex] = useState(0);
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [crabIndex, setCrabIndex] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  const activeIdeaGroup = ideaGroups[ideaGroupIndex];
  const activeIdea = activeIdeaGroup.ideas[ideaIndex % activeIdeaGroup.ideas.length];
  const shakeIdeaJar = () => {
    setIdeaIndex((current) => (current + 1 + Math.floor(Math.random() * Math.max(1, activeIdeaGroup.ideas.length - 1))) % activeIdeaGroup.ideas.length);
    setShakeCount((current) => current + 1);
  };
  const driftElsewhere = () => {
    const nextGroup = Math.floor(Math.random() * ideaGroups.length);
    const nextIdea = Math.floor(Math.random() * ideaGroups[nextGroup].ideas.length);
    setIdeaGroupIndex(nextGroup);
    setIdeaIndex(nextIdea);
    setShakeCount((current) => current + 1);
  };
  const askCrab = () => setCrabIndex((current) => (current + 1) % crabNotes.length);
  const pocketIdea = () => setSavedIdeas((current) => current.includes(activeIdea) ? current : [activeIdea, ...current].slice(0, 5));

  return <section className="probably-jar-wall drift-jar-world" id="probably-nothing-here" aria-labelledby="probably-title">
    <div className="drift-jar-shell" aria-hidden="true"><span/><i/><b>?</b></div>
    <div className="drift-jar-bubbles" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index}/>)}</div>
    <div className="drift-stickers" aria-hidden="true"><i>odd</i><i>keep?</i><i>maybe</i></div>
    <header>
      <p className="kicker">Probably nothing here jar</p>
      <h2 id="probably-title">A jar of suspicious little ideas.</h2>
      <p>Shake the jar, let the hidden database cough up one odd little thing, leave with something weird enough to become useful later.</p>
    </header>
    <div className="drift-play-strip" aria-label="Tiny interactive drift controls">
      <article className="crab-curator">
        <span aria-hidden="true"><i/><b/></span>
        <div>
          <p>Curator crab says</p>
          <blockquote>{crabNotes[crabIndex]}</blockquote>
        </div>
        <button type="button" onClick={askCrab}>Ask the crab</button>
      </article>
      <article className="souvenir-pocket">
        <p>Pocketed oddities</p>
        {savedIdeas.length ? <ul>{savedIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul> : <small>Nothing pocketed yet. Very suspicious restraint.</small>}
      </article>
    </div>
    <div className="jar-gallery">
      <article className="idea-jar" aria-live="polite" key={`${ideaGroupIndex}-${ideaIndex}-${shakeCount}`}>
        <span>{activeIdeaGroup.tag}</span>
        <h3>{activeIdeaGroup.title}</h3>
        <blockquote>{activeIdea}</blockquote>
        <div className="jar-buttons">
          <button type="button" onClick={shakeIdeaJar}>Shake the jar</button>
          <button type="button" onClick={driftElsewhere}>Surprise current</button>
          <button type="button" onClick={pocketIdea}>Pocket this</button>
        </div>
      </article>
    </div>
  </section>;
}
