import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleAlert,
  Menu,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { SCIENCE_BOARDS, boardBySlug, boardForDiscipline } from "./scienceBoards";
import type {
  ScienceBoardDefinition,
  ScienceRecord,
  ScienceRegistryResponse,
  ScienceValidationTier,
} from "./scienceTypes";

const GITHUB_REPOSITORY = "https://github.com/muhammadsqlan/AIMathBase";
const CONTRIBUTE_URL = `${GITHUB_REPOSITORY}/issues/new?template=submit-a-result.yml`;

function useScienceRegistry() {
  const [registry, setRegistry] = useState<ScienceRegistryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/science", { cache: "no-cache", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Science registry request failed (${response.status})`);
        return (await response.json()) as ScienceRegistryResponse;
      })
      .then(setRegistry)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Could not load the science registry");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return { registry, loading, error };
}

function usePageMetadata(title: string, path: string) {
  useEffect(() => {
    document.title = title;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    canonical?.setAttribute("href", `https://scienceboard.sqlan.workers.dev${path}`);
  }, [path, title]);
}

function formatCutoff(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function sourceHost(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "Source";
  }
}

function routeForBoard(board: ScienceBoardDefinition): string {
  return board.original ? "/math" : `/boards/${board.slug}`;
}

function recordCountLabel(count: number): string {
  return `${count} ${count === 1 ? "record" : "records"}`;
}

function ScienceHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="science-topbar">
      <a className="science-brand" href="/" aria-label="Science Board home">
        <span aria-hidden="true" />Science Board
      </a>
      <nav className="science-desktop-nav" aria-label="Primary navigation">
        <a href="/" aria-current="page">Boards</a>
        <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer">Contribute</a>
        <a href={GITHUB_REPOSITORY} target="_blank" rel="noreferrer">GitHub</a>
      </nav>
      <button
        className="science-menu-button"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={23} /> : <Menu size={24} />}
      </button>
      {menuOpen && (
        <nav className="science-mobile-nav" aria-label="Mobile navigation">
          <a href="/">Boards</a>
          <a href={CONTRIBUTE_URL}>Contribute</a>
          <a href={GITHUB_REPOSITORY}>GitHub</a>
        </nav>
      )}
    </header>
  );
}

function RegistryFeedback({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) return <div className="science-feedback"><span className="loader" /> Loading…</div>;
  if (error) return <div className="science-feedback science-feedback--error"><CircleAlert size={18} />{error}</div>;
  return null;
}

function BoardCard({
  board,
  index,
  count,
}: {
  board: ScienceBoardDefinition;
  index: number;
  count: number | null;
}) {
  const status = board.status === "active" && count !== null ? recordCountLabel(count) : "Researching";
  return (
    <a className={`science-board-card${board.original ? " science-board-card--original" : ""}`} href={routeForBoard(board)}>
      <span className="science-board-index">{index + 1}</span>
      <span className="science-board-copy">
        <strong>{board.name}</strong>
        <small>{status}</small>
      </span>
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  );
}

function ScienceHome() {
  const { registry, loading, error } = useScienceRegistry();
  const [mathTotal, setMathTotal] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  usePageMetadata("Science Board", "/");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/meta", { cache: "no-cache", signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Math metadata unavailable")))
      .then((payload: { total?: number }) => setMathTotal(typeof payload.total === "number" ? payload.total : null))
      .catch(() => setMathTotal(null));
    return () => controller.abort();
  }, []);

  const records = registry?.records ?? [];
  const countByDiscipline = useMemo(() => {
    const counts = new Map<string, number>();
    for (const record of records) counts.set(record.discipline, (counts.get(record.discipline) ?? 0) + 1);
    return counts;
  }, [records]);

  const needle = query.trim().toLocaleLowerCase();
  const matchedRecords = useMemo(() => {
    if (!needle) return [];
    return records.filter((record) => [
      record.title,
      record.discipline,
      record.field,
      record.discovery_class,
      record.ai_role,
      record.reported_result,
    ].join(" ").toLocaleLowerCase().includes(needle));
  }, [needle, records]);

  const visibleBoards = useMemo(() => {
    if (!needle) return SCIENCE_BOARDS;
    const matchedDisciplines = new Set(matchedRecords.map((record) => record.discipline));
    return SCIENCE_BOARDS.filter((board) =>
      [board.name, board.description, board.coverage].join(" ").toLocaleLowerCase().includes(needle)
      || (board.discipline ? matchedDisciplines.has(board.discipline) : false),
    );
  }, [matchedRecords, needle]);

  const latest = useMemo(() => [...records]
    .sort((a, b) => b.publication_year - a.publication_year || a.title.localeCompare(b.title))
    .slice(0, 5), [records]);

  function boardCount(board: ScienceBoardDefinition): number | null {
    if (board.original) return mathTotal;
    if (!board.discipline) return null;
    return countByDiscipline.get(board.discipline) ?? 0;
  }

  return (
    <div className="science-shell">
      <ScienceHeader />
      <main>
        <section className="science-home-hero">
          <div className="science-home-metrics" aria-label="Registry totals">
            <span><strong>{registry?.total ?? "—"}</strong> science</span>
            <span><strong>{mathTotal ?? "—"}</strong> mathematics</span>
            <span>{registry ? formatCutoff(registry.updatedAt) : "2 Aug 2026"}</span>
          </div>
          <label className="science-search">
            <Search size={20} aria-hidden="true" />
            <span className="sr-only">Search Science Board</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
          </label>
        </section>

        <section className="science-board-section" id="boards">
          <div className="science-section-heading">
            <div>
              <h1>Boards</h1>
            </div>
            <a href="/api/science/export.json"><ArrowDownToLine size={15} />JSON</a>
          </div>
          <RegistryFeedback loading={loading} error={error} />
          {!loading && !error && visibleBoards.length === 0 && <div className="science-feedback">No results.</div>}
          <div className="science-board-grid">
            {visibleBoards.map((board) => (
              <BoardCard key={board.slug} board={board} index={SCIENCE_BOARDS.indexOf(board)} count={boardCount(board)} />
            ))}
          </div>
        </section>

        {needle && matchedRecords.length > 0 ? (
          <section className="science-latest-section" aria-live="polite">
            <div className="science-section-heading"><div><h2>Matches</h2><p>{matchedRecords.length}</p></div></div>
            <DiscoveryRows records={matchedRecords.slice(0, 12)} />
          </section>
        ) : !needle ? (
          <section className="science-latest-section">
            <div className="science-section-heading"><div><h2>Latest</h2></div></div>
            <DiscoveryRows records={latest} />
          </section>
        ) : null}
      </main>
    </div>
  );
}

function DiscoveryRows({ records }: { records: ScienceRecord[] }) {
  return (
    <div className="science-latest-list">
      <div className="science-latest-head"><span>Year</span><span>Board</span><span>Discovery</span><span>Evidence</span></div>
      {records.map((record) => {
        const board = boardForDiscipline(record.discipline);
        if (!board) return null;
        return (
          <a key={record.id} href={`/boards/${board.slug}#record/${record.id}`} className="science-latest-row">
            <span>{record.publication_year}</span>
            <span>{board.name}</span>
            <span><strong>{record.title}</strong><small>{record.field}</small></span>
            <span><TierBadge tier={record.validation_tier} /><ChevronRight size={17} /></span>
          </a>
        );
      })}
    </div>
  );
}

function TierBadge({ tier }: { tier: ScienceValidationTier }) {
  return <span className={`science-tier science-tier--${tier.toLocaleLowerCase()}`}>Tier {tier}</span>;
}

function BoardPage({ board }: { board: ScienceBoardDefinition }) {
  const { registry, loading, error } = useScienceRegistry();
  const [query, setQuery] = useState("");
  const [tiers, setTiers] = useState<ScienceValidationTier[]>([]);
  const [field, setField] = useState("All subfields");
  const [year, setYear] = useState("All years");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileFilters, setMobileFilters] = useState(false);
  usePageMetadata(`${board.name} — Science Board`, `/boards/${board.slug}`);

  const boardRecords = useMemo(() => (registry?.records ?? [])
    .filter((record) => record.discipline === board.discipline)
    .sort((a, b) => b.publication_year - a.publication_year || a.title.localeCompare(b.title)), [board.discipline, registry]);

  useEffect(() => {
    if (boardRecords.length === 0) return;
    const match = window.location.hash.match(/^#record\/(.+)$/);
    const fromHash = boardRecords.find((record) => record.id === decodeURIComponent(match?.[1] ?? ""));
    const compact = window.matchMedia("(max-width: 760px)").matches;
    setSelectedId(fromHash?.id ?? (compact ? null : boardRecords[0].id));
  }, [boardRecords]);

  const fields = useMemo(() => ["All subfields", ...Array.from(new Set(boardRecords.map((record) => record.field))).sort()], [boardRecords]);
  const years = useMemo(() => ["All years", ...Array.from(new Set(boardRecords.map((record) => String(record.publication_year)))).sort().reverse()], [boardRecords]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return boardRecords.filter((record) => (
      (!needle || [record.title, record.field, record.ai_role, record.reported_result].join(" ").toLocaleLowerCase().includes(needle))
      && (tiers.length === 0 || tiers.includes(record.validation_tier))
      && (field === "All subfields" || field === record.field)
      && (year === "All years" || year === String(record.publication_year))
    ));
  }, [boardRecords, field, query, tiers, year]);

  const selected = boardRecords.find((record) => record.id === selectedId) ?? null;
  const activeFilterCount = tiers.length + (field === "All subfields" ? 0 : 1) + (year === "All years" ? 0 : 1);

  function toggleTier(tier: ScienceValidationTier) {
    setTiers((current) => current.includes(tier) ? current.filter((value) => value !== tier) : [...current, tier]);
  }

  function openRecord(record: ScienceRecord) {
    setSelectedId(record.id);
    window.history.replaceState(null, "", `#record/${encodeURIComponent(record.id)}`);
  }

  function closeRecord() {
    setSelectedId(null);
    window.history.replaceState(null, "", window.location.pathname);
  }

  const filters = (
    <>
      <div className="science-filter-mobile-head"><span>Filters</span><button type="button" onClick={() => setMobileFilters(false)} aria-label="Close filters"><X size={18} /></button></div>
      <fieldset className="science-filter-group">
        <legend>Evidence</legend>
        {(["A", "B"] as ScienceValidationTier[]).map((tier) => (
          <label key={tier} className="science-filter-check">
            <input type="checkbox" checked={tiers.includes(tier)} onChange={() => toggleTier(tier)} />
            <span>{tiers.includes(tier) && <Check size={12} />}</span>
            <em>Tier {tier}</em>
            <small>{boardRecords.filter((record) => record.validation_tier === tier).length}</small>
          </label>
        ))}
      </fieldset>
      <fieldset className="science-filter-group">
        <legend>Year</legend>
        <select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Publication year">
          {years.map((value) => <option key={value}>{value}</option>)}
        </select>
      </fieldset>
      <fieldset className="science-filter-group">
        <legend>Subfield</legend>
        <select value={field} onChange={(event) => setField(event.target.value)} aria-label="Scientific subfield">
          {fields.map((value) => <option key={value}>{value}</option>)}
        </select>
      </fieldset>
      {activeFilterCount > 0 && <button type="button" className="science-clear-filters" onClick={() => { setTiers([]); setField("All subfields"); setYear("All years"); }}>Clear all filters</button>}
    </>
  );

  if (board.status === "researching") return <ResearchingBoard board={board} />;

  return (
    <div className="science-shell">
      <ScienceHeader />
      <main>
        <section className="science-board-hero">
          <p className="science-breadcrumb"><a href="/">Boards</a><span>/</span>{board.name}</p>
          <h1>{board.name}</h1>
          <div className="science-board-status"><span>{loading ? "— records" : recordCountLabel(boardRecords.length)}</span><span>{registry ? formatCutoff(registry.updatedAt) : "2 Aug 2026"}</span></div>
          <div className="science-board-search-row">
            <label className="science-search">
              <Search size={19} aria-hidden="true" />
              <span className="sr-only">Search this board</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
            </label>
            <button type="button" className="science-filter-button" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={17} />Filters{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
          </div>
        </section>

        <section className="science-registry">
          <aside className="science-filter-rail" aria-label="Filter this board">{filters}</aside>
          <div className="science-results-panel">
            <div className="science-results-head"><span><strong>{filtered.length}</strong> {filtered.length === 1 ? "result" : "results"}</span><a href={`/api/science/export.json?board=${board.slug}`}><ArrowDownToLine size={15} />JSON</a></div>
            <RegistryFeedback loading={loading} error={error} />
            {!loading && !error && filtered.length === 0 && <div className="science-feedback">No results.</div>}
            <div className="science-record-list">
              {filtered.map((record) => (
                <button key={record.id} type="button" className={`science-record-row${selectedId === record.id ? " is-selected" : ""}`} onClick={() => openRecord(record)}>
                  <span className="science-record-year">{record.publication_year}</span>
                  <span className="science-record-main">
                    <span className="science-record-badges"><TierBadge tier={record.validation_tier} /><em>{record.discovery_class}</em></span>
                    <strong>{record.title}</strong>
                    <small><span>{record.field}</span></small>
                  </span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <aside className={`science-detail-panel${selected ? " has-record" : ""}`} aria-label="Selected discovery detail">
            {selected ? <ScienceRecordDetail record={selected} onClose={closeRecord} /> : null}
          </aside>
        </section>
        <a className="science-back-link" href="/"><ArrowLeft size={16} />Boards</a>
      </main>
      {mobileFilters && <div className="science-filter-overlay" role="dialog" aria-modal="true" aria-label="Board filters"><button type="button" aria-label="Close filters" onClick={() => setMobileFilters(false)} /><div>{filters}<button type="button" className="science-apply-filters" onClick={() => setMobileFilters(false)}>Show {filtered.length} results</button></div></div>}
    </div>
  );
}

function ScienceRecordDetail({ record, onClose }: { record: ScienceRecord; onClose: () => void }) {
  return (
    <div className="science-detail-inner">
      <div className="science-detail-topline"><span>{record.id}</span><button type="button" onClick={onClose} aria-label="Close detail"><X size={17} /></button></div>
      <TierBadge tier={record.validation_tier} />
      <h2>{record.title}</h2>
      <dl>
        <div><dt>Year</dt><dd>{record.publication_year}</dd></div>
        <div><dt>Field</dt><dd>{record.field}</dd></div>
        <div><dt>Type</dt><dd>{record.discovery_class}</dd></div>
        <div><dt>Validation</dt><dd>{record.evidence_stage}</dd></div>
      </dl>
      <section className="science-finding"><h3>Result</h3><p>{record.reported_result}</p></section>
      <section className="science-sources">
        <h3>Sources</h3>
        <a href={record.primary_source_url} target="_blank" rel="noreferrer"><span><small>Primary source</small>{sourceHost(record.primary_source_url)}</span><ArrowUpRight size={16} /></a>
        <a href={record.supporting_source_url} target="_blank" rel="noreferrer"><span><small>Supporting source</small>{sourceHost(record.supporting_source_url)}</span><ArrowUpRight size={16} /></a>
      </section>
    </div>
  );
}

function ResearchingBoard({ board }: { board: ScienceBoardDefinition }) {
  usePageMetadata(`${board.name} — Science Board`, `/boards/${board.slug}`);
  return (
    <div className="science-shell">
      <ScienceHeader />
      <main className="science-researching-page">
        <p className="science-breadcrumb"><a href="/">Boards</a><span>/</span>{board.name}</p>
        <span className="science-researching-label">Researching</span>
        <h1>{board.name}</h1>
        <div className="science-researching-note">
          <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer">Submit source <ArrowUpRight size={16} /></a>
        </div>
        <a className="science-back-link science-back-link--standalone" href="/"><ArrowLeft size={16} />Boards</a>
      </main>
    </div>
  );
}

function MethodPage() {
  usePageMetadata("Data — Science Board", "/method");
  return (
    <div className="science-shell">
      <ScienceHeader />
      <main className="science-researching-page science-data-page">
        <p className="science-breadcrumb"><a href="/">Boards</a><span>/</span>Data</p>
        <h1>Data</h1>
        <div className="science-data-links">
          <a href="/api/science/export.json"><ArrowDownToLine size={16} />Science JSON</a>
          <a href="/math">Mathematics <ArrowRight size={16} /></a>
        </div>
      </main>
    </div>
  );
}

function NotFoundPage() {
  usePageMetadata("Board not found — Science Board", window.location.pathname);
  return (
    <div className="science-shell"><ScienceHeader /><main className="science-researching-page"><span className="science-researching-label">404</span><h1>Board not found</h1><a className="science-back-link science-back-link--standalone" href="/"><ArrowLeft size={16} />Boards</a></main></div>
  );
}

export default function ScienceApp() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/boards") return <ScienceHome />;
  if (path === "/method") return <MethodPage />;
  const match = path.match(/^\/boards\/([a-z0-9-]+)$/);
  if (match) {
    const board = boardBySlug(match[1]);
    return board ? <BoardPage board={board} /> : <NotFoundPage />;
  }
  return <NotFoundPage />;
}
