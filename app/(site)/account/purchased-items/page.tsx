"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, ArrowLeft, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductPrice from "@/components/ProductPrice";

type OrderItem = {
  itemName: string;
  image?: string;
  price?: number;
  quantity?: number;
  size?: string | null;
  shippingCost?: number;
};

type Order = {
  id: number;
  created_at: string;
  reference: string;
  total: number;
  status: string;
  items: OrderItem[];
};

export default function PurchasedPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <div className="w-full px-4 py-4">
      <div className="relative flex flex-row items-center py-2">
        <Button
          variant="outline"
          type="button"
          className="cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft /> Back
        </Button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-0.5 items-center">
          <ShoppingBag size={24} />
          <h1 className="text-2xl font-semibold">My Orders</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-slate-500 text-sm">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <PackageCheck size={48} className="text-slate-300" />
          <p className="text-slate-500 text-sm">No orders yet</p>
          <Button onClick={() => router.push("/")} className="cursor-pointer">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-md p-4 flex flex-col gap-4"
            >
              {/* Order Header */}
              <div className="flex flex-row justify-between items-center border-b pb-2">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-slate-500">
                    {new Date(order.created_at).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-slate-400">
                    Ref: {order.reference}
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium capitalize">
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="flex flex-col gap-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-row gap-3 items-center">
                    {item.image && (
                      <div className="w-16 h-16 border rounded-md overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.itemName}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.itemName}
                      </p>
                      {item.size && (
                        <p className="text-xs text-slate-500">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    {item.price && <ProductPrice yuanPrice={item.price} />}
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="flex flex-row justify-between items-center border-t pt-2">
                <p className="text-sm font-semibold text-slate-800">Total</p>
                <ProductPrice yuanPrice={order.total} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
