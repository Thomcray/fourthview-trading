"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { StoreSettings } from "@/app/_lib/settings";

const SettingsContext = createContext<StoreSettings | null>(null);

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: StoreSettings | null;
}) {
  // Hydrate from server data, refetch in background if needed
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
    initialData: initialSettings ? { settings: initialSettings } : undefined,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <SettingsContext.Provider value={data?.settings ?? initialSettings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
