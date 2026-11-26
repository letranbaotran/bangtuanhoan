(function () {
  const CV = window.CHEMVERSE;

  const COMPOUNDS = [
    { formula: 'H₂O', name: 'Nước tinh khiết', req: { H: 2, O: 1 }, fact: 'Phân tử phân cực tạo nên sự sống trên Trái Đất.' },
    { formula: 'NaCl', name: 'Muối ăn (Natri Clorua)', req: { Na: 1, Cl: 1 }, fact: 'Hợp chất ion điển hình giữa kim loại kiềm và halogen.' },
    { formula: 'CO₂', name: 'Cacbon đioxit', req: { C: 1, O: 2 }, fact: 'Khí nhà kính quan trọng và là nguyên liệu cho quang hợp.' },
    { formula: 'NH₃', name: 'Amoniac', req: { N: 1, H: 3 }, fact: 'Nguyên liệu cốt lõi để sản xuất phân bón đạm.' },
    { formula: 'CH₄', name: 'Khí Metan', req: { C: 1, H: 4 }, fact: 'Thành phần chính của khí thiên nhiên.' },
    { formula: 'H₂SO₄', name: 'Axit Sunfuric', req: { H: 2, S: 1, O: 4 }, fact: 'Hóa chất công nghiệp quan trọng bậc nhất thế giới.' }
  ];

  const QUIZ_BANK = {
    basic: [
      { q: 'Nguyên tố nào nhẹ nhất và phổ biến nhất trong vũ trụ?', opts: ['Heli (He)', 'Hydro (H)', 'Oxy (O)', 'Cacbon (C)'], ans: 1, exp: 'Hydro (Z=1) chiếm khoảng 75% khối lượng vật chất thông thường trong vũ trụ.' },
      { q: 'Kim loại nào tồn tại ở trạng thái lỏng ở nhiệt độ phòng (25°C)?', opts: ['Gali (Ga)', 'Thủy ngân (Hg)', 'Xesi (Cs)', 'Chì (Pb)'], ans: 1, exp: 'Thủy ngân nóng chảy ở 234.32 K (-38.8°C) nên ở thể lỏng tại 25°C.' },
      { q: 'Khí nào chiếm khoảng 78% thể tích khí quyển Trái Đất?', opts: ['Oxy', 'Argon', 'Nitơ', 'Cacbon đioxit'], ans: 2, exp: 'Nitơ (N₂) chiếm ~78% khí quyển, Oxy chiếm ~21%.' },
      { q: 'Ký hiệu hóa học của nguyên tố Sắt là gì?', opts: ['Ir', 'Fe', 'Si', 'Au'], ans: 1, exp: 'Fe xuất phát từ tên Latinh "Ferrum".' },
      { q: 'Nguyên tố nào là nền tảng của mọi hợp chất hữu cơ và sự sống?', opts: ['Silic', 'Cacbon', 'Photpho', 'Lưu huỳnh'], ans: 1, exp: 'Cacbon có 4 electron hóa trị, dễ dàng tạo mạch dài và vòng bền vững.' },
      { q: 'Nhóm các nguyên tố nào hầu như trơ về mặt hóa học ở điều kiện thường?', opts: ['Halogen', 'Kim loại kiềm', 'Khí hiếm', 'Á kim'], ans: 2, exp: 'Khí hiếm (Nhóm 18) có lớp vỏ electron ngoài cùng đã bão hòa bền vững.' },
      { q: 'Kim loại nào dẫn điện tốt nhất trong tất cả các nguyên tố?', opts: ['Đồng (Cu)', 'Vàng (Au)', 'Bạc (Ag)', 'Nhôm (Al)'], ans: 2, exp: 'Bạc (Ag) có độ dẫn điện cao nhất, tiếp theo là Đồng (Cu) và Vàng (Au).' },
      { q: 'Phi kim duy nhất ở trạng thái lỏng tại 25°C là nguyên tố nào?', opts: ['Flo (F)', 'Clo (Cl)', 'Brom (Br)', 'Iot (I)'], ans: 2, exp: 'Brom (Br) là chất lỏng màu nâu đỏ dễ bay hơi ở nhiệt độ phòng.' },
      { q: 'Hạt mang điện tích dương trong hạt nhân nguyên tử là gì?', opts: ['Electron', 'Proton', 'Neutron', 'Photon'], ans: 1, exp: 'Proton mang điện tích +1, quy định số hiệu nguyên tử Z.' },
      { q: 'Nguyên tố nào tạo nên màu đỏ của máu qua phân tử Hemoglobin?', opts: ['Đồng (Cu)', 'Kẽm (Zn)', 'Sắt (Fe)', 'Magie (Mg)'], ans: 2, exp: 'Ion Sắt ở trung tâm nhóm heme giúp vận chuyển oxy trong hồng cầu.' }
    ],
    advanced: [
      { q: 'Nguyên tố có độ âm điện lớn nhất trên thang Pauling (3.98) là?', opts: ['Oxy (O)', 'Clo (Cl)', 'Flo (F)', 'Neon (Ne)'], ans: 2, exp: 'Flo (Z=9) có bán kính nhỏ và lực hút electron mạnh nhất.' },
      { q: 'Kim loại nào có điểm nóng chảy cao nhất (3695 K)?', opts: ['Titan (Ti)', 'Vonfram (W)', 'Osmi (Os)', 'Sắt (Fe)'], ans: 1, exp: 'Vonfram (Tungsten) nóng chảy ở 3695 K (3422°C), dùng làm dây tóc bóng đèn.' },
      { q: 'Đồng vị phóng xạ nào cung cấp điện cho tàu vũ trụ Voyager & xe tự hành Sao Hỏa?', opts: ['Urani-235', 'Plutoni-238', 'Thori-232', 'Cacbon-14'], ans: 1, exp: 'Pu-238 tỏa nhiệt phân rã alpha ổn định cho máy phát RTG.' },
      { q: 'Nguyên tố nào có khối lượng riêng lớn nhất trong tự nhiên (22.59 g/cm³)?', opts: ['Vàng (Au)', 'Bạch kim (Pt)', 'Osmi (Os)', 'Chì (Pb)'], ans: 2, exp: 'Osmi (Z=76) là kim loại tự nhiên đặc nhất.' },
      { q: 'Cấu hình electron của Đồng (Cu, Z=29) ở trạng thái cơ bản kết thúc là?', opts: ['[Ar] 3d⁹ 4s²', '[Ar] 3d¹⁰ 4s¹', '[Ar] 3d⁸ 4s²', '[Ar] 4s² 4p⁶'], ans: 1, exp: 'Cu có sự chuyển 1e từ 4s sang 3d để đạt phân lớp 3d¹⁰ bão hòa bền vững.' },
      { q: 'Nguyên tố đầu tiên được phát hiện tại châu Á (Nhật Bản) là?', opts: ['Moscovium', 'Nihonium (Nh)', 'Flerovium', 'Tennessine'], ans: 1, exp: 'Nihonium (Z=113) được tổng hợp tại viện RIKEN (Nhật Bản).' },
      { q: 'Nguyên tố nào là trung tâm của phân tử Diệp lục (Chlorophyll)?', opts: ['Canxi (Ca)', 'Magie (Mg)', 'Sắt (Fe)', 'Kali (K)'], ans: 1, exp: 'Ion Mg²⁺ nằm ở trung tâm vòng porphyrin của diệp lục.' },
      { q: 'Trong mạng cáp quang biển, ion đất hiếm nào khuếch đại tín hiệu ánh sáng?', opts: ['Neodymi (Nd)', 'Erbi (Er)', 'Xeri (Ce)', 'Lantan (La)'], ans: 1, exp: 'Bộ khuếch đại EDFA sử dụng sợi quang pha Erbi (Er³⁺).' },
      { q: 'Nguyên tố tự nhiên hiếm nhất trên vỏ Trái Đất (chưa tới 30 gam) là?', opts: ['Franxi (Fr)', 'Astatin (At)', 'Prometi (Pm)', 'Radi (Ra)'], ans: 1, exp: 'Astatin (Z=85) cực kỳ phóng xạ và có chu kỳ bán rã rất ngắn.' },
      { q: 'Nguyên tố nào dùng để định nghĩa đơn vị giây chuẩn trong đồng hồ nguyên tử?', opts: ['Rubidi (Rb)', 'Xesi (Cs)', 'Stronti (Sr)', 'Thủy ngân (Hg)'], ans: 1, exp: 'Tần số chuyển mức siêu tinh tế của nguyên tử Cs-133 định nghĩa 1 giây.' }
    ]
  };

  CV.modules.chemquest = {
    state: {
      score: 0,
      streak: 0,
      highScore: Number(localStorage.getItem('chemverse_highscore') || 0),
      mode: null, // 'decoder' | 'synth' | 'quiz'
      round: 0,
      maxRounds: 5,
      // Decoder
      targetEl: null,
      hintLevel: 1,
      // Synth
      targetComp: null,
      basket: {},
      // Quiz
      quizDiff: 'basic',
      quizIndex: 0
    },

    init(container) {
      this.container = container;
      this.renderHub();
    },

    saveHighScore() {
      if (this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
        localStorage.setItem('chemverse_highscore', String(this.state.highScore));
      }
    },

    renderHub() {
      const st = this.state;
      this.container.innerHTML = `
        <div class="page-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">${CV.t('ChemQuest – Trung Tâm Nhiệm Vụ Phi Hành Gia', 'ChemQuest – Astronaut Mission Control')}</h2>
              <p class="section-subtitle">${CV.t('Vận dụng kiến thức hóa học qua 3 chế độ thử thách tương tác', 'Test your chemistry knowledge across 3 interactive game modes')}</p>
            </div>
            <div class="glass-surface" style="padding:10px 16px;border-radius:12px;display:flex;gap:16px;">
              <span>🏆 Kỷ lục: <strong class="mono" style="color:#FBBF24;">${st.highScore}</strong></span>
              <span>🔥 Streak: <strong class="mono" style="color:var(--accent-cyan);">${st.streak}</strong></span>
            </div>
          </div>

          <div class="quest-hub">
            <article class="quest-mode-card glass-surface">
              <div>
                <div style="font-size:2rem;margin-bottom:8px;">🛸</div>
                <h3>1. Giải Mã Hành Tinh Nguyên Tố</h3>
                <p style="color:var(--text-secondary);font-size:0.88rem;margin-top:6px;">
                  Đọc tối đa 3 gợi ý (cấu hình e, nhóm/chu kỳ, ứng dụng) để tìm ra nguyên tố bí ẩn. Đoán càng sớm điểm càng cao!
                </p>
              </div>
              <button class="btn btn-primary" onclick="CHEMVERSE.modules.chemquest.startDecoder()">Bắt đầu Giải mã</button>
            </article>

            <article class="quest-mode-card glass-surface">
              <div>
                <div style="font-size:2rem;margin-bottom:8px;">⚗️</div>
                <h3>2. Xưởng Ghép Hợp Chất</h3>
                <p style="color:var(--text-secondary);font-size:0.88rem;margin-top:6px;">
                  Chọn đúng các nguyên tố thành phần và tỷ lệ số nguyên tử để tổng hợp phân tử mục tiêu (H₂O, NaCl, H₂SO₄...).
                </p>
              </div>
              <button class="btn btn-primary" onclick="CHEMVERSE.modules.chemquest.startSynth()">Vào Xưởng Ghép</button>
            </article>

            <article class="quest-mode-card glass-surface">
              <div>
                <div style="font-size:2rem;margin-bottom:8px;">⚡</div>
                <h3>3. Trắc Nghiệm Tốc Độ (10 Câu)</h3>
                <p style="color:var(--text-secondary);font-size:0.88rem;margin-top:6px;">
                  Chinh phục bộ câu hỏi 4 lựa chọn kèm giải thích khoa học ngay lập tức sau mỗi đáp án.
                </p>
              </div>
              <div style="display:flex;gap:8px;">
                <button class="btn btn-primary" style="flex:1;" onclick="CHEMVERSE.modules.chemquest.startQuiz('basic')">Cơ bản</button>
                <button class="btn btn-secondary" style="flex:1;" onclick="CHEMVERSE.modules.chemquest.startQuiz('advanced')">Nâng cao</button>
              </div>
            </article>
          </div>
        </div>
      `;
    },

    // --- MODE 1: DECODER ---
    startDecoder() {
      this.state.mode = 'decoder';
      this.state.score = 0;
      this.state.streak = 0;
      this.state.round = 1;
      this.state.maxRounds = 5;
      this.nextDecoderRound();
    },

    nextDecoderRound() {
      const pool = CV.ELEMENTS.filter((e) => e.number <= 86);
      this.state.targetEl = pool[Math.floor(Math.random() * pool.length)];
      this.state.hintLevel = 1;
      this.renderDecoder();
    },

    renderDecoder() {
      const st = this.state;
      const el = st.targetEl;
      const cat = CV.getCategory(el.category);
      const hints = [
        `Gợi ý 1 (+100đ): Cấu hình electron là <span class="mono" style="color:var(--accent-cyan);">${el.electronConfig}</span> (Số proton: ${el.protons}).`,
        `Gợi ý 2 (+70đ): Thuộc nhóm <strong>${cat.nameVi}</strong>, Chu kỳ ${el.period}, ${el.group ? 'Nhóm ' + el.group : 'Họ f-block'}.`,
        `Gợi ý 3 (+40đ): Ứng dụng thực tế: <em>${el.applications[0]}</em>.`
      ];

      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.renderHub()">← Quay lại Hub</button>
              <div class="mono">Lượt ${st.round}/${st.maxRounds} • Điểm: <strong style="color:#FBBF24;">${st.score}</strong> • 🔥 ${st.streak}</div>
            </div>
            <h2 style="margin-bottom:14px;">🛸 Giải Mã Hành Tinh Nguyên Tố</h2>
            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px;">
              ${hints.slice(0, st.hintLevel).map((h) => `<div class="glass-surface" style="padding:12px;border-radius:10px;">${h}</div>`).join('')}
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
              <input type="text" id="cq-dec-input" class="input-field" style="flex:1;min-width:200px;" placeholder="Nhập ký hiệu (Fe) hoặc tên nguyên tố..." />
              <button class="btn btn-primary" id="cq-dec-submit">Kiểm tra</button>
              ${st.hintLevel < 3 ? `<button class="btn btn-secondary" id="cq-dec-hint">Mở gợi ý tiếp theo</button>` : ''}
            </div>
            <div id="cq-dec-feedback" style="margin-top:14px;"></div>
          </div>
        </div>
      `;

      const check = () => {
        const val = document.getElementById('cq-dec-input').value.trim().toLowerCase();
        if (!val) return;
        const ok = val === el.symbol.toLowerCase() || val === el.name.toLowerCase() || val === el.nameVi.toLowerCase();
        const fb = document.getElementById('cq-dec-feedback');
        if (ok) {
          const pts = st.hintLevel === 1 ? 100 : st.hintLevel === 2 ? 70 : 40;
          st.score += pts;
          st.streak += 1;
          this.saveHighScore();
          fb.innerHTML = `<div style="color:#34D399;font-weight:700;">✅ Chính xác! Đó là ${el.nameVi} (${el.symbol})! +${pts} điểm.</div>`;
          setTimeout(() => {
            if (st.round < st.maxRounds) { st.round++; this.nextDecoderRound(); }
            else this.renderSummary('Giải mã hành tinh nguyên tố');
          }, 1200);
        } else {
          st.streak = 0;
          fb.innerHTML = `<div style="color:#F87171;">❌ Chưa đúng! Hãy thử lại hoặc mở thêm gợi ý.</div>`;
        }
      };

      document.getElementById('cq-dec-submit').addEventListener('click', check);
      document.getElementById('cq-dec-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      const hintBtn = document.getElementById('cq-dec-hint');
      if (hintBtn) hintBtn.addEventListener('click', () => { st.hintLevel++; this.renderDecoder(); });
    },

    // --- MODE 2: COMPOUND SYNTHESIZER ---
    startSynth() {
      this.state.mode = 'synth';
      this.state.score = 0;
      this.state.streak = 0;
      this.state.round = 1;
      this.state.maxRounds = COMPOUNDS.length;
      this.loadSynthRound();
    },

    loadSynthRound() {
      this.state.targetComp = COMPOUNDS[this.state.round - 1];
      this.state.basket = {};
      this.renderSynth();
    },

    renderSynth() {
      const st = this.state;
      const comp = st.targetComp;
      const palette = ['H', 'C', 'N', 'O', 'Na', 'S', 'Cl', 'Ca'];
      const basketText = Object.entries(st.basket)
        .filter(([, cnt]) => cnt > 0)
        .map(([sym, cnt]) => `${sym}${cnt > 1 ? cnt : ''}`)
        .join(' + ') || 'Trống';

      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.renderHub()">← Quay lại Hub</button>
              <div class="mono">Hợp chất ${st.round}/${st.maxRounds} • Điểm: <strong style="color:#FBBF24;">${st.score}</strong></div>
            </div>
            <h2>⚗️ Xưởng Ghép Hợp Chất</h2>
            <div class="glass-surface" style="padding:16px;border-radius:12px;margin:14px 0;">
              <div style="font-size:0.82rem;color:var(--text-muted);">Mục tiêu tổng hợp:</div>
              <div style="font-size:1.5rem;font-weight:700;color:var(--accent-cyan);">${comp.formula} – ${comp.name}</div>
            </div>

            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
              ${palette.map((sym) => `<button class="btn btn-secondary btn-sm cq-add-atom" data-sym="${sym}">+1 ${sym}</button>`).join('')}
              <button class="btn btn-secondary btn-sm" id="cq-synth-clear">🗑 Làm sạch</button>
            </div>

            <div class="glass-surface" style="padding:14px;border-radius:12px;margin-bottom:16px;">
              <span style="color:var(--text-muted);">Buồng phản ứng:</span> <strong class="mono" style="font-size:1.1rem;color:#FBBF24;">${basketText}</strong>
            </div>

            <button class="btn btn-primary" id="cq-synth-go">⚡ Tổng hợp phân tử</button>
            <div id="cq-synth-fb" style="margin-top:14px;"></div>
          </div>
        </div>
      `;

      document.querySelectorAll('.cq-add-atom').forEach((btn) => {
        btn.addEventListener('click', () => {
          const s = btn.getAttribute('data-sym');
          st.basket[s] = (st.basket[s] || 0) + 1;
          this.renderSynth();
        });
      });
      document.getElementById('cq-synth-clear').addEventListener('click', () => { st.basket = {}; this.renderSynth(); });
      document.getElementById('cq-synth-go').addEventListener('click', () => {
        const reqKeys = Object.keys(comp.req);
        const basKeys = Object.keys(st.basket).filter((k) => st.basket[k] > 0);
        const match = reqKeys.length === basKeys.length && reqKeys.every((k) => st.basket[k] === comp.req[k]);
        const fb = document.getElementById('cq-synth-fb');
        if (match) {
          st.score += 200;
          st.streak += 1;
          this.saveHighScore();
          fb.innerHTML = `<div style="color:#34D399;font-weight:700;">✅ Tổng hợp thành công ${comp.formula}! ${comp.fact}</div>`;
          setTimeout(() => {
            if (st.round < st.maxRounds) { st.round++; this.loadSynthRound(); }
            else this.renderSummary('Xưởng ghép hợp chất');
          }, 1400);
        } else {
          st.streak = 0;
          fb.innerHTML = `<div style="color:#F87171;">❌ Tỷ lệ nguyên tử chưa khớp với ${comp.formula}. Hãy thử lại!</div>`;
        }
      });
    },

    // --- MODE 3: SPEED QUIZ ---
    startQuiz(diff) {
      this.state.mode = 'quiz';
      this.state.quizDiff = diff;
      this.state.score = 0;
      this.state.streak = 0;
      this.state.quizIndex = 0;
      this.renderQuiz();
    },

    renderQuiz() {
      const st = this.state;
      const list = QUIZ_BANK[st.quizDiff];
      if (st.quizIndex >= list.length) {
        this.renderSummary(`Trắc nghiệm (${st.quizDiff === 'basic' ? 'Cơ bản' : 'Nâng cao'})`);
        return;
      }
      const item = list[st.quizIndex];

      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.modules.chemquest.renderHub()">← Quay lại Hub</button>
              <div class="mono">Câu ${st.quizIndex + 1}/${list.length} • Điểm: <strong style="color:#FBBF24;">${st.score}</strong> • 🔥 ${st.streak}</div>
            </div>
            <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:999px;overflow:hidden;margin-bottom:18px;">
              <div style="width:${((st.quizIndex + 1) / list.length) * 100}%;height:100%;background:linear-gradient(90deg,#00E5FF,#818CF8);"></div>
            </div>
            <h3 style="font-size:1.25rem;line-height:1.4;">${item.q}</h3>
            <div class="quiz-options">
              ${item.opts.map((o, idx) => `<button class="quiz-option-btn" data-idx="${idx}">${String.fromCharCode(65 + idx)}. ${o}</button>`).join('')}
            </div>
            <div id="cq-quiz-fb" style="margin-top:16px;"></div>
          </div>
        </div>
      `;

      document.querySelectorAll('.quiz-option-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const chosen = Number(btn.getAttribute('data-idx'));
          document.querySelectorAll('.quiz-option-btn').forEach((b, i) => {
            b.disabled = true;
            if (i === item.ans) b.classList.add('correct');
            else if (i === chosen) b.classList.add('wrong');
          });
          if (chosen === item.ans) {
            st.score += 100 + st.streak * 20;
            st.streak += 1;
            this.saveHighScore();
          } else {
            st.streak = 0;
          }
          document.getElementById('cq-quiz-fb').innerHTML = `
            <div class="glass-surface" style="padding:14px;border-radius:12px;">
              <div style="font-weight:700;color:${chosen === item.ans ? '#34D399' : '#F87171'};margin-bottom:4px;">
                ${chosen === item.ans ? '✅ Chính xác!' : '❌ Chưa chính xác!'}
              </div>
              <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:10px;">${item.exp}</p>
              <button class="btn btn-primary btn-sm" id="cq-quiz-next">${st.quizIndex + 1 < list.length ? 'Câu tiếp theo →' : 'Xem tổng kết 🏆'}</button>
            </div>
          `;
          document.getElementById('cq-quiz-next').addEventListener('click', () => {
            st.quizIndex++;
            this.renderQuiz();
          });
        });
      });
    },

    renderSummary(modeTitle) {
      const st = this.state;
      this.saveHighScore();
      if (CV.Player && st.score > 0) {
        CV.Player.recordEvent('quest', `Hoàn thành ${modeTitle} (${st.score}đ)`, Math.max(20, Math.round(st.score / 10)));
      }
      const rank =
        st.score >= 800 ? '🌌 Huyền thoại Vũ trụ Hóa học' :
        st.score >= 400 ? '🚀 Chỉ huy Nguyên tố' : '🛸 Phi hành gia Tập sự';
      this.container.innerHTML = `
        <div class="page-container">
          <div class="quest-arena glass-surface" style="text-align:center;">
            <div style="font-size:3rem;margin-bottom:10px;">🏆</div>
            <h2>Hoàn Thành Nhiệm Vụ!</h2>
            <div class="cat-badge" style="color:var(--accent-cyan);margin:8px auto;">Danh hiệu: ${rank}</div>
            <p style="color:var(--text-muted);margin:6px 0 18px;">Chế độ: ${modeTitle}</p>
            <div style="font-size:2.4rem;font-weight:700;color:#FBBF24;" class="mono">${st.score} điểm</div>
            <p style="color:var(--text-secondary);margin:8px 0 22px;">Kỷ lục cá nhân: <strong class="mono">${st.highScore}</strong> điểm</p>
            <button class="btn btn-primary" onclick="CHEMVERSE.modules.chemquest.renderHub()">Quay về Trung tâm ChemQuest</button>
          </div>
        </div>
      `;
    }
  };
})();
