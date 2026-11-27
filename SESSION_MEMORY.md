# CHEMVERSE – Bộ Nhớ Phiên Làm Việc & Nhật Ký Dự Án

> **Bảo mật:** Tập tin này **KHÔNG** lưu trữ mật khẩu, mã API, token cá nhân, cookie hay bất kỳ thông tin xác thực nhạy cảm nào. Chỉ lưu thông tin kỹ thuật công khai của dự án để phục vụ làm việc liên máy.

---

## 1. Nơi Lưu Trữ Mã Nguồn GitHub
- **Repository:** https://github.com/letranbaotran/bangtuanhoan
- **Git Remote (`origin`):** `https://github.com/letranbaotran/bangtuanhoan.git`
- **Nhánh chính:** `main`
- **Thư mục đồng bộ GitHub:** `bangtuanhoan/` (chứa `index.html` và `chemverse.html` đã đóng gói từ mã nguồn gốc).

---

## 2. Cấu Trúc Mã Nguồn Chính
- **Giao diện & Đóng gói:**
  - `index.html` — Bản nguồn đa tệp
  - `chemverse.html` — Bản đóng gói độc lập (CSS + Data + JS gộp thành 1 tệp)
  - `css/design-system.css`, `css/modules.css` — Hệ thống giao diện & bố cục các phân hệ
- **Dữ liệu khoa học:**
  - `data/elements.js`, `data/chemicals.js`, `data/reactions.js`
- **Các mô-đun chức năng (`js/`):**
  - `js/core.js` — Điều hướng, đa ngôn ngữ, quản lý nhánh Học tập / Nghiên cứu
  - `js/periodic-table.js` — Bảng tuần hoàn IUPAC, xuất gói thẻ QR A4 hàng loạt, nút Hỏi AI
  - `js/virtual-lab.js` — Phòng Lab 3D (Kính hiển vi vi mô, Định lượng `CM/V/m`, An toàn GHS, Chế độ Hòa nhập `♿`, Trợ lý AI trong Lab)
  - `js/simulator.js` — Mô phỏng nguyên tử 3D (Orbital s/p/d/f)
  - `js/universe3d.js` — Vũ trụ phân tử & tinh thể 3D
  - `js/research.js` — Không gian nghiên cứu dữ liệu & phân tích xu hướng
  - `js/gamification.js` — Hồ sơ học tập, biểu đồ năng lực 4 mảng, xuất Phiếu kết quả học tập chuẩn A4
  - `js/about.js` — Hồ sơ giới thiệu chuẩn báo cáo khoa học 4 phần
  - `js/reaction-engine.js`, `js/home.js`, `js/chemquest.js`
- **Học máy Python:** `ml/periodic_ml.py`

---

## 3. Các Thay Đổi Mới Cập Nhật (Gần Nhất)
1. **`d73c55e` — Thu gọn & tối ưu bố cục Phòng Lab 3D:**
   - Thu gọn bảng thông số góc trên trái (`.lab3d-hud-tl`).
   - Sắp xếp thanh công cụ trái (`.lab3d-tools-left`) thành 2 cột gọn (`42px × 42px`).
   - Thu gọn khung Kính hiển vi vi mô (`.lab3d-micro-dock`) ở góc dưới trái và Kho hóa chất (`.lab3d-right-drawer`) bên phải.
2. **`f059939` — Sửa lỗi cú pháp JS khi đóng gói:**
   - Loại bỏ dấu nháy ngược dư trong `js/about.js` (dòng 46) gây `SyntaxError` làm trắng trang `chemverse.html`.
3. **`6df7341` — Kính hiển vi vi mô ngoài & phóng to điều khiển Lab:**
   - Đưa Kính hiển vi vi mô (`#lab3d-micro-dock`) ra ngoài cạnh bình phản ứng, hỗ trợ chọn soi từng chất riêng lẻ (`#micro-chem-sel`, nút `🔬` trên từng thẻ hóa chất) hoặc hỗn hợp trong cốc, kèm thanh trượt độ phóng đại.
4. **`7fc1573` — Nâng cấp chuẩn dự thi KHKT & Thiết bị dạy học số Quốc gia:**
   - Xóa menu ngăn kéo thừa, chỉ giữ 1 thanh điều hướng trên (PC) / dock dưới đáy (mobile).
   - Đồng bộ nút **Nghiên cứu chuyên sâu** về `#virtual-lab`.
   - Bổ sung Mô phỏng định lượng (`CM, V, m`, chất dư/hết, hiệu suất), Cảnh báo an toàn GHS, Chế độ Hòa nhập (`♿` + đọc tiếng Việt), Trợ lý AI trong Lab & Bảng tuần hoàn, Xuất bộ thẻ QR A4, Biểu đồ năng lực 4 mảng & Phiếu kết quả A4.

---

## 4. Hướng Dẫn Tiếp Tục Khi Mở Trên Máy Khác
1. Tải mã nguồn mới nhất từ GitHub (qua GitHub Desktop hoặc `git clone https://github.com/letranbaotran/bangtuanhoan.git` / `git pull origin main`).
2. Mở bằng Live Server / HTTP server cục bộ (ví dụ cổng `8765`) hoặc mở trực tiếp `chemverse.html`.
3. Nếu chỉnh sửa các tệp trong `css/`, `data/`, `js/`, nhớ đóng gói lại `chemverse.html` và đồng bộ sang `bangtuanhoan/index.html` + `bangtuanhoan/chemverse.html` rồi **Push origin** trên GitHub Desktop.
