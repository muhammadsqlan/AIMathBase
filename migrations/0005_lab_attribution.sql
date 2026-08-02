CREATE TABLE labs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('company', 'academic', 'independent'))
);

CREATE TABLE record_labs (
  record_id INTEGER NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  lab_id INTEGER NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'system-developer',
  PRIMARY KEY (record_id, lab_id)
);

CREATE INDEX record_labs_lab_id_idx ON record_labs(lab_id);

INSERT INTO labs (slug, name, kind)
VALUES
  ('openai', 'OpenAI', 'company'),
  ('google-deepmind', 'Google DeepMind', 'company'),
  ('anthropic', 'Anthropic', 'company'),
  ('harmonic', 'Harmonic', 'company'),
  ('axiom-math', 'Axiom Math', 'company'),
  ('math-inc', 'Math, Inc.', 'company'),
  ('improofbench', 'IMProofBench', 'academic'),
  ('ucla-moonshot', 'UCLA Moonshot', 'academic'),
  ('princeton-momus', 'Princeton Momus', 'academic'),
  ('rethlas-archon', 'Rethlas & Archon team', 'academic'),
  ('qed', 'QED team', 'independent');

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'openai'
  AND records.slug IN (
    'astra-binary-spherical-code-bounds',
    'astra-cohn-elkies-sphere-packing',
    'astra-connes-rigidity-counterexample',
    'astra-ehrhart-volume-conjecture',
    'astra-extremal-compactness-degeneracy',
    'astra-gapcvp-hardness',
    'astra-multicolor-triangle-ramsey',
    'astra-nonsofic-group',
    'astra-permanent-lower-bounds',
    'astra-quantum-parallel-repetition',
    'erdos-728-factorial-divisibility',
    'erdos-846-rediscovery',
    'erdos-848-density-estimate',
    'erdos-960',
    'erdos-unit-distance-conjecture',
    'feige-conjecture',
    'first-proof-blind-refereeing',
    'first-proof-hilbert-series-hooks',
    'gradient-descent-step-size',
    'grothendieck-group-scheme-counterexample',
    'maxwell-point-charge-counterexample',
    'nesterov-stability'
  );

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'google-deepmind'
  AND records.slug IN (
    'alphaevolve-four-by-four',
    'alphaevolve-kissing-number-11',
    'alphageometry-olympiad',
    'alphaproof-nexus-open-problems',
    'alphatensor-matrix-multiplication',
    'combinatorial-invariance-kl-polynomials',
    'erdos-1089',
    'erdos-659-few-distances',
    'erdos-846-rediscovery',
    'funsearch-cap-sets',
    'imo-2024-silver',
    'knot-signature-natural-slope',
    'pure-o-sequences-log-concavity'
  );

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'anthropic'
  AND records.slug IN (
    'grothendieck-group-scheme-counterexample',
    'jacobian-counterexample-dimension-three',
    'kawauchi-mod-four-factorization'
  );

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'harmonic'
  AND records.slug IN ('erdos-728-factorial-divisibility', 'kourovka-eight-problems');

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'axiom-math'
  AND records.slug IN ('fel-polynomial-conjecture', 'partial-vandiver-density-one');

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'math-inc'
  AND records.slug = 'sphere-packing-formalization';

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'improofbench'
  AND records.slug IN ('first-proof-blind-refereeing', 'first-proof-hilbert-series-hooks');

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'ucla-moonshot'
  AND records.slug IN ('first-proof-blind-refereeing', 'first-proof-hilbert-series-hooks');

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'princeton-momus'
  AND records.slug = 'first-proof-blind-refereeing';

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'rethlas-archon'
  AND records.slug = 'anderson-quasi-completeness';

INSERT INTO record_labs (record_id, lab_id)
SELECT records.id, labs.id
FROM records CROSS JOIN labs
WHERE labs.slug = 'qed'
  AND records.slug = 'qed-local-invariant-cycles';
