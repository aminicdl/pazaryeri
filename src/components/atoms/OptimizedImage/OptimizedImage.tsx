'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

export interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = '/placeholder.svg',
  placeholder = 'blur',
  blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+',
  loading = 'lazy',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  if (!alt) {
    console.warn('OptimizedImage: alt prop is required for accessibility');
  }

  return (
    <Image
      src={imgSrc}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      loading={loading}
      onError={handleError}
      {...props}
    />
  );
};

export default OptimizedImage;
