import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Settings } from 'lucide-react';
import { PlayerState } from '../types/Track';
import Visualizer from './Visualizer';
import Equalizer from './Equalizer';
import SleepTimer from './SleepTimer';
import MoodSelector from './MoodSelector';

interface EnhancedAudioPlayerProps {
  playerState: PlayerState;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: (muted: boolean) => void;
  onSeek: (time: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onMoodSelect: (mood: string) => void;
  onSleepTimerEnd: () => void;
}

const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({
  playerState,
  onTogglePlay,
  onVolumeChange,
  onMuteToggle,
  onSeek,
  onPrevious,
  onNext,
  onToggleShuffle,
  onToggleRepeat,
  onMoodSelect,
  onSleepTimerEnd
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentMood, setCurrentMood] = useState<string>('');

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

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    onMoodSelect(mood);
  };

  const handleEQChange = (frequencies: number[]) => {
    // Apply EQ settings (would integrate with audio processing)
    console.log('EQ changed:', frequencies);
  };

  if (!currentTrack) {
    return null;
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative max-w-4xl mx-auto px-2 py-2">
        {/* Visualizer particles bao quanh */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{opacity:0.7}}>
          <Visualizer playerState={playerState} type="particles" />
        </div>
        {/* Player content */}
        <div className="relative z-10 bg-gradient-to-br from-[#2d2250]/90 to-[#3b2567]/90 rounded-2xl shadow-2xl border border-indigo-900/40 backdrop-blur-md px-6 py-4">
          {/* Advanced Controls Panel */}
          {showAdvanced && (
            <div className="border-b border-gray-200 pt-2 pb-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full mb-4">
                  {/* Mood & Context */}
                  <div className="flex-1 flex flex-col items-center bg-indigo-900/70 border border-indigo-300/30 rounded-lg px-3 py-2 min-w-[160px] max-w-xs">
                    <h4 className="text-xs font-bold text-indigo-100 mb-1">Mood & Context</h4>
                    <MoodSelector onMoodSelect={handleMoodSelect} currentMood={currentMood} />
                  </div>
                  {/* Playback */}
                  <div className="flex-1 flex flex-col items-center bg-indigo-900/70 border border-indigo-300/30 rounded-lg px-3 py-2 min-w-[160px] max-w-xs">
                    <h4 className="text-xs font-bold text-indigo-100 mb-1">Playback</h4>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-indigo-100 font-semibold">Speed:</label>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                        className="bg-indigo-800 text-indigo-100 border border-indigo-300/30 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 appearance-none"
                        style={{ minWidth: '48px' }}
                      >
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                      <input
                        id="crossfade"
                        type="checkbox"
                        checked={crossfadeEnabled}
                        onChange={(e) => setCrossfadeEnabled(e.target.checked)}
                        className="accent-indigo-500 w-4 h-4 rounded border border-indigo-300/30 focus:ring-1 focus:ring-indigo-400"
                      />
                      <label htmlFor="crossfade" className="text-xs text-indigo-100 font-semibold">Crossfade</label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <SleepTimer onTimerEnd={onSleepTimerEnd} />
                  <Equalizer onEQChange={handleEQChange} />
                </div>
              </div>
            </div>
          )}

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
                  <h4 className="font-semibold text-white truncate text-xs md:text-sm">
                    {currentTrack.title}
                  </h4>
                  <p className="text-[11px] md:text-xs text-gray-300 truncate">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 md:gap-2 flex-1 justify-center">
                <button
                  onClick={onToggleShuffle}
                  className={`p-1.5 md:p-2 rounded-full hover:bg-indigo-900/20 transition-colors ${
                    isShuffled ? 'text-indigo-400 font-bold' : 'text-gray-200'
                  }`}
                  aria-label="Shuffle"
                >
                  <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                <button
                  onClick={onPrevious}
                  className="p-1.5 md:p-2 rounded-full hover:bg-indigo-900/20 transition-colors"
                  aria-label="Previous"
                >
                  <SkipBack className="w-5 h-5 text-gray-200" />
                </button>

                <button
                  onClick={onTogglePlay}
                  className="p-3 md:p-4 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 transform hover:scale-110 shadow-lg border-4 border-white"
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
                  className="p-1.5 md:p-2 rounded-full hover:bg-indigo-900/20 transition-colors"
                  aria-label="Next"
                >
                  <SkipForward className="w-5 h-5 text-gray-200" />
                </button>

                <button
                  onClick={onToggleRepeat}
                  className={`p-1.5 md:p-2 rounded-full hover:bg-indigo-900/20 transition-colors ${
                    repeatMode !== 'none' ? 'text-indigo-400 font-bold' : 'text-gray-200'
                  }`}
                  aria-label="Repeat"
                >
                  <RepeatIcon className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              {/* Volume & Settings */}
              <div className="flex items-center gap-2 ml-auto pr-4">
                <Volume2 className="w-5 h-5 text-indigo-100" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="slider-volume w-28 h-2 accent-indigo-500"
                />
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="ml-2 p-2 rounded-full bg-indigo-800 hover:bg-indigo-700 text-indigo-100 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 md:mt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-10 text-right text-gray-200">{formatTime(currentTime)}</span>
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
                <span className="w-10 text-gray-200">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAudioPlayer;