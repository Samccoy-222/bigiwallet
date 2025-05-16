export interface Token {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  balance: number;
  price: number;
  priceChange24h: number;
}

export interface Transaction {
  id: string;
  type: "send" | "receive";
  amount: number;
  token: string;
  timestamp: number;
  address: string;
  status: "pending" | "completed" | "failed";
  fee?: number;
  hash?: string;
}

export type Currency = "USD" | "EUR";

export interface WalletState {
  currency: Currency;
  tokens: Token[];
  transactions: Transaction[];
  totalBalance: number;
  address: string;
  isUnlocked: boolean;
  selectedToken: string | null;
}

export interface PriceData {
  timestamp: number;
  price: number;
}

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  priceHistory: PriceData[];
}

export type TimeFrame = "24h" | "7d" | "1m" | "3m" | "1y";
