import { createClient } from "./supabase-server";
import { randomUUID } from "crypto";

export type StoreSettings = {
  id: string; // uuid
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
  exchangeBankName: string;
  exchangeBankAccountName: string;
  exchangeBankAccountNumber: string;
  updated_at: string;
};

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("storeSettings")
    .select("*")
    .maybeSingle();

  // Real error (network, RLS, table doesn't exist, etc.)
  if (error) {
    console.error("Database error fetching store settings:", {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return null;
  }

  // Empty table — use fallback defaults
  if (!data) {
    console.warn("Store settings table is empty — returning defaults");
    return getDefaultStoreSettings();
  }

  return data as StoreSettings;
}

// Fallback defaults when table is empty
function getDefaultStoreSettings(): StoreSettings {
  return {
    id: randomUUID(),
    storeName: "My Store",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    websiteUrl: "",
    description: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    twitter: "",
    tiktok: "",
    youtube: "",
    exchangeBankName: "",
    exchangeBankAccountName: "",
    exchangeBankAccountNumber: "",
    updated_at: new Date().toISOString(),
  };
}
