(function () {
  const CV = window.CHEMVERSE;

  CV.modules.about = {
    init(container) {
      container.innerHTML = `
        <div class="page-container">
          <div class="section-header" style="margin-bottom:22px;">
            <div>
              <div class="hero-pill" style="margin-bottom:8px;">🏆 BÁO CÁO KHOA HỌC • DỰ THI KHKT &amp; THIẾT BỊ DẠY HỌC SỐ CẤP QUỐC GIA</div>
              <h2 class="section-title">Giới Thiệu Dự Án CHEMVERSE 3D</h2>
              <p class="section-subtitle">Hệ sinh thái Học tập &amp; Nghiên cứu Hóa học 3D bám sát Chương trình GDPT 2018</p>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;margin-bottom:20px;">
            <section class="glass-surface" style="padding:22px;border-radius:var(--radius-lg);">
              <h3 style="color:var(--accent-cyan);margin-bottom:10px;">1. Tính Cấp Thiết (Bám sát GDPT 2018)</h3>
              <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.55;">
                Chương trình GDPT 2018 chú trọng phát triển năng lực nhận thức hóa học, tìm hiểu thế giới tự nhiên qua thí nghiệm thực hành và sử dụng danh pháp quốc tế IUPAC. CHEMVERSE 3D giải quyết tình trạng thiếu hóa chất, nguy cơ mất an toàn ở trường phổ thông và giúp học sinh trực quan hóa thế giới vi mô (nguyên tử, orbital, liên kết, ion).
              </p>
            </section>

            <section class="glass-surface" style="padding:22px;border-radius:var(--radius-lg);">
              <h3 style="color:#E879F9;margin-bottom:10px;">2. Giải Pháp Công Nghệ &amp; Điểm Mới Sáng Tạo</h3>
              <ul style="color:var(--text-secondary);font-size:0.9rem;line-height:1.55;padding-left:18px;margin:0;">
                <li><strong>Định lượng &amp; Kính hiển vi vi mô 3D:</strong> Mô phỏng chuyển động ion/phân tử và tính chất dư – hết, hiệu suất, kết tủa/khí.</li>
                <li><strong>Giáo dục hòa nhập &amp; Gói QR A4:</strong> Hỗ trợ khiếm thị/mù màu (nhãn màu + đọc tiếng Việt) và xuất bộ thẻ QR dạy học theo trạm.</li>
                <li><strong>Góc An toàn GHS &amp; Trợ lý AI:</strong> Cảnh báo thao tác nguy hiểm và gợi ý tư duy giải bài tập từng bước.</li>
              </ul>
            </section>
          </div>

          <section class="glass-surface" style="padding:22px;border-radius:var(--radius-lg);margin-bottom:20px;">
            <h3 style="margin-bottom:14px;">3. Quy Trình Sử Dụng 2 Nhánh (Học Tập – Nghiên Cứu)</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
              <div class="glass-surface" style="padding:14px;border-radius:12px;border-color:rgba(0,229,255,0.35);">
                <strong style="color:var(--accent-cyan);">🎓 Nhánh 1: Học tập &amp; Khám phá</strong>
                <p style="font-size:0.86rem;color:var(--text-secondary);margin-top:6px;">
                  Bảng tuần hoàn (IUPAC, QR A4, So sánh) • Mô phỏng 3D (Orbital s/p/d/f) • Vũ trụ 3D (Phân tử, Tinh thể, Liên kết) • ChemQuiz &amp; Trợ lý AI.
                </p>
              </div>
              <div class="glass-surface" style="padding:14px;border-radius:12px;border-color:rgba(168,85,247,0.35);">
                <strong style="color:#E879F9;">🔬 Nhánh 2: Nghiên cứu chuyên sâu (Phòng Lab 3D)</strong>
                <p style="font-size:0.86rem;color:var(--text-secondary);margin-top:6px;">
                  Phòng Lab 3D định lượng (`C_M, V, m`), Kính hiển vi vi mô, Chế độ Hòa nhập (`♿`), Cảnh báo an toàn GHS &amp; Không gian Nghiên cứu Khoa học (Dữ liệu, ML, Báo cáo).
                </p>
              </div>
            </div>
          </section>
        </div>
      `;
    }
  };
})();
