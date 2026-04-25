"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/_lib/queryKeys";

type Order = {
  id: number;
  reference: string;
  total: number;
  status: string;
  order_status: string;
  customerName: string;
  customerEmail: string;
  customerId?: number;
};

type RefundModalProps = {
  open: boolean;
  onClose: () => void;
  order: Order | null; // Accept order directly
};

export function RefundModal({ open, onClose, order }: RefundModalProps) {
  const [refundAmount, setRefundAmount] = useState<number | "">(
    order?.total || "",
  );
  const [reason, setReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("original");
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  if (!order) return null;

  const handleRefund = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the refund");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          transactionReference: order.reference,
          customerId: order.customerId,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          amount: refundAmount,
          reason: reason,
          refundMethod: refundMethod,
          originalTotal: order.total,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: ["refunds"] });

      toast.success(
        `Refund of ₦${refundAmount.toLocaleString()} processed successfully`,
      );
      onClose();
      // Reset form
      setReason("");
      setRefundAmount(order.total || "");
      setRefundMethod("original");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Process Refund
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Order Reference</p>
            <p className="font-medium">{order.reference}</p>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-xs text-gray-400">{order.customerEmail}</p>
          </div>

          {/* Refund Amount */}
          <div>
            <Label>
              Refund Amount <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₦
              </span>
              <Input
                type="number"
                value={refundAmount}
                onChange={(e) =>
                  setRefundAmount(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                max={order.total}
                min={0}
                step={100}
                className="pl-8"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Maximum: ₦{order.total?.toLocaleString()}
            </p>
          </div>

          {/* Refund Method */}
          <div>
            <Label>Refund Method</Label>
            <Select value={refundMethod} onValueChange={setRefundMethod}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">
                  Original Payment Method
                </SelectItem>
                <SelectItem value="wallet">Store Credit / Wallet</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div>
            <Label>
              Refund Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this refund being processed?"
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Summary */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-800">
              Refund Summary
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Total:</span>
                <span>₦{order.total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refund Amount:</span>
                <span className="text-red-600 font-semibold">
                  ₦{refundAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleRefund}
              disabled={
                isProcessing ||
                !refundAmount ||
                refundAmount <= 0 ||
                !reason.trim()
              }
              className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {isProcessing ? "Processing..." : "Process Refund"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
