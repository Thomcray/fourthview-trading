// components/Admin/Tabs/OrdersTab.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import AdminTable from "@/components/Admin/AdminTable";
import {
  Search,
  CloudDownload,
  Eye,
  ShoppingBag,
  RefreshCw,
  ChevronDown,
  Check,
  X,
  Truck,
  Package,
} from "lucide-react";
import { RefundModal } from "../Modals/RefundModal";

type OrderItem = {
  id: number;
  itemName: string;
  quantity: number;
  price: number;
  size?: string;
  image?: string;
};

type Order = {
  id: number;
  created_at: string;
  reference: string;
  total: number;
  status: string;
  customerName: string;
  customerEmail: string;
  customerId?: number;
  items: OrderItem[] | number;
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
    icon: <Package className="w-3 h-3" />,
    nextStatuses: ["processing", "cancelled"],
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
    icon: <RefreshCw className="w-3 h-3" />,
    nextStatuses: ["shipped", "cancelled"],
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
    icon: <Truck className="w-3 h-3" />,
    nextStatuses: ["delivered"],
  },
  delivered: {
    label: "Delivered",
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

const orderHeaders = [
  "ID",
  "Reference",
  "Customer",
  "Items",
  "Total",
  "Date",
  "Status",
  "Actions",
];

interface OrdersTabProps {
  orders: Order[];
  isLoading?: boolean;
  onExport: () => void;
  onStatusChange: (id: number, status: string, notify?: boolean) => void;
  isUpdating: boolean;
}

export default function OrdersTab({
  orders,
  isLoading,
  onExport,
  onStatusChange,
  isUpdating,
}: OrdersTabProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<number | null>(
    null,
  );

  const getItemCount = (order: Order): number => {
    if (typeof order.items === "number") {
      return order.items;
    }
    if (Array.isArray(order.items)) {
      return order.items.length;
    }
    return 0;
  };

  const isEligibleForRefund = (order: Order): boolean => {
    const eligibleStatuses = ["delivered", "shipped", "processing"];
    return eligibleStatuses.includes(order.status);
  };

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    return orders
      .filter(
        (o) =>
          !q ||
          o.reference.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.id.toString().includes(q),
      )
      .filter((o) => statusFilter === "all" || o.status === statusFilter);
  }, [search, statusFilter, orders]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
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

  const handleStatusUpdate = (
    orderId: number,
    newStatus: string,
    notify: boolean = true,
  ) => {
    onStatusChange(orderId, newStatus, notify);
    setStatusDropdownOpen(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Processing</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.processing}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Shipped</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.shipped}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Delivered</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.delivered}
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
                placeholder="Search by reference, customer, email, ID..."
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
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline" onClick={onExport} className="gap-2">
                <CloudDownload className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <AdminTable
                headers={orderHeaders}
                caption="A list of customer orders."
              >
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
                    <TableCell className="font-mono text-sm font-medium text-gray-800">
                      {order.reference}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-800">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customerEmail}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {getItemCount(order)} item
                      {getItemCount(order) !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800">
                      ₦
                      {typeof order.total === "number"
                        ? order.total.toLocaleString()
                        : Number(order.total).toLocaleString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {/* Status Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setStatusDropdownOpen(
                              statusDropdownOpen === order.id ? null : order.id,
                            )
                          }
                          disabled={isUpdating}
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
                                    handleStatusUpdate(
                                      order.id,
                                      nextStatus,
                                      true,
                                    )
                                  }
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${statusConfig[nextStatus].color.split(" ")[0].replace("bg-", "bg-").replace("100", "500")}`}
                                  />
                                  Mark as {statusConfig[nextStatus].label}
                                </button>
                              ),
                            )}
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  order.id,
                                  order.status,
                                  false,
                                )
                              }
                              className="w-full px-3 py-2 text-left text-xs text-gray-500 hover:bg-gray-50"
                            >
                              Update without notifying
                            </button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/orders/${order.id}`)
                          }
                          className="text-gray-400 hover:text-blue-600"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {isEligibleForRefund(order) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowRefundModal(true);
                            }}
                            className="text-gray-400 hover:text-red-600"
                            title="Process Refund"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AdminTable>
            </div>
          )}
        </div>
      </div>

      {/* Refund Modal */}
      <RefundModal
        open={showRefundModal}
        onClose={() => {
          setShowRefundModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </>
  );
}
