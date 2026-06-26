export type Pearl = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  type: string;
  featured: boolean;
  coordinates: { x: number; y: number; mobileOrder: number };
  gift?: { label: string; href: string; description: string };
};

export const pearls: Pearl[] = [
  { id: "pearl-001", title: "Deep thoughts", excerpt: "Subscribe to read my deep thoughts.", body: "Longer notes, philosophical rabbit holes, and thoughts that wanted more room than social media could give them.", type: "subscribe", featured: false, coordinates: { x: 39, y: 34, mobileOrder: 1 }, gift: { label: "Subscribe on Substack", href: "https://substack.com/@pearling", description: "Pearl 1 · Read my deep thoughts." } },
  { id: "pearl-002", title: "The Storyteller’s Clarity Hub", excerpt: "Subscribe to claim The Storyteller’s Clarity Hub for free.", body: "A free clarity corner for storytelling, copy, and sharper thinking around what your words are actually doing.", type: "subscribe", featured: false, coordinates: { x: 62, y: 58, mobileOrder: 2 }, gift: { label: "Claim the free hub", href: "https://www.storyempowers.com/subscribe", description: "Pearl 2 · The Storyteller’s Clarity Hub." } },
  { id: "pearl-003", title: "A gift for better questions", excerpt: "A printable card for the next question worth staying with.", body: "Five movements to help you hold a difficult question without forcing it into a premature answer.", type: "gift", featured: true, coordinates: { x: 84, y: 59, mobileOrder: 3 }, gift: { label: "Keep the Better Question Card", href: "/gifts/better-question-card.pdf", description: "Pearl 3 · A free one-page printable from The Thinker." } },
  { id: "pearl-004", title: "A card game for messages", excerpt: "A small card game I built for myself.", body: "A playful little deck for opening messages, questions, and tiny meanings that arrive better when they are chosen by chance.", type: "card game", featured: false, coordinates: { x: 22, y: 72, mobileOrder: 4 }, gift: { label: "Play the Message Card Game", href: "https://earlessentials.github.io/message/", description: "Pearl 4 · A card game from Pearling’s private toolkit." } },
];
