# Thiệp Mời Tốt Nghiệp (Graduation Invitation)

Website thiệp mời tốt nghiệp phong cách biên tập cổ điển (kem giấy · xanh rừng · nhũ vàng), hỗ trợ cá nhân hoá tên khách mời qua URL, phong bì xé thư 3D, nhạc nền, đếm ngược thời gian thực, album kỷ niệm, thư cảm ơn và sổ lưu bút RSVP.

## Tính năng chính
- **Cá nhân hoá theo đường dẫn (`?to=`)**: Ví dụ `?to=Anh+Minh` sẽ tự động điền tên khách mời trên phong bì, thiệp mời, phần RSVP và lời kết.
- **Hiệu ứng mở phong bì**: Hỗ trợ kéo/vuốt ngang mép `XÉ Ở ĐÂY` hoặc nhấn để xé phong bì, bức thư trồi lên và mở ra toàn màn hình, bung pháo giấy và phát nhạc nền.
- **Chuyển trang 3D Cube-Fold & Scroll Snap**: Cuộn mượt từng khung `100svh` với hiệu ứng gấp khối 3D, viết tay nét chữ (`mask-position`) và chân dung pop-out parallax.
- **Đếm ngược trực tiếp**: Tự động đếm từng ngày/giờ/phút/giây đến thời điểm diễn ra lễ tốt nghiệp.
- **Album kỷ niệm 3 trang**: Lưới ảnh tự căn tỷ lệ kèm thước phim chuyển động Ken Burns (hỗ trợ thay bằng file `.mp4` thật trong `config.js`).
- **RSVP & Sổ lưu bút**: Xác nhận tham dự, gửi lời chúc, đính kèm ảnh (tự động nén trên trình duyệt), lưu vào `localStorage` và hiển thị ngay lên Sổ lưu bút. Hỗ trợ cấu hình thêm `guestbookEndpoint` (Google Apps Script / API) nếu muốn lưu online.

## Tuỳ chỉnh nhanh
Mở file `config.js` để thay đổi:
- Tên tân cử nhân, trường, chuyên ngành (`graduate`)
- Ngày giờ, địa điểm và link Google Maps (`event`)
- Lời cảm ơn, lời chúc mặc định và danh sách ảnh/video (`thanksParagraphs`, `album`, `media`)
- File nhạc nền (`musicSrc`)

## Chạy thử trên máy
Vì trình duyệt hạn chế một số tính năng khi mở trực tiếp `file://`, bạn nên chạy qua server tĩnh:

```bash
npx serve .
# hoặc
python -m http.server 8080
```
