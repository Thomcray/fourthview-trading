"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import AdminTable from "@/components/Admin/AdminTable";
import ExchangeDetailsModal from "@/components/Admin/ExchangeDetailsModal";
import { Search, CloudDownload, Eye, ArrowRightLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExchangeTransactions } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";
import { toast } from "react-toastify";

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

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
};

const exchangeHeaders = [
  "ID",
  "Customer",
  "Pair",
  "Amount",
  "Date",
  "Status",
  "Actions",
];

export default function ExchangeTransactionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTxn, setSelectedTxn] = useState<ExchangeTransaction | null>(
    null,
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: txnData, isLoading } = useQuery({
    queryKey: queryKeys.exchangeTransactions,
    queryFn: fetchExchangeTransactions,
  });

  const transactions: ExchangeTransaction[] = txnData?.transactions ?? [];

  const { mutate: updateTxnStatus } = useMutation({
    mutationFn: async ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: string;
      adminNote?: string;
    }) => {
      const res = await fetch(`/api/exchange-transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onMutate: ({ id }) => setUpdatingId(id),
    onSuccess: (data, { id, status: newStatus }) => {
      queryClient.setQueryData(
        queryKeys.exchangeTransactions,
        (old: { transactions: ExchangeTransaction[] } | undefined) => ({
          transactions: (old?.transactions ?? []).map((t) =>
            t.id === id ? { ...t, ...data.transaction } : t,
          ),
        }),
      );
      toast.success(`Transaction ${newStatus.toUpperCase()}!`);
    },
    onError: () => toast.error("Failed to update status. Please try again."),
    onSettled: () => setUpdatingId(null),
  });

  const filteredTxns = useMemo(() => {
    const q = search.toLowerCase();
    return transactions
      .filter(
        (t) =>
          !q ||
          t.email.toLowerCase().includes(q) ||
          t.whatsapp.toLowerCase().includes(q) ||
          t.fromCurrency.toLowerCase().includes(q) ||
          t.toCurrency.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q),
      )
      .filter((t) => statusFilter === "all" || t.status === statusFilter);
  }, [search, statusFilter, transactions]);

  const stats = {
    total: transactions.length,
    pending: transactions.filter((t) => t.status === "pending").length,
    confirmed: transactions.filter((t) => t.status === "confirmed").length,
    completed: transactions.filter((t) => t.status === "completed").length,
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleExport = () => {
    const csv = [
      [
        "ID",
        "From",
        "To",
        "Rate",
        "Send Amount",
        "Receive Amount",
        "WhatsApp",
        "Email",
        "Submitted Date",
        "Status",
      ],
      ...transactions.map((t) => [
        t.id,
        t.fromCurrency,
        t.toCurrency,
        t.rate,
        t.sendAmount,
        t.receiveAmount,
        t.whatsapp,
        t.email,
        new Date(t.createdAt).toLocaleDateString(),
        t.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exchange_transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transactions exported!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Currency Exchange
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review exchange requests, verify payments, and manage payouts
          </p>
        </div>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.confirmed}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by email, WhatsApp, currency, ID..."
                  className="pl-9 py-2 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="gap-2"
                >
                  <CloudDownload className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredTxns.length === 0 ? (
              <div className="text-center py-12">
                <ArrowRightLeft className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No exchange requests found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <>
                {/* Mobile: Card layout */}
                <div className="md:hidden divide-y divide-gray-100">
                  {filteredTxns.map((txn, index) => (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="p-4 hover:bg-gray-50 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-xs text-gray-400">
                          #{txn.id.slice(0, 8)}
                        </p>
                        {getStatusBadge(txn.status)}
                      </div>

                      <div>
                        <p className="font-medium text-gray-800">
                          {txn.fromCurrency} → {txn.toCurrency}
                        </p>
                        <p className="text-xs text-gray-400">{txn.email}</p>
                      </div>

                      <div className="text-sm">
                        <p className="font-medium text-gray-700">
                          {txn.sendAmount.toLocaleString()} {txn.fromCurrency} →{" "}
                          {txn.receiveAmount.toLocaleString()} {txn.toCurrency}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400">
                        Submitted:{" "}
                        {new Date(txn.createdAt).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>

                      <div className="pt-2 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTxn(txn)}
                          className="w-full justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer text-xs"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop: Table layout */}
                <div className="hidden md:block overflow-x-auto">
                  <AdminTable
                    headers={exchangeHeaders}
                    caption="A list of currency exchange requests."
                  >
                    {filteredTxns.map((txn, index) => (
                      <motion.tr
                        key={txn.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-mono text-sm text-gray-500">
                          #{txn.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-800">
                            {txn.email}
                          </p>
                          <p className="text-xs text-gray-400">
                            {txn.whatsapp}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {txn.fromCurrency} → {txn.toCurrency}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          <p className="font-medium">
                            {txn.sendAmount.toLocaleString()} {txn.fromCurrency}
                          </p>
                          <p className="text-xs text-gray-400">
                            → {txn.receiveAmount.toLocaleString()}{" "}
                            {txn.toCurrency}
                          </p>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-gray-500">
                          {new Date(txn.createdAt).toLocaleDateString("en-NG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{getStatusBadge(txn.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTxn(txn)}
                            className="text-gray-400 hover:text-blue-600 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AdminTable>
                </div>
              </>
            )}
          </div>
        </div>

        <ExchangeDetailsModal
          transaction={selectedTxn}
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          onStatusChange={(id, status, adminNote) =>
            updateTxnStatus({ id, status, adminNote })
          }
          isUpdating={updatingId !== null}
        />
      </div>
    </div>
  );
}
