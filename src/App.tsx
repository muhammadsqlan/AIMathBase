import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleAlert,
  Code2,
  Database,
  Menu,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { MathRecord, Novelty, Outcome, RegistryResponse, VerificationTier } from "./types";

const outcomeLabels: Record<Outcome, string> = {
  proved: "Proved",
  disproved: "Disproved",
  discovered: "Discovered",
  formalized: "Formalized",
  benchmark: "Benchmark",
};

const noveltyLabels: Record<Novelty, string> = {
  "new-result": "New result",
  "human-ai": "Human + AI",
  rediscovery: "Rediscovery",
  formalization: "Formalization",
  capability: "Capability only",
};

const verificationLabels: Record<VerificationTier, string> = {
  formal: "Formally checked",
  published: "Published",
  expert: "Expert checked",
  reported: "Reported",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function outcomeClass(outcome: Outcome): string {
  return `status status--${outcome}`;
}

function App() {
  const [records, setRecords] = useState<MathRecord[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [novelties, setNovelties] = useState<Novelty[]>([]);
  const [verification, setVerification] = useState<VerificationTier[]>([]);
  const [domain, setDomain] = useState("All fields");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/records", { cache: "no-cache", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Registry request failed (${response.status})`);
        return (await response.json()) as RegistryResponse;
      })
      .then((payload) => {
        setRecords(payload.records);
        const hashSlug = window.location.hash.replace(/^#result\//, "");
        const initial = payload.records.find((record) => record.slug === hashSlug) ?? payload.records.find((record) => record.featured);
        const compactViewport = window.matchMedia("(max-width: 760px)").matches;
        setSelectedSlug(compactViewport && !hashSlug ? null : (initial?.slug ?? payload.records[0]?.slug ?? null));
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Could not load the registry");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const domains = useMemo(() => ["All fields", ...Array.from(new Set(records.map((record) => record.domain))).sort()], [records]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return records.filter((record) => {
      const searchable = [record.title, record.summary, record.domain, record.aiSystem, ...record.tags].join(" ").toLocaleLowerCase();
      return (
        (!needle || searchable.includes(needle)) &&
        (outcomes.length === 0 || outcomes.includes(record.outcome)) &&
        (novelties.length === 0 || novelties.includes(record.novelty)) &&
        (verification.length === 0 || verification.includes(record.verificationTier)) &&
        (domain === "All fields" || record.domain === domain)
      );
    });
  }, [domain, novelties, outcomes, query, records, verification]);

  const selected = records.find((record) => record.slug === selectedSlug) ?? null;
  const activeFilterCount = outcomes.length + novelties.length + verification.length + (domain === "All fields" ? 0 : 1);

  function toggleValue<T>(value: T, values: T[], setter: (next: T[]) => void) {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  function selectRecord(record: MathRecord) {
    setSelectedSlug(record.slug);
    window.history.replaceState(null, "", `#result/${record.slug}`);
  }

  function clearFilters() {
    setOutcomes([]);
    setNovelties([]);
    setVerification([]);
    setDomain("All fields");
  }

  const filters = (
    <>
      <div className="filter-mobile-head">
        <span>Filters</span>
        <button className="icon-button" onClick={() => setMobileFilters(false)} aria-label="Close filters"><X size={18} /></button>
      </div>
      <FilterSection title="Outcome">
        {(Object.keys(outcomeLabels) as Outcome[]).map((value) => (
          <FilterCheck key={value} checked={outcomes.includes(value)} label={outcomeLabels[value]} count={records.filter((record) => record.outcome === value).length} onChange={() => toggleValue(value, outcomes, setOutcomes)} />
        ))}
      </FilterSection>
      <FilterSection title="Novelty">
        {(Object.keys(noveltyLabels) as Novelty[]).map((value) => (
          <FilterCheck key={value} checked={novelties.includes(value)} label={noveltyLabels[value]} count={records.filter((record) => record.novelty === value).length} onChange={() => toggleValue(value, novelties, setNovelties)} />
        ))}
      </FilterSection>
      <FilterSection title="Evidence">
        {(Object.keys(verificationLabels) as VerificationTier[]).map((value) => (
          <FilterCheck key={value} checked={verification.includes(value)} label={verificationLabels[value]} count={records.filter((record) => record.verificationTier === value).length} onChange={() => toggleValue(value, verification, setVerification)} />
        ))}
      </FilterSection>
      <FilterSection title="Field">
        <label className="select-wrap">
          <span className="sr-only">Mathematical field</span>
          <select value={domain} onChange={(event) => setDomain(event.target.value)}>
            {domains.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
      </FilterSection>
      {activeFilterCount > 0 && <button className="clear-button" onClick={clearFilters}>Clear all filters</button>}
    </>
  );

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AIMathBase home"><span className="brand-mark">AI</span>MathBase</a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#registry">Registry</a>
          <button onClick={() => setMethodOpen(true)}>Method</button>
          <a href="https://github.com/muhammadsqlan/AIMathBase/issues/new?template=submit-a-result.yml" target="_blank" rel="noreferrer">Contribute</a>
          <a href="https://github.com/muhammadsqlan/AIMathBase" target="_blank" rel="noreferrer"><Code2 size={16} /> GitHub</a>
        </nav>
        <button className="mobile-menu" onClick={() => setMobileFilters(true)} aria-label="Open menu"><Menu size={21} /></button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="eyebrow"><Database size={15} /> A living evidence registry</div>
          <h1>What has AI actually proved in mathematics?</h1>
          <p className="hero-copy">A source-first record of new theorems, counterexamples, formalizations, and benchmarks—with the AI role and the caveat kept attached.</p>
          <div className="search-row">
            <label className="search-box">
              <Search size={20} aria-hidden="true" />
              <span className="sr-only">Search the registry</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search results, systems, fields…" />
              {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
            </label>
            <button className="filter-button" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={17} /> Filter {activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
          </div>
          <div className="corpus-note">
            <span><strong>{records.length || "—"}</strong> reviewed records</span>
            <span>Updated August 1, 2026</span>
            <span>Open, versioned data</span>
          </div>
        </section>

        <section className="registry" id="registry">
          <aside className="filter-rail" aria-label="Filter registry">{filters}</aside>

          <div className="results-panel">
            <div className="results-head">
              <div><strong>{filtered.length}</strong> {filtered.length === 1 ? "result" : "results"}</div>
              <a href="/api/export.json"><ArrowDownToLine size={15} /> Export JSON</a>
            </div>
            {loading && <div className="empty-state"><span className="loader" /> Loading the evidence…</div>}
            {error && <div className="empty-state error-state"><CircleAlert /> {error}</div>}
            {!loading && !error && filtered.length === 0 && <div className="empty-state">No records match these filters.</div>}
            <div className="record-list">
              {filtered.map((record) => (
                <button key={record.id} className={`record-row${record.slug === selectedSlug ? " is-selected" : ""}`} onClick={() => selectRecord(record)}>
                  <div className="record-date">{formatDate(record.eventDate)}</div>
                  <div className="record-main">
                    <div className="record-badges">
                      <span className={outcomeClass(record.outcome)}>{outcomeLabels[record.outcome]}</span>
                      <span className="novelty">{noveltyLabels[record.novelty]}</span>
                    </div>
                    <h2>{record.title}</h2>
                    <p>{record.summary}</p>
                    <div className="record-meta"><span>{record.domain}</span><span>{record.aiSystem}</span><span>{verificationLabels[record.verificationTier]}</span></div>
                  </div>
                  <ChevronRight className="row-arrow" size={19} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <aside className={`detail-panel${selected ? " has-record" : ""}`} aria-label="Selected result detail">
            {selected ? <RecordDetail record={selected} onClose={() => setSelectedSlug(null)} /> : <div className="detail-placeholder">Select a result to inspect its evidence.</div>}
          </aside>
        </section>

        <section className="principles">
          <div><span>01</span><h3>Claims, not hype</h3><p>Every headline is narrowed to what the source actually establishes.</p></div>
          <div><span>02</span><h3>Roles stay visible</h3><p>AI generation, human steering, and independent checking are recorded separately.</p></div>
          <div><span>03</span><h3>Corrections welcome</h3><p>The corpus is versioned on GitHub and every record can be challenged.</p></div>
        </section>
      </main>

      <footer><span>AIMathBase · An open research index</span><span>Not a claim of completeness or mathematical priority.</span></footer>

      {mobileFilters && <div className="mobile-overlay" role="dialog" aria-modal="true" aria-label="Registry filters"><button className="overlay-dismiss" onClick={() => setMobileFilters(false)} aria-label="Close filters" /><div className="mobile-filter-sheet">{filters}<button className="apply-button" onClick={() => setMobileFilters(false)}>Show {filtered.length} results</button></div></div>}
      {methodOpen && <MethodDialog onClose={() => setMethodOpen(false)} />}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset className="filter-section"><legend>{title}</legend>{children}</fieldset>;
}

function FilterCheck({ checked, label, count, onChange }: { checked: boolean; label: string; count: number; onChange: () => void }) {
  return <label className="filter-check"><input type="checkbox" checked={checked} onChange={onChange} /><span className="fake-check">{checked && <Check size={12} />}</span><span>{label}</span><small>{count}</small></label>;
}

function RecordDetail({ record, onClose }: { record: MathRecord; onClose: () => void }) {
  return (
    <div className="detail-inner">
      <div className="detail-topline"><span>Evidence record</span><button className="icon-button" onClick={onClose} aria-label="Close detail"><X size={17} /></button></div>
      <div className="detail-badges"><span className={outcomeClass(record.outcome)}>{outcomeLabels[record.outcome]}</span><span className="novelty">{noveltyLabels[record.novelty]}</span></div>
      <h2>{record.title}</h2>
      <p className="detail-summary">{record.summary}</p>
      <dl>
        <div><dt>Date</dt><dd>{formatDate(record.eventDate)}</dd></div>
        <div><dt>Field</dt><dd>{record.domain}</dd></div>
        <div><dt>AI system</dt><dd>{record.aiSystem}</dd></div>
        <div><dt>Evidence</dt><dd>{verificationLabels[record.verificationTier]}</dd></div>
      </dl>
      <section className="role-block"><h3>What the AI did</h3><p>{record.aiRole}</p></section>
      <section className="role-block"><h3>What people did</h3><p>{record.humanRole}</p></section>
      <section className="caveat"><CircleAlert size={17} /><div><h3>Scope note</h3><p>{record.caveat}</p></div></section>
      <section className="sources"><h3>Original evidence</h3>{record.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span><small>{source.kind.replace("-", " ")}</small>{source.title}</span><ArrowUpRight size={16} /></a>)}</section>
    </div>
  );
}

function MethodDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="method-title">
      <button className="overlay-dismiss" onClick={onClose} aria-label="Close method" />
      <article className="method-dialog">
        <div className="detail-topline"><span>Methodology 1.0</span><button className="icon-button" onClick={onClose} aria-label="Close method"><X size={18} /></button></div>
        <h2 id="method-title">A registry of evidence, not a leaderboard.</h2>
        <p>We include a result when a public source identifies a mathematical claim, an AI contribution, and a checkable evidence trail. We separate five things that are too often blurred together:</p>
        <ol><li><strong>Outcome:</strong> proof, disproof, algorithmic discovery, formalization, or benchmark.</li><li><strong>Novelty:</strong> new result, human–AI collaboration, rediscovery, formalization, or capability only.</li><li><strong>Roles:</strong> what the system generated and what humans supplied or repaired.</li><li><strong>Verification:</strong> formal kernel check, publication, expert check, or unverified report.</li><li><strong>Scope:</strong> the strongest claim the evidence supports—and the nearby claim it does not.</li></ol>
        <p>The initial corpus was independently checked against primary papers, formal repositories, author announcements, project pages, and the community-maintained Erdős Problems AI ledger. It is intentionally incomplete and designed to improve in public.</p>
        <a className="method-cta" href="https://github.com/muhammadsqlan/AIMathBase/issues/new?template=submit-a-result.yml" target="_blank" rel="noreferrer">Submit or correct a record <ArrowUpRight size={16} /></a>
      </article>
    </div>
  );
}

export default App;
