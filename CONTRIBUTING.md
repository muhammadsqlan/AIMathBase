# Contributing

Thanks for helping make AIMathBase more accurate.

## Submit a result

Open the **Submit an AI-math result** issue and paste one public link. It can be an X post, another social post, a paper, a repository, or an announcement.

We analyze submissions ourselves and add suitable entries manually. This can take some time.

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
