"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  Image as ImageIcon,
  Mail,
  MessageCircle,
  PackageSearch,
  RefreshCcw,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

type SpecialOrder = {
  id: number;
  created_at: string;
  userId: number;
  email: string;
  description: string;
  images: string[];
  status: string;

  deposit_amount: number;
  deposit_reference: string | null;
  deposit_status: "pending" | "paid" | "refunded";
  deposit_paid_at: string | null;
  deposit_refunded_at: string | null;

  refund_reference: string | null;
  refund_status: string | null;
  refund_initiated_at: string | null;
};

export default function SpecialOrdersTab() {
  const [specialOrders, setSpecialOrders] = useState<SpecialOrder[]>([]);

  const [loading, setLoading] = useState(true);

  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<SpecialOrder | null>(null);

  const [refundingId, setRefundingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSpecialOrders();
  }, []);

  const fetchSpecialOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/special-orders", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch special orders.");
      }

      setSpecialOrders(
        Array.isArray(data.specialOrders) ? data.specialOrders : [],
      );
    } catch (error) {
      console.error("Fetch special orders error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load special orders.",
      );

      setSpecialOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedOrder((current) => (current === id ? null : id));
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch("/api/admin/special-orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order status.");
      }

      setSpecialOrders((orders) =>
        orders.map((order) =>
          order.id === id
            ? {
                ...order,
                status,
              }
            : order,
        ),
      );

      setSelectedOrder((order) =>
        order?.id === id
          ? {
              ...order,
              status,
            }
          : order,
      );

      toast.success("Special order status updated.");
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status.",
      );
    }
  };

  const refundDeposit = async (id: number) => {
    try {
      setRefundingId(id);

      const response = await fetch("/api/admin/special-orders/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate refund.");
      }

      setSpecialOrders((orders) =>
        orders.map((order) =>
          order.id === id
            ? {
                ...order,
                refund_reference:
                  data.refundReference ?? order.refund_reference,
                refund_status: data.refundStatus ?? "pending",
                refund_initiated_at: new Date().toISOString(),
              }
            : order,
        ),
      );

      setSelectedOrder((order) =>
        order?.id === id
          ? {
              ...order,
              refund_reference: data.refundReference ?? order.refund_reference,
              refund_status: data.refundStatus ?? "pending",
              refund_initiated_at: new Date().toISOString(),
            }
          : order,
      );

      toast.success("The ₦50,000 refund has been requested successfully.");
    } catch (error) {
      console.error("Refund error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to initiate refund.",
      );
    } finally {
      setRefundingId(null);
    }
  };

  const handleRefund = (order: SpecialOrder) => {
    if (order.deposit_status !== "paid") {
      toast.error("Only paid deposits can be refunded.");
      return;
    }

    if (
      order.refund_status === "pending" ||
      order.refund_status === "processing"
    ) {
      toast.info("A refund is already being processed.");
      return;
    }

    const amount = Number(order.deposit_amount || 50_000).toLocaleString(
      "en-NG",
    );

    const confirmed = window.confirm(
      `Refund ₦${amount} to ${order.email}?\n\n` +
        `This will request a refund through Paystack. Continue?`,
    );

    if (!confirmed) {
      return;
    }

    refundDeposit(order.id);
  };

  const getDepositBadge = (order: SpecialOrder) => {
    if (order.deposit_status === "refunded") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          <BadgeCheck size={13} />
          Refunded
        </span>
      );
    }

    if (order.refund_status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
          <RefreshCcw size={13} />
          Refund Pending
        </span>
      );
    }

    if (order.refund_status === "processing") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
          <RefreshCcw size={13} />
          Refund Processing
        </span>
      );
    }

    if (order.deposit_status === "paid") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
          <BadgeCheck size={13} />
          Deposit Paid
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
        Pending
      </span>
    );
  };

  const getRefundButton = (order: SpecialOrder) => {
    if (order.deposit_status === "refunded") {
      return null;
    }

    if (
      order.refund_status === "pending" ||
      order.refund_status === "processing"
    ) {
      return (
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 rounded-lg bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-700"
        >
          <RefreshCcw size={15} />
          Refund Pending
        </button>
      );
    }

    if (order.refund_status === "processed") {
      return (
        <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700">
          <BadgeCheck size={15} />
          Refund Processed
        </span>
      );
    }

    if (order.deposit_status === "paid") {
      return (
        <button
          type="button"
          onClick={() => handleRefund(order)}
          disabled={refundingId === order.id}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          <RefreshCcw
            size={15}
            className={refundingId === order.id ? "animate-spin" : ""}
          />

          {refundingId === order.id ? "Refunding..." : "Refund ₦50,000"}
        </button>
      );
    }

    return null;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <RefreshCcw size={16} className="animate-spin" />
          Loading special orders...
        </div>
      </div>
    );
  }

  if (specialOrders.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <PackageSearch size={32} className="mx-auto mb-3 text-gray-400" />

        <p className="text-sm font-medium text-gray-700">
          No special orders found.
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Special orders will appear here after a customer submits one.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {specialOrders.map((order) => {
          const isExpanded = expandedOrder === order.id;

          return (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        Special Order #{order.id}
                      </h3>

                      {getDepositBadge(order)}

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {order.email}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                    >
                      <Eye size={15} />
                      View
                    </button>

                    {getRefundButton(order)}

                    <button
                      type="button"
                      onClick={() => toggleExpanded(order.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={15} />
                          Hide
                        </>
                      ) : (
                        <>
                          <ChevronDown size={15} />
                          Details
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-900">
                          Description
                        </h4>

                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                          {order.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-900">
                          Contact
                        </h4>

                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Mail size={15} />
                            {order.email}
                          </p>

                          <p className="flex items-center gap-2">
                            <MessageCircle size={15} />
                            User ID: {order.userId}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-900">
                          Deposit
                        </h4>

                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            Amount:{" "}
                            <span className="font-medium text-gray-900">
                              ₦
                              {Number(
                                order.deposit_amount || 50_000,
                              ).toLocaleString("en-NG")}
                            </span>
                          </p>

                          <p>
                            Status:{" "}
                            <span className="font-medium capitalize text-gray-900">
                              {order.deposit_status}
                            </span>
                          </p>

                          <p>Paid: {formatDate(order.deposit_paid_at)}</p>

                          <p className="break-all">
                            Reference: {order.deposit_reference || "—"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-900">
                          Refund
                        </h4>

                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            Status:{" "}
                            <span className="font-medium capitalize text-gray-900">
                              {order.refund_status || "Not requested"}
                            </span>
                          </p>

                          <p>
                            Requested: {formatDate(order.refund_initiated_at)}
                          </p>

                          <p>
                            Refunded: {formatDate(order.deposit_refunded_at)}
                          </p>

                          <p className="break-all">
                            Reference: {order.refund_reference || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {order.images?.length > 0 && (
                      <div className="mt-5">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <ImageIcon size={15} />
                          Reference Images
                        </h4>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {order.images.map((image, index) => (
                            <a
                              key={`${image}-${index}`}
                              href={image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group overflow-hidden rounded-lg border border-gray-200"
                            >
                              <img
                                src={image}
                                alt={`Special order reference ${index + 1}`}
                                className="aspect-square w-full object-cover transition group-hover:scale-105"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-5">
                      <span className="mr-1 text-sm font-medium text-gray-700">
                        Update status:
                      </span>

                      {["pending", "reviewing", "fulfilled", "cancelled"].map(
                        (status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateStatus(order.id, status)}
                            disabled={order.status === status}
                            className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition ${
                              order.status === status
                                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                : "bg-gray-900 text-white hover:bg-gray-800"
                            }`}
                          >
                            {status}
                          </button>
                        ),
                      )}

                      {getRefundButton(order)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Special Order #{selectedOrder.id}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedOrder.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5">
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Description
                </h3>

                <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {selectedOrder.description}
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Deposit Information
                </h3>

                <div className="grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>

                    <p className="mt-1 font-semibold text-gray-900">
                      ₦
                      {Number(
                        selectedOrder.deposit_amount || 50_000,
                      ).toLocaleString("en-NG")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Deposit Status</p>

                    <div className="mt-1">{getDepositBadge(selectedOrder)}</div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Payment Reference</p>

                    <p className="mt-1 break-all text-sm text-gray-900">
                      {selectedOrder.deposit_reference || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Paid At</p>

                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedOrder.deposit_paid_at)}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Refund Information
                </h3>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-500">Refund Status</p>

                      <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                        {selectedOrder.refund_status || "Not requested"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Refund Reference</p>

                      <p className="mt-1 break-all text-sm text-gray-900">
                        {selectedOrder.refund_reference || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Refund Requested</p>

                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedOrder.refund_initiated_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Refund Completed</p>

                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedOrder.deposit_refunded_at)}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.refund_status &&
                    selectedOrder.deposit_status !== "refunded" && (
                      <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                        The refund has been requested through Paystack. The
                        deposit will be marked as refunded once the refund is
                        confirmed.
                      </div>
                    )}
                </div>
              </section>

              {selectedOrder.images?.length > 0 && (
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <ImageIcon size={16} />
                    Reference Images
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {selectedOrder.images.map((image, index) => (
                      <a
                        key={`${image}-${index}`}
                        href={image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group overflow-hidden rounded-lg border border-gray-200"
                      >
                        <img
                          src={image}
                          alt={`Special order reference ${index + 1}`}
                          className="aspect-square w-full object-cover transition group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                </section>
              )}

              <section className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-5">
                {getRefundButton(selectedOrder)}

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Close
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
