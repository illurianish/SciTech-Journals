'use client'

import { useEffect } from 'react';
import { usePropertyImage } from '@/app/rest/propertyoverview';

interface Props {
  propertyId: string;
  altText?: string;
  className?: string; // Allow passing custom classes
}

export default function PropertyImageThumbnail({ propertyId, altText = "Property Image", className = "h-10 w-10 rounded-full object-cover" }: Props) {
  const { data: imageUrl, isLoading, error } = usePropertyImage(propertyId);

  // Cleanup object URL when component unmounts or imageUrl changes
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (isLoading) {
    // Simple loading placeholder matching size
    return <div className={`${className} bg-gray-200 animate-pulse rounded-full`}></div>;
  }

  if (error || !imageUrl) {
    // Default placeholder if error or no image found
    return <div className={`${className} bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs`}>?</div>;
  }

  return (
    <img 
      src={imageUrl} 
      alt={altText} 
      className={className} 
    />
  );
} 