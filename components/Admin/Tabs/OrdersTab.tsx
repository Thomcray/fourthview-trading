"use client";

import { useEffect, useState } from "react";
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
  Trash2,
  Loader2,
} from "lucide-react";
import { RefundModal } from "../Modals/RefundModal";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchOrders } from "@/app/_lib/api";
import { toast } from "react-toastify";

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
  order_status: string;
  customerName: string;
  customerEmail: string;
  customerId?: number;
  items: OrderItem[] | number;
  is_deleted: boolean;
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

export default function OrdersTab() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [showRefundModal, setShowRefundModal] = useState(false);

  const [statusDropdownOpen, setStatusDropdownOpen] = useState<number | null>(
    null,
  );

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data: ordersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["orders", debouncedSearch, statusFilter],

    queryFn: ({ pageParam = null }) =>
      fetchOrders({
        cursor: pageParam,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
      }),

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    initialPageParam: null,

    placeholderData: keepPreviousData,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await queryClient.resetQueries({
        queryKey: ["orders", debouncedSearch, statusFilter],
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const orders: Order[] =
    ordersData?.pages.flatMap((page) => page.orders) ?? [];

  const totalOrders = ordersData?.pages[0]?.total ?? 0;

  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: async ({
      id,
      status,
      notify = true,
    }: {
      id: number;
      status: string;
      notify?: boolean;
    }) => {
      const res = await fetch("/api/admin/orders/update-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
          notify,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      return data;
    },

    onMutate: ({ id }) => {
      setUpdatingId(id);
    },

    onSuccess: (data, { status }) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success(
        `Order marked as ${status.toUpperCase()}!${
          data.notified ? " Customer notified via email." : ""
        }`,
      );
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order status.");
    },

    onSettled: () => {
      setUpdatingId(null);
      setStatusDropdownOpen(null);
    },
  });

  const { mutate: deleteOrder, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/admin/orders/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove order.");
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success("Order removed successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove order.");
    },
  });

  const getItemCount = (order: Order): number => {
    if (typeof order.items === "number") {
      return order.items;
    }

    if (Array.isArray(order.items)) {
      return order.items.length;
    }

    return 0;
  };

  const isEligibleForRefund = (order: Order) =>
    ["delivered", "shipped", "processing"].includes(order.order_status);

  const stats = {
    total: totalOrders,

    processing: orders.filter((o) => o.order_status === "processing").length,

    shipped: orders.filter((o) => o.order_status === "shipped").length,

    delivered: orders.filter((o) => o.order_status === "delivered").length,

    cancelled: orders.filter((o) => o.order_status === "cancelled").length,
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.processing;

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
    if (orders.length === 0) {
      toast.info("There are no orders to export.");
      return;
    }

    const csv = [
      [
        "ID",
        "Reference",
        "Customer",
        "Email",
        "Items",
        "Total",
        "Date",
        "Status",
      ],

      ...orders.map((order) => [
        order.id,
        order.reference,
        order.customerName,
        order.customerEmail,
        getItemCount(order),
        order.total.toFixed(2),
        new Date(order.created_at).toLocaleDateString(),
        order.order_status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;

    a.click();

    URL.revokeObjectURL(url);

    toast.success("Orders exported!");
  };

  return (
    <>
      <div className="space-y-6">
        {/* Stats */}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Orders</p>

            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
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

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Cancelled</p>

            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
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

                <option value="processing">Processing</option>

                <option value="shipped">Shipped</option>

                <option value="delivered">Delivered</option>

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

        {/* Orders List */}

        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isFetching && !isFetchingNextPage && (
            <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-100">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-500">Loading orders...</span>
              </div>
            </div>
          )}

          {isPending && orders.length === 0 ? (
            <div className="p-6 space-y-4">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />

              <p className="text-gray-500">No orders found</p>

              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              {/* Mobile */}

              <div className="md:hidden divide-y divide-gray-100">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: Math.min(index * 0.02, 0.5),
                    }}
                    className="p-4 hover:bg-gray-50 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs text-gray-400">
                          #{order.id}
                        </p>

                        <p className="font-mono text-sm font-medium text-gray-800">
                          {order.reference}
                        </p>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setStatusDropdownOpen(
                              statusDropdownOpen === order.id ? null : order.id,
                            )
                          }
                          disabled={updatingId === order.id}
                          className="flex items-center gap-1 hover:opacity-80 disabled:opacity-50 cursor-pointer"
                        >
                          {getStatusBadge(order.order_status)}

                          {statusConfig[order.order_status]?.nextStatuses
                            .length > 0 && (
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          )}
                        </button>

                        {statusDropdownOpen === order.id && (
                          <div className="absolute right-0 z-10 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                            {statusConfig[order.order_status]?.nextStatuses.map(
                              (nextStatus) => (
                                <button
                                  key={nextStatus}
                                  onClick={() =>
                                    updateOrderStatus({
                                      id: order.id,
                                      status: nextStatus,
                                      notify: true,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${statusConfig[
                                      nextStatus
                                    ].color
                                      .split(" ")[0]
                                      .replace("100", "500")}`}
                                  />
                                  Mark as {statusConfig[nextStatus].label}
                                </button>
                              ),
                            )}

                            <div className="border-t border-gray-100 my-1" />

                            <button
                              onClick={() =>
                                updateOrderStatus({
                                  id: order.id,
                                  status: order.order_status,
                                  notify: false,
                                })
                              }
                              className="w-full px-3 py-2 text-left text-xs text-gray-500 hover:bg-gray-50 cursor-pointer"
                            >
                              Update without notifying
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">
                        {order.customerName}
                      </p>

                      <p className="text-xs text-gray-400">
                        {order.customerEmail}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {getItemCount(order)} item
                        {getItemCount(order) !== 1 ? "s" : ""}
                      </span>

                      <span className="font-semibold text-gray-800">
                        ₦
                        {typeof order.total === "number"
                          ? order.total.toLocaleString()
                          : Number(order.total).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="flex-1 justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer text-xs"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>

                      {isEligibleForRefund(order) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowRefundModal(true);
                          }}
                          className="flex-1 justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer text-xs"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Refund
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Remove order #${order.id}? This will hide it from the orders list but will not permanently delete it.`,
                          );

                          if (confirmed) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="flex-1 justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer text-xs disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop */}

              <div className="hidden md:block overflow-x-auto">
                <AdminTable
                  headers={orderHeaders}
                  caption="A list of customer orders."
                >
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: Math.min(index * 0.02, 0.5),
                      }}
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
                        {new Date(order.created_at).toLocaleDateString(
                          "en-NG",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setStatusDropdownOpen(
                                statusDropdownOpen === order.id
                                  ? null
                                  : order.id,
                              )
                            }
                            disabled={updatingId === order.id}
                            className="flex items-center gap-1 hover:opacity-80 disabled:opacity-50 cursor-pointer"
                          >
                            {getStatusBadge(order.order_status)}

                            {statusConfig[order.order_status]?.nextStatuses
                              .length > 0 && (
                              <ChevronDown className="w-3 h-3 text-gray-400" />
                            )}
                          </button>

                          {statusDropdownOpen === order.id && (
                            <div className="absolute z-10 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                              {statusConfig[
                                order.order_status
                              ]?.nextStatuses.map((nextStatus) => (
                                <button
                                  key={nextStatus}
                                  onClick={() =>
                                    updateOrderStatus({
                                      id: order.id,
                                      status: nextStatus,
                                      notify: true,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${statusConfig[
                                      nextStatus
                                    ].color
                                      .split(" ")[0]
                                      .replace("100", "500")}`}
                                  />
                                  Mark as {statusConfig[nextStatus].label}
                                </button>
                              ))}

                              <div className="border-t border-gray-100 my-1" />

                              <button
                                onClick={() =>
                                  updateOrderStatus({
                                    id: order.id,
                                    status: order.order_status,
                                    notify: false,
                                  })
                                }
                                className="w-full px-3 py-2 text-left text-xs text-gray-500 hover:bg-gray-50 cursor-pointer"
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
                            className="text-gray-400 hover:text-blue-600 cursor-pointer"
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
                              className="text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => {
                              const confirmed = window.confirm(
                                `Remove order #${order.id}? This will hide it from the orders list but will not permanently delete it.`,
                              );

                              if (confirmed) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AdminTable>
              </div>

              {/* Pagination / Refresh */}

              <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
                {hasNextPage ? (
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outline"
                    className="gap-2 min-w-37.5 cursor-pointer"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    variant="outline"
                    className="gap-2 min-w-37.5 cursor-pointer"
                  >
                    {isRefreshing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

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
