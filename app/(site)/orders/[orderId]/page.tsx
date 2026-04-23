"use client";

import { useEffect, useState } from "react";
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
import { motion } from "framer-motion";

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
  items: OrderItem[];
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  payment_method?: string;
  payment_id?: string;
  tracking_number?: string;
  estimated_delivery?: string;
};

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
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
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.orderId as string;

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) fetchOrder();
  }, [orderId]);

  const getStatusBadge = () => {
    if (!order) return null;
    const config = statusConfig[order.status] || statusConfig.pending;
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
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
              className="bg-blue-600 hover:bg-blue-700"
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
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
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-white">
                      Order Details
                    </h1>
                    <p className="text-blue-200 text-sm mt-0.5">
                      Order #{order.reference.slice(0, 12)}...
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

            {/* Shipping Address */}
            {order.shipping_address && (
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
                    {order.shipping_address.street}
                    {order.shipping_address.city && (
                      <>, {order.shipping_address.city}</>
                    )}
                    {order.shipping_address.state && (
                      <>, {order.shipping_address.state}</>
                    )}
                    {order.shipping_address.zipCode && (
                      <>, {order.shipping_address.zipCode}</>
                    )}
                    {order.shipping_address.country && (
                      <>, {order.shipping_address.country}</>
                    )}
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
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 mt-1.5 rounded-full bg-green-500 ring-4 ring-green-100" />
                      {order.status !== "delivered" && (
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

                  {order.status === "processing" && (
                    <div className="flex gap-3">
                      <div className="w-3 h-3 mt-1.5 rounded-full bg-blue-500 ring-4 ring-blue-100 animate-pulse" />
                      <div>
                        <p className="font-medium text-gray-800">Processing</p>
                        <p className="text-sm text-gray-500">
                          Your order is being prepared
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === "shipped" && (
                    <>
                      <div className="flex gap-3">
                        <div className="relative">
                          <div className="w-3 h-3 mt-1.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                          <div className="absolute top-6 left-1.5 w-0.5 h-full bg-gray-200" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Shipped</p>
                          <p className="text-sm text-gray-500">
                            Your order is on the way
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-3 h-3 mt-1.5 rounded-full bg-gray-300" />
                        <div>
                          <p className="font-medium text-gray-400">
                            Out for Delivery
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {order.status === "delivered" && (
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
        </div>
      </div>
    </>
  );
}
