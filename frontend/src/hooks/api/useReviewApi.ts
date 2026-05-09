import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReviewService, CreateReviewDto } from '@/services/review.service';
import { toast } from 'sonner';

export const useMyReviewsQuery = () => {
  return useQuery({
    queryKey: ['reviews', 'my'],
    queryFn: () => ReviewService.getMyReviews(),
  });
};

export const useSubmitReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateReviewDto) => ReviewService.submitReview(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my'] });
      toast.success('Review submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  });
};

export const useAllReviewsQuery = () => {
  return useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: () => ReviewService.getAllReviews(),
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ReviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'all'] });
      toast.success('Review deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  });
};
