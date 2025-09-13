import React, { Suspense } from "react";
import ItemDescriptionClient from "./ItemDescClient";

export default function ItemDescriptionPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading items...</div>}>
      <ItemDescriptionClient />
    </Suspense>
  );
}
