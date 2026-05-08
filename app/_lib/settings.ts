import { createClient } from "./supabase-server";

export type StoreSettings = {
  id: number;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  websiteUrl: string;
  description: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  youtube: string;
  updated_at: string;
};

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("storeSettings")
    .select("*")
    .single();

  if (error) {
    console.error("Failed to fetch store settings:", error);
    return null;
  }

  return data as StoreSettings;
}