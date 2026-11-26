(function () {
  const CV = (window.CHEMVERSE = window.CHEMVERSE || {});

  CV.state = {
    currentRoute: 'home',
    lang: localStorage.getItem('chemverse_lang') || 'vi',
    simulatorElement: 6, // Carbon default
    compareIds: [26, 29, 79], // Fe, Cu, Au default
    viewsInitialized: {}
  };

  CV.t = function (vi, en) {
    return CV.state.lang === 'en' ? en : vi;
  };

  CV.elName = function (el) {
    return CV.state.lang === 'en' ? el.name : el.nameVi;
  };

  CV.catName = function (cat) {
    return CV.state.lang === 'en' ? cat.nameEn : cat.nameVi;
  };

  CV.routes = ['home', 'learning', 'universe', 'simulator', 'periodic-table', 'virtual-lab', 'research', 'tutor', 'chemquest', 'profile', 'about'];

  CV.getElement = function (num) {
    return CV.ELEMENTS.find((e) => e.number === Number(num));
  };

  CV.getCategory = function (catId) {
    return CV.CATEGORY_MAP[catId] || CV.CATEGORY_MAP['unknown'];
  };

  CV.phaseVi = function (phase) {
    if (CV.state.lang === 'en') return phase || 'Unknown';
    if (phase === 'Solid') return 'Rắn';
    if (phase === 'Liquid') return 'Lỏng';
    if (phase === 'Gas') return 'Khí';
    return 'Chưa rõ';
  };

  CV.phaseIcon = function (phase) {
    if (phase === 'Solid') return '🧊';
    if (phase === 'Liquid') return '💧';
    if (phase === 'Gas') return '💨';
    return '❓';
  };

  CV.formatTemp = function (kelvin, unit = 'K') {
    if (kelvin === null || kelvin === undefined) return 'Dự đoán / Chưa rõ';
    if (unit === 'C') return `${(kelvin - 273.15).toFixed(1)} °C`;
    if (unit === 'F') return `${(((kelvin - 273.15) * 9) / 5 + 32).toFixed(1)} °F`;
    return `${kelvin} K`;
  };

  CV.showToast = function (msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.25s ease';
      setTimeout(() => toast.remove(), 260);
    }, 2800);
  };

  CV.addToComparison = function (num) {
    const el = CV.getElement(num);
    if (!el) return;
    if (CV.state.compareIds.includes(el.number)) {
      CV.showToast(`${el.symbol} (${el.nameVi}) đã có trong danh sách so sánh.`);
      return;
    }
    if (CV.state.compareIds.length >= 3) {
      CV.state.compareIds.shift();
    }
    CV.state.compareIds.push(el.number);
    CV.showToast(`Đã thêm ${el.symbol} (${el.nameVi}) vào So sánh nguyên tố.`);
    if (CV.modules.comparison && CV.state.viewsInitialized.comparison) {
      CV.modules.comparison.refresh();
    }
  };

  CV.openInSimulator = function (num) {
    CV.state.simulatorElement = Number(num);
    CV.closeElementModal();
    CV.navigate('simulator');
    if (CV.modules.simulator && CV.state.viewsInitialized.simulator) {
      CV.modules.simulator.selectElement(Number(num));
    }
  };

  CV.groupRoman = function (group) {
    const map = {
      1: 'IA', 2: 'IIA', 3: 'IIIB', 4: 'IVB', 5: 'VB', 6: 'VIB', 7: 'VIIB',
      8: 'VIIIB', 9: 'VIIIB', 10: 'VIIIB', 11: 'IB', 12: 'IIB',
      13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA'
    };
    return group ? `${group} (${map[group] || ''})` : 'Họ f-block';
  };

  CV.commonValence = function (el) {
    if (el.number === 1) return '+1, -1';
    if (el.category === 'noble-gas') return '0';
    const g = el.group;
    if (g === 1) return '+1';
    if (g === 2) return '+2';
    if (g === 13) return '+3';
    if (g === 14) return '+4, +2, -4';
    if (g === 15) return '-3, +3, +5';
    if (g === 16) return '-2, +4, +6';
    if (g === 17) return g === 17 && el.number === 9 ? '-1' : '-1, +1, +5, +7';
    if (el.category === 'lanthanide' || el.category === 'actinide') return '+3';
    return '+2, +3';
  };

  // Aufbau + Pauli + Hund Orbital Box Generator (1s..7p)
  const AUFBAU_ORDER = [
    [1,0,'1s',1], [2,0,'2s',1], [2,1,'2p',3], [3,0,'3s',1], [3,1,'3p',3],
    [4,0,'4s',1], [3,2,'3d',5], [4,1,'4p',3], [5,0,'5s',1], [4,2,'4d',5],
    [5,1,'5p',3], [6,0,'6s',1], [4,3,'4f',7], [5,2,'5d',5], [6,1,'6p',3],
    [7,0,'7s',1], [5,3,'5f',7], [6,2,'6d',5], [7,1,'7p',3]
  ];

  CV.getOrbitalBoxes = function (el) {
    let rem = el.electrons;
    const counts = {};
    for (const [, , label, boxCnt] of AUFBAU_ORDER) {
      if (rem <= 0) break;
      const take = Math.min(rem, boxCnt * 2);
      counts[label] = take;
      rem -= take;
    }
    // Standard Aufbau exceptions (Cr, Cu, Mo, Ag, Pt, Au)
    if (el.number === 24) { counts['4s'] = 1; counts['3d'] = 5; }
    if (el.number === 29) { counts['4s'] = 1; counts['3d'] = 10; }
    if (el.number === 42) { counts['5s'] = 1; counts['4d'] = 5; }
    if (el.number === 47) { counts['5s'] = 1; counts['4d'] = 10; }
    if (el.number === 78) { counts['6s'] = 1; counts['5d'] = 9; }
    if (el.number === 79) { counts['6s'] = 1; counts['5d'] = 10; }

    const subshells = [];
    let unpairedCount = 0;
    for (const [n, l, label, boxCnt] of AUFBAU_ORDER) {
      const eCount = counts[label];
      if (!eCount) continue;
      const boxes = Array.from({ length: boxCnt }, (_, i) => ({ m: i - l, spins: [] }));
      // Hund's Rule: fill spin-up first, then pair spin-down
      for (let i = 0; i < Math.min(eCount, boxCnt); i++) boxes[i].spins.push('↑');
      for (let i = boxCnt; i < eCount; i++) boxes[i - boxCnt].spins.push('↓');
      boxes.forEach((b) => { if (b.spins.length === 1) unpairedCount++; });
      subshells.push({ n, l, label, boxes });
    }
    return { subshells, unpairedCount };
  };

  CV.renderOrbitalBoxesHTML = function (el, opts = {}) {
    const { subshells, unpairedCount } = CV.getOrbitalBoxes(el);
    const list = opts.outerOnly ? subshells.slice(-2) : subshells;
    return `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end;">
        ${list
          .map(
            (sub) => `
          <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
            <div style="display:flex;gap:2px;">
              ${sub.boxes
                .map((b) => {
                  const isUnpaired = b.spins.length === 1;
                  const clickAttr = opts.interactive
                    ? `onclick="CHEMVERSE.modules.simulator.selectOrbitalFromBox(${sub.n},${sub.l},${b.m})" title="Nhấn để xem Orbital ${sub.label} (m=${b.m})"`
                    : '';
                  return `<div ${clickAttr} class="mono" style="width:24px;height:24px;border-radius:5px;border:1px solid ${
                    isUnpaired ? '#FBBF24' : 'rgba(56,189,248,0.45)'
                  };background:${isUnpaired ? 'rgba(251,191,36,0.14)' : 'rgba(15,23,42,0.65)'};display:flex;align-items:center;justify-content:center;font-size:0.74rem;font-weight:700;cursor:${
                    opts.interactive ? 'pointer' : 'default'
                  };color:${isUnpaired ? '#FBBF24' : '#E2E8F0'};">${b.spins.join('') || '·'}</div>`;
                })
                .join('')}
            </div>
            <span class="mono" style="font-size:0.68rem;color:var(--text-muted);">${sub.label}</span>
          </div>`
          )
          .join('')}
      </div>
      ${opts.showSummary ? `<div style="font-size:0.76rem;color:var(--text-secondary);margin-top:6px;">Electron độc thân: <strong style="color:#FBBF24;">${unpairedCount}</strong></div>` : ''}
    `;
  };

  CV.openInUniverse = function (num) {
    CV.closeElementModal();
    CV.navigate('universe');
    setTimeout(() => {
      if (CV.modules.universe && CV.modules.universe.focusByNumber) {
        CV.modules.universe.focusByNumber(Number(num));
      }
    }, 120);
  };

  CV.toggleTheme = function () {
    const isLight = document.body.classList.toggle('light-glass');
    localStorage.setItem('chemverse_theme', isLight ? 'light' : 'dark');
    const icon = isLight ? '☀️' : '🌙';
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = icon;
    const ptBtn = document.getElementById('pt-theme-btn');
    if (ptBtn) ptBtn.textContent = isLight ? CV.t('🌙 Chế độ Vũ trụ (Tối)', '🌙 Dark Space Mode') : CV.t('☀️ Chế độ Sáng (Lớp học)', '☀️ Light Glass Mode');
    if (CV.modules['periodic-table'] && CV.state.viewsInitialized['periodic-table']) {
      CV.modules['periodic-table'].updateCells();
    }
  };

  CV.toggleLang = function () {
    CV.state.lang = CV.state.lang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('chemverse_lang', CV.state.lang);
    CV.applyLangUI();
    // Re-initialize current active view so all text & element names update immediately
    const cur = CV.state.currentRoute;
    CV.state.viewsInitialized = {};
    const targetView = document.getElementById('view-' + cur);
    if (targetView && CV.modules[cur] && CV.modules[cur].init) {
      CV.modules[cur].init(targetView);
      CV.state.viewsInitialized[cur] = true;
    }
    CV.showToast(CV.t('Đã chuyển sang Tiếng Việt', 'Switched to English'));
  };

  CV.NAV_LABELS = {
    home: { vi: 'Trang chủ', en: 'Home', shortVi: 'Trang chủ', shortEn: 'Home' },
    learning: { vi: 'Học tập', en: 'Learning', shortVi: 'Học tập', shortEn: 'Learn' },
    universe: { vi: 'Vũ trụ 3D', en: 'Universe 3D', shortVi: '3D', shortEn: '3D' },
    simulator: { vi: 'Mô phỏng', en: 'Atom Simulator', shortVi: 'Nguyên tử', shortEn: 'Atom' },
    'periodic-table': { vi: 'Bảng tuần hoàn', en: 'Periodic Table', shortVi: 'Bảng', shortEn: 'Table' },
    'virtual-lab': { vi: 'Phòng Lab', en: 'Virtual Lab', shortVi: 'Lab', shortEn: 'Lab' },
    chemquest: { vi: 'ChemQuiz', en: 'ChemQuiz', shortVi: 'Quiz', shortEn: 'Quiz' },
    profile: { vi: 'Hồ sơ', en: 'Profile', shortVi: 'Hồ sơ', shortEn: 'Profile' },
    about: { vi: 'Giới thiệu', en: 'About Project', shortVi: 'Giới thiệu', shortEn: 'About' }
  };

  CV.applyLangUI = function () {
    const isEn = CV.state.lang === 'en';
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) langBtn.textContent = isEn ? '🇬🇧 EN' : '🇻🇳 VI';
    const brandSub = document.querySelector('.brand-sub');
    if (brandSub) brandSub.textContent = isEn ? 'Universe of Elements' : 'Vũ Trụ Nguyên Tố';

    // Update Desktop Navbar labels
    document.querySelectorAll('#desktop-nav .nav-item').forEach((item) => {
      const r = item.getAttribute('data-route');
      const lbl = item.querySelector('.nav-label');
      if (lbl && CV.NAV_LABELS[r]) lbl.textContent = isEn ? CV.NAV_LABELS[r].en : CV.NAV_LABELS[r].vi;
    });

    // Update Mobile Drawer labels
    document.querySelectorAll('.mobile-nav-list .nav-item').forEach((item) => {
      const r = item.getAttribute('data-route');
      const iconSpan = item.querySelector('span');
      if (iconSpan && CV.NAV_LABELS[r]) {
        const iconHTML = iconSpan.outerHTML;
        item.innerHTML = `${iconHTML} ${isEn ? CV.NAV_LABELS[r].en : CV.NAV_LABELS[r].vi}`;
      }
    });

    // Update Mobile Bottom Bar labels
    document.querySelectorAll('.mobile-bottom-bar .bottom-nav-item').forEach((item) => {
      const r = item.getAttribute('data-route');
      const sm = item.querySelector('small');
      if (sm && CV.NAV_LABELS[r]) sm.textContent = isEn ? CV.NAV_LABELS[r].shortEn : CV.NAV_LABELS[r].shortVi;
    });
  };

  let pedestalAnimId = null;
  let pedestalRenderer = null;

  function initPedestalAtom(el, cat) {
    const wrap = document.getElementById('modal-pedestal-wrap');
    if (!wrap || typeof THREE === 'undefined') return;
    if (pedestalAnimId) cancelAnimationFrame(pedestalAnimId);
    if (pedestalRenderer) {
      pedestalRenderer.dispose();
      pedestalRenderer = null;
    }

    const w = wrap.clientWidth || 320;
    const h = wrap.clientHeight || 250;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 200);
    const shellCount = el.shells.length;
    const camDist = 8.5 + shellCount * 2.2;
    camera.position.set(0, camDist * 0.42, camDist);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.insertBefore(renderer.domElement, wrap.firstChild);
    pedestalRenderer = renderer;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;

    scene.add(new THREE.AmbientLight(0xe2e8f0, 0.9));
    const pLight = new THREE.PointLight(0x38bdf8, 2.0, 60);
    pLight.position.set(5, 8, 10);
    scene.add(pLight);

    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // Nucleus
    const totalNuc = Math.min(36, el.protons + el.neutrons);
    const pRatio = el.protons / (el.protons + el.neutrons || 1);
    const nucGeo = new THREE.SphereGeometry(0.24, 10, 10);
    const pMat = new THREE.MeshStandardMaterial({ color: 0xff5e6c, emissive: 0xff3b52, emissiveIntensity: 0.5 });
    const nMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    for (let i = 0; i < totalNuc; i++) {
      const m = new THREE.Mesh(nucGeo, i / totalNuc < pRatio ? pMat : nMat);
      const phi = Math.acos(1 - (2 * (i + 0.5)) / totalNuc);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = Math.cbrt(i / totalNuc) * 0.72;
      m.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      atomGroup.add(m);
    }

    const electrons = [];
    el.shells.forEach((cnt, sIdx) => {
      const radius = 1.8 + sIdx * 1.15;
      const isValence = sIdx === shellCount - 1;
      const shellGrp = new THREE.Group();
      shellGrp.rotation.x = ((sIdx % 3) - 1) * 0.4 + 0.25;
      shellGrp.rotation.z = (sIdx % 2 === 0 ? 1 : -1) * 0.3;

      const ringGeo = new THREE.TorusGeometry(radius, 0.025, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isValence ? 0xfbbf24 : 0x38bdf8,
        transparent: true,
        opacity: isValence ? 0.68 : 0.3
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      shellGrp.add(ring);

      const eGeo = new THREE.SphereGeometry(isValence ? 0.2 : 0.14, 10, 10);
      const eMat = new THREE.MeshBasicMaterial({ color: isValence ? 0xfbbf24 : 0x00e5ff });
      for (let i = 0; i < cnt; i++) {
        const angle = (i / cnt) * Math.PI * 2;
        const eMesh = new THREE.Mesh(eGeo, eMat);
        eMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        shellGrp.add(eMesh);
        electrons.push({ mesh: eMesh, radius, angle, speed: (1.8 - sIdx * 0.18) * (sIdx % 2 === 0 ? 1 : -1) });
      }
      atomGroup.add(shellGrp);
    });

    function animate() {
      pedestalAnimId = requestAnimationFrame(animate);
      for (const e of electrons) {
        e.angle += e.speed * 0.016;
        e.mesh.position.set(Math.cos(e.angle) * e.radius, 0, Math.sin(e.angle) * e.radius);
      }
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  CV.generateElementQRsvg = function (el) {
    const size = 21;
    const payload = `CHEMVERSE|Z=${el.number}|${el.symbol}|${el.nameVi}|M=${el.atomicMass}|${el.electronConfig}`;
    let seed = 2166136261;
    for (let i = 0; i < payload.length; i++) {
      seed ^= payload.charCodeAt(i);
      seed = Math.imul(seed, 16777619);
    }
    const isFinder = (r, c, fr, fc) => {
      const dr = r - fr, dc = c - fc;
      if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return null;
      if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
      if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true;
      return false;
    };
    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        let on = false;
        const f1 = isFinder(r, c, 0, 0);
        const f2 = isFinder(r, c, 0, size - 7);
        const f3 = isFinder(r, c, size - 7, 0);
        if (f1 !== null) on = f1;
        else if (f2 !== null) on = f2;
        else if (f3 !== null) on = f3;
        else if (r === 6 || c === 6) on = (r + c) % 2 === 0;
        else {
          const h = Math.imul(seed ^ (r * 31 + c * 17 + el.number * 7), 2654435761) >>> 0;
          on = (h & 1) === 1;
        }
        if (on) rects += `<rect x="${c + 2}" y="${r + 2}" width="1" height="1" fill="#0F172A"/>`;
      }
    }
    return `<svg id="modal-qr-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size + 4} ${size + 4}" width="112" height="112" style="background:#FFFFFF;border-radius:10px;padding:4px;flex-shrink:0;">${rects}</svg>`;
  };

  CV.downloadElementQR = function (symbol) {
    const svg = document.getElementById('modal-qr-svg');
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chemverse-qr-${symbol}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  CV.sendElementToLab = function (num) {
    const el = CV.getElement(num);
    if (!el) return;
    const map = {
      H: 'HCl', O: 'H2O2', N: 'HNO3', Cl: 'Cl2', I: 'KI', Mn: 'KMnO4',
      Li: 'Li', Na: 'Na', K: 'K', Mg: 'Mg', Ca: 'Ca', Ba: 'Ba',
      Al: 'Al', Zn: 'Zn', Fe: 'Fe', Pb: 'Pb', Cu: 'Cu', Ag: 'Ag',
      C: 'C', S: 'S', P: 'P', Si: 'Si'
    };
    const chemId = map[el.symbol] || (CV.CHEMICALS && CV.CHEMICALS.find((c) => c.id === el.symbol) ? el.symbol : 'Na');
    CV.state.pendingLabChem = { chemId, fromElement: el };
    CV.closeElementModal();
    CV.switchBranch('research');
  };

  CV.buildElementQuiz = function (el, idx = 0) {
    const cat = CV.getCategory(el.category);
    const others = CV.ELEMENTS.filter((x) => x.number !== el.number);
    const pickWrong = (fn) => {
      const vals = [];
      for (let i = 1; vals.length < 3 && i < 40; i++) {
        const candidate = fn(others[(el.number * 7 + i * 11) % others.length]);
        if (candidate && !vals.includes(candidate)) vals.push(candidate);
      }
      return vals;
    };
    const pool = [
      {
        q: `Cấu hình electron của nguyên tố ${el.nameVi} (${el.symbol}, Z=${el.number}) là gì?`,
        correct: el.electronConfig,
        wrongs: pickWrong((x) => x.electronConfig),
        exp: `${el.symbol} có Z = ${el.number} nên tổng số electron phân bố vào các phân lớp là ${el.electronConfig}.`
      },
      {
        q: `Nguyên tố ${el.nameVi} (${el.symbol}) nằm ở vị trí nào trong Bảng tuần hoàn?`,
        correct: `Chu kỳ ${el.period}, Nhóm ${CV.groupRoman(el.group)}`,
        wrongs: pickWrong((x) => (x.period !== el.period || x.group !== el.group) ? `Chu kỳ ${x.period}, Nhóm ${CV.groupRoman(x.group)}` : null),
        exp: `${el.symbol} có ${el.shells.length} lớp electron (Chu kỳ ${el.period}) và thuộc Nhóm ${CV.groupRoman(el.group)}.`
      },
      {
        q: `Nguyên tố nào có số hiệu nguyên tử Z = ${el.number} và thuộc nhóm "${CV.catName(cat)}"?`,
        correct: `${el.symbol} – ${el.nameVi}`,
        wrongs: pickWrong((x) => `${x.symbol} – ${x.nameVi}`),
        exp: `Z = ${el.number} là ${el.nameVi} (${el.symbol}), nguyên tử khối ${el.atomicMass} u.`
      }
    ];
    const item = pool[idx % pool.length];
    const opts = [item.correct, ...item.wrongs].sort(() => 0.5 - Math.random());
    return { ...item, opts };
  };

  CV.renderModalQuiz = function (num, qIdx = 0) {
    const el = CV.getElement(num);
    const box = document.getElementById('modal-quiz-area');
    if (!el || !box) return;
    const quiz = CV.buildElementQuiz(el, qIdx);
    box.innerHTML = `
      <div style="font-weight:700;margin-bottom:10px;color:var(--accent-cyan);">Câu ${qIdx + 1}: ${quiz.q}</div>
      <div style="display:flex;flex-direction:column;gap:8px;" id="modal-quiz-opts">
        ${quiz.opts.map((opt) => `<button class="btn btn-secondary btn-sm" style="justify-content:flex-start;text-align:left;padding:10px 12px;" data-opt="${opt.replace(/"/g, '&quot;')}">${opt}</button>`).join('')}
      </div>
      <div id="modal-quiz-fb" style="display:none;margin-top:10px;padding:10px 12px;border-radius:10px;font-size:0.82rem;"></div>
    `;
    box.querySelectorAll('#modal-quiz-opts button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = btn.getAttribute('data-opt');
        const isOk = chosen === quiz.correct;
        box.querySelectorAll('#modal-quiz-opts button').forEach((b) => {
          b.disabled = true;
          if (b.getAttribute('data-opt') === quiz.correct) b.className = 'btn btn-sm btn-primary';
        });
        if (isOk && CV.Player) CV.Player.recordEvent('quiz', `el-${el.number}-${qIdx}`, 15);
        const fb = document.getElementById('modal-quiz-fb');
        fb.style.display = 'block';
        fb.style.background = isOk ? 'rgba(16,185,129,0.16)' : 'rgba(239,68,68,0.16)';
        fb.style.border = `1px solid ${isOk ? '#10B981' : '#EF4444'}`;
        fb.innerHTML = `
          <div style="font-weight:700;margin-bottom:4px;">${isOk ? '✅ Chính xác! (+15 XP)' : '❌ Chưa đúng rồi!'}</div>
          <div style="color:var(--text-secondary);margin-bottom:8px;">${quiz.exp}</div>
          <button class="btn btn-sm btn-primary" onclick="CHEMVERSE.renderModalQuiz(${el.number}, ${qIdx + 1})">Câu tiếp theo →</button>
        `;
      });
    });
  };

  CV.openElementModal = function (num) {
    const el = CV.getElement(num);
    if (!el) return;
    if (CV.Player) CV.Player.recordEvent('element', el.number, 10);
    const cat = CV.getCategory(el.category);
    const backdrop = document.getElementById('element-modal-backdrop');
    const body = document.getElementById('element-modal-body');
    const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

    body.innerHTML = `
      <div class="el-modal-2col">
        <!-- Left Column: Summary Gradient Card + 3D Pedestal Atom + Inter-branch Action -->
        <div class="el-modal-left">
          <div class="el-summary-card" style="background:linear-gradient(145deg, ${cat.glow}, rgba(11, 16, 38, 0.88));border-color:${cat.color};">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="mono" style="font-size:1.15rem;font-weight:700;">Z = ${el.number}</span>
              <span class="mono" style="font-size:0.86rem;opacity:0.9;">${el.atomicMass} u</span>
            </div>
            <div style="text-align:center;margin:10px 0;">
              <div style="font-family:var(--font-display);font-size:3.3rem;font-weight:700;line-height:1;color:${cat.color};">${el.symbol}</div>
              <div style="font-size:1.2rem;font-weight:700;margin-top:4px;">${el.nameVi} / ${el.name}</div>
            </div>
            <div class="mono" style="text-align:center;font-size:0.86rem;padding:6px 10px;border-radius:8px;background:rgba(0,0,0,0.28);color:#00E5FF;">
              ${el.electronConfig}
            </div>
          </div>

          <div class="pedestal-atom-wrap" id="modal-pedestal-wrap" title="Kéo chuột để xoay mô hình nguyên tử 3D">
            <div class="pedestal-glow-ring"></div>
            <div style="position:absolute;bottom:8px;left:12px;font-size:0.72rem;color:var(--text-muted);pointer-events:none;">
              ⚛️ Kéo để xoay 3D • Lớp: [${el.shells.join(', ')}]
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;">
            <button class="btn btn-primary btn-sm" style="background:linear-gradient(135deg,#8B5CF6,#EC4899);" onclick="CHEMVERSE.sendElementToLab(${el.number})">🔬 Đưa vào Phòng Lab 3D →</button>
            <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.openInSimulator(${el.number})">⚛️ Mở Orbital 3D 360°</button>
            <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.openInUniverse(${el.number})">🌌 Xem trong Vũ trụ 3D</button>
          </div>
        </div>

        <!-- Right Column: 3 Core Learning Tabs -->
        <div class="el-modal-right">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <h2 id="modal-el-title" style="font-size:1.55rem;">${CV.elName(el)} (${CV.state.lang === 'en' ? el.nameVi : el.name})</h2>
              ${el.predicted ? `<span class="predicted-badge">⚠ ${CV.t('Giá trị dự đoán', 'Predicted Value')}</span>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:6px;">
              <span class="cat-badge" style="color:${cat.color};"><span class="cat-dot" style="background:${cat.color};"></span>${CV.catName(cat)}</span>
              <span class="mono" style="font-size:0.8rem;color:var(--text-muted);">P:${el.protons} • N:${el.neutrons} • E:${el.electrons}</span>
            </div>
          </div>

          <!-- 3 Core Tabs -->
          <div class="el-modal-tabs" id="modal-core-tabs">
            <button class="el-tab-btn active" data-mtab="info">📄 Thông tin & QR</button>
            <button class="el-tab-btn" data-mtab="electron">⚛️ 3D & Electron</button>
            <button class="el-tab-btn" data-mtab="quiz">🎯 Quiz củng cố</button>
          </div>

          <!-- Tab 1: Detailed Info & QR -->
          <div id="mtab-info" class="el-mtab-pane">
            <div class="el-specs-list glass-surface" style="margin-bottom:10px;">
              <div class="el-spec-row"><span>⚖️ Nguyên tử khối</span><strong class="mono">${el.atomicMass} u</strong></div>
              <div class="el-spec-row"><span>📍 Nhóm & Chu kỳ</span><strong class="mono">Nhóm ${CV.groupRoman(el.group)} • Chu kỳ ${el.period}</strong></div>
              <div class="el-spec-row"><span>🌀 Cấu hình electron</span><strong class="mono" style="color:var(--accent-cyan);">${el.electronConfig}</strong></div>
              <div class="el-spec-row"><span>🔗 Hóa trị / Oxi hóa</span><strong class="mono">${CV.commonValence(el)}</strong></div>
              <div class="el-spec-row"><span>⚡ Độ âm điện / Ion hóa I₁</span><strong class="mono">${el.electronegativity ?? '—'} • ${el.ionizationEnergy ?? '—'} kJ/mol</strong></div>
              <div class="el-spec-row"><span>🧊 Trạng thái / Nóng chảy / Sôi</span><strong class="mono">${CV.phaseIcon(el.phase)} ${CV.phaseVi(el.phase)} • ${CV.formatTemp(el.melt)} / ${CV.formatTemp(el.boil)}</strong></div>
              <div class="el-spec-row"><span>🏛️ Lịch sử phát hiện</span><strong>${el.discoveredBy || 'Cổ đại'} (${el.discoveryYear || '—'})</strong></div>
            </div>

            <div class="glass-surface" style="padding:12px;border-radius:12px;font-size:0.82rem;margin-bottom:10px;">
              <div style="font-weight:700;margin-bottom:4px;">🏭 Tính chất & Ứng dụng thực tiễn</div>
              <div style="color:var(--text-secondary);margin-bottom:6px;">${el.summary}</div>
              <ul style="padding-left:18px;color:var(--text-secondary);margin:0;">
                ${(el.applications || []).map((a) => `<li>${a}</li>`).join('')}
              </ul>
            </div>

            <div class="glass-surface" style="padding:12px;border-radius:12px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
              ${CV.generateElementQRsvg(el)}
              <div style="flex:1;min-width:170px;">
                <div style="font-weight:700;font-size:0.86rem;margin-bottom:4px;">📱 Mã QR Thẻ Nguyên Tố (${el.symbol})</div>
                <div style="font-size:0.76rem;color:var(--text-muted);margin-bottom:8px;">Quét nhanh hoặc tải thẻ QR để chia sẻ thông số ${el.nameVi} (Z=${el.number}) trong lớp học.</div>
                <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.downloadElementQR('${el.symbol}')">⬇️ Tải thẻ QR (.svg)</button>
              </div>
            </div>
          </div>

          <!-- Tab 2: 3D & Electron Distribution -->
          <div id="mtab-electron" class="el-mtab-pane" style="display:none;">
            <div class="glass-surface" style="padding:12px 14px;border-radius:12px;font-size:0.84rem;margin-bottom:10px;">
              <div style="font-weight:700;margin-bottom:8px;">🛰️ Phân bố Electron theo lớp (K, L, M, N...)</div>
              <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
                ${el.shells.map((cnt, idx) => `
                  <div class="glass-surface" style="padding:8px 12px;border-radius:10px;text-align:center;border:1px solid ${idx === el.shells.length - 1 ? '#FBBF24' : 'rgba(255,255,255,0.12)'};">
                    <div style="font-size:0.7rem;color:var(--text-muted);">Lớp ${shellNames[idx] || idx + 1}</div>
                    <strong class="mono" style="font-size:1.05rem;color:${idx === el.shells.length - 1 ? '#FBBF24' : 'var(--accent-cyan)'};">${cnt} e</strong>
                  </div>`).join('')}
              </div>
              <div style="font-size:0.78rem;color:var(--text-muted);">* Mô hình 3D bên trái hiển thị hạt nhân (${el.protons}p, ${el.neutrons}n) cùng các lớp vỏ electron chuyển động thời gian thực.</div>
            </div>

            <div class="glass-surface" style="padding:12px 14px;border-radius:12px;font-size:0.84rem;margin-bottom:10px;">
              <div style="font-weight:700;margin-bottom:8px;">📦 Sơ đồ Ô Lượng Tử (Orbital s, p, d, f)</div>
              ${CV.renderOrbitalBoxesHTML(el, { showSummary: true })}
            </div>

            <button class="btn btn-primary btn-sm" style="width:100%;" onclick="CHEMVERSE.openInSimulator(${el.number})">🌀 Mở Đám mây Xác suất Electron 3D (Xoay 360°) →</button>
          </div>

          <!-- Tab 3: Inline Element Quiz -->
          <div id="mtab-quiz" class="el-mtab-pane" style="display:none;">
            <div class="glass-surface" style="padding:14px;border-radius:12px;" id="modal-quiz-area"></div>
          </div>
        </div>
      </div>
    `;

    body.querySelectorAll('#modal-core-tabs .el-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-mtab');
        body.querySelectorAll('#modal-core-tabs .el-tab-btn').forEach((b) => b.classList.toggle('active', b === btn));
        body.querySelectorAll('.el-mtab-pane').forEach((p) => { p.style.display = p.id === `mtab-${target}` ? 'block' : 'none'; });
      });
    });
    CV.renderModalQuiz(el.number, 0);

    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    setTimeout(() => initPedestalAtom(el, cat), 30);
  };

  CV.closeElementModal = function () {
    if (pedestalAnimId) {
      cancelAnimationFrame(pedestalAnimId);
      pedestalAnimId = null;
    }
    const backdrop = document.getElementById('element-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
    }
  };

  CV.modules = {};

  CV.switchBranch = function (branch) {
    CV.state.activeBranch = branch;
    if (branch === 'research') {
      CV.navigate('virtual-lab');
    } else if (branch === 'learn') {
      CV.navigate('learning');
    } else {
      CV.navigate('home');
    }
  };

  CV.updateBranchSwitcher = function (route) {
    const isLearnSub = ['learning', 'periodic-table', 'universe', 'simulator', 'chemquest'].includes(route);
    CV.state.activeBranch = route === 'virtual-lab' ? 'research' : isLearnSub ? 'learn' : 'home';
    document.querySelectorAll('#desktop-nav [data-route="learning"]').forEach((el) => {
      el.classList.toggle('active', isLearnSub);
    });
  };

  CV.navigate = function (route) {
    if (!CV.routes.includes(route)) route = 'home';
    CV.state.currentRoute = route;
    if (window.location.hash !== '#' + route) {
      window.location.hash = '#' + route;
    }

    document.querySelectorAll('.spa-view').forEach((v) => v.classList.remove('active'));
    const targetView = document.getElementById('view-' + route);
    if (targetView) targetView.classList.add('active');

    document.querySelectorAll('[data-route]').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-route') === route);
    });
    CV.updateBranchSwitcher(route);

    if (!CV.state.viewsInitialized[route] && CV.modules[route] && CV.modules[route].init) {
      CV.modules[route].init(targetView);
      CV.state.viewsInitialized[route] = true;
    } else if (CV.modules[route] && CV.modules[route].onShow) {
      CV.modules[route].onShow();
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  function setupNavigation() {
    document.querySelectorAll('[data-route]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const r = link.getAttribute('data-route');
        CV.navigate(r);
        closeMobileDrawer();
      });
    });

    window.addEventListener('hashchange', () => {
      const hashRoute = window.location.hash.replace('#', '') || 'home';
      if (hashRoute !== CV.state.currentRoute) {
        CV.navigate(hashRoute);
      }
    });

    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
    const drawerClose = document.getElementById('mobile-drawer-close');

    function openMobileDrawer() {
      drawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
    function closeMobileDrawer() {
      drawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    if (menuBtn) menuBtn.addEventListener('click', openMobileDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeMobileDrawer);

    const modalBackdrop = document.getElementById('element-modal-backdrop');
    const modalClose = document.getElementById('element-modal-close');
    if (modalClose) modalClose.addEventListener('click', CV.closeElementModal);
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) CV.closeElementModal();
      });
    }

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (localStorage.getItem('chemverse_theme') === 'light') {
      document.body.classList.add('light-glass');
      if (themeBtn) themeBtn.textContent = '☀️';
    }
    if (themeBtn) {
      themeBtn.addEventListener('click', CV.toggleTheme);
    }

    const langBtn = document.getElementById('lang-toggle-btn');
    CV.applyLangUI();
    if (langBtn) {
      langBtn.addEventListener('click', CV.toggleLang);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    const initialRoute = window.location.hash.replace('#', '') || 'home';
    CV.navigate(initialRoute);
  });
})();
