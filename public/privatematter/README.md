# PRIVATE MATTER hosting

The frontend and contributor studio remain on GitHub Pages at
https://pearlinglim.com/privatematter/. The main website and DNS are unchanged.

The backend is a Cloudflare Worker at
https://private-matter-api.pearling-private-matter.workers.dev/private-matter.
It uses the owner's D1 database and private R2 bucket configured in
`cloudflare/wrangler.jsonc`. Supabase is retained as a migration backup, not a
runtime dependency of this configuration.

## Deploy

Use the repository's installed Node dependencies and authenticate Wrangler in
the owner's Cloudflare account. Never commit database exports, access codes,
code hashes, session tokens or credentials.

```sh
npx wrangler d1 migrations apply private-matter --remote --config cloudflare/wrangler.jsonc
npx wrangler deploy --config cloudflare/wrangler.jsonc
```

The Worker requires two secrets: `FOLIO_CODES_JSON` (the existing access-code
identities and hashes) and `MEDIA_SIGNING_SECRET` (a random HMAC signing secret).
Store them using Wrangler secrets, never in the static application. R2 public
access must remain disabled. Media URLs are short-lived, signed and issued only
after checking article visibility, ownership or reader permissions.

Build the static application with:

```sh
PRIVATE_MATTER_API_URL=https://private-matter-api.pearling-private-matter.workers.dev/private-matter npx vite build --config github-app/vite.config.mts
```

Copy `dist/github-app/` into `public/privatematter/` in the owner's website
repository. Preserve every unrelated website file and its deployment workflow.
The source archive is maintained separately under the publication project.
The legacy `build:owned` and `deploy:owned` scripts describe a different full-site
Worker configuration; do not use them for this GitHub Pages deployment.

## Data and access

D1 stores articles, bylines, publication dates, settings, contributor profiles,
temporary passes, sessions and rate limits. `pm_numbers` retains historical
publication numbering, including gaps left by deleted articles. R2 stores media
under their original IDs. Original ten reader and five contributor codes retain
their roles; only the master identity can manage invitations, dates and deletion.
Temporary access expiry and revocation are enforced on the server.

Invitations support 7, 28, 90, 180 and custom 1–3650 day durations. Public articles
remain free; private and excerpt articles require access for full text. Indonesia
checkout goes to the curator's configured destination; international checkout
goes to https://heypearling.gumroad.com/l/privatematter. Cloudflare's request
country determines the initial choice, with a manual region switch available.

## Verification and recovery

Run `node --test tests/cloudflare-backend.test.mjs tests/cloudflare-media.test.mjs`
using a Node version with `node:sqlite`. Check TypeScript and the production build.
Before cutover, compare article and invitation data with the original backend,
verify media SHA-256 hashes and byte ranges, and test every original code.
Existing sessions are not migrated; readers sign in again with the same codes.

Keep the original Supabase export and original media in private backup storage.
Do not remove the original project during cutover. Reverting the frontend API
endpoint can restore the previous service, but any data written after cutover
must be reconciled first. Cloudflare service quotas and R2 usage billing apply.
