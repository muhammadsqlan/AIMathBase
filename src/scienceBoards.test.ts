import { describe, expect, it } from "vitest";
import scienceArtifact from "../public/data/science-registry.json";
import { SCIENCE_BOARDS, boardForDiscipline } from "./scienceBoards";
import type { ScienceRecord } from "./scienceTypes";

const records = scienceArtifact.snapshot.datasets.discoveries as ScienceRecord[];

describe("Science Board registry", () => {
  it("publishes the bounded 25-record reviewed seed census", () => {
    expect(records).toHaveLength(25);
    expect(records.filter((record) => record.validation_tier === "A")).toHaveLength(22);
    expect(records.filter((record) => record.validation_tier === "B")).toHaveLength(3);
    expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
  });

  it("maps every reviewed discipline to an active board", () => {
    for (const record of records) {
      const board = boardForDiscipline(record.discipline);
      expect(board, record.discipline).toBeDefined();
      expect(board?.status).toBe("active");
    }
  });

  it("keeps provenance and limiting caveats on every science record", () => {
    for (const record of records) {
      expect(record.ai_role.length).toBeGreaterThan(20);
      expect(record.human_role.length).toBeGreaterThan(20);
      expect(record.novelty_scope.length).toBeGreaterThan(20);
      expect(record.caveat.length).toBeGreaterThan(20);
      expect(record.primary_source_url).toMatch(/^https:\/\//);
      expect(record.supporting_source_url).toMatch(/^https:\/\//);
    }
  });

  it("keeps Mathematics as the original separate board", () => {
    const mathematics = SCIENCE_BOARDS.find((board) => board.slug === "mathematics");
    expect(mathematics?.original).toBe(true);
    expect(mathematics?.discipline).toBeNull();
  });

  it("keeps the published board totals reconciled", () => {
    expect(SCIENCE_BOARDS).toHaveLength(15);
    expect(SCIENCE_BOARDS.filter((board) => board.status === "active")).toHaveLength(9);
    expect(SCIENCE_BOARDS.filter((board) => board.status === "researching")).toHaveLength(6);
  });
});
