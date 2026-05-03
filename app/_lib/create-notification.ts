import { createClient } from "./supabase-server";

type NotificationType = "order" | "booking" | "refund" | "study_application";

export async function createNotification({
  title,
  message,
  type,
  referenceId,
}: {
  title: string;
  message?: string;
  type: NotificationType;
  referenceId?: string;
}) {
  const supabase = await createClient(true);

  const { error } = await supabase.from("notifications").insert({
    title,
    message,
    type,
    reference_id: referenceId,
    is_read: false,
  });

  if (error) {
    console.error("Failed to create notification:", error);
  }
}
