"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Trash2,
  FileText,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { createBrowserClient } from "@/app/_lib/supabase-browser";

interface UploadedEvidence {
  file: File;
  name: string;
  publicUrl: string;
  preview?: string;
}

interface RefundRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  orderTotal: number;
  whatsappNumber?: string; // your business WhatsApp number
}

export default function RefundRequestModal({
  isOpen,
  onClose,
  orderId,
  orderTotal,
  whatsappNumber = "2348000000000", // replace with your actual number
}: RefundRequestModalProps) {
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState<UploadedEvidence[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (evidence.length + files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    setIsUploading(true);

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        continue;
      }

      try {
        const res = await fetch("/api/refund-evidence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            orderId,
          }),
        });

        const { token, filePath } = await res.json();

        const { error } = await supabase.storage
          .from("refund-evidence")
          .uploadToSignedUrl(filePath, token, file, {
            contentType: file.type,
          });

        if (error) throw error;

        const preview = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined;

        setEvidence((prev) => [
          ...prev,
          { file, name: file.name, publicUrl: filePath, preview },
        ]);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    e.target.value = "";
  };

  const removeEvidence = (index: number) => {
    setEvidence((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the refund");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/refund-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          evidenceUrls: evidence.map((e) => e.publicUrl),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(
        "Refund request submitted! We'll review it within 48 hours.",
      );
      onClose();
      setReason("");
      setEvidence([]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit refund request",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'd like to request a refund for order #${orderId} (₦${orderTotal.toLocaleString()}).`,
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Request a Refund
                </h2>
                <p className="text-sm text-gray-500">Order #{orderId}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Refund Policy
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Refunds can only be requested within 7 days of delivery.
                    Approved refunds are processed back to your original payment
                    method within 5-7 business days.
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Reason for Refund <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe why you're requesting a refund..."
                  rows={4}
                />
              </div>

              {/* Evidence Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Upload Evidence{" "}
                  <span className="text-gray-400 font-normal">
                    (photos, videos — max 5 files, 10MB each)
                  </span>
                </label>

                {evidence.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {evidence.map((file, index) => (
                      <div
                        key={index}
                        className="relative bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center gap-2"
                      >
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-10 h-10 rounded object-cover shrink-0"
                          />
                        ) : (
                          <FileText className="w-10 h-10 text-blue-500 shrink-0" />
                        )}
                        <p className="text-xs text-gray-600 truncate flex-1">
                          {file.name}
                        </p>
                        <button
                          onClick={() => removeEvidence(index)}
                          className="p-1 hover:bg-red-100 rounded transition-colors shrink-0"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {evidence.length < 5 && (
                  <label className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {isUploading
                        ? "Uploading..."
                        : "Click to upload evidence"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>

              {/* Amount */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Refund Amount</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₦{orderTotal.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Full order amount will be refunded if approved
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isUploading || !reason.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit Refund Request"}
                </Button>

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <Button
                  variant="outline"
                  onClick={handleWhatsApp}
                  className="w-full gap-2 border-green-200 text-green-700 hover:bg-green-50 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact us on WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
