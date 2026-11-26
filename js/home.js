(function () {
  const CV = window.CHEMVERSE;

  CV.modules.home = {
    init(container) {
      const t = CV.t;
      container.innerHTML = `
        <!-- TRANG 1: MÀN HÌNH CHÍNH CHIA ĐÔI 2 NHÁNH LỚN (SPLIT-SCREEN CARDS) -->
        <section class="hero-section split-home-section">
          <canvas id="home-star-canvas"></canvas>
          <div class="hero-content" style="max-width:1180px;width:100%;">
            <div class="hero-pill">${t('✦ CHEMVERSE 3D • HỆ THỐNG HÓA HỌC TƯƠNG TÁC', '✦ CHEMVERSE 3D • INTERACTIVE CHEMISTRY SYSTEM')}</div>
            <h1 class="hero-title" style="margin-bottom:8px;">${t('CHỌN PHÂN HỆ TRẢI NGHIỆM', 'CHOOSE YOUR MODE')}</h1>
            <p class="hero-slogan" style="margin-bottom:24px;">${t('Khám phá kiến thức nền tảng hoặc bước ngay vào Phòng thí nghiệm 3D chuyên sâu', 'Explore foundational chemistry or step straight into the 3D Research Lab')}</p>

            <div class="dual-hub-grid split-cards-grid">
              <!-- THẺ 1: HỌC TẬP & KHÁM PHÁ -->
              <article class="dual-branch-card learn glass-surface split-card-clickable" onclick="CHEMVERSE.switchBranch('learn')" role="button" tabindex="0">
                <div class="dual-branch-badge">THẺ 1 • NHÁNH HỌC TẬP</div>
                <div class="dual-branch-head">
                  <span class="dual-branch-icon">🎓</span>
                  <div>
                    <h2>${t('HỌC TẬP & KHÁM PHÁ', 'LEARNING & EXPLORATION')}</h2>
                    <p>${t('Không gian học trực quan gồm 4 phân mục: Bảng tuần hoàn, Mô phỏng, Vũ trụ 3D và ChemQuiz.', 'Visual learning space with 4 modules: Periodic Table, Simulator, 3D Universe, and ChemQuiz.')}</p>
                  </div>
                </div>
                <ul class="dual-branch-list">
                  <li>🧪 <strong>Bảng tuần hoàn:</strong> Tra cứu 118 nguyên tố, cấu hình e &amp; tạo mã QR</li>
                  <li>⚛️ <strong>Mô phỏng:</strong> Nguyên tử 3D, lớp vỏ electron &amp; orbital (s, p, d, f)</li>
                  <li>🌌 <strong>Vũ trụ 3D:</strong> Không gian thiên hà nguyên tố &amp; cấu trúc 3D</li>
                  <li>🚀 <strong>ChemQuiz:</strong> Trắc nghiệm, trò chơi hóa học &amp; chấm điểm</li>
                </ul>
                <div class="dual-branch-actions">
                  <button class="btn btn-primary" style="width:100%;" onclick="event.stopPropagation();CHEMVERSE.switchBranch('learn')">🎓 ${t('Vào Học Tập & Khám Phá →', 'Enter Learning & Exploration →')}</button>
                </div>
              </article>

              <!-- THẺ 2: NGHIÊN CỨU CHUYÊN SÂU -->
              <article class="dual-branch-card research glass-surface split-card-clickable" onclick="CHEMVERSE.switchBranch('research')" role="button" tabindex="0">
                <div class="dual-branch-badge">THẺ 2 • NHÁNH PHÒNG LAB 3D</div>
                <div class="dual-branch-head">
                  <span class="dual-branch-icon">🔬</span>
                  <div>
                    <h2>${t('NGHIÊN CỨU CHUYÊN SÂU', 'IN-DEPTH RESEARCH & LAB')}</h2>
                    <p>${t('Mở thẳng Phòng Lab 3D với bàn thí nghiệm, hóa chất, cảm biến và đồ thị phân tích phản ứng.', 'Open the 3D Virtual Lab directly with glassware, reagents, sensors, and live charts.')}</p>
                  </div>
                </div>
                <ul class="dual-branch-list">
                  <li>🧪 <strong>Phòng Lab 3D:</strong> Cốc đong, đèn cồn, tủ hóa chất &amp; hiệu ứng chân thực</li>
                  <li>🎚️ <strong>3 Mức độ thực hành:</strong> Cơ bản (THCS) • Nâng cao (THPT) • Tự do</li>
                  <li>📖 <strong>Chuyên đề mẫu:</strong> Vô cơ, Axit-Bazơ, Điện hóa, Ngọn lửa</li>
                  <li>📈 <strong>Đồ thị &amp; Báo cáo:</strong> Theo dõi nhiệt độ, pH thời gian thực</li>
                </ul>
                <div class="dual-branch-actions">
                  <button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,#8B5CF6,#EC4899);" onclick="event.stopPropagation();CHEMVERSE.switchBranch('research')">🔬 ${t('Mở Thẳng Phòng Lab 3D →', 'Open Virtual Lab 3D →')}</button>
                </div>
              </article>
            </div>
          </div>
        </section>
      `;

      initHeroCanvas();
    }
  };

  /* --- KHÔNG GIAN HỌC TẬP (4 PHÂN MỤC CHÍNH) --- */
  CV.modules.learning = {
    init(container) {
      const t = CV.t;
      container.innerHTML = `
        <div class="page-container">
          <div class="section-header" style="margin-bottom:24px;">
            <div>
              <div class="hero-pill" style="margin-bottom:8px;">🎓 ${t('NHÁNH 1 • HỌC TẬP & KHÁM PHÁ', 'BRANCH 1 • LEARNING & EXPLORATION')}</div>
              <h2 class="section-title">${t('Không Gian Học Tập Hóa Học 3D', '3D Chemistry Learning Space')}</h2>
              <p class="section-subtitle">${t('Chọn 1 trong 4 phân mục chính bên dưới để tra cứu, mô phỏng, khám phá hoặc luyện tập', 'Choose 1 of the 4 core learning modules below')}</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('home')">🏠 ${t('Trang chủ', 'Home')}</button>
              <button class="btn btn-primary btn-sm" style="background:linear-gradient(135deg,#8B5CF6,#EC4899);" onclick="CHEMVERSE.switchBranch('research')">🔬 ${t('Chuyển sang Phòng Lab →', 'Switch to Virtual Lab →')}</button>
            </div>
          </div>

          <div class="learning-hub-grid">
            <article class="learning-hub-card glass-surface" onclick="CHEMVERSE.navigate('periodic-table')" role="button" tabindex="0">
              <div class="lh-icon" style="color:#00E5FF;">🧪</div>
              <h3>1. ${t('Bảng tuần hoàn', 'Periodic Table')}</h3>
              <p>${t('Bảng tuần hoàn các nguyên tố hóa học tương tác: tra cứu thông tin chi tiết, tính chất, cấu hình e và tạo mã QR cho từng nguyên tố.', 'Interactive periodic table: look up detailed properties, electron configs, and generate QR codes.')}</p>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();CHEMVERSE.navigate('periodic-table')">${t('Mở Bảng tuần hoàn →', 'Open Periodic Table →')}</button>
            </article>

            <article class="learning-hub-card glass-surface" onclick="CHEMVERSE.navigate('simulator')" role="button" tabindex="0">
              <div class="lh-icon" style="color:#38BDF8;">⚛️</div>
              <h3>2. ${t('Mô phỏng', 'Atom Simulator')}</h3>
              <p>${t('Trực quan hóa mô hình nguyên tử 3D, chuyển động các lớp vỏ electron và đám mây xác suất orbital (s, p, d, f).', 'Visualize 3D atomic models, electron shell motion, and quantum orbital probability clouds (s, p, d, f).')}</p>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();CHEMVERSE.navigate('simulator')">${t('Mở Mô phỏng 3D →', 'Open Simulator →')}</button>
            </article>

            <article class="learning-hub-card glass-surface" onclick="CHEMVERSE.navigate('universe')" role="button" tabindex="0">
              <div class="lh-icon" style="color:#A855F7;">🌌</div>
              <h3>3. ${t('Vũ trụ 3D', '3D Universe')}</h3>
              <p>${t('Không gian khám phá cấu trúc nguyên tố, hệ hành tinh chu kỳ, cụm nhóm và liên kết không gian 3D.', 'Explore element structures, periodic galaxy rings, group clusters, and 3D spatial relationships.')}</p>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();CHEMVERSE.navigate('universe')">${t('Khám phá Vũ trụ 3D →', 'Explore 3D Universe →')}</button>
            </article>

            <article class="learning-hub-card glass-surface" onclick="CHEMVERSE.navigate('chemquest')" role="button" tabindex="0">
              <div class="lh-icon" style="color:#FBBF24;">🚀</div>
              <h3>4. ChemQuiz</h3>
              <p>${t('Hệ thống câu hỏi trắc nghiệm tương tác, trò chơi đố vui hóa học (cân bằng phương trình, lật thẻ, ghép hợp chất) có chấm điểm.', 'Interactive quizzes, chemistry games (equation balancer, memory cards, compound builder) with scoring.')}</p>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();CHEMVERSE.navigate('chemquest')">${t('Vào ChemQuiz →', 'Open ChemQuiz →')}</button>
            </article>
          </div>
        </div>
      `;
    }
  };

  function initHeroCanvas() {
    const canvas = document.getElementById('home-star-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    let mouseX = 0, mouseY = 0;

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.0004 + 0.0001
    }));

    const samplePlanets = [
      { sym: 'H', color: '#3B82F6', rx: 0.16, ry: 0.25, radius: 18, angle: 0.5 },
      { sym: 'C', color: '#00E5FF', rx: 0.84, ry: 0.28, radius: 22, angle: 2.1 },
      { sym: 'Fe', color: '#FFC312', rx: 0.14, ry: 0.74, radius: 24, angle: 4.0 },
      { sym: 'Au', color: '#A855F7', rx: 0.85, ry: 0.76, radius: 20, angle: 5.2 }
    ];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    resize();
    window.addEventListener('resize', resize);

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    });

    function draw() {
      if (CV.state.currentRoute !== 'home') {
        requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2 + mouseX * 14, h / 2 + mouseY * 14);
      [180, 290, 410].forEach((rad, i) => {
        ctx.beginPath();
        ctx.ellipse(0, 0, rad * 1.35, rad * 0.62, i * 0.25 - 0.2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      ctx.restore();

      for (const s of stars) {
        s.y -= s.speed;
        if (s.y < 0) s.y = 1;
        const px = s.x * w + mouseX * (s.r * 16);
        const py = s.y * h + mouseY * (s.r * 16);
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${s.a})`;
        ctx.fill();
      }

      for (const p of samplePlanets) {
        p.angle += 0.008;
        const px = p.rx * w + Math.cos(p.angle) * 14 + mouseX * 28;
        const py = p.ry * h + Math.sin(p.angle) * 10 + mouseY * 28;

        const grad = ctx.createRadialGradient(px - 4, py - 4, 2, px, py, p.radius * 1.6);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.6, p.color + '55');
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(px, py, p.radius * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(11, 16, 38, 0.85)';
        ctx.fill();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#F8FAFC';
        ctx.font = '700 13px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.sym, px, py);
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }
})();
