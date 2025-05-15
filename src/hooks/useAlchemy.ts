import { useState, useEffect } from 'react';
import { ethAlchemy, getEthBalance, getTokenBalances, getTransactionHistory } from '../services/alchemy';
import { useWalletStore } from '../store/walletStore';

export const useAlchemy = () => {
  const { address } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [ethBalance, tokenBalances] = await Promise.all([
        getEthBalance(address),
        getTokenBalances(address)
      ]);

      // Process and update balances in store
      // Implementation will be added in walletStore.ts

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balances');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const transactions = await getTransactionHistory(address);

      // Process and update transactions in store
      // Implementation will be added in walletStore.ts

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_ALCHEMY_SOCKET_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Subscribe to relevant events
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle real-time updates
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
    };

    return () => {
      ws.close();
    };
  }, []);

  return {
    isLoading,
    error,
    fetchBalances,
    fetchTransactions
  };
};