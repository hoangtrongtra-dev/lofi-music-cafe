import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, SunSnow as Snow, Wind, Thermometer } from 'lucide-react';

interface WeatherPlaylistsProps {
  onPlaylistSelect: (playlist: any) => void;
}

const WeatherBasedPlaylists: React.FC<WeatherPlaylistsProps> = ({ onPlaylistSelect }) => {
  const [weather, setWeather] = useState<{
    condition: string;
    temperature: number;
    description: string;
  } | null>(null);

  const weatherPlaylists = {
    sunny: {
      name: 'Sunny Day Vibes',
      description: 'Bright and uplifting lo-fi beats for beautiful weather',
      icon: Sun,
      color: '#F59E0B',
      tracks: ['1', '6', '7']
    },
    rainy: {
      name: 'Rainy Day Comfort',
      description: 'Cozy and introspective sounds for rainy weather',
      icon: CloudRain,
      color: '#6B7280',
      tracks: ['3', '2', '8']
    },
    cloudy: {
      name: 'Cloudy Contemplation',
      description: 'Mellow and thoughtful music for overcast days',
      icon: Cloud,
      color: '#9CA3AF',
      tracks: ['4', '5', '1']
    },
    snowy: {
      name: 'Winter Warmth',
      description: 'Warm and comforting beats for cold, snowy days',
      icon: Snow,
      color: '#E5E7EB',
      tracks: ['6', '3', '4']
    },
    windy: {
      name: 'Breezy Afternoon',
      description: 'Dynamic and flowing music for windy weather',
      icon: Wind,
      color: '#10B981',
      tracks: ['7', '1', '5']
    }
  };

  useEffect(() => {
    // Simulate weather API call
    const getWeather = () => {
      const conditions = ['sunny', 'rainy', 'cloudy', 'snowy', 'windy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const temperature = Math.floor(Math.random() * 40) - 10; // -10 to 30°C
      
      setWeather({
        condition: randomCondition,
        temperature,
        description: `${randomCondition.charAt(0).toUpperCase() + randomCondition.slice(1)} weather`
      });
    };

    getWeather();
    // Update weather every 30 minutes
    const interval = setInterval(getWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!weather) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const currentPlaylist = weatherPlaylists[weather.condition as keyof typeof weatherPlaylists];
  const WeatherIcon = currentPlaylist.icon;

  return (
    <div className="space-y-6">
      {/* Current Weather Playlist */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl border border-white/20 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${currentPlaylist.color}20` }}>
            <WeatherIcon className="w-8 h-8" style={{ color: currentPlaylist.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">{weather.temperature}°C • {weather.description}</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{currentPlaylist.name}</h3>
            <p className="text-white/80">{currentPlaylist.description}</p>
          </div>
        </div>
        <button
          onClick={() => onPlaylistSelect(currentPlaylist)}
          className="w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-200 backdrop-blur-md border border-white/30"
        >
          Play Weather Playlist
        </button>
      </div>

      {/* All Weather Playlists */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">All Weather Moods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(weatherPlaylists).map(([key, playlist]) => {
            const Icon = playlist.icon;
            const isCurrentWeather = key === weather.condition;
            
            return (
              <button
                key={key}
                onClick={() => onPlaylistSelect(playlist)}
                className={`p-4 rounded-xl transition-all duration-200 text-left ${
                  isCurrentWeather
                    ? 'bg-white/20 border border-white/40 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-6 h-6" style={{ color: playlist.color }} />
                  <h4 className="font-semibold text-white">{playlist.name}</h4>
                  {isCurrentWeather && (
                    <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-white/70 text-sm">{playlist.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherBasedPlaylists;