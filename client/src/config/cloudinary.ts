import { Cloudinary } from '@cloudinary/url-gen';

// Khởi tạo Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'
  }
});

// Cấu hình cho hình ảnh
export const imageConfig = {
  folder: 'lofi-cafe/images',
  transformations: {
    thumbnail: 'w_300,h_300,c_fill',
    medium: 'w_600,h_600,c_fill',
    large: 'w_1200,h_1200,c_fill',
    artist: 'w_400,h_400,c_fill,g_face',
    album: 'w_500,h_500,c_fill',
    background: 'w_1920,h_1080,c_fill'
  }
};

// Cấu hình cho âm thanh
export const audioConfig = {
  folder: 'lofi-cafe/audio',
  formats: ['mp3', 'wav', 'ogg'],
  transformations: {
    low: 'q_auto:low',
    medium: 'q_auto:medium',
    high: 'q_auto:high'
  }
};

// Utility functions
export const getImageUrl = (publicId: string, transformation?: string) => {
  const url = cld.image(publicId);
  if (transformation) {
    url.addTransformation(transformation);
  }
  return url.toURL();
};

export const getAudioUrl = (publicId: string, format: string = 'mp3') => {
  return cld.video(publicId).format(format).toURL();
};

export const uploadImage = async (file: File, folder?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'lofi-cafe');
  formData.append('folder', folder || imageConfig.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return response.json();
};

export const uploadAudio = async (file: File, folder?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'lofi-cafe');
  formData.append('folder', folder || audioConfig.folder);
  formData.append('resource_type', 'video'); // Cloudinary xử lý audio như video

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return response.json();
}; 