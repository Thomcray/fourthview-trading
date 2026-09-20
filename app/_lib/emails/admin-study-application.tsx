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

export function AdminStudyApplicationEmail({
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
  const adminUrl = `${baseUrl}/admin/orders-request?tab=study`;

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
            New Study Application
          </Heading>

          <Text
            style={{
              color: "#374151",
              fontSize: "16px",
            }}
          >
            A new Study in China application has been submitted and requires
            your attention.
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
              Applicant Details
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Application ID:</strong> #{applicationId}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Name:</strong> {fullName}
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
              <strong>WhatsApp:</strong> {whatsappNumber}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Country:</strong> {country}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Age:</strong> {age}
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
              Study Preferences
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>University:</strong> {preferredUniversity}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Program:</strong> {preferredProgram}
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

            {message && (
              <Text
                style={{
                  margin: "16px 0 0",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <strong>Message:</strong>
                <br />
                {message}
              </Text>
            )}
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
              Review Application
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
            This is an automated Study in China application notification from
            Fourthview Trading Company.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
