import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExchangeSettings } from "@/types/database";

async function fetchSettings(): Promise<ExchangeSettings> {
  const res = await fetch("/api/exchange-settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

async function updateSettings(
  settings: Partial<ExchangeSettings> & { reason?: string },
) {
  const res = await fetch("/api/exchange-settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update");
  }
  return res.json();
}

export function useExchangeSettings() {
  return useQuery({
    queryKey: ["exchange-settings"],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateExchangeSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchange-settings"] });
    },
  });
}
