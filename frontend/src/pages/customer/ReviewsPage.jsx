import { useState } from 'react';
import { Star, Plus, Loader, AlertCircle } from 'lucide-react';
import { useReviews, useCreateReview } from '@/hooks/useCustomerModules';
import { toast } from 'react-toastify';
import Header from '@/components/Header';

export default function ReviewsPage() {
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews();
  const createMutation = useCreateReview();

  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });
  const [errors, setErrors] = useState({});

  const reviews = reviewsData?.data || [];

  const validateForm = () => {
    const newErrors = {};
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await createMutation.mutateAsync(formData);
      setFormData({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : 'div'}
            onClick={interactive ? () => onChange(star) : undefined}
            disabled={!interactive}
            className={`transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-slate-300'
            } ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Service Reviews"
        desc="Share your experience and view feedback from other customers"
        buttonText=""
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Write Review
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  {renderStars(formData.rating, true, (value) => {
                    setFormData({ ...formData, rating: value });
                    setErrors({ ...errors, rating: '' });
                  })}
                  <p className="mt-2 text-sm text-slate-600">
                    {formData.rating === 1 && 'Poor'}
                    {formData.rating === 2 && 'Fair'}
                    {formData.rating === 3 && 'Good'}
                    {formData.rating === 4 && 'Very Good'}
                    {formData.rating === 5 && 'Excellent'}
                  </p>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.rating}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    disabled={createMutation.isPending}
                    placeholder="Share your experience with our service..."
                    maxLength={1000}
                    rows={5}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-slate-50 resize-none"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {formData.comment.length}/1000
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-slate-400 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Reviews Overview</h2>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-4xl font-bold text-yellow-500">{averageRating}</div>
                  <div className="flex gap-1 mt-1">
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>
                <div className="text-slate-600">
                  <p className="text-sm">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Customer Reviews
              </h2>

              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-yellow-500" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">{review.customerName}</h3>
                          <p className="text-xs text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      {review.comment && (
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
