export const fetchDashboard = async () => {
  const res = await fetch("/api/admin/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
};

export const fetchCustomers = async () => {
  const res = await fetch("/api/admin/customers");
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
};

export const fetchCustomer = async (id: string) => {
  const res = await fetch(`/api/admin/customers/${id}`);
  if (!res.ok) throw new Error("Failed to fetch customer");
  return res.json();
};

export const fetchBookings = async () => {
  const res = await fetch("/api/bookings");
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
};

export const fetchOrders = async ({
  cursor,
  limit = 10,
  search = "",
  status = "all",
}: {
  cursor?: string | null;
  limit?: number;
  search?: string;
  status?: string;
} = {}) => {
  const params = new URLSearchParams();

  if (cursor) {
    params.append("cursor", cursor);
  }

  params.append("limit", String(limit));

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (status && status !== "all") {
    params.append("status", status);
  }

  const res = await fetch(`/api/admin/orders?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
};

export const fetchAnalytics = async (
  range: "today" | "week" | "month" | "year" | "all",
) => {
  const params = new URLSearchParams({
    range,
  });

  const res = await fetch(`/api/admin/analytics?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  return res.json();
};

export const fetchOrderById = async (id: string) => {
  const res = await fetch(`/api/orders/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
};

export const fetchCart = async () => {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};

export const fetchExchangeRate = async () => {
  const res = await fetch("/api/exchange-rate");
  if (!res.ok) throw new Error("Failed to fetch exchange rate");
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export async function fetchExchangeTransactions() {
  const res = await fetch("/api/exchange-transactions");
  if (!res.ok) throw new Error("Failed to fetch exchange transactions");
  return res.json();
}

export const fetchRefunds = async () => {
  const res = await fetch("/api/refunds");
  if (!res.ok) throw new Error("Failed to fetch refunds");
  return res.json();
};

// Create refund
export const createRefund = async (refundData: {
  orderId: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  amount: number;
  reason: string;
  refundMethod: string;
  originalTotal: number;
}) => {
  const res = await fetch("/api/refunds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(refundData),
  });
  if (!res.ok) throw new Error("Failed to create refund");
  return res.json();
};

// Update refund status
export const updateRefundStatus = async (refundId: number, status: string) => {
  const res = await fetch(`/api/refunds/${refundId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update refund status");
  return res.json();
};
