"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  CreditCard,
  FileText,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useState } from "react";

type Refund = {
  id: number;
  order_id: number;
  transaction_reference: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  amount: number;
  reason: string;
  refund_method: string;
  status: string;
  created_at: string;
  processed_at?: string;
  evidence_urls?: string[];
  signedEvidenceUrls?: { name: string; url: string }[];
};

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
};

export default function RefundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [showConfirm, setShowConfirm] = useState<"approve" | "reject" | null>(
    null,
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["refund", id],
    queryFn: async () => {
      const res = await fetch(`/api/refunds/${id}`);
      if (!res.ok) throw new Error("Failed to fetch refund");
      return res.json();
    },
  });

  const refund: Refund = data?.refund;

  const { mutate: processRefund, isPending } = useMutation({
    mutationFn: async (action: "approve" | "reject") => {
      const res = await fetch(`/api/refunds/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process refund");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["refund", id] });
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      setShowConfirm(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setShowConfirm(null);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-3xl mx-auto animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !refund) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-gray-500">Refund not found</p>
          <Button onClick={() => router.back()} className="mt-4 cursor-pointer">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const config = statusConfig[refund.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const isPending_ = refund.status === "pending";

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Refund Details</h1>
            <p className="text-sm text-gray-500">Refund #{refund.id}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-xl p-5 ${config.bg}`}
          >
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-6 h-6 ${config.color}`} />
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <p className={`text-lg font-bold ${config.color}`}>
                  {config.label}
                </p>
              </div>
            </div>
            {refund.processed_at && (
              <p className="text-sm text-gray-500 mt-2">
                Processed on{" "}
                {new Date(refund.processed_at).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </motion.div>

          {/* Customer & Order Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
          >
            <h2 className="font-semibold text-gray-800">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {refund.customer_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-800">
                    {refund.customer_email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-medium text-gray-800">
                    #{refund.order_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Transaction Reference</p>
                  <p className="text-sm font-medium text-gray-800 font-mono">
                    {refund.transaction_reference || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Requested On</p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(refund.created_at).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Refund Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
          >
            <h2 className="font-semibold text-gray-800">Refund Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  ₦{refund.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Refund Method</p>
                <p className="text-sm font-medium text-gray-800 capitalize">
                  {refund.refund_method}
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">Reason</p>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                {refund.reason}
              </p>
            </div>
          </motion.div>

          {/* Evidence */}
          {refund.signedEvidenceUrls &&
            refund.signedEvidenceUrls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
              >
                <h2 className="font-semibold text-gray-800">Evidence</h2>
                <div className="grid grid-cols-2 gap-3">
                  {refund.signedEvidenceUrls.map((evidence, index) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                      evidence.name,
                    );
                    const isVideo = /\.(mp4|mov|avi|webm)$/i.test(
                      evidence.name,
                    );

                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        {isImage ? (
                          <a
                            href={evidence.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={evidence.url}
                              alt={evidence.name}
                              className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                            />
                          </a>
                        ) : isVideo ? (
                          <video
                            src={evidence.url}
                            controls
                            className="w-full h-40 object-cover"
                          />
                        ) : (
                          <a
                            href={evidence.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                          >
                            <FileText className="w-8 h-8 text-blue-500 shrink-0" />
                            <span className="text-sm text-gray-700 truncate">
                              {evidence.name}
                            </span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          {/* Actions */}
          {isPending_ && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="font-semibold text-gray-800 mb-4">Actions</h2>

              {showConfirm ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <p className="font-medium text-yellow-800">
                      {showConfirm === "approve"
                        ? "Approve & process this refund via Paystack?"
                        : "Reject this refund request?"}
                    </p>
                  </div>
                  <p className="text-sm text-yellow-700 mb-4">
                    {showConfirm === "approve"
                      ? `₦${refund.amount.toLocaleString()} will be refunded to the customer's original payment method. This cannot be undone.`
                      : "The customer will not receive a refund. This cannot be undone."}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirm(null)}
                      className="flex-1 cursor-pointer"
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => processRefund(showConfirm)}
                      disabled={isPending}
                      className={`flex-1 cursor-pointer ${
                        showConfirm === "approve"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : showConfirm === "approve" ? (
                        "Confirm & Process Refund"
                      ) : (
                        "Confirm Rejection"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowConfirm("approve")}
                    className="flex-1 bg-green-600 hover:bg-green-700 gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Refund via Paystack
                  </Button>
                  <Button
                    onClick={() => setShowConfirm("reject")}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 gap-2 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Refund
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
