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
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-200"
      >
        {selectedMood ? (
          <>
            <selectedMood.icon className="w-4 h-4" style={{ color: selectedMood.color }} />
            <span className="text-white text-sm">{selectedMood.name}</span>
          </>
        ) : (
          <>
            <Brain className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm">Select Mood</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-3">How are you feeling?</h3>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => {
                    onMoodSelect(mood.id);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-xl transition-all duration-200 text-left ${
                    currentMood === mood.id
                      ? 'bg-white/30 border border-white/40'
                      : 'bg-white/10 hover:bg-white/20 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <mood.icon className="w-4 h-4" style={{ color: mood.color }} />
                    <span className="text-white text-sm font-medium">{mood.name}</span>
                  </div>
                  <p className="text-white/70 text-xs">{mood.description}</p>
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