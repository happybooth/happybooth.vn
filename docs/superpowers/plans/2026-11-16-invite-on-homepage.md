# Thiệp cưới online trên trang chủ: kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đưa invite.happybooth.vn lên happybooth.vn. Gồm một khối riêng trên trang chủ, một dòng dịch vụ, một ghi chú tặng kèm dưới bảng giá, và mục "Thiệp cưới" trên menu của 9 trang.

**Architecture:** Site tĩnh, không có build step. Header, menu mobile và footer được chép tay trên từng trang, nên mục menu được chèn vào 27 chỗ (9 trang × 3 menu). Mọi điểm chạm mang class `vi-only` và `lang="vi"`. Một rule CSS duy nhất ẩn chúng khi `html[lang="en"]`.

**Tech Stack:** HTML/CSS thuần, `node --test` (không có dependency), `cwebp` để cắt ảnh.

**Spec:** `docs/superpowers/specs/2026-11-16-invite-on-homepage-design.md`

## Global Constraints

- URL gốc là `https://invite.happybooth.vn/`. Trang mẫu là `/mau-son-son/`, `/mau-dai-phim/`, `/mau-ep-hoa/`; neo là `#mau` (danh sách mẫu) và `#gia` (bảng giá). Mọi link mở trong cùng tab, không có `target`.
- Copy chép đúng nguyên văn:
  - Nhãn: "Mới · Thiệp cưới online"
  - Tiêu đề (h2): "Thiệp cưới online gọi đúng tên từng vị khách"
  - Mô tả: "Gửi một đường link cho cả họ hàng lẫn bạn bè. Ai mở ra cũng thấy lời mời dành cho chính mình, kèm nhạc nền, bản đồ, lịch âm và nút xác nhận tham dự."
  - Dòng giá: "Từ 249.000đ · Tặng kèm khi thuê dịch vụ HappyBooth cho tiệc cưới từ 5.500.000đ."
  - Nút: "Xem 10 mẫu thiệp" (`#mau`), "Bảng giá thiệp" (`#gia`)
  - Dòng dịch vụ: tên "Thiệp cưới online", mô tả "Một đường link mời cho cả họ hàng, bạn bè, gọi đúng tên từng người.", nhãn "Từ 249.000đ"
  - Ghi chú giá: "Tiệc cưới thuê từ 5.500.000đ được tặng kèm thiệp cưới online." + link "Xem mẫu thiệp"
  - Menu: "Thiệp cưới"
- Không nhắc album ảnh sau tiệc hay tải ảnh lên.
- Không thêm key vào `vi.json`/`en.json`. Không sửa `router.js`, `sitemap.xml`, JSON-LD, FAQ hay phần đầu trang.
- Sửa `style.css` thì phải cập nhật `?v=` (12 ký tự đầu của `git hash-object assets/css/style.css`) trên `index.html`, `pages/main/about.html`, `pages/projects/du-an-20-10.html` và `pages/services/thue-photobooth-su-kien-ha-noi.html`.
- Commit subject viết hoa chữ đầu, dạng mệnh lệnh, không có tiền tố type.

## Review Focus

1. Menu desktop ở 960–1200px (khi đó nav gap 18px, đã có 7 mục, nút báo giá và chọn ngôn ngữ) không được xuống dòng hay đè lên logo. Task 3 chụp màn hình ở 961, 1100 và 1200.
2. Menu mobile chữ 30px giờ có thêm một mục, ở viewport 390×844 vẫn phải thấy và bấm được hết các mục, kể cả nút cuối. Task 3 chụp màn hình.
3. Ở chế độ tiếng Anh, sau khi chuyển ngôn ngữ ngay trên trang, không còn sót điểm chạm nào. Task 1 có test cho rule CSS; Task 3 kiểm tra trong trình duyệt.
4. Điều hướng SPA: từ `/price` bấm "Trang chủ" thì khối thiệp vẫn hiện đúng, và bấm "Thiệp cưới" trên menu thì rời site thật. Router trả `null` cho link ngoài, Task 3 kiểm tra bằng tay.
5. `.reviews` có `padding-top: 0`, nên khối thiệp chèn ngay trước nó không được dùng nền màu tràn viền. Nền blush chỉ đặt trên thẻ bên trong `.wrap`. Task 3 chụp màn hình.

---

### Task 1: Mục "Thiệp cưới" trên menu của 9 trang

**Files:**
- Modify: `index.html`, `pages/main/{about,portfolio,frame,price,contact}.html`, `pages/projects/{du-an-20-10,du-an-note-group}.html`, `pages/services/thue-photobooth-su-kien-ha-noi.html`
- Modify: `assets/css/style.css` (rule `vi-only`, đặt cạnh `html[lang="en"] .seo-intro` ở khoảng dòng 1914)
- Test: `tests/invite-links.test.cjs` (file mới)

**Interfaces:**
- Produces: class `vi-only` (Task 2 dùng lại) và chuỗi link menu `<a href="https://invite.happybooth.vn/" class="vi-only" lang="vi">Thiệp cưới</a>`.

- [ ] **Step 1: Viết test hỏng** trong `tests/invite-links.test.cjs`, cùng phong cách với `tests/pages.test.cjs`:
  - `the nine shared-header pages each link to the invite site three times`: mỗi trang chứa `data-i18n="common.nav.frame"` có đúng 3 chuỗi link menu ở trên. Mỗi chuỗi nằm sau link `/frame` và trước link `/price` gần nhất (so `indexOf`). Có đúng 9 trang như vậy.
  - `English mode hides vi-only content`: `style.css` khớp regex `/html\[lang="en"\] \.vi-only\s*\{\s*display:\s*none;?\s*\}/`.
- [ ] **Step 2: Chạy** `node --test tests/invite-links.test.cjs`. Kỳ vọng: cả 2 test FAIL.
- [ ] **Step 3: Chèn link menu** ngay sau mỗi dòng chứa `data-i18n="common.nav.frame">Khung ảnh</a>` (27 chỗ), giữ nguyên thụt lề của dòng đó. Không thêm `active` ở đâu. Thêm rule `html[lang="en"] .vi-only { display: none; }`.
- [ ] **Step 4: Chạy** `node --test tests/*.test.cjs`. Kỳ vọng: tất cả PASS.
- [ ] **Step 5: Commit** — `Link the wedding invitation site from every menu`.

### Task 2: Khối thiệp, dòng dịch vụ, ghi chú giá trên trang chủ

**Files:**
- Create: `assets/images/invite/{son-son,dai-phim,ep-hoa}.webp`
- Modify: `index.html` (danh sách `.services` ở khoảng dòng 406–411, section mới đặt trước `<!-- Reviews -->`, `.price-band__extra` ở khoảng dòng 472)
- Modify: `assets/css/style.css` (block `/* Invite band */` sau `/* Services */`; cache key trên 4 trang)
- Test: `tests/invite-links.test.cjs`

**Interfaces:**
- Consumes: class `vi-only` từ Task 1.

- [ ] **Step 1: Thêm test hỏng** vào `tests/invite-links.test.cjs`:
  - `home invite band sits between services and reviews`: trong `index.html`, `indexOf('data-i18n="home.services.title"')` < `indexOf('<section class="home-section invite-band vi-only" lang="vi"')` < `indexOf('data-i18n="home.reviews.title"')`. Đoạn từ thẻ mở section tới `</section>` kế tiếp chứa `249.000đ`, `5.500.000đ`, `https://invite.happybooth.vn/#mau`, `https://invite.happybooth.vn/#gia`, `/mau-son-son/`, `/mau-dai-phim/`, `/mau-ep-hoa/`. Đoạn đó không chứa `target=`.
  - `services list and price band mention the invite`: có `<li class="services__row vi-only" lang="vi">` chứa `Thiệp cưới online` và `Từ 249.000đ`; có `class="price-band__invite vi-only" lang="vi"` chứa `5.500.000đ`.
  - `invite images exist and declare their size`: mỗi `<img src="assets/images/invite/…">` trong `index.html` trỏ tới file có thật, và có cả `width="` lẫn `height="`.
- [ ] **Step 2: Chạy** `node --test tests/invite-links.test.cjs`. Kỳ vọng: 3 test mới FAIL.
- [ ] **Step 3: Cắt ảnh.** Với mỗi mẫu: `cwebp -q 72 -crop 0 0 488 1055 -metadata none ../../projects/happybooth-invite/assets/catalog/thumbs/<mẫu>.jpg -o assets/images/invite/<mẫu>.webp`. Kiểm tra bằng `sips -g pixelWidth -g pixelHeight`. Kỳ vọng: 488×1055.
- [ ] **Step 4: Viết HTML.**
  - Section khối thiệp, với copy và link trong Global Constraints. Ba ảnh dùng `loading="lazy"`, `width="488" height="1055"`; mỗi ảnh nằm trong `<a>` tới trang mẫu của nó, alt mô tả mẫu.
  - Dòng `<li>` thứ 5 trong `.services ul`. Ảnh nhỏ là `dai-phim.webp` với `width="84" height="108"`. Tên dòng `<h3>` bọc link tới `https://invite.happybooth.vn/`.
  - `<p class="price-band__invite vi-only" lang="vi">` đặt ngay sau `.price-band__extra`.
- [ ] **Step 5: Viết CSS** (`.invite-band__card`, `__copy`, `__eyebrow`, `__price`, `__cta`, `__phones`, `__phone`, `.price-band__invite`).
  - Thẻ nền `var(--color-blush)` bo góc, nằm trong `.wrap`. Chữ bên trái, ba điện thoại bên phải.
  - Từ 960px trở xuống thì xếp dọc, ba ảnh thành 3 cột nhỏ.
  - Khung điện thoại bo góc, ảnh `object-fit: cover`. Animation, nếu có, phải tôn trọng `prefers-reduced-motion`. Nút hồng dùng `.btn .btn--pink`.
  - Cập nhật cache key trên 4 trang.
- [ ] **Step 6: Chạy** `node --test tests/*.test.cjs`. Kỳ vọng: tất cả PASS. Chạy `grep -c "style.css?v=$(git hash-object assets/css/style.css | cut -c1-12)" index.html pages/main/about.html pages/projects/du-an-20-10.html pages/services/thue-photobooth-su-kien-ha-noi.html`. Kỳ vọng: mỗi file 1.
- [ ] **Step 7: Commit** — `Show the wedding invitation site on the home page`. Gồm cả spec và plan trong `docs/superpowers/`.

### Task 3: Kiểm tra trong trình duyệt và mở PR

- [ ] **Step 1:** Chạy `node scripts/serve.cjs` trong worktree, mở `http://localhost:8765/` bằng Playwright MCP, rồi chụp màn hình:
  - Trang chủ ở 1440, 1200, 1100 và 961px: header một dòng, không đè logo.
  - Khối thiệp và bảng giá ở 1440 và 390.
  - Menu mobile mở ở 390×844: thấy đủ 7 mục.
  - `/price` ở 1440: có mục menu mới.
  - Kỳ vọng: không lỗi bố cục. Đặc biệt, khoảng cách giữa khối thiệp và "Khách nói gì sau tiệc" phải cân đối.
- [ ] **Step 2:** Chuyển sang EN bằng nút ngôn ngữ, rồi `document.querySelectorAll('.vi-only')` lọc theo `offsetParent !== null`. Kỳ vọng: 0 phần tử hiện. Chuyển lại VI.
- [ ] **Step 3:** Từ `/price`, bấm "Trang chủ" (đi qua SPA). Kỳ vọng: khối thiệp hiện. Bấm "Thiệp cưới". Kỳ vọng: URL chuyển sang `invite.happybooth.vn`.
- [ ] **Step 4:** Chạy `curl -s -o /dev/null -w '%{http_code}'` cho mọi URL invite trong `index.html`. Kỳ vọng: tất cả 200.
- [ ] **Step 5:** Push `feature/invite-on-home`, mở PR trên `happybooth/happybooth.vn` kèm ảnh chụp, và **hỏi chủ dự án trước khi merge** (`main` lên production ngay). Sau khi merge: kiểm tra https://happybooth.vn, rồi gỡ worktree.
