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
        <p className="section-kicker">Leaderboard</p>
        <h1>Which AI labs have produced new mathematical results?</h1>
        <p className="labs-intro">
          Ranked by the number of source-backed registry records labelled <strong>new result</strong>. Proofs, disproofs,
          discoveries, collaborations, formalizations, and formal checking stay separate so the score does not hide what happened.
        </p>
        <dl className="score-summary" aria-label="Leaderboard summary">
          <div><dt>Credited labs &amp; teams</dt><dd>{scores.length}</dd></div>
          <div><dt>New-result records</dt><dd>{creditedNewResults}</dd></div>
          <div><dt>Registry records</dt><dd>{records.length}</dd></div>
        </dl>
      </section>

      <section className="labs-layout" aria-label="AI lab results leaderboard">
        <div className="leaderboard-panel">
          <div className="leaderboard-head">
            <div>
              <span>Leaderboard</span>
              <small>Score = new-result records</small>
            </div>
            <a href="#lab-score-method">How scoring works</a>
          </div>

          {loading && <div className="empty-state"><span className="loader" /> Loading lab attribution…</div>}
          {error && <div className="empty-state error-state"><CircleAlert /> {error}</div>}
          {!loading && !error && scores.length === 0 && <div className="empty-state">No lab attribution is available yet.</div>}

          {!loading && !error && scores.length > 0 && (
            <div className="leaderboard-scroll">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Lab / team</th>
                    <th scope="col"><span>Score</span><small>New results</small></th>
                    <th scope="col"><span>Proofs</span><small>New</small></th>
                    <th scope="col"><span>Disproofs</span><small>New</small></th>
                    <th scope="col"><span>Discoveries</span><small>New</small></th>
                    <th scope="col"><span>Formal</span><small>Checked</small></th>
                    <th scope="col" aria-label="Total attributed records"><span>Total</span><small>Attributed records</small></th>
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
              <div className="lab-detail-topline"><span>Rank {scores.indexOf(selected) + 1}</span><span>{labKindLabels[selected.lab.kind]}</span></div>
              <h2>{selected.lab.name}</h2>
              <div className="lab-score-callout"><strong>{selected.newResults}</strong><span>new-result {selected.newResults === 1 ? "record" : "records"}</span></div>
              <dl className="lab-metrics">
                <div><dt>New proofs</dt><dd>{selected.newProofs}</dd></div>
                <div><dt>New disproofs</dt><dd>{selected.newDisproofs}</dd></div>
                <div><dt>New discoveries</dt><dd>{selected.newDiscoveries}</dd></div>
                <div><dt>Human + AI</dt><dd>{selected.humanAi}</dd></div>
                <div><dt>Formalizations</dt><dd>{selected.formalizations}</dd></div>
                <div><dt>Formally checked</dt><dd>{selected.formallyChecked}</dd></div>
              </dl>

              <section className="credited-results">
                <h3>Attributed registry records</h3>
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
          ) : <div className="detail-placeholder">Select a lab to inspect its credited results.</div>}
        </aside>
      </section>

      <section className="score-method" id="lab-score-method">
        <p className="section-kicker">Method</p>
        <h2>A count, not a points formula.</h2>
        <div>
          <p><strong>One registry record equals one score unit</strong> only when its novelty label is “new result.” Aggregate records still count once even if the underlying source contains several theorems.</p>
          <p><strong>Shared work is shared attribution.</strong> If a record names two labs or system-building teams, that record is attributed to each lab. Lab totals can therefore exceed the number of unique registry records.</p>
          <p><strong>Formal checking is evidence, not novelty.</strong> It is reported separately and does not multiply the score. Human–AI work, rediscoveries, formalizations, and capability benchmarks are visible but do not count as new-result score.</p>
        </div>
      </section>
    </main>
  );
}
