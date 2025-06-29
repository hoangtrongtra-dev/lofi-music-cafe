import React from 'react';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import { cld } from '../config/cloudinary';
import { CloudinaryImage as CloudinaryImageType } from '@cloudinary/url-gen/assets/CloudinaryImage';

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  className?: string;
  transformation?: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
  gravity?: 'face' | 'auto' | 'center' | 'north' | 'south' | 'east' | 'west';
  quality?: 'auto' | 'low' | 'medium' | 'high';
  loading?: 'lazy' | 'eager';
}

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  alt,
  className = '',
  transformation,
  width,
  height,
  crop = 'fill',
  gravity = 'auto',
  quality = 'auto',
  loading = 'lazy'
}) => {
  const image = cld.image(publicId);

  // Áp dụng transformation nếu có
  if (transformation) {
    image.addTransformation(transformation);
  } else {
    // Áp dụng các thuộc tính cơ bản
    if (width && height) {
      image.addTransformation(`w_${width},h_${height},c_${crop}`);
    }
    if (gravity !== 'auto') {
      image.addTransformation(`w_${width || 400},h_${height || 400},c_${crop},g_${gravity}`);
    }
    if (quality !== 'auto') {
      image.quality(quality);
    }
  }

  return (
    <AdvancedImage
      cldImg={image}
      plugins={[responsive(), placeholder()]}
      alt={alt}
      className={className}
      loading={loading}
    />
  );
};

export default CloudinaryImage; 