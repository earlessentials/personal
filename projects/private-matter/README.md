# PRIVATE MATTER

Private editorial publication by Pearling Lim, prepared for `https://www.pearlinglim.com/privatematter`.

## Source

[Download the complete editable source](./private-matter-source.tar.gz). Extract it into its own directory, then run `npm ci` and `npm run build:owned`. The archive includes the full application, package lock, database schema and migrations, fonts, and own-hosting configuration. Read `OWN_HOSTING.md` inside for deployment details.

SHA-256: `beb49439e39dbdb8737760aa8174790db2cbc4f016b109288d4b46721c0626a9`

The source is archived separately because this repository's existing Next.js build automatically includes TypeScript files throughout the repository. This preserves Pearl's Cove's build and pages unchanged.

## Status

Prepared and verified locally: 109 production checks passed for all ten reader codes, contributor roles, Pearling's administrator access, empty publication, protected uploads, payment settings, logout, and routes under `/privatematter`.

The domain route is **not live yet**. The owner's hosting and domain account must be connected before deployment. GitHub Pages cannot run the secure publishing backend. The included Cloudflare configuration runs the entire publication in the owner's account, including D1 and R2, and routes only `/privatematter` and its children. It does not redirect to or depend on a ChatGPT site.

Access codes, their secret configuration, sessions, private data, and uploads are intentionally excluded from this source archive. Existing reader and contributor codes must be transferred securely as a runtime secret.

No existing website page, navigation, deployment workflow, domain configuration, or public asset is changed by this source addition.
