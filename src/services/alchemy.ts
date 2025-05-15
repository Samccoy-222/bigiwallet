import { Alchemy, Network } from 'alchemy-sdk';
import { Connection } from '@solana/web3.js';

// Ethereum Alchemy configuration
const ethConfig = {
  apiKey: import.meta.env.VITE_ALCHEMY_ETH_KEY,
  network: Network.ETH_SEPOLIA,
};

// Initialize Ethereum Alchemy SDK
export const ethAlchemy = new Alchemy(ethConfig);

// Initialize Solana connection
export const solanaConnection = new Connection(
  `${import.meta.env.VITE_ALCHEMY_SOL_URL}${import.meta.env.VITE_ALCHEMY_SOL_API_KEY}`
);

// WebSocket connection for real-time updates
export const wsUrl = `${import.meta.env.VITE_ALCHEMY_SOCKET_URL}${import.meta.env.VITE_ALCHEMY_ETH_KEY}`;

// Function to get ETH balance
export const getEthBalance = async (address: string) => {
  const balance = await ethAlchemy.core.getBalance(address);
  return balance;
};

// Function to get token balances
export const getTokenBalances = async (address: string) => {
  const balances = await ethAlchemy.core.getTokenBalances(address);
  return balances;
};

// Function to get token metadata
export const getTokenMetadata = async (address: string) => {
  const metadata = await ethAlchemy.core.getTokenMetadata(address);
  return metadata;
};

// Function to get latest block
export const getLatestBlock = async () => {
  const block = await ethAlchemy.core.getBlock('latest');
  return block;
};

// Function to get transaction history
export const getTransactionHistory = async (address: string) => {
  const transactions = await ethAlchemy.core.getAssetTransfers({
    fromBlock: '0x0',
    toAddress: address,
    category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
  });
  return transactions;
};

// Function to get gas price
export const getGasPrice = async () => {
  const gasPrice = await ethAlchemy.core.getGasPrice();
  return gasPrice;
};