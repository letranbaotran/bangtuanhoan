(function () {
  const CV = window.CHEMVERSE;

  CV.modules.home = {
    init(container) {
      const t = CV.t;
      container.innerHTML = `
        <!-- 1. Hero & Dual-Mode Hub Section -->
        <section class="hero-section">
          <canvas id="home-star-canvas"></canvas>
          <div class="hero-content" style="max-width:1120px;width:100%;">
            <div class="hero-pill">${t('✦ CHEMVERSE 3D • KIẾN TRÚC 2 PHÂN HỆ LIÊN THÔNG', '✦ CHEMVERSE 3D • DUAL-MODE ARCHITECTURE')}</div>
            <h1 class="hero-title">${t('TRUNG TÂM HÓA HỌC 3D', 'CHEMVERSE 3D HUB')}</h1>
            <p class="hero-slogan">${t('Chọn phân hệ phù hợp để bắt đầu hành trình khám phá hoặc nghiên cứu chuyên sâu', 'Choose your mode to start learning & exploring or in-depth 3D research')}</p>

            <!-- DUAL-MODE HUB CARDS -->
            <div class="dual-hub-grid">
              <article class="dual-branch-card learn glass-surface">
                <div class="dual-branch-badge">NHÁNH 1 • LEARNING & EXPLORATION</div>
                <div class="dual-branch-head">
                  <span class="dual-branch-icon">🎓</span>
                  <div>
                    <h2>${t('HỌC TẬP & KHÁM PHÁ', 'LEARNING & EXPLORATION')}</h2>
                    <p>${t('Tra cứu trực quan, học lý thuyết, tương tác mô hình 3D và luyện tập', 'Visual lookup, theory, 3D atomic models, and interactive quizzes')}</p>
                  </div>
                </div>
                <ul class="dual-branch-list">
                  <li>🧪 <strong>Bảng tuần hoàn 2D & 3D:</strong> tra cứu 118 nguyên tố chuẩn IUPAC</li>
                  <li>📱 <strong>Thẻ thông tin & Mã QR:</strong> quét nhanh hoặc chia sẻ từng nguyên tố</li>
                  <li>⚛️ <strong>Mô hình 3D & Electron:</strong> lớp vỏ K, L, M, ô orbital s/p/d/f & đám mây 360°</li>
                  <li>🎯 <strong>Quiz & Củng cố:</strong> câu hỏi trắc nghiệm gắn trực tiếp với nguyên tố đang xem</li>
                </ul>
                <div class="dual-branch-actions">
                  <button class="btn btn-primary" onclick="CHEMVERSE.switchBranch('learn')">🎓 ${t('Vào Nhánh Học Tập →', 'Enter Learning Mode →')}</button>
                  <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('universe')">🌌 Vũ trụ 3D</button>
                  <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('simulator')">⚛️ Orbital 3D</button>
                  <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('chemquest')">🚀 ChemQuest</button>
                </div>
              </article>

              <article class="dual-branch-card research glass-surface">
                <div class="dual-branch-badge">NHÁNH 2 • IN-DEPTH RESEARCH & LAB</div>
                <div class="dual-branch-head">
                  <span class="dual-branch-icon">🔬</span>
                  <div>
                    <h2>${t('NGHIÊN CỨU CHUYÊN SÂU', 'IN-DEPTH RESEARCH & LAB')}</h2>
                    <p>${t('Thực hành thí nghiệm 3D, mô phỏng phản ứng và phân tích dữ liệu nâng cao', '3D virtual experiments, reaction simulation, and real-time analytics')}</p>
                  </div>
                </div>
                <ul class="dual-branch-list">
                  <li>🧪 <strong>Phòng Lab 3D:</strong> cốc đong, ống nghiệm, đèn cồn, cảm biến pH/nhiệt độ & tủ hóa chất</li>
                  <li>🎚️ <strong>3 Mức độ thực hành:</strong> Cơ bản (THCS) • Nâng cao (THPT) • Tự do (Sandbox)</li>
                  <li>⚡ <strong>Hiện tượng chân thực:</strong> kết tủa, sủi bọt, đổi màu, ngọn lửa + âm thanh</li>
                  <li>📈 <strong>Phân tích thời gian thực:</strong> đồ thị nhiệt độ/pH & xuất báo cáo kết quả</li>
                </ul>
                <div class="dual-branch-actions">
                  <button class="btn btn-primary" style="background:linear-gradient(135deg,#8B5CF6,#EC4899);" onclick="CHEMVERSE.switchBranch('research')">🔬 ${t('Vào Phòng Lab 3D →', 'Enter Research Lab →')}</button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div class="page-container">
          <!-- 2. Stats Section -->
          <section class="stats-grid" aria-label="${t('Thống kê bảng tuần hoàn', 'Periodic Table Statistics')}">
            <div class="stat-card glass-surface">
              <div class="stat-value">118</div>
              <div class="stat-label">${t('Nguyên tố hóa học', 'Chemical Elements')}</div>
              <div class="stat-sub">${t('Chuẩn dữ liệu IUPAC mới nhất', 'Latest IUPAC standard data')}</div>
            </div>
            <div class="stat-card glass-surface">
              <div class="stat-value">7</div>
              <div class="stat-label">${t('Chu kỳ', 'Periods')}</div>
              <div class="stat-sub">${t('7 tầng quỹ đạo thiên hà', '7 galactic orbital rings')}</div>
            </div>
            <div class="stat-card glass-surface">
              <div class="stat-value">18</div>
              <div class="stat-label">${t('Nhóm', 'Groups')}</div>
              <div class="stat-sub">${t('Nhóm cột trong bảng tuần hoàn', 'Columns in the periodic table')}</div>
            </div>
            <div class="stat-card glass-surface">
              <div class="stat-value">4</div>
              <div class="stat-label">${t('Nhóm nguyên tố chính', 'Main Element Categories')}</div>
              <div class="stat-sub">${t('Kim loại, Á kim, Phi kim, Khí hiếm', 'Metals, Metalloids, Nonmetals, Noble Gases')}</div>
            </div>
          </section>

          <!-- 3. Explore Modules -->
          <section style="margin-bottom:56px;">
            <div class="section-header">
              <div>
                <h2 class="section-title">${t('Hệ Sinh Thái Khám Phá', 'Explore Modules')}</h2>
                <p class="section-subtitle">${t('Chọn một module chuyên sâu để bắt đầu hành trình du hành nguyên tố', 'Choose an interactive module to start your elemental journey')}</p>
              </div>
            </div>
            <div class="modules-grid">
              <article class="module-card glass-surface">
                <div>
                  <div class="module-card-visual">🌌</div>
                  <h3>${t('Khám phá Vũ trụ 3D', 'Explore Universe')}</h3>
                  <p>${t('Khám phá thiên hà 118 hành tinh nguyên tố trong không gian 3D tương tác theo chu kỳ xoắn ốc hoặc cụm nhóm.', 'Explore the galaxy of 118 element planets in interactive 3D space by spiral periods or group clusters.')}</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('universe')">${t('Mở Vũ trụ 3D →', 'Open Universe 3D →')}</button>
              </article>

              <article class="module-card glass-surface">
                <div>
                  <div class="module-card-visual">⚛️</div>
                  <h3>${t('Mô phỏng Nguyên tử', 'Simulate Atom')}</h3>
                  <p>${t('Quan sát hạt nhân, vệ tinh electron, sơ đồ ô orbital ↑↓ và mô hình orbital lượng tử 3D (n, l, m).', 'Observe nuclei, electron satellites, orbital box diagrams ↑↓, and 3D quantum orbitals (n, l, m).')}</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('simulator')">${t('Mở Mô phỏng →', 'Open Simulator →')}</button>
              </article>

              <article class="module-card glass-surface">
                <div>
                  <div class="module-card-visual">🧪</div>
                  <h3>${t('Bảng tuần hoàn Thông minh', 'Smart Periodic Table')}</h3>
                  <p>${t('Bảng tuần hoàn 2D & 3D với thanh trượt nhiệt độ, bản đồ nhiệt và biểu đồ cột 3D thuộc tính.', '2D & 3D Periodic Table with live temperature slider, heatmaps, and 3D property height-map.')}</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('periodic-table')">${t('Mở Bảng tuần hoàn →', 'Open Periodic Table →')}</button>
              </article>

              <article class="module-card glass-surface">
                <div>
                  <div class="module-card-visual">🔬</div>
                  <h3>${t('Phòng thí nghiệm Ảo', 'Virtual ChemLab')}</h3>
                  <p>${t('Thực hành pha trộn hóa chất, thử màu ngọn lửa và quan sát phản ứng hóa học an toàn ngay trên trình duyệt.', 'Mix reagents safely, run spectral flame tests, and watch balanced chemical reactions live.')}</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('virtual-lab')">${t('Vào Phòng thí nghiệm →', 'Open Virtual Lab →')}</button>
              </article>

              <article class="module-card glass-surface">
                <div>
                  <div class="module-card-visual">🚀</div>
                  <h3>${t('Thử thách ChemQuest', 'ChemQuest')}</h3>
                  <p>${t('Thử thách phi hành gia: giải mã hành tinh nguyên tố, xưởng ghép hợp chất và trắc nghiệm tốc độ.', 'Astronaut challenges: decode element planets, synthesize compounds, and play speed quizzes.')}</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('chemquest')">${t('Chơi ChemQuest →', 'Play ChemQuest →')}</button>
              </article>
            </div>
          </section>

          <!-- 4. Project Overview -->
          <section>
            <div class="section-header">
              <div>
                <h2 class="section-title">${t('Tổng Quan Dự Án', 'Project Overview')}</h2>
                <p class="section-subtitle">${t('Cầu nối giữa Thiên văn học vĩ mô và Hóa học lượng tử vi mô', 'Bridging macro astronomy and micro quantum chemistry')}</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="CHEMVERSE.navigate('about')">${t('Xem thêm về dự án →', 'About Project →')}</button>
            </div>
            <div class="overview-grid">
              <div class="overview-card glass-surface">
                <h4>🌠 ${t('Ý tưởng dự án', 'Project Concept')}</h4>
                <p>${t('Kết nối cấu trúc nguyên tử vi mô với mô hình thiên hà và chuyển động vệ tinh, biến các con số khô khan thành hệ hành tinh trực quan.', 'Connects atomic structure with galaxy and satellite motion, turning dry numbers into an intuitive planetary system.')}</p>
              </div>
              <div class="overview-card glass-surface">
                <h4>🎓 ${t('Mục tiêu giáo dục', 'Educational Goal')}</h4>
                <p>${t('Giúp học sinh, sinh viên ghi nhớ bản chất tuần hoàn, electron hóa trị và hiện tượng phản ứng qua trải nghiệm tương tác.', 'Helps students grasp periodic trends, valence electrons, and reaction phenomena through interactive visuals.')}</p>
              </div>
              <div class="overview-card glass-surface">
                <h4>⚡ ${t('Công nghệ sử dụng', 'Technology Stack')}</h4>
                <p>${t('Đồ họa WebGL / Three.js tối ưu hiệu năng cao, giao diện Glassmorphism hiện đại và dữ liệu chuẩn hóa theo IUPAC.', 'High-performance WebGL / Three.js graphics, modern Glassmorphism UI, and IUPAC standardized data.')}</p>
              </div>
              <div class="overview-card glass-surface">
                <h4>🏫 ${t('Giá trị ứng dụng', 'Practical Value')}</h4>
                <p>${t('Công cụ tự học, thực hành thí nghiệm an toàn tại nhà và giáo cụ trình chiếu 3D trực quan trên lớp cho giáo viên Hóa học.', 'Self-study tool, safe virtual lab practice at home, and 3D classroom presentation aid for Chemistry teachers.')}</p>
              </div>
            </div>
          </section>
        </div>
      `;

      initHeroCanvas();
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
