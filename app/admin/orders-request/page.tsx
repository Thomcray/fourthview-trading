"use client";

import AdminTable from "@/components/Admin/AdminTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
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
import { CloudDownload, Search, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookings } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";

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

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const headers = ["Name", "Email", "Purpose", "Details", "Date", "Status", "Actions"];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.bookings,
    queryFn: fetchBookings,
  });

  const bookings: Booking[] = data?.bookings ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bookings.filter(
      (b) =>
        b.email.toLowerCase().includes(q) ||
        b.purpose.toLowerCase().includes(q) ||
        b.firstName.toLowerCase().includes(q) ||
        b.lastName.toLowerCase().includes(q) ||
        new Date(b.created_at).toLocaleDateString().includes(q),
    );
  }, [search, bookings]);

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch("/api/bookings/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 207) throw new Error("Failed to update status");
      return { data, status: res.status };
    },
    onMutate: ({ id }) => setUpdatingId(id),
    onSuccess: ({ data, status }, { id, status: newStatus }) => {
      // Optimistically update cache
      queryClient.setQueryData(queryKeys.bookings, (old: { bookings: Booking[] } | undefined) => ({
        bookings: (old?.bookings ?? []).map((b) =>
          b.id === id ? { ...b, status: newStatus } : b,
        ),
      }));
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
      if (status === 207) {
        toast.warn(data.warning);
      } else {
        toast.success(`Status updated to ${newStatus}. Customer notified via email.`);
      }
    },
    onError: () => toast.error("Failed to update status."),
    onSettled: () => setUpdatingId(null),
  });

  const handleStatusChange = (id: number, status: string) => {
    updateStatus({ id, status });
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Phone", "Purpose", "Factory Name", "Factory Address", "Visit Date", "Date", "Status"],
      ...filtered.map((b) => [
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
    a.download = "bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col px-4 py-4 space-y-4 border rounded-md">
      <h1 className="text-xl text-slate-500">Orders & Request List</h1>

      <div className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-row gap-2 items-center border rounded-md py-1 px-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, purpose, date..."
            className="w-full text-sm text-slate-500 py-4 border-none shadow-none focus-visible:ring-0 placeholder:text-xs placeholder:font-light"
          />
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="flex flex-row gap-2 items-center border rounded-md p-2 cursor-pointer shrink-0"
        >
          <CloudDownload className="w-4 h-4 text-slate-500" />
          <span className="text-slate-500 text-xs hidden sm:inline">Export CSV</span>
        </Button>
      </div>

      <div className="border rounded-md overflow-x-auto">
        {isLoading ? (
          <p className="text-slate-500 text-sm text-center py-10">Loading...</p>
        ) : isError ? (
          <p className="text-slate-500 text-sm text-center py-10">Failed to load bookings.</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-10">No bookings found.</p>
        ) : (
          <AdminTable headers={headers} caption="A list of recent orders & requests.">
            {filtered.map((booking) => (
              <TableRow key={booking.id} className="text-slate-500 text-sm font-light">
                <TableCell className="font-medium whitespace-nowrap">
                  {booking.firstName} {booking.lastName}
                </TableCell>
                <TableCell className="whitespace-nowrap">{booking.email}</TableCell>
                <TableCell className="whitespace-nowrap">{booking.purpose}</TableCell>
                <TableCell className="text-xs text-slate-400">
                  {booking.factoryName ? (
                    <span>
                      {booking.factoryName}
                      {booking.visitDate && (
                        <> · {new Date(booking.visitDate).toLocaleDateString()}</>
                      )}
                    </span>
                  ) : "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {new Date(booking.created_at).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onValueChange={(val) => handleStatusChange(booking.id, val)}
                    disabled={updatingId === booking.id}
                  >
                    <SelectTrigger className={`w-32 text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${statusStyles[booking.status] ?? "bg-slate-100 text-slate-600"}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-slate-400 hover:text-blue-600"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </AdminTable>
        )}
      </div>

      {/* Booking detail modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="flex flex-col gap-4 text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400">Name</p>
                  <p className="font-medium">{selectedBooking.firstName} {selectedBooking.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p>{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p>{selectedBooking.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Purpose</p>
                  <p>{selectedBooking.purpose}</p>
                </div>
                {selectedBooking.factoryName && (
                  <div>
                    <p className="text-xs text-slate-400">Factory Name</p>
                    <p>{selectedBooking.factoryName}</p>
                  </div>
                )}
                {selectedBooking.factoryAddress && (
                  <div>
                    <p className="text-xs text-slate-400">Factory Address</p>
                    <p>{selectedBooking.factoryAddress}</p>
                  </div>
                )}
                {selectedBooking.visitDate && (
                  <div>
                    <p className="text-xs text-slate-400">Visit Date</p>
                    <p>{new Date(selectedBooking.visitDate).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400">Submitted</p>
                  <p>{new Date(selectedBooking.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t">
                <p className="text-xs text-slate-400">Change Status</p>
                <Select
                  value={selectedBooking.status}
                  onValueChange={(val) => handleStatusChange(selectedBooking.id, val)}
                  disabled={updatingId === selectedBooking.id}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}