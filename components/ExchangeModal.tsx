"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dropdown } from "./Dropdown";
import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import {
  ArrowRightLeft,
  RefreshCw,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  CreditCard,
  QrCode,
  FileText,
  Phone,
  Mail,
  Copy,
  Building2,
  Wallet,
} from "lucide-react";

type ExCurr = {
  from: string;
  to: string;
  rate: number;
  available: boolean;
};

// ── Hardcoded payment details (swap these out when going live) ──
const BANK_DETAILS = {
  accountName: "PLACEHOLDER NAME",
  accountNumber: "0000000000",
  bankName: "PLACEHOLDER BANK",
};

const WALLET_DETAILS = {
  walletId: "PLACEHOLDER_WALLET_ADDRESS",
  network: "TRC20 (TRON)",
};
// ────────────────────────────────────────────────────────────────

export function ExchangeModal() {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [toValue, setToValue] = useState<number | null>(null);
  const [fromValue, setFromValue] = useState<number | null>(null);
  const [selectedCurr, setSelectedCurr] = useState<ExCurr | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Step 2: Receipt
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  // Step 3: WeChat/Alipay QR code
  const [qrFile, setQrFile] = useState<File | null>(null);
  // Step 4: Narration
  const [narration, setNarration] = useState<string>("");
  // Step 5: Contact info
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setToValue(null);
        setFromValue(null);
        setCurrency("");
        setMethod("");
        setSelectedCurr(null);
        setReceiptFile(null);
        setQrFile(null);
        setNarration("");
        setWhatsapp("");
        setEmail("");
        setCopiedField(null);
      }, 300);
    }
  };

  useEffect(() => {
    if (selectedCurr && toValue && toValue > 0) {
      setIsCalculating(true);
      const calculatedFrom = toValue * selectedCurr.rate;
      setTimeout(() => {
        setFromValue(Number(calculatedFrom.toFixed(2)));
        setIsCalculating(false);
      }, 300);
    } else if (toValue === 0) {
      setFromValue(0);
    }
  }, [toValue, selectedCurr]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setter(file);
    }
  };

  const isFormValid = () => {
    return (
      selectedCurr?.available &&
      toValue &&
      toValue > 0 &&
      method &&
      receiptFile &&
      qrFile &&
      whatsapp.trim() &&
      email.trim()
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      alert("Exchange request submitted! We'll contact you in a few minutes.");
      handleOpenChange(false);
    }
  };

  const isNairaToYuan = selectedCurr?.from === "Naira";
  const isUsdtToYuan = selectedCurr?.from === "USDT";

  const FileUploadSlot = ({
    file,
    onUpload,
    onRemove,
    accept = "image/*,.pdf",
    label,
  }: {
    file: File | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    accept?: string;
    label: string;
  }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-blue-400 transition-colors">
      {!file ? (
        <label className="cursor-pointer block">
          <input
            type="file"
            accept={accept}
            onChange={onUpload}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF · Max 5MB</p>
        </label>
      ) : (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 truncate max-w-45">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors shrink-0"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => handleCopy(text, field)}
      className="p-1.5 hover:bg-gray-200 rounded transition-colors shrink-0"
      title="Copy"
    >
      {copiedField === field ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  // Progressive disclosure flags
  const showAmounts = !!selectedCurr?.available;
  const showMethod = !!(showAmounts && toValue && toValue > 0);
  const showPaymentDetails = !!method;
  const showReceipt = showPaymentDetails;
  const showQr = !!receiptFile;
  const showNarration = !!qrFile;
  const showContact = showNarration;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-linear-to-r from-blue-600 to-blue-700 text-white flex cursor-pointer py-6 px-8 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Get Started
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-blue-950 flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-blue-600" />
            Currency Exchange
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* ── Step 1a: Currency pair ── */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Select Currency Pair
            </Label>
            <Dropdown
              type="exchange"
              currency={currency}
              setCurrency={setCurrency}
              setSelectedCurr={setSelectedCurr}
            />
            {selectedCurr && !selectedCurr.available && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>This currency pair is currently unavailable</span>
              </div>
            )}
          </div>

          {/* Exchange rate pill */}
          {showAmounts && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Exchange Rate</p>
                  <p className="text-2xl font-bold text-blue-900">
                    1 {selectedCurr!.from} = {selectedCurr!.rate.toFixed(4)}{" "}
                    {selectedCurr!.to}
                  </p>
                </div>
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          )}

          {/* ── Step 1b: Amount ── */}
          {showAmounts && (
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700">
                Amount to Exchange
              </Label>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">You send</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-md border border-gray-200 shrink-0">
                      {selectedCurr!.from}
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={toValue || ""}
                      onChange={(e) => setToValue(Number(e.target.value))}
                      className="py-6 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">You receive</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-md border border-gray-200 shrink-0">
                      {selectedCurr!.to}
                    </span>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={fromValue?.toString() || ""}
                        readOnly
                        className={`py-6 text-lg bg-gray-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isCalculating ? "opacity-50" : ""}`}
                      />
                      {isCalculating && (
                        <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1c: Payment method ── */}
          {showMethod && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Payment Method
              </Label>
              <Dropdown type="method" method={method} setMethod={setMethod} />
              {method && (
                <div className="flex items-center gap-2 text-green-600 text-sm mt-1">
                  <CreditCard className="w-4 h-4" />
                  <span>Secure payment processing</span>
                </div>
              )}
            </div>
          )}

          {/* ── Payment details card ── */}
          {showPaymentDetails && isNairaToYuan && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Send Payment To
              </Label>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                  Bank Transfer Details
                </p>
                {[
                  {
                    label: "Account Name",
                    value: BANK_DETAILS.accountName,
                    field: "accountName",
                  },
                  {
                    label: "Account Number",
                    value: BANK_DETAILS.accountNumber,
                    field: "accountNumber",
                  },
                  {
                    label: "Bank",
                    value: BANK_DETAILS.bankName,
                    field: "bankName",
                  },
                ].map(({ label, value, field }) => (
                  <div
                    key={field}
                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100"
                  >
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {value}
                      </p>
                    </div>
                    <CopyButton text={value} field={field} />
                  </div>
                ))}
                <p className="text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-2">
                  Transfer exactly{" "}
                  <span className="font-bold">
                    ₦{toValue?.toLocaleString()}
                  </span>{" "}
                  then upload your receipt below.
                </p>
              </div>
            </div>
          )}

          {showPaymentDetails && isUsdtToYuan && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                Send Payment To
              </Label>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                  USDT Wallet Details
                </p>
                {[
                  {
                    label: "Wallet Address",
                    value: WALLET_DETAILS.walletId,
                    field: "walletId",
                  },
                  {
                    label: "Network",
                    value: WALLET_DETAILS.network,
                    field: "network",
                  },
                ].map(({ label, value, field }) => (
                  <div
                    key={field}
                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100"
                  >
                    <div className="min-w-0 mr-2">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-semibold text-gray-900 break-all">
                        {value}
                      </p>
                    </div>
                    <CopyButton text={value} field={field} />
                  </div>
                ))}
                <p className="text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-2">
                  Send exactly <span className="font-bold">{toValue} USDT</span>{" "}
                  on the {WALLET_DETAILS.network} network, then upload your
                  receipt below.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2: Upload receipt ── */}
          {showReceipt && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                Upload Payment Receipt
              </Label>
              <FileUploadSlot
                file={receiptFile}
                onUpload={(e) => handleFileUpload(e, setReceiptFile)}
                onRemove={() => setReceiptFile(null)}
                label="Click to upload your payment receipt"
              />
            </div>
          )}

          {/* ── Step 3: WeChat / Alipay QR code ── */}
          {showQr && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-600" />
                Upload WeChat / Alipay QR Code
              </Label>
              <FileUploadSlot
                file={qrFile}
                onUpload={(e) => handleFileUpload(e, setQrFile)}
                onRemove={() => setQrFile(null)}
                accept="image/*"
                label="Click to upload your WeChat or Alipay QR code"
              />
            </div>
          )}

          {/* ── Step 4: Narration (optional) ── */}
          {showNarration && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Payment Narration{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="Add any notes or narration about your payment…"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                className="resize-none min-h-20"
              />
            </div>
          )}

          {/* ── Step 5: Contact info ── */}
          {showContact && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  WhatsApp Number
                </Label>
                <Input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="py-5"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-5"
                />
              </div>
            </div>
          )}

          {/* ── Step 6: Done banner ── */}
          {isFormValid() && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  All set! Ready to submit.
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  We&apos;ll review your request and contact you via WhatsApp or
                  email within a few minutes.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="px-6">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6"
          >
            Submit Exchange Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
