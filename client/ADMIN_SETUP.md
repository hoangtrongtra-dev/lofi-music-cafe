# Hệ thống Admin/User - Lofi Music Cafe

## Tổng quan

Hệ thống phân quyền Admin/User đã được tích hợp vào dự án Lofi Music Cafe với các tính năng quản lý toàn diện cho phía admin.

## Cấu trúc hệ thống

### 1. Phân quyền (User Roles)

```typescript
enum UserRole {
  USER = 'user',        // Người dùng thông thường
  ADMIN = 'admin',      // Quản trị viên
  MODERATOR = 'moderator' // Điều hành viên
}
```

### 2. Trạng thái người dùng (User Status)

```typescript
enum UserStatus {
  ACTIVE = 'active',      // Hoạt động
  INACTIVE = 'inactive',  // Không hoạt động
  SUSPENDED = 'suspended', // Tạm khóa
  BANNED = 'banned'       // Cấm vĩnh viễn
}
```

## Tính năng Admin

### 1. Admin Dashboard
- **Overview**: Tổng quan hệ thống với thống kê
- **User Management**: Quản lý người dùng
- **Content Management**: Quản lý nội dung âm nhạc
- **Reports Management**: Xử lý báo cáo
- **Analytics**: Phân tích dữ liệu
- **Settings**: Cài đặt hệ thống

### 2. User Controller
- Xem danh sách tất cả người dùng
- Tìm kiếm và lọc người dùng
- Thay đổi vai trò người dùng
- Thay đổi trạng thái người dùng
- Xóa người dùng
- Export dữ liệu người dùng

### 3. Content Controller
- Quản lý tracks và albums
- Upload/Edit/Delete content
- Quản lý metadata
- Bulk import/export
- Kiểm duyệt nội dung

### 4. Reports Controller
- Xem báo cáo từ người dùng
- Phân loại báo cáo (inappropriate, copyright, spam)
- Xử lý và giải quyết báo cáo
- Gán báo cáo cho moderator
- Theo dõi trạng thái xử lý

### 5. Analytics Controller
- Thống kê người dùng
- Phân tích nội dung
- Báo cáo hoạt động
- Biểu đồ tương tác
- Metrics hiệu suất

## Cách sử dụng

### 1. Đăng nhập Admin
```typescript
// Mock admin credentials
email: 'admin@lofi.com'
password: 'any-password'
```

### 2. Truy cập Admin Panel
- Đăng nhập với tài khoản admin
- Click "Admin Panel" button trên trang chủ
- Hoặc truy cập trực tiếp qua navigation

### 3. Quản lý Users
```typescript
// Các action có thể thực hiện
- View user details
- Change user role (User → Moderator → Admin)
- Change user status (Active → Suspended → Banned)
- Delete user account
- Export user data
```

### 4. Quản lý Content
```typescript
// Các action có thể thực hiện
- Upload new tracks
- Edit track metadata
- Delete inappropriate content
- Bulk import tracks
- Manage playlists
```

### 5. Xử lý Reports
```typescript
// Workflow xử lý báo cáo
1. Review pending reports
2. Assign to moderator/admin
3. Investigate reported content
4. Take action (remove content, warn user, ban user)
5. Mark as resolved/dismissed
```

## Bảo mật

### 1. Authentication
- JWT token-based authentication
- Session management
- Automatic token refresh

### 2. Authorization
- Role-based access control (RBAC)
- Permission-based actions
- Route protection

### 3. Data Protection
- Encrypted user data
- Secure API endpoints
- Input validation
- SQL injection prevention

## API Endpoints (Mock)

### Authentication
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
```

### User Management
```typescript
GET /api/admin/users
GET /api/admin/users/:id
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
POST /api/admin/users/:id/role
POST /api/admin/users/:id/status
```

### Content Management
```typescript
GET /api/admin/content
POST /api/admin/content
PUT /api/admin/content/:id
DELETE /api/admin/content/:id
POST /api/admin/content/bulk-import
```

### Reports Management
```typescript
GET /api/admin/reports
GET /api/admin/reports/:id
PUT /api/admin/reports/:id
POST /api/admin/reports/:id/assign
POST /api/admin/reports/:id/resolve
```

## Cấu hình

### 1. Environment Variables
```env
# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Database
DATABASE_URL=your-database-url

# Admin Settings
ADMIN_EMAIL=admin@lofi.com
ADMIN_PASSWORD=secure-password
```

### 2. Permissions Configuration
```typescript
const adminPermissions = {
  canManageUsers: true,
  canManageContent: true,
  canManagePlaylists: true,
  canManageArtists: true,
  canViewAnalytics: true,
  canManageSettings: true,
  canModerateComments: true,
  canManageReports: true
};
```

## Monitoring & Logging

### 1. Admin Actions Log
```typescript
interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  target: string;
  details: any;
  timestamp: Date;
  ipAddress: string;
}
```

### 2. User Activity Tracking
```typescript
interface UserActivity {
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  metadata: any;
}
```

## Troubleshooting

### 1. Admin không thể đăng nhập
- Kiểm tra email/password
- Verify admin role trong database
- Check JWT token validity

### 2. Không thể truy cập Admin Panel
- Verify user role là ADMIN
- Check permissions configuration
- Clear browser cache

### 3. Reports không hiển thị
- Check database connection
- Verify report status
- Check user permissions

## Future Enhancements

### 1. Advanced Analytics
- Real-time user tracking
- Predictive analytics
- A/B testing framework

### 2. Content Moderation
- AI-powered content filtering
- Automated flagging system
- Community moderation tools

### 3. User Management
- Bulk user operations
- Advanced user search
- User activity timeline

### 4. Security
- Two-factor authentication
- IP whitelisting
- Audit trail system 