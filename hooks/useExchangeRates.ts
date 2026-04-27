import { useQuery } from "@tanstack/react-query";
import { ExchangeRates } from "@/types/database";

async function fetchRates(force = false): Promise<ExchangeRates> {
  const url = force ? "/api/exchange-rate?force" : "/api/exchange-rate";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch rates");
  return res.json();
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ["exchange-rates"],
    queryFn: () => fetchRates(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Background refetch every 10 min
    retry: 3,
  });
}

// For manual refresh button
export function useRefreshRates() {
  const { refetch, isFetching } = useExchangeRates();
  return { refresh: refetch, isRefreshing: isFetching };
}
