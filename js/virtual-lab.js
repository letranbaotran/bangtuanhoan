(function () {
  const CV = window.CHEMVERSE;

  // --- Web Audio API Sound FX ---
  class StudioSoundFX {
    constructor() { this.ctx = null; this.muted = false; }
    ensure() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }
    playClick(freq = 640) {
      if (this.muted) return;
      this.ensure();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, t + 0.06);
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc.connect(g); g.connect(this.ctx.destination);
      osc.start(t); osc.stop(t + 0.08);
    }
    playPour() {
      if (this.muted) return;
      this.ensure();
      if (!this.ctx) return;
      const dur = 0.75;
      const len = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.sin((i / len) * Math.PI);
      const src = this.ctx.createBufferSource(); src.buffer = buf;
      const filter = this.ctx.createBiquadFilter(); filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1450, this.ctx.currentTime + dur);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.08, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      src.connect(filter); filter.connect(g); g.connect(this.ctx.destination);
      src.start();
    }
    playIceClink() {
      if (this.muted) return;
      this.ensure();
      if (!this.ctx) return;
      [1850, 2340].forEach((f, idx) => {
        const t = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator(); const g = this.ctx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(t); osc.stop(t + 0.15);
      });
    }
    playFizz(dur = 1.2) {
      if (this.muted) return;
      this.ensure();
      if (!this.ctx) return;
      const len = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) * 0.5;
      const src = this.ctx.createBufferSource(); src.buffer = buf;
      const filter = this.ctx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.08, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      src.connect(filter); filter.connect(g); g.connect(this.ctx.destination);
      src.start();
    }
    playSparkPop() {
      if (this.muted) return;
      this.ensure();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator(); const g = this.ctx.createGain();
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, t); osc.frequency.exponentialRampToValueAtTime(55, t + 0.22);
      g.gain.setValueAtTime(0.14, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(g); g.connect(this.ctx.destination);
      osc.start(t); osc.stop(t + 0.25);
    }
    playQuestWin() {
      if (this.muted) return;
      this.ensure();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator(); const g = this.ctx.createGain();
        osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(t); osc.stop(t + 0.3);
      });
    }
  }

  const LAB_CHEMICALS = [
    // Axit & Bazơ (10)
    { id: 'HCl', formula: 'HCl', name: 'Axit Clohiđric', cat: 'ab', state: 'liquid', color: 0xfef9c3, phDelta: -4.2, amber: false },
    { id: 'H2SO4', formula: 'H₂SO₄', name: 'Axit Sunfuric đặc', cat: 'ab', state: 'liquid', color: 0xfde047, phDelta: -4.8, amber: false },
    { id: 'HNO3', formula: 'HNO₃', name: 'Axit Nitric', cat: 'ab', state: 'liquid', color: 0xfef08a, phDelta: -4.5, amber: true },
    { id: 'CH3COOH', formula: 'CH₃COOH', name: 'Axit Axetic', cat: 'ab', state: 'liquid', color: 0xf8fafc, phDelta: -2.4, amber: false },
    { id: 'H3PO4', formula: 'H₃PO₄', name: 'Axit Photphoric', cat: 'ab', state: 'liquid', color: 0xf1f5f9, phDelta: -3.1, amber: false },
    { id: 'NaOH', formula: 'NaOH', name: 'Natri Hiđroxit', cat: 'ab', state: 'liquid', color: 0xe2e8f0, phDelta: 4.5, amber: false },
    { id: 'KOH', formula: 'KOH', name: 'Kali Hiđroxit', cat: 'ab', state: 'liquid', color: 0xf1f5f9, phDelta: 4.6, amber: false },
    { id: 'Ca(OH)2', formula: 'Ca(OH)₂', name: 'Nước vôi trong', cat: 'ab', state: 'liquid', color: 0xf8fafc, phDelta: 3.6, amber: false },
    { id: 'Ba(OH)2', formula: 'Ba(OH)₂', name: 'Bari Hiđroxit', cat: 'ab', state: 'liquid', color: 0xf1f5f9, phDelta: 4.1, amber: false },
    { id: 'NH3', formula: 'NH₃', name: 'Dung dịch Amoniac', cat: 'ab', state: 'liquid', color: 0xe0f2fe, phDelta: 3.2, amber: false },
    // Muối & Chỉ thị (21)
    { id: 'CuSO4', formula: 'CuSO₄', name: 'Đồng(II) Sunfat', cat: 'salt', state: 'liquid', color: 0x0284c7, phDelta: -0.5, amber: false },
    { id: 'FeCl3', formula: 'FeCl₃', name: 'Sắt(III) Clorua', cat: 'salt', state: 'liquid', color: 0xd97706, phDelta: -0.8, amber: true },
    { id: 'FeSO4', formula: 'FeSO₄', name: 'Sắt(II) Sunfat', cat: 'salt', state: 'liquid', color: 0x86efac, phDelta: -0.3, amber: false },
    { id: 'AgNO3', formula: 'AgNO₃', name: 'Bạc Nitrat', cat: 'salt', state: 'liquid', color: 0xf1f5f9, phDelta: 0, amber: true },
    { id: 'BaCl2', formula: 'BaCl₂', name: 'Bari Clorua', cat: 'salt', state: 'liquid', color: 0xf8fafc, phDelta: 0, amber: false },
    { id: 'Pb(NO3)2', formula: 'Pb(NO₃)₂', name: 'Chì(II) Nitrat', cat: 'salt', state: 'liquid', color: 0xf8fafc, phDelta: -0.2, amber: false },
    { id: 'KI', formula: 'KI', name: 'Kali Iotua', cat: 'salt', state: 'liquid', color: 0xfef9c3, phDelta: 0, amber: true },
    { id: 'Na2CO3', formula: 'Na₂CO₃', name: 'Natri Cacbonat', cat: 'salt', state: 'liquid', color: 0xf8fafc, phDelta: 2.5, amber: false },
    { id: 'NaHCO3', formula: 'NaHCO₃', name: 'Natri Hiđrocacbonat', cat: 'salt', state: 'liquid', color: 0xf8fafc, phDelta: 1.4, amber: false },
    { id: 'KMnO4', formula: 'KMnO₄', name: 'Kali Pemanganat', cat: 'salt', state: 'liquid', color: 0x86198f, phDelta: 0, amber: true },
    { id: 'K2Cr2O7', formula: 'K₂Cr₂O₇', name: 'Kali Đicromat', cat: 'salt', state: 'liquid', color: 0xf97316, phDelta: -0.3, amber: true },
    { id: 'H2O2', formula: 'H₂O₂', name: 'Nước Oxi già', cat: 'salt', state: 'liquid', color: 0xe0f2fe, phDelta: -0.2, amber: true },
    { id: 'I2', formula: 'I₂ (Cồn Iot)', name: 'Dung dịch Iot', cat: 'salt', state: 'liquid', color: 0x92400e, phDelta: 0, amber: true },
    { id: 'Starch', formula: 'Hồ tinh bột', name: 'Thuốc thử Iot', cat: 'salt', state: 'liquid', color: 0xf8fafc, phDelta: 0, amber: false },
    { id: 'NaCl', formula: 'NaCl', name: 'Natri Clorua', cat: 'salt', state: 'liquid', color: 0xf8fafc, phDelta: 0, amber: false },
    { id: 'Na2SO4', formula: 'Na₂SO₄', name: 'Natri Sunfat', cat: 'salt', state: 'liquid', color: 0xf8fafc, phDelta: 0, amber: false },
    { id: 'KSCN', formula: 'KSCN', name: 'Kali Thioxianat', cat: 'salt', state: 'liquid', color: 0xf8fafc, phDelta: 0, amber: false },
    { id: 'C2H5OH', formula: 'C₂H₅OH', name: 'Ancol Etylic (Cồn)', cat: 'salt', state: 'liquid', color: 0xf0f9ff, phDelta: 0, amber: false },
    { id: 'Phenolphthalein', formula: 'Phenolphtalein', name: 'Chỉ thị Bazơ', cat: 'salt', state: 'liquid', color: 0xf8fafc, phDelta: 0, amber: false },
    { id: 'Litmus', formula: 'Quỳ tím', name: 'Chỉ thị Axit-Bazơ', cat: 'salt', state: 'liquid', color: 0x7c3aed, phDelta: 0, amber: false },
    { id: 'Bromothymol', formula: 'Bromothymol', name: 'Chỉ thị pH 6.0-7.6', cat: 'salt', state: 'liquid', color: 0x10b981, phDelta: 0, amber: false },
    // Kim loại, Oxit & Chất rắn (14)
    { id: 'Na', formula: 'Na (Rắn)', name: 'Kim loại Natri', cat: 'metal', state: 'solid', color: 0xe2e8f0, phDelta: 4.2 },
    { id: 'K', formula: 'K (Rắn)', name: 'Kim loại Kali', cat: 'metal', state: 'solid', color: 0xcbd5e1, phDelta: 4.5 },
    { id: 'Ca', formula: 'Ca (Rắn)', name: 'Kim loại Canxi', cat: 'metal', state: 'solid', color: 0xd1d5db, phDelta: 3.4 },
    { id: 'Mg', formula: 'Mg (Rắn)', name: 'Kim loại Magie', cat: 'metal', state: 'solid', color: 0xf1f5f9, phDelta: 0.4 },
    { id: 'Zn', formula: 'Zn (Rắn)', name: 'Kim loại Kẽm', cat: 'metal', state: 'solid', color: 0x94a3b8, phDelta: 0.3 },
    { id: 'Fe', formula: 'Fe (Rắn)', name: 'Kim loại Sắt', cat: 'metal', state: 'solid', color: 0x64748b, phDelta: 0.3 },
    { id: 'Cu', formula: 'Cu (Rắn)', name: 'Kim loại Đồng', cat: 'metal', state: 'solid', color: 0xd97706, phDelta: 0 },
    { id: 'Al', formula: 'Al (Rắn)', name: 'Kim loại Nhôm', cat: 'metal', state: 'solid', color: 0xf8fafc, phDelta: 0.2 },
    { id: 'CuO', formula: 'CuO (Đen)', name: 'Đồng(II) Oxit', cat: 'metal', state: 'solid', color: 0x1e293b, phDelta: 0 },
    { id: 'CaO', formula: 'CaO (Vôi sống)', name: 'Canxi Oxit', cat: 'metal', state: 'solid', color: 0xf8fafc, phDelta: 3.8 },
    { id: 'CaCO3', formula: 'CaCO₃ (Đá vôi)', name: 'Canxi Cacbonat', cat: 'metal', state: 'solid', color: 0xf8fafc, phDelta: 0.8 },
    { id: 'MnO2', formula: 'MnO₂ (Xúc tác)', name: 'Mangan Đioxit', cat: 'metal', state: 'solid', color: 0x1e293b, phDelta: 0 },
    { id: 'C6H12O6', formula: 'C₆H₁₂O₆ (Đường)', name: 'Glucozơ tinh thể', cat: 'metal', state: 'solid', color: 0xffffff, phDelta: 0 },
    { id: 'S', formula: 'S (Lưu huỳnh)', name: 'Bột Lưu huỳnh vàng', cat: 'metal', state: 'solid', color: 0xfacc15, phDelta: 0 }
  ];

  const QUESTS_DB = [
    { id: 1, title: 'NV 1: An toàn Phòng Thí Nghiệm', desc: 'Đeo kính bảo hộ và cắm cảm biến nhiệt độ vào cốc.', xp: 30, check: s => s.gogglesOn && s.sensorPlaced },
    { id: 2, title: 'NV 2: Thí nghiệm Nhiệt động học', desc: 'Đặt cốc lên bếp điện và bật nhiệt để đun nóng nước vượt quá 65°C.', xp: 45, check: s => s.temperature >= 65 },
    { id: 3, title: 'NV 3: Làm lạnh bằng Đá viên (Ice)', desc: 'Thả đá viên để hạ nhiệt độ dung dịch xuống dưới 15°C.', xp: 40, check: s => s.flags.iceUsed && s.temperature <= 15 },
    { id: 4, title: 'NV 4: Cơn mưa vàng Giả Kim', desc: 'Kết hợp Pb(NO₃)₂ và KI trong cốc để tạo kết tủa vàng lấp lánh PbI₂↓.', xp: 60, check: s => s.flags.goldenRain },
    { id: 5, title: 'NV 5: Kết tủa xanh lam Cu(OH)₂', desc: 'Pha trộn CuSO₄ và NaOH trong cốc để tạo kết tủa keo xanh lam.', xp: 50, check: s => s.flags.bluePrecip },
    { id: 6, title: 'NV 6: Chuẩn độ Phenolphtalein', desc: 'Cho NaOH và nhỏ Phenolphtalein để dung dịch hóa hồng cánh sen.', xp: 45, check: s => s.flags.phenolPink },
    { id: 7, title: 'NV 7: Trung hòa Axit - Bazơ', desc: 'Thêm HCl vào cốc đang hồng để đưa pH về trung tính (~7.0) và mất màu hồng.', xp: 55, check: s => s.flags.neutralized },
    { id: 8, title: 'NV 8: Vũ điệu Kim loại Kiềm', desc: 'Thả Natri (Na) hoặc Kali (K) vào nước để thấy phản ứng tỏa nhiệt.', xp: 55, check: s => s.flags.alkaliWater },
    { id: 9, title: 'NV 9: Giải phóng khí Hiđro (H₂)', desc: 'Cho Kẽm (Zn) hoặc Magie (Mg) tác dụng với Axit HCl.', xp: 50, check: s => s.flags.metalAcid },
    { id: 10, title: 'NV 10: Kết tủa trắng Bạc Clorua', desc: 'Kết hợp AgNO₃ và HCl (hoặc NaCl) để tạo kết tủa trắng AgCl↓.', xp: 65, check: s => s.flags.silverChloride },
    { id: 11, title: 'NV 11: Phản ứng Tráng Bạc', desc: 'Cho Glucozơ (C₆H₁₂O₆), AgNO₃ và NH₃ vào cốc để tạo lớp bạc sáng lấp lánh.', xp: 80, check: s => s.flags.silverMirror },
    { id: 12, title: 'NV 12: Phức chất Đỏ máu Sắt(III)', desc: 'Nhỏ KSCN vào dung dịch FeCl₃ để tạo dung dịch đỏ máu [Fe(SCN)]²⁺.', xp: 65, check: s => s.flags.bloodRed },
    { id: 13, title: 'NV 13: Phức chất Xanh thẫm Đồng-Amoniac', desc: 'Cho dung dịch NH₃ vào CuSO₄ để tạo phức xanh lam đậm.', xp: 70, check: s => s.flags.deepBlueCu },
    { id: 14, title: 'NV 14: Tôi vôi tỏa nhiệt (CaO + H₂O)', desc: 'Thả Vôi sống (CaO) vào nước để tạo Ca(OH)₂ và tỏa nhiệt mạnh.', xp: 55, check: s => s.flags.limeSlaking },
    { id: 15, title: 'NV 15: Đẩy Kim loại ra khỏi Muối', desc: 'Thả Sắt (Fe) hoặc Kẽm (Zn) vào dung dịch CuSO₄ để thấy đồng đỏ bám vào.', xp: 75, check: s => s.flags.metalDisplacement }
  ];

  const REACTION_RECIPES_GUIDE = [
    { title: '✨ Cơn mưa vàng Giả Kim', eq: 'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃', chems: ['Pb(NO3)2', 'KI'] },
    { title: '🪞 Phản ứng Tráng Bạc', eq: 'C₆H₁₂O₆ + AgNO₃ + NH₃ → Ag↓', chems: ['C6H12O6', 'AgNO3', 'NH3'] },
    { title: '🩸 Phức chất Đỏ máu', eq: 'FeCl₃ + 3KSCN → Fe(SCN)₃ + 3KCl', chems: ['FeCl3', 'KSCN'] },
    { title: '💙 Phức chất Xanh thẫm', eq: 'CuSO₄ + 4NH₃ → [Cu(NH₃)₄]SO₄', chems: ['CuSO4', 'NH3'] },
    { title: '🌋 Than hóa đường đặc', eq: 'C₆H₁₂O₆ + H₂SO₄(đ) → 6C + 6H₂O', chems: ['C6H12O6', 'H2SO4'] },
    { title: '🫧 Xúc tác phân hủy H₂O₂', eq: '2H₂O₂ —(MnO₂)→ 2H₂O + O₂↑', chems: ['H2O2', 'MnO2'] },
    { title: '🔥 Tôi vôi sống tỏa nhiệt', eq: 'CaO + H₂O → Ca(OH)₂ (ΔH < 0)', chems: ['CaO', 'Phenolphthalein'] },
    { title: '⚔️ Sắt đẩy Đồng khỏi muối', eq: 'Fe + CuSO₄ → FeSO₄ + Cu↓', chems: ['CuSO4', 'Fe'] }
  ];

  CV.modules['virtual-lab'] = {
    init(container) {
      this.container = container;
      this.sfx = new StudioSoundFX();
      this.activeRightTab = 'water';
      this.labState = {
        temperature: 25.0, ph: 7.0, volumeMl: 250,
        targetColor: new THREE.Color(0xdbeafe),
        precipColor: null,
        beakerOnHotplate: false, hotplateOn: false, sensorPlaced: false,
        gogglesOn: false, autoRotate360: false, rightPanelOpen: true,
        contents: new Set(['H2O']), iceCubes: [],
        tempHistory: [25, 25, 25, 25, 25, 25], phHistory: [7, 7, 7, 7, 7, 7],
        xp: 0, completedQuests: new Set(),
        flags: {
          iceUsed: false, goldenRain: false, bluePrecip: false, phenolPink: false,
          neutralized: false, alkaliWater: false, metalAcid: false, silverChloride: false,
          silverMirror: false, bloodRed: false, deepBlueCu: false, limeSlaking: false, metalDisplacement: false
        },
        logs: [],
        lastReaction: null
      };

      container.innerHTML = `
        <div class="lab3d-shell" id="lab3d-shell">
          <div id="lab3d-canvas-wrap"></div>
          <div id="lab3d-goggles-visor" class="lab3d-goggles-visor"></div>
          <div id="lab3d-danger-visor" class="lab3d-danger-visor"></div>
          <div id="lab3d-hover-tooltip" class="glass-surface lab3d-tooltip" style="display:none;">
            <div id="lab3d-tip-title" style="color:var(--accent-cyan);font-weight:700;"></div>
            <div id="lab3d-tip-sub" style="font-size:0.72rem;color:var(--text-secondary);"></div>
          </div>

          <!-- Top-Left Telemetry & Rank HUD -->
          <div class="lab3d-hud-tl glass-surface">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <div>
                <div style="display:flex;align-items:center;gap:6px;">
                  <span id="lab3d-rank-lbl" style="font-size:0.7rem;font-weight:800;color:#FBBF24;">LV.1 THỰC TẬP SINH</span>
                  <span id="lab3d-xp-lbl" class="mono" style="font-size:0.7rem;padding:1px 6px;border-radius:6px;background:rgba(20,184,166,0.25);color:#5EEAD4;">0 XP</span>
                </div>
                <div id="lab3d-eq-mini" style="font-size:0.74rem;color:var(--text-secondary);max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Sẵn sàng thí nghiệm 3D</div>
              </div>
              <div style="display:flex;gap:10px;border-left:1px solid var(--glass-border);padding-left:10px;" class="mono">
                <div><div style="font-size:0.62rem;color:var(--text-muted);">TEMP</div><strong id="lab3d-temp" style="font-size:0.82rem;color:#38BDF8;">25.0°C</strong></div>
                <div><div style="font-size:0.62rem;color:var(--text-muted);">pH</div><strong id="lab3d-ph" style="font-size:0.82rem;color:#34D399;">7.00</strong></div>
                <div><div style="font-size:0.62rem;color:var(--text-muted);">VOL</div><strong id="lab3d-vol" style="font-size:0.82rem;color:#FDE68A;">250mL</strong></div>
              </div>
            </div>
            <div id="lab3d-chips" style="display:flex;gap:4px;overflow-x:auto;padding-top:6px;margin-top:6px;border-top:1px solid rgba(255,255,255,0.08);font-size:0.72rem;" class="mono">
              <span class="cat-badge" style="color:#38BDF8;padding:1px 6px;">H₂O</span>
            </div>
          </div>

          <!-- Left Vertical Tool Strip -->
          <div class="lab3d-tools-left">
            <button class="icon-btn glass-surface" id="lab3d-btn-cam" title="Đổi góc nhìn Camera 3D">🎥</button>
            <button class="icon-btn glass-surface" id="lab3d-btn-quests" title="15 Nhiệm vụ thực hành" style="position:relative;">🎯<span id="lab3d-quest-dot" style="position:absolute;top:-4px;right:-4px;font-size:0.62rem;background:#FBBF24;color:#030712;border-radius:999px;padding:0 4px;font-weight:800;">15</span></button>
            <button class="icon-btn glass-surface" id="lab3d-btn-360" title="Xoay tự động 360°" style="font-size:0.68rem;font-weight:800;color:#FBBF24;">360°</button>
            <button class="icon-btn glass-surface" id="lab3d-btn-insp" title="Phương trình & Thang pH">📊</button>
            <button class="icon-btn glass-surface" id="lab3d-btn-guide" title="Cẩm nang 8 phản ứng mẫu">📖</button>
            <button class="icon-btn glass-surface" id="lab3d-btn-audio" title="Bật/Tắt Âm thanh">🔊</button>
          </div>

          <!-- Right Chemical Shelf Drawer -->
          <div class="lab3d-right-wrap">
            <button class="btn btn-sm btn-secondary glass-surface" id="lab3d-collapse-right">🧪 Kho Hóa Chất (${LAB_CHEMICALS.length}) ▾</button>
            <div class="lab3d-right-drawer glass-surface" id="lab3d-right-drawer">
              <input type="text" id="lab3d-search" class="input-field" style="padding:7px 10px;font-size:0.8rem;" placeholder="🔍 Tìm công thức, tên chất..." />
              <div class="lab-tabs" id="lab3d-tabs">
                <button class="lab-tab-btn active" data-tab="water">💧 Nhiệt</button>
                <button class="lab-tab-btn" data-tab="ab">🧪 Ax/Bz</button>
                <button class="lab-tab-btn" data-tab="salt">⚗️ Muối</button>
                <button class="lab-tab-btn" data-tab="metal">🔩 Rắn</button>
              </div>
              <div id="lab3d-items-list" style="overflow-y:auto;max-height:38vh;display:flex;flex-direction:column;gap:6px;"></div>
              <div style="border-top:1px solid var(--glass-border);padding-top:8px;display:flex;flex-direction:column;gap:6px;">
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;">
                  <button class="btn btn-secondary btn-sm" id="lab3d-act-hp" style="font-size:0.72rem;padding:5px;">🔥 Bếp điện</button>
                  <button class="btn btn-secondary btn-sm" id="lab3d-act-ice" style="font-size:0.72rem;padding:5px;">🧊 Đá viên</button>
                  <button class="btn btn-secondary btn-sm" id="lab3d-act-stir" style="font-size:0.72rem;padding:5px;">🥢 Khuấy</button>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  <button class="btn btn-secondary btn-sm" id="lab3d-act-export" style="font-size:0.72rem;">📄 Báo cáo</button>
                  <button class="btn btn-sm" id="lab3d-act-reset" style="font-size:0.72rem;background:rgba(220,38,38,0.28);border:1px solid rgba(248,113,113,0.45);color:#FCA5A5;">🔄 Rửa Cốc</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Floating Popover Drawers (Quests / Inspector / Guide) -->
          <div id="lab3d-quests-drawer" class="lab3d-pop-drawer glass-surface" style="display:none;"></div>
          <div id="lab3d-insp-drawer" class="lab3d-pop-drawer glass-surface" style="display:none;"></div>
          <div id="lab3d-guide-drawer" class="lab3d-pop-drawer glass-surface" style="display:none;"></div>
        </div>
      `;

      this.initThreeScene();
      this.bindUI();
      this.renderRightList();
      this.renderQuests();
      this.renderGuide();
      this.renderInspector();
      this.startLoop();
    },

    onShow() {
      if (this.renderer && this.camera && this.wrap) {
        const w = this.wrap.clientWidth;
        const h = this.wrap.clientHeight;
        if (w && h) {
          this.camera.aspect = w / h;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(w, h);
        }
      }
    },

    initThreeScene() {
      const wrap = document.getElementById('lab3d-canvas-wrap');
      this.wrap = wrap;
      if (!wrap || typeof THREE === 'undefined') return;

      const w = wrap.clientWidth || window.innerWidth;
      const h = wrap.clientHeight || window.innerHeight - 68;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b1224);
      scene.fog = new THREE.FogExp2(0x0b1224, 0.042);

      const camera = new THREE.PerspectiveCamera(44, w / h, 0.08, 60);
      this.VIEWS = {
        bench: { pos: new THREE.Vector3(0.0, 2.22, 1.88), target: new THREE.Vector3(0.0, 1.56, 0.08) },
        beaker: { pos: new THREE.Vector3(0.18, 1.82, 1.18), target: new THREE.Vector3(0.04, 1.46, 0.42) },
        shelf: { pos: new THREE.Vector3(0.0, 2.38, 1.15), target: new THREE.Vector3(0.0, 2.08, -0.25) },
        graph: { pos: new THREE.Vector3(-0.88, 1.85, 1.12), target: new THREE.Vector3(-1.18, 1.72, 0.16) },
        laptop: { pos: new THREE.Vector3(0.75, 1.76, 0.96), target: new THREE.Vector3(0.96, 1.48, 0.14) },
        wide: { pos: new THREE.Vector3(1.55, 2.65, 2.55), target: new THREE.Vector3(0.0, 1.52, 0.0) }
      };
      this.VIEW_KEYS = Object.keys(this.VIEWS);
      this.viewIdx = 0;
      camera.position.copy(this.VIEWS.bench.pos);

      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      wrap.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.target.copy(this.VIEWS.bench.target);
      controls.enableDamping = true;
      controls.dampingFactor = 0.065;
      controls.minDistance = 0.55;
      controls.maxDistance = 5.8;
      controls.maxPolarAngle = Math.PI / 2 - 0.04;
      controls.addEventListener('start', () => { this.isCamLerping = false; });

      this.scene = scene; this.camera = camera; this.renderer = renderer; this.controls = controls;
      this.interactiveObjects = [];
      this.particles = [];
      this.hotplateCoils = [];
      this.pourAnimTimer = 0;
      this.tongsDropTimer = 0;
      this.screenShakeIntensity = 0;
      this.BEAKER_BENCH = new THREE.Vector3(0.06, 1.305, 0.56);
      this.BEAKER_HOTPLATE = new THREE.Vector3(-0.18, 1.402, 0.15);
      this.beakerTargetPos = this.BEAKER_BENCH.clone();
      this.targetCamPos = this.VIEWS.bench.pos.clone();
      this.targetCamLook = this.VIEWS.bench.target.clone();
      this.isCamLerping = false;

      // Lighting
      const hemi = new THREE.HemisphereLight(0xffffff, 0x475569, 0.95);
      hemi.position.set(0, 7, 0); scene.add(hemi);
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
      keyLight.position.set(2.8, 6.8, 3.8); keyLight.castShadow = true;
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
      rimLight.position.set(-3.2, 4.2, -3.5); scene.add(rimLight);

      this.glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transparent: true, opacity: 0.34, roughness: 0.05, metalness: 0.05, clearcoat: 1.0, side: THREE.DoubleSide, depthWrite: false
      });

      this.buildLabRoom();
      this.buildWorkbench();
      this.buildGraphMonitor();
      this.buildHotplateAndBeaker();
      this.buildLaptopAndIce();
      this.buildUpperShelf();
      this.buildRigsAndParticles();

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const tip = document.getElementById('lab3d-hover-tooltip');

      renderer.domElement.addEventListener('pointermove', (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(this.interactiveObjects);
        if (hits.length > 0) {
          renderer.domElement.style.cursor = 'pointer';
          const d = hits[0].object.userData;
          tip.style.display = 'block';
          tip.style.left = Math.min(rect.width - 210, Math.max(10, e.clientX - rect.left + 12)) + 'px';
          tip.style.top = Math.min(rect.height - 70, Math.max(10, e.clientY - rect.top - 48)) + 'px';
          document.getElementById('lab3d-tip-title').textContent = d.title;
          document.getElementById('lab3d-tip-sub').textContent = d.sub;
        } else {
          renderer.domElement.style.cursor = 'grab';
          tip.style.display = 'none';
        }
      });

      let downPos = { x: 0, y: 0 };
      renderer.domElement.addEventListener('pointerdown', (e) => { downPos = { x: e.clientX, y: e.clientY }; });
      renderer.domElement.addEventListener('pointerup', (e) => {
        if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(this.interactiveObjects);
        if (hits.length > 0) {
          const d = hits[0].object.userData;
          if (d.type === 'bottle') this.addChemical(d.chemId);
          else if (d.type === 'hotplate') this.toggleHotplatePower();
          else if (d.type === 'ice') this.addIceCubes();
          else if (d.type === 'sensor') this.toggleTempSensor();
          else if (d.type === 'beaker') this.stirRod();
          else if (d.type === 'view') this.setCameraView(d.view);
        }
      });

      window.addEventListener('resize', () => this.onShow());
    },

    buildLabRoom() {
      const s = this.scene;
      s.background = new THREE.Color(0x1e293b);
      s.fog = new THREE.FogExp2(0x1e293b, 0.036);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x334155, roughness: 0.22, metalness: 0.15, clearcoat: 0.45 })
      );
      floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; s.add(floor);

      // Ceiling & LED Light Panels
      const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), new THREE.MeshBasicMaterial({ color: 0xe2e8f0 }));
      ceiling.rotation.x = Math.PI / 2; ceiling.position.y = 4.5; s.add(ceiling);
      [-2.4, 0, 2.4].forEach((lx) => {
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 6.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        panel.rotation.x = Math.PI / 2; panel.position.set(lx, 4.48, -1.8); s.add(panel);
      });

      const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 4.6, 0.25), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45 }));
      backWall.position.set(0, 2.3, -6.5); s.add(backWall);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(13.8, 0.06, 0.28), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
      stripe.position.set(0, 3.25, -6.48); s.add(stripe);

      // Glowing Periodic Table Wall Board
      const ptCanvas = document.createElement('canvas');
      ptCanvas.width = 512; ptCanvas.height = 256;
      const pctx = ptCanvas.getContext('2d');
      pctx.fillStyle = '#0f172a'; pctx.fillRect(0, 0, 512, 256);
      pctx.strokeStyle = '#38bdf8'; pctx.lineWidth = 4; pctx.strokeRect(4, 4, 504, 248);
      pctx.fillStyle = '#38bdf8'; pctx.font = 'bold 16px JetBrains Mono, monospace';
      pctx.fillText('PERIODIC TABLE OF ELEMENTS — CHEMVERSE NATIONAL LAB', 22, 28);
      const ptColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981', '#a855f7'];
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 18; c++) {
          if (r === 0 && c > 0 && c < 17) continue;
          if ((r === 1 || r === 2) && c > 1 && c < 12) continue;
          pctx.fillStyle = ptColors[(c + r) % ptColors.length];
          pctx.fillRect(24 + c * 26, 46 + r * 26, 22, 22);
        }
      }
      const ptBoard = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ptCanvas) }));
      ptBoard.position.set(2.3, 2.45, -6.34); s.add(ptBoard);

      // Glass Partition & Frames
      const glassPart = new THREE.Mesh(
        new THREE.PlaneGeometry(11, 3.8),
        new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9, transparent: true, opacity: 0.18, roughness: 0.06, clearcoat: 1.0 })
      );
      glassPart.position.set(0, 1.9, -2.45); s.add(glassPart);
      [-3.8, -1.2, 1.2, 3.8].forEach((px) => {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.9, 0.1), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
        frame.position.set(px, 1.95, -2.45); s.add(frame);
      });

      const fumeHood = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.3, 0.8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      fumeHood.position.set(-2.5, 1.15, -4.4); s.add(fumeHood);
      const fumeWin = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 1.05), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 }));
      fumeWin.position.set(-2.5, 1.55, -3.99); s.add(fumeWin);
    },

    buildWorkbench() {
      const s = this.scene;
      const epoxy = new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9, roughness: 0.2, clearcoat: 0.6 });
      const darkBase = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45 });
      const mainTop = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.1, 1.48), epoxy);
      mainTop.position.set(0, 1.255, 0.18); mainTop.receiveShadow = true; s.add(mainTop);
      const lowerCab = new THREE.Mesh(new THREE.BoxGeometry(3.35, 1.2, 1.32), darkBase);
      lowerCab.position.set(0, 0.6, 0.18); s.add(lowerCab);
      [-0.95, 0.95].forEach((px) => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.68, 0.16), epoxy);
        pillar.position.set(px, 1.64, -0.25); s.add(pillar);
      });
      const upperShelf = new THREE.Mesh(new THREE.BoxGeometry(3.35, 0.075, 0.44), epoxy);
      upperShelf.position.set(0, 1.98, -0.25); s.add(upperShelf);
    },

    buildGraphMonitor() {
      const mon = new THREE.Group();
      mon.position.set(-1.18, 1.72, 0.16); mon.rotation.y = 0.28;
      mon.add(new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.64, 0.04), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5 })));
      this.graphCanvas = document.createElement('canvas');
      this.graphCanvas.width = 512; this.graphCanvas.height = 350;
      this.graphCtx = this.graphCanvas.getContext('2d');
      this.graphTex = new THREE.CanvasTexture(this.graphCanvas);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.58), new THREE.MeshBasicMaterial({ map: this.graphTex }));
      scr.position.z = 0.022; mon.add(scr);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.05), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 }));
      neck.position.set(0, -0.34, -0.02); mon.add(neck);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.22), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      foot.position.set(0, -0.41, 0.02); mon.add(foot);
      const hit = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.66, 0.1), new THREE.MeshBasicMaterial({ visible: false }));
      hit.userData = { type: 'view', view: 'graph', title: '📈 Màn Hình Đồ Thị Nhiệt Độ & pH', sub: 'Click để phóng to biểu đồ' };
      mon.add(hit); this.interactiveObjects.push(hit);
      this.scene.add(mon);
      this.drawGraphTex();

      // Side Beaker + Erlenmeyer + Retort Stand on Left
      const frontB = this.createBeakerMesh(0.072, 0.19);
      frontB.position.set(-1.12, 1.305, 0.54); this.scene.add(frontB);
      const erlenmeyer = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.074, 0.18, 24, 1, true), this.glassMat);
      erlenmeyer.position.set(-0.92, 1.395, 0.48); this.scene.add(erlenmeyer);

      const stand = new THREE.Group(); stand.position.set(-0.66, 1.305, 0.46);
      const sBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.016, 0.24), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 }));
      sBase.position.y = 0.008; stand.add(sBase);
      const sRod = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.56, 12), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9 }));
      sRod.position.set(0, 0.28, -0.07); stand.add(sRod);
      const clampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22, 10), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 }));
      clampArm.rotation.z = Math.PI / 2; clampArm.position.set(0.08, 0.34, -0.07); stand.add(clampArm);
      this.scene.add(stand);
    },

    createBeakerMesh(r, h) {
      const g = new THREE.Group();
      const wall = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.97, h, 32, 1, true), this.glassMat);
      wall.position.y = h / 2; g.add(wall);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.97, r * 0.97, 0.008, 32), this.glassMat);
      base.position.y = 0.004; g.add(base);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.0035, 10, 32), this.glassMat);
      rim.rotation.x = Math.PI / 2; rim.position.y = h; g.add(rim);

      // Printed mL Graduations
      const scaleCanvas = document.createElement('canvas');
      scaleCanvas.width = 128; scaleCanvas.height = 256;
      const ctx = scaleCanvas.getContext('2d');
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = 'bold 16px JetBrains Mono, monospace';
      for (let i = 1; i <= 5; i++) {
        const y = 230 - i * 38;
        ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(22, y); ctx.lineTo(54, y); ctx.stroke();
        ctx.fillText(`${i * 200}`, 60, y + 5);
      }
      const scalePlane = new THREE.Mesh(
        new THREE.CylinderGeometry(r + 0.0008, r * 0.97 + 0.0008, h * 0.85, 24, 1, true, -0.45, 0.9),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(scaleCanvas), transparent: true, side: THREE.DoubleSide })
      );
      scalePlane.position.y = h * 0.48; g.add(scalePlane);
      return g;
    },

    buildHotplateAndBeaker() {
      const hp = new THREE.Group(); hp.position.set(-0.04, 1.305, 0.16);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.085, 0.32), new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.25 }));
      body.position.y = 0.0425; hp.add(body);
      [-0.14, 0.14].forEach((cx) => {
        const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.108, 0.018, 32), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 }));
        coil.position.set(cx, 0.092, -0.01); hp.add(coil);
        this.hotplateCoils.push(coil);
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.022, 20), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
        knob.rotation.x = Math.PI / 2; knob.position.set(cx, 0.042, 0.168); hp.add(knob);
      });
      this.hotplateLedMesh = new THREE.Mesh(new THREE.SphereGeometry(0.008, 12, 12), new THREE.MeshBasicMaterial({ color: 0x475569 }));
      this.hotplateLedMesh.position.set(0, 0.045, 0.165); hp.add(this.hotplateLedMesh);
      this.hotplateLight = new THREE.PointLight(0xff3b00, 0, 1.4);
      this.hotplateLight.position.set(-0.14, 0.22, 0); hp.add(this.hotplateLight);
      const hpHit = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.35), new THREE.MeshBasicMaterial({ visible: false }));
      hpHit.position.y = 0.06; hpHit.userData = { type: 'hotplate', title: '🔥 Bếp Điện Đôi Gia Nhiệt', sub: 'Click để Bật/Tắt nhiệt' };
      hp.add(hpHit); this.interactiveObjects.push(hpHit);
      this.scene.add(hp);

      this.primaryBeaker = this.createBeakerMesh(0.088, 0.225);
      this.primaryBeaker.position.copy(this.BEAKER_BENCH);
      this.liquidMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.082, 0.08, 0.11, 32),
        new THREE.MeshPhysicalMaterial({ color: 0xdbeafe, transparent: true, opacity: 0.78, roughness: 0.08 })
      );
      this.liquidMesh.position.y = 0.058; this.primaryBeaker.add(this.liquidMesh);
      this.meniscusMesh = new THREE.Mesh(new THREE.RingGeometry(0.001, 0.082, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.38, side: THREE.DoubleSide }));
      this.meniscusMesh.rotation.x = -Math.PI / 2; this.meniscusMesh.position.y = 0.113; this.primaryBeaker.add(this.meniscusMesh);
      this.stirBarMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.044, 14), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      this.stirBarMesh.rotation.z = Math.PI / 2; this.stirBarMesh.position.y = 0.012; this.primaryBeaker.add(this.stirBarMesh);
      this.precipitateMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.079, 0.08, 0.026, 28), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.85 }));
      this.precipitateMesh.position.y = 0.015; this.precipitateMesh.visible = false; this.primaryBeaker.add(this.precipitateMesh);
      this.iceGroup = new THREE.Group(); this.primaryBeaker.add(this.iceGroup);
      this.stirRodMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.26, 12), this.glassMat);
      this.stirRodMesh.position.set(0.02, 0.14, 0); this.stirRodMesh.rotation.z = -0.22; this.stirRodMesh.visible = false; this.primaryBeaker.add(this.stirRodMesh);

      const bHit = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.23, 16), new THREE.MeshBasicMaterial({ visible: false }));
      bHit.position.y = 0.115; bHit.userData = { type: 'beaker', title: '🧪 Cốc Đong Phản Ứng 1000mL', sub: 'Click để khuấy đều dung dịch' };
      this.primaryBeaker.add(bHit); this.interactiveObjects.push(bHit);
      this.scene.add(this.primaryBeaker);

      // Sensor
      const sg = new THREE.Group(); sg.position.set(-0.24, 1.318, 0.62);
      sg.add(new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.022, 0.03), new THREE.MeshStandardMaterial({ color: 0x0f172a })));
      this.probeRod = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.26, 12), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
      this.probeRod.rotation.z = Math.PI / 2; this.probeRod.position.set(-0.16, 0, 0); sg.add(this.probeRod);
      const sHit = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.08), new THREE.MeshBasicMaterial({ visible: false }));
      sHit.position.x = -0.1; sHit.userData = { type: 'sensor', title: '🌡️ Cảm Biến Nhiệt Độ', sub: 'Click để cắm/rút đầu dò' };
      sg.add(sHit); this.interactiveObjects.push(sHit);
      this.scene.add(sg);
    },

    buildLaptopAndIce() {
      const dish = new THREE.Group(); dish.position.set(0.56, 1.305, 0.54);
      const dMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.09, 0.026, 28), new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.15 }));
      dMesh.position.y = 0.013; dish.add(dMesh);
      const iceMat = new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.82 });
      [[-0.035, 0.025, -0.02], [0.032, 0.026, -0.015], [0, 0.027, 0.03]].forEach(([ix, iy, iz]) => {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.035, 0.042), iceMat);
        c.position.set(ix, iy, iz); dish.add(c);
      });
      const iHit = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16), new THREE.MeshBasicMaterial({ visible: false }));
      iHit.position.y = 0.04; iHit.userData = { type: 'ice', title: '🧊 Đĩa Đá Viên (Ice)', sub: 'Click để thả đá vào cốc' };
      dish.add(iHit); this.interactiveObjects.push(iHit);
      this.scene.add(dish);

      const lap = new THREE.Group(); lap.position.set(0.96, 1.305, 0.14); lap.rotation.y = -0.32;
      const silver = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.82, roughness: 0.22 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.016, 0.32), silver); base.position.y = 0.008; lap.add(base);
      const lidPivot = new THREE.Group(); lidPivot.position.set(0, 0.016, -0.155); lidPivot.rotation.x = -0.32;
      const lid = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.31, 0.012), silver); lid.position.y = 0.155; lidPivot.add(lid);
      this.laptopCanvas = document.createElement('canvas'); this.laptopCanvas.width = 512; this.laptopCanvas.height = 340;
      this.laptopCtx = this.laptopCanvas.getContext('2d'); this.laptopTex = new THREE.CanvasTexture(this.laptopCanvas);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.43, 0.28), new THREE.MeshBasicMaterial({ map: this.laptopTex }));
      scr.position.set(0, 0.155, 0.008); lidPivot.add(scr); lap.add(lidPivot);
      const lHit = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.35, 0.35), new THREE.MeshBasicMaterial({ visible: false }));
      lHit.position.y = 0.17; lHit.userData = { type: 'view', view: 'laptop', title: '💻 Laptop Đo Lường CHEMVERSE', sub: 'Click để soi màn hình thông số' };
      lap.add(lHit); this.interactiveObjects.push(lHit);
      this.scene.add(lap);
      this.updateLaptopTex();
    },

    buildUpperShelf() {
      const amberGlass = new THREE.MeshPhysicalMaterial({ color: 0x92400e, transparent: true, opacity: 0.74, roughness: 0.08 });
      LAB_CHEMICALS.slice(0, 16).forEach((chem, idx) => {
        const bx = -1.35 + idx * 0.18;
        const bz = -0.24 + (idx % 2 === 0 ? -0.05 : 0.05);
        const bg = new THREE.Group(); bg.position.set(bx, 2.02, bz);
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.038, 0.145, 18), chem.amber ? amberGlass : this.glassMat);
        body.position.y = 0.0725; bg.add(body);
        const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.033, 0.095, 14), new THREE.MeshBasicMaterial({ color: chem.color, transparent: true, opacity: 0.85 }));
        liq.position.y = 0.05; bg.add(liq);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.032, 14), new THREE.MeshStandardMaterial({ color: chem.cat === 'ab' ? 0xdc2626 : 0x2563eb }));
        cap.position.y = 0.158; bg.add(cap);

        // Printed Formula Label on Bottle
        const lblCanvas = document.createElement('canvas');
        lblCanvas.width = 128; lblCanvas.height = 64;
        const ctx = lblCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 128, 64);
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 5; ctx.strokeRect(2, 2, 124, 60);
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 24px JetBrains Mono, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(chem.id, 64, 34);
        const labelMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.039, 0.039, 0.055, 16, 1, true, -0.7, 1.4),
          new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lblCanvas) })
        );
        labelMesh.position.y = 0.075; bg.add(labelMesh);

        const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 10), new THREE.MeshBasicMaterial({ visible: false }));
        hit.position.y = 0.09; hit.userData = { type: 'bottle', chemId: chem.id, title: `🧪 Lọ ${chem.formula} — ${chem.name}`, sub: 'Click để rót vào cốc!' };
        bg.add(hit); this.interactiveObjects.push(hit);
        this.scene.add(bg);
      });

      // 5-Tube Colored Test Tube Rack on Upper Shelf
      const rack = new THREE.Group(); rack.position.set(-0.22, 2.02, -0.22);
      const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 });
      const rBase = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.012, 0.075), rackMat); rBase.position.y = 0.006; rack.add(rBase);
      const rTop = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.01, 0.075), rackMat); rTop.position.y = 0.11; rack.add(rTop);
      [-0.13, 0.13].forEach((px) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.11, 8), rackMat);
        post.position.set(px, 0.055, 0); rack.add(post);
      });
      [0x0284c7, 0xec4899, 0xfacc15, 0x10b981, 0x8b5cf6].forEach((col, i) => {
        const tx = -0.09 + i * 0.045;
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 16), this.glassMat);
        tube.position.set(tx, 0.085, 0); rack.add(tube);
        const tLiq = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.08, 12), new THREE.MeshBasicMaterial({ color: col }));
        tLiq.position.set(tx, 0.05, 0); rack.add(tLiq);
        const tCap = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 12), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
        tCap.position.set(tx, 0.162, 0); rack.add(tCap);
      });
      this.scene.add(rack);
    },

    buildRigsAndParticles() {
      this.pourBottle = new THREE.Group(); this.pourBottle.visible = false;
      this.pourBottle.add(new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.045, 0.17, 18), this.glassMat));
      this.pourStream = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.007, 0.24, 10), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 }));
      this.pourStream.visible = false;
      this.scene.add(this.pourBottle); this.scene.add(this.pourStream);

      this.tongsGroup = new THREE.Group(); this.tongsGroup.visible = false;
      this.tongsSample = new THREE.Mesh(new THREE.DodecahedronGeometry(0.018, 0), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85 }));
      this.tongsGroup.add(this.tongsSample); this.scene.add(this.tongsGroup);

      this.MAX_P = 500;
      this.pGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(this.MAX_P * 3);
      const col = new Float32Array(this.MAX_P * 3);
      for (let i = 0; i < this.MAX_P; i++) pos[i * 3 + 1] = -50;
      this.pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      this.pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      this.scene.add(new THREE.Points(this.pGeo, new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.9 })));
    },

    spawnParticles(origin, hex, count = 35, vy = 0.02) {
      const c = new THREE.Color(hex);
      for (let i = 0; i < count; i++) {
        if (this.particles.length >= this.MAX_P) this.particles.shift();
        this.particles.push({
          x: origin.x + (Math.random() - 0.5) * 0.09, y: origin.y + (Math.random() - 0.5) * 0.04, z: origin.z + (Math.random() - 0.5) * 0.09,
          vx: (Math.random() - 0.5) * 0.012, vy: vy * (0.55 + Math.random() * 0.9), vz: (Math.random() - 0.5) * 0.012,
          life: 1.0, decay: 0.015 + Math.random() * 0.01, r: c.r, g: c.g, b: c.b
        });
      }
    },

    drawGraphTex() {
      const ctx = this.graphCtx; if (!ctx) return;
      const w = 512, h = 350, ls = this.labState;
      ctx.fillStyle = '#070b14'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(148,163,184,0.2)'; ctx.lineWidth = 1;
      for (let x = 48; x <= w - 16; x += 44) { ctx.beginPath(); ctx.moveTo(x, 24); ctx.lineTo(x, h - 36); ctx.stroke(); }
      for (let y = 24; y <= h - 36; y += 36) { ctx.beginPath(); ctx.moveTo(48, y); ctx.lineTo(w - 16, y); ctx.stroke(); }
      ctx.font = 'bold 15px JetBrains Mono, monospace';
      ctx.fillStyle = '#38bdf8'; ctx.fillText(`TEMP: ${ls.temperature.toFixed(1)}°C`, 62, 20);
      ctx.fillStyle = '#facc15'; ctx.fillText(`pH: ${ls.ph.toFixed(2)}`, 245, 20);

      const drawLine = (arr, maxV, col) => {
        ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath();
        arr.forEach((v, idx) => {
          const px = 48 + (idx / Math.max(1, arr.length - 1)) * (w - 72);
          const py = (h - 36) - (Math.min(maxV, Math.max(0, v)) / maxV) * (h - 68);
          if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
      };
      drawLine(ls.tempHistory, 100, '#38bdf8');
      drawLine(ls.phHistory, 14, '#facc15');
      this.graphTex.needsUpdate = true;
    },

    updateLaptopTex() {
      const ctx = this.laptopCtx; if (!ctx) return;
      const ls = this.labState;
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, 512, 340);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, 512, 42);
      ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 18px JetBrains Mono, monospace';
      ctx.fillText('CHEMVERSE TELEMETRY OS 3D', 18, 27);
      ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 24px JetBrains Mono, monospace';
      ctx.fillText(`Nhiệt độ : ${ls.temperature.toFixed(1)} °C`, 22, 88);
      ctx.fillStyle = '#34d399'; ctx.fillText(`Độ pH    : ${ls.ph.toFixed(2)}`, 22, 128);
      ctx.fillStyle = '#fbbf24'; ctx.fillText(`Thể tích : ${ls.volumeMl} mL`, 22, 168);
      ctx.fillStyle = '#e0f2fe'; ctx.font = 'bold 14px JetBrains Mono, monospace';
      const eq = ls.lastReaction ? ls.lastReaction.eq : 'Chưa có phản ứng';
      ctx.fillText(eq.slice(0, 44), 22, 225);
      this.laptopTex.needsUpdate = true;
    },

    getTop() { return new THREE.Vector3(this.primaryBeaker.position.x, this.primaryBeaker.position.y + 0.14, this.primaryBeaker.position.z); },

    addWater(type) {
      this.sfx.playPour(); this.pourAnimTimer = 0.9; this.pourBottle.visible = true; this.pourStream.visible = true;
      this.pourStream.material.color.setHex(0x38bdf8);
      this.labState.contents.add('H2O');
      this.labState.volumeMl = Math.min(950, this.labState.volumeMl + 150);
      if (type === 'boiling') { this.labState.temperature = 92; this.spawnParticles(this.getTop(), 0xffffff, 45, 0.025); }
      else if (type === 'cold') this.labState.temperature = 8;
      else this.labState.temperature = (this.labState.temperature + 25) / 2;
      this.logReaction('💧 Thêm 150mL nước (' + type + ')');
      this.updateHUD();
    },

    toggleBeakerHotplate() {
      this.labState.beakerOnHotplate = !this.labState.beakerOnHotplate;
      this.beakerTargetPos.copy(this.labState.beakerOnHotplate ? this.BEAKER_HOTPLATE : this.BEAKER_BENCH);
      this.sfx.playClick(520);
      CV.showToast(this.labState.beakerOnHotplate ? '🔥 Đã đặt cốc lên bếp điện!' : '🧪 Đã đưa cốc về bàn.');
    },

    toggleHotplatePower() {
      this.labState.hotplateOn = !this.labState.hotplateOn;
      this.sfx.playClick(740);
      this.hotplateLedMesh.material.color.setHex(this.labState.hotplateOn ? 0xef4444 : 0x475569);
      CV.showToast(this.labState.hotplateOn ? '⚡ Bếp điện đang gia nhiệt!' : '🔌 Đã tắt bếp điện.');
    },

    addIceCubes() {
      this.sfx.playIceClink();
      this.labState.flags.iceUsed = true;
      const mat = new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.84 });
      for (let i = 0; i < 3; i++) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.026, 0.032), mat);
        c.position.set((Math.random() - 0.5) * 0.07, 0.12, (Math.random() - 0.5) * 0.07);
        this.iceGroup.add(c); this.labState.iceCubes.push({ mesh: c, mass: 1.0 });
      }
      this.logReaction('🧊 Đã thả 3 viên đá làm lạnh dung dịch!');
      this.evaluateQuests();
    },

    toggleTempSensor() {
      this.labState.sensorPlaced = !this.labState.sensorPlaced;
      this.sfx.playClick(680);
      if (this.labState.sensorPlaced) { this.probeRod.rotation.z = 0.25; this.probeRod.position.set(0.24, 0.14, -0.08); }
      else { this.probeRod.rotation.z = Math.PI / 2; this.probeRod.position.set(-0.16, 0, 0); }
      this.evaluateQuests();
    },

    stirRod() {
      this.sfx.playClick(820);
      this.stirRodMesh.visible = true; this.stirRodMesh.userData.spinTimer = 1.6;
      this.spawnParticles(this.getTop(), 0xffffff, 18, 0.014);
    },

    toggleGoggles() {
      this.labState.gogglesOn = !this.labState.gogglesOn;
      document.getElementById('lab3d-goggles-visor').style.opacity = this.labState.gogglesOn ? '1' : '0';
      this.evaluateQuests();
    },

    addChemical(chemId) {
      const chem = LAB_CHEMICALS.find((c) => c.id === chemId);
      if (!chem) return;
      const ls = this.labState;
      const top = this.getTop();
      ls.contents.add(chem.id);
      ls.ph = Math.min(14, Math.max(0.5, ls.ph + (chem.phDelta || 0)));

      if (chem.state === 'liquid') {
        this.sfx.playPour();
        this.pourAnimTimer = 0.9; this.pourBottle.visible = true; this.pourStream.visible = true;
        this.pourStream.material.color.setHex(chem.color);
        ls.volumeMl = Math.min(980, ls.volumeMl + 50);
        ls.targetColor.lerp(new THREE.Color(chem.color), 0.52);
      } else {
        this.sfx.playClick(600);
        this.tongsDropTimer = 0.85; this.tongsGroup.visible = true;
        this.tongsSample.material.color.setHex(chem.color);
        this.spawnParticles(top, chem.color, 24, 0.016);
      }

      if (['Na', 'K'].includes(chem.id) && !ls.gogglesOn) {
        const d = document.getElementById('lab3d-danger-visor');
        d.classList.remove('danger-flash'); void d.offsetWidth; d.classList.add('danger-flash');
        CV.showToast('🚨 CẢNH BÁO: Hãy đeo Kính bảo hộ khi thử kim loại kiềm!');
      }

      const c = ls.contents;
      let eq = null;
      if (c.has('C6H12O6') && c.has('AgNO3') && c.has('NH3')) {
        ls.targetColor.setHex(0xcbd5e1); this.setPrecip(0xf8fafc); this.spawnParticles(top, 0xffffff, 70, 0.022);
        ls.flags.silverMirror = true; eq = 'C₆H₁₂O₆ + 2[Ag(NH₃)₂]OH → C₅H₁₁O₅COONH₄ + 2Ag↓ + 3NH₃ + H₂O';
      } else if (c.has('FeCl3') && c.has('KSCN')) {
        ls.targetColor.setHex(0x7f1d1d); ls.flags.bloodRed = true; eq = 'FeCl₃ + 3KSCN ⇌ Fe(SCN)₃ (Đỏ máu) + 3KCl';
      } else if (c.has('CuSO4') && c.has('NH3')) {
        ls.targetColor.setHex(0x1d4ed8); this.precipitateMesh.visible = false; ls.flags.deepBlueCu = true; eq = 'CuSO₄ + 4NH₃ → [Cu(NH₃)₄]SO₄';
      } else if (c.has('Pb(NO3)2') && c.has('KI')) {
        ls.targetColor.setHex(0xfef08a); this.setPrecip(0xfacc15); this.spawnParticles(top, 0xfacc15, 70, 0.02);
        ls.flags.goldenRain = true; eq = 'Pb(NO₃)₂ + 2KI → PbI₂↓ (Vàng) + 2KNO₃';
      } else if (c.has('CuSO4') && (c.has('NaOH') || c.has('KOH'))) {
        ls.targetColor.setHex(0x7dd3fc); this.setPrecip(0x0284c7); ls.flags.bluePrecip = true; eq = 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄';
      } else if (c.has('FeCl3') && (c.has('NaOH') || c.has('KOH'))) {
        ls.targetColor.setHex(0xfef3c7); this.setPrecip(0x9a3412); eq = 'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl';
      } else if (c.has('AgNO3') && (c.has('HCl') || c.has('NaCl'))) {
        ls.targetColor.setHex(0xf1f5f9); this.setPrecip(0xffffff); ls.flags.silverChloride = true; eq = 'AgNO₃ + NaCl → AgCl↓ + NaNO₃';
      } else if ((c.has('BaCl2') || c.has('Ba(OH)2')) && (c.has('H2SO4') || c.has('CuSO4') || c.has('Na2SO4'))) {
        ls.targetColor.setHex(0xf1f5f9); this.setPrecip(0xffffff); eq = 'BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl';
      } else if (c.has('CaO')) {
        this.sfx.playFizz(1.2); ls.temperature = Math.min(92, ls.temperature + 22); ls.flags.limeSlaking = true;
        this.spawnParticles(top, 0xffffff, 45, 0.022); eq = 'CaO + H₂O → Ca(OH)₂';
      } else if (c.has('CuSO4') && (c.has('Fe') || c.has('Zn'))) {
        ls.targetColor.setHex(0x86efac); this.setPrecip(0xb45309); ls.flags.metalDisplacement = true; eq = 'Fe + CuSO₄ → FeSO₄ + Cu↓';
      } else if (['Na', 'K', 'Ca'].includes(chem.id)) {
        this.sfx.playSparkPop(); this.screenShakeIntensity = 0.024; ls.temperature = Math.min(96, ls.temperature + 26);
        this.spawnParticles(top, chem.id === 'K' ? 0xd946ef : 0xf97316, 70, 0.036);
        ls.flags.alkaliWater = true; eq = `2${chem.id} + 2H₂O → 2${chem.id}OH + H₂↑`;
      } else if (['Zn', 'Mg', 'Fe', 'Al'].includes(chem.id) && (c.has('HCl') || c.has('H2SO4'))) {
        this.sfx.playFizz(1.5); ls.temperature = Math.min(90, ls.temperature + 10);
        this.spawnParticles(top, 0xffffff, 55, 0.026); ls.flags.metalAcid = true; eq = `${chem.id} + 2HCl → ${chem.id}Cl₂ + H₂↑`;
      } else if (c.has('H2O2') && c.has('MnO2')) {
        this.sfx.playFizz(1.5); this.spawnParticles(top, 0xffffff, 70, 0.032); eq = '2H₂O₂ —[MnO₂]→ 2H₂O + O₂↑';
      } else if (c.has('Phenolphthalein')) {
        if (ls.ph > 8.2) { ls.targetColor.setHex(0xec4899); ls.flags.phenolPink = true; eq = 'OH⁻ + Phenolphtalein → Hồng cánh sen'; }
        else { if (ls.flags.phenolPink && ls.ph <= 7.5) ls.flags.neutralized = true; ls.targetColor.setHex(0xf8fafc); }
      }

      // Cross-check with ReactionEngine if available
      if (CV.ReactionEngine) {
        const engRes = CV.ReactionEngine.findReaction(Array.from(c), ls.temperature, ls.hotplateOn);
        if (engRes.reaction) {
          eq = engRes.reaction.displayEquation;
          ls.lastReaction = { eq, balanceCheck: engRes.reaction.balanceCheck, raw: engRes.reaction };
        }
      }
      if (eq && !ls.lastReaction) ls.lastReaction = { eq, raw: { displayEquation: eq, reactionType: 'Phản ứng 3D Lab', explanation: eq } };

      this.logReaction(eq || `Đã thêm ${chem.formula} (${chem.name})`);
      if (eq && CV.Player) CV.Player.recordEvent('reaction', `3D Lab: ${eq}`, 25);
      this.updateHUD();
      this.evaluateQuests();
    },

    setPrecip(hex) {
      this.labState.precipColor = hex;
      this.precipitateMesh.visible = true;
      this.precipitateMesh.material.color.setHex(hex);
    },

    resetLab() {
      this.sfx.playPour();
      const ls = this.labState;
      ls.temperature = 25.0; ls.ph = 7.0; ls.volumeMl = 250;
      ls.targetColor.setHex(0xdbeafe); ls.precipColor = null; this.precipitateMesh.visible = false;
      ls.contents = new Set(['H2O']); ls.lastReaction = null;
      while (this.iceGroup.children.length) this.iceGroup.remove(this.iceGroup.children[0]);
      ls.iceCubes = [];
      if (ls.beakerOnHotplate) this.toggleBeakerHotplate();
      if (ls.hotplateOn) this.toggleHotplatePower();
      if (ls.sensorPlaced) this.toggleTempSensor();
      this.logReaction('🔄 Đã rửa sạch cốc và làm mới Lab 3D.');
      this.updateHUD();
    },

    logReaction(text) {
      document.getElementById('lab3d-eq-mini').textContent = text;
      const t = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.labState.logs.unshift({ t, text });
      if (this.labState.logs.length > 12) this.labState.logs.pop();
      this.renderInspector();
      this.updateLaptopTex();
    },

    updateHUD() {
      const ls = this.labState;
      document.getElementById('lab3d-temp').textContent = `${ls.temperature.toFixed(1)}°C`;
      document.getElementById('lab3d-ph').textContent = ls.ph.toFixed(2);
      document.getElementById('lab3d-vol').textContent = `${ls.volumeMl}mL`;
      document.getElementById('lab3d-chips').innerHTML = Array.from(ls.contents)
        .map((id) => `<span class="cat-badge" style="color:#38BDF8;padding:1px 6px;">${id}</span>`)
        .join('');
    },

    evaluateQuests() {
      let won = false;
      QUESTS_DB.forEach((q) => {
        if (!this.labState.completedQuests.has(q.id) && q.check(this.labState)) {
          this.labState.completedQuests.add(q.id);
          this.labState.xp += q.xp;
          won = true;
          this.sfx.playQuestWin();
          CV.showToast(`🏆 HOÀN THÀNH ${q.title} (+${q.xp} XP)!`);
        }
      });
      if (won) this.renderQuests();
    },

    renderRightList() {
      const q = (document.getElementById('lab3d-search')?.value || '').trim().toLowerCase();
      const box = document.getElementById('lab3d-items-list');
      if (!box) return;

      const waterTools = [
        { id: 'w_room', label: '💧 Nước thường (25°C)', fn: () => this.addWater('room') },
        { id: 'w_boil', label: '♨️ Nước sôi (95°C)', fn: () => this.addWater('boiling') },
        { id: 'w_cold', label: '❄️ Nước lạnh (8°C)', fn: () => this.addWater('cold') },
        { id: 'w_hp', label: '🔥 Đặt/Nhấc khỏi bếp', fn: () => this.toggleBeakerHotplate() },
        { id: 'w_pow', label: '⚡ Bật/Tắt bếp điện', fn: () => this.toggleHotplatePower() },
        { id: 'w_sen', label: '🌡️ Cắm/Rút cảm biến', fn: () => this.toggleTempSensor() },
        { id: 'w_gog', label: '🥽 Đeo/Tháo kính bảo hộ', fn: () => this.toggleGoggles() }
      ];

      if (!q && this.activeRightTab === 'water') {
        box.innerHTML = waterTools.map((t) => `<button class="btn btn-secondary btn-sm lab3d-tool-btn" data-tid="${t.id}" style="justify-content:flex-start;font-size:0.78rem;">${t.label}</button>`).join('');
        box.querySelectorAll('.lab3d-tool-btn').forEach((b) => {
          b.addEventListener('click', () => waterTools.find((x) => x.id === b.getAttribute('data-tid')).fn());
        });
        return;
      }

      const list = LAB_CHEMICALS.filter((c) => (q ? c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.formula.toLowerCase().includes(q) : c.cat === this.activeRightTab));
      box.innerHTML = `<div class="lab-item-grid">${list
        .map((c) => {
          const hex = '#' + c.color.toString(16).padStart(6, '0');
          return `<button class="lab-chem-btn lab3d-chem-card" data-cid="${c.id}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong class="mono" style="font-size:0.8rem;color:var(--accent-cyan);">${c.formula}</strong>
              <span class="lab-swatch" style="background:${hex};"></span>
            </div>
            <div style="font-size:0.74rem;">${c.name}</div>
          </button>`;
        })
        .join('')}</div>`;
      box.querySelectorAll('.lab3d-chem-card').forEach((b) => b.addEventListener('click', () => this.addChemical(b.getAttribute('data-cid'))));
    },

    renderQuests() {
      const ls = this.labState;
      const lv = Math.floor(ls.xp / 100) + 1;
      document.getElementById('lab3d-rank-lbl').textContent = `LV.${lv} NHÀ KHOA HỌC`;
      document.getElementById('lab3d-xp-lbl').textContent = `${ls.xp} XP`;
      document.getElementById('lab3d-quest-dot').textContent = String(QUESTS_DB.length - ls.completedQuests.size);
      const box = document.getElementById('lab3d-quests-drawer');
      box.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <strong>🎯 15 Nhiệm Vụ Thực Hành 3D</strong>
        <button class="icon-btn" onclick="document.getElementById('lab3d-quests-drawer').style.display='none'">✕</button>
      </div>` + QUESTS_DB.map((q) => {
        const done = ls.completedQuests.has(q.id);
        return `<div class="glass-surface" style="padding:8px 10px;border-radius:10px;margin-bottom:6px;border-color:${done ? '#10B981' : 'var(--glass-border)'};">
          <div style="font-weight:700;font-size:0.8rem;color:${done ? '#34D399' : '#FBBF24'};">${done ? '✅' : '🎯'} ${q.title} (+${q.xp} XP)</div>
          <div style="font-size:0.74rem;color:var(--text-secondary);">${q.desc}</div>
        </div>`;
      }).join('');
    },

    renderGuide() {
      const box = document.getElementById('lab3d-guide-drawer');
      box.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <strong>📖 Cẩm Nang 8 Phản Ứng Đặc Sắc</strong>
        <button class="icon-btn" onclick="document.getElementById('lab3d-guide-drawer').style.display='none'">✕</button>
      </div>` + REACTION_RECIPES_GUIDE.map((r, i) => `
        <button class="lab-chem-btn lab3d-recipe-btn" data-ridx="${i}" style="width:100%;margin-bottom:6px;">
          <strong style="color:#C084FC;font-size:0.82rem;">${r.title}</strong>
          <span class="mono" style="font-size:0.74rem;color:var(--text-secondary);">${r.eq}</span>
        </button>`).join('');
      box.querySelectorAll('.lab3d-recipe-btn').forEach((b) => {
        b.addEventListener('click', () => {
          const rec = REACTION_RECIPES_GUIDE[Number(b.getAttribute('data-ridx'))];
          document.getElementById('lab3d-guide-drawer').style.display = 'none';
          this.resetLab();
          rec.chems.forEach((cid, idx) => setTimeout(() => this.addChemical(cid), idx * 600));
        });
      });
    },

    renderInspector() {
      const ls = this.labState;
      const box = document.getElementById('lab3d-insp-drawer');
      if (!box) return;
      const eq = ls.lastReaction ? ls.lastReaction.eq : 'Chưa có phản ứng hóa học mới';
      const bal = ls.lastReaction && ls.lastReaction.balanceCheck ? (ls.lastReaction.balanceCheck.balanced ? `✓ Đã kiểm chứng cân bằng (${ls.lastReaction.balanceCheck.summary})` : '') : '';
      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <strong>📊 Phân Tích & Thang pH</strong>
          <button class="icon-btn" onclick="document.getElementById('lab3d-insp-drawer').style.display='none'">✕</button>
        </div>
        <div class="glass-surface" style="padding:10px;border-radius:10px;margin-bottom:10px;">
          <div style="font-size:0.72rem;color:var(--text-muted);">Phương trình cân bằng</div>
          <div class="mono" style="color:#FBBF24;font-size:0.82rem;margin-top:4px;">${eq}</div>
          ${bal ? `<div class="mono" style="color:#34D399;font-size:0.72rem;margin-top:4px;">${bal}</div>` : ''}
        </div>
        <div style="font-size:0.78rem;margin-bottom:8px;">pH hiện tại: <strong class="mono">${ls.ph.toFixed(2)}</strong></div>
        <div style="font-size:0.74rem;color:var(--text-muted);margin-bottom:4px;">Nhật ký gần đây:</div>
        ${ls.logs.slice(0, 6).map((l) => `<div style="font-size:0.74rem;color:var(--text-secondary);">• [${l.t}] ${l.text}</div>`).join('')}
      `;
    },

    setCameraView(key) {
      const v = this.VIEWS[key]; if (!v) return;
      this.targetCamPos.copy(v.pos); this.targetCamLook.copy(v.target);
      this.isCamLerping = true; this.controls.autoRotate = false;
    },

    bindUI() {
      document.getElementById('lab3d-search').addEventListener('input', () => this.renderRightList());
      document.querySelectorAll('#lab3d-tabs .lab-tab-btn').forEach((b) => {
        b.addEventListener('click', () => {
          this.activeRightTab = b.getAttribute('data-tab');
          document.querySelectorAll('#lab3d-tabs .lab-tab-btn').forEach((x) => x.classList.remove('active'));
          b.classList.add('active');
          this.renderRightList();
        });
      });

      document.getElementById('lab3d-collapse-right').addEventListener('click', () => {
        this.labState.rightPanelOpen = !this.labState.rightPanelOpen;
        document.getElementById('lab3d-right-drawer').style.display = this.labState.rightPanelOpen ? 'flex' : 'none';
      });
      document.getElementById('lab3d-act-hp').addEventListener('click', () => this.toggleBeakerHotplate());
      document.getElementById('lab3d-act-ice').addEventListener('click', () => this.addIceCubes());
      document.getElementById('lab3d-act-stir').addEventListener('click', () => this.stirRod());
      document.getElementById('lab3d-act-reset').addEventListener('click', () => this.resetLab());
      document.getElementById('lab3d-act-export').addEventListener('click', () => {
        if (CV.ReactionEngine) {
          const user = CV.Player ? CV.Player.getCurrentUser() : null;
          CV.ReactionEngine.exportLabReport({
            studentName: user ? user.displayName : 'Học sinh CHEMVERSE',
            contents: Array.from(this.labState.contents),
            vessel: 'Cốc đong 1000mL (3D Lab)',
            tempC: this.labState.temperature.toFixed(1),
            reaction: this.labState.lastReaction ? this.labState.lastReaction.raw : null,
            logs: this.labState.logs.map((l) => `[${l.t}] ${l.text}`)
          });
          CV.showToast('Đã xuất báo cáo thí nghiệm 3D!');
        }
      });

      document.getElementById('lab3d-btn-cam').addEventListener('click', () => {
        this.viewIdx = (this.viewIdx + 1) % this.VIEW_KEYS.length;
        this.setCameraView(this.VIEW_KEYS[this.viewIdx]);
      });
      document.getElementById('lab3d-btn-360').addEventListener('click', () => {
        this.labState.autoRotate360 = !this.labState.autoRotate360;
        this.controls.autoRotate = this.labState.autoRotate360;
        this.controls.autoRotateSpeed = 1.65;
      });
      document.getElementById('lab3d-btn-audio').addEventListener('click', (e) => {
        this.sfx.muted = !this.sfx.muted;
        e.currentTarget.textContent = this.sfx.muted ? '🔇' : '🔊';
      });

      const togglePop = (id) => {
        ['lab3d-quests-drawer', 'lab3d-insp-drawer', 'lab3d-guide-drawer'].forEach((k) => {
          const el = document.getElementById(k);
          if (k !== id) el.style.display = 'none';
          else el.style.display = el.style.display === 'none' ? 'block' : 'none';
        });
      };
      document.getElementById('lab3d-btn-quests').addEventListener('click', () => togglePop('lab3d-quests-drawer'));
      document.getElementById('lab3d-btn-insp').addEventListener('click', () => togglePop('lab3d-insp-drawer'));
      document.getElementById('lab3d-btn-guide').addEventListener('click', () => togglePop('lab3d-guide-drawer'));
    },

    startLoop() {
      const clock = new THREE.Clock();
      let telemetryTimer = 0;

      const animate = () => {
        requestAnimationFrame(animate);
        if (CV.state.currentRoute !== 'virtual-lab' || !this.renderer) return;

        const dt = clock.getDelta();
        const elapsed = clock.elapsedTime;
        const ls = this.labState;

        this.primaryBeaker.position.lerp(this.beakerTargetPos, 0.12);
        const coilGlow = ls.hotplateOn ? 0.65 + Math.sin(elapsed * 5) * 0.12 : 0;
        this.hotplateCoils.forEach((c) => c.material.emissive.setRGB(coilGlow, coilGlow * 0.12, 0));
        this.hotplateLight.intensity = ls.hotplateOn ? 1.4 : 0;

        if (ls.hotplateOn && ls.beakerOnHotplate) {
          ls.temperature = Math.min(100.0, ls.temperature + dt * 5.2);
          if (ls.temperature > 78 && Math.random() < 0.35) this.spawnParticles(this.getTop(), 0xffffff, 3, 0.022);
        } else if (ls.iceCubes.length === 0) {
          ls.temperature += (25.0 - ls.temperature) * dt * 0.08;
        }

        for (let i = ls.iceCubes.length - 1; i >= 0; i--) {
          const ic = ls.iceCubes[i]; ic.mass -= dt * 0.055;
          ic.mesh.scale.setScalar(Math.max(0.05, ic.mass));
          ic.mesh.position.y = 0.11 * (ls.volumeMl / 250) + Math.sin(elapsed * 3 + i) * 0.004;
          ls.temperature = Math.max(1.5, ls.temperature - dt * 1.4);
          if (ic.mass <= 0.08) { this.iceGroup.remove(ic.mesh); ls.iceCubes.splice(i, 1); }
        }

        this.liquidMesh.material.color.lerp(ls.targetColor, 0.08);
        this.stirBarMesh.rotation.y += dt * (ls.hotplateOn ? 16 : 6);
        if (this.stirRodMesh.visible && this.stirRodMesh.userData.spinTimer > 0) {
          this.stirRodMesh.userData.spinTimer -= dt;
          this.stirRodMesh.position.x = Math.cos(elapsed * 12) * 0.032;
          this.stirRodMesh.position.z = Math.sin(elapsed * 12) * 0.032;
          if (this.stirRodMesh.userData.spinTimer <= 0) this.stirRodMesh.visible = false;
        }

        if (this.pourAnimTimer > 0) {
          this.pourAnimTimer -= dt;
          const bp = this.primaryBeaker.position;
          this.pourBottle.position.set(bp.x + 0.09, bp.y + 0.36, bp.z);
          this.pourBottle.rotation.z = 1.05;
          this.pourStream.position.set(bp.x + 0.015, bp.y + 0.22, bp.z);
          if (this.pourAnimTimer <= 0) { this.pourBottle.visible = false; this.pourStream.visible = false; }
        }

        if (this.tongsDropTimer > 0) {
          this.tongsDropTimer -= dt;
          const bp = this.primaryBeaker.position;
          this.tongsGroup.position.set(bp.x, bp.y + 0.27, bp.z);
          this.tongsSample.position.y = Math.max(-0.18, (this.tongsDropTimer - 0.55) * 0.45);
          if (this.tongsDropTimer <= 0) this.tongsGroup.visible = false;
        }

        if (this.screenShakeIntensity > 0.0005) {
          this.camera.position.x += (Math.random() - 0.5) * this.screenShakeIntensity;
          this.camera.position.y += (Math.random() - 0.5) * this.screenShakeIntensity;
          this.screenShakeIntensity *= 0.88;
        }

        telemetryTimer += dt;
        if (telemetryTimer >= 0.6) {
          telemetryTimer = 0;
          ls.tempHistory.push(ls.temperature); ls.phHistory.push(ls.ph);
          if (ls.tempHistory.length > 26) ls.tempHistory.shift();
          if (ls.phHistory.length > 26) ls.phHistory.shift();
          this.drawGraphTex(); this.updateLaptopTex(); this.updateHUD(); this.evaluateQuests();
        }

        // Update particles
        const pos = this.pGeo.attributes.position.array;
        const col = this.pGeo.attributes.color.array;
        for (let i = 0; i < this.MAX_P; i++) {
          if (i < this.particles.length) {
            const p = this.particles[i];
            p.x += p.vx; p.y += p.vy; p.z += p.vz; p.life -= p.decay;
            pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
            col[i * 3] = p.r; col[i * 3 + 1] = p.g; col[i * 3 + 2] = p.b;
          } else pos[i * 3 + 1] = -50;
        }
        for (let i = this.particles.length - 1; i >= 0; i--) if (this.particles[i].life <= 0) this.particles.splice(i, 1);
        this.pGeo.attributes.position.needsUpdate = true;
        this.pGeo.attributes.color.needsUpdate = true;

        if (this.isCamLerping) {
          this.camera.position.lerp(this.targetCamPos, 0.085);
          this.controls.target.lerp(this.targetCamLook, 0.085);
          if (this.camera.position.distanceTo(this.targetCamPos) < 0.02) this.isCamLerping = false;
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    }
  };
})();
