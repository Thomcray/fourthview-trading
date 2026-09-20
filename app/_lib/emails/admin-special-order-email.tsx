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

interface SpecialOrderEmailProps {
  specialOrderId: number;
  email: string;
  whatsapp: string;
  description: string;
  depositAmount: number;
  depositReference: string;
  imageCount: number;
  baseUrl: string;
}

export function AdminSpecialOrderEmail({
  specialOrderId,
  email,
  whatsapp,
  description,
  depositAmount,
  depositReference,
  imageCount,
  baseUrl,
}: SpecialOrderEmailProps) {
  const adminUrl = `${baseUrl}/admin/orders-request?tab=special`;

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
            New Special Order
          </Heading>

          <Text
            style={{
              color: "#374151",
              fontSize: "16px",
            }}
          >
            A new special order has been placed and requires your attention.
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
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Special Order ID:</strong> #{specialOrderId}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Email:</strong> {email}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>WhatsApp:</strong> {whatsapp}
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#eff6ff",
              padding: "16px",
              borderRadius: "8px",
              margin: "24px 0",
            }}
          >
            <Text
              style={{
                margin: "0 0 12px",
                color: "#1e3a8a",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Order Details
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              <strong>Description:</strong>
              <br />
              {description}
            </Text>

            <Text
              style={{
                margin: "12px 0 6px",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Reference Images:</strong> {imageCount}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Deposit:</strong> ₦{depositAmount.toLocaleString()}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Deposit Status:</strong> PAID
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Payment Reference:</strong> {depositReference}
            </Text>
          </Section>

          <Section
            style={{
              textAlign: "center",
              margin: "32px 0",
            }}
          >
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
              Review Special Order
            </Button>
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
            This is an automated special-order notification from Fourthview
            Trading Company.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
