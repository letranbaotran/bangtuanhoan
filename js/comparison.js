(function () {
  const CV = window.CHEMVERSE;

  CV.modules.comparison = {
    init(container) {
      container.innerHTML = `
        <div class="page-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">${CV.t('Element Comparison – So Sánh Nguyên Tố', 'Element Comparison')}</h2>
              <p class="section-subtitle">${CV.t('Đối chiếu trực quan cấu trúc vỏ electron, bảng thông số chuẩn hóa và biểu đồ đa chiều', 'Compare electron shells, physical/chemical properties, and normalized charts side-by-side')}</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm comp-preset" data-ids="26,29,79">Fe vs Cu vs Au</button>
              <button class="btn btn-secondary btn-sm comp-preset" data-ids="11,19">Na vs K</button>
              <button class="btn btn-secondary btn-sm comp-preset" data-ids="6,14">C vs Si</button>
            </div>
          </div>

          <div class="comp-selectors">
            <select id="comp-sel-0" class="select-field"></select>
            <select id="comp-sel-1" class="select-field"></select>
            <select id="comp-sel-2" class="select-field"></select>
          </div>

          <div class="comp-atoms-row" id="comp-atoms-row"></div>

          <div class="explorer-table-wrap glass-surface" id="comp-table-wrap"></div>

          <div class="comp-charts-grid">
            <div class="glass-surface" style="padding:20px;border-radius:var(--radius-md);">
              <h3 style="margin-bottom:12px;font-size:1.05rem;">🕸️ Biểu đồ Radar (Chuẩn hóa 0–100%)</h3>
              <div id="comp-radar-wrap" style="display:flex;justify-content:center;"></div>
            </div>
            <div class="glass-surface" style="padding:20px;border-radius:var(--radius-md);">
              <h3 style="margin-bottom:12px;font-size:1.05rem;">📊 Biểu đồ Cột So Sánh Chỉ Số</h3>
              <div id="comp-bar-wrap"></div>
            </div>
          </div>
        </div>
      `;

      this.populateSelectors();
      this.bindEvents();
      this.refresh();
    },

    onShow() {
      this.syncSelectors();
      this.refresh();
    },

    populateSelectors() {
      const options = CV.ELEMENTS.map((e) => `<option value="${e.number}">${e.number}. ${e.symbol} – ${e.nameVi}</option>`).join('');
      [0, 1, 2].forEach((idx) => {
        const sel = document.getElementById(`comp-sel-${idx}`);
        sel.innerHTML = (idx === 2 ? '<option value="">— Không chọn nguyên tố thứ 3 —</option>' : '') + options;
      });
      this.syncSelectors();
    },

    syncSelectors() {
      const ids = CV.state.compareIds;
      [0, 1, 2].forEach((idx) => {
        const sel = document.getElementById(`comp-sel-${idx}`);
        if (sel) sel.value = ids[idx] ? String(ids[idx]) : '';
      });
    },

    bindEvents() {
      [0, 1, 2].forEach((idx) => {
        document.getElementById(`comp-sel-${idx}`).addEventListener('change', () => {
          const next = [0, 1, 2]
            .map((i) => Number(document.getElementById(`comp-sel-${i}`).value))
            .filter((n) => n > 0);
          if (next.length >= 2) {
            CV.state.compareIds = next;
            this.refresh();
          }
        });
      });

      document.querySelectorAll('.comp-preset').forEach((btn) => {
        btn.addEventListener('click', () => {
          CV.state.compareIds = btn.getAttribute('data-ids').split(',').map(Number);
          this.syncSelectors();
          this.refresh();
        });
      });
    },

    refresh() {
      const elements = CV.state.compareIds.map((id) => CV.getElement(id)).filter(Boolean);
      if (elements.length === 0) return;

      this.renderMiniAtoms(elements);
      this.renderTable(elements);
      this.renderRadar(elements);
      this.renderBars(elements);
    },

    renderMiniAtoms(elements) {
      const wrap = document.getElementById('comp-atoms-row');
      wrap.innerHTML = elements
        .map((el) => {
          const cat = CV.getCategory(el.category);
          const svgSize = 180;
          const cx = svgSize / 2;
          const maxShells = el.shells.length;
          const stepR = 66 / Math.max(1, maxShells);

          let rings = '';
          el.shells.forEach((cnt, sIdx) => {
            const r = 18 + (sIdx + 1) * stepR;
            const isValence = sIdx === maxShells - 1;
            rings += `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${isValence ? '#FBBF24' : 'rgba(56,189,248,0.4)'}" stroke-width="${isValence ? 1.5 : 1}" />`;
            for (let k = 0; k < cnt; k++) {
              const ang = (k / cnt) * Math.PI * 2 - Math.PI / 2;
              const ex = cx + Math.cos(ang) * r;
              const ey = cx + Math.sin(ang) * r;
              rings += `<circle cx="${ex}" cy="${ey}" r="${isValence ? 3.3 : 2.3}" fill="${isValence ? '#FBBF24' : '#00E5FF'}" />`;
            }
          });

          return `
          <div class="comp-atom-card glass-surface" style="border-top:3px solid ${cat.color};">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <span class="mono" style="color:var(--text-muted);font-size:0.8rem;">Z=${el.number}</span>
              <span class="cat-badge" style="color:${cat.color};font-size:0.72rem;">${cat.nameVi}</span>
            </div>
            <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">
              ${rings}
              <circle cx="${cx}" cy="${cx}" r="14" fill="${cat.color}" fill-opacity="0.28" stroke="${cat.color}" stroke-width="1.5" />
              <text x="${cx}" y="${cx + 5}" text-anchor="middle" fill="#F8FAFC" font-family="Space Grotesk" font-weight="700" font-size="13">${el.symbol}</text>
            </svg>
            <div style="font-weight:700;font-size:1.05rem;">${el.nameVi} (${el.name})</div>
            <div class="mono" style="font-size:0.78rem;color:var(--text-muted);margin:4px 0 10px;">Lớp vỏ: [${el.shells.join(', ')}]</div>
            <div style="display:flex;justify-content:center;">${CV.renderOrbitalBoxesHTML(el, { outerOnly: true, showSummary: true })}</div>
          </div>`;
        })
        .join('');
    },

    renderTable(elements) {
      const rows = [
        { label: 'Số hiệu nguyên tử (Z)', key: 'number', numeric: true },
        { label: 'Nguyên tử khối (u)', key: 'atomicMass', numeric: true },
        { label: 'Nhóm / Chu kỳ', fn: (e) => `CK ${e.period} • ${e.group ? 'Nhóm ' + e.group : 'f-block'}` },
        { label: 'Cấu hình electron', fn: (e) => e.electronConfig },
        { label: 'Trạng thái (298 K)', fn: (e) => `${CV.phaseIcon(e.phase)} ${CV.phaseVi(e.phase)}` },
        { label: 'Điểm nóng chảy (K)', key: 'melt', numeric: true },
        { label: 'Điểm sôi (K)', key: 'boil', numeric: true },
        { label: 'Độ âm điện (Pauling)', key: 'electronegativity', numeric: true },
        { label: 'Bán kính nguyên tử (pm)', key: 'atomicRadius', numeric: true },
        { label: 'Năng lượng ion hóa (kJ/mol)', key: 'ionizationEnergy', numeric: true }
      ];

      const bodyRows = rows
        .map((row) => {
          let maxVal = -Infinity, minVal = Infinity;
          if (row.numeric) {
            elements.forEach((e) => {
              const v = e[row.key];
              if (v !== null && v !== undefined) {
                if (v > maxVal) maxVal = v;
                if (v < minVal) minVal = v;
              }
            });
          }

          const cells = elements
            .map((e) => {
              if (row.fn) return `<td class="mono">${row.fn(e)}</td>`;
              const v = e[row.key];
              if (v === null || v === undefined) return `<td class="mono" style="color:var(--text-muted);">—</td>`;
              let cls = 'mono';
              if (row.numeric && maxVal !== minVal) {
                if (v === maxVal) cls += ' highlight-max';
                else if (v === minVal) cls += ' highlight-min';
              }
              return `<td class="${cls}">${v}${v === maxVal && maxVal !== minVal ? ' ▲' : v === minVal && maxVal !== minVal ? ' ▼' : ''}</td>`;
            })
            .join('');

          return `<tr><td style="font-weight:600;color:var(--text-secondary);">${row.label}</td>${cells}</tr>`;
        })
        .join('');

      document.getElementById('comp-table-wrap').innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Thông số đối chiếu</th>
              ${elements.map((e) => `<th style="color:${CV.getCategory(e.category).color};">${e.symbol} – ${e.nameVi}</th>`).join('')}
            </tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      `;
    },

    renderRadar(elements) {
      const metrics = [
        { label: 'Độ âm điện', key: 'electronegativity', max: 4.0 },
        { label: 'Bán kính', key: 'atomicRadius', max: 350 },
        { label: 'Ion hóa', key: 'ionizationEnergy', max: 2400 },
        { label: 'Nóng chảy', key: 'melt', max: 3900 },
        { label: 'Khối lượng', key: 'atomicMass', max: 300 }
      ];

      const size = 290, cx = 145, cy = 145, rMax = 98;
      const n = metrics.length;
      let gridSvg = '';

      [0.25, 0.5, 0.75, 1].forEach((lvl) => {
        const pts = metrics
          .map((_, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            return `${cx + Math.cos(a) * rMax * lvl},${cy + Math.sin(a) * rMax * lvl}`;
          })
          .join(' ');
        gridSvg += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />`;
      });

      metrics.forEach((m, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x2 = cx + Math.cos(a) * rMax;
        const y2 = cy + Math.sin(a) * rMax;
        const lx = cx + Math.cos(a) * (rMax + 22);
        const ly = cy + Math.sin(a) * (rMax + 18);
        gridSvg += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,0.12)" />`;
        gridSvg += `<text x="${lx}" y="${ly}" text-anchor="middle" fill="#CBD5E1" font-size="11">${m.label}</text>`;
      });

      const polys = elements
        .map((el) => {
          const color = CV.getCategory(el.category).color;
          const pts = metrics
            .map((m, i) => {
              const val = el[m.key] ?? 0;
              const ratio = Math.min(1, Math.max(0.06, val / m.max));
              const a = (i / n) * Math.PI * 2 - Math.PI / 2;
              return `${cx + Math.cos(a) * rMax * ratio},${cy + Math.sin(a) * rMax * ratio}`;
            })
            .join(' ');
          return `<polygon points="${pts}" fill="${color}" fill-opacity="0.22" stroke="${color}" stroke-width="2" />`;
        })
        .join('');

      document.getElementById('comp-radar-wrap').innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${gridSvg}${polys}</svg>`;
    },

    renderBars(elements) {
      const bars = [
        { label: 'Độ âm điện (Pauling)', key: 'electronegativity', max: 4.0 },
        { label: 'Bán kính nguyên tử (pm)', key: 'atomicRadius', max: 350 },
        { label: 'Năng lượng ion hóa (kJ/mol)', key: 'ionizationEnergy', max: 2400 }
      ];

      document.getElementById('comp-bar-wrap').innerHTML = bars
        .map((b) => {
          const rows = elements
            .map((el) => {
              const v = el[b.key];
              const pct = v ? Math.min(100, (v / b.max) * 100) : 0;
              const color = CV.getCategory(el.category).color;
              return `
              <div style="display:flex;align-items:center;gap:8px;margin-top:5px;">
                <span class="mono" style="width:28px;font-size:0.78rem;color:${color};">${el.symbol}</span>
                <div style="flex:1;height:10px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;">
                  <div style="width:${pct}%;height:100%;background:${color};border-radius:999px;"></div>
                </div>
                <span class="mono" style="width:54px;text-align:right;font-size:0.76rem;">${v ?? '—'}</span>
              </div>`;
            })
            .join('');
          return `<div style="margin-bottom:14px;"><div style="font-size:0.82rem;color:var(--text-muted);">${b.label}</div>${rows}</div>`;
        })
        .join('');
    }
  };
})();
