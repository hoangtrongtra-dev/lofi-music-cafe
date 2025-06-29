import React, { useState } from 'react';
import { Upload, Music, Image, X, CheckCircle } from 'lucide-react';
import { uploadImage, uploadAudio } from '../config/cloudinary';

interface MediaUploaderProps {
  type: 'image' | 'audio';
  onUploadSuccess: (result: any) => void;
  onUploadError: (error: string) => void;
  className?: string;
  folder?: string;
  maxSize?: number; // MB
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  type,
  onUploadSuccess,
  onUploadError,
  className = '',
  folder,
  maxSize = 10
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Kiểm tra kích thước file
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError(`File quá lớn. Kích thước tối đa: ${maxSize}MB`);
      return;
    }

    // Kiểm tra loại file
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const validAudioTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'];

    if (type === 'image' && !validImageTypes.includes(file.type)) {
      onUploadError('Chỉ chấp nhận file hình ảnh (JPEG, PNG, WebP, GIF)');
      return;
    }

    if (type === 'audio' && !validAudioTypes.includes(file.type)) {
      onUploadError('Chỉ chấp nhận file âm thanh (MP3, WAV, OGG)');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let result;
      if (type === 'image') {
        result = await uploadImage(file, folder);
      } else {
        result = await uploadAudio(file, folder);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      onUploadSuccess(result);
      setUploadProgress(100);
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : 'Upload thất bại');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={type === 'image' ? 'image/*' : 'audio/*'}
          onChange={handleFileInput}
          className="hidden"
          id={`${type}-upload`}
          disabled={isUploading}
        />
        
        <label htmlFor={`${type}-upload`} className="cursor-pointer">
          <div className="flex flex-col items-center space-y-2">
            {type === 'image' ? (
              <Image className="w-12 h-12 text-gray-400" />
            ) : (
              <Music className="w-12 h-12 text-gray-400" />
            )}
            
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click để upload
              </span>{' '}
              hoặc kéo thả file vào đây
            </div>
            
            <div className="text-xs text-gray-500">
              {type === 'image' ? 'JPEG, PNG, WebP, GIF' : 'MP3, WAV, OGG'} • Tối đa {maxSize}MB
            </div>
          </div>
        </label>
      </div>

      {/* Progress bar */}
      {isUploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Đang upload...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success indicator */}
      {uploadProgress === 100 && (
        <div className="mt-4 flex items-center justify-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span className="text-sm">Upload thành công!</span>
        </div>
      )}
    </div>
  );
};

export default MediaUploader; 