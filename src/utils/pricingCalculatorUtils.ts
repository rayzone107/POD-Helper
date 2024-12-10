export const roundTo99Cents = (price: number): number => {
  const onesDigit = Math.floor(price) % 10;

  // If the price already ends in .99, return it as is
  if (price % 1 === 0.99) {
    return price;
  }

  // If the ones digit is 0, round down
  if (onesDigit === 0) {
    return Math.floor(price) - 0.01;
  }

  // Otherwise, round up
  return Math.floor(price) + 0.99;
};
