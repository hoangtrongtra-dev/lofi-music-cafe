import React, { useState, useMemo } from 'react';
import { Search, Play, Pause, Music, User, Disc } from 'lucide-react';
import { tracks } from '../data/tracks';
import { artists } from '../data/artists';
import { playlists } from '../data/playlists';
import { Track } from '../types/Track';

interface SearchPageProps {
  onPlayTrack: (track: Track, playlist: Track[], index: number) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ 
  onPlayTrack, 
  currentTrack, 
  isPlaying, 
  onTogglePlay 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tracks' | 'artists' | 'playlists'>('all');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        tracks: [],
        artists: [],
        playlists: []
      };
    }

    const query = searchQuery.toLowerCase();

    const filteredTracks = tracks.filter(track =>
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      track.album.toLowerCase().includes(query) ||
      track.genre?.toLowerCase().includes(query)
    );

    const filteredArtists = artists.filter(artist =>
      artist.name.toLowerCase().includes(query) ||
      artist.bio.toLowerCase().includes(query)
    );

    const filteredPlaylists = playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(query) ||
      playlist.description.toLowerCase().includes(query)
    );

    return {
      tracks: filteredTracks,
      artists: filteredArtists,
      playlists: filteredPlaylists
    };
  }, [searchQuery]);

  const hasResults = searchResults.tracks.length > 0 || 
                   searchResults.artists.length > 0 || 
                   searchResults.playlists.length > 0;

  const recentSearches = ['lo-fi hip hop', 'study beats', 'chillhop', 'ambient', 'jazz'];
  const trendingGenres = ['Lo-Fi Hip Hop', 'Chillhop', 'Ambient', 'Study Beats', 'Jazz Hip Hop', 'Downtempo'];

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
            Search
          </h1>
          
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search for tracks, artists, or playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {!searchQuery.trim() ? (
          /* Default State */
          <div className="space-y-12">
            {/* Recent Searches */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Recent Searches</h2>
              <div className="flex flex-wrap gap-3">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(search)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors backdrop-blur-md border border-white/20"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by Genre */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Browse by Genre</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingGenres.map((genre, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(genre)}
                    className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300 transform hover:scale-105"
                  >
                    <Music className="w-8 h-8 text-white mb-3 mx-auto" />
                    <p className="text-white font-medium text-sm">{genre}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular This Week */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Popular This Week</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tracks.slice(0, 6).map((track, index) => (
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
                      <div className="text-white/60 text-xs">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !hasResults ? (
          /* No Results */
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-white/50 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No results found</h2>
            <p className="text-white/80 mb-6">
              Try searching for something else or check your spelling.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* Search Results */
          <div>
            {/* Tabs */}
            <div className="flex gap-4 mb-8 overflow-x-auto">
              {[
                { key: 'all', label: 'All', count: searchResults.tracks.length + searchResults.artists.length + searchResults.playlists.length },
                { key: 'tracks', label: 'Tracks', count: searchResults.tracks.length },
                { key: 'artists', label: 'Artists', count: searchResults.artists.length },
                { key: 'playlists', label: 'Playlists', count: searchResults.playlists.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-3 rounded-full font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="space-y-8">
              {/* Tracks */}
              {(activeTab === 'all' || activeTab === 'tracks') && searchResults.tracks.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Tracks</h2>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                    <div className="space-y-2">
                      {searchResults.tracks.slice(0, activeTab === 'tracks' ? undefined : 5).map((track, index) => {
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
                                onPlayTrack(track, searchResults.tracks, index);
                              }
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 flex items-center justify-center relative">
                                {isCurrentlyPlaying ? (
                                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <Pause className="w-4 h-4 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-indigo-600/80 group-hover:bg-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <Play className="w-4 h-4 text-white ml-0.5" />
                                  </div>
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
              )}

              {/* Artists */}
              {(activeTab === 'all' || activeTab === 'artists') && searchResults.artists.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Artists</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.artists.slice(0, activeTab === 'artists' ? undefined : 6).map((artist) => (
                      <div
                        key={artist.id}
                        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                      >
                        <div className="text-center">
                          <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-lg"
                          />
                          <h3 className="text-xl font-bold text-white mb-2">{artist.name}</h3>
                          <p className="text-white/80 text-sm mb-4 line-clamp-2">{artist.bio}</p>
                          <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
                            <User className="w-3 h-3" />
                            <span>{artist.followers.toLocaleString()} followers</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists */}
              {(activeTab === 'all' || activeTab === 'playlists') && searchResults.playlists.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Playlists</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.playlists.slice(0, activeTab === 'playlists' ? undefined : 6).map((playlist) => (
                      <div
                        key={playlist.id}
                        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                      >
                        <img
                          src={playlist.cover}
                          alt={playlist.name}
                          className="w-full aspect-square rounded-xl object-cover mb-4 shadow-lg"
                        />
                        <h3 className="text-xl font-bold text-white mb-2 truncate">{playlist.name}</h3>
                        <p className="text-white/80 text-sm mb-4 line-clamp-2">{playlist.description}</p>
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <Disc className="w-3 h-3" />
                          <span>{playlist.tracks.length} tracks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;