'use client';

import React, { useState, useMemo } from 'react';
import { useAllReviewsQuery, useDeleteReviewMutation } from '@/hooks/api/useReviewApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { format } from 'date-fns';
import {
  Star,
  Search,
  Loader2,
  AlertCircle,
  MoreVertical,
  Trash2,
  MessageSquare,
  Car,
  Wrench,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function StaffReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const { data: reviewsData, isLoading, isError } = useAllReviewsQuery();
  const deleteMutation = useDeleteReviewMutation();

  const reviews = reviewsData || [];

  const filteredReviews = useMemo(() => {
    return reviews.filter((review: any) => {
      const matchesSearch = 
        (review.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (review.vehicleName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (review.serviceType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (review.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesRating = ratingFilter === 'all' || review.rating === ratingFilter;

      return matchesSearch && matchesRating;
    });
  }, [reviews, searchTerm, ratingFilter]);

  const handleDeleteClick = (review: any) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReview) {
      deleteMutation.mutate(selectedReview.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedReview(null);
        }
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={cn("h-4 w-4", star <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-200")} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Customer Reviews</h1>
          <p className="text-zinc-500 font-medium mt-1">Monitor feedback and service ratings.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200/50 shadow-sm">
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 rounded-xl transition-all font-bold"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="h-4 w-4 text-zinc-400 shrink-0 ml-2 md:ml-0 mr-2" />
          <button
            onClick={() => setRatingFilter('all')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
              ratingFilter === 'all'
                ? "bg-zinc-950 text-white shadow-md shadow-black/10"
                : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            )}
          >
            All Ratings
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setRatingFilter(rating)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1",
                ratingFilter === rating
                  ? "bg-amber-100 text-amber-900 shadow-sm"
                  : "bg-zinc-50 text-zinc-500 hover:bg-amber-50 hover:text-amber-700"
              )}
            >
              {rating} <Star className="h-3 w-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 text-zinc-900 animate-spin" strokeWidth={1.5} />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Reviews...</p>
        </div>
      ) : isError ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
            <AlertCircle className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-zinc-900">Failed to load reviews</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-zinc-200/50 rounded-[2.5rem] shadow-sm">
          <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
            <MessageSquare className="h-10 w-10 text-zinc-200" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No reviews found</h3>
          <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto">There are no reviews matching your current filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredReviews.map((review: any) => (
            <div key={review.id} className="bg-white border border-zinc-200/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-black/10">
                    {review.customerName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900">{review.customerName || 'Unknown Customer'}</h4>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-zinc-100 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-zinc-100 shadow-xl shadow-black/5">
                    <DropdownMenuItem
                      className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                      onClick={() => handleDeleteClick(review)}
                    >
                      <Trash2 className="mr-3 h-4 w-4" /> Delete Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-4">
                {renderStars(review.rating)}
              </div>

              <div className="flex-1">
                {review.comment ? (
                  <p className="text-sm font-medium text-zinc-600 leading-relaxed italic">"{review.comment}"</p>
                ) : (
                  <p className="text-sm font-bold text-zinc-300 italic">No comment provided.</p>
                )}
              </div>

              {(review.vehicleName || review.serviceType) && (
                <div className="mt-6 pt-6 border-t border-zinc-100 space-y-2">
                  {review.vehicleName && (
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                      <Car className="h-3.5 w-3.5" /> {review.vehicleName}
                    </div>
                  )}
                  {review.serviceType && (
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                      <Wrench className="h-3.5 w-3.5" /> {review.serviceType}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Review"
        description="Are you sure you want to permanently delete this review? This action cannot be undone."
        confirmText="Delete Review"
        isDestructive={true}
        onConfirm={confirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
