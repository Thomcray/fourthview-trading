import Link from "next/link";
import Category from "./Category";
import ProductForm from "./ProductForm";
import { Button } from "@/components/ui/button";

export default function AddProduct() {
  return (
    <div className="w-full flex flex-col space-y-4 border-0">
      <ProductForm>
        <Category />
      </ProductForm>

      <Link href="/admin/view-products">
        <Button type="button">View Products</Button>
      </Link>
    </div>
  );
}
