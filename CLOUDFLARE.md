# Triển khai trực tiếp trên Cloudflare
- Database: for-plinh-db (đã khai báo trong wrangler.database.json).
- Build command: node scripts/build-cloudflare.mjs
- Deploy command: node scripts/deploy-cloudflare.mjs
- Branch: main
- Không dùng bản preview để sửa dữ liệu thật.
- Deploy script áp dụng migration trước rồi triển khai Worker bằng cấu hình đầu ra của Vite.
- Dữ liệu local cũ vẫn nằm trên máy trong .wrangler/state; chưa sao chép lên D1 trực tuyến.
- tsc đã đạt; build sản xuất trên Windows bị EPERM, cần kiểm tra log build Cloudflare.

- Sổ chung công khai: mọi người có link đều đọc, thêm, sửa, ghim và xóa được. Không cần mật khẩu.

