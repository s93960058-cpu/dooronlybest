import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="flex space-x-1 space-x-reverse">
          {renderStars(review.rating)}
        </div>
        <span className="mr-3 text-sm text-gray-600">
          {new Date(review.date).toLocaleDateString('he-IL')}
        </span>
      </div>
      <p className="text-gray-800 mb-4 leading-relaxed">{review.comment}</p>
      <p className="font-semibold text-orange-800">{review.name}</p>
    </div>
  );
};

export default ReviewCard;