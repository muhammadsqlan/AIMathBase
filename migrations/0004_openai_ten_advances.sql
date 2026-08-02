INSERT INTO records
  (slug, title, summary, outcome, novelty, domain, event_date, ai_system, ai_role, human_role, verification, verification_tier, caveat, featured, tags_json)
VALUES
  (
    'astra-cohn-elkies-sphere-packing',
    'Cohn–Elkies high-dimensional sphere-packing threshold',
    'The exact asymptotic decay rate of the Cohn–Elkies linear-programming bound was determined, yielding the first improvement since 1978 to the general high-dimensional sphere-packing exponent and matching the limit of this proof method.',
    'proved',
    'new-result',
    'Discrete geometry',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated the mathematical argument, helped prepare the manuscript, and translated the final result into Lean.',
    'OpenAI researchers selected the result, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificate.',
    'formal',
    'This determines the asymptotic strength of the Cohn–Elkies upper-bound method, not the exact sphere-packing density; independent specialist review of the new argument has not yet been located.',
    1,
    '["sphere packing","Cohn–Elkies","Fourier analysis","Lean"]'
  ),
  (
    'astra-binary-spherical-code-bounds',
    'Exponentially improved binary and spherical code bounds',
    'New two-point linear-programming certificates improve the classical fixed-distance upper bounds for unrestricted binary and high-dimensional spherical codes by exponential factors across their parameter ranges.',
    'proved',
    'new-result',
    'Coding theory',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated the mathematical argument, helped prepare the manuscript, and translated the final result into Lean.',
    'OpenAI researchers selected the result, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificates for the binary and spherical statements.',
    'formal',
    'These are asymptotic upper-bound improvements, not exact finite-dimensional code sizes; the chapter combines related binary-code and spherical-code results, and independent specialist review is pending.',
    0,
    '["binary codes","spherical codes","linear programming","Lean"]'
  ),
  (
    'astra-nonsofic-group',
    'Explicit non-sofic group',
    'The unit group of the binary Leavitt algebra over F2 was proved non-sofic, providing an explicit countable counterexample to the conjecture that every group is sofic.',
    'disproved',
    'new-result',
    'Group theory',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated the construction and proof, helped prepare the manuscript, and translated the final result into Lean.',
    'OpenAI researchers selected the result, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificate.',
    'formal',
    'This resolves the soficity question but does not settle distinct questions such as whether every group is hyperlinear; independent specialist review has not yet been located.',
    0,
    '["sofic groups","Leavitt algebra","property T","Lean"]'
  ),
  (
    'astra-connes-rigidity-counterexample',
    'Counterexample to Connes’s rigidity conjecture',
    'A countably infinite family of pairwise nonisomorphic, mutually commensurable, finitely generated ICC property-(T) groups was constructed with isomorphic group von Neumann algebras.',
    'disproved',
    'new-result',
    'Operator algebras',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated the construction and proof, helped prepare the manuscript, and translated the final result into Lean.',
    'OpenAI researchers selected the result, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificate.',
    'formal',
    'The manuscript acknowledges independent concurrent work by Shuoxing Zhou, partly assisted by GPT-5.6 Sol; independent specialist review of this construction has not yet been located.',
    0,
    '["Connes rigidity","von Neumann algebras","property T","Lean"]'
  ),
  (
    'astra-permanent-lower-bounds',
    'Permanent circuit and formula lower bounds',
    'For exact symbolic computation of the n-by-n permanent over C, division-free circuits require Ω(n^2 log log n) gates and arithmetic formulas require Ω(n^4/log n) variable leaves, including valid formulas with division.',
    'proved',
    'new-result',
    'Algebraic complexity',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated the lower-bound arguments, helped prepare the manuscript, and translated the final results into Lean.',
    'OpenAI researchers selected the result, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificate.',
    'formal',
    'The circuit theorem is division-free, the formula theorem is stronger but applies to tree-like formulas, and neither result proves VP differs from VNP; independent specialist review is pending.',
    0,
    '["permanent","arithmetic circuits","formula lower bounds","Lean"]'
  ),
  (
    'astra-quantum-parallel-repetition',
    'Exponential parallel repetition for entangled games',
    'An exponential parallel-repetition theorem was proved for every finite two-player, one-round entangled game whose entangled value is below one, extending the classical repetition principle to arbitrary games in this setting.',
    'proved',
    'new-result',
    'Quantum information',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated the proof, helped prepare the manuscript, and translated the final theorem into Lean.',
    'OpenAI researchers selected the result, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificate.',
    'formal',
    'The theorem concerns finite two-player one-round games, and its quantitative exponent is explicitly not claimed to be optimal; independent specialist review has not yet been located.',
    0,
    '["parallel repetition","entangled games","quantum complexity","Lean"]'
  ),
  (
    'astra-gapcvp-hardness',
    'Polynomial-factor hardness for the closest vector problem',
    'A deterministic polynomial-time reduction from 3SAT proves n^(1/400)-factor NP-hardness for the Euclidean closest vector problem, with related hardness consequences for binary decoding and fixed rational lattice norms.',
    'proved',
    'new-result',
    'Computational complexity',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated the reduction and proof, helped prepare the manuscript, and translated the final theorem into Lean.',
    'OpenAI researchers selected the result, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificate.',
    'formal',
    'This is worst-case approximation hardness and does not directly break lattice cryptosystems, which rely on structured or average-case assumptions; independent specialist review is pending.',
    0,
    '["closest vector problem","lattices","NP-hardness","Lean"]'
  ),
  (
    'astra-ehrhart-volume-conjecture',
    'Sharp Ehrhart volume inequality in every dimension',
    'Every n-dimensional convex body whose barycenter is its unique interior lattice point was proved to have volume at most (n+1)^n/n!, attaining Ehrhart’s conjectured sharp bound in all dimensions.',
    'proved',
    'new-result',
    'Convex geometry',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated the proof, helped prepare the manuscript, and translated the final theorem into Lean.',
    'OpenAI researchers selected the result, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificate.',
    'formal',
    'The sharp volume bound is proved, but the manuscript does not determine whether the known centered simplices are the only equality cases; independent specialist review is pending.',
    0,
    '["Ehrhart conjecture","convex bodies","lattice points","Lean"]'
  ),
  (
    'astra-multicolor-triangle-ramsey',
    'Superexponential multicolor triangle Ramsey lower bound',
    'A lower bound of the form (c k^(1/3)/log k)^k proves that the k-color triangle Ramsey number R_k(3) is k^Theta(k), resolving Erdős Problem 183 and implying unbounded Shannon capacity among graphs with independence number two.',
    'proved',
    'new-result',
    'Ramsey theory',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated the construction and proof, helped prepare the manuscript, and translated the final theorem into Lean.',
    'OpenAI researchers selected the result, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificate.',
    'formal',
    'This determines the asymptotic growth class rather than exact multicolor Ramsey numbers; independent specialist review of the new argument has not yet been located.',
    0,
    '["Ramsey numbers","Erdős 183","Shannon capacity","Lean"]'
  ),
  (
    'astra-extremal-compactness-degeneracy',
    'Counterexamples to two extremal-number conjectures',
    'Separate bipartite graph constructions disprove the Erdős–Simonovits compactness conjecture and Erdős’s proposed extremal bound for r-degenerate bipartite graphs already at r=2, resolving Erdős Problems 146 and 180.',
    'disproved',
    'new-result',
    'Extremal combinatorics',
    '2026-08-01',
    'OpenAI Astra (internal version)',
    'Generated both constructions and proofs, helped prepare the manuscript, and translated the final results into Lean.',
    'OpenAI researchers selected the results, helped prepare the manuscript and formalization, released the artifacts, and took responsibility for correctness.',
    'Publisher-released manuscript and zero-sorry Lean 4 certificates for both counterexamples.',
    'formal',
    'This chapter contains two distinct counterexamples under one OpenAI result heading; it does not settle broader extremal-number classification questions, and independent specialist review is pending.',
    0,
    '["extremal numbers","Erdős–Simonovits","Erdős 146","Erdős 180","Lean"]'
  );

UPDATE records
SET featured = CASE WHEN slug = 'astra-cohn-elkies-sphere-packing' THEN 1 ELSE 0 END;

INSERT INTO sources (record_id, kind, title, url, is_primary)
SELECT id, 'announcement', 'OpenAI: Ten advances in mathematics and theoretical computer science', 'https://openai.com/index/ten-advances-in-mathematics/', 1
FROM records
WHERE slug IN (
  'astra-cohn-elkies-sphere-packing',
  'astra-binary-spherical-code-bounds',
  'astra-nonsofic-group',
  'astra-connes-rigidity-counterexample',
  'astra-permanent-lower-bounds',
  'astra-quantum-parallel-repetition',
  'astra-gapcvp-hardness',
  'astra-ehrhart-volume-conjecture',
  'astra-multicolor-triangle-ramsey',
  'astra-extremal-compactness-degeneracy'
);

INSERT INTO sources (record_id, kind, title, url, is_primary)
SELECT id, 'paper', 'Ten Advances in Mathematics and Theoretical Computer Science', 'https://cdn.openai.com/pdf/ten-proofs-oai.pdf', 1
FROM records
WHERE slug IN (
  'astra-cohn-elkies-sphere-packing',
  'astra-binary-spherical-code-bounds',
  'astra-nonsofic-group',
  'astra-connes-rigidity-counterexample',
  'astra-permanent-lower-bounds',
  'astra-quantum-parallel-repetition',
  'astra-gapcvp-hardness',
  'astra-ehrhart-volume-conjecture',
  'astra-multicolor-triangle-ramsey',
  'astra-extremal-compactness-degeneracy'
);

INSERT INTO sources (record_id, kind, title, url, is_primary)
SELECT id, 'formal-proof',
  CASE slug
    WHEN 'astra-cohn-elkies-sphere-packing' THEN 'OpenAI Lean certificate: SpherePacking.lean'
    WHEN 'astra-binary-spherical-code-bounds' THEN 'OpenAI Lean certificates: MetricCodes.lean'
    WHEN 'astra-nonsofic-group' THEN 'OpenAI Lean certificate: NonSoficGroup.lean'
    WHEN 'astra-connes-rigidity-counterexample' THEN 'OpenAI Lean certificate: ConnesRigidity.lean'
    WHEN 'astra-permanent-lower-bounds' THEN 'OpenAI Lean certificate: Permanent.lean'
    WHEN 'astra-quantum-parallel-repetition' THEN 'OpenAI Lean certificate: QuantumParallelRepetition.lean'
    WHEN 'astra-gapcvp-hardness' THEN 'OpenAI Lean certificate: GapCVP.lean'
    WHEN 'astra-ehrhart-volume-conjecture' THEN 'OpenAI Lean certificate: EhrhartVolumeInequality.lean'
    WHEN 'astra-multicolor-triangle-ramsey' THEN 'OpenAI Lean certificate: MulticolorTriangleRamsey.lean'
    WHEN 'astra-extremal-compactness-degeneracy' THEN 'OpenAI Lean certificates: CompactnessAndDegeneracy.lean'
  END,
  CASE slug
    WHEN 'astra-cohn-elkies-sphere-packing' THEN 'https://github.com/openai/ten-proofs/blob/main/SpherePacking.lean'
    WHEN 'astra-binary-spherical-code-bounds' THEN 'https://github.com/openai/ten-proofs/blob/main/MetricCodes.lean'
    WHEN 'astra-nonsofic-group' THEN 'https://github.com/openai/ten-proofs/blob/main/NonSoficGroup.lean'
    WHEN 'astra-connes-rigidity-counterexample' THEN 'https://github.com/openai/ten-proofs/blob/main/ConnesRigidity.lean'
    WHEN 'astra-permanent-lower-bounds' THEN 'https://github.com/openai/ten-proofs/blob/main/Permanent.lean'
    WHEN 'astra-quantum-parallel-repetition' THEN 'https://github.com/openai/ten-proofs/blob/main/QuantumParallelRepetition.lean'
    WHEN 'astra-gapcvp-hardness' THEN 'https://github.com/openai/ten-proofs/blob/main/GapCVP.lean'
    WHEN 'astra-ehrhart-volume-conjecture' THEN 'https://github.com/openai/ten-proofs/blob/main/EhrhartVolumeInequality.lean'
    WHEN 'astra-multicolor-triangle-ramsey' THEN 'https://github.com/openai/ten-proofs/blob/main/MulticolorTriangleRamsey.lean'
    WHEN 'astra-extremal-compactness-degeneracy' THEN 'https://github.com/openai/ten-proofs/blob/main/CompactnessAndDegeneracy.lean'
  END,
  1
FROM records
WHERE slug IN (
  'astra-cohn-elkies-sphere-packing',
  'astra-binary-spherical-code-bounds',
  'astra-nonsofic-group',
  'astra-connes-rigidity-counterexample',
  'astra-permanent-lower-bounds',
  'astra-quantum-parallel-repetition',
  'astra-gapcvp-hardness',
  'astra-ehrhart-volume-conjecture',
  'astra-multicolor-triangle-ramsey',
  'astra-extremal-compactness-degeneracy'
);

INSERT INTO sources (record_id, kind, title, url, is_primary)
SELECT id, 'problem', 'Erdős Problem 183', 'https://www.erdosproblems.com/183', 1
FROM records WHERE slug = 'astra-multicolor-triangle-ramsey';

INSERT INTO sources (record_id, kind, title, url, is_primary)
SELECT id, 'problem', 'Erdős Problem 146', 'https://www.erdosproblems.com/146', 1
FROM records WHERE slug = 'astra-extremal-compactness-degeneracy';

INSERT INTO sources (record_id, kind, title, url, is_primary)
SELECT id, 'problem', 'Erdős Problem 180', 'https://www.erdosproblems.com/180', 1
FROM records WHERE slug = 'astra-extremal-compactness-degeneracy';
