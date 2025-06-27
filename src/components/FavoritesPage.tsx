import React from 'react';
import { Heart, Play, Pause, Music } from 'lucide-react';
import { tracks } from '../data/tracks';
import { Track } from '../types/Track';

interface FavoritesPageProps {
  onPlayTrack: (track: Track, playlist: Track[], index: number) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
  onPlayTrack, 
  currentTrack, 
  isPlaying, 
  onTogglePlay 
}) => {
  // Filter tracks that are marked as favorites
  const favoritesTracks = tracks.filter(track => track.isFavorite);

  const handlePlayFavorites = () => {
    if (favoritesTracks.length > 0) {
      onPlayTrack(favoritesTracks[0], favoritesTracks, 0);
    }
  };

  if (favoritesTracks.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Favorites
            </h1>
            <div className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-12">
                <Heart className="w-16 h-16 text-white/50 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">No favorites yet</h2>
                <p className="text-white/80 mb-6">
                  Start building your collection by hearting tracks you love. 
                  They'll appear here for easy access.
                </p>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Discover Music
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="w-64 h-64 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl shadow-2xl flex items-center justify-center">
            <Heart className="w-24 h-24 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-white/80 text-sm uppercase tracking-wide mb-2">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Liked Songs
            </h1>
            <p className="text-white/90 text-lg mb-6">
              Your personal collection of favorite lo-fi beats and chillhop tracks.
            </p>
            <div className="flex items-center gap-4 text-white/70 text-sm mb-6">
              <span>{favoritesTracks.length} tracks</span>
              <span>•</span>
              <span>
                {Math.floor(favoritesTracks.reduce((total, track) => total + track.duration, 0) / 60)}m total
              </span>
            </div>
            <button
              onClick={handlePlayFavorites}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Play All
            </button>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6">
          <div className="space-y-2">
            {favoritesTracks.map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const isCurrentlyPlaying = isCurrentTrack && isPlaying;

              return (
                <div
                  key={track.id}
                  className={`group p-4 rounded-xl transition-all duration-200 cursor-pointer border ${
                    isCurrentTrack
                      ? 'bg-white/20 border-white/30'
                      : 'border-transparent hover:bg-white/10'
                  }`}
                  onClick={() => {
                    if (isCurrentTrack) {
                      onTogglePlay();
                    } else {
                      onPlayTrack(track, favoritesTracks, index);
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center relative">
                      {isCurrentlyPlaying ? (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                          <Pause className="w-4 h-4 text-white" />
                        </div>
                      ) : isCurrentTrack ? (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-white/60 group-hover:opacity-0 transition-opacity">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </>
                      )}
                    </div>

                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{track.title}</h3>
                      <p className="text-white/70 text-sm truncate">{track.artist}</p>
                    </div>
                    
                    <div className="hidden md:block min-w-0 flex-1">
                      <p className="text-white/60 text-sm truncate">{track.album}</p>
                    </div>
                    
                    <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                      <Heart className="w-5 h-5 text-pink-500 fill-current" />
                    </button>
                    
                    <div className="text-white/60 text-sm">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </div>

                    {isCurrentlyPlaying && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
                        <div className="w-1 h-3 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.filter(track => !track.isFavorite).slice(0, 6).map((track) => (
              <div
                key={track.id}
                className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                onClick={() => onPlayTrack(track, [track], 0)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{track.title}</h3>
                    <p className="text-white/70 text-sm truncate">{track.artist}</p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100">
                    <Heart className="w-4 h-4 text-white/70 hover:text-pink-500 transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;