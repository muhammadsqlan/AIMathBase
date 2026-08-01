import { describe, expect, it } from "vitest";
import type { MathRecord } from "./types";

describe("registry record contract", () => {
  it("keeps scope and evidence attached to every record", () => {
    const record = {
      caveat: "A nearby broader claim remains open.",
      verificationTier: "formal",
      sources: [{ kind: "formal-proof", title: "Lean source", url: "https://example.com", primary: true }],
    } as MathRecord;
    expect(record.caveat).toBeTruthy();
    expect(record.verificationTier).toBe("formal");
    expect(record.sources.some((source) => source.primary)).toBe(true);
  });
});
