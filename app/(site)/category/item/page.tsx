import React, { Suspense } from "react";
import ItemClient from "./ItemClient";

export default function ItemPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading items...</div>}>
      <ItemClient />
    </Suspense>
  );
}
