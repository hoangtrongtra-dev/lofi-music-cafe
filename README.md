# LoFi Café - Complete Music Streaming Platform

A comprehensive, production-ready lo-fi music streaming website built with React, TypeScript, and Howler.js. Features a minimalist design inspired by The Jazz Hop Café with smooth animations, responsive layout, and professional audio handling.

![LoFi Café Preview](https://images.pexels.com/photos/1694621/pexels-photo-1694621.jpeg?auto=compress&cs=tinysrgb&w=800)

## 🎵 Complete Feature Set

### Core Audio Features
- **Advanced Audio Player**: Persistent playback with professional controls
- **Playlist Management**: Create, edit, and manage custom playlists
- **Shuffle & Repeat**: Multiple playback modes (none, one, all)
- **Queue Management**: Next/previous track navigation
- **Volume Control**: Precise volume slider with mute functionality
- **Seek Control**: Click-to-seek progress bar with real-time updates
- **Cross-fade Support**: Smooth transitions between tracks

### Navigation & Pages
- **Home Page**: Featured tracks and daily mix
- **Playlists Page**: Curated collections and playlist management
- **Artists Page**: Artist profiles with detailed information
- **Search Page**: Comprehensive search with filters and suggestions
- **Favorites Page**: Personal collection of liked tracks
- **About Page**: Company information and team details

### User Experience
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 1024px
- **Dynamic Backgrounds**: Animated visualizer responding to current track
- **Loading States**: Professional loading animations and skeleton screens
- **Smooth Animations**: Micro-interactions and hover states
- **Accessibility**: WCAG 2.1 compliant with proper focus management

### Advanced Features
- **Search Functionality**: Search tracks, artists, and playlists
- **Genre Browsing**: Browse by music categories
- **Recent Searches**: Quick access to previous searches
- **Trending Content**: Popular tracks and rising artists
- **Artist Verification**: Verified artist badges and follower counts
- **Track Metadata**: Genre, release date, and detailed information

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lofi-music-cafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 🎧 Audio Configuration

### Supported Audio Formats
- **MP3**: Universal compatibility (recommended)
- **WAV**: High quality, larger file size
- **OGG**: Good compression, modern browser support
- **M4A/AAC**: Apple ecosystem, good quality

### Audio File Requirements
- **Bitrate**: 128-320 kbps (192 kbps recommended for balance of quality/size)
- **Sample Rate**: 44.1 kHz standard
- **File Size**: Keep under 10MB per track for optimal loading
- **Naming**: Use descriptive, URL-safe filenames

### Adding New Content

#### Adding Tracks
1. **Place audio files** in the `public/audio/` directory
2. **Add track metadata** to `src/data/tracks.ts`:

```typescript
{
  id: 'unique-track-id',
  title: 'Track Title',
  artist: 'Artist Name',
  album: 'Album Name',
  duration: 180, // Duration in seconds
  src: '/audio/your-track.mp3', // Path to audio file
  cover: 'https://example.com/cover.jpg', // Album artwork URL
  color: '#8B5CF6', // Optional: Theme color for visualizer
  genre: 'Lo-Fi Hip Hop', // Music genre
  releaseDate: '2024-01-15', // Release date
  isFavorite: false // Default favorite status
}
```

#### Adding Artists
Add artist information to `src/data/artists.ts`:

```typescript
{
  id: 'unique-artist-id',
  name: 'Artist Name',
  bio: 'Artist biography and description',
  image: 'https://example.com/artist-photo.jpg',
  tracks: ['track-id-1', 'track-id-2'], // Array of track IDs
  followers: 125000, // Follower count
  verified: true // Verification status
}
```

#### Adding Playlists
Add playlist information to `src/data/playlists.ts`:

```typescript
{
  id: 'unique-playlist-id',
  name: 'Playlist Name',
  description: 'Playlist description',
  tracks: ['track-id-1', 'track-id-2'], // Array of track IDs
  cover: 'https://example.com/playlist-cover.jpg',
  createdAt: '2024-01-15',
  isPublic: true // Public/private status
}
```

## 🎨 Customization

### Color Scheme
The app uses a carefully crafted color palette defined in Tailwind CSS:

- **Primary**: Indigo (`#4F46E5`)
- **Secondary**: Purple (`#8B5CF6`)
- **Accent**: Various per track
- **Success**: Green (`#10B981`)
- **Warning**: Yellow (`#F59E0B`)
- **Error**: Red (`#EF4444`)
- **Neutral**: Gray scale for text and UI elements

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Fallbacks**: System fonts for reliability
- **Weights**: 300, 400, 500, 600, 700
- **Line Heights**: 150% for body text, 120% for headings

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Technical Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── AudioPlayer.tsx  # Main audio player controls
│   ├── TrackList.tsx    # Track listing and selection
│   ├── Header.tsx       # Navigation and branding
│   ├── PlaylistsPage.tsx # Playlists management
│   ├── ArtistsPage.tsx  # Artists directory
│   ├── SearchPage.tsx   # Search functionality
│   ├── FavoritesPage.tsx # User favorites
│   ├── AboutPage.tsx    # About information
│   └── ...
├── hooks/              # Custom React hooks
│   └── useAudioPlayer.ts # Audio player logic
├── types/              # TypeScript type definitions
├── data/               # Static data and configuration
│   ├── tracks.ts       # Track database
│   ├── artists.ts      # Artist database
│   └── playlists.ts    # Playlist database
└── utils/              # Utility functions
```

### Key Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type safety and better developer experience
- **Howler.js**: Professional audio library with Web Audio API
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server
- **Lucide React**: Beautiful, customizable icons

### State Management
- **Audio State**: Managed by custom `useAudioPlayer` hook
- **Navigation State**: Simple useState for page routing
- **Search State**: Local component state with useMemo optimization
- **Playlist State**: Static data with future database integration ready

## 🚀 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirect rules for SPA routing:
   ```
   /*    /index.html   200
   ```

### Vercel
1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

### Manual Deployment
1. Run `npm run build`
2. Upload the `dist` folder contents to your web server
3. Configure your server to serve `index.html` for all routes

## 🎯 Performance Optimization

### Audio Optimization
- **Lazy Loading**: Only load audio when needed
- **Preload Strategy**: Smart preloading of next track
- **Format Selection**: Use MP3 for maximum compatibility
- **Compression**: Optimize audio files for web delivery
- **CDN Integration**: Ready for CDN deployment

### Image Optimization
- **Lazy Loading**: Implemented for album artwork
- **WebP Support**: Use modern formats when supported
- **Responsive Images**: Multiple sizes for different screen densities
- **Caching**: Proper cache headers for static assets

### Code Optimization
- **Bundle Splitting**: Automatic code splitting with Vite
- **Tree Shaking**: Remove unused code automatically
- **Minification**: Production builds are minified
- **Gzip Compression**: Enable on your server

## 🔮 Future Enhancements

### Phase 1: User Features
- **User Authentication**: Registration and login system
- **Personal Playlists**: Create and manage custom playlists
- **Advanced Favorites**: Heart/like tracks with categories
- **Recently Played**: Track listening history
- **Crossfade**: Smooth transitions between tracks

### Phase 2: Social Features
- **User Profiles**: Personal music profiles
- **Social Sharing**: Share tracks and playlists
- **Comments & Reviews**: Community interaction
- **Follow System**: Follow artists and users
- **Activity Feed**: See what friends are listening to

### Phase 3: Advanced Features
- **Real-time Visualizer**: Spectrum analysis and waveforms
- **Lyrics Display**: Synchronized lyrics for supported tracks
- **Radio Stations**: Curated continuous playback
- **Offline Mode**: Progressive Web App with offline support
- **Smart Recommendations**: AI-powered music discovery

### Phase 4: Monetization
- **Premium Subscriptions**: Ad-free experience and exclusive content
- **Artist Revenue**: Revenue sharing with content creators
- **Merchandise**: Integration with artist merchandise
- **Live Streaming**: Support for live performances
- **Concert Integration**: Event discovery and ticketing

## 🐛 Troubleshooting

### Common Issues

**Audio won't play:**
- Check that audio files are accessible via HTTP
- Verify CORS headers if serving from different domain
- Ensure audio format is supported by the browser
- Check browser autoplay policies

**Performance issues:**
- Check Network tab for large file downloads
- Optimize images and audio files
- Consider implementing service worker for caching
- Monitor memory usage with large playlists

**Styling issues:**
- Verify Tailwind CSS is properly configured
- Check for conflicting CSS rules
- Ensure proper responsive breakpoints
- Test across different browsers

**Search not working:**
- Check that search data is properly loaded
- Verify search algorithm logic
- Test with different search terms
- Check for JavaScript errors in console

### Debug Mode
Enable debug logging by setting localStorage:
```javascript
localStorage.setItem('debug', 'true');
```

## 📱 Mobile Considerations

### Touch Interactions
- Large touch targets (minimum 44px)
- Optimized volume slider for touch
- Swipe gestures for track navigation
- Pull-to-refresh functionality

### Performance
- Optimized for mobile networks
- Reduced motion for battery conservation
- Efficient rendering for lower-powered devices
- Smart image loading strategies

### PWA Features
- Service worker for offline functionality
- App manifest for home screen installation
- Push notifications for new releases
- Background audio playback

## 🔒 Security

### Content Security Policy
Implement CSP headers for production:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https:; media-src 'self' https:; connect-src 'self' https:;
```

### HTTPS Requirements
- Audio playback requires HTTPS in production
- Service Worker features need secure contexts
- Microphone access (future features) requires HTTPS
- Geolocation features require secure contexts

### Data Protection
- No personal data collection without consent
- Secure storage of user preferences
- GDPR compliance ready
- Privacy-focused analytics

## 📊 Analytics & Monitoring

### Recommended Analytics
- **Google Analytics 4**: User behavior and engagement
- **Mixpanel**: Event tracking and user journeys
- **Sentry**: Error monitoring and performance
- **Hotjar**: User experience and heatmaps

### Key Metrics to Track
- **Audio Engagement**: Play time, skip rate, completion rate
- **User Behavior**: Page views, session duration, bounce rate
- **Performance**: Load times, error rates, conversion funnels
- **Content Performance**: Popular tracks, artists, playlists

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: The Jazz Hop Café, Spotify, Apple Music
- **Audio Library**: Howler.js team for excellent audio handling
- **Icons**: Lucide React for beautiful, consistent icons
- **Fonts**: Google Fonts (Inter) for typography
- **Images**: Pexels contributors for high-quality stock photos
- **Community**: Lo-fi music community for inspiration and feedback

## 📞 Support

For support, feature requests, or bug reports:

1. **Documentation**: Check this README and inline code comments
2. **Issues**: Search existing GitHub issues
3. **New Issues**: Create detailed bug reports with:
   - Browser version and OS
   - Steps to reproduce
   - Expected vs actual behavior
   - Console errors (if any)
4. **Feature Requests**: Describe the feature and use case
5. **Community**: Join our Discord for real-time support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes with tests
4. **Submit** a pull request with detailed description
5. **Follow** our code style and conventions

### Development Guidelines
- Use TypeScript for all new code
- Follow existing component patterns
- Add proper error handling
- Include responsive design considerations
- Test across multiple browsers
- Update documentation as needed

---

Built with ❤️ for the lo-fi music community. Enjoy the vibes! 🎵

**Version**: 2.0.0  
**Last Updated**: January 2024  
**Maintainers**: LoFi Café Development Team