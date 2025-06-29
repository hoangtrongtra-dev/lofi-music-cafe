import React, { useState } from 'react';
import { Play, Plus, Music, Clock, Users } from 'lucide-react';
import { playlists } from '../data/playlists';
import { tracks } from '../data/tracks';
import { Playlist, Track } from '../types/Track';

interface PlaylistsPageProps {
  onPlayTrack: (track: Track, playlist: Track[], index: number) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

const PlaylistsPage: React.FC<PlaylistsPageProps> = ({ onPlayTrack, currentTrack, isPlaying }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const getPlaylistTracks = (trackIds: string[]): Track[] => {
    return trackIds.map(id => tracks.find(track => track.id === id)).filter(Boolean) as Track[];
  };

  const getTotalDuration = (trackIds: string[]): number => {
    return trackIds.reduce((total, id) => {
      const track = tracks.find(t => t.id === id);
      return total + (track?.duration || 0);
    }, 0);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    const playlistTracks = getPlaylistTracks(playlist.tracks);
    if (playlistTracks.length > 0) {
      onPlayTrack(playlistTracks[0], playlistTracks, 0);
    }
  };

  if (selectedPlaylist) {
    const playlistTracks = getPlaylistTracks(selectedPlaylist.tracks);
    
    return (
      <div className="min-h-screen pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="mb-6 text-white/80 hover:text-white transition-colors"
          >
            ← Back to Playlists
          </button>

          {/* Playlist Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <img
              src={selectedPlaylist.cover}
              alt={selectedPlaylist.name}
              className="w-64 h-64 rounded-2xl shadow-2xl object-cover mx-auto md:mx-0"
            />
            <div className="flex-1 text-center md:text-left">
              <p className="text-white/80 text-sm uppercase tracking-wide mb-2">Playlist</p>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {selectedPlaylist.name}
              </h1>
              <p className="text-white/90 text-lg mb-6 max-w-2xl">
                {selectedPlaylist.description}
              </p>
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span>{playlistTracks.length} tracks</span>
                <span>•</span>
                <span>{formatDuration(getTotalDuration(selectedPlaylist.tracks))}</span>
              </div>
              <button
                onClick={() => handlePlayPlaylist(selectedPlaylist)}
                className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Play Playlist
              </button>
            </div>
          </div>

          {/* Track List */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6">
            <div className="space-y-2">
              {playlistTracks.map((track, index) => {
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
                    onClick={() => onPlayTrack(track, playlistTracks, index)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center">
                        {isCurrentlyPlaying ? (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
                            <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        ) : (
                          <span className="text-white/60 text-sm">{index + 1}</span>
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
                      
                      <div className="text-white/60 text-sm">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                );
              })}
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Curated Playlists
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover handpicked collections of lo-fi beats for every mood and moment.
          </p>
        </div>

        {/* Create Playlist Button */}
        <div className="mb-8 text-center">
          <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-all duration-200 backdrop-blur-md border border-white/30 flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Create Playlist
          </button>
        </div>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => {
            const totalDuration = getTotalDuration(playlist.tracks);
            
            return (
              <div
                key={playlist.id}
                className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <div className="relative mb-4">
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-full aspect-square rounded-xl object-cover shadow-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPlaylist(playlist);
                    }}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
                  >
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 truncate">
                  {playlist.name}
                </h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-2">
                  {playlist.description}
                </p>
                
                <div className="flex items-center gap-4 text-white/60 text-xs">
                  <div className="flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    <span>{playlist.tracks.length} tracks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">Made for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Daily Mix</h3>
              <p className="text-white/80 mb-6">
                A personalized playlist updated daily with your favorite lo-fi tracks and new discoveries.
              </p>
              <button className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-colors">
                Play Now
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Discover Weekly</h3>
              <p className="text-white/80 mb-6">
                Fresh lo-fi beats and chillhop tracks curated based on your listening habits.
              </p>
              <button className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-colors">
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistsPage;