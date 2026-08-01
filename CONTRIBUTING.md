# Contributing

Thanks for helping make AIMathBase more accurate.

## Submit a result

Open the **Submit an AI-math result** issue and provide:

- the exact mathematical claim;
- whether it was proved, disproved, discovered, formalized, or used as a benchmark;
- the AI system and its concrete role;
- the human contributors and their role;
- the strongest verification artifact;
- the original X announcement, if one exists;
- a caveat describing what is not established.

Reports without a direct evidence link may be tracked but will not be promoted beyond `reported`.

## Correct a record

Open the **Correct a registry record** issue with the record slug, the disputed field, and a direct source supporting the correction. Priority and novelty corrections are especially welcome.

## Pull requests

Database changes must use a new numbered migration. Run:

```bash
pnpm install
pnpm db:migrate:local
pnpm check
```

Keep summaries factual and compact. Avoid promotional language, model leaderboard claims, and unsupported “first ever” wording.
