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

type OrderItem = {
  itemName: string;
  quantity: number;
  price: number;
};

type ShippingAddress = {
  streetAddress?: string;
  apartment?: string;
  city?: string;
  zipCode?: string;
  country?: string;
};

export function NewOrderEmail({
  orderId,
  orderReference,
  total,
  items,
  shippingAddress,
  baseUrl,
}: {
  orderId: number;
  orderReference: string;
  total: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress | null;
  baseUrl: string;
}) {
  const adminUrl = `${baseUrl}/admin/orders/${orderId}`;

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
            New Order Received
          </Heading>

          <Text
            style={{
              color: "#374151",
              fontSize: "16px",
            }}
          >
            A new order has been successfully placed and paid for.
          </Text>

          {/* Order Details */}
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
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Order ID:</strong> #{orderId}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Reference:</strong> {orderReference}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Total:</strong> ₦{total.toLocaleString()}
            </Text>

            <Text
              style={{
                margin: "6px 0",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              <strong>Status:</strong> PAID
            </Text>
          </Section>

          {/* Shipping Address */}
          {shippingAddress && (
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
                Shipping Address
              </Text>

              <Text
                style={{
                  margin: "6px 0",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                {shippingAddress.streetAddress || "N/A"}
                {shippingAddress.apartment
                  ? `, ${shippingAddress.apartment}`
                  : ""}
              </Text>

              <Text
                style={{
                  margin: "6px 0",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                {shippingAddress.city || "N/A"}
                {shippingAddress.zipCode ? `, ${shippingAddress.zipCode}` : ""}
              </Text>

              <Text
                style={{
                  margin: "6px 0",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                {shippingAddress.country || "N/A"}
              </Text>
            </Section>
          )}

          {/* Order Items */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              margin: "24px 0",
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                margin: 0,
                padding: "16px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Order Items
            </Text>

            {items.map((item, index) => (
              <Section
                key={`${item.itemName}-${index}`}
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <Text
                  style={{
                    margin: "0 0 4px",
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {item.itemName}
                </Text>

                <Text
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Quantity: {item.quantity} · Price: ¥
                  {item.price.toLocaleString()}
                </Text>
              </Section>
            ))}
          </Section>

          {/* Admin Button */}
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
              View Order
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
            This is an automated order notification from Fourthview Trading
            Company.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
