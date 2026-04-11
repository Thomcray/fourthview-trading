"use client";

import AdminTable from "@/components/Admin/AdminTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft, CreditCard, ListOrdered } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomer } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";

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

  const { data, isLoading, isError } = useQuery<CustomerData>({
    queryKey: queryKeys.customer(customerId),
    queryFn: () => fetchCustomer(customerId),
  });

  if (isLoading)
    return (
      <p className="text-slate-500 text-sm text-center py-10">Loading...</p>
    );

  if (isError || !data?.customer)
    return (
      <p className="text-slate-500 text-sm text-center py-10">
        Customer not found.
      </p>
    );

  const { customer, orders } = data;
  const totalSpent = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  return (
    <div className="w-full flex flex-col px-4 py-4 max-sm:px-1 space-y-4">
      <Button
        variant="outline"
        className="w-fit cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <div className="w-full flex lg:flex-row max-sm:flex-col md:flex-col gap-4">
        {/* Profile card */}
        <div className="lg:w-1/3 border flex flex-col rounded-md px-4 py-4 gap-4">
          <div className="flex border rounded-full w-20 h-20 items-center justify-center bg-blue-50">
            <p className="text-2xl font-semibold text-blue-900">
              {customer.firstName.charAt(0)}
              {customer.lastName.charAt(0)}
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            {[
              { label: "First Name", value: customer.firstName },
              { label: "Last Name", value: customer.lastName },
              { label: "Email", value: customer.email },
              {
                label: "Phone",
                value: `${customer.countryCode}${customer.phone}`,
              },
              { label: "Country", value: customer.country },
              { label: "Address", value: customer.address || "—" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-row justify-between text-slate-500 text-sm border-b pb-2"
              >
                <label className="font-medium">{label}</label>
                <p className="font-light">{value}</p>
              </div>
            ))}

            <div className="flex flex-row justify-between text-slate-500 text-sm">
              <label className="font-medium">Verified</label>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${customer.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {customer.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-row gap-4 flex-wrap">
            <div className="flex-1 min-w-48 border rounded-md px-4 py-4 flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <p className="text-sm text-slate-500">Total Spent</p>
                <CreditCard className="w-6 h-6" strokeWidth={1} color="green" />
              </div>
              <p className="text-2xl font-semibold">
                ₦
                {totalSpent.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="flex-1 min-w-48 border rounded-md px-4 py-4 flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <p className="text-sm text-slate-500">Total Orders</p>
                <ListOrdered
                  className="w-6 h-6 text-blue-950"
                  strokeWidth={1}
                />
              </div>
              <p className="text-2xl font-semibold">{orders.length}</p>
            </div>
          </div>

          {/* Orders table */}
          <div className="border rounded-md overflow-x-auto">
            {orders.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-10">
                No orders yet.
              </p>
            ) : (
              <AdminTable
                headers={orderHeaders}
                caption={`Orders by ${customer.firstName} ${customer.lastName}`}
              >
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="text-slate-500 text-sm font-light"
                  >
                    <TableCell className="font-medium whitespace-nowrap">
                      {order.reference}
                    </TableCell>
                    <TableCell>
                      ₦
                      {Number(order.total).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </AdminTable>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
