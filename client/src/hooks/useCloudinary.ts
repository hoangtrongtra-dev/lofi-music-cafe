import { useState, useCallback } from 'react';
import { uploadImage, uploadAudio, getImageUrl, getAudioUrl } from '../config/cloudinary';

interface CloudinaryState {
  uploadedImages: any[];
  uploadedAudios: any[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

interface UseCloudinaryReturn extends CloudinaryState {
  uploadImage: (file: File, folder?: string) => Promise<any>;
  uploadAudio: (file: File, folder?: string) => Promise<any>;
  clearError: () => void;
  clearUploads: () => void;
  getImageUrl: (publicId: string, transformation?: string) => string;
  getAudioUrl: (publicId: string, format?: string) => string;
}

export const useCloudinary = (): UseCloudinaryReturn => {
  const [state, setState] = useState<CloudinaryState>({
    uploadedImages: [],
    uploadedAudios: [],
    isUploading: false,
    uploadProgress: 0,
    error: null
  });

  const handleImageUpload = useCallback(async (file: File, folder?: string) => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      error: null
    }));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90)
        }));
      }, 200);

      const result = await uploadImage(file, folder);
      
      clearInterval(progressInterval);
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      setState(prev => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, result],
        isUploading: false,
        uploadProgress: 100
      }));

      // Reset progress after 2 seconds
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: 0
        }));
      }, 2000);

      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: error instanceof Error ? error.message : 'Upload thất bại'
      }));
      throw error;
    }
  }, []);

  const handleAudioUpload = useCallback(async (file: File, folder?: string) => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      error: null
    }));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 5, 90)
        }));
      }, 300);

      const result = await uploadAudio(file, folder);
      
      clearInterval(progressInterval);
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      setState(prev => ({
        ...prev,
        uploadedAudios: [...prev.uploadedAudios, result],
        isUploading: false,
        uploadProgress: 100
      }));

      // Reset progress after 2 seconds
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: 0
        }));
      }, 2000);

      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: error instanceof Error ? error.message : 'Upload thất bại'
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  const clearUploads = useCallback(() => {
    setState(prev => ({
      ...prev,
      uploadedImages: [],
      uploadedAudios: []
    }));
  }, []);

  return {
    ...state,
    uploadImage: handleImageUpload,
    uploadAudio: handleAudioUpload,
    clearError,
    clearUploads,
    getImageUrl,
    getAudioUrl
  };
}; 