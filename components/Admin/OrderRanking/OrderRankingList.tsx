type Props = {
  items: { product: string; total: number }[];
};

export default function OrderRankingList({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-4">No orders yet.</p>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {items.map((item, idx) => (
        <div
          key={item.product}
          className="w-full flex flex-row items-center justify-between gap-4 p-3 rounded-md bg-slate-100"
        >
          <span className="text-xs text-slate-400 font-medium w-5">
            #{idx + 1}
          </span>
          <p className="text-blue-950 text-xs flex-1 truncate">
            {item.product}
          </p>
          <p className="text-green-700 text-sm font-semibold shrink-0">
            {item.total} sold
          </p>
        </div>
      ))}
    </div>
  );
}
