(function () {
  const CV = window.CHEMVERSE;

  const APPARATUS = [
    { id: 'test-tube', name: 'Ống nghiệm (20 ml)', icon: '🧪', type: 'vessel', desc: 'Thử phản ứng nhanh' },
    { id: 'beaker', name: 'Cốc Beaker (250 ml)', icon: '🥛', type: 'vessel', desc: 'Quan sát kết tủa rõ nét' },
    { id: 'erlenmeyer', name: 'Bình tam giác', icon: '⚗️', type: 'vessel', desc: 'Khuấy trộn an toàn' },
    { id: 'burner', name: 'Đèn đốt Bunsen', icon: '🔥', type: 'tool', desc: 'Gia nhiệt & thử màu ngọn lửa' },
    { id: 'thermometer', name: 'Nhiệt kế', icon: '🌡️', type: 'tool', desc: 'Theo dõi nhiệt độ (25–1000°C)' },
    { id: 'litmus-tool', name: 'Máy đo pH', icon: '📊', type: 'tool', desc: 'Đo pH dung dịch (0–14)' }
  ];

  const PRESETS = [
    { id: 'na-h2o', label: '⚡ Na + H₂O', items: ['H2O', 'Na'], burner: false },
    { id: 'flame-cu', label: '🔥 Ngọn lửa Cu', items: ['Cu'], burner: true },
    { id: 'flame-na', label: '🌟 Ngọn lửa Na', items: ['Na'], burner: true },
    { id: 'zn-hcl', label: '🫧 Zn + HCl', items: ['HCl', 'Zn'], burner: false },
    { id: 'fe-cuso4', label: '🧲 Fe + CuSO₄', items: ['CuSO4', 'Fe'], burner: false },
    { id: 'agno3-nacl', label: '❄️ AgNO₃ + NaCl', items: ['AgNO3', 'NaCl'], burner: false },
    { id: 'pbno32-ki', label: '✨ Pb(NO₃)₂ + KI', items: ['Pb(NO3)2', 'KI'], burner: false },
    { id: 'fecl3-kscn', label: '🩸 FeCl₃ + KSCN', items: ['FeCl3', 'KSCN'], burner: false },
    { id: 'cu-hno3', label: '🟤 Cu + HNO₃ đặc', items: ['Cu', 'HNO3'], burner: false },
    { id: 'nahco3-vinegar', label: '🌋 Baking Soda + Giấm', items: ['NaHCO3', 'CH3COOH'], burner: false }
  ];

  CV.modules['virtual-lab'] = {
    state: {
      activeTab: 'solutions',
      searchQuery: '',
      vessel: 'beaker',
      contents: [],
      amountUnit: '10 ml',
      burnerOn: false,
      tempC: 25,
      stirring: false,
      reaction: null,
      statusMessage: '',
      logs: []
    },
    animId: null,
    bubbles: [],

    init(container) {
      this.container = container;
      const chemCount = (CV.CHEMICALS || []).length;
      container.innerHTML = `
        <div class="page-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">🔬 ${CV.t('Virtual Lab – Phòng Thí Nghiệm Hóa Học Ảo', 'Virtual Lab – Interactive Chemistry Workbench')}</h2>
              <p class="section-subtitle">${CV.t(`Tủ hóa chất ${chemCount}+ chất thực tế • Reaction Engine kiểm chứng cân bằng nguyên tử & xuất báo cáo`, `${chemCount}+ real chemicals • Reaction Engine with atom-balance verification & report export`)}</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="lab-export-btn">📄 ${CV.t('Xuất báo cáo thí nghiệm', 'Export Lab Report')}</button>
          </div>

          <div class="lab-workbench">
            <!-- LEFT: 64+ Chemical Cabinet & Presets -->
            <aside class="lab-shelf glass-surface">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="control-label">Tủ Hóa Chất (${chemCount} chất)</span>
              </div>
              <input type="text" id="lab-chem-search" class="input-field" style="padding:7px 10px;font-size:0.82rem;" placeholder="🔍 Tìm hóa chất (Na, HCl, CuSO4...)" />
              <div class="lab-tabs" id="lab-tabs">
                <button class="lab-tab-btn" data-tab="apparatus">Dụng cụ</button>
                <button class="lab-tab-btn" data-tab="metals">Rắn/KL</button>
                <button class="lab-tab-btn active" data-tab="solutions">Dung dịch</button>
                <button class="lab-tab-btn" data-tab="indicators">Chỉ thị</button>
              </div>
              <div id="lab-shelf-items" class="lab-item-grid"></div>

              <div style="border-top:1px solid var(--glass-border);padding-top:10px;margin-top:4px;">
                <div class="control-label" style="margin-bottom:8px;">📚 Thí nghiệm mẫu</div>
                <div class="lab-presets-strip">
                  ${PRESETS.map((p) => `<button class="btn btn-secondary btn-sm lab-preset-btn" data-pid="${p.id}" style="font-size:0.74rem;padding:5px 8px;">${p.label}</button>`).join('')}
                </div>
              </div>
            </aside>

            <!-- CENTER: Digital Lab Bench -->
            <section class="lab-center glass-surface">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button class="btn btn-sm btn-secondary lab-vessel-btn" data-v="test-tube">🧪 Ống nghiệm</button>
                  <button class="btn btn-sm btn-primary lab-vessel-btn" data-v="beaker">🥛 Beaker</button>
                  <button class="btn btn-sm btn-secondary lab-vessel-btn" data-v="erlenmeyer">⚗️ Bình tam giác</button>
                </div>
                <select id="lab-amount-sel" class="select-field" style="padding:5px 10px;font-size:0.8rem;">
                  <option value="5 giọt">Lượng: 5 giọt</option>
                  <option value="10 ml" selected>Lượng: 10 ml / 1 g</option>
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
                  <input type="range" id="lab-temp-slider" min="25" max="1000" step="5" value="25" style="width:115px;accent-color:#F97316;" />
                </div>
                <div style="display:flex;gap:8px;">
                  <button class="btn btn-sm btn-secondary" id="lab-stir-btn">🌀 Khuấy</button>
                  <button class="btn btn-sm btn-secondary" id="lab-reset-btn">🗑 Làm sạch</button>
                </div>
              </div>

              <div id="lab-contents-bar" style="font-size:0.82rem;color:var(--text-secondary);">
                Trong bình: <span style="color:var(--text-muted);">Chưa có hóa chất nào</span>
              </div>
            </section>

            <!-- RIGHT: Reaction Engine Analysis & Lab Log -->
            <aside class="lab-analysis glass-surface" id="lab-analysis-panel">
              <div class="control-label">Phân Tích Reaction Engine</div>
              <div id="lab-analysis-body" style="font-size:0.88rem;color:var(--text-secondary);">
                <p>Hãy chọn hóa chất từ tủ bên trái hoặc nhấn một <strong>Thí nghiệm mẫu</strong> để Reaction Engine phân tích và kiểm chứng cân bằng phương trình.</p>
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
      const wrap = document.getElementById('lab-shelf-items');
      const q = this.state.searchQuery;

      if (!q && this.state.activeTab === 'apparatus') {
        wrap.innerHTML = APPARATUS.map(
          (item) => `
          <button class="lab-chem-btn" data-tool="${item.id}" data-type="${item.type}">
            <div style="font-weight:700;font-size:0.82rem;">${item.icon} ${item.name}</div>
            <div style="font-size:0.7rem;color:var(--text-muted);">${item.desc}</div>
          </button>`
        ).join('');
      } else {
        const list = (CV.CHEMICALS || []).filter((ch) => {
          if (q) {
            return (
              ch.id.toLowerCase().includes(q) ||
              ch.name.toLowerCase().includes(q) ||
              ch.nameEn.toLowerCase().includes(q) ||
              ch.formula.toLowerCase().includes(q)
            );
          }
          return ch.category === this.state.activeTab;
        });

        wrap.innerHTML =
          list.length === 0
            ? `<div style="grid-column:1/-1;color:var(--text-muted);font-size:0.82rem;padding:12px;">Không tìm thấy hóa chất phù hợp.</div>`
            : list
                .map(
                  (item) => `
              <button class="lab-chem-btn" data-reagent="${item.id}">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                  <strong class="mono" style="font-size:0.84rem;color:var(--accent-cyan);">${item.formula}</strong>
                  <span class="lab-swatch" style="background:${item.color};"></span>
                </div>
                <div style="font-size:0.78rem;font-weight:600;">${item.name}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);">${item.warn}</div>
              </button>`
                )
                .join('');
      }

      wrap.querySelectorAll('[data-reagent]').forEach((btn) => {
        btn.addEventListener('click', () => this.addReagent(btn.getAttribute('data-reagent')));
      });
      wrap.querySelectorAll('[data-tool]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-tool');
          if (btn.getAttribute('data-type') === 'vessel') this.setVessel(id);
          else if (id === 'burner') this.toggleBurner();
          else CV.showToast('Nhiệt kế & cảm biến pH đang hiển thị trực tiếp trên bàn thí nghiệm.');
        });
      });
    },

    bindEvents() {
      document.getElementById('lab-chem-search').addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value.trim().toLowerCase();
        this.renderShelf();
      });

      document.querySelectorAll('#lab-tabs .lab-tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.state.activeTab = btn.getAttribute('data-tab');
          this.state.searchQuery = '';
          document.getElementById('lab-chem-search').value = '';
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
          this.addLog(`📚 Chạy mẫu: ${p.label}`);
          if (p.burner) {
            this.state.burnerOn = true;
            this.state.tempC = 650;
          }
          this.updateEnvUI();
          this.evaluateReaction();
        });
      });

      document.getElementById('lab-export-btn').addEventListener('click', () => {
        const user = CV.Player ? CV.Player.getCurrentUser() : null;
        CV.ReactionEngine.exportLabReport({
          studentName: user ? user.displayName : 'Học sinh CHEMVERSE',
          contents: this.state.contents,
          vessel: this.state.vessel,
          tempC: this.state.tempC,
          reaction: this.state.reaction,
          logs: this.state.logs
        });
        CV.showToast('Đã xuất báo cáo thí nghiệm (.html)!');
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
      if (this.state.logs.length > 15) this.state.logs.pop();
      const el = document.getElementById('lab-log-list');
      if (el) el.innerHTML = this.state.logs.map((l) => `<div>${l}</div>`).join('');
    },

    resetLab() {
      this.state.contents = [];
      this.state.burnerOn = false;
      this.state.tempC = 25;
      this.state.reaction = null;
      this.state.statusMessage = '';
      this.bubbles = [];
      this.addLog('🗑 Làm sạch bàn thí nghiệm');
      this.updateEnvUI();
      this.evaluateReaction();
    },

    evaluateReaction() {
      const res = CV.ReactionEngine.findReaction(this.state.contents, this.state.tempC, this.state.burnerOn);
      if (res.status === 'ok' || res.status === 'danger') {
        const prevTitle = this.state.reaction ? this.state.reaction.title : '';
        this.state.reaction = res.reaction;
        this.state.statusMessage = '';
        if (res.reaction.title !== prevTitle && CV.Player) {
          CV.Player.recordEvent('reaction', `Phản ứng: ${res.reaction.title}`, 25);
        }
      } else {
        this.state.reaction = null;
        this.state.statusMessage = res.message || '';
      }
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
        const firstSol = (CV.CHEMICALS || []).find((c) => this.state.contents.includes(c.id) && c.ph !== undefined);
        if (firstSol) estPh = firstSol.ph;
        phEl.textContent = `pH: ${estPh.toFixed(1)}`;
        body.innerHTML = this.state.statusMessage
          ? `<div class="glass-surface" style="padding:12px;border-radius:10px;border-color:rgba(251,191,36,0.4);color:#FBBF24;">ℹ️ ${this.state.statusMessage}</div>`
          : `<p>Chưa có phản ứng hóa học rõ rệt. Hãy thêm hóa chất khác hoặc bật <strong>Đèn đốt</strong>!</p>`;
        return;
      }

      phEl.textContent = `pH: ${(rxn.ph ?? 7).toFixed(1)}`;
      const bal = rxn.balanceCheck;
      body.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div>
            <div style="font-size:0.74rem;color:var(--accent-cyan);font-weight:700;">${rxn.reactionType}</div>
            <h3 style="font-size:1.05rem;margin-top:2px;">${rxn.title}</h3>
          </div>
          <div class="glass-surface" style="padding:12px;border-radius:10px;border-color:rgba(0,229,255,0.35);">
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px;">Phương trình phản ứng</div>
            <div class="mono" style="font-size:0.86rem;color:#34D399;font-weight:600;word-break:break-word;">${rxn.displayEquation}</div>
            ${bal ? `<div class="mono" style="font-size:0.72rem;color:${bal.balanced ? '#34D399' : '#F87171'};margin-top:6px;">${bal.balanced ? '✓ Đã kiểm chứng cân bằng' : '⚠ Lệch cân bằng'}: ${bal.summary}</div>` : ''}
          </div>
          <div class="glass-surface" style="padding:10px 12px;border-radius:10px;">
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:3px;">Hiện tượng & Giải thích</div>
            <p style="font-size:0.82rem;color:var(--text-secondary);">${rxn.explanation}</p>
          </div>
          ${rxn.conclusion ? `<div class="glass-surface" style="padding:10px 12px;border-radius:10px;"><div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:3px;">Kết luận</div><p style="font-size:0.82rem;color:var(--accent-cyan);">${rxn.conclusion}</p></div>` : ''}
          ${rxn.atomZ ? `<button class="btn btn-primary btn-sm" onclick="CHEMVERSE.openInSimulator(${rxn.atomZ})">⚛️ Xem ở cấp độ nguyên tử (Z=${rxn.atomZ})</button>` : ''}
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
        const w = canvas.width, h = canvas.height, cx = w / 2;
        t += 0.04;
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(0, h - 42, w, 42);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.moveTo(0, h - 42);
        ctx.lineTo(w, h - 42);
        ctx.stroke();

        const rxn = this.state.reaction;
        const phen = rxn ? rxn.phenomena || {} : {};
        const showFlame = this.state.burnerOn || Boolean(phen.flameColor);

        if (showFlame) {
          const fColor = phen.flameColor || '#38BDF8';
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

        const sols = (CV.CHEMICALS || []).filter((c) => (c.state === 'Liquid' || c.category === 'solutions') && this.state.contents.includes(c.id));
        if (sols.length > 0) {
          const liqColor = phen.liquidColor || sols[0].color;
          const liqTop = vY - 115 + Math.sin(t * (this.state.stirring ? 6 : 1.5)) * (this.state.stirring ? 6 : 1.5);
          ctx.fillStyle = liqColor;
          ctx.fillRect(cx - vW, liqTop, vW * 2, 130);
        }

        const solidItem = (CV.CHEMICALS || []).find((c) => c.state === 'Solid' && this.state.contents.includes(c.id));
        if (solidItem) {
          const mx = solidItem.id === 'Na' || solidItem.id === 'K' ? cx + Math.sin(t * 4) * 24 : cx;
          const my = solidItem.id === 'Na' || solidItem.id === 'K' ? vY - 115 : vY - 24;
          ctx.fillStyle = phen.copperPlating ? '#EA580C' : solidItem.color;
          ctx.beginPath();
          if (solidItem.id === 'Fe') ctx.roundRect(mx - 6, my - 46, 12, 62, 4);
          else ctx.arc(mx, my, 12, 0, Math.PI * 2);
          ctx.fill();
        }

        if (phen.precipitate) {
          ctx.fillStyle = phen.precipitate;
          ctx.globalAlpha = 0.88;
          ctx.beginPath();
          ctx.ellipse(cx, vY - 10, vW * 0.42, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        if (phen.gas || this.state.tempC > 95) {
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
