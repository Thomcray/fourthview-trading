// components/Admin/Tabs/RefundsTab.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import AdminTable from "@/components/Admin/AdminTable";
import { Search, CloudDownload, Eye, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

type Refund = {
  id: number;
  order_id: number; // Note: snake_case from database
  order_reference?: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  amount: number;
  reason: string;
  refund_method: string;
  status: string;
  created_at: string;
  processed_at?: string;
};

const headers = [
  "ID",
  "Order",
  "Customer",
  "Amount",
  "Reason",
  "Method",
  "Status",
  "Date",
  "Actions",
];

interface RefundsTabProps {
  refunds: Refund[] | { refunds: Refund[] };
  isLoading?: boolean;
  onRefundProcessed: () => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
};

export default function RefundsTab({
  refunds: refundsProp,
  isLoading,
  onRefundProcessed,
}: RefundsTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Handle both array and object formats
  const refundsArray = Array.isArray(refundsProp)
    ? refundsProp
    : refundsProp?.refunds || [];

  const filteredRefunds = useMemo(() => {
    const q = search.toLowerCase();
    return refundsArray
      .filter(
        (r) =>
          !q ||
          (r.order_reference && r.order_reference.toLowerCase().includes(q)) ||
          r.customer_name.toLowerCase().includes(q) ||
          r.customer_email.toLowerCase().includes(q) ||
          r.id.toString().includes(q),
      )
      .filter((r) => statusFilter === "all" || r.status === statusFilter);
  }, [search, statusFilter, refundsArray]);

  const stats = {
    total: refundsArray.length,
    pending: refundsArray.filter((r) => r.status === "pending").length,
    completed: refundsArray.filter((r) => r.status === "completed").length,
    totalAmount: refundsArray.reduce(
      (sum, r) => sum + (r.status === "completed" ? r.amount : 0),
      0,
    ),
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
        "Order",
        "Customer",
        "Email",
        "Amount",
        "Reason",
        "Method",
        "Status",
        "Date",
      ],
      ...filteredRefunds.map((r) => [
        r.id,
        r.order_id,
        r.customer_name,
        r.customer_email,
        r.amount,
        r.reason,
        r.refund_method,
        r.status,
        new Date(r.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `refunds_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Refunds export started!");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Refunds</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Refunded</p>
          <p className="text-2xl font-bold text-red-600">
            ₦{stats.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order, customer, email, ID..."
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
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <CloudDownload className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredRefunds.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No refunds found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <AdminTable headers={headers} caption="A list of customer refunds.">
              {filteredRefunds.map((refund, index) => (
                <motion.tr
                  key={refund.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-mono text-sm text-gray-500">
                    #{refund.id}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    #{refund.order_id}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-800">
                      {refund.customer_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {refund.customer_email}
                    </p>
                  </TableCell>
                  <TableCell className="font-semibold text-red-600">
                    ₦{refund.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate" title={refund.reason}>
                      {refund.reason.length > 50
                        ? refund.reason.substring(0, 50) + "..."
                        : refund.reason}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs capitalize">
                      {refund.refund_method}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(refund.status)}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-gray-500">
                    {new Date(refund.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/refunds/${refund.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </motion.tr>
              ))}
            </AdminTable>
          </div>
        )}
      </div>
    </div>
  );
}
