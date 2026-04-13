// components/Admin/AdminTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import React, { useState } from "react";

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

type Props = {
  headers: string[];
  caption?: string;
  children: React.ReactNode;
  sortable?: boolean;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  emptyMessage?: string;
};

export default function AdminTable({
  headers,
  caption,
  children,
  sortable = false,
  onSort,
  emptyMessage = "No data available",
}: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const handleSort = (header: string) => {
    if (!sortable) return;

    const key = header.toLowerCase().replace(/\s+/g, "_");
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });
    if (onSort) {
      onSort(key, direction);
    }
  };

  const getSortIcon = (header: string) => {
    if (!sortable) return null;

    const key = header.toLowerCase().replace(/\s+/g, "_");
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-blue-600" />
    );
  };

  // Check if there are any children (rows)
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <Table className="w-full">
        {caption && (
          <TableCaption className="text-gray-500 text-sm py-3">
            {caption}
          </TableCaption>
        )}

        <TableHeader className="bg-gray-50 border-b border-gray-200">
          <TableRow className="hover:bg-transparent">
            {headers.map((header, idx) => (
              <TableHead
                key={idx}
                onClick={() => handleSort(header)}
                className={`
                  px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider
                  ${sortable ? "cursor-pointer select-none hover:text-gray-900 transition-colors" : ""}
                  ${idx === 0 ? "rounded-tl-lg" : ""}
                  ${idx === headers.length - 1 ? "rounded-tr-lg" : ""}
                `}
              >
                <div className="flex items-center gap-1">
                  {header}
                  {getSortIcon(header)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 px-4">
          {hasChildren ? (
            children
          ) : (
            <TableRow>
              <td
                colSpan={headers.length}
                className="px-4 py-12 text-center text-gray-500"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg
                    className="w-12 h-12 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-sm">{emptyMessage}</p>
                </div>
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
