/**
 * SPK Rekomendasi UKM — Aplikasi Utama
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
  renderInputTables();
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

  document.getElementById(`page-${pageId}`).classList.add('active');
  document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');
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
        <div class="weight">${(c.weight * 100).toFixed(0)}%</div>
        <div class="type">${c.type === 'benefit' ? 'Benefit' : 'Cost'}</div>
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

function renderInputTables() {
  renderWeightTable();
  renderMatrixTable();
  updateWeightTotal();
}

function renderWeightTable() {
  const tbody = document.querySelector('#weightTable tbody');
  tbody.innerHTML = appState.criteria
    .map(
      (c, i) => `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td>${c.name}</td>
        <td><span class="type-badge ${c.type}">${c.type}</span></td>
        <td>
          <input type="number" min="0" max="1" step="0.01"
            value="${c.weight}" data-weight-index="${i}" class="weight-input">
        </td>
        <td style="color:var(--text-muted);font-size:0.8rem">${c.description}</td>
      </tr>`
    )
    .join('');
}

function renderMatrixTable() {
  const thead = document.querySelector('#matrixTable thead');
  const tbody = document.querySelector('#matrixTable tbody');

  const headerCells = appState.criteria.map((c) => `<th>${c.id}<br><small>${c.name}</small></th>`).join('');
  thead.innerHTML = `<tr><th>No</th><th>Alternatif UKM</th>${headerCells}</tr>`;

  tbody.innerHTML = appState.alternatives
    .map(
      (alt, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${alt.name}</strong></td>
        ${alt.values
          .map(
            (val, j) => `
          <td>
            <input type="number" min="0" step="any"
              value="${val}" data-alt-index="${i}" data-crit-index="${j}" class="matrix-input">
          </td>`
          )
          .join('')}
      </tr>`
    )
    .join('');
}

function updateWeightTotal() {
  const total = appState.criteria.reduce((sum, c) => sum + c.weight, 0);
  const el = document.getElementById('weightTotal');
  el.textContent = `Total: ${formatNumber(total, 4)}`;
  el.classList.toggle('invalid', Math.abs(total - 1) > 0.01);
}

function bindEvents() {
  document.getElementById('weightTable').addEventListener('input', (e) => {
    if (!e.target.classList.contains('weight-input')) return;
    const idx = parseInt(e.target.dataset.weightIndex, 10);
    appState.criteria[idx].weight = parseFloat(e.target.value) || 0;
    updateWeightTotal();
  });

  document.getElementById('matrixTable').addEventListener('input', (e) => {
    if (!e.target.classList.contains('matrix-input')) return;
    const altIdx = parseInt(e.target.dataset.altIndex, 10);
    const critIdx = parseInt(e.target.dataset.critIndex, 10);
    appState.alternatives[altIdx].values[critIdx] = parseFloat(e.target.value) || 0;
  });

  document.getElementById('btnReset').addEventListener('click', () => {
    appState.criteria = structuredClone(DEFAULT_DATA.criteria);
    appState.alternatives = structuredClone(DEFAULT_DATA.alternatives);
    appState.result = null;
    renderInputTables();
    hideResults();
  });

  document.getElementById('btnCalculate').addEventListener('click', calculate);
  document.getElementById('btnPrint').addEventListener('click', () => window.print());
}

function calculate() {
  const weights = appState.criteria.map((c) => c.weight);
  const types = appState.criteria.map((c) => c.type);
  const matrix = appState.alternatives.map((a) => [...a.values]);
  const names = appState.alternatives.map((a) => a.name);
  const critLabels = appState.criteria.map((c) => c.id);

  try {
    const result = topsis(matrix, weights, types);
    appState.result = { ...result, names, critLabels };
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

  document.getElementById('stepMatrix').innerHTML = buildMatrixTable(
    matrix, r.names, r.critLabels
  );

  document.getElementById('stepNormalized').innerHTML = buildMatrixTable(
    r.normalized, r.names, r.critLabels
  );

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
}

function renderResults() {
  const r = appState.result;
  if (!r) return;

  document.getElementById('resultEmpty').classList.add('hidden');
  document.getElementById('resultContent').classList.remove('hidden');

  const winner = r.ranking[0];
  const winnerName = r.names[winner.index];

  document.getElementById('resultHero').innerHTML = `
    <div class="trophy">🏆</div>
    <h3>Rekomendasi Utama</h3>
    <div class="winner">${winnerName}</div>
    <div class="score">Nilai Preferensi: ${formatNumber(winner.preference)}</div>`;

  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = r.ranking
    .map((item) => {
      const name = r.names[item.index];
      const rankClass = item.rank <= 3 ? `rank-${item.rank}` : 'rank-other';
      const status =
        item.rank === 1
          ? '<span class="status-recommended">★ Direkomendasikan</span>'
          : '<span class="status-normal">Alternatif</span>';

      return `
        <tr>
          <td><span class="rank-badge ${rankClass}">${item.rank}</span></td>
          <td><strong>${name}</strong></td>
          <td><strong>${formatNumber(item.preference)}</strong></td>
          <td>${formatNumber(r.dPositive[item.index])}</td>
          <td>${formatNumber(r.dNegative[item.index])}</td>
          <td>${status}</td>
        </tr>`;
    })
    .join('');

  const rankingText = r.ranking
    .map((item, idx) => {
      const name = r.names[item.index];
      return `${idx + 1}. ${name} (${formatNumber(item.preference)})`;
    })
    .join(', ');

  document.getElementById('reportText').innerHTML = `
    <p>
      <strong>Laporan Analisis Keputusan — Rekomendasi UKM Fakultas Teknik Unsoed</strong>
    </p>
    <p>
      Berdasarkan perhitungan metode TOPSIS dengan ${appState.criteria.length} kriteria
      (${appState.criteria.map((c) => c.name).join(', ')}) dan ${appState.alternatives.length} alternatif UKM,
      sistem menghasilkan peringkat rekomendasi sebagai berikut:
    </p>
    <p><strong>${rankingText}</strong></p>
    <p>
      <strong>${winnerName}</strong> direkomendasikan sebagai pilihan utama dengan nilai preferensi
      <strong>${formatNumber(winner.preference)}</strong>. Alternatif ini memiliki jarak terkecil terhadap
      solusi ideal positif (D⁺ = ${formatNumber(r.dPositive[winner.index])}) dan jarak terbesar terhadap
      solusi ideal negatif (D⁻ = ${formatNumber(r.dNegative[winner.index])}), yang menunjukkan kedekatan
      tertinggi terhadap kondisi ideal pada seluruh kriteria.
    </p>
    <p>
      Kriteria dengan bobot tertinggi adalah Pengembangan Diri (${(appState.criteria[0].weight * 100).toFixed(0)}%)
      dan Peminatan (${(appState.criteria[1].weight * 100).toFixed(0)}%), sehingga UKM yang unggul pada kedua
      aspek tersebut cenderung mendapat peringkat lebih tinggi dalam rekomendasi sistem.
    </p>
    <p style="font-size:0.85rem;color:var(--text-muted)">
      Dihasilkan oleh SPK Rekomendasi UKM — Metode TOPSIS | ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </p>`;
}
