import { TrendingDown, TrendingUp } from "lucide-react";

type RankingList = {
  product: string;
  color: string;
  trend: string;
  trendIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: number;
  total: number;
};

export default function OrderRankingList() {
  const items: RankingList[] = [
    {
      product: "Men's Shirts",
      color: "text-green-500",
      trend: "positive",
      trendIcon: TrendingUp,
      value: 20,
      total: 500,
    },
    {
      product: "Men's Watch",
      color: "text-red-500",
      trend: "negative",
      trendIcon: TrendingDown,
      value: 25,
      total: 300,
    },
    {
      product: "Women's Bag",
      color: "text-green-500",
      trend: "positive",
      trendIcon: TrendingUp,
      value: 40,
      total: 280,
    },
    {
      product: "Men's Sweater",
      color: "text-red-500",
      trend: "negative",
      trendIcon: TrendingDown,
      value: 50,
      total: 250,
    },
    {
      product: "JBL Speaker",
      color: "text-green-500",
      trend: "positive",
      trendIcon: TrendingUp,
      value: 45,
      total: 100,
    },
    {
      product: "iPhone 17",
      color: "text-green-500",
      trend: "positive",
      trendIcon: TrendingUp,
      value: 60,
      total: 80,
    },
    {
      product: "Huawei",
      color: "text-red-500",
      trend: "negative",
      trendIcon: TrendingDown,
      value: 40,
      total: 50,
    },
  ];
  return (
    <div className="w-max max-sm:w-full flex flex-col gap-3">
      {items.map((item) => (
        <div
          className="w-full flex flex-row items-center justify-between gap-4 p-4 rounded-md bg-slate-200"
          key={item.product}
        >
          <p className="text-green-700 text-xl">{item.total}</p>

          <p className="text-blue-950 text-xs">{item.product}</p>

          <div className="flex flex-row space-x-1 items-center">
            {item.trend === "positive" ? (
              <item.trendIcon className="w-4 h-4 text-green-500" />
            ) : (
              <item.trendIcon className="w-4 h-4 text-red-500" />
            )}

            {item.trend === "positive" ? (
              <p className="text-xs text-green-500">
                {item.value}% from last month
              </p>
            ) : (
              <p className="text-xs text-red-500">
                {item.value}% from last month
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
