// app/_lib/api.ts
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
