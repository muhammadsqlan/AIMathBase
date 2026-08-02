import { ArrowRight, CircleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { buildLabScores } from "./labScores";
import type { LabKind, MathRecord, Outcome } from "./types";

const labKindLabels: Record<LabKind, string> = {
  company: "Company lab",
  academic: "Academic team",
  independent: "Research team",
};

const outcomeLabels: Record<Outcome, string> = {
  proved: "Proof",
  disproved: "Disproof",
  discovered: "Discovery",
  formalized: "Formalization",
  benchmark: "Benchmark",
};

interface LabsViewProps {
  records: MathRecord[];
  loading: boolean;
  error: string | null;
  onOpenRecord: (record: MathRecord) => void;
}

export function LabsView({ records, loading, error, onOpenRecord }: LabsViewProps) {
  const scores = useMemo(() => buildLabScores(records), [records]);
  const [selectedLab, setSelectedLab] = useState<string | null>(null);

  useEffect(() => {
    if (!scores.some((score) => score.lab.slug === selectedLab)) setSelectedLab(scores[0]?.lab.slug ?? null);
  }, [scores, selectedLab]);

  const selected = scores.find((score) => score.lab.slug === selectedLab) ?? scores[0] ?? null;
  const creditedNewResults = records.filter((record) => record.novelty === "new-result" && record.labs.length > 0).length;

  return (
    <main className="labs-page" id="labs">
      <section className="labs-hero">
        <h1>Leaderboard</h1>
        <dl className="score-summary" aria-label="Leaderboard summary">
          <div><dt>Labs</dt><dd>{scores.length}</dd></div>
          <div><dt>New results</dt><dd>{creditedNewResults}</dd></div>
          <div><dt>Records</dt><dd>{records.length}</dd></div>
        </dl>
      </section>

      <section className="labs-layout" aria-label="AI lab results leaderboard">
        <div className="leaderboard-panel">
          {loading && <div className="empty-state"><span className="loader" /> Loading…</div>}
          {error && <div className="empty-state error-state"><CircleAlert /> {error}</div>}
          {!loading && !error && scores.length === 0 && <div className="empty-state">No labs.</div>}

          {!loading && !error && scores.length > 0 && (
            <div className="leaderboard-scroll">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Lab</th>
                    <th scope="col">Score</th>
                    <th scope="col">Proofs</th>
                    <th scope="col">Disproofs</th>
                    <th scope="col">Discoveries</th>
                    <th scope="col">Checked</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr key={score.lab.slug} className={score.lab.slug === selected?.lab.slug ? "is-selected" : undefined}>
                      <td className="rank-cell">{index + 1}</td>
                      <th scope="row">
                        <button type="button" onClick={() => setSelectedLab(score.lab.slug)} aria-pressed={score.lab.slug === selected?.lab.slug}>
                          <strong>{score.lab.name}</strong>
                          <small>{labKindLabels[score.lab.kind]}</small>
                        </button>
                      </th>
                      <td className="score-cell">{score.newResults}</td>
                      <td>{score.newProofs}</td>
                      <td>{score.newDisproofs}</td>
                      <td>{score.newDiscoveries}</td>
                      <td>{score.formallyChecked}</td>
                      <td>{score.creditedRecords}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="lab-detail-panel" aria-label="Selected leaderboard entry detail">
          {selected ? (
            <div className="lab-detail-inner">
              <div className="lab-detail-topline"><span>#{scores.indexOf(selected) + 1}</span><span>{labKindLabels[selected.lab.kind]}</span></div>
              <h2>{selected.lab.name}</h2>
              <div className="lab-score-callout"><strong>{selected.newResults}</strong><span>new {selected.newResults === 1 ? "result" : "results"}</span></div>
              <dl className="lab-metrics">
                <div><dt>Proofs</dt><dd>{selected.newProofs}</dd></div>
                <div><dt>Disproofs</dt><dd>{selected.newDisproofs}</dd></div>
                <div><dt>Discoveries</dt><dd>{selected.newDiscoveries}</dd></div>
                <div><dt>Human + AI</dt><dd>{selected.humanAi}</dd></div>
                <div><dt>Formalized</dt><dd>{selected.formalizations}</dd></div>
                <div><dt>Checked</dt><dd>{selected.formallyChecked}</dd></div>
              </dl>

              <section className="credited-results">
                <h3>Records</h3>
                {selected.records.map((record) => (
                  <button type="button" key={record.slug} onClick={() => onOpenRecord(record)}>
                    <span>
                      <small>{record.novelty === "new-result" ? `New ${outcomeLabels[record.outcome].toLocaleLowerCase()}` : record.novelty.replace("-", " + ")}</small>
                      {record.title}
                    </span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                ))}
              </section>
            </div>
          ) : <div className="detail-placeholder">Select a lab.</div>}
        </aside>
      </section>
    </main>
  );
}
