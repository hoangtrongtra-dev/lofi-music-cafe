import React, { useState } from 'react';
import { Sun, Cloud, CloudRain, Moon, Coffee, Zap, Heart, Brain } from 'lucide-react';

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  currentMood?: string;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect, currentMood }) => {
  const [isOpen, setIsOpen] = useState(false);

  const moods = [
    { id: 'energetic', name: 'Energetic', icon: Zap, color: '#F59E0B', description: 'Upbeat and motivating' },
    { id: 'focused', name: 'Focused', icon: Brain, color: '#8B5CF6', description: 'Deep concentration' },
    { id: 'chill', name: 'Chill', icon: Coffee, color: '#06B6D4', description: 'Relaxed and calm' },
    { id: 'romantic', name: 'Romantic', icon: Heart, color: '#EC4899', description: 'Love and warmth' },
    { id: 'rainy', name: 'Rainy Day', icon: CloudRain, color: '#6B7280', description: 'Cozy and introspective' },
    { id: 'sunny', name: 'Sunny', icon: Sun, color: '#F59E0B', description: 'Bright and cheerful' },
    { id: 'cloudy', name: 'Cloudy', icon: Cloud, color: '#9CA3AF', description: 'Mellow and thoughtful' },
    { id: 'night', name: 'Night Vibes', icon: Moon, color: '#4C1D95', description: 'Late night ambience' }
  ];

  const selectedMood = moods.find(mood => mood.id === currentMood);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-900/80 border border-indigo-300/40 rounded-full transition-all duration-200 shadow hover:bg-indigo-800/90 text-indigo-100 font-bold"
      >
        {selectedMood ? (
          <>
            <selectedMood.icon className="w-4 h-4" style={{ color: selectedMood.color }} />
            <span className="text-indigo-100 text-sm font-bold">{selectedMood.name}</span>
          </>
        ) : (
          <>
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-200 text-sm font-bold">Select Mood</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 min-w-[22rem] max-w-md w-full bg-gradient-to-br from-indigo-900/90 to-indigo-700/90 border border-indigo-300/40 rounded-2xl shadow-2xl z-50">
          <div className="p-4 max-h-80 overflow-y-auto">
            <h3 className="text-indigo-100 font-bold mb-3">How are you feeling?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => {
                    onMoodSelect(mood.id);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-xl transition-all duration-200 text-left border font-bold shadow-sm ${
                    currentMood === mood.id
                      ? 'bg-indigo-700/60 border-indigo-400 text-indigo-100'
                      : 'bg-indigo-900/30 hover:bg-indigo-700/40 border-indigo-300/40 text-indigo-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <mood.icon className="w-4 h-4" style={{ color: mood.color, filter: 'brightness(0.9)' }} />
                    <span className="text-indigo-100 text-sm font-bold">{mood.name}</span>
                  </div>
                  <p className="text-indigo-200 text-xs">{mood.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;