# AIMathBase methodology

Version 1.1 — August 2, 2026

## Inclusion rule

A record needs all three of the following:

1. A precise mathematical claim or a clearly identified capability benchmark.
2. A public source that describes a material AI contribution.
3. Evidence that can be inspected: a paper, formal proof, author announcement, project artifact, expert review, or canonical problem-tracker entry.

An X post can establish provenance for an announcement, but it is not automatically evidence that the mathematics is correct. Where possible, the record links the original post and a stronger mathematical artifact.

## Labels

### Outcome

- **Proved:** a stated theorem or conjecture has a proof supported by the cited evidence.
- **Disproved:** a counterexample or contradiction refutes a stated conjecture.
- **Discovered:** a new construction, bound, formula, or algorithm was found without claiming a theorem proof.
- **Formalized:** a previously known result was encoded and kernel-checked.
- **Benchmark:** known tasks measure capability but do not establish new research priority.

### Novelty

- **New result:** the cited authors report mathematical novelty and no known prior result has been identified in our review.
- **Human + AI:** the final contribution materially combines model output with human selection, repair, refinement, or proof.
- **Rediscovery:** substantially equivalent prior literature exists.
- **Formalization:** the principal novelty is machine-checked encoding of known mathematics.
- **Capability only:** the task was already solved or created as an evaluation.

### Verification

- **Formally checked:** a proof assistant’s trusted kernel accepts the relevant formal statement. This verifies the encoded statement, not automatically its fidelity to an informal headline.
- **Published:** a paper or comparable research report presents reproducible artifacts or peer-reviewed evidence.
- **Expert checked:** named mathematicians or a specialist project report checking the result, without a public formal proof.
- **Reported:** an announcement exists but stronger independent evidence has not yet been located.

## Leaderboard

The lab leaderboard ranks AI labs and system-building research teams by their number of registry records labelled **New result**. The score is a count, not a weighted points formula.

- One qualifying registry record contributes one score unit, even when an aggregate source contains several theorems or counterexamples.
- A shared result contributes one credited record to each named lab or system-building team. Totals across labs can therefore exceed the number of unique registry records.
- New proofs, new disproofs, and new discoveries are reported separately.
- Human–AI results, rediscoveries, formalizations, and capability benchmarks remain visible in a lab's credited record total but do not increase its new-result score.
- Formal checking is an evidence category, not a novelty multiplier, and is reported in a separate column.
- Attribution is stored per record from the cited artifact. It is not inferred at request time from model-name text.

## Editorial safeguards

- Keep partial results partial. A density-one theorem is not the full conjecture.
- Keep formalization separate from discovery.
- Record rediscovery when priority changes after an announcement.
- Describe AI and human work separately.
- Attach a scope note to every record.
- Prefer direct sources over summaries and discovery indexes.
- Correct the public record through a versioned migration rather than silently rewriting history.

## Coverage limits

This is an expanding curated registry, not an exhaustive census. The initial research sweep prioritizes public English-language claims with accessible evidence and includes foundational pre-2025 work plus a larger 2025–2026 sample. Missing records should be submitted through GitHub. Priority judgments remain provisional when the source itself has not completed a literature review.

The community-maintained [Erdős Problems AI ledger](https://github.com/teorth/erdosproblems/wiki/AI-contributions-to-Erd%C5%91s-problems) was used to cross-check tracked problem statuses. The independent [AI Math Index](https://aimath.robertj1.com/) was used as a discovery lead only; summaries in AIMathBase were checked against direct artifacts rather than copied from that index.
