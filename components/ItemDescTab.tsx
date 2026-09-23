"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, RotateCcw, Star } from "lucide-react";
import { toast } from "react-toastify";

type Review = {
  id: number;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  created_at: string;
};

type ItemDescTabProps = {
  productId: number;
};

export default function ItemDescTab({ productId }: ItemDescTabProps) {
  const searchParams = useSearchParams();

  const initialTab =
    searchParams.get("tab") === "reviews" ? "reviews" : "shipping";

  const [activeTab, setActiveTab] = useState(initialTab);

  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);

      const response = await fetch(
        `/api/product-reviews?productId=${productId}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to fetch reviews",
        );
      }

      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching product reviews:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to fetch reviews",
      );
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (!productId) return;

    fetchReviews();
  }, [productId]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab !== "reviews") return;

    requestAnimationFrame(() => {
      reviewsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    const url = new URL(window.location.href);

    if (value === "reviews") {
      url.searchParams.set("tab", "reviews");
    } else {
      url.searchParams.delete("tab");
    }

    window.history.replaceState(null, "", url.toString());
  };

  const handleSubmitReview = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating.");
      return;
    }

    if (comment.trim().length > 1000) {
      toast.error("Your review must be 1000 characters or less.");
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await fetch("/api/product-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to submit review",
        );
      }

      if (data.review) {
        setReviews((currentReviews) => [data.review, ...currentReviews]);
      }

      setRating(0);
      setHoverRating(0);
      setComment("");

      toast.success("Your review has been submitted.");
    } catch (error) {
      console.error("Error submitting product review:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to submit review",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviews.length
      : 0;

  return (
    <div className="flex w-full flex-col gap-6 px-2">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start gap-1 rounded-lg bg-slate-100 p-1">
          <TabsTrigger
            value="shipping"
            className="flex cursor-pointer flex-row items-center gap-1.5 rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Package className="h-4 w-4" />
            Shipping
          </TabsTrigger>

          <TabsTrigger
            value="return"
            className="flex cursor-pointer flex-row items-center gap-1.5 rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Return Policy
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="flex cursor-pointer flex-row items-center gap-1.5 rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Star className="h-4 w-4" />
            Reviews
          </TabsTrigger>
        </TabsList>

        {/* Shipping */}
        <TabsContent value="shipping">
          <Card className="mt-2 rounded-xl border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
                <Package className="h-4 w-4 text-blue-950" />
                Shipping Information
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 text-sm leading-7 text-slate-600">
              <p>
                General shipping at Fourth View is carried out{" "}
                <span className="font-medium text-slate-800">
                  twice a month
                </span>{" "}
                — on the{" "}
                <span className="font-medium text-slate-800">15th</span> and{" "}
                <span className="font-medium text-slate-800">30th/31st</span>.
              </p>

              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Orders placed before the 14th will be processed and sent out
                  by the 15th.
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  Orders placed after the 15th will be processed and sent out by
                  the 30th or 31st.
                </li>
              </ul>

              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                For special orders, a special shipping fee will apply to ensure
                expedited processing and delivery.
              </div>

              <p className="text-xs text-slate-500">
                For questions or assistance, contact our customer support team.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Return Policy */}
        <TabsContent value="return">
          <Card className="mt-2 rounded-xl border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
                <RotateCcw className="h-4 w-4 text-blue-950" />
                Return Policy
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 text-sm leading-7 text-slate-600">
              <p>
                We accept returns within{" "}
                <span className="font-medium text-slate-800">7 days</span> of
                delivery for items in their original condition and packaging.
              </p>

              <ul className="flex flex-col gap-2">
                {[
                  "Item must be unused and in original packaging.",
                  "Returns are not accepted for special or custom orders.",
                  "Shipping costs for returns are the responsibility of the customer.",
                  "Refunds are processed within 5–7 business days after inspection.",
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="rounded-lg border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                To initiate a return, please contact our support team with your
                order reference.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews */}
        <TabsContent
          value="reviews"
          ref={reviewsSectionRef}
          className="scroll-mt-6"
        >
          <Card className="mt-2 rounded-xl border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
                <Star className="h-4 w-4 text-blue-950" />
                Customer Reviews
              </CardTitle>
            </CardHeader>

            <CardContent>
              {loadingReviews ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  Loading reviews...
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {/* Rating Summary */}
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-4 border-b pb-6">
                      <div className="text-4xl font-bold text-slate-800">
                        {averageRating.toFixed(1)}
                      </div>

                      <div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(averageRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {reviews.length}{" "}
                          {reviews.length === 1 ? "review" : "reviews"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Review Form */}
                  <div className="rounded-xl border bg-slate-50 p-5">
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-800">
                        Write a Review
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Only customers who have purchased this product can
                        submit a review.
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-medium text-slate-700">
                        Your rating
                      </p>

                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            disabled={submittingReview}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="rounded-sm p-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`${star} star${star === 1 ? "" : "s"}`}
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= (hoverRating || rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-4">
                      <label
                        htmlFor="product-review-comment"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Your review
                      </label>

                      <textarea
                        id="product-review-comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        maxLength={1000}
                        rows={4}
                        disabled={submittingReview}
                        placeholder="Share your experience with this product..."
                        className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />

                      <div className="mt-1 text-right text-xs text-slate-400">
                        {comment.length}/1000
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={submittingReview || rating === 0}
                      onClick={handleSubmitReview}
                      className="rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>

                  {/* Existing Reviews */}
                  {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
                      <Star className="h-10 w-10 stroke-1" />

                      <p className="text-sm">No reviews yet.</p>

                      <p className="text-xs">
                        Be the first customer to review this product.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <h3 className="mb-2 font-semibold text-slate-800">
                        Customer Reviews
                      </h3>

                      <div className="flex flex-col divide-y">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="flex flex-col gap-2 py-5 first:pt-2 last:pb-0"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-medium text-slate-800">
                                {review.userName}
                              </p>

                              <div className="flex shrink-0">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-slate-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {review.comment && (
                              <p className="text-sm leading-6 text-slate-600">
                                {review.comment}
                              </p>
                            )}

                            <p className="text-xs text-slate-400">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
