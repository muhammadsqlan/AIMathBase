import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleAlert,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { LabsView } from "./LabsView";
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
  const [page, setPage] = useState<"registry" | "labs">(() => window.location.hash === "#labs" ? "labs" : "registry");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/records", { cache: "no-cache", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Registry request failed (${response.status})`);
        return (await response.json()) as RegistryResponse;
      })
      .then((payload) => {
        setRecords(payload.records);
        const hashSlug = window.location.hash.startsWith("#result/")
          ? window.location.hash.replace(/^#result\//, "")
          : "";
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

  useEffect(() => {
    const syncPageToHash = () => setPage(window.location.hash === "#labs" ? "labs" : "registry");
    window.addEventListener("hashchange", syncPageToHash);
    return () => window.removeEventListener("hashchange", syncPageToHash);
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
    const isChangingPage = page !== "registry";
    setPage("registry");
    setSelectedSlug(record.slug);
    window.history.replaceState(null, "", `#result/${record.slug}`);
    if (isChangingPage) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showRegistry() {
    setPage("registry");
    window.history.replaceState(null, "", "#top");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showLabs() {
    setPage("labs");
    window.history.replaceState(null, "", "#labs");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <a className="brand" href="#top" onClick={showRegistry} aria-label="AIMathBase home"><span className="brand-mark">AI</span>MathBase</a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#top" onClick={showRegistry} aria-current={page === "registry" ? "page" : undefined}>Home</a>
          <a href="#labs" onClick={showLabs} aria-current={page === "labs" ? "page" : undefined}>Leaderboard</a>
          <a href="https://github.com/muhammadsqlan/AIMathBase/issues/new?template=submit-a-result.yml" target="_blank" rel="noreferrer">Contribute</a>
        </nav>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href="#labs" onClick={showLabs} aria-current={page === "labs" ? "page" : undefined}>Leaderboard</a>
          <a href="https://github.com/muhammadsqlan/AIMathBase/issues/new?template=submit-a-result.yml" target="_blank" rel="noreferrer">Contribute</a>
        </nav>
      </header>

      {page === "labs" ? (
        <LabsView records={records} loading={loading} error={error} onOpenRecord={selectRecord} />
      ) : (
      <main id="top">
        <section className="hero">
          <h1>Results</h1>
          <div className="search-row">
            <label className="search-box">
              <Search size={20} aria-hidden="true" />
              <span className="sr-only">Search the registry</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
              {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
            </label>
            <button className="filter-button" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={17} /> Filter {activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
          </div>
        </section>

        <section className="registry" id="registry">
          <aside className="filter-rail" aria-label="Filter registry">{filters}</aside>

          <div className="results-panel">
            <div className="results-head">
              <div><strong>{filtered.length}</strong> {filtered.length === 1 ? "result" : "results"}</div>
              <a href="/api/export.json"><ArrowDownToLine size={15} /> JSON</a>
            </div>
            {loading && <div className="empty-state"><span className="loader" /> Loading…</div>}
            {error && <div className="empty-state error-state"><CircleAlert /> {error}</div>}
            {!loading && !error && filtered.length === 0 && <div className="empty-state">No results.</div>}
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
                    <div className="record-meta"><span>{record.domain}</span><span>{record.aiSystem}</span><span>{verificationLabels[record.verificationTier]}</span></div>
                  </div>
                  <ChevronRight className="row-arrow" size={19} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <aside className={`detail-panel${selected ? " has-record" : ""}`} aria-label="Selected result detail">
            {selected ? <RecordDetail record={selected} onClose={() => setSelectedSlug(null)} /> : <div className="detail-placeholder">Select a result.</div>}
          </aside>
        </section>

      </main>
      )}

      {mobileFilters && <div className="mobile-overlay" role="dialog" aria-modal="true" aria-label="Registry filters"><button className="overlay-dismiss" onClick={() => setMobileFilters(false)} aria-label="Close filters" /><div className="mobile-filter-sheet">{filters}<button className="apply-button" onClick={() => setMobileFilters(false)}>Show {filtered.length} results</button></div></div>}
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
      <div className="detail-topline"><span>Record</span><button className="icon-button" onClick={onClose} aria-label="Close detail"><X size={17} /></button></div>
      <div className="detail-badges"><span className={outcomeClass(record.outcome)}>{outcomeLabels[record.outcome]}</span><span className="novelty">{noveltyLabels[record.novelty]}</span></div>
      <h2>{record.title}</h2>
      <dl>
        <div><dt>Date</dt><dd>{formatDate(record.eventDate)}</dd></div>
        <div><dt>Field</dt><dd>{record.domain}</dd></div>
        <div><dt>Lab / team</dt><dd>{record.labs.map((lab) => lab.name).join(", ") || "Not attributed"}</dd></div>
        <div><dt>AI system</dt><dd>{record.aiSystem}</dd></div>
        <div><dt>Evidence</dt><dd>{verificationLabels[record.verificationTier]}</dd></div>
      </dl>
      <section className="sources"><h3>Sources</h3>{record.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span><small>{source.kind.replace("-", " ")}</small>{source.title}</span><ArrowUpRight size={16} /></a>)}</section>
    </div>
  );
}

export default App;
