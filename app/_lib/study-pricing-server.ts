import { createClient } from "@/app/_lib/supabase-server";
import type { StudyPricing } from "./study-pricing";

export async function getStudyPricing(): Promise<StudyPricing> {
  const supabase = await createClient(true);

  const { data, error } = await supabase
    .from("study_pricing")
    .select("application_fee, scholarship_balance, self_sponsor_balance")
    .eq("id", 1)
    .single();

  if (error || !data) {
    console.error("getStudyPricing error:", error);
    throw new Error("Study pricing is not configured");
  }

  return {
    applicationFee: data.application_fee,
    scholarshipBalance: data.scholarship_balance,
    selfSponsorBalance: data.self_sponsor_balance,
  };
}
