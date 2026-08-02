# Validation report

## Overall assessment: Share with caveats

The research pack is internally reconciled, source-backed, and structurally ready to share as a dated seed census. It must not be described as exhaustive, as a count of comparable scientific objects, or as proof that every Tier A result is replicated, approved, or settled.

## Methodology review

- The question was reframed from an impossible completeness claim (“all discoveries”) to a dated, provenance-first census with an explicit coverage ledger.
- Inclusion requires a specific novelty claim, a material AI role, inspectable evidence, separate human attribution, and a visible evidence boundary.
- Prediction, validation, rediscovery, capability demonstration, disputed novelty, and conventional automation are separated from strict first-discovery cases.
- Evidence stages are preserved instead of collapsing observations, field checks, cells, organoids, mice, human trials, and computational atlases into one rank.

## Calculation spot-checks

- **Included rows:** verified independently from `discoveries.csv` as 25 unique study-level cases.
- **Represented discipline groups:** verified as 8.
- **Validation tiers:** verified as 22 Tier A and 3 Tier B.
- **Discipline reconciliation:** 11 biomedical + 3 astronomy + 3 materials and chemistry + 2 archaeology and paleontology + 2 neuroscience + 2 planetary and Earth science + 1 ecology and animal behaviour + 1 genomics and virology = 25.
- **Coverage ledger reconciliation:** nonzero coverage counts sum to the same 25 cases.
- **Primary source format:** the build rejects included records without an HTTPS primary-source URL.

The count and discipline queries embedded in `artifact.json` were also executed against an in-memory SQLite import of the CSV and returned the same totals.

## Source and claim review

- Selected high-impact and recent claims were checked against primary papers, DOI records, NASA, PubMed, or official scientific records through the 2 August 2026 cut-off.
- A July 2026 submarine-caldera paper was moved from the included ledger to the definition-boundary ledger after the primary paper showed automated morphometry, principal-component analysis, and expert classification but did not establish a learned AI model.
- The exclusions ledger retains prominent near-misses so future expansions can revisit them without silently changing the discovery definition.
- A complete live HTTP check of every supporting URL was not treated as scientific validation; the source URLs remain inspectable in the CSV and report.

## Report and visualization review

The canonical report builder returned:

- artifact validation: **passed**
- package generation: **passed**
- structural verification: **passed**
- report blocks: 21
- native charts: 1
- metric cards: 4
- tables: 3

The chart uses a zero-based horizontal bar comparison of study-level case coverage by discipline. It does not aggregate heterogeneous discovered-object counts or imply scientific productivity.

## Incomplete handoff checks

No compatible Chromium headless-shell executable was available to the packaged report verifier. The enhanced reader's viewport geometry, extracted chart SVG, source dialog, and source interaction were therefore **not browser-verified**. Exact payload equality, required runtime roots, the reader, and the semantic no-script/print representation passed structural verification. The report remains readable through its semantic fallback.

## Required caveats for stakeholders

- This is a high-confidence seed census, not a systematic review or exhaustive global catalog.
- One row is one reviewed case, not one comparable discovery.
- Tier A means case-appropriate corroboration, not independent replication, clinical approval, or final truth.
- Tier B includes candidate atlases and model-derived maps whose individual entities are mostly unverified.
- Biomedical cases are overrepresented because of both available end-to-end evidence and first-pass search intensity.
- Physics, climate and ocean science, botany, agriculture, and several biological subfields need dedicated reviews.
- Recent 2026 findings may later be corrected, replicated, disputed, or reclassified.
