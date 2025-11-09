import { getAllProducts } from "@/app/_lib/data-services";
import AdminTable from "@/components/Admin/AdminTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import React from "react";

type AllProducts = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  price: number;
};
export default async function ViewProducts() {
  const headers = [
    "ProductId",
    "Product Name",
    "Description",
    "Category",
    "Price",
    "",
  ];

  const allProducts: AllProducts[] | null = await getAllProducts();
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl text-black text-left">All Products</h1>

      <div className="w-full border rounded-md overflow-hidden">
        <AdminTable headers={headers} caption="A list of all products.">
          {!allProducts ? (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center">
                No item added yet!
              </TableCell>
            </TableRow>
          ) : (
            allProducts.map((product) => (
              <TableRow
                className="text-slate-500 text-sm font-light"
                key={product.id}
              >
                <TableCell className="font-medium border-0">
                  {product.id}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.description.length > 30
                    ? product.description
                        .split("")
                        .slice(0, 30)
                        .join("")
                        .concat("...")
                    : product.description}
                </TableCell>
                <TableCell>{product.categoryId}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell className="">
                  <Link href={`/admin/view-products/${product.id}`}>
                    <Button
                      variant="outline"
                      className="w-max text-slate-500 cursor-pointer"
                    >
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </AdminTable>
      </div>
    </div>
  );
}
