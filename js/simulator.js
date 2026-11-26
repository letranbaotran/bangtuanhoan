(function () {
  const CV = window.CHEMVERSE;

  const SUBSHELL_LETTERS = ['s', 'p', 'd', 'f', 'g', 'h', 'i'];

  CV.modules.simulator = {
    state: {
      mainTab: 'satellite', // 'satellite' | 'quantum' | 'bonding'
      elementId: 6,
      playing: true,
      speed: 1,
      valenceHighlight: true,
      satelliteFlat2D: false,
      bondPair: 'Na+Cl',
      // Quantum Orbital state
      qn: 4,
      ql: 1,
      qm: 0,
      qVizMode: 'cloud', // 'contours' | 'cloud' | 'volumetric'
      qScale: 1.0,
      qIntensity: 1.0,
      qAutoRotate: true
    },
    three: null,
    bondingAnimId: null,

    init(container) {
      this.state.elementId = CV.state.simulatorElement || 6;

      container.innerHTML = `
        <div class="page-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">${CV.t('Atom Simulator – Hệ Vệ Tinh & Orbital Lượng Tử 3D', 'Atom Simulator – Satellite & 3D Quantum Orbitals')}</h2>
              <p class="section-subtitle">${CV.t('Chuyển đổi linh hoạt giữa Hệ Sao – Vệ Tinh, Trình mô phỏng Orbital Lượng tử (n, l, m) và Ghép đôi liên kết', 'Switch between Star-Satellite Bohr 3D, Quantum Orbital Visualizer (n, l, m), and Bonding Sandbox')}</p>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;" id="sim-main-tabs">
              <button class="btn btn-sm btn-primary" data-tab="satellite">⚛️ Hệ Sao – Vệ Tinh 3D</button>
              <button class="btn btn-sm btn-secondary" data-tab="quantum">🌀 Orbital Lượng Tử (n, l, m)</button>
              <button class="btn btn-sm btn-secondary" data-tab="bonding">🔗 Ghép Đôi Liên Kết</button>
            </div>
          </div>

          <!-- TAB 1 & 3 STAGE + CONTROLS -->
          <div id="sim-standard-layout" class="simulator-layout">
            <div class="simulator-stage glass-surface">
              <div id="sim-3d-wrap"></div>
              <canvas id="sim-2d-canvas" style="display:none;"></canvas>
              <div class="simulator-hud glass-surface" id="sim-hud"></div>
              <div id="sim-q-actions" style="display:none;position:absolute;bottom:14px;right:14px;gap:8px;">
                <button class="btn btn-sm btn-secondary" id="sim-q-reset">⟲ Reset View</button>
                <button class="btn btn-sm btn-primary" id="sim-q-shot">📸 Screenshot</button>
              </div>
            </div>

            <!-- Right Panel (switches between Satellite Controls & Quantum Inspector) -->
            <aside class="simulator-controls glass-surface">
              <!-- Satellite Controls -->
              <div id="sim-sat-panel" style="display:flex;flex-direction:column;gap:14px;">
                <div class="control-group">
                  <span class="control-label">Chọn nguyên tố (1–118)</span>
                  <div style="display:flex;gap:6px;">
                    <button class="icon-btn" id="sim-prev-el" title="Nguyên tố trước">◀</button>
                    <select id="sim-el-select" class="select-field" style="flex:1;"></select>
                    <button class="icon-btn" id="sim-next-el" title="Nguyên tố kế tiếp">▶</button>
                  </div>
                </div>

                <div class="control-group">
                  <span class="control-label">Góc nhìn quỹ đạo</span>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <button class="btn btn-sm btn-primary" id="sim-sat-3d">🌌 Quỹ đạo 3D</button>
                    <button class="btn btn-sm btn-secondary" id="sim-sat-2d">⭕ Bohr 2D</button>
                  </div>
                </div>

                <div class="control-group">
                  <span class="control-label">Điều khiển quỹ đạo</span>
                  <div style="display:flex;align-items:center;gap:10px;">
                    <button class="btn btn-primary btn-sm" id="sim-play-btn" style="min-width:105px;">⏸ Tạm dừng</button>
                    <span class="mono" id="sim-speed-val" style="font-size:0.84rem;">1.00x</span>
                  </div>
                  <input type="range" id="sim-speed-slider" min="0.25" max="3" step="0.25" value="1" style="width:100%;accent-color:var(--accent-cyan);" />
                </div>

                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:0.88rem;">
                  <input type="checkbox" id="sim-valence-chk" checked style="width:18px;height:18px;accent-color:var(--accent-cyan);" />
                  <span>✨ Nổi bật electron hóa trị</span>
                </label>

                <div id="sim-shell-info" class="glass-surface" style="padding:12px;border-radius:12px;font-size:0.84rem;"></div>
              </div>

              <!-- Bonding Controls -->
              <div id="sim-bond-panel" style="display:none;flex-direction:column;gap:12px;">
                <div class="control-label">Cặp ghép đôi liên kết mẫu</div>
                <button class="btn btn-sm btn-primary sim-bond-preset" data-pair="Na+Cl">⚡ Na + Cl (Liên kết Ion: Na⁺Cl⁻)</button>
                <button class="btn btn-sm btn-secondary sim-bond-preset" data-pair="H+O">💧 H + O (Cộng hóa trị: H₂O)</button>
                <button class="btn btn-sm btn-secondary sim-bond-preset" data-pair="C+H">🔥 C + H (Cộng hóa trị: CH₄)</button>
                <p style="font-size:0.82rem;color:var(--text-muted);margin-top:6px;">
                  Quan sát trực quan electron hóa trị tách khỏi quỹ đạo (Ion) hoặc quay chung giữa 2 hạt nhân (Cộng hóa trị).
                </p>
              </div>

              <!-- Quantum Orbital Controls & Inspector -->
              <div id="sim-quantum-panel" style="display:none;flex-direction:column;gap:10px;">
                <div class="control-group">
                  <span class="control-label">Chọn nguyên tố (1–118)</span>
                  <div style="display:flex;gap:6px;">
                    <button class="icon-btn" id="sim-q-prev-el" title="Nguyên tố trước">◀</button>
                    <select id="sim-q-el-select" class="select-field" style="flex:1;"></select>
                    <button class="icon-btn" id="sim-q-next-el" title="Nguyên tố kế tiếp">▶</button>
                  </div>
                </div>
                <div class="control-group">
                  <span class="control-label">Nguyên tố nhanh</span>
                  <div style="display:flex;flex-wrap:wrap;gap:5px;" id="sim-q-quick-els">
                    ${[1, 2, 6, 7, 8, 11, 17, 26, 29, 79].map((z) => {
                      const el = CV.getElement(z);
                      return `<button class="btn btn-sm ${z === this.state.elementId ? 'btn-primary' : 'btn-secondary'} sim-q-el-btn" data-z="${z}" style="padding:4px 8px;font-size:0.76rem;" title="${el ? el.nameVi : ''}">${el ? el.symbol : z}</button>`;
                    }).join('')}
                  </div>
                </div>

                <!-- Key Orbital Summary -->
                <div id="sim-q-inspector" class="glass-surface" style="padding:10px 12px;border-radius:12px;font-size:0.8rem;"></div>

                <div class="segmented-ctrl" id="q-viz-ctrl">
                  <button data-viz="contours">Đường nét</button>
                  <button data-viz="cloud" class="active">Đám mây |ψ|²</button>
                  <button data-viz="volumetric">Khối 3D</button>
                </div>

                <label style="display:flex;align-items:center;gap:8px;font-size:0.82rem;cursor:pointer;">
                  <input type="checkbox" id="q-autorot-chk" checked style="accent-color:var(--accent-cyan);" />
                  <span>Tự động xoay (Auto Rotate)</span>
                </label>

                <!-- Interactive Orbital Box Diagram -->
                <div class="glass-surface" style="padding:10px 12px;border-radius:12px;">
                  <div style="font-size:0.74rem;color:var(--text-muted);margin-bottom:6px;font-weight:600;">
                    📦 Sơ đồ Ô Orbital (Nhấn ô để xem 3D)
                  </div>
                  <div id="sim-q-boxes"></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      `;

      const optsHtml = CV.ELEMENTS.map((e) => `<option value="${e.number}">${e.number}. ${e.symbol} – ${e.nameVi}</option>`).join('');
      const sel = document.getElementById('sim-el-select');
      sel.innerHTML = optsHtml;
      sel.value = this.state.elementId;
      const qSel = document.getElementById('sim-q-el-select');
      if (qSel) {
        qSel.innerHTML = optsHtml;
        qSel.value = this.state.elementId;
      }

      this.initThree();
      this.bindEvents();
      this.buildAtom(this.state.elementId);
    },

    onShow() {
      if (CV.state.simulatorElement && CV.state.simulatorElement !== this.state.elementId) {
        this.selectElement(CV.state.simulatorElement);
      }
      if (this.three) this.handleResize();
    },

    selectElement(num) {
      this.state.elementId = Math.max(1, Math.min(118, Number(num)));
      CV.state.simulatorElement = this.state.elementId;
      const sel = document.getElementById('sim-el-select');
      if (sel) sel.value = this.state.elementId;
      const qSel = document.getElementById('sim-q-el-select');
      if (qSel) qSel.value = this.state.elementId;
      if (this.state.mainTab !== 'satellite') this.switchMainTab('satellite');
      else this.buildAtom(this.state.elementId);
    },

    selectQuantumElement(num) {
      this.state.elementId = Math.max(1, Math.min(118, Number(num)));
      CV.state.simulatorElement = this.state.elementId;
      const sel = document.getElementById('sim-el-select');
      if (sel) sel.value = this.state.elementId;
      const qSel = document.getElementById('sim-q-el-select');
      if (qSel) qSel.value = this.state.elementId;

      document.querySelectorAll('.sim-q-el-btn').forEach((btn) => {
        const isActive = Number(btn.getAttribute('data-z')) === this.state.elementId;
        btn.className = `btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'} sim-q-el-btn`;
      });

      const el = CV.getElement(this.state.elementId);
      if (el) {
        const { subshells } = CV.getOrbitalBoxes(el);
        if (subshells.length) {
          const lastSub = subshells[subshells.length - 1];
          const activeBox = lastSub.boxes.find((b) => b.spins.length === 1) || lastSub.boxes[0];
          this.selectOrbitalFromBox(lastSub.n, lastSub.l, activeBox ? activeBox.m : 0);
          return;
        }
      }
      if (this.state.mainTab === 'quantum') {
        this.buildQuantumOrbital();
      }
    },

    initThree() {
      const wrap = document.getElementById('sim-3d-wrap');
      if (!wrap || typeof THREE === 'undefined') return;

      const w = wrap.clientWidth || 640;
      const h = wrap.clientHeight || 500;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 500);
      camera.position.set(0, 10, 26);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      wrap.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;

      scene.add(new THREE.AmbientLight(0xe2e8f0, 0.8));
      const pLight = new THREE.PointLight(0x38bdf8, 2.0, 120);
      pLight.position.set(8, 12, 14);
      scene.add(pLight);

      const atomGroup = new THREE.Group();
      scene.add(atomGroup);

      this.three = { wrap, scene, camera, renderer, controls, atomGroup, electrons: [], nucleusGroup: null };

      this.handleResize = () => {
        const nw = wrap.clientWidth;
        const nh = wrap.clientHeight;
        if (!nw || !nh) return;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', this.handleResize);

      const animate = () => {
        requestAnimationFrame(animate);
        if (CV.state.currentRoute !== 'simulator' || this.state.mainTab === 'bonding') return;

        if (this.state.mainTab === 'quantum') {
          if (this.state.qAutoRotate) {
            atomGroup.rotation.y += 0.006;
          }
        } else if (this.state.playing) {
          const dt = 0.016 * this.state.speed;
          if (this.three.nucleusGroup) {
            this.three.nucleusGroup.rotation.y += dt * 0.6;
            this.three.nucleusGroup.rotation.x += dt * 0.35;
          }
          for (const eObj of this.three.electrons) {
            eObj.angle += eObj.angularSpeed * dt;
            eObj.mesh.position.set(Math.cos(eObj.angle) * eObj.radius, 0, Math.sin(eObj.angle) * eObj.radius);
          }
        }
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    },

    switchMainTab(tab) {
      this.state.mainTab = tab;
      document.querySelectorAll('#sim-main-tabs button').forEach((b) => {
        b.className = b.getAttribute('data-tab') === tab ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-secondary';
      });

      const wrap3d = document.getElementById('sim-3d-wrap');
      const canvas2d = document.getElementById('sim-2d-canvas');
      const satPanel = document.getElementById('sim-sat-panel');
      const bondPanel = document.getElementById('sim-bond-panel');
      const qPanel = document.getElementById('sim-quantum-panel');
      const qActions = document.getElementById('sim-q-actions');

      satPanel.style.display = tab === 'satellite' ? 'flex' : 'none';
      bondPanel.style.display = tab === 'bonding' ? 'flex' : 'none';
      qPanel.style.display = tab === 'quantum' ? 'flex' : 'none';
      qActions.style.display = tab === 'quantum' ? 'flex' : 'none';

      if (tab === 'bonding') {
        wrap3d.style.display = 'none';
        canvas2d.style.display = 'block';
        this.startBondingCanvas();
      } else {
        if (this.bondingAnimId) cancelAnimationFrame(this.bondingAnimId);
        wrap3d.style.display = 'block';
        canvas2d.style.display = 'none';
        if (tab === 'satellite') this.buildAtom(this.state.elementId);
        else this.selectQuantumElement(this.state.elementId);
      }
    },

    buildAtom(num) {
      const el = CV.getElement(num);
      if (!el || !this.three) return;
      const cat = CV.getCategory(el.category);
      const { atomGroup, camera, controls } = this.three;

      atomGroup.rotation.set(0, 0, 0);
      while (atomGroup.children.length > 0) atomGroup.remove(atomGroup.children[0]);
      this.three.electrons = [];

      // Nucleus
      const nucleusGroup = new THREE.Group();
      const totalNucleons = Math.min(64, el.protons + el.neutrons);
      const pRatio = el.protons / (el.protons + el.neutrons || 1);
      const nucGeo = new THREE.SphereGeometry(0.32, 12, 12);
      const pMat = new THREE.MeshStandardMaterial({ color: 0xff5e6c, emissive: 0xff3b52, emissiveIntensity: 0.55 });
      const nMat = new THREE.MeshStandardMaterial({ color: 0x64748b, emissive: 0x334155, emissiveIntensity: 0.2 });

      for (let i = 0; i < totalNucleons; i++) {
        const m = new THREE.Mesh(nucGeo, i / totalNucleons < pRatio ? pMat : nMat);
        const phi = Math.acos(1 - (2 * (i + 0.5)) / totalNucleons);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = Math.cbrt(i / totalNucleons) * (0.45 + Math.min(1.1, el.number * 0.01));
        m.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        nucleusGroup.add(m);
      }
      nucleusGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.45, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff7b54, transparent: true, opacity: 0.18 })));
      atomGroup.add(nucleusGroup);
      this.three.nucleusGroup = nucleusGroup;

      const shellCount = el.shells.length;
      el.shells.forEach((count, sIdx) => {
        const radius = 3.2 + sIdx * 2.2;
        const isValence = sIdx === shellCount - 1;
        const shellContainer = new THREE.Group();

        if (!this.state.satelliteFlat2D) {
          shellContainer.rotation.x = ((sIdx % 3) - 1) * 0.42 + 0.25;
          shellContainer.rotation.z = (sIdx % 2 === 0 ? 1 : -1) * 0.32;
        } else {
          shellContainer.rotation.x = Math.PI / 2;
        }

        const ringMesh = new THREE.Mesh(
          new THREE.TorusGeometry(radius, isValence ? 0.045 : 0.028, 8, 96),
          new THREE.MeshBasicMaterial({
            color: isValence && this.state.valenceHighlight ? 0xfbbf24 : 0x38bdf8,
            transparent: true,
            opacity: isValence && this.state.valenceHighlight ? 0.65 : 0.28
          })
        );
        ringMesh.rotation.x = Math.PI / 2;
        shellContainer.add(ringMesh);

        const eSize = isValence && this.state.valenceHighlight ? 0.34 : 0.22;
        const eGeo = new THREE.SphereGeometry(eSize, 14, 14);
        const eMat = new THREE.MeshBasicMaterial({ color: isValence && this.state.valenceHighlight ? 0xfbbf24 : 0x00e5ff });

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const eMesh = new THREE.Mesh(eGeo, eMat);
          eMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
          shellContainer.add(eMesh);
          this.three.electrons.push({
            mesh: eMesh,
            radius,
            angle,
            angularSpeed: (1.9 - sIdx * 0.18) * (sIdx % 2 === 0 ? 1 : -1)
          });
        }
        atomGroup.add(shellContainer);
      });

      const targetDist = 11 + shellCount * 3.8;
      camera.position.set(0, this.state.satelliteFlat2D ? 0 : targetDist * 0.38, this.state.satelliteFlat2D ? targetDist * 1.15 : targetDist);
      controls.target.set(0, 0, 0);
      controls.update();

      const valenceCount = el.shells[el.shells.length - 1];
      document.getElementById('sim-hud').innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <strong style="font-size:1.5rem;color:${cat.color};font-family:var(--font-display);">${el.symbol}</strong>
          <div>
            <div style="font-weight:700;">${el.nameVi} (${el.name})</div>
            <div class="mono" style="font-size:0.78rem;color:var(--text-muted);">Z=${el.number} • P:${el.protons} N:${el.neutrons} E:${el.electrons}</div>
          </div>
        </div>
      `;

      const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
      document.getElementById('sim-shell-info').innerHTML = `
        <div style="color:var(--text-muted);font-size:0.76rem;margin-bottom:4px;">Cấu hình & Phân bố lớp vỏ</div>
        <div class="mono" style="color:var(--accent-cyan);margin-bottom:6px;">${el.electronConfig}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${el.shells
            .map(
              (cnt, idx) =>
                `<span class="mono" style="padding:3px 7px;border-radius:6px;background:${
                  idx === el.shells.length - 1 ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.06)'
                };border:1px solid ${idx === el.shells.length - 1 ? '#FBBF24' : 'rgba(255,255,255,0.1)'};">${shellNames[idx]}:${cnt}</span>`
            )
            .join('')}
        </div>
        <div style="margin-top:8px;color:var(--text-secondary);">Electron hóa trị: <strong style="color:#FBBF24;">${valenceCount}</strong></div>
      `;
    },

    selectOrbitalFromBox(n, l, m) {
      this.state.qn = n;
      this.state.ql = l;
      this.state.qm = m;
      this.buildQuantumOrbital();
    },

    // --- QUANTUM ORBITAL VISUALIZER ---
    angularWave(l, m, theta, phi) {
      const am = Math.abs(m);
      const cosT = Math.cos(theta), sinT = Math.sin(theta);
      let val = 1;
      if (l === 0) val = 0.7;
      else if (l === 1) val = am === 0 ? cosT : sinT * (m > 0 ? Math.cos(phi) : Math.sin(phi));
      else if (l === 2) {
        if (am === 0) val = 3 * cosT * cosT - 1;
        else if (am === 1) val = sinT * cosT * (m > 0 ? Math.cos(phi) : Math.sin(phi));
        else val = sinT * sinT * (m > 0 ? Math.cos(2 * phi) : Math.sin(2 * phi));
      } else {
        if (am === 0) val = 5 * Math.pow(cosT, 3) - 3 * cosT;
        else if (am === 1) val = sinT * (5 * cosT * cosT - 1) * (m > 0 ? Math.cos(phi) : Math.sin(phi));
        else if (am === 2) val = sinT * sinT * cosT * (m > 0 ? Math.cos(2 * phi) : Math.sin(2 * phi));
        else val = Math.pow(sinT, 3) * (m > 0 ? Math.cos(3 * phi) : Math.sin(3 * phi));
      }
      return val;
    },

    buildQuantumOrbital() {
      if (!this.three) return;
      const { atomGroup, camera, controls } = this.three;
      while (atomGroup.children.length > 0) atomGroup.remove(atomGroup.children[0]);

      const { qn: n, ql: l, qm: m, qVizMode: viz, qScale: scale, qIntensity: intensity } = this.state;
      const subName = `${n}${SUBSHELL_LETTERS[l] || 'g'} (m=${m >= 0 ? '+' + m : m})`;

      // Reference Axes
      atomGroup.add(new THREE.AxesHelper(8 * scale));

      const count = viz === 'contours' ? 2200 : viz === 'volumetric' ? 4200 : 3200;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const maxR = (4.5 + n * 1.4) * scale;

      let placed = 0;
      let guard = 0;
      while (placed < count && guard < count * 18) {
        guard++;
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = Math.random() * Math.PI * 2;
        const ylm = this.angularWave(l, m, theta, phi);
        const prob = ylm * ylm;
        if (Math.random() > prob * 1.35 + 0.05) continue;

        const r = (viz === 'contours' ? 0.65 + Math.random() * 0.35 : Math.pow(Math.random(), 0.7)) * maxR * (0.45 + 0.65 * Math.abs(ylm));
        positions[placed * 3] = r * Math.sin(theta) * Math.cos(phi);
        positions[placed * 3 + 1] = r * Math.cos(theta);
        positions[placed * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);

        // Density heatmap color (purple/blue -> cyan -> green -> yellow -> red)
        const c = new THREE.Color();
        const hue = Math.max(0, Math.min(0.75, (1 - Math.min(1, prob)) * 0.72));
        c.setHSL(hue, 0.9, 0.55 * Math.min(1.2, intensity));
        colors[placed * 3] = c.r;
        colors[placed * 3 + 1] = c.g;
        colors[placed * 3 + 2] = c.b;
        placed++;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: viz === 'volumetric' ? 0.36 : viz === 'contours' ? 0.16 : 0.22,
        vertexColors: true,
        transparent: true,
        opacity: viz === 'volumetric' ? 0.52 : 0.85
      });
      atomGroup.add(new THREE.Points(geo, mat));

      camera.position.set(11, 8, 16);
      controls.target.set(0, 0, 0);
      controls.update();

      const energyEV = (-13.6 / (n * n)).toFixed(3);
      document.getElementById('sim-hud').innerHTML = `
        <div style="font-weight:700;color:var(--accent-cyan);">Orbital ${subName}</div>
        <div class="mono" style="font-size:0.78rem;color:var(--text-muted);">E<sub>${n}</sub> = ${energyEV} eV • |ψ|² Density</div>
      `;

      const notes = [
        'Dạng hình cầu đối xứng quanh hạt nhân.',
        'Dạng quả tạ đôi (3 định hướng pₓ, pᵧ, p_z).',
        'Gồm 5 định hướng phức tạp (kim loại chuyển tiếp).',
        'Gồm 7 định hướng (họ Lanthanide & Actinide).'
      ];
      document.getElementById('sim-q-inspector').innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <strong style="color:var(--accent-cyan);">Orbital ${n}${SUBSHELL_LETTERS[l] || 'g'} (n=${n}, l=${l}, m=${m})</strong>
          <strong class="mono" style="color:#34D399;">${energyEV} eV</strong>
        </div>
        <div style="color:var(--text-secondary);font-size:0.76rem;">💡 ${notes[Math.min(3, l)]}</div>
      `;

      const curEl = CV.getElement(this.state.elementId);
      const qBoxes = document.getElementById('sim-q-boxes');
      if (curEl && qBoxes) {
        qBoxes.innerHTML = `<div style="font-size:0.74rem;color:var(--accent-cyan);margin-bottom:6px;">Nguyên tố: ${curEl.symbol} – ${curEl.nameVi} (Z=${curEl.number})</div>` +
          CV.renderOrbitalBoxesHTML(curEl, { interactive: true, showSummary: true });
      }
    },

    bindEvents() {
      document.querySelectorAll('#sim-main-tabs button').forEach((btn) => {
        btn.addEventListener('click', () => this.switchMainTab(btn.getAttribute('data-tab')));
      });

      document.getElementById('sim-el-select').addEventListener('change', (e) => this.selectElement(e.target.value));
      document.getElementById('sim-prev-el').addEventListener('click', () => this.selectElement(this.state.elementId - 1));
      document.getElementById('sim-next-el').addEventListener('click', () => this.selectElement(this.state.elementId + 1));

      document.getElementById('sim-q-el-select').addEventListener('change', (e) => this.selectQuantumElement(e.target.value));
      document.getElementById('sim-q-prev-el').addEventListener('click', () => this.selectQuantumElement(this.state.elementId - 1));
      document.getElementById('sim-q-next-el').addEventListener('click', () => this.selectQuantumElement(this.state.elementId + 1));
      document.querySelectorAll('.sim-q-el-btn').forEach((btn) => {
        btn.addEventListener('click', () => this.selectQuantumElement(btn.getAttribute('data-z')));
      });

      const sat3d = document.getElementById('sim-sat-3d');
      const sat2d = document.getElementById('sim-sat-2d');
      sat3d.addEventListener('click', () => {
        this.state.satelliteFlat2D = false;
        sat3d.className = 'btn btn-sm btn-primary';
        sat2d.className = 'btn btn-sm btn-secondary';
        this.buildAtom(this.state.elementId);
      });
      sat2d.addEventListener('click', () => {
        this.state.satelliteFlat2D = true;
        sat2d.className = 'btn btn-sm btn-primary';
        sat3d.className = 'btn btn-sm btn-secondary';
        this.buildAtom(this.state.elementId);
      });

      const playBtn = document.getElementById('sim-play-btn');
      playBtn.addEventListener('click', () => {
        this.state.playing = !this.state.playing;
        playBtn.textContent = this.state.playing ? '⏸ Tạm dừng' : '▶ Tiếp tục';
      });
      document.getElementById('sim-speed-slider').addEventListener('input', (e) => {
        this.state.speed = Number(e.target.value);
        document.getElementById('sim-speed-val').textContent = `${this.state.speed.toFixed(2)}x`;
      });
      document.getElementById('sim-valence-chk').addEventListener('change', (e) => {
        this.state.valenceHighlight = e.target.checked;
        this.buildAtom(this.state.elementId);
      });

      document.querySelectorAll('#q-viz-ctrl button').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.state.qVizMode = btn.getAttribute('data-viz');
          document.querySelectorAll('#q-viz-ctrl button').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          this.buildQuantumOrbital();
        });
      });

      document.getElementById('q-autorot-chk').addEventListener('change', (e) => { this.state.qAutoRotate = e.target.checked; });
      document.getElementById('sim-q-reset').addEventListener('click', () => this.buildQuantumOrbital());
      document.getElementById('sim-q-shot').addEventListener('click', () => {
        if (!this.three) return;
        const url = this.three.renderer.domElement.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `chemverse-orbital-${this.state.qn}${SUBSHELL_LETTERS[this.state.ql]}.png`;
        a.click();
      });

      document.querySelectorAll('.sim-bond-preset').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.state.bondPair = btn.getAttribute('data-pair');
          document.querySelectorAll('.sim-bond-preset').forEach((b) => {
            b.className = b === btn ? 'btn btn-sm btn-primary sim-bond-preset' : 'btn btn-sm btn-secondary sim-bond-preset';
          });
        });
      });
    },

    startBondingCanvas() {
      const canvas = document.getElementById('sim-2d-canvas');
      const ctx = canvas.getContext('2d');
      let t = 0;

      const draw = () => {
        if (this.state.mainTab !== 'bonding' || CV.state.currentRoute !== 'simulator') return;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const w = canvas.width, h = canvas.height, cy = h / 2;
        ctx.clearRect(0, 0, w, h);
        t += 0.02 * this.state.speed;

        const pair = this.state.bondPair;
        const hud = document.getElementById('sim-hud');
        if (pair === 'Na+Cl') {
          hud.innerHTML = `<strong>Liên kết Ion: Na⁺ + Cl⁻ → NaCl</strong><div style="font-size:0.8rem;color:var(--text-muted);">Natri nhường 1 electron hóa trị sang lớp ngoài cùng của Clo</div>`;
          const x1 = w * 0.34, x2 = w * 0.66;
          this.draw2DAtomBase(ctx, x1, cy, 85, 'Na⁺', '#FF5E6C');
          this.draw2DAtomBase(ctx, x2, cy, 105, 'Cl⁻', '#00E5FF');
          const prog = (Math.sin(t * 1.4) + 1) / 2;
          const ex = x1 + 85 + prog * (x2 - 105 - (x1 + 85));
          const ey = cy - Math.sin(prog * Math.PI) * 42;
          ctx.beginPath();
          ctx.arc(ex, ey, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#FBBF24';
          ctx.fill();
        } else {
          const isWater = pair === 'H+O';
          hud.innerHTML = isWater
            ? `<strong>Liên kết Cộng hóa trị: H₂O</strong><div style="font-size:0.8rem;color:var(--text-muted);">Oxy dùng chung cặp electron với 2 nguyên tử Hydro</div>`
            : `<strong>Liên kết Cộng hóa trị: CH₄</strong><div style="font-size:0.8rem;color:var(--text-muted);">Cacbon dùng chung 4 cặp electron với 4 nguyên tử Hydro</div>`;
          const cx = w / 2;
          this.draw2DAtomBase(ctx, cx, cy, 92, isWater ? 'O' : 'C', '#3B82F6');
          const partners = isWater ? [[-130, 0], [130, 0]] : [[-135, 0], [135, 0], [0, -135], [0, 135]];
          partners.forEach(([dx, dy], idx) => {
            this.draw2DAtomBase(ctx, cx + dx, cy + dy, 52, 'H', '#00E5FF');
            const mx = cx + dx * 0.52, my = cy + dy * 0.52, ang = t * 2 + idx;
            for (let k = 0; k < 2; k++) {
              ctx.beginPath();
              ctx.arc(mx + Math.cos(ang + k * Math.PI) * 14, my + Math.sin(ang + k * Math.PI) * 14, 6, 0, Math.PI * 2);
              ctx.fillStyle = '#FBBF24';
              ctx.fill();
            }
          });
        }
        this.bondingAnimId = requestAnimationFrame(draw);
      };
      draw();
    },

    draw2DAtomBase(ctx, x, y, r, label, color) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = color + '88';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fillStyle = color + '44';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '700 18px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    }
  };
})();
