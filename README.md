# AIMathBase

AIMathBase is a source-first registry of mathematical results involving AI: new proofs, counterexamples, algorithmic discoveries, formalizations of known theorems, and capability benchmarks.

The live registry is designed around a simple rule: **the caveat travels with the claim**. Every record separately identifies the mathematical outcome, novelty type, AI role, human role, verification tier, scope limitation, and original evidence.

## What is included

The initial release contains 32 reviewed records across 18 fields, with 48 links to papers, formal-proof repositories, original announcements, expert reviews, project pages, and canonical problem trackers. It is a curated seed, not a claim to contain every AI-assisted result or establish priority.

The registry distinguishes:

- `proved`, `disproved`, `discovered`, `formalized`, and `benchmark` outcomes;
- new results from human–AI work, rediscoveries, formalizations, and capability-only demonstrations;
- formal kernel checking, publication, expert checking, and reported-but-unverified claims.

The public interface includes full-text search, outcome/novelty/evidence/field filters, evidence drawers, stable hash links, and a machine-readable JSON export.

## Architecture

- React + TypeScript + Vite frontend
- Cloudflare Worker API and static-asset delivery
- Cloudflare D1 as the versioned registry database
- SQL migrations checked into the repository
- GitHub issue forms for submissions and corrections

API routes:

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

## Add a record

For a public contribution, use the **Submit an AI-math result** issue form and paste one public post or source URL. Submissions are reviewed and added manually, so publication can take some time. For a local data change:

1. Add a new numbered SQL migration. Do not rewrite an already-deployed migration.
2. Include at least one direct evidence link and a specific caveat.
3. State what the AI did and what people did.
4. Use the narrowest defensible outcome and novelty labels.
5. Apply and inspect the migration locally before opening a pull request.

See [METHODOLOGY.md](./METHODOLOGY.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).

## Data reuse

The API export is intended for research and noncommercial reuse with attribution to AIMathBase and the linked original sources. Source papers, repositories, posts, and project pages retain their own licenses and terms.

## License

The application code is released under the MIT License. Facts and citations remain subject to the rights and terms of their original sources.
