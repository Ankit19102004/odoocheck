/**
 * Format currency amount in Indian Rupees (INR)
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string with ₹ symbol
 */
export const formatCurrency = (amount: number, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}): string => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showSymbol = true,
  } = options || {};

  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);

  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Format currency for display in forms (without symbol)
 */
export const formatCurrencyInput = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

