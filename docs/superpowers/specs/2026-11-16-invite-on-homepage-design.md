# Đưa thiệp cưới online lên trang chủ happybooth.vn

Ngày: 2026-11-16. Phạm vi: repo `happybooth/happybooth.vn` gồm `index.html`, header/menu/footer của 9 trang và `assets/css/style.css`. Kích cỡ: thay đổi nhỏ.

## Mục đích

https://invite.happybooth.vn (10 mẫu thiệp cưới online, giá từ 249.000đ) đã chạy. Chủ dự án muốn khách vào happybooth.vn biết có sản phẩm này. Thiệp được **tặng kèm khi thuê dịch vụ HappyBooth cho tiệc cưới từ 5.500.000đ**, đúng mức gói Premium 2 trên bảng giá trang chủ. Vì vậy nội dung mới còn có việc thứ hai: cho khách cưới thêm một lý do chọn gói cao hơn.

## Mục tiêu

- Thêm một khối riêng "Thiệp cưới online" trên trang chủ, ngay sau phần dịch vụ.
- Thêm các điểm chạm nhỏ: một dòng trong danh sách dịch vụ, một ghi chú tặng kèm dưới bảng giá, và mục "Thiệp cưới" ở menu chính, menu mobile và footer của cả 9 trang.

## Không làm

- Không đổi phần đầu trang (tiêu đề lớn, nút chuyển Doanh nghiệp/Tiệc cưới, dòng chữ chạy).
- Không sửa trang `/price`, hỏi đáp, JSON-LD hay `sitemap.xml`.
- Không thêm analytics hay UTM.
- Không dịch sang tiếng Anh.

## Coi là hỏng nếu

- Thông điệp chính "cho thuê photobooth Hà Nội" bị loãng.
- Hứa tính năng invite chưa có, như album ảnh photobooth sau tiệc hay tải ảnh lên.
- Giá hoặc điều kiện tặng kèm lệch với invite.happybooth.vn.
- Menu desktop bị chật hoặc xuống dòng ở các độ rộng từ 960px đến 1100px.

## Các cách đã cân nhắc

1. **Khối riêng + điểm chạm.** Chủ dự án chọn cách này. Nó đủ nổi, đặt gần dịch vụ và bảng giá nên ăn khớp với ưu đãi tặng kèm.
2. **Chỉ điểm chạm nhỏ.** Nhanh nhất nhưng dễ bị lướt qua.
3. **Đưa lên đầu trang** (thanh thông báo, hoặc nút thứ ba ở phần đầu trang). Nổi nhất, nhưng làm loãng tiêu đề đang phục vụ SEO, và thanh thông báo phải sửa cả 9 trang.

Chủ dự án chọn vị trí "ngay sau phần dịch vụ" và đồng ý thêm mục vào menu chính.

## Thiết kế

1. **Khối "Thiệp cưới online"** (`<section class="home-section invite-band">`), đặt giữa phần "Tiệc nào cũng có booth phù hợp" và "Khách nói gì sau tiệc".
   - Nhãn nhỏ: "Mới · Thiệp cưới online".
   - Tiêu đề (h2): "Thiệp cưới online gọi đúng tên từng vị khách".
   - Đoạn mô tả, chép đúng câu đang dùng trên invite: "Gửi một đường link cho cả họ hàng lẫn bạn bè. Ai mở ra cũng thấy lời mời dành cho chính mình, kèm nhạc nền, bản đồ, lịch âm và nút xác nhận tham dự."
   - Ba ảnh mẫu Sơn Son, Dải Phim và Ép Hoa đặt trong khung bo góc kiểu điện thoại. Mỗi ảnh dẫn tới trang mẫu đó: `https://invite.happybooth.vn/mau-son-son/`, `/mau-dai-phim/`, `/mau-ep-hoa/`.
     - Nguồn ảnh: `happybooth-invite/assets/catalog/thumbs/<mẫu>.jpg`. Mỗi file 488×3165 là ba màn hình ghép dọc, chỉ cắt màn đầu (488×1055).
     - Lưu thành WebP trong `assets/images/invite/`, ghi đúng `width`/`height`, dùng `loading="lazy"`.
   - Dòng giá: "Từ 249.000đ · Tặng kèm khi thuê dịch vụ HappyBooth cho tiệc cưới từ 5.500.000đ."
   - Nút: nút hồng "Xem 10 mẫu thiệp" dẫn tới `https://invite.happybooth.vn/#mau`; text link "Bảng giá thiệp" dẫn tới `https://invite.happybooth.vn/#gia`.
   - Mọi link mở trong cùng tab. Router bỏ qua link ngoài site nên không cần sửa `router.js`.
2. **Dòng thứ 5 trong danh sách dịch vụ:**
   - Tên: "Thiệp cưới online".
   - Mô tả: "Một đường link mời cho cả họ hàng, bạn bè, gọi đúng tên từng người."
   - Nhãn: "Từ 249.000đ". Ảnh nhỏ là một ảnh mẫu thiệp. Tên dòng là link tới invite.
3. **Ghi chú dưới bảng giá** (trong `.price-band`, dưới bảng gói): "Tiệc cưới thuê từ 5.500.000đ được tặng kèm thiệp cưới online", kèm link "Xem mẫu thiệp".
4. **Mục menu "Thiệp cưới"** dẫn tới `https://invite.happybooth.vn/`.
   - Đặt giữa "Khung ảnh" và "Bảng giá".
   - Có mặt ở `header__nav`, `mobile-nav` và `footer__nav` của cả 9 trang (header và footer được chép tay trên từng trang).
   - **Chỗ cho mục mới (chủ dự án chọn khi đang triển khai).** Thêm mục này thì header desktop thiếu khoảng 60px ở mọi độ rộng, và nút "Nhận báo giá" bị bóp thành 3 dòng. Cách xử lý:
     - Ẩn số điện thoại và icon TikTok/Facebook ở header desktop ở mọi độ rộng. Trước đây chúng chỉ ẩn khi màn hình ≤1200px. Nút gọi điện, Zalo và Facebook nổi ở góc phải, menu mobile và footer vẫn giữ các liên hệ này.
     - Chuyển sang menu hamburger từ 1150px trở xuống, thay vì 960px. Cách này sửa luôn chỗ production vốn đã bị bóp nhẹ ở 961–1000px.
5. **Tiếng Anh.** Invite chỉ có tiếng Việt, nên mọi điểm chạm (khối, dòng dịch vụ, ghi chú giá, mục menu) đều mang `lang="vi"` và bị ẩn bằng `html[lang="en"] … { display: none; }`, giống cách làm với `.seo-intro`. Không thêm key nào vào `vi.json` hay `en.json`.
6. **CSS.** Thêm class BEM mới (`.invite-band__…`) và dùng lại biến màu/font có sẵn. Sau khi sửa `style.css`, cập nhật cache key `?v=` trên 4 trang theo hướng dẫn trong CLAUDE.md.

## Kiểm tra

- `node --test tests/*.test.cjs` phải xanh.
- Chạy `node scripts/serve.cjs` và chụp màn hình bằng headless Chrome:
  - trang chủ ở 1440, 1100, 960 (menu không xuống dòng) và 390 (menu mobile, khối mới);
  - một trang khác (`/price`) để thấy menu mới;
  - chế độ tiếng Anh, để chắc mọi điểm chạm đều ẩn.
- Mọi link tới invite trả về 200.

## Phát hành

Mở PR trên `happybooth/happybooth.vn`. `main` lên production ngay khi merge, nên phải hỏi chủ dự án trước khi merge. Sau khi merge, kiểm tra lại happybooth.vn.

## Để người làm tự quyết

Bố cục chi tiết và khoảng cách của khối, cách xếp ảnh trên mobile (3 cột nhỏ hoặc cuộn ngang), alt text, ảnh nhỏ cho dòng dịch vụ.
