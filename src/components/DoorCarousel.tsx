import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DoorCard } from './DoorCard';
import { Door } from '../types';

interface DoorCarouselProps {
  doors: Door[];
}

const DoorCarousel: React.FC<DoorCarouselProps> = ({ doors }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || doors.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= doors.length - 3 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, doors.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= doors.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? Math.max(0, doors.length - 3) : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (doors.length === 0) {
    return <div className="text-center py-8">אין דלתות להצגה</div>;
  }

  // If we have 3 or fewer doors, show them all without carousel
  if (doors.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {doors.map((door) => (
          <DoorCard key={door.id} door={door} />
        ))}
      </div>
    );
  }

  return (
    <div 
      className="relative max-w-7xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${currentIndex * -33.333}%)` }}
        >
          {doors.map((door, index) => (
            <div 
              key={door.id} 
              className={`w-1/3 flex-shrink-0 px-4 transition-all duration-500 ${
                index === currentIndex + 1 
                  ? 'scale-110 z-10' 
                  : index === currentIndex || index === currentIndex + 2
                  ? 'scale-95 opacity-75'
                  : 'scale-90 opacity-50'
              }`}
            >
              <DoorCard door={door} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-20"
        aria-label="דלת קודמת"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-20"
        aria-label="דלת הבאה"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-2 space-x-reverse">
        {Array.from({ length: Math.max(0, doors.length - 2) }, (_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-orange-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`עבור לדלת ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-orange-600 h-1 rounded-full transition-all duration-100 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / Math.max(1, doors.length - 2)) * 100}%` 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DoorCarousel;