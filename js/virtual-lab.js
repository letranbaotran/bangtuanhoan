(function () {
  const CV = window.CHEMVERSE;

  const REAGENTS = {
    apparatus: [
      { id: 'test-tube', name: 'Ống nghiệm', icon: '🧪', type: 'vessel', desc: 'Dung tích nhỏ, thử phản ứng nhanh' },
      { id: 'beaker', name: 'Cốc thủy tinh', icon: '🥛', type: 'vessel', desc: 'Beaker 250 ml, dễ quan sát kết tủa' },
      { id: 'erlenmeyer', name: 'Bình tam giác', icon: '⚗️', type: 'vessel', desc: 'Erlenmeyer cổ hẹp, khuấy an toàn' },
      { id: 'burner', name: 'Đèn đốt Bunsen', icon: '🔥', type: 'tool', desc: 'Gia nhiệt & thử màu ngọn lửa' },
      { id: 'thermometer', name: 'Nhiệt kế', icon: '🌡️', type: 'tool', desc: 'Theo dõi nhiệt độ phản ứng' },
      { id: 'litmus-tool', name: 'Đo pH / Quỳ tím', icon: '📊', type: 'tool', desc: 'Kiểm tra môi trường axit – bazơ' }
    ],
    metals: [
      { id: 'Na', name: 'Natri', formula: 'Na (s)', color: '#CBD5E1', warn: '⚡ Phản ứng mạnh', z: 11, flame: '#FFC312' },
      { id: 'K', name: 'Kali', formula: 'K (s)', color: '#E2E8F0', warn: '🔥 Dễ cháy', z: 19, flame: '#C084FC' },
      { id: 'Li', name: 'Liti', formula: 'Li (s)', color: '#94A3B8', warn: '🔥 Dễ cháy', z: 3, flame: '#FF2E63' },
      { id: 'Ca', name: 'Canxi', formula: 'Ca (s)', color: '#9CA3AF', warn: '⚡ Phản ứng vừa', z: 20, flame: '#FB923C' },
      { id: 'Ba', name: 'Bari', formula: 'Ba (s)', color: '#94A3B8', warn: '☠️ Độc hại', z: 56, flame: '#A3E635' },
      { id: 'Mg', name: 'Magie', formula: 'Mg (s)', color: '#E2E8F0', warn: '🔥 Cháy sáng', z: 12, flame: '#F8FAFC' },
      { id: 'Zn', name: 'Kẽm', formula: 'Zn (s)', color: '#94A3B8', warn: '✓ An toàn', z: 30 },
      { id: 'Fe', name: 'Sắt (Đinh sắt)', formula: 'Fe (s)', color: '#64748B', warn: '✓ An toàn', z: 26 },
      { id: 'Cu', name: 'Đồng', formula: 'Cu (s)', color: '#EA580C', warn: '✓ An toàn', z: 29, flame: '#10B981' },
      { id: 'Ag', name: 'Bạc', formula: 'Ag (s)', color: '#F1F5F9', warn: '✓ An toàn', z: 47 },
      { id: 'S', name: 'Lưu huỳnh', formula: 'S (s)', color: '#FACC15', warn: '🔥 Dễ cháy', z: 16, flame: '#3B82F6' }
    ],
    solutions: [
      { id: 'H2O', name: 'Nước cất', formula: 'H₂O (l)', color: 'rgba(125, 211, 252, 0.35)', warn: '✓ Trung tính', ph: 7 },
      { id: 'HCl', name: 'Axit Clohidric', formula: 'HCl (aq)', color: 'rgba(186, 230, 253, 0.38)', warn: '⚠️ Ăn mòn', ph: 1 },
      { id: 'H2SO4', name: 'Axit Sunfuric', formula: 'H₂SO₄ (aq)', color: 'rgba(186, 230, 253, 0.4)', warn: '⚠️ Ăn mòn mạnh', ph: 1 },
      { id: 'HNO3', name: 'Axit Nitric đặc', formula: 'HNO₃ (aq)', color: 'rgba(254, 240, 138, 0.35)', warn: '⚠️ Oxi hóa mạnh', ph: 0.8 },
      { id: 'NaCl', name: 'Natri Clorua', formula: 'NaCl (aq)', color: 'rgba(226, 232, 240, 0.32)', warn: '✓ An toàn', ph: 7 },
      { id: 'NaOH', name: 'Natri Hidroxit', formula: 'NaOH (aq)', color: 'rgba(203, 213, 225, 0.35)', warn: '⚠️ Kiềm ăn mòn', ph: 13 },
      { id: 'Ca(OH)2', name: 'Nước vôi trong', formula: 'Ca(OH)₂ (aq)', color: 'rgba(226, 232, 240, 0.35)', warn: '⚠️ Kiềm nhẹ', ph: 12 },
      { id: 'CuSO4', name: 'Đồng(II) Sunfat', formula: 'CuSO₄ (aq)', color: 'rgba(14, 165, 233, 0.68)', warn: '⚠️ Kích ứng', ph: 5 },
      { id: 'AgNO3', name: 'Bạc Nitrat', formula: 'AgNO₃ (aq)', color: 'rgba(226, 232, 240, 0.32)', warn: '⚠️ Oxy hóa', ph: 6 },
      { id: 'BaCl2', name: 'Bari Clorua', formula: 'BaCl₂ (aq)', color: 'rgba(226, 232, 240, 0.32)', warn: '☠️ Độc hại', ph: 7 },
      { id: 'FeCl3', name: 'Sắt(III) Clorua', formula: 'FeCl₃ (aq)', color: 'rgba(217, 119, 6, 0.65)', warn: '⚠️ Ăn mòn nhẹ', ph: 3 }
    ],
    indicators: [
      { id: 'Phenolphtalein', name: 'Phenolphtalein', formula: 'C₂₀H₁₄O₄', color: 'rgba(248, 250, 252, 0.5)', warn: '💧 Chỉ thị màu' },
      { id: 'Quỳ tím', name: 'Dung dịch Quỳ tím', formula: 'Litmus', color: 'rgba(168, 85, 247, 0.65)', warn: '💧 Chỉ thị pH' },
      { id: 'CO2', name: 'Sục khí CO₂', formula: 'CO₂ (g)', color: 'rgba(226, 232, 240, 0.4)', warn: '💨 Khí' },
      { id: 'O2', name: 'Khí Oxy', formula: 'O₂ (g)', color: 'rgba(56, 189, 248, 0.45)', warn: '🔥 Duy trì cháy' }
    ]
  };

  const PRESETS = [
    { id: 'na-h2o', label: '⚡ Na + H₂O', items: ['H2O', 'Na'], burner: false },
    { id: 'flame-cu', label: '🔥 Ngọn lửa Cu', items: ['Cu'], burner: true },
    { id: 'flame-na', label: '🌟 Ngọn lửa Na', items: ['Na'], burner: true },
    { id: 'zn-hcl', label: '🫧 Zn + HCl', items: ['HCl', 'Zn'], burner: false },
    { id: 'fe-cuso4', label: '🧲 Fe + CuSO₄', items: ['CuSO4', 'Fe'], burner: false },
    { id: 'agno3-hcl', label: '❄️ AgNO₃ + NaCl', items: ['AgNO3', 'NaCl'], burner: false },
    { id: 'cu-hno3', label: '🟤 Cu + HNO₃ đặc', items: ['Cu', 'HNO3'], burner: false },
    { id: 'bacl2-h2so4', label: '🧪 BaCl₂ + H₂SO₄', items: ['BaCl2', 'H2SO4'], burner: false },
    { id: 'cuso4-naoh', label: '💙 CuSO₄ + NaOH', items: ['CuSO4', 'NaOH'], burner: false },
    { id: 'fecl3-naoh', label: '🧡 FeCl₃ + NaOH', items: ['FeCl3', 'NaOH'], burner: false },
    { id: 'naoh-phen', label: '💖 NaOH + Phenolphtalein', items: ['NaOH', 'Phenolphtalein'], burner: false }
  ];

  CV.modules['virtual-lab'] = {
    state: {
      activeTab: 'solutions',
      vessel: 'beaker',
      contents: [], // list of reagent IDs
      amountUnit: '10 ml',
      burnerOn: false,
      tempC: 25,
      stirring: false,
      reaction: null,
      logs: []
    },
    animId: null,
    bubbles: [],
    precipitateParticles: [],

    init(container) {
      this.container = container;
      container.innerHTML = `
        <div class="page-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">${CV.t('Virtual Lab – Phòng Thí Nghiệm Hóa Học Ảo', 'Virtual Lab – Interactive Chemistry Workbench')}</h2>
              <p class="section-subtitle">${CV.t('Pha trộn hóa chất an toàn, thử màu ngọn lửa quang phổ và phân tích phương trình phản ứng cân bằng', 'Mix reagents safely, run spectral flame tests, and inspect balanced chemical equations')}</p>
            </div>
          </div>

          <div class="lab-workbench">
            <!-- LEFT: Shelf & Presets -->
            <aside class="lab-shelf glass-surface">
              <div class="control-label">Kệ Dụng Cụ & Hóa Chất</div>
              <div class="lab-tabs" id="lab-tabs">
                <button class="lab-tab-btn" data-tab="apparatus">Dụng cụ</button>
                <button class="lab-tab-btn" data-tab="metals">Kim loại</button>
                <button class="lab-tab-btn active" data-tab="solutions">Dung dịch</button>
                <button class="lab-tab-btn" data-tab="indicators">Chỉ thị</button>
              </div>
              <div id="lab-shelf-items" class="lab-item-grid"></div>

              <div style="border-top:1px solid var(--glass-border);padding-top:10px;margin-top:4px;">
                <div class="control-label" style="margin-bottom:8px;">📚 Thí nghiệm mẫu (Nhấn chạy thử)</div>
                <div class="lab-presets-strip" id="lab-presets">
                  ${PRESETS.map((p) => `<button class="btn btn-secondary btn-sm lab-preset-btn" data-pid="${p.id}" style="font-size:0.75rem;padding:5px 8px;">${p.label}</button>`).join('')}
                </div>
              </div>
            </aside>

            <!-- CENTER: Interactive Workbench -->
            <section class="lab-center glass-surface">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-sm btn-secondary lab-vessel-btn" data-v="test-tube">🧪 Ống nghiệm</button>
                  <button class="btn btn-sm btn-primary lab-vessel-btn" data-v="beaker">🥛 Cốc Beaker</button>
                  <button class="btn btn-sm btn-secondary lab-vessel-btn" data-v="erlenmeyer">⚗️ Bình tam giác</button>
                </div>
                <select id="lab-amount-sel" class="select-field" style="padding:5px 10px;font-size:0.8rem;">
                  <option value="5 giọt">Lượng: 5 giọt</option>
                  <option value="10 ml" selected>Lượng: 10 ml / 1 mẫu</option>
                  <option value="25 ml">Lượng: 25 ml / 2 g</option>
                </select>
              </div>

              <div class="lab-stage-wrap">
                <canvas id="lab-canvas"></canvas>
                <div class="lab-hud-top">
                  <span class="glass-surface mono" id="lab-hud-temp" style="padding:4px 10px;border-radius:8px;">🌡️ 25 °C</span>
                  <span class="glass-surface mono" id="lab-hud-ph" style="padding:4px 10px;border-radius:8px;">pH: 7.0</span>
                </div>
              </div>

              <div class="lab-env-bar">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <button class="btn btn-sm btn-secondary" id="lab-burner-btn">🔥 Bật đèn đốt</button>
                  <input type="range" id="lab-temp-slider" min="25" max="1000" step="5" value="25" style="width:120px;accent-color:#F97316;" />
                </div>
                <div style="display:flex;gap:8px;">
                  <button class="btn btn-sm btn-secondary" id="lab-stir-btn">🌀 Khuấy đều</button>
                  <button class="btn btn-sm btn-secondary" id="lab-reset-btn">🗑 Làm sạch</button>
                </div>
              </div>

              <div id="lab-contents-bar" style="font-size:0.82rem;color:var(--text-secondary);">
                Trong bình: <span style="color:var(--text-muted);">Chưa có hóa chất nào</span>
              </div>
            </section>

            <!-- RIGHT: Reaction Analysis & Lab Log -->
            <aside class="lab-analysis glass-surface" id="lab-analysis-panel">
              <div class="control-label">Phân Tích Phản Ứng</div>
              <div id="lab-analysis-body" style="font-size:0.88rem;color:var(--text-secondary);">
                <p>Hãy chọn hóa chất từ kệ bên trái hoặc nhấn một <strong>Thí nghiệm mẫu</strong> để quan sát hiện tượng và phương trình hóa học cân bằng.</p>
              </div>
              <div style="border-top:1px solid var(--glass-border);padding-top:10px;margin-top:6px;">
                <div class="control-label" style="margin-bottom:6px;">📜 Nhật ký thí nghiệm (Lab Log)</div>
                <div id="lab-log-list" style="display:flex;flex-direction:column;gap:4px;font-size:0.75rem;color:var(--text-muted);max-height:150px;overflow-y:auto;">
                  <div>• Sẵn sàng thực hành...</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      `;

      this.renderShelf();
      this.bindEvents();
      this.startCanvas();
    },

    renderShelf() {
      const list = REAGENTS[this.state.activeTab] || [];
      const wrap = document.getElementById('lab-shelf-items');
      wrap.innerHTML = list
        .map((item) => {
          if (item.type) {
            return `
              <button class="lab-chem-btn" data-tool="${item.id}" data-type="${item.type}">
                <div style="font-weight:700;font-size:0.84rem;">${item.icon} ${item.name}</div>
                <div style="font-size:0.7rem;color:var(--text-muted);">${item.desc}</div>
              </button>`;
          }
          return `
            <button class="lab-chem-btn" data-reagent="${item.id}">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <strong class="mono" style="font-size:0.86rem;color:var(--accent-cyan);">${item.formula}</strong>
                <span class="lab-swatch" style="background:${item.color};"></span>
              </div>
              <div style="font-size:0.78rem;font-weight:600;">${item.name}</div>
              <div style="font-size:0.68rem;color:var(--text-muted);">${item.warn}</div>
            </button>`;
        })
        .join('');

      wrap.querySelectorAll('[data-reagent]').forEach((btn) => {
        btn.addEventListener('click', () => this.addReagent(btn.getAttribute('data-reagent')));
      });
      wrap.querySelectorAll('[data-tool]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-tool');
          const type = btn.getAttribute('data-type');
          if (type === 'vessel') this.setVessel(id);
          else if (id === 'burner') this.toggleBurner();
          else CV.showToast('Nhiệt kế & cảm biến pH đang hiển thị trực tiếp trên bàn thí nghiệm.');
        });
      });
    },

    bindEvents() {
      document.querySelectorAll('#lab-tabs .lab-tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.state.activeTab = btn.getAttribute('data-tab');
          document.querySelectorAll('#lab-tabs .lab-tab-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderShelf();
        });
      });

      document.querySelectorAll('.lab-vessel-btn').forEach((btn) => {
        btn.addEventListener('click', () => this.setVessel(btn.getAttribute('data-v')));
      });

      document.getElementById('lab-amount-sel').addEventListener('change', (e) => {
        this.state.amountUnit = e.target.value;
      });

      document.getElementById('lab-burner-btn').addEventListener('click', () => this.toggleBurner());
      document.getElementById('lab-temp-slider').addEventListener('input', (e) => {
        this.state.tempC = Number(e.target.value);
        this.state.burnerOn = this.state.tempC > 40;
        this.updateEnvUI();
        this.evaluateReaction();
      });

      document.getElementById('lab-stir-btn').addEventListener('click', () => {
        this.state.stirring = true;
        setTimeout(() => { this.state.stirring = false; }, 1600);
        CV.showToast('Đang khuấy đều hỗn hợp trong bình...');
      });

      document.getElementById('lab-reset-btn').addEventListener('click', () => this.resetLab());

      document.querySelectorAll('.lab-preset-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const p = PRESETS.find((x) => x.id === btn.getAttribute('data-pid'));
          if (!p) return;
          this.resetLab();
          this.state.contents = [...p.items];
          if (p.burner) {
            this.state.burnerOn = true;
            this.state.tempC = 650;
          }
          this.updateEnvUI();
          this.evaluateReaction();
        });
      });
    },

    setVessel(v) {
      this.state.vessel = v;
      document.querySelectorAll('.lab-vessel-btn').forEach((b) => {
        b.className = b.getAttribute('data-v') === v ? 'btn btn-sm btn-primary lab-vessel-btn' : 'btn btn-sm btn-secondary lab-vessel-btn';
      });
    },

    toggleBurner() {
      this.state.burnerOn = !this.state.burnerOn;
      this.state.tempC = this.state.burnerOn ? Math.max(this.state.tempC, 550) : 25;
      this.updateEnvUI();
      this.evaluateReaction();
    },

    updateEnvUI() {
      const btn = document.getElementById('lab-burner-btn');
      btn.className = this.state.burnerOn ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-secondary';
      btn.textContent = this.state.burnerOn ? '🔥 Tắt đèn đốt' : '🔥 Bật đèn đốt';
      document.getElementById('lab-temp-slider').value = this.state.tempC;
      document.getElementById('lab-hud-temp').textContent = `🌡️ ${this.state.tempC} °C`;
    },

    addReagent(id) {
      if (!this.state.contents.includes(id)) {
        this.state.contents.push(id);
        this.addLog(`+ Thêm ${id} (${this.state.amountUnit})`);
      }
      this.evaluateReaction();
    },

    addLog(msg) {
      const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.state.logs.unshift(`[${time}] ${msg}`);
      if (this.state.logs.length > 12) this.state.logs.pop();
      const el = document.getElementById('lab-log-list');
      if (el) el.innerHTML = this.state.logs.map((l) => `<div>${l}</div>`).join('');
    },

    resetLab() {
      this.state.contents = [];
      this.state.burnerOn = false;
      this.state.tempC = 25;
      this.state.reaction = null;
      this.bubbles = [];
      this.precipitateParticles = [];
      this.addLog('🗑 Làm sạch bàn thí nghiệm');
      this.updateEnvUI();
      this.evaluateReaction();
    },

    evaluateReaction() {
      const c = new Set(this.state.contents);
      const has = (x) => c.has(x);
      let rxn = null;

      // 0. Safety Guardrail: Alkali metal (K/Na) + Strong Acid
      if ((has('K') || has('Na')) && (has('HCl') || has('H2SO4') || has('HNO3'))) {
        rxn = {
          title: '⚠️ CẢNH BÁO AN TOÀN THÍ NGHIỆM',
          equation: '2K (s) + 2HCl (aq) → 2KCl (aq) + H₂ (g) ↑  [NGUY HIỂM NỔ]',
          type: 'Cơ chế bảo vệ an toàn (Safety Guardrail)',
          phenomenon: 'Không được cho kim loại kiềm mạnh (Na, K) trực tiếp vào axit mạnh vì phản ứng tỏa nhiệt cực lớn gây bắn axit và nổ khí H₂!',
          liquidColor: 'rgba(239, 68, 68, 0.38)',
          gas: true,
          precipitate: null,
          atomZ: 19,
          ph: 1
        };
      }

      // 1. Flame Tests when Burner is ON
      if (!rxn && this.state.burnerOn) {
        const flameMetals = [...REAGENTS.metals].filter((m) => m.flame && has(m.id));
        if (flameMetals.length > 0 && !has('H2O') && !has('HCl')) {
          const m = flameMetals[0];
          const colorNames = { Na: 'vàng rực (589 nm)', K: 'tím hoa cà nhạt', Li: 'đỏ tía rực rỡ', Cu: 'xanh lục bảo', Ba: 'vàng lục', Ca: 'đỏ cam', Mg: 'trắng chói', S: 'xanh lam mờ' };
          rxn = {
            title: `Thử màu ngọn lửa: ${m.name} (${m.id})`,
            equation: `${m.id} + Δ (nhiệt) → ${m.id}* → ${m.id} + hν (ánh sáng ${colorNames[m.id] || 'đặc trưng'})`,
            type: 'Kích thích quang phổ phát xạ nguyên tử',
            phenomenon: `Khi đưa mẫu ${m.name} vào ngọn lửa đèn đốt, electron hấp thụ năng lượng nhảy lên mức cao rồi giải phóng photon tạo ngọn lửa màu ${colorNames[m.id]}.`,
            liquidColor: null,
            flameColor: m.flame,
            gas: false,
            precipitate: null,
            atomZ: m.z,
            ph: 7
          };
        }
      }

      // 2. Chemical Reactions
      if (!rxn && has('Na') && has('H2O')) {
        rxn = {
          title: 'Natri tác dụng với Nước',
          equation: '2Na (s) + 2H₂O (l) → 2NaOH (aq) + H₂ (g) ↑',
          type: 'Phản ứng Oxi hóa – Khử (Tỏa nhiệt mạnh)',
          phenomenon: 'Mẩu Natri nóng chảy thành giọt tròn chạy trên mặt nước, sủi bọt khí Hydro (H₂) mạnh và tỏa nhiều nhiệt; dung dịch thu được có tính kiềm (pH ≈ 13).',
          liquidColor: has('Phenolphtalein') ? 'rgba(236, 72, 153, 0.62)' : 'rgba(186, 230, 253, 0.42)',
          gas: true,
          precipitate: null,
          atomZ: 11,
          ph: 13
        };
      } else if (!rxn && has('K') && has('H2O')) {
        rxn = {
          title: 'Kali tác dụng với Nước',
          equation: '2K (s) + 2H₂O (l) → 2KOH (aq) + H₂ (g) ↑',
          type: 'Phản ứng Oxi hóa – Khử (Rất mãnh liệt)',
          phenomenon: 'Kali phản ứng mãnh liệt hơn Natri, giải phóng khí H₂ bùng cháy kèm ngọn lửa màu tím đặc trưng.',
          liquidColor: has('Phenolphtalein') ? 'rgba(236, 72, 153, 0.65)' : 'rgba(186, 230, 253, 0.42)',
          flameColor: '#C084FC',
          gas: true,
          precipitate: null,
          atomZ: 19,
          ph: 13.5
        };
      } else if (!rxn && has('Zn') && (has('HCl') || has('H2SO4'))) {
        const acid = has('HCl') ? '2HCl (aq)' : 'H₂SO₄ (aq)';
        const salt = has('HCl') ? 'ZnCl₂ (aq)' : 'ZnSO₄ (aq)';
        rxn = {
          title: 'Kẽm tan trong Axit',
          equation: `Zn (s) + ${acid} → ${salt} + H₂ (g) ↑`,
          type: 'Phản ứng Thế / Oxi hóa – Khử',
          phenomenon: 'Kẽm tan dần và xuất hiện bọt khí Hydro không màu thoát ra liên tục trên bề mặt kim loại.',
          liquidColor: 'rgba(203, 213, 225, 0.42)',
          gas: true,
          precipitate: null,
          atomZ: 30,
          ph: 2
        };
      } else if (!rxn && has('Fe') && has('CuSO4')) {
        rxn = {
          title: 'Sắt đẩy Đồng khỏi muối CuSO₄',
          equation: 'Fe (s) + CuSO₄ (aq) → FeSO₄ (aq) + Cu (s) ↓',
          type: 'Phản ứng Thế kim loại (Oxi hóa – Khử)',
          phenomenon: 'Lớp đồng kim loại màu đỏ cam bám lên bề mặt đinh sắt Fe; dung dịch xanh lam CuSO₄ nhạt dần chuyển sang xanh lục nhạt FeSO₄.',
          liquidColor: 'rgba(110, 231, 183, 0.45)',
          gas: false,
          precipitate: '#EA580C',
          copperPlating: true,
          atomZ: 26,
          ph: 5.5
        };
      } else if (!rxn && has('Cu') && has('HNO3')) {
        rxn = {
          title: 'Đồng tác dụng với Axit Nitric đặc',
          equation: 'Cu (s) + 4HNO₃ (đặc) → Cu(NO₃)₂ (aq) + 2NO₂ (g) ↑ + 2H₂O (l)',
          type: 'Phản ứng Oxi hóa – Khử mạnh',
          phenomenon: 'Đồng tan dần tạo dung dịch Cu(NO₃)₂ màu xanh lam và giải phóng khí NO₂ màu nâu đỏ có mùi hắc.',
          liquidColor: 'rgba(14, 165, 233, 0.65)',
          gas: true,
          precipitate: null,
          atomZ: 29,
          ph: 1
        };
      } else if (!rxn && has('AgNO3') && (has('HCl') || has('NaCl'))) {
        rxn = {
          title: 'Kết tủa Bạc Clorua',
          equation: 'AgNO₃ (aq) + HCl (aq) → AgCl (s) ↓ + HNO₃ (aq)',
          type: 'Phản ứng Trao đổi Ion',
          phenomenon: 'Xuất hiện kết tủa trắng vón cục AgCl không tan lắng xuống đáy bình.',
          liquidColor: 'rgba(226, 232, 240, 0.42)',
          gas: false,
          precipitate: '#F8FAFC',
          atomZ: 47,
          ph: 2
        };
      } else if (!rxn && has('BaCl2') && has('H2SO4')) {
        rxn = {
          title: 'Kết tủa Bari Sunfat',
          equation: 'BaCl₂ (aq) + H₂SO₄ (aq) → BaSO₄ (s) ↓ + 2HCl (aq)',
          type: 'Phản ứng Trao đổi Ion',
          phenomenon: 'Xuất hiện kết tủa trắng mịn BaSO₄ rất bền, không tan trong axit dư.',
          liquidColor: 'rgba(226, 232, 240, 0.45)',
          gas: false,
          precipitate: '#FFFFFF',
          atomZ: 56,
          ph: 1.5
        };
      } else if (!rxn && has('CuSO4') && has('NaOH')) {
        rxn = {
          title: 'Kết tủa Đồng(II) Hidroxit',
          equation: 'CuSO₄ (aq) + 2NaOH (aq) → Cu(OH)₂ (s) ↓ + Na₂SO₄ (aq)',
          type: 'Phản ứng Trao đổi Ion',
          phenomenon: 'Tạo kết tủa keo màu xanh lam đặc trưng của Cu(OH)₂ lắng xuống đáy bình.',
          liquidColor: 'rgba(56, 189, 248, 0.35)',
          gas: false,
          precipitate: '#0EA5E9',
          atomZ: 29,
          ph: 11
        };
      } else if (!rxn && has('FeCl3') && has('NaOH')) {
        rxn = {
          title: 'Kết tủa Sắt(III) Hidroxit',
          equation: 'FeCl₃ (aq) + 3NaOH (aq) → Fe(OH)₃ (s) ↓ + 3NaCl (aq)',
          type: 'Phản ứng Trao đổi Ion',
          phenomenon: 'Xuất hiện kết tủa màu nâu đỏ đặc trưng của Fe(OH)₃ lắng xuống đáy.',
          liquidColor: 'rgba(251, 191, 36, 0.28)',
          gas: false,
          precipitate: '#B45309',
          atomZ: 26,
          ph: 11
        };
      } else if (!rxn && has('NaOH') && has('Phenolphtalein')) {
        const neutralized = has('HCl') || has('H2SO4');
        rxn = neutralized
          ? {
              title: 'Phản ứng Trung hòa Axit – Bazơ',
              equation: 'NaOH (aq) + HCl (aq) → NaCl (aq) + H₂O (l)',
              type: 'Phản ứng Trung hòa',
              phenomenon: 'Axit trung hòa bazơ làm dung dịch mất màu hồng phenolphtalein trở lại trong suốt.',
              liquidColor: 'rgba(226, 232, 240, 0.35)',
              gas: false,
              precipitate: null,
              atomZ: 11,
              ph: 7
            }
          : {
              title: 'Nhận biết Bazơ bằng Phenolphtalein',
              equation: 'NaOH (aq) → Na⁺ (aq) + OH⁻ (aq)  [Phenolphtalein → Hồng]',
              type: 'Đổi màu Chất chỉ thị',
              phenomenon: 'Môi trường kiềm (OH⁻) làm chất chỉ thị Phenolphtalein chuyển sang màu hồng cánh sen rực rỡ.',
              liquidColor: 'rgba(236, 72, 153, 0.65)',
              gas: false,
              precipitate: null,
              atomZ: 11,
              ph: 13
            };
      } else if (!rxn && has('Ca(OH)2') && has('CO2')) {
        rxn = {
          title: 'Khí CO₂ làm đục nước vôi trong',
          equation: 'Ca(OH)₂ (aq) + CO₂ (g) → CaCO₃ (s) ↓ + H₂O (l)',
          type: 'Phản ứng tạo Kết tủa',
          phenomenon: 'Nước vôi trong bị vẩn đục do tạo thành kết tủa trắng Canxi Cacbonat (CaCO₃).',
          liquidColor: 'rgba(241, 245, 249, 0.55)',
          gas: true,
          precipitate: '#F8FAFC',
          atomZ: 20,
          ph: 8.5
        };
      }

      this.state.reaction = rxn;
      this.renderReactionDetails();
    },

    renderReactionDetails() {
      const contentsBar = document.getElementById('lab-contents-bar');
      contentsBar.innerHTML =
        this.state.contents.length === 0
          ? 'Trong bình: <span style="color:var(--text-muted);">Chưa có hóa chất nào</span>'
          : `Trong bình (${this.state.amountUnit}): ` +
            this.state.contents.map((id) => `<span class="cat-badge mono" style="color:var(--accent-cyan);margin-right:4px;">${id}</span>`).join('');

      const rxn = this.state.reaction;
      const body = document.getElementById('lab-analysis-body');
      const phEl = document.getElementById('lab-hud-ph');

      if (!rxn) {
        let estPh = 7;
        if (this.state.contents.includes('HCl') || this.state.contents.includes('H2SO4')) estPh = 1.5;
        else if (this.state.contents.includes('NaOH')) estPh = 13;
        phEl.textContent = `pH: ${estPh.toFixed(1)}`;
        body.innerHTML = `<p>Chưa có phản ứng hóa học rõ rệt giữa các chất hiện tại. Thử kết hợp cặp chất phản ứng hoặc bật <strong>Đèn đốt</strong> để thử màu ngọn lửa!</p>`;
        return;
      }

      phEl.textContent = `pH: ${rxn.ph.toFixed(1)}`;
      body.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <div style="font-size:0.76rem;color:var(--accent-cyan);font-weight:700;">${rxn.type}</div>
            <h3 style="font-size:1.1rem;margin-top:2px;">${rxn.title}</h3>
          </div>
          <div class="glass-surface" style="padding:12px;border-radius:10px;border-color:rgba(0,229,255,0.35);">
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px;">Phương trình cân bằng</div>
            <div class="mono" style="font-size:0.88rem;color:#34D399;font-weight:600;word-break:break-word;">${rxn.equation}</div>
          </div>
          <div class="glass-surface" style="padding:12px;border-radius:10px;">
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px;">Hiện tượng & Giải thích</div>
            <p style="font-size:0.84rem;color:var(--text-secondary);">${rxn.phenomenon}</p>
          </div>
          ${
            rxn.atomZ
              ? `<button class="btn btn-primary btn-sm" onclick="CHEMVERSE.openInSimulator(${rxn.atomZ})">⚛️ Xem ở cấp độ nguyên tử (Z=${rxn.atomZ})</button>`
              : ''
          }
        </div>
      `;
    },

    startCanvas() {
      const canvas = document.getElementById('lab-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let t = 0;

      const draw = () => {
        this.animId = requestAnimationFrame(draw);
        if (CV.state.currentRoute !== 'virtual-lab') return;

        const rect = canvas.parentElement.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
        const w = canvas.width, h = canvas.height;
        const cx = w / 2;
        t += 0.04;

        ctx.clearRect(0, 0, w, h);

        // Lab bench surface
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(0, h - 42, w, 42);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.moveTo(0, h - 42);
        ctx.lineTo(w, h - 42);
        ctx.stroke();

        // Bunsen Burner if ON
        const rxn = this.state.reaction;
        const showFlame = this.state.burnerOn || (rxn && rxn.flameColor);
        if (showFlame) {
          const fColor = (rxn && rxn.flameColor) || '#38BDF8';
          const flicker = Math.sin(t * 5) * 4;
          const grad = ctx.createRadialGradient(cx, h - 75, 4, cx, h - 85, 46 + flicker);
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.35, fColor);
          grad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.ellipse(cx, h - 78, 22 + flicker * 0.4, 42 + flicker, 0, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.fillStyle = '#475569';
          ctx.fillRect(cx - 10, h - 62, 20, 20);
        }

        // Vessel geometry
        const vY = showFlame ? h - 115 : h - 46;
        const vTop = vY - 190;
        const vW = this.state.vessel === 'test-tube' ? 68 : 146;

        ctx.save();
        ctx.beginPath();
        if (this.state.vessel === 'erlenmeyer') {
          ctx.moveTo(cx - 26, vTop);
          ctx.lineTo(cx - vW / 2, vY);
          ctx.lineTo(cx + vW / 2, vY);
          ctx.lineTo(cx + 26, vTop);
        } else {
          ctx.roundRect(cx - vW / 2, vTop, vW, 190, [4, 4, 18, 18]);
        }
        ctx.clip();

        // Liquid fill if any solution or water is present
        const hasLiquid = this.state.contents.some((id) => REAGENTS.solutions.some((s) => s.id === id) || id === 'Phenolphtalein' || id === 'Quỳ tím');
        if (hasLiquid) {
          let liqColor = 'rgba(125, 211, 252, 0.35)';
          if (rxn && rxn.liquidColor) liqColor = rxn.liquidColor;
          else {
            const sol = REAGENTS.solutions.find((s) => this.state.contents.includes(s.id));
            if (sol) liqColor = sol.color;
          }
          const liqTop = vY - 115 + Math.sin(t * (this.state.stirring ? 6 : 1.5)) * (this.state.stirring ? 6 : 1.5);
          ctx.fillStyle = liqColor;
          ctx.fillRect(cx - vW, liqTop, vW * 2, 130);
        }

        // Metal piece inside vessel
        const metalItem = REAGENTS.metals.find((m) => this.state.contents.includes(m.id));
        if (metalItem) {
          const mx = metalItem.id === 'Na' || metalItem.id === 'K' ? cx + Math.sin(t * 4) * 24 : cx;
          const my = metalItem.id === 'Na' || metalItem.id === 'K' ? vY - 115 : vY - 24;
          ctx.fillStyle = rxn && rxn.copperPlating ? '#EA580C' : metalItem.color;
          ctx.beginPath();
          if (metalItem.id === 'Fe') {
            ctx.roundRect(mx - 6, my - 46, 12, 62, 4);
          } else {
            ctx.arc(mx, my, 12, 0, Math.PI * 2);
          }
          ctx.fill();
        }

        // Precipitate layer
        if (rxn && rxn.precipitate) {
          ctx.fillStyle = rxn.precipitate;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.ellipse(cx, vY - 10, vW * 0.42, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Gas bubbles
        if ((rxn && rxn.gas) || this.state.tempC > 95) {
          if (this.bubbles.length < 28) {
            this.bubbles.push({ x: cx + (Math.random() - 0.5) * (vW * 0.6), y: vY - 16, r: 2 + Math.random() * 3.5, vy: 1.5 + Math.random() * 2 });
          }
          ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
          this.bubbles.forEach((b) => {
            b.y -= b.vy;
            if (b.y < vY - 125) b.y = vY - 16;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        ctx.restore();

        // Vessel Glass Outline
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        if (this.state.vessel === 'erlenmeyer') {
          ctx.moveTo(cx - 26, vTop);
          ctx.lineTo(cx - vW / 2, vY);
          ctx.lineTo(cx + vW / 2, vY);
          ctx.lineTo(cx + 26, vTop);
        } else {
          ctx.roundRect(cx - vW / 2, vTop, vW, 190, [4, 4, 18, 18]);
        }
        ctx.stroke();
      };
      draw();
    }
  };
})();
