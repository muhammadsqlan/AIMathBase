import { describe, expect, it } from "vitest";
import { buildLabScores } from "./labScores";
import type { LabRef, MathRecord } from "./types";

const openai: LabRef = { slug: "openai", name: "OpenAI", kind: "company" };
const harmonic: LabRef = { slug: "harmonic", name: "Harmonic", kind: "company" };

function record(overrides: Partial<MathRecord>): MathRecord {
  return {
    id: 1,
    slug: "sample",
    title: "Sample result",
    summary: "Summary",
    outcome: "proved",
    novelty: "new-result",
    domain: "Number theory",
    eventDate: "2026-08-01",
    aiSystem: "Sample system",
    aiRole: "Found the proof.",
    humanRole: "Checked the proof.",
    verification: "Lean checked.",
    verificationTier: "formal",
    caveat: "Narrow claim.",
    featured: false,
    tags: [],
    sources: [],
    labs: [openai],
    ...overrides,
  };
}

describe("lab scoring", () => {
  it("ranks by new-result records and keeps outcome counts separate", () => {
    const scores = buildLabScores([
      record({ id: 1, slug: "proof", labs: [openai, harmonic] }),
      record({ id: 2, slug: "counterexample", outcome: "disproved", labs: [openai] }),
      record({ id: 3, slug: "collaboration", novelty: "human-ai", labs: [harmonic] }),
    ]);

    expect(scores.map((score) => score.lab.slug)).toEqual(["openai", "harmonic"]);
    expect(scores[0]).toMatchObject({ newResults: 2, newProofs: 1, newDisproofs: 1, formallyChecked: 2 });
    expect(scores[1]).toMatchObject({ newResults: 1, humanAi: 1, creditedRecords: 2 });
  });

  it("credits a shared result once to each named lab", () => {
    const [first, second] = buildLabScores([record({ labs: [openai, harmonic] })]);
    expect(first.newResults).toBe(1);
    expect(second.newResults).toBe(1);
  });
});
