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
import { useState, useEffect, useMemo, useCallback } from "react";
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

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type Currency = "Naira" | "Yuan" | "USDT";

interface ExCurr {
  from: Currency;
  to: Currency;
  rate: number;
  available: boolean;
}

type AdminPaymentMethod =
  | { type: "admin-bank"; description: string } // Admin bank account (to receive Naira)
  | { type: "admin-qr"; description: string } // Admin QR code (to receive Yuan)
  | { type: "admin-wallet"; description: string }; // Admin wallet (to receive USDT)

type CustomerReceiveMethod =
  | { type: "customer-qr"; label: string } // Customer WeChat/Alipay QR (to receive Yuan)
  | { type: "customer-bank"; label: string } // Customer bank details (to receive Naira)
  | { type: "customer-wallet"; label: string }; // Customer wallet address (to receive USDT)

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION (use env vars in production)
// ═══════════════════════════════════════════════════════════════

const ADMIN_QR_DETAILS = {
  imageUrl: process.env.NEXT_PUBLIC_ADMIN_QR_IMAGE_URL || "",
  accountName:
    process.env.NEXT_PUBLIC_ADMIN_QR_ACCOUNT_NAME || "PLACEHOLDER NAME",
};

const ADMIN_BANK_DETAILS = {
  accountName:
    process.env.NEXT_PUBLIC_ADMIN_BANK_ACCOUNT_NAME || "PLACEHOLDER NAME",
  accountNumber:
    process.env.NEXT_PUBLIC_ADMIN_BANK_ACCOUNT_NUMBER || "0000000000",
  bankName: process.env.NEXT_PUBLIC_ADMIN_BANK_NAME || "PLACEHOLDER BANK",
};

const ADMIN_WALLET_DETAILS = {
  walletId:
    process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS ||
    "PLACEHOLDER_WALLET_ADDRESS",
  network: process.env.NEXT_PUBLIC_ADMIN_WALLET_NETWORK || "TRC20 (TRON)",
};

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ═══════════════════════════════════════════════════════════════
// CUSTOM HOOK: Exchange Logic
// ═══════════════════════════════════════════════════════════════

function useExchange() {
  const [selectedCurr, setSelectedCurr] = useState<ExCurr | null>(null);
  const [sendAmount, setSendAmount] = useState<number | null>(null);
  const [receiveAmount, setReceiveAmount] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!selectedCurr || !sendAmount || sendAmount <= 0) {
      setReceiveAmount(null);
      return;
    }

    setIsCalculating(true);
    const timer = setTimeout(() => {
      const calculated = sendAmount * selectedCurr.rate;
      setReceiveAmount(Number(calculated.toFixed(2)));
      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [sendAmount, selectedCurr]);

  const reset = useCallback(() => {
    setSelectedCurr(null);
    setSendAmount(null);
    setReceiveAmount(null);
    setIsCalculating(false);
  }, []);

  return {
    selectedCurr,
    setSelectedCurr,
    sendAmount,
    setSendAmount,
    receiveAmount,
    isCalculating,
    reset,
  };
}

// ═══════════════════════════════════════════════════════════════
// CUSTOM HOOK: Form State
// ═══════════════════════════════════════════════════════════════

function useExchangeForm() {
  const [method, setMethod] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [customerQrFile, setCustomerQrFile] = useState<File | null>(null);
  const [customerBankName, setCustomerBankName] = useState<string>("");
  const [customerAccountNumber, setCustomerAccountNumber] =
    useState<string>("");
  const [customerBank, setCustomerBank] = useState<string>("");
  const [customerWalletAddress, setCustomerWalletAddress] =
    useState<string>("");
  const [narration, setNarration] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const reset = useCallback(() => {
    setMethod("");
    setReceiptFile(null);
    setCustomerQrFile(null);
    setCustomerBankName("");
    setCustomerAccountNumber("");
    setCustomerBank("");
    setCustomerWalletAddress("");
    setNarration("");
    setWhatsapp("");
    setEmail("");
    setCopiedField(null);
  }, []);

  return {
    method,
    setMethod,
    receiptFile,
    setReceiptFile,
    customerQrFile,
    setCustomerQrFile,
    customerBankName,
    setCustomerBankName,
    customerAccountNumber,
    setCustomerAccountNumber,
    customerBank,
    setCustomerBank,
    customerWalletAddress,
    setCustomerWalletAddress,
    narration,
    setNarration,
    whatsapp,
    setWhatsapp,
    email,
    setEmail,
    copiedField,
    setCopiedField,
    reset,
  };
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  }
}

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return "File size must be less than 5MB";
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "Invalid file type. Use PNG, JPG, WebP, or PDF";
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function FileUploadSlot({
  file,
  onUpload,
  onRemove,
  accept = "image/*,.pdf",
  label,
  id,
}: {
  file: File | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  accept?: string;
  label: string;
  id: string;
}) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-blue-400 transition-colors">
      {!file ? (
        <label htmlFor={id} className="cursor-pointer block">
          <input
            id={id}
            type="file"
            accept={accept}
            onChange={onUpload}
            className="hidden"
            aria-label={label}
          />
          <Upload
            className="w-8 h-8 text-gray-400 mx-auto mb-2"
            aria-hidden="true"
          />
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF · Max 5MB</p>
        </label>
      ) : (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle
              className="w-5 h-5 text-green-600 shrink-0"
              aria-hidden="true"
            />
            <div className="text-left min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
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
            aria-label="Remove file"
            type="button"
          >
            <X className="w-4 h-4 text-gray-500" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function CopyButton({
  text,
  field,
  copiedField,
  onCopy,
}: {
  text: string;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}) {
  const isCopied = copiedField === field;
  return (
    <button
      onClick={() => onCopy(text, field)}
      className="p-1.5 hover:bg-gray-200 rounded transition-colors shrink-0"
      aria-label={isCopied ? "Copied!" : `Copy ${field}`}
      title={isCopied ? "Copied!" : "Copy"}
      type="button"
    >
      {isCopied ? (
        <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" aria-hidden="true" />
      )}
    </button>
  );
}

function ExchangeRatePill({
  from,
  to,
  rate,
}: {
  from: string;
  to: string;
  rate: number;
}) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Exchange Rate</p>
          <p className="text-2xl font-bold text-blue-900">
            1 {from} = {rate.toFixed(4)} {to}
          </p>
        </div>
        <RefreshCw className="w-5 h-5 text-blue-400" aria-hidden="true" />
      </div>
    </div>
  );
}

function AdminPaymentSection({
  method,
  sendAmount,
  copiedField,
  onCopy,
}: {
  method: AdminPaymentMethod;
  sendAmount: number | null;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}) {
  const amountDisplay = sendAmount?.toLocaleString() ?? "0";

  if (method.type === "admin-bank") {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" aria-hidden="true" />
          Send Your Naira To This Account
        </Label>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
            Admin Bank Account
          </p>
          {[
            {
              label: "Account Name",
              value: ADMIN_BANK_DETAILS.accountName,
              field: "adminAccountName",
            },
            {
              label: "Account Number",
              value: ADMIN_BANK_DETAILS.accountNumber,
              field: "adminAccountNumber",
            },
            {
              label: "Bank",
              value: ADMIN_BANK_DETAILS.bankName,
              field: "adminBankName",
            },
          ].map(({ label, value, field }) => (
            <div
              key={field}
              className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100"
            >
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
              </div>
              <CopyButton
                text={value}
                field={field}
                copiedField={copiedField}
                onCopy={onCopy}
              />
            </div>
          ))}
          <p className="text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-2">
            {method.description.replace("{amount}", amountDisplay)}
          </p>
        </div>
      </div>
    );
  }

  if (method.type === "admin-qr") {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <QrCode className="w-4 h-4 text-blue-600" aria-hidden="true" />
          Scan This QR Code To Pay
        </Label>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
            Admin Payment QR
          </p>
          <div className="flex justify-center">
            {ADMIN_QR_DETAILS.imageUrl ? (
              <img
                src={ADMIN_QR_DETAILS.imageUrl}
                alt="Admin Payment QR Code"
                className="w-48 h-48 rounded-lg border border-blue-100"
              />
            ) : (
              <div className="w-48 h-48 bg-white rounded-lg border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-2">
                <QrCode
                  className="w-12 h-12 text-blue-300"
                  aria-hidden="true"
                />
                <p className="text-xs text-blue-400 text-center px-2">
                  Admin QR code will appear here
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100">
            <div>
              <p className="text-xs text-gray-500">Account Name</p>
              <p className="text-sm font-semibold text-gray-900">
                {ADMIN_QR_DETAILS.accountName}
              </p>
            </div>
            <CopyButton
              text={ADMIN_QR_DETAILS.accountName}
              field="adminQrAccountName"
              copiedField={copiedField}
              onCopy={onCopy}
            />
          </div>
          <p className="text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-2">
            {method.description.replace("{amount}", amountDisplay)}
          </p>
        </div>
      </div>
    );
  }

  if (method.type === "admin-wallet") {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-blue-600" aria-hidden="true" />
          Send USDT To This Wallet
        </Label>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
            Admin USDT Wallet
          </p>
          {[
            {
              label: "Wallet Address",
              value: ADMIN_WALLET_DETAILS.walletId,
              field: "adminWalletId",
            },
            {
              label: "Network",
              value: ADMIN_WALLET_DETAILS.network,
              field: "adminNetwork",
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
              <CopyButton
                text={value}
                field={field}
                copiedField={copiedField}
                onCopy={onCopy}
              />
            </div>
          ))}
          <p className="text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-2">
            {method.description.replace("{amount}", amountDisplay)}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function ExchangeModal() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<string>("");

  const exchange = useExchange();
  const form = useExchangeForm();

  // ── Derived: How customer PAYS admin ────────────────────────

  const adminPaymentMethod = useMemo((): AdminPaymentMethod | null => {
    if (!exchange.selectedCurr?.available) return null;
    const { from, to } = exchange.selectedCurr;

    // Naira → Yuan: Customer sends Naira → admin bank account
    if (from === "Naira" && to === "Yuan") {
      return {
        type: "admin-bank",
        description:
          "Transfer exactly ₦{amount} to the admin account above, then upload your receipt below.",
      };
    }

    // Yuan → Naira: Customer sends Yuan → admin QR code
    if (from === "Yuan" && to === "Naira") {
      return {
        type: "admin-qr",
        description:
          "Transfer exactly ¥{amount} to the admin via the QR code above, then upload your receipt below.",
      };
    }

    // USDT → Yuan: Customer sends USDT → admin wallet
    if (from === "USDT" && to === "Yuan") {
      return {
        type: "admin-wallet",
        description:
          "Send exactly {amount} USDT to the admin wallet above, then upload your receipt below.",
      };
    }

    // Yuan → USDT: Customer sends Yuan → admin QR code
    if (from === "Yuan" && to === "USDT") {
      return {
        type: "admin-qr",
        description:
          "Transfer exactly ¥{amount} to the admin via the QR code above, then upload your receipt below.",
      };
    }

    return null;
  }, [exchange.selectedCurr]);

  // ── Derived: How customer RECEIVES from admin ───────────────

  const customerReceiveMethod = useMemo((): CustomerReceiveMethod | null => {
    if (!exchange.selectedCurr?.available) return null;
    const { from, to } = exchange.selectedCurr;

    // Receiving Yuan → need WeChat/Alipay QR
    if (to === "Yuan") {
      return {
        type: "customer-qr",
        label: "Upload your WeChat / Alipay QR code",
      };
    }

    // Receiving Naira → need bank details
    if (to === "Naira") {
      return { type: "customer-bank", label: "Your Bank Details" };
    }

    // Receiving USDT → need wallet address
    if (to === "USDT") {
      return { type: "customer-wallet", label: "Your USDT Wallet Address" };
    }

    return null;
  }, [exchange.selectedCurr]);

  // Progressive disclosure
  const showAmounts = !!exchange.selectedCurr?.available;
  const showMethod = !!(
    showAmounts &&
    exchange.sendAmount &&
    exchange.sendAmount > 0
  );
  const showAdminPayment = !!form.method && !!adminPaymentMethod;
  const showReceipt = showAdminPayment;
  const showCustomerReceive = !!form.receiptFile && !!customerReceiveMethod;
  const showNarration =
    !!form.customerQrFile ||
    (!!form.receiptFile && customerReceiveMethod?.type !== "customer-qr");
  const showContact =
    showNarration ||
    (showCustomerReceive && customerReceiveMethod?.type === "customer-bank");

  // ── Handlers ────────────────────────────────────────────────

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setTimeout(() => {
          setCurrency("");
          exchange.reset();
          form.reset();
        }, 300);
      }
    },
    [exchange, form],
  );

  const handleCopy = useCallback(
    async (text: string, field: string) => {
      const success = await copyToClipboard(text);
      if (success) {
        form.setCopiedField(field);
        setTimeout(() => form.setCopiedField(null), 2000);
      }
    },
    [form],
  );

  const handleFileUpload = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setter: (file: File | null) => void,
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const error = validateFile(file);
      if (error) {
        alert(error);
        return;
      }
      setter(file);
    },
    [],
  );

  const isFormValid = useCallback(() => {
    if (!exchange.selectedCurr?.available) return false;
    if (!exchange.sendAmount || exchange.sendAmount <= 0) return false;
    if (!form.method) return false;
    if (!form.receiptFile) return false;
    if (!customerReceiveMethod) return false;

    // Validate based on receive method
    if (customerReceiveMethod.type === "customer-qr" && !form.customerQrFile)
      return false;
    if (
      customerReceiveMethod.type === "customer-bank" &&
      (!form.customerBankName.trim() ||
        !form.customerAccountNumber.trim() ||
        !form.customerBank.trim())
    )
      return false;
    if (
      customerReceiveMethod.type === "customer-wallet" &&
      !form.customerWalletAddress.trim()
    )
      return false;

    if (!form.whatsapp.trim()) return false;
    if (!form.email.trim()) return false;
    return true;
  }, [exchange, form, customerReceiveMethod]);

  const handleSubmit = useCallback(() => {
    if (isFormValid()) {
      alert("Exchange request submitted! We\'ll contact you in a few minutes.");
      handleOpenChange(false);
    }
  }, [isFormValid, handleOpenChange]);

  // ── Render ──────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-linear-to-r from-blue-600 to-blue-700 text-white flex cursor-pointer py-6 px-8 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Get Started
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        aria-describedby="exchange-description"
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-blue-950 flex items-center gap-2">
            <ArrowRightLeft
              className="w-6 h-6 text-blue-600"
              aria-hidden="true"
            />
            Currency Exchange
          </DialogTitle>
          <p id="exchange-description" className="sr-only">
            Complete the form to submit a currency exchange request
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1a: Currency pair */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Select Currency Pair
            </Label>
            <Dropdown
              type="exchange"
              currency={currency}
              setCurrency={setCurrency}
              setSelectedCurr={exchange.setSelectedCurr}
            />
            {exchange.selectedCurr && !exchange.selectedCurr.available && (
              <div
                className="flex items-center gap-2 text-red-600 text-sm mt-1"
                role="alert"
              >
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>This currency pair is currently unavailable</span>
              </div>
            )}
          </div>

          {/* Exchange rate pill */}
          {showAmounts && exchange.selectedCurr && (
            <ExchangeRatePill
              from={exchange.selectedCurr.from}
              to={exchange.selectedCurr.to}
              rate={exchange.selectedCurr.rate}
            />
          )}

          {/* Step 1b: Amount */}
          {showAmounts && exchange.selectedCurr && (
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700">
                Amount to Exchange
              </Label>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">You send</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-md border border-gray-200 shrink-0">
                      {exchange.selectedCurr.from}
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={exchange.sendAmount ?? ""}
                      onChange={(e) =>
                        exchange.setSendAmount(Number(e.target.value))
                      }
                      className="py-6 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      aria-label={`Amount in ${exchange.selectedCurr.from}`}
                      min={0}
                      step="any"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <ArrowRightLeft
                      className="w-4 h-4 text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">You receive</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-md border border-gray-200 shrink-0">
                      {exchange.selectedCurr.to}
                    </span>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={exchange.receiveAmount?.toString() ?? ""}
                        readOnly
                        className={`py-6 text-lg bg-gray-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${exchange.isCalculating ? "opacity-50" : ""}`}
                        aria-label={`Estimated amount in ${exchange.selectedCurr.to}`}
                        aria-live="polite"
                      />
                      {exchange.isCalculating && (
                        <RefreshCw
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1c: Payment method */}
          {showMethod && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Payment Method
              </Label>
              <Dropdown
                type="method"
                method={form.method}
                setMethod={form.setMethod}
              />
              {form.method && (
                <div className="flex items-center gap-2 text-green-600 text-sm mt-1">
                  <CreditCard className="w-4 h-4" aria-hidden="true" />
                  <span>Secure payment processing</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Admin Payment Details (how customer pays admin) */}
          {showAdminPayment && adminPaymentMethod && (
            <AdminPaymentSection
              method={adminPaymentMethod}
              sendAmount={exchange.sendAmount}
              copiedField={form.copiedField}
              onCopy={handleCopy}
            />
          )}

          {/* Step 3: Upload payment receipt */}
          {showReceipt && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" aria-hidden="true" />
                Upload Payment Receipt
              </Label>
              <FileUploadSlot
                id="receipt-upload"
                file={form.receiptFile}
                onUpload={(e) => handleFileUpload(e, form.setReceiptFile)}
                onRemove={() => form.setReceiptFile(null)}
                label="Click to upload your payment receipt"
              />
            </div>
          )}

          {/* Step 4: Customer Receive Details (how admin pays customer back) */}
          {showCustomerReceive && customerReceiveMethod && (
            <div className="space-y-2">
              {/* Receive Yuan → Upload QR */}
              {customerReceiveMethod.type === "customer-qr" && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <QrCode
                      className="w-4 h-4 text-blue-600"
                      aria-hidden="true"
                    />
                    Your WeChat / Alipay QR Code
                  </Label>
                  <p className="text-xs text-gray-500">
                    We will send the Yuan to this QR code
                  </p>
                  <FileUploadSlot
                    id="customer-qr-upload"
                    file={form.customerQrFile}
                    onUpload={(e) =>
                      handleFileUpload(e, form.setCustomerQrFile)
                    }
                    onRemove={() => form.setCustomerQrFile(null)}
                    accept="image/*"
                    label="Click to upload your WeChat or Alipay QR code"
                  />
                </div>
              )}

              {/* Receive Naira → Bank Details */}
              {customerReceiveMethod.type === "customer-bank" && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Building2
                      className="w-4 h-4 text-blue-600"
                      aria-hidden="true"
                    />
                    Your Bank Details
                  </Label>
                  <p className="text-xs text-gray-500">
                    We will send the Naira to this account
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">
                        Account Name
                      </Label>
                      <Input
                        placeholder="Your account name"
                        className="py-5"
                        aria-label="Bank account name"
                        value={form.customerBankName}
                        onChange={(e) =>
                          form.setCustomerBankName(e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Account Number
                      </Label>
                      <Input
                        placeholder="Your account number"
                        className="py-5"
                        aria-label="Bank account number"
                        value={form.customerAccountNumber}
                        onChange={(e) =>
                          form.setCustomerAccountNumber(e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Bank Name</Label>
                      <Input
                        placeholder="Your bank name"
                        className="py-5"
                        aria-label="Bank name"
                        value={form.customerBank}
                        onChange={(e) => form.setCustomerBank(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Receive USDT → Wallet Address */}
              {customerReceiveMethod.type === "customer-wallet" && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Wallet
                      className="w-4 h-4 text-blue-600"
                      aria-hidden="true"
                    />
                    Your USDT Wallet Address
                  </Label>
                  <p className="text-xs text-gray-500">
                    We will send the USDT to this wallet
                  </p>
                  <Input
                    placeholder="Enter your USDT wallet address (TRC20)"
                    className="py-5"
                    aria-label="Your USDT wallet address"
                    value={form.customerWalletAddress}
                    onChange={(e) =>
                      form.setCustomerWalletAddress(e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 5: Narration (optional) */}
          {showNarration && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText
                  className="w-4 h-4 text-blue-600"
                  aria-hidden="true"
                />
                Payment Narration{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="Add any notes or narration about your payment…"
                value={form.narration}
                onChange={(e) => form.setNarration(e.target.value)}
                className="resize-none min-h-20"
                aria-label="Payment narration"
              />
            </div>
          )}

          {/* Step 6: Contact info */}
          {showContact && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  WhatsApp Number
                </Label>
                <Input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={form.whatsapp}
                  onChange={(e) => form.setWhatsapp(e.target.value)}
                  className="py-5"
                  aria-label="WhatsApp number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => form.setEmail(e.target.value)}
                  className="py-5"
                  aria-label="Email address"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 7: Done banner */}
          {isFormValid() && (
            <div
              className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
              role="status"
            >
              <CheckCircle
                className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
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
            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Exchange Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
