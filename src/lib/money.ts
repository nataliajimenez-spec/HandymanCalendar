export function formatMoney(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("es-PR", {
    style: "currency",
    currency: "USD",
  }).format(n);
}
