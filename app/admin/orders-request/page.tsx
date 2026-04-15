// app/admin/orders/page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  ClipboardList,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookings, fetchOrders, fetchRefunds } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";
import { Button } from "@/components/ui/button";
import OrdersTab from "@/components/Admin/Tabs/OrdersTab";
import RequestsTab from "@/components/Admin/Tabs/RequestsTab";
import RefundsTab from "@/components/Admin/Tabs/RefundsTab";

type Booking = {
  id: number;
  created_at: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  purpose: string;
  factoryName?: string;
  factoryAddress?: string;
  visitDate?: string;
  status: string;
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
  items: number;
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "requests" | "refunds">(
    "orders",
  );
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const {
    data: refundsData,
    isLoading: refundsLoading,
    isError: refundsError,
    refetch: refetchRefunds,
  } = useQuery({ queryKey: ["refunds"], queryFn: fetchRefunds });

  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    isError: bookingsError,
    refetch: refetchBookings,
  } = useQuery({ queryKey: queryKeys.bookings, queryFn: fetchBookings });

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useQuery({ queryKey: queryKeys.orders, queryFn: fetchOrders });

  const bookings: Booking[] = bookingsData?.bookings ?? [];
  const orders: Order[] = ordersData?.orders ?? [];

  // Mutation for updating BOOKING/REQUEST status
  const { mutate: updateBookingStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch("/api/bookings/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 207)
        throw new Error("Failed to update status");
      return { data, status: res.status };
    },
    onMutate: ({ id }) => setUpdatingId(id),
    onSuccess: ({ data, status }, { id, status: newStatus }) => {
      queryClient.setQueryData(
        queryKeys.bookings,
        (old: { bookings: Booking[] } | undefined) => ({
          bookings: (old?.bookings ?? []).map((b) =>
            b.id === id ? { ...b, status: newStatus } : b,
          ),
        }),
      );
      if (status === 207) {
        toast.warn(data.warning);
      } else {
        toast.success(
          `Request ${newStatus.toUpperCase()}! Customer has been notified.`,
        );
      }
    },
    onError: () => toast.error("Failed to update status. Please try again."),
    onSettled: () => setUpdatingId(null),
  });

  // NEW: Mutation for updating ORDER status
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
      const res = await fetch("/api/orders/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notify }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to update order status");
      return data;
    },
    onMutate: ({ id }) => setUpdatingId(id),
    onSuccess: (data, { status }) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      toast.success(
        `Order marked as ${status.toUpperCase()}! ${data.notified ? "Customer notified via email." : ""}`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order status.");
    },
    onSettled: () => setUpdatingId(null),
  });

  const handleBookingStatusChange = (id: number, status: string) =>
    updateBookingStatus({ id, status });

  const handleOrderStatusChange = (
    id: number,
    status: string,
    notify: boolean = true,
  ) => updateOrderStatus({ id, status, notify });

  const handleExportOrders = () => {
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
      ...orders.map((o) => [
        o.id,
        o.reference,
        o.customerName,
        o.customerEmail,
        o.items,
        o.total.toFixed(2),
        new Date(o.created_at).toLocaleDateString(),
        o.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Orders export started!");
  };

  const handleExportRequests = () => {
    const csv = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Purpose",
        "Factory Name",
        "Factory Address",
        "Visit Date",
        "Submitted Date",
        "Status",
      ],
      ...bookings.map((b) => [
        b.id,
        `${b.firstName} ${b.lastName}`,
        b.email,
        b.phone,
        b.purpose,
        b.factoryName || "-",
        b.factoryAddress || "-",
        b.visitDate ? new Date(b.visitDate).toLocaleDateString() : "-",
        new Date(b.created_at).toLocaleDateString(),
        b.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requests_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Requests export started!");
  };

  const isLoading =
    (activeTab === "orders" && ordersLoading) ||
    (activeTab === "requests" && bookingsLoading) ||
    (activeTab === "refunds" && refundsLoading);

  const isError =
    (activeTab === "orders" && ordersError) ||
    (activeTab === "requests" && bookingsError) ||
    (activeTab === "refunds" && refundsError);

  const refetch =
    activeTab === "orders"
      ? refetchOrders
      : activeTab === "requests"
        ? refetchBookings
        : refetchRefunds;

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Data
          </h2>
          <p className="text-gray-500 mb-6">
            There was an error loading the data.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Orders & Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer orders, service requests, and refunds
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "orders" | "requests" | "refunds")
          }
          className="mb-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refunds
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrdersTab
              orders={orders}
              isLoading={ordersLoading}
              onExport={handleExportOrders}
              onStatusChange={handleOrderStatusChange}
              isUpdating={updatingId !== null}
            />
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <RequestsTab
              bookings={bookings}
              isLoading={bookingsLoading}
              onExport={handleExportRequests}
              onStatusChange={handleBookingStatusChange}
              isUpdating={updatingId !== null}
            />
          </TabsContent>

          <TabsContent value="refunds" className="mt-6">
            <RefundsTab
              refunds={refundsData}
              isLoading={refundsLoading}
              onRefundProcessed={() => {
                queryClient.invalidateQueries({ queryKey: ["refunds"] });
                queryClient.invalidateQueries({ queryKey: queryKeys.orders });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
