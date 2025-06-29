export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  src: string;
  cover: string;
  color?: string;
  genre?: string;
  releaseDate?: string;
  isFavorite?: boolean;
  isActive?: boolean; // For content management - whether track is available for playback
  mood?: 'energetic' | 'focused' | 'chill' | 'romantic' | 'rainy' | 'sunny' | 'cloudy' | 'night';
  energy?: number; // 0-1
  danceability?: number; // 0-1
  valence?: number; // 0-1 (musical positivity)
  playCount?: number;
  likeCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: string[];
  cover: string;
  createdAt: string;
  isPublic: boolean;
  mood?: string;
  collaborative?: boolean;
  createdBy?: string;
  followers?: number;
  totalDuration?: number;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string;
  tracks: string[];
  followers: number;
  verified: boolean;
  monthlyListeners?: number;
  genres?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    soundcloud?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  currentPlaylist: Track[];
  currentIndex: number;
  crossfadeEnabled?: boolean;
  playbackSpeed?: number;
  equalizer?: number[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  favorites: string[];
  playlists: string[];
  following: string[];
  followers: string[];
  listeningHistory: Array<{
    trackId: string;
    timestamp: Date;
    duration: number;
  }>;
  preferences: {
    audioQuality: 'low' | 'normal' | 'high';
    notifications: {
      newReleases: boolean;
      recommendations: boolean;
      social: boolean;
      achievements: boolean;
    };
    privacy: {
      showActivity: boolean;
      allowFollowing: boolean;
    };
  };
}

export interface ListeningSession {
  id: string;
  userId: string;
  trackId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  mood?: string;
  context?: 'playlist' | 'album' | 'radio' | 'search';
  device?: string;
  location?: {
    country: string;
    city: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'listening' | 'social' | 'discovery' | 'streak';
  requirement: {
    type: 'count' | 'streak' | 'time' | 'variety';
    value: number;
    metric: string;
  };
  reward?: {
    type: 'badge' | 'feature' | 'content';
    value: string;
  };
}

export interface WeatherData {
  condition: 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'windy';
  temperature: number;
  humidity: number;
  description: string;
  location: string;
}

export interface MoodAnalysis {
  primary: string;
  secondary?: string;
  confidence: number;
  factors: {
    timeOfDay: number;
    weather: number;
    recentActivity: number;
    musicHistory: number;
  };
}