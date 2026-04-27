import { Resend } from "resend";
import {
  ApplicationConfirmationEmail,
  ApplicationStatusUpdateEmail,
} from "./emails/study-application";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "noreply@yourdomain.com"; // replace later
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000" ||
  "http://localhost:3001";

export async function sendApplicationConfirmation({
  fullName,
  email,
  applicationId,
}: {
  fullName: string;
  email: string;
  applicationId: number;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Your Study in China Application Has Been Received",
    react: ApplicationConfirmationEmail({
      fullName,
      applicationId,
      baseUrl: BASE_URL,
    }),
  });
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
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Application Update: ${status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    react: ApplicationStatusUpdateEmail({
      fullName,
      applicationId,
      status,
      adminNote,
      baseUrl: BASE_URL,
    }),
  });
}
