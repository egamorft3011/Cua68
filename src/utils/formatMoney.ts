export function formatCurrency(
  amount: number,
  locale = "vi",
  currency = "VND"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // Không có chữ số sau dấu phẩy
    maximumFractionDigits: 0, // Không có chữ số sau dấu phẩy
  }).format(amount);
}
export function formatShortMoney(amount: number): string {
  if (amount < 1000) return amount.toString();
  if (amount < 1000000) return `${(amount / 1000).toFixed(0)}k`;
  if (amount < 1000000000) return `${(amount / 1_000_000).toFixed(0)}m`;
  return `${(amount / 1000000000).toFixed(0)}b`;
}