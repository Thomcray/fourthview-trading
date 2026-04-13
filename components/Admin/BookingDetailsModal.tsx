"use client";

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
import {
  User,
  Calendar,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

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

type BookingDetailsModalProps = {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
  isUpdating: boolean;
};

export default function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
  onStatusChange,
  isUpdating,
}: BookingDetailsModalProps) {
  if (!booking) return null;

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Customer Information */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="font-medium text-gray-800">
                  {booking.firstName} {booking.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <p className="text-sm text-gray-600">{booking.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <p className="text-sm text-gray-600">{booking.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Booking ID</p>
                <p className="font-mono text-sm text-gray-600">#{booking.id}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Submitted Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(booking.created_at).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Booking Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Purpose</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mt-1">
                  {booking.purpose}
                </span>
              </div>

              {booking.factoryName && (
                <div>
                  <p className="text-xs text-gray-400">Factory Name</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="w-3 h-3 text-gray-400" />
                    <p className="text-sm text-gray-700 font-medium">
                      {booking.factoryName}
                    </p>
                  </div>
                </div>
              )}

              {booking.factoryAddress && (
                <div>
                  <p className="text-xs text-gray-400">Factory Address</p>
                  <div className="flex items-start gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      {booking.factoryAddress}
                    </p>
                  </div>
                </div>
              )}

              {booking.visitDate && (
                <div>
                  <p className="text-xs text-gray-400">Visit Date</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {new Date(booking.visitDate).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Update Status
            </h3>
            <Select
              value={booking.status}
              onValueChange={(val) => onStatusChange(booking.id, val)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${option.color}`}
                    >
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Customer will be notified via email when status changes
            </p>
          </div>

          {/* Current Status Badge */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">Current Status</p>
            {booking.status === "pending" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                <Clock className="w-3 h-3" />
                Pending
              </span>
            )}
            {booking.status === "confirmed" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                ✓ Confirmed
              </span>
            )}
            {booking.status === "cancelled" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                ✗ Cancelled
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
