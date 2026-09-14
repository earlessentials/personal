# Alternative Timeline

LIFE TIMELINE is a playful, browser-based life simulation by Pearling Lim.

Live application: https://pearlinglim.com/alternativetimeline/

The finished static application is in `public/alternativetimeline/`. GitHub Pages publishes that directory alongside the existing website. Every application resource stays under `/alternativetimeline/`.

## Editable source

Extract `source.zip` into a separate working directory. It contains the complete React application, original artwork and music, simulation content, tests, and dependency lockfile. Use Node.js 22.13 or newer.

```sh
pnpm install --frozen-lockfile
NEXT_PUBLIC_BASE_PATH=/alternativetimeline pnpm build
NEXT_PUBLIC_BASE_PATH=/alternativetimeline node scripts/test-deployment.mjs
```

Copy the resulting `dist/client/alternativetimeline/` to this repository's `public/alternativetimeline/`. Commit the refreshed source archive with future releases.

The source archive keeps the application dependencies separate from the main website build. The existing website files and deployment workflow remain intact.

© 2026 Pearling Lim. All Rights Reserved
