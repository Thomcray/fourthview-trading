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

export function BookingRequestEmail({
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
  const adminUrl = `${baseUrl}/admin/orders-request?tab=requests`;

  const formattedVisitDate = visitDate
    ? new Date(visitDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not specified";

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
            New Booking Request
          </Heading>

          <Text
            style={{
              color: "#374151",
              fontSize: "16px",
            }}
          >
            A new booking request has been submitted and requires your
            attention.
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
              <strong>Name:</strong> {firstName} {lastName}
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
              <strong>Phone:</strong> {phone}
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
              Booking Details
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Booking ID:</strong> #{bookingId}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Purpose:</strong> {purpose}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Visit Date:</strong> {formattedVisitDate}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Status:</strong> PENDING
            </Text>
          </Section>

          {(factoryName || factoryAddress) && (
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
                Factory Details
              </Text>

              <Text
                style={{
                  margin: "6px 0",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <strong>Factory:</strong> {factoryName || "N/A"}
              </Text>

              <Text
                style={{
                  margin: "6px 0",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <strong>Address:</strong> {factoryAddress || "N/A"}
              </Text>
            </Section>
          )}

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
              Review Booking
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
            This is an automated booking notification from Fourthview Trading
            Company.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
