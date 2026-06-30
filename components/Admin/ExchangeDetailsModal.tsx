"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ArrowRightLeft,
  Clock,
  Mail,
  Phone,
  FileText,
  Wallet,
  Banknote,
  QrCode,
  ExternalLink,
  StickyNote,
} from "lucide-react";

type ExchangeTransaction = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  sendAmount: number;
  receiveAmount: number;
  receiptUrl: string;
  userQrUrl: string | null;
  userBankName: string | null;
  userAccountName: string | null;
  userAccountNumber: string | null;
  userWalletAddress: string | null;
  narration: string | null;
  whatsapp: string;
  email: string;
  status: "pending" | "confirmed" | "rejected" | "completed";
  adminNote: string | null;
  confirmedAt: string | null;
  confirmedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

type ExchangeDetailsModalProps = {
  transaction: ExchangeTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string, adminNote?: string) => void;
  isUpdating: boolean;
};

export default function ExchangeDetailsModal({
  transaction,
  isOpen,
  onClose,
  onStatusChange,
  isUpdating,
}: ExchangeDetailsModalProps) {
  const [adminNote, setAdminNote] = useState("");

  if (!transaction) return null;

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "rejected",
      label: "Rejected",
      color: "bg-red-100 text-red-700",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-green-100 text-green-700",
    },
  ];

  const handleStatusChange = (val: string) => {
    onStatusChange(transaction.id, val, adminNote || undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            Exchange Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Customer Information */}
          <div className="bg-linear-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <p className="text-sm text-gray-600">{transaction.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">WhatsApp</p>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {transaction.whatsapp}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Request ID</p>
                <p className="font-mono text-sm text-gray-600">
                  #{transaction.id.slice(0, 8)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Submitted Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(transaction.createdAt).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Exchange Details */}
          <div className="bg-linear-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-600" />
              Exchange Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Currency Pair</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mt-1">
                  {transaction.fromCurrency} → {transaction.toCurrency}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Amount Sent</p>
                  <p className="text-sm text-gray-700 font-medium">
                    {transaction.sendAmount.toLocaleString()}{" "}
                    {transaction.fromCurrency}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Amount Received</p>
                  <p className="text-sm text-gray-700 font-medium">
                    {transaction.receiveAmount.toLocaleString()}{" "}
                    {transaction.toCurrency}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Rate Applied</p>
                <p className="text-sm text-gray-600">
                  1 {transaction.fromCurrency} = {transaction.rate.toFixed(4)}{" "}
                  {transaction.toCurrency}
                </p>
              </div>
            </div>
          </div>

          {/* Proof of Payment */}
          <div className="bg-linear-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Proof of Payment
            </h3>
            <a
              href={transaction.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200 hover:border-blue-300 transition-colors text-sm text-blue-600"
            >
              View payment receipt
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Payout Details — what the customer needs to receive their funds */}
          {(transaction.userQrUrl ||
            transaction.userBankName ||
            transaction.userWalletAddress) && (
            <div className="bg-linear-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                Payout Details
              </h3>

              {transaction.userQrUrl && (
                <a
                  href={transaction.userQrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200 hover:border-blue-300 transition-colors text-sm text-blue-600"
                >
                  <span className="flex items-center gap-1">
                    <QrCode className="w-4 h-4" />
                    View customer&apos;s QR code
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {transaction.userBankName && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Banknote className="w-3 h-3 text-gray-400" />
                    <p className="text-gray-700 font-medium">
                      {transaction.userBankName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Account Name</p>
                      <p className="text-sm text-gray-600">
                        {transaction.userAccountName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Account Number</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {transaction.userAccountNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {transaction.userWalletAddress && (
                <div>
                  <p className="text-xs text-gray-400">USDT Wallet Address</p>
                  <p className="text-sm text-gray-600 font-mono break-all">
                    {transaction.userWalletAddress}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Narration */}
          {transaction.narration && (
            <div className="bg-linear-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-blue-600" />
                Customer Narration
              </h3>
              <p className="text-sm text-gray-600">{transaction.narration}</p>
            </div>
          )}

          {/* Admin Note */}
          <div className="bg-linear-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-blue-600" />
              Admin Note
            </h3>
            <Textarea
              placeholder="Add an internal note (e.g. reason for rejection, payout reference)…"
              value={adminNote || transaction.adminNote || ""}
              onChange={(e) => setAdminNote(e.target.value)}
              className="resize-none min-h-16 text-sm"
              disabled={isUpdating}
            />
          </div>

          {/* Status Update */}
          <div className="bg-linear-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Update Status
            </h3>
            <Select
              value={transaction.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${option.color}`}
                    >
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Confirm only after verifying the receipt above
            </p>
          </div>

          {/* Current Status Badge */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">Current Status</p>
            {transaction.status === "pending" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                <Clock className="w-3 h-3" />
                Pending
              </span>
            )}
            {transaction.status === "confirmed" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                ✓ Confirmed
              </span>
            )}
            {transaction.status === "rejected" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                ✗ Rejected
              </span>
            )}
            {transaction.status === "completed" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                ✓ Completed
              </span>
            )}
          </div>

          {transaction.confirmedAt && (
            <p className="text-xs text-gray-400 text-center">
              Last updated by {transaction.confirmedBy ?? "admin"} on{" "}
              {new Date(transaction.confirmedAt).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
