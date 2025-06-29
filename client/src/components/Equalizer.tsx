import React, { useState } from 'react';
import { Sliders, RotateCcw } from 'lucide-react';

interface EqualizerProps {
  onEQChange: (frequencies: number[]) => void;
}

const Equalizer: React.FC<EqualizerProps> = ({ onEQChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [frequencies, setFrequencies] = useState([0, 0, 0, 0, 0]); // 60Hz, 170Hz, 350Hz, 1kHz, 3.5kHz

  const frequencyLabels = ['60Hz', '170Hz', '350Hz', '1kHz', '3.5kHz'];
  
  const presets = {
    flat: [0, 0, 0, 0, 0],
    study: [-2, 1, 2, 1, -1],
    chill: [2, 1, 0, -1, 1],
    focus: [-1, 0, 3, 2, 0],
    sleep: [3, 2, -2, -3, -2]
  };

  const handleFrequencyChange = (index: number, value: number) => {
    const newFrequencies = [...frequencies];
    newFrequencies[index] = value;
    setFrequencies(newFrequencies);
    onEQChange(newFrequencies);
  };

  const applyPreset = (preset: keyof typeof presets) => {
    setFrequencies(presets[preset]);
    onEQChange(presets[preset]);
  };

  const resetEQ = () => {
    setFrequencies([0, 0, 0, 0, 0]);
    onEQChange([0, 0, 0, 0, 0]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <Sliders className="w-5 h-5 text-white/70" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 min-w-[18rem] max-w-xs md:max-w-sm bg-gradient-to-br from-indigo-900/90 to-indigo-700/90 border border-indigo-300/40 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-indigo-100 font-bold text-lg">Equalizer</h3>
              <button
                onClick={resetEQ}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* Presets */}
            <div className="mb-6">
              <p className="text-indigo-200 text-sm font-semibold mb-2">Presets</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(presets).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => applyPreset(preset as keyof typeof presets)}
                    className="px-3 py-1 bg-indigo-900/30 hover:bg-indigo-700/40 text-indigo-100 rounded-full text-sm font-semibold transition-colors capitalize"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Sliders */}
            <div className="space-y-4">
              {frequencies.map((freq, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 text-indigo-200 text-xs">
                    {frequencyLabels[index]}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={freq}
                      onChange={(e) => handleFrequencyChange(index, parseInt(e.target.value))}
                      className="w-full h-2 bg-indigo-400/40 rounded-lg appearance-none cursor-pointer slider accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-indigo-200 mt-1">
                      <span>-12</span>
                      <span>0</span>
                      <span>+12</span>
                    </div>
                  </div>
                  <div className="w-8 text-indigo-200 text-xs text-right">
                    {freq > 0 ? '+' : ''}{freq}
                  </div>
                </div>
              ))}
            </div>

            {/* Visual EQ Display */}
            <div className="mt-6 flex items-end justify-center gap-1 h-16">
              {frequencies.map((freq, index) => {
                const height = Math.max(4, (freq + 12) * 2); // Convert -12 to +12 range to 4-48px
                return (
                  <div
                    key={index}
                    className="bg-indigo-500 rounded-t transition-all duration-200"
                    style={{ 
                      width: '12px', 
                      height: `${height}px`,
                      opacity: 0.7 + (Math.abs(freq) / 12) * 0.3
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equalizer;