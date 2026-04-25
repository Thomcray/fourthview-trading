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

const statusLabels: Record<string, string> = {
  pending: "Pending Review",
  reviewing: "Under Review",
  documents_received: "Documents Received",
  approved: "Approved",
  rejected: "Rejected",
};

const statusColors: Record<string, string> = {
  pending: "#d97706",
  reviewing: "#2563eb",
  documents_received: "#7c3aed",
  approved: "#16a34a",
  rejected: "#dc2626",
};

export function ApplicationConfirmationEmail({
  fullName,
  applicationId,
  baseUrl,
}: {
  fullName: string;
  applicationId: number;
  baseUrl: string;
}) {
  const statusUrl = `${baseUrl}/application-status/${applicationId}`;

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}
        >
          <Heading style={{ color: "#1e3a8a", fontSize: "24px" }}>
            Application Received!
          </Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Hi {fullName},
          </Text>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            We've received your study in China application. Our team will review
            it and get back to you within 48 hours.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={statusUrl}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              Track Your Application
            </Button>
          </Section>
          <Text style={{ color: "#6b7280", fontSize: "14px" }}>
            Your application ID is <strong>#{applicationId}</strong>. You can
            use this to track your status at any time.
          </Text>
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
          <Text style={{ color: "#9ca3af", fontSize: "12px" }}>
            If you have any questions, reply to this email or contact us on
            WhatsApp.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function ApplicationStatusUpdateEmail({
  fullName,
  applicationId,
  status,
  adminNote,
  baseUrl,
}: {
  fullName: string;
  applicationId: number;
  status: string;
  adminNote?: string;
  baseUrl: string;
}) {
  const statusUrl = `${baseUrl}/application-status/${applicationId}`;
  const statusLabel = statusLabels[status] || status;
  const statusColor = statusColors[status] || "#2563eb";

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}
        >
          <Heading style={{ color: "#1e3a8a", fontSize: "24px" }}>
            Application Status Update
          </Heading>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Hi {fullName},
          </Text>
          <Text style={{ color: "#374151", fontSize: "16px" }}>
            Your study in China application status has been updated.
          </Text>
          <Section
            style={{
              backgroundColor: "#f3f4f6",
              borderLeft: `4px solid ${statusColor}`,
              padding: "16px",
              borderRadius: "4px",
              margin: "24px 0",
            }}
          >
            <Text style={{ margin: 0, color: "#374151", fontSize: "14px" }}>
              New Status
            </Text>
            <Text
              style={{
                margin: "4px 0 0",
                color: statusColor,
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {statusLabel}
            </Text>
            {adminNote && (
              <>
                <Hr style={{ borderColor: "#e5e7eb", margin: "12px 0" }} />
                <Text style={{ margin: 0, color: "#374151", fontSize: "14px" }}>
                  Note from our team:
                </Text>
                <Text
                  style={{
                    margin: "4px 0 0",
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  {adminNote}
                </Text>
              </>
            )}
          </Section>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={statusUrl}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              View Application
            </Button>
          </Section>
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
          <Text style={{ color: "#9ca3af", fontSize: "12px" }}>
            Application ID: #{applicationId}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
