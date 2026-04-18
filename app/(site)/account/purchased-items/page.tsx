// app/account/purchased-items/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingBag,
  ArrowLeft,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  Calendar,
  Hash,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductPrice from "@/components/ProductPrice";
import { useCurrency } from "@/components/CurrencyContext";

type OrderItem = {
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
  shipping_address?: string;
  payment_method?: string;
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusIcons = {
  pending: "⏳",
  processing: "🔄",
  shipped: "📦",
  delivered: "✅",
  paid: "✓",
  cancelled: "❌",
};

export default function PurchasedPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const { formatFromNGN } = useCurrency();
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const toggleOrderExpand = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    const statusKey = status.toLowerCase();
    if (statusKey === "paid" || statusKey === "delivered") {
      return "bg-green-100 text-green-700";
    }
    return (
      statusColors[statusKey as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-700"
    );
  };

  const getStatusIcon = (status: string) => {
    const statusKey = status.toLowerCase();
    if (statusKey === "paid" || statusKey === "delivered") {
      return <CheckCircle className="w-3 h-3" />;
    }
    return statusIcons[statusKey as keyof typeof statusIcons] || "📋";
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <>
        <div className="relative flex flex-row items-center py-2 mb-6">
          <Button
            variant="outline"
            type="button"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>

          <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-0.5 items-center">
            <ShoppingBag size={24} />
            <h1 className="text-2xl font-semibold">My Orders</h1>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // Empty State
  if (orders.length === 0) {
    return (
      <>
        <div className="relative flex flex-row items-center py-2 mb-6">
          <Button
            variant="outline"
            type="button"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>

          <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-0.5 items-center">
            <ShoppingBag size={24} />
            <h1 className="text-2xl font-semibold">My Orders</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="bg-gray-100 rounded-full p-6">
            <PackageCheck size={64} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No orders yet</h2>
          <p className="text-gray-500 text-center max-w-sm">
            Looks like you haven&apos;t placed any orders yet. Start shopping to
            see your orders here.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 mt-4"
          >
            Start Shopping
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="relative flex flex-row items-center py-2 mb-6">
        <Button
          variant="outline"
          type="button"
          className="cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </Button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-2 items-center">
          <ShoppingBag size={24} />
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <span className="bg-blue-100 text-blue-700 text-sm px-2 py-0.5 rounded-full">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Order Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleOrderExpand(order.id)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-500 font-mono">
                      Order #{order.reference.slice(0, 12)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatFromNGN(order.total) ?? ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium capitalize flex items-center gap-1 ${getStatusColor(order.status)}`}
                    >
                      {typeof getStatusIcon(order.status) === "string" ? (
                        <span>{getStatusIcon(order.status)}</span>
                      ) : (
                        getStatusIcon(order.status)
                      )}
                      {order.status}
                    </span>
                    {expandedOrders.has(order.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrders.has(order.id) && (
              <div className="border-t border-gray-100 bg-gray-50">
                {/* Order Items */}
                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Order Items
                  </h3>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg p-3 border border-gray-100"
                    >
                      <div className="flex gap-3">
                        {item.image && (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 border rounded-lg overflow-hidden shrink-0 bg-gray-50">
                            <Image
                              src={item.image}
                              alt={item.itemName}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.itemName}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-1">
                            {item.size && (
                              <p className="text-xs text-gray-500">
                                Size:{" "}
                                <span className="font-medium">{item.size}</span>
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Qty:{" "}
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            </p>
                            {item.colour && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                Colour:{" "}
                                <span
                                  className="inline-block w-3 h-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: item.colour }}
                                />
                              </p>
                            )}
                          </div>
                        </div>
                        {item.price && (
                          <div className="shrink-0 text-right">
                            <ProductPrice yuanPrice={item.price} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary - Shipping included in item cost */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatFromNGN(order.total)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      *Shipping cost is included in item prices
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                    {order.status === "delivered" && (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Write a Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
