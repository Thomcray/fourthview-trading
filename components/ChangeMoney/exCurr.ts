type ExCurr = {
  from: string;
  to: string;
  rate: number;
  available: boolean;
};

const exchangerates: ExCurr[] = [
  { from: "Naira", to: "Yuan", rate: 242, available: false },
  { from: "Yuan", to: "Naira", rate: 242, available: true },
  { from: "Yuan", to: "USDT", rate: 242, available: true },
  { from: "USDT", to: "Yuan", rate: 242, available: false },
  { from: "Dollar", to: "Yuan", rate: 242, available: false },
  { from: "Yuan", to: "Dollar", rate: 242, available: true },
];

export default exchangerates;
