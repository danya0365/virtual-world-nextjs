/**
 * Wallet Store - Zustand store for currency management
 * Handles wallet state, transactions, and currency operations
 */

import {
    calculateExchange,
    CurrencyType,
    Transaction,
    TransactionType,
    Wallet,
} from '@/src/domain/entities/Currency';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  wallet: Wallet;
  transactions: Transaction[];
  
  // Getters
  getBalance: (currency: CurrencyType) => number;
  canAfford: (currency: CurrencyType, amount: number) => boolean;
  
  // Mutations
  addCurrency: (currency: CurrencyType, amount: number, description: string, type?: TransactionType) => void;
  spendCurrency: (currency: CurrencyType, amount: number, description: string) => boolean;
  exchangeCurrency: (from: CurrencyType, to: CurrencyType, amount: number) => boolean;
  
  // Admin/Testing
  setBalance: (currency: CurrencyType, amount: number) => void;
  resetWallet: () => void;
  
  // Transaction history
  getTransactionHistory: (limit?: number) => Transaction[];
  clearTransactionHistory: () => void;
}

const DEFAULT_WALLET: Wallet = {
  gems: 100,
  coins: 5000,
  tickets: 3,
  tokens: 0,
  crystals: 10,
};

function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallet: { ...DEFAULT_WALLET },
      transactions: [],

      getBalance: (currency) => {
        return get().wallet[currency] || 0;
      },

      canAfford: (currency, amount) => {
        return get().wallet[currency] >= amount;
      },

      addCurrency: (currency, amount, description, type = 'reward') => {
        set((state) => {
          const newBalance = state.wallet[currency] + amount;
          const transaction: Transaction = {
            id: generateTransactionId(),
            type,
            currency,
            amount,
            balanceAfter: newBalance,
            description,
            timestamp: new Date(),
          };

          return {
            wallet: {
              ...state.wallet,
              [currency]: newBalance,
            },
            transactions: [transaction, ...state.transactions].slice(0, 100), // Keep last 100
          };
        });
      },

      spendCurrency: (currency, amount, description) => {
        const state = get();
        if (!state.canAfford(currency, amount)) {
          return false;
        }

        set((state) => {
          const newBalance = state.wallet[currency] - amount;
          const transaction: Transaction = {
            id: generateTransactionId(),
            type: 'spend',
            currency,
            amount: -amount,
            balanceAfter: newBalance,
            description,
            timestamp: new Date(),
          };

          return {
            wallet: {
              ...state.wallet,
              [currency]: newBalance,
            },
            transactions: [transaction, ...state.transactions].slice(0, 100),
          };
        });

        return true;
      },

      exchangeCurrency: (from, to, amount) => {
        const state = get();
        if (!state.canAfford(from, amount)) {
          return false;
        }

        const exchangedAmount = calculateExchange(from, to, amount);
        if (exchangedAmount <= 0) {
          return false;
        }

        set((state) => {
          const newFromBalance = state.wallet[from] - amount;
          const newToBalance = state.wallet[to] + exchangedAmount;

          const transactionSpend: Transaction = {
            id: generateTransactionId(),
            type: 'exchange',
            currency: from,
            amount: -amount,
            balanceAfter: newFromBalance,
            description: `แลก ${amount} ${from} เป็น ${exchangedAmount} ${to}`,
            timestamp: new Date(),
          };

          const transactionReceive: Transaction = {
            id: generateTransactionId(),
            type: 'exchange',
            currency: to,
            amount: exchangedAmount,
            balanceAfter: newToBalance,
            description: `ได้รับ ${exchangedAmount} ${to} จากการแลก ${amount} ${from}`,
            timestamp: new Date(),
          };

          return {
            wallet: {
              ...state.wallet,
              [from]: newFromBalance,
              [to]: newToBalance,
            },
            transactions: [transactionReceive, transactionSpend, ...state.transactions].slice(0, 100),
          };
        });

        return true;
      },

      setBalance: (currency, amount) => {
        set((state) => ({
          wallet: {
            ...state.wallet,
            [currency]: Math.max(0, amount),
          },
        }));
      },

      resetWallet: () => {
        set({
          wallet: { ...DEFAULT_WALLET },
          transactions: [],
        });
      },

      getTransactionHistory: (limit = 20) => {
        return get().transactions.slice(0, limit);
      },

      clearTransactionHistory: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: 'vw-wallet',
    }
  )
);

export default useWalletStore;
