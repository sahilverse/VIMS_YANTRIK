'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitReviewMutation } from '@/hooks/api/useReviewApi';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star, 
  X,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters').max(500),
});

type FormValues = z.infer<typeof reviewSchema>;

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  appointmentId: string;
}

export default function SubmitReviewModal({ isOpen, onClose, serviceTitle, appointmentId }: SubmitReviewModalProps) {
  const submitMutation = useSubmitReviewMutation();
  const [hoverRating, setHoverRating] = React.useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    }
  });

  const rating = watch('rating');

  const onSubmit = async (data: FormValues) => {
    submitMutation.mutate({ ...data, appointmentId }, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl shadow-black/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-zinc-950 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">Rate Service</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{serviceTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-zinc-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          <div className="space-y-4 text-center">
            <Label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Your Experience</Label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue('rating', star)}
                  className="p-1 transition-transform active:scale-90 cursor-pointer"
                >
                  <Star 
                    className={cn(
                      "h-10 w-10 transition-all duration-300",
                      (hoverRating || rating) >= star 
                        ? "fill-zinc-950 text-zinc-950 scale-110" 
                        : "text-zinc-200"
                    )}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.rating.message}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Share your thoughts</Label>
              <span className="text-[10px] font-bold text-zinc-300">{watch('comment').length}/500</span>
            </div>
            <div className="relative group">
              <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <Textarea 
                {...register('comment')}
                placeholder="Tell us what you liked or what we can improve..."
                className="pl-12 min-h-[140px] bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-[1.5rem] transition-all font-medium resize-none"
              />
            </div>
            {errors.comment && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.comment.message}</p>}
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl border-zinc-200 text-xs font-black uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending || rating === 0}
              className="flex-[2] h-14 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10"
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Submit Review</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
