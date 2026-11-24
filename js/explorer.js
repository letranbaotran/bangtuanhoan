(function () {
  const CV = window.CHEMVERSE;

  CV.modules.explorer = {
    state: {
      search: '',
      categories: new Set(),
      phase: 'all',
      period: 'all',
      group: 'all',
      sortBy: 'number-asc',
      viewMode: 'grid'
    },

    init(container) {
      container.innerHTML = `
        <div class="page-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">${CV.t('Element Explorer – Tra Cứu Nguyên Tố', 'Element Explorer – Discover Elements')}</h2>
              <p class="section-subtitle">${CV.t('Tìm kiếm, lọc đa điều kiện và khám phá hồ sơ chuyên sâu 118 nguyên tố chuẩn IUPAC', 'Search, multi-filter, and inspect all 118 IUPAC elements')}</p>
            </div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-sm btn-primary" id="exp-view-grid">${CV.t('⊞ Dạng Thẻ', '⊞ Card Grid')}</button>
              <button class="btn btn-sm btn-secondary" id="exp-view-table">${CV.t('☰ Dạng Bảng', '☰ Table View')}</button>
            </div>
          </div>

          <div class="filter-bar glass-surface">
            <div class="filter-row">
              <input type="text" id="exp-search" class="input-field" style="flex:1;min-width:220px;" placeholder="🔍 Tìm theo tên Anh/Việt, ký hiệu (Fe) hoặc số hiệu Z (26)..." />
              <select id="exp-phase" class="select-field">
                <option value="all">Trạng thái: Tất cả (25°C)</option>
                <option value="Solid">🧊 Rắn (Solid)</option>
                <option value="Liquid">💧 Lỏng (Liquid)</option>
                <option value="Gas">💨 Khí (Gas)</option>
              </select>
              <select id="exp-period" class="select-field">
                <option value="all">Chu kỳ: Tất cả</option>
                ${[1, 2, 3, 4, 5, 6, 7].map((p) => `<option value="${p}">Chu kỳ ${p}</option>`).join('')}
              </select>
              <select id="exp-group" class="select-field">
                <option value="all">Nhóm: Tất cả</option>
                ${Array.from({ length: 18 }, (_, i) => `<option value="${i + 1}">Nhóm ${i + 1}</option>`).join('')}
              </select>
              <select id="exp-sort" class="select-field">
                <option value="number-asc">Sắp xếp: Z tăng dần</option>
                <option value="number-desc">Sắp xếp: Z giảm dần</option>
                <option value="mass-desc">Nguyên tử khối (giảm)</option>
                <option value="en-desc">Độ âm điện (giảm)</option>
                <option value="melt-desc">Điểm nóng chảy (giảm)</option>
                <option value="year-asc">Năm phát hiện (cũ → mới)</option>
              </select>
              <button class="btn btn-secondary btn-sm" id="exp-reset-btn">✕ Xóa bộ lọc</button>
            </div>

            <div class="cat-chips" id="exp-cat-chips">
              ${CV.CATEGORIES.map(
                (c) => `
                <button class="cat-chip" data-cat="${c.id}" style="--chip-color:${c.color};">
                  <span class="cat-dot" style="background:${c.color};"></span>${CV.catName(c)}
                </button>`
              ).join('')}
            </div>
          </div>

          <div id="exp-count" style="margin-bottom:14px;color:var(--text-muted);font-size:0.88rem;"></div>
          <div id="exp-results"></div>
        </div>
      `;

      this.bindEvents();
      this.render();
    },

    bindEvents() {
      const st = this.state;
      document.getElementById('exp-search').addEventListener('input', (e) => {
        st.search = e.target.value.trim().toLowerCase();
        this.render();
      });
      document.getElementById('exp-phase').addEventListener('change', (e) => {
        st.phase = e.target.value;
        this.render();
      });
      document.getElementById('exp-period').addEventListener('change', (e) => {
        st.period = e.target.value;
        this.render();
      });
      document.getElementById('exp-group').addEventListener('change', (e) => {
        st.group = e.target.value;
        this.render();
      });
      document.getElementById('exp-sort').addEventListener('change', (e) => {
        st.sortBy = e.target.value;
        this.render();
      });

      document.querySelectorAll('#exp-cat-chips .cat-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const id = chip.getAttribute('data-cat');
          if (st.categories.has(id)) {
            st.categories.delete(id);
            chip.classList.remove('selected');
          } else {
            st.categories.add(id);
            chip.classList.add('selected');
          }
          this.render();
        });
      });

      const btnGrid = document.getElementById('exp-view-grid');
      const btnTable = document.getElementById('exp-view-table');
      btnGrid.addEventListener('click', () => {
        st.viewMode = 'grid';
        btnGrid.className = 'btn btn-sm btn-primary';
        btnTable.className = 'btn btn-sm btn-secondary';
        this.render();
      });
      btnTable.addEventListener('click', () => {
        st.viewMode = 'table';
        btnTable.className = 'btn btn-sm btn-primary';
        btnGrid.className = 'btn btn-sm btn-secondary';
        this.render();
      });

      document.getElementById('exp-reset-btn').addEventListener('click', () => this.resetFilters());
    },

    resetFilters() {
      const st = this.state;
      st.search = '';
      st.categories.clear();
      st.phase = 'all';
      st.period = 'all';
      st.group = 'all';
      st.sortBy = 'number-asc';
      document.getElementById('exp-search').value = '';
      document.getElementById('exp-phase').value = 'all';
      document.getElementById('exp-period').value = 'all';
      document.getElementById('exp-group').value = 'all';
      document.getElementById('exp-sort').value = 'number-asc';
      document.querySelectorAll('#exp-cat-chips .cat-chip').forEach((c) => c.classList.remove('selected'));
      this.render();
    },

    getFiltered() {
      const st = this.state;
      let list = CV.ELEMENTS.filter((el) => {
        if (st.search) {
          const q = st.search;
          const match =
            el.name.toLowerCase().includes(q) ||
            el.nameVi.toLowerCase().includes(q) ||
            el.symbol.toLowerCase().includes(q) ||
            String(el.number) === q;
          if (!match) return false;
        }
        if (st.categories.size > 0 && !st.categories.has(el.category)) return false;
        if (st.phase !== 'all' && el.phase !== st.phase) return false;
        if (st.period !== 'all' && String(el.period) !== st.period) return false;
        if (st.group !== 'all' && String(el.group) !== st.group) return false;
        return true;
      });

      list.sort((a, b) => {
        switch (st.sortBy) {
          case 'number-desc': return b.number - a.number;
          case 'mass-desc': return b.atomicMass - a.atomicMass;
          case 'en-desc': return (b.electronegativity ?? -1) - (a.electronegativity ?? -1);
          case 'melt-desc': return (b.melt ?? -1) - (a.melt ?? -1);
          case 'year-asc': {
            const ya = typeof a.discoveryYear === 'number' ? a.discoveryYear : 0;
            const yb = typeof b.discoveryYear === 'number' ? b.discoveryYear : 0;
            return ya - yb;
          }
          default: return a.number - b.number;
        }
      });

      return list;
    },

    render() {
      const list = this.getFiltered();
      document.getElementById('exp-count').textContent = `Hiển thị ${list.length} / 118 nguyên tố`;
      const container = document.getElementById('exp-results');

      if (list.length === 0) {
        container.innerHTML = `
          <div class="glass-surface" style="padding:48px 24px;border-radius:var(--radius-lg);text-align:center;">
            <div style="font-size:2.2rem;margin-bottom:8px;">🛸</div>
            <h3>Không tìm thấy nguyên tố phù hợp</h3>
            <p style="color:var(--text-muted);margin:8px 0 18px;">Thử thay đổi từ khóa tìm kiếm hoặc xóa bớt điều kiện lọc.</p>
            <button class="btn btn-primary btn-sm" onclick="CHEMVERSE.modules.explorer.resetFilters()">Xóa bộ lọc</button>
          </div>`;
        return;
      }

      if (this.state.viewMode === 'grid') {
        container.innerHTML = `<div class="explorer-grid">${list
          .map((el) => {
            const cat = CV.getCategory(el.category);
            return `
            <article class="element-card glass-surface" style="--el-color:${cat.color};" onclick="CHEMVERSE.openElementModal(${el.number})">
              <div class="element-card-top">
                <span class="mono" style="font-size:0.86rem;color:var(--text-muted);">Z=${el.number}</span>
                <span style="font-size:0.85rem;">${CV.phaseIcon(el.phase)}</span>
              </div>
              <div style="margin:10px 0;">
                <div class="el-symbol-lg" style="color:${cat.color};">${el.symbol}</div>
                <div style="font-weight:700;font-size:1.05rem;margin-top:4px;">${CV.elName(el)}</div>
                <div style="font-size:0.82rem;color:var(--text-muted);">${CV.state.lang === 'en' ? el.nameVi : el.name}</div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;color:var(--text-secondary);">
                <span class="mono">${el.atomicMass} u</span>
                <span class="cat-dot" style="background:${cat.color};" title="${cat.nameVi}"></span>
              </div>
              ${el.predicted ? `<div class="predicted-badge" style="margin-top:8px;">Dự đoán</div>` : ''}
            </article>`;
          })
          .join('')}</div>`;
      } else {
        container.innerHTML = `
          <div class="explorer-table-wrap glass-surface">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Z</th>
                  <th>Ký hiệu</th>
                  <th>Tên nguyên tố</th>
                  <th>Phân loại</th>
                  <th>Khối lượng</th>
                  <th>Trạng thái</th>
                  <th>Độ âm điện</th>
                  <th>Nóng chảy</th>
                  <th>Phát hiện</th>
                </tr>
              </thead>
              <tbody>
                ${list
                  .map((el) => {
                    const cat = CV.getCategory(el.category);
                    return `
                    <tr onclick="CHEMVERSE.openElementModal(${el.number})">
                      <td class="mono">${el.number}</td>
                      <td><strong style="color:${cat.color};font-family:var(--font-display);font-size:1.05rem;">${el.symbol}</strong></td>
                      <td>${el.nameVi} <span style="color:var(--text-muted);font-size:0.8rem;">(${el.name})</span></td>
                      <td><span class="cat-badge" style="color:${cat.color};">${cat.nameVi}</span></td>
                      <td class="mono">${el.atomicMass}</td>
                      <td>${CV.phaseIcon(el.phase)} ${CV.phaseVi(el.phase)}</td>
                      <td class="mono">${el.electronegativity ?? '—'}</td>
                      <td class="mono">${CV.formatTemp(el.melt)}</td>
                      <td class="mono">${el.discoveryYear}</td>
                    </tr>`;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>`;
      }
    }
  };
})();
