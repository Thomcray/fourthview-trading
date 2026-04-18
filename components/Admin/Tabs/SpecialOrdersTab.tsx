"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import AdminTable from "@/components/Admin/AdminTable";
import {
  Search,
  CloudDownload,
  Eye,
  PackageSearch,
  ChevronDown,
  X,
  Check,
  Clock,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";

type SpecialOrder = {
  id: number;
  created_at: string;
  userId: number;
  email: string;
  description: string;
  images: string[];
  status: string;
};

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
    nextStatuses: string[];
  }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock className="w-3 h-3" />,
    nextStatuses: ["reviewing", "fulfilled", "cancelled"],
  },
  reviewing: {
    label: "Reviewing",
    color: "bg-blue-100 text-blue-700",
    icon: <Loader2 className="w-3 h-3" />,
    nextStatuses: ["fulfilled", "cancelled"],
  },
  fulfilled: {
    label: "Fulfilled",
    color: "bg-green-100 text-green-700",
    icon: <Check className="w-3 h-3" />,
    nextStatuses: [],
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: <X className="w-3 h-3" />,
    nextStatuses: [],
  },
};

const headers = [
  "ID",
  "Customer",
  "Description",
  "Images",
  "Date",
  "Status",
  "Actions",
];

const fetchSpecialOrders = async () => {
  const res = await fetch("/api/admin/special-orders");
  if (!res.ok) throw new Error("Failed to fetch special orders");
  return res.json();
};

export default function SpecialOrdersTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<number | null>(
    null,
  );
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SpecialOrder | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["specialOrders"],
    queryFn: fetchSpecialOrders,
  });

  const orders: SpecialOrder[] = data?.specialOrders ?? [];

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch("/api/admin/special-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onMutate: ({ id }) => setUpdatingId(id),
    onSuccess: (_, { id, status }) => {
      queryClient.setQueryData(
        ["specialOrders"],
        (old: { specialOrders: SpecialOrder[] } | undefined) => ({
          specialOrders: (old?.specialOrders ?? []).map((o) =>
            o.id === id ? { ...o, status } : o,
          ),
        }),
      );
      toast.success(`Order marked as ${status}`);
    },
    onError: () => toast.error("Failed to update status"),
    onSettled: () => {
      setUpdatingId(null);
      setStatusDropdownOpen(null);
    },
  });

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    return orders
      .filter(
        (o) =>
          !q ||
          o.email.toLowerCase().includes(q) ||
          o.description?.toLowerCase().includes(q) ||
          o.id.toString().includes(q),
      )
      .filter((o) => statusFilter === "all" || o.status === statusFilter);
  }, [search, statusFilter, orders]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    reviewing: orders.filter((o) => o.status === "reviewing").length,
    fulfilled: orders.filter((o) => o.status === "fulfilled").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Email", "Description", "Images", "Status", "Date"],
      ...orders.map((o) => [
        o.id,
        o.email,
        `"${o.description?.replace(/"/g, '""') ?? ""}"`,
        o.images?.length ?? 0,
        o.status,
        new Date(o.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `special-orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Special orders exported!");
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
    <>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Reviewing</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.reviewing}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Fulfilled</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.fulfilled}
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
                placeholder="Search by email, description, ID..."
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
                <option value="reviewing">Reviewing</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
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

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <PackageSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No special orders found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <AdminTable headers={headers} caption="A list of special orders.">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-mono text-sm text-gray-500">
                      #{order.id}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700">{order.email}</p>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p
                        className="text-sm text-gray-600 truncate"
                        title={order.description}
                      >
                        {order.description?.length > 60
                          ? order.description.substring(0, 60) + "..."
                          : order.description || "—"}
                      </p>
                    </TableCell>
                    <TableCell>
                      {order.images?.length > 0 ? (
                        <div className="flex gap-1">
                          {order.images.slice(0, 2).map((img, i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 bg-gray-50 shrink-0"
                            >
                              <Image
                                src={img}
                                alt={`Order image ${i + 1}`}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No images</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setStatusDropdownOpen(
                              statusDropdownOpen === order.id ? null : order.id,
                            )
                          }
                          disabled={updatingId === order.id}
                          className="flex items-center gap-1 hover:opacity-80 disabled:opacity-50"
                        >
                          {getStatusBadge(order.status)}
                          {statusConfig[order.status]?.nextStatuses.length >
                            0 && (
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                        {statusDropdownOpen === order.id && (
                          <div className="absolute z-10 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                            {statusConfig[order.status]?.nextStatuses.map(
                              (nextStatus) => (
                                <button
                                  key={nextStatus}
                                  onClick={() =>
                                    updateStatus({
                                      id: order.id,
                                      status: nextStatus,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${statusConfig[nextStatus]?.color.split(" ")[0].replace("100", "500")}`}
                                  />
                                  Mark as {statusConfig[nextStatus]?.label}
                                </button>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AdminTable>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Special Order #{selectedOrder.id}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedOrder.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Status
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Date */}
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Submitted
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {new Date(selectedOrder.created_at).toLocaleDateString(
                      "en-NG",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Description
                  </span>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed bg-gray-50 rounded-lg p-3">
                    {selectedOrder.description || "No description provided"}
                  </p>
                </div>

                {/* Images */}
                {selectedOrder.images?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Reference Images ({selectedOrder.images.length})
                    </span>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {selectedOrder.images.map((img, i) => (
                        <a
                          key={i}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:opacity-90 transition-opacity">
                            <Image
                              src={img}
                              alt={`Reference image ${i + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Actions */}
                {statusConfig[selectedOrder.status]?.nextStatuses.length >
                  0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 block mb-2">
                      Update Status
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {statusConfig[selectedOrder.status].nextStatuses.map(
                        (nextStatus) => (
                          <Button
                            key={nextStatus}
                            size="sm"
                            variant="outline"
                            disabled={updatingId === selectedOrder.id}
                            onClick={() => {
                              updateStatus({
                                id: selectedOrder.id,
                                status: nextStatus,
                              });
                              setSelectedOrder({
                                ...selectedOrder,
                                status: nextStatus,
                              });
                            }}
                            className="capitalize"
                          >
                            Mark as {statusConfig[nextStatus].label}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
