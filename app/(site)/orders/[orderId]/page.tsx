"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Hash,
  MapPin,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductPrice from "@/components/ProductPrice";
import { useCurrency } from "@/components/CurrencyContext";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import RefundRequestModal from "@/components/RefundRequestModal";

type OrderItem = {
  id: number;
  itemName: string;
  image?: string;
  price?: number;
  quantity?: number;
  size?: string | null;
  colour?: string;
  shippingCost?: number;
};

type Order = {
  id: number;
  created_at: string;
  reference: string;
  total: number;
  status: string;
  order_status: string;
  items: OrderItem[];
  shipping_address?: {
    streetAddress: string;
    apartment?: string;
    city: string;
    zipCode?: string;
    country?: string;
  };
  payment_method?: string;
  delivered_at?: string;
  payment_id?: string;
  tracking_number?: string;
  estimated_delivery?: string;
};

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { formatFromNGN } = useCurrency();
  const orderId = params.orderId as string;

  const [showRefundModal, setShowRefundModal] = useState(false);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Order not found");

      const data = await res.json();
      return data;
    },
    refetchInterval: 30000, // refetch every 30 seconds
    staleTime: 0,
  });

  // Eligibility check:
  const canRequestRefund = () => {
    if (!order || order.order_status !== "delivered") return false;
    if (!order.delivered_at) return false;
    const daysSince =
      (new Date().getTime() - new Date(order.delivered_at).getTime()) /
      (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  };

  const getStatusBadge = () => {
    if (!order) return null;
    const config = statusConfig[order.order_status] || statusConfig.processing;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-gray-200 rounded" />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-100 rounded" />
              <div className="h-48 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Order Not Found
            </h1>
            <p className="text-gray-500 mb-6">
              We couldn&apos;t find the order you&apos;re looking for.
            </p>
            <Button
              onClick={() => router.push("/account/purchased-items")}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-order, #printable-order * { visibility: visible; }
          #printable-order { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header — hidden on print */}
          <div className="flex items-center justify-between mb-6 no-print">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Receipt</span>
            </Button>
          </div>
          {/* Printable area */}
          <div id="printable-order">
            {/* Order Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6"
            >
              <div className="bg-linear-to-r from-blue-900 to-blue-800 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-white">
                      Order Details
                    </h1>
                    <p className="text-blue-200 text-sm mt-0.5">
                      Order Reference #{order.reference}
                    </p>
                  </div>
                  {getStatusBadge()}
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium text-gray-800">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-NG",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-sm text-gray-800">
                        #{order.id}
                      </span>
                    </div>
                    {order.payment_id && (
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-sm text-gray-800">
                          {order.payment_id}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium text-gray-800 capitalize">
                        {order.payment_method}
                      </span>
                    </div>
                    {order.tracking_number && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Tracking Number:</span>
                        <span className="font-mono text-sm text-gray-800">
                          {order.tracking_number}
                        </span>
                      </div>
                    )}
                    {order.estimated_delivery && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Estimated Delivery:
                        </span>
                        <span className="font-medium text-gray-800">
                          {order.estimated_delivery}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {order.shipping_address?.streetAddress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6"
              >
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Shipping Address
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    {order.shipping_address.streetAddress}
                    {order.shipping_address.apartment &&
                      `, ${order.shipping_address.apartment}`}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.shipping_address.city}
                    {order.shipping_address.zipCode &&
                      `, ${order.shipping_address.zipCode}`}
                    {order.shipping_address.country &&
                      `, ${order.shipping_address.country}`}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6"
            >
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Order Items
                  </h2>
                  <span className="text-sm text-gray-500 ml-2">
                    ({order.items.length} items)
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      {item.image && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 no-print">
                          <Image
                            src={item.image}
                            alt={item.itemName}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.itemName}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.colour && (
                            <span className="flex items-center gap-1">
                              Colour:{" "}
                              <span
                                className="inline-block w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.colour }}
                              />
                            </span>
                          )}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <ProductPrice yuanPrice={item.price || 0} />
                        {item.quantity && item.quantity > 1 && (
                          <p className="text-xs text-gray-400 mt-1">
                            Total:{" "}
                            <ProductPrice
                              yuanPrice={(item.price || 0) * item.quantity}
                            />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatFromNGN(order.total)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">
                  *Shipping cost is included in item prices
                </p>
              </div>
            </motion.div>

            {/* Order Timeline — hidden on print */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden no-print"
            >
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Order Timeline
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Order Placed - always visible */}
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 mt-1.5 rounded-full bg-green-500 ring-4 ring-green-100" />
                      {order.order_status !== "delivered" && (
                        <div className="absolute top-6 left-1.5 w-0.5 h-full bg-gray-200" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order Placed</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString(
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
                  </div>

                  {/* Processing - show if processing, shipped, or delivered */}
                  {["processing", "shipped", "delivered"].includes(
                    order.order_status,
                  ) && (
                    <div className="flex gap-3">
                      <div className="relative">
                        <div
                          className={`w-3 h-3 mt-1.5 rounded-full ring-4 ${
                            order.order_status === "processing"
                              ? "bg-blue-500 ring-blue-100 animate-pulse"
                              : "bg-green-500 ring-green-100"
                          }`}
                        />
                        {["shipped", "delivered"].includes(
                          order.order_status,
                        ) && (
                          <div className="absolute top-6 left-1.5 w-0.5 h-full bg-gray-200" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Processing</p>
                        <p className="text-sm text-gray-500">
                          Your order is being prepared
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Shipped - show if shipped or delivered */}
                  {["shipped", "delivered"].includes(order.order_status) && (
                    <div className="flex gap-3">
                      <div className="relative">
                        <div
                          className={`w-3 h-3 mt-1.5 rounded-full ring-4 ${
                            order.order_status === "shipped"
                              ? "bg-purple-500 ring-purple-100 animate-pulse"
                              : "bg-green-500 ring-green-100"
                          }`}
                        />
                        {order.order_status === "delivered" && (
                          <div className="absolute top-6 left-1.5 w-0.5 h-full bg-gray-200" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Shipped</p>
                        <p className="text-sm text-gray-500">
                          Your order is on the way
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Delivered - show only if delivered */}
                  {order.order_status === "delivered" && (
                    <div className="flex gap-3">
                      <div className="w-3 h-3 mt-1.5 rounded-full bg-green-500 ring-4 ring-green-100" />
                      <div>
                        <p className="font-medium text-gray-800">Delivered</p>
                        <p className="text-sm text-gray-500">
                          Your order has been delivered successfully
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Cancelled */}
                  {order.order_status === "cancelled" && (
                    <div className="flex gap-3">
                      <div className="w-3 h-3 mt-1.5 rounded-full bg-red-500 ring-4 ring-red-100" />
                      <div>
                        <p className="font-medium text-gray-800">Cancelled</p>
                        <p className="text-sm text-gray-500">
                          Your order has been cancelled
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Receipt Footer — only visible on print */}
            <div className="hidden print:block mt-8 text-center text-xs text-gray-400 border-t pt-4">
              <p>Thank you for your order!</p>
              <p className="mt-1">
                For support, contact us at support@fourthview.com
              </p>
            </div>
          </div>
          {/* Need Help — hidden on print */}
          <div className="mt-6 text-center no-print">
            <p className="text-sm text-gray-500">
              Need help with your order?{" "}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </button>
            </p>
          </div>

          {canRequestRefund() && (
            <div className="mt-4 text-center no-print">
              <Button
                variant="outline"
                onClick={() => setShowRefundModal(true)}
                className="border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Request a Refund
              </Button>
            </div>
          )}

          <RefundRequestModal
            isOpen={showRefundModal}
            onClose={() => setShowRefundModal(false)}
            orderId={order.id}
            orderTotal={order.total}
            whatsappNumber="2348000000000" // replace with your actual WhatsApp number
          />
        </div>
      </div>
    </>
  );
}
