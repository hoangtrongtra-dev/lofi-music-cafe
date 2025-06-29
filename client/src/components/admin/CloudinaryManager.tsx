import React, { useState, useEffect } from 'react';
import CloudinaryImage from '../CloudinaryImage';
import CloudinaryAudioPlayer from '../CloudinaryAudioPlayer';
import MediaUploader from '../MediaUploader';
import { Cloud, Upload, Image, Music, Settings, BarChart3, Trash2, Download } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface CloudinaryAsset {
  public_id: string;
  url: string;
  resource_type: string;
  format: string;
  bytes: number;
  created_at: string;
  folder: string;
}

const CloudinaryManager: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<CloudinaryAsset[]>([]);
  const [uploadedAudios, setUploadedAudios] = useState<CloudinaryAsset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'upload' | 'manage' | 'analytics'>('upload');
  const [analytics, setAnalytics] = useState({
    totalImages: 0,
    totalAudio: 0,
    storageUsed: '0 MB',
    recentActivity: []
  });

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/cloudinary/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUploadedImages(res.data.images || []);
      setUploadedAudios(res.data.audios || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleImageUploadSuccess = async (result: any) => {
    try {
      const token = localStorage.getItem('token');
      // Save to backend
      await axios.post(`${API_URL}/admin/cloudinary/asset`, {
        public_id: result.public_id,
        url: result.secure_url,
        resource_type: 'image',
        format: result.format,
        bytes: result.bytes,
        folder: result.folder
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUploadedImages(prev => [...prev, result]);
      setError(null);
    } catch (err: any) {
      setError('Upload successful but failed to save to database');
    }
  };

  const handleAudioUploadSuccess = async (result: any) => {
    try {
      const token = localStorage.getItem('token');
      // Save to backend
      await axios.post(`${API_URL}/admin/cloudinary/asset`, {
        public_id: result.public_id,
        url: result.secure_url,
        resource_type: 'video', // Cloudinary treats audio as video
        format: result.format,
        bytes: result.bytes,
        folder: result.folder
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUploadedAudios(prev => [...prev, result]);
      setError(null);
    } catch (err: any) {
      setError('Upload successful but failed to save to database');
    }
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleDeleteAsset = async (asset: CloudinaryAsset, type: 'image' | 'audio') => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/cloudinary/asset/${asset.public_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (type === 'image') {
        setUploadedImages(prev => prev.filter(img => img.public_id !== asset.public_id));
      } else {
        setUploadedAudios(prev => prev.filter(audio => audio.public_id !== asset.public_id));
      }
    } catch (err: any) {
      setError('Failed to delete asset');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const sections = [
    { id: 'upload', name: 'Upload Media', icon: Upload },
    { id: 'manage', name: 'Manage Content', icon: Image },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const renderUploadSection = () => (
    <div className="space-y-6">
      {loading && <div className="text-center py-4">Loading assets...</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Image className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Upload Images</h3>
          </div>
          <MediaUploader
            type="image"
            onUploadSuccess={handleImageUploadSuccess}
            onUploadError={handleUploadError}
            maxSize={5}
            folder="lofi-cafe/admin/images"
          />
          
          {/* Display Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Uploads:</h4>
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.slice(-4).map((img, index) => (
                  <div key={index} className="relative group">
                    <CloudinaryImage
                      publicId={img.public_id}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                      transformation="w_200,h_200,c_fill"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteAsset(img, 'image')}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b">
                      {img.public_id.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Audio Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Music className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Upload Audio</h3>
          </div>
          <MediaUploader
            type="audio"
            onUploadSuccess={handleAudioUploadSuccess}
            onUploadError={handleUploadError}
            maxSize={50}
            folder="lofi-cafe/admin/audio"
          />
          
          {/* Display Uploaded Audio */}
          {uploadedAudios.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Uploads:</h4>
              <div className="space-y-2">
                {uploadedAudios.slice(-3).map((audio, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded relative group">
                    <CloudinaryAudioPlayer
                      publicId={audio.public_id}
                      title={audio.public_id.split('/').pop() || 'Audio Track'}
                      className="w-full"
                    />
                    <button
                      onClick={() => handleDeleteAsset(audio, 'audio')}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600">{error}</div>
        </div>
      )}
    </div>
  );

  const renderManageSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Management */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Image Assets ({uploadedImages.length})</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploadedImages.length > 0 ? (
                uploadedImages.map((img, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <CloudinaryImage
                      publicId={img.public_id}
                      alt="Asset"
                      className="w-12 h-12 object-cover rounded"
                      transformation="w_100,h_100,c_fill"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{img.public_id.split('/').pop()}</p>
                      <p className="text-xs text-gray-500">{formatBytes(img.bytes)} • {img.format}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => window.open(img.url, '_blank')}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(img, 'image')}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No images uploaded yet</p>
              )}
            </div>
          </div>

          {/* Audio Management */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Audio Assets ({uploadedAudios.length})</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploadedAudios.length > 0 ? (
                uploadedAudios.map((audio, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium truncate">{audio.public_id.split('/').pop()}</p>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => window.open(audio.url, '_blank')}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(audio, 'audio')}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <CloudinaryAudioPlayer
                      publicId={audio.public_id}
                      title=""
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formatBytes(audio.bytes)} • {audio.format}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No audio uploaded yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsSection = () => {
    const totalImages = uploadedImages.length;
    const totalAudio = uploadedAudios.length;
    const totalStorage = uploadedImages.reduce((sum, img) => sum + img.bytes, 0) + 
                        uploadedAudios.reduce((sum, audio) => sum + audio.bytes, 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Image className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{totalImages}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Music className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Audio</p>
                <p className="text-2xl font-bold text-gray-900">{totalAudio}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">{formatBytes(totalStorage)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {uploadedImages.slice(-3).reverse().map((img, index) => (
              <div key={`img-${index}`} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New image uploaded: {img.public_id.split('/').pop()}</span>
                <span className="text-xs text-gray-400">{new Date(img.created_at).toLocaleDateString()}</span>
              </div>
            ))}
            {uploadedAudios.slice(-3).reverse().map((audio, index) => (
              <div key={`audio-${index}`} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Audio file uploaded: {audio.public_id.split('/').pop()}</span>
                <span className="text-xs text-gray-400">{new Date(audio.created_at).toLocaleDateString()}</span>
              </div>
            ))}
            {uploadedImages.length === 0 && uploadedAudios.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'upload':
        return renderUploadSection();
      case 'manage':
        return renderManageSection();
      case 'analytics':
        return renderAnalyticsSection();
      default:
        return renderUploadSection();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Cloud className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cloudinary Manager</h2>
              <p className="text-sm text-gray-600">Manage media content and transformations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Admin Only</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {section.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default CloudinaryManager; 