export interface PageMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
}

const ORIGIN = "https://scienceboard.sqlan.workers.dev";
const SCIENCE_DESCRIPTION = "A provenance-first registry of discoveries made with AI across scientific disciplines, with AI roles, human work, validation, sources, and caveats kept separate.";
const MATH_DESCRIPTION = "A source-first registry of mathematical results proved, disproved, improved, or formally verified with AI involvement.";

function normalizePath(path: string): string {
  const normalized = path.replace(/\/+$/, "") || "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export function pageMetadataForPath(path: string, scienceTitle = "Science Board"): PageMetadata {
  const normalizedPath = normalizePath(path);
  if (normalizedPath === "/math") {
    return {
      title: "AIMathBase",
      description: MATH_DESCRIPTION,
      canonicalUrl: `${ORIGIN}/math`,
    };
  }

  return {
    title: scienceTitle,
    description: SCIENCE_DESCRIPTION,
    canonicalUrl: `${ORIGIN}${normalizedPath === "/" ? "/" : normalizedPath}`,
  };
}
