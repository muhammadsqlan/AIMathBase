# AI-enabled scientific discoveries: audit method

**Cut-off:** 2 August 2026

**Status:** high-confidence seed census, not an exhaustive catalog

**Audience:** AIMathBase product and research stakeholders

## What this pack answers

This pack answers a narrower, defensible version of “all discoveries made by AI to date”:

> Which well-documented scientific findings can be traced to a material AI contribution and to an inspectable primary or authoritative source, and what does the evidence actually establish?

No database can currently prove completeness across every scientific field. “AI” and “discovery” are used inconsistently, many papers never advertise the computational role in their title or abstract, and one catalog row can represent anything from one molecule to more than one hundred thousand mapped objects. The pack therefore reports **reviewed cases**, never a total number of discoveries made by AI.

## Inclusion rule

A case is included only when all of the following are present:

1. A specific new object, event, species, pattern, relationship, mechanism, material, formulation, target, or therapeutic candidate is stated.
2. Machine learning, deep learning, generative AI, an agentic system, or an explicitly AI-led closed-loop search made a material contribution to finding or proposing it.
3. A primary paper, official scientific record, or authoritative institutional source is inspectable.
4. The role of researchers is stated separately from the role of the AI.
5. The evidence stage and the strongest caveat are recorded.

Conventional automation, simulation, database search, or optimization is not automatically treated as AI. A predictive benchmark is not counted unless it also yields a novel scientific claim or object. A press release without a traceable primary result is not enough.

## Validation tiers

- **Tier A — empirical or observational corroboration.** The AI-enabled finding was checked using direct observation, field verification, wet-lab work, an animal model, a human study, manual reconstruction, or another case-appropriate empirical method. Tier A does **not** mean replicated, approved, clinically effective, or free of controversy.
- **Tier B — published computational or statistical result with partial validation.** The work is peer reviewed or equivalently documented and has performance checks, expert classification, targeted molecular confirmation, or experimental matches, but most reported objects or candidates remain unverified individually.
- **Tier C — published hypothesis or design awaiting empirical confirmation.** These are kept out of the included ledger in this edition and may be represented in the exclusions ledger.

## Novelty and attribution rules

- A rediscovery of a known or co-timed human result is labelled **rediscovery**, not a second discovery.
- Statistical validation of an already detected candidate is labelled **validation**, not first discovery.
- A predicted structure atlas is not silently converted into experimentally confirmed objects.
- A repurposed molecule can count as a new function or indication without being called a new molecule.
- A successful cell, organoid, animal, or phase 2a result is not described as an approved treatment.
- Human work—problem selection, data collection, instrument operation, candidate choice, laboratory work, field checks, proofreading, and interpretation—is always preserved.

## Search and source procedure

The initial sweep used cross-field queries for AI- or machine-learning-enabled discovery in astronomy, planetary and Earth science, archaeology, paleontology, materials, chemistry, biology, medicine, genomics, virology, ecology, animal behaviour, neuroscience, and physics. Candidate claims were then checked against primary papers, DOI records, public scientific registries, or official scientific institutions. Review and source checking continued through the cut-off date.

The source columns in `discoveries.csv` preserve the primary URL plus one supporting URL when useful. The exclusions ledger records influential near-misses so future work does not repeatedly inflate the catalog with predictions, rediscoveries, capability demonstrations, or disputed novelty.

## Coverage and limitations

The 25 included rows cover eight broad discipline groups. Biomedical science is deliberately overrepresented because it currently offers the clearest end-to-end chain from AI selection or generation to laboratory or clinical testing. Physics, botany, agriculture, climate science, oceanography, and several areas of biology remain under-audited; zero included rows means **no strict case was added in this sweep**, not that none exists.

Other limitations:

- The search is broad but not a formal systematic review with database-specific reproducible queries and dual independent screeners.
- Publication and English-language indexing bias are likely.
- Source authors sometimes use “discovery” more broadly than this audit.
- Evidence stages are heterogeneous and must not be ranked as if they shared one denominator.
- The newest 2026 papers may receive corrections, replications, or contrary evidence.
- A catalog row is a reviewed study-level case, not a comparable discovery unit.

## Chart contract

- **Question:** Which discipline groups are represented in this reviewed seed catalog?
- **Takeaway:** Biomedical cases dominate this first pass; the chart measures audit coverage, not scientific importance or the number of objects discovered.
- **Form:** sorted horizontal bar chart, one measure (`included_cases`) by discipline.
- **Data:** eight rows, retaining Tier A, Tier B, earliest-year, and latest-year context for auditability.
- **Scale:** zero baseline; exact case counts; no redundant legend.
- **Palette:** single blue root plus neutral scaffolding; category identity comes from labels and order, not color.
- **Delivery:** native chart in `artifact.json`, packaged into the self-contained `report.html` reader.

## What a genuinely comprehensive registry would require

1. A living, versioned registry rather than a one-off article.
2. Dedicated search protocols and subject-matter reviewers for each discipline.
3. Separate statuses for reported, peer reviewed, independently replicated, experimentally corroborated, and deployed or approved.
4. Separate novelty classes for new discovery, human–AI co-discovery, rediscovery, validation, prediction, and capability demonstration.
5. Source versioning so corrections, retractions, replications, and priority disputes can update a record without erasing history.

If this research is integrated into AIMathBase, it should use a new domain-neutral migration and preserve the existing mathematics records and user interface until the expanded taxonomy is reviewed.
