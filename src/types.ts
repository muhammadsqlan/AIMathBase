export type Outcome = "proved" | "disproved" | "discovered" | "formalized" | "benchmark";
export type Novelty = "new-result" | "human-ai" | "rediscovery" | "formalization" | "capability";
export type VerificationTier = "formal" | "published" | "expert" | "reported";

export interface SourceLink {
  kind: "paper" | "formal-proof" | "announcement" | "expert-review" | "project" | "problem";
  title: string;
  url: string;
  primary: boolean;
}

export interface MathRecord {
  id: number;
  slug: string;
  title: string;
  summary: string;
  outcome: Outcome;
  novelty: Novelty;
  domain: string;
  eventDate: string;
  aiSystem: string;
  aiRole: string;
  humanRole: string;
  verification: string;
  verificationTier: VerificationTier;
  caveat: string;
  featured: boolean;
  tags: string[];
  sources: SourceLink[];
}

export interface RegistryResponse {
  records: MathRecord[];
  total: number;
  updatedAt: string;
}
