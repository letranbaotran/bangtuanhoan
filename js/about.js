(function () {
  const CV = window.CHEMVERSE;

  CV.modules.about = {
    init(container) {
      container.innerHTML = `
        <div class="page-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">${CV.t('About Project – Giới Thiệu Dự Án CHEMVERSE', 'About Project – CHEMVERSE')}</h2>
              <p class="section-subtitle">${CV.t('Nền tảng giáo dục Hóa học trực quan kết hợp đồ họa 3D không gian vũ trụ', 'Interactive Chemistry EdTech platform powered by 3D WebGL space visualization')}</p>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;margin-bottom:28px;">
            <div class="glass-surface" style="padding:24px;border-radius:var(--radius-lg);">
              <h3 style="color:var(--accent-cyan);margin-bottom:10px;">🌌 Cảm hứng & Mục tiêu giáo dục</h3>
              <p style="color:var(--text-secondary);font-size:0.93rem;">
                CHEMVERSE được xây dựng dựa trên sự tương đồng kỳ thú giữa <strong>Thiên văn học</strong> (hệ sao – hành tinh – vệ tinh) và <strong>Cấu trúc nguyên tử</strong> (hạt nhân – lớp vỏ – electron). Thay vì học thuộc lòng bảng tuần hoàn khô khan, người học được trực tiếp du hành qua thiên hà 118 nguyên tố và quan sát quy luật tuần hoàn sống động.
              </p>
            </div>

            <div class="glass-surface" style="padding:24px;border-radius:var(--radius-lg);">
              <h3 style="color:var(--accent-blue);margin-bottom:10px;">🔬 Chuẩn dữ liệu khoa học IUPAC</h3>
              <p style="color:var(--text-secondary);font-size:0.93rem;">
                Toàn bộ dữ liệu của 118 nguyên tố (từ Hydro Z=1 đến Oganesson Z=118) tuân thủ chuẩn IUPAC mới nhất, thống nhất trong tệp <code class="mono">data/elements.json</code>. Các nguyên tố siêu nặng (Z=104–118) có thời gian sống cực ngắn đều được gắn nhãn cảnh báo <em>"Giá trị dự đoán"</em> rõ ràng.
              </p>
            </div>
          </div>

          <div class="glass-surface" style="padding:24px;border-radius:var(--radius-lg);margin-bottom:28px;">
            <h3 style="margin-bottom:16px;">🧭 Hướng Dẫn Sử Dụng Nhanh</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
              <div>
                <strong style="color:var(--accent-cyan);">1. Universe 3D</strong>
                <p style="font-size:0.88rem;color:var(--text-secondary);margin-top:4px;">
                  Kéo chuột / vuốt để xoay, cuộn / chụm để zoom. Nhấn vào hành tinh để camera bay tới (fly-to) và mở bảng thông tin. Dùng nút <em>Reset View</em> để quay về toàn cảnh.
                </p>
              </div>
              <div>
                <strong style="color:var(--accent-cyan);">2. Atom Simulator</strong>
                <p style="font-size:0.88rem;color:var(--text-secondary);margin-top:4px;">
                  Chọn nguyên tố, điều chỉnh tốc độ quay quỹ đạo, bật nổi bật electron hóa trị hoặc chuyển sang chế độ <em>Ghép đôi liên kết</em> (Ion / Cộng hóa trị).
                </p>
              </div>
              <div>
                <strong style="color:var(--accent-cyan);">3. Smart Periodic Table</strong>
                <p style="font-size:0.88rem;color:var(--text-secondary);margin-top:4px;">
                  Kéo thanh trượt nhiệt độ từ 0 K đến 6000 K để thấy toàn bộ 118 nguyên tố đổi trạng thái Rắn / Lỏng / Khí theo thời gian thực, hoặc bật chế độ Bản đồ nhiệt.
                </p>
              </div>
              <div>
                <strong style="color:var(--accent-cyan);">4. Virtual Lab</strong>
                <p style="font-size:0.88rem;color:var(--text-secondary);margin-top:4px;">
                  Chọn dụng cụ, thêm kim loại hoặc dung dịch từ kệ hóa chất, bật đèn đốt để thử màu ngọn lửa và xem phương trình cân bằng tự động.
                </p>
              </div>
            </div>
          </div>

          <div class="glass-surface" style="padding:24px;border-radius:var(--radius-lg);margin-bottom:28px;">
            <h3 style="margin-bottom:10px;">⚙️ ${CV.t('Công Nghệ Web Sử Dụng', 'Web Technologies Used')}</h3>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;">
              <span class="cat-badge" style="color:var(--accent-cyan);">WebGL / Three.js r147</span>
              <span class="cat-badge" style="color:var(--accent-blue);">InstancedMesh Starfield</span>
              <span class="cat-badge" style="color:var(--accent-indigo);">SPA Hash Routing</span>
              <span class="cat-badge" style="color:var(--accent-purple);">Deep Space Glassmorphism UI</span>
              <span class="cat-badge" style="color:#34D399;">IUPAC Unified JSON Schema</span>
            </div>
          </div>

          <div class="glass-surface" style="padding:24px;border-radius:var(--radius-lg);border-color:rgba(0,229,255,0.28);">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px;">
              <div>
                <h3 style="color:var(--accent-cyan);">👥 ${CV.t('Nhóm Thực Hiện Dự Án', 'Project Team')}</h3>
                <p style="color:var(--text-secondary);font-size:0.95rem;margin-top:4px;font-weight:600;">
                  ${CV.t('Nhóm 2 – Lớp 10A1 – Trường THPT Ea Súp', 'Group 2 – Class 10A1 – Ea Sup High School')}
                </p>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <span class="cat-badge" style="color:#FBBF24;">👑 ${CV.t('Trưởng nhóm', 'Team Leader')}: Lê Trần Bảo Trân</span>
                <span class="cat-badge" style="color:var(--accent-cyan);">⭐ ${CV.t('Phó nhóm', 'Vice Leader')}: Nguyễn Phương Anh</span>
              </div>
            </div>

            <div style="font-size:0.84rem;color:var(--text-muted);margin-bottom:10px;font-weight:600;">
              ${CV.t('Danh sách thành viên:', 'Team Members:')}
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;">
              ${[
                'Nguyễn Công Tuấn Anh',
                'Nguyễn Đức Anh',
                'Trần Mỹ Tâm',
                'Nguyễn Thu Bình',
                'Phạm Mỹ Nhung',
                'Phan Thị Hạnh',
                'Nguyễn Trung Lương',
                'Nguyễn Thị Thanh Trúc'
              ]
                .map(
                  (name) => `
                <div class="glass-surface" style="padding:10px 14px;border-radius:10px;font-size:0.9rem;display:flex;align-items:center;gap:8px;">
                  <span style="color:var(--accent-blue);">✦</span>
                  <span>${name}</span>
                </div>`
                )
                .join('')}
            </div>
          </div>
        </div>
      `;
    }
  };
})();
