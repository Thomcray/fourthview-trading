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
  if (trend === null || !Number.isFinite(trend)) {
    return <p className="text-xs text-slate-400">No previous data</p>;
  }

  const positive = trend >= 0;

  return (
    <div
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 ${
        positive ? "bg-green-50" : "bg-red-50"
      }`}
    >
      {positive ? (
        <TrendingUp className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <TrendingDown className="h-3.5 w-3.5 text-red-600" />
      )}

      <span
        className={`text-xs font-medium ${
          positive ? "text-green-600" : "text-red-600"
        }`}
      >
        {Math.abs(trend)}% from last month
      </span>
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
      iconColor: "text-green-500",
      iconBackground: "bg-green-50",
      value: `₦${totalSales.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      trend: salesTrend,
    },
    {
      title: "Orders",
      icon: SquareMenu,
      iconColor: "text-blue-950",
      iconBackground: "bg-blue-50",
      value: totalOrders.toLocaleString("en-NG"),
      trend: ordersTrend,
    },
    {
      title: "Customers",
      icon: UsersRound,
      iconColor: "text-blue-500",
      iconBackground: "bg-blue-50",
      value: totalCustomers.toLocaleString("en-NG"),
      trend: customersTrend,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="flex min-h-[175px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{item.title}</p>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.iconBackground}`}
              >
                <Icon
                  className={`h-5 w-5 ${item.iconColor}`}
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="truncate text-2xl font-bold tracking-tight text-slate-900">
                {item.value}
              </p>

              <div className="mt-3">
                <TrendBadge trend={item.trend} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
