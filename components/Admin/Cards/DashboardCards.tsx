import {
  BadgeDollarSign,
  SquareMenu,
  TrendingDown,
  TrendingUp,
  UsersRound,
} from "lucide-react";

type Items = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  trend: string;
  trendIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: number;
};
export default function DashboardCards() {
  const items: Items[] = [
    {
      title: "Total Sale",
      icon: BadgeDollarSign,
      color: "text-green-500",
      trend: "positive",
      trendIcon: TrendingUp,
      value: 100,
    },
    {
      title: "Orders",
      icon: SquareMenu,
      color: "text-blue-950",
      trend: "negative",
      trendIcon: TrendingDown,
      value: 5,
    },
    {
      title: "Customers",
      icon: UsersRound,
      color: "text-blue-500",
      trend: "positive",
      trendIcon: TrendingUp,
      value: 20,
    },
  ];

  const totalSale: string = "N536,000,000.00";
  const orders: number = 15;
  const customers: number = 75;
  return (
    <div className="w-full flex lg:flex-row md:flex-col max-sm:flex-col gap-3 max-sm:space-y-3">
      {items.map((item) => (
        <div
          className="flex flex-col w-full gap-4 rounded-md border px-2 py-2"
          key={item.title}
        >
          <div className="flex flex-row justify-between">
            <p className="text-slate-500 text-base">{item.title}</p>

            {item && (
              <item.icon className={`w-8 h-8 ${item.color}`} strokeWidth={1} />
            )}
          </div>

          {item.title === "Total Sale" && (
            <p className="text-2xl">{totalSale}</p>
          )}
          {item.title === "Orders" && <p className="text-2xl">{orders}</p>}
          {item.title === "Customers" && (
            <p className="text-2xl">{customers}</p>
          )}

          <div className="flex flex-row space-x-1 items-center">
            {item.trend === "positive" ? (
              <item.trendIcon className="w-4 h-4 text-green-500" />
            ) : (
              <item.trendIcon className="w-4 h-4 text-red-500" />
            )}

            {item.trend === "positive" ? (
              <p className="text-sm text-green-500">
                {item.value}% from last month
              </p>
            ) : (
              <p className="text-sm text-red-500">
                {item.value}% from last month
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
