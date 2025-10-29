import OrderRanking from "@/components/Admin/OrderRanking/OrderRanking";
import OrderRankingList from "@/components/Admin/OrderRanking/OrderRankingList";
import DashboardCards from "@/components/Admin/Cards/DashboardCards";
import FilterSearch from "@/components/FilterSearch";
import { TransactionChart } from "@/components/TransactionChart";

export default function page() {
  return (
    <div className="w-full space-y-10 border-0">
      <FilterSearch />

      <DashboardCards />

      <div className="w-full h-96 flex flex-row max-sm:flex-col gap-3">
        <div className="max-w-[640px] w-full max-sm:w-full px-4 py-4 border rounded-md">
          <h1 className="text-base text-slate-500 text-left">
            Monthly Transaction Trend
          </h1>

          <TransactionChart />
        </div>
        <OrderRanking>
          <OrderRankingList />
        </OrderRanking>
      </div>
    </div>
  );
}
