import React, { useState, useEffect } from 'react';
import { Track } from '../../../types/Track';
import { Search, Filter, Music, Play, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

interface ContentControllerProps {
  onClose: () => void;
}

const ContentController: React.FC<ContentControllerProps> = ({ onClose }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockTracks: Track[] = [
      {
        id: '1',
        title: 'Chill Vibes',
        artist: 'LoFi Artist',
        album: 'Chill Collection',
        duration: 180,
        src: '/audio/track1.mp3',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        color: '#8B5CF6',
        genre: 'Lo-Fi Hip Hop',
        releaseDate: '2024-01-15',
        isFavorite: false,
        isActive: true
      },
      {
        id: '2',
        title: 'Study Session',
        artist: 'Study Beats',
        album: 'Focus Music',
        duration: 240,
        src: '/audio/track2.mp3',
        cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        color: '#10B981',
        genre: 'Ambient',
        releaseDate: '2024-01-20',
        isFavorite: false,
        isActive: true
      },
      {
        id: '3',
        title: 'Night Drive',
        artist: 'Synthwave Master',
        album: 'Retro Vibes',
        duration: 200,
        src: '/audio/track3.mp3',
        cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
        color: '#F59E0B',
        genre: 'Synthwave',
        releaseDate: '2024-02-01',
        isFavorite: false,
        isActive: false
      }
    ];

    setTracks(mockTracks);
    setFilteredTracks(mockTracks);
    setIsLoading(false);
  }, []);

  // Filter tracks
  useEffect(() => {
    let filtered = tracks;

    if (searchTerm) {
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.album.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genreFilter !== 'all') {
      filtered = filtered.filter(track => track.genre === genreFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(track => {
        const isActive = track.isActive ?? true;
        return statusFilter === 'active' ? isActive : !isActive;
      });
    }

    setFilteredTracks(filtered);
  }, [tracks, searchTerm, genreFilter, statusFilter]);

  const handleDeleteTrack = async (trackId: string) => {
    if (!confirm('Are you sure you want to delete this track? This action cannot be undone.')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTracks(prev => prev.filter(track => track.id !== trackId));
    } catch (error) {
      console.error('Error deleting track:', error);
    }
  };

  const handleToggleStatus = async (trackId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTracks(prev => prev.map(track =>
        track.id === trackId ? { ...track, isActive: !(track.isActive ?? true) } : track
      ));
    } catch (error) {
      console.error('Error updating track status:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const genres = Array.from(new Set(tracks.map(track => track.genre)));

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
              <p className="text-sm text-gray-600">Manage music tracks and content</p>
            </div>
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

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tracks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredTracks.map((track) => (
              <div key={track.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleToggleStatus(track.id)}
                      className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      {(track.isActive ?? true) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{track.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                  <p className="text-xs text-gray-500 truncate">{track.album}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {track.genre}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedTrack(track)}
                        className="p-1 text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrack(track.id)}
                        className="p-1 text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    Released: {track.releaseDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredTracks.length} of {tracks.length} tracks
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Track</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Bulk Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentController; 