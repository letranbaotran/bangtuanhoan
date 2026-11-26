(function () {
  const CV = window.CHEMVERSE;

  CV.modules.universe = {
    state: {
      layout: 'spiral', // 'spiral' | 'cluster'
      activeCategory: null,
      filterPeriod: 'all',
      searchQuery: '',
      selectedElement: null,
      hoveredPlanet: null
    },
    three: null,

    init(container) {
      container.innerHTML = `
        <div class="universe-shell">
          <div id="universe-canvas-wrap"></div>

          <!-- Top Floating Toolbar -->
          <div class="universe-toolbar glass-surface">
            <select id="uni-struct-select" class="select-field" style="min-width:220px;">
              <option value="galaxy">🌌 Thiên hà 118 nguyên tố</option>
              <option value="H2O">💧 Phân tử H₂O (Bent 104.5°)</option>
              <option value="CH4">🔥 Phân tử CH₄ (Tetrahedral 109.5°)</option>
              <option value="CO2">💨 Phân tử CO₂ (Linear 180°)</option>
              <option value="BF3">🔺 Phân tử BF₃ (Trigonal planar 120°)</option>
              <option value="NH3">🧪 Phân tử NH₃ (Trigonal pyramidal 107°)</option>
              <option value="NaCl">🧊 Mạng tinh thể NaCl (Lập phương)</option>
              <option value="bond-ion">⚡ Liên kết Ion (Na⁺ + Cl⁻)</option>
              <option value="bond-cov">🔗 Liên kết Cộng hóa trị (H₂O)</option>
            </select>
            <input type="text" id="uni-search" class="input-field" style="width:180px;flex:1;min-width:140px;" placeholder="🔍 Tìm nguyên tố (H, Sắt, Fe)..." />
            <select id="uni-period-filter" class="select-field">
              <option value="all">Chu kỳ: Tất cả (1–7)</option>
              ${[1, 2, 3, 4, 5, 6, 7].map((p) => `<option value="${p}">Chu kỳ ${p}</option>`).join('')}
            </select>
            <div style="display:flex;gap:6px;">
              <button class="btn btn-sm btn-primary" id="uni-layout-spiral">🌀 Thiên hà Chu kỳ</button>
              <button class="btn btn-sm btn-secondary" id="uni-layout-cluster">🫧 Cụm Nhóm (11)</button>
            </div>
            <button class="btn btn-sm btn-secondary" id="uni-reset-view">⟲ Reset View</button>
          </div>
          <div id="uni-struct-info" class="glass-surface" style="display:none;position:absolute;bottom:20px;left:20px;z-index:20;padding:14px 18px;border-radius:14px;max-width:420px;"></div>

          <!-- Collapsible 11-Category Legend -->
          <div class="universe-legend glass-surface" id="uni-legend">
            <div class="legend-header" id="uni-legend-toggle">
              <span>🎨 ${CV.t('Chú giải 11 Nhóm', '11 Element Categories')}</span>
              <span id="uni-legend-arrow">▾</span>
            </div>
            <div class="legend-list" id="uni-legend-list">
              ${CV.CATEGORIES.map(
                (c) => `
                <div class="legend-item" data-cat="${c.id}">
                  <span class="cat-dot" style="background:${c.color};box-shadow:0 0 8px ${c.color};"></span>
                  <span style="flex:1;">${CV.catName(c)}</span>
                </div>`
              ).join('')}
            </div>
          </div>

          <!-- Hover Tooltip -->
          <div class="universe-tooltip glass-surface" id="uni-tooltip"></div>

          <!-- Right Detail Panel -->
          <aside class="universe-detail-panel glass-surface" id="uni-detail-panel"></aside>
        </div>
      `;

      this.initThree();
      this.bindEvents();
    },

    onShow() {
      if (this.three && this.three.renderer) {
        this.handleResize();
      }
    },

    initThree() {
      const wrap = document.getElementById('universe-canvas-wrap');
      if (!wrap || typeof THREE === 'undefined') {
        wrap.innerHTML = '<div style="padding:100px 24px;text-align:center;">Không thể tải Three.js WebGL.</div>';
        return;
      }

      const width = wrap.clientWidth || window.innerWidth;
      const height = wrap.clientHeight || window.innerHeight - 68;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
      camera.position.set(0, 58, 92);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      wrap.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.minDistance = 8;
      controls.maxDistance = 210;

      // Lighting (limited point lights for performance)
      scene.add(new THREE.AmbientLight(0xdbeafe, 0.7));
      const coreLight = new THREE.PointLight(0x38bdf8, 2.2, 260);
      coreLight.position.set(0, 12, 0);
      scene.add(coreLight);
      const rimLight = new THREE.DirectionalLight(0xc084fc, 0.85);
      rimLight.position.set(40, 60, -40);
      scene.add(rimLight);

      // InstancedMesh Background Starfield (1,200 stars)
      const starCount = 1200;
      const starGeo = new THREE.SphereGeometry(0.16, 6, 6);
      const starMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
      const starsMesh = new THREE.InstancedMesh(starGeo, starMat, starCount);
      const dummy = new THREE.Object3D();
      for (let i = 0; i < starCount; i++) {
        const r = 110 + Math.random() * 190;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        dummy.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
        const s = 0.5 + Math.random() * 1.4;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        starsMesh.setMatrixAt(i, dummy.matrix);
      }
      scene.add(starsMesh);

      // Central Galaxy Core Glow
      const coreGeo = new THREE.SphereGeometry(2.2, 24, 24);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      scene.add(coreMesh);

      // 7 Period Orbital Rings
      const orbitRingsGroup = new THREE.Group();
      for (let p = 1; p <= 7; p++) {
        const radius = 8 + p * 7.5;
        const ringGeo = new THREE.RingGeometry(radius - 0.08, radius + 0.08, 96);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.16
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        orbitRingsGroup.add(ring);
      }
      scene.add(orbitRingsGroup);

      // Compute target positions for Spiral Galaxy & Cluster View
      const periodCounts = {};
      const periodIndices = {};
      CV.ELEMENTS.forEach((el) => {
        periodCounts[el.period] = (periodCounts[el.period] || 0) + 1;
        periodIndices[el.period] = 0;
      });

      const catCounts = {};
      const catIndices = {};
      CV.ELEMENTS.forEach((el) => {
        catCounts[el.category] = (catCounts[el.category] || 0) + 1;
        catIndices[el.category] = 0;
      });

      const planetGeo = new THREE.SphereGeometry(1.15, 24, 24);
      const planets = [];

      CV.ELEMENTS.forEach((el) => {
        const cat = CV.getCategory(el.category);
        const pCount = periodCounts[el.period];
        const pIdx = periodIndices[el.period]++;
        const radius = 8 + el.period * 7.5;
        const angle = (pIdx / pCount) * Math.PI * 2 + el.period * 0.45;
        const spiralPos = new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 2) * 1.4 + (el.period - 4) * 0.35,
          Math.sin(angle) * radius
        );

        // Cluster position
        const catIdx = CV.CATEGORIES.findIndex((c) => c.id === el.category);
        const cAngle = (catIdx / CV.CATEGORIES.length) * Math.PI * 2;
        const cCenter = new THREE.Vector3(Math.cos(cAngle) * 34, ((catIdx % 3) - 1) * 9, Math.sin(cAngle) * 34);
        const itemIdx = catIndices[el.category]++;
        const itemTotal = catCounts[el.category];
        const subAngle = itemIdx * 2.39996; // Golden angle
        const subR = 2.6 + Math.sqrt(itemIdx / itemTotal) * 7.5;
        const clusterPos = new THREE.Vector3(
          cCenter.x + Math.cos(subAngle) * subR,
          cCenter.y + ((itemIdx % 5) - 2) * 1.1,
          cCenter.z + Math.sin(subAngle) * subR
        );

        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cat.color),
          emissive: new THREE.Color(cat.color),
          emissiveIntensity: 0.35,
          roughness: 0.35,
          metalness: 0.25,
          transparent: true,
          opacity: 1
        });

        const mesh = new THREE.Mesh(planetGeo, mat);
        mesh.position.copy(spiralPos);
        mesh.userData = {
          element: el,
          spiralPos,
          clusterPos,
          targetPos: spiralPos.clone(),
          baseScale: 1
        };

        // Billboard Sprite Label
        const labelSprite = this.createLabelSprite(el.symbol, el.number, cat.color);
        labelSprite.position.set(0, 1.85, 0);
        mesh.add(labelSprite);
        mesh.userData.label = labelSprite;

        scene.add(mesh);
        planets.push(mesh);
      });

      this.three = {
        wrap,
        scene,
        camera,
        renderer,
        controls,
        planets,
        orbitRingsGroup,
        starsMesh,
        raycaster: new THREE.Raycaster(),
        pointer: new THREE.Vector2(),
        flyTarget: null,
        flyCamPos: null
      };

      this.handleResize = () => {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', this.handleResize);

      const animate = () => {
        requestAnimationFrame(animate);
        if (CV.state.currentRoute !== 'universe') return;

        // Smooth position interpolation & distance-based label scaling
        const camPos = camera.position;
        for (const p of planets) {
          p.position.lerp(p.userData.targetPos, 0.08);
          p.rotation.y += 0.005;

          const dist = camPos.distanceTo(p.position);
          const lbl = p.userData.label;
          if (lbl) {
            lbl.visible = dist < 135;
            const fade = Math.max(0.2, Math.min(1, 1 - (dist - 40) / 95));
            lbl.material.opacity = fade * (p.material.opacity > 0.5 ? 1 : 0.2);
          }
        }

        // Smooth camera fly-to
        if (this.three.flyTarget && this.three.flyCamPos) {
          controls.target.lerp(this.three.flyTarget, 0.08);
          camera.position.lerp(this.three.flyCamPos, 0.08);
          if (camera.position.distanceTo(this.three.flyCamPos) < 0.25) {
            this.three.flyTarget = null;
            this.three.flyCamPos = null;
          }
        }

        if (this.three.structureGroup && this.three.structureGroup.visible) {
          this.three.structureGroup.rotation.y += 0.006;
          if (this.three.bondElectron && this.three.bondMode === 'ion') {
            const p = (Math.sin(performance.now() * 0.0022) + 1) / 2;
            this.three.bondElectron.position.set(-5.5 + p * 11, Math.sin(p * Math.PI) * 2.4, 0);
          }
        }
        starsMesh.rotation.y += 0.00025;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    },

    showStructure3D(mode) {
      const t = this.three;
      if (!t) return;
      if (!t.structureGroup) {
        t.structureGroup = new THREE.Group();
        t.scene.add(t.structureGroup);
      }
      while (t.structureGroup.children.length > 0) t.structureGroup.remove(t.structureGroup.children[0]);
      t.bondElectron = null;
      t.bondMode = null;

      const info = document.getElementById('uni-struct-info');
      const isGalaxy = mode === 'galaxy';
      t.galaxyGroup.visible = isGalaxy;
      t.orbitRingsGroup.visible = isGalaxy && this.state.layout === 'spiral';
      t.structureGroup.visible = !isGalaxy;

      if (isGalaxy) {
        if (info) info.style.display = 'none';
        t.flyTarget = new THREE.Vector3(0, 0, 0);
        t.flyCamPos = new THREE.Vector3(0, 58, 92);
        return;
      }

      const addAtom = (x, y, z, r, hex) => {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(r, 24, 24),
          new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.25, roughness: 0.25, metalness: 0.2 })
        );
        m.position.set(x, y, z);
        t.structureGroup.add(m);
        return m;
      };
      const addBond = (p1, p2, rad = 0.22, hex = 0x94a3b8) => {
        const v1 = new THREE.Vector3(...p1), v2 = new THREE.Vector3(...p2);
        const dir = new THREE.Vector3().subVectors(v2, v1);
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(rad, rad, dir.length(), 14),
          new THREE.MeshStandardMaterial({ color: hex, roughness: 0.35 })
        );
        cyl.position.copy(v1).add(v2).multiplyScalar(0.5);
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        t.structureGroup.add(cyl);
      };

      const meta = {
        H2O: { name: '💧 H₂O', geom: 'Bent (Gấp khúc)', angle: '104.5°', len: '95.8 pm (O–H)', pol: 'Phân cực', desc: 'Oxy ở tâm gắn với 2 nguyên tử Hydro.' },
        CH4: { name: '🔥 CH₄', geom: 'Tetrahedral (Tứ diện)', angle: '109.5°', len: '108.7 pm (C–H)', pol: 'Không phân cực', desc: 'Cacbon ở tâm liên kết cộng hóa trị với 4 H.' },
        CO2: { name: '💨 CO₂', geom: 'Linear (Đường thẳng)', angle: '180°', len: '116.3 pm (C=O)', pol: 'Không phân cực', desc: '2 liên kết đôi O=C=O đối xứng.' },
        BF3: { name: '🔺 BF₃', geom: 'Trigonal planar (Tam giác phẳng)', angle: '120°', len: '131.3 pm (B–F)', pol: 'Không phân cực', desc: '3 liên kết B–F nằm trên một mặt phẳng.' },
        NH3: { name: '🧪 NH₃', geom: 'Trigonal pyramidal (Chóp tam giác)', angle: '107°', len: '101.7 pm (N–H)', pol: 'Phân cực', desc: 'Cặp e tự do trên N đẩy 3 liên kết N–H.' },
        NaCl: { name: '🧊 Tinh thể NaCl', geom: 'Lập phương tâm diện', angle: '90°', len: '282 pm (Na–Cl)', pol: 'Ion', desc: 'Các ion Na⁺ và Cl⁻ sắp xếp xen kẽ hút tĩnh điện.' },
        'bond-ion': { name: '⚡ Liên kết Ion (Na⁺Cl⁻)', geom: 'Chuyển electron', angle: '—', len: '236 pm', pol: 'Ion', desc: 'Na nhường 1 electron lớp ngoài cùng cho Cl.' },
        'bond-cov': { name: '🔗 Cộng hóa trị (H₂O)', geom: 'Dùng chung e', angle: '104.5°', len: '95.8 pm', pol: 'Phân cực', desc: 'O và H góp chung cặp electron (hạt vàng).' }
      };

      if (mode === 'H2O') {
        addAtom(0, 0.8, 0, 1.8, 0xef4444);
        const rad = (104.5 / 2) * (Math.PI / 180), d = 4.2;
        const h1 = [-Math.sin(rad) * d, 0.8 - Math.cos(rad) * d, 0], h2 = [Math.sin(rad) * d, 0.8 - Math.cos(rad) * d, 0];
        addAtom(...h1, 1.05, 0xf8fafc); addAtom(...h2, 1.05, 0xf8fafc);
        addBond([0, 0.8, 0], h1); addBond([0, 0.8, 0], h2);
      } else if (mode === 'CH4') {
        addAtom(0, 0, 0, 1.7, 0x475569);
        [[0, 4.2, 0], [3.9, -1.4, 0], [-2.0, -1.4, 3.4], [-2.0, -1.4, -3.4]].forEach((p) => { addAtom(...p, 1.0, 0xf8fafc); addBond([0, 0, 0], p); });
      } else if (mode === 'CO2') {
        addAtom(0, 0, 0, 1.65, 0x475569);
        addAtom(-4.6, 0, 0, 1.45, 0xef4444); addAtom(4.6, 0, 0, 1.45, 0xef4444);
        addBond([-4.6, 0.35, 0], [4.6, 0.35, 0], 0.16); addBond([-4.6, -0.35, 0], [4.6, -0.35, 0], 0.16);
      } else if (mode === 'BF3') {
        addAtom(0, 0, 0, 1.5, 0xf472b6);
        for (let k = 0; k < 3; k++) {
          const ang = (k * 2 * Math.PI) / 3;
          const p = [Math.cos(ang) * 4.4, Math.sin(ang) * 4.4, 0];
          addAtom(...p, 1.3, 0x34d399); addBond([0, 0, 0], p);
        }
      } else if (mode === 'NH3') {
        addAtom(0, 1.2, 0, 1.65, 0x3b82f6);
        for (let k = 0; k < 3; k++) {
          const ang = (k * 2 * Math.PI) / 3;
          const p = [Math.cos(ang) * 3.8, -1.2, Math.sin(ang) * 3.8];
          addAtom(...p, 1.0, 0xf8fafc); addBond([0, 1.2, 0], p);
        }
      } else if (mode === 'NaCl') {
        const sp = 3.2;
        for (let ix = -1; ix <= 1; ix++) for (let iy = -1; iy <= 1; iy++) for (let iz = -1; iz <= 1; iz++) {
          const isNa = (ix + iy + iz + 6) % 2 === 0;
          addAtom(ix * sp, iy * sp, iz * sp, isNa ? 0.72 : 1.08, isNa ? 0xa855f7 : 0x22c55e);
        }
      } else if (mode === 'bond-ion') {
        addAtom(-5.5, 0, 0, 1.8, 0xa855f7); addAtom(5.5, 0, 0, 2.2, 0x22c55e);
        t.bondElectron = addAtom(-5.5, 0, 0, 0.48, 0xfbbf24); t.bondMode = 'ion';
      } else if (mode === 'bond-cov') {
        addAtom(0, 0, 0, 1.8, 0x3b82f6); addAtom(-4.8, 0, 0, 1.1, 0x00e5ff); addAtom(4.8, 0, 0, 1.1, 0x00e5ff);
        addAtom(-2.4, 0.4, 0, 0.38, 0xfbbf24); addAtom(-2.4, -0.4, 0, 0.38, 0xfbbf24);
        addAtom(2.4, 0.4, 0, 0.38, 0xfbbf24); addAtom(2.4, -0.4, 0, 0.38, 0xfbbf24);
      }

      const m = meta[mode];
      if (info && m) {
        const cmpKey = mode === 'H2O' ? 'CO2' : 'H2O';
        const c = meta[cmpKey];
        info.style.display = 'block';
        info.innerHTML = `
          <strong style="color:var(--accent-cyan);font-size:0.96rem;">${m.name} • ${m.geom}</strong>
          <div class="mono" style="font-size:0.78rem;margin-top:4px;">Góc: ${m.angle} • Độ dài: ${m.len} • ${m.pol}</div>
          <p style="font-size:0.8rem;color:var(--text-secondary);margin:6px 0;">${m.desc}</p>
          <div style="border-top:1px solid rgba(255,255,255,0.12);padding-top:6px;font-size:0.74rem;color:var(--text-muted);">
            <strong>⚖️ Đối chiếu với ${c.name}:</strong> ${c.geom} (${c.angle}, ${c.len}, ${c.pol})
          </div>`;
      }
      t.flyTarget = new THREE.Vector3(0, 0, 0);
      t.flyCamPos = new THREE.Vector3(0, 5, 18);
    },

    createLabelSprite(symbol, number, color) {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(5, 8, 20, 0.72)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(12, 8, 136, 44, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '700 24px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${symbol} • ${number}`, 80, 31);

      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(3.4, 1.36, 1);
      return sprite;
    },

    bindEvents() {
      const t = this.three;
      if (!t) return;
      const dom = t.renderer.domElement;
      const tooltip = document.getElementById('uni-tooltip');

      let downPos = { x: 0, y: 0 };
      dom.addEventListener('pointerdown', (e) => {
        downPos = { x: e.clientX, y: e.clientY };
        t.flyTarget = null;
        t.flyCamPos = null;
      });

      dom.addEventListener('pointermove', (e) => {
        const rect = dom.getBoundingClientRect();
        t.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        t.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        t.raycaster.setFromCamera(t.pointer, t.camera);
        const hits = t.raycaster.intersectObjects(t.planets, false);

        if (this.state.hoveredPlanet && (!hits.length || hits[0].object !== this.state.hoveredPlanet)) {
          this.state.hoveredPlanet.scale.set(1, 1, 1);
          this.state.hoveredPlanet = null;
        }

        if (hits.length > 0) {
          const obj = hits[0].object;
          this.state.hoveredPlanet = obj;
          obj.scale.set(1.28, 1.28, 1.28);
          const el = obj.userData.element;
          tooltip.style.display = 'block';
          tooltip.style.left = e.clientX + 14 + 'px';
          tooltip.style.top = e.clientY + 14 + 'px';
          tooltip.innerHTML = `<strong>${el.symbol}</strong> – ${el.nameVi} (${el.name}) <span class="mono" style="color:var(--accent-cyan);">Z=${el.number}</span>`;
          dom.style.cursor = 'pointer';
        } else {
          tooltip.style.display = 'none';
          dom.style.cursor = 'grab';
        }
      });

      dom.addEventListener('pointerup', (e) => {
        const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
        if (dist > 6) return; // Dragged, not clicked

        const rect = dom.getBoundingClientRect();
        t.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        t.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        t.raycaster.setFromCamera(t.pointer, t.camera);
        const hits = t.raycaster.intersectObjects(t.planets, false);
        if (hits.length > 0) {
          this.focusPlanet(hits[0].object);
        }
      });

      // Layout toggle
      const btnSpiral = document.getElementById('uni-layout-spiral');
      const btnCluster = document.getElementById('uni-layout-cluster');
      btnSpiral.addEventListener('click', () => {
        this.state.layout = 'spiral';
        btnSpiral.className = 'btn btn-sm btn-primary';
        btnCluster.className = 'btn btn-sm btn-secondary';
        t.orbitRingsGroup.visible = true;
        t.planets.forEach((p) => p.userData.targetPos.copy(p.userData.spiralPos));
      });
      btnCluster.addEventListener('click', () => {
        this.state.layout = 'cluster';
        btnCluster.className = 'btn btn-sm btn-primary';
        btnSpiral.className = 'btn btn-sm btn-secondary';
        t.orbitRingsGroup.visible = false;
        t.planets.forEach((p) => p.userData.targetPos.copy(p.userData.clusterPos));
      });

      const structSel = document.getElementById('uni-struct-select');
      if (structSel) {
        structSel.addEventListener('change', (e) => this.showStructure3D(e.target.value));
      }

      // Reset View
      document.getElementById('uni-reset-view').addEventListener('click', () => {
        t.flyTarget = new THREE.Vector3(0, 0, 0);
        t.flyCamPos = new THREE.Vector3(0, 58, 92);
        this.closeDetailPanel();
      });

      // Search & Period Filter
      document.getElementById('uni-search').addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value.trim().toLowerCase();
        this.applyFilters();
      });

      document.getElementById('uni-search').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && this.state.searchQuery) {
          const match = t.planets.find((p) => {
            const el = p.userData.element;
            return (
              el.symbol.toLowerCase() === this.state.searchQuery ||
              el.name.toLowerCase().includes(this.state.searchQuery) ||
              el.nameVi.toLowerCase().includes(this.state.searchQuery) ||
              String(el.number) === this.state.searchQuery
            );
          });
          if (match) this.focusPlanet(match);
        }
      });

      document.getElementById('uni-period-filter').addEventListener('change', (e) => {
        this.state.filterPeriod = e.target.value;
        this.applyFilters();
      });

      // Legend toggle & category highlight
      document.getElementById('uni-legend-toggle').addEventListener('click', () => {
        const leg = document.getElementById('uni-legend');
        leg.classList.toggle('collapsed');
        document.getElementById('uni-legend-arrow').textContent = leg.classList.contains('collapsed') ? '▸' : '▾';
      });

      document.querySelectorAll('#uni-legend-list .legend-item').forEach((item) => {
        item.addEventListener('click', () => {
          const catId = item.getAttribute('data-cat');
          if (this.state.activeCategory === catId) {
            this.state.activeCategory = null;
            item.classList.remove('active');
          } else {
            this.state.activeCategory = catId;
            document.querySelectorAll('#uni-legend-list .legend-item').forEach((i) => i.classList.remove('active'));
            item.classList.add('active');
          }
          this.applyFilters();
        });
      });
    },

    applyFilters() {
      const t = this.three;
      const { activeCategory, filterPeriod, searchQuery } = this.state;
      t.planets.forEach((p) => {
        const el = p.userData.element;
        let match = true;
        if (activeCategory && el.category !== activeCategory) match = false;
        if (filterPeriod !== 'all' && String(el.period) !== filterPeriod) match = false;
        if (searchQuery) {
          const q = searchQuery;
          const sMatch =
            el.name.toLowerCase().includes(q) ||
            el.nameVi.toLowerCase().includes(q) ||
            el.symbol.toLowerCase().includes(q) ||
            String(el.number) === q;
          if (!sMatch) match = false;
        }
        p.material.opacity = match ? 1 : 0.15;
        p.material.emissiveIntensity = match ? (activeCategory || searchQuery ? 0.75 : 0.35) : 0.05;
      });
    },

    focusByNumber(num) {
      if (!this.three) return;
      const match = this.three.planets.find((p) => p.userData.element.number === Number(num));
      if (match) this.focusPlanet(match);
    },

    focusPlanet(planetMesh) {
      const t = this.three;
      const el = planetMesh.userData.element;
      const pos = planetMesh.userData.targetPos.clone();

      // Offset target slightly to the right so planet sits cleanly to the left of the right Detail Panel
      t.flyTarget = pos.clone().add(new THREE.Vector3(2.5, 0, 0));
      t.flyCamPos = pos.clone().add(new THREE.Vector3(4.5, 4.5, 11.5));

      this.openDetailPanel(el);
    },

    openDetailPanel(el) {
      const panel = document.getElementById('uni-detail-panel');
      const cat = CV.getCategory(el.category);
      panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:54px;height:54px;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${cat.glow};border:1.5px solid ${cat.color};">
              <span class="mono" style="font-size:0.68rem;">${el.number}</span>
              <strong style="font-size:1.45rem;line-height:1;">${el.symbol}</strong>
            </div>
            <div>
              <h3 style="font-size:1.25rem;">${el.nameVi}</h3>
              <div style="font-size:0.84rem;color:var(--text-muted);">${el.name} • <span class="mono">${el.atomicMass} u</span></div>
            </div>
          </div>
          <button class="icon-btn" onclick="CHEMVERSE.modules.universe.closeDetailPanel()" aria-label="Đóng">✕</button>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
          <span class="cat-badge" style="color:${cat.color};"><span class="cat-dot" style="background:${cat.color};"></span>${cat.nameVi}</span>
          <span class="mono" style="font-size:0.78rem;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,0.06);">CK ${el.period} • ${el.group ? 'Nhóm ' + el.group : 'f-block'}</span>
          ${el.predicted ? `<span class="predicted-badge">Giá trị dự đoán</span>` : ''}
        </div>

        <div class="glass-surface" style="padding:12px;border-radius:12px;margin-bottom:12px;">
          <div style="font-size:0.74rem;color:var(--text-muted);">Cấu hình Electron</div>
          <div class="mono" style="color:var(--accent-cyan);font-size:0.9rem;margin:4px 0;">${el.electronConfig}</div>
          <div class="mono" style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:8px;">Lớp: [${el.shells.join(', ')}] • P:${el.protons} N:${el.neutrons} E:${el.electrons}</div>
          ${CV.renderOrbitalBoxesHTML(el, { outerOnly: true, showSummary: true })}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;font-size:0.82rem;">
          <div class="glass-surface" style="padding:10px;border-radius:10px;">
            <div style="color:var(--text-muted);font-size:0.72rem;">Trạng thái (298 K)</div>
            <strong>${CV.phaseIcon(el.phase)} ${CV.phaseVi(el.phase)}</strong>
          </div>
          <div class="glass-surface" style="padding:10px;border-radius:10px;">
            <div style="color:var(--text-muted);font-size:0.72rem;">Độ âm điện</div>
            <strong class="mono">${el.electronegativity ?? '—'}</strong>
          </div>
          <div class="glass-surface" style="padding:10px;border-radius:10px;">
            <div style="color:var(--text-muted);font-size:0.72rem;">Nóng chảy</div>
            <strong class="mono">${CV.formatTemp(el.melt)}</strong>
          </div>
          <div class="glass-surface" style="padding:10px;border-radius:10px;">
            <div style="color:var(--text-muted);font-size:0.72rem;">Điểm sôi</div>
            <strong class="mono">${CV.formatTemp(el.boil)}</strong>
          </div>
        </div>

        <p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:10px;">${el.summary}</p>
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px;">
          <strong>Ứng dụng tiêu biểu:</strong>
          <ul style="padding-left:16px;margin-top:4px;color:var(--text-secondary);">
            ${el.applications.slice(0, 3).map((a) => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="CHEMVERSE.openInSimulator(${el.number})">⚛️ Mô phỏng nguyên tử</button>
        </div>
      `;
      panel.classList.add('open');
    },

    closeDetailPanel() {
      const panel = document.getElementById('uni-detail-panel');
      if (panel) panel.classList.remove('open');
    }
  };
})();
