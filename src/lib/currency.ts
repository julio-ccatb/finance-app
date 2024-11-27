export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "DOP",
    currencyDisplay: "narrowSymbol",
    // style: "unit",
    // unit: "pound",
  }).format(amount);
};
