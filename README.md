# LoFi Music Cafe

A modern music streaming application with lo-fi vibes, built with React, TypeScript, and MongoDB.

## Project Structure

```
lofi-music-cafe/
├── client/                 # Frontend React application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.ts     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── ...                # Other frontend config files
├── server/                # Backend Node.js application
│   ├── scripts/           # Database scripts
│   │   └── seed-mongodb.mjs # MongoDB seeding script
│   └── ...                # Backend source code (to be added)
└── README.md              # This file
```

## Quick Start

### Frontend (Client)

   ```bash
cd client
   npm install
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend (Server)

```bash
cd server
# Install backend dependencies (when backend is created)
npm install
# Run the server
npm start
```

### Database Setup

To seed the database with sample data:

```bash
cd server
node scripts/seed-mongodb.mjs
```

This will create:
- 1 admin account: `admin@lofi-cafe.com` / `admin123`
- 1 user account: `user@lofi-cafe.com` / `user123`
- Sample tracks, artists, and playlists

## Features

- 🎵 Music streaming with lo-fi vibes
- 👤 User authentication and authorization
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🎛️ Audio player with visualizer
- 📊 Admin dashboard
- ☁️ Cloudinary integration for media
- 🎯 Mood-based playlists
- 🌙 Sleep timer
- 📈 Listening statistics

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- React Router

### Backend (Planned)
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary SDK

## Development

### Frontend Development
- Located in `client/` directory
- Uses Vite for fast development
- Hot module replacement enabled
- TypeScript for type safety

### Backend Development
- Located in `server/` directory
- MongoDB for database
- RESTful API endpoints
- JWT for authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 