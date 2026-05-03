"use client";

import AdminTable from "@/components/Admin/AdminTable";
import { TableCell } from "@/components/ui/table";
import {
  ArrowLeft,
  CreditCard,
  ListOrdered,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle,
  XCircle,
  Calendar,
  Package,
  TrendingUp,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomer } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";
import { motion } from "framer-motion";

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  country: string;
  address: string | null;
  isVerified: boolean;
  created_at: string;
};

type Order = {
  id: number;
  created_at: string;
  reference: string;
  total: number;
  status: string;
};

type CustomerData = {
  customer: Customer;
  orders: Order[];
};

const orderHeaders = ["Reference", "Total", "Date", "Status"];

export default function CustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = use(params);
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useQuery<CustomerData>({
    queryKey: queryKeys.customer(customerId),
    queryFn: () => fetchCustomer(customerId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white rounded-xl p-6 h-96"></div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 h-32"></div>
                <div className="bg-white rounded-xl p-6 h-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.customer) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Customer Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The customer you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            onClick={() => router.push("/admin/customers")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  const { customer, orders } = data;
  const totalSpent = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const memberSince = new Date(customer.created_at).toLocaleDateString(
    "en-NG",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const infoRows = [
    { label: "First Name", value: customer.firstName, icon: User },
    { label: "Last Name", value: customer.lastName, icon: User },
    { label: "Email", value: customer.email, icon: Mail },
    {
      label: "Phone",
      value: `${customer.countryCode}${customer.phone}`,
      icon: Phone,
    },
    { label: "Country", value: customer.country, icon: Globe },
    { label: "Address", value: customer.address || "—", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </Button>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Customer Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-1/3"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              {/* Header with Avatar */}
              <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-8 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <p className="text-3xl font-bold text-blue-700">
                    {customer.firstName.charAt(0)}
                    {customer.lastName.charAt(0)}
                  </p>
                </div>
                <h2 className="text-xl font-bold text-white mt-4">
                  {customer.firstName} {customer.lastName}
                </h2>
                <div className="flex justify-center mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${customer.isVerified ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}
                  >
                    {customer.isVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3" /> Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" /> Unverified
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    {infoRows.map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-gray-700 font-medium">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Member Since</p>
                      <p className="text-gray-700 font-medium">{memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats and Orders */}
          <div className="flex-1 space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  ₦
                  {totalSpent.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <ListOrdered className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {orders.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {orders.filter((o) => o.status === "delivered").length}{" "}
                  delivered
                </p>
              </div>
            </motion.div>

            {/* Orders Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-blue-600" />
                  Order History
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                  by {customer.firstName}
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    This customer hasn&apos;t placed any orders
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile: Card layout */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-gray-600">
                            {order.reference.slice(0, 12)}...
                          </span>
                          <span
                            className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                  ${order.status === "delivered" ? "bg-green-100 text-green-700" : ""}
                  ${order.status === "processing" ? "bg-blue-100 text-blue-700" : ""}
                  ${order.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                  ${order.status === "cancelled" ? "bg-red-100 text-red-700" : ""}
                  capitalize
                `}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-gray-800">
                              ₦
                              {Number(order.total).toLocaleString("en-NG", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(order.created_at).toLocaleDateString(
                                "en-NG",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop: Table layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <AdminTable
                      headers={orderHeaders}
                      caption={`Orders by ${customer.firstName} ${customer.lastName}`}
                      sortable={true}
                    >
                      {orders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-mono text-sm text-gray-600">
                            {order.reference.slice(0, 12)}...
                          </TableCell>
                          <TableCell className="font-semibold text-gray-800">
                            ₦
                            {Number(order.total).toLocaleString("en-NG", {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-gray-500 whitespace-nowrap">
                            {new Date(order.created_at).toLocaleDateString(
                              "en-NG",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${order.status === "delivered" ? "bg-green-100 text-green-700" : ""}
                    ${order.status === "processing" ? "bg-blue-100 text-blue-700" : ""}
                    ${order.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                    ${order.status === "cancelled" ? "bg-red-100 text-red-700" : ""}
                    capitalize
                  `}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AdminTable>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
