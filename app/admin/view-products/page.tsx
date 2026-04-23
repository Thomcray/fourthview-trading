"use client";

import { useState, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AdminTable from "@/components/Admin/AdminTable";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  RefreshCw,
  Package,
  Plus,
  Edit,
  Loader2,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

type Product = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName?: string;
  price: number;
  discount?: number;
  stock?: number;
  imageUrl?: string[];
};

export default function ViewProducts() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmProduct, setConfirmProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", search],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (pageParam) params.append("cursor", pageParam as string);
      params.append("limit", "20");

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: null,
  });

  const allProducts = data?.pages.flatMap((page) => page.products) || [];
  const totalProducts = data?.pages[0]?.total || 0;

  const handleSearch = () => setSearch(searchInput);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDelete = async (product: Product) => {
    setDeletingId(product.id);
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });

      if (!res.ok) throw new Error("Failed to delete product");

      // Remove from cache optimistically
      queryClient.setQueryData(
        ["products", search],
        (
          old: { pages: { products: Product[]; total: number }[] } | undefined,
        ) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              products: page.products.filter(
                (p: Product) => p.id !== product.id,
              ),
              total: page.total - 1,
            })),
          };
        },
      );

      toast.success(`"${product.name}" deleted successfully`);
      setConfirmProduct(null);
    } catch {
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const headers = [
    "ID",
    "Product Name",
    "Description",
    "Category",
    "Price",
    "Stock",
    "Actions",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-96 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Products
          </h2>
          <p className="text-gray-500 mb-6">
            There was an error loading the products.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  All Products
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage and view all products in your store
                  {totalProducts > 0 && (
                    <span className="ml-2 text-blue-600">
                      ({totalProducts} total)
                    </span>
                  )}
                </p>
              </div>
              <Link href="/admin/product-services">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Search by name, category, ID..."
                  className="pl-9 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  className="gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {allProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No products found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or add a new product
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <AdminTable
                    headers={headers}
                    caption="A list of all products."
                  >
                    {allProducts.map((product: Product, index: number) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.02, 0.5) }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-mono text-sm text-gray-500">
                          #{product.id}
                        </TableCell>
                        <TableCell className="font-medium text-gray-800">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {product.description?.length > 50
                            ? `${product.description.substring(0, 50)}...`
                            : product.description || "—"}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {product.categoryName ||
                              `Category ${product.categoryId}`}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          ¥{product.price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {product.stock !== undefined ? product.stock : "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/view-products/${product.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-blue-600 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmProduct(product)}
                              disabled={deletingId === product.id}
                              className="text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              {deletingId === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AdminTable>
                </div>

                {hasNextPage && (
                  <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      variant="outline"
                      className="gap-2 min-w-[150px]"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}

                {!hasNextPage && allProducts.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400">
                      End of results — {allProducts.length} products loaded
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setConfirmProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Delete Product
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmProduct(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                  &ldquo;{confirmProduct.name}&rdquo;
                </span>
                ? This will permanently remove the product and all its images
                from storage.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  onClick={() => setConfirmProduct(null)}
                  disabled={deletingId !== null}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  onClick={() => handleDelete(confirmProduct)}
                  disabled={deletingId !== null}
                >
                  {deletingId !== null ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Product
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
