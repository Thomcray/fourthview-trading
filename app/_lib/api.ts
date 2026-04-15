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

export const fetchOrders = async () => {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
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
