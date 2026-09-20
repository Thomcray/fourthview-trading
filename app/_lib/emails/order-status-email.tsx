import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components";

export function OrderStatusEmail({
  orderReference,
  status,
  customerName,
  total,
  baseUrl,
}: {
  orderReference: string;
  status: string;
  customerName: string;
  total: number;
  baseUrl: string;
}) {
  const statusMessages: Record<string, string> = {
    pending: "Your order has been received and is pending confirmation.",
    processing: "Your order is now being processed and prepared for shipment.",
    shipped: "Great news! Your order has been shipped and is on its way.",
    delivered: "Your order has been delivered. Enjoy your purchase!",
    cancelled:
      "Your order has been cancelled. Contact us if you have questions.",
  };

  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  const accountUrl = `${baseUrl}/account/purchased-items`;

  return (
    <Html>
      <Head />

      <Body
        style={{
          backgroundColor: "#f9fafb",
          fontFamily: "sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <Heading
            style={{
              color: "#1e3a8a",
              fontSize: "24px",
            }}
          >
            Order Update
          </Heading>

          <Text
            style={{
              color: "#374151",
              fontSize: "16px",
            }}
          >
            Hello {customerName || "Customer"},
          </Text>

          <Text
            style={{
              color: "#374151",
              fontSize: "16px",
            }}
          >
            {statusMessages[status] ||
              "There has been an update to your order."}
          </Text>

          <Section
            style={{
              backgroundColor: "#f3f4f6",
              padding: "20px",
              borderRadius: "8px",
              margin: "24px 0",
            }}
          >
            <Heading
              as="h3"
              style={{
                marginTop: 0,
                color: "#374151",
                fontSize: "18px",
              }}
            >
              Order Details
            </Heading>

            <Text
              style={{
                margin: "8px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Reference:</strong> {orderReference}
            </Text>

            <Text
              style={{
                margin: "8px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Status:</strong> {formattedStatus.toUpperCase()}
            </Text>

            <Text
              style={{
                margin: "8px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Total:</strong> ₦{total.toLocaleString()}
            </Text>
          </Section>

          <Section
            style={{
              textAlign: "center",
              margin: "32px 0",
            }}
          >
            <a
              href={accountUrl}
              style={{
                display: "inline-block",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              View My Orders
            </a>
          </Section>

          <Hr
            style={{
              borderColor: "#e5e7eb",
              margin: "24px 0",
            }}
          />

          <Text
            style={{
              color: "#9ca3af",
              fontSize: "12px",
            }}
          >
            This is an automated message from Fourthview Trading Company.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
