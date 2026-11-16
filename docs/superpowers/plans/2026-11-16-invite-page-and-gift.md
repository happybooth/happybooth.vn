# Trang Thiệp cưới + quà website sự kiện: kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mục menu "Thiệp cưới" mở trang `/thiep-cuoi-online` trên happybooth.vn. Quà "website sự kiện" (cho sự kiện thuê từ 5.500.000đ) hiện ở Premium 2, ở các gói theo ngày và ở đầu trang Bảng giá. Câu chữ trên invite được sửa cho khớp.

**Architecture:** Site tĩnh, chép header/footer tay trên từng trang. Trang mới đăng ký theo quy trình "Adding a public page" trong CLAUDE.md của repo. Invite sửa trong worktree `worktrees/invite-gift-wording` rồi deploy bằng wrangler.

**Tech Stack:** HTML/CSS thuần, `node --test`, `cwebp`, Playwright MCP (dùng để chụp ảnh chia sẻ và kiểm tra), wrangler 4.162.0.

**Spec:** `docs/superpowers/specs/2026-11-16-invite-page-and-gift-design.md`

## Global Constraints

- Đường dẫn trang mới: `/thiep-cuoi-online`. Mọi link quà và link menu trỏ về đây. Nút "Xem chi tiết" dẫn tới `https://invite.happybooth.vn/`.
- Câu quà, chép đúng nguyên văn:
  - Đầu trang Bảng giá: "Tặng kèm website sự kiện cho mọi sự kiện thuê từ 5.500.000đ." + link "Xem website sự kiện"
  - Trong gói: "Tặng website sự kiện" (cả câu là link)
  - Ghi chú trang chủ: "Sự kiện thuê từ 5.500.000đ được tặng kèm website sự kiện." + link "Xem mẫu"
  - Dòng giá trong khối thiệp: "Từ 249.000đ · Tặng kèm khi thuê dịch vụ HappyBooth từ 5.500.000đ."
  - Bản tiếng Anh: "Free event website for every event booked from 5,500,000 VND." / "Free event website" / "See event websites"
- 5 gói nhận quà: Premium 2, Basic theo ngày, Premium theo ngày, Unlimited theo ngày, Thuê nhiều ngày.
- FAQ hiện trên trang và JSON-LD phải giống hệt nhau. Mỗi lần sửa `style.css` thì cập nhật key `?v=` trên mọi trang có key (thêm trang Bảng giá và trang mới vào danh sách).

## Review Focus

1. Sau khi đổi mục menu sang link nội bộ, bấm "Thiệp cưới" phải điều hướng SPA (router tự chặn link nội bộ) và nav đánh dấu `active` đúng.
2. Ở chế độ tiếng Anh, trang Bảng giá phải hiện câu quà tiếng Anh, không còn chữ Việt sót lại (`vi.json` ghi đè HTML, nên key phải có ở cả hai file).
3. Trang mới ở 390px: lưới 10 mẫu không tràn ngang.

---

### Task 1: Trang `/thiep-cuoi-online` và link menu

**Files:** Create `pages/services/thiep-cuoi-online.html`, `assets/images/invite/{gom-lam,thu-tay,tap-chi,dem-trang,pho-hoi,cat-set,nang-som}.webp`, `assets/images/invite/og-thiep-cuoi.jpg`. Modify `assets/js/router.js`, `assets/lang/{vi,en}.json`, `sitemap.xml`, `index.html` + 8 trang trong `pages/` (link menu), `assets/css/style.css`. Test: `tests/invite-links.test.cjs`.

- [ ] **Step 1: Sửa và thêm test hỏng:**
  - `MENU_LINK` đổi `href` thành `/thiep-cuoi-online`. Riêng trên trang mới, link mang `class="active vi-only"`, nên test so khớp theo regex: `href="/thiep-cuoi-online" class="(active )?vi-only" lang="vi">Thiệp cưới</a>`.
  - Test mới `the invite page is a registered public page`: file có permalink `/thiep-cuoi-online.html`; `router.js` chứa `'thiep-cuoi-online': '/thiep-cuoi-online'`; `sitemap.xml` chứa `https://happybooth.vn/thiep-cuoi-online`; cả `vi.json` lẫn `en.json` có `meta.title.thiep-cuoi-online`; canonical đúng.
  - Test mới `the invite page sends visitors on with a "Xem chi tiết" button`: trang chứa `>Xem chi tiết</a>` có `href="https://invite.happybooth.vn/"`; có link tới đủ 10 trang `mau-*`.
  - Test mới `the invite page FAQ matches its JSON-LD`: số `<details>` = số `Question` trong JSON-LD, và mỗi `<summary>` trùng một `name`.
  - Chạy. Kỳ vọng: các test này FAIL.
- [ ] **Step 2: Cắt 7 ảnh còn lại** bằng `cwebp -q 72 -crop 0 0 488 1055`, giống lần trước.
- [ ] **Step 3: Viết trang** theo phần Thiết kế, mục 1 trong spec. Đăng ký trang ở router (`pagePaths` + `preloadPages`), i18n, sitemap. Đổi link menu ở 9 trang + footer.
- [ ] **Step 4: Ảnh chia sẻ 1200×630.** Dựng một trang HTML tạm trong scratchpad (nền blush, 3 điện thoại, tiêu đề), chụp bằng Playwright, lưu thành JPG vào `assets/images/invite/og-thiep-cuoi.jpg`.
- [ ] **Step 5: Chạy** `node --test tests/*.test.cjs`. Kỳ vọng: tất cả PASS. Commit: `Add a wedding invitation page and point the menu to it`.

### Task 2: Quà website sự kiện trên trang Bảng giá và trang chủ

**Files:** Modify `pages/main/price.html`, `index.html`, `assets/lang/{vi,en}.json`, `assets/css/style.css`; cache key. Test: `tests/invite-links.test.cjs`.

- [ ] **Step 1: Thêm test hỏng:**
  - `price page gives the event website with Premium 2 and every daily package`: với mỗi thẻ có `data-i18n` tên `price.premium2.name`, `price.dayBasic.name`, `price.dayPremium.name`, `price.dayUnlimited.name`, `price.multiDay.name`, đoạn HTML từ tên tới `</article>` chứa `href="/thiep-cuoi-online"` và `Tặng website sự kiện`. Gói `price.premium1.name` thì không chứa.
  - `price page leads with the event website note`: trong `.page-header` có `class="price-gift"` chứa `5.500.000đ` và `/thiep-cuoi-online`.
  - `the gift wording has an English translation`: `en.json` có các key `price.giftNote` và `price.f.eventSite`, và cả hai không chứa chữ "Tặng".
  - `home price note points to the invite page`: `.price-band__invite` chứa `website sự kiện` và `href="/thiep-cuoi-online"`.
  - Chạy. Kỳ vọng: FAIL.
- [ ] **Step 2: Viết HTML.** Thêm `<li data-i18n-html="price.f.eventSite">` vào 5 thẻ. Thêm `<p class="price-gift" data-i18n-html="price.giftNote">` vào `.page-header`. Sửa câu hỏi đáp "bao gồm những gì" (cả bản hiện trên trang lẫn JSON-LD) thêm câu "Premium 2 và các gói theo ngày tặng kèm website sự kiện." Sửa ghi chú và dòng giá trên trang chủ. Thêm key vào `vi.json`/`en.json`.
- [ ] **Step 3: CSS** `.price-gift` (thẻ blush bo góc, chữ đậm, chấm hồng giống nhãn của khối thiệp). Thêm key `?v=` cho trang Bảng giá; cập nhật key trên mọi trang có key.
- [ ] **Step 4: Chạy** `node --test tests/*.test.cjs`. Kỳ vọng: PASS. Commit: `Give an event website with Premium 2 and daily packages`.

### Task 3: Kiểm tra, PR, invite

- [ ] **Step 1:** Chạy server local ở cổng 8792, chụp trang mới (1440 và 390; không tràn ngang) và trang Bảng giá (đầu trang, thẻ Premium 2, nhóm gói theo ngày). Chuyển sang EN trên trang Bảng giá: thấy câu tiếng Anh. Từ trang chủ, bấm menu "Thiệp cưới": URL thành `/thiep-cuoi-online` mà không tải lại trang, nav `active` đúng. "Xem chi tiết" sang invite.
- [ ] **Step 2:** Tự review diff, push, mở PR, **hỏi trước khi merge**.
- [ ] **Step 3 (invite, `worktrees/invite-gift-wording`):** Sửa hai câu và thêm ý thiết kế riêng, commit `Offer the free invitation with any HappyBooth booking from 5.5M`. Hỏi trước khi deploy (gộp chung câu hỏi merge). Sau đó `sh scripts/build.sh && CLOUDFLARE_ACCOUNT_ID=56b299d8ba92eeae9f1422c68332cd93 npx wrangler@4.162.0 deploy`, `git push origin chore/gift-wording:main`. Kiểm tra trang live.
