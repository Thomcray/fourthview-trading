export const queryKeys = {
  dashboard: ["dashboard"],
  customers: ["customers"],
  customer: (id: string) => ["customers", id],
  bookings: ["bookings"],
  orders: ["orders"],
  cart: ["cart"],
  exchangeRate: ["exchange-rate"],
};
