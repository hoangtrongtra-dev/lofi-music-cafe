# Authentication Testing Guide

## Vấn đề: Nút "Sign In" không có phản hồi

### Các bước đã thực hiện để sửa lỗi:

1. **Cập nhật AuthPage component**:
   - Thêm `onClose` prop để đóng modal
   - Thêm console.log để debug
   - Cải thiện error handling

2. **Sửa type mismatch**:
   - Cập nhật Header component để sử dụng `AuthUser` thay vì `User`
   - Đảm bảo type consistency giữa AuthContext và components

3. **Thêm debug components**:
   - `SimpleAuthTest`: Component test đơn giản ở góc trái màn hình
   - Console logging để track authentication flow

### Cách test:

1. **Chạy ứng dụng**:
   ```bash
   npm run dev
   ```

2. **Test authentication**:
   - Nhìn vào góc trái màn hình để thấy `SimpleAuthTest` component
   - Hoặc click nút "Sign In" trong header
   - Sử dụng credentials:
     - **Admin**: admin@lofi-cafe.com / admin123
     - **User**: user@lofi-cafe.com / user123

3. **Kiểm tra console**:
   - Mở Developer Tools (F12)
   - Xem Console tab để track authentication flow
   - Các log messages sẽ hiển thị:
     - "Login attempt with: ..."
     - "Login successful" hoặc "Login failed: ..."

### Expected Behavior:

1. **Click "Sign In"**:
   - Modal mở với form login
   - Có thể nhập email/password
   - Nút "Sign In" có loading state

2. **Submit form**:
   - Loading state hiển thị ("Signing in...")
   - Sau 1 giây, success message hiển thị
   - Modal tự động đóng sau 1 giây
   - Header hiển thị user avatar và role

3. **Admin users**:
   - Thấy "Admin Panel" button
   - Có thể truy cập admin dashboard

### Troubleshooting:

1. **Nếu nút không respond**:
   - Kiểm tra console errors
   - Đảm bảo AuthContext được wrap đúng cách
   - Kiểm tra event handlers

2. **Nếu modal không mở**:
   - Kiểm tra AuthPage component import
   - Đảm bảo `showAuth` state được set đúng

3. **Nếu login fail**:
   - Kiểm tra AuthContext implementation
   - Đảm bảo mock API hoạt động đúng
   - Kiểm tra credentials

### Files đã sửa:

- `src/components/AuthPage.tsx`: Thêm onClose prop và debug logging
- `src/components/Header.tsx`: Sửa type mismatch
- `src/App.tsx`: Thêm debug component
- `src/components/SimpleAuthTest.tsx`: Component test mới

### Next Steps:

1. Test với SimpleAuthTest component
2. Kiểm tra console logs
3. Nếu vẫn có vấn đề, kiểm tra:
   - Browser console errors
   - Network requests
   - React DevTools state 