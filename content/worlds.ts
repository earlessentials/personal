export type World = {
  id: string;
  title: string;
  shellType: "nautilus" | "conch" | "scallop" | "spiral" | "clam";
  shortDescription: string;
  introduction: string;
  environment: string;
  coordinates: { x: number; y: number; mobileOrder: number };
  prompt: string;
  sections: { title: string; body: string; meta: string }[];
};

export const worlds: World[] = [
  {
    id: "thinker",
    title: "The Thinker",
    shellType: "nautilus",
    shortDescription: "Questions, notes, and ideas still forming.",
    introduction: "[WORLD INTRODUCTION: a quiet chamber for thought, doubt, and observation.]",
    environment: "The moonlit reading chamber",
    coordinates: { x: 17, y: 25, mobileOrder: 1 },
    prompt: "Follow a thought",
    sections: [
      { title: "[FEATURED THOUGHT TITLE]", body: "[SHORT REFLECTION]", meta: "Featured thought" },
      { title: "[QUESTION I HAVE NOT ANSWERED YET]", body: "[A QUESTION STILL BEING CARRIED]", meta: "Open question" },
      { title: "[IDEA CURRENTLY FORMING]", body: "[NOTES FROM THE EDGE OF AN IDEA]", meta: "Still becoming" },
    ],
  },
  {
    id: "strategist",
    title: "The Strategist",
    shellType: "conch",
    shortDescription: "Routes, signals, positioning, and useful choices.",
    introduction: "[WORLD INTRODUCTION: a chart room for finding the clearest route.]",
    environment: "The submerged chart room",
    coordinates: { x: 50, y: 15, mobileOrder: 2 },
    prompt: "Read the currents",
    sections: [
      { title: "[STRATEGIC PRINCIPLE]", body: "[HOW I THINK ABOUT A HARD DECISION]", meta: "Compass" },
      { title: "[SELECTED FRAMEWORK]", body: "[A SIMPLE WAY TO MAKE THE PROBLEM VISIBLE]", meta: "Instrument" },
      { title: "[CASE STUDY PLACEHOLDER]", body: "[PROBLEM, ROUTE, AND RESULT]", meta: "Mapped expedition" },
    ],
  },
  {
    id: "builder",
    title: "The Builder",
    shellType: "clam",
    shortDescription: "Prototypes, tools, systems, and beautiful attempts.",
    introduction: "[WORLD INTRODUCTION: an underwater workshop where ideas acquire edges.]",
    environment: "The pearl-powered workshop",
    coordinates: { x: 82, y: 27, mobileOrder: 3 },
    prompt: "See what’s becoming",
    sections: [
      { title: "[CURRENTLY BUILDING]", body: "[ONE-SENTENCE PREMISE]", meta: "Becoming" },
      { title: "[EXAMPLE PROJECT]", body: "[WHY IT EXISTS AND WHAT IT TAUGHT ME]", meta: "Prototype" },
      { title: "[ABANDONED BEAUTIFULLY]", body: "[AN UNFINISHED THING WORTH KEEPING]", meta: "Unfinished" },
    ],
  },
  {
    id: "storyteller",
    title: "The Storyteller",
    shellType: "scallop",
    shortDescription: "Narratives, campaigns, scripts, and small truths.",
    introduction: "[WORLD INTRODUCTION: a shell-stage for stories told and untold.]",
    environment: "The scallop amphitheatre",
    coordinates: { x: 28, y: 71, mobileOrder: 4 },
    prompt: "Raise the curtain",
    sections: [
      { title: "[DRAFT STORY]", body: "[A CALM EDITORIAL EXCERPT LIVES HERE]", meta: "Still writing" },
      { title: "[SELECTED CLIENT NARRATIVE]", body: "[THE STORY BEFORE AND AFTER]", meta: "Told elsewhere" },
      { title: "[CAMPAIGN CONCEPT]", body: "[THE CENTRAL IDEA AND ITS SHAPE]", meta: "Concept" },
    ],
  },
  {
    id: "explorer",
    title: "The Explorer",
    shellType: "spiral",
    shortDescription: "Curiosities, collections, and the edge of the map.",
    introduction: "[WORLD INTRODUCTION: the map becomes less reliable from here.]",
    environment: "The uncharted edge",
    coordinates: { x: 72, y: 73, mobileOrder: 5 },
    prompt: "Follow a random current",
    sections: [
      { title: "[CURRENT CURIOSITY]", body: "[WHAT I AM LEARNING AND WHY IT HAS ME]", meta: "Current obsession" },
      { title: "[THING THAT CHANGED MY MIND]", body: "[A DISCOVERY I DID NOT EXPECT]", meta: "Field note" },
      { title: "[UNFINISHED RESEARCH]", body: "[CLUES WITHOUT A CONCLUSION]", meta: "Map ends here" },
    ],
  },
];

export const worldById = (id: string) => worlds.find((world) => world.id === id);
