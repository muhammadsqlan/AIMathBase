# Science Board

Science Board is a provenance-first registry of discoveries made with AI across scientific disciplines. The original AIMathBase experience remains intact as the dedicated [Mathematics board](https://scienceboard.sqlan.workers.dev/math).

The live product follows one rule: **the caveat travels with the claim**. Science records keep the AI contribution, human scientific work, validation stage, source links, novelty scope, and limiting caveat separate. Mathematics keeps its existing outcome, novelty, formal-verification, attribution, and source model.

## Current reviewed coverage

The cross-science seed census contains 25 reviewed study-level cases in eight populated discipline groups: astronomy; Earth and planetary science; archaeology and paleontology; chemistry and materials; biomedical science; genomics and virology; ecology and animal behaviour; and neuroscience. Twenty-two are Tier A and three are Tier B under the science methodology.

The Mathematics board contains 42 reviewed records across 25 mathematical fields, with links to papers, formal-proof repositories, original announcements, expert reviews, project pages, and canonical problem trackers.

These are curated collections, not systematic reviews, claims of completeness, or proof of historical priority. Under-audited boards explicitly display **Research in progress** instead of implying that no discoveries exist.

Science Board currently exposes 15 broad boards spanning formal, natural, applied, and social sciences. Nine contain reviewed records, including Mathematics; the other six are marked **Research in progress** and define the next audit areas.

## Mathematics board

The unchanged AIMathBase interface distinguishes:

- `proved`, `disproved`, `discovered`, `formalized`, and `benchmark` outcomes;
- new results from human–AI work, rediscoveries, formalizations, and capability-only demonstrations;
- formal kernel checking, publication, expert checking, and reported-but-unverified claims.

Its interface retains full-text search, outcome/novelty/evidence/field filters, evidence drawers, the source-backed lab leaderboard, stable hash links, and its JSON export. Leaderboard rank uses the count of records labelled `new-result`; outcome and verification counts remain separate.

## Architecture

- React + TypeScript + Vite frontend
- Cloudflare Worker API and static-asset delivery
- Cloudflare D1 for the versioned Mathematics registry
- A versioned, inspectable cross-science research artifact and public JSON asset
- SQL migrations checked into the repository for Mathematics changes
- GitHub issue forms for submissions and corrections

API routes:

- `GET /api/science`
- `GET /api/science/records/:id`
- `GET /api/science/export.json`
- `GET /api/science/export.json?board=:slug`
- `GET /api/records`
- `GET /api/records/:slug`
- `GET /api/meta`
- `GET /api/export.json`
- `GET /api/health`

## Run locally

Use Node 22 or newer and pnpm.

```bash
pnpm install
pnpm db:migrate:local
pnpm build
pnpm cf:dev
```

Open `http://127.0.0.1:8787`.

Run the complete local validation:

```bash
pnpm check
```

## Deployment and legacy URL

- Canonical product: `https://scienceboard.sqlan.workers.dev/`
- Mathematics board: `https://scienceboard.sqlan.workers.dev/math`
- Legacy AIMathBase hostname: `https://aimathbase.sqlan.workers.dev/` permanently redirects browser navigation to the new Mathematics board.
- Legacy `/api/*` routes remain available for existing integrations.

The two Workers share the same built assets, Worker code, and D1 binding. Deploy the canonical Worker first and the legacy redirect second:

```bash
pnpm cf:deploy
pnpm cf:deploy:legacy
```

## Add a reviewed record

For a public contribution, use the submission issue form and provide direct sources. Submissions are reviewed and added manually.

For Mathematics:

1. Add a new numbered SQL migration. Do not rewrite an already-deployed migration.
2. Include at least one direct evidence link and a specific caveat.
3. State what the AI did and what people did.
4. Use the narrowest defensible outcome and novelty labels.
5. Apply and inspect the migration locally before opening a pull request.

For a science-board record, update the bounded research ledger and regenerate `artifact.json` and `public/data/science-registry.json` from the same reviewed data. Preserve the AI role, human role, evidence stage, tier, source links, exact reported result, and caveat.

See the [Mathematics methodology](./METHODOLOGY.md), [science methodology](./docs/research/ai-science-discoveries-2026-08-02/METHODOLOGY.md), and [contribution guide](./CONTRIBUTING.md).

## Data reuse

The API exports are intended for research and noncommercial reuse with attribution to Science Board/AIMathBase and the linked original sources. Source papers, repositories, posts, and project pages retain their own licenses and terms.

## License

The application code is released under the MIT License. Facts and citations remain subject to the rights and terms of their original sources.
