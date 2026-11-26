(function () {
  const CV = window.CHEMVERSE;

  CV.modules.chempredict = {
    state: {
      axisType: 'period', // 'period' | 'group'
      axisVal: 2,
      metric: 'electronegativity',
      elA: 11,
      elB: 17
    },

    init(container) {
      this.container = container;
      container.innerHTML = `
        <div class="page-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">📈 ${CV.t('ChemPredict – Phân Tích Quy Luật & Dự Đoán Tuần Hoàn', 'ChemPredict – Periodic Trends & Property Predictor')}</h2>
              <p class="section-subtitle">${CV.t('Khám phá quy luật biến đổi tuần hoàn bằng biểu đồ trực quan và dự đoán loại liên kết hóa học', 'Analyze periodic trends with interactive charts and predict chemical bonding')}</p>
            </div>
          </div>

          <!-- Trend Controls -->
          <div class="filter-bar glass-surface">
            <div class="filter-row">
              <select id="cp-axis-type" class="select-field">
                <option value="period">Phân tích theo Chu kỳ (Period)</option>
                <option value="group">Phân tích theo Nhóm (Group)</option>
              </select>
              <select id="cp-axis-val" class="select-field"></select>
              <select id="cp-metric" class="select-field">
                <option value="electronegativity">Độ âm điện (Pauling)</option>
                <option value="atomicRadius">Bán kính nguyên tử (pm)</option>
                <option value="ionizationEnergy">Năng lượng ion hóa (kJ/mol)</option>
                <option value="melt">Điểm nóng chảy (K)</option>
                <option value="boil">Điểm sôi (K)</option>
              </select>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:18px;margin-bottom:24px;" class="cp-grid-top">
            <div class="glass-surface" style="padding:20px;border-radius:var(--radius-lg);">
              <h3 style="margin-bottom:12px;font-size:1.05rem;">📊 Biểu Đồ Biến Thiên Tuần Hoàn</h3>
              <div id="cp-chart-wrap" style="overflow-x:auto;"></div>
            </div>
            <div class="glass-surface" style="padding:20px;border-radius:var(--radius-lg);" id="cp-analysis-card"></div>
          </div>

          <!-- Bond & Reactivity Predictor -->
          <div class="glass-surface" style="padding:22px;border-radius:var(--radius-lg);">
            <h3 style="margin-bottom:12px;">🔮 Dự Đoán Liên Kết & Độ Phân Cực (Δχ Pauling)</h3>
            <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:16px;">
              <select id="cp-el-a" class="select-field" style="flex:1;min-width:180px;"></select>
              <span style="font-weight:700;color:var(--accent-cyan);">+</span>
              <select id="cp-el-b" class="select-field" style="flex:1;min-width:180px;"></select>
              <button class="btn btn-primary btn-sm" id="cp-predict-btn">⚡ Phân tích liên kết</button>
            </div>
            <div id="cp-bond-result"></div>
          </div>
        </div>
      `;

      const elOpts = CV.ELEMENTS.map((e) => `<option value="${e.number}">${e.number}. ${e.symbol} – ${CV.elName(e)}</option>`).join('');
      document.getElementById('cp-el-a').innerHTML = elOpts;
      document.getElementById('cp-el-b').innerHTML = elOpts;
      document.getElementById('cp-el-a').value = this.state.elA;
      document.getElementById('cp-el-b').value = this.state.elB;

      this.populateAxisValues();
      this.bindEvents();
      this.renderTrend();
      this.renderBondPrediction();
    },

    populateAxisValues() {
      const valSel = document.getElementById('cp-axis-val');
      if (this.state.axisType === 'period') {
        valSel.innerHTML = [1, 2, 3, 4, 5, 6, 7].map((p) => `<option value="${p}">Chu kỳ ${p}</option>`).join('');
        this.state.axisVal = Math.min(7, this.state.axisVal);
      } else {
        valSel.innerHTML = Array.from({ length: 18 }, (_, i) => `<option value="${i + 1}">Nhóm ${i + 1}</option>`).join('');
      }
      valSel.value = this.state.axisVal;
    },

    bindEvents() {
      document.getElementById('cp-axis-type').addEventListener('change', (e) => {
        this.state.axisType = e.target.value;
        this.state.axisVal = this.state.axisType === 'period' ? 2 : 1;
        this.populateAxisValues();
        this.renderTrend();
      });
      document.getElementById('cp-axis-val').addEventListener('change', (e) => {
        this.state.axisVal = Number(e.target.value);
        this.renderTrend();
      });
      document.getElementById('cp-metric').addEventListener('change', (e) => {
        this.state.metric = e.target.value;
        this.renderTrend();
      });
      document.getElementById('cp-predict-btn').addEventListener('click', () => {
        this.state.elA = Number(document.getElementById('cp-el-a').value);
        this.state.elB = Number(document.getElementById('cp-el-b').value);
        this.renderBondPrediction();
        if (CV.Player) CV.Player.recordEvent('predict', 'Phân tích liên kết ChemPredict', 20);
      });
    },

    renderTrend() {
      const { axisType, axisVal, metric } = this.state;
      const items = CV.ELEMENTS.filter((e) => (axisType === 'period' ? e.period === axisVal : e.group === axisVal));
      const valid = items.filter((e) => e[metric] !== null && e[metric] !== undefined);

      const w = Math.max(520, items.length * 46), h = 250, padL = 48, padR = 20, padT = 24, padB = 38;
      if (valid.length === 0) {
        document.getElementById('cp-chart-wrap').innerHTML = '<p style="color:var(--text-muted);">Không có dữ liệu định lượng cho đại lượng này ở dãy đã chọn.</p>';
        return;
      }

      const vals = valid.map((e) => e[metric]);
      const minV = Math.min(...vals), maxV = Math.max(...vals);
      const span = maxV - minV || 1;

      const pts = valid.map((e, i) => {
        const x = padL + (i / Math.max(1, valid.length - 1)) * (w - padL - padR);
        const y = h - padB - ((e[metric] - minV) / span) * (h - padT - padB);
        return { x, y, el: e, val: e[metric] };
      });

      const poly = pts.map((p) => `${p.x},${p.y}`).join(' ');
      const circles = pts
        .map(
          (p) => `
          <circle cx="${p.x}" cy="${p.y}" r="5" fill="#00E5FF" stroke="#050814" stroke-width="1.5"></circle>
          <text x="${p.x}" y="${h - 14}" text-anchor="middle" fill="#CBD5E1" font-size="11" font-family="Space Grotesk">${p.el.symbol}</text>
          <text x="${p.x}" y="${p.y - 9}" text-anchor="middle" fill="#94A3B8" font-size="9" font-family="JetBrains Mono">${p.val}</text>`
        )
        .join('');

      document.getElementById('cp-chart-wrap').innerHTML = `
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
          <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${h - padB}" stroke="rgba(255,255,255,0.2)" />
          <line x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}" stroke="rgba(255,255,255,0.2)" />
          <polyline points="${poly}" fill="none" stroke="#38BDF8" stroke-width="2.5" />
          ${circles}
        </svg>`;

      // Analysis Card
      const first = valid[0], last = valid[valid.length - 1];
      const delta = last[metric] - first[metric];
      const trendStr = delta > 0 ? '📈 Xu hướng Tăng dần' : delta < 0 ? '📉 Xu hướng Giảm dần' : '➡️ Ổn định';
      const maxEl = valid.reduce((a, b) => (b[metric] > a[metric] ? b : a));
      const minEl = valid.reduce((a, b) => (b[metric] < a[metric] ? b : a));

      const explanations = {
        electronegativity: 'Trong một chu kỳ, điện tích hạt nhân tăng kéo electron mạnh hơn nên độ âm điện tăng; trong một nhóm, số lớp e tăng làm độ âm điện giảm.',
        atomicRadius: 'Trong một chu kỳ, số lớp e không đổi nhưng điện tích hạt nhân tăng hút vỏ chặt hơn nên bán kính giảm; trong một nhóm, thêm lớp e mới làm bán kính tăng.',
        ionizationEnergy: 'Năng lượng ion hóa tỷ lệ nghịch với bán kính nguyên tử: nguyên tử càng nhỏ, electron lớp ngoài càng khó tách rời.'
      };

      document.getElementById('cp-analysis-card').innerHTML = `
        <h3 style="margin-bottom:10px;font-size:1.05rem;">🔬 Phân Tích Dữ Liệu</h3>
        <div class="cat-badge" style="color:var(--accent-cyan);margin-bottom:12px;">${trendStr}</div>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:0.86rem;">
          <div class="glass-surface" style="padding:10px;border-radius:10px;">Cực đại: <strong style="color:#34D399;">${maxEl.symbol} (${maxEl[metric]})</strong></div>
          <div class="glass-surface" style="padding:10px;border-radius:10px;">Cực tiểu: <strong style="color:#FBBF24;">${minEl.symbol} (${minEl[metric]})</strong></div>
          <p style="color:var(--text-secondary);font-size:0.84rem;margin-top:4px;">${explanations[metric] || 'Biểu đồ thể hiện sự biến thiên định lượng của các nguyên tố theo quy luật tuần hoàn Mendeleev.'}</p>
        </div>
      `;
    },

    renderBondPrediction() {
      const a = CV.getElement(this.state.elA);
      const b = CV.getElement(this.state.elB);
      if (!a || !b) return;
      const out = document.getElementById('cp-bond-result');

      if (a.electronegativity === null || b.electronegativity === null) {
        out.innerHTML = `<div class="glass-surface" style="padding:14px;border-radius:12px;color:#FBBF24;">Một trong hai nguyên tố (${a.symbol} hoặc ${b.symbol}) là khí hiếm/siêu nặng chưa có giá trị độ âm điện Pauling xác định nên hầu như không tạo liên kết hóa học thông thường.</div>`;
        return;
      }

      const diff = Math.abs(a.electronegativity - b.electronegativity);
      let bondType = 'Cộng hóa trị không phân cực';
      let color = '#34D399';
      let desc = 'Hiệu độ âm điện nhỏ (< 0.4), cặp electron dùng chung hầu như không bị lệch.';
      if (diff >= 1.7) {
        bondType = 'Liên kết Ion';
        color = '#FF5E6C';
        desc = `Hiệu độ âm điện lớn (Δχ = ${diff.toFixed(2)} ≥ 1.7): nguyên tử có độ âm điện nhỏ hơn nhường electron tạo cation, nguyên tử còn lại nhận electron tạo anion.`;
      } else if (diff >= 0.4) {
        bondType = 'Liên kết Cộng hóa trị phân cực';
        color = '#38BDF8';
        desc = `Hiệu độ âm điện trung bình (0.4 ≤ Δχ = ${diff.toFixed(2)} < 1.7): cặp electron dùng chung bị hút lệch về phía nguyên tử có độ âm điện lớn hơn.`;
      }

      out.innerHTML = `
        <div class="glass-surface" style="padding:16px;border-radius:14px;border-color:${color};">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <strong style="font-size:1.1rem;color:${color};">⚡ Dự đoán: ${bondType}</strong>
            <span class="mono" style="font-size:0.88rem;">|χ(${a.symbol}) - χ(${b.symbol})| = |${a.electronegativity} - ${b.electronegativity}| = <strong>${diff.toFixed(2)}</strong></span>
          </div>
          <p style="font-size:0.88rem;color:var(--text-secondary);">${desc}</p>
        </div>
      `;
    }
  };
})();
