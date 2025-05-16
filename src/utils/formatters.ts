// Format number as currency
export const formatCurrency = (value: number, digits = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

// Format crypto amount
export const formatCrypto = (amount: number, symbol: string) => {
  return `${amount.toFixed(amount < 0.01 ? 8 : 4)} ${symbol}`;
};

// Abbreviate large numbers
export const abbreviateNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toString();
};

// Format wallet address to show only first and last few characters
export const formatAddress = (address: string, start = 4, end = 4): string => {
  if (!address) return "";
  if (address.length <= start + end) return address;
  return `${address.substring(0, start)}...${address.substring(
    address.length - end
  )}`;
};

// Format date
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format time
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date and time
export const formatDateTime = (timestamp: number): string => {
  return `${formatDate(timestamp)} at ${formatTime(timestamp)}`;
};

// Format percentage
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};
