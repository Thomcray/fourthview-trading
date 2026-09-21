type Props = {
  items: { product: string; total: number }[];
};

export default function OrderRankingList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-slate-400">No orders yet.</p>
      </div>
    );
  }

  const shouldScroll = items.length > 5;

  return (
    <div
      className={`w-full divide-y divide-slate-100 ${
        shouldScroll ? "max-h-[300px] overflow-y-auto pr-2" : ""
      }`}
    >
      {items.map((item, idx) => (
        <div
          key={item.product}
          className="flex items-center gap-3 py-3 first:pt-1 last:pb-1"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <span className="text-xs font-semibold text-slate-500">
              {idx + 1}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-medium text-slate-800"
              title={item.product}
            >
              {item.product}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {item.total === 1 ? "1 item sold" : `${item.total} items sold`}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-slate-700">{item.total}</p>
            <p className="text-[11px] text-slate-400">sold</p>
          </div>
        </div>
      ))}
    </div>
  );
}
