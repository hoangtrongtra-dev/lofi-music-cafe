export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Optional for security
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
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
  createdAt: Date;
  lastLogin: Date;
  isVerified: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    newReleases: boolean;
    playlistUpdates: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showListeningHistory: boolean;
    allowMessages: boolean;
  };
}

export interface UserStats {
  totalPlayTime: number; // in seconds
  tracksPlayed: number;
  playlistsCreated: number;
  favoritesCount: number;
  followersCount: number;
  followingCount: number;
}

export interface AdminUser extends User {
  role: UserRole.ADMIN;
  adminPermissions: AdminPermissions;
  adminStats: AdminStats;
}

export interface AdminPermissions {
  canManageUsers: boolean;
  canManageContent: boolean;
  canManagePlaylists: boolean;
  canManageArtists: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canModerateComments: boolean;
  canManageReports: boolean;
}

export interface AdminStats {
  totalUsersManaged: number;
  contentModerated: number;
  reportsHandled: number;
  actionsTaken: number;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

export interface PasswordReset {
  email: string;
  token: string;
  newPassword: string;
} 