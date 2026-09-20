import { Resend } from "resend";
import {
  ApplicationConfirmationEmail,
  ApplicationStatusUpdateEmail,
} from "./emails/study-application";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Fourthview <noreply@fourthview.online>";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function sendApplicationConfirmation({
  fullName,
  email,
  applicationId,
}: {
  fullName: string;
  email: string;
  applicationId: number;
}) {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Your Study in China Application Has Been Received",
    react: ApplicationConfirmationEmail({
      fullName,
      applicationId,
      baseUrl: BASE_URL,
    }),
  });

  if (error) {
    console.error("Failed to send application confirmation email:", error);
    throw new Error("Failed to send application confirmation email");
  }
}

export async function sendStatusUpdateEmail({
  fullName,
  email,
  applicationId,
  status,
  adminNote,
}: {
  fullName: string;
  email: string;
  applicationId: number;
  status: string;
  adminNote?: string;
}) {
  const formattedStatus = status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Application Update: ${formattedStatus}`,
    react: ApplicationStatusUpdateEmail({
      fullName,
      applicationId,
      status,
      adminNote,
      baseUrl: BASE_URL,
    }),
  });

  if (error) {
    console.error("Failed to send application status email:", error);
    throw new Error("Failed to send application status email");
  }
}
