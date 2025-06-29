import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Music, TrendingUp, Calendar, Award } from 'lucide-react';

interface ListeningStatsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Stats {
  totalListeningTime: number;
  tracksPlayed: number;
  favoriteGenre: string;
  topArtist: string;
  streakDays: number;
  weeklyMinutes: number[];
  topTracks: Array<{ title: string; artist: string; plays: number }>;
  moodDistribution: Record<string, number>;
}

const ListeningStats: React.FC<ListeningStatsProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<Stats>({
    totalListeningTime: 2847, // minutes
    tracksPlayed: 342,
    favoriteGenre: 'Lo-Fi Hip Hop',
    topArtist: 'Chillhop Collective',
    streakDays: 12,
    weeklyMinutes: [45, 67, 89, 123, 98, 156, 134],
    topTracks: [
      { title: 'Midnight Study', artist: 'Chillhop Collective', plays: 23 },
      { title: 'Coffee Shop Ambience', artist: 'Lo-Fi Dreams', plays: 19 },
      { title: 'Focus Flow', artist: 'Study Beats', plays: 17 },
      { title: 'Rainy Afternoon', artist: 'Ambient Collective', plays: 15 },
      { title: 'Morning Meditation', artist: 'Peaceful Sounds', plays: 12 }
    ],
    moodDistribution: {
      focused: 35,
      chill: 28,
      energetic: 15,
      romantic: 12,
      rainy: 10
    }
  });

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Your Music Journey</h2>
                <p className="text-white/70">Listening insights and achievements</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <Clock className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{formatTime(stats.totalListeningTime)}</div>
              <div className="text-white/70 text-sm">Total Listening</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <Music className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.tracksPlayed}</div>
              <div className="text-white/70 text-sm">Tracks Played</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.streakDays}</div>
              <div className="text-white/70 text-sm">Day Streak</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.favoriteGenre}</div>
              <div className="text-white/70 text-sm">Top Genre</div>
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              This Week's Activity
            </h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {stats.weeklyMinutes.map((minutes, index) => {
                const height = (minutes / Math.max(...stats.weeklyMinutes)) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="bg-indigo-500 rounded-t w-full transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-white/70 text-xs mt-2">{weekDays[index]}</div>
                    <div className="text-white text-xs">{minutes}m</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Tracks */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Most Played Tracks</h3>
              <div className="space-y-3">
                {stats.topTracks.map((track, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{track.title}</div>
                      <div className="text-white/70 text-sm truncate">{track.artist}</div>
                    </div>
                    <div className="text-white/80 text-sm">{track.plays} plays</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood Distribution */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Mood Distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats.moodDistribution).map(([mood, percentage]) => (
                  <div key={mood} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white capitalize">{mood}</span>
                      <span className="text-white/70">{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  🎵
                </div>
                <div>
                  <div className="text-white font-medium">Music Explorer</div>
                  <div className="text-white/70 text-sm">Listened to 50+ tracks</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  🔥
                </div>
                <div>
                  <div className="text-white font-medium">On Fire</div>
                  <div className="text-white/70 text-sm">12-day listening streak</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  ⏰
                </div>
                <div>
                  <div className="text-white font-medium">Time Master</div>
                  <div className="text-white/70 text-sm">47+ hours listened</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningStats;