export const site = {
  title: "Pearl's Cove",
  subtitle: "Aimlessly seaworthy. Chronically mid-thought.",
  entranceLabel: "Break into Pearl’s Cove",
  description:
    "An explorable personal world of ideas, work, stories, experiments, and curiosities beneath the sea.",
  contactEmail: "pearling@storyempowers.com",
  copyright: "© 2026 Pearling Lim. All Rights Reserved",
  socials: [
    { platform: "instagram", label: "Instagram", handle: "@earl.essentials", url: "https://www.instagram.com/earl.essentials" },
    { platform: "instagram", label: "Instagram", handle: "@heypearling", url: "https://www.instagram.com/heypearling" },
    { platform: "instagram", label: "Instagram", handle: "@getsupearl", url: "https://www.instagram.com/getsupearl" },
    { platform: "tiktok", label: "TikTok", handle: "@heypearling", url: "https://www.tiktok.com/@heypearling" },
    { platform: "tiktok", label: "TikTok", handle: "@pear.ling", url: "https://www.tiktok.com/@pear.ling" },
    { platform: "linkedin", label: "LinkedIn", handle: "Pearling Lim", url: "https://www.linkedin.com/in/pearlinglim" },
    { platform: "youtube", label: "YouTube", handle: "Pearling Lim", url: "https://www.youtube.com/channel/UC6rmQAThyyrTlvreK_rJy1w" },
    { platform: "email", label: "Email", handle: "hi@pearlinglim.com", url: "mailto:hi@pearlinglim.com" },
  ],
} as const;

export type SiteConfig = typeof site;
