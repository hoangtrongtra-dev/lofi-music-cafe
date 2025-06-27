import React, { useState } from 'react';
import { User, BarChart3, Heart, Clock, TrendingUp, Calendar, Settings, Award } from 'lucide-react';
import ListeningStats from './ListeningStats';

interface PersonalDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'preferences' | 'achievements'>('overview');
  const [showStats, setShowStats] = useState(false);

  const recentActivity = [
    { action: 'Played', track: 'Midnight Study', time: '2 minutes ago' },
    { action: 'Liked', track: 'Coffee Shop Ambience', time: '1 hour ago' },
    { action: 'Added to playlist', track: 'Focus Flow', time: '3 hours ago' },
    { action: 'Shared', track: 'Rainy Afternoon', time: '1 day ago' }
  ];

  const quickStats = {
    todayListening: 127, // minutes
    weekStreak: 5,
    totalTracks: 89,
    favoriteGenre: 'Lo-Fi Hip Hop'
  };

  const achievements = [
    { id: 1, name: 'Early Bird', description: 'Listened to music before 7 AM', icon: '🌅', unlocked: true },
    { id: 2, name: 'Night Owl', description: 'Listened to music after midnight', icon: '🦉', unlocked: true },
    { id: 3, name: 'Genre Explorer', description: 'Listened to 5 different genres', icon: '🎵', unlocked: false },
    { id: 4, name: 'Social Butterfly', description: 'Shared 10 tracks with friends', icon: '🦋', unlocked: false }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Personal Dashboard</h2>
                  <p className="text-white/70">Your music journey at a glance</p>
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

            {/* Tabs */}
            <div className="flex gap-2 mt-6">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'stats', label: 'Statistics', icon: TrendingUp },
                { key: 'achievements', label: 'Achievements', icon: Award },
                { key: 'preferences', label: 'Preferences', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{quickStats.todayListening}m</div>
                    <div className="text-white/70 text-sm">Today</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{quickStats.weekStreak}</div>
                    <div className="text-white/70 text-sm">Day Streak</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{quickStats.totalTracks}</div>
                    <div className="text-white/70 text-sm">Liked Tracks</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{quickStats.favoriteGenre}</div>
                    <div className="text-white/70 text-sm">Top Genre</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                        <div className="flex-1">
                          <span className="text-white">{activity.action} </span>
                          <span className="text-indigo-400 font-medium">{activity.track}</span>
                        </div>
                        <span className="text-white/60 text-sm">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowStats(true)}
                    className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-white/20 text-left hover:bg-white/20 transition-colors"
                  >
                    <BarChart3 className="w-6 h-6 text-indigo-400 mb-2" />
                    <h4 className="text-white font-medium">View Detailed Stats</h4>
                    <p className="text-white/70 text-sm">See your complete listening analytics</p>
                  </button>
                  <button className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-white/20 text-left hover:bg-white/20 transition-colors">
                    <Heart className="w-6 h-6 text-green-400 mb-2" />
                    <h4 className="text-white font-medium">Manage Favorites</h4>
                    <p className="text-white/70 text-sm">Organize your liked tracks and playlists</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Your Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl border transition-all ${
                        achievement.unlocked
                          ? 'bg-white/20 border-white/30'
                          : 'bg-white/5 border-white/10 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{achievement.name}</h4>
                          <p className="text-white/70 text-sm">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Preferences</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Audio Quality</h4>
                    <div className="space-y-2">
                      {['High (320kbps)', 'Normal (192kbps)', 'Low (128kbps)'].map((quality) => (
                        <label key={quality} className="flex items-center gap-2">
                          <input type="radio" name="quality" className="text-indigo-600" />
                          <span className="text-white/80">{quality}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Notifications</h4>
                    <div className="space-y-2">
                      {[
                        'New releases from followed artists',
                        'Weekly music recommendations',
                        'Friend activity updates',
                        'Achievement unlocks'
                      ].map((notification) => (
                        <label key={notification} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-indigo-600" />
                          <span className="text-white/80">{notification}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ListeningStats isOpen={showStats} onClose={() => setShowStats(false)} />
    </>
  );
};

export default PersonalDashboard;