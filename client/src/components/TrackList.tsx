import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { Track } from '../types/Track';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onTogglePlay: () => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onTogglePlay
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        const isCurrentlyPlaying = isCurrentTrack && isPlaying;

        return (
          <div
            key={track.id}
            className={`group p-4 rounded-xl transition-all duration-200 cursor-pointer border ${
              isCurrentTrack
                ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                : 'bg-white/70 border-transparent hover:bg-white/90 hover:shadow-md'
            }`}
            onClick={() => {
              if (isCurrentTrack) {
                onTogglePlay();
              } else {
                onTrackSelect(track);
              }
            }}
          >
            <div className="flex items-center gap-4">
              {/* Track Number / Play Button */}
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
                    <span className="text-sm text-gray-400 group-hover:opacity-0 transition-opacity">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-indigo-600" />
                    </div>
                  </>
                )}
              </div>

              {/* Track Cover */}
              <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                <img
                  src={track.cover}
                  alt={`${track.title} cover`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${
                  isCurrentTrack ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  {track.title}
                </h3>
                <p className={`text-sm truncate ${
                  isCurrentTrack ? 'text-indigo-600' : 'text-gray-600'
                }`}>
                  {track.artist}
                </p>
              </div>

              {/* Album */}
              <div className="hidden md:block min-w-0 flex-1">
                <p className="text-sm text-gray-600 truncate">{track.album}</p>
              </div>

              {/* Duration */}
              <div className="text-sm text-gray-500">
                {formatDuration(track.duration)}
              </div>

              {/* Playing Indicator */}
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
  );
};

export default TrackList;