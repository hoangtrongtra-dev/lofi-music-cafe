import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface SleepTimerProps {
  onTimerEnd: () => void;
}

const SleepTimer: React.FC<SleepTimerProps> = ({ onTimerEnd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState(30); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const presets = [15, 30, 45, 60, 90, 120];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            onTimerEnd();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimerEnd]);

  const startTimer = () => {
    setTimeLeft(duration * 60);
    setIsActive(true);
    setIsOpen(false);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all duration-200 ${
          isActive
            ? 'bg-indigo-600 text-white'
            : 'bg-white/10 hover:bg-white/20 text-white/70'
        }`}
      >
        <Clock className="w-5 h-5" />
      </button>

      {isActive && timeLeft > 0 && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap">
          {formatTime(timeLeft)}
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 min-w-[18rem] max-w-xs md:max-w-sm bg-gradient-to-br from-indigo-900/90 to-indigo-700/90 border border-indigo-300/40 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-indigo-100 font-bold mb-4 text-lg">Sleep Timer</h3>
            
            {!isActive ? (
              <>
                <div className="mb-4">
                  <label className="block text-indigo-200 text-sm font-semibold mb-2">Duration (minutes)</label>
                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-3 bg-indigo-400/40 rounded-lg appearance-none cursor-pointer slider accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <div className="text-center text-indigo-100 mt-2 font-semibold">{duration} minutes</div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setDuration(preset)}
                      className={`py-2 px-3 rounded-lg text-sm transition-colors font-semibold shadow-sm border border-transparent ${
                        duration === preset
                          ? 'bg-indigo-500 text-white'
                          : 'bg-indigo-900/30 hover:bg-indigo-700/40 text-indigo-100'
                      }`}
                    >
                      {preset}m
                    </button>
                  ))}
                </div>

                <button
                  onClick={startTimer}
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Play className="w-4 h-4" />
                  Start Timer
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-white/70 text-sm mb-4">Music will stop automatically</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className="flex-1 py-2 bg-indigo-900/30 hover:bg-indigo-700/40 text-indigo-100 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow"
                  >
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isActive ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={stopTimer}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Stop
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepTimer;