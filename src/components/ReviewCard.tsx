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
    <div className="card p-8 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="flex space-x-1 space-x-reverse">
          {renderStars(review.rating)}
        </div>
        <span className="mr-4 text-sm text-gray-500 font-medium">
          {new Date(review.date).toLocaleDateString('he-IL')}
        </span>
      </div>
      <p className="text-gray-700 mb-6 leading-relaxed text-base">{review.comment}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm ml-3">
          {review.name.charAt(0)}
        </div>
        <p className="font-semibold text-gray-900">{review.name}</p>
      </div>
    </div>
  );
};

export default ReviewCard;