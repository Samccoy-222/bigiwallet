import {
  Token,
  Transaction,
  MarketData,
  TimeFrame,
  PriceData,
} from "../types/wallet";

// Mock tokens data
export const mockTokens: Token[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    balance: 0.5,
    price: 65000,
    priceChange24h: 2.3,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    balance: 4.2,
    price: 3500,
    priceChange24h: -1.1,
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    logo: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    balance: 1000,
    price: 0.5,
    priceChange24h: 5.6,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
    balance: 30,
    price: 140,
    priceChange24h: 12.5,
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
    balance: 200,
    price: 7.2,
    priceChange24h: -3.2,
  },
];

// Mock transactions data
export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    type: "receive",
    amount: 0.1,
    token: "BTC",
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    address: "0xabcd...1234",
    status: "completed",
    hash: "0x1a2b3c4d5e6f7g8h9i0j",
  },
  {
    id: "tx-2",
    type: "send",
    amount: 1.5,
    token: "ETH",
    timestamp: Date.now() - 3600000 * 24, // 24 hours ago
    address: "0xefgh...5678",
    status: "completed",
    fee: 0.002,
    hash: "0x2b3c4d5e6f7g8h9i0j1",
  },
  {
    id: "tx-3",
    type: "receive",
    amount: 100,
    token: "ADA",
    timestamp: Date.now() - 3600000 * 48, // 48 hours ago
    address: "0xijkl...9012",
    status: "completed",
    hash: "0x3c4d5e6f7g8h9i0j1k2",
  },
  {
    id: "tx-4",
    type: "send",
    amount: 5,
    token: "SOL",
    timestamp: Date.now() - 3600000 * 72, // 72 hours ago
    address: "0xmnop...3456",
    status: "completed",
    fee: 0.00001,
    hash: "0x4d5e6f7g8h9i0j1k2l3",
  },
  {
    id: "tx-5",
    type: "receive",
    amount: 20,
    token: "DOT",
    timestamp: Date.now() - 3600000 * 96, // 96 hours ago
    address: "0xqrst...7890",
    status: "completed",
    hash: "0x5e6f7g8h9i0j1k2l3m4",
  },
];

// Mock market data
export const mockMarketData: MarketData[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 65000,
    marketCap: 1250000000000,
    volume24h: 35000000000,
    priceChange24h: 2.3,
    priceHistory: generatePriceHistory(65000),
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 3500,
    marketCap: 420000000000,
    volume24h: 20000000000,
    priceChange24h: -1.1,
    priceHistory: generatePriceHistory(3500),
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    price: 0.5,
    marketCap: 17500000000,
    volume24h: 1000000000,
    priceChange24h: 5.6,
    priceHistory: generatePriceHistory(0.5),
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 140,
    marketCap: 58000000000,
    volume24h: 3500000000,
    priceChange24h: 12.5,
    priceHistory: generatePriceHistory(140),
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    price: 7.2,
    marketCap: 8900000000,
    volume24h: 800000000,
    priceChange24h: -3.2,
    priceHistory: generatePriceHistory(7.2),
  },
];

// Helper function to generate mock price history data
function generatePriceHistory(
  currentPrice: number
): { timestamp: number; price: number }[] {
  const priceHistory = [];
  const now = Date.now();

  // Generate data for the last 7 days, 24 data points
  for (let i = 0; i < 24; i++) {
    const timestamp = now - (24 - i) * 3600000; // Every hour for 24 hours
    let volatility = 0.03; // 3% volatility
    const change = currentPrice * volatility * (Math.random() - 0.5);
    const price = currentPrice + change * (i / 24);

    priceHistory.push({
      timestamp,
      price: Number(price.toFixed(2)),
    });
  }

  return priceHistory;
}

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
  return `${amount.toFixed(8)} ${symbol}`;
};

// Format date
export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format time
export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date and time
export const formatDateTime = (timestamp: number) => {
  return `${formatDate(timestamp)} at ${formatTime(timestamp)}`;
};

const generatePriceData = (
  days: number,
  startValue: number,
  volatility: number
): PriceData[] => {
  const data: PriceData[] = [];
  const now = Date.now();
  const millisecondsPerDay = 86400000;
  let price = startValue;

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * millisecondsPerDay;
    // Add some random fluctuation
    const change = (Math.random() - 0.5) * volatility;
    price = Math.max(price * (1 + change), 0);
    data.push({ timestamp, price });
  }

  return data;
};

export const mockPriceData: Record<TimeFrame, PriceData[]> = {
  "24h": generatePriceData(1, 55000, 0.01),
  "7d": generatePriceData(7, 52000, 0.03),
  "1m": generatePriceData(30, 48000, 0.05),
  "3m": generatePriceData(90, 42000, 0.1),
  "1y": generatePriceData(365, 35000, 0.2),
};
