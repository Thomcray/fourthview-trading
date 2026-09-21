import React from "react";

export default function OrderRanking({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-hidden">{children}</div>
    </div>
  );
}
