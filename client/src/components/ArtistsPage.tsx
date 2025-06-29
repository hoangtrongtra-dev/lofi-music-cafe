import React, { useState } from 'react';
import { Play, Users, Music, CheckCircle } from 'lucide-react';
import { artists } from '../data/artists';
import { tracks } from '../data/tracks';
import { Artist, Track } from '../types/Track';

interface ArtistsPageProps {
  onPlayTrack: (track: Track, playlist: Track[], index: number) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

const ArtistsPage: React.FC<ArtistsPageProps> = ({ onPlayTrack, currentTrack, isPlaying }) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const getArtistTracks = (trackIds: string[]): Track[] => {
    return trackIds.map(id => tracks.find(track => track.id === id)).filter(Boolean) as Track[];
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const handlePlayArtist = (artist: Artist) => {
    const artistTracks = getArtistTracks(artist.tracks);
    if (artistTracks.length > 0) {
      onPlayTrack(artistTracks[0], artistTracks, 0);
    }
  };

  if (selectedArtist) {
    const artistTracks = getArtistTracks(selectedArtist.tracks);
    
    return (
      <div className="min-h-screen pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedArtist(null)}
            className="mb-6 text-white/80 hover:text-white transition-colors"
          >
            ← Back to Artists
          </button>

          {/* Artist Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <img
              src={selectedArtist.image}
              alt={selectedArtist.name}
              className="w-64 h-64 rounded-full shadow-2xl object-cover mx-auto md:mx-0"
            />
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                {selectedArtist.verified && (
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                )}
                <p className="text-white/80 text-sm uppercase tracking-wide">
                  {selectedArtist.verified ? 'Verified Artist' : 'Artist'}
                </p>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {selectedArtist.name}
              </h1>
              <p className="text-white/90 text-lg mb-6 max-w-3xl">
                {selectedArtist.bio}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-6 text-white/70 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{formatFollowers(selectedArtist.followers)} followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  <span>{artistTracks.length} tracks</span>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button
                  onClick={() => handlePlayArtist(selectedArtist)}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Play
                </button>
                <button className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-all duration-200 backdrop-blur-md border border-white/30">
                  Follow
                </button>
              </div>
            </div>
          </div>

          {/* Popular Tracks */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Popular Tracks</h2>
            <div className="space-y-2">
              {artistTracks.map((track, index) => {
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
                    onClick={() => onPlayTrack(track, artistTracks, index)}
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
                        <p className="text-white/70 text-sm truncate">{track.album}</p>
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
            Featured Artists
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover the talented creators behind your favorite lo-fi beats and chillhop tracks.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => setSelectedArtist(artist)}
            >
              <div className="text-center">
                <div className="relative mb-6">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                  />
                  {artist.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayArtist(artist);
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {artist.name}
                </h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-3">
                  {artist.bio}
                </p>
                
                <div className="flex items-center justify-center gap-4 text-white/60 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{formatFollowers(artist.followers)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    <span>{artist.tracks.length} tracks</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">Rising Artists</h2>
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl border border-white/20 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Discover New Talent</h3>
                <p className="text-white/80 mb-6">
                  Explore emerging artists in the lo-fi and chillhop scene. Support independent creators and discover your next favorite track.
                </p>
                <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-colors">
                  Explore Rising Artists
                </button>
              </div>
              <div className="flex gap-4">
                {artists.slice(0, 3).map((artist) => (
                  <img
                    key={artist.id}
                    src={artist.image}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover shadow-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistsPage;