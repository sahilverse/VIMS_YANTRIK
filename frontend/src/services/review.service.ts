import api from '@/lib/api';
import { ApiResponse } from '@/types';

export interface ReviewDto {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewDto {
  rating: number;
  comment?: string;
  appointmentId?: string;
}

export const ReviewService = {
  getMyReviews: async (): Promise<ReviewDto[]> => {
    const response = await api.get<ApiResponse<ReviewDto[]>>('/reviews/my');
    return response.data.data!;
  },

  submitReview: async (request: CreateReviewDto): Promise<ReviewDto> => {
    const response = await api.post<ApiResponse<ReviewDto>>('/reviews', request);
    return response.data.data!;
  },
};
