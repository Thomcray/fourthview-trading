"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import AdminTable from "@/components/Admin/AdminTable";
import BookingDetailsModal from "@/components/Admin/BookingDetailsModal";
import { Search, CloudDownload, Eye, ClipboardList } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookings } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";
import { toast } from "react-toastify";

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

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

const requestHeaders = [
  "ID",
  "Customer",
  "Purpose",
  "Details",
  "Date",
  "Status",
  "Actions",
];

export default function RequestsTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: queryKeys.bookings,
    queryFn: fetchBookings,
  });

  const bookings: Booking[] = bookingsData?.bookings ?? [];

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

  const filteredRequests = useMemo(() => {
    const q = search.toLowerCase();
    return bookings
      .filter(
        (b) =>
          !q ||
          b.email.toLowerCase().includes(q) ||
          b.purpose.toLowerCase().includes(q) ||
          b.firstName.toLowerCase().includes(q) ||
          b.lastName.toLowerCase().includes(q) ||
          b.id.toString().includes(q),
      )
      .filter((b) => statusFilter === "all" || b.status === statusFilter);
  }, [search, statusFilter, bookings]);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
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
    toast.success("Requests exported!");
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
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
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
              placeholder="Search by name, email, purpose, ID..."
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
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <CloudDownload className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No requests found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <AdminTable
              headers={requestHeaders}
              caption="A list of customer requests."
            >
              {filteredRequests.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-mono text-sm text-gray-500">
                    #{booking.id}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-800">
                      {booking.firstName} {booking.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{booking.email}</p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {booking.purpose}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {booking.factoryName ? (
                      <div>
                        <p className="font-medium">{booking.factoryName}</p>
                        {booking.visitDate && (
                          <p className="text-xs text-gray-400">
                            {new Date(booking.visitDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.created_at).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBooking(booking)}
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

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusChange={(id, status) => updateBookingStatus({ id, status })}
        isUpdating={updatingId !== null}
      />
    </div>
  );
}
