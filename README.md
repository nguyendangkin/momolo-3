# MoMoLo Note

MoMoLo Note là ứng dụng ghi chú nhanh, hỗ trợ lưu trữ, chia sẻ ghi chú và nhận ủng hộ trực tuyến. Dự án gồm 2 phần: **Frontend** (Next.js) và **Backend** (NestJS, PostgreSQL, PayOS).

---

## 🚀 Giới thiệu

-   **MoMoLo Note** giúp bạn ghi chú, lưu trữ, chia sẻ nội dung mọi lúc, mọi nơi.
-   Hỗ trợ chế độ Plain Text & Code Mode, tự động lưu, tải về, copy, chia sẻ link.
-   Tích hợp hệ thống donate qua PayOS, hiển thị bảng xếp hạng người ủng hộ.

---

## 🛠️ Công nghệ sử dụng

-   **Frontend:** Next.js 14+, React, TypeScript, TailwindCSS, Lucide Icons, React Toastify
-   **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL, PayOS SDK
-   **Khác:** Docker (tùy chọn), .env config, RESTful API

---

## 📦 Cài đặt & chạy dự án

### 1. Clone source code

```bash
git clone https://github.com/your-username/momolo-2.git
cd momolo-2
```

### 2. Cấu hình biến môi trường

-   **Backend:** Tạo file `.env` trong `backend/` với các biến:
    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=yourpassword
    DB_DATABASE=momolo
    PAYOS_CLIENT_ID=...
    PAYOS_API_KEY=...
    PAYOS_CHECKSUM_KEY=...
    FRONT_END_DOMAIN=http://localhost:3000
    ```
-   **Frontend:** Tạo file `.env.local` trong `frontend/`:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

### 3. Cài đặt dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Khởi động ứng dụng

-   **Backend:**

    ```bash
    npm run start:dev
    ```

    Mặc định chạy ở `http://localhost:3001`

-   **Frontend:**
    ```bash
    npm run dev
    ```
    Mặc định chạy ở `http://localhost:3000`

---

## 🌟 Tính năng nổi bật

-   Ghi chú nhanh, lưu tự động, tải về, copy, chia sẻ link.
-   Chế độ hiển thị code (Code Mode) và Plain Text.
-   Tùy chỉnh font size, chế độ công khai/riêng tư.
-   Hệ thống donate: tạo link thanh toán PayOS, thống kê số lượt, số tiền, bảng xếp hạng người ủng hộ.
-   Phân trang danh sách donors, hiển thị tổng số tiền, lượt và người ủng hộ.

---

## 📄 API chính

-   `POST /notes` – Tạo ghi chú mới
-   `GET /notes/:id` – Lấy nội dung ghi chú
-   `POST /pays` – Tạo link donate
-   `GET /pays` – Lấy danh sách donors (có phân trang, thống kê)

---

## 💻 Phát triển & đóng góp

-   Fork, tạo branch mới, gửi PR.
-   Đóng góp ý tưởng, báo lỗi qua Issues.

---

## 📚 Tài liệu tham khảo

-   [NestJS Docs](https://docs.nestjs.com)
-   [Next.js Docs](https://nextjs.org/docs)
-   [PayOS Docs](https://docs.payos.vn/)

---

## 📢 Liên hệ & License

-   Website: [https://momolo.io.vn](https://momolo.io.vn)
-   License: MIT

---

> **MoMoLo Note** – Ghi chú nhanh, lưu trữ dễ dàng, nhận ủng
