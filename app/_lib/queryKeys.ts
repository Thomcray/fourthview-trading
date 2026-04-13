export const queryKeys = {
  cart: ["cart"],
  orders: ["orders"],
  refunds: ["refunds"],
  bookings: ["bookings"],
  dashboard: ["dashboard"],
  customers: ["customers"],
  categories: ["categories"],
  exchangeRate: ["exchange-rate"],
  customer: (id: string) => ["customers", id],
};
