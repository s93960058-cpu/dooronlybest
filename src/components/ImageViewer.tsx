import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
  images: { url: string; alt: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}) => {
  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Image */}
      <div className="max-w-screen-lg max-h-screen-lg p-4">
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageViewer;