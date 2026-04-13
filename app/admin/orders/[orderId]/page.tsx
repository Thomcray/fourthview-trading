// app/admin/orders/[orderId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId;

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-500">Order not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
            <p className="text-sm text-gray-500 mt-1">
              Reference: {order.reference}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold text-gray-800">
                    Customer Information
                  </h3>
                </div>
                <p className="text-gray-700">{order.customerName}</p>
                <p className="text-sm text-gray-500">{order.customerEmail}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold text-gray-800">
                    Order Information
                  </h3>
                </div>
                <p className="text-gray-700">
                  Date: {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">Status: {order.status}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                Order Items
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Product
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Price
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Array.isArray(order.items) &&
                      order.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.itemName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            ₦{item.price?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-right font-semibold text-gray-800"
                      >
                        Total:
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-600">
                        ₦{order.total?.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
