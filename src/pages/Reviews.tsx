import React, { useState } from 'react';
import { Star, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ReviewCard from '../components/ReviewCard';
import { reviewsData } from '../data/reviews';

const Reviews: React.FC = () => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  const approvedReviews = reviewsData.filter(review => review.approved);
  const averageRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length;

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('New review submitted:', newReview);
    alert('תודה על הביקורת! הביקורת תפורסם לאחר אישור');
    setNewReview({ name: '', rating: 5, comment: '' });
    setShowAddReview(false);
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Helmet>
        <title>ביקורות לקוחות - Only Best | מה הלקוחות אומרים עלינו</title>
        <meta name="description" content={`ביקורות לקוחות אמיתיות על Only Best. דירוג ממוצע: ${averageRating.toFixed(1)} כוכבים. קראו מה הלקוחות שלנו אומרים על השירות והאיכות.`} />
        <meta name="keywords" content="ביקורות לקוחות, חוות דעת, Only Best, שביעות רצון, איכות שירות" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ביקורות לקוחות
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            הביקורות האמיתיות של הלקוחות שלנו מספרות הכל על השירות והאיכות שלנו
          </p>

          {/* Rating Summary */}
          <div className="bg-orange-50 rounded-xl p-8 max-w-md mx-auto">
            <div className="text-4xl font-bold text-orange-800 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-3">
              {renderStars(Math.round(averageRating), 'lg')}
            </div>
            <div className="text-gray-600">
              על סך {approvedReviews.length} ביקורות
            </div>
          </div>
        </div>

        {/* Add Review Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowAddReview(true)}
            className="bg-orange-800 hover:bg-orange-900 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 space-x-reverse mx-auto transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>הוסיפו ביקורת</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">הוספת ביקורת</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label htmlFor="reviewName" className="block text-sm font-medium text-gray-700 mb-1">
                    שם (יופיע בביקורת) *
                  </label>
                  <input
                    type="text"
                    id="reviewName"
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    דירוג *
                  </label>
                  <div className="flex space-x-1 space-x-reverse">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-1">
                    הביקורת שלכם *
                  </label>
                  <textarea
                    id="reviewComment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    required
                    rows={4}
                    placeholder="שתפו את החוויה שלכם..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-800 text-white py-2 px-4 rounded-lg hover:bg-orange-900 transition-colors duration-200"
                  >
                    שלח ביקורת
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    ביטול
                  </button>
                </div>
              </form>
              
              <p className="text-xs text-gray-500 mt-4">
                * הביקורת תפורסם לאחר בדיקה ואישור
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;