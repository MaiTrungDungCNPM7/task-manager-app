# Mô tả dự án
- Đây là một ứng dụng webapp quản lý công việc (task manager app) đơn giản.
- Ứng dụng này có thể sử dụng cả trên Desktop lẫn Mobile.
- Bao gồm các trang chính là một bảng danh sách công việc cần làm và một trang giới thiệu dự án.
- Có các chức năng CRUD cơ bản gồm Thêm, Xóa, Xem chi tiết và Chỉnh sửa công việc.
- Đường link dự án được deploy trên web: https://task-manager-app-alpha-gray.vercel.app/

## Tech Stack (Công nghệ sử dụng)
Dự án có sử dụng các công nghệ chính sau:
- Template của dự án sử dụng Vite@react
- Ngôn ngữ lập trình được sử dụng chính là JavaScript viết trên extension JSX 
- Các thư viện chính được sử dụng là React Native, axios, React-router và Tailwind CSS
- Chạy server node npm/npx
Ngoài ra còn có:
- Dự án được quản lý bằng Github 
- Deploy trên Vercel
- Sử dụng VSCode là IDE phát triển chính

## Hướng dẫn cài đặt dự án và khởi chạy trên localhost:
Link Github của dự án: https://github.com/MaiTrungDungCNPM7/task-manager-app.git
Đầu tiên, tạo một thư mục mới mà bạn muốn chứa dự án. Sau đó mở cửa sổ cmd/powershell tại thư mục đó bằng cách click vào thanh đường dẫn thư mục.
Sau đó tại cửa số cmd/powershell lần lượt nhập các lệnh:
- `git clone https://github.com/MaiTrungDungCNPM7/task-manager-app.git`
- Sau đó đợi dự án được clone về xong thì mở nó ra trong IDE.
Ở trong IDE ta làm:
- Tạo cửa số terminal mới.
- `git branch` để kiểm tra nhánh (thường dự án sẽ ở nhánh main mặc định)
- Nhập `git checkout -b ＜tên nhánh bạn muốn đặt＞` để tạo nhánh git mới nơi bạn sẽ làm việc với dự án.
- Nhập `npm i` hoặc `npm install` để cài đặt các thư viện và module cần thiết.
- Cuối cùng, nhập `npm run dev` để dự án khởi chạy, sau đó truy cập đường dẫn hiện ra (thường sẽ là `http://localhost:5173/`) là chạy local thành công.
