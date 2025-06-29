import React from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { PlayerState } from '../types/Track';

interface AudioPlayerProps {
  playerState: PlayerState;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: (muted: boolean) => void;
  onSeek: (time: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  playerState,
  onTogglePlay,
  onVolumeChange,
  onMuteToggle,
  onSeek,
  onPrevious,
  onNext,
  onToggleShuffle,
  onToggleRepeat
}) => {
  const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, isShuffled, repeatMode } = playerState;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  if (!currentTrack) {
    return null;
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-50">
      <div className="max-w-4xl mx-auto px-2 py-2">
        <div className="flex items-center gap-2 md:gap-4 justify-between flex-wrap">
          {/* Track Info */}
          <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-initial md:w-56">
            <img
              src={currentTrack.cover}
              alt={`${currentTrack.title} cover`}
              className="w-10 h-10 rounded-lg object-cover shadow-md"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-gray-900 truncate text-xs md:text-sm">
                {currentTrack.title}
              </h4>
              <p className="text-[11px] md:text-xs text-gray-600 truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 md:gap-2 flex-1 justify-center">
            <button
              onClick={onToggleShuffle}
              className={`p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isShuffled ? 'text-indigo-600 font-bold' : 'text-gray-700'
              }`}
              aria-label="Shuffle"
            >
              <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button
              onClick={onPrevious}
              className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous"
            >
              <SkipBack className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={onTogglePlay}
              className="p-3 md:p-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 transform hover:scale-110 shadow-lg border-4 border-white"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 md:w-8 md:h-8 text-white" />
              ) : (
                <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next"
            >
              <SkipForward className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={onToggleRepeat}
              className={`p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors ${
                repeatMode !== 'none' ? 'text-indigo-600 font-bold' : 'text-gray-700'
              }`}
              aria-label="Repeat"
            >
              <RepeatIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Volume Controls */}
          <div className="hidden md:flex items-center gap-2 w-24 md:w-32">
            <button
              onClick={() => onMuteToggle(!isMuted)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Mute"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-gray-700" />
              ) : (
                <Volume2 className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 md:mt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <div
              className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden mx-1"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-200 relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-indigo-600 border-2 border-white rounded-full opacity-100 shadow-md" />
              </div>
            </div>
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;