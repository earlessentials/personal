# PRIVATE MATTER

The private publication lives at https://pearlinglim.com/privatematter/.

The static reading experience and contributor studio are deployed from
`public/privatematter/` by this repository’s existing GitHub Pages workflow.
The backend runs in the owner’s Supabase Free project `cdyzpgvamzeweiwyfzcm`.
No main-site pages, domain configuration or deployment workflow are changed.

`private-matter-source.tar.gz` contains the complete editable source, database
migrations, function and tests. Extract it into a separate working directory:
its package and build configuration are independent of the main Next.js site.

Ten reader codes and five contributor codes are retained in encrypted backend
configuration. Pearling has dual reader/contributor administrator access.
Codes, hashes and service credentials are intentionally absent from this repo.

Contributors can create drafts, publish public/private/excerpt articles, revise
their own work, enter a writer name on each draft, upload images and videos, and
embed YouTube videos. Only Pearling’s master access can delete drafts or published
matters. Publication dates appear throughout the reading experience and stay
unchanged when an article is revised. The initial
publication is empty. Payments and reader-code delivery remain external.

Verification: nine local PostgreSQL test groups, TypeScript, production build,
115 initial hosted checks and 47 update checks passed (27 September 2026). Live checks covered every original
code, roles, publishing ownership, private media and video byte ranges. All test
articles and uploaded files were removed before deployment.

Supabase Free service limits and inactivity pausing apply. No paid plan or
Cloudflare service was activated for this deployment.
