import React from "react";

export default function OrderRanking({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-min max-sm:w-full flex flex-col px-4 py-4 space-y-4 border rounded-md">
      <h1 className="text-base text-slate-500 text-left">Order Ranking</h1>
      <div className="w-full flex flex-col items-center overflow-y-scroll">
        {children}
      </div>
    </div>
  );
}
