import { Resend } from "resend";
import { BookingRequestEmail } from "./emails/booking-email";
import { RefundRequestEmail } from "./emails/refund-request";
import { OrderStatusEmail } from "./emails/order-status-email";
import { NewOrderEmail } from "./emails/new-order-email";
import { AdminStudyApplicationEmail } from "./emails/admin-study-application";
import { AdminSpecialOrderEmail } from "./emails/admin-special-order-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderStatusEmail({
  to,
  orderReference,
  status,
  customerName,
  total,
}: {
  to: string;
  orderReference: string;
  status: string;
  customerName: string;
  total: number;
}) {
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  await resend.emails.send({
    from: "Fourthview <orders@fourthview.online>",
    to,
    subject: `Order ${orderReference} - ${formattedStatus}`,
    react: OrderStatusEmail({
      orderReference,
      status,
      customerName,
      total,
      baseUrl,
    }),
  });
}

export async function sendApiKeyRotationEmail({
  to,
  newKey,
  maskedKey,
  adminName,
}: {
  to: string;
  newKey: string;
  maskedKey: string;
  adminName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Fourthview Security <security@fourthview.com>",
    to,
    subject: "API Key Rotated - Action Required",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">API Key Rotated</h2>
        <p>Hello ${adminName},</p>
        <p>Your Stripe API key has been successfully rotated for security purposes.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">New API Key Details</h3>
          <p><strong>Masked Key:</strong> ${maskedKey}</p>
          <p style="color: #dc2626; font-weight: bold;">⚠️ Important: Store this key securely. It will not be shown again.</p>
        </div>

        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #92400e; margin-top: 0;">Next Steps:</h4>
          <ol style="color: #92400e; padding-left: 20px;">
            <li>Copy the new API key below</li>
            <li>Update your environment variables</li>
            <li>Restart your application</li>
            <li>Delete this email for security</li>
          </ol>
        </div>

        <div style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all;">
          ${newKey}
        </div>

        <p style="margin-top: 20px;">If you did not initiate this rotation, please contact support immediately.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated security message from Fourthview Trading Company.<br>
          © ${new Date().getFullYear()} Fourthview. All rights reserved.
        </p>
      </div>
    `,
  });
}

export async function sendRefundRequestEmail({
  to,
  orderId,
  orderReference,
  customerName,
  customerEmail,
  amount,
  reason,
  evidenceCount,
}: {
  to: string;
  orderId: number;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  reason: string;
  evidenceCount: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  await resend.emails.send({
    from: "Fourthview <orders@fourthview.online>",
    to,
    subject: `New Refund Request - Order ${orderReference}`,
    react: RefundRequestEmail({
      orderId,
      orderReference,
      customerName,
      customerEmail,
      amount,
      reason,
      evidenceCount,
      baseUrl,
    }),
  });
}

export async function sendBookingRequestEmail({
  to,
  bookingId,
  firstName,
  lastName,
  email,
  phone,
  purpose,
  factoryName,
  factoryAddress,
  visitDate,
  baseUrl,
}: {
  to: string;
  bookingId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  purpose: string;
  factoryName: string | null;
  factoryAddress: string | null;
  visitDate: string | null;
  baseUrl: string;
}) {
  await resend.emails.send({
    from: "Fourthview <orders@fourthview.online>",
    to,
    subject: `New Booking Request - ${firstName} ${lastName}`,
    react: BookingRequestEmail({
      bookingId,
      firstName,
      lastName,
      email,
      phone,
      purpose,
      factoryName,
      factoryAddress,
      visitDate,
      baseUrl,
    }),
  });
}

export async function sendNewOrderEmail({
  to,
  orderId,
  orderReference,
  total,
  items,
  shippingAddress,
  baseUrl,
}: {
  to: string;
  orderId: number;
  orderReference: string;
  total: number;
  items: {
    itemName: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    streetAddress?: string;
    apartment?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  } | null;
  baseUrl: string;
}) {
  await resend.emails.send({
    from: "Fourthview Orders <orders@fourthview.online>",
    to,
    subject: `New Order #${orderReference} — ₦${total.toLocaleString()}`,
    react: NewOrderEmail({
      orderId,
      orderReference,
      total,
      items,
      shippingAddress,
      baseUrl,
    }),
  });
}

export async function sendAdminStudyApplicationEmail({
  to,
  applicationId,
  fullName,
  email,
  whatsappNumber,
  country,
  age,
  preferredUniversity,
  preferredProgram,
  message,
  baseUrl,
}: {
  to: string;
  applicationId: number;
  fullName: string;
  email: string;
  whatsappNumber: string;
  country: string;
  age: number;
  preferredUniversity: string;
  preferredProgram: string;
  message: string | null;
  baseUrl: string;
}) {
  await resend.emails.send({
    from: "Fourthview <study@fourthview.online>",
    to,
    subject: `New Study Application - ${fullName}`,
    react: AdminStudyApplicationEmail({
      applicationId,
      fullName,
      email,
      whatsappNumber,
      country,
      age,
      preferredUniversity,
      preferredProgram,
      message,
      baseUrl,
    }),
  });
}

export async function adminSendSpecialOrderEmail({
  to,
  specialOrderId,
  email,
  whatsapp,
  description,
  depositAmount,
  depositReference,
  imageCount,
  baseUrl,
}: {
  to: string;
  specialOrderId: number;
  email: string;
  whatsapp: string;
  description: string;
  depositAmount: number;
  depositReference: string;
  imageCount: number;
  baseUrl: string;
}) {
  await resend.emails.send({
    from: "Fourthview <orders@fourthview.online>",
    to,
    subject: `New Special Order #${specialOrderId}`,
    react: AdminSpecialOrderEmail({
      specialOrderId,
      email,
      whatsapp,
      description,
      depositAmount,
      depositReference,
      imageCount,
      baseUrl,
    }),
  });
}
