import type { ExportedHandler } from "@cloudflare/workers-types";
import scienceArtifactJson from "../public/data/science-registry.json";
import { pageMetadataForPath, type PageMetadata } from "../src/pageMetadata";
import type { ScienceRecord, ScienceRegistryResponse, ScienceRegistrySummary } from "../src/scienceTypes";
import type { LabRef, MathRecord, RegistryResponse, SourceLink } from "../src/types";

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

interface RecordRow {
  id: number;
  slug: string;
  title: string;
  summary: string;
  outcome: MathRecord["outcome"];
  novelty: MathRecord["novelty"];
  domain: string;
  event_date: string;
  ai_system: string;
  ai_role: string;
  human_role: string;
  verification: string;
  verification_tier: MathRecord["verificationTier"];
  caveat: string;
  featured: number;
  tags_json: string;
}

interface SourceRow {
  record_id: number;
  kind: SourceLink["kind"];
  title: string;
  url: string;
  is_primary: number;
}

interface LabRow {
  record_id: number;
  slug: string;
  name: string;
  kind: LabRef["kind"];
}

interface ScienceArtifact {
  snapshot: {
    datasets: {
      summary: ScienceRegistrySummary[];
      discoveries: ScienceRecord[];
    };
  };
}

const LEGACY_HOST = "aimathbase.sqlan.workers.dev";
const SCIENCE_ORIGIN = "https://scienceboard.sqlan.workers.dev";
const SCIENCE_UPDATED_AT = "2026-08-02";
const SCIENCE_SCOPE_NOTE = "Reviewed seed census, not a systematic review or a claim of completeness.";

const BOARD_DISCIPLINES: Record<string, string> = {
  "biomedical-health": "Biomedical science",
  astronomy: "Astronomy",
  "chemistry-materials": "Materials and chemistry",
  "earth-planetary": "Planetary and Earth science",
  "archaeology-paleontology": "Archaeology and paleontology",
  neuroscience: "Neuroscience",
  "genomics-virology": "Genomics and virology",
  "ecology-animal-behaviour": "Ecology and animal behaviour",
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "public, max-age=60, s-maxage=300",
  "x-content-type-options": "nosniff",
};

function rewritePageMetadata(response: Response, metadata: PageMetadata): Response {
  if (!response.headers.get("content-type")?.includes("text/html")) return response;

  return new HTMLRewriter()
    .on("title", { element: (element) => { element.setInnerContent(metadata.title); } })
    .on('meta[name="description"]', { element: (element) => { element.setAttribute("content", metadata.description); } })
    .on('link[rel="canonical"]', { element: (element) => { element.setAttribute("href", metadata.canonicalUrl); } })
    .on('meta[property="og:title"]', { element: (element) => { element.setAttribute("content", metadata.title); } })
    .on('meta[property="og:description"]', { element: (element) => { element.setAttribute("content", metadata.description); } })
    .on('meta[property="og:url"]', { element: (element) => { element.setAttribute("content", metadata.canonicalUrl); } })
    .transform(response);
}

function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  const cacheHeader = status >= 400 ? { "cache-control": "no-store" } : {};
  return Response.json(data, { status, headers: { ...JSON_HEADERS, ...cacheHeader, ...headers } });
}

function mapRecord(row: RecordRow, sources: SourceLink[], labs: LabRef[]): MathRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    outcome: row.outcome,
    novelty: row.novelty,
    domain: row.domain,
    eventDate: row.event_date,
    aiSystem: row.ai_system,
    aiRole: row.ai_role,
    humanRole: row.human_role,
    verification: row.verification,
    verificationTier: row.verification_tier,
    caveat: row.caveat,
    featured: row.featured === 1,
    tags: JSON.parse(row.tags_json) as string[],
    sources,
    labs,
  };
}

async function loadScienceRegistry(): Promise<ScienceRegistryResponse> {
  const artifact = scienceArtifactJson as unknown as ScienceArtifact;
  const records = artifact.snapshot?.datasets?.discoveries;
  const summary = artifact.snapshot?.datasets?.summary?.[0];
  if (!Array.isArray(records) || !summary) throw new Error("Science registry asset has an invalid shape");
  return {
    records,
    summary,
    total: records.length,
    updatedAt: summary.cut_off_date || SCIENCE_UPDATED_AT,
    scopeNote: SCIENCE_SCOPE_NOTE,
  };
}

async function loadRecords(db: D1Database, slug?: string): Promise<MathRecord[]> {
  const recordQuery = slug
    ? db.prepare("SELECT * FROM records WHERE slug = ? LIMIT 1").bind(slug)
    : db.prepare("SELECT * FROM records ORDER BY event_date DESC, id DESC");
  const recordResult = await recordQuery.all<RecordRow>();
  const rows = recordResult.results;
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);
  const placeholders = ids.map(() => "?").join(",");
  const [sourceResult, labResult] = await Promise.all([
    db
      .prepare(`SELECT record_id, kind, title, url, is_primary FROM sources WHERE record_id IN (${placeholders}) ORDER BY is_primary DESC, id`)
      .bind(...ids)
      .all<SourceRow>(),
    db
      .prepare(`SELECT record_labs.record_id, labs.slug, labs.name, labs.kind
        FROM record_labs
        JOIN labs ON labs.id = record_labs.lab_id
        WHERE record_labs.record_id IN (${placeholders})
        ORDER BY labs.name`)
      .bind(...ids)
      .all<LabRow>(),
  ]);

  const sourceMap = new Map<number, SourceLink[]>();
  for (const source of sourceResult.results) {
    const bucket = sourceMap.get(source.record_id) ?? [];
    bucket.push({
      kind: source.kind,
      title: source.title,
      url: source.url,
      primary: source.is_primary === 1,
    });
    sourceMap.set(source.record_id, bucket);
  }


  const labMap = new Map<number, LabRef[]>();
  for (const lab of labResult.results) {
    const bucket = labMap.get(lab.record_id) ?? [];
    bucket.push({ slug: lab.slug, name: lab.name, kind: lab.kind });
    labMap.set(lab.record_id, bucket);
  }

  return rows.map((row) => mapRecord(row, sourceMap.get(row.id) ?? [], labMap.get(row.id) ?? []));
}

export async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return json({ error: "Method not allowed" }, 405, { allow: "GET, HEAD" });
  }

  if (url.pathname === "/api/health") {
    const [result, science] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) AS count FROM records").first<{ count: number }>(),
      loadScienceRegistry(),
    ]);
    return json({ ok: true, records: result?.count ?? 0, scienceRecords: science.total });
  }

  if (url.pathname === "/api/science" || url.pathname === "/api/science/export.json") {
    const boardSlug = url.searchParams.get("board");
    if (boardSlug !== null && !Object.hasOwn(BOARD_DISCIPLINES, boardSlug)) {
      return json({ error: "Science board not found", board: boardSlug }, 404);
    }

    const registry = await loadScienceRegistry();
    const discipline = boardSlug ? BOARD_DISCIPLINES[boardSlug] : undefined;
    const records = discipline ? registry.records.filter((record) => record.discipline === discipline) : registry.records;
    const payload = url.pathname.endsWith("export.json")
      ? { records, total: records.length, updatedAt: registry.updatedAt, scopeNote: registry.scopeNote }
      : registry;
    const disposition: Record<string, string> = url.pathname.endsWith("export.json")
      ? { "content-disposition": `attachment; filename="science-board-${boardSlug ?? "all"}-${registry.updatedAt}.json"` }
      : {};
    return json(payload, 200, disposition);
  }

  const scienceMatch = url.pathname.match(/^\/api\/science\/records\/([A-Za-z0-9-]+)$/);
  if (scienceMatch) {
    const registry = await loadScienceRegistry();
    const record = registry.records.find((item) => item.id === scienceMatch[1]);
    return record ? json(record) : json({ error: "Science record not found" }, 404);
  }

  if (url.pathname === "/api/meta") {
    const [count, domains] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) AS count, MAX(event_date) AS latest FROM records").first<{ count: number; latest: string }>(),
      env.DB.prepare("SELECT domain, COUNT(*) AS count FROM records GROUP BY domain ORDER BY count DESC, domain").all<{ domain: string; count: number }>(),
    ]);
    return json({
      total: count?.count ?? 0,
      latestEventDate: count?.latest ?? null,
      domains: domains.results,
      methodologyVersion: "1.1",
    });
  }

  if (url.pathname === "/api/records" || url.pathname === "/api/export.json") {
    const records = await loadRecords(env.DB);
    const payload: RegistryResponse = { records, total: records.length, updatedAt: "2026-08-02" };
    const disposition: Record<string, string> = url.pathname.endsWith("export.json")
      ? { "content-disposition": 'attachment; filename="aimathbase-export-2026-08-02.json"' }
      : {};
    return json(payload, 200, disposition);
  }

  const match = url.pathname.match(/^\/api\/records\/([a-z0-9-]+)$/);
  if (match) {
    const records = await loadRecords(env.DB, match[1]);
    return records[0] ? json(records[0]) : json({ error: "Record not found" }, 404);
  }

  return json({ error: "API route not found" }, 404);
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.hostname === LEGACY_HOST && !url.pathname.startsWith("/api/")) {
        const target = new URL("/math", SCIENCE_ORIGIN);
        target.search = url.search;
        return Response.redirect(target.toString(), 308);
      }
      if (url.pathname.startsWith("/api/")) return await handleApi(request, env, url);
      const assetResponse = await env.ASSETS.fetch(request);
      return url.pathname === "/math" || url.pathname === "/math/"
        ? rewritePageMetadata(assetResponse, pageMetadataForPath("/math"))
        : assetResponse;
    } catch (error) {
      console.error("Unhandled request error", { path: url.pathname, error });
      return url.pathname.startsWith("/api/")
        ? json({ error: "The registry is temporarily unavailable" }, 500)
        : env.ASSETS.fetch(request);
    }
  },
} satisfies ExportedHandler<Env>;
