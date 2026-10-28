# Pearl’s Cove

An original, responsive personal-brand world built with Next.js, React, TypeScript, SVG, and CSS animation. The supplied `Sea.mp4` is used as the living water layer; all shells, oysters, the compass, turtle, bottle, and pearls are original temporary SVG illustrations.

This is a website repository, not an installable AI agent skill. See [SECURITY_REVIEW.md](SECURITY_REVIEW.md) for the review of the AI Skill Shield report and the dependency fixes.

## Run locally

```bash
npm ci --ignore-scripts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

This repository is prepared for GitHub Pages under a public repository named `personal`.

Pushing to the `main` branch runs `.github/workflows/deploy.yml`, installs the locked dependencies with lifecycle scripts disabled, builds the static export at the domain root, and publishes the `out/` folder to GitHub Pages.

Expected public URL:

```text
https://pearlinglim.com/
```

## Edit the content

All replaceable copy and information architecture live in `content/`:

- `site.ts`: site title, subtitle, description, social links, and contact email
- `worlds.ts`: the five editable worlds, shell types, positions, and sections
- `pearls.ts`: Pearl Archive entries and map coordinates
- `drift.ts`: unstructured Drift scraps
- `services.ts`: oyster collaboration details

The site name is configured once in `content/site.ts`; it is not duplicated through page components. Text in square brackets is intentionally placeholder copy. No fake names, clients, achievements, or results are present.

## Replace the temporary art

The inline temporary vectors are in `components/MarineArt.tsx`. Replace one component at a time with an optimized SVG or Next Image asset while retaining the existing accessible label and CSS class. Final dimensions, formats, and art notes are in `public/art/ASSET-MANIFEST.md`.

The sea footage is served from `public/media/sea.mp4`. For production, export a web-optimized H.264 MP4 (and ideally WebM) near 1920 × 1080, remove audio, and aim for 4–8 MB. Keep `public/art/sea-poster.svg` as the loading fallback or replace it with a compressed still.

## Routes

- `/` — interactive sea map
- `/worlds/[thinker|strategist|builder|storyteller|explorer]`
- `/pearls`, `/drift`, `/play`, `/services`, `/contact`

The map is the primary navigation. The compass is a complete keyboard-accessible alternative. Pearl and compass dialogs support Escape, visible focus, focus entry, and focus restoration. The experience also has a `prefers-reduced-motion` mode and a mobile-specific vertical journey.

## Contact and launch checklist

The contact and collaboration forms validate required fields and POST the visitor's submitted fields to FormSubmit, addressed to the public contact email in `content/site.ts`. The `_next` field is a public return URL ending in `/thanks/`, configured by `NEXT_PUBLIC_SITE_URL`. It is not a secret. The forms do not enumerate or submit private environment variables.

FormSubmit may require one-time activation by the recipient. Do not commit SMTP passwords, API keys, or provider secrets to a public repository.

Before launch: optimize the video, provide a real Open Graph image, update the production domain in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts`, run automated accessibility checks, and test keyboard and touch interactions on target devices.
