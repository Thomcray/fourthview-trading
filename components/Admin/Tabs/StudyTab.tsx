"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import AdminTable from "@/components/Admin/AdminTable";
import {
  Search,
  Eye,
  Download,
  RefreshCw,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

type StudyApplication = {
  id: number;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  preferred_university: string;
  preferred_program: string;
  message: string;
  status:
    | "pending"
    | "reviewing"
    | "documents_received"
    | "approved"
    | "rejected";
  documents: Record<string, string>;
  created_at: string;
};

const headers = [
  "ID",
  "Name",
  "Contact",
  "Preferred Program",
  "Status",
  "Documents",
  "Date",
  "Actions",
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  reviewing: { label: "Reviewing", color: "bg-blue-100 text-blue-700" },
  documents_received: {
    label: "Docs Received",
    color: "bg-purple-100 text-purple-700",
  },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
};

export default function StudyTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["studyApplications"],
    queryFn: async () => {
      const res = await fetch("/api/study-applications");
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
  });

  const applications: StudyApplication[] = data?.applications ?? [];

  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    const q = search.toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.whatsapp_number.includes(q) ||
          a.preferred_program?.toLowerCase().includes(q) ||
          a.id.toString().includes(q),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    return filtered;
  }, [search, statusFilter, applications]);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    approved: applications.filter((a) => a.status === "approved").length,
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleExport = () => {
    const csv = [
      [
        "ID",
        "Name",
        "Email",
        "WhatsApp",
        "Country",
        "University",
        "Program",
        "Status",
        "Date",
      ],
      ...filteredApplications.map((a) => [
        a.id,
        a.full_name,
        a.email,
        a.whatsapp_number,
        a.country,
        a.preferred_university,
        a.preferred_program,
        a.status,
        new Date(a.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study_applications_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started!");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Failed to load study applications</p>
        <Button
          onClick={() => refetch()}
          className="mt-4 bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Reviewing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.reviewing}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, program..."
              className="pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="documents_received">Documents Received</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No study applications found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: Card layout */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-4 hover:bg-gray-50 transition-colors space-y-3"
                >
                  {/* Top row: ID + Status */}
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-gray-400">#{app.id}</p>
                    {getStatusBadge(app.status)}
                  </div>

                  {/* Name + Email */}
                  <div>
                    <p className="font-medium text-gray-800">{app.full_name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">{app.email}</p>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">
                        {app.whatsapp_number}
                      </span>
                    </div>
                    {app.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400">{app.country}</span>
                      </div>
                    )}
                  </div>

                  {/* Program + University */}
                  <div>
                    <p className="font-medium text-gray-800">
                      {app.preferred_program}
                    </p>
                    <p className="text-xs text-gray-400">
                      {app.preferred_university || "—"}
                    </p>
                  </div>

                  {/* Documents + Date row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {app.documents ? Object.keys(app.documents).length : 0}{" "}
                        files
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-100">
                    <Link href={`/admin/study-applications/${app.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer text-xs"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden md:block overflow-x-auto">
              <AdminTable
                headers={headers}
                caption="A list of study in China applications."
              >
                {filteredApplications.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-mono text-sm text-gray-500">
                      #{app.id}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-800">
                        {app.full_name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">{app.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {app.whatsapp_number}
                        </span>
                      </div>
                      {app.country && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {app.country}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-800">
                        {app.preferred_program}
                      </p>
                      <p className="text-xs text-gray-400">
                        {app.preferred_university || "—"}
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {app.documents
                            ? Object.keys(app.documents).length
                            : 0}{" "}
                          files
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/study-applications/${app.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-blue-600 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </motion.tr>
                ))}
              </AdminTable>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
