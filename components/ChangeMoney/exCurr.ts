export type ExCurr = {
  from: string;
  to: string;
  rate: number;
  available: boolean;
};

const exchangerates: ExCurr[] = [
  { from: "Naira", to: "Yuan", rate: 0, available: true },
  { from: "Yuan", to: "Naira", rate: 0, available: true },
  { from: "USDT", to: "Yuan", rate: 0, available: true },
  { from: "Yuan", to: "USDT", rate: 0, available: true },
];

export default exchangerates;
