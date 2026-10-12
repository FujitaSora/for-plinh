# Thương một chút 🎀

Website ghi chú sở thích người yêu, giao diện tiếng Việt với nền Hello Kitty vẽ bằng SVG, màu hồng trong suốt, hỗ trợ điện thoại.

## Chức năng đã viết
- Thêm, sửa, xóa, ghim ghi chú trên trang chủ.
- Tìm kiếm và lọc theo nhóm sở thích.
- Tải bản sao JSON.
- API lưu vào Cloudflare D1; mỗi tài khoản chỉ truy cập ghi chú của chính mình.
- Chỉ báo lưu thành công sau khi máy chủ xác nhận. Nội dung biểu mẫu được giữ nếu lưu lỗi.

## Trạng thái bàn giao
Đã cài thư viện, tạo migration SQL và chạy TypeScript (tsc --noEmit) thành công.
Chưa xuất bản. Bản build bị lỗi EPERM của realpath trên môi trường Windows hiện tại; bước gửi mã nguồn qua Sites bị chính sách xét duyệt tự động chặn. Chưa kiểm chứng giao diện trên trình duyệt và chưa kiểm chứng lưu/đọc dữ liệu đầu cuối. Cơ sở dữ liệu sản xuất chưa được triển khai, vì vậy chưa thể dùng để lưu ghi chú thực tế.

## Chạy và hoàn thiện triển khai
Yêu cầu Node.js >=22.13, npm, môi trường hỗ trợ Cloudflare Workers.
1. Giải nén rồi chạy npm run install:ci.
2. Chạy npm run build.
3. Áp dụng migration local:
   node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_square_unicorn.sql
4. Chạy npm run dev; mở http://localhost:5173/signin-with-chatgpt?return_to=/ để dùng tài khoản mô phỏng cục bộ.
5. Kiểm tra thêm/sửa/ghim/xóa và tải lại trang. Dữ liệu local nằm trong .wrangler/state, riêng với dữ liệu sản xuất.
6. Hoàn tất quy trình Sites từ project_id đã có trong .openai/hosting.json: đồng bộ nguồn, build, đóng gói, triển khai riêng tư. Không tạo Site mới cho cùng dự án. Sites áp dụng migration lên D1 khi triển khai.

Sau khi triển khai thành công, đăng nhập cùng tài khoản để đọc lại các ghi chú đã lưu, kể cả khi đóng trang hoặc đổi thiết bị. Không xóa database/migration đã áp dụng. Trang này cần backend và không chạy bằng cách nhấp đúp file HTML.
