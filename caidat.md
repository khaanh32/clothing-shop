# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN


## 1. Yêu cầu hệ thống
- **Node.js** (v18+) & **npm**
- **PHP** (v8.1+) & **Composer**
- **Java JDK 17** & **Maven**
- **MySQL** Server (XAMPP hoặc MySQL Workbench)

---

## 2. Chuẩn bị Cơ sở dữ liệu
1. Mở MySQL (XAMPP/MySQL Workbench).
2. Tạo một database mới tên là `nhasach`.
3. Import file `nhasach.sql` (nằm ở thư mục gốc của dự án) vào database vừa tạo.

---

## 3. Cài đặt và Chạy Backend (Laravel) - Nhom1Be
Dịch vụ này xử lý các nghiệp vụ chính cho người dùng.

1. Di chuyển vào thư mục:
   ```bash
   cd backend/Nhom1Be
   ```
2. Cài đặt thư viện:
   ```bash
   composer install
   ```
3. Cấu hình môi trường:
   - Sao chép file `.env.example` thành `.env`.
   - Cập nhật thông tin kết nối Database (`DB_DATABASE=nhasach`, `DB_USERNAME`, `DB_PASSWORD`).
4. Chạy dịch vụ:
   ```bash
   php artisan serve
   ```
   *Mặc định chạy tại: http://127.0.0.1:8000*

---

## 4. Cài đặt và Chạy Backend (Spring Boot) - api_admin_nhasach
Dịch vụ này xử lý các nghiệp vụ dành cho Admin.

1. Di chuyển vào thư mục:
   ```bash
   cd backend/api_admin_nhasach
   ```
2. Cài đặt và chạy dự án (sử dụng Maven):
   ```bash
   mvn clean install
   ./mvnw spring-boot:run
   ```
   *(Nếu dùng Windows có thể chạy `./mvnw.cmd spring-boot:run` hoặc dùng IntelliJ IDEA để chạy file Application).*
   *Mặc định chạy tại: http://localhost:8080*

---

## 5. Cài đặt và Chạy Frontend (React Vite)
Giao diện người dùng và Admin.

1. Di chuyển vào thư mục:
   ```bash
   cd frontend
   ```
2. Cài đặt thư viện:
   ```bash
   npm install
   ```
3. Chạy dự án ở chế độ phát triển:
   ```bash
   npm run dev
   ```
   *Mặc định chạy tại: http://localhost:3000*

---

