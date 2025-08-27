import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  images: Array<{
    url: string;
    alt: string;
  }>;
  currentIndex: number;
  onClose: () => void;
  title?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  onClose,
  title
}) => {
  const [activeIndex, setActiveIndex] = React.useState(currentIndex);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!images || images.length === 0) return null;

  const currentImage = images[activeIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 transition-all duration-200 hover:bg-opacity-70"
        aria-label="סגור"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-3 transition-all duration-200 hover:bg-opacity-70"
            aria-label="תמונה קודמת"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-3 transition-all duration-200 hover:bg-opacity-70"
            aria-label="תמונה הבאה"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div className="max-w-7xl max-h-full flex flex-col items-center">
        {title && (
          <h3 className="text-white text-xl font-semibold mb-4 text-center">
            {title}
          </h3>
        )}
        
        <div className="relative max-w-full max-h-full">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="mt-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && images.length <= 10 && (
          <div className="flex gap-2 mt-4 max-w-full overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === activeIndex
                    ? 'border-white shadow-lg'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="סגור מודל"
      />
    </div>
  );
};

export default ImageModal;