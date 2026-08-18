export const formatPKR = (amount) => {
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};

export const calculateDiscount = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};
