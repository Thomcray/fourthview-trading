// app/admin/customers/page.tsx
"use client";

import AdminTable from "@/components/Admin/AdminTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  CloudDownload,
  EllipsisVertical,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";
import { motion } from "framer-motion";

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
  "Status",
  "",
];

type SortField = "id" | "firstName" | "lastName" | "email" | "created_at";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "verified" | "unverified";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.customers,
    queryFn: fetchCustomers,
  });

  const customers: Customer[] = data?.customers ?? [];

  // Filter customers
  const filtered = useMemo(() => {
    let filtered = [...customers];

    // Search filter
    const q = search.toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.id.toString().includes(q),
      );
    }

    // Status filter
    if (statusFilter === "verified") {
      filtered = filtered.filter((c) => c.isVerified);
    } else if (statusFilter === "unverified") {
      filtered = filtered.filter((c) => !c.isVerified);
    }

    // Sort - properly typed without 'any'
    filtered.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (sortField === "created_at") {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [search, customers, sortField, sortOrder, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedCustomers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

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
        "Joined Date",
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
    a.download = `customers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        <XCircle className="w-3 h-3" />
        Unverified
      </span>
    );
  };

  const stats = {
    total: customers.length,
    verified: customers.filter((c) => c.isVerified).length,
    unverified: customers.filter((c) => !c.isVerified).length,
    newThisMonth: customers.filter((c) => {
      const date = new Date(c.created_at);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setStatusFilter(e.target.value as StatusFilter);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Customers
          </h2>
          <p className="text-gray-500 mb-4">
            There was an error loading the customer data.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Customer Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage and view all registered customers
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-1">All registered users</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Verified Accounts</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.verified}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {((stats.verified / stats.total) * 100).toFixed(1)}% of total
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Unverified Accounts</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.unverified}
            </p>
            <p className="text-xs text-gray-400 mt-1">Need verification</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">New This Month</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.newThisMonth}
            </p>
            <p className="text-xs text-gray-400 mt-1">Joined in last 30 days</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, email, phone or ID..."
                className="pl-9 py-2 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>

              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>

              <Button
                variant="outline"
                onClick={handleExport}
                className="gap-2"
              >
                <CloudDownload className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {paginatedCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No customers found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <AdminTable
                  headers={headers}
                  caption="A list of customers"
                  sortable={true}
                  onSort={(column, direction) => {
                    handleSort(column as SortField);
                  }}
                  emptyMessage="No customers found"
                >
                  {paginatedCustomers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-800">
                        {customer.id}
                      </TableCell>
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
                        {getStatusBadge(customer.isVerified)}
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/customers/${customer.id}`}>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <EllipsisVertical className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                          </button>
                        </Link>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AdminTable>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filtered.length)} of{" "}
                    {filtered.length} customers
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className={
                                currentPage === pageNum ? "bg-blue-600" : ""
                              }
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
