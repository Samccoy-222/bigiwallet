import { create } from 'zustand';
import { WalletState, Token, Transaction } from '../types/wallet';
import { mockTokens, mockTransactions } from '../utils/mockData';

interface WalletStore extends WalletState {
  unlockWallet: (password: string) => void;
  lockWallet: () => void;
  selectToken: (tokenId: string | null) => void;
  sendTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => void;
  refreshBalances: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  tokens: mockTokens,
  transactions: mockTransactions,
  totalBalance: mockTokens.reduce((sum, token) => sum + token.balance * token.price, 0),
  address: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
  isUnlocked: true, // For demo purposes, the wallet starts unlocked
  selectedToken: null,
  
  unlockWallet: (password: string) => {
    // In a real app, this would verify the password
    console.log(`Unlocking wallet with password: ${password}`);
    set({ isUnlocked: true });
  },
  
  lockWallet: () => {
    set({ isUnlocked: false });
  },
  
  selectToken: (tokenId: string | null) => {
    set({ selectedToken: tokenId });
  },
  
  sendTransaction: (transaction) => {
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      status: 'pending',
      ...transaction,
    };
    
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));
    
    // Simulate transaction confirmation after 2 seconds
    setTimeout(() => {
      set((state) => ({
        transactions: state.transactions.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'completed' } 
            : tx
        ),
        tokens: state.tokens.map(token => 
          token.symbol === transaction.token
            ? { ...token, balance: token.balance - (transaction.type === 'send' ? transaction.amount : -transaction.amount) }
            : token
        ),
      }));
      
      // Update total balance
      const totalBalance = get().tokens.reduce((sum, token) => sum + token.balance * token.price, 0);
      set({ totalBalance });
      
    }, 2000);
  },
  
  refreshBalances: () => {
    // In a real app, this would fetch updated balances from a blockchain API
    const updatedTokens = get().tokens.map(token => ({
      ...token,
      price: token.price * (1 + (Math.random() * 0.06 - 0.03)), // Random price change ±3%
    }));
    
    const totalBalance = updatedTokens.reduce((sum, token) => sum + token.balance * token.price, 0);
    
    set({
      tokens: updatedTokens,
      totalBalance
    });
  }
}));