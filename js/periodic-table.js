(function () {
  const CV = window.CHEMVERSE;

  const GROUP_ROMAN = [
    'IA', 'IIA', 'IIIB', 'IVB', 'VB', 'VIB', 'VIIB',
    'VIIIB', 'VIIIB', 'VIIIB', 'IB', 'IIB',
    'IIIA', 'IVA', 'VA', 'VIA', 'VIIA', 'VIIIA'
  ];

  CV.modules['periodic-table'] = {
    state: {
      tempK: 298,
      tempUnit: 'K',
      heatmap: 'none',
      activeCategory: null,
      searchQuery: '',
      showAnatomy: true
    },

    init(container) {
      const isLight = document.body.classList.contains('light-glass');

      container.innerHTML = `
        <div class="page-container">
          <!-- Portal Ribbon Title & Pill Search -->
          <div class="pt-portal-header">
            <div class="pt-ribbon">
              <h2>${CV.t('BẢNG TUẦN HOÀN CÁC NGUYÊN TỐ HÓA HỌC', 'INTERACTIVE PERIODIC TABLE OF ELEMENTS')}</h2>
              <span style="font-size:0.84rem;color:var(--text-secondary);">${CV.t('118 nguyên tố – 7 chu kỳ – 18 nhóm • Chuẩn IUPAC', '118 Elements – 7 Periods – 18 Groups • IUPAC Standard')}</span>
            </div>

            <div class="pt-pill-search glass-surface">
              <input type="text" id="pt-search-input" placeholder="${CV.t('Tìm nhanh nguyên tố theo tên Việt/Anh, ký hiệu (Fe) hoặc Z (26)...', 'Search by name, symbol (Fe), or atomic number (26)...')}" />
              <button class="pt-search-btn" id="pt-search-btn" title="${CV.t('Tìm kiếm', 'Search')}">🔍</button>
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
              <button class="btn btn-primary btn-sm" id="pt-mode-2d">${CV.t('📊 Bảng 2D Thông Minh', '📊 Smart 2D Table')}</button>
              <button class="btn btn-secondary btn-sm" id="pt-mode-3d">${CV.t('🧊 Bảng 3D Khối & Cột Thuộc Tính', '🧊 3D Block & Property Height-Map')}</button>
              <button class="btn btn-secondary btn-sm" id="pt-theme-btn" onclick="CHEMVERSE.toggleTheme()">
                ${isLight ? CV.t('🌙 Chế độ Vũ trụ (Tối)', '🌙 Dark Space Mode') : CV.t('☀️ Chế độ Sáng (Lớp học)', '☀️ Light Glass Mode')}
              </button>
              <button class="btn btn-secondary btn-sm" id="pt-toggle-anatomy">${CV.t('🧩 Ẩn/Hiện Ô mẫu', '🧩 Toggle Anatomy Card')}</button>
            </div>
          </div>

          <!-- 3D PROPERTY HEIGHT-MAP CONTAINER (Hidden by default) -->
          <div id="pt-3d-section" style="display:none;margin-bottom:20px;">
            <div class="glass-surface" style="padding:14px 18px;border-radius:var(--radius-md);margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
              <div>
                <strong>Biểu Đồ Cột 3D Theo Thuộc Tính (3D Property Height-Map)</strong>
                <div style="font-size:0.8rem;color:var(--text-muted);">Kéo để xoay, cuộn để zoom, nhấn vào khối hộp 3D để xem hồ sơ chi tiết</div>
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <select id="pt-3d-prop" class="select-field">
                  <option value="none">Chiều cao đồng đều (Màu 11 nhóm)</option>
                  <optgroup label="Độ phổ biến (Abundance)">
                    <option value="abundanceCrust">Độ phổ biến vỏ Trái Đất (mg/kg)</option>
                    <option value="abundanceSea">Độ phổ biến nước biển (mg/L)</option>
                  </optgroup>
                  <optgroup label="Bán kính (Radius)">
                    <option value="atomicRadius">Bán kính nguyên tử (pm)</option>
                    <option value="vanDerWaalsRadius">Bán kính Van der Waals (pm)</option>
                    <option value="covalentRadius">Bán kính cộng hóa trị (pm)</option>
                  </optgroup>
                  <optgroup label="Số lượng hạt (Count)">
                    <option value="electrons">Số Electron</option>
                    <option value="valenceElectrons">Electron lớp ngoài cùng</option>
                    <option value="protons">Số Proton</option>
                    <option value="neutrons">Số Neutron</option>
                  </optgroup>
                  <optgroup label="Tính chất nguyên tử (Atomic Properties)">
                    <option value="atomicMass">Nguyên tử khối (u)</option>
                    <option value="density">Khối lượng riêng (g/cm³)</option>
                    <option value="boil">Điểm sôi (K)</option>
                    <option value="melt">Điểm nóng chảy (K)</option>
                    <option value="electronegativity">Độ âm điện (Pauling)</option>
                    <option value="evaporationHeat">Nhiệt hóa hơi (kJ/mol)</option>
                    <option value="ionizationEnergy">Năng lượng ion hóa (kJ/mol)</option>
                  </optgroup>
                </select>
                <button class="btn btn-secondary btn-sm" id="pt-3d-reset">⟲ Reset 3D</button>
              </div>
            </div>
            <div id="pt-3d-canvas-wrap" class="glass-surface" style="height:520px;border-radius:var(--radius-lg);overflow:hidden;position:relative;background:radial-gradient(circle at center,#0d1538 0%,#050814 85%);">
              <div id="pt-3d-tooltip" class="glass-surface" style="display:none;position:absolute;pointer-events:none;z-index:60;padding:10px 14px;border-radius:12px;font-size:0.84rem;min-width:190px;max-width:250px;"></div>
            </div>
          </div>

          <div id="pt-2d-section">

          <!-- Temperature & Heatmap Smart Controls -->
          <div class="pt-controls glass-surface">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px;">
                <span class="control-label">🌡️ Nhiệt độ vũ trụ: <strong id="pt-temp-display" class="mono" style="color:var(--accent-cyan);">298 K</strong></span>
                <div style="display:flex;gap:4px;">
                  <button class="btn btn-sm btn-primary pt-unit-btn" data-unit="K">K</button>
                  <button class="btn btn-sm btn-secondary pt-unit-btn" data-unit="C">°C</button>
                  <button class="btn btn-sm btn-secondary pt-unit-btn" data-unit="F">°F</button>
                </div>
              </div>
              <input type="range" id="pt-temp-slider" min="0" max="6000" step="1" value="298" style="width:100%;accent-color:var(--accent-cyan);" />
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
                <button class="btn btn-secondary btn-sm pt-preset-temp" data-k="3">🌌 Không gian (3 K)</button>
                <button class="btn btn-secondary btn-sm pt-preset-temp" data-k="298">🏠 Phòng (298 K)</button>
                <button class="btn btn-secondary btn-sm pt-preset-temp" data-k="1500">🌋 Núi lửa (1500 K)</button>
                <button class="btn btn-secondary btn-sm pt-preset-temp" data-k="4500">☀️ Sao (4500 K)</button>
              </div>
            </div>

            <div>
              <div class="control-label" style="margin-bottom:8px;">🗺️ Chế độ Bản đồ nhiệt (Heatmap)</div>
              <select id="pt-heatmap-select" class="select-field" style="width:100%;">
                <option value="none">Màu chuẩn 11 nhóm phân loại</option>
                <option value="electronegativity">Độ âm điện (Electronegativity)</option>
                <option value="atomicRadius">Bán kính nguyên tử (Atomic Radius)</option>
                <option value="ionizationEnergy">Năng lượng ion hóa (Ionization Energy)</option>
                <option value="discoveryYear">Năm phát hiện (Discovery Year)</option>
              </select>
              <div id="pt-heatmap-scale" class="heatmap-scale-bar" style="display:none;">
                <span class="mono" id="pt-hm-min">Min</span>
                <div class="heatmap-gradient"></div>
                <span class="mono" id="pt-hm-max">Max</span>
              </div>
            </div>
          </div>

          <!-- Interactive 11-Category Color Legend -->
          <div class="pt-legend-bar" id="pt-legend-bar">
            ${CV.CATEGORIES.map(
              (c) => `
              <button class="cat-chip" data-cat="${c.id}" style="--chip-color:${c.color};">
                <span class="cat-dot" style="background:${c.color};box-shadow:0 0 8px ${c.color};"></span>${CV.catName(c)}
              </button>`
            ).join('')}
          </div>

          <!-- 18x7 + 2 Rows Periodic Grid -->
          <div class="pt-scroll-wrap">
            <div class="pt-grid" id="pt-grid"></div>
          </div>

          <!-- Hover Summary Bar -->
          <div id="pt-hover-card" class="glass-surface" style="margin-top:14px;padding:14px 18px;border-radius:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <span style="color:var(--text-muted);">Di chuột vào ô nguyên tố để xem nhanh thông số, hoặc nhấn để mở thẻ chi tiết 3D.</span>
          </div>
          </div><!-- end pt-2d-section -->
        </div>
      `;

      this.buildGrid();
      this.bindEvents();
      this.updateCells();
    },

    getGridPos(el) {
      // Col 1 is Period Axis, so Groups 1..18 map to grid-column 2..19; Row 1 is Group Axis, so Periods 1..7 map to grid-row 2..8
      if (el.number >= 57 && el.number <= 71) {
        return { row: 10, col: el.number - 57 + 5 };
      }
      if (el.number >= 89 && el.number <= 103) {
        return { row: 11, col: el.number - 89 + 5 };
      }
      return { row: el.period + 1, col: el.group + 1 };
    },

    buildGrid() {
      const grid = document.getElementById('pt-grid');
      let html = '';

      // Corner Axis Label
      html += `<div class="pt-axis-corner"><span>Nhóm →</span><span>Chu kỳ ↓</span></div>`;

      // Top Group Axis (1..18 + IA..VIIIA)
      for (let g = 1; g <= 18; g++) {
        html += `
          <div class="pt-group-pill" style="grid-column:${g + 1};">
            <strong class="mono">${g}</strong>
            <small>${GROUP_ROMAN[g - 1]}</small>
          </div>`;
      }

      // Left Sticky Period Axis (1..7)
      for (let p = 1; p <= 7; p++) {
        html += `<div class="pt-period-pill" style="grid-row:${p + 1};">✦ ${p}</div>`;
      }

      // Cosmic Galaxy + Legend Anatomy Card in empty space above transition metals (rows 2..4, cols 4..13)
      html += `
        <div class="pt-galaxy-gap" id="pt-galaxy-gap">
          <svg width="78" height="78" viewBox="0 0 80 80" fill="none" aria-hidden="true" style="flex-shrink:0;">
            <circle cx="40" cy="40" r="32" stroke="rgba(56,189,248,0.28)" stroke-dasharray="4 3" />
            <ellipse cx="40" cy="40" rx="34" ry="13" transform="rotate(-24 40 40)" stroke="#38BDF8" stroke-width="1.4" stroke-opacity="0.7" />
            <ellipse cx="40" cy="40" rx="22" ry="9" transform="rotate(28 40 40)" stroke="#C084FC" stroke-width="1.2" stroke-opacity="0.7" />
            <circle cx="40" cy="40" r="6" fill="#00E5FF" />
            <circle cx="67" cy="27" r="2.5" fill="#FFC312" />
            <circle cx="16" cy="51" r="2" fill="#EC4899" />
          </svg>
          <div class="pt-anatomy-card glass-surface" id="pt-anatomy-card">
            <div class="pt-anatomy-sample">
              <div style="display:flex;justify-content:space-between;font-size:0.65rem;" class="mono"><span>26</span><span>🧊</span></div>
              <strong style="font-size:1.25rem;color:#FFC312;font-family:var(--font-display);line-height:1;">Fe</strong>
              <span style="font-size:0.62rem;font-weight:600;">Sắt</span>
              <span class="mono" style="font-size:0.55rem;color:var(--text-muted);">55.845 u</span>
            </div>
            <div class="pt-anatomy-labels">
              <div>↖ <strong class="mono">26</strong>: Số hiệu nguyên tử (Z)</div>
              <div>← <strong style="color:#FFC312;">Fe</strong>: Ký hiệu hóa học</div>
              <div>← <strong>Sắt</strong>: Tên nguyên tố (VI/EN)</div>
              <div>↙ <strong class="mono">55.845</strong>: Nguyên tử khối / Cấu hình e</div>
            </div>
          </div>
        </div>
      `;

      // Connector cells for f-block in main table (Group 3, Period 6 & 7)
      html += `<div class="pt-connector-cell" style="grid-row:7;grid-column:4;" title="Dãy Lanthanide (57–71) tách ở dưới"><span>57–71</span><small>La–Lu</small></div>`;
      html += `<div class="pt-connector-cell" style="grid-row:8;grid-column:4;border-color:rgba(192,132,252,0.5);background:rgba(192,132,252,0.08);" title="Dãy Actinide (89–103) tách ở dưới"><span>89–103</span><small>Ac–Lr</small></div>`;

      // 118 Element Cells
      CV.ELEMENTS.forEach((el) => {
        const pos = this.getGridPos(el);
        html += `
          <div class="pt-cell" id="pt-cell-${el.number}" data-num="${el.number}" style="grid-row:${pos.row};grid-column:${pos.col};">
            <div class="pt-cell-top">
              <span class="mono">${el.number}</span>
              <span class="pt-cell-phase"></span>
            </div>
            <div class="pt-cell-sym">${el.symbol}</div>
            <div class="pt-cell-name">${CV.elName(el)}</div>
            <div class="pt-cell-sub mono">${el.atomicMass}</div>
          </div>`;
      });

      // Spacer row 9 & f-block labels
      html += `<div class="pt-fblock-spacer" style="grid-row:9;"></div>`;
      html += `<div style="grid-row:10;grid-column:2 / span 3;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;font-size:0.74rem;font-weight:600;color:#EC4899;">57–71 Lanthanide →</div>`;
      html += `<div style="grid-row:11;grid-column:2 / span 3;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;font-size:0.74rem;font-weight:600;color:#C084FC;">89–103 Actinide →</div>`;

      grid.innerHTML = html;
    },

    bindEvents() {
      const st = this.state;
      const slider = document.getElementById('pt-temp-slider');
      slider.addEventListener('input', (e) => {
        st.tempK = Number(e.target.value);
        this.updateTempLabel();
        this.updateCells();
      });

      document.querySelectorAll('.pt-unit-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          st.tempUnit = btn.getAttribute('data-unit');
          document.querySelectorAll('.pt-unit-btn').forEach((b) => {
            b.className = b === btn ? 'btn btn-sm btn-primary pt-unit-btn' : 'btn btn-sm btn-secondary pt-unit-btn';
          });
          this.updateTempLabel();
        });
      });

      document.querySelectorAll('.pt-preset-temp').forEach((btn) => {
        btn.addEventListener('click', () => {
          st.tempK = Number(btn.getAttribute('data-k'));
          slider.value = st.tempK;
          this.updateTempLabel();
          this.updateCells();
        });
      });

      document.getElementById('pt-heatmap-select').addEventListener('change', (e) => {
        st.heatmap = e.target.value;
        this.updateCells();
      });

      // Pill Search
      const searchInput = document.getElementById('pt-search-input');
      const runSearch = () => {
        st.searchQuery = searchInput.value.trim().toLowerCase();
        this.updateCells();
      };
      searchInput.addEventListener('input', runSearch);
      document.getElementById('pt-search-btn').addEventListener('click', () => {
        runSearch();
        if (st.searchQuery) {
          const hit = CV.ELEMENTS.find(
            (e) =>
              e.symbol.toLowerCase() === st.searchQuery ||
              String(e.number) === st.searchQuery ||
              e.nameVi.toLowerCase().includes(st.searchQuery) ||
              e.name.toLowerCase().includes(st.searchQuery)
          );
          if (hit) CV.openElementModal(hit.number);
        }
      });

      // Toggle Anatomy Card
      document.getElementById('pt-toggle-anatomy').addEventListener('click', () => {
        st.showAnatomy = !st.showAnatomy;
        const card = document.getElementById('pt-anatomy-card');
        if (card) card.style.display = st.showAnatomy ? 'flex' : 'none';
      });

      // 11-Category Legend click highlight
      document.querySelectorAll('#pt-legend-bar .cat-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const catId = chip.getAttribute('data-cat');
          if (st.activeCategory === catId) {
            st.activeCategory = null;
            chip.classList.remove('selected');
          } else {
            st.activeCategory = catId;
            document.querySelectorAll('#pt-legend-bar .cat-chip').forEach((c) => c.classList.remove('selected'));
            chip.classList.add('selected');
          }
          this.updateCells();
        });
      });

      document.querySelectorAll('.pt-cell').forEach((cell) => {
        const num = Number(cell.getAttribute('data-num'));
        cell.addEventListener('mouseenter', () => this.showHoverCard(num));
        cell.addEventListener('click', () => CV.openElementModal(num));
      });

      // 2D / 3D View Switch
      const btn2d = document.getElementById('pt-mode-2d');
      const btn3d = document.getElementById('pt-mode-3d');
      const sec2d = document.getElementById('pt-2d-section');
      const sec3d = document.getElementById('pt-3d-section');

      btn2d.addEventListener('click', () => {
        btn2d.className = 'btn btn-primary btn-sm';
        btn3d.className = 'btn btn-secondary btn-sm';
        sec2d.style.display = 'block';
        sec3d.style.display = 'none';
      });
      btn3d.addEventListener('click', () => {
        btn3d.className = 'btn btn-primary btn-sm';
        btn2d.className = 'btn btn-secondary btn-sm';
        sec2d.style.display = 'none';
        sec3d.style.display = 'block';
        if (!this.three3D) this.init3DTable();
        else this.resize3DTable();
      });

      document.getElementById('pt-3d-prop').addEventListener('change', (e) => this.update3DHeights(e.target.value));
      document.getElementById('pt-3d-reset').addEventListener('click', () => {
        if (this.three3D) {
          this.three3D.camera.position.set(0, 18, 26);
          this.three3D.controls.target.set(0, 0, 0);
        }
      });
    },

    init3DTable() {
      const wrap = document.getElementById('pt-3d-canvas-wrap');
      if (!wrap || typeof THREE === 'undefined') return;

      const w = wrap.clientWidth || 900;
      const h = wrap.clientHeight || 520;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 300);
      camera.position.set(0, 18, 26);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      wrap.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;

      scene.add(new THREE.AmbientLight(0xe2e8f0, 0.75));
      const dLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dLight.position.set(12, 24, 16);
      scene.add(dLight);

      const gridHelper = new THREE.GridHelper(32, 32, 0x38bdf8, 0x1e293b);
      gridHelper.position.y = -0.02;
      scene.add(gridHelper);

      const boxGeo = new THREE.BoxGeometry(0.95, 1, 0.95);
      const blocks = [];

      CV.ELEMENTS.forEach((el) => {
        const pos = this.getGridPos(el);
        const colX = (pos.col - 10.5) * 1.25;
        const rowZ = (pos.row - 5.5) * 1.25;
        const cat = CV.getCategory(el.category);

        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cat.color),
          emissive: new THREE.Color(cat.color),
          emissiveIntensity: 0.25,
          roughness: 0.35,
          metalness: 0.2
        });

        const mesh = new THREE.Mesh(boxGeo, mat);
        mesh.position.set(colX, 0.4, rowZ);
        mesh.scale.set(1, 0.8, 1);
        mesh.userData = { element: el, targetH: 0.8, baseColor: new THREE.Color(cat.color) };
        scene.add(mesh);
        blocks.push(mesh);
      });

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const tooltip3d = document.getElementById('pt-3d-tooltip');
      let hoveredBlock = null;
      let downPos = { x: 0, y: 0 };

      renderer.domElement.addEventListener('pointerdown', (e) => { downPos = { x: e.clientX, y: e.clientY }; });
      renderer.domElement.addEventListener('pointermove', (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(blocks, false);

        if (hoveredBlock && (!hits.length || hits[0].object !== hoveredBlock)) {
          hoveredBlock.scale.x = 1;
          hoveredBlock.scale.z = 1;
          hoveredBlock = null;
        }

        if (hits.length > 0) {
          const blk = hits[0].object;
          hoveredBlock = blk;
          blk.scale.x = 1.15;
          blk.scale.z = 1.15;
          const el = blk.userData.element;
          const cat = CV.getCategory(el.category);
          const propSel = document.getElementById('pt-3d-prop');
          const propKey = propSel ? propSel.value : 'none';
          const propLabel = propSel && propSel.selectedIndex >= 0 ? propSel.options[propSel.selectedIndex].text : '';
          const propVal = propKey !== 'none' ? (el[propKey] ?? '—') : `${el.atomicMass} u`;

          if (tooltip3d) {
            const localX = e.clientX - rect.left;
            const localY = e.clientY - rect.top;
            const tipX = Math.min(rect.width - 240, Math.max(8, localX + 14));
            const tipY = Math.min(rect.height - 115, Math.max(8, localY + 14));
            tooltip3d.style.display = 'block';
            tooltip3d.style.left = tipX + 'px';
            tooltip3d.style.top = tipY + 'px';
            tooltip3d.innerHTML = `
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <strong style="font-size:1.25rem;color:${cat.color};font-family:var(--font-display);">${el.symbol}</strong>
                <div>
                  <div style="font-weight:700;">${CV.elName(el)} <span class="mono" style="color:var(--accent-cyan);">Z=${el.number}</span></div>
                  <div style="font-size:0.72rem;color:${cat.color};">${CV.catName(cat)}</div>
                </div>
              </div>
              <div class="mono" style="font-size:0.76rem;color:var(--text-secondary);">${el.electronConfig}</div>
              <div style="margin-top:4px;font-size:0.78rem;color:var(--text-primary);">
                ${propKey !== 'none' ? `<span>${propLabel.split('(')[0].trim()}:</span> <strong class="mono" style="color:#34D399;">${propVal}</strong>` : `<span>${CV.t('Khối lượng', 'Mass')}:</span> <strong class="mono">${propVal}</strong>`}
              </div>
            `;
          }
          renderer.domElement.style.cursor = 'pointer';
        } else {
          if (tooltip3d) tooltip3d.style.display = 'none';
          renderer.domElement.style.cursor = 'grab';
        }
      });

      renderer.domElement.addEventListener('pointerleave', () => {
        if (tooltip3d) tooltip3d.style.display = 'none';
        if (hoveredBlock) {
          hoveredBlock.scale.x = 1;
          hoveredBlock.scale.z = 1;
          hoveredBlock = null;
        }
      });

      renderer.domElement.addEventListener('pointerup', (e) => {
        if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(blocks, false);
        if (hits.length > 0) CV.openElementModal(hits[0].object.userData.element.number);
      });

      this.three3D = { wrap, scene, camera, renderer, controls, blocks };
      this.resize3DTable = () => {
        const nw = wrap.clientWidth, nh = wrap.clientHeight;
        if (!nw || !nh) return;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', this.resize3DTable);

      const animate = () => {
        requestAnimationFrame(animate);
        if (CV.state.currentRoute !== 'periodic-table') return;
        for (const b of blocks) {
          const curH = b.scale.y;
          const nextH = curH + (b.userData.targetH - curH) * 0.1;
          b.scale.y = nextH;
          b.position.y = nextH / 2;
        }
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    },

    update3DHeights(prop) {
      if (!this.three3D) return;
      const { blocks } = this.three3D;
      if (prop === 'none') {
        blocks.forEach((b) => {
          b.userData.targetH = 0.8;
          b.material.color.copy(b.userData.baseColor);
          b.material.emissive.copy(b.userData.baseColor);
        });
        return;
      }

      let maxV = -Infinity, minV = Infinity;
      blocks.forEach((b) => {
        const v = b.userData.element[prop];
        if (v !== null && v !== undefined) {
          if (v > maxV) maxV = v;
          if (v < minV) minV = v;
        }
      });

      blocks.forEach((b) => {
        const v = b.userData.element[prop];
        if (v === null || v === undefined || maxV === minV) {
          b.userData.targetH = 0.25;
          b.material.color.setHex(0x334155);
          b.material.emissive.setHex(0x1e293b);
        } else {
          const t = (v - minV) / (maxV - minV);
          b.userData.targetH = 0.4 + t * 8.5;
          const c = new THREE.Color().setHSL((1 - t) * 0.66, 0.85, 0.55);
          b.material.color.copy(c);
          b.material.emissive.copy(c);
        }
      });
    },

    updateTempLabel() {
      document.getElementById('pt-temp-display').textContent = CV.formatTemp(this.state.tempK, this.state.tempUnit);
    },

    getPhaseAtTemp(el, tempK) {
      if (el.melt === null && el.boil === null) return 'Unknown';
      if (el.melt !== null && tempK < el.melt) return 'Solid';
      if (el.boil !== null && tempK >= el.boil) return 'Gas';
      if (el.melt !== null && tempK >= el.melt) return 'Liquid';
      return el.phase;
    },

    heatmapColor(t) {
      const stops = [
        [30, 58, 138],
        [6, 182, 212],
        [16, 185, 129],
        [245, 158, 11],
        [239, 68, 68]
      ];
      const clamped = Math.max(0, Math.min(1, t));
      const idx = clamped * (stops.length - 1);
      const i0 = Math.floor(idx);
      const i1 = Math.min(stops.length - 1, i0 + 1);
      const f = idx - i0;
      const r = Math.round(stops[i0][0] + (stops[i1][0] - stops[i0][0]) * f);
      const g = Math.round(stops[i0][1] + (stops[i1][1] - stops[i0][1]) * f);
      const b = Math.round(stops[i0][2] + (stops[i1][2] - stops[i0][2]) * f);
      return `rgba(${r}, ${g}, ${b}, 0.45)`;
    },

    updateCells() {
      const st = this.state;
      const hm = st.heatmap;
      const scaleBar = document.getElementById('pt-heatmap-scale');

      let minVal = Infinity, maxVal = -Infinity;
      if (hm !== 'none') {
        CV.ELEMENTS.forEach((el) => {
          const val = hm === 'discoveryYear' ? (typeof el.discoveryYear === 'number' ? el.discoveryYear : null) : el[hm];
          if (val !== null && val !== undefined) {
            if (val < minVal) minVal = val;
            if (val > maxVal) maxVal = val;
          }
        });
        scaleBar.style.display = 'flex';
        const unit = hm === 'atomicRadius' ? ' pm' : hm === 'ionizationEnergy' ? ' kJ/mol' : '';
        document.getElementById('pt-hm-min').textContent = `${minVal}${unit}`;
        document.getElementById('pt-hm-max').textContent = `${maxVal}${unit}`;
      } else {
        scaleBar.style.display = 'none';
      }

      CV.ELEMENTS.forEach((el) => {
        const cell = document.getElementById(`pt-cell-${el.number}`);
        if (!cell) return;
        const cat = CV.getCategory(el.category);
        const phase = this.getPhaseAtTemp(el, st.tempK);
        cell.querySelector('.pt-cell-phase').textContent = CV.phaseIcon(phase);

        // Category or Search Dimming/Highlight
        let isMatch = true;
        if (st.activeCategory && el.category !== st.activeCategory) isMatch = false;
        const q = st.searchQuery;
        const isSearchHit =
          q &&
          (el.symbol.toLowerCase() === q ||
            String(el.number) === q ||
            el.nameVi.toLowerCase().includes(q) ||
            el.name.toLowerCase().includes(q));
        if (q && !isSearchHit) isMatch = false;

        cell.classList.toggle('dimmed', !isMatch);
        cell.classList.toggle('search-hit', Boolean(isSearchHit));

        if (hm === 'none') {
          const isLight = document.body.classList.contains('light-glass');
          cell.style.background = isLight
            ? `linear-gradient(155deg, ${cat.glow}, rgba(255, 255, 255, 0.9))`
            : `linear-gradient(155deg, ${cat.glow}, rgba(11, 16, 38, 0.86))`;
          cell.style.borderColor = cat.color;
        } else {
          const val = hm === 'discoveryYear' ? (typeof el.discoveryYear === 'number' ? el.discoveryYear : null) : el[hm];
          if (val === null || val === undefined) {
            cell.style.background = 'rgba(30, 41, 59, 0.4)';
            cell.style.borderColor = 'rgba(148, 163, 184, 0.25)';
          } else {
            const t = maxVal > minVal ? (val - minVal) / (maxVal - minVal) : 0.5;
            cell.style.background = this.heatmapColor(t);
            cell.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          }
        }
      });
    },

    showHoverCard(num) {
      const el = CV.getElement(num);
      if (!el) return;
      const cat = CV.getCategory(el.category);
      const phase = this.getPhaseAtTemp(el, this.state.tempK);
      const card = document.getElementById('pt-hover-card');
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
          <strong style="font-size:1.5rem;color:${cat.color};font-family:var(--font-display);">${el.symbol}</strong>
          <div>
            <strong>${el.nameVi} (${el.name})</strong> • <span class="mono">Z=${el.number}</span> • <span class="mono">${el.electronConfig}</span>
            <div style="font-size:0.82rem;color:var(--text-muted);">${cat.nameVi} • Trạng thái tại ${CV.formatTemp(this.state.tempK, this.state.tempUnit)}: ${CV.phaseIcon(phase)} ${CV.phaseVi(phase)}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.openInSimulator(${el.number})">⚛️ Mô phỏng</button>
          <button class="btn btn-primary btn-sm" onclick="CHEMVERSE.openElementModal(${el.number})">Mở thẻ 3D</button>
        </div>
      `;
    }
  };
})();
