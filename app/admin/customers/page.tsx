"use client";

import AdminTable from "@/components/Admin/AdminTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { CloudDownload, EllipsisVertical, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";

type Customer = {
  id: number;
  created_at: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  address: string | null;
  isVerified: boolean;
};

const headers = [
  "ID",
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "Country",
  "Verified",
  "",
];

export default function Customers() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.customers,
    queryFn: fetchCustomers,
  });

  const customers: Customer[] = data?.customers ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.id.toString().includes(q),
    );
  }, [search, customers]);

  const handleExport = () => {
    const csv = [
      [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Country",
        "Verified",
        "Joined",
      ],
      ...filtered.map((c) => [
        c.id,
        c.firstName,
        c.lastName,
        c.email,
        `${c.countryCode}${c.phone}`,
        c.country,
        c.isVerified ? "Yes" : "No",
        new Date(c.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col px-4 py-4 space-y-4 border rounded-md">
      <h1 className="text-xl text-slate-500 text-left">Customer List</h1>

      <div className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-row gap-2 items-center border rounded-md py-1 px-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone or ID..."
            className="w-full text-sm text-slate-500 py-4 border-none shadow-none focus-visible:ring-0 placeholder:text-xs placeholder:font-light"
          />
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="flex flex-row gap-2 items-center border rounded-md p-2 cursor-pointer shrink-0"
        >
          <CloudDownload className="w-4 h-4 text-slate-500" />
          <span className="text-slate-500 text-xs hidden sm:inline">
            Export CSV
          </span>
        </Button>
      </div>

      <div className="w-full border rounded-md overflow-x-auto">
        {isLoading ? (
          <p className="text-slate-500 text-sm text-center py-10">Loading...</p>
        ) : isError ? (
          <p className="text-slate-500 text-sm text-center py-10">
            Failed to load customers.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-10">
            No customers found.
          </p>
        ) : (
          <AdminTable headers={headers} caption="A list of customers.">
            {filtered.map((customer) => (
              <TableRow
                key={customer.id}
                className="text-slate-500 text-sm font-light"
              >
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.firstName}</TableCell>
                <TableCell>{customer.lastName}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {customer.email}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {customer.countryCode}
                  {customer.phone}
                </TableCell>
                <TableCell>{customer.country}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${customer.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {customer.isVerified ? "Verified" : "Unverified"}
                  </span>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/customers/${customer.id}`}>
                    <EllipsisVertical className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600 transition-colors" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </AdminTable>
        )}
      </div>
    </div>
  );
}
