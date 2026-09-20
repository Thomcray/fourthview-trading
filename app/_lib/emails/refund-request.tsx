import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Hr,
} from "@react-email/components";

export function RefundRequestEmail({
  orderId,
  orderReference,
  customerName,
  customerEmail,
  amount,
  reason,
  evidenceCount,
  baseUrl,
}: {
  orderId: number;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  reason: string;
  evidenceCount: number;
  baseUrl: string;
}) {
  const adminUrl = `${baseUrl}/admin/orders-request?tab=refunds`;

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <Heading style={{ color: "#1e3a8a", fontSize: "24px" }}>
            New Refund Request
          </Heading>

          <Text style={{ color: "#374151", fontSize: "16px" }}>
            A customer has submitted a refund request that requires review.
          </Text>

          <Section
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              margin: "24px 0",
            }}
          >
            <Text
              style={{
                margin: "0 0 12px",
                color: "#374151",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Customer Details
            </Text>

            <Text
              style={{ margin: "6px 0", color: "#374151", fontSize: "14px" }}
            >
              <strong>Name:</strong> {customerName || "N/A"}
            </Text>

            <Text
              style={{ margin: "6px 0", color: "#374151", fontSize: "14px" }}
            >
              <strong>Email:</strong> {customerEmail}
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              margin: "24px 0",
            }}
          >
            <Text
              style={{
                margin: "0 0 12px",
                color: "#374151",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Order Details
            </Text>

            <Text
              style={{ margin: "6px 0", color: "#374151", fontSize: "14px" }}
            >
              <strong>Order ID:</strong> #{orderId}
            </Text>

            <Text
              style={{ margin: "6px 0", color: "#374151", fontSize: "14px" }}
            >
              <strong>Reference:</strong> {orderReference}
            </Text>

            <Text
              style={{ margin: "6px 0", color: "#374151", fontSize: "14px" }}
            >
              <strong>Refund Amount:</strong> ₦{amount.toLocaleString()}
            </Text>

            <Text
              style={{ margin: "6px 0", color: "#374151", fontSize: "14px" }}
            >
              <strong>Evidence Files:</strong> {evidenceCount}
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#fef3c7",
              borderLeft: "4px solid #d97706",
              padding: "16px",
              borderRadius: "4px",
              margin: "24px 0",
            }}
          >
            <Text
              style={{
                margin: "0 0 8px",
                color: "#92400e",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Reason for Refund
            </Text>

            <Text
              style={{
                margin: 0,
                color: "#78350f",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
              }}
            >
              {reason}
            </Text>
          </Section>

          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={adminUrl}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              Review Refund Requests
            </Button>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Text style={{ color: "#9ca3af", fontSize: "12px" }}>
            This is an automated refund notification from Fourthview Trading
            Company.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
