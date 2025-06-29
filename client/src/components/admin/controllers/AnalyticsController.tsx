import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Music, Play, Clock, Heart, Eye } from 'lucide-react';

interface AnalyticsControllerProps {
  onClose: () => void;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalTracks: number;
  totalPlaylists: number;
  totalPlayTime: number;
  totalPlays: number;
  totalFavorites: number;
  totalViews: number;
  userGrowth: { date: string; users: number }[];
  playTimeByDay: { date: string; hours: number }[];
  topGenres: { genre: string; plays: number }[];
  topTracks: { title: string; artist: string; plays: number }[];
  userActivity: { hour: number; users: number }[];
}

const AnalyticsController: React.FC<AnalyticsControllerProps> = ({ onClose }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock analytics data
  useEffect(() => {
    const mockData: AnalyticsData = {
      totalUsers: 12847,
      activeUsers: 8234,
      totalTracks: 2456,
      totalPlaylists: 1234,
      totalPlayTime: 4567890, // in seconds
      totalPlays: 987654,
      totalFavorites: 54321,
      totalViews: 234567,
      userGrowth: [
        { date: '2024-01-01', users: 10000 },
        { date: '2024-01-08', users: 10500 },
        { date: '2024-01-15', users: 11200 },
        { date: '2024-01-22', users: 11800 },
        { date: '2024-01-29', users: 12500 },
        { date: '2024-02-05', users: 12847 },
      ],
      playTimeByDay: [
        { date: '2024-01-29', hours: 1250 },
        { date: '2024-01-30', hours: 1320 },
        { date: '2024-01-31', hours: 1180 },
        { date: '2024-02-01', hours: 1450 },
        { date: '2024-02-02', hours: 1380 },
        { date: '2024-02-03', hours: 1520 },
        { date: '2024-02-04', hours: 1480 },
        { date: '2024-02-05', hours: 1260 },
      ],
      topGenres: [
        { genre: 'Lo-Fi Hip Hop', plays: 45678 },
        { genre: 'Ambient', plays: 34567 },
        { genre: 'Synthwave', plays: 23456 },
        { genre: 'Jazz', plays: 12345 },
        { genre: 'Chillhop', plays: 9876 },
      ],
      topTracks: [
        { title: 'Chill Vibes', artist: 'LoFi Artist', plays: 12345 },
        { title: 'Study Session', artist: 'Study Beats', plays: 9876 },
        { title: 'Night Drive', artist: 'Synthwave Master', plays: 8765 },
        { title: 'Coffee Shop', artist: 'Jazz Master', plays: 7654 },
        { title: 'Rainy Day', artist: 'Ambient Creator', plays: 6543 },
      ],
      userActivity: [
        { hour: 0, users: 120 },
        { hour: 1, users: 80 },
        { hour: 2, users: 60 },
        { hour: 3, users: 40 },
        { hour: 4, users: 30 },
        { hour: 5, users: 50 },
        { hour: 6, users: 100 },
        { hour: 7, users: 200 },
        { hour: 8, users: 350 },
        { hour: 9, users: 500 },
        { hour: 10, users: 600 },
        { hour: 11, users: 650 },
        { hour: 12, users: 700 },
        { hour: 13, users: 750 },
        { hour: 14, users: 800 },
        { hour: 15, users: 850 },
        { hour: 16, users: 900 },
        { hour: 17, users: 950 },
        { hour: 18, users: 1000 },
        { hour: 19, users: 1100 },
        { hour: 20, users: 1200 },
        { hour: 21, users: 1300 },
        { hour: 22, users: 1400 },
        { hour: 23, users: 1500 },
      ],
    };

    setAnalyticsData(mockData);
    setIsLoading(false);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h`;
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-sm text-gray-600">Track performance and user insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalUsers)}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">+12%</span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Music className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tracks</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalTracks)}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">+15%</span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Play className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Plays</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalPlays)}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">+23%</span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Play Time</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPlayTime(analyticsData.totalPlayTime)}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">+8%</span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Genres */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Genres</h3>
              <div className="space-y-3">
                {analyticsData.topGenres.map((genre, index) => (
                  <div key={genre.genre} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 w-6">{index + 1}</span>
                      <span className="text-sm text-gray-600 ml-2">{genre.genre}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatNumber(genre.plays)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Tracks */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Tracks</h3>
              <div className="space-y-3">
                {analyticsData.topTracks.map((track, index) => (
                  <div key={track.title} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 w-6">{index + 1}</span>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">{track.title}</div>
                        <div className="text-xs text-gray-500">{track.artist}</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatNumber(track.plays)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Activity by Hour */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity by Hour</h3>
              <div className="h-64 flex items-end justify-between space-x-1">
                {analyticsData.userActivity.map((activity) => (
                  <div key={activity.hour} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{
                        height: `${(activity.users / Math.max(...analyticsData.userActivity.map(a => a.users))) * 200}px`
                      }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{activity.hour}:00</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Play Time Trend */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Play Time Trend</h3>
              <div className="h-64 flex items-end justify-between space-x-1">
                {analyticsData.playTimeByDay.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{
                        height: `${(day.hours / Math.max(...analyticsData.playTimeByDay.map(d => d.hours))) * 200}px`
                      }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsController; 