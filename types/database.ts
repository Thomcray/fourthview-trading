export type ExchangeSettings = {
  id: string;
  rateMargin: number;
  autoUpdate: boolean;
  updateInterval: number;
  updatedAt: string;
  updatedBy: string | null;
};

export type ExchangeRates = {
  NGN: number;
  GHS: number;
  USD: number;
  EUR: number;
  GBP: number;
  CAD: number;
  AUD: number;
  CNY: number;
};
