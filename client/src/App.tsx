import React, { useState, useCallback } from 'react';
import { tracks } from './data/tracks';
import { Track } from './types/Track';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import TrackList from './components/TrackList';
import EnhancedAudioPlayer from './components/EnhancedAudioPlayer';
import BackgroundVisualizer from './components/BackgroundVisualizer';
import LoadingSpinner from './components/LoadingSpinner';
import PlaylistsPage from './components/PlaylistsPage';
import ArtistsPage from './components/ArtistsPage';
import AboutPage from './components/AboutPage';
import FavoritesPage from './components/FavoritesPage';
import SearchPage from './components/SearchPage';
import AuthPage from './components/AuthPage';
import SimpleAuthTest from './components/SimpleAuthTest';
import Footer from './components/Footer';
import SocialFeatures from './components/SocialFeatures';
import WeatherBasedPlaylists from './components/WeatherBasedPlaylists';
import PersonalDashboard from './components/PersonalDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminTestToolsDrawer from './components/admin/AdminTestToolsDrawer';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const { user, isAuthenticated, isAdmin } = useAuth();

  const {
    playerState,
    loadTrack,
    togglePlay,
    setVolume,
    setMuted,
    seek,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious
  } = useAudioPlayer();

  const handleTrackSelect = useCallback(async (track: Track, playlist: Track[] = [], index: number = 0) => {
    setIsLoading(true);
    
    try {
      await loadTrack(track, playlist, index);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading track:', error);
      setIsLoading(false);
    }
  }, [loadTrack]);

  const handleMoodSelect = (mood: string) => {
    // Filter tracks based on mood and play them
    const moodTracks = tracks.filter(track => {
      switch (mood) {
        case 'energetic':
          return track.genre?.includes('Hip Hop') || track.genre?.includes('Synthwave');
        case 'focused':
          return track.genre?.includes('Study') || track.genre?.includes('Ambient');
        case 'chill':
          return track.genre?.includes('Chillhop') || track.genre?.includes('Lo-Fi');
        case 'romantic':
          return track.genre?.includes('Jazz') || track.genre?.includes('Downtempo');
        case 'rainy':
          return track.title.toLowerCase().includes('rain') || track.genre?.includes('Ambient');
        default:
          return true;
      }
    });
    
    if (moodTracks.length > 0) {
      handleTrackSelect(moodTracks[0], moodTracks, 0);
    }
  };

  const handleSleepTimerEnd = () => {
    if (playerState.isPlaying) {
      togglePlay();
    }
  };

  const handleWeatherPlaylistSelect = (playlist: any) => {
    const playlistTracks = playlist.tracks.map((id: string) => 
      tracks.find(track => track.id === id)
    ).filter(Boolean);
    
    if (playlistTracks.length > 0) {
      handleTrackSelect(playlistTracks[0], playlistTracks, 0);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'playlists':
        return (
          <div className="space-y-8">
            <PlaylistsPage
              onPlayTrack={handleTrackSelect}
              currentTrack={playerState.currentTrack}
              isPlaying={playerState.isPlaying}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <WeatherBasedPlaylists onPlaylistSelect={handleWeatherPlaylistSelect} />
            </div>
          </div>
        );
      case 'artists':
        return (
          <ArtistsPage
            onPlayTrack={handleTrackSelect}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'favorites':
        return (
          <FavoritesPage
            onPlayTrack={handleTrackSelect}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTogglePlay={togglePlay}
          />
        );
      case 'search':
        return (
          <SearchPage
            onPlayTrack={handleTrackSelect}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTogglePlay={togglePlay}
          />
        );
      default:
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Focus. Create. Relax.
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Discover the perfect lo-fi beats for studying, working, and unwinding. 
                High-quality chillhop and ambient music to enhance your daily rhythm.
              </p>
            </div>

            {/* Current Track Display */}
            {playerState.currentTrack && (
              <div className="mb-8 text-center">
                <div className="inline-block p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl">
                  <img
                    src={playerState.currentTrack.cover}
                    alt={`${playerState.currentTrack.title} cover`}
                    className="w-32 h-32 mx-auto rounded-xl shadow-lg mb-4 object-cover"
                  />
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {playerState.currentTrack.title}
                  </h3>
                  <p className="text-white/80 text-lg">
                    {playerState.currentTrack.artist}
                  </p>
                  {playerState.isPlaying && (
                    <div className="mt-3 flex justify-center">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-6 bg-white rounded-full animate-pulse"></div>
                        <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Features */}
            <div className="mb-8">
              <SocialFeatures currentTrack={playerState.currentTrack} />
            </div>

            {/* Track List */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Today's Mix
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
                  >
                    View Stats
                  </button>
                  {isAdmin() && (
                    <button
                      onClick={() => setShowAdminDashboard(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-colors"
                    >
                      Admin Panel
                    </button>
                  )}
                  <span className="text-white/70">
                    {tracks.length} tracks
                  </span>
                </div>
              </div>
              
              <TrackList
                tracks={tracks}
                currentTrack={playerState.currentTrack}
                isPlaying={playerState.isPlaying}
                onTrackSelect={(track) => handleTrackSelect(track, tracks, tracks.findIndex(t => t.id === track.id))}
                onTogglePlay={togglePlay}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/80">Always Playing</div>
              </div>
              <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-white/80">Curated Tracks</div>
              </div>
              <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">∞</div>
                <div className="text-white/80">Endless Vibes</div>
              </div>
            </div>
          </main>
        );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Visualizer */}
      <BackgroundVisualizer playerState={playerState} />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen pb-32">
        <Header 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          onAuthClick={() => setShowAuth(true)}
          user={user}
          isAuthenticated={isAuthenticated}
        />
        {renderPage()}
        <Footer />
      </div>

      {/* Enhanced Audio Player */}
      {playerState.currentTrack && (
        <EnhancedAudioPlayer
          playerState={playerState}
          onTogglePlay={togglePlay}
          onVolumeChange={setVolume}
          onMuteToggle={setMuted}
          onSeek={seek}
          onPrevious={playPrevious}
          onNext={playNext}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onMoodSelect={handleMoodSelect}
          onSleepTimerEnd={handleSleepTimerEnd}
        />
      )}

      {/* Modals */}
      {showAuth && (
        <AuthPage onClose={() => setShowAuth(false)} />
      )}

      <PersonalDashboard 
        isOpen={showDashboard} 
        onClose={() => setShowDashboard(false)} 
      />

      {showAdminDashboard && (
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      )}

      <AdminTestToolsDrawer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;