# LoFi Music Cafe - Frontend

A modern, responsive web application for streaming lo-fi music with advanced features including authentication, admin controls, and media management.

## 🎵 Features

### Core Features
- **Music Streaming**: High-quality lo-fi music player with playlist support
- **User Authentication**: Secure login/register system with role-based access
- **Admin Dashboard**: Comprehensive admin panel for content management
- **Responsive Design**: Mobile-first design with beautiful UI/UX

### Admin Features
- **User Management**: Manage users, roles, and permissions
- **Content Management**: Upload and manage music tracks and playlists
- **Analytics**: View usage statistics and user activity
- **Cloudinary Integration**: Advanced media management (Admin Only)
  - Image upload and transformations
  - Audio file management
  - Media analytics and storage tracking

### User Features
- **Personal Dashboard**: View listening history and favorites
- **Search & Discovery**: Find new tracks and artists
- **Playlist Management**: Create and manage personal playlists
- **Social Features**: Share and discover music with others

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
   ```bash
# Clone the repository
   git clone <repository-url>
cd lofi-music-cafe/client

# Install dependencies
   npm install

# Start development server
   npm run dev
   ```

### Environment Variables
Create `.env.local` file:
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

## 🏗️ Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── admin/           # Admin-only components
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── CloudinaryManager.tsx
│   │   │   └── controllers/
│   │   ├── AudioPlayer.tsx
│   │   ├── Header.tsx
│   │   ├── AuthPage.tsx
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication & authorization
│   ├── hooks/
│   │   └── useAudioPlayer.ts
│   ├── types/
│   │   ├── User.ts
│   │   └── Track.ts
│   └── data/
│       ├── tracks.ts
│       ├── artists.ts
│       └── playlists.ts
```

## 🔐 Authentication

### User Roles
- **User**: Basic access to music streaming and personal features
- **Admin**: Full access including admin dashboard and Cloudinary management

### Demo Credentials
- **Admin**: admin@lofi-cafe.com / admin123
- **User**: user@lofi-cafe.com / user123

## ☁️ Cloudinary Configuration (Admin Only)

### Setup Cloudinary
1. **Create Account**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Get Credentials**: 
   - Cloud Name from Dashboard
   - Create upload preset
3. **Environment Variables**:
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### Admin Cloudinary Features
- **Media Upload**: Upload images and audio files
- **Transformations**: Apply image transformations and optimizations
- **Content Management**: Organize and manage media files
- **Analytics**: Track storage usage and upload activity

### Folder Structure
```
lofi-cafe/
├── admin/
│   ├── images/
│   └── audio/
├── public/
│   ├── images/
│   └── audio/
```

## 🎨 UI Components

### Core Components
- **Header**: Navigation and user controls
- **AudioPlayer**: Music player with controls
- **TrackList**: Display and manage music tracks
- **AuthPage**: Login/register forms

### Admin Components
- **AdminDashboard**: Main admin interface
- **CloudinaryManager**: Media management interface
- **UserController**: User management
- **ContentController**: Content management
- **AnalyticsController**: Analytics and reports

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality
- Prettier for formatting

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Touch-friendly controls
- Adaptive layouts
- Optimized for all screen sizes

## 🔒 Security

- Role-based access control
- Secure authentication
- Admin-only features protection
- Input validation and sanitization

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy
The built files in `dist/` can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.