# Contributing

Thanks for helping make Science Board and its Mathematics board more accurate.

## Submit a result

Open the submission issue and provide direct public sources. For Mathematics, this can be an original announcement, paper, formal-proof repository, project page, or canonical problem entry. For other sciences, prefer the paper or primary scientific artifact plus an independent validation source when one exists.

We analyze submissions ourselves and add suitable entries manually. This can take some time.

## Correct a record

Open the **Correct a registry record** issue with the record slug, the disputed field, and a direct source supporting the correction. Priority and novelty corrections are especially welcome.

## Pull requests

Mathematics database changes must use a new numbered migration. Cross-science changes must update the inspectable research ledger and regenerate the public registry artifact from the same reviewed rows. Run:

```bash
pnpm install
pnpm db:migrate:local
pnpm check
```

Keep summaries factual and compact. Separate the AI contribution from human scientific work, retain validation limits, and keep a specific caveat on every record. Avoid promotional language, model leaderboard claims, and unsupported “first ever” wording.
