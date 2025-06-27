import React, { useState } from 'react';
import { Users, MessageCircle, Share2, Heart, Play, User } from 'lucide-react';

interface SocialFeaturesProps {
  currentTrack: any;
}

const SocialFeatures: React.FC<SocialFeaturesProps> = ({ currentTrack }) => {
  const [showListeningRoom, setShowListeningRoom] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  const friends = [
    { id: 1, name: 'Alex', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', listening: 'Coffee Shop Ambience', isOnline: true },
    { id: 2, name: 'Sarah', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100', listening: 'Midnight Study', isOnline: true },
    { id: 3, name: 'Mike', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', listening: 'Focus Flow', isOnline: false }
  ];

  const activities = [
    { user: 'Alex', action: 'liked', track: 'Rainy Afternoon', time: '2m ago' },
    { user: 'Sarah', action: 'added to playlist', track: 'Morning Meditation', time: '5m ago' },
    { user: 'Mike', action: 'shared', track: 'Tokyo Nights', time: '12m ago' },
    { user: 'Emma', action: 'started following', track: 'Chillhop Collective', time: '1h ago' }
  ];

  const shareTrack = () => {
    if (currentTrack && navigator.share) {
      navigator.share({
        title: currentTrack.title,
        text: `Check out "${currentTrack.title}" by ${currentTrack.artist} on LoFi Café`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`Check out "${currentTrack?.title}" by ${currentTrack?.artist} on LoFi Café`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Social Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowListeningRoom(!showListeningRoom)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-200"
        >
          <Users className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm">Listen Together</span>
        </button>

        <button
          onClick={shareTrack}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-200"
        >
          <Share2 className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm">Share</span>
        </button>

        <button
          onClick={() => setShowActivity(!showActivity)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm">Activity</span>
        </button>
      </div>

      {/* Listening Room */}
      {showListeningRoom && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Friends Listening Now
          </h3>
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {friend.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium">{friend.name}</div>
                  <div className="text-white/70 text-sm truncate">
                    {friend.isOnline ? `Listening to ${friend.listening}` : 'Offline'}
                  </div>
                </div>
                {friend.isOnline && (
                  <button className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    <Play className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Create Listening Room
          </button>
        </div>
      )}

      {/* Activity Feed */}
      {showActivity && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-white/70"> {activity.action} </span>
                    <span className="font-medium">{activity.track}</span>
                  </div>
                  <div className="text-white/50 text-xs">{activity.time}</div>
                </div>
                <button className="p-1 rounded-full hover:bg-white/20 transition-colors">
                  <Heart className="w-4 h-4 text-white/70" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeatures;