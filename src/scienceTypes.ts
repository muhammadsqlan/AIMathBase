export type ScienceValidationTier = "A" | "B";

export interface ScienceRecord {
  id: string;
  publication_year: number;
  discipline: string;
  field: string;
  title: string;
  discovery_class: string;
  ai_role: string;
  human_role: string;
  evidence_stage: string;
  validation_tier: ScienceValidationTier;
  novelty_scope: string;
  reported_result: string;
  primary_source_url: string;
  supporting_source_url: string;
  caveat: string;
}

export interface ScienceRegistrySummary {
  reviewed_cases: number;
  discipline_groups: number;
  tier_a_cases: number;
  tier_b_cases: number;
  cut_off_date: string;
}

export interface ScienceRegistryResponse {
  records: ScienceRecord[];
  summary: ScienceRegistrySummary;
  total: number;
  updatedAt: string;
  scopeNote: string;
}

export type BoardStatus = "active" | "researching";

export interface ScienceBoardDefinition {
  slug: string;
  name: string;
  discipline: string | null;
  description: string;
  coverage: string;
  status: BoardStatus;
  original?: boolean;
}
