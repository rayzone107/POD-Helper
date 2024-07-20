export const roundTo99Cents = (price: number): number => {
  const integerPart = Math.floor(price);
  const decimalPart = price - integerPart;

  if (integerPart % 10 === 0 || integerPart % 10 === 1) {
    if (decimalPart <= 0.75) {
      return integerPart - 0.01;
    } else {
      return integerPart + 0.99;
    }
  } else {
    if (decimalPart <= 0.20) {
      return integerPart - 0.01;
    } else {
      return integerPart + 0.99;
    }
  }
};
