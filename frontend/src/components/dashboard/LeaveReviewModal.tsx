import React, { useState, useEffect } from 'react';
import { useSubmitReviewMutation } from '@/hooks/api/useReviewApi';
import { Button } from '@/components/ui/button';
import { Star, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string;
  vehicleName?: string;
}

export function LeaveReviewModal({ isOpen, onClose, appointmentId, vehicleName }: LeaveReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitMutation = useSubmitReviewMutation();

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoveredRating(0);
      setComment('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    submitMutation.mutate(
      { rating, comment, appointmentId },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 pt-8 pb-6 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Leave a Review</h2>
            {vehicleName && (
              <p className="text-sm font-medium text-zinc-500 mt-1">How was your service for your {vehicleName}?</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 rounded-xl transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-sm font-black uppercase tracking-widest text-zinc-400">Rate your experience</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star 
                    className={cn(
                      "h-10 w-10 transition-colors",
                      (hoveredRating || rating) >= star 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-zinc-200"
                    )} 
                  />
                </button>
              ))}
            </div>
            {rating === 0 && (
              <p className="text-xs text-red-500 font-bold">Please select a rating.</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
              Any feedback? (Optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked or what we can improve..."
              className="min-h-[120px] resize-none bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-2xl p-4 transition-all text-sm font-medium"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 h-14 rounded-2xl border-zinc-200 font-bold hover:bg-zinc-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={rating === 0 || submitMutation.isPending}
              className="flex-1 h-14 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-bold shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
