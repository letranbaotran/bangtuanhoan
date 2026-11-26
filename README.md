# CHEMVERSE – Vũ Trụ Nguyên Tố Hóa Học 3D

Nền tảng giáo dục Hóa học tương tác chuẩn **IUPAC (118 nguyên tố)** kết hợp đồ họa 3D WebGL (Three.js), Mô phỏng Nguyên tử & Orbital Lượng tử, **ChemPredict**, **Virtual Lab (64+ hóa chất & Reaction Engine kiểm chứng cân bằng phương trình)** và hệ thống **Gamification** (Đăng ký/Đăng nhập, XP, Cấp độ, Huy hiệu, Bảng xếp hạng).

## Cấu trúc dự án

- `index.html` — Giao diện SPA chính (mô-đun hóa)
- `chemverse.html` — Phiên bản gộp 1 file độc lập (mở trực tiếp offline/file://)
- `css/design-system.css`, `css/modules.css` — Dark Science UI, Light Glass Mode & Responsive Mobile
- `data/elements.json`, `data/elements.js` — Dữ liệu 118 nguyên tố chuẩn IUPAC
- `data/chemicals.js` — Tủ hóa chất tách riêng gồm 64 hóa chất thực tế
- `data/reactions.js`, `data/reactions.json` — Cơ sở dữ liệu phản ứng hóa học cân bằng
- `js/reaction-engine.js` — Reaction Engine độc lập, thuật toán kiểm chứng cân bằng nguyên tử & xuất báo cáo
- `js/gamification.js` — Quản lý người chơi (Đăng ký/Đăng nhập `localStorage`), XP, Cấp độ, Huy hiệu, Nhiệm vụ, Bảng xếp hạng
- `js/chempredict.js` — Phân tích quy luật tuần hoàn & Dự đoán liên kết ($\Delta\chi$)
- `js/universe3d.js`, `js/simulator.js`, `js/periodic-table.js`, `js/explorer.js`, `js/comparison.js`, `js/virtual-lab.js`, `js/chemquest.js`, `js/about.js` — Các module chuyên sâu

## Hướng dẫn cài đặt và chạy dự án

1. **Cách 1 – Mở trực tiếp (Không cần cài đặt):**
   Mở tệp `chemverse.html` hoặc `index.html` bằng trình duyệt Chrome / Edge.
2. **Cách 2 – Chạy máy chủ cục bộ (Windows PowerShell):**
   Nhấp chuột phải vào `start-server.ps1` → **Run with PowerShell** (hoặc chạy `powershell -ExecutionPolicy Bypass -File start-server.ps1`) rồi truy cập `http://localhost:8765/`.
3. **Tài khoản mẫu để trải nghiệm Gamification:**
   - Tên đăng nhập: `baotran` | Mật khẩu: `123` (hoặc đăng ký tài khoản mới trực tiếp tại mục **Profile**).

## Nhóm thực hiện
- **Đơn vị:** Nhóm 2 – Lớp 10A1 – Trường THPT Ea Súp
- **Trưởng nhóm:** Lê Trần Bảo Trân | **Phó nhóm:** Nguyễn Phương Anh
