"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Send, Loader2, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

type Review = {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  created_at: string;
};

function Stars({
  value,
  onRate,
  size = "w-5 h-5",
}: {
  value: number;
  onRate?: (n: number) => void;
  size?: string;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={onRate ? "button" : undefined}
          onClick={onRate ? () => onRate(n) : undefined}
          className={
            onRate
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          }
        >
          <Star
            className={`${size} ${
              n <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function CarReviews({ carId }: { carId: number }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/car-reviews?carId=${carId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/car-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReviews((prev) => [data.review, ...prev]);
      setRating(0);
      setComment("");
      toast.success("Review submitted. Thank you!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-14 sm:mt-20 max-w-3xl">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-100">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MessageSquare className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
          {reviews.length > 0 && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Stars value={Math.round(average)} size="w-3.5 h-3.5" />
              {average.toFixed(1)} · {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          )}
        </div>
      </div>

      {/* Review form */}
      {session ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8 space-y-4"
        >
          <div
            onMouseLeave={() => setHoverRating(0)}
            className="flex items-center gap-3"
          >
            <Stars
              value={hoverRating || rating}
              onRate={setRating}
              size="w-7 h-7"
            />
            <span className="text-sm text-gray-500">
              {rating ? `${rating}/5` : "Tap to rate"}
            </span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this car..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Review
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 mb-8 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Sign in to leave a review
          </p>
          <Link
            href="/signin"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No reviews yet. Be the first to review this car!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.3) }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {review.userName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {review.userName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Stars value={review.rating} size="w-4 h-4" />
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
