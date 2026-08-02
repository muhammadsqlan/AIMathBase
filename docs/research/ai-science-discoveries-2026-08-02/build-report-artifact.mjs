import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const baseDir = dirname(fileURLToPath(import.meta.url));
const generatedAt = "2026-08-02T07:21:56+05:00";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (character === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    if (row.some((value) => value !== "")) rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  return dataRows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

const discoveries = parseCsv(readFileSync(join(baseDir, "discoveries.csv"), "utf8")).map((row) => ({
  ...row,
  publication_year: Number(row.publication_year),
}));
const exclusions = parseCsv(readFileSync(join(baseDir, "exclusions.csv"), "utf8"));
const coverage = parseCsv(readFileSync(join(baseDir, "coverage_ledger.csv"), "utf8")).map((row) => ({
  ...row,
  included_cases: Number(row.included_cases),
}));

const uniqueIds = new Set(discoveries.map((row) => row.id));
const tierACases = discoveries.filter((row) => row.validation_tier === "A").length;
const tierBCases = discoveries.filter((row) => row.validation_tier === "B").length;
const disciplines = [...new Set(discoveries.map((row) => row.discipline))];
const coverageTotal = coverage.reduce((sum, row) => sum + row.included_cases, 0);

if (discoveries.length !== 25 || uniqueIds.size !== discoveries.length) {
  throw new Error(`Expected 25 unique discovery cases; found ${discoveries.length} rows and ${uniqueIds.size} unique ids.`);
}
if (tierACases !== 22 || tierBCases !== 3) {
  throw new Error(`Expected Tier A/B counts of 22/3; found ${tierACases}/${tierBCases}.`);
}
if (disciplines.length !== 8 || coverageTotal !== discoveries.length) {
  throw new Error(`Coverage reconciliation failed: ${disciplines.length} disciplines and ${coverageTotal}/${discoveries.length} cases.`);
}
for (const row of discoveries) {
  if (!row.primary_source_url.startsWith("https://")) {
    throw new Error(`Discovery ${row.id} lacks an HTTPS primary source.`);
  }
}

const disciplineSummary = disciplines
  .map((discipline) => {
    const rows = discoveries.filter((row) => row.discipline === discipline);
    return {
      discipline,
      included_cases: rows.length,
      tier_a_cases: rows.filter((row) => row.validation_tier === "A").length,
      tier_b_cases: rows.filter((row) => row.validation_tier === "B").length,
      earliest_year: Math.min(...rows.map((row) => row.publication_year)),
      latest_year: Math.max(...rows.map((row) => row.publication_year)),
      catalog_share_pct: Number(((rows.length / discoveries.length) * 100).toFixed(1)),
    };
  })
  .sort((left, right) => right.included_cases - left.included_cases || left.discipline.localeCompare(right.discipline));

const summary = [{
  reviewed_cases: discoveries.length,
  discipline_groups: disciplines.length,
  tier_a_cases: tierACases,
  tier_b_cases: tierBCases,
  cut_off_date: "2026-08-02",
}];

const sources = [
  {
    id: "summary_source",
    label: "Discovery-ledger summary query",
    path: "discoveries.csv",
    query: {
      engine: "sqlite",
      language: "sql",
      id: "discovery-summary-2026-08-02",
      sql: "SELECT COUNT(*) AS reviewed_cases, COUNT(DISTINCT discipline) AS discipline_groups, SUM(CASE WHEN validation_tier = 'A' THEN 1 ELSE 0 END) AS tier_a_cases, SUM(CASE WHEN validation_tier = 'B' THEN 1 ELSE 0 END) AS tier_b_cases, '2026-08-02' AS cut_off_date FROM discoveries;",
      description: "Reconciles the included row count, represented disciplines, and validation tiers.",
      executed_at: generatedAt,
      filters: [
        "Input table discoveries is imported from discoveries.csv with its header row",
        "Cut-off date: 2026-08-02",
        "One row per reviewed study-level case",
      ],
      metric_definitions: [
        "reviewed_cases = count of included rows; it is not a count of comparable scientific objects",
        "discipline_groups = distinct broad discipline labels among included rows",
        "Tier A = case-appropriate empirical or observational corroboration; it does not imply replication, approval, or settled truth",
        "Tier B = published computational or statistical result with partial validation; most reported entities remain unverified individually",
      ],
      tables_used: ["discoveries.csv imported as discoveries"],
    },
  },
  {
    id: "discipline_summary_source",
    label: "Cases-by-discipline query",
    path: "discoveries.csv",
    query: {
      engine: "sqlite",
      language: "sql",
      id: "discipline-coverage-2026-08-02",
      sql: "SELECT discipline, COUNT(*) AS included_cases, SUM(CASE WHEN validation_tier = 'A' THEN 1 ELSE 0 END) AS tier_a_cases, SUM(CASE WHEN validation_tier = 'B' THEN 1 ELSE 0 END) AS tier_b_cases, MIN(CAST(publication_year AS INTEGER)) AS earliest_year, MAX(CAST(publication_year AS INTEGER)) AS latest_year, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM discoveries), 1) AS catalog_share_pct FROM discoveries GROUP BY discipline ORDER BY included_cases DESC, discipline ASC;",
      description: "Aggregates reviewed cases by broad discipline while retaining tier, year-range, and catalog-share context.",
      executed_at: generatedAt,
      filters: [
        "Input table discoveries is imported from discoveries.csv with its header row",
        "Cut-off date: 2026-08-02",
        "Unweighted count of study-level cases",
      ],
      metric_definitions: [
        "included_cases = included ledger rows in the discipline",
        "catalog_share_pct = discipline rows divided by all included rows; it measures this audit's composition, not scientific productivity",
      ],
      tables_used: ["discoveries.csv imported as discoveries"],
    },
  },
  {
    id: "discoveries_source",
    label: "Reviewed AI-enabled scientific discovery ledger",
    path: "discoveries.csv",
    query: {
      engine: "sqlite",
      language: "sql",
      id: "discovery-detail-2026-08-02",
      sql: "SELECT id, CAST(publication_year AS INTEGER) AS publication_year, discipline, field, title, discovery_class, ai_role, human_role, evidence_stage, validation_tier, novelty_scope, reported_result, primary_source_url, supporting_source_url, caveat FROM discoveries ORDER BY publication_year DESC, id ASC;",
      description: "Study-level cases meeting the five-part inclusion rule, with primary links and explicit evidence boundaries.",
      executed_at: generatedAt,
      filters: [
        "Cut-off date: 2026-08-02",
        "One row per reviewed study-level case, not per discovered object",
        "Requires a material AI role, a specific scientific novelty claim, and inspectable primary or authoritative evidence",
        "Predictions without corroboration, rediscoveries, validation-only cases, and capability demonstrations are excluded from the strict ledger",
      ],
      metric_definitions: [
        "reviewed_cases = count of included rows; it is not a count of comparable scientific objects",
        "Tier A = case-appropriate empirical or observational corroboration; it does not imply replication, approval, or settled truth",
        "Tier B = published computational or statistical result with partial validation; most reported entities remain unverified individually",
      ],
      tables_used: ["discoveries.csv"],
    },
  },
  {
    id: "exclusions_source",
    label: "Adjacent and excluded claims ledger",
    path: "exclusions.csv",
    query: {
      engine: "sqlite",
      language: "sql",
      id: "exclusion-detail-2026-08-02",
      sql: "SELECT id, year, area, claim_or_system, classification, why_not_counted_as_a_strict_discovery, source_url, revisit_condition FROM exclusions ORDER BY year DESC, id ASC;",
      description: "Influential claims kept outside the strict discovery count because they are validation-only, predictive, rediscovered, contested, or capability demonstrations.",
      executed_at: generatedAt,
      filters: ["Reviewed through 2026-08-02", "Exclusion is methodological and may be revisited when evidence changes"],
      tables_used: ["exclusions.csv"],
    },
  },
  {
    id: "coverage_source",
    label: "Discipline coverage ledger",
    path: "coverage_ledger.csv",
    query: {
      engine: "sqlite",
      language: "sql",
      id: "coverage-detail-2026-08-02",
      sql: "SELECT discipline, CAST(included_cases AS INTEGER) AS included_cases, review_status, what_was_covered, main_gap_or_next_search FROM coverage ORDER BY included_cases DESC, discipline ASC;",
      description: "Coverage status and known gaps for this first cross-science sweep.",
      executed_at: generatedAt,
      filters: ["Included-case counts reconcile to discoveries.csv", "Zero means no strict case was added in this sweep, not proof that none exists"],
      tables_used: ["coverage_ledger.csv"],
    },
  },
  {
    id: "methodology_source",
    label: "Audit methodology",
    path: "METHODOLOGY.md",
    query: {
      engine: "document",
      language: "markdown",
      description: "Definitions, inclusion rule, validation tiers, source procedure, limitations, and requirements for a living registry.",
      executed_at: generatedAt,
      tables_used: ["METHODOLOGY.md"],
    },
  },
];

const artifact = {
  surface: "report",
  manifest: {
    version: 1,
    surface: "report",
    title: "AI-enabled scientific discoveries: audited seed census",
    description: "A provenance-first cross-science ledger through 2 August 2026, separating observed or experimentally supported findings from candidate atlases, rediscoveries, validations, and capability demonstrations.",
    generatedAt,
    cards: [
      {
        id: "reviewed_cases_card",
        description: "Study-level cases that passed the strict inclusion rule; rows are not comparable discovery units.",
        dataset: "summary",
        sourceId: "summary_source",
        metrics: [{ label: "Reviewed cases", field: "reviewed_cases", format: "number" }],
      },
      {
        id: "discipline_groups_card",
        description: "Broad discipline groups represented by at least one included case.",
        dataset: "summary",
        sourceId: "summary_source",
        metrics: [{ label: "Discipline groups", field: "discipline_groups", format: "number" }],
      },
      {
        id: "tier_a_card",
        description: "Cases with direct observational, field, laboratory, animal, human-study, or manual-reconstruction corroboration.",
        dataset: "summary",
        sourceId: "summary_source",
        metrics: [{ label: "Tier A cases", field: "tier_a_cases", format: "number" }],
      },
      {
        id: "tier_b_card",
        description: "Published computational or statistical cases with partial, targeted, or expert validation.",
        dataset: "summary",
        sourceId: "summary_source",
        metrics: [{ label: "Tier B cases", field: "tier_b_cases", format: "number" }],
      },
    ],
    charts: [
      {
        id: "cases_by_discipline_chart",
        title: "Included cases by discipline",
        subtitle: "Reviewed study-level cases through 2 Aug 2026; this measures audit coverage, not comparable scientific output",
        intent: "comparison",
        question: "Which discipline groups are represented in this reviewed seed catalog?",
        rationale: "A sorted horizontal bar chart makes the long discipline labels readable and exposes the seed audit's biomedical concentration without treating heterogeneous object counts as comparable.",
        comparisonContext: {
          baseline: "Zero included cases",
          denominator: "25 reviewed study-level cases",
          grain: "Broad discipline group",
          normalization: "Unweighted case count",
          semanticFamily: "Audit coverage",
          unit: "cases",
        },
        type: "horizontalBar",
        dataset: "discipline_summary",
        sourceId: "discipline_summary_source",
        encodings: {
          x: { field: "discipline", type: "nominal", aggregate: "none", label: "Discipline" },
          y: { field: "included_cases", type: "quantitative", aggregate: "none", format: "number", label: "Included cases", unit: "cases" },
          tooltip: [
            { field: "tier_a_cases", type: "quantitative", format: "number", label: "Tier A" },
            { field: "tier_b_cases", type: "quantitative", format: "number", label: "Tier B" },
            { field: "catalog_share_pct", type: "quantitative", format: "percent", label: "Catalog share" },
            { field: "earliest_year", type: "quantitative", format: "number", label: "Earliest year" },
            { field: "latest_year", type: "quantitative", format: "number", label: "Latest year" },
          ],
        },
        valueFormat: "number",
        unit: "cases",
        layout: "full",
        labels: { values: "all" },
        palette: { kind: "sequential", name: "blue" },
        maxRows: 8,
        compatibleTypes: ["horizontalBar", "bar", "leaderboard"],
        settings: { orientation: "horizontal", sort: "descending", showValues: true, categoryLabelPolicy: "wrap" },
        surface: { surface: "card", compact: false, interactiveLegend: false, showControls: true, viewMode: "both" },
      },
    ],
    tables: [
      {
        id: "discoveries_table",
        title: "Included discovery cases",
        subtitle: "Exact claim, AI role, human role, evidence stage, source, and limiting caveat",
        dataset: "discoveries",
        defaultSort: { field: "publication_year", direction: "desc" },
        density: "dense",
        sourceId: "discoveries_source",
        layout: "full",
        columns: [
          { field: "publication_year", label: "Year", format: "number" },
          { field: "discipline", label: "Discipline" },
          { field: "title", label: "Finding" },
          { field: "validation_tier", label: "Tier" },
          { field: "evidence_stage", label: "Evidence" },
          { field: "reported_result", label: "What the source reports" },
          { field: "ai_role", label: "AI role" },
          { field: "human_role", label: "Human role" },
          { field: "caveat", label: "Boundary" },
          { field: "primary_source_url", label: "Primary source" },
        ],
      },
      {
        id: "exclusions_table",
        title: "Important adjacent claims not counted",
        subtitle: "Validation, prediction, rediscovery, disputed novelty, capability, and definition boundaries",
        dataset: "exclusions",
        defaultSort: { field: "year", direction: "desc" },
        density: "dense",
        sourceId: "exclusions_source",
        layout: "full",
        columns: [
          { field: "year", label: "Year" },
          { field: "area", label: "Area" },
          { field: "claim_or_system", label: "Claim or system" },
          { field: "classification", label: "Classification" },
          { field: "why_not_counted_as_a_strict_discovery", label: "Why it is outside the strict count" },
          { field: "revisit_condition", label: "Revisit when" },
          { field: "source_url", label: "Source" },
        ],
      },
      {
        id: "coverage_table",
        title: "Coverage ledger and open gaps",
        subtitle: "Zero means not yet included in this sweep, not proof that a discipline has no qualifying cases",
        dataset: "coverage",
        defaultSort: { field: "included_cases", direction: "desc" },
        density: "spacious",
        sourceId: "coverage_source",
        layout: "full",
        columns: [
          { field: "discipline", label: "Discipline" },
          { field: "included_cases", label: "Cases", format: "number" },
          { field: "review_status", label: "Review status" },
          { field: "what_was_covered", label: "Covered" },
          { field: "main_gap_or_next_search", label: "Next search" },
        ],
      },
    ],
    sources,
    blocks: [
      {
        id: "title_block",
        type: "markdown",
        body: "# AI-enabled scientific discoveries: audited seed census",
      },
      {
        id: "scope_block",
        type: "markdown",
        body: "**Evidence cut-off: 2 August 2026.** This is a high-confidence, cross-science seed catalog—not a claim to have found every AI-enabled discovery ever made. No exhaustive global index exists, and the meaning of both *AI* and *discovery* varies by field.",
        sourceId: "methodology_source",
      },
      {
        id: "executive_summary_block",
        type: "markdown",
        body: "## Executive summary\n\nThe audit found **25 source-backed study-level cases across eight discipline groups**. Twenty-two have case-appropriate empirical or observational corroboration (Tier A); three are published computational or statistical results with partial validation (Tier B). The strongest pattern is not autonomous science: in nearly every case, AI searched or generated at scale while researchers framed the problem, ran instruments or experiments, verified candidates, and interpreted the result.",
        sourceId: "summary_source",
      },
      {
        id: "metric_strip_block",
        type: "metric-strip",
        cardIds: ["reviewed_cases_card", "discipline_groups_card", "tier_a_card", "tier_b_card"],
      },
      {
        id: "findings_heading_block",
        type: "markdown",
        body: "## What the evidence supports",
      },
      {
        id: "findings_block",
        type: "markdown",
        body: "- **AI has contributed to genuine discoveries**, including planets and radio bursts, field-verified geoglyphs, a new fossil species, hidden earthquake populations, experimentally tested materials and drug candidates, and new biological or neural patterns.\n- **Evidence stage matters more than the word ‘discovered’.** A field-verified geoglyph, a mouse-tested antibiotic, a phase 2a drug candidate, and a predicted stable crystal do not carry the same evidential weight.\n- **Large headline totals are usually candidate or mapping counts.** The ledger does not add 109,956 craters, 381,000 predicted crystals, and one clinical candidate into a meaningless grand total.\n- **Human–AI attribution is inseparable.** Even the most autonomous workflow here relied on human-built instruments, datasets, objectives, safeguards, and later scientific interpretation.\n- **Biomedical science dominates this seed audit (11 of 25 cases).** That reflects both a dense experimental literature and this first-pass search, not proof that AI is scientifically more productive there than everywhere else.",
        sourceId: "discoveries_source",
      },
      {
        id: "coverage_chart_block",
        type: "chart",
        chartId: "cases_by_discipline_chart",
      },
      {
        id: "case_detail_heading_block",
        type: "markdown",
        body: "## The reviewed cases\n\nUse the exact result and caveat columns together. Tier A means direct corroboration appropriate to the case; it does not mean clinical approval, independent replication, or final scientific truth.",
        sourceId: "methodology_source",
      },
      {
        id: "discoveries_table_block",
        type: "table",
        tableId: "discoveries_table",
      },
      {
        id: "selected_sources_block",
        type: "markdown",
        body: "## Selected primary evidence\n\n- [Kepler neural-network planet search](https://science.nasa.gov/universe/exoplanets/discovery-of-eight-planets-makes-alien-system-the-first-to-tie-with-our-solar-system/)\n- [AI-accelerated Nazca survey](https://doi.org/10.1073/pnas.2407652121)\n- [Oldest sepioid found through zero-shot fossil mining](https://www.nature.com/articles/s42003-026-09519-9)\n- [GNoME material-stability atlas](https://www.nature.com/articles/s41586-023-06735-9)\n- [Generative de novo antibiotics](https://doi.org/10.1016/j.cell.2025.07.033)\n- [Co-Scientist biomedical validations](https://www.nature.com/articles/s41586-026-10644-y)\n- [East Antarctic upper-mantle earthquakes](https://doi.org/10.1126/science.aea9895)\n- [Sperm-whale coda structure](https://www.nature.com/articles/s41467-024-47221-8)",
      },
      {
        id: "exclusions_heading_block",
        type: "markdown",
        body: "## What was deliberately not counted\n\nA credible registry needs a visible negative space. These influential examples are useful, but treating all of them as first discoveries would collapse the distinction between prediction, validation, rediscovery, capability, and empirical novelty.",
        sourceId: "methodology_source",
      },
      {
        id: "exclusions_table_block",
        type: "table",
        tableId: "exclusions_table",
      },
      {
        id: "coverage_heading_block",
        type: "markdown",
        body: "## Coverage is incomplete by design\n\nThis first sweep is strongest in biomedicine and remains incomplete in physics, climate and ocean science, botany, agriculture, and several biological subfields. A zero below records an audit gap—not an assertion that no discovery exists.",
        sourceId: "coverage_source",
      },
      {
        id: "coverage_table_block",
        type: "table",
        tableId: "coverage_table",
      },
      {
        id: "recommendations_block",
        type: "markdown",
        body: "## Recommended registry design\n\n1. Add a domain-neutral science schema in a new migration; do not rewrite the mathematics history.\n2. Make evidence stage, validation tier, novelty class, AI role, human role, source date, and caveat first-class fields.\n3. Keep separate views for first discovery, human–AI co-discovery, rediscovery, validation, prediction, and capability demonstration.\n4. Require a primary source and retain corrections, replications, retractions, and priority disputes as versioned updates.\n5. Publish the coverage ledger beside the catalog so ‘all’ is always an auditable goal rather than a marketing claim.",
        sourceId: "methodology_source",
      },
      {
        id: "questions_block",
        type: "markdown",
        body: "## Questions before product integration\n\n- Should the registry include theoretical and computational discoveries before physical validation?\n- Should social and behavioural sciences be in scope, or should the first expansion stay with natural science and archaeology?\n- Which fields require a subject-matter reviewer before publication?\n- What update cadence and correction policy will keep 2026-era claims current?",
        sourceId: "methodology_source",
      },
      {
        id: "caveats_block",
        type: "markdown",
        body: "## Required caveat\n\n**Share with caveats.** This is a source-backed starting census, not a systematic review or a proof of completeness. Publication bias, terminology drift, heterogeneous evidence, contested novelty, and future corrections remain material. Counts describe reviewed cases only and must not be presented as the total scientific output of AI.",
        sourceId: "methodology_source",
      },
      {
        id: "method_block",
        type: "markdown",
        body: "## Method and files\n\nThe full definitions, source procedure, tier rules, limitations, chart contract, and expansion requirements are in `METHODOLOGY.md`. The portable report is generated from the same bounded datasets in `artifact.json`; `discoveries.csv`, `exclusions.csv`, and `coverage_ledger.csv` remain the inspectable ledgers.",
        sourceId: "methodology_source",
      },
    ],
  },
  snapshot: {
    version: 1,
    generatedAt,
    status: "ready",
    datasets: {
      summary,
      discipline_summary: disciplineSummary,
      discoveries,
      exclusions,
      coverage,
    },
  },
  sources,
};

writeFileSync(join(baseDir, "artifact.json"), `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  output: join(baseDir, "artifact.json"),
  reviewed_cases: discoveries.length,
  discipline_groups: disciplines.length,
  tier_a_cases: tierACases,
  tier_b_cases: tierBCases,
  excluded_or_adjacent_cases: exclusions.length,
}, null, 2));
