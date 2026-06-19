/**
 * SPK Rekomendasi UKM — Aplikasi Utama
 * Alur: Kuesioner Likert 1-5 -> Normalisasi Bobot -> TOPSIS -> 3 Rekomendasi Teratas
 */

let appState = {
  criteria: structuredClone(DEFAULT_DATA.criteria),
  alternatives: structuredClone(DEFAULT_DATA.alternatives),
  result: null
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBeranda();
  initTentang();
  renderQuestionnaire();
  bindEvents();
});

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', () => navigateTo(el.dataset.goto));
  });

  navToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));

  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');
  const navBtn = document.querySelector(`[data-page="${pageId}"]`);
  if (navBtn) navBtn.classList.add('active');
  document.getElementById('mainNav').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initBeranda() {
  const container = document.getElementById('criteriaOverview');
  container.innerHTML = appState.criteria
    .map(
      (c) => `
      <div class="criteria-item">
        <div class="code">${c.id}</div>
        <div class="name">${c.name}</div>
        <div class="type">${c.type === 'benefit' ? 'Benefit' : 'Cost'}</div>
        <div class="desc">${c.description}</div>
      </div>`
    )
    .join('');
}

function initTentang() {
  document.getElementById('ukmList').innerHTML = appState.alternatives
    .map((a) => `<div class="ukm-item">${a.name}</div>`)
    .join('');

  document.getElementById('authorsList').innerHTML = DEFAULT_DATA.authors
    .map((a) => `<li>${a}</li>`)
    .join('');
}

/**
 * Render form kuesioner Likert 1-5 untuk setiap kriteria.
 * Pengguna cukup memilih satu angka per kriteria (radio button).
 */
function renderQuestionnaire() {
  const stack = document.getElementById('likertStack');
  if (!stack) return;

  stack.innerHTML = appState.criteria
    .map((c, i) => {
      const options = [1, 2, 3, 4, 5]
        .map(
          (v) => `
          <label class="likert-option">
            <input type="radio" name="crit-${i}" value="${v}" required>
            <span class="likert-bubble">${v}</span>
          </label>`
        )
        .join('');

      return `
        <div class="likert-row" data-crit-index="${i}">
          <div class="likert-info">
            <span class="likert-code">${c.id}</span>
            <div>
              <div class="likert-name">${c.name}</div>
              <div class="likert-desc">${c.description}</div>
            </div>
            <span class="type-badge ${c.type}">${c.type}</span>
          </div>
          <div class="likert-scale">${options}</div>
        </div>`;
    })
    .join('');

  stack.querySelectorAll('.likert-option input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      radio.closest('.likert-row').classList.add('answered');
    });
  });
}

/**
 * Kumpulkan nilai Likert dari form lalu ubah menjadi bobot ternormalisasi
 * (total = 1.0). Inilah bobot yang dipakai pada perhitungan TOPSIS.
 */
function collectWeightsFromForm() {
  const weights = [];
  for (let i = 0; i < appState.criteria.length; i++) {
    const checked = document.querySelector(`input[name="crit-${i}"]:checked`);
    if (!checked) {
      throw new Error(`Mohon isi nilai untuk kriteria ${appState.criteria[i].id} (${appState.criteria[i].name}).`);
    }
    weights.push(parseInt(checked.value, 10));
  }
  const total = weights.reduce((a, b) => a + b, 0);
  if (total === 0) throw new Error('Total nilai kuesioner tidak boleh nol.');
  return weights.map((w) => w / total);
}

function bindEvents() {
  document.getElementById('btnCalculate').addEventListener('click', calculate);
  document.getElementById('btnPrint').addEventListener('click', () => window.print());
}

/**
 * Hitung TOPSIS menggunakan bobot ternormalisasi dari kuesioner,
 * matriks keputusan hardcoded (DEFAULT_DATA.alternatives), dan tipe kriteria.
 */
function calculate() {
  let weights;
  try {
    weights = collectWeightsFromForm();
  } catch (err) {
    alert(err.message);
    return;
  }

  const types = appState.criteria.map((c) => c.type);
  const matrix = appState.alternatives.map((a) => [...a.values]);
  const names = appState.alternatives.map((a) => a.name);
  const critLabels = appState.criteria.map((c) => c.id);
  const critNames = appState.criteria.map((c) => c.name);

  try {
    const result = topsis(matrix, weights, types);
    appState.result = {
      ...result,
      names,
      critLabels,
      critNames,
      rawWeights: weights.map((w, i) => ({
        id: critLabels[i],
        name: critNames[i],
        raw: Math.round(w * weights.reduce((a, b) => a + b, 0) * 100) / 100,
        normalized: w
      }))
    };
    renderCalculation();
    renderResults();
    navigateTo('hasil');
  } catch (err) {
    alert('Terjadi kesalahan: ' + err.message);
  }
}

function hideResults() {
  document.getElementById('calcEmpty').classList.remove('hidden');
  document.getElementById('calcContent').classList.add('hidden');
  document.getElementById('resultEmpty').classList.remove('hidden');
  document.getElementById('resultContent').classList.add('hidden');
}

function buildMatrixTable(matrix, names, critLabels, extraHeader = '') {
  const header = critLabels.map((c) => `<th>${c}</th>`).join('');
  const rows = matrix
    .map(
      (row, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${names[i]}</strong></td>
        ${row.map((v) => `<td>${formatNumber(v)}</td>`).join('')}
      </tr>`
    )
    .join('');

  return `
    <table class="data-table">
      <thead>
        <tr><th>No</th><th>Alternatif</th>${header}${extraHeader ? `<th>${extraHeader}</th>` : ''}</tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderCalculation() {
  const r = appState.result;
  if (!r) return;

  document.getElementById('calcEmpty').classList.add('hidden');
  document.getElementById('calcContent').classList.remove('hidden');

  const matrix = appState.alternatives.map((a) => [...a.values]);

  // Step 1: Matriks Keputusan (X)
  document.getElementById('stepMatrix').innerHTML = buildMatrixTable(
    matrix, r.names, r.critLabels
  );

  // Step 2: Normalisasi Matriks Keputusan
  document.getElementById('stepNormalized').innerHTML = buildMatrixTable(
    r.normalized, r.names, r.critLabels
  );

  // Step 3: Matriks Normalisasi Terbobot (y_ij = w_j * r_ij)
  const weightedRows = r.weighted
    .map(
      (row, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${r.names[i]}</strong></td>
        ${row.map((v) => `<td>${formatNumber(v)}</td>`).join('')}
      </tr>`
    )
    .join('');

  const weightedHeader = r.critLabels
    .map((c, j) => `<th>${c}<br><small>×${formatNumber(r.normalizedWeights[j], 2)}</small></th>`)
    .join('');

  document.getElementById('stepWeighted').innerHTML = `
    <table class="data-table">
      <thead><tr><th>No</th><th>Alternatif</th>${weightedHeader}</tr></thead>
      <tbody>${weightedRows}</tbody>
    </table>`;

  // Step 4: Solusi Ideal Positif (A+) & Negatif (A-)
  document.getElementById('stepIdeal').innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th></th>
          ${r.critLabels.map((c) => `<th>${c}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>A⁺ (Ideal Positif)</strong></td>
          ${r.idealPositive.map((v) => `<td>${formatNumber(v)}</td>`).join('')}
        </tr>
        <tr>
          <td><strong>A⁻ (Ideal Negatif)</strong></td>
          ${r.idealNegative.map((v) => `<td>${formatNumber(v)}</td>`).join('')}
        </tr>
      </tbody>
    </table>`;

  // Step 5: Jarak ke Solusi Ideal (D+, D-)
  const distRows = r.names
    .map(
      (name, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${name}</strong></td>
        <td>${formatNumber(r.dPositive[i])}</td>
        <td>${formatNumber(r.dNegative[i])}</td>
      </tr>`
    )
    .join('');

  document.getElementById('stepDistance').innerHTML = `
    <table class="data-table">
      <thead>
        <tr><th>No</th><th>Alternatif</th><th>D⁺</th><th>D⁻</th></tr>
      </thead>
      <tbody>${distRows}</tbody>
    </table>`;

  // Step 6: Nilai Preferensi & Ranking
  const prefRows = r.ranking
    .map((item) => {
      const name = r.names[item.index];
      return `
        <tr>
          <td>${item.rank}</td>
          <td><strong>${name}</strong></td>
          <td>${formatNumber(item.preference)}</td>
        </tr>`;
    })
    .join('');

  document.getElementById('stepPreference').innerHTML = `
    <table class="data-table">
      <thead>
        <tr><th>Ranking</th><th>Alternatif</th><th>Nilai Preferensi (V<sub>i</sub>)</th></tr>
      </thead>
      <tbody>${prefRows}</tbody>
    </table>`;

  // Bobot hasil normalisasi dari input kuesioner
  const weightRows = r.normalizedWeights
    .map(
      (w, j) => `
      <tr>
        <td><strong>${r.critLabels[j]}</strong></td>
        <td>${r.critNames[j]}</td>
        <td>${r.rawWeights[j].raw}</td>
        <td>${formatNumber(w, 4)}</td>
      </tr>`
    )
    .join('');
  document.getElementById('stepWeights').innerHTML = `
    <table class="data-table">
      <thead>
        <tr><th>Kode</th><th>Kriteria</th><th>Input Likert</th><th>Bobot Ternormalisasi (w_j)</th></tr>
      </thead>
      <tbody>${weightRows}</tbody>
    </table>`;
}

/**
 * Render halaman hasil: fokus pada TOP-3 rekomendasi UKM.
 */
function renderResults() {
  const r = appState.result;
  if (!r) return;

  document.getElementById('resultEmpty').classList.add('hidden');
  document.getElementById('resultContent').classList.remove('hidden');

  const top3 = r.ranking.slice(0, 3);
  const winner = top3[0];
  const winnerName = r.names[winner.index];

  document.getElementById('resultHero').innerHTML = `
    <div class="trophy">🏆</div>
    <h3>Rekomendasi UKM Terbaik Untuk Anda</h3>
    <div class="winner">${winnerName}</div>
    <div class="score">Nilai Preferensi: ${formatNumber(winner.preference)}</div>
    <p class="hero-foot">Dihasilkan dari 6 UKM yang dianalisis menggunakan Metode TOPSIS berdasarkan preferensi Anda.</p>`;

  // Tabel ranking lengkap (tetap menampilkan semua UKM agar transparan)
  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = r.ranking
    .map((item) => {
      const name = r.names[item.index];
      const rankClass = item.rank <= 3 ? `rank-${item.rank}` : 'rank-other';
      const status =
        item.rank === 1
          ? '<span class="status-recommended">★ Rekomendasi #1</span>'
          : item.rank <= 3
          ? '<span class="status-top3">Top 3</span>'
          : '<span class="status-normal">Alternatif</span>';

      return `
        <tr class="${item.rank <= 3 ? 'top-row' : ''}">
          <td><span class="rank-badge ${rankClass}">${item.rank}</span></td>
          <td><strong>${name}</strong></td>
          <td><strong>${formatNumber(item.preference)}</strong></td>
          <td>${formatNumber(r.dPositive[item.index])}</td>
          <td>${formatNumber(r.dNegative[item.index])}</td>
          <td>${status}</td>
        </tr>`;
    })
    .join('');

  // Kartu Top-3 menonjol
  const podium = document.getElementById('top3Podium');
  podium.innerHTML = top3
    .map((item, idx) => {
      const name = r.names[item.index];
      const medals = ['🥇', '🥈', '🥉'];
      const alt = appState.alternatives[item.index];
      return `
        <article class="podium-card podium-${item.rank}">
          <div class="podium-medal">${medals[idx]}</div>
          <div class="podium-rank">Rekomendasi #${item.rank}</div>
          <h3 class="podium-name">${name}</h3>
          <div class="podium-score">V = ${formatNumber(item.preference)}</div>
          <ul class="podium-meta">
            <li><span>D⁺</span><strong>${formatNumber(r.dPositive[item.index])}</strong></li>
            <li><span>D⁻</span><strong>${formatNumber(r.dNegative[item.index])}</strong></li>
          </ul>
          <details class="podium-detail">
            <summary>Lihat nilai kriteria</summary>
            <table class="data-table inner-table">
              <thead><tr>${r.critLabels.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
              <tbody><tr>${alt.values.map((v) => `<td>${v}</td>`).join('')}</tr></tbody>
            </table>
          </details>
        </article>`;
    })
    .join('');

  // Laporan naratif (fokus Top-3)
  const top3Text = top3
    .map((item, idx) => {
      const name = r.names[item.index];
      return `${idx + 1}. <strong>${name}</strong> (V = ${formatNumber(item.preference)})`;
    })
    .join('<br>');

  document.getElementById('reportText').innerHTML = `
    <p>
      <strong>Laporan Analisis Keputusan — Rekomendasi UKM Fakultas Teknik Unsoed</strong>
    </p>
    <p>
      Berdasarkan jawaban kuesioner Anda, sistem menormalisasi nilai 1–5 menjadi bobot kriteria
      (total = 1.00), lalu menjalankan metode TOPSIS terhadap 6 alternatif UKM. Hasilnya,
      <strong>tiga rekomendasi teratas</strong> untuk Anda adalah:
    </p>
    <p>${top3Text}</p>
    <p>
      <strong>${winnerName}</strong> menjadi rekomendasi utama dengan nilai preferensi
      <strong>${formatNumber(winner.preference)}</strong>. Alternatif ini memiliki jarak
      terdekat ke solusi ideal positif (D⁺ = ${formatNumber(r.dPositive[winner.index])}) dan
      jarak terjauh dari solusi ideal negatif (D⁻ = ${formatNumber(r.dNegative[winner.index])}) —
      artinya paling mendekati kondisi ideal sesuai bobot preferensi Anda.
    </p>
    <p>
      Bobot kriteria yang digunakan: ${r.rawWeights
        .map((w) => `${w.id} (${w.raw}/total = ${formatNumber(w.normalized, 2)})`)
        .join(', ')}.
    </p>
    <p style="font-size:0.85rem;color:var(--text-muted)">
      Dihasilkan oleh SPK Rekomendasi UKM — Metode TOPSIS | ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </p>`;
}