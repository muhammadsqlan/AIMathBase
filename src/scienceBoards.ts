import type { ScienceBoardDefinition } from "./scienceTypes";

export const SCIENCE_BOARDS: ScienceBoardDefinition[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    discipline: null,
    description: "Proofs, counterexamples, formalizations, algorithms, and research benchmarks.",
    coverage: "The original AIMathBase registry.",
    status: "active",
    original: true,
  },
  {
    slug: "biomedical-health",
    name: "Biomedical & Health",
    discipline: "Biomedical science",
    description: "Therapeutic candidates, targets, mechanisms, and experimentally tested hypotheses.",
    coverage: "Seed audit strong but not exhaustive.",
    status: "active",
  },
  {
    slug: "astronomy",
    name: "Astronomy",
    discipline: "Astronomy",
    description: "Objects, signals, and transient events recovered or classified with AI.",
    coverage: "Exoplanets, radio transients, and autonomous classification reviewed.",
    status: "active",
  },
  {
    slug: "chemistry-materials",
    name: "Chemistry & Materials",
    discipline: "Materials and chemistry",
    description: "Experimentally tested formulations, materials, and computational candidate atlases.",
    coverage: "Catalysis and materials-design seed review in progress.",
    status: "active",
  },
  {
    slug: "earth-planetary",
    name: "Earth & Planetary Science",
    discipline: "Planetary and Earth science",
    description: "Planetary mapping, seismology, geology, and geophysical process evidence.",
    coverage: "Lunar mapping and seismology reviewed so far.",
    status: "active",
  },
  {
    slug: "archaeology-paleontology",
    name: "Archaeology & Paleontology",
    discipline: "Archaeology and paleontology",
    description: "Field-verified objects, fossil reconstruction, and evolutionary evidence.",
    coverage: "Nazca survey and fossil segmentation reviewed so far.",
    status: "active",
  },
  {
    slug: "neuroscience",
    name: "Neuroscience",
    discipline: "Neuroscience",
    description: "Connectomes, circuit structure, and AI-assisted neural measurements.",
    coverage: "Connectomics and circuit-wiring seed review in progress.",
    status: "active",
  },
  {
    slug: "genomics-virology",
    name: "Genomics & Virology",
    discipline: "Genomics and virology",
    description: "Sequence-defined candidates, genomic patterns, and molecular validation.",
    coverage: "Metatranscriptomic virology reviewed so far.",
    status: "active",
  },
  {
    slug: "ecology-animal-behaviour",
    name: "Ecology & Animal Behaviour",
    discipline: "Ecology and animal behaviour",
    description: "Biodiversity, behaviour, bioacoustics, and ecosystem observations.",
    coverage: "Bioacoustics reviewed so far.",
    status: "active",
  },
  {
    slug: "physics",
    name: "Physics",
    discipline: null,
    description: "Particle, condensed-matter, plasma, optics, fusion, and quantum experiments.",
    coverage: "No strict empirical case has passed review yet.",
    status: "researching",
  },
  {
    slug: "climate-ocean",
    name: "Climate & Ocean Science",
    discipline: null,
    description: "Climate systems, atmospheric chemistry, oceans, hydrology, and remote sensing.",
    coverage: "Dedicated source review is in progress.",
    status: "researching",
  },
  {
    slug: "botany-agriculture",
    name: "Botany & Agriculture",
    discipline: null,
    description: "Plant genomics, crop breeding, phenotyping, soil, and automated growing systems.",
    coverage: "Dedicated source review is in progress.",
    status: "researching",
  },
  {
    slug: "computer-science",
    name: "Computer Science",
    discipline: null,
    description: "Algorithms, systems, security, programming languages, and computing research.",
    coverage: "Non-mathematical computing cases are being scoped.",
    status: "researching",
  },
  {
    slug: "engineering-robotics",
    name: "Engineering & Robotics",
    discipline: null,
    description: "Devices, structures, energy systems, manufacturing, and autonomous laboratories.",
    coverage: "Dedicated source review is in progress.",
    status: "researching",
  },
  {
    slug: "social-behavioural",
    name: "Social & Behavioural Science",
    discipline: null,
    description: "Psychology, economics, linguistics, sociology, and computational social science.",
    coverage: "Scope and field-specific review rules are being defined.",
    status: "researching",
  },
];

export function boardForDiscipline(discipline: string): ScienceBoardDefinition | undefined {
  return SCIENCE_BOARDS.find((board) => board.discipline === discipline);
}

export function boardBySlug(slug: string): ScienceBoardDefinition | undefined {
  return SCIENCE_BOARDS.find((board) => board.slug === slug);
}
