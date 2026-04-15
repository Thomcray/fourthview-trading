import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define proper types
type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
  };
};

export async function sendOrderStatusEmail({
  to,
  orderReference,
  status,
  customerName,
  items,
  total,
}: {
  to: string;
  orderReference: string;
  status: string;
  customerName: string;
  items: OrderItem[];
  total: number;
}) {
  const statusMessages: Record<string, string> = {
    pending: "Your order has been received and is pending confirmation.",
    processing: "Your order is now being processed and prepared for shipment.",
    shipped: "Great news! Your order has been shipped and is on its way.",
    delivered: "Your order has been delivered. Enjoy your purchase!",
    cancelled:
      "Your order has been cancelled. Contact us if you have questions.",
  };

  const subject = `Order ${orderReference} - ${status.charAt(0).toUpperCase() + status.slice(1)}`;

  await resend.emails.send({
    from: "Fourthview <orders@fourthview.com>",
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Order Update</h2>
        <p>Hello ${customerName},</p>
        <p>${statusMessages[status]}</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Reference:</strong> ${orderReference}</p>
          <p><strong>Status:</strong> ${status.toUpperCase()}</p>
          <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
          <p><strong>Items:</strong> ${items.length}</p>
        </div>

        <p>You can view your order details by logging into your account.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated message from Fourthview Trading Company.
        </p>
      </div>
    `,
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
