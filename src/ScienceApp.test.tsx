import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ScienceRecordDetail } from "./ScienceApp";
import type { ScienceRecord } from "./scienceTypes";

const record: ScienceRecord = {
  id: "test-record",
  publication_year: 2026,
  discipline: "Astronomy",
  field: "Exoplanets",
  title: "Test discovery",
  discovery_class: "observational discovery",
  ai_role: "AI contribution text that must remain visible.",
  human_role: "Human scientific work text that must remain visible.",
  evidence_stage: "Independent observational confirmation",
  validation_tier: "A",
  novelty_scope: "Novelty scope text that must remain visible.",
  reported_result: "A concise reported result.",
  primary_source_url: "https://example.com/primary",
  supporting_source_url: "https://example.com/supporting",
  caveat: "Evidence boundary text that must remain visible.",
};

describe("ScienceRecordDetail", () => {
  it("renders the evidence boundary fields with every public record detail", () => {
    const html = renderToStaticMarkup(<ScienceRecordDetail record={record} onClose={() => undefined} />);

    for (const label of ["AI contribution", "Human scientific work", "Novelty scope", "Evidence boundary"]) {
      expect(html).toContain(label);
    }
    for (const value of [record.ai_role, record.human_role, record.novelty_scope, record.caveat]) {
      expect(html).toContain(value);
    }
  });
});
