import {
  BadgeDollarSign,
  SquareMenu,
  TrendingDown,
  TrendingUp,
  UsersRound,
} from "lucide-react";

type Props = {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  salesTrend: number | null;
  ordersTrend: number | null;
  customersTrend: number | null;
};

function TrendBadge({ trend }: { trend: number | null }) {
  if (trend === null || isNaN(trend) || !isFinite(trend)) {
    return <p className="text-sm text-slate-400">No previous data</p>;
  }
  const positive = trend >= 0;
  return (
    <div className="flex flex-row space-x-1 items-center">
      {positive ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
      <p className={`text-sm ${positive ? "text-green-500" : "text-red-500"}`}>
        {Math.abs(trend)}% from last month
      </p>
    </div>
  );
}

export default function DashboardCards({
  totalSales,
  totalOrders,
  totalCustomers,
  salesTrend,
  ordersTrend,
  customersTrend,
}: Props) {
  const items = [
    {
      title: "Total Sales",
      icon: BadgeDollarSign,
      color: "text-green-500",
      value: `₦${totalSales.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
      trend: salesTrend,
    },
    {
      title: "Orders",
      icon: SquareMenu,
      color: "text-blue-950",
      value: totalOrders,
      trend: ordersTrend,
    },
    {
      title: "Customers",
      icon: UsersRound,
      color: "text-blue-500",
      value: totalCustomers,
      trend: customersTrend,
    },
  ];

  return (
    <div className="w-full flex lg:flex-row md:flex-col max-sm:flex-col gap-3">
      {items.map((item) => (
        <div
          className="flex flex-col w-full gap-4 rounded-md border px-4 py-4"
          key={item.title}
        >
          <div className="flex flex-row justify-between">
            <p className="text-slate-500 text-base">{item.title}</p>
            <item.icon className={`w-8 h-8 ${item.color}`} strokeWidth={1} />
          </div>
          <p className="text-2xl font-semibold">{item.value}</p>
          <TrendBadge trend={item.trend} />
        </div>
      ))}
    </div>
  );
}
