(function () {
  const CV = window.CHEMVERSE;

  const PROP_META = {
    atomicRadius: { label: 'Bán kính nguyên tử (pm)', unit: 'pm', desc: 'Khoảng cách từ hạt nhân đến lớp vỏ ngoài cùng. Giảm dần theo chu kỳ (do điện tích hạt nhân Z⁺ tăng) và tăng dần theo nhóm (do số lớp e tăng).' },
    ionizationEnergy: { label: 'Năng lượng ion hóa I₁ (kJ/mol)', unit: 'kJ/mol', desc: 'Năng lượng tối thiểu tách 1e lớp ngoài cùng. Tăng theo chu kỳ (lực hút hạt nhân tăng) và giảm theo nhóm (e xa hạt nhân hơn).' },
    electronegativity: { label: 'Độ âm điện (Pauling)', unit: '', desc: 'Khả năng hút cặp electron liên kết. Tăng từ trái sang phải (phi kim mạnh dần) và giảm từ trên xuống dưới (kim loại mạnh dần).' },
    atomicMass: { label: 'Nguyên tử khối (u)', unit: 'u', desc: 'Tổng khối lượng trung bình của proton, neutron và electron (theo đơn vị amu).' },
    melt: { label: 'Điểm nóng chảy (K)', unit: 'K', desc: 'Nhiệt độ chuyển từ pha rắn sang lỏng ở áp suất chuẩn.' },
    boil: { label: 'Điểm sôi (K)', unit: 'K', desc: 'Nhiệt độ chuyển từ pha lỏng sang khí ở áp suất chuẩn.' }
  };

  function pearsonR(xs, ys) {
    const n = xs.length;
    if (n < 2) return 0;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, dx2 = 0, dy2 = 0;
    for (let i = 0; i < n; i++) {
      const dx = xs[i] - mx, dy = ys[i] - my;
      num += dx * dy;
      dx2 += dx * dx;
      dy2 += dy * dy;
    }
    const den = Math.sqrt(dx2 * dy2);
    return den === 0 ? 0 : num / den;
  }

  // Solves (X^T X + lambda I) w = X^T y via Gaussian elimination (Ridge Regression)
  function fitLinearRidge(X, y, lambda = 0.05) {
    const n = X.length;
    const d = X[0].length;
    const A = Array.from({ length: d }, () => Array(d + 1).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < d; j++) {
        for (let k = 0; k < d; k++) A[j][k] += X[i][j] * X[i][k];
        A[j][d] += X[i][j] * y[i];
      }
    }
    for (let j = 1; j < d; j++) A[j][j] += lambda;
    for (let col = 0; col < d; col++) {
      let piv = col;
      for (let r = col + 1; r < d; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
      [A[col], A[piv]] = [A[piv], A[col]];
      const div = A[col][col] || 1e-9;
      for (let k = col; k <= d; k++) A[col][k] /= div;
      for (let r = 0; r < d; r++) {
        if (r === col) continue;
        const f = A[r][col];
        for (let k = col; k <= d; k++) A[r][k] -= f * A[col][k];
      }
    }
    return A.map((row) => row[d]);
  }

  function predictRow(w, feat) {
    return w.reduce((sum, wi, idx) => sum + wi * feat[idx], 0);
  }

  CV.modules.research = {
    state: {
      activeTab: 'data', // 'data' | 'trends' | 'ml' | 'hypothesis' | 'report'
      filterCat: 'all',
      filterPeriod: 'all',
      compareIds: [11, 17, 19],
      trendProp: 'atomicRadius',
      mlTarget: 'electronegativity',
      mlResults: null,
      hypId: 'period-radius',
      hypResults: null
    },

    init(container) {
      this.container = container;
      this.render();
    },

    render() {
      const st = this.state;
      this.container.innerHTML = `
        <div class="page-container">
          <div class="section-header" style="margin-bottom:18px;">
            <div>
              <div class="hero-pill" style="margin-bottom:6px;">🔬 RESEARCH SPACE • EXPLORE – EXPERIMENT – ANALYZE – DISCOVER</div>
              <h2 class="section-title">Không Gian Nghiên Cứu Khoa Học (Research Core)</h2>
              <p class="section-subtitle">Phân tích dữ liệu 118 nguyên tố IUPAC, quy luật tuần hoàn, mô hình ML (Train/Test), kiểm chứng giả thuyết &amp; xuất báo cáo</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('virtual-lab')">🧪 Sang Phòng Lab 3D</button>
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('home')">🏠 Trang chủ</button>
            </div>
          </div>

          <!-- Research Sub-navigation Tabs -->
          <div class="el-modal-tabs" id="res-tabs" style="margin-bottom:18px;">
            <button class="el-tab-btn ${st.activeTab === 'data' ? 'active' : ''}" data-rtab="data">📊 1. Chemical Data Lab</button>
            <button class="el-tab-btn ${st.activeTab === 'trends' ? 'active' : ''}" data-rtab="trends">📈 2. Trends &amp; Analyzer</button>
            <button class="el-tab-btn ${st.activeTab === 'ml' ? 'active' : ''}" data-rtab="ml">🤖 3. AI Periodic Prediction</button>
            <button class="el-tab-btn ${st.activeTab === 'hypothesis' ? 'active' : ''}" data-rtab="hypothesis">🧪 4. Hypothesis Lab</button>
            <button class="el-tab-btn ${st.activeTab === 'report' ? 'active' : ''}" data-rtab="report">📝 5. Research Report</button>
          </div>

          <div id="res-body"></div>
        </div>
      `;

      this.container.querySelectorAll('#res-tabs .el-tab-btn').forEach((b) => {
        b.addEventListener('click', () => {
          st.activeTab = b.getAttribute('data-rtab');
          this.render();
        });
      });

      if (st.activeTab === 'data') this.renderDataLab();
      else if (st.activeTab === 'trends') this.renderTrends();
      else if (st.activeTab === 'ml') this.renderML();
      else if (st.activeTab === 'hypothesis') this.renderHypothesis();
      else this.renderReport();
    },

    // 1. CHEMICAL DATA LAB
    renderDataLab() {
      const st = this.state;
      const body = document.getElementById('res-body');
      const filtered = CV.ELEMENTS.filter((e) => {
        if (st.filterCat !== 'all' && e.category !== st.filterCat) return false;
        if (st.filterPeriod !== 'all' && String(e.period) !== st.filterPeriod) return false;
        return true;
      });

      body.innerHTML = `
        <div class="glass-surface" style="padding:16px;border-radius:16px;margin-bottom:16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <select id="res-cat-sel" class="select-field">
              <option value="all">Tất cả 11 nhóm phân loại</option>
              ${CV.CATEGORIES.map((c) => `<option value="${c.id}" ${st.filterCat === c.id ? 'selected' : ''}>${CV.catName(c)}</option>`).join('')}
            </select>
            <select id="res-per-sel" class="select-field">
              <option value="all">Tất cả 7 chu kỳ</option>
              ${[1,2,3,4,5,6,7].map((p) => `<option value="${p}" ${st.filterPeriod === String(p) ? 'selected' : ''}>Chu kỳ ${p}</option>`).join('')}
            </select>
            <span class="mono" style="font-size:0.84rem;color:var(--accent-cyan);">Hiển thị: <strong>${filtered.length}</strong> / 118 nguyên tố</span>
          </div>
          <button class="btn btn-primary btn-sm" id="res-export-csv">⬇️ Xuất dữ liệu CSV (${filtered.length} dòng)</button>
        </div>

        <div class="glass-surface" style="padding:16px;border-radius:16px;overflow-x:auto;max-height:430px;">
          <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.14);color:var(--accent-cyan);text-align:left;">
                <th style="padding:8px;">Z</th><th>Ký hiệu</th><th>Tên (VI / IUPAC)</th><th>CK / Nhóm</th>
                <th>Khối lượng (u)</th><th>Bán kính (pm)</th><th>Độ âm điện</th><th>Ion hóa I₁</th><th>Nóng chảy (K)</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((e) => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;" onclick="CHEMVERSE.openElementModal(${e.number})">
                  <td class="mono" style="padding:7px 8px;">${e.number}</td>
                  <td><strong style="color:var(--accent-cyan);">${e.symbol}</strong></td>
                  <td>${e.nameVi} / ${e.name}</td>
                  <td class="mono">CK ${e.period} • N ${e.group}</td>
                  <td class="mono">${e.atomicMass}</td>
                  <td class="mono">${e.atomicRadius ?? '—'}</td>
                  <td class="mono">${e.electronegativity ?? '—'}</td>
                  <td class="mono">${e.ionizationEnergy ?? '—'}</td>
                  <td class="mono">${e.melt ?? '—'}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;

      document.getElementById('res-cat-sel').addEventListener('change', (e) => { st.filterCat = e.target.value; this.renderDataLab(); });
      document.getElementById('res-per-sel').addEventListener('change', (e) => { st.filterPeriod = e.target.value; this.renderDataLab(); });
      document.getElementById('res-export-csv').addEventListener('click', () => {
        const headers = ['Z', 'Symbol', 'NameVi', 'NameIUPAC', 'Period', 'Group', 'Category', 'AtomicMass_u', 'AtomicRadius_pm', 'Electronegativity', 'IonizationEnergy_kJmol', 'Melt_K', 'Boil_K', 'ElectronConfig'];
        const rows = filtered.map((e) => [
          e.number, e.symbol, `"${e.nameVi}"`, `"${e.name}"`, e.period, e.group, e.category,
          e.atomicMass, e.atomicRadius ?? '', e.electronegativity ?? '', e.ionizationEnergy ?? '', e.melt ?? '', e.boil ?? '', `"${e.electronConfig}"`
        ].join(','));
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'chemverse-iupac-elements.csv'; a.click();
        URL.revokeObjectURL(url);
        CV.showToast(`Đã xuất ${filtered.length} nguyên tố ra CSV!`);
      });
    },

    // 2. PERIODIC TREND EXPLORER & ELEMENT ANALYZER
    renderTrends() {
      const st = this.state;
      const body = document.getElementById('res-body');
      const meta = PROP_META[st.trendProp];

      body.innerHTML = `
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px;align-items:start;" class="res-2col">
          <div class="glass-surface" style="padding:18px;border-radius:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
              <strong>📈 Biểu Đồ Xu Hướng Tuần Hoàn (Z = 1 → 54)</strong>
              <select id="res-trend-prop" class="select-field">
                ${Object.entries(PROP_META).map(([k, v]) => `<option value="${k}" ${st.trendProp === k ? 'selected' : ''}>${v.label}</option>`).join('')}
              </select>
            </div>
            <canvas id="res-trend-canvas" width="680" height="260" style="width:100%;height:260px;display:block;"></canvas>
            <div class="glass-surface" style="padding:10px 12px;border-radius:10px;margin-top:10px;font-size:0.82rem;color:var(--text-secondary);">
              <strong>🔬 Giải thích khoa học (${meta.label}):</strong> ${meta.desc}
              <div style="font-size:0.74rem;color:var(--text-muted);margin-top:4px;">Nguồn dữ liệu: Chuẩn IUPAC 2024 &amp; CRC Handbook of Chemistry and Physics.</div>
            </div>
          </div>

          <div class="glass-surface" style="padding:18px;border-radius:16px;">
            <strong style="display:block;margin-bottom:10px;">🔎 Element Analyzer &amp; So sánh</strong>
            <div style="display:flex;gap:6px;margin-bottom:10px;">
              <select id="res-add-cmp" class="select-field" style="flex:1;">
                ${CV.ELEMENTS.map((e) => `<option value="${e.number}">${e.number}. ${e.symbol} – ${e.nameVi}</option>`).join('')}
              </select>
              <button class="btn btn-primary btn-sm" id="res-add-cmp-btn">+ Thêm</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;" id="res-cmp-cards">
              ${st.compareIds.map((id) => {
                const el = CV.getElement(id);
                if (!el) return '';
                return `<div class="glass-surface" style="padding:10px;border-radius:10px;font-size:0.8rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="color:var(--accent-cyan);">${el.number}. ${el.symbol} – ${el.nameVi}</strong>
                    <button class="icon-btn" style="width:24px;height:24px;font-size:0.7rem;" onclick="CHEMVERSE.modules.research.removeCompare(${el.number})">✕</button>
                  </div>
                  <div class="mono" style="margin-top:4px;">${el.electronConfig} • CK ${el.period}, N ${el.group}</div>
                  <div>R: <strong>${el.atomicRadius ?? '—'} pm</strong> • χ: <strong>${el.electronegativity ?? '—'}</strong> • I₁: <strong>${el.ionizationEnergy ?? '—'}</strong></div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>
      `;

      document.getElementById('res-trend-prop').addEventListener('change', (e) => { st.trendProp = e.target.value; this.renderTrends(); });
      document.getElementById('res-add-cmp-btn').addEventListener('click', () => {
        const val = Number(document.getElementById('res-add-cmp').value);
        if (!st.compareIds.includes(val)) st.compareIds.push(val);
        this.renderTrends();
      });

      this.drawTrendChart();
    },

    removeCompare(num) {
      this.state.compareIds = this.state.compareIds.filter((x) => x !== num);
      this.renderTrends();
    },

    drawTrendChart() {
      const canvas = document.getElementById('res-trend-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const prop = this.state.trendProp;
      const pts = CV.ELEMENTS.filter((e) => e.number <= 54 && typeof e[prop] === 'number' && !Number.isNaN(e[prop]));
      if (pts.length < 2) return;
      const vals = pts.map((p) => p[prop]);
      const minV = Math.min(...vals), maxV = Math.max(...vals);

      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(40, (h / 4) * i); ctx.lineTo(w - 16, (h / 4) * i); ctx.stroke();
      }

      ctx.beginPath();
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2.2;
      pts.forEach((p, idx) => {
        const x = 44 + ((p.number - 1) / 53) * (w - 64);
        const y = h - 28 - ((p[prop] - minV) / (maxV - minV || 1)) * (h - 52);
        if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      pts.forEach((p) => {
        const x = 44 + ((p.number - 1) / 53) * (w - 64);
        const y = h - 28 - ((p[prop] - minV) / (maxV - minV || 1)) * (h - 52);
        const isCmp = this.state.compareIds.includes(p.number);
        ctx.beginPath();
        ctx.arc(x, y, isCmp ? 5.5 : 2.8, 0, Math.PI * 2);
        ctx.fillStyle = isCmp ? '#FBBF24' : '#38BDF8';
        ctx.fill();
        if (isCmp || p.group === 18 || p.group === 1) {
          ctx.fillStyle = isCmp ? '#FBBF24' : '#94A3B8';
          ctx.font = '10px monospace';
          ctx.fillText(p.symbol, x - 6, y - 8);
        }
      });
    },

    // 3. AI PERIODIC PREDICTION (REAL TRAIN/TEST RIDGE REGRESSION + METRICS)
    renderML() {
      const st = this.state;
      const body = document.getElementById('res-body');
      const res = this.runMLModel(st.mlTarget);
      st.mlResults = res;

      body.innerHTML = `
        <div class="glass-surface" style="padding:16px;border-radius:16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div>
            <strong>🤖 Mô Hình Học Máy Dự Đoán Tính Chất Nguyên Tố (Ridge Linear Regression)</strong>
            <div style="font-size:0.8rem;color:var(--text-muted);">Đặc trưng đầu vào: [1, Chu kỳ, Nhóm, Số lớp e, Số proton Z, Electron hóa trị] • Chia tập Train 80% / Test 20% độc lập</div>
          </div>
          <select id="res-ml-target" class="select-field">
            <option value="electronegativity" ${st.mlTarget === 'electronegativity' ? 'selected' : ''}>Dự đoán Độ âm điện (Pauling)</option>
            <option value="ionizationEnergy" ${st.mlTarget === 'ionizationEnergy' ? 'selected' : ''}>Dự đoán Năng lượng ion hóa I₁ (kJ/mol)</option>
            <option value="atomicRadius" ${st.mlTarget === 'atomicRadius' ? 'selected' : ''}>Dự đoán Bán kính nguyên tử (pm)</option>
          </select>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
          <div class="glass-surface" style="padding:14px;border-radius:12px;text-align:center;">
            <div style="font-size:0.74rem;color:var(--text-muted);">Tập Train / Test</div>
            <strong class="mono" style="font-size:1.2rem;color:var(--accent-cyan);">${res.trainCount} / ${res.testCount}</strong>
          </div>
          <div class="glass-surface" style="padding:14px;border-radius:12px;text-align:center;">
            <div style="font-size:0.74rem;color:var(--text-muted);">MAE (Sai số tuyệt đối TB)</div>
            <strong class="mono" style="font-size:1.2rem;color:#34D399;">${res.mae.toFixed(3)}</strong>
          </div>
          <div class="glass-surface" style="padding:14px;border-radius:12px;text-align:center;">
            <div style="font-size:0.74rem;color:var(--text-muted);">RMSE (Sai số toàn phương)</div>
            <strong class="mono" style="font-size:1.2rem;color:#FBBF24;">${res.rmse.toFixed(3)}</strong>
          </div>
          <div class="glass-surface" style="padding:14px;border-radius:12px;text-align:center;">
            <div style="font-size:0.74rem;color:var(--text-muted);">Hệ số xác định R² (Test)</div>
            <strong class="mono" style="font-size:1.2rem;color:#C084FC;">${res.r2.toFixed(3)}</strong>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:16px;" class="res-2col">
          <div class="glass-surface" style="padding:16px;border-radius:16px;">
            <strong style="display:block;margin-bottom:8px;">📉 Biểu Đồ Dự Đoán vs Thực Tế (Tập Kiểm Tra Test)</strong>
            <canvas id="res-ml-canvas" width="460" height="240" style="width:100%;height:240px;display:block;"></canvas>
            <div style="margin-top:10px;padding:10px;border-radius:10px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);font-size:0.78rem;color:#FDE68A;">
              ⚠️ <strong>Giới hạn &amp; Phạm vi áp dụng:</strong> Mô hình không tuyên bố dự đoán chính xác tuyệt đối. Hồi quy tuyến tính phản ánh xu hướng chung nhưng sai số tăng tại các kim loại chuyển tiếp (khối d) và họ Lanthanide/Actinide (khối f) do hiệu ứng chắn electron phức tạp.
            </div>
          </div>

          <div class="glass-surface" style="padding:16px;border-radius:16px;max-height:360px;overflow-y:auto;">
            <strong style="display:block;margin-bottom:8px;">📋 Đối Chiếu Mẫu Trên Tập Test</strong>
            <table style="width:100%;border-collapse:collapse;font-size:0.78rem;">
              <thead><tr style="color:var(--accent-cyan);border-bottom:1px solid rgba(255,255,255,0.14);text-align:left;"><th style="padding:6px;">Nguyên tố</th><th>Thực tế</th><th>Dự đoán</th><th>Sai số</th></tr></thead>
              <tbody>
                ${res.testRows.slice(0, 14).map((r) => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
                    <td style="padding:6px;"><strong>${r.el.symbol}</strong> (Z=${r.el.number})</td>
                    <td class="mono">${r.actual.toFixed(2)}</td>
                    <td class="mono" style="color:#38BDF8;">${r.pred.toFixed(2)}</td>
                    <td class="mono" style="color:${Math.abs(r.actual - r.pred) > res.mae * 1.5 ? '#F87171' : '#34D399'};">${(r.pred - r.actual).toFixed(2)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      document.getElementById('res-ml-target').addEventListener('change', (e) => { st.mlTarget = e.target.value; this.renderML(); });
      this.drawMLScatter(res);
    },

    runMLModel(targetProp) {
      const valid = CV.ELEMENTS.filter((e) => typeof e[targetProp] === 'number' && !Number.isNaN(e[targetProp]));
      const feat = (e) => {
        const valE = e.shells ? e.shells[e.shells.length - 1] : 1;
        return [1, e.period, e.group, e.shells ? e.shells.length : e.period, e.number / 118, valE];
      };
      // Deterministic 80/20 split (every 5th element goes to test)
      const train = [], test = [];
      valid.forEach((e, i) => ((i % 5 === 4) ? test : train).push(e));
      const Xtr = train.map(feat), ytr = train.map((e) => e[targetProp]);
      const w = fitLinearRidge(Xtr, ytr, 0.1);

      const testRows = test.map((el) => {
        const pred = predictRow(w, feat(el));
        return { el, actual: el[targetProp], pred };
      });
      const n = testRows.length || 1;
      const mae = testRows.reduce((s, r) => s + Math.abs(r.pred - r.actual), 0) / n;
      const mse = testRows.reduce((s, r) => s + (r.pred - r.actual) ** 2, 0) / n;
      const rmse = Math.sqrt(mse);
      const meanY = testRows.reduce((s, r) => s + r.actual, 0) / n;
      const ssTot = testRows.reduce((s, r) => s + (r.actual - meanY) ** 2, 0) || 1;
      const ssRes = testRows.reduce((s, r) => s + (r.actual - r.pred) ** 2, 0);
      const r2 = 1 - ssRes / ssTot;
      return { trainCount: train.length, testCount: test.length, mae, rmse, r2, testRows };
    },

    drawMLScatter(res) {
      const canvas = document.getElementById('res-ml-canvas');
      if (!canvas || !res.testRows.length) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const allV = res.testRows.flatMap((r) => [r.actual, r.pred]);
      const minV = Math.min(...allV), maxV = Math.max(...allV);
      const mapX = (v) => 38 + ((v - minV) / (maxV - minV || 1)) * (w - 60);
      const mapY = (v) => h - 26 - ((v - minV) / (maxV - minV || 1)) * (h - 46);

      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(mapX(minV), mapY(minV)); ctx.lineTo(mapX(maxV), mapY(maxV)); ctx.stroke();
      ctx.setLineDash([]);

      res.testRows.forEach((r) => {
        const x = mapX(r.actual), y = mapY(r.pred);
        ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00E5FF'; ctx.fill();
        ctx.fillStyle = '#CBD5E1'; ctx.font = '10px monospace';
        ctx.fillText(r.el.symbol, x + 6, y + 3);
      });
    },

    // 4. SCIENTIFIC HYPOTHESIS LAB
    renderHypothesis() {
      const st = this.state;
      const body = document.getElementById('res-body');
      const HYPOTHESES = [
        { id: 'period-radius', title: 'H₁: Trong Chu kỳ 2 & 3, khi Z tăng thì Bán kính nguyên tử giảm', filter: (e) => (e.period === 2 || e.period === 3) && e.atomicRadius, xProp: 'group', yProp: 'atomicRadius', expectedSign: -1 },
        { id: 'period-ie', title: 'H₂: Trong cùng Chu kỳ 3, khi Z tăng thì Năng lượng ion hóa I₁ tăng', filter: (e) => e.period === 3 && e.ionizationEnergy, xProp: 'number', yProp: 'ionizationEnergy', expectedSign: 1 },
        { id: 'group-en', title: 'H₃: Trong Nhóm VIIA (Halogen), khi Z tăng thì Độ âm điện giảm', filter: (e) => e.group === 17 && e.electronegativity, xProp: 'number', yProp: 'electronegativity', expectedSign: -1 }
      ];
      const hyp = HYPOTHESES.find((h) => h.id === st.hypId) || HYPOTHESES[0];
      const subset = CV.ELEMENTS.filter(hyp.filter);
      const r = pearsonR(subset.map((e) => e[hyp.xProp]), subset.map((e) => e[hyp.yProp]));
      const supported = (r * hyp.expectedSign) > 0.5;
      st.hypResults = { hyp, count: subset.length, r, supported };

      body.innerHTML = `
        <div class="glass-surface" style="padding:20px;border-radius:16px;margin-bottom:16px;">
          <strong style="display:block;margin-bottom:10px;">🧪 Chọn Giả Thuyết Khoa Học Để Kiểm Chứng Trên Dữ Liệu IUPAC</strong>
          <select id="res-hyp-sel" class="select-field" style="width:100%;margin-bottom:14px;">
            ${HYPOTHESES.map((h) => `<option value="${h.id}" ${h.id === hyp.id ? 'selected' : ''}>${h.title}</option>`).join('')}
          </select>

          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;">
            <div class="glass-surface" style="padding:12px;border-radius:10px;text-align:center;">
              <div style="font-size:0.74rem;color:var(--text-muted);">Số mẫu kiểm chứng</div>
              <strong class="mono" style="font-size:1.2rem;">n = ${subset.length}</strong>
            </div>
            <div class="glass-surface" style="padding:12px;border-radius:10px;text-align:center;">
              <div style="font-size:0.74rem;color:var(--text-muted);">Hệ số tương quan Pearson (r)</div>
              <strong class="mono" style="font-size:1.2rem;color:var(--accent-cyan);">r = ${r.toFixed(3)}</strong>
            </div>
            <div class="glass-surface" style="padding:12px;border-radius:10px;text-align:center;border-color:${supported ? '#10B981' : '#EF4444'};">
              <div style="font-size:0.74rem;color:var(--text-muted);">Kết luận kiểm chứng</div>
              <strong style="font-size:1rem;color:${supported ? '#34D399' : '#F87171'};">${supported ? '✅ ĐƯỢC ỦNG HỘ' : '❌ KHÔNG ĐỦ BẰNG CHỨNG'}</strong>
            </div>
          </div>

          <div style="font-size:0.84rem;color:var(--text-secondary);">
            <strong>Mẫu dữ liệu đối chiếu:</strong> ${subset.map((e) => `${e.symbol} (${e[hyp.yProp]})`).join(' → ')}
          </div>
        </div>
      `;
      document.getElementById('res-hyp-sel').addEventListener('change', (e) => { st.hypId = e.target.value; this.renderHypothesis(); });
    },

    // 5. RESEARCH REPORT BUILDER
    renderReport() {
      const st = this.state;
      const body = document.getElementById('res-body');
      const ml = st.mlResults || this.runMLModel(st.mlTarget);
      body.innerHTML = `
        <div class="glass-surface" style="padding:20px;border-radius:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
            <strong>📝 Trình Tạo Báo Cáo Nghiên Cứu Khoa Học (10 Mục Chuẩn)</strong>
            <button class="btn btn-primary btn-sm" id="res-download-report">📄 Xuất Báo Cáo Nghiên Cứu (.html)</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;" class="res-2col">
            <div><label class="control-label">Tên đề tài</label><input id="rep-title" class="input-field" style="width:100%;" value="Phân tích quy luật tuần hoàn &amp; Dự đoán tính chất nguyên tố bằng Hồi quy Ridge" /></div>
            <div><label class="control-label">Mục tiêu nghiên cứu</label><input id="rep-goal" class="input-field" style="width:100%;" value="Kiểm chứng xu hướng tuần hoàn trên 118 nguyên tố IUPAC và đánh giá mô hình dự đoán." /></div>
          </div>
          <div style="font-size:0.84rem;color:var(--text-secondary);line-height:1.6;">
            <strong>Tóm tắt kết quả tự động tổng hợp từ hệ thống:</strong><br/>
            • <strong>Dữ liệu sử dụng:</strong> 118 nguyên tố chuẩn IUPAC (chia tập Train ${ml.trainCount} mẫu / Test ${ml.testCount} mẫu).<br/>
            • <strong>Kết quả mô hình (${st.mlTarget}):</strong> MAE = <code>${ml.mae.toFixed(3)}</code>, RMSE = <code>${ml.rmse.toFixed(3)}</code>, R² = <code>${ml.r2.toFixed(3)}</code>.<br/>
            • <strong>Hạn chế:</strong> Mô hình tuyến tính chưa mô phỏng đầy đủ tương tác lượng tử đa electron ở khối d và f.
          </div>
        </div>
      `;

      document.getElementById('res-download-report').addEventListener('click', () => {
        const title = document.getElementById('rep-title').value;
        const goal = document.getElementById('rep-goal').value;
        const doc = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:30px auto;padding:28px;line-height:1.6;color:#0f172a;}h1{color:#0369a1;border-bottom:2px solid #0284c7;padding-bottom:8px;}h2{color:#1e293b;margin-top:18px;font-size:1.05rem;}</style></head><body><h1>BÁO CÁO NGHIÊN CỨU KHOA HỌC – CHEMVERSE</h1><p><strong>1. Tên đề tài:</strong> ${title}</p><p><strong>2. Mục tiêu nghiên cứu:</strong> ${goal}</p><h2>3. Cơ sở lý thuyết</h2><p>Định luật tuần hoàn Mendeleev hiện đại: tính chất của các nguyên tố biến đổi tuần hoàn theo chiều tăng điện tích hạt nhân (Z) và cấu hình lớp vỏ electron.</p><h2>4. Dữ liệu sử dụng</h2><p>118 nguyên tố chuẩn IUPAC 2024; tập huấn luyện (80%): ${ml.trainCount} nguyên tố; tập kiểm tra (20%): ${ml.testCount} nguyên tố.</p><h2>5. Phương pháp nghiên cứu</h2><p>Phân tích thống kê mô tả, hệ số tương quan Pearson (r) và Hồi quy tuyến tính Ridge trên 5 đặc trưng tuần hoàn.</p><h2>6. Kết quả &amp; 7. Biểu đồ chỉ số</h2><p>Đối với thuộc tính <strong>${st.mlTarget}</strong> trên tập Test: MAE = ${ml.mae.toFixed(3)}, RMSE = ${ml.rmse.toFixed(3)}, R² = ${ml.r2.toFixed(3)}.</p><h2>8. Đánh giá &amp; 9. Hạn chế</h2><p>Mô hình phản ánh tốt xu hướng các nguyên tố nhóm chính (s, p), nhưng sai số tăng ở kim loại chuyển tiếp (d, f) do hiệu ứng chắn phức tạp. Không tuyên bố dự đoán chính xác tuyệt đối.</p><h2>10. Kết luận</h2><p>Dữ liệu thực nghiệm IUPAC xác nhận quy luật tuần hoàn chặt chẽ và có thể kết hợp mô hình toán học hỗ trợ học tập, nghiên cứu STEM.</p></body></html>`;
        const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'Bao-Cao-Nghien-Cuu-CHEMVERSE.html'; a.click();
        URL.revokeObjectURL(url);
        CV.showToast('Đã xuất Báo cáo Nghiên cứu 10 mục!');
      });
    }
  };

  /* --- MODULE 5 (LEARN): GROUNDED AI CHEMISTRY TUTOR --- */
  CV.modules.tutor = {
    init(container) {
      this.container = container;
      this.messages = [
        { role: 'bot', text: 'Xin chào! Tôi là **AI Chemistry Tutor** của CHEMVERSE. Mọi câu trả lời đều được truy xuất trực tiếp từ **Cơ sở dữ liệu IUPAC (118 nguyên tố) & Kho phản ứng đã kiểm chứng** — không tự bịa số liệu.\n\nBạn có thể hỏi: *"Thông tin về Fe"*, *"Cân bằng Na + H2O"*, *"Quy luật bán kính nguyên tử"*, hoặc *"Cho tôi 1 câu hỏi luyện tập"*.' }
      ];
      this.render();
    },
    reply(query) {
      const q = (query || '').trim().toLowerCase();
      if (!q) return 'Vui lòng nhập câu hỏi hóa học bạn muốn tra cứu.';
      // 1. Check element match
      const el = CV.ELEMENTS.find((e) =>
        q.includes(` ${e.symbol.toLowerCase()} `) ||
        q === e.symbol.toLowerCase() ||
        q.includes(e.nameVi.toLowerCase()) ||
        q.includes(e.name.toLowerCase()) ||
        q.includes(`z=${e.number}`) || q.includes(`z = ${e.number}`)
      );
      if (el && (q.includes('thông tin') || q.includes('cấu hình') || q.includes('nguyên tố') || q.length <= 16)) {
        return `**${el.number}. ${el.symbol} – ${el.nameVi} (${el.name})** [Nguồn: IUPAC]\n• Cấu hình electron: \`${el.electronConfig}\` (Lớp: [${el.shells.join(', ')}])\n• Vị trí: Chu kỳ ${el.period}, Nhóm ${CV.groupRoman(el.group)}\n• Nguyên tử khối: ${el.atomicMass} u • Độ âm điện: ${el.electronegativity ?? '—'} • I₁: ${el.ionizationEnergy ?? '—'} kJ/mol\n• Đặc điểm: ${el.summary}`;
      }
      // 2. Check reaction / equation match
      if (CV.REACTIONS) {
        const rx = CV.REACTIONS.find((r) =>
          (r.equation && q.includes(r.equation.split('→')[0].trim().toLowerCase())) ||
          (r.reagents && r.reagents.every((rg) => q.includes(rg.toLowerCase())))
        );
        if (rx) {
          return `**Phương trình đã kiểm chứng:**\n\`${rx.equation}\`\n• **Hiện tượng:** ${rx.phenomenon || 'Có phản ứng hóa học xảy ra.'}\n• **Hướng dẫn cân bằng:** Đếm số nguyên tử từng nguyên tố ở hai vế (ưu tiên kim loại → phi kim → H → O) để bảo toàn khối lượng.\n• **Lưu ý:** ${rx.safety || 'Thực hiện thí nghiệm với lượng hóa chất vừa đủ và đeo kính bảo hộ.'}`;
        }
      }
      // 3. Periodic trend explanation
      if (q.includes('bán kính') || q.includes('độ âm điện') || q.includes('ion hóa') || q.includes('quy luật')) {
        return '**Quy luật tuần hoàn (Đã kiểm chứng trên 118 nguyên tố IUPAC):**\n• **Trong 1 chu kỳ (trái → phải):** Điện tích hạt nhân Z⁺ tăng, số lớp e không đổi → lực hút vỏ mạnh hơn → **Bán kính giảm**, **Độ âm điện & I₁ tăng**.\n• **Trong 1 nhóm A (trên → dưới):** Số lớp electron tăng nhanh → **Bán kính tăng**, **Độ âm điện & I₁ giảm**.\n👉 Bạn có thể vào mục **Research → Trends & Analyzer** để xem đồ thị thực nghiệm!';
      }
      // 4. Practice question
      if (q.includes('luyện tập') || q.includes('câu hỏi') || q.includes('bài tập')) {
        const sample = CV.ELEMENTS[(new Date().getSeconds() * 3) % 30];
        return `**Câu hỏi luyện tập nhanh (Dữ liệu IUPAC):**\nNguyên tố **${sample.nameVi} (${sample.symbol})** có số hiệu nguyên tử Z = ${sample.number}. Hãy xác định vị trí (Chu kỳ, Nhóm) và cấu hình electron của ${sample.symbol}?\n\n💡 *Gợi ý:* Vào Bảng tuần hoàn hoặc gõ \`"Thông tin về ${sample.symbol}"\` để đối chiếu đáp án chính xác!`;
      }
      return '⚠️ Nội dung này chưa có trong cơ sở dữ liệu đã kiểm chứng của CHEMVERSE (tôi không tự suy đoán số liệu). Hãy thử hỏi về **118 nguyên tố**, **cân bằng phản ứng quen thuộc** (vd: *Na + H2O*, *Zn + HCl*), hoặc **quy luật tuần hoàn**!';
    },
    render() {
      this.container.innerHTML = `
        <div class="page-container">
          <div class="section-header" style="margin-bottom:16px;">
            <div>
              <h2 class="section-title">🤖 AI Chemistry Tutor (Trợ Lý Dữ Liệu Kiểm Chứng)</h2>
              <p class="section-subtitle">Giải thích kiến thức, hướng dẫn cân bằng phương trình &amp; phân tích hiện tượng dựa trên dữ liệu IUPAC</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('learning')">← Về Học tập</button>
          </div>
          <div class="glass-surface" style="padding:18px;border-radius:16px;max-width:860px;margin:0 auto;">
            <div id="tutor-chat-log" style="display:flex;flex-direction:column;gap:10px;max-height:400px;overflow-y:auto;margin-bottom:14px;">
              ${this.messages.map((m) => `
                <div class="glass-surface" style="padding:12px 14px;border-radius:12px;align-self:${m.role === 'user' ? 'flex-end' : 'flex-start'};max-width:88%;background:${m.role === 'user' ? 'rgba(0,229,255,0.16)' : 'rgba(15,23,42,0.7)'};white-space:pre-line;font-size:0.88rem;">
                  ${m.text}
                </div>`).join('')}
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
              <button class="btn btn-secondary btn-sm tutor-chip" data-q="Thông tin về Fe">Thông tin Fe</button>
              <button class="btn btn-secondary btn-sm tutor-chip" data-q="Na + H2O">Cân bằng Na + H2O</button>
              <button class="btn btn-secondary btn-sm tutor-chip" data-q="Quy luật bán kính nguyên tử">Quy luật bán kính</button>
              <button class="btn btn-secondary btn-sm tutor-chip" data-q="Cho tôi 1 câu hỏi luyện tập">Câu hỏi luyện tập</button>
            </div>
            <div style="display:flex;gap:8px;">
              <input id="tutor-input" class="input-field" style="flex:1;" placeholder="Hỏi về nguyên tố, phản ứng hoặc quy luật tuần hoàn..." />
              <button class="btn btn-primary" id="tutor-send">Gửi</button>
            </div>
          </div>
        </div>
      `;
      const send = (txt) => {
        const q = (txt ?? document.getElementById('tutor-input').value).trim();
        if (!q) return;
        this.messages.push({ role: 'user', text: q });
        this.messages.push({ role: 'bot', text: this.reply(q) });
        this.render();
      };
      document.getElementById('tutor-send').addEventListener('click', () => send());
      document.getElementById('tutor-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
      document.querySelectorAll('.tutor-chip').forEach((b) => b.addEventListener('click', () => send(b.getAttribute('data-q'))));
    }
  };
})();
