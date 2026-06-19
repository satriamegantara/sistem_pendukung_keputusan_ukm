/**
 * Implementasi Metode TOPSIS
 * Technique for Order Preference by Similarity to Ideal Solution
 */

function normalizeWeights(weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights.map(() => 1 / weights.length);
  return weights.map((w) => w / sum);
}

function topsis(decisionMatrix, weights, criteriaTypes) {
  const m = decisionMatrix.length;
  const n = weights.length;

  if (m === 0 || n === 0) {
    throw new Error('Matriks keputusan tidak boleh kosong.');
  }

  // Normalisasi bobot agar total = 1 (bisa jadi tidak diperlukan bila input
  // sudah dinormalisasi di sisi kuesioner, namun disertakan untuk keamanan).
  const normalizedWeights = normalizeWeights(weights);

  // === Langkah 1 — Normalisasi Matriks Keputusan ===
  // r_ij = x_ij / sqrt(Σ x_ij^2)  (vektor normalisasi per kolom)
  const normalized = Array.from({ length: m }, () => Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const sumSq = decisionMatrix.reduce((sum, row) => sum + row[j] * row[j], 0);
    const denom = Math.sqrt(sumSq);
    for (let i = 0; i < m; i++) {
      normalized[i][j] = denom === 0 ? 0 : decisionMatrix[i][j] / denom;
    }
  }

  // === Langkah 2 — Matriks Normalisasi Terbobot ===
  // y_ij = w_j * r_ij
  const weighted = normalized.map((row) =>
    row.map((val, j) => val * normalizedWeights[j])
  );

  // === Langkah 3 — Solusi Ideal Positif (A+) & Negatif (A-) ===
  // Benefit: A+ = max, A- = min.  Cost: A+ = min, A- = max.
  const idealPositive = [];
  const idealNegative = [];
  for (let j = 0; j < n; j++) {
    const col = weighted.map((row) => row[j]);
    if (criteriaTypes[j] === 'benefit') {
      idealPositive[j] = Math.max(...col);
      idealNegative[j] = Math.min(...col);
    } else {
      idealPositive[j] = Math.min(...col);
      idealNegative[j] = Math.max(...col);
    }
  }

  // === Langkah 4 — Jarak ke Solusi Ideal (D+ dan D-) ===
  // D_i+ = sqrt(Σ (A+_j - y_ij)^2)
  // D_i- = sqrt(Σ (y_ij - A-_j)^2)
  const dPositive = [];
  const dNegative = [];
  for (let i = 0; i < m; i++) {
    let sumPos = 0;
    let sumNeg = 0;
    for (let j = 0; j < n; j++) {
      sumPos += Math.pow(idealPositive[j] - weighted[i][j], 2);
      sumNeg += Math.pow(weighted[i][j] - idealNegative[j], 2);
    }
    dPositive[i] = Math.sqrt(sumPos);
    dNegative[i] = Math.sqrt(sumNeg);
  }

  // === Langkah 5 — Nilai Preferensi V_i = D_i- / (D_i+ + D_i-) ===
  // Semakin mendekati 1, alternatif semakin dekat dengan solusi ideal.
  const preference = dPositive.map((dPos, i) => {
    const total = dPos + dNegative[i];
    return total === 0 ? 0 : dNegative[i] / total;
  });

  // === Langkah 6 — Ranking berdasarkan V_i (descending) ===
  const ranking = preference
    .map((pref, i) => ({ index: i, preference: pref }))
    .sort((a, b) => b.preference - a.preference)
    .map((item, rank) => ({ ...item, rank: rank + 1 }));

  return {
    normalizedWeights,
    normalized,
    weighted,
    idealPositive,
    idealNegative,
    dPositive,
    dNegative,
    preference,
    ranking
  };
}

function formatNumber(num, decimals = 4) {
  if (num === null || num === undefined || Number.isNaN(num)) return '-';
  return Number(num).toFixed(decimals);
}
