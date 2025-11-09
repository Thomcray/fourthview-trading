import UpdateProduct from "@/components/Admin/AddProduct/UpdateProduct";
import React from "react";

export default function ProductView({
  params,
}: {
  params: { productId: string };
}) {
  return (
    <div className="w-full flex flex-col gap-3">
      <UpdateProduct params={params} />
    </div>
  );
}
