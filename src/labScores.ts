import type { LabRef, MathRecord } from "./types";

export interface LabScore {
  lab: LabRef;
  newResults: number;
  newProofs: number;
  newDisproofs: number;
  newDiscoveries: number;
  humanAi: number;
  formalizations: number;
  formallyChecked: number;
  creditedRecords: number;
  records: MathRecord[];
}

function emptyScore(lab: LabRef): LabScore {
  return {
    lab,
    newResults: 0,
    newProofs: 0,
    newDisproofs: 0,
    newDiscoveries: 0,
    humanAi: 0,
    formalizations: 0,
    formallyChecked: 0,
    creditedRecords: 0,
    records: [],
  };
}

export function buildLabScores(records: MathRecord[]): LabScore[] {
  const scores = new Map<string, LabScore>();

  for (const record of records) {
    for (const lab of record.labs) {
      const score = scores.get(lab.slug) ?? emptyScore(lab);
      score.creditedRecords += 1;
      score.records.push(record);

      if (record.novelty === "new-result") {
        score.newResults += 1;
        if (record.outcome === "proved") score.newProofs += 1;
        if (record.outcome === "disproved") score.newDisproofs += 1;
        if (record.outcome === "discovered") score.newDiscoveries += 1;
      }
      if (record.novelty === "human-ai") score.humanAi += 1;
      if (record.novelty === "formalization" || record.outcome === "formalized") score.formalizations += 1;
      if (record.verificationTier === "formal") score.formallyChecked += 1;

      scores.set(lab.slug, score);
    }
  }

  return Array.from(scores.values())
    .map((score) => ({
      ...score,
      records: [...score.records].sort((left, right) => {
        const noveltyDifference = Number(right.novelty === "new-result") - Number(left.novelty === "new-result");
        return noveltyDifference || right.eventDate.localeCompare(left.eventDate) || left.title.localeCompare(right.title);
      }),
    }))
    .sort((left, right) =>
      right.newResults - left.newResults ||
      right.newProofs - left.newProofs ||
      right.newDisproofs - left.newDisproofs ||
      right.formallyChecked - left.formallyChecked ||
      right.creditedRecords - left.creditedRecords ||
      left.lab.name.localeCompare(right.lab.name),
    );
}
