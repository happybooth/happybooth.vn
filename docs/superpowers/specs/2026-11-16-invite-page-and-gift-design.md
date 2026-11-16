# Trang Thiệp cưới trên happybooth.vn và quà "website sự kiện"

Ngày: 2026-11-16. Tiếp nối `2026-11-16-invite-on-homepage-design.md` (PR #25, đã lên production). Kích cỡ: thay đổi nhỏ.

## Mục đích

1. Bấm mục "Thiệp cưới" trên menu hiện đang rời site ngay. Chủ dự án muốn nó mở một trang bình thường của happybooth.vn, rồi khách bấm nút "Xem chi tiết" mới sang invite.happybooth.vn.
2. Quà tặng được đổi tên và mở rộng thành **website sự kiện, tặng kèm mọi sự kiện thuê từ 5.500.000đ** (trước đây chỉ ghi cho tiệc cưới). Quà phải hiện ở gói Premium 2, ở mọi gói theo ngày, và trong một dòng chú thích nổi bật ở đầu trang Bảng giá.

## Chủ dự án đã chọn

- Dòng chú thích đặt ở đầu trang Bảng giá, không làm thanh thông báo cho mọi trang.
- Link quà trong các gói dẫn về trang Thiệp cưới trên happybooth.vn, không dẫn thẳng sang invite.
- Sửa câu chữ trên invite cho khớp: "khi thuê dịch vụ HappyBooth từ 5.500.000đ" (bỏ "cho tiệc cưới"), rồi deploy lại invite. Loại tiệc chưa có mẫu sẵn thì HappyBooth thiết kế riêng.

## Không làm

- Không làm thanh thông báo cho mọi trang.
- Không sửa thẻ giá hay Offer JSON-LD.
- Không đổi khối thiệp trên trang chủ, ngoài dòng giá.
- Không bỏ `vi-only` của mục menu.

## Coi là hỏng nếu

- Điều kiện quà lệch giữa happybooth.vn và invite.
- Trang mới thiếu một trong các bước bắt buộc khi thêm trang công khai: permalink, router, i18n title, sitemap, canonical, ảnh chia sẻ.
- FAQ hiện trên trang lệch với JSON-LD.

## Thiết kế

1. **Trang `/thiep-cuoi-online`** (`pages/services/thiep-cuoi-online.html`, `data-page="thiep-cuoi-online"`).
   - Header và footer giống các trang khác; mục "Thiệp cưới" mang class `active`. Phần thân chỉ có tiếng Việt (`lang="vi"`, không có `data-i18n`), giống trang dịch vụ.
   - Các phần của trang:
     - giới thiệu: h1 "Thiệp cưới online gọi đúng tên từng vị khách", câu mô tả của invite, nút hồng **"Xem chi tiết"** sang `https://invite.happybooth.vn/`;
     - 10 mẫu: ảnh màn đầu, mỗi ảnh dẫn tới trang mẫu bên invite;
     - 4 tính năng;
     - tóm tắt giá: Cơ bản 249.000đ, Cao cấp 349.000đ, Tặng kèm khi thuê HappyBooth từ 5.500.000đ, Thiết kế theo yêu cầu từ 249.000đ; mỗi gói 2–3 ý, lấy từ invite;
     - 4 bước đặt;
     - 3 câu hỏi đáp, trong đó có câu "Tiệc công ty, sinh nhật có được tặng không?";
     - khối kêu gọi cuối trang với nút "Xem chi tiết" và "Gọi 0971 842 329".
   - Head: title, description, canonical `https://happybooth.vn/thiep-cuoi-online`, ảnh chia sẻ 1200×630 mới, JSON-LD `Service` (2 Offer 249000/349000), `BreadcrumbList` và `FAQPage` khớp với 3 câu hỏi đáp.
   - Đăng ký trang: `pagePaths` + `preloadPages()` trong `router.js`; `meta.title.thiep-cuoi-online` trong `vi.json`/`en.json`; `sitemap.xml`.
2. **Link về trang mới.** Mục menu (header, menu mobile, footer) của 9 trang, dòng dịch vụ và ghi chú dưới bảng giá trang chủ chuyển sang `/thiep-cuoi-online`. Khối thiệp trên trang chủ vẫn dẫn thẳng sang invite.
3. **Câu chữ quà trên trang chủ.**
   - Ghi chú dưới bảng giá: "Sự kiện thuê từ 5.500.000đ được tặng kèm website sự kiện." + link "Xem mẫu".
   - Dòng giá trong khối thiệp: "Từ 249.000đ · Tặng kèm khi thuê dịch vụ HappyBooth từ 5.500.000đ."
4. **Trang Bảng giá.**
   - Dòng chú thích nổi bật ngay dưới đoạn mô tả: thẻ nền blush, chữ đậm. Nội dung "Tặng kèm website sự kiện cho mọi sự kiện thuê từ 5.500.000đ." + link "Xem website sự kiện" về `/thiep-cuoi-online`.
   - Thêm dòng `<li>` "Tặng website sự kiện" (có link) vào Premium 2, Basic theo ngày, Premium theo ngày, Unlimited theo ngày và Thuê nhiều ngày.
   - Cả hai dùng `data-i18n-html`, có key trong `vi.json` và `en.json`. Tiếng Anh: "Free event website".
   - Câu hỏi đáp "Giá thuê … bao gồm những gì?": thêm câu về quà, sửa ở cả bản hiện trên trang và JSON-LD.
5. **CSS.** Thêm class `.price-gift` và `.invite-page__…`. Cập nhật cache key; trang Bảng giá và trang mới cũng dùng key.
6. **Invite.** Hai câu ở `index.html` (dòng 326 và 513) đổi thành "khi thuê dịch vụ HappyBooth từ 5.500.000đ"; thẻ gói tặng kèm thêm ý "Loại tiệc chưa có mẫu sẵn: HappyBooth thiết kế riêng". Commit vào `main`, build rồi deploy bằng wrangler.

## Kiểm tra

- `node --test tests/*.test.cjs`, có thêm test cho trang mới, link menu và quà ở 5 gói.
- Chụp màn hình trang mới (1440/390) và trang Bảng giá.
- Từ menu, điều hướng SPA vào trang mới; nút "Xem chi tiết" sang invite.
- Sau khi deploy: invite hiện câu mới; mọi link trả về 200.

Merge PR site và deploy invite phải được chủ dự án đồng ý trước.
