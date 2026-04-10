function handleDiscount(amount: number, value: number): number {
  const calc = (value * amount) / 100;

  const newAmount = amount - calc;

  return newAmount;
}

export default handleDiscount;
