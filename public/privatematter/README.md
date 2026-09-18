# PRIVATE MATTER — GitHub Pages edition

This directory is the empty, public editorial edition at
https://pearlinglim.com/privatematter/.

It is independent HTML and CSS, copied unchanged by the existing Next.js export.
It adds no server, third-party hosting, checkout, analytics, or external assets.
The homepage, other website pages, DNS and deployment workflow are unchanged.

## Publishing

The owner publishes through commits to `earlessentials/personal` on GitHub. The
existing Pages workflow deploys changes to `public/privatematter/` automatically.
Only approved public writing or public media should be committed here. The
publication starts empty, with no demonstration topics or articles.

Future articles can include text, images, HTML video players and YouTube embeds.
YouTube videos remain hosted by YouTube. GitHub repository and Pages storage and
bandwidth limits apply to uploaded media.

## Access and privacy

GitHub Pages does not run the server required for private reader sessions,
contributor-code publishing or protected uploads. This edition has no code gate
and makes no promise of private access. No access codes, code hashes, sessions,
drafts or private media are included. Do not add browser-only password checking
as a replacement for server authorization.

The complete private application is preserved separately at
`projects/private-matter/private-matter-source.tar.gz`. Its backend features
require compatible application hosting before they can be activated.

Reader payments are not collected by this edition. See
https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
before changing this into a commercial service.

## Design

Local editorial fonts are supplied under the accompanying OFL.txt license.
The four HTML files and style.css are editable source; no build is needed for
this directory itself. In the original application workspace, regenerate with
`node scripts/github-pages.mjs`.
